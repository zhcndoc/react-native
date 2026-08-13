---
id: intro-react-native-components
title: 核心组件和原生组件
description: 'React Native 允许你使用原生组件来组合应用界面。为了方便你立即开始使用，它还提供了一组这样的组件——核心组件！'
---

import ThemedImage from '@theme/ThemedImage';

React Native 是一个开源框架，使用 [React](https://react.dev/) 和应用平台的原生功能来构建 Android 和 iOS 应用。借助 React Native，你可以使用 JavaScript 访问平台的 API，还可以使用 React 组件描述 UI 的外观和行为：这些组件是一组可复用、可嵌套的代码。你可以在下一节中进一步了解 React。但首先，让我们了解组件在 React Native 中是如何工作的

## 视图与移动开发

在 Android 和 iOS 开发中，**视图**是 UI 的基本构建块：屏幕上的一个小型矩形元素，可用于显示文本、图像或响应用户输入。应用中即使是最小的视觉元素，例如一行文本或一个按钮，也属于视图。某些视图可以包含其他视图。视图无处不在！

<figure>
  <img src="/docs/assets/diagram_ios-android-views.svg" width="1000" alt="展示 Android 和 iOS 应用的图表，说明它们都是构建在称为视图的原子元素之上" />
  <figcaption>这里只展示了 Android 和 iOS 应用中使用的众多视图中的一部分</figcaption>
</figure>

## Native Components

在 Android 开发中，你可以使用 Kotlin 或 Java 编写视图；在 iOS 开发中，你可以使用 Swift 或 Objective-C。借助 React Native，你可以使用 React 组件通过 JavaScript 调用这些视图。在运行时，React Native 会为这些组件创建相应的 Android 和 iOS 视图。由于 React Native 组件由与 Android 和 iOS 相同的视图提供支持，因此 React Native 应用的外观、体验和性能都与其他应用一样。我们将这些由平台提供支持的组件称为 **Native Components。**

React Native 附带了一组必备且开箱即用的 Native Components，你可以使用它们立即开始构建应用。这些组件就是 React Native 的 **Core Components。**

:::caution
本文档引用了一组旧版 API，需要更新以反映新架构
:::
React Native 还允许你为 [Android](legacy/native-components-android.md) 和 [iOS](legacy/native-components-ios.md) 构建自己的 Native Components，以满足应用的独特需求。我们还有一个蓬勃发展的 **社区贡献组件** 生态系统。查看 [Native Directory](https://reactnative.directory)，了解社区正在创建的内容。

## Core Components

React Native 提供了许多 Core Components，涵盖从控件到活动指示器的各种功能。你可以在 [API 部分的文档中查看它们](components-and-apis)。你最常使用以下 Core Components：

| React Native UI 组件 | Android 视图   | iOS 视图         | Web 类比              | 描述                                                                |
| -------------------- | -------------- | ---------------- | --------------------- | ------------------------------------------------------------------- |
| `<View>`             | `<ViewGroup>`  | `<UIView>`       | 不可滚动的 `<div>`    | 支持使用 flexbox 进行布局、样式设置、部分触摸处理和无障碍控制的容器 |
| `<Text>`             | `<TextView>`   | `<UITextView>`   | `<p>`                 | 显示、设置样式以及嵌套文本字符串，甚至可以处理触摸事件              |
| `<Image>`            | `<ImageView>`  | `<UIImageView>`  | `<img>`               | 显示不同类型的图像                                                  |
| `<ScrollView>`       | `<ScrollView>` | `<UIScrollView>` | `<div>`               | 可包含多个组件和视图的通用滚动容器                                  |
| `<TextInput>`        | `<EditText>`   | `<UITextField>`  | `<input type="text">` | 允许用户输入文本                                                    |

在下一节中，你将开始组合这些 Core Components，了解 React 的工作原理。现在就来试试它们吧！

```SnackPlayer name=Hello%20World
import {View, Text, Image, ScrollView, TextInput} from 'react-native';

const App = () => {
  return (
    <ScrollView>
      <Text>Some text</Text>
      <View>
        <Text>Some more text</Text>
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
        defaultValue="You can type in me"
      />
    </ScrollView>
  );
};

export default App;
```

---

由于 React Native 使用与 React 组件相同的 API 结构，因此你需要了解 React 组件 API 才能开始使用。[下一节](intro-react) 将对这一主题进行快速介绍或复习。不过，如果你已经熟悉 React，可以[直接跳到后面](handling-text-input)

<ThemedImage
alt="展示 React Native 的 Core Components 是随 React Native 一起提供的 React Components 子集的图表"
sources={{
  light: '/docs/assets/diagram_react-native-components.svg',
  dark: '/docs/assets/diagram_react-native-components_dark.svg',
}}
/>
