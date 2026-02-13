---
id: bundled-hermes
title: 内置 Hermes
---

本页面概述了 **Hermes 和 React Native 的构建方式**。

如果你想了解如何在应用中使用 Hermes 的说明，请查看此页面：[使用 Hermes](/docs/hermes)

:::caution
请注意，本页面是技术深度解析，面向在 Hermes 或 React Native 顶层开发扩展的用户。普通 React Native 用户无需深入了解 React Native 和 Hermes 如何交互。
:::

## 什么是“内置 Hermes”（Bundled Hermes）

从 React Native 0.69.0 开始，每个 React Native 版本都将 **与** 一个 Hermes 版本**一同构建**。我们称这种分发模式为 **内置 Hermes**。

从 0.69 版本起，你总是可以使用一个与 React Native 版本一同构建和测试过的 JS 引擎。

## 我们为何转向“内置 Hermes”

历史上，React Native 和 Hermes 有两个 **独立的发布流程** 和不同的版本号。不同的发布版本及版本号引起了社区混淆，因为不清楚某个 Hermes 版本是否兼容某个 React Native 版本（例如你需要知道 Hermes 0.11.0 只兼容 React Native 0.68.0 等）。

Hermes 和 React Native 共享 JSI 代码（[Hermes 代码位置](https://github.com/facebook/hermes/tree/main/API/jsi/jsi) 和 [React Native 代码位置](https://github.com/facebook/react-native/tree/main/packages/react-native/ReactCommon/jsi/jsi)）。如果两个仓库中的 JSI 版本不同步，Hermes 构建版本将无法兼容 React Native 构建版本。你可查阅更多关于此 [ABI 不兼容问题](https://github.com/react-native-community/discussions-and-proposals/issues/257)。

为了解决这个问题，我们扩展了 React Native 的发布流程以下载和构建 Hermes，确保构建 Hermes 时只使用一份 JSI 代码。

因此，我们能在发布 React Native 版本时，发布与之完全兼容的 Hermes 版本。我们把这个 Hermes 版本与 React Native 版本一起发布，所以称为 _内置 Hermes_。

## 这对应用开发者的影响

如前言所述，应用开发者不会直接受此变更影响。

以下内容描述了底层变更以及背后的考量，以便透明介绍。

### iOS 用户

在 iOS 平台上，我们移动了 `hermes-engine` 的使用方式。

在 React Native 0.69 之前，用户会下载一个 pod（这里是对应的 [podspec](https://github.com/CocoaPods/Specs/blob/master/Specs/5/d/0/hermes-engine/0.11.0/hermes-engine.podspec.json)）。

从 React Native 0.69 开始，用户将使用定义在 `react-native` NPM 包中 `sdks/hermes-engine/hermes-engine.podspec` 文件内的 podspec。
该 podspec 依赖我们在 React Native 发布流程中上传到 Maven 和 React Native GitHub Releases 的 Hermes 预构建包（见 [本次发布的资源](https://github.com/facebook/react-native/releases/tag/v0.70.4)）。

### Android 用户

在 Android 上，我们将以如下方式更新默认模板中的 [`android/app/build.gradle`](https://github.com/facebook/react-native/blob/main/template/android/app/build.gradle) 文件：

```diff
dependencies {
    // ...

    if (enableHermes) {
+       implementation("com.facebook.react:hermes-engine:+") {
+           exclude group:'com.facebook.fbjni'
+       }
-       def hermesPath = "../../node_modules/hermes-engine/android/";
-       debugImplementation files(hermesPath + "hermes-debug.aar")
-       releaseImplementation files(hermesPath + "hermes-release.aar")
    } else {
        implementation jscFlavor
    }
}
```

在 React Native 0.69 之前，用户会从 `hermes-engine` NPM 包使用 `hermes-debug.aar` 和 `hermes-release.aar`。

在 React Native 0.69 中，用户将使用包含在 `react-native` NPM 包 `android/com/facebook/react/hermes-engine/` 文件夹中的 Android 多变体工件。
请注意，我们计划在未来某个版本中[完全移除对 `hermes-engine` 依赖](https://github.com/facebook/react-native/blob/c418bf4c8fe8bf97273e3a64211eaa38d836e0a0/package.json#L105)。

#### 新架构下的 Android 用户

由于原生代码构建方式（即 NDK 的使用），新架构下的用户将**从源码构建 Hermes**。

这使新架构用户的 React Native 与 Hermes 都采用源码方式构建。
这意味着首次构建可能会遇到构建时间性能下降。

你可以查看此页面了解优化构建时间的说明：[提升构建速度](/docs/next/build-speed)。

#### 在 Windows 上使用新架构的 Android 用户

在 Windows 机器上使用新架构构建 React Native 应用的用户，需要执行以下额外步骤以确保构建正常：

- 确认[环境配置正确](https://reactnative.dev/docs/environment-setup)，包含 Android SDK 和 node。
- 使用 Chocolatey 安装 [cmake](https://community.chocolatey.org/packages/cmake)
- 安装下列其一：
  - [Visual Studio 2022 构建工具](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
  - [Visual Studio 2022 社区版](https://visualstudio.microsoft.com/vs/community/) —— 只需勾选 C++ 桌面开发部分。
- 确保 [Visual Studio 命令提示符](https://docs.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell?view=vs-2022) 配置正确（该命令提示符会配置正确的 C++ 编译器环境变量）。
- 在 Visual Studio 命令提示符中运行 `npx react-native run-android` 启动应用。

### 用户还能使用其他引擎吗？

可以，用户可自由启用/禁用 Hermes（Android 上通过 `enableHermes` 变量，iOS 上通过 `hermes_enabled`）。
“内置 Hermes”改变的仅是 **Hermes 的构建与内置方式**。

从 React Native 0.70 起，`enableHermes`/`hermes_enabled` 的默认值为 `true`。

## 这对贡献者及扩展开发者的影响

如果你是 React Native 贡献者，或者基于 React Native 或 Hermes 开发扩展，请继续阅读，以下介绍内置 Hermes 的工作原理。

### 内置 Hermes 如何工作？

该机制依赖于从 `facebook/hermes` 仓库下载 Hermes 源码 tarball，放置到 `facebook/react-native` 仓库中。
对此类其他原生依赖（如 Folly，Glog 等）我们也有类似机制，Hermes 现已采用同样的方案。

从 React Native `main` 分支构建时，我们会拉取 `facebook/hermes` 仓库 `main` 分支的 tarball，并作为 React Native 构建流程一部分进行构建。

从 React Native 发布分支（如 `0.69-stable`）构建时，我们使用 Hermes 仓库上的 **tag** 来 **同步两个仓库的代码**。具体 tag 名称存放于 React Native 发布分支的 `sdks/.hermesversion` 文件中（例如 [0.69 分支的该文件](https://github.com/facebook/react-native/blob/0.69-stable/sdks/.hermesversion)）。

在某种程度上，你可以把这个方法看作是 **git 子模块**。

如果你基于 Hermes 开发，可通过这些 tag 来了解 React Native 构建时用的是哪个 Hermes 版本，版本信息包含于 tag 名称内（如 `hermes-2022-05-20-RNv0.69.0-ee8941b8874132b8f83e4486b63ed5c19fc3f111`）。

#### 安卓端实现细节

安卓端实现位于 React Native 的 `/ReactAndroid/hermes-engine` 目录，负责构建 Hermes 并打包使用（[详见 PR #33396](https://github.com/facebook/react-native/pull/33396)）。

你可通过如下命令触发 Hermes 构建：

```bash
// 构建 Hermes 的调试版本
./gradlew :ReactAndroid:hermes-engine:assembleDebug
// 构建 Hermes 的发行版本
./gradlew :ReactAndroid:hermes-engine:assembleRelease
```

命令需在 React Native `main` 分支执行。

不需要你在机器上额外安装（如 `cmake`、`ninja` 或 `python3`），构建使用了 NDK 自带版本的这些工具。

在 Gradle 依赖方面，我们对消费者侧进行了优化：由原先的 `releaseImplementation` 和 `debugImplementation` 改为 `implementation`。这是因为新版 `hermes-engine` 的 Android 工件**支持变体感知**，能正确匹配调试构建的引擎和调试构建的应用，使用 `staging` 或其他类型/风味都适用，无需自定义配置。

但是这导致模板中必须加上：

```
exclude group:'com.facebook.fbjni'
```

此配置是因为 React Native 使用非 prefab 方式消费 fbjni（即解压 `.aar` 并提取 `.so`），而 hermes-engine 等库使用的是 prefab 消费方式。我们计划在未来[解决此问题](https://github.com/facebook/react-native/pull/33397)，使 Hermes 导入可以简洁一行。

#### iOS 端实现细节

iOS 端实现依赖一系列脚本，存于：

- [`/scripts/hermes`](https://github.com/facebook/react-native/tree/main/scripts/hermes)：包含下载 Hermes tarball、解压和配置 iOS 构建的逻辑。`pod install` 时会在 `hermes_enabled` 为 true 时执行。
- [`/sdks/hermes-engine`](https://github.com/facebook/react-native/tree/main/sdks/hermes-engine)：包含实际构建 Hermes 的逻辑，从 `facebook/hermes` 仓库复制并修改以适配 React Native。`utils` 文件夹中的脚本负责为所有 Mac 平台构建 Hermes。

Hermes 构建工作在 CircleCI 的 `build_hermes_macos` 任务中完成。该任务会产出一个 tarball，`hermes-engine` 的 podspec 在使用已发布的 React Native 版本时会下载该 tarball（[这里是 React Native 0.69 的构件实例](https://app.circleci.com/pipelines/github/facebook/react-native/13679/workflows/5172f8e4-6b02-4ccb-ab97-7cb954911fae/jobs/258701/artifacts)）。

##### 预构建 Hermes

如果没有符合当前 React Native 版本的预构建工件（例如使用的是 React Native `main` 分支），则 Hermes 需要从源码构建。
首先，`hermesc` 编译器会在 `pod install` 期间为 macOS 构建，然后 Hermes 会在 Xcode 构建流程中通过 `build-hermes-xcode.sh` 脚本构建。

##### 从源码构建 Hermes

当使用 React Native `main` 分支时，Hermes 始终从源码构建。如果使用稳定版本的 React Native，可以通过设置环境变量 `CI=true pod install` 强制通过 CocoaPods 从源码构建 Hermes。

##### 调试符号

预构建的 Hermes 工件默认不包含调试符号（dSYM）。我们计划未来为每个版本发布调试符号包。
现在，如果需要调试符号，需从源码构建 Hermes，在构建目录中会生成对应的 `hermes.framework.dSYM`。

### 我担心这次改动对我有影响

我们强调这本质是 Hermes 构建位置以及两个仓库代码同步方式的组织变更，上层用户体验应该是完全透明的。

历史上，我们会为特定 React Native 版本切分 Hermes 发布版本（例如 [`v0.11.0 用于 RN0.68.x`](https://github.com/facebook/hermes/releases/tag/v0.11.0)）。

采用“内置 Hermes”后，你可以依赖一个 tag，代表某个 React Native 版本对应的 Hermes 版本。