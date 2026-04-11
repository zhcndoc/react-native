---
id: local-library-setup
title: 本地库设置
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本地库是一个包含视图或模块的库，它位于你的应用程序本地，未发布到注册表。这与传统的视图和模块设置不同，因为本地库与应用程序的原生代码是解耦的。

本地库创建在 `android/` 和 `ios/` 文件夹之外，并利用自动链接（autolinking）与你的应用程序集成。带有本地库的结构可能如下所示：

```plaintext
MyApp
├── node_modules
├── modules <-- 你的本地库文件夹
│ └── awesome-module <-- 你的本地库
├── android
├── ios
├── src
├── index.js
└── package.json
```

由于本地库的代码存在于 `android/` 和 `ios/` 文件夹之外，因此将来升级 React Native 版本、复制到其他项目等会更加容易。

要创建本地库，我们将使用 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create)。此工具包含所有必要的模板。

### 开始使用

在 React Native 应用程序的根文件夹内，运行以下命令：

```shell
npx create-react-native-library@latest awesome-module
```

其中 `awesome-module` 是你想要为新模块指定的名称。完成提示后，你将在项目的根目录中拥有一个名为 `modules` 的新文件夹，其中包含新模块。

### 链接

默认情况下，生成的库在使用 Yarn 时使用 `link:` 协议自动链接到项目，在使用 npm 时使用 `file:` 协议：

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

这会在 `node_modules` 下创建指向库的符号链接，从而使自动链接生效。

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

### 在应用程序中使用模块

要在应用程序中使用该模块，你可以通过其名称导入它：

```js
import {multiply} from 'awesome-module';
```
