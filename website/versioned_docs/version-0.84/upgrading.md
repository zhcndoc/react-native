---
id: upgrading
title: 升级到新版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

升级到新的 React Native 版本将让您使用更多的 API、视图、开发工具及其他好东西。升级需要一些努力，但我们尽力让它对您来说简单明了。

## Expo 项目

将您的 Expo 项目升级到新版本的 React Native 需要更新 `package.json` 文件中的 `react-native`、`react` 和 `expo` 包版本。Expo 推荐逐步升级 SDK 版本，一次升级一个版本。这样做有助于您定位升级过程中出现的破坏和问题。有关升级项目的最新信息，请参阅 [升级 Expo SDK 操作指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)。

## React Native 项目

由于典型的 React Native 项目实质上由 Android 项目、iOS 项目和 JavaScript 项目组成，升级可能相当棘手。[Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 是一个网页工具，可以帮助您升级应用，提供任意两个版本之间的全部变更内容。它还会针对特定文件显示注释，帮助理解为何需要这些变更。

### 1. 选择版本

您首先需要选择要从哪个版本升级到哪个版本，默认选择的是最新的主版本。选择后，您可以点击"Show me how to upgrade"按钮。

💡 主要更新会在顶部显示“有用内容”部分，附有帮助您升级的链接。

### 2. 升级依赖

第一个显示的文件是 `package.json`，建议更新其中显示的依赖。例如，如果 `react-native` 和 `react` 出现在变更中，则可以通过运行以下命令在项目中安装它们：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异中显示的发布版本
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

</TabItem>
<TabItem value="yarn">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异中显示的发布版本
yarn add react-native@{{VERSION}}
yarn add react@{{REACT_VERSION}}
```

</TabItem>
</Tabs>

### 3. 升级项目文件

新版本可能包含对通过运行 `npx react-native init` 生成的其他文件的更新，这些文件在 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 页面中位于 `package.json` 之后列出。如果没有其他变更，您只需重新构建项目即可继续开发。如果有变更，则需要手动将它们应用到您的项目中。

### 故障排除

#### 我已经做了所有更改，但我的应用依然使用旧版本

此类错误通常与缓存有关，建议安装 [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project) 来清除您项目的全部缓存，然后再重新运行。