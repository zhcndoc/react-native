---
id: performance
title: 性能概述
---

使用 React Native 而不是基于 WebView 的工具的一个令人信服的理由是达到至少每秒 60 帧，并为你的应用提供原生的外观和感觉。只要可行，我们的目标是让 React Native 自动处理优化，让你专注于应用而无需担心性能。然而，在某些领域我们尚未完全达到该水平，而在其他领域，React Native（类似于直接编写原生代码）无法为你确定最佳优化方法。在这种情况下，手动干预变得必要。我们致力于默认提供如黄油般顺滑的 UI 性能，但可能存在无法实现的情况。

本指南旨在教你一些基础知识，帮助你 [排查性能问题](profiling.md)，并讨论 [问题的常见来源及其建议的解决方案](performance.md#common-sources-of-performance-problems)。

## 关于帧你需要知道什么

你祖父母那一代人把电影称为 ["活动画面"](https://www.youtube.com/watch?v=F1i40rnpOsA) 是有原因的：视频中逼真的运动是一种错觉，是由以恒定速度快速变化的静态图像产生的。我们将这些图像中的每一张称为帧。每秒显示的帧数直接影响视频（或用户界面）看起来有多平滑，最终影响其逼真程度。iOS 和 Android 设备至少以每秒 60 帧的速度显示，这给你和 UI 系统最多 16.67ms 的时间来完成生成用户在该间隔内将在屏幕上看到的静态图像（帧）所需的所有工作。如果你无法在分配的时间槽内完成生成该帧所需的工作，那么你将会“丢帧”，并且 UI 将显得无响应。

现在为了让事情稍微复杂一点，在你的应用中打开 [开发菜单](debugging.md#opening-the-dev-menu) 并切换 `Show Perf Monitor`。你会注意到有两个不同的帧率。

![性能监控截图](/docs/assets/PerfUtil.png)

### JS 帧率（JavaScript 线程）

对于大多数 React Native 应用，你的业务逻辑将在 JavaScript 线程上运行。这是你的 React 应用所在之处，API 调用在此发出，触摸事件在此处理，等等。对原生支持视图的更新会被批处理，并在事件循环的每次迭代结束时，在帧截止日期之前（如果一切顺利）发送到原生端。如果 JavaScript 线程在一帧期间无响应，它将被视为丢帧。例如，如果你在复杂应用的根组件上设置新状态，并且导致重新渲染计算成本高的组件子树，这可能会花费 200ms 并导致丢失 12 帧。在此期间，任何由 JavaScript 控制的动画似乎都会冻结。如果丢失足够的帧，用户会感觉到。

一个例子是响应触摸：如果你在 JavaScript 线程上的多帧中执行工作，你可能会注意到响应 `TouchableOpacity` 时有延迟，例如。这是因为 JavaScript 线程很忙，无法处理从主线程发送过来的原始触摸事件。因此，`TouchableOpacity` 无法对触摸事件做出反应并命令原生视图调整其不透明度。

### UI 帧率（主线程）

你可能已经注意到，原生堆栈导航器（例如 React Navigation 提供的 [@react-navigation/native-stack](https://reactnavigation.org/docs/native-stack-navigator)）的性能开箱即用比基于 JavaScript 的堆栈导航器更好。这是因为过渡动画是在原生主 UI 线程上执行的，因此它们不会被 JavaScript 线程上的丢帧中断。

同样，当 JavaScript 线程被锁定时，你可以愉快地上下滚动 `ScrollView`，因为 `ScrollView` 位于主线程上。滚动事件会被分派到 JS 线程，但它们的接收对于滚动的发生不是必需的。

## 性能问题的常见来源

### 在开发模式下运行（`dev=true`）

JavaScript 线程性能会受到很大影响，当在开发模式下运行时。这是不可避免的：需要在运行时完成更多的工作来为你提供良好的警告和错误消息。务必确保在 [发布构建](running-on-device.md#building-your-app-for-production) 中测试性能。

### 使用 `console.log` 语句

当运行捆绑的应用时，这些语句会导致 JavaScript 线程出现大瓶颈。这包括来自调试库（如 [redux-logger](https://github.com/evgenyrodionov/redux-logger)）的调用，因此在捆绑前务必移除它们。你也可以使用这个 [babel 插件](https://babeljs.io/docs/plugins/transform-remove-console/) 来移除所有 `console.*` 调用。你需要先用 `npm i babel-plugin-transform-remove-console --save-dev` 安装它，然后像这样编辑项目目录下的 `.babelrc` 文件：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

这将自动移除项目发布（生产）版本中的所有 `console.*` 调用。

即使你的项目中没有进行 `console.*` 调用，也建议使用该插件。第三方库也可能调用它们。

### `FlatList` 渲染太慢或大列表滚动性能差

如果你的 [`FlatList`](flatlist.md) 渲染缓慢，请确保你已实现 [`getItemLayout`](flatlist.md#getitemlayout) 以通过跳过渲染项的测量来优化渲染速度。

还有一些其他针对性能优化的第三方列表库，包括 [FlashList](https://github.com/shopify/flash-list) 和 [Legend List](https://github.com/legendapp/legend-list)。

### 因同时在 JavaScript 线程上做大量工作而导致 JS 线程 FPS 下降

“导航器过渡缓慢”是这种情况最常见的表现，但还有其他时候会发生。使用 [`InteractionManager`](interactionmanager.md) 可能是一个好方法，但如果用户体验成本太高以至于不能在动画期间延迟工作，那么你可能要考虑 [`LayoutAnimation`](layoutanimation.md)。

[`Animated API`](animated.md) 目前在 JavaScript 线程上按需计算每个关键帧，除非你 [设置 `useNativeDriver: true`](/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app)，而 [`LayoutAnimation`](layoutanimation.md) 利用 Core Animation 并不受 JS 线程和主线程丢帧的影响。

使用这种情况的一个案例是在初始化模态框时制作动画（从顶部滑下并淡入半透明覆盖层），同时可能接收多个网络请求的响应，渲染模态框的内容，并更新打开模态框的视图。有关如何使用 `LayoutAnimation` 的更多信息，请参阅 [动画指南](animations.md)。

**注意事项：**

- `LayoutAnimation` 仅适用于即发即弃的动画（“静态”动画）——如果必须是可中断的，你将需要使用 [`Animated`](animated.md)。

### 在屏幕上移动视图（滚动、平移、旋转）会降低 UI 线程 FPS

在 Android 上尤其如此，当你有透明背景的文本位于图像顶部时，或者任何需要在每一帧上重新绘制视图需要 alpha 合成的情况。你会发现启用 `renderToHardwareTextureAndroid` 可以显著帮助解决这个问题。对于 iOS，`shouldRasterizeIOS` 默认已启用。

注意不要过度使用此功能，否则你的内存使用量可能会飙升。使用这些属性时要分析你的性能和内存使用情况。如果你不再计划移动视图，请关闭此属性。

### 动画化图像尺寸会降低 UI 线程 FPS

在 iOS 上，每次你调整 [`Image` 组件](image.md) 的宽度或高度时，它都会从原始图像重新裁剪和缩放。这可能非常昂贵，尤其是对于大图像。相反，使用 `transform: [{scale}]` 样式属性来动画化尺寸。你可能会这样做的一个例子是当你点击图像并将其放大到全屏时。

### 我的 TouchableX 视图响应不够灵敏

有时，如果我们在调整响应触摸的组件的不透明度或高亮显示的同一帧中执行操作，直到 `onPress` 函数返回后我们才会看到该效果。如果 `onPress` 设置了一个导致大量重新渲染的状态并因此丢失了几帧，就可能发生这种情况。解决此问题的方法是将 `onPress` 处理程序中的任何操作包装在 `requestAnimationFrame` 中：

```tsx
function handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```
