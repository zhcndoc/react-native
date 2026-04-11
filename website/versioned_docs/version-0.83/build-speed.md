---
id: build-speed
title: 加快构建阶段速度
---

构建你的 React Native 应用可能会非常**耗时**，需要占用开发者几分钟的时间。这在项目逐渐变大，或者在拥有多个 React Native 开发者的大型组织中，可能会带来问题。

为了减轻这种性能负担，本文分享了一些**提升构建速度**的建议。

:::info

请注意，这些建议属于高级功能，需要一定程度地理解本地构建工具的工作原理。

:::

## 开发时只构建一个 ABI（仅限 Android）

在本地构建你的 Android 应用时，默认会构建所有 4 个 [应用二进制接口 (ABI)](https://developer.android.com/ndk/guides/abis) ：`armeabi-v7a`，`arm64-v8a`，`x86` 和 `x86_64`。

然而，如果你只是本地构建并在模拟器或物理设备上测试，你可能不需要构建全部这些 ABI。

这样可以将你的**本地构建时间**缩短约 75%。

如果你使用 React Native CLI，可以在 `run-android` 命令中添加 `--active-arch-only` 标志。此标志会确保从正在运行的模拟器或连接的手机中识别出正确的 ABI。确认方法是在控制台看到类似 `info Detected architectures arm64-v8a` 的消息。

```
$ yarn react-native run-android --active-arch-only

[ ... ]
info Running jetifier to migrate libraries to AndroidX. You can disable it using "--no-jetifier" flag.
Jetifier found 1037 file(s) to forward-jetify. Using 32 workers...
info JS server already running.
info Detected architectures arm64-v8a
info Installing the app...
```

该机制依赖于 `reactNativeArchitectures` Gradle 属性。

因此，如果你直接用 Gradle 命令行构建且不通过 CLI，可以如下指定你要构建的 ABI：

```
$ ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

如果你希望在 CI 中构建 Android App 并用一个矩阵方式并行构建不同架构，这会非常有用。

你也可以在本地通过项目 [顶层文件夹](https://github.com/facebook/react-native/blob/19cf70266eb8ca151aa0cc46ac4c09cb987b2ceb/template/android/gradle.properties#L30-L33) 的 `gradle.properties` 文件覆盖这个值：

```
# 使用该属性指定你想要构建的架构。
# 你也可以通过 CLI 用以下命令覆盖它：
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

一旦你构建了**发布版本**的应用，别忘了移除这些标志，因为你想构建的是适用于所有 ABI 的 apk/app bundle，而不仅是你日常开发使用的那个。

## 启用配置缓存（仅限 Android）

从 React Native 0.79 开始，你可以启用 Gradle 配置缓存。

当你用 `yarn android` 运行 Android 构建时，会执行一个包含两个步骤的 Gradle 构建（[来源](https://docs.gradle.org/current/userguide/build_lifecycle.html)）：

- 配置阶段，评估所有 `.gradle` 文件。
- 执行阶段，实际执行任务，比如编译 Java/Kotlin 代码等。

你现在可以启用配置缓存，允许跳过后续构建中的配置阶段。

这对于频繁修改本地代码时尤其有益，有助于提升构建速度。

例如，下图展示了 RN-Tester 在修改本地代码后快速重建的效果：

![gradle 配置缓存](/docs/assets/gradle-config-caching.gif)

你可以在 `android/gradle.properties` 文件中添加以下内容启用 Gradle 配置缓存：

```
org.gradle.configuration-cache=true
```

详情请参考 [官方 Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html) 获取更多配置缓存相关资源。

## 使用 Maven 镜像（仅限 Android）

构建 Android 应用时，Gradle 需要从 Maven Central 及其他远程仓库下载依赖。

如果你的组织运行了 Maven 仓库镜像，建议使用它，这样可以加快构建速度，通过从镜像下载构件而不是网络下载。

你可以通过在 `android/gradle.properties` 文件中指定 `exclusiveEnterpriseRepository` 属性来配置镜像：

```diff
# 用于启用或禁用 Hermes JS 引擎。
# 如果设为 false，则使用 JSC。
hermesEnabled=true

# 配置专门的 Maven 企业仓库
# 所有依赖将只从这里获取。
+exclusiveEnterpriseRepository=https://my.internal.proxy.net/
```

设置该属性后，构建会**仅**从指定仓库获取依赖，不会从其他仓库下载。

## 使用编译器缓存

如果你频繁进行本地构建（无论是 C++ 还是 Objective-C），使用**编译器缓存**可能带来好处。

具体可以使用两种缓存：本地编译器缓存和分布式编译器缓存。

### 本地缓存

:::info
以下操作适用于**Android 和 iOS**。
如果你只构建 Android，直接使用即可。
如果你也构建 iOS，请参阅以下的 [Xcode 特定设置](#xcode-specific-setup) 部分。
:::

我们建议使用 [**ccache**](https://ccache.dev/) 来缓存本地构建的编译过程。
ccache 通过包装 C++ 编译器，保存编译结果，如果曾经保存过中间编译结果则跳过编译。

ccache 在多数操作系统的软件包管理器中都有提供。在 macOS 上，你可以用 `brew install ccache` 安装。
或者可参阅 [官方安装说明](https://github.com/ccache/ccache/blob/master/doc/install.md) 从源码安装。

你可以先做两次干净构建（例如在 Android 上，先运行 `yarn react-native run-android`，删除 `android/app/build` 文件夹，再运行一次该命令），你会发现第二次构建比第一次快得多（应该是秒级别，而非分钟）。

构建时可以通过 `ccache -s` 查看缓存命中与未命中率，从而确认其工作正常。

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

注意 `ccache` 汇总所有构建的统计。你可以用 `ccache --zero-stats` 在构建前重置统计数据，验证缓存命中率。

如需清空缓存，可执行 `ccache --clear`

#### Xcode 特定设置

为了确保 `ccache` 正常支持 iOS 和 Xcode，你需要在 `ios/Podfile` 中启用 React Native 对 ccache 的支持。

用编辑器打开 `ios/Podfile`，取消注释 `ccache_enabled` 这一行。

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

#### 在 CI 中使用此方法

ccache 在 macOS 上默认使用 `/Users/$USER/Library/Caches/ccache` 文件夹存储缓存。

因此你也可以在 CI 环境中保存并恢复该文件夹，以加速构建。

但需要注意几点：

1. 在 CI 中，我们建议执行完全干净构建以避免缓存污染问题。如果你遵循之前的 ABI 并行构建方案，通常不需要在 CI 上使用 `ccache`。

2. `ccache` 依赖文件时间戳判断缓存命中。CI 环境中每次运行都会重新下载文件，时间戳不稳定。对此，你需使用 `compiler_check content` 选项，改用 [文件内容哈希](https://ccache.dev/manual/4.3.html) 的方式判断。

### 分布式缓存

类似于本地缓存，你可能希望使用分布式缓存来加速本地构建。

这在大型组织中频繁本地构建时尤为有用。

我们推荐使用 [sccache](https://github.com/mozilla/sccache) 来实现。

关于如何设置和使用该工具，请参照 sccache 的 [分布式编译快速入门](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md)。