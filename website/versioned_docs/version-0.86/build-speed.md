---
id: build-speed
title: 加速你的构建阶段
---

构建你的 React Native 应用可能会非常**耗时**，并且会占用开发者几分钟的时间。
随着项目规模扩大，以及在拥有多个 React Native 开发者的大型组织中，这可能会成为一个问题。

为了缓解这种性能损耗，本页分享一些有关如何**提升构建速度**的建议。

:::info

请注意，这些建议属于高级功能，需要对原生构建工具的工作方式有一定了解。

:::

## 开发期间仅构建一个 ABI（仅限 Android）

在本地构建 Android 应用时，默认会构建全部 4 种 [Application Binary Interfaces (ABIs)](https://developer.android.com/ndk/guides/abis)：`armeabi-v7a`、`arm64-v8a`、`x86` 和 `x86_64`。

不过，如果你只是本地构建并在模拟器或真机上测试，可能并不需要把它们全部都构建出来。

这应该会让你的**原生构建时间**减少约 75%。

如果你使用 React Native CLI，可以在 `run-android` 命令中添加 `--active-arch-only` 标志。这个标志会确保从正在运行的模拟器或已连接的手机中选择正确的 ABI。要确认这种方式工作正常，你会在控制台看到类似 `info Detected architectures arm64-v8a` 的消息。

```
$ yarn react-native run-android --active-arch-only

[ ... ]
info Running jetifier to migrate libraries to AndroidX. You can disable it using "--no-jetifier" flag.
Jetifier found 1037 file(s) to forward-jetify. Using 32 workers...
info JS server already running.
info Detected architectures arm64-v8a
info Installing the app...
```

这个机制依赖于 `reactNativeArchitectures` Gradle 属性。

因此，如果你直接从命令行使用 Gradle 构建，而不通过 CLI，你可以按如下方式指定要构建的 ABI：

```
$ ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

如果你希望在 CI 上构建 Android 应用，并使用矩阵并行构建不同架构，这会很有用。

如果你愿意，也可以使用项目 [顶层目录](https://github.com/facebook/react-native/blob/19cf70266eb8ca151aa0cc46ac4c09cb987b2ceb/template/android/gradle.properties#L30-L33) 中的 `gradle.properties` 文件在本地覆盖这个值：

```
# 使用此属性来指定你想要构建的架构。
# 你也可以通过 CLI 覆盖它，使用
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

当你构建应用的**发布版本**时，不要忘记移除这些标志，因为你需要构建一个适用于所有 ABI 的 apk/app bundle，而不仅仅是你日常开发流程中使用的那个。

## 启用配置缓存（仅限 Android）

自 React Native 0.79 起，你还可以启用 Gradle 配置缓存。

当你运行 `yarn android` 进行 Android 构建时，实际上会执行一个由两个步骤组成的 Gradle 构建（[来源](https://docs.gradle.org/current/userguide/build_lifecycle.html)）：

- 配置阶段：解析所有 `.gradle` 文件。
- 执行阶段：真正执行任务，因此 Java/Kotlin 代码会被编译，等等。

现在你可以启用配置缓存，从而在后续构建中跳过配置阶段。

这在频繁修改原生代码时很有帮助，因为它能改善构建时间。

例如，这里你可以看到在原生代码发生变化后，重新构建 RN-Tester 的速度有多快：

![gradle config caching](/docs/assets/gradle-config-caching.gif)

你可以通过在 `android/gradle.properties` 文件中添加以下内容来启用 Gradle 配置缓存：

```
org.gradle.configuration-cache=true
```

有关配置缓存的更多资源，请参阅 [Gradle 官方文档](https://docs.gradle.org/current/userguide/configuration_cache.html)。

## 使用 Maven 镜像（仅限 Android）

构建 Android 应用时，你的 Gradle 构建需要从 Maven Central 和互联网上的其他仓库下载必要的依赖。

如果你的组织正在运行一个 Maven 仓库镜像，你应该考虑使用它，因为它会通过从镜像而不是互联网下载制品来加快构建速度。

你可以通过在 `android/gradle.properties` 文件中指定 `exclusiveEnterpriseRepository` 属性来配置镜像：

```diff
# 使用此属性来启用或禁用 Hermes JS 引擎。
# 如果设为 false，你将改用 JSC。
hermesEnabled=true

# 使用此属性来配置一个 Maven 企业仓库，
# 它将被专用于获取你的所有依赖。
+exclusiveEnterpriseRepository=https://my.internal.proxy.net/
```

通过设置此属性，你的构建将**仅**从你指定的仓库获取依赖，而不会从其他仓库获取。

## 使用编译器缓存

如果你经常运行原生构建（无论是 C++ 还是 Objective-C），使用**编译器缓存**可能会对你有帮助。

具体来说，你可以使用两种类型的缓存：本地编译器缓存和分布式编译器缓存。

### 本地缓存

:::info
以下说明适用于**Android 和 iOS**。
如果你只构建 Android 应用，那么可以直接继续。
如果你也在构建 iOS 应用，请遵循下面 [Xcode 特定设置](#xcode-specific-setup) 部分中的说明。
:::

我们建议使用 [**ccache**](https://ccache.dev/) 来缓存原生构建的编译结果。
Ccache 的工作方式是包装 C++ 编译器，存储编译结果，并在中间编译结果最初已被存储时跳过编译。

Ccache 在大多数操作系统的包管理器中都可用。在 macOS 上，我们可以使用 `brew install ccache` 安装 ccache。
或者，你也可以按照 [官方安装说明](https://github.com/ccache/ccache/blob/master/doc/install.md) 从源码安装。

然后你可以进行两次干净构建（例如，在 Android 上，你可以先运行 `yarn react-native run-android`，删除 `android/app/build` 文件夹，再运行一次前面的命令）。你会注意到第二次构建比第一次快得多（应该只需要几秒，而不是几分钟）。
在构建过程中，你可以通过 `ccache -s` 验证 `ccache` 是否正常工作，并检查缓存命中/未命中率

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

请注意，`ccache` 会汇总所有构建的统计信息。你可以在构建前使用 `ccache --zero-stats` 重置它们，以验证缓存命中率。

如果你需要清空缓存，可以使用 `ccache --clear`

#### Xcode 特定设置

为了确保 `ccache` 在 iOS 和 Xcode 上正常工作，你需要在 `ios/Podfile` 中启用 React Native 对 ccache 的支持。

在编辑器中打开 `ios/Podfile`，并取消注释 `ccache_enabled` 这一行。

```ruby
  post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # TODO: 取消注释下面这一行
      :ccache_enabled => true
    )
  end
```

#### 在 CI 中使用这种方法

Ccache 在 macOS 上使用 `/Users/$USER/Library/Caches/ccache` 文件夹来存储缓存。
因此，你也可以在 CI 上保存并恢复相应的文件夹，以加快构建速度。

不过，有几件事需要注意：

1. 在 CI 上，我们建议进行一次完整的干净构建，以避免污染缓存的问题。如果你遵循上一段中提到的方法，你应该能够将原生构建并行化到 4 种不同 ABI 上，而且在 CI 上很可能不需要 `ccache`。

2. `ccache` 依赖时间戳来计算缓存命中。这在 CI 上效果不佳，因为每次 CI 运行时文件都会被重新下载。为了解决这个问题，你需要使用 `compiler_check content` 选项，它改为依赖 [对文件内容进行哈希](https://ccache.dev/manual/4.3.html)。

### 分布式缓存

与本地缓存类似，你也可以考虑为原生构建使用分布式缓存。
这在进行频繁原生构建的大型组织中尤其有用。

我们建议使用 [sccache](https://github.com/mozilla/sccache) 来实现这一点。
有关如何设置和使用该工具的说明，请参考 sccache 的 [分布式编译快速入门](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md)。
