---
id: local-library-setup
title: 本地库设置
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本地库是一个包含视图或模块的库，它位于你的应用本地，并且不会发布到注册表。这与视图和模块的传统设置不同，因为本地库与应用的原生代码是解耦的。

本地库是在 `android/` 和 `ios/` 文件夹之外创建的，并通过自动链接与你的应用集成。使用本地库的结构可能如下所示：

```plaintext
MyApp
├── node_modules
├── modules <-- 本地库所在的文件夹
│ └── awesome-module <-- 你的本地库
├── android
├── ios
├── src
├── index.js
└── package.json
```

由于本地库的代码存在于 `android/` 和 `ios/` 文件夹之外，因此未来升级 React Native 版本、复制到其他项目等会更容易。

要创建本地库，我们将使用 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create)。这个工具包含所有必要的模板。

### 开始使用

在你的 React Native 应用根目录中，运行以下命令：

```shell
npx create-react-native-library@latest awesome-module
```

其中 `awesome-module` 是你为新模块想要使用的名称。完成提示后，你会在项目根目录中得到一个名为 `modules` 的新文件夹，其中包含这个新模块。

### 链接

默认情况下，生成的库会在使用 Yarn 时通过 `link:` 协议自动链接到项目，在使用 npm 时通过 `file:` 协议自动链接：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>

<TabItem value="npm">

```json
"dependencies": {
  "awesome-module": "file:./modules/awesome-module"
}
```

</TabItem>
<TabItem value="yarn">

```json
"dependencies": {
  "awesome-module": "link:./modules/awesome-module"
}
```

</TabItem>
</Tabs>

这会在 `node_modules` 下为该库创建一个符号链接，从而使自动链接正常工作。

### 安装依赖

要链接该模块，你需要安装依赖：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>

<TabItem value="npm">

```shell
npm install
```

</TabItem>
<TabItem value="yarn">

```shell
yarn install
```

</TabItem>
</Tabs>

### 在你的应用中使用模块

要在你的应用中使用该模块，你可以通过名称导入它：

```js
import {multiply} from 'awesome-module';
```
