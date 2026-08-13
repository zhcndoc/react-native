---
id: react-native-gradle-plugin
title: React Native Gradle Plugin
---

本指南介绍在为 Android 构建 React Native 应用时，如何配置 **React Native Gradle Plugin**（通常称为 RNGP）。

## 使用插件

React Native Gradle Plugin 作为单独的 NPM package 分发，并会随 `react-native` 自动安装。

使用 `npx react-native init` 创建的新项目已经**配置好**该插件。如果你使用此命令创建了应用，则无需执行任何额外步骤来安装它。

如果你要将 React Native 集成到现有项目中，请参阅[相应页面](/docs/next/integration-with-existing-apps#configuring-gradle)：其中包含有关如何安装该插件的具体说明。

## 配置插件

默认情况下，该插件使用合理的默认值即可**开箱即用**。只有在需要时，你才应该参考本指南并自定义其行为。

要配置该插件，可以修改 `android/app/build.gradle` 中的 `react` 代码块：

```groovy
apply plugin: "com.facebook.react"

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
  // Custom configuration goes here.
}
```

下面介绍每个配置键：

### `root`

这是 React Native 项目的根文件夹，也就是 `package.json` 文件所在的位置。默认值为 `..`。你可以按如下方式自定义：

```groovy
root = file("../")
```

### `reactNativeDir`

这是 `react-native` package 所在的文件夹。默认值为 `../node_modules/react-native`。
如果你使用 monorepo 或其他 package manager，可以根据你的设置调整 `reactNativeDir`。

你可以按如下方式自定义：

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

这是 `react-native-codegen` package 所在的文件夹。默认值为 `../node_modules/react-native-codegen`。
如果你使用 monorepo 或其他 package manager，可以根据你的设置调整 `codegenDir`。

你可以按如下方式自定义：

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

这是 React Native CLI 的入口文件。默认值为 `../node_modules/react-native/cli.js`。
由于该插件需要调用 CLI 来为你的应用进行打包和创建，因此需要此入口文件。

如果你使用 monorepo 或其他 package manager，可以根据你的设置调整 `cliFile`。
你可以按如下方式自定义：

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

这是可调试变体的列表（有关变体的更多背景信息，请参阅[使用变体](#using-variants)）。

默认情况下，该插件仅将 `debug` 视为 `debuggableVariants`，而 `release` 不属于其中。如果你有其他变体（例如 `staging`、`lite` 等），则需要相应地进行调整。

列在 `debuggableVariants` 中的变体不会附带已打包的 bundle，因此需要 Metro 才能运行它们。

你可以按如下方式自定义：

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

这是所有脚本应调用的 node 命令及其参数列表。默认值为 `[node]`，但可以按如下方式自定义以添加额外标志：

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

这是为应用创建 bundle 时要调用的 `bundle` 命令名称。如果你使用 [RAM Bundles](https://reactnative.dev/docs/0.74/ram-bundles-inline-requires)，此配置会很有用。默认值为 `bundle`，但可以按如下方式自定义以添加额外标志：

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

这是配置文件的路径。如果提供该路径，文件将传递给 `bundle --config <file>`。默认值为空（不会提供配置文件）。有关 bundle 配置文件的更多信息，请参阅 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。可以按如下方式自定义：

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

这是应生成的 bundle 文件名称。默认值为 `index.android.bundle`。可以按如下方式自定义：

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

用于生成 bundle 的入口文件。默认情况下，会搜索 `index.android.js` 或 `index.js`。可以按如下方式自定义：

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

将传递给 `bundle` 命令的额外标志列表。可用标志列表请参阅 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。默认值为空。可以按如下方式自定义：

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

`hermesc` 命令（Hermes Compiler）的路径。React Native 已经随附一个 Hermes compiler 版本，因此通常不需要自定义此配置。默认情况下，该插件会为你的系统使用正确的 compiler。

### `hermesFlags`

传递给 `hermesc` 的标志列表。默认值为 `["-O", "-output-source-map"]`。你可以按如下方式自定义

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

### `enableBundleCompression`

将 Bundle Asset 打包进 `.apk` 时是否进行压缩。

禁用 `.bundle` 压缩后，可以直接将其映射到 RAM，从而缩短启动时间，但代价是应用在磁盘上的最终大小会更大。请注意，`.apk` 的下载大小基本不会受到影响，因为 `.apk` 文件在下载前会经过压缩

默认情况下，此选项处于禁用状态。除非你非常关注应用的磁盘空间占用，否则不应启用它。

## 使用 Flavors 和 Build Variants

构建 Android 应用时，你可能希望使用[自定义 flavors](https://developer.android.com/studio/build/build-variants#product-flavors)，以便从同一个项目开始构建应用的不同版本。

请参阅 [Android 官方指南](https://developer.android.com/studio/build/build-variants)，了解如何配置自定义 build types（例如 `staging`）或自定义 flavors（例如 `full`、`lite` 等）。
默认情况下，新应用会创建两种 build types（`debug` 和 `release`），且没有自定义 flavors。

所有 build types 与所有 flavors 的组合会生成一组**build variants**。例如，对于 `debug`／`staging`／`release` build types 和 `full`／`lite`，你将拥有 6 个 build variants：`fullDebug`、`fullStaging`、`fullRelease` 等。

如果你使用了 `debug` 和 `release` 之外的自定义 variants，则需要使用 [`debuggableVariants`](#debuggablevariants) 配置按如下方式告知 React Native Gradle Plugin 哪些 variants 是**可调试的**：

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

这是必要的，因为该插件会跳过所有 `debuggableVariants` 的 JS bundle 打包：你需要 Metro 才能运行它们。例如，如果你将 `fullStaging` 列入 `debuggableVariants`，就无法将其发布到应用商店，因为其中缺少 bundle。

## 该插件在底层做了什么？

React Native Gradle Plugin 负责配置应用构建，以便将 React Native 应用发布到生产环境。
该插件也用于 3rd party libraries 内部，以运行用于 New Architecture 的 [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。

下面总结了该插件的职责：

- 为每个非可调试 variant 添加 `createBundle<Variant>JsAndAssets` task，负责调用 `bundle`、`hermesc` 和 `compose-source-map` 命令
- 设置正确版本的 `com.facebook.react:react-android` 和 `com.facebook.react:hermes-android` dependency，从 `react-native` 的 `package.json` 中读取 React Native 版本
- 设置所需的正确 Maven repositories（Maven Central、Google Maven Repo、JSC local Maven repo 等），以使用所有必需的 Maven Dependencies
- 设置 NDK，以便你构建使用 New Architecture 的应用
- 设置 `buildConfigFields`，以便你在运行时了解是否启用了 Hermes 或 New Architecture
- 将 Metro DevServer Port 设置为 Android resource，使应用知道应连接到哪个端口
- 如果 library 或应用使用 New Architecture 的 Codegen，则调用 [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)
