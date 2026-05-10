---
id: react-native-gradle-plugin
title: React Native Gradle 插件
---

本指南描述了在为 Android 构建 React Native 应用时，如何配置 **React Native Gradle 插件**（通常简称为 RNGP）。

## 使用插件

React Native Gradle 插件作为一个独立的 NPM 包分发，并会随着 `react-native` 自动安装。

对于使用 `npx react-native init` 创建的新项目，插件**已经配置好**了。如果你是通过这个命令创建应用的，就不需要额外执行任何安装步骤。

如果你正在将 React Native 集成到现有项目中，请参考[对应页面](/docs/next/integration-with-existing-apps#configuring-gradle)：其中包含了如何安装该插件的具体说明。

## 配置插件

默认情况下，插件开箱即用，并带有合理的默认值。只有在你需要时，才应参考本指南并自定义其行为。

要配置该插件，你可以修改 `android/app/build.gradle` 中的 `react` 块：

```groovy
apply plugin: "com.facebook.react"

/**
 * 这是用于自定义你的 React Native Android 应用的配置块。
 * 默认情况下你不需要应用任何配置，只需取消注释你需要的行。
 */
react {
  // 自定义配置写在这里。
}
```

下面将逐一说明每个配置项：

### `root`

这是你的 React Native 项目的根目录，也就是 `package.json` 文件所在的位置。默认值是 `..`。你可以按如下方式自定义：

```groovy
root = file("../")
```

### `reactNativeDir`

这是 `react-native` 包所在的目录。默认值是 `../node_modules/react-native`。
如果你在 monorepo 中，或者使用了不同的包管理器，可以根据你的设置调整 `reactNativeDir`。

你可以按如下方式自定义：

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

这是 `react-native-codegen` 包所在的目录。默认值是 `../node_modules/react-native-codegen`。
如果你在 monorepo 中，或者使用了不同的包管理器，可以根据你的设置调整 `codegenDir`。

你可以按如下方式自定义：

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

这是 React Native CLI 的入口文件。默认值是 `../node_modules/react-native/cli.js`。
入口文件是必需的，因为插件需要调用 CLI 来进行打包并创建你的应用。

如果你在 monorepo 中，或者使用了不同的包管理器，可以根据你的设置调整 `cliFile`。
你可以按如下方式自定义：

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

这是可调试的变体列表（有关变体的更多上下文，请参见[使用变体](#using-variants)）。

默认情况下，插件将只把 `debug` 视为 `debuggableVariants`，而 `release` 不会。如果你有其他
变体（例如 `staging`、`lite` 等），你需要相应地进行调整。

被列为 `debuggableVariants` 的变体不会附带已打包的 bundle，因此你需要使用 Metro 来运行它们。

你可以按如下方式自定义：

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

这是所有脚本应调用的 node 命令及其参数列表。默认值是 `[node]`，但可以通过添加额外标志进行自定义，如下所示：

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

这是在为你的应用创建 bundle 时要调用的 `bundle` 命令名称。如果你正在使用 [RAM Bundles](https://reactnative.dev/docs/0.74/ram-bundles-inline-requires)，这会很有用。默认值是 `bundle`，但可以通过添加额外标志进行自定义，如下所示：

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

这是配置文件的路径，如果提供，该文件将被传递给 `bundle --config <file>`。默认值为空（不会提供配置文件）。关于 bundling 配置文件的更多信息可以在[CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)中找到。可以按如下方式自定义：

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

这是应生成的 bundle 文件名称。默认值是 `index.android.bundle`。可以按如下方式自定义：

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

用于生成 bundle 的入口文件。默认情况下会搜索 `index.android.js` 或 `index.js`。可以按如下方式自定义：

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

传递给 `bundle` 命令的额外标志列表。可用标志列表见[CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。默认值为空。可以按如下方式自定义：

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

`hermesc` 命令的路径（Hermes 编译器）。React Native 自带了一个捆绑的 Hermes 编译器版本，因此通常不需要你进行自定义。默认情况下，插件会为你的系统使用正确的编译器。

### `hermesFlags`

传递给 `hermesc` 的标志列表。默认值是 `["-O", "-output-source-map"]`。你可以按如下方式自定义

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

### `enableBundleCompression`

Bundle Asset 在打包为 `.apk` 时是否应被压缩。

禁用 `.bundle` 的压缩后，它可以直接映射到 RAM，从而提升启动时间——代价是最终应用在磁盘上的大小会更大。请注意，`.apk` 的下载大小大多不会受到影响，因为 `.apk` 文件在下载前会被压缩。

默认情况下这是禁用的，除非你确实非常关注应用的磁盘空间，否则不应开启它。

## 使用 Flavors 和构建变体

在构建 Android 应用时，你可能希望使用[自定义 flavors](https://developer.android.com/studio/build/build-variants#product-flavors)，以便从同一个项目生成应用的不同版本。

请参考[Android 官方指南](https://developer.android.com/studio/build/build-variants)来配置自定义构建类型（如 `staging`）或自定义 flavors（如 `full`、`lite` 等）。
默认情况下，新应用会创建两个构建类型（`debug` 和 `release`），并且没有自定义 flavors。

所有构建类型与所有 flavors 的组合会生成一组**构建变体**。例如，对于 `debug`/`staging`/`release` 构建类型以及 `full`/`lite`，你将拥有 6 个构建变体：`fullDebug`、`fullStaging`、`fullRelease` 等等。

如果你使用了 `debug` 和 `release` 之外的自定义变体，你需要通过 [`debuggableVariants`](#debuggablevariants) 配置来告诉 React Native Gradle 插件哪些变体是**可调试的**，如下所示：

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

这是必要的，因为插件会跳过所有 `debuggableVariants` 的 JS 打包：你需要 Metro 来运行它们。例如，如果你在 `debuggableVariants` 中列出了 `fullStaging`，你将无法将其发布到商店，因为它会缺少 bundle。

## 插件底层做了什么？

React Native Gradle 插件负责配置你的应用构建，以便将 React Native 应用发布到生产环境。
该插件也用于第三方库中，以运行用于新架构的 [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。

以下是该插件职责的摘要：

- 为每个不可调试的变体添加一个 `createBundle<Variant>JsAndAssets` 任务，该任务负责调用 `bundle`、`hermesc` 和 `compose-source-map` 命令。
- 设置正确版本的 `com.facebook.react:react-android` 和 `com.facebook.react:hermes-android` 依赖项，并从 `react-native` 的 `package.json` 读取 React Native 版本。
- 设置所需的 Maven 仓库（Maven Central、Google Maven Repo、JSC 本地 Maven 仓库等），以便获取所有必需的 Maven 依赖项。
- 设置 NDK，以便你能够构建使用新架构的应用。
- 设置 `buildConfigFields`，以便你可以在运行时知道 Hermes 或新架构是否已启用。
- 将 Metro DevServer 端口设置为一个 Android 资源，这样应用就知道应连接到哪个端口。
- 如果某个库或应用正在为新架构使用 Codegen，则调用 [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。
