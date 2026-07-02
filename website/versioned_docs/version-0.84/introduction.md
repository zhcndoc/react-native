---
id: getting-started
title: 介绍
description: 本指南介绍了学习 React Native 的先决条件、如何使用这些文档以及如何配置开发环境。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="content-banner">
  欢迎来到您的 React Native 旅程的起点！如果您正在寻找快速入门指南，相关内容已移至<a href="environment-setup">独立章节</a>。继续阅读，了解文档介绍、原生组件、React 以及更多信息！
  <img className="content-banner-img" src="/docs/assets/p_android-ios-devices.svg" alt=" " />
</div>

使用 React Native 的人群非常多样：从高级 iOS 开发者到 React 初学者，甚至是首次进入编程行业的人。这些文档面向所有学习者，不论其经验水平或背景如何。

## 如何使用这些文档

您可以从这里开始，像读书一样线性阅读这些文档；或者只阅读您需要的特定章节。已经熟悉 React 了吗？可以跳过 [该章节](intro-react)—或者阅读它作为轻松的复习。

## 先决条件

要使用 React Native，您需要了解 JavaScript 基础知识。如果您是 JavaScript 新手或需要复习，可以 [深入学习](https://developer.mozilla.org/en-US/docs/Web/JavaScript)，或在 Mozilla Developer Network 进行 [复习](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。

:::info
虽然我们会尽量假设读者没有 React、Android 或 iOS 开发经验，但这些都是未来 React Native 开发者的重要知识领域。在适当情况下，我们会链接到更深入的资源和文章。
:::

## 交互式示例

本介绍允许您立即在浏览器中通过如下交互式示例开始实践：

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
      <Text>试着修改我吧！🎉</Text>
    </View>
  );
};

export default YourApp;
```

上述为 Snack Player，由 Expo 创建的方便工具，可嵌入并运行 React Native 项目，展示其在 Android 和 iOS 等平台上的渲染效果。代码是实时且可编辑的，您可以直接在浏览器中玩转。试试看把上面“试着修改我吧！”的文字改成"Hello, world!"吧！

:::tip
如果您想在本地搭建开发环境，[可以按照我们的本地环境搭建指南](set-up-your-environment) 进行操作，并将示例代码粘贴到您的项目中。（如果您是 Web 开发者，可能已经有用于移动浏览器测试的本地环境！）
:::

## 开发者说明

来自不同开发背景的人们都在学习 React Native。您可能拥有 Web、Android、iOS 等多种技术经验。我们试图为各种背景的开发者编写内容。有时我们会针对某个平台提供专门说明：

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

## 格式规范

菜单路径以加粗字体书写，使用尖括号表示子菜单导航。例如：**Android Studio > Preferences**

---

既然您已经了解了本指南的使用方法，接下来是认识 React Native 基础——[原生组件](intro-react-native-components.md) 的时间了。
