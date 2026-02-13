# Codegen CLI

调用 Gradle 或手动运行脚本可能难以记住且需要很多步骤。

为了简化操作，我们创建了一个 CLI 工具，帮助你运行这些任务：**Codegen** CLI。该命令会为你的项目运行 [@react-native/codegen](https://www.npmjs.com/package/@react-native/codegen)。可用的选项如下：

```sh
npx @react-native-community/cli codegen --help
用法：rnc-cli codegen [选项]

选项：
  --verbose            增加日志详细程度
  --path <path>        React Native 项目根目录路径。（默认值：" /Users/MyUsername/projects/my-app"）
  --platform <string>  目标平台。支持的值："android"、"ios"、"all"。（默认值："all"）
  --outputPath <path>  生成产物输出路径。
  -h, --help           显示命令帮助
```

## 示例

- 从当前工作目录读取 `package.json`，根据其中的 codegenConfig 生成代码。

```shell
npx @react-native-community/cli codegen
```

- 从当前工作目录读取 `package.json`，根据其中的 codegenConfig 生成 iOS 代码。

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

Codegen CLI 是库开发者的好帮手。它可以用来预览生成的代码，帮助你了解需要实现哪些接口。

通常，生成的代码不包含在库中，使用该库的应用负责在构建时运行 Codegen。这个做法适合大多数情况，但 Codegen 也提供了一种机制，通过 `includesGeneratedCode` 属性把生成的代码包含到库内。

理解使用 `includesGeneratedCode = true` 的影响非常重要。包含生成代码带来了多个好处，例如：

- 不用依赖应用来帮你运行 **Codegen**，生成代码始终存在。
- 实现文件始终与生成的接口一致（这使得你的库代码对于 Codegen API 的变更更具鲁棒性）。
- 无需支持 Android 上的两套架构文件。你可以只保留新架构相关文件，并且保证向后兼容。
- 因为所有本地代码都存在，可以将库的本地部分作为预构建包发布。

另一方面，你也需要注意一个缺点：

- 生成的代码会使用库内定义的 React Native 版本。因此，如果你的库基于 React Native 0.76 生成代码，那么代码就基于这个版本。这可能导致生成代码与使用较旧 React Native 版本（例如 0.75）的应用不兼容。

## 启用 `includesGeneratedCode`

启用此设置的步骤如下：

- 在库的 `package.json` 文件中的 `codegenConfig` 字段内添加 `includesGeneratedCode` 属性，值设为 `true`。
- 使用 Codegen CLI 本地运行 Codegen。
- 更新你的 `package.json` 文件，将生成的代码包含进去。
- 更新你的 podspec 文件，将生成的代码包含进去。
- 更新你的 `build.Gradle` 文件，将生成的代码包含进去。
- 更新 `react-native.config.js` 中的 `cmakeListsPath`，使 Gradle 不再在构建目录寻找到 CMakeLists 文件，而是去你指定的 outputDir 路径。