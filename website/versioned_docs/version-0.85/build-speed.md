---
id: build-speed
title: 加速你的构建阶段
---

构建你的 React Native 应用可能非常**耗时**，会占用开发人员几分钟的时间。
随着项目的增长，以及在拥有多个 React Native 开发人员的大型组织中，这可能会成为问题。

为了缓解这种性能影响，本页分享了一些关于如何**改进构建时间**的建议。

:::info

请注意，这些建议是高级功能，需要对原生构建工具的工作原理有一定的了解。

:::

## 在开发期间仅构建一个 ABI（仅限 Android）

当在本地构建你的 Android 应用时，默认情况下你会构建所有 4 个 [应用二进制接口 (ABIs)](https://developer.android.com/ndk/guides/abis)：`armeabi-v7a`、`arm64-v8a`、`x86` 和 `x86_64`。

但是，如果你是在本地构建并在模拟器或物理设备上测试，可能不需要构建所有它们。

这应该能将你的**原生构建时间**减少约 75%。

如果你使用的是 React Native CLI，可以向 `run-android` 命令添加 `--active-arch-only` 标志。此标志将确保从正在运行的模拟器或插入的手机中选择正确的 ABI。为了确认此方法正常工作，你将在控制台上看到类似 `info Detected architectures arm64-v8a` 的消息。

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

因此，如果你是直接使用 Gradle 从命令行构建而不使用 CLI，你可以按以下方式指定想要构建的 ABI：

```
$ ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

如果你希望在 CI 上构建 Android 应用并使用矩阵来并行构建不同的架构，这可能会很有用。

如果你愿意，也可以使用项目 [顶层文件夹](https://github.com/facebook/react-native/blob/19cf70266eb8ca151aa0cc46ac4c09cb987b2ceb/template/android/gradle.properties#L30-L33) 中的 `gradle.properties` 文件在本地覆盖此值：

```
# 使用此属性指定你想要构建的架构。
# 你也可以使用以下命令从 CLI 覆盖它
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

一旦你构建了应用的**发布版本**，别忘了移除这些标志，因为你希望构建一个适用于所有 ABI 的 apk/app bundle，而不仅仅是日常开发工作流中使用的那个。

## 启用配置缓存（仅限 Android）

自 React Native 0.79 起，你也可以启用 Gradle 配置缓存。

当你使用 `yarn android` 运行 Android 构建时，你将执行一个由两个步骤组成的 Gradle 构建（[来源](https://docs.gradle.org/current/userguide/build_lifecycle.html)）：

- 配置阶段，此时所有 `.gradle` 文件被评估。
- 执行阶段，此时任务实际被执行，因此 Java/Kotlin 代码被编译等等。

你现在可以启用配置缓存，这将允许你在后续构建中跳过配置阶段。

当频繁更改原生代码时，这很有益，因为它能改善构建时间。

例如，在这里你可以看到在原生代码更改后重新构建 RN-Tester 有多快：

![gradle 配置缓存](/docs/assets/gradle-config-caching.gif)

你可以通过在 `android/gradle.properties` 文件中添加以下行来启用 Gradle 配置缓存：

```
org.gradle.configuration-cache=true
```

请参阅 [官方 Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html) 以获取更多关于配置缓存的资源。

## 使用 Maven 镜像（仅限 Android）

构建 Android 应用时，你的 Gradle 构建需要从 Maven Central 和其他仓库从互联网下载必要的依赖项。

如果你的组织运行着 Maven 仓库镜像，你应该考虑使用它，因为它将通过从镜像而不是从互联网下载构件来加速你的构建。

你可以通过在 `android/gradle.properties` 文件中指定 `exclusiveEnterpriseRepository` 属性来配置镜像：

```diff
# 使用此属性启用或禁用 Hermes JS 引擎。
# 如果设置为 false，你将使用 JSC。
hermesEnabled=true

# 使用此属性配置一个 Maven 企业仓库
# 该仓库将专门用于获取所有依赖项。
+exclusiveEnterpriseRepository=https://my.internal.proxy.net/
```

通过设置此属性，你的构建将**专门**从你指定的仓库获取依赖项，而不是从其他仓库。

## 使用编译器缓存

如果你频繁运行原生构建（C++ 或 Objective-C），你可能会受益于使用**编译器缓存**。

具体来说，你可以使用两种类型的缓存：本地编译器缓存和分布式编译器缓存。

### 本地缓存

:::info
以下说明适用于 **Android 和 iOS**。
如果你只构建 Android 应用，你应该可以直接使用。
如果你也构建 iOS 应用，请遵循下面 [Xcode 特定设置](#xcode-specific-setup) 部分中的说明。
:::

我们建议使用 [**ccache**](https://ccache.dev/) 来缓存原生构建的编译。
Ccache 通过包装 C++ 编译器工作，存储编译结果，如果中间编译结果原本已存储，则跳过编译。

Ccache 可在大多数操作系统的包管理器中使用。在 macOS 上，我们可以使用 `brew install ccache` 安装 ccache。
或者你可以遵循 [官方安装说明](https://github.com/ccache/ccache/blob/master/doc/install.md) 从源代码安装。

然后你可以进行两次干净构建（例如，在 Android 上你可以先运行 `yarn react-native run-android`，删除 `android/app/build` 文件夹，然后再次运行第一个命令）。你会注意到第二次构建比第一次快得多（应该需要几秒钟而不是几分钟）。
构建时，你可以验证 `ccache` 是否正常工作并检查缓存命中/未命中率 `ccache -s`

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

请注意 `ccache` 会聚合所有构建的统计信息。你可以在构建前使用 `ccache --zero-stats` 重置它们以验证缓存命中率。

如果你需要清除缓存，可以使用 `ccache --clear` 完成。

#### Xcode 特定设置

为了确保 `ccache` 与 iOS 和 Xcode 正常工作，你需要在 `ios/Podfile` 中启用 React Native 对 ccache 的支持。

在编辑器中打开 `ios/Podfile` 并取消注释 `ccache_enabled` 行。

```ruby
  post_install do |installer|
    # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      # TODO: 取消注释下面的行
      :ccache_enabled => true
    )
  end
```

#### 在 CI 上使用此方法

Ccache 在 macOS 上使用 `/Users/$USER/Library/Caches/ccache` 文件夹来存储缓存。
因此，你也可以在 CI 上保存和恢复相应的文件夹以加速构建。

但是，有几件事需要注意：

1. 在 CI 上，我们建议进行完全干净构建，以避免缓存污染问题。如果你遵循上一段提到的方法，你应该能够并行化 4 个不同 ABI 的原生构建，并且很可能在 CI 上不需要 `ccache`。

2. `ccache` 依赖时间戳来计算缓存命中。这在 CI 上效果不佳，因为文件在每次 CI 运行时都会重新下载。为了克服这个问题，你需要使用 `compiler_check content` 选项，它改为依赖 [文件内容的哈希](https://ccache.dev/manual/4.3.html)。

### 分布式缓存

与本地缓存类似，你可能要考虑为原生构建使用分布式缓存。
这对于进行频繁原生构建的大型组织可能特别有用。

我们推荐使用 [sccache](https://github.com/mozilla/sccache) 来实现这一点。
我们参考 sccache [分布式编译快速入门](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md) 获取关于如何设置和使用此工具的说明。
