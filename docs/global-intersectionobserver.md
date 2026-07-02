---
id: global-intersectionobserver
title: IntersectionObserver 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

全局 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) 接口，如 Web 规范中定义。它提供了一种异步观察目标元素与其祖先元素或顶层文档视口交集变化的方法。

---

# 参考文档

## 构造函数

### `IntersectionObserver()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)。

创建一个新的 `IntersectionObserver` 对象，当检测到目标元素的可见性跨越一个或多个 `threshold` 或 `rnRootThreshold` 值时，它将执行指定的回调函数。

```ts
new IntersectionObserver(callback, options?)
```

#### 参数

**`callback`**

当目标元素可见百分比跨越某个阈值时调用的函数。该回调接收两个参数：

- `entries`：一个 [`IntersectionObserverEntry`](global-intersectionobserverentry) 对象数组，每个对象表示一个已跨越的阈值，无论是变得比该阈值指定的百分比更可见，还是更不可见。
- `observer`：调用该回调的 `IntersectionObserver` 实例。

**`options`**（可选）

一个可选对象，包含以下属性：

| 名称                 | 类型                             | 描述                                                                                                                                                                                                       |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`               | [Element](element-nodes) \| null | 目标元素的祖先元素，其边界矩形将被视为视口。如果未指定或为 `null`，则默认为根视口。                                              |
| `rootMargin`         | string                           | 一个字符串，用于指定在计算交集时添加到根边界框的一组偏移量。默认为 `"0px 0px 0px 0px"`。                                                                      |
| `threshold`          | number \| number[]               | 单个数字或介于 0.0 和 1.0 之间的数字数组，用于指定观察目标的交叉区域与总边界框面积的比率。如果未设置 `rnRootThreshold`，默认为 `[0]`。 |
| `rnRootThreshold` ⚠️ | number \| number[]               | **React Native 特定。** 单个数字或介于 0.0 和 1.0 之间的数字数组，用于指定交叉区域与总根区域的比率。                                                     |

## 实例属性

### `root`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)。

在测试交叉时，作为边界框使用的元素或文档。

### `rootMargin`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)。

在计算交叉时应用于根边界框的偏移矩形。

### `rnRootThresholds` ⚠️

:::warning[非标准]
这是 React Native 特定的扩展。
:::

根阈值列表，按数值递增顺序排序；其中每个阈值都是交叉区域与指定根视图边界框面积之比，默认值为视口。

当为某个目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值时，会为该目标生成通知。

```ts
get rnRootThresholds(): ReadonlyArray<number> | null;
```

### `thresholds`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)。

阈值列表，按数值递增顺序排序；其中每个阈值都是交叉区域与被观察目标边界框面积之比。

当为某个目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值时，会为该目标生成通知。

## 实例方法

### `disconnect()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)。

停止 `IntersectionObserver` 对象观察任何目标。

### `observe()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)。

告诉 `IntersectionObserver` 开始观察一个目标元素。

### `takeRecords()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)。

返回一个包含所有已观察目标的 `IntersectionObserverEntry` 对象数组。

### `unobserve()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)。

告诉 `IntersectionObserver` 停止观察某个特定的目标元素。
