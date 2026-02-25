---
id: rect
title: Rect 对象类型
---

`Rect` 接受数值类型的像素值，用于描述矩形区域向外扩展的距离。这些数值会加到原始区域的大小上，从而扩展该区域。

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

| 类型                        | 是否必需 |
| --------------------------- | -------- |
| 数字、`null`、`undefined`    | 否       |

### `left`

| 类型                        | 是否必需 |
| --------------------------- | -------- |
| 数字、`null`、`undefined`    | 否       |

### `right`

| 类型                        | 是否必需 |
| --------------------------- | -------- |
| 数字、`null`、`undefined`    | 否       |

### `top`

| 类型                        | 是否必需 |
| --------------------------- | -------- |
| 数字、`null`、`undefined`    | 否       |

## 使用者

- [`Image`](image)
- [`Pressable`](pressable)
- [`Text`](text)
- [`TouchableWithoutFeedback`](touchablewithoutfeedback)