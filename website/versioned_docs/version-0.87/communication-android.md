---
id: communication-android
title: 原生与 React Native 之间的通信
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在 [Integrating with Existing Apps guide](integration-with-existing-apps) 和 [Native UI Components guide](legacy/native-components-android) 中，我们学习了如何将 React Native 嵌入原生组件，以及反过来将原生组件嵌入 React Native。将原生组件和 React Native 组件混合使用时，我们最终会发现需要在这两个世界之间进行通信。其他指南中已经提到了一些实现方式。本文总结了可用的技术。

## 简介

React Native 的灵感来自 React，因此信息流的基本理念类似。React 中的信息流是单向的。我们维护一个组件层级结构，其中每个组件只依赖于其父组件和自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给子组件。如果祖先组件依赖于其后代组件的状态，则应向下传递一个回调，供后代组件用于更新祖先组件。

同样的概念也适用于 React Native。只要我们完全在该框架内构建应用，就可以通过属性和回调来驱动应用。但是，当我们混合使用 React Native 和原生组件时，就需要一些特定的跨语言机制，以便在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种既能将属性从原生传递到 React Native，也能将属性从 React Native 传递到原生的方法。

### 将属性从原生传递到 React Native

你可以在主 Activity 中提供 `ReactActivityDelegate` 的自定义实现，将属性传递给 React Native 应用。此实现应重写 `getLaunchOptions`，以返回一个包含所需属性的 `Bundle`。

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

`ReactRootView` 提供了一个可读写的 `appProperties` 属性。设置 `appProperties` 后，React Native 应用会使用新属性重新渲染。只有当更新后的新属性与之前的属性不同时，才会执行更新。

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

随时更新属性都是可以的。但是，更新必须在主线程上执行。你可以在任意线程上使用 getter。

无法一次只更新几个属性。我们建议你将此功能构建到自己的封装器中。

:::info
目前，顶层 RN 组件的 JS 函数 `componentWillUpdateProps` 不会在属性更新后被调用。但是，你可以在 `componentDidMount` 函数中访问新属性。
:::

### 将属性从 React Native 传递到原生

原生组件属性的公开方式在[这篇文章](legacy/native-components-android#3-expose-view-property-setters-using-reactprop-or-reactpropgroup-annotation)中有详细介绍。简而言之，需要在 JavaScript 中反映的属性应公开为使用 `@ReactProp` 注解的 setter 方法，然后就可以在 React Native 中像使用普通 React Native 组件一样使用它们。

### 属性的限制

跨语言属性的主要缺点是它们不支持回调，而回调可以让我们处理自底向上的数据绑定。假设你有一个小型 RN 视图，并且希望根据 JS 操作将其从原生父视图中移除。使用属性无法做到这一点，因为信息需要自底向上传递。

虽然我们提供了一种跨语言回调形式（[此处有介绍](legacy/native-modules-android#callbacks)），但这些回调并不总是我们所需要的。主要问题是，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

如上一章所述，使用属性存在一些限制。有时属性不足以驱动应用的逻辑，我们需要一种更加灵活的解决方案。本章介绍 React Native 中可用的其他通信技术。它们既可以用于内部通信（RN 中 JS 层和原生层之间），也可以用于外部通信（RN 与应用的“纯原生”部分之间）。

React Native 支持执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。但是，根据我们操作的一方不同，实现相同目标的方式也不同。对于原生端，我们使用事件机制来安排 JS 中处理函数的执行；而对于 React Native，我们直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在[这篇文章](legacy/native-components-android#events)中有详细介绍。请注意，使用事件无法保证执行时间，因为事件会在单独的线程上处理。

事件功能强大，因为它们允许我们修改 React Native 组件，而无需获取对这些组件的引用。但是，在使用事件时可能会遇到一些问题：

- 由于事件可以从任何地方发送，因此它们可能会在项目中引入类似意大利面的依赖关系
- 事件共享命名空间，这意味着你可能会遇到名称冲突。冲突不会在静态分析时被检测到，因此很难调试
- 如果你使用同一个 React Native 组件的多个实例，并且希望从事件的角度区分它们，则可能需要引入标识符，并将其与事件一起传递（你可以使用原生视图的 `reactTag` 作为标识符）

### 从 React Native 调用原生函数（原生模块）

原生模块是可在 JS 中使用的 Java／Kotlin 类。通常，每个模块会为每个 JS bridge 创建一个实例。它们可以向 React Native 导出任意函数和常量。我们在[这篇文章](legacy/native-modules-android)中对其进行了详细介绍。

:::warning
所有原生模块共享同一个命名空间。创建新模块时请注意名称冲突。
:::
