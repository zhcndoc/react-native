# Codegen CLI

调用 Gradle 或手动调用脚本可能很难记住，而且需要大量繁琐的步骤。

为了简化这一过程，我们创建了一个可以帮助你运行这些任务的 CLI 工具：**Codegen** CLI。此命令会为你的项目运行 [@react-native/codegen](https://www.npmjs.com/package/@react-native/codegen)。以下选项可用：

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

- 从当前工作目录读取 `package.json`，并根据其中的 codegenConfig 生成代码。

```shell
npx @react-native-community/cli codegen
```

- 从当前工作目录读取 `package.json`，并在 codegenConfig 定义的位置生成 iOS 代码。

```shell
npx @react-native-community/cli codegen --platform ios
```

- 从 `third-party/some-library` 读取 `package.json`，并在 `third-party/some-library/android/generated` 中生成 Android 代码。

```shell
npx @react-native-community/cli codegen \
    --path third-party/some-library \
    --platform android \
    --outputPath third-party/some-library/android/generated
```

## 将生成的代码包含到库中

Codegen CLI 对库开发者来说是一个非常好的工具。它可以用来快速查看生成的代码，从而了解你需要实现哪些接口。

通常情况下，生成的代码不会包含在库中，而是由使用该库的应用负责在构建时运行 Codegen。
对于大多数情况来说，这是一种很好的设置方式，但 Codegen 也提供了一种机制，可以通过 `includesGeneratedCode` 属性将生成的代码包含到库本身中。

了解使用 `includesGeneratedCode = true` 会带来哪些影响非常重要。包含生成的代码有诸多好处，例如：

- 无需依赖应用为你运行 **Codegen**，生成的代码始终存在。
- 实现文件始终与生成的接口保持一致（这会使你的库代码更能抵御 codegen 中的 API 变更）。
- 在 Android 上无需包含两组文件来同时支持两种架构。你只需保留新架构版本，并且可以保证其向后兼容。
- 由于所有原生代码都已存在，因此可以将库的原生部分作为预构建版本发布。

另一方面，你也需要注意一个缺点：

- 生成的代码会使用库中定义的 React Native 版本。因此，如果你的库随 React Native 0.76 一起发布，生成的代码将基于该版本。这意味着生成的代码可能与应用使用的**较早版本** React Native 不兼容（例如，运行在 React Native 0.75 上的应用）。

## 启用 `includesGeneratedCode`

要启用此设置：

- 将 `includesGeneratedCode` 属性添加到 `package.json` 文件中库的 `codegenConfig` 字段内。将其值设置为 `true`。
- 使用 codegen CLI 在本地运行 **Codegen**。
- 更新你的 `package.json` 以包含生成的代码。
- 更新你的 `podspec` 以包含生成的代码。
- 更新你的 `build.Gradle` 文件以包含生成的代码。
- 更新 `react-native.config.js` 中的 `cmakeListsPath`，这样 Gradle 就不会在构建目录中查找 CMakeLists 文件，而是会在你的 outputDir 中查找。
