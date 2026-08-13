---
id: rect
title: Rect 对象类型
---

`Rect` 接受数值型像素值，用于描述矩形区域应向外延伸多远。这些值会添加到原始区域的大小上，以扩展该区域。

## 示例

```js
{
    bottom: 20,
    left: null,
    right: undefined,
    top: 50
}
```

## 键和值

### `bottom`

| 类型                        | 必填 |
| --------------------------- | ---- |
| number, `null`, `undefined` | 否   |

### `left`

| 类型                        | 必填 |
| --------------------------- | ---- |
| number, `null`, `undefined` | 否   |

### `right`

| 类型                        | 必填 |
| --------------------------- | ---- |
| number, `null`, `undefined` | 否   |

### `top`

| 类型                        | 必填 |
| --------------------------- | ---- |
| number, `null`, `undefined` | 否   |

## 使用此类型的对象

- [`Image`](image)
- [`Pressable`](pressable)
- [`Text`](text)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)
