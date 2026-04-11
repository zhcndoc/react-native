---
id: communication-android
title: 原生与 React Native 之间的通信
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在 [集成到现有应用指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-android) 中，我们学习了如何将 React Native 嵌入到原生组件中，反之亦然。当我们混合使用原生和 React Native 组件时，我们最终会发现需要在这两个世界之间进行通信。实现这一点的一些方法已在其他指南中提及。本文总结了可用的技术。

## 简介

React Native 的灵感来自 React，因此信息流的基本思想是相似的。React 中的流是单向的。我们维护一个组件层次结构，其中每个组件仅依赖于其父组件及其自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给其子组件。如果祖先组件依赖于其后代的状态，则应该传递一个回调供后代使用以更新祖先。

同样的概念适用于 React Native。只要我们纯粹在框架内构建应用程序，我们就可以通过属性和回调来驱动我们的应用。但是，当我们混合使用 React Native 和原生组件时，我们需要一些特定的跨语言机制，以便在它们之间传递信息。

## 属性

属性是最直接的跨组件通信方式。因此我们需要一种方法，既可以从原生传递属性到 React Native，也可以从 React Native 传递属性到原生。

### 从原生传递属性到 React Native

你可以通过在主 Activity 中提供 `ReactActivityDelegate` 的自定义实现，将属性传递给 React Native 应用。此实现应重写 `getLaunchOptions` 以返回带有所需属性的 `Bundle`。

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

`ReactRootView` 提供了一个读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用将使用新属性重新渲染。仅当新更新的属性与之前的属性不同时，才会执行更新。

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

随时更新属性是可以的。但是，更新必须在主线程上执行。你可以在任何线程上使用 getter。

无法一次只更新少数几个属性。我们建议你将其构建到自己的包装器中。

> **_注意:_** 目前，顶层 RN 组件的 JS 函数 `componentWillUpdateProps` 在属性更新后不会被调用。但是，你可以在 `componentDidMount` 函数中访问新属性。

### 从 React Native 传递属性到原生

暴露原生组件属性的问题在 [这篇文章](legacy/native-components-android#3-expose-view-property-setters-using-reactprop-or-reactpropgroup-annotation) 中有详细说明。简而言之，需要在 JavaScript 中反映的属性需要暴露为用 `@ReactProp` 注解的 setter 方法，然后在 React Native 中使用它们，就像该组件是普通的 React Native 组件一样。

### 属性的限制

跨语言属性的主要缺点是不支持回调，这将允许我们处理自下而上的数据绑定。想象一下，你有一个小的 RN 视图，由于 JS 操作的结果，你希望将其从原生父视图中移除。使用属性无法做到这一点，因为信息需要自下而上地传递。

虽然我们有一种跨语言回调的风格（[此处描述](legacy/native-modules-android#callbacks)），但这些回调并不总是我们需要的。主要问题是它们不打算作为属性传递。相反，此机制允许我们从 JS 触发原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

正如前一章所述，使用属性有一些限制。有时属性不足以驱动我们的应用逻辑，我们需要一个提供更灵活解决方案。本章涵盖 React Native 中可用的其他通信技术。它们可用于内部通信（RN 中 JS 和原生层之间）以及外部通信（RN 和你应用的“纯原生”部分之间）。

React Native 使你能够执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。不幸的是，根据我们工作的一侧不同，我们通过不同的方式实现相同的目标。对于原生——我们使用事件机制来调度 JS 中处理函数的执行，而对于 React Native，我们直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在 [这篇文章](legacy/native-components-android#events) 中有详细描述。请注意，使用事件并不能保证执行时间，因为事件是在单独的线程上处理的。

事件很强大，因为它们允许我们更改 React Native 组件而无需引用它们。但是，在使用它们时可能会遇到一些陷阱：

- 由于事件可以从任何地方发送，它们可能会将面条式依赖关系引入你的项目中。
- 事件共享命名空间，这意味着你可能会遇到一些名称冲突。冲突不会被静态检测到，这使得它们难以调试。
- 如果你使用同一个 React Native 组件的多个实例，并且想从事件的角度区分它们，你可能需要引入标识符并随事件一起传递它们（你可以使用原生视图的 `reactTag` 作为标识符）。

### 从 React Native 调用原生函数（原生模块）

原生模块是 JS 中可用的 Java/Kotlin 类。通常每个 JS 桥接器创建每个模块的一个实例。它们可以向 React Native 导出任意函数和常量。它们在 [这篇文章](legacy/native-modules-android) 中有详细说明。

> **_警告_**：所有原生模块共享相同的命名空间。创建新模块时要注意名称冲突。
