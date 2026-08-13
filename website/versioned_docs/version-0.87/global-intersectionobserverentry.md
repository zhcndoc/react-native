---
id: global-intersectionobserverentry
title: IntersectionObserverEntry 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 接口，依据 Web 规范定义。它描述了目标元素与其根容器在特定过渡时刻之间的交集。

`IntersectionObserverEntry` 的实例会作为 `entries` 参数传递给 [`IntersectionObserver`](global-intersectionobserver) 回调。

---

# 参考

## 实例属性

### `boundingClientRect`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/boundingClientRect)。

以 `DOMRectReadOnly` 的形式返回目标元素的边界矩形。

### `intersectionRatio`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRatio)。

返回 `intersectionRect` 与 `boundingClientRect` 的比率。

### `intersectionRect`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRect)。

返回表示目标元素可见区域的 `DOMRectReadOnly`。

### `isIntersecting`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting)。

如果目标元素与交集观察器的根相交，则返回值为 `true` 的布尔值。如果该值为 `true`，则 `IntersectionObserverEntry` 描述的是进入相交状态的过渡；如果为 `false`，则表示过渡是从相交状态变为非相交状态。

### `rnRootIntersectionRatio` ⚠️

:::warning[非标准]
这是 React Native 特有的扩展。
:::

返回 `intersectionRect` 与 `rootBounds` 的比率。

```ts
get rnRootIntersectionRatio(): number;
```

这类似于 `intersectionRatio`，但其计算是相对于根的边界框，而不是目标元素的边界框。这对应于 `rnRootThreshold` 选项，可用于确定目标元素覆盖根区域的百分比。

### `rootBounds`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/rootBounds)。

返回交集观察器根的 `DOMRectReadOnly`。

### `target`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/target)。

与根的交集发生变化的 `Element`。

### `time`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/time)。

一个 `DOMHighResTimeStamp`，表示记录交集的时间，相对于 `IntersectionObserver` 的时间源。
