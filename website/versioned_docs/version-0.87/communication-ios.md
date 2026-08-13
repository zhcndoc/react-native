---
id: communication-ios
title: 原生代码与 React Native 之间的通信
---

在[与现有应用集成指南](integration-with-existing-apps)和[原生 UI 组件指南](legacy/native-components-ios)中，我们了解了如何将 React Native 嵌入原生组件，以及反过来如何将原生组件嵌入 React Native。当我们混合使用原生组件和 React Native 组件时，最终会需要在这两个世界之间进行通信。其他指南中已经提到了一些实现方式。本文总结了可用的技术。

## 简介

React Native 的灵感来源于 React，因此信息流的基本理念与 React 类似。React 中的信息流是单向的。我们维护一个组件层级结构，其中每个组件只依赖于其父组件和自身的内部状态。我们通过属性来实现这一点：数据以自顶向下的方式从父组件传递给子组件。如果某个祖先组件依赖于其后代组件的状态，则应向下传递一个回调，供后代组件用于更新祖先组件。

同样的概念也适用于 React Native。只要我们完全在框架内部构建应用，就可以通过属性和回调来驱动应用。但是，当我们混合使用 React Native 和原生组件时，就需要一些特定的跨语言机制，以便在它们之间传递信息。

## 属性

属性是实现组件间通信最直接的方式。因此，我们需要一种既能将属性从原生传递给 React Native，又能将属性从 React Native 传递给原生的方法。

### 将属性从原生传递给 React Native

为了将 React Native 视图嵌入原生组件，我们使用 `RCTRootView`。`RCTRootView` 是一个承载 React Native 应用的 `UIView`。它还提供了原生端与所承载应用之间的接口。

`RCTRootView` 有一个初始化方法，允许你将任意属性传递给 React Native 应用。`initialProperties` 参数必须是 `NSDictionary` 的实例。该字典会在内部转换为 JSON 对象，顶层 JS 组件可以引用该对象。

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

`RCTRootView` 还提供了可读写的 `appProperties` 属性。设置 `appProperties` 后，React Native 应用会使用新属性重新渲染。只有当更新后的新属性与之前的属性不同时，才会执行更新。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

随时更新属性都是可以的。但是，更新必须在主线程上执行。你可以在任意线程上使用 getter。

:::note
目前存在一个已知问题：如果在 bridge 启动期间设置 appProperties，该更改可能会丢失。有关更多信息，请参阅 https://github.com/facebook/react-native/issues/20115。
:::

无法一次只更新少量属性。我们建议你将此功能构建到自己的包装器中。

### 将属性从 React Native 传递给原生

[本文](legacy/native-components-ios#properties)详细介绍了如何公开原生组件的属性。简而言之，在自定义原生组件中使用 `RCT_CUSTOM_VIEW_PROPERTY` 宏导出属性，然后在 React Native 中像使用普通 React Native 组件一样使用这些属性。

### 属性的限制

跨语言属性的主要缺点是它们不支持回调，而回调可以让我们处理自底向上的数据绑定。假设你有一个小型 RN 视图，并且希望在 JS 操作产生结果后将其从原生父视图中移除。使用 props 无法实现这一点，因为信息需要自底向上传递。

尽管我们提供了一种跨语言回调（[详见此处](legacy/native-modules-ios#callbacks)），但这些回调并不总是我们需要的东西。主要问题在于，它们并不是为了作为属性传递而设计的。相反，这种机制允许我们从 JS 触发一个原生操作，并在 JS 中处理该操作的结果。

## 其他跨语言交互方式（事件和原生模块）

如上一章所述，使用属性存在一些限制。有时属性不足以驱动应用逻辑，此时我们需要一种更加灵活的解决方案。本章介绍 React Native 中可用的其他通信技术。它们既可用于内部通信（RN 中 JS 层与原生层之间），也可用于外部通信（RN 与应用中“纯原生”部分之间）。

React Native 支持执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。但是，根据我们所处的端不同，实现同一目标的方式也不同。对于原生端，我们使用事件机制来安排 JS 中处理函数的执行；对于 React Native，我们则直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

[本文](legacy/native-components-ios#events)详细介绍了事件。请注意，使用事件无法保证执行时间，因为事件会在单独的线程上处理。

事件功能强大，因为它允许我们在不需要引用 React Native 组件的情况下修改这些组件。但是，在使用事件时，可能会遇到一些问题：

- 由于事件可以从任意位置发送，因此可能会在项目中引入意大利面式的依赖关系
- 事件共享命名空间，这意味着你可能会遇到一些名称冲突。冲突不会在静态分析时被检测出来，因此很难调试
- 如果你使用同一个 React Native 组件的多个实例，并且希望从事件的角度区分它们，那么通常需要引入标识符，并将它们随事件一起传递（你可以使用原生视图的 `reactTag` 作为标识符）

在 React Native 中嵌入原生组件时，我们通常会让原生组件的 RCTViewManager 作为这些视图的代理，通过 bridge 将事件发送回 JavaScript。这样可以将相关的事件调用集中在一处。

### 从 React Native 调用原生函数（原生模块）

原生模块是可在 JS 中使用的 Objective-C 类。通常，每个模块会针对每个 JS bridge 创建一个实例。它们可以向 React Native 导出任意函数和常量。[本文](legacy/native-modules-ios#content)对其进行了详细介绍。

原生模块是单例这一事实限制了其在嵌入场景中的使用。假设我们在一个原生视图中嵌入了一个 React Native 组件，并且希望更新原生父视图。使用原生模块机制时，我们需要导出一个函数，该函数不仅要接收预期参数，还要接收原生父视图的标识符。我们会使用该标识符获取父视图的引用并进行更新。也就是说，我们需要在模块中维护从标识符到原生视图的映射。

虽然这个解决方案比较复杂，但 `RCTUIManager` 使用了这种方式。`RCTUIManager` 是 React Native 的内部类，负责管理所有 React Native 视图。

原生模块还可以用于向 JS 公开现有的原生库。[Geolocation 库](https://github.com/michalchudziak/react-native-geolocation)就是这一理念的实际示例。

:::caution
所有原生模块共享同一个命名空间。创建新的原生模块时，请注意名称冲突。
:::

## 布局计算流程

在集成原生和 React Native 时，我们还需要一种整合两种不同布局系统的方式。本节介绍常见的布局问题，并简要说明解决这些问题的机制。

### React Native 中嵌入的原生组件的布局

[本文](legacy/native-components-ios#styles)介绍了这种情况。总的来说，由于我们所有的原生 react 视图都是 `UIView` 的子类，因此大多数样式和尺寸属性都可以按预期直接使用。

### 原生中嵌入的 React Native 组件的布局

#### 固定尺寸的 React Native 内容

常见情况是，我们有一个尺寸固定且原生端已知的 React Native 应用。特别是，全屏 React Native 视图就属于这种情况。如果希望使用更小的根视图，可以显式设置 RCTRootView 的 frame。

例如，要让 RN 应用的高度为 200 个（逻辑）像素，同时宽度与承载视图相同，我们可以这样做：

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

当根视图尺寸固定时，我们需要在 JS 端遵守其边界。换句话说，我们需要确保 React Native 内容能够容纳在固定尺寸的根视图中。确保这一点最简单的方式是使用 Flexbox 布局。如果使用绝对定位，并且 React 组件显示在根视图边界之外，就会与原生视图重叠，导致某些功能表现异常。例如，`TouchableHighlight` 不会高亮根视图边界之外的触摸操作。

动态更新根视图的尺寸、重新设置其 frame 属性是完全可以的。React Native 会负责处理内容的布局。

#### 灵活尺寸的 React Native 内容

在某些情况下，我们希望渲染初始尺寸未知的内容。假设尺寸将由 JS 动态定义。针对这个问题，我们有两种解决方案。

1. 你可以将 React Native 视图包装在 `ScrollView` 组件中。这样可以保证你的内容始终可用，并且不会与原生视图重叠
2. React Native 允许你在 JS 中确定 RN 应用的尺寸，并将其提供给承载 `RCTRootView` 的所有者。然后，所有者负责重新布局子视图，并保持 UI 一致。我们通过 `RCTRootView` 的灵活性模式来实现这一点

`RCTRootView` 支持 4 种不同的尺寸灵活性模式：

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

`RCTRootViewSizeFlexibilityNone` 是默认值，它会使根视图的尺寸固定（但仍然可以通过 `setFrame:` 更新）。其他三种模式允许我们跟踪 React Native 内容的尺寸更新。例如，将模式设置为 `RCTRootViewSizeFlexibilityHeight` 会使 React Native 测量内容的高度，并将该信息传递回 `RCTRootView` 的代理。代理中可以执行任意操作，包括设置根视图的 frame，使内容能够适配。只有当内容尺寸发生变化时，才会调用代理。

:::caution
同时在 JS 和原生端将某个维度设置为灵活，会导致未定义行为。例如，在使用承载 `RCTRootView` 的 `RCTRootViewSizeFlexibilityWidth` 时，不要将顶层 React 组件的宽度设置为灵活（使用 `flexbox`）。
:::

让我们来看一个示例。

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

在这个示例中，我们有一个承载根视图的 `FlexibleSizeExampleView` 视图。我们创建根视图、对其进行初始化并设置代理。代理将处理尺寸更新。然后，我们将根视图的尺寸灵活性设置为 `RCTRootViewSizeFlexibilityHeight`，这意味着每当 React Native 内容的高度发生变化时，都会调用 `rootViewDidChangeIntrinsicSize:` 方法。最后，我们设置根视图的宽度和位置。请注意，我们也设置了高度，但这不会产生任何效果，因为我们已将高度设置为由 RN 决定。

你可以在[此处](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm)查看示例的完整源代码。

动态更改根视图的尺寸灵活性模式是可以的。更改根视图的灵活性模式会安排一次布局重新计算，并且在内容尺寸确定后调用一次 `rootViewDidChangeIntrinsicSize:` 代理方法。

:::note
React Native 的布局计算在单独的线程上执行，而原生 UI 视图更新则在主线程上执行。
这可能会导致原生和 React Native 之间暂时的 UI 不一致。这是一个已知问题，我们的团队正在努力同步来自不同来源的 UI 更新。
:::

:::note
在根视图成为其他视图的子视图之前，React Native 不会执行任何布局计算。
如果你希望在 React Native 视图的尺寸确定之前将其隐藏，请将根视图添加为子视图，并让它初始处于隐藏状态（使用 `UIView` 的 `hidden` 属性）。然后在代理方法中更改其可见性。
:::
