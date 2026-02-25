---
id: pressevent
title: PressEvent 对象类型
---

`PressEvent` 对象作为用户按压交互的结果，在回调中返回，例如 [Button](button) 组件中的 `onPress`。

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

自上次事件以来发生变化的所有 PressEvents 的数组。

| 类型                     | 可选  |
| ------------------------ | ----- |
| PressEvent 数组          | 否    |

### `force` <div className="label ios">iOS</div>

3D Touch 按压时使用的力度。返回范围为 `0.0` 到 `1.0` 的浮点数值。

| 类型   | 可选  |
| ------ | ----- |
| number | 是    |

### `identifier`

分配给该事件的唯一数字标识符。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `locationX`

触摸起点在可触摸区域内的 X 坐标（相对于元素）。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `locationY`

触摸起点在可触摸区域内的 Y 坐标（相对于元素）。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `pageX`

触摸起点在屏幕上的 X 坐标（相对于根视图）。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `pageY`

触摸起点在屏幕上的 Y 坐标（相对于根视图）。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `target`

接收 PressEvent 的元素节点 ID。

| 类型                         | 可选  |
| ---------------------------- | ----- |
| number, `null`, `undefined`  | 否    |

### `timestamp`

PressEvent 发生时的时间戳，单位为毫秒。

| 类型   | 可选  |
| ------ | ----- |
| number | 否    |

### `touches`

屏幕上所有当前 PressEvents 的数组。

| 类型                     | 可选  |
| ------------------------ | ----- |
| PressEvent 数组          | 否    |

## 使用于

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