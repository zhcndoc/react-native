---
id: layoutevent
title: LayoutEvent 对象类型
---

`LayoutEvent` 对象会在组件布局发生变化时作为回调结果返回，例如 [View](view) 组件中的 `onLayout`。

## 示例

```js
{
    layout: {
        width: 520,
        height: 70.5,
        x: 0,
        y: 42.5
    },
    target: 1127
}
```

## 键和值

### `height`

布局发生变化后组件的高度。

| 类型   | 可选 |
| ------ | ---- |
| number | 否   |

### `width`

布局发生变化后组件的宽度。

| 类型   | 可选 |
| ------ | ---- |
| number | 否   |

### `x`

组件在父组件内的 X 坐标。

| 类型   | 可选 |
| ------ | ---- |
| number | 否   |

### `y`

组件在父组件内的 Y 坐标。

| 类型   | 可选 |
| ------ | ---- |
| number | 否   |

### `target`

接收 `LayoutEvent` 的元素的节点 ID。

| 类型                        | 可选 |
| --------------------------- | ---- |
| number、`null`、`undefined` | 否   |

## 使用于

- [`Image`](image)
- [`Pressable`](pressable)
- [`ScrollView`](scrollview)
- [`Text`](text)
- [`TextInput`](textinput)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)
- [`View`](view)
