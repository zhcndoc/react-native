---
id: set-up-your-environment
title: 设置你的开发环境
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';

import GuideLinuxAndroid from './\_getting-started-linux-android.md';
import GuideMacOSAndroid from './\_getting-started-macos-android.md';
import GuideWindowsAndroid from './\_getting-started-windows-android.md';
import GuideMacOSIOS from './\_getting-started-macos-ios.md';

在本指南中，你将学习如何设置开发环境，以便使用 Android Studio 和 Xcode 运行你的项目。这将允许你使用 Android 模拟器和 iOS 模拟器进行开发，本地构建你的应用等等。

:::info
本指南需要安装 Android Studio 或 Xcode。如果你已经安装了其中一个程序，你应该能在几分钟内完成准备工作。如果尚未安装，你需要花约一小时进行安装和配置。

<details>
<summary>是否必须设置环境？</summary>

如果你使用的是 [框架](/architecture/glossary#react-native-framework)，则不必设置环境。使用 React Native 框架时，无需安装 Android Studio 或 Xcode，框架会帮你构建原生应用。

如果你受限而不能使用框架，或者希望自己编写框架，那么设置本地环境就是必需的。环境搭建完成后，可以学习如何 [不使用框架开始开发](getting-started-without-a-framework)。

</details>
:::

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

#### 目标操作系统

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

[//]: # 'macOS, Android'

<GuideMacOSAndroid/>

</TabItem>
<TabItem value="ios">

[//]: # 'macOS, iOS'

<GuideMacOSIOS/>

</TabItem>
</Tabs>

</TabItem>
<TabItem value="windows">

#### 目标操作系统

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

[//]: # 'Windows, Android'

<GuideWindowsAndroid/>

</TabItem>
<TabItem value="ios">

[//]: # 'Windows, iOS'

## 不支持

:::info
构建带有原生代码的 iOS 项目需要 Mac 电脑。你可以使用 [Expo Go](https://expo.dev/go)（来自 [Expo](environment-setup#start-a-new-react-native-project-with-expo)）在你的 iOS 设备上开发应用。
:::

</TabItem>
</Tabs>

</TabItem>
<TabItem value="linux">

#### 目标操作系统

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

[//]: # 'Linux, Android'

<GuideLinuxAndroid/>

</TabItem>
<TabItem value="ios">

[//]: # 'Linux, iOS'

## 不支持

:::info
构建带有原生代码的 iOS 项目需要 Mac 电脑。你可以使用 [Expo Go](https://expo.dev/go)（来自 [Expo](environment-setup#start-a-new-react-native-project-with-expo)）在你的 iOS 设备上开发应用。
:::

</TabItem>
</Tabs>

</TabItem>
</Tabs>