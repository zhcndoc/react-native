---
id: targetevent
title: TargetEvent 对象类型
---

`TargetEvent` 对象在焦点发生变化时作为回调结果返回，例如 [TextInput](textinput) 组件中的 `onFocus` 或 `onBlur`

## 示例

```
{
    target: 1127
}
```

## 键和值

### `target`

接收 TargetEvent 的元素的节点 ID

| Type                        | Optional |
| --------------------------- | -------- |
| number, `null`, `undefined` | No       |

## 使用于

- [`TextInput`](textinput)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)
