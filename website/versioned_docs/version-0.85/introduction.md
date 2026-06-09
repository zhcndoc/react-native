---
id: getting-started
title: 简介
description: 这份有益的指南列出了学习 React Native 的先决条件、如何使用本文档以及如何设置环境。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="content-banner">
  欢迎踏上您的 React Native 之旅的起点！如果您正在寻找入门说明，它们已移至 <a href="environment-setup">它们自己的部分</a>。继续阅读以了解文档介绍、原生组件、React 等内容！
  <img className="content-banner-img" src="/docs/assets/p_android-ios-devices.svg" alt=" " />
</div>

许多不同类型的人都在使用 React Native：从高级 iOS 开发者到 React 初学者，再到职业生涯中第一次开始编程的人。本文档是为所有学习者编写的，无论他们的经验水平或背景如何。

## 如何使用本文档

您可以从这里开始，像读书一样线性地阅读本文档；或者您可以阅读您需要的特定部分。已经熟悉 React 了？您可以跳过 [该部分](intro-react)——或者阅读它以作为简单的复习。

## 先决条件

要使用 React Native 工作，您需要了解 JavaScript 基础知识。如果您是 JavaScript 新手或需要复习，可以在 Mozilla Developer Network [深入学习](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 或 [温习](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

:::info
虽然我们尽力假设您没有 React、Android 或 iOS 开发的先前知识，但这些是志向远大的 React Native 开发者值得学习的主题。在合适的地方，我们链接了更深入的资源和文章。
:::

## 交互式示例

本介绍让您可以在浏览器中立即开始使用交互式示例，如下所示：

```SnackPlayer name=Hello%20World
import {Text, View} from 'react-native';

const YourApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Try editing me! 🎉</Text>
    </View>
  );
};

export default YourApp;
```

上面是一个 Snack Player。它是 Expo 创建的一个方便的工具，用于嵌入和运行 React Native 项目，并分享它们在 Android 和 iOS 等平台上的渲染效果。代码是实时可编辑的，因此您可以直接在浏览器中使用它。请尝试将上面的 "Try editing me!" 文本更改为 "Hello, world!"

:::tip
或者，如果您想设置本地开发环境，[您可以按照我们的指南在本地机器上设置环境](set-up-your-environment) 并将代码示例粘贴到您的项目中。（如果您是 Web 开发者，您可能已经设置了用于移动浏览器测试的本地环境！）
:::

## 开发者说明

来自许多不同开发背景的人都在学习 React Native。您可能拥有从 Web 到 Android 再到 iOS 等一系列技术的经验。我们尝试为所有背景的开发者编写内容。有时我们会提供特定于某个平台的解释，如下所示：

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android","ios","web"])}>

<TabItem value="android">

:::info
Android 开发者可能熟悉这个概念。
:::

</TabItem>
<TabItem value="ios">

:::info
iOS 开发者可能熟悉这个概念。
:::

</TabItem>
<TabItem value="web">

:::info
Web 开发者可能熟悉这个概念。
:::

</TabItem>
</Tabs>

## 格式

菜单路径以粗体书写，并使用插入符号导航子菜单。示例：**Android Studio > 偏好设置**

---

现在您知道了本指南的工作原理，是时候了解 React Native 的基础了：[原生组件](intro-react-native-components.md)。
