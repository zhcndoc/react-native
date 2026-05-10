---
id: performance
title: 性能概览
---

使用 React Native 而不是基于 WebView 的工具，一个很有说服力的原因是：能够实现至少每秒 60 帧，并为你的应用提供原生的外观和体验。只要条件允许，我们希望 React Native 能自动处理优化，让你专注于应用本身，而不必担心性能问题。然而，有些领域我们还没有完全达到这个水平；还有一些领域，React Native（类似于直接编写原生代码）无法替你判断最佳的优化方式。在这些情况下，就需要手动干预。我们努力默认就提供丝滑流畅的 UI 性能，但有时这并不总是可能的。

本指南旨在教你一些基础知识，帮助你[排查性能问题](profiling.md)，并讨论[常见问题来源及其建议解决方案](performance.md#common-sources-of-performance-problems)。

## 关于帧，你需要了解什么

你的祖父母那一代把电影称作[“活动图像”](https://www.youtube.com/watch?v=F1i40rnpOsA)是有原因的：视频中的真实运动其实是一种错觉，它是通过以恒定速度快速切换静态图像来实现的。我们把这些图像中的每一张称为一帧。每秒显示的帧数会直接影响视频（或用户界面）看起来有多流畅，以及最终有多接近真实。iOS 和 Android 设备至少每秒显示 60 帧，这意味着你和 UI 系统最多只有 16.67ms 来完成生成那张静态图像（帧）的所有工作，而用户将在这段时间内在屏幕上看到它。如果你无法在分配的时间内完成生成该帧所需的工作，那么你就会“掉帧”，UI 也会显得没有响应。

为了让事情稍微复杂一点，打开应用中的[开发者菜单](debugging.md#opening-the-dev-menu)，然后切换 `Show Perf Monitor`。你会注意到这里有两种不同的帧率。

![性能监视器截图](/docs/assets/PerfUtil.png)

### JS 帧率（JavaScript 线程）

对于大多数 React Native 应用，你的业务逻辑会运行在 JavaScript 线程上。React 应用就在这里运行，API 调用在这里发起，触摸事件在这里处理，等等。对原生视图的更新会被批量处理，并在每一轮事件循环结束时、帧截止时间之前发送到原生端（如果一切顺利的话）。如果 JavaScript 线程在某一帧内没有响应，就会被视为掉帧。例如，如果你在一个复杂应用的根组件上设置了一个新状态，并导致需要重新渲染计算开销很大的组件子树，那么完全有可能这会花费 200ms，并导致 12 帧丢失。任何由 JavaScript 控制的动画都会在那段时间内看起来像冻结了一样。如果掉帧足够多，用户就会明显感觉到。

一个例子是响应触摸：如果你在 JavaScript 线程上跨多个帧执行工作，你可能会注意到对 `TouchableOpacity` 的响应会有延迟。这是因为 JavaScript 线程正忙着，无法处理从主线程传来的原始触摸事件。结果就是，`TouchableOpacity` 无法对触摸事件作出反应并指示原生视图调整其不透明度。

### UI 帧率（主线程）

你可能已经注意到，原生栈导航器（例如 React Navigation 提供的 [@react-navigation/native-stack](https://reactnavigation.org/docs/native-stack-navigator)）开箱即用时的性能，比基于 JavaScript 的栈导航器更好。这是因为过渡动画是在原生 UI 主线程上执行的，所以不会因为 JavaScript 线程掉帧而中断。

同样地，当 JavaScript 线程被卡住时，你仍然可以顺畅地在 `ScrollView` 中上下滚动，因为 `ScrollView` 运行在主线程上。滚动事件会被派发到 JS 线程，但它们是否被接收并不是滚动发生所必需的。

## 性能问题的常见来源

### 在开发模式下运行（`dev=true`）

在开发模式下运行时，JavaScript 线程性能会大幅下降。这是不可避免的：为了向你提供良好的警告和错误信息，运行时需要做更多工作。务必始终在[发布构建](running-on-device.md#building-your-app-for-production)中测试性能。

### 使用 `console.log` 语句

在运行打包后的应用时，这些语句会成为 JavaScript 线程上的一个严重瓶颈。这也包括来自调试库的调用，例如 [redux-logger](https://github.com/evgenyrodionov/redux-logger)，所以在打包之前务必把它们移除。你也可以使用这个会移除所有 `console.*` 调用的 [babel 插件](https://babeljs.io/docs/plugins/transform-remove-console/)。你需要先使用 `npm i babel-plugin-transform-remove-console --save-dev` 安装它，然后像下面这样编辑项目目录下的 `.babelrc` 文件：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

这会在项目的发布（生产）版本中自动移除所有 `console.*` 调用。

即使你的项目中没有调用 `console.*`，也建议使用这个插件。第三方库也可能会调用它们。

### `FlatList` 渲染太慢，或者在大列表上的滚动性能很差

如果你的 [`FlatList`](flatlist.md) 渲染很慢，请确保你已经实现了 [`getItemLayout`](flatlist.md#getitemlayout)，通过跳过对已渲染项目的测量来优化渲染速度。

还有一些其他经过性能优化的第三方列表库，包括 [FlashList](https://github.com/shopify/flash-list) 和 [Legend List](https://github.com/legendapp/legend-list)。

### 因为同时在 JavaScript 线程上做了大量工作，导致 JS 线程 FPS 下降

“导航器过渡缓慢”是这种情况最常见的表现形式，但也可能在其他时候发生。使用 [`InteractionManager`](interactionmanager.md) 可能是一个不错的方法，但如果在动画期间延迟工作会带来过高的用户体验代价，那么你可能需要考虑 [`LayoutAnimation`](layoutanimation.md)。

[`Animated API`](animated.md) 目前会在 JavaScript 线程上按需计算每一帧关键帧，除非你[设置 `useNativeDriver: true`](/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app)；而 [`LayoutAnimation`](layoutanimation.md) 则利用了 Core Animation，不受 JS 线程和主线程掉帧的影响。

这种情况下的一个使用场景是：在初始化的同时，也许还在接收多个网络请求的响应、渲染 modal 的内容，以及更新打开 modal 的视图时，对 modal 做动画（从顶部滑下并淡入一个半透明遮罩层）。有关如何使用 `LayoutAnimation` 的更多信息，请参阅[动画指南](animations.md)。

**注意：**

- `LayoutAnimation` 只适用于一次性完成的动画（“静态”动画）——如果它必须可以被中断，你就需要使用 [`Animated`](animated.md)。

### 在屏幕上移动一个视图（滚动、平移、旋转）会降低 UI 线程 FPS

这一点在 Android 上尤其明显：当你在图片上方放置带透明背景的文字，或者任何需要 alpha 合成才能在每一帧重新绘制视图的场景时，都会如此。你会发现启用 `renderToHardwareTextureAndroid` 能显著改善这种情况。对于 iOS，`shouldRasterizeIOS` 默认已经启用。

注意不要过度使用，否则内存占用可能会暴涨。在使用这些属性时，请分析你的性能和内存使用情况。如果你不再打算移动某个视图，就把这个属性关闭。

### 对图片大小做动画会降低 UI 线程 FPS

在 iOS 上，每次你调整 [`Image` 组件](image.md)的宽度或高度时，它都会基于原图重新裁剪并缩放。这可能非常耗费性能，尤其是大图。相反，请使用 `transform: [{scale}]` 样式属性来为大小变化添加动画。一个你可能会这么做的例子是：点击图片后将其放大到全屏。

### 我的 TouchableX 视图响应不太灵敏

有时，如果我们在调整一个响应触摸的组件的不透明度或高亮效果的同一帧里执行某个操作，那么在 `onPress` 函数返回之前，我们不会看到那个效果。如果 `onPress` 设置了一个状态，导致大量重新渲染，并因此丢失了几帧，就可能会出现这种情况。解决方法是把 `onPress` 处理函数里的任何操作包裹在 `requestAnimationFrame` 中：

```tsx
function handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```
