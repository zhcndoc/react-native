---
id: global-console
title: console
---

:::warning
🚧 此页面仍在编写中，因此请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/console) 以获取更多信息。
:::

全局 `console` 对象，如 Web 规范中所定义。

---

## 方法

### `timeStamp()`

```tsx
console.timeStamp(
  label: string,
  start?: string | number,
  end?: string | number,
  trackName?: string,
  trackGroup?: string,
  color?: DevToolsColor
): void;
```

`console.timeStamp` API 允许你在 Performance 面板时间线中添加自定义计时条目。

**参数：**

| 名称       | 类型               | 必需 | 描述                                                                                                                                                                                                                                                                                                   |
| ---------- | ------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| label      | `string`           | 是   | 计时条目的标签。                                                                                                                                                                                                                                                                                        |
| start      | `string \| number` | 否   | <ul><li>如果是字符串，则为先前使用 `console.timeStamp` 记录的时间戳名称。</li><li>如果是数字，则为 [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)。例如，来自 `performance.now()`。</li><li>如果未定义，则使用当前时间。</li></ul> |
| end        | `string \| number` | 否   | <ul><li>如果是字符串，则为先前使用 `console.timeStamp` 记录的时间戳名称。</li><li>如果是数字，则为 [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)。例如，来自 `performance.now()`。</li><li>如果未定义，则使用当前时间。</li></ul> |
| trackName  | `string`           | 否   | 自定义轨道的名称。                                                                                                                                                                                                                                                                                      |
| trackGroup | `string`           | 否   | 轨道组的名称。                                                                                                                                                                                                                                                                                          |
| color      | `DevToolsColor`    | 否   | 条目的颜色。                                                                                                                                                                                                                                                                                            |

```tsx
type DevToolsColor =
  | 'primary'
  | 'primary-light'
  | 'primary-dark'
  | 'secondary'
  | 'secondary-light'
  | 'secondary-dark'
  | 'tertiary'
  | 'tertiary-light'
  | 'tertiary-dark'
  | 'warning'
  | 'error';
```
