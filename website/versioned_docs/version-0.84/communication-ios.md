---
id: communication-ios
title: 原生与 React Native 之间的通信
---

在 [与现有应用程序集成指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-ios) 中，我们学习了如何在原生组件中嵌入 React Native，反之亦然。当我们混合使用原生与 React Native 组件时，最终会发现需要在这两个世界之间进行通信。其他指南中已经提到了一些实现方式。本文总结了可用的技术手段。

## 简介

React Native 受到 React 的启发，因此信息流的基本思想类似。React 中的信息流是单向的。我们维护一个组件层级结构，其中每个组件只依赖于它的父组件及其自身的内部状态。我们通过属性实现这一点：数据从父组件向子组件以自上而下的方式传递。如果祖先组件依赖于后代组件的状态，应该传递一个回调函数给后代组件，以便后代更新祖先。

相同的概念也适用于 React Native。只要我们纯粹在框架内构建应用，就能通过属性和回调驱动应用状态。但是，当混合使用 React Native 和原生组件时，我们需要一些特定的跨语言机制来传递它们之间的信息。

## 属性

属性是跨组件通信最简单直接的方式。因此需要有办法从原生向 React Native 传递属性，也需要从 React Native 向原生传递属性。

### 从原生传递属性到 React Native

为了在原生组件中嵌入 React Native 视图，我们使用 `RCTRootView`。`RCTRootView` 是一个承载 React Native 应用的 `UIView`，它同时提供了原生端与托管应用之间的接口。

`RCTRootView` 的初始化方法允许你向 React Native 应用传递任意属性。`initialProperties` 参数必须是 `NSDictionary` 的实例。该字典会在内部转换为顶层 JS 组件可以引用的 JSON 对象。

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

`RCTRootView` 还提供了一个读写属性 `appProperties`。设置该属性后，React Native 应用会使用新属性重新渲染。仅当新属性与之前不同才会执行更新。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

随时更新属性是允许的，但必须在主线程上进行更新，任意线程都可以使用 getter。

:::note
当前存在一个已知问题：在桥接启动期间设置 appProperties 时，变更可能丢失。详细信息请参见 https://github.com/facebook/react-native/issues/20115。
:::

没有办法一次只更新部分属性，建议自己在包装层实现这种功能。

### 从 React Native 传递属性到原生

关于暴露原生组件属性的问题，[这篇文章](legacy/native-components-ios#properties)做了详细介绍。简而言之，在自定义的原生组件中使用 `RCT_CUSTOM_VIEW_PROPERTY` 宏导出属性，然后在 React Native 中像使用普通 React Native 组件一样使用它们。

### 属性的局限性

跨语言属性的最大缺点是不支持回调，不能处理自下而上的数据绑定。比如，你有个小的 RN 视图，你希望它在 JS 端某个操作后从原生父视图中移除。用 props 是做不到的，因为信息需要自下而上传递。

尽管我们有跨语言回调的方式（[详见此处](legacy/native-modules-ios#callbacks)），但这些回调通常不是我们所需的。主要问题是它们不适合通过属性传递。这个机制允许从 JS 触发原生动作，并在 JS 中处理动作结果。

## 其他跨语言交互方式（事件和原生模块）

如上一章所述，使用属性存在一定限制。有时属性不足以驱动应用逻辑，我们需要更灵活的解决方案。本章介绍 React Native 中其他通信技术，它们既可用于内部通信（JS 与原生层之间），也可用于外部通信（RN 与纯原生应用部分之间）。

React Native 允许跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。但在不同端的实现方式不同。原生端通过事件机制调度 JS 回调执行；React Native 端直接调用导出自原生模块的方法。

### 从原生调用 React Native 函数（事件）

事件机制详见 [这篇文章](legacy/native-components-ios#events)。注意，事件的执行没有时间保证，因为事件处理发生在独立线程。

事件强大之处在于无需组件引用即可改变 React Native 组件。但使用时有陷阱：

- 事件可在任意位置发送，可能导致项目依赖变得复杂纠缠不清。
- 事件共享命名空间，可能出现命名冲突，且冲突无法静态检测，难以调试。
- 如果使用多个相同的 React Native 组件实例且想区分事件，需引入标识符并随事件传递（可用原生视图的 `reactTag` 作为标识）。

常见的做法是在将原生嵌入 React Native 时，使原生组件的 RCTViewManager 成为视图的代理，通过桥接向 JS 发送事件。这样相关事件调用集中管理。

### 从 React Native 调用原生函数（原生模块）

原生模块是 Objective-C 类，在 JS 端可用。通常每个 JS 桥接会创建该模块的一个实例。它们向 React Native 导出任意函数和常量。[这篇文章](legacy/native-modules-ios#content)有详细介绍。

原生模块是单例，这限制了嵌入场景的使用。比如，我们有个嵌入在原生视图中的 RN 组件，要更新原生父视图。通过原生模块，我们导出一个函数，不仅带预期参数，还得带父视图标识符以获取引用用于更新。为此，模块中需维护标识符到原生视图的映射。

虽然该方案复杂，但在内部 React Native 类 `RCTUIManager` 中使用，用以管理所有 React Native 视图。

原生模块也可用于将已有原生库暴露给 JS。[Geolocation 库](https://github.com/michalchudziak/react-native-geolocation)是一个活生生的示例。

:::caution
所有原生模块共享同一命名空间。创建新模块时务必注意命名冲突。
:::

## 布局计算流程

在集成原生与 React Native 时，也需要统一两种不同的布局系统。本节介绍常见布局问题，并简要说明应对机制。

### 嵌入 React Native 的原生组件布局

此场景已在 [这篇文章](legacy/native-components-ios#styles) 中讲解。简言之，由于原生 react 视图均是 `UIView` 子类，大部分样式和尺寸属性默认即可生效。

### 嵌入原生的 React Native 组件布局

#### 固定尺寸的 React Native 内容

常见情况是 React Native 应用尺寸固定，且原生端已知。比如全屏的 React Native 视图属于此类。若要更小尺寸的 root view，可显式设置 RCTRootView 的 frame。

例如，将 RN 应用高度固定为 200（逻辑）像素，宽度由宿主视图决定，可以写成：

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

当 root view 固定尺寸时，JS 端需遵守其边界。换言之，React Native 内容必须被限制在固定大小的 root view 内。最简单方式是使用 Flexbox 布局。如果使用绝对定位，且 React 组件呈现在 root view 边界之外，会与原生视图重叠，导致某些功能异常，例如超出边界的 'TouchableHighlight' 无法高亮。

动态通过重新设置 root view 的 frame 以更新尺寸是被允许的，React Native 会自动处理内容布局。

#### 灵活尺寸的 React Native 内容

有时我们需要渲染尺寸初始未知的内容，假设尺寸由 JS 端动态决定。有两种解决方案：

1. 将 React Native 视图包裹在 `ScrollView` 组件中，保证内容始终可用且不会与原生视图重叠。
2. React Native 允许在 JS 端测量 RN 应用尺寸并将结果反馈给宿主 `RCTRootView` 的所有者，由所有者负责重新布局子视图以保持 UI 一致。通过 `RCTRootView` 的尺寸灵活模式实现。

`RCTRootView` 支持四种尺寸灵活性模式：

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

默认是 `RCTRootViewSizeFlexibilityNone`，该模式下 root view 大小固定（但仍可用 `setFrame:` 更新）。其他三种模式允许追踪 React Native 内容尺寸的更新。例如，将模式设置为 `RCTRootViewSizeFlexibilityHeight` 时，React Native 会测量内容高度并将信息传回给 `RCTRootView` 的代理。代理可执行任意操作（如设置 root view 的 frame）以使内容合适。仅在内容尺寸变化时调用代理。

:::caution
在 JS 和原生两端都使某个维度灵活会导致未定义行为。例如，不要一边用 flexbox 使顶层 React 组件宽度灵活，同时在宿主 `RCTRootView` 上使用 `RCTRootViewSizeFlexibilityWidth`。
:::

示例如下：

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

示例中，`FlexibleSizeExampleView` 持有一个 root view。初始化后设置代理处理尺寸更新。将尺寸灵活性设置为 `RCTRootViewSizeFlexibilityHeight`，当 React Native 内容高度变化时，`rootViewDidChangeIntrinsicSize:` 将被调用。最后，设置 root view 的宽度和位置。注意这里高度也被设置，但无效，因为高度由 RN 控制。

完整示例代码可访问 [这里](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm)。

动态改变 root view 的尺寸灵活性模式也是允许的，改变模式会触发布局重新计算，并在内容尺寸确定后调用代理方法。

:::note
React Native 的布局计算在独立线程进行，而原生 UI 视图更新在主线程执行，可能导致原生与 React Native 之间出现短暂 UI 不一致。此为已知问题，我们团队正致力于同步来自不同源的 UI 更新。
:::

:::note
只有当 root view 成为某个视图的子视图时，React Native 才会执行布局计算。如果想在尺寸确定前隐藏 React Native 视图，可以先添加 root view 作为子视图，并将其初始设置为隐藏（使用 `UIView` 的 `hidden` 属性），随后在代理方法中改变可见性。
:::