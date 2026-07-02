---
id: global-performance
title: 性能
---

Web 规范中定义的全局 [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) 对象。

---

# 参考

## 实例属性

### `eventCounts`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/eventCounts)。

### `memory`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)。

### `rnStartupTiming` ⚠️

:::warning[Non-standard]
这是 React Native 特定的扩展。
:::

提供有关应用启动时间的信息。

```ts
get rnStartupTiming(): ReactNativeStartupTiming;
```

`ReactNativeStartupTiming` 接口提供以下字段：

| 名称                                      | 类型           | 描述                                                  |
| ----------------------------------------- | -------------- | ----------------------------------------------------- |
| `startTime`                              | number \| void | React Native 运行时初始化开始的时间。                 |
| `executeJavaScriptBundleEntryPointStart` | number \| void | 应用 bundle 开始执行的时间。                          |
| `endTime`                                | number \| void | React Native 运行时完全初始化完成的时间。            |

### `timeOrigin`

:::warning[Partial support]
提供的是从 UNIX 纪元到系统启动的毫秒数，而不是从 UNIX 纪元到应用启动的毫秒数。
:::

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/timeOrigin)。

## 实例方法

### `clearMarks()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/clearMarks)。

### `clearMeasures()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/clearMeasures)。

### `getEntries()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntries)。

### `getEntriesByName()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName)。

### `getEntriesByType()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType)。

### `mark()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark)。

### `measure()`

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure)。

### `now()`

:::warning[部分支持]
提供的是从系统启动开始计算的毫秒数，而不是从应用启动开始计算的毫秒数。
:::

参见 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)。
