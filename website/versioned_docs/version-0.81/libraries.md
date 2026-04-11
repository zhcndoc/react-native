---
id: libraries
title: 使用库
author: Brent Vatne
authorURL: 'https://twitter.com/notbrent'
description: 本指南向 React Native 开发者介绍如何在他们的应用中查找、安装和使用第三方库。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 提供了一组内置的 [核心组件和 API](./components-and-apis) 可供你在应用中使用。你并不局限于 React Native  bundled 的组件和 API。React Native 拥有一个数千名开发者的社区。如果核心组件和 API 没有你想要的功能，你可能能够从社区中找到并安装一个库来为你的应用添加该功能。

## 选择包管理器

React Native 库通常使用 Node.js 包管理器（如 [npm CLI](https://docs.npmjs.com/cli/npm) 或 [Yarn Classic](https://classic.yarnpkg.com/en/)）从 [npm registry](https://www.npmjs.com/) 安装。

如果你的电脑上安装了 Node.js，那么你已经安装了 npm CLI。有些开发者更喜欢使用 Yarn Classic，因为它安装速度稍快，并具有工作区（Workspaces）等额外的高级功能。这两个工具都与 React Native 配合得很好。为了简化说明，本指南的其余部分我们将假设使用 npm。

:::note
在 JavaScript 社区中，术语"library"（库）和"package"（包）是互换使用的。
:::

## 安装库

要在项目中安装库，请在终端中导航到你的项目目录并运行安装命令。让我们用 `react-native-webview` 来试试：

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

我们安装的库包含原生代码，在使用之前我们需要将其链接到我们的应用。

## 在 iOS 上链接原生代码

React Native 使用 CocoaPods 来管理 iOS 项目依赖，大多数 React Native 库都遵循同样的约定。如果你使用的库没有遵循，请参考其 README 获取额外说明。在大多数情况下，将适用以下说明。

在我们的 `ios` 目录中运行 `pod install` 以便将其链接到我们的原生 iOS 项目。有一个无需切换到 `ios` 目录即可执行此操作的快捷方式，即运行 `npx pod-install`。

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

React Native 使用 Gradle 来管理 Android 项目依赖。安装具有原生依赖的库后，你需要重新构建应用二进制文件以使用你的新库：

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

[React Native Directory](https://reactnative.directory) 是专门为 React Native 构建的库的可搜索数据库。这是为你的 React Native 应用查找库的首选之地。

你在目录中找到的许多库来自 [React Native Community](https://github.com/react-native-community/) 或 [Expo](https://docs.expo.dev/versions/latest/)。

由 React Native Community 构建的库由志愿者和依赖 React Native 的公司的个人驱动。它们通常支持 iOS、tvOS、Android、Windows，但这因项目而异。该组织中的许多库曾经是 React Native 核心组件和 API。

由 Expo 构建的库都使用 TypeScript 编写，并在可能的情况下支持 iOS、Android 和 `react-native-web`。

在 React Native Directory 之后，如果你在目录上找不到专门针对 React Native 的库，[npm registry](https://www.npmjs.com/) 是下一个最佳选择。npm registry 是 JavaScript 库的权威来源，但它列出的库可能并不都与 React Native 兼容。React Native 是众多 JavaScript 编程环境之一，包括 Node.js、Web 浏览器、Electron 等，而 npm 包含适用于所有这些环境的库。

## 确定库的兼容性

### 它是否适用于 React Native？

通常，_专门为其他平台构建_ 的库将无法与 React Native 一起工作。例如包括为 Web 构建并专门针对 `react-dom` 的 `react-select`，以及为 Node.js 构建并与你的计算机系统文件系统交互的 `rimraf`。其他像 `lodash` 这样的库仅使用 JavaScript 语言特性，可在任何环境中工作。随着时间的推移你会对此有所了解，但在那之前，最简单的找出方法是亲自尝试。如果结果证明它在 React Native 中无法工作，你可以使用 `npm uninstall` 删除包。

### 它是否适用于我的应用支持的平台？

[React Native Directory](https://reactnative.directory) 允许你按平台兼容性进行过滤，例如 iOS、Android、Web 和 Windows。如果你想使用的库目前未列在那里，请参考该库的 README 以了解更多信息。

### 它是否适用于我的应用版本的 React Native？

库的最新版本通常与最新版本的 React Native 兼容。如果你使用的是较旧的版本，你应该参考 README 以了解你应该安装哪个版本的库。你可以通过运行 `npm install <library-name>@<version-number>` 来安装特定版本的库，例如：`npm install @react-native-community/netinfo@^2.0.0`。
