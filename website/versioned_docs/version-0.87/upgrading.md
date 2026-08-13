---
id: upgrading
title: 升级到新版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

升级到新版本的 React Native 将让你能够使用更多 API、视图、开发者工具和其他好东西。升级需要付出少量努力，但我们会尽力让升级过程变得简单明了。

## Expo 项目

将 Expo 项目升级到新版本的 React Native，需要更新 `package.json` 文件中的 `react-native`、`react` 和 `expo` 软件包版本。Expo 建议逐步升级 SDK 版本，一次升级一个版本。这样可以帮助你定位升级过程中出现的故障和问题。有关项目升级的最新信息，请参阅 [升级 Expo SDK 指南](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)。

## React Native 项目

由于典型的 React Native 项目本质上由 Android 项目、iOS 项目和 JavaScript 项目组成，因此升级可能相当棘手。[Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 是一个 Web 工具，可通过提供任意两个版本之间发生的完整变更集，帮助你升级应用。它还会显示针对特定文件的注释，帮助你理解为什么需要进行相应更改。

### 1. 选择版本

首先需要选择要从哪个版本升级到哪个版本，默认情况下会选择最新的主要版本。选择完成后，你可以点击“向我展示如何升级”按钮。

💡 主要版本更新会在顶部显示“有用的内容”部分，其中包含升级时可供参考的链接。

### 2. 升级依赖项

显示的第一个文件是 `package.json`，最好更新其中显示的依赖项。例如，如果 `react-native` 和 `react` 显示为变更项，那么你可以运行以下命令将其安装到项目中：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
# {{VERSION}} and {{REACT_VERSION}} are the release versions showing in the diff
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

</TabItem>
<TabItem value="yarn">

```shell
# {{VERSION}} and {{REACT_VERSION}} are the release versions showing in the diff
yarn add react-native@{{VERSION}}
yarn add react@{{REACT_VERSION}}
```

</TabItem>
</Tabs>

### 3. 升级项目文件

新版本可能包含运行 `npx react-native init` 时生成的其他文件的更新，这些文件会列在 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 页面中 `package.json` 之后。如果没有其他变更，那么你只需要重新构建项目即可继续开发。如果存在变更，则需要手动将其应用到项目中。

### 故障排除

#### 我已经完成了所有更改，但我的应用仍在使用旧版本

这类错误通常与缓存有关，建议安装 [react-native-clean-project](https://github.com/pmadruga/react-native-clean-project) 来清除项目的所有缓存，然后再次运行项目。
