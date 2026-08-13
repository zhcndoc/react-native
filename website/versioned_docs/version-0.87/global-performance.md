---
id: global-performance
title: 性能
---

Web 规范中定义的全局 [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) 对象。

---

# 参考

## 实例属性

### `eventCounts`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/eventCounts)。

### `memory`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)。

### `rnStartupTiming` ⚠️

:::warning[非标准]
这是 React Native 特有的扩展。
:::

提供有关应用程序启动时间的信息。

```ts
get rnStartupTiming(): ReactNativeStartupTiming;
```

`ReactNativeStartupTiming` 接口提供以下字段：

| Name                                     | Type           | Description                           |
| ---------------------------------------- | -------------- | ------------------------------------- |
| `startTime`                              | number \| void | React Native 运行时初始化开始的时间。 |
| `executeJavaScriptBundleEntryPointStart` | number \| void | 应用程序包执行开始的时间。            |
| `endTime`                                | number \| void | React Native 运行时完全初始化的时间。 |

### `timeOrigin`

:::warning[部分支持]
提供从 UNIX 纪元到系统启动的毫秒数，而不是从 UNIX 纪元到应用程序启动的毫秒数。
:::

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/timeOrigin)。

## 实例方法

### `clearMarks()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/clearMarks)。

### `clearMeasures()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/clearMeasures)。

### `getEntries()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntries)。

### `getEntriesByName()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName)。

### `getEntriesByType()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType)。

### `mark()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark)。

### `measure()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure)。

### `now()`

:::warning[部分支持]
提供从系统启动到现在的毫秒数，而不是从应用程序启动到现在的毫秒数。
:::

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)。
