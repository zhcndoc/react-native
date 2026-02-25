---
id: global-intersectionobserverentry
title: IntersectionObserverEntry 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 接口，按照 Web 规范定义。它描述了目标元素与其根容器在某个特定过渡时刻的交集情况。

`IntersectionObserverEntry` 的实例会通过 `entries` 参数传递给 [`IntersectionObserver`](global-intersectionobserver) 的回调函数。

---

# 参考

## 实例属性

### `boundingClientRect`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/boundingClientRect)。

返回目标元素的边界矩形，类型为 `DOMRectReadOnly`。

### `intersectionRatio`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRatio)。

返回 `intersectionRect` 与 `boundingClientRect` 的比例。

### `intersectionRect`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRect)。

返回一个表示目标可见区域的 `DOMRectReadOnly`。

### `isIntersecting`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting)。

布尔值，如果目标元素与交叉观察者的根容器相交，则为 `true`。如果为 `true`，表示 `IntersectionObserverEntry` 描述的是进入交集状态的过渡；如果为 `false`，则表示从相交状态过渡到非相交状态。

### `rnRootIntersectionRatio` ⚠️

:::warning 非标准
这是 React Native 特定的扩展。
:::

返回 `intersectionRect` 与 `rootBounds` 的比例。

```ts
get rnRootIntersectionRatio(): number;
```

这个属性类似于 `intersectionRatio`，但它是相对于根元素的边界盒计算的，而不是目标元素的边界盒。它对应于 `rnRootThreshold` 选项，允许你确定目标元素覆盖根区域的百分比。

### `rootBounds`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/rootBounds)。

返回交叉观察者根元素的 `DOMRectReadOnly`。

### `target`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/target)。

发生交集变化的 `Element`。

### `time`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/time)。

一个 `DOMHighResTimeStamp`，指示记录交集时的时间，相对于 `IntersectionObserver` 的时间起点。