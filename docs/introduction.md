---
id: getting-started
title: 简介
description: 这份实用指南概述了学习 React Native、使用这些文档以及设置环境所需的前提条件。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="content-banner">
  欢迎来到你 React Native 旅程的起点！如果你在寻找入门说明，它们已经移到了 <a href="environment-setup">专门的章节</a>。继续阅读，了解文档、原生组件、React 等内容的简介！
  <img className="content-banner-img" src="/docs/assets/p_android-ios-devices.svg" alt=" " />
</div>

许多不同背景的人都在使用 React Native：从经验丰富的 iOS 开发者，到 React 初学者，再到职业生涯中第一次开始编程的人。这些文档是为所有学习者编写的，不论他们的经验水平或背景如何。

## 如何使用这些文档

你可以从这里开始，像读书一样按顺序阅读这些文档；也可以只阅读你需要的特定章节。已经熟悉 React 了吗？你可以跳过[这一节](intro-react)——或者把它当作一次轻量复习来阅读。

## 前提条件

要使用 React Native，你需要理解 JavaScript 基础知识。如果你是 JavaScript 新手，或者需要复习一下，可以在 Mozilla Developer Network 上[深入学习](https://developer.mozilla.org/en-US/docs/Web/JavaScript)或[快速补习](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

:::info
虽然我们尽量假设你没有 React、Android 或 iOS 开发方面的先验知识，但这些都是有志成为 React Native 开发者的宝贵学习主题。在合适的地方，我们会链接到更深入的资源和文章。
:::

## 互动示例

这篇简介让你可以立即在浏览器中通过如下这样的交互式示例开始上手：

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
      <Text>试着编辑我！🎉</Text>
    </View>
  );
};

export default YourApp;
```

上面的是一个 Snack Player。它是由 Expo 创建的一个实用工具，用于嵌入和运行 React Native 项目，并展示它们在 Android 和 iOS 等平台上的渲染效果。代码是实时且可编辑的，所以你可以直接在浏览器里动手尝试。来吧，试着把上面的“Try editing me!”文本改成“Hello, world!”

:::tip
如果你愿意，也可以选择设置一个本地开发环境，按照[我们的指南在本地机器上设置环境](set-up-your-environment)，并将代码示例粘贴到你的项目中。（如果你是 Web 开发者，你可能已经设置好了本地环境，用于移动浏览器测试！）
:::

## 开发者说明

来自许多不同开发背景的人都在学习 React Native。你可能接触过一系列技术，从 Web 到 Android，再到 iOS 等等。我们尽量面向所有背景的开发者来编写内容。有时我们会像这样提供针对某个平台的说明：

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android","ios","web"])}>

<TabItem value="android">

:::info
Android 开发者可能会熟悉这个概念。
:::

</TabItem>
<TabItem value="ios">

:::info
iOS 开发者可能会熟悉这个概念。
:::

</TabItem>
<TabItem value="web">

:::info
Web 开发者可能会熟悉这个概念。
:::

</TabItem>
</Tabs>

## 格式

菜单路径使用粗体，并用大于号来导航子菜单。示例：**Android Studio > Preferences**

---

现在你已经了解了这份指南的工作方式，是时候认识 React Native 的基础了：[原生组件](intro-react-native-components.md)。
