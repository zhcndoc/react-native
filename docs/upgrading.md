---
id: upgrading
title: 升级到新版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

升级到新版 React Native 将让你能够使用更多 API、视图、开发者工具和其他实用功能。升级需要付出少量努力，但我们会尽力让过程变得简单明了。

## Expo 项目

将您的 Expo 项目升级到新的 React Native 版本，需要更新 `package.json` 文件中的 `react-native`、`react` 和 `expo` 软件包版本。Expo 建议逐步升级 SDK 版本，每次升级一个版本。这样做有助于您确定升级过程中出现的故障和问题。有关升级项目的最新信息，请参阅 [Expo SDK 升级指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)。

## React Native 项目

由于典型的 React Native 项目本质上由 Android 项目、iOS 项目和 JavaScript 项目组成，因此升级可能会比较棘手。[Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 是一个 Web 工具，通过提供任意两个版本之间发生的全部变更，帮助你升级应用。它还会针对特定文件显示注释，帮助你理解为什么需要进行这些变更。

### 1. 选择版本

首先需要选择要从哪个版本升级到哪个版本，默认会选择最新的主要版本。选择完成后，你可以点击“告诉我如何升级”按钮。

💡 主要版本更新会在顶部显示“实用内容”部分，其中包含一些链接，可在升级时为你提供帮助。

### 2. 升级依赖项

首先显示的是 `package.json` 文件，建议更新其中显示的依赖项。例如，如果变更中出现了 `react-native` 和 `react`，那么可以通过运行以下命令在项目中安装它们：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异对比中显示的发行版本
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

</TabItem>
<TabItem value="yarn">

```shell
# {{VERSION}} 和 {{REACT_VERSION}} 是差异对比中显示的发行版本
yarn add react-native@{{VERSION}}
yarn add react@{{REACT_VERSION}}
```

</TabItem>
</Tabs>

### 3. 升级项目文件

新版本可能会包含其他文件的更新，这些文件是在运行 `npx react-native init` 时生成的，它们会列在 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 页面中 `package.json` 文件之后。如果没有其他变更，那么只需重新构建项目即可继续开发。如果存在变更，则需要手动将其应用到项目中。

### 故障排除

#### 我已经完成了所有变更，但我的应用仍在使用旧版本

这类错误通常与缓存有关，建议安装 [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project) 来清除项目的所有缓存，然后重新运行项目。
