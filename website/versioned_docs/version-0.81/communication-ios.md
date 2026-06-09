---
id: communication-ios
title: 原生与 React Native 之间的通信
---

在 [集成到现有应用指南](integration-with-existing-apps) 和 [原生 UI 组件指南](legacy/native-components-ios) 中，我们学习了如何将 React Native 嵌入到原生组件中，反之亦然。当我们混合原生和 React Native 组件时，我们最终会发现需要在这两个世界之间进行通信。其他指南中已经提到了一些实现方法。本文总结了可用的技术。

## 简介

React Native 的灵感来自 React，因此信息流的基本思想是相似的。React 中的信息流是单向的。我们维护一个组件层级，其中每个组件仅依赖于其父组件和自身的内部状态。我们通过属性来实现这一点：数据以自上而下的方式从父组件传递给其子组件。如果祖先组件依赖于其后代组件的状态，则应该传递一个回调供后代组件用来更新祖先组件。

同样的概念也适用于 React Native。只要我们纯粹在框架内构建应用，我们就可以通过属性和回调驱动应用。但是，当我们混合 React Native 和原生组件时，我们需要一些特定的跨语言机制，以便在它们之间传递信息。

## 属性

属性是跨组件通信最直接的方式。因此，我们需要一种方法既可以从原生传递属性到 React Native，也可以从 React Native 传递属性到原生。

### 从原生传递属性到 React Native

为了在原生组件中嵌入 React Native 视图，我们使用 `RCTRootView`。`RCTRootView` 是一个容纳 React Native 应用的 `UIView`。它还提供了原生端和托管应用之间的接口。

`RCTRootView` 有一个初始化方法，允许你将任意属性向下传递到 React Native 应用。`initialProperties` 参数必须是 `NSDictionary` 的实例。该字典在内部转换为顶层 JS 组件可以引用的 JSON 对象。

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

`RCTRootView` 还提供了一个读写属性 `appProperties`。设置 `appProperties` 后，React Native 应用将使用新属性重新渲染。仅当新更新的属性与之前的属性不同时，才会执行更新。

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

随时更新属性没问题。但是，更新必须在主线程上执行。你可以在任何线程上使用 getter。

:::note
目前，已知存在一个问题，即在桥接启动期间设置 appProperties，更改可能会丢失。参见 https://github.com/facebook/react-native/issues/20115 获取更多信息。
:::

无法一次只更新少数几个属性。我们建议你将其构建到你自己的封装中。

### 从 React Native 传递属性到原生

[这篇文章](legacy/native-components-ios#properties) 详细介绍了暴露原生组件属性的问题。简而言之，在你的自定义原生组件中使用 `RCT_CUSTOM_VIEW_PROPERTY` 宏导出属性，然后在 React Native 中使用它们，就像该组件是普通 React Native 组件一样。

### 属性的限制

跨语言属性的主要缺点是不支持回调，这将允许我们处理自下而上的数据绑定。想象一下，你有一个小型 RN 视图，作为 JS 动作的结果，你希望将其从原生父视图中移除。无法通过属性做到这一点，因为信息需要自下而上传递。

虽然我们有一种跨语言回调（[此处描述](legacy/native-modules-ios#callbacks)），但这些回调并不总是我们需要的。主要问题是它们并非旨在作为属性传递。相反，这种机制允许我们从 JS 触发原生动作，并在 JS 中处理该动作的结果。

## 其他跨语言交互方式（事件和原生模块）

正如上一章所述，使用属性有一些限制。有时属性不足以驱动我们的应用逻辑，我们需要一个提供更高灵活性的解决方案。本章涵盖 React Native 中可用的其他通信技术。它们可用于内部通信（RN 中 JS 和原生层之间）以及外部通信（RN 和你应用的“纯原生”部分之间）。

React Native 允许你执行跨语言函数调用。你可以从 JS 执行自定义原生代码，反之亦然。不幸的是，取决于我们工作的那一端，我们以不同的方式实现相同的目标。对于原生端，我们使用事件机制来调度 JS 中处理函数的执行，而对于 React Native，我们直接调用原生模块导出的方法。

### 从原生调用 React Native 函数（事件）

[这篇文章](legacy/native-components-ios#events) 详细描述了事件。请注意，使用事件并不能保证执行时间，因为事件是在单独的线程上处理的。

事件很强大，因为它们允许我们更改 React Native 组件而无需对它们的引用。但是，在使用它们时可能会陷入一些陷阱：

- 由于事件可以从任何地方发送，它们可能会将面条式依赖引入到你的项目中。
- 事件共享命名空间，这意味着你可能会遇到一些名称冲突。冲突不会静态检测到，这使得它们难以调试。
- 如果你使用同一个 React Native 组件的多个实例，并且你想从事件的角度区分它们，你可能需要引入标识符并随事件传递它们（你可以使用原生视图的 `reactTag` 作为标识符）。

我们在 React Native 中嵌入原生时使用的常见模式是将原生组件的 RCTViewManager 作为视图的代理，通过桥接将事件发送回 JavaScript。这将相关事件调用保持在一处。

### 从 React Native 调用原生函数（原生模块）

原生模块是在 JS 中可用的 Objective-C 类。通常每个 JS 桥接为每个模块创建一个实例。它们可以向 React Native 导出任意函数和常量。[这篇文章](legacy/native-modules-ios#content) 详细介绍了它们。

原生模块是单例这一事实限制了嵌入上下文中的机制。假设我们有一个嵌入在原生视图中的 React Native 组件，并且我们想要更新原生父视图。使用原生模块机制，我们将导出一个函数，该函数不仅接受预期参数，还接受父原生视图的标识符。该标识符将用于检索父视图的引用以进行更新。也就是说，我们需要在模块中保持从标识符到原生视图的映射。

虽然这个解决方案很复杂，但它用于 `RCTUIManager`，这是一个管理所有 React Native 视图的 React Native 内部类。

原生模块也可用于向 JS 暴露现有的原生库。[Geolocation 库](https://github.com/michalchudziak/react-native-geolocation) 就是这个想法的实际示例。

:::caution
所有原生模块共享相同的命名空间。创建新模块时要注意名称冲突。
:::

## 布局计算流

集成原生和 React Native 时，我们还需要一种方法来整合两个不同的布局系统。本节涵盖常见布局问题，并提供解决这些问题的机制的简要描述。

### 嵌入在 React Native 中的原生组件的布局

[这篇文章](legacy/native-components-ios#styles) 涵盖了这种情况。总之，由于我们所有的原生 React 视图都是 `UIView` 的子类，大多数样式和尺寸属性将按预期开箱即用。

### 嵌入在原生的 React Native 组件的布局

#### 固定尺寸的 React Native 内容

一般场景是我们有一个固定尺寸的 React Native 应用，该尺寸对原生端已知。特别是，全屏 React Native 视图属于这种情况。如果我们想要一个较小的根视图，我们可以显式设置 RCTRootView 的 frame。

例如，要使 RN 应用高 200（逻辑）像素，并与宿主视图的宽度一样宽，我们可以这样做：

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

当我们有一个固定尺寸的根视图时，我们需要在 JS 端尊重其边界。换句话说，我们需要确保 React Native 内容可以被包含在固定尺寸的根视图内。确保这一点的最简单方法是使用 Flexbox 布局。如果你使用绝对定位，并且 React 组件在根视图边界外可见，你将与原生视图重叠，导致某些功能表现异常。例如，`TouchableHighlight` 不会高亮根视图边界外的触摸。

通过重新设置其 frame 属性来动态更新根视图的尺寸是完全没问题的。React Native 将处理内容的布局。

#### 灵活尺寸的 React Native 内容

在某些情况下，我们希望渲染初始未知尺寸的内容。假设尺寸将在 JS 中动态定义。我们有两个解决方案。

1. 你可以将 React Native 视图包裹在 `ScrollView` 组件中。这保证你的内容始终可用，并且不会与原生视图重叠。
2. React Native 允许你在 JS 中确定 RN 应用的尺寸，并将其提供给托管 `RCTRootView` 的所有者。所有者然后负责重新布局子视图并保持 UI 一致。我们通过 `RCTRootView` 的灵活性模式来实现这一点。

`RCTRootView` 支持 4 种不同的尺寸灵活性模式：

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

`RCTRootViewSizeFlexibilityNone` 是默认值，它使根视图的尺寸固定（但仍可以通过 `setFrame:` 更新）。其他三种模式允许我们追踪 React Native 内容的尺寸更新。例如，将模式设置为 `RCTRootViewSizeFlexibilityHeight` 将导致 React Native 测量内容的高度，并将该信息传回 `RCTRootView` 的代理。可以在代理中执行任意动作，包括设置根视图的 frame，以便内容适配。仅当内容尺寸更改时才会调用代理。

:::caution
在 JS 和原生中都使一个维度灵活会导致未定义行为。例如 - 不要使顶层 React 组件的宽度灵活（使用 `flexbox`），而你在托管 `RCTRootView` 上使用 `RCTRootViewSizeFlexibilityWidth`。
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

在示例中，我们有一个 `FlexibleSizeExampleView` 视图，它持有一个根视图。我们创建根视图，初始化它并设置代理。代理将处理尺寸更新。然后，我们将根视图的尺寸灵活性设置为 `RCTRootViewSizeFlexibilityHeight`，这意味着每次 React Native 内容更改其高度时，`rootViewDidChangeIntrinsicSize:` 方法将被调用。最后，我们设置根视图的宽度和位置。请注意，我们也在那里设置了高度，但它没有效果，因为我们使高度依赖于 RN。

你可以 [这里](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm) 查看示例的完整源代码。

动态更改根视图的尺寸灵活性模式是没问题的。更改根视图的灵活性模式将调度布局重算，一旦内容尺寸已知，代理 `rootViewDidChangeIntrinsicSize:` 方法将被调用。

:::note
React Native 布局计算在单独的线程上执行，而原生 UI 视图更新在主线程上完成。
这可能会导致原生和 React Native 之间的临时 UI 不一致。这是一个已知问题，我们的团队正在致力于同步来自不同来源的 UI 更新。
:::

:::note
直到根视图成为其他视图的子视图之前，React Native 不执行任何布局计算。
如果你想在知道 React Native 视图的尺寸之前隐藏它，请将根视图添加为子视图并使其初始隐藏（使用 `UIView` 的 `hidden` 属性）。然后在代理方法中更改其可见性。
:::
