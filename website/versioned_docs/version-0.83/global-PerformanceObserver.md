---
id: global-PerformanceObserver
title: PerformanceObserver
---

全局的 [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) 类，定义于 Web 规范中。

## 示例

```ts
const observer = new PerformanceObserver(
  (list, observer, options) => {
    for (const entry of list.getEntries()) {
      console.log(
        '接收到的条目类型',
        entry.entryType,
        '名称为',
        entry.name,
        '开始时间为',
        entry.startTime,
        '耗时',
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

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/PerformanceObserver)。

## 静态属性

### `supportedEntryTypes`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/supportedEntryTypes)。

返回 `['mark', 'measure', 'event', 'longtask', 'resource']`。

## 实例方法

### `observe()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe)。

### `disconnect()`

参见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/disconnect)。