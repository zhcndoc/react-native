---
id: react-native-gradle-plugin
title: React Native Gradle 插件
---

本指南介绍了如何在为 Android 构建 React Native 应用时，配置 **React Native Gradle 插件**（通常称为 RNGP）。

## 使用插件

React Native Gradle 插件作为一个独立的 NPM 包分发，会随着 `react-native` 自动安装。

对于使用 `npx react-native init` 创建的新项目，该插件**已自动配置好**。如果你是用这个命令创建的应用程序，无需额外步骤来安装插件。

如果你是在已有项目中集成 React Native，请参考 [对应页面](/docs/next/integration-with-existing-apps#configuring-gradle)，其中包含了如何安装插件的特定说明。

## 配置插件

默认情况下，插件能**开箱即用**，采用合理的默认值。只有在需要自定义行为时，才应参考本指南对其进行配置。

你可以通过修改 `android/app/build.gradle` 中的 `react` 块来配置插件：

```groovy
apply plugin: "com.facebook.react"

/**
 * 这是 React Native Android 应用的配置块。
 * 默认情况下你不需要应用任何配置，只需取消注释你需要的行即可。
 */
react {
  // 自定义配置写在这里。
}
```

下面列出了各配置键的说明：

### `root`

这是你 React Native 项目的根目录，即放置 `package.json` 文件的位置。默认是 `..`。你可以按如下方式自定义：

```groovy
root = file("../")
```

### `reactNativeDir`

这是 `react-native` 包所在的目录。默认是 `../node_modules/react-native`。
如果你使用的是 monorepo 或不同的包管理器，可以调整此路径以匹配你的设置。

示例如下：

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

这是 `react-native-codegen` 包所在的目录。默认是 `../node_modules/react-native-codegen`。
如果你使用 monorepo 或其他包管理器，可相应调整。

示例如下：

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

这是 React Native CLI 的入口文件。默认是 `../node_modules/react-native/cli.js`。
插件需要调用 CLI 来进行打包和创建应用，因此需要该入口文件。

如果你是 monorepo 或其他包管理器，可调整此路径。示例如下：

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

这是可调试的变体列表（关于变体的更多信息，请参见[使用变体](#using-variants)）。

默认情况下，插件仅把 `debug` 视为 `debuggableVariants`，`release` 则不属于。如果你有其他变体（例如 `staging`、`lite` 等），需要相应调整。

被列为 `debuggableVariants` 的变体不会附带已打包的 bundle，因此运行时需要 Metro。

示例如下：

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

这是应被调用的节点命令及其参数列表，默认是 `[node]`，你可按需添加额外标志：

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

这是在创建应用 bundle 时调用的 `bundle` 命令名称。当你使用 [RAM Bundles](https://reactnative.dev/docs/0.74/ram-bundles-inline-requires) 时非常有用。默认是 `bundle`，且可按需添加标志：

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

这是一个配置文件路径，如果提供，该文件会传递给 `bundle --config <file>`。默认为空（不提供配置文件）。关于打包配置文件的更多信息，请参见 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。示例如下：

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

这是应该生成的 bundle 文件名。默认是 `index.android.bundle`。示例如下：

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

用于生成 bundle 的入口文件。默认会搜索 `index.android.js` 或 `index.js`。示例如下：

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

传递给 `bundle` 命令的额外标志列表。可用的标志见 [CLI 文档](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle)。默认为空。示例如下：

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

`hermesc` 命令（Hermes 编译器）的路径。React Native 内置了 Hermes 编译器，所以通常你不需要自定义此项。插件会自动使用适合你系统的编译器。

### `hermesFlags`

传递给 `hermesc` 的参数列表。默认是 `["-O", "-output-source-map"]`。示例如下：

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

### `enableBundleCompression`

是否在打包成 `.apk` 时压缩 Bundle 资源。

禁用 `.bundle` 压缩可直接内存映射到 RAM，从而提升启动速度，但会增加磁盘上的应用体积。请注意 `.apk` 的下载体积基本不受影响，因为 `.apk` 在下载前会被压缩。

默认此项为禁用，除非你非常在意应用磁盘空间，否则不建议开启。

## 使用 Flavors 和构建变体

在构建 Android 应用时，你可能想使用 [自定义 flavors](https://developer.android.com/studio/build/build-variants#product-flavors)，以便基于同一个项目生成不同版本的应用。

请参考 [官方 Android 指南](https://developer.android.com/studio/build/build-variants) 配置自定义构建类型（如 `staging`）或自定义产品 flavors（如 `full`、`lite` 等）。

默认新建项目包含两种构建类型 (`debug` 和 `release`)，但无自定义 flavors。

所有构建类型和 flavors 的组合构成一组**构建变体**。例如，对于 `debug`、`staging`、`release` 三种构建类型和 `full`、`lite` 两种 flavors，你将有 6 个变体：`fullDebug`、`fullStaging`、`fullRelease` 等。

如果你使用了除 `debug` 和 `release` 之外的自定义变体，需要通过 [`debuggableVariants`](#debuggablevariants) 告诉 React Native Gradle 插件哪些变体是**可调试的**，例如：

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

这是必要的，因为插件会跳过所有 `debuggableVariants` 的 JS 打包，这些变体需要依赖 Metro 运行。例如，如果你把 `fullStaging` 列为 `debuggableVariants`，它将缺失 bundle，无法发布至应用商店。

## 插件的底层工作原理

React Native Gradle 插件负责配置你的应用构建流程，以便将 React Native 应用发布至生产环境。
该插件也用于第三方库中，运行用于新架构的 [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)。

插件的主要职责总结如下：

- 为每个非可调试变体添加 `createBundle<Variant>JsAndAssets` 任务，负责调用 `bundle`、`hermesc` 和 `compose-source-map` 命令。
- 设置正确版本的 `com.facebook.react:react-android` 和 `com.facebook.react:hermes-android` 依赖，从 `react-native` 的 `package.json` 中读取 React Native 版本。
- 设置正确的 Maven 仓库（Maven 中央仓库、Google Maven 仓库、本地 JSC Maven 仓库等），以便获取所有必要的 Maven 依赖。
- 设置 NDK，使你能够构建使用新架构的应用。
- 设置 `buildConfigFields`，让运行时能知道是否启用了 Hermes 或新架构。
- 将 Metro DevServer 端口设置为 Android 资源，使应用能知道要连接哪个端口。
- 调用 [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md)，如果库或应用使用了新架构的 Codegen。