---
id: global-intersectionobserver
title: IntersectionObserver 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

The global [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) interface, as defined in the Web specification. It provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

---

# Reference

## 构造函数

### `IntersectionObserver()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)。

创建一个新的 `IntersectionObserver` 对象，当它检测到目标元素的可见性跨越一个或多个 `threshold` 或 `rnRootThreshold` 值时，会执行指定的回调函数。

```ts
new IntersectionObserver(callback, options?)
```

#### 参数

**`callback`**

当目标元素可见百分比跨越某个阈值时调用的函数。回调接收两个参数：

- `entries`：一个 [`IntersectionObserverEntry`](global-intersectionobserverentry) 对象数组，每个对象表示一个被跨越的阈值，无论是变得比该阈值指定的百分比更可见还是更不可见。
- `observer`：调用该回调的 `IntersectionObserver` 实例。

**`options`**（可选）

一个可选对象，包含以下属性：

| 名称                 | 类型                             | 描述                                                                                                                                                                                                       |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`               | [Element](element-nodes) \| null | 作为目标祖先的元素，其边界矩形将被视为视口。如果未指定或为 `null`，则默认为根视口。                                              |
| `rootMargin`         | string                           | 一个字符串，用于指定在计算交集时添加到根边界框的一组偏移量。默认为 `"0px 0px 0px 0px"`。                                                                      |
| `threshold`          | number \| number[]               | 单个数字或 0.0 到 1.0 之间的数字数组，用于指定被观察目标的交集区域与总边界框面积的比例。如果未设置 `rnRootThreshold`，默认为 `[0]`。 |
| `rnRootThreshold` ⚠️ | number \| number[]               | **React Native 特有。** 单个数字或 0.0 到 1.0 之间的数字数组，用于指定交集区域与根区域总面积的比例。                                                     |

## 实例属性

### `root`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)。

在测试交集时，其边界被用作边界框的元素或文档。

### `rootMargin`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)。

在计算交集时应用于根边界框的偏移矩形。

### `rnRootThresholds` ⚠️

:::warning[非标准]
这是 React Native 特有的扩展。
:::

根阈值列表，按数值升序排序，其中每个阈值都是指定根视图的交集区域与边界框面积之比，默认为视口。

当目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值时，会为该目标生成通知。

```ts
get rnRootThresholds(): ReadonlyArray<number> | null;
```

### `thresholds`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)。

阈值列表，按数值升序排序，其中每个阈值都是被观察目标的交集区域与边界框面积之比。

当目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值时，会为该目标生成通知。

## 实例方法

### `disconnect()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)。

停止 `IntersectionObserver` 对任何目标的观察。

### `observe()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)。

告诉 `IntersectionObserver` 开始观察一个目标元素。

### `takeRecords()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)。

返回一个包含所有被观察目标的 `IntersectionObserverEntry` 对象数组。

### `unobserve()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)。

告诉 `IntersectionObserver` 停止观察某个特定的目标元素。
