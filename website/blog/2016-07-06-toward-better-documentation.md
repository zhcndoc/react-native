---
title: 致更好的文档
author: Kevin Lacker
authorTitle: Facebook 工程经理
authorURL: 'https://twitter.com/lacker'
authorImageURL: 'https://www.gravatar.com/avatar/9b790592be15d4f55a5ed7abb5103304?s=128'
authorTwitter: lacker
tags: [announcement]
---

打造优秀的开发者体验，其中一部分是拥有优秀的文档。创建好的文档需要很多工作——理想的文档应当是简明、有用、准确、完整且令人愉悦的。最近我们根据大家的反馈努力提升文档质量，想和大家分享一些我们做出的改进。

## 行内示例

当你学习一个新的库、新的编程语言或新框架时，会有一个美妙的时刻，你第一次写出一段代码，尝试运行，看它是否能工作……而且它 _确实_ 能工作。你创造了一些真实的东西。我们希望把这种直接的体验融入到文档里。比如这样：

```ReactNativeWebPlayer
import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

class ScratchPad extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{fontSize: 30, flex: 1, textAlign: 'center'}}>
          这是不是很酷？
        </Text>
        <Text style={{fontSize: 100, flex: 1, textAlign: 'center'}}>
          👍
        </Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('ScratchPad', () => ScratchPad);
```

我们认为这些行内示例，借助 [`react-native-web-player`](https://github.com/dabbott/react-native-web-player) 模块，在 [Devin Abbott](https://twitter.com/devinaabbott) 的帮助下实现，是学习 React Native 基础的绝佳方式，我们也已更新了面向新手的 [React Native 入门教程](/docs/tutorial)，尽可能使用这些示例。去看看吧——如果你曾经好奇只修改一小段示例代码会发生什么，这是一种很棒的试验方式。另外，如果你开发的是面向开发者的工具，想在自己的网站上展示一个实时的 React Native 示例，[`react-native-web-player`](https://github.com/dabbott/react-native-web-player) 能让这件事轻松实现。

核心的模拟引擎由 [Nicolas Gallagher](https://twitter.com/necolas) 的 [`react-native-web`](https://github.com/necolas/react-native-web) 项目提供，它让 React Native 组件如 `Text` 和 `View` 能在网页上显示。如果你对创建同时支持移动端与网页的体验感兴趣，代码共用大量代码库，可以查看 [`react-native-web`](https://github.com/necolas/react-native-web)。

## 更好的指南

在 React Native 的某些部分，存在多种实现方式，我们收到反馈说可以给出更明确的指导。

我们新出了一个 [导航指南](/docs/navigation)，对比了不同方案，并给出使用建议——`Navigator`、`NavigatorIOS`、`NavigationExperimental`。中期来看，我们正在努力改进和整合这些接口。短期内，我们希望更好的指南能够让你更容易应对。

我们还新增了一个关于 [处理触摸](/docs/handling-touches) 的指南，解释了制作按钮类界面的基本知识，并简述了多种处理触摸事件的方式。

我们着力改进的另一个领域是 Flexbox。包括如何使用 [Flexbox 处理布局](/docs/flexbox) 和如何控制 [组件尺寸](/docs/height-and-width) 的教程，还包括一个虽然不够炫酷但希望对你有用的 [React Native 布局控制属性列表](/docs/layout-props)。

## 快速入门

当你开始在机器上搭建 React Native 开发环境时，确实需要安装和配置许多东西。要把安装过程变得非常有趣和令人激动很难，但我们至少可以让它尽可能快速且无痛。

我们构建了一个 [全新的快速入门流程](/docs/next/getting-started)，让你先选择开发操作系统和移动操作系统，集中提供所有的设置说明。我们还亲自体验了安装流程，确保一切顺利，且每个决策点都有明确推荐。经过对无辜的同事的测试，我们相信这是一次改进。

我们还完善了 [将 React Native 集成到已有应用](/docs/integration-with-existing-apps) 的指南。很多大型应用，比如 Facebook 自身的应用，实际上部分使用 React Native 构建，部分使用传统开发工具。我们希望这份指南能帮助更多人采用这种应用开发方式。

## 我们需要你的帮助

你的反馈让我们知道应当优先处理什么。我知道有些人看完这篇博客可能会想“更好的文档？哼，X 库的文档还是一团糟！”这非常好——我们需要这种热情。给我们反馈的最佳方式取决于反馈的类型。

如果你发现文档中有错误，比如描述不准确或代码无法运行，[提交 Issue](https://github.com/facebook/react-native/issues) 是最直接的方式。标注“Documentation”标签，方便我们分配给对应人员。

如果不是具体的错误，而是文档内容本质上令人困惑，这就不太适合 GitHub Issue。相反，可以在 [Canny](https://react-native.canny.io/feature-requests) 上发表你觉得哪部分文档需要改进。这有助于我们在写指南等更广泛工作中进行优先排序。

感谢你读到这里，也感谢你使用 React Native！