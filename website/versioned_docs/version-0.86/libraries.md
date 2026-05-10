---
id: libraries
title: 使用库
author: Brent Vatne
authorURL: 'https://twitter.com/notbrent'
description: 本指南介绍 React Native 开发者如何在应用中查找、安装并使用第三方库。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 提供了一组内置的[核心组件和 API](./components-and-apis)，可直接在你的应用中使用。你并不局限于 React Native 捆绑的组件和 API。React Native 拥有由成千上万名开发者组成的社区。如果核心组件和 API 中没有你要找的内容，你也许可以从社区中找到并安装一个库，为你的应用添加所需功能。

## 选择包管理器

React Native 库通常通过 [npm registry](https://www.npmjs.com/) 使用 Node.js 包管理器安装，例如 [npm CLI](https://docs.npmjs.com/cli/npm) 或 [Yarn Classic](https://classic.yarnpkg.com/en/)。

如果你的电脑上安装了 Node.js，那么你也已经安装了 npm CLI。一些开发者更喜欢使用 Yarn Classic，因为它安装速度略快，并且还有像 Workspaces 这样的高级功能。两种工具都能很好地与 React Native 配合使用。为了便于说明，接下来的内容我们默认使用 npm。

:::note
在 JavaScript 社区中，“library”和“package”这两个术语可以互换使用。
:::

## 安装库

要在项目中安装一个库，请在终端中进入项目目录并运行安装命令。我们以 `react-native-webview` 为例：

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

我们安装的这个库包含原生代码，在使用之前需要将其链接到我们的应用。

## 在 iOS 上链接原生代码

React Native 使用 CocoaPods 来管理 iOS 项目依赖，大多数 React Native 库也遵循同样的约定。如果你使用的库不是这样，请参考它的 README 获取更多说明。在大多数情况下，以下说明都适用。

在 `ios` 目录中运行 `pod install`，以将其链接到我们的原生 iOS 项目。如果不切换到 `ios` 目录，也可以通过运行 `npx pod-install` 来快捷完成。

```bash
npx pod-install
```

完成后，重新构建应用二进制文件以开始使用你的新库：

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

React Native 使用 Gradle 来管理 Android 项目依赖。安装带有原生依赖的库后，你需要重新构建应用二进制文件才能使用新库：

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

[React Native Directory](https://reactnative.directory) 是一个可搜索的库数据库，专门为 React Native 构建。这是为你的 React Native 应用查找库的首选之处。

你在该目录中找到的许多库都来自 [React Native Community](https://github.com/react-native-community/) 或 [Expo](https://docs.expo.dev/versions/latest/)。

由 React Native Community 构建的库由志愿者以及依赖 React Native 的公司中的个人共同维护。它们通常支持 iOS、tvOS、Android、Windows，但这会因项目而异。该组织中的许多库曾经是 React Native 的核心组件和 API。

由 Expo 构建的库都使用 TypeScript 编写，并在可能的情况下支持 iOS、Android 和 `react-native-web`。

如果你在 React Native Directory 中找不到专门适用于 React Native 的库，那么 [npm registry](https://www.npmjs.com/) 是下一个最好的地方。npm registry 是 JavaScript 库的权威来源，但它列出的库并不一定都与 React Native 兼容。React Native 只是众多 JavaScript 编程环境之一，包括 Node.js、Web 浏览器、Electron 等，而 npm 包含适用于所有这些环境的库。

## 判断库的兼容性

### 它能和 React Native 一起工作吗？

通常，_专门为其他平台构建的_库不能与 React Native 一起工作。例子包括 `react-select`，它为 Web 构建并且专门面向 `react-dom`；以及 `rimraf`，它为 Node.js 构建并与计算机文件系统交互。像 `lodash` 这样的其他库只使用 JavaScript 语言特性，因此可以在任何环境中工作。随着时间推移，你会逐渐形成这方面的判断；但在那之前，最简单的方法就是亲自试一下。如果它最终不能在 React Native 中工作，你可以使用 `npm uninstall` 将其移除。

### 它能在我的应用支持的平台上运行吗？

[React Native Directory](https://reactnative.directory) 允许你按平台兼容性进行筛选，例如 iOS、Android、Web 和 Windows。如果你想使用的库目前没有列在那里，请参考该库的 README 了解更多信息。

### 它与我应用所使用的 React Native 版本兼容吗？

库的最新版本通常与最新版本的 React Native 兼容。如果你使用的是较旧版本，应参考 README 了解你应该安装哪个版本的库。你可以通过运行 `npm install <library-name>@<version-number>` 来安装特定版本的库，例如：`npm install @react-native-community/netinfo@^2.0.0`。
