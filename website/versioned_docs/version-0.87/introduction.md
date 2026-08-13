---
id: getting-started
title: 简介
description: 本实用指南介绍了学习 React Native、使用这些文档以及设置环境所需的准备工作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="content-banner">
  欢迎来到 React Native 之旅的起点！如果你正在寻找入门指南，它们已经移至<a href="environment-setup">专属章节</a>。继续阅读，了解文档、Native Components、React 以及更多内容！
  <img className="content-banner-img" src="/docs/assets/p_android-ios-devices.svg" alt=" " />
</div>

许多不同类型的人都在使用 React Native：从经验丰富的 iOS 开发者，到 React 初学者，再到职业生涯中第一次开始编程的人。这些文档面向所有学习者编写，无论他们的经验水平或背景如何。

## 如何使用这些文档

你可以从这里开始，像读书一样按顺序阅读这些文档；也可以阅读自己需要的特定章节。如果你已经熟悉 React，可以跳过[该章节](intro-react)，也可以阅读它进行快速复习。

## 前置条件

要使用 React Native，你需要了解 JavaScript 基础知识。如果你刚开始学习 JavaScript 或需要复习，可以在 Mozilla Developer Network 上[深入学习](https://developer.mozilla.org/en-US/docs/Web/JavaScript)或[温习](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

:::info
虽然我们尽力不预设你具备 React、Android 或 iOS 开发方面的知识，但对于有志于成为 React Native 开发者的人来说，这些都是很有价值的学习主题。在适当的地方，我们链接了可以深入了解相关内容的资源和文章。
:::

## 交互式示例

本介绍通过如下交互式示例，让你可以立即在浏览器中开始：

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

上面是一个 Snack Player。这是由 Expo 创建的便捷工具，用于嵌入和运行 React Native 项目，并分享它们在 Android 和 iOS 等平台上的渲染效果。代码是实时且可编辑的，因此你可以直接在浏览器中进行操作。试着将上方的 "Try editing me!" 文本改为 "Hello, world!" 吧

:::tip
如果你希望设置本地开发环境，也可以选择[按照我们的指南在本地计算机上设置环境](set-up-your-environment)，然后将代码示例粘贴到项目中。（如果你是 Web 开发者，可能已经设置好了用于移动浏览器测试的本地环境！）
:::

## 开发者说明

来自许多不同开发背景的人都在学习 React Native。你可能拥有从 Web 到 Android、iOS 以及更多领域的一系列技术经验。我们努力为所有背景的开发者编写文档。有时，我们会针对某个平台提供特定的说明，例如：

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

菜单路径以粗体书写，并使用尖括号来导航子菜单。例如：**Android Studio > Preferences**

---

现在你已经了解了本指南的使用方式，是时候认识 React Native 的基础：[Native Components](intro-react-native-components.md)。
