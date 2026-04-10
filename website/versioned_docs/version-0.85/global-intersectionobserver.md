---
id: global-intersectionobserver
title: IntersectionObserver 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

全局 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) 接口，如 Web 规范中所定义。它提供了一种异步观察目标元素与祖先元素或顶层文档视口相交变化的方法。

---

# 参考

## 构造函数

### `IntersectionObserver()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)。

创建一个新的 `IntersectionObserver` 对象，当检测到目标元素的可见性跨越一个或多个 `threshold` 或 `rnRootThreshold` 值时，该对象将执行指定的回调函数。

```ts
new IntersectionObserver(callback, options?)
```

#### 参数

**`callback`**

当目标元素的可见百分比跨越阈值时调用的函数。回调接收两个参数：

- `entries`: [`IntersectionObserverEntry`](global-intersectionobserverentry) 对象数组，每个对象代表一个被跨越的阈值，要么变得比该阈值指定的百分比更可见，要么更不可见。
- `observer`: 调用回调的 `IntersectionObserver` 实例。

**`options`** (可选)

一个可选对象，具有以下属性：

| 名称                 | 类型                             | 描述                                                                                                                                                                                                       |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`               | [Element](element-nodes) \| null | 作为目标祖先的元素，其边界矩形将被视为视口。如果未指定或为 `null`，则默认为根视口。                                              |
| `rootMargin`         | string                           | 一个字符串，指定在计算相交时要添加到根边界框的一组偏移量。默认为 `"0px 0px 0px 0px"`。                                                                      |
| `threshold`          | number \| number[]               | 单个数字或 0.0 到 1.0 之间的数字数组，指定观察目标的相交区域与总边界框区域的比例。如果未设置 `rnRootThreshold`，则默认为 `[0]`。 |
| `rnRootThreshold` ⚠️ | number \| number[]               | **React Native 特定。** 单个数字或 0.0 到 1.0 之间的数字数组，指定相交区域与总根区域的比例。                                                     |

## 实例属性

### `root`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)。

其边界用作相交测试边界框的元素或文档。

### `rootMargin`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)。

在计算相交时应用于根边界框的偏移矩形。

### `rnRootThresholds` ⚠️

:::warning 非标准
这是 React Native 特定的扩展。
:::

根阈值列表，按数字递增顺序排序，其中每个阈值是相交区域与指定根视图（默认为视口）边界框区域的比例。

当为某个目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任何阈值时，会生成该目标的通知。

```ts
get rnRootThresholds(): ReadonlyArray<number> | null;
```

### `thresholds`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)。

阈值列表，按数字递增顺序排序，其中每个阈值是相交区域与观察目标边界框区域的比例。

当为某个目标跨越 `rnRootThresholds` 或 `thresholds` 中指定的任何阈值时，会生成该目标的通知。

## 实例方法

### `disconnect()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)。

停止 `IntersectionObserver` 对象观察任何目标。

### `observe()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)。

告诉 `IntersectionObserver` 开始观察目标元素。

### `takeRecords()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)。

返回所有观察目标的 `IntersectionObserverEntry` 对象数组。

### `unobserve()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)。

告诉 `IntersectionObserver` 停止观察特定目标元素。
