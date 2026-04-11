---
id: performance
title: 性能概述
---

使用 React Native 而不是基于 WebView 的工具的一个令人信服的理由是达到每秒至少 60 帧，并为你的应用提供原生外观和感觉。只要可行，我们的目标是让 React Native 自动处理优化，让你专注于你的应用而无需担心性能。然而，在某些领域我们尚未达到那个水平，而在其他领域，React Native（类似于直接编写原生代码）无法为你确定最佳的优化方法。在这种情况下，手动干预变得必要。我们努力默认提供如黄油般顺滑的 UI 性能，但可能存在无法做到这一点的情况。

本指南旨在教你一些基础知识，帮助你 [排查性能问题](profiling.md)，并讨论 [常见的问题来源及其建议的解决方案](performance.md#common-sources-of-performance-problems)。

## 关于帧你需要知道什么

你祖父母那一代称电影为 ["活动图片"](https://www.youtube.com/watch?v=F1i40rnpOsA) 是有原因的：视频中逼真的运动是一种错觉，由以恒定速度快速变化的静态图像创建。我们将这些图像中的每一帧称为帧。每秒显示的帧数直接影响视频（或用户界面）看起来有多平滑并最终有多逼真。iOS 设备每秒显示至少 60 帧，这给你和 UI 系统最多 16.67 毫秒的时间来完成生成用户在该间隔内将在屏幕上看到的静态图像（帧）所需的所有工作。如果你无法在分配的时间槽内完成生成该帧所需的工作，那么你将“丢帧”，并且 UI 将显得无响应。

现在为了让事情稍微复杂一点，打开你应用中的 [开发菜单](debugging.md#opening-the-dev-menu) 并切换 `Show Perf Monitor`。你会注意到有两个不同的帧率。

![](/docs/assets/PerfUtil.png)

### JS 帧率（JavaScript 线程）

对于大多数 React Native 应用，你的业务逻辑将在 JavaScript 线程上运行。这里是你的 React 应用所在之处，API 调用发生，触摸事件被处理，等等... 对原生支持视图的更新会被批处理，并在事件循环每次迭代结束时，在帧截止日期之前（如果一切顺利）发送到原生端。如果 JavaScript 线程在一帧期间无响应，它将被视为丢帧。例如，如果你在复杂应用的根组件上调用 `this.setState` 并且它导致重新渲染计算昂贵的组件子树，可以想象这可能需要 200 毫秒并导致丢失 12 帧。任何由 JavaScript 控制的动画在此期间将显得冻结。如果任何事情花费超过 100 毫秒，用户将会感觉到。

这经常发生在 `Navigator` 过渡期间：当你推送一个新路由时，JavaScript 线程需要渲染场景所需的所有组件，以便向原生端发送正确的命令来创建支持视图。这里完成的工作花费几帧并导致 [卡顿](https://jankfree.org/) 是很常见的，因为过渡是由 JavaScript 线程控制的。有时组件会在 `componentDidMount` 上做额外的工作，这可能导致过渡中的第二次卡顿。

另一个例子是响应触摸：如果你在 JavaScript 线程上跨越多帧做工作，你可能会注意到响应 `TouchableOpacity` 时有延迟，例如。这是因为 JavaScript 线程很忙，无法处理从主线程发送过来的原始触摸事件。因此，`TouchableOpacity` 无法对触摸事件做出反应并命令原生视图调整其不透明度。

### UI 帧率（主线程）

许多人注意到 `NavigatorIOS` 的性能开箱即用比 `Navigator` 更好。这是因为过渡的动画完全在主线程上完成，因此它们不会被 JavaScript 线程上的丢帧中断。

类似地，当 JavaScript 线程被锁住时，你可以愉快地上下滚动 `ScrollView`，因为 `ScrollView` 位于主线程上。滚动事件被分派到 JS 线程，但它们的接收对于滚动发生不是必要的。

## 性能问题的常见来源

### 在开发模式下运行（`dev=true`）

在开发模式下运行时，JavaScript 线程性能会受到很大影响。这是不可避免的：需要在运行时做更多的工作来为你提供良好的警告和错误消息。务必确保在 [发布构建](running-on-device.md#building-your-app-for-production) 中测试性能。

### 使用 `console.log` 语句

当运行打包的应用时，这些语句会在 JavaScript 线程中造成很大的瓶颈。这包括来自调试库的调用，例如 [redux-logger](https://github.com/evgenyrodionov/redux-logger)，所以在打包前确保移除它们。你也可以使用这个 [babel 插件](https://babeljs.io/docs/plugins/transform-remove-console/) 来移除所有 `console.*` 调用。你需要先用 `npm i babel-plugin-transform-remove-console --save-dev` 安装它，然后像这样编辑项目目录下的 `.babelrc` 文件：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

这将自动移除你项目发布（生产）版本中的所有 `console.*` 调用。

即使你的项目中没有进行 `console.*` 调用，也建议使用该插件。第三方库也可能调用它们。

### `ListView` 初始渲染太慢或大列表滚动性能差

改用新的 [`FlatList`](flatlist.md) 或 [`SectionList`](sectionlist.md) 组件。除了简化 API 外，新的列表组件还具有显著的性能增强，主要一个是对于任何数量的行几乎恒定的内存使用。

如果你的 [`FlatList`](flatlist.md) 渲染缓慢，请确保你已实现 [`getItemLayout`](flatlist.md#getitemlayout) 以通过跳过渲染项的测量来优化渲染速度。

### 当重新渲染几乎不变的视图时 JS FPS 骤降

如果你正在使用 ListView，你必须提供一个 `rowHasChanged` 函数，它可以通过快速确定是否需要重新渲染行来减少大量工作。如果你使用不可变数据结构，这只需要是一个引用相等性检查。

类似地，你可以实现 `shouldComponentUpdate` 并指示你希望组件重新渲染的确切条件。如果你编写纯组件（其中渲染函数的返回值完全依赖于 props 和 state），你可以利用 PureComponent 为你做到这一点。再次强调，不可变数据结构有助于保持快速 -- 如果你必须对大型对象列表进行深度比较，可能重新渲染整个组件会更快，并且肯定需要更少的代码。

### 因为同时在 JavaScript 线程上做大量工作而导致 JS 线程 FPS 下降

“慢 Navigator 过渡”是这种情况最常见的表现，但也有其他时候会发生。使用 InteractionManager 可能是一个好方法，但如果用户体验成本太高以至于不能在动画期间延迟工作，那么你可能想要考虑 LayoutAnimation。

Animated API 目前在 JavaScript 线程上按需计算每个关键帧，除非你 [设置 `useNativeDriver: true`](/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app)，而 LayoutAnimation 利用 Core Animation 并且不受 JS 线程和主线程丢帧的影响。

我使用这种情况的一个案例是在初始化并可能接收几个网络请求的响应时，为模态框动画化（从顶部滑下并淡入半透明覆盖层），渲染模态框的内容，并更新打开模态框的视图。请参阅动画指南以获取有关如何使用 LayoutAnimation 的更多信息。

注意事项：

- LayoutAnimation 仅适用于即发即弃的动画（“静态”动画）-- 如果它必须是可中断的，你将需要使用 `Animated`。

### 在屏幕上移动视图（滚动、平移、旋转）会降低 UI 线程 FPS

当你有透明背景的文本位于图像顶部时，尤其是如此，或者任何需要在每一帧上重新绘制视图时需要 alpha 合成的其他情况。你会发现启用 `shouldRasterizeIOS` 或 `renderToHardwareTextureAndroid` 可以显著帮助解决这个问题。

小心不要过度使用这个，否则你的内存使用量可能会飙升。使用这些 props 时分析你的性能和内存使用情况。如果你不打算再移动视图，请关闭此属性。

### 动画化图像大小会降低 UI 线程 FPS

在 iOS 上，每次你调整 Image 组件的宽度或高度时，它都会从原始图像重新裁剪和缩放。这可能非常昂贵，尤其是对于大图像。相反，使用 `transform: [{scale}]` 样式属性来动画化大小。你可能会这样做的一个例子是当你点击图像并将其放大到全屏时。

### 我的 TouchableX 视图响应不是很灵敏

有时，如果我们在调整响应触摸的组件的不透明度或高亮的同一帧中执行操作，直到 `onPress` 函数返回后我们才会看到该效果。如果 `onPress` 执行一个 `setState` 导致大量工作和几帧丢失，这可能会发生。解决此问题的方法是将 `onPress` 处理程序内的任何操作包装在 `requestAnimationFrame` 中：

```tsx
handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```

### 慢 navigator 过渡

如上所述，`Navigator` 动画由 JavaScript 线程控制。想象一下“从右侧推入”场景过渡：每一帧，新场景从右向左移动，从屏幕外开始（假设 x 偏移量为 320），最终当场景位于 x 偏移量为 0 时稳定下来。在此过渡期间的每一帧，JavaScript 线程都需要向主线程发送一个新的 x 偏移量。如果 JavaScript 线程被锁住，它无法做到这一点，因此该帧上没有发生更新，动画会卡顿。

解决此问题的一个方法是允许基于 JavaScript 的动画卸载到主线程。如果我们用这种方法做与上面示例相同的事情，我们可以在开始过渡时计算新场景的所有 x 偏移量列表，并将它们发送到主线程以优化方式执行。既然 JavaScript 线程从这个责任中解放出来，如果它在渲染场景时丢失几帧也没关系 -- 你可能甚至不会注意到，因为你会被漂亮的过渡分散注意力。

解决这是新的 [React Navigation](navigation.md) 库背后的主要目标之一。React Navigation 中的视图使用原生组件和 [`Animated`](animated.md) 库来提供至少 60 FPS 的动画，这些动画在原生线程上运行。
