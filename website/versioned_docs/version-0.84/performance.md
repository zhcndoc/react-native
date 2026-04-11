---
id: performance
title: 性能概览
---

使用 React Native 而非基于 WebView 的工具的一个有力理由是为了实现至少 60 帧每秒的流畅体验，并为你的应用提供原生的外观和感觉。我们力求让 React Native 自动处理优化，让你可以专注于应用开发而无需担心性能问题。然而，有些方面我们尚未达到理想水平，还有一些情况和直接编写原生代码类似，React Native 无法帮你决定最佳的优化方案，这时就需要手动干预。我们争取默认实现丝滑顺畅的 UI 性能，但有些情况下这可能无法做到。

本指南旨在教你一些基础知识，帮助你 [排查性能问题](profiling.md)，并讨论 [常见性能问题的来源及建议的解决方案](performance.md#common-sources-of-performance-problems)。

## 你需要了解的关于帧的信息

你祖父母那代称电影为 ["活动影像"](https://www.youtube.com/watch?v=F1i40rnpOsA) 是有原因的：视频中的真实运动是一种由快速切换的静态图片以恒定速度产生的错觉。我们将这些图片称为帧。每秒显示的帧数直接影响视频（或用户界面）的流畅度和逼真感。iOS 和 Android 设备至少以 60 帧每秒的速度显示，这意味着你和 UI 系统最多有 16.67 毫秒的时间来完成生成用户在该时间段内看到的静态图片（帧）所需的所有工作。如果你未能在规定时间内完成该帧图像的生成，就会“丢帧”，界面看起来就会无响应。

为使问题更复杂一些，在你的应用中打开 [开发者菜单](debugging.md#opening-the-dev-menu) 并切换 `Show Perf Monitor`。你会注意到有两个不同的帧率。

![性能监视器截图](/docs/assets/PerfUtil.png)

### JS 帧率（JavaScript 线程）

对于大多数 React Native 应用，你的业务逻辑运行在 JavaScript 线程。这是你的 React 应用所在，API 调用的发起地，触摸事件的处理地等等。对原生视图的更新会被批量处理并发送到原生端，发送时机是在事件循环的每次迭代结束前，并且在帧的截止时间之前（如果一切顺利）。如果 JavaScript 线程在某一帧内无响应，该帧将被视为丢失。例如，如果你在一个复杂应用的根组件设置新状态，导致重渲染计算开销大的组件子树，可能会耗时 200 毫秒，导致丢失 12 帧。任何由 JavaScript 控制的动画都会暂停，用户会明显感受到界面卡顿。

以响应触摸为例：如果你在 JavaScript 线程中跨多个帧进行工作，你可能会注意到 `TouchableOpacity` 的响应延迟。因为 JavaScript 线程忙碌，不能处理主线程发送过来的原始触摸事件，导致 `TouchableOpacity` 无法响应触摸事件，也无法命令原生视图调整不透明度。

### UI 帧率（主线程）

你可能会注意到，原生堆栈导航器（如 React Navigation 提供的 [@react-navigation/native-stack](https://reactnavigation.org/docs/native-stack-navigator)）的性能开箱即用要好于基于 JavaScript 的堆栈导航器。这是因为界面转换动画是在原生主 UI 线程上执行，不会被 JavaScript 线程的丢帧影响。

类似地，你可以在 JavaScript 线程卡死时顺畅地上下滚动 `ScrollView`，这是因为 `ScrollView` 运行在主线程。虽然滚动事件会被派发到 JS 线程，但滚动本身不依赖于它的接收。

## 常见性能问题来源

### 以开发模式运行（`dev=true`）

JavaScript 线程性能在开发模式下大打折扣。这是不可避免的：为了给你提供良好的警告和错误信息，运行时需要做更多工作。务必在 [发布版本](running-on-device.md#building-your-app-for-production) 中测试性能。

### 使用 `console.log` 语句

在打包的应用中，这些语句可能成为 JavaScript 线程的瓶颈。这包括调试库如 [redux-logger](https://github.com/evgenyrodionov/redux-logger) 的调用，打包前一定要删除。你也可以使用这个 [babel 插件](https://babeljs.io/docs/plugins/transform-remove-console/) 来移除所有 `console.*` 调用。首先用 `npm i babel-plugin-transform-remove-console --save-dev` 安装，然后在项目目录下编辑 `.babelrc` 文件，内容如下：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

这样在项目的发布（生产）版本中，会自动移除所有 `console.*` 调用。

即使你的项目中没有直接使用 `console.*`，也推荐使用该插件，因为第三方库可能使用。

### `FlatList` 渲染太慢或大型列表滚动性能差

如果你的 [`FlatList`](flatlist.md) 渲染缓慢，确保已经实现了 [`getItemLayout`](flatlist.md#getitemlayout) ，这样可以跳过对已渲染项的测量，提高渲染速度。

还有一些其他性能优化的第三方列表库，包括 [FlashList](https://github.com/shopify/flash-list) 和 [Legend List](https://github.com/legendapp/legend-list)。

### JS 线程同一时间做大量工作导致帧率下降

“导航器过渡缓慢”是最常见的表现，但也可能出现在其他场景。使用 [`InteractionManager`](interactionmanager.md) 是一种好方法，但如果延迟执行工作会对用户体验产生较大影响，则可能需要考虑使用 [`LayoutAnimation`](layoutanimation.md)。

目前，[`Animated API`](animated.md) 会在 JavaScript 线程按需计算每一关键帧，除非你 [设置 `useNativeDriver: true`](/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app)，而 [`LayoutAnimation`](layoutanimation.md) 利用 Core Animation，不受 JS 和主线程丢帧影响。

使用 `LayoutAnimation` 的一个场景是：在弹出模态窗口（从上方滑出且淡入半透明遮罩层）时，同时初始化并可能接收多条网络请求响应，渲染模态内容并更新模态窗口打开位置的视图。有关如何使用 `LayoutAnimation`，请参阅 [动画指南](animations.md)。

**注意事项：**

- `LayoutAnimation` 只适合“一发即忘”的动画（“静态”动画）——如果动画必须可中断，需要使用 [`Animated`](animated.md)。

### 页面上视图的移动（滚动、平移、旋转）导致 UI 线程帧率下降

这在 Android 上尤为明显，尤其是当你有透明背景文字叠加在图片上，或者其他需要透明度合成抢占重绘的情况。启用 `renderToHardwareTextureAndroid` 可以显著提升性能。iOS 上默认已启用 `shouldRasterizeIOS`。

但请注意不要滥用，否则内存占用可能激增。使用这些属性时请监控性能和内存使用。如果不再移动视图，记得关闭该属性。

### 动画调整图片尺寸导致 UI 线程帧率下降

在 iOS 上，每次调整 [`Image` 组件](image.md) 的宽或高，都会对原始图片重新裁剪和缩放。这代价高昂，尤其是大图。建议使用 `transform: [{scale}]` 这样的方法来调整尺寸动画。例如，用户点击图片并放大全屏时。

### 我的 TouchableX 视图响应不够快

有时，如果在调整触摸响应组件的不透明度或高亮状态的同一帧执行动作，可能直到 `onPress` 函数返回后才看到效果。这种情况通常是因为 `onPress` 里设置了状态，触发了较重的重渲染，导致丢帧。解决办法是将任何 `onPress` 里的操作用 `requestAnimationFrame` 包裹：

```tsx
function handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```