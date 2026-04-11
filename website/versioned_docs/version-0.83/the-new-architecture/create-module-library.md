# 为你的模块创建一个库

React Native 拥有丰富的库生态系统，用来解决常见问题。我们在 [reactnative.directory](https://reactnative.directory) 网站上收集了 React Native 的库，这是每个 React Native 开发者都值得收藏的宝贵资源。

有时，你可能正在开发一个值得提取到独立库中的模块，以便代码复用。这个库可以是你想在所有应用中复用的库，也可以是你想作为开源组件分发给生态系统的库，甚至是你想出售的库。

在本指南中，你将学习：

- 如何将模块提取成库
- 如何使用 NPM 分发库

## 将模块提取成库

你可以使用 [`create-react-native-library`](https://callstack.github.io/react-native-builder-bob/create) 工具来创建一个新的库。该工具会搭建一个新的库及所需的所有样板代码：所有配置文件以及各个平台所需的文件。它还带有一个不错的交互式菜单，帮助你完成库的创建。

将模块提取成独立库，你可以按以下步骤操作：

1. 创建新的库
2. 将代码从 App 迁移到库里
3. 更新代码以反映新的结构
4. 发布库。

### 1. 创建库

1. 运行以下命令开始创建过程：

```sh
npx create-react-native-library@latest <你的库名称>
```

2. 输入你模块的名称，必须是有效的 npm 名称，因此应全小写。可以用 `-` 分隔单词。
3. 添加包的描述。
4. 继续填写表单，直到到达“你想开发哪种类型的库？”这一题目
   ![库的类型](/docs/assets/what-library.png)
5. 本指南中，选择 _Turbo module_（高速模块）选项。注意你可以创建新架构和传统架构的库。
6. 然后，你可以选择是要访问平台代码（Kotlin 和 Objective-C），还是要共享 C++ 库（适用于 Android 和 iOS）。
7. 最后选择 `Test App` 作为最后选项。该选项会创建一个库，同时包含一个已配置好的独立测试应用。

交互式提示完成后，工具会创建一个文件夹，其结构在 Visual Studio Code 中如下图所示：

<img className="half-size" alt="新库初始化后的文件夹结构" src="/docs/assets/turbo-native-modules/c++visualstudiocode.webp" />

你可以自由探索为你创建的代码。不过最重要的部分是：

- `android` 文件夹：存放 Android 代码
- `cpp` 文件夹：存放 C++ 代码
- `ios` 文件夹：存放 iOS 代码
- `src` 文件夹：存放 JS 代码

`package.json` 已根据我们填写的信息，配置了所有内容，包括包名和描述。注意，`package.json` 也已配置好用于运行 Codegen。

```json
  "codegenConfig": {
    "name": "RN<你的模块名>Spec",
    "type": "all",
    "jsSrcsDir": "src",
    "outputDir": {
      "ios": "ios/generated",
      "android": "android/generated"
    },
    "android": {
      "javaPackageName": "com.<模块名>"
    }
  },
```

最后，库已预配置好支持与 iOS 和 Android 代码的链接。

### 2. 从你的应用复制代码

本指南后续部分假设你在应用中已有本地 Turbo Native Module，按照网站其他教程（平台特定 Turbo Native Modules，或 [跨平台 Turbo Native Modules](./pure-cxx-modules)）创建。但它也适用于组件及传统架构的模块和组件。你需要根据实际情况调整要复制的文件并更新。

<!-- TODO: 添加 Turbo Native Modules 的相关链接 -->

1. **[传统架构模块和组件则无此步骤]** 将你应用中 `specs` 文件夹里的代码移到 `create-react-native-library` 创建的 `src` 文件夹。
2. 更新 `index.ts` 文件，正确导出 Turbo Native Module 规范，使其能从库访问。例如：

```ts
import NativeSampleModule from './NativeSampleModule';

export default NativeSampleModule;
```

3. 复制原生模块代码：
   - 替换 `android/src/main/java/com/<模块名>` 下的代码为你应用中写好的原生模块代码（如果有的话）。
   - 替换 `ios` 文件夹的代码为你应用中写好的原生模块代码（如果有的话）。
   - 替换 `cpp` 文件夹的代码为你应用中写好的原生模块代码（如果有的话）。

4. **[传统架构模块和组件则无此步骤]** 将之前的 spec 名称所有引用更新为库中 `package.json` 的 `codegenConfig` 字段定义的新 spec 名称。例如，如果你应用中 `package.json` 里设置了 `AppSpecs` 作为 `codegenConfig.name`，而库中称为 `RNNativeSampleModuleSpec`，则需把所有 `AppSpecs` 替换为 `RNNativeSampleModuleSpec`。

就这样！你已将所有必需的代码从应用中移至独立库。

## 测试你的库

`create-react-native-library` 自带一个有用的示例应用，已配置好可与库正常工作。测试库的一个绝佳方式！

查看 `example` 文件夹，你可以看到和使用 [`react-native-community/template`](https://github.com/react-native-community/template) 创建的新 React Native 应用结构相同。

测试库步骤：

1. 进入 `example` 文件夹。
2. 运行 `yarn install` 安装所有依赖。
3. 仅 iOS 需要，进入 `ios` 目录执行 `pod install`（CocoaPods 安装）。
4. 在 `example` 文件夹，构建并运行 Android：`yarn android`。
5. 在 `example` 文件夹，构建并运行 iOS：`yarn ios`。

## 以本地模块形式使用库

有些场景下，你可能想将库作为本地模块复用，而不发布到 NPM。

此时，你的目录可能如下所示：

```shell
Development
├── App
└── Library
```

你也可以使用 `create-react-native-library` 创建的库。

1. 进入 `App` 文件夹，运行：

```
yarn add ../Library
```

2. 仅 iOS 需要，进入 `App/ios` 文件夹，运行：

```
bundle exec pod install
```

安装依赖。

3. 更新你的 `App.tsx` 以从你的库中导入代码。例如：

```tsx
import NativeSampleModule from '../Library/src/index';
```

如果现在运行应用，Metro 会找不到需要服务的 JS 文件。这是因为 Metro 以 `App` 文件夹作为起点，无法访问夹在旁边的 `Library` 文件夹内的 JS 文件。解决方法是更新 `metro.config.js`：

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
+  // 让 Metro 能解析额外依赖
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

`watchFolders` 配置告诉 Metro 监听一些额外路径中的文件变化，这里是 `../Library` 路径（包含你需要的 `src/index` 文件）。
`resolver` 属性则为库提供 React Native 代码，确保库里对 React Native 的引用不出错。

此时，你可以像平常一样构建运行你的应用：

- 在 `example` 文件夹构建并运行 Android：`yarn android`
- 在 `example` 文件夹构建并运行 iOS：`yarn ios`

## 将库发布到 NPM

感谢 `create-react-native-library`，发布配置已就绪。

1. 在你的模块目录，安装依赖：

```
yarn install
```

2. 构建库：

```
yarn prepare
```

3. 发布：

```
yarn release
```

等上一会，你就能在 NPM 上找到你的库。验证方式：

```bash
npm view <package.name>
```

这里的 `package.name` 是你初始化库时在 `package.json` 中设置的 `name`。

现在，你可以运行以下命令在你的应用中安装该库：

```bash
yarn add <package.name>
```

:::note
仅 iOS：每当你安装带有原生代码的新模块时，都需要重新安装 CocoaPods，方法是运行 `bundle exec pod install`（推荐）或者 `pod install`（如果你没使用 Ruby Bundler，不推荐）。
:::

恭喜！你发布了你的第一个 React Native 库。