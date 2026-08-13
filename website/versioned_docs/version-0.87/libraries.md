---
id: libraries
title: 使用 Libraries
author: Brent Vatne
authorURL: 'https://twitter.com/notbrent'
description: 本指南将向 React Native 开发者介绍如何在应用中查找、安装和使用第三方库
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 提供了一组开箱即用的内置 [Core Components and APIs](./components-and-apis)，可在你的应用中直接使用。你并不局限于 React Native 自带的组件和 API。React Native 拥有一个由数千名开发者组成的社区。如果 Core Components and APIs 中没有你要找的内容，你也许可以从社区中找到并安装一个库，为你的应用添加所需功能。

## 选择包管理器

React Native 库通常通过 [npm registry](https://www.npmjs.com/) 使用 [npm CLI](https://docs.npmjs.com/cli/npm) 或 [Yarn Classic](https://classic.yarnpkg.com/en/) 等 Node.js 包管理器进行安装。

如果你的计算机上安装了 Node.js，那么你已经安装了 npm CLI。一些开发者更喜欢使用 Yarn Classic，因为它的安装速度稍快，并且提供了 Workspaces 等额外的高级功能。这两个工具都能很好地与 React Native 配合使用。为了便于说明，本文接下来将使用 npm。

:::note
在 JavaScript 社区中，“library”和“package”这两个术语可以互换使用。
:::

## 安装库

要在项目中安装库，请在终端中进入项目目录并运行安装命令。让我们以 `react-native-webview` 为例：

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

我们安装的库包含原生代码，在使用它之前，需要将其链接到我们的应用。

## 在 iOS 上链接原生代码

React Native 使用 CocoaPods 管理 iOS 项目依赖项，大多数 React Native 库也遵循这一约定。如果你使用的库不遵循这一约定，请参阅其 README 了解其他说明。在大多数情况下，以下说明都适用。

在 `ios` 目录中运行 `pod install`，以便将其链接到我们的原生 iOS 项目。无需切换到 `ios` 目录即可执行此操作的方法是运行 `npx pod-install`。

```bash
npx pod-install
```

完成后，重新构建应用二进制文件，即可开始使用新的库：

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

React Native 使用 Gradle 管理 Android 项目依赖项。安装带有原生依赖项的库后，你需要重新构建应用二进制文件，才能使用新的库：

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

[React Native Directory](https://reactnative.directory) 是一个可搜索的、专门为 React Native 构建的库数据库。这是为 React Native 应用查找库时首先应该查看的地方。

你将在该目录中找到的许多库来自 [React Native Community](https://github.com/react-native-community/) 或 [Expo](https://docs.expo.dev/versions/latest/)。

由 React Native Community 构建的库由志愿者以及依赖 React Native 的公司中的个人开发者推动。这些库通常支持 iOS、tvOS、Android、Windows，但具体情况因项目而异。该组织中的许多库过去曾是 React Native Core Components and APIs。

由 Expo 构建的库全部使用 TypeScript 编写，并且在可能的情况下支持 iOS、Android 和 `react-native-web`。

继 React Native Directory 之后，如果你无法在该目录中找到专门针对 React Native 的库，那么 [npm registry](https://www.npmjs.com/) 是下一个最佳去处。npm registry 是 JavaScript 库的权威来源，但其中列出的库可能并不都与 React Native 兼容。React Native 是众多 JavaScript 编程环境之一，其他环境还包括 Node.js、Web 浏览器、Electron 等，而 npm 包含适用于所有这些环境的库。

## 确定库的兼容性

### 它能与 React Native 配合使用吗？

通常，为*其他平台专门*构建的库无法与 React Native 配合使用。例如，`react-select` 是为 Web 构建的，专门面向 `react-dom`；而 `rimraf` 是为 Node.js 构建的，会与计算机文件系统交互。其他库（如 `lodash`）只使用 JavaScript 语言特性，因此可以在任何环境中运行。随着时间推移，你会逐渐了解这些情况，但在此之前，最简单的确定方法就是亲自尝试。如果结果证明某个包无法在 React Native 中运行，可以使用 `npm uninstall` 删除它。

### 它能在我的应用支持的平台上运行吗？

[React Native Directory](https://reactnative.directory) 允许你按平台兼容性进行筛选，例如 iOS、Android、Web 和 Windows。如果你想使用的库目前未列在其中，请参阅该库的 README 了解更多信息。

### 它能与我的应用所使用的 React Native 版本配合使用吗？

库的最新版本通常与 React Native 的最新版本兼容。如果你使用的是较旧版本，应参阅 README 了解应该安装哪个版本的库。你可以运行 `npm install <library-name>@<version-number>` 来安装库的特定版本，例如：`npm install @react-native-community/netinfo@^2.0.0`。
