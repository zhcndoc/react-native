---
id: global-PerformanceObserver
title: PerformanceObserver
---

全局的 [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) 类，如 Web 规范中所定义。

## 示例

```ts
const observer = new PerformanceObserver(
  (list, observer, options) => {
    for (const entry of list.getEntries()) {
      console.log(
        '收到类型为',
        entry.entryType,
        '且名称为',
        entry.name,
        '的条目，其开始时间为',
        entry.startTime,
        '并耗时',
        entry.duration,
        '毫秒',
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
