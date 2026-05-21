---
id: timers
title: 计时器
---

计时器是应用程序的重要组成部分，React Native 实现了 [浏览器计时器](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals)。

## 计时器

- `setTimeout` 和 `clearTimeout`
- `setInterval` 和 `clearInterval`
- `setImmediate` 和 `clearImmediate`
- `requestAnimationFrame` 和 `cancelAnimationFrame`

`requestAnimationFrame(fn)` 并不等同于 `setTimeout(fn, 0)`——前者会在所有帧都刷新完成后触发，而后者会尽可能快地触发（在 iPhone 5S 上每秒超过 1000 次）。

`setImmediate` 会在当前 JavaScript 执行块结束时执行，就在将批处理响应发送回原生模块之前。请注意，如果在 `setImmediate` 回调中调用 `setImmediate`，它将立即执行，中间不会屈服回原生模块。

`Promise` 实现使用 `setImmediate` 作为其异步实现。

:::note
在 Android 上调试时，如果调试器和设备之间的时间发生漂移；动画、事件行为等事物可能无法正常工作或结果可能不准确。
请在您的调试机器上运行 ``adb shell "date `date +%m%d%H%M%Y.%S%3N`"`` 来纠正此问题。在真实设备上使用需要 Root 权限。
:::

## 交互管理器

:::warning[已废弃]
`InteractionManager` 的行为已更改为与 `setImmediate` 相同，应改用后者。
:::

构建良好的原生应用感觉如此流畅的原因之一是在交互和动画期间避免昂贵的操作。在 React Native 中，我们目前有一个限制，即只有一个 JS 执行线程，但您可以使用 `InteractionManager` 确保长时间运行的工作安排在任何交互/动画完成后开始。

应用程序可以使用以下方法安排在交互后运行的任务：

```tsx
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

将其与其他调度替代方案进行比较：

- requestAnimationFrame()：用于随时间对视图进行动画处理的代码。
- setImmediate/setTimeout/setInterval()：稍后运行代码，请注意这可能会延迟动画。
- runAfterInteractions()：稍后运行代码，不会延迟活动动画。

触摸处理系统将一个或多个活动触摸视为“交互”，并将延迟 `runAfterInteractions()` 回调，直到所有触摸结束或被取消。

`InteractionManager` 还允许应用程序通过在动画开始时创建交互“句柄”并在完成时清除它来注册动画：

```tsx
const handle = InteractionManager.createInteractionHandle();
// 运行动画...（`runAfterInteractions` 任务已排队）
// 稍后，在动画完成时：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄都被清除，排队的任务将运行
```
