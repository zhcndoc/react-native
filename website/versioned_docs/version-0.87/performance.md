---
id: performance
title: 性能概览
---

使用 React Native 而不是基于 WebView 的工具的一个有力理由，是实现至少每秒 60 帧，并为你的应用提供原生的外观和体验。在可行的情况下，我们希望 React Native 自动处理优化，让你可以专注于应用，而不必担心性能。不过，有些方面我们还没有达到这一水平，还有一些方面 React Native（与直接编写原生代码类似）无法替你确定最佳的优化方式。在这些情况下，就需要手动干预。我们致力于默认提供极其流畅的 UI 性能，但有时可能无法做到这一点。

本指南旨在教你一些基础知识，帮助你[排查性能问题](profiling.md)，并讨论[常见的问题来源及其建议解决方案](performance.md#common-sources-of-performance-problems)。

## 你需要了解的帧

你祖父母那一代人称电影为[“moving pictures”](https://www.youtube.com/watch?v=F1i40rnpOsA)是有原因的：视频中的真实运动是一种错觉，它是通过以恒定速度快速变换静态图像产生的。我们将这些图像中的每一张称为一帧。每秒显示的帧数会直接影响视频（或用户界面）看起来有多流畅，以及最终有多逼真。iOS 和 Android 设备每秒至少显示 60 帧，这意味着你和 UI 系统最多只有 16.67ms 来完成生成静态图像（帧）所需的全部工作，用户将在这段时间内看到该图像。如果你无法在规定的时间内完成生成该帧所需的工作，那么你就会“丢帧”，UI 看起来也会无响应。

现在让我们稍微把问题弄复杂一点，在你的应用中打开[开发者菜单](debugging.md#opening-the-dev-menu)，并切换 `Show Perf Monitor`。你会注意到有两种不同的帧率。

![性能监视器截图](/docs/assets/PerfUtil.png)

### JS 帧率（JavaScript 线程）

对于大多数 React Native 应用，你的业务逻辑将在 JavaScript 线程上运行。你的 React 应用就在这里，API 调用在这里发起，触摸事件在这里处理，等等。对由原生支持的视图的更新会进行批处理，并在事件循环的每次迭代结束时、帧截止时间之前发送到原生端（如果一切顺利）。如果 JavaScript 线程在一帧期间无响应，就会被视为丢帧。例如，如果你在一个复杂应用的根组件上设置了新状态，并导致计算成本高昂的组件子树重新渲染，那么这可能需要 200ms，并导致丢失 12 帧。任何由 JavaScript 控制的动画在此期间都会看起来像是冻结了。如果丢失的帧足够多，用户就会感受到这一点。

一个例子是响应触摸：如果你在 JavaScript 线程上跨多个帧执行工作，那么你可能会注意到响应 `TouchableOpacity` 的延迟。这是因为 JavaScript 线程正忙于工作，无法处理从主线程发送过来的原始触摸事件。因此，`TouchableOpacity` 无法响应触摸事件，也无法命令原生视图调整其不透明度。

### UI 帧率（主线程）

你可能已经注意到，原生堆栈导航器（例如 React Navigation 提供的 [@react-navigation/native-stack](https://reactnavigation.org/docs/native-stack-navigator)）开箱即用的性能比基于 JavaScript 的堆栈导航器更好。这是因为过渡动画在原生主 UI 线程上执行，因此不会受到 JavaScript 线程丢帧的影响。

同样，即使 JavaScript 线程被锁定，你也可以愉快地上下滚动 `ScrollView`，因为 `ScrollView` 位于主线程上。滚动事件会分派到 JS 线程，但滚动发生时不需要接收这些事件。

## 性能问题的常见来源

### 在开发模式下运行（`dev=true`）

在开发模式下运行时，JavaScript 线程的性能会大幅下降。这是不可避免的：为了在运行时为你提供良好的警告和错误消息，需要执行更多工作。请务必在[发布版本](running-on-device.md#building-your-app-for-production)中测试性能。

### 使用 `console.log` 语句

运行打包后的应用时，这些语句可能会在 JavaScript 线程中造成严重的瓶颈。这也包括来自调试库（例如 [redux-logger](https://github.com/evgenyrodionov/redux-logger)）的调用，因此请务必在打包前移除它们。你还可以使用这个 [babel 插件](https://babeljs.io/docs/plugins/transform-remove-console/)，它会移除所有 `console.*` 调用。你需要先使用 `npm i babel-plugin-transform-remove-console --save-dev` 安装它，然后像下面这样编辑项目目录下的 `.babelrc` 文件：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

这会自动移除项目发布（生产）版本中的所有 `console.*` 调用。

即使项目中没有使用任何 `console.*` 调用，也建议使用该插件。第三方库也可能会调用它们。

### 对于大型列表，`FlatList` 渲染速度太慢或滚动性能很差

如果你的 [`FlatList`](flatlist.md) 渲染缓慢，请确保已经实现了 [`getItemLayout`](flatlist.md#getitemlayout)，通过跳过对已渲染项目的测量来优化渲染速度。

此外，还有其他针对性能进行了优化的第三方列表库，包括 [FlashList](https://github.com/shopify/flash-list) 和 [Legend List](https://github.com/legendapp/legend-list)。

### 同时在 JavaScript 线程上执行大量工作导致 JS 线程 FPS 下降

“导航器过渡缓慢”是最常见的表现形式，但也有其他情况下会发生这种问题。将工作推迟到 JS 线程空闲时执行（例如使用 `requestIdleCallback`）可能是一个不错的方法，但如果在动画期间延迟工作所带来的用户体验成本太高，那么你可以考虑使用 [`LayoutAnimation`](layoutanimation.md)。

除非你[设置 `useNativeDriver: true`](/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app)，否则 [`Animated API`](animated.md) 目前会在 JavaScript 线程上按需计算每个关键帧，而 [`LayoutAnimation`](layoutanimation.md) 利用了 Core Animation，不受 JS 线程和主线程丢帧的影响。

一个适合使用它的场景是：在初始化多个网络请求并可能接收其响应、渲染模态框内容以及更新打开模态框的视图时，同时让模态框执行动画（从顶部向下滑动并淡入半透明遮罩层）。有关如何使用 `LayoutAnimation` 的更多信息，请参阅[动画指南](animations.md)。

**注意事项：**

- `LayoutAnimation` 仅适用于即发即忘的动画（“静态”动画）——如果动画必须可中断，则需要使用 [`Animated`](animated.md)。

### 在屏幕上移动视图（滚动、平移、旋转）会导致 UI 线程 FPS 下降

当你在 Android 上将透明背景的文本置于图像上方，或者在任何需要通过 alpha 合成在每一帧重新绘制视图的情况下，这一点尤其明显。你会发现，启用 `renderToHardwareTextureAndroid` 可以显著改善这一问题。对于 iOS，`shouldRasterizeIOS` 默认已经启用。

请注意不要过度使用此属性，否则内存使用量可能会急剧增加。使用这些属性时，请分析你的性能和内存使用情况。如果你不再计划移动某个视图，请关闭此属性。

### 调整图像大小的动画会导致 UI 线程 FPS 下降

在 iOS 上，每次调整 [`Image` 组件](image.md)的宽度或高度时，都会根据原始图像重新裁剪和缩放。这可能非常耗费资源，尤其是对于大型图像。相反，请使用 `transform: [{scale}]` 样式属性来为大小添加动画。一个适合这样做的例子是：当你点击图像并将其放大到全屏时。

### 我的 TouchableX 视图响应不够灵敏

有时，如果我们在调整响应触摸的组件的不透明度或高亮显示的同一帧中执行操作，那么直到 `onPress` 函数返回后，我们才能看到该效果。如果 `onPress` 设置了某个状态，导致大量重新渲染并因此丢失几帧，就可能出现这种情况。解决方法是将 `onPress` 处理函数中的任何操作包装在 `requestAnimationFrame` 中：

```tsx
function handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```
