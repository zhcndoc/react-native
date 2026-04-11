---
id: set-up-your-environment
title: 设置您的环境
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';

import GuideLinuxAndroid from './\_getting-started-linux-android.md';
import GuideMacOSAndroid from './\_getting-started-macos-android.md';
import GuideWindowsAndroid from './\_getting-started-windows-android.md';
import GuideMacOSIOS from './\_getting-started-macos-ios.md';

在本指南中，您将学习如何设置您的环境，以便您可以使用 Android Studio 和 Xcode 运行您的项目。这将允许您使用 Android 模拟器和 iOS 模拟器进行开发，在本地构建您的应用，等等。

:::note
本指南需要 Android Studio 或 Xcode。如果您已经安装了其中一个程序，您应该能够在几分钟内启动并运行。如果未安装，您应该预计花费大约一个小时来安装和配置它们。

<details>
<summary>是否需要设置我的环境？</summary>

如果您使用的是 [框架](/architecture/glossary#react-native-framework)，则不需要设置您的环境。使用 React Native 框架，您不需要设置 Android Studio 或 Xcode，因为它会为您处理原生应用的构建。

如果您有限制阻止您使用框架，或者您想编写自己的框架，那么设置本地环境是必须的。设置好环境后，了解如何 [在不使用框架的情况下开始](getting-started-without-a-framework)。

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

> 构建带有 iOS 原生代码的项目需要 Mac。您可以使用 [Expo](environment-setup#start-a-new-react-native-project-with-expo) 的 [Expo Go](https://expo.dev/go) 在您的 iOS 设备上开发应用。

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

> 构建带有 iOS 原生代码的项目需要 Mac。您可以使用 [Expo](environment-setup#start-a-new-react-native-project-with-expo) 的 [Expo Go](https://expo.dev/go) 在您的 iOS 设备上开发应用。

</TabItem>
</Tabs>

</TabItem>
</Tabs>
