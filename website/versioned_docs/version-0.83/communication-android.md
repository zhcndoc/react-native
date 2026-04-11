---
id: communication-android
title: 原生与 React Native 之间的通信
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在 [与现有应用集成指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-android) 中，我们学习了如何在原生组件中嵌入 React Native，反之亦然。当我们混合使用原生和 React Native 组件时，最终会发现在这两个世界之间需要通信。一些实现方式已经在其他指南中提到过。本文总结了可用的技术。

## 介绍

React Native 的灵感来源于 React，因此信息流的基本思想是相似的。React 中的流动是单向的。我们维护一个组件层级，组件只依赖于其父组件及其自身的内部状态。我们通过属性实现这一点：数据由父组件传递给子组件，呈现自上而下的方式。如果祖先组件依赖于其子孙组件的状态，应传递一个回调给子孙组件以更新祖先。

该概念同样适用于 React Native。只要我们完全在框架内部构建应用，就可以通过属性和回调驱动应用。但在混合使用 React Native 和原生组件时，我们需要一些特定的、跨语言的机制来传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方法，既可以从原生传递属性到 React Native，也可以从 React Native 传递属性到原生。

### 从原生传递属性到 React Native

通过在主 Activity 中提供自定义的 `ReactActivityDelegate` 实现，可以向 React Native 应用传递属性。该实现应重写 `getLaunchOptions`，返回一个包含所需属性的 `Bundle`。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>

<TabItem value="java">

```java
public class MainActivity extends ReactActivity {
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected Bundle getLaunchOptions() {
        Bundle initialProperties = new Bundle();
        ArrayList<String> imageList = new ArrayList<String>(Arrays.asList(
                "https://dummyimage.com/600x400/ffffff/000000.png",
                "https://dummyimage.com/600x400/000000/ffffff.png"
        ));
        initialProperties.putStringArrayList("images", imageList);
        return initialProperties;
      }
    };
  }
}
```

</TabItem>

<TabItem value="kotlin">

```kotlin
class MainActivity : ReactActivity() {
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle {
                val imageList = arrayListOf("https://dummyimage.com/600x400/ffffff/000000.png", "https://dummyimage.com/600x400/000000/ffffff.png")
                val initialProperties = Bundle().apply { putStringArrayList("images", imageList) }
                return initialProperties
            }
        }
    }
}
```

</TabItem>
</Tabs>

```tsx
import React from 'react';
import {View, Image} from 'react-native';

export default class ImageBrowserApp extends React.Component {
  renderImage(imgURI) {
    return <Image source={{uri: imgURI}} />;
  }
  render() {
    return <View>{this.props.images.map(this.renderImage)}</View>;
  }
}
```

`ReactRootView` 提供了一个可读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用会以新属性重新渲染。仅当新属性与之前的不同才会触发更新。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>

<TabItem value="java">

```java
Bundle updatedProps = mReactRootView.getAppProperties();
ArrayList<String> imageList = new ArrayList<String>(Arrays.asList(
        "https://dummyimage.com/600x400/ff0000/000000.png",
        "https://dummyimage.com/600x400/ffffff/ff0000.png"
));
updatedProps.putStringArrayList("images", imageList);

mReactRootView.setAppProperties(updatedProps);
```

</TabItem>

<TabItem value="kotlin">

```kotlin
var updatedProps: Bundle = reactRootView.getAppProperties()
var imageList = arrayListOf("https://dummyimage.com/600x400/ff0000/000000.png", "https://dummyimage.com/600x400/ffffff/ff0000.png")
```

</TabItem>
</Tabs>

随时更新属性是允许的，但更新必须在主线程进行。任何线程都可以使用 getter。

目前无法实现只更新部分属性。建议你在自己的封装中实现此功能。

:::info
目前顶层 RN 组件的 JS 函数 `componentWillUpdateProps` 在属性更新后不会被调用，但可以在 `componentDidMount` 中访问新属性。
:::

### 从 React Native 传递属性到原生

原生组件属性暴露的问题在 [此文](legacy/native-components-android#3-expose-view-property-setters-using-reactprop-or-reactpropgroup-annotation) 中有详细说明。简而言之，需将希望映射到 JavaScript 的属性作为带有 `@ReactProp` 注解的 setter 方法暴露，然后可以像使用普通 React Native 组件那样在 React Native 中使用它们。

### 属性的限制

跨语言属性的主要缺点是不支持回调，这限制了我们处理自底向上的数据绑定。比如，假设你有一个小的 RN 视图，你想在 JS 操作后将其从原生的父视图中移除。使用属性无法做到，因为信息需要自底向上传递。

虽然我们有一种跨语言回调的方法（[见此处](legacy/native-modules-android#callbacks)），但这类回调并不总是能满足需求。主要的问题是它们不能作为属性传递。该机制主要用于从 JS 触发原生动作，并在 JS 中处理结果。

## 其他跨语言交互方式（事件与原生模块）

如上章节所述，使用属性存在一定局限。有时属性不足以驱动应用逻辑，需要更灵活的解决方案。本章节介绍 React Native 中的其他通信技术，既可用于内部通信（JS 与原生层间），也可用于外部通信（RN 与纯原生部分间）。

React Native 支持跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。但在两个方向实现方式不同。对于原生，我们使用事件机制安排 JS 中的处理函数执行；对于 React Native，我们直接调用原生模块导出的接口。

### 从原生调用 React Native 函数（事件）

事件在 [此文](legacy/native-components-android#events) 中有详解。注意，使用事件无法保证执行时间，因为事件在独立线程中处理。

事件很强大，因为它们允许你更改 React Native 组件而无需持有引用。但使用时可能遇到陷阱：

- 事件可从任意位置发送，可能导致代码依赖混乱成“意大利面条”。
- 事件共享命名空间，可能出现命名冲突。冲突不会被静态检查，难以调试。
- 如果你使用多个同类 React Native 组件实例，且想在事件层区分它们，可能需要引入标识符，随事件传递（可使用原生视图的 `reactTag` 作为标识）。

### 从 React Native 调用原生函数（原生模块）

原生模块是可被 JS 调用的 Java/Kotlin 类。通常每个 JS 桥接创建一个该类实例。它们能向 React Native 导出任意函数和常量。[此文](legacy/native-modules-android) 对其做了详细介绍。

:::warning
所有原生模块共享同一命名空间。创建新模块时要注意命名冲突。
:::