---
id: intro-react-native-components
title: 核心组件和原生组件
description: 'React Native 允许你使用原生组件来构建应用界面。方便的是，它自带了一组核心组件，让你可以立刻开始使用！'
---

import ThemedImage from '@theme/ThemedImage';

React Native 是一个使用 [React](https://react.dev/) 以及应用平台原生能力构建 Android 和 iOS 应用的开源框架。借助 React Native，你可以使用 JavaScript 访问平台的 API，同时使用 React 组件来描述 UI 的外观和行为：这些组件是可复用且可嵌套的代码块。你可以在下一节了解更多关于 React 的内容。但首先，让我们了解一下 React Native 中组件的工作原理。

## 视图与移动开发

在 Android 和 iOS 开发中，**视图（view）** 是 UI 的基本构建单元：屏幕上的一个小矩形元素，可以用来显示文本、图片，或响应用户输入。即使是应用中最小的视觉元素，比如一行文本或一个按钮，都是视图的类型。有些视图可以包含其他视图。层层嵌套，尽是视图！

<figure>
  <img src="/docs/assets/diagram_ios-android-views.svg" width="1000" alt="展示 Android 和 iOS 应用都构建于称为视图的原子元素之上的示意图。" />
  <figcaption>只是一部分在 Android 和 iOS 应用中使用的众多视图示例。</figcaption>
</figure>

## 原生组件

在 Android 开发中，你使用 Kotlin 或 Java 编写视图；在 iOS 开发中，则用 Swift 或 Objective-C。使用 React Native，你可以通过 JavaScript 调用这些视图，且用 React 组件来实现。在运行时，React Native 会为这些组件创建对应的 Android 和 iOS 视图。因为 React Native 组件是基于 Android 和 iOS 的同样视图，所以 React Native 应用的外观、体验和性能与其他应用无异。我们称这些基于平台的组件为**原生组件（Native Components）**。

React Native 自带一套必备且开箱即用的原生组件，供你立即开始构建应用。这些就是 React Native 的**核心组件**。

:::caution
本文档引用的是旧版 API，需要更新以反映新版架构
:::
React Native 也允许你为[Android](legacy/native-components-android.md)和[iOS](legacy/native-components-ios.md)构建自定义原生组件，以满足应用的特殊需求。我们还拥有一个活跃的**社区贡献组件**生态系统。访问 [Native Directory](https://reactnative.directory) 可以发现社区创作的组件。

## 核心组件

React Native 拥有许多核心组件，从控件到活动指示器应有尽有。你可以在 [API 部分](components-and-apis)查看它们的完整文档。你主要会使用以下核心组件：

| React Native UI 组件 | Android 视图    | iOS 视图        | Web 类比                   | 描述                                                                                             |
| -------------------- | --------------- | --------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `<View>`             | `<ViewGroup>`   | `<UIView>`      | 不滚动的 `<div>`           | 一个容器，支持 flexbox 布局、样式、部分触摸处理和辅助功能控制                                   |
| `<Text>`             | `<TextView>`    | `<UITextView>`  | `<p>`                      | 显示、样式化及嵌套字符串文本，甚至处理触摸事件                                                   |
| `<Image>`            | `<ImageView>`   | `<UIImageView>` | `<img>`                    | 显示不同类型的图片                                                                               |
| `<ScrollView>`       | `<ScrollView>`  | `<UIScrollView>`| `<div>`                    | 通用的滚动容器，可以包含多个组件和视图                                                         |
| `<TextInput>`        | `<EditText>`    | `<UITextField>` | `<input type="text">`      | 允许用户输入文本                                                                                 |

在下一节中，你将开始组合这些核心组件来学习 React 的工作方式。现在就来试试吧！

```SnackPlayer name=Hello%20World
import React from 'react';
import {View, Text, Image, ScrollView, TextInput} from 'react-native';

const App = () => {
  return (
    <ScrollView>
      <Text>一些文本</Text>
      <View>
        <Text>更多文本</Text>
        <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{width: 200, height: 200}}
        />
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="你可以在这里输入"
      />
    </ScrollView>
  );
};

export default App;
```

---

由于 React Native 使用与 React 组件相同的 API 结构，你需要了解 React 组件的 API 才能入门。下节内容([下一节](intro-react))将为你快速介绍或复习该主题。不过如果你已经熟悉 React，也可以直接[跳到这里](handling-text-input)。

<ThemedImage
alt="一张图展示了 React Native 的核心组件是随 React Native 一起发布的 React 组件的子集。"
sources={{
  light: '/docs/assets/diagram_react-native-components.svg',
  dark: '/docs/assets/diagram_react-native-components_dark.svg',
}}
/>