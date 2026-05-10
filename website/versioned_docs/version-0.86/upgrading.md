---
id: upgrading
title: 升级到新版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

升级到新版 React Native 将使你能够使用更多 API、视图、开发者工具和其他好东西。升级需要少量工作，但我们会尽量让它变得简单明了。

## Expo 项目

将你的 Expo 项目升级到新版 React Native 需要在你的 `package.json` 文件中更新 `react-native`、`react` 和 `expo` 包版本。Expo 建议逐步升级 SDK 版本，一次升级一个版本。这样做将帮助你找出升级过程中出现的破坏性变更和问题。有关升级项目的最新信息，请参阅 [Expo SDK 升级指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)。

## React Native 项目

由于典型的 React Native 项目本质上由 Android 项目、iOS 项目和 JavaScript 项目组成，因此升级可能相当棘手。[Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 是一个网页工具，通过提供任意两个版本之间发生的完整更改集，来帮助你升级应用。它还会显示特定文件上的注释，以帮助理解为什么需要这些更改。

### 1. 选择版本

你首先需要选择要从哪个版本升级到哪个版本，默认会选择最新的主版本。选择后，你可以点击“Show me how to upgrade”按钮。

💡 主版本更新会在顶部显示一个“有用内容”部分，其中包含帮助你升级的链接。

### 2. 升级依赖项

首先显示的文件是 `package.json`，最好更新其中显示的依赖项。例如，如果 `react-native` 和 `react` 作为变更项出现，那么你可以通过运行以下命令将它们安装到你的项目中：

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

### 3. 升级你的项目文件

新版本可能包含对你运行 `npx react-native init` 时生成的其他文件的更新，这些文件列在 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 页面中 `package.json` 之后。如果没有其他更改，那么你只需要重新构建项目即可继续开发。如果有更改，你需要手动将它们应用到你的项目中。

### 故障排查

#### 我已经完成了所有更改，但我的应用仍然使用旧版本

这类错误通常与缓存有关，建议安装 [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project) 来清除你项目的所有缓存，然后你可以再次运行它。
