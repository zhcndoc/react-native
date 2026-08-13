---
id: global-intersectionobserver
title: IntersectionObserver 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

全局 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) 接口，由 Web 规范定义。它提供了一种异步观察目标元素与祖先元素或顶层文档视口之间交叉状态变化的方法。

---

# 参考

## 构造函数

### `IntersectionObserver()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)。

创建一个新的 `IntersectionObserver` 对象，当检测到目标元素的可见性跨越一个或多个 `threshold` 或 `rnRootThreshold` 值时，该对象将执行指定的回调函数。

```ts
new IntersectionObserver(callback, options?)
```

#### 参数

**`callback`**

当目标元素的可见百分比跨越某个阈值时调用的函数。回调函数接收两个参数：

- `entries`：一个由 [`IntersectionObserverEntry`](global-intersectionobserverentry) 对象组成的数组，每个对象表示一个已跨越的阈值，即可见程度变得高于或低于该阈值指定的百分比。
- `observer`：调用该回调函数的 `IntersectionObserver` 实例。

**`options`**（可选）

具有以下属性的可选对象：

| 名称                 | 类型                             | 描述                                                                                                                                   |
| -------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `root`               | [Element](element-nodes) \| null | 目标元素的祖先元素，其边界矩形将被视为视口。如果未指定或为 `null`，则默认为根视口。                                                    |
| `rootMargin`         | string                           | 指定一组偏移量的字符串，用于在计算交叉状态时添加到根元素的边界框。默认为 `"0px 0px 0px 0px"`。                                         |
| `threshold`          | number \| number[]               | 介于 0.0 和 1.0 之间的单个数字或数字数组，指定被观察目标的交叉区域与总边界框区域的比率。如果未设置 `rnRootThreshold`，则默认为 `[0]`。 |
| `rnRootThreshold` ⚠️ | number \| number[]               | **React Native 特有。**介于 0.0 和 1.0 之间的单个数字或数字数组，指定交叉区域与根区域总面积的比率。                                    |

## 实例属性

### `root`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)。

在测试交叉状态时，用作边界框的元素或文档。

### `rootMargin`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)。

在计算交叉状态时应用于根元素边界框的偏移矩形。

### `rnRootThresholds` ⚠️

:::warning[非标准]
这是 React Native 特有的扩展。
:::

根阈值列表，按数值递增顺序排序，其中每个阈值都是指定根视图的交叉区域与边界框区域的比率，默认为视口。

当目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任何阈值时，将为该目标生成通知。

```ts
get rnRootThresholds(): ReadonlyArray<number> | null;
```

### `thresholds`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)。

阈值列表，按数值递增顺序排序，其中每个阈值都是被观察目标的交叉区域与边界框区域的比率。

当目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任何阈值时，将为该目标生成通知。

## 实例方法

### `disconnect()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)。

停止 `IntersectionObserver` 对任何目标的观察。

### `observe()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)。

告知 `IntersectionObserver` 开始观察目标元素。

### `takeRecords()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)。

返回所有被观察目标的 `IntersectionObserverEntry` 对象数组。

### `unobserve()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)。

告知 `IntersectionObserver` 停止观察特定的目标元素。
