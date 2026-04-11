# 为你的模块创建一个库

React Native 拥有丰富的生态系统来解决常见问题。我们将 React Native 库收集在 [reactnative.directory](https://reactnative.directory) 网站上，这是每位 React Native 开发者都值得收藏的重要资源。

有时，你可能正在开发一个值得提取为独立库以便代码复用的模块。这可能是一个你想在所有应用中复用的库，一个你想作为开源组件分发到生态系统的库，甚至是一个你想出售的库。

在本指南中，你将学习：

- 如何将模块提取为库
- 如何使用 NPM 分发库

## 将模块提取为库

你可以使用 [`create-react-native-library`](https://callstack.github.io/react-native-builder-bob/create) 工具来创建一个新库。此工具会设置一个新库所需的所有样板代码：所有配置文件以及各种平台所需的所有文件。它还带有一个友好的交互式菜单，指导你完成库的创建。

要将模块提取为独立的库，你可以遵循以下步骤：

1. 创建新库
2. 将代码从 App 移动到库
3. 更新代码以反映新结构
4. 发布它。

### 1. 创建一个库

1. 运行以下命令开始创建过程：

```sh
npx create-react-native-library@latest <Name of Your Library>
```

2. 为你的模块添加一个名称。它必须是有效的 npm 名称，所以应该全部小写。你可以使用 `-` 来分隔单词。
3. 为 package 添加描述。
4. 继续填写表单，直到遇到问题 _"你想要开发什么类型的库？"_
   ![你想要开发什么类型的库](/docs/assets/what-library.png)
5. 为了本指南的目的，选择 _Turbo module_ 选项。请注意，你可以为新架构和旧架构创建库。
6. 然后，你可以选择是想要一个访问平台的库（Kotlin & Objective-C）还是一个共享的 C++ 库（Android 和 iOS 通用 C++）。
7. 最后，选择 `Test App` 作为最后一个选项。此选项会在库文件夹内创建一个已配置好的独立应用。

交互式提示完成后，工具会创建一个文件夹，其在 Visual Studio Code 中的结构如下所示：

<img className="half-size" alt="初始化新库后的文件夹结构。" src="/docs/assets/turbo-native-modules/c++visualstudiocode.webp" />

随意探索为你创建的代码。然而，最重要的部分是：

- `android` 文件夹：Android 代码存放于此
- `cpp` 文件夹：C++ 代码存放于此
- `ios` 文件夹：iOS 代码存放于此
- `src` 文件夹：JS 代码存放于此。

`package.json` 已经配置好了我们提供给 `create-react-native-library` 工具的所有信息，包括包名称和描述。请注意，`package.json` 也已经配置为运行 Codegen。

```json
  "codegenConfig": {
    "name": "RN<your module name>Spec",
    "type": "all",
    "jsSrcsDir": "src",
    "outputDir": {
      "ios": "ios/generated",
      "android": "android/generated"
    },
    "android": {
      "javaPackageName": "com.<name-of-the-module>"
    }
  },
```

最后，库已经包含了让库与 iOS 和 Android 链接的所有基础设施。

### 2. 从你的 App 复制代码

本指南的其余部分假设你在应用中有一个本地 Turbo Native Module，它是按照网站其他指南中显示的准则创建的：特定平台的 Turbo Native Modules，或 [跨平台 Turbo Native Modules](./pure-cxx-modules)。但它也适用于组件和旧架构模块及组件。你需要调整需要复制和更新的文件。

<!-- TODO: 添加 Turbo Native Modules 的链接 -->

1. **[旧架构模块和组件不需要]** 将你在应用的 `specs` 文件夹中的代码移动到由 `create-react-native-library` 文件夹创建的 `src` 文件夹中。
2. 更新 `index.ts` 文件以正确导出 Turbo Native Module spec，以便可以从库中访问。例如：

```ts
import NativeSampleModule from './NativeSampleModule';

export default NativeSampleModule;
```

3. 复制原生模块：
   - 用你在应用中为原生模块编写的代码（如果有）替换 `android/src/main/java/com/<name-of-the-module>` 中的代码。
   - 用你在应用中为原生模块编写的代码（如果有）替换 `ios` 文件夹中的代码。
   - 用你在应用中为原生模块编写的代码（如果有）替换 `cpp` 文件夹中的代码。

4. **[旧架构模块和组件不需要]** 更新所有从旧 spec 名称到新 spec 名称的引用，即在库的 `package.json` 的 `codegenConfig` 字段中定义的名称。例如，如果在应用的 `package.json` 中将 `AppSpecs` 设置为 `codegenConfig.name`，而在库中称为 `RNNativeSampleModuleSpec`，则必须将每次出现的 `AppSpecs` 替换为 `RNNativeSampleModuleSpec`。

就是这样！你已经将所有必需的代码从应用中移出并放入独立的库中。

## 测试你的库

`create-react-native-library` 带有一个有用的示例应用，已配置为可与库正常工作。这是测试它的好方法！

如果你查看 `example` 文件夹，你会发现它与你可以从 [`react-native-community/template`](https://github.com/react-native-community/template) 创建的新 React Native 应用结构相同。

要测试你的库：

1. 导航到 `example` 文件夹。
2. 运行 `yarn install` 安装所有依赖项。
3. 仅限 iOS，你需要安装 CocoaPods：`cd ios && pod install`。
4. 从 `example` 文件夹使用 `yarn android` 构建并运行 Android。
5. 从 `example` 文件夹使用 `yarn ios` 构建并运行 iOS。

## 将你的库作为本地模块使用

在某些场景下，你可能希望将库作为应用的本地模块复用，而不将其发布到 NPM。

在这种情况下，你可能会遇到库作为应用的兄弟文件夹存在的情况。

```shell
Development
├── App
└── Library
```

在这种情况下，你也可以使用 `create-react-native-library` 创建的库。

1. 通过导航到 `App` 文件夹并运行 `yarn add ../Library` 将你的库添加到你的应用中。
2. 仅限 iOS，导航到 `App/ios` 文件夹并运行 `bundle exec pod install` 安装你的依赖项。
3. 更新 `App.tsx` 代码以导入库中的代码。例如：

```tsx
import NativeSampleModule from '../Library/src/index';
```

如果你现在运行应用，Metro 将找不到它需要提供给应用的 JS 文件。这是因为 metro 将从 `App` 文件夹开始运行，并且无法访问位于 `Library` 文件夹中的 JS 文件。要解决此问题，让我们按如下方式更新 `metro.config.js` 文件

```diff
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro 配置
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
+ const path = require('path');

- const config = {}
+ const config = {
+  // 使 Metro 能够解析所需的外部依赖项
+  watchFolders: [
+    path.resolve(__dirname, '../Library'),
+  ],
+  resolver: {
+    extraNodeModules: {
+      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
+    },
+  },
+};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

`watchFolders` 配置告诉 Metro 监视某些额外路径中的文件和更改，在本例中是 `../Library` 路径，其中包含你需要的 `src/index` 文件。
`resolver` 属性是必需的，用于向库提供应用使用的 React Native 代码。库可能会引用和导入 React Native 的代码：如果没有额外的 resolver，库中的导入将失败。

此时，你可以像往常一样构建和运行你的应用：

- 从 `example` 文件夹使用 `yarn android` 构建并运行 Android。
- 从 `example` 文件夹使用 `yarn ios` 构建并运行 iOS。

## 在 NPM 上发布库

得益于 `create-react-native-library`，在 NPM 上发布所有内容所需的设置已经就绪。

1. 安装模块中的依赖项 `yarn install`。
2. 运行 `yarn prepare` 构建库。
3. 使用 `yarn release` 发布它。

过了一会儿，你会在 NPM 上找到你的库。要验证这一点，运行：

```bash
npm view <package.name>
```

其中 `package.name` 是你在库初始化期间在 `package.json` 文件中设置的 `name`。

现在，你可以通过运行以下命令在应用中安装库：

```bash
yarn add <package.name>
```

:::note
仅限 iOS，每当你安装一个带有原生代码的新模块时，你必须重新安装 CocoaPods，运行 `bundle exec pod install`（推荐）或 `pod install`（如果你不使用 Ruby 的 Bundler，不推荐）。
:::

恭喜！你发布了你的第一个 React Native 库。
