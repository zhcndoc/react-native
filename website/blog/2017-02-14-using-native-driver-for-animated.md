---
title: 使用原生驱动实现动画
author: Janic Duplessis
authorTitle: App & Flow 软件工程师
authorURL: 'https://twitter.com/janicduplessis'
authorImageURL: 'https://secure.gravatar.com/avatar/8d6b6c0f5b228b0a8566a69de448b9dd?s=128'
authorTwitter: janicduplessis
tags: [engineering]
---

过去一年里，我们一直致力于提升使用 Animated 库实现动画的性能。动画对于创造美好的用户体验非常重要，但要做到完美也并不容易。我们希望让开发者更轻松地创建高性能动画，而不用担心部分代码会导致动画卡顿。

## 这是什么？

Animated API 的设计围绕一个非常重要的限制——它是可序列化的。这意味着我们可以在动画开始之前将动画的所有信息发送到原生端，让原生代码在 UI 线程上执行动画，而不必在每一帧都通过桥接调用。这非常有用，因为动画一旦开始，即使 JS 线程被阻塞，动画仍然能平滑运行。实际上，这种情况经常发生，因为用户代码运行在 JS 线程上，而 React 渲染可能也会长时间锁住 JS 线程。

## 一点历史...

这个项目大约始于一年前，当时 Expo 在 Android 平台上开发 li.st 应用。[Krzysztof Magiera](https://twitter.com/kzzzf) 被聘请负责 Android 平台的初始实现。最终效果很好，li.st 成为第一个使用 Animated 原生驱动动画的应用。几个月后，[Brandon Withrow](https://github.com/buba447) 完成了 iOS 平台的初始实现。随后，[Ryan Gomba](https://twitter.com/ryangomba) 和我一起添加了对 `Animated.event` 的支持，并修复了我们在生产应用中遇到的各种 bug。这真的是一次社区协作，我要感谢所有参与者，也感谢 Expo 对开发的大力支持。如今它被 React Native 的 `Touchable` 组件和新发布的[React Navigation](https://github.com/react-community/react-navigation)库中的导航动画广泛使用。

## 它是如何工作的？

首先，让我们看看使用 JS 驱动的 Animated 动画是如何工作的。当使用 Animated 时，你声明一个动画节点图，表示你想执行的动画，然后用驱动器根据预设曲线实时更新 Animated 值。你也可以通过 `Animated.event` 将 Animated 值连接到 `View` 的事件。

![](/blog/assets/animated-diagram.png)

动画各步骤及其所在线程说明：

- JS：动画驱动器使用 `requestAnimationFrame` 在每帧执行，基于动画曲线计算新值并更新目标值。
- JS：计算中间值并传递到附加到 `View` 的 props 节点。
- JS：通过 `setNativeProps` 更新 `View`。
- JS 到 Native 桥接。
- Native：更新 `UIView` 或 `android.View`。

如你所见，大部分工作都在 JS 线程上。如果 JS 线程被阻塞，动画会跳帧。同时，动画每帧都需要通过 JS 到 Native 桥接更新原生视图。

而原生驱动就是把这些步骤全部转到原生执行。由于 Animated 产生的是一张动画节点的有向图，它可以被序列化并在动画开始时发送到原生，仅需一次，省去了每帧回调 JS 线程的需求；原生代码只需在 UI 线程上每帧直接更新视图即可。

下面是如何序列化一个动画值和一个插值节点的示例（非精确实现，仅作示例）。

创建原生值节点，这个是将被动画的值：

```
NativeAnimatedModule.createNode({
  id: 1,
  type: 'value',
  initialValue: 0,
});
```

创建原生插值节点，告诉原生驱动如何插值：

```
NativeAnimatedModule.createNode({
  id: 2,
  type: 'interpolation',
  inputRange: [0, 10],
  outputRange: [10, 0],
  extrapolate: 'clamp',
});
```

创建原生 props 节点，告诉驱动附加的是视图的哪个属性：

```
NativeAnimatedModule.createNode({
  id: 3,
  type: 'props',
  properties: ['style.opacity'],
});
```

连接节点：

```
NativeAnimatedModule.connectNodes(1, 2);
NativeAnimatedModule.connectNodes(2, 3);
```

把 props 节点连接到视图：

```
NativeAnimatedModule.connectToView(3, ReactNative.findNodeHandle(viewRef));
```

这样，原生动画模块就有了直接更新原生视图的全部信息，无需通过 JS 计算值。

剩下的就是通过指定动画曲线类型和要更新的 Animated 值来启动动画。时间动画也可以通过在 JS 预先计算所有帧，简化原生实现。

```
NativeAnimatedModule.startAnimation({
  type: 'timing',
  frames: [0, 0.1, 0.2, 0.4, 0.65, ...],
  animatedValueId: 1,
});
```

动画运行时的流程：

- Native：原生动画驱动使用 `CADisplayLink` 或 `android.view.Choreographer` 在每帧执行，基于动画曲线计算新值更新动画值。
- Native：计算中间值并传递到附加到原生视图的 props 节点。
- Native：更新 `UIView` 或 `android.View`。

如你所见，不再经过 JS 线程，也不经过桥接，动画速度更快了！🎉🎉

## 如何在我的应用中使用？

对于普通动画，答案很简单，只需在启动动画的配置中添加 `useNativeDriver: true` 即可。

之前：

```
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
}).start();
```

之后：

```
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- 添加这一行
}).start();
```

一个 Animated 值只兼容一种驱动，如果你用原生驱动启动了某个值的动画，确保该值的所有动画都用原生驱动。

它同样支持 `Animated.event`，这在动画需跟随滚动位置时非常有用。没有原生驱动时，由于 React Native 的异步特性，动画总是滞后于手势一帧。

之前：

```
<ScrollView
  scrollEventThrottle={16}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }]
  )}
>
  {content}
</ScrollView>
```

之后：

```
<Animated.ScrollView // <-- 使用 Animated 的 ScrollView 包装器
  scrollEventThrottle={1} // <-- 设置 1 保证不丢失任何事件
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }],
    { useNativeDriver: true } // <-- 添加这一行
  )}
>
  {content}
</Animated.ScrollView>
```

## 注意事项

并不是 Animated 所支持的所有功能，原生驱动都支持。主要限制是你只能动画非布局属性，比如 `transform` 和 `opacity` 可用，但 Flexbox 以及 position 属性不可用。另一个限制是 `Animated.event` 只支持直接事件，不支持冒泡事件，这意味着不能与 `PanResponder` 一起用，但支持 `ScrollView#onScroll` 这类事件。

Native Animated 已经存在 React Native 很久了，但一直没有文档，因为它之前被视为实验性质。所以请确保使用的是较新的 React Native 版本（0.40 及以上）才能使用该功能。

## 参考资源

想了解更多关于 Animated 的内容，我推荐观看 [Christopher Chedeau](https://twitter.com/Vjeux) 的 [这场演讲](https://www.youtube.com/watch?v=xtqUJVqpKNo)。

如果你想深入了解动画以及把动画卸载给原生如何提升用户体验，可以看 [Krzysztof Magiera](https://twitter.com/kzzzf) 的 [这场讲座](https://www.youtube.com/watch?v=qgSMjYWqBk4)。