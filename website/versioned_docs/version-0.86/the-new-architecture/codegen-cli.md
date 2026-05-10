# Codegen CLI

调用 Gradle 或手动执行脚本可能很难记住，而且需要很多准备工作。

为简化这一点，我们创建了一个 CLI 工具，可以帮助你运行这些任务：**Codegen** CLI。此命令会为你的项目运行 [@react-native/codegen](https://www.npmjs.com/package/@react-native/codegen)。可用的选项如下：

```sh
npx @react-native-community/cli codegen --help
Usage: rnc-cli codegen [options]

Options:
  --verbose            Increase logging verbosity
  --path <path>        Path to the React Native project root. (default: "/Users/MyUsername/projects/my-app")
  --platform <string>  Target platform. Supported values: "android", "ios", "all". (default: "all")
  --outputPath <path>  Path where generated artifacts will be output to.
  -h, --help           display help for command
```

## 示例

- 从当前工作目录读取 `package.json`，根据其中的 codegenConfig 生成代码。

```shell
npx @react-native-community/cli codegen
```

- 从当前工作目录读取 `package.json`，在 codegenConfig 中定义的位置生成 iOS 代码。

```shell
npx @react-native-community/cli codegen --platform ios
```

- 从 `third-party/some-library` 读取 `package.json`，在 `third-party/some-library/android/generated` 中生成 Android 代码。

```shell
npx @react-native-community/cli codegen \
    --path third-party/some-library \
    --platform android \
    --outputPath third-party/some-library/android/generated
```

## 将生成的代码包含到库中

Codegen CLI 对库开发者来说是一个很棒的工具。它可以用来提前查看生成的代码，看看你需要实现哪些接口。

通常情况下，生成的代码不会包含在库中，而是由使用该库的应用在构建时负责运行 Codegen。
这对大多数情况来说都是一个不错的方案，但 Codegen 也提供了一种机制，可以通过 `includesGeneratedCode` 属性将生成的代码包含到库本身中。

理解使用 `includesGeneratedCode = true` 的影响非常重要。包含生成代码有以下几个优点：

- 不需要依赖应用为你运行 **Codegen**，生成的代码始终存在。
- 实现文件始终与生成的接口保持一致（这使你的库代码在面对 codegen 中的 API 变化时更具弹性）。
- 在 Android 上不需要包含两套文件来支持两种架构。你只需要保留 New Architecture 的那一套，并且可以保证向后兼容。
- 由于所有原生代码都已存在，因此可以将库的原生部分作为预构建产物发布。

另一方面，你也需要注意一个缺点：

- 生成的代码将使用你库中定义的 React Native 版本。因此，如果你的库随 React Native 0.76 一起发布，生成的代码将基于该版本。这可能意味着生成的代码与使用应用所用的 **之前** React Native 版本的应用不兼容（例如运行在 React Native 0.75 上的应用）。

## 启用 `includesGeneratedCode`

要启用这种设置：

- 在 `package.json` 文件中，将 `includesGeneratedCode` 属性添加到你库的 `codegenConfig` 字段里。将其值设为 `true`。
- 使用 codegen CLI 在本地运行 **Codegen**。
- 更新你的 `package.json` 以包含生成的代码。
- 更新你的 `podspec` 以包含生成的代码。
- 更新你的 `build.Gradle` 文件以包含生成的代码。
- 在 `react-native.config.js` 中更新 `cmakeListsPath`，这样 Gradle 就不会去构建目录中查找 CMakeLists 文件，而是会在你的 outputDir 中查找。
