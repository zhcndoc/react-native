---
id: communication-ios
title: 原生与 React Native 之间的通信
---

在 [集成到现有应用指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-ios) 中，我们学习了如何将 React Native 嵌入到原生组件中，反之亦然。当我们将原生组件与 React Native 组件混合使用时，最终会发现需要在这两个世界之间进行通信。实现这一点的一些方式已经在其他指南中提到过。本文将总结可用的技术。

## 介绍

React Native 受 React 启发，因此信息流的基本思想是相似的。React 中的数据流是单向的。我们维护一个组件层次结构，其中每个组件只依赖于它的父组件和自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给子组件。如果某个祖先组件依赖于其后代组件的状态，就应该向下传递一个回调，让后代组件用它来更新祖先组件。

同样的概念也适用于 React Native。只要我们完全在框架内构建应用，就可以用属性和回调来驱动应用。但当我们混合使用 React Native 和原生组件时，就需要一些特定的、跨语言的机制，来在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方法，既能将属性从原生传递到 React Native，也能从 React Native 传递到原生。

### 将属性从原生传递到 React Native

为了在原生组件中嵌入 React Native 视图，我们使用 `RCTRootView`。`RCTRootView` 是一个 `UIView`，用于承载 React Native 应用。它还提供了原生端与所承载应用之间的接口。

`RCTRootView` 有一个初始化方法，允许你将任意属性传递给 React Native 应用。`initialProperties` 参数必须是 `NSDictionary` 的实例。该字典会在内部转换为 JSON 对象，顶层的 JS 组件可以引用它。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ffffff/000000.png",
                       @"https://dummyimage.com/600x400/000000/ffffff.png"];

NSDictionary *props = @{@"images" : imageList};

RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                 moduleName:@"ImageBrowserApp"
                                          initialProperties:props];
```

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

`RCTRootView` 还提供了一个可读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用会使用新属性重新渲染。只有当新的更新后属性与之前的属性不同，才会执行更新。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

任何时候更新属性都是可以的。不过，更新必须在主线程上执行。你可以在任何线程上使用 getter。

:::note
目前有一个已知问题：在 bridge 启动期间设置 appProperties 时，变更可能会丢失。更多信息请参见 https://github.com/facebook/react-native/issues/20115。
:::

没有办法一次只更新少量属性。我们建议你在自己的封装中实现这一点。

### 将属性从 React Native 传递到原生

原生组件属性的暴露问题在 [这篇文章](legacy/native-components-ios#properties) 中有详细说明。简而言之，在自定义原生组件中使用 `RCT_CUSTOM_VIEW_PROPERTY` 宏导出属性，然后在 React Native 中像使用普通 React Native 组件一样使用它们。

### 属性的局限性

跨语言属性的主要缺点是它们不支持回调，而回调可以让我们处理自底向上的数据绑定。设想你有一个较小的 RN 视图，希望由于某个 JS 操作而从原生父视图中移除。用 props 无法做到这一点，因为信息需要自底向上流动。

尽管我们有一种跨语言回调的方式（[在此处描述](legacy/native-modules-ios#callbacks)），但这些回调并不总是我们需要的东西。主要问题在于，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发一个原生动作，并在 JS 中处理该动作的结果。

## 跨语言交互的其他方式（事件和原生模块）

如前一章所述，使用属性会带来一些限制。有时属性不足以驱动应用逻辑，我们需要一种更灵活的解决方案。本章介绍 React Native 中可用的其他通信技术。它们既可用于内部通信（RN 中 JS 层和原生层之间），也可用于外部通信（RN 与应用中“纯原生”部分之间）。

React Native 允许你执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。不幸的是，取决于我们所处的一侧，实现同一个目标的方式不同。对于原生端，我们使用事件机制来安排在 JS 中执行处理函数；而对于 React Native，我们直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在 [这篇文章](legacy/native-components-ios#events) 中有详细介绍。请注意，使用事件无法保证执行时间，因为事件是在单独的线程上处理的。

事件非常强大，因为它们允许我们在不需要引用 React Native 组件的情况下对其进行更改。不过，在使用它们时，你可能会遇到一些陷阱：

- 由于事件可以从任何地方发送，它们可能会在你的项目中引入意大利面条式依赖。
- 事件共享命名空间，这意味着你可能会遇到名称冲突。冲突不会被静态检测到，因此很难调试。
- 如果你使用同一个 React Native 组件的多个实例，并且希望从事件的角度区分它们，你可能需要引入标识符，并将它们与事件一起传递（你可以使用原生视图的 `reactTag` 作为标识符）。

当我们将原生组件嵌入到 React Native 中时，常见的模式是让原生组件的 `RCTViewManager` 作为这些视图的代理，并通过 bridge 将事件发送回 JavaScript。这样可以把相关的事件调用集中在一个地方。

### 从 React Native 调用原生函数（原生模块）

原生模块是可在 JS 中使用的 Objective-C 类。通常，每个模块在每个 JS bridge 中都会创建一个实例。它们可以向 React Native 导出任意函数和常量。它们在 [这篇文章](legacy/native-modules-ios#content) 中有详细介绍。

原生模块是单例这一事实限制了在嵌入场景中的这种机制。假设我们有一个嵌入在原生视图中的 React Native 组件，并且我们想更新原生的父视图。使用原生模块机制时，我们会导出一个函数，它不仅接受预期的参数，还接受父原生视图的标识符。该标识符将用于检索父视图的引用，以便进行更新。也就是说，我们需要在模块中维护从标识符到原生视图的映射。

尽管这个方案很复杂，但它被用于 `RCTUIManager`，这是一个管理所有 React Native 视图的 React Native 内部类。

原生模块还可用于将现有原生库暴露给 JS。 [Geolocation 库](https://github.com/michalchudziak/react-native-geolocation) 就是这个想法的一个实际例子。

:::caution
所有原生模块共享同一个命名空间。创建新模块时要注意名称冲突。
:::

## 布局计算流程

在集成原生和 React Native 时，我们还需要一种方法来整合两套不同的布局系统。本节介绍常见的布局问题，并简要说明可用于解决这些问题的机制。

### 嵌入在 React Native 中的原生组件布局

这一情况在 [这篇文章](legacy/native-components-ios#styles) 中有介绍。简而言之，由于我们所有的原生 React 视图都是 `UIView` 的子类，大多数样式和尺寸属性都能像你预期的那样直接工作。

### 嵌入在原生中的 React Native 组件布局

#### 固定大小的 React Native 内容

一般场景是我们有一个固定大小的 React Native 应用，这个大小原生端是已知的。特别地，全屏 React Native 视图就属于这种情况。如果我们想要更小的根视图，可以显式设置 `RCTRootView` 的 frame。

例如，要让一个 RN 应用高 200（逻辑）像素，并且宿主视图足够宽，我们可以这样做：

```objectivec title='SomeViewController.m'
- (void)viewDidLoad
{
  [...]
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:appName
                                            initialProperties:props];
  rootView.frame = CGRectMake(0, 0, self.view.width, 200);
  [self.view addSubview:rootView];
}
```

当我们有一个固定大小的根视图时，需要在 JS 端尊重它的边界。换句话说，我们需要确保 React Native 内容能够容纳在这个固定大小的根视图中。最简单的办法是使用 Flexbox 布局。如果你使用绝对定位，并且 React 组件在根视图边界之外可见，就会与原生视图重叠，从而导致某些功能出现异常行为。例如，`TouchableHighlight` 不会高亮根视图边界之外的触摸。

通过重新设置 root view 的 frame 来动态更新其大小完全没问题。React Native 会负责内容布局。

#### 可变大小的 React Native 内容

在某些情况下，我们希望渲染初始大小未知的内容。假设这个大小将在 JS 中动态定义。对此我们有两种解决方案。

1. 你可以将 React Native 视图包装在一个 `ScrollView` 组件中。这可以保证你的内容始终可用，并且不会与原生视图重叠。
2. React Native 允许你在 JS 中确定 RN 应用的大小，并将其提供给宿主 `RCTRootView` 的所有者。然后由所有者负责重新布局子视图并保持 UI 一致。我们通过 `RCTRootView` 的灵活性模式来实现这一点。

`RCTRootView` 支持 4 种不同的尺寸灵活性模式：

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

`RCTRootViewSizeFlexibilityNone` 是默认值，它会使根视图的大小固定（但仍可通过 `setFrame:` 更新）。另外三种模式允许我们跟踪 React Native 内容的大小更新。例如，将模式设置为 `RCTRootViewSizeFlexibilityHeight` 会使 React Native 测量内容高度，并将该信息传回给 `RCTRootView` 的代理。代理中可以执行任意操作，包括设置根视图的 frame，以便让内容适配。只有当内容大小发生变化时，才会调用代理。

:::caution
同时在 JS 和原生两侧使某个维度都可变，会导致未定义行为。例如——当你在宿主 `RCTRootView` 上使用 `RCTRootViewSizeFlexibilityWidth` 时，不要再用 `flexbox` 让顶层 React 组件的宽度可变。
:::

让我们看一个例子。

```objectivec title='FlexibleSizeExampleView.m'
- (instancetype)initWithFrame:(CGRect)frame
{
  [...]

  _rootView = [[RCTRootView alloc] initWithBridge:bridge
  moduleName:@"FlexibilityExampleApp"
  initialProperties:@{}];

  _rootView.delegate = self;
  _rootView.sizeFlexibility = RCTRootViewSizeFlexibilityHeight;
  _rootView.frame = CGRectMake(0, 0, self.frame.size.width, 0);
}

#pragma mark - RCTRootViewDelegate
- (void)rootViewDidChangeIntrinsicSize:(RCTRootView *)rootView
{
  CGRect newFrame = rootView.frame;
  newFrame.size = rootView.intrinsicContentSize;

  rootView.frame = newFrame;
}
```

在这个例子中，我们有一个 `FlexibleSizeExampleView` 视图，它持有一个 root view。我们创建 root view，对其进行初始化并设置代理。代理将处理尺寸更新。然后，我们将 root view 的尺寸灵活性设置为 `RCTRootViewSizeFlexibilityHeight`，这意味着每当 React Native 内容改变高度时，都会调用 `rootViewDidChangeIntrinsicSize:` 方法。最后，我们设置 root view 的宽度和位置。注意，我们也设置了高度，但由于我们让高度依赖于 RN，所以它没有作用。

你可以在 [这里](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm) 查看该示例的完整源代码。

动态更改 root view 的尺寸灵活性模式是可以的。更改 root view 的灵活性模式会安排一次布局重新计算，并且在内容尺寸已知后会调用代理 `rootViewDidChangeIntrinsicSize:` 方法。

:::note
React Native 的布局计算是在单独的线程上进行的，而原生 UI 视图更新是在主线程上完成的。
这可能会导致原生和 React Native 之间出现暂时性的 UI 不一致。这是一个已知问题，我们的团队正在努力同步来自不同来源的 UI 更新。
:::

:::note
在 root view 成为其他某个视图的子视图之前，React Native 不会执行任何布局计算。
如果你想在 React Native 视图尺寸已知之前将其隐藏，请将 root view 添加为子视图，并使其初始为隐藏状态（使用 `UIView` 的 `hidden` 属性）。然后在代理方法中更改其可见性。
:::
