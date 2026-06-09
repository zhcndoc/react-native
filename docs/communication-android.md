---
id: communication-android
title: 原生与 React Native 之间的通信
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在 [Integrating with Existing Apps guide](integration-with-existing-apps) 和 [Native UI Components guide](legacy/native-components-android) 中，我们学习了如何将 React Native 嵌入到原生组件中，反之亦然。当我们混合使用原生组件和 React Native 组件时，最终会发现需要在这两个世界之间进行通信。实现这一点的一些方式已经在其他指南中提到过。本文总结了可用的技术。

## 介绍

React Native 受 React 启发，因此信息流的基本思想是相似的。React 中的数据流是单向的。我们维护一个组件层级结构，其中每个组件只依赖于其父组件和自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给子组件。如果某个祖先组件依赖于其后代组件的状态，则应向下传递一个回调，以便后代用于更新祖先。

同样的概念也适用于 React Native。只要我们完全在该框架内构建应用，就可以通过属性和回调来驱动应用。但当我们混合 React Native 和原生组件时，就需要一些特定的跨语言机制，使我们能够在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方法，既能从原生传递属性到 React Native，也能从 React Native 传递属性到原生。

### 从原生传递属性到 React Native

你可以通过在主 Activity 中提供 `ReactActivityDelegate` 的自定义实现，将属性传递给 React Native 应用。这个实现应当重写 `getLaunchOptions`，返回一个包含所需属性的 `Bundle`。

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

`ReactRootView` 提供了一个可读写属性 `appProperties`。在设置 `appProperties` 之后，React Native 应用会使用新的属性重新渲染。只有在新的更新后属性与之前的属性不同的时候，才会执行该更新。

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

任何时候更新属性都没问题。不过，更新必须在主线程上执行。你可以在任意线程上使用 getter。

没有办法一次只更新少数几个属性。我们建议你在自己的封装中实现这一点。

:::info
目前，顶层 RN 组件的 JS 函数 `componentWillUpdateProps` 在 prop 更新后不会被调用。不过，你可以在 `componentDidMount` 函数中访问新的 props。
:::

### 从 React Native 传递属性到原生

暴露原生组件属性的问题已在[本文](legacy/native-components-android#3-expose-view-property-setters-using-reactprop-or-reactpropgroup-annotation)中详细说明。简而言之，需要在 JavaScript 中体现的属性，应当通过带有 `@ReactProp` 注解的 setter 方法暴露出来，然后在 React Native 中像普通 React Native 组件一样使用它们。

### 属性的局限

跨语言属性的主要缺点是它们不支持回调，而回调本可以让我们处理自底向上的数据绑定。设想你有一个较小的 RN 视图，希望因为某个 JS 动作而从原生父视图中移除。用 props 没法做到这一点，因为信息需要自底向上流动。

虽然我们有一种跨语言回调的方式（[这里有描述](legacy/native-modules-android#callbacks)），但这些回调并不总是我们需要的。主要问题是，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发一个原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

如前一章所述，使用属性会带来一些限制。有时属性不足以驱动应用逻辑，我们需要一种更灵活的方案。本章介绍 React Native 中可用的其他通信技术。它们既可用于内部通信（RN 中 JS 与原生层之间），也可用于外部通信（RN 与应用中“纯原生”部分之间）。

React Native 允许你执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。不幸的是，取决于我们所处的一侧，实现同样目标的方式并不相同。对于原生侧，我们使用事件机制来安排在 JS 中执行处理函数；而对于 React Native，我们直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在[本文](legacy/native-components-android#events)中有详细说明。请注意，使用事件无法保证执行时间，因为事件是在单独的线程上处理的。

事件很强大，因为它们允许我们在不需要引用 React Native 组件的情况下修改它们。不过，使用事件时也有一些容易踩到的坑：

- 事件可以从任何地方发送，因此它们可能会在项目中引入意大利面条式依赖。
- 事件共享命名空间，这意味着你可能会遇到名称冲突。冲突不会被静态检测出来，因此很难调试。
- 如果你使用同一个 React Native 组件的多个实例，并且想从事件的角度区分它们，你很可能需要引入标识符，并将其与事件一起传递（你可以使用原生视图的 `reactTag` 作为标识符）。

### 从 React Native 调用原生函数（原生模块）

原生模块是可以在 JS 中使用的 Java/Kotlin 类。通常每个 JS bridge 会创建一个此类模块的实例。它们可以向 React Native 导出任意函数和常量。相关内容已在[本文](legacy/native-modules-android)中详细介绍。

:::warning
所有原生模块共享同一个命名空间。创建新模块时要注意名称冲突。
:::
