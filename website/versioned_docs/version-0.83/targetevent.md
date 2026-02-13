---
id: targetevent
title: TargetEvent 对象类型
---

`TargetEvent` 对象作为焦点变化的回调结果返回，例如在 [TextInput](textinput) 组件中的 `onFocus` 或 `onBlur`。

## 示例

```
{
    target: 1127
}
```

## 键和值

### `target`

接收 TargetEvent 事件的元素节点 id。

| 类型                         | 是否可选 |
| ---------------------------- | -------- |
| number，`null`，`undefined`  | 否       |

## 使用于

- [`TextInput`](textinput)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)