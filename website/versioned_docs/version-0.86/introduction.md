---
id: getting-started
title: 介绍
description: 本实用指南列出了学习 React Native、使用这些文档以及设置环境的先决条件。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="content-banner">
  欢迎来到你的 React Native 旅程的起点！如果你正在寻找入门说明，它们已经移到了<a href="environment-setup">它们自己的部分</a>。继续阅读，了解文档、原生组件、React 等内容的简介！
  <img className="content-banner-img" src="/docs/assets/p_android-ios-devices.svg" alt=" " />
</div>

使用 React Native 的人群非常多样：从高级 iOS 开发者，到 React 初学者，再到职业生涯中首次开始编程的人。这些文档是为所有学习者编写的，不论他们的经验水平或背景如何。

## 如何使用这些文档

你可以从这里开始，像读书一样按顺序阅读这些文档；也可以只阅读你需要的特定部分。已经熟悉 React 了吗？你可以跳过[该部分](intro-react)——或者阅读它作为一个轻量的复习。

## 先决条件

要使用 React Native，你需要理解 JavaScript 基础。如果你是 JavaScript 新手，或者需要复习一下，你可以在 Mozilla Developer Network 上[深入学习](https://developer.mozilla.org/en-US/docs/Web/JavaScript)或[快速补充](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

:::info
虽然我们尽最大努力假设你没有 React、Android 或 iOS 开发的先验知识，但这些都是有志于成为 React Native 开发者的宝贵学习主题。在合适的地方，我们链接了一些更深入的资源和文章。
:::

## 交互式示例

这篇介绍让你可以立即在浏览器中通过这样的交互式示例开始：

```SnackPlayer name=Hello%20World
import React from 'react';
import {Text, View} from 'react-native';

const YourApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>尝试编辑我！🎉</Text>
    </View>
  );
};

export default YourApp;
```

上面的是一个 Snack Player。它是 Expo 创建的一个实用工具，用于嵌入并运行 React Native 项目，并展示它们在 Android 和 iOS 等平台上的渲染效果。代码是实时且可编辑的，所以你可以直接在浏览器中操作它。现在就试着把上面的“尝试编辑我！”文本改成“你好，世界！”

:::tip
如果你愿意，也可以[按照我们的指南在本地机器上设置开发环境](set-up-your-environment)，然后将代码示例粘贴到你的项目中。（如果你是 Web 开发者，你可能已经设置好了用于移动浏览器测试的本地环境！）
:::

## 开发者说明

来自许多不同开发背景的人都在学习 React Native。你可能有从 Web 到 Android 再到 iOS 等多种技术经验。我们努力为来自各个背景的开发者撰写内容。有时我们会像这样提供针对某个平台的说明：

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android","ios","web"])}>

<TabItem value="android">

:::info
Android 开发者可能对这个概念比较熟悉。
:::

</TabItem>
<TabItem value="ios">

:::info
iOS 开发者可能对这个概念比较熟悉。
:::

</TabItem>
<TabItem value="web">

:::info
Web 开发者可能对这个概念比较熟悉。
:::

</TabItem>
</Tabs>

## 格式

菜单路径以粗体书写，并使用大于号来导航子菜单。示例：**Android Studio > Preferences**

---

现在你已经知道这个指南是如何运作的，是时候来了解 React Native 的基础了：[原生组件](intro-react-native-components.md)。
