---
id: upgrading
title: 升级到新版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

升级到新版本的 React Native 将使您能够访问更多的 API、视图、开发者工具和其他功能。升级需要少量的努力，但我们尽量使其变得简单直接。

## Expo 项目

将您的 Expo 项目升级到新版本的 React Native 需要更新 `package.json` 文件中的 `react-native`、`react` 和 `expo` 包版本。Expo 建议逐步升级 SDK 版本，一次一个。这样做将帮助您查明升级过程中出现的破坏和问题。请参阅 [升级 Expo SDK 指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) 获取有关升级项目的最新信息。

## React Native 项目

因为典型的 React Native 项目本质上由一个 Android 项目、一个 iOS 项目和一个 JavaScript 项目组成，所以升级可能相当棘手。[Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 是一个 Web 工具，通过提供任意两个版本之间发生的全部更改集，帮助您在升级应用程序时提供帮助。它还显示特定文件的注释，以帮助理解为什么需要该更改。

### 1. 选择版本

您首先需要选择从哪个版本升级到哪个版本，默认情况下会选择最新的主要版本。选择后，您可以点击按钮“显示如何升级”。

💡 主要更新将在顶部显示一个“有用内容”部分，其中包含链接以帮助您在升级时提供帮助。

### 2. 升级依赖项

显示的第一个文件是 `package.json`，最好更新其中显示的依赖项。例如，如果 `react-native` 和 `react` 显示为更改，则您可以通过运行以下命令将它们安装到您的项目中：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异对比中显示的发布版本
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

</TabItem>
<TabItem value="yarn">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异对比中显示的发布版本
yarn add react-native@{{VERSION}}
yarn add react@{{REACT_VERSION}}
```

</TabItem>
</Tabs>

### 3. 升级项目文件

新版本可能包含对您运行 `npx react-native init` 时生成的其他文件的更新，这些文件列在 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 页面的 `package.json` 之后。如果没有其他更改，您只需要重新构建项目即可继续开发。如果有更改，您需要手动将它们应用到您的项目中。

### 故障排除

#### 我已完成了所有更改，但我的应用仍在使用旧版本

这类错误通常与缓存有关，建议安装 [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project) 以清除项目的所有缓存，然后您可以再次运行它。
