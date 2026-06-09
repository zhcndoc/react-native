---
id: timers
title: 定时器
---

定时器是应用程序的重要组成部分，React Native 实现了 [浏览器定时器](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals)。

## 定时器

- `setTimeout` 和 `clearTimeout`
- `setInterval` 和 `clearInterval`
- `setImmediate` 和 `clearImmediate`
- `requestAnimationFrame` 和 `cancelAnimationFrame`

`requestAnimationFrame(fn)` 与 `setTimeout(fn, 0)` 并不相同——前者会在所有帧都刷新完之后触发，而后者会尽可能快地触发（在 iPhone 5S 上每秒超过 1000 次）。

`setImmediate` 会在当前 JavaScript 执行块结束时执行，就在把批量响应发送回原生端之前。请注意，如果你在一个 `setImmediate` 回调中再次调用 `setImmediate`，它会立刻执行，而不会在两者之间让出给原生端。

`Promise` 的实现使用 `setImmediate` 作为其异步实现。

:::note
在 Android 上调试时，如果调试器和设备之间的时间发生了漂移；动画、事件行为等可能无法正常工作，或者结果可能不准确。
请在你的调试器机器上运行 ``adb shell "date `date +%m%d%H%M%Y.%S%3N`"`` 来修正这个问题。在真机上使用需要 root 权限。
:::

## InteractionManager

:::warning Deprecated
`InteractionManager` 的行为已更改为与 `setImmediate` 相同，应改为使用后者。
:::

许多高质量原生应用之所以感觉如此流畅，其中一个原因就是避免在交互和动画期间执行昂贵的操作。在 React Native 中，我们目前有一个限制：只有单一的 JS 执行线程，但你可以使用 `InteractionManager` 来确保耗时较长的工作被安排在所有交互/动画完成之后开始。

应用可以通过以下方式安排在交互之后运行的任务：

```ts
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

将其与其他调度替代方案进行比较：

- requestAnimationFrame()：用于随着时间推移为视图添加动画的代码。
- setImmediate/setTimeout/setInterval()：稍后运行代码，注意这可能会延迟动画。
- runAfterInteractions()：稍后运行代码，但不会延迟正在进行的动画。

触摸处理系统会将一个或多个活动触摸视为一次“交互”，并会将 `runAfterInteractions()` 回调延迟到所有触摸结束或被取消之后。

`InteractionManager` 还允许应用通过在动画开始时创建一个交互“句柄”，并在完成时清除它来注册动画：

```ts
const handle = InteractionManager.createInteractionHandle();
// 运行动画...（`runAfterInteractions` 任务将被加入队列）
// 之后，在动画完成时：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄都已清除，则队列中的任务会运行
```
