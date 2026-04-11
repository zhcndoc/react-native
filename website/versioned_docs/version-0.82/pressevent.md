---
id: pressevent
title: PressEvent 对象类型
---

`PressEvent` 对象作为用户按压交互的结果在回调中返回，例如 [Button](button) 组件中的 `onPress`。

## 示例

```js
{
    changedTouches: [PressEvent],
    identifier: 1,
    locationX: 8,
    locationY: 4.5,
    pageX: 24,
    pageY: 49.5,
    target: 1127,
    timestamp: 85131876.58868201,
    touches: []
}
```

## 键和值

### `changedTouches`

自上次事件以来所有已更改的 PressEvent 的数组。

| 类型                 | 可选     |
| -------------------- | -------- |
| PressEvent 数组      | 否       |

### `force` <div className="label ios">iOS</div>

3D Touch 按压期间使用的力度。返回 `0.0` 到 `1.0` 范围内的浮点值。

| 类型   | 可选     |
| ------ | -------- |
| number | 是       |

### `identifier`

分配给事件的唯一数字标识符。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `locationX`

可触摸区域内触摸起点的 X 坐标（相对于元素）。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `locationY`

可触摸区域内触摸起点的 Y 坐标（相对于元素）。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `pageX`

屏幕上触摸起点的 X 坐标（相对于根视图）。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `pageY`

屏幕上触摸起点的 Y 坐标（相对于根视图）。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `target`

接收 PressEvent 的元素的节点 id。

| 类型                        | 可选     |
| --------------------------- | -------- |
| number, `null`, `undefined` | 否       |

### `timestamp`

发生 PressEvent 时的时间戳值。值以毫秒表示。

| 类型   | 可选     |
| ------ | -------- |
| number | 否       |

### `touches`

屏幕上所有当前 PressEvent 的数组。

| 类型                 | 可选     |
| -------------------- | -------- |
| PressEvent 数组      | 否       |

## 使用者

- [`Button`](button)
- [`PanResponder`](panresponder)
- [`Pressable`](pressable)
- [`ScrollView`](scrollview)
- [`Text`](text)
- [`TextInput`](textinput)
- [`TouchableHighlight`](touchablenativefeedback)
- [`TouchableOpacity`](touchablewithoutfeedback)
- [`TouchableNativeFeedback`](touchablenativefeedback)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)
- [`View`](view)
