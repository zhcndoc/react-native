# Codegen CLI

调用 Gradle 或手动调用脚本可能很难记住，而且需要很多繁琐的步骤。

为了简化它，我们创建了一个 CLI 工具来帮助你运行这些任务：**Codegen** cli。此命令为你的项目运行 [@react-native/codegen](https://www.npmjs.com/package/@react-native/codegen)。以下选项可用：

```sh
npx @react-native-community/cli codegen --help
用法：rnc-cli codegen [options]

选项：
  --verbose            增加日志详细程度
  --path <path>        React Native 项目根目录的路径。(默认："/Users/MyUsername/projects/my-app")
  --platform <string>  目标平台。支持的值："android", "ios", "all"。(默认： "all")
  --outputPath <path>  生成产物输出的路径。
  -h, --help           显示命令帮助
```

## 示例

- 从当前工作目录读取 `package.json`，根据其 codegenConfig 生成代码。

```shell
npx @react-native-community/cli codegen
```

- 从当前工作目录读取 `package.json`，在 codegenConfig 定义的位置生成 iOS 代码。

```shell
npx @react-native-community/cli codegen --platform ios
```

- 从 `third-party/some-library` 读取 `package.json`，在 `third-party/some-library/android/generated` 生成 Android 代码。

```shell
npx @react-native-community/cli codegen \
    --path third-party/some-library \
    --platform android \
    --outputPath third-party/some-library/android/generated
```

## 将生成的代码包含到库中

Codegen CLI 是库开发人员的好工具。它可以用来预览生成的代码，查看你需要实现哪些接口。

通常生成的代码不包含在库中，使用该库的 app 负责在构建时运行 Codegen。
这对于大多数情况来说是一个好的设置，但 Codegen 也提供了一种机制，通过 `includesGeneratedCode` 属性将生成的代码包含在库本身中。

理解使用 `includesGeneratedCode = true` 的影响很重要。包含生成的代码带来几个好处，例如：

- 无需依赖 app 为你运行 **Codegen**，生成的代码始终存在。
- 实现文件始终与生成的接口保持一致（这使得你的库代码对 codegen 中的 API 变更更具弹性）。
- 无需包含两套文件来支持 Android 上的两种架构。你可以只保留新架构的那一套，并且保证向后兼容。
- 由于所有原生代码都在那里，可以将库的原生部分作为预构建发布。

另一方面，你也需要意识到一个缺点：

- 生成的代码将使用库内部定义的 React Native 版本。所以如果你的库发布时带有 React Native 0.76，生成的代码将基于该版本。这可能意味着生成的代码与使用 **之前** React Native 版本的 app 不兼容（例如，运行在 React Native 0.75 上的 App）。

## 启用 `includesGeneratedCode`

要启用此设置：

- 在 `package.json` 文件的库的 `codegenConfig` 字段中添加 `includesGeneratedCode` 属性。将其值设置为 `true`。
- 使用 codegen CLI 在本地运行 **Codegen**。
- 更新你的 `package.json` 以包含生成的代码。
- 更新你的 `podspec` 以包含生成的代码。
- 更新你的 `build.Gradle` 文件以包含生成的代码。
- 更新 `react-native.config.js` 中的 `cmakeListsPath`，以便 Gradle 不在构建目录中查找 CMakeLists 文件，而是在你的 outputDir 中查找。
