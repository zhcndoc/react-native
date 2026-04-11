---
id: react-native-gradle-plugin
title: React Native Gradle 插件
---

本指南描述了如何配置 **React Native Gradle 插件**（通常简称 RNGP），当为 Android 构建你的 React Native 应用时。

## 使用插件

React Native Gradle 插件作为单独的 NPM 包分发，随 `react-native` 自动安装。

对于使用 `npx react-native init` 创建的新项目，插件**已经配置好**。如果你使用此命令创建应用，无需执行任何额外步骤来安装它。

如果你将 React Native 集成到现有项目中，请参阅[相应页面](/docs/next/integration-with-existing-apps#configuring-gradle)：其中包含有关如何安装插件的具体说明。

## 配置插件

默认情况下，插件将**开箱即用**，具有合理的默认值。你应该参考本指南，仅在需要时自定义行为。

要配置插件，你可以修改 `android/app/build.gradle` 中的 `react` 块：

```groovy
apply plugin: "com.facebook.react"

/**
 * 这是用于自定义你的 React Native Android 应用的配置块。
 * 默认情况下你不需要应用任何配置，只需取消注释你需要的行。
 */
react {
  // 自定义配置放在这里。
}
```

每个配置键描述如下：

### `root`

这是你的 React Native 项目的根文件夹，即 `package.json` 文件所在的位置。默认值是 `..`。你可以按如下方式自定义：

```groovy
root = file("../")
```

### `reactNativeDir`

这是 `react-native` 包所在的文件夹。默认值是 `../node_modules/react-native`。
如果你在 monorepo 中或使用不同的包管理器，你可以调整 `reactNativeDir` 以适应你的设置。

你可以按如下方式自定义：

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

这是 `react-native-codegen` 包所在的文件夹。默认值是 `../node_modules/react-native-codegen`。
如果你在 monorepo 中或使用不同的包管理器，你可以调整 `codegenDir` 以适应你的设置。

你可以按如下方式自定义：

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

这是 React Native CLI 的入口文件。默认值是 `../node_modules/react-native/cli.js`。
需要入口文件，因为插件需要调用 CLI 来打包和创建你的应用。

如果你在 monorepo 中或使用不同的包管理器，你可以调整 `cliFile` 以适应你的设置。
你可以按如下方式自定义：

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

这是可调试变体的列表（有关变体的更多上下文，请参阅[使用变体](#using-variants)）。

默认情况下，插件仅将 `debug` 视为 `debuggableVariants`，而 `release` 不是。如果你有其他变体（如 `staging`、`lite` 等），你需要相应地调整此项。

列为 `debuggableVariants` 的变体不会附带打包的 bundle，因此你需要 Metro 来运行它们。

你可以按如下方式自定义：

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

这是所有脚本应调用的 node 命令和参数列表。默认值是 `[node]`，但可以自定义以添加额外标志，如下所示：

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

这是为应用创建 bundle 时要调用的 `bundle` 命令的名称。如果你使用 [RAM Bundles](https://reactnative.dev/docs/0.74/ram-bundles-inline-requires)，这很有用。默认值是 `bundle`，但可以自定义以添加额外标志，如下所示：

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

如果提供，这是将传递给 `bundle --config <file>` 的配置文件路径。默认值为空（将不提供配置文件）。有关打包配置文件的更多信息可以在 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle) 中找到。可按如下方式自定义：

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

这是应生成的 bundle 文件的名称。默认值是 `index.android.bundle`。可按如下方式自定义：

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

用于生成 bundle 的入口文件。默认值是搜索 `index.android.js` 或 `index.js`。可按如下方式自定义：

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

将传递给 `bundle` 命令的额外标志列表。可用标志列表在 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle) 中。默认值为空。可按如下方式自定义：

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

`hermesc` 命令（Hermes 编译器）的路径。React Native 自带了一个版本的 Hermes 编译器，因此你通常不需要自定义此项。默认情况下，插件将为你的系统使用正确的编译器。

### `hermesFlags`

传递给 `hermesc` 的标志列表。默认值是 `["-O", "-output-source-map"]`。你可以按如下方式自定义

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

### `enableBundleCompression`

Bundle Asset 在打包成 `.apk` 时是否应该被压缩。

禁用 `.bundle` 的压缩允许将其直接内存映射到 RAM，从而改善启动时间——但代价是磁盘上的最终应用大小更大。请注意，`.apk` 下载大小将基本不受影响，因为 `.apk` 文件在下载前会被压缩

默认情况下这是禁用的，你不应该启用它，除非你非常关心应用的磁盘空间。

## 使用 Flavor 和构建变体

在构建 Android 应用时，你可能想要使用 [自定义 flavor](https://developer.android.com/studio/build/build-variants#product-flavors) 从同一个项目拥有不同版本的应用。

请参阅 [官方 Android 指南](https://developer.android.com/studio/build/build-variants) 来配置自定义构建类型（如 `staging`）或自定义 flavor（如 `full`、`lite` 等）。
默认情况下，新应用创建时带有两种构建类型（`debug` 和 `release`），没有自定义 flavor。

所有构建类型和所有 flavor 的组合生成一组 **构建变体**。例如，对于 `debug`/`staging`/`release` 构建类型和 `full`/`lite`，你将拥有 6 个构建变体：`fullDebug`、`fullStaging`、`fullRelease` 等等。

如果你使用 `debug` 和 `release` 之外的自定义变体，你需要指示 React Native Gradle 插件指定哪些变体是 **可调试的**，使用 [`debuggableVariants`](#debuggablevariants) 配置，如下所示：

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

这是必要的，因为插件将跳过所有 `debuggableVariants` 的 JS 打包：你需要 Metro 来运行它们。例如，如果你在 `debuggableVariants` 中列出了 `fullStaging`，你将无法将其发布到商店，因为它将缺少 bundle。

## 插件在底层做什么？

React Native Gradle 插件负责配置你的应用构建，以便将 React Native 应用发布到生产环境。
该插件也在第三方库内部使用，用于运行用于新架构的 [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。

以下是插件职责的摘要：

- 为每个非可调试变体添加一个 `createBundle<Variant>JsAndAssets` 任务，负责调用 `bundle`、`hermesc` 和 `compose-source-map` 命令。
- 设置正确版本的 `com.facebook.react:react-android` 和 `com.facebook.react:hermes-android` 依赖，从 `react-native` 的 `package.json` 中读取 React Native 版本。
- 设置正确的 Maven 仓库（Maven Central、Google Maven Repo、JSC local Maven repo 等），以消耗所有必要的 Maven 依赖。
- 设置 NDK 以让你构建使用新架构的应用。
- 设置 `buildConfigFields`，以便你可以在运行时知道 Hermes 或新架构是否已启用。
- 将 Metro DevServer 端口设置为 Android 资源，以便应用知道连接到哪个端口。
- 如果库或应用正在使用用于新架构的 Codegen，则调用 [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。
