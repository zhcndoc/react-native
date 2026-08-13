---
id: build-speed
title: 加快构建阶段
---

构建 React Native 应用可能会非常**耗时**，并占用开发者几分钟的时间。
随着项目增长，尤其是在拥有多名 React Native 开发者的大型组织中，这通常会成为问题。

为了减轻这种性能影响，本页面分享了一些有关如何**缩短构建时间**的建议。

:::info

请注意，这些建议属于高级功能，需要对原生构建工具的工作方式有一定了解。

:::

## 开发期间只构建一个 ABI（仅限 Android）

在本地构建 Android 应用时，默认情况下会构建全部 4 个[应用二进制接口（ABI）](https://developer.android.com/ndk/guides/abis)：`armeabi-v7a`、`arm64-v8a`、`x86` 和 `x86_64`。

不过，如果你是在本地构建并在模拟器或实体设备上进行测试，可能不需要构建全部 ABI。

这应该可以将**原生构建时间**缩短约 75%。

如果你使用 React Native CLI，可以将 `--active-arch-only` 标志添加到 `run-android` 命令中。此标志会确保从正在运行的模拟器或已连接的手机中选取正确的 ABI。要确认此方法正常工作，你将在控制台中看到类似 `info Detected architectures arm64-v8a` 的消息。

```
$ yarn react-native run-android --active-arch-only

[ ... ]
info Running jetifier to migrate libraries to AndroidX. You can disable it using "--no-jetifier" flag.
Jetifier found 1037 file(s) to forward-jetify. Using 32 workers...
info JS server already running.
info Detected architectures arm64-v8a
info Installing the app...
```

此机制依赖于 `reactNativeArchitectures` Gradle 属性。

因此，如果你直接从命令行使用 Gradle 构建，而不使用 CLI，可以按如下方式指定要构建的 ABI：

```
$ ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

如果你希望在 CI 上构建 Android 应用，并使用矩阵并行构建不同架构，这会非常有用。

如果需要，你也可以使用项目[顶级文件夹](https://github.com/facebook/react-native/blob/19cf70266eb8ca151aa0cc46ac4c09cb987b2ceb/template/android/gradle.properties#L30-L33)中的 `gradle.properties` 文件在本地覆盖此值：

```
# Use this property to specify which architecture you want to build.
# You can also override it from the CLI using
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

构建应用的**发布版本**后，别忘了移除这些标志，因为你需要构建一个适用于所有 ABI 的 apk／app bundle，而不仅仅是适用于日常开发流程中所使用 ABI 的版本。

## 启用配置缓存（仅限 Android）

从 React Native 0.79 开始，你还可以启用 Gradle 配置缓存。

运行 `yarn android` 执行 Android 构建时，你将执行一个由两个步骤组成的 Gradle 构建（[来源](https://docs.gradle.org/current/userguide/build_lifecycle.html)）：

- 配置阶段，此时会评估所有 `.gradle` 文件
- 执行阶段，此时会实际执行任务，因此会编译 Java／Kotlin 代码等

现在，你可以启用配置缓存，这样后续构建就可以跳过配置阶段。

这在频繁修改原生代码时很有帮助，因为它可以缩短构建时间。

例如，下面展示了在原生代码发生更改后，重新构建 RN-Tester 的速度提升：

![gradle 配置缓存](/docs/assets/gradle-config-caching.gif)

你可以通过在 `android/gradle.properties` 文件中添加以下行来启用 Gradle 配置缓存：

```
org.gradle.configuration-cache=true
```

有关配置缓存的更多资源，请参阅 [Gradle 官方文档](https://docs.gradle.org/current/userguide/configuration_cache.html)。

## 使用 Maven 镜像（仅限 Android）

构建 Android 应用时，Gradle 构建需要从 Maven Central 和互联网中的其他代码仓库下载必要的依赖项。

如果你的组织正在运行 Maven 代码仓库镜像，应考虑使用它，因为从镜像而不是互联网下载构件可以加快构建速度。

你可以通过在 `android/gradle.properties` 文件中指定 `exclusiveEnterpriseRepository` 属性来配置镜像：

```diff
# Use this property to enable or disable the Hermes JS engine.
# If set to false, you will be using JSC instead.
hermesEnabled=true

# Use this property to configure a Maven enterprise repository
# that will be used exclusively to fetch all of your dependencies.
+exclusiveEnterpriseRepository=https://my.internal.proxy.net/
```

设置此属性后，构建将**仅**从你指定的代码仓库获取依赖项，而不会从其他代码仓库获取。

## 使用编译器缓存

如果你经常进行原生构建（C++ 或 Objective-C），使用**编译器缓存**可能会有所帮助。

具体来说，你可以使用两种类型的缓存：本地编译器缓存和分布式编译器缓存。

### 本地缓存

:::info
以下说明同时适用于 **Android 和 iOS**。
如果你只构建 Android 应用，完成这些步骤即可。
如果你还构建 iOS 应用，请按照下面的 [Xcode 特定设置](#xcode-specific-setup) 部分中的说明操作。
:::

我们建议使用 [**ccache**](https://ccache.dev/) 来缓存原生构建的编译过程。
Ccache 通过包装 C++ 编译器、存储编译结果，并在中间编译结果已被存储时跳过编译来工作。

大多数操作系统的软件包管理器中都提供 Ccache。在 macOS 上，可以使用 `brew install ccache` 安装 ccache。
或者，你也可以按照[官方安装说明](https://github.com/ccache/ccache/blob/master/doc/install.md)从源代码安装。

然后你可以进行两次干净构建（例如，在 Android 上，你可以先运行 `yarn react-native run-android`，删除 `android/app/build` 文件夹，然后再次运行第一个命令）。你会注意到第二次构建比第一次快得多（应该只需几秒，而不是几分钟）。
构建时，可以运行 `ccache -s` 验证 `ccache` 是否正常工作，并检查缓存命中／未命中率

```
$ ccache -s
Summary:
  Hits:             196 /  3068 (6.39 %)
    Direct:           0 /  3068 (0.00 %)
    Preprocessed:   196 /  3068 (6.39 %)
  Misses:          2872
    Direct:        3068
    Preprocessed:  2872
  Uncacheable:        1
Primary storage:
  Hits:             196 /  6136 (3.19 %)
  Misses:          5940
  Cache size (GB): 0.60 / 20.00 (3.00 %)
```

请注意，`ccache` 会汇总所有构建的统计信息。你可以在构建前使用 `ccache --zero-stats` 重置统计信息，以验证缓存命中率。

如果需要清除缓存，可以使用 `ccache --clear`

#### Xcode 特定设置

要确保 `ccache` 与 iOS 和 Xcode 正常工作，需要在 `ios/Podfile` 中启用 React Native 对 ccache 的支持。

在编辑器中打开 `ios/Podfile`，并取消注释 `ccache_enabled` 行。

```ruby
  post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # TODO: Uncomment the line below
      :ccache_enabled => true
    )
  end
```

#### 在 CI 上使用此方法

在 macOS 上，Ccache 使用 `/Users/$USER/Library/Caches/ccache` 文件夹存储缓存。
因此，你也可以在 CI 上保存和恢复相应的文件夹，以加快构建速度。

不过，需要注意以下几点：

1. 在 CI 上，我们建议进行完整的干净构建，以避免缓存污染问题。如果你按照上一段中提到的方法操作，就应该能够并行构建 4 种不同的 ABI，而且在 CI 上很可能不需要使用 `ccache`。

2. `ccache` 依赖时间戳来计算缓存命中情况。由于文件会在每次 CI 运行时重新下载，这在 CI 上无法很好地工作。要解决此问题，你需要使用 `compiler_check content` 选项，该选项改为依赖[对文件内容进行哈希处理](https://ccache.dev/manual/4.3.html)。

### 分布式缓存

与本地缓存类似，你也可以考虑为原生构建使用分布式缓存。
这对于经常进行原生构建的大型组织尤其有用。

我们建议使用 [sccache](https://github.com/mozilla/sccache) 来实现这一点。
有关如何设置和使用此工具的说明，请参阅 sccache 的[分布式编译快速入门](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md)。
