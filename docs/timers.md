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
