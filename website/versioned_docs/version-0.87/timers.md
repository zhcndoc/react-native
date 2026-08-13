---
id: timers
title: 计时器
---

计时器是应用的重要组成部分，React Native 实现了[浏览器计时器](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals)。

## 计时器

- `setTimeout` 和 `clearTimeout`
- `setInterval` 和 `clearInterval`
- `setImmediate` 和 `clearImmediate`
- `requestAnimationFrame` 和 `cancelAnimationFrame`

`requestAnimationFrame(fn)` 与 `setTimeout(fn, 0)` 并不相同——前者会在所有帧刷新完成后触发，而后者会尽快触发（在 iPhone 5S 上每秒超过 1000 次）。

`setImmediate` 会在当前 JavaScript 执行块结束时执行，就在将批处理响应发送回原生端之前。请注意，如果你在 `setImmediate` 回调中调用 `setImmediate`，它将立即执行，中间不会让出执行权返回原生端。

`Promise` 的实现使用 `setImmediate` 来实现异步性。

:::note
在 Android 上进行调试时，如果调试器与设备之间的时间发生了偏差，动画、事件行为等可能无法正常工作，或者结果可能不准确。
请在调试器所在的机器上运行 ``adb shell "date `date +%m%d%H%M%Y.%S%3N`"`` 来修正此问题。在真实设备上使用需要 Root 访问权限。
:::
