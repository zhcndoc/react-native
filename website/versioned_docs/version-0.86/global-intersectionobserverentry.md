---
id: global-intersectionobserverentry
title: IntersectionObserverEntry 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 接口，定义于 Web 规范中。它描述了在某个特定的转换时刻，目标元素与其根容器之间的交集。

`IntersectionObserverEntry` 的实例会作为 [`IntersectionObserver`](global-intersectionobserver) 回调中的 `entries` 参数传递。

---

# 参考

## 实例属性

### `boundingClientRect`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/boundingClientRect)。

返回目标元素的边界矩形，类型为 `DOMRectReadOnly`。

### `intersectionRatio`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRatio)。

返回 `intersectionRect` 与 `boundingClientRect` 的比率。

### `intersectionRect`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRect)。

返回一个表示目标可见区域的 `DOMRectReadOnly`。

### `isIntersecting`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting)。

一个布尔值；如果目标元素与交叉观察器的根相交，则为 `true`。如果为 `true`，则 `IntersectionObserverEntry` 描述的是进入相交状态的转换；如果为 `false`，则表示转换是从相交到不相交。

### `rnRootIntersectionRatio` ⚠️

:::warning 非标准
这是 React Native 特有的扩展。
:::

返回 `intersectionRect` 与 `rootBounds` 的比率。

```ts
get rnRootIntersectionRatio(): number;
```

这与 `intersectionRatio` 类似，但它是相对于根的边界框而不是目标的边界框来计算的。这对应于 `rnRootThreshold` 选项，可让你确定目标元素覆盖了根区域的百分比。

### `rootBounds`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/rootBounds)。

返回交叉观察器根的 `DOMRectReadOnly`。

### `target`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/target)。

其与根的交集发生变化的 `Element`。

### `time`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/time)。

一个 `DOMHighResTimeStamp`，表示记录交集时的时间，相对于 `IntersectionObserver` 的时间原点。
