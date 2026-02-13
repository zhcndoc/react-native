---
id: global-console
title: 控制台
---

:::warning
🚧 本页面正在建设中，如需更多信息，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/console)。
:::

全局的 `console` 对象，按 Web 规范定义。

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

`console.timeStamp` API 允许你在性能面板的时间线中添加自定义的时间条目。

**参数:**

| 名称       | 类型               | 是否必需 | 描述                                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label      | `string`           | 是       | 时间条目的标签。                                                                                                                                                                                                                                                                                         |
| start      | `string \| number` | 否       | <ul><li>如果是字符串，则是先前用 `console.timeStamp` 记录的时间戳名称。</li><li>如果是数字，则是 [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)，例如，来自 `performance.now()`。</li><li>如果未定义，则使用当前时间。</li></ul>  |
| end        | `string \| number` | 否       | <ul><li>如果是字符串，则是先前用 `console.timeStamp` 记录的时间戳名称。</li><li>如果是数字，则是 [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)，例如，来自 `performance.now()`。</li><li>如果未定义，则使用当前时间。</li></ul>  |
| trackName  | `string`           | 否       | 自定义轨迹的名称。                                                                                                                                                                                                                                                                                       |
| trackGroup | `string`           | 否       | 轨迹组的名称。                                                                                                                                                                                                                                                                                           |
| color      | `DevToolsColor`    | 否       | 条目的颜色。                                                                                                                                                                                                                                                                                             |

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