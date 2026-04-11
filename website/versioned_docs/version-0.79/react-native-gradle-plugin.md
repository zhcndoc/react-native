---
id: react-native-gradle-plugin
title: React Native Gradle 插件
---

本指南描述了在为 Android 构建 React Native 应用程序时，如何配置 **React Native Gradle 插件**（通常简称 RNGP）。

## 使用插件

React Native Gradle 插件作为单独的 NPM 包分发，该包会随 `react-native` 自动安装。

对于使用 `npx react-native init` 创建的新项目，该插件**已配置好**。如果您是使用此命令创建的应用，则无需执行任何额外步骤来安装它。

如果您要将 React Native 集成到现有项目中，请参阅[相应页面](/docs/next/integration-with-existing-apps#configuring-gradle)：其中包含有关如何安装插件的具体说明。

## 配置插件

默认情况下，插件将**开箱即用**，具有合理的默认值。您应该参考本指南，仅在需要时自定义行为。

要配置插件，您可以修改 `android/app/build.gradle` 中的 `react` 块：

```groovy
apply plugin: "com.facebook.react"

/**
 * 这是用于自定义您的 React Native Android 应用的配置块。
 * 默认情况下您不需要应用任何配置，只需取消注释您需要的行。
 */
react {
  // 自定义配置放在这里。
}
```

每个配置键如下所述：

### `root`

这是您 React Native 项目的根文件夹，即 `package.json` 文件所在的位置。默认值是 `..`。您可以按以下方式自定义：

```groovy
root = file("../")
```

### `reactNativeDir`

这是 `react-native` 包所在的文件夹。默认值是 `../node_modules/react-native`。
如果您在 monorepo 中或使用不同的包管理器，您可以调整 `reactNativeDir` 以适应您的设置。

您可以按以下方式自定义：

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

这是 `react-native-codegen` 包所在的文件夹。默认值是 `../node_modules/react-native-codegen`。
如果您在 monorepo 中或使用不同的包管理器，您可以调整 `codegenDir` 以适应您的设置。

您可以按以下方式自定义：

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

这是 React Native CLI 的入口文件。默认值是 `../node_modules/react-native/cli.js`。
需要入口文件，因为插件需要调用 CLI 来打包和创建您的应用。

如果您在 monorepo 中或使用不同的包管理器，您可以调整 `cliFile` 以适应您的设置。
您可以按以下方式自定义：

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

这是可调试变体的列表（有关变体的更多上下文，请参阅[使用变体](#using-variants)）。

默认情况下，插件仅将 `debug` 视为 `debuggableVariants`，而 `release` 不是。如果您有其他变体（如 `staging`、`lite` 等），则需要相应地调整此项。

列为 `debuggableVariants` 的变体将不包含已打包的 bundle，因此您需要 Metro 来运行它们。

您可以按以下方式自定义：

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

这是应为所有脚本调用的 node 命令和参数列表。默认值是 `[node]`，但可以自定义以添加额外标志，如下所示：

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

这是为您的应用创建 bundle 时要调用的 `bundle` 命令的名称。如果您使用 [RAM Bundles](https://reactnative.dev/docs/0.74/ram-bundles-inline-requires)，这很有用。默认值是 `bundle`，但可以自定义以添加额外标志，如下所示：

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

这是将传递给 `bundle --config <file>` 的配置文件路径（如果提供）。默认值为空（不提供配置文件）。有关打包配置文件的更多信息，请参阅 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。可按以下方式自定义：

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

这是应生成的 bundle 文件的名称。默认值是 `index.android.bundle`。可按以下方式自定义：

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

用于 bundle 生成的入口文件。默认值是搜索 `index.android.js` 或 `index.js`。可按以下方式自定义：

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

将传递给 `bundle` 命令的额外标志列表。可用标志列表在 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle) 中。默认值为空。可按以下方式自定义：

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

`hermesc` 命令（Hermes 编译器）的路径。React Native 自带了一个版本的 Hermes 编译器，因此您通常不需要自定义此项。默认情况下，插件将为您的系统使用正确的编译器。

### `hermesFlags`

传递给 `hermesc` 的标志列表。默认值是 `["-O", "-output-source-map"]`。您可以按以下方式自定义：

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

### `enableBundleCompression`

Bundle Asset 在打包到 `.apk` 时是否应该压缩。

禁用 `.bundle` 的压缩允许将其直接内存映射到 RAM，从而改善启动时间——但代价是磁盘上的最终应用大小更大。请注意，`.apk` 下载大小基本不受影响，因为 `.apk` 文件在下载前会被压缩。

默认情况下这是禁用的，除非您非常关心应用程序的磁盘空间，否则不应启用它。

## 使用产品风味和构建变体

在构建 Android 应用时，您可能希望使用 [自定义产品风味](https://developer.android.com/studio/build/build-variants#product-flavors) 以便从同一个项目开始拥有不同版本的应用。

请参阅 [官方 Android 指南](https://developer.android.com/studio/build/build-variants) 来配置自定义构建类型（如 `staging`）或自定义产品风味（如 `full`、`lite` 等）。
默认情况下，新应用创建时带有两种构建类型（`debug` 和 `release`），没有自定义产品风味。

所有构建类型和所有产品风味的组合生成了一组**构建变体**。例如，对于 `debug`/`staging`/`release` 构建类型和 `full`/`lite`，您将有 6 个构建变体：`fullDebug`、`fullStaging`、`fullRelease` 等等。

如果您使用 `debug` 和 `release` 之外的自定义变体，您需要指示 React Native Gradle 插件，使用 [`debuggableVariants`](#debuggablevariants) 配置指定哪些变体是**可调试的**，如下所示：

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

这是必要的，因为插件将跳过所有 `debuggableVariants` 的 JS 打包：您需要 Metro 来运行它们。例如，如果您在 `debuggableVariants` 中列出了 `fullStaging`，您将无法将其发布到商店，因为它将缺少 bundle。

## 插件在底层做什么？

React Native Gradle 插件负责配置您的应用程序构建，以便将 React Native 应用程序发布到生产环境。
该插件还用于第三方库中，以运行用于新架构的 [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。

以下是插件职责的摘要：

- 为每个非可调试变体添加一个 `createBundle<Variant>JsAndAssets` 任务，负责调用 `bundle`、`hermesc` 和 `compose-source-map` 命令。
- 设置正确版本的 `com.facebook.react:react-android` 和 `com.facebook.react:hermes-android` 依赖项，从 `react-native` 的 `package.json` 中读取 React Native 版本。
- 设置所需的正确 Maven 仓库（Maven Central、Google Maven Repo、JSC local Maven repo 等），以消耗所有必要的 Maven 依赖项。
- 设置 NDK 以让您构建使用新架构的应用。
- 设置 `buildConfigFields`，以便您可以在运行时知道 Hermes 或新架构是否已启用。
- 将 Metro DevServer 端口设置为 Android 资源，以便应用知道连接到哪个端口。
- 如果库或应用使用新架构的 Codegen，则调用 [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。
