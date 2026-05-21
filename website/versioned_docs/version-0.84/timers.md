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

`requestAnimationFrame(fn)` 与 `setTimeout(fn, 0)` 并不相同——前者会在所有帧都已刷新后触发，而后者会尽可能快地触发（在 iPhone 5S 上每秒可超过 1000 次）。

`setImmediate` 会在当前 JavaScript 执行块的末尾执行，紧接着将批处理响应发送回原生。注意，如果你在一个 `setImmediate` 回调里调用 `setImmediate`，它会立即执行，不会在中间让出给原生。

`Promise` 的实现使用了 `setImmediate` 作为其异步执行的实现。

:::note
在 Android 上调试时，如果调试器和设备的时间不同步，动画、事件行为等可能无法正常工作或结果不准确。
请通过在调试机器上运行 ``adb shell "date `date +%m%d%H%M%Y.%S%3N`"`` 来校正时间。实际设备使用时需要 root 权限。
:::

## InteractionManager

:::warning[已弃用]
`InteractionManager` 的行为已更改为与 `setImmediate` 相同，应改用后者。
:::

一个原生应用运行流畅的原因之一是在交互和动画期间避免昂贵的操作。在 React Native 中，目前存在单一 JS 执行线程的限制，但你可以使用 `InteractionManager` 确保长时间运行的任务安排在任何交互或动画完成之后开始。

应用程序可以使用以下方式安排交互后的任务执行：

```tsx
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

与其他调度方式的比较：

- `requestAnimationFrame()`：用于编写逐帧动画。
- `setImmediate`/`setTimeout`/`setInterval`：稍后运行代码，注意可能会延迟动画。
- `runAfterInteractions()`：稍后运行代码，但不会延迟正在进行的动画。

触摸处理系统会将一个或多个活跃触摸视为一次“交互”，并会延迟 `runAfterInteractions()` 直到所有触摸结束或被取消。

`InteractionManager` 还允许通过在动画开始时创建一个交互“句柄”，并在动画完成时清除它，来注册动画：

```tsx
const handle = InteractionManager.createInteractionHandle();
// 运行动画...（`runAfterInteractions` 任务排队中）
// 稍后动画完成时：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄被清除，已排队的任务将执行
```