---
id: libraries
title: 使用库
author: Brent Vatne
authorURL: 'https://twitter.com/notbrent'
description: 本指南介绍 React Native 开发者如何在应用中查找、安装和使用第三方库。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 提供了一套内置的 [核心组件和 API](./components-and-apis)，可以直接在你的应用中使用。但你并不局限于 React Native 自带的组件和 API。React Native 拥有数千名开发者组成的社区。如果核心组件和 API 中没有你需要的功能，你或许可以在社区里找到并安装相应的库，为你的应用添加该功能。

## 选择包管理器

React Native 库通常通过 Node.js 包管理器从 [npm 注册表](https://www.npmjs.com/) 安装，比如使用 [npm CLI](https://docs.npmjs.com/cli/npm) 或 [Yarn Classic](https://classic.yarnpkg.com/en/)。

如果你的电脑上已经安装了 Node.js，那么 npm CLI 也已经安装好了。一些开发者偏好使用 Yarn Classic，因其安装速度稍快，同时还提供了如工作区（Workspaces）等高级功能。两者都非常适合用于 React Native。为了简化说明，本文后续将默认使用 npm。

:::note
在 JavaScript 社区中，"library"（库）和"package"（包）两个术语通常可以互换使用。
:::

## 安装库

要在项目中安装库，请在终端进入你的项目目录，并运行安装命令。这里以 `react-native-webview` 为例：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm install react-native-webview
```

</TabItem>
<TabItem value="yarn">

```shell
yarn add react-native-webview
```

</TabItem>
</Tabs>

我们安装的这个库包含了原生代码，使用前需要先与应用进行链接。

## 在 iOS 上链接原生代码

React Native 使用 CocoaPods 来管理 iOS 项目依赖，大多数 React Native 库都遵循这一约定。如果你使用的库不支持，请参考该库的 README 获取更多说明。大多数情况下，以下操作适用。

在 `ios` 目录下运行 `pod install`，以链接该库到原生 iOS 项目中。无需切换目录的快捷方式是运行 `npx pod-install`。

```bash
npx pod-install
```

完成后，重新构建应用二进制文件，即可开始使用新库：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios
```

</TabItem>
</Tabs>

## 在 Android 上链接原生代码

React Native 使用 Gradle 来管理 Android 项目依赖。安装包含原生依赖的库后，需要重新构建应用二进制文件来使用新库：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

## 查找库

[React Native Directory](https://reactnative.directory) 是一个为 React Native 专门打造的可搜索库数据库。这里是你寻找 React Native 库的首选之地。

目录中的许多库都来自 [React Native Community](https://github.com/react-native-community/) 或 [Expo](https://docs.expo.dev/versions/latest/)。

React Native Community 由志愿者和依赖 React Native 的公司个人推动，库通常支持 iOS、tvOS、Android、Windows，但不同项目支持的具体平台会有所不同。很多库曾是 React Native 核心组件和 API。

Expo 构建的库均使用 TypeScript 编写，尽可能支持 iOS、Android 和 `react-native-web`。

如果在 React Native Directory 未能找到合适库，接下来推荐在 [npm 注册表](https://www.npmjs.com/) 中搜索。npm 注册表是 JavaScript 库的权威来源，但其列出的库不一定都兼容 React Native。React Native 是众多 JavaScript 运行环境中的一种，包括 Node.js、网页浏览器、Electron 等，npm 包含适用于所有这些环境的库。

## 判断库的兼容性

### 它能在 React Native 上运行吗？

通常专为其他平台构建的库不会兼容 React Native。例如，`react-select` 是为网页构建的，专门针对 `react-dom`；`rimraf` 是为 Node.js 构建，与计算机文件系统打交道。还有像 `lodash` 这类只使用 JavaScript 语言特性的库，可以在任何环境运行。随着经验积累，你会更擅长判断，暂时不确定时，最简单的办法是亲自尝试。如果发现不兼容 React Native，可以使用 `npm uninstall` 移除包。

### 它支持我的应用目标平台吗？

[React Native Directory](https://reactnative.directory) 允许你按平台兼容性筛选，比如 iOS、Android、Web 和 Windows。如果你想用的库未列在目录中，请参考该库的 README 了解更多信息。

### 它支持我当前使用的 React Native 版本吗？

库的最新版本通常兼容 React Native 的最新版本。如果你使用的是旧版本，应查阅 README 了解该库对应的 React Native 版本。你可以安装指定版本的库，例如：运行 `npm install <库名>@<版本号>`，示例：`npm install @react-native-community/netinfo@^2.0.0`。