---
id: global-intersectionobserver
title: IntersectionObserver 🧪
---

import CanaryAPIWarning from './\_canary-channel-api-warning.mdx';

<CanaryAPIWarning />

全局 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) 接口，根据 Web 规范定义。它提供了一种异步观察目标元素与其祖先元素或顶层文档视口的交叉区域变化的方法。

---

# 参考

## 构造函数

### `IntersectionObserver()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)。

创建一个新的 `IntersectionObserver` 对象，当检测到目标元素的可见性跨越一个或多个 `threshold` 或 `rnRootThreshold` 值时，将执行指定的回调函数。

```ts
new IntersectionObserver(callback, options?)
```

#### 参数

**`callback`**

当目标元素的可见百分比跨越阈值时调用的函数。该回调接收两个参数：

- `entries`：一个 [`IntersectionObserverEntry`](global-intersectionobserverentry) 对象数组，每个对象表示一个被跨越的阈值，目标元素变得比该阈值指定的百分比更可见或更少可见。
- `observer`：调用该回调的 `IntersectionObserver` 实例。

**`options`**（可选）

一个可选对象，包含以下属性：

| 名称                  | 类型                             | 描述                                                                                                                                                                                                       |
| --------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `root`                | [Element](element-nodes) \| null | 一个是目标元素祖先的元素，其边界矩形将被用作视口。如果未指定或为 `null`，则默认为根视口。                                                                                                                 |
| `rootMargin`          | string                           | 一个字符串，指定在计算交叉时要加到根边界框的偏移量集合。默认值为 `"0px 0px 0px 0px"`。                                                                                                                 |
| `threshold`           | number \| number[]               | 单个数字或数字数组，取值范围为 0.0 到 1.0，指定目标可观察区域与其总边界框面积的比例阈值。如果未设置 `rnRootThreshold`，默认为 `[0]`。                                                                  |
| `rnRootThreshold` ⚠️  | number \| number[]               | **React Native 特有。** 单个数字或数字数组，取值范围为 0.0 到 1.0，指定交叉区域与根元素总面积的比例阈值。                                                                                                   |

## 实例属性

### `root`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)。

用作交叉检测边界框的元素或文档。

### `rootMargin`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)。

在计算交叉时应用于根边界框的偏移矩形。

### `rnRootThresholds` ⚠️

:::warning[Non-standard]
This is a React Native specific extension.
:::

一个根阈值列表，按数值递增排序，每个阈值是指定根视图（默认为视口）的交叉面积与边界框面积的比例。

当 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值被跨越时，将为目标生成通知。

```ts
get rnRootThresholds(): ReadonlyArray<number> | null;
```

### `thresholds`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)。

一个按数值递增排序的阈值列表，每个阈值是被观察目标交叉面积与边界框面积的比例。

当 `rnRootThresholds` 或 `thresholds` 中指定的任一阈值被跨越时，将为目标生成通知。

## 实例方法

### `disconnect()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/disconnect)。

停止该 `IntersectionObserver` 对象对所有目标的观察。

### `observe()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe)。

告诉 `IntersectionObserver` 开始观察某个目标元素。

### `takeRecords()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/takeRecords)。

返回所有被观察目标的 `IntersectionObserverEntry` 对象数组。

### `unobserve()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve)。

告诉 `IntersectionObserver` 停止观察某个特定的目标元素。