---
id: local-library-setup
title: 本地库设置
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本地库是包含视图或模块的库，它属于你的应用本地库，并未发布到注册表。这与传统的视图和模块设置不同，因为本地库与应用的原生代码解耦。

本地库创建在 `android/` 和 `ios/` 文件夹之外，并使用自动链接来集成到你的应用中。使用本地库时，结构可能如下所示：

```plaintext
MyApp
├── node_modules
├── modules <-- folder for your local libraries
│ └── awesome-module <-- your local library
├── android
├── ios
├── src
├── index.js
└── package.json
```

由于本地库的代码位于 `android/` 和 `ios/` 文件夹之外，因此未来升级 React Native 版本、复制到其他项目等操作会更加容易。

要创建本地库，我们将使用 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create)。此工具包含所有必要的模板。

### 入门

在你的 React Native 应用的根文件夹中，运行以下命令：

```shell
npx create-react-native-library@latest awesome-module
```

其中，`awesome-module` 是你希望新模块使用的名称。完成提示中的操作后，项目根目录中将出现一个名为 `modules` 的新文件夹，其中包含新模块。

### 链接

默认情况下，使用 Yarn 时，生成的库会通过 `link:` 协议自动链接到项目；使用 npm 时，则通过 `file:` 协议自动链接到项目：

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

这会在 `node_modules` 下为库创建一个符号链接，从而使自动链接正常工作。

### 安装依赖

要链接模块，你需要安装依赖：

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

### 在应用中使用模块

要在应用中使用该模块，可以通过其名称导入：

```js
import {multiply} from 'awesome-module';
```
