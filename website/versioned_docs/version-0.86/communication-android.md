---
id: communication-android
title: 原生与 React Native 之间的通信
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在 [集成到现有应用指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-android) 中，我们了解了如何将 React Native 嵌入原生组件，反之亦然。当我们混合使用原生和 React Native 组件时，最终会发现需要在这两个世界之间进行通信。实现这一点的一些方式已经在其他指南中提到过。本文将总结可用的技术。

## 简介

React Native 受到 React 的启发，因此信息流的基本思想是相似的。React 中的流是单向的。我们维护一个组件层级结构，其中每个组件只依赖于它的父组件和它自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给子组件。如果某个祖先组件依赖于其后代组件的状态，则应向下传递一个回调函数，供后代组件用来更新祖先组件。

同样的概念也适用于 React Native。只要我们完全在框架内构建应用，就可以通过属性和回调来驱动应用。但当我们混合 React Native 和原生组件时，就需要一些特定的、跨语言的机制，以便在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方式，既能从原生向 React Native 传递属性，也能从 React Native 向原生传递属性。

### 从原生向 React Native 传递属性

你可以在主 Activity 中通过提供一个自定义的 `ReactActivityDelegate` 实现，将属性传递给 React Native 应用。这个实现应重写 `getLaunchOptions`，以返回一个包含所需属性的 `Bundle`。

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

`ReactRootView` 提供了一个可读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用会使用新的属性重新渲染。只有当新的更新后属性与之前的不同时，才会执行更新。

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

随时更新属性都是可以的。不过，更新必须在主线程上执行。获取器可以在任何线程上使用。

没有办法一次只更新少量属性。我们建议你将其构建到自己的包装器中。

:::info
目前，顶层 RN 组件的 JS 函数 `componentWillUpdateProps` 在属性更新后不会被调用。不过，你可以在 `componentDidMount` 函数中访问新的 props。
:::

### 从 React Native 向原生传递属性

原生组件属性的暴露问题在[这篇文章](legacy/native-components-android#3-expose-view-property-setters-using-reactprop-or-reactpropgroup-annotation)中有详细介绍。简而言之，需要在 JavaScript 中体现的属性应当通过带有 `@ReactProp` 注解的 setter 方法暴露出来，然后在 React Native 中像使用普通 React Native 组件一样使用它们。

### 属性的限制

跨语言属性的主要缺点是它们不支持回调，因此我们无法处理自底向上的数据绑定。设想你有一个较小的 RN 视图，希望因为某个 JS 操作而从原生父视图中移除。使用 props 无法做到这一点，因为信息需要自底向上传递。

虽然我们有一种跨语言回调的形式（[此处有说明](legacy/native-modules-android#callbacks)），但这些回调并不总是我们所需要的。主要问题在于，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

如前一章所述，使用属性会有一些限制。有时属性不足以驱动我们应用的逻辑，我们需要一种更灵活的解决方案。本章介绍 React Native 中可用的其他通信技术。它们既可用于内部通信（RN 中 JS 层与原生层之间），也可用于外部通信（RN 与应用中“纯原生”部分之间）。

React Native 使你能够执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。不幸的是，根据我们所处的一侧不同，实现同一目标的方式也不同。对于原生端，我们使用事件机制来安排在 JS 中执行一个处理函数；而对于 React Native，我们则直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在[这篇文章](legacy/native-components-android#events)中有详细说明。请注意，使用事件不会对执行时间作出任何保证，因为事件是在单独的线程上处理的。

事件非常强大，因为它们让我们无需引用 React Native 组件本身，就能对其进行修改。不过，使用事件时也有一些陷阱需要注意：

- 由于事件可以从任何地方发送，它们可能会在你的项目中引入意大利面式的依赖关系。
- 事件共享命名空间，这意味着你可能会遇到名称冲突。冲突不会被静态检测到，因此很难调试。
- 如果你使用同一个 React Native 组件的多个实例，并且希望从事件的角度区分它们，你很可能需要引入标识符，并在发送事件时一并传递它们（你可以使用原生视图的 `reactTag` 作为标识符）。

### 从 React Native 调用原生函数（原生模块）

原生模块是可在 JS 中使用的 Java/Kotlin 类。通常，每个 JS bridge 会创建该模块的一个实例。它们可以向 React Native 导出任意函数和常量。相关内容在[这篇文章](legacy/native-modules-android)中有详细介绍。

:::warning
所有原生模块共享同一个命名空间。在创建新模块时请注意名称冲突。
:::
