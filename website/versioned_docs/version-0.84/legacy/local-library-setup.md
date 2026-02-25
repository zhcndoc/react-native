---
id: local-library-setup
title: 本地库设置
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本地库是包含视图或模块且位于你的应用本地的库，未发布到任何注册中心。这与传统的视图和模块设置不同，因为本地库与应用的原生代码是解耦的。

本地库创建在 `android/` 和 `ios/` 文件夹之外，并利用自动链接（autolinking）与应用集成。使用本地库的结构可能如下：

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

由于本地库代码存在于 `android/` 和 `ios/` 文件夹之外，这使得未来升级 React Native 版本、复制到其他项目等操作更加容易。

要创建本地库，我们将使用 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create) 工具。该工具包含了所有必要的模板。

### 开始使用

在你的 React Native 应用根目录下，运行以下命令：

```shell
npx create-react-native-library@latest awesome-module
```

其中 `awesome-module` 是你想为新模块取的名称。完成提示后，在项目根目录下会生成一个名为 `modules` 的新文件夹，里面包含新模块。

### 链接

默认情况下，生成的库会自动使用 Yarn 时的 `link:` 协议或 npm 时的 `file:` 协议链接到项目：

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

这会在 `node_modules` 下创建指向该库的符号链接，从而使自动链接生效。

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

### 在应用内使用模块

要在应用中使用该模块，你可以通过名称导入它：

```js
import {multiply} from 'awesome-module';
```