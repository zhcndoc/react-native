---
id: global-PerformanceObserver
title: PerformanceObserver
---

全局 [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) 类，如 Web 规范中所定义。

## 示例

```ts
const observer = new PerformanceObserver(
  (list, observer, options) => {
    for (const entry of list.getEntries()) {
      console.log(
        'Received entry with type',
        entry.entryType,
        'and name',
        entry.name,
        'that started at',
        entry.startTime,
        'and took',
        entry.duration,
        'ms',
      );
    }
  },
);

observer.observe({entryTypes: ['mark', 'measure']});
```

---

# 参考

## 构造函数

### `PerformanceObserver()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/PerformanceObserver)。

## 静态属性

### `supportedEntryTypes`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/supportedEntryTypes)。

返回 `['mark', 'measure', 'event', 'longtask', 'resource']`。

## 实例方法

### `observe()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe)。

### `disconnect()`

请参阅 [MDN 中的文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/disconnect)。
