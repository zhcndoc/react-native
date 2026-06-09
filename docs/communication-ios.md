---
id: communication-ios
title: 原生与 React Native 之间的通信
---

在 [Integrating with Existing Apps guide](integration-with-existing-apps) 和 [Native UI Components guide](legacy/native-components-ios) 中，我们学习了如何将 React Native 嵌入到原生组件中，反之亦然。当我们混合使用原生组件和 React Native 组件时，最终会发现需要在这两个世界之间进行通信。实现这一点的一些方法已经在其他指南中提到过了。本文会总结可用的技术。

## 介绍

React Native 受 React 启发，因此信息流的基本思想是相似的。React 中的数据流是单向的。我们维护一个组件层级，其中每个组件只依赖于它的父组件和自身的内部状态。我们通过属性来做到这一点：数据以自上而下的方式从父组件传递给子组件。如果某个祖先组件依赖于其后代组件的状态，那么应该向下传递一个回调，供后代组件用来更新祖先组件。

同样的概念也适用于 React Native。只要我们完全在框架内部构建应用，就可以通过属性和回调来驱动应用。但是，当我们混合使用 React Native 和原生组件时，就需要一些特定的跨语言机制，允许我们在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方法，既能从原生传递属性给 React Native，也能从 React Native 传递属性给原生。

### 从原生向 React Native 传递属性

为了在原生组件中嵌入 React Native 视图，我们使用 `RCTRootView`。`RCTRootView` 是一个承载 React Native 应用的 `UIView`。它还提供了原生端与被承载应用之间的接口。

`RCTRootView` 有一个初始化方法，允许你向 React Native 应用传递任意属性。`initialProperties` 参数必须是 `NSDictionary` 的实例。这个字典会在内部被转换为一个 JSON 对象，顶层 JS 组件可以引用它。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ffffff/000000.png",
                       @"https://dummyimage.com/600x400/000000/ffffff.png"];

NSDictionary *props = @{@"images" : imageList};

RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                 moduleName:@"ImageBrowserApp"
                                          initialProperties:props];
```

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

`RCTRootView` 还提供了一个可读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用会使用新的属性重新渲染。只有当新的更新后的属性与之前的属性不同，才会执行更新。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

任何时候更新属性都是可以的。不过，更新必须在主线程上执行。getter 可以在任何线程上使用。

:::note
目前有一个已知问题：在 bridge 启动期间设置 `appProperties` 时，变更可能会丢失。更多信息请参见 https://github.com/facebook/react-native/issues/20115。
:::

不能一次只更新少量属性。我们建议你在自己的封装中实现这一点。

### 从 React Native 向原生传递属性

原生组件属性的暴露问题已经在 [本文](legacy/native-components-ios#properties) 中详细介绍。简而言之，在自定义原生组件中使用 `RCT_CUSTOM_VIEW_PROPERTY` 宏导出属性，然后在 React Native 中像使用普通 React Native 组件一样使用它们。

### 属性的局限

跨语言属性的主要缺点是它们不支持回调，而回调可以让我们处理自下而上的数据绑定。设想你有一个小型 RN 视图，希望由于某个 JS 动作而从原生父视图中移除。使用 props 无法做到这一点，因为信息需要自下而上流动。

虽然我们有一种跨语言回调的形式（[在这里描述](legacy/native-modules-ios#callbacks)），但这些回调并不总是我们所需要的。主要问题在于，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发一个原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

如前一章所述，使用属性会有一些限制。有时属性不足以驱动应用逻辑，我们需要一种更灵活的方案。本章介绍 React Native 中可用的其他通信技术。它们既可用于内部通信（RN 中 JS 层与原生层之间），也可用于外部通信（RN 与应用中“纯原生”部分之间）。

React Native 允许你执行跨语言函数调用。你可以从 JS 调用自定义原生代码，反之亦然。不幸的是，根据我们所处的一侧不同，实现相同目标的方式也不同。对于原生端，我们使用事件机制来安排在 JS 中执行一个处理函数；而对于 React Native，我们则直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

事件在 [本文](legacy/native-components-ios#events) 中有详细说明。请注意，使用事件时，我们无法保证执行时间，因为事件是在单独的线程上处理的。

事件很强大，因为它们允许我们在不需要引用 React Native 组件本身的情况下修改它们。然而，使用事件时也有一些容易踩到的坑：

- 由于事件可以从任何地方发送，它们可能会在你的项目中引入意大利面式依赖。
- 事件共享命名空间，这意味着你可能会遇到名称冲突。冲突不会被静态检测出来，因此很难调试。
- 如果你使用同一个 React Native 组件的多个实例，并且想从事件的角度区分它们，你很可能需要引入标识符，并随事件一起传递它们（你可以使用原生视图的 `reactTag` 作为标识符）。

在将原生嵌入 React Native 时，我们常用的模式是让原生组件的 `RCTViewManager` 作为视图的代理，通过 bridge 将事件发送回 JavaScript。这样可以把相关的事件调用集中在一个地方。

### 从 React Native 调用原生函数（原生模块）

原生模块是可在 JS 中使用的 Objective-C 类。通常每个模块会为每个 JS bridge 创建一个实例。它们可以向 React Native 导出任意函数和常量。相关内容已在 [本文](legacy/native-modules-ios#content) 中详细介绍。

原生模块是单例这一事实限制了它在嵌入场景中的使用。假设我们有一个嵌入在原生视图中的 React Native 组件，并且希望更新原生父视图。使用原生模块机制时，我们会导出一个函数，它不仅接收预期参数，还接收父原生视图的标识符。这个标识符将用于获取父视图的引用并进行更新。也就是说，我们需要在模块中维护一个从标识符到原生视图的映射。

尽管这个方案比较复杂，但它被用于 `RCTUIManager` 中，这是一个管理所有 React Native 视图的内部 React Native 类。

原生模块也可以用于将现有原生库暴露给 JS。`Geolocation library`(https://github.com/michalchudziak/react-native-geolocation) 是这一思路的一个实际例子。

:::caution
所有原生模块都共享同一个命名空间。创建新模块时要注意名称冲突。
:::

## 布局计算流程

在集成原生和 React Native 时，我们还需要一种方法来整合两套不同的布局系统。本节介绍常见的布局问题，并简要说明应对这些问题的机制。

### 嵌入在 React Native 中的原生组件布局

这个案例已在 [本文](legacy/native-components-ios#styles) 中介绍。简而言之，由于我们所有的原生 react 视图都是 `UIView` 的子类，大多数样式和尺寸属性都能按预期直接工作。

### 嵌入在原生中的 React Native 组件布局

#### 固定大小的 React Native 内容

常见场景是我们有一个固定大小的 React Native 应用，这个大小对原生端是已知的。特别是全屏 React Native 视图就属于这种情况。如果我们想要一个更小的根视图，可以显式设置 `RCTRootView` 的 frame。

例如，要让一个 RN 应用高 200（逻辑）像素，并让宿主视图足够宽，我们可以这样做：

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

当我们有一个固定大小的根视图时，需要在 JS 端尊重它的边界。换句话说，我们需要确保 React Native 内容能够被容纳在这个固定大小的根视图中。最简单的方法是使用 Flexbox 布局。如果你使用绝对定位，而 React 组件显示在根视图边界之外，就会与原生视图重叠，导致某些功能行为异常。例如，`TouchableHighlight` 不会高亮根视图边界之外的触摸。

通过重新设置根视图的 frame，动态更新它的大小完全没有问题。React Native 会负责内容的布局。

#### 可变大小的 React Native 内容

在某些情况下，我们希望渲染初始尺寸未知的内容。假设这个尺寸会在 JS 中动态定义。针对这个问题，我们有两种解决方案。

1. 你可以将 React Native 视图包装在 `ScrollView` 组件中。这能保证你的内容始终可见，并且不会与原生视图重叠。
2. React Native 允许你在 JS 中确定 RN 应用的尺寸，并将其提供给宿主 `RCTRootView` 的所有者。然后由所有者负责重新布局子视图并保持 UI 一致。我们通过 `RCTRootView` 的灵活性模式来实现这一点。

`RCTRootView` 支持 4 种不同的尺寸灵活性模式：

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

`RCTRootViewSizeFlexibilityNone` 是默认值，它会让根视图的尺寸固定（但仍然可以通过 `setFrame:` 更新）。另外三种模式允许我们跟踪 React Native 内容尺寸的变化。例如，将模式设置为 `RCTRootViewSizeFlexibilityHeight` 会导致 React Native 测量内容高度，并将该信息传回 `RCTRootView` 的代理。代理中可以执行任意操作，包括设置根视图的 frame，以便内容能够适配。只有在内容尺寸发生变化时，才会调用代理。

:::caution
在 JS 和原生两侧同时让某个维度保持灵活会导致未定义行为。例如——不要在宿主 `RCTRootView` 上使用 `RCTRootViewSizeFlexibilityWidth` 的同时，又让顶层 React 组件的宽度通过 `flexbox` 保持可变。
:::

让我们看一个示例。

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

在这个示例中，我们有一个 `FlexibleSizeExampleView` 视图，它持有一个 root view。我们创建 root view，对其进行初始化并设置代理。代理将处理尺寸更新。然后，我们将 root view 的尺寸灵活性设置为 `RCTRootViewSizeFlexibilityHeight`，这意味着每当 React Native 内容改变高度时，`rootViewDidChangeIntrinsicSize:` 方法都会被调用。最后，我们设置 root view 的宽度和位置。注意，我们也设置了高度，但由于高度变成了由 RN 决定，因此它不会产生作用。

你可以在[这里](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm)查看该示例的完整源代码。

动态更改 root view 的尺寸灵活性模式是可以的。更改 root view 的灵活性模式会安排一次布局重新计算，并且在内容尺寸已知后会调用代理 `rootViewDidChangeIntrinsicSize:` 方法。

:::note
React Native 的布局计算在单独的线程上执行，而原生 UI 视图更新在主线程上完成。
这可能会导致原生和 React Native 之间出现暂时的 UI 不一致。这是一个已知问题，我们的团队正在努力同步来自不同来源的 UI 更新。
:::

:::note
在 root view 成为其他视图的子视图之前，React Native 不会执行任何布局计算。
如果你想在 React Native 视图尺寸已知之前将其隐藏，请将 root view 作为子视图添加，并将其初始设为隐藏（使用 `UIView` 的 `hidden` 属性）。然后在代理方法中更改其可见性。
:::
