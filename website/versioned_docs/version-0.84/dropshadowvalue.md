---
id: dropshadowvalue
title: DropShadowValue 对象类型
---

`DropShadowValue` 对象由 [`filter`](./view-style-props.md#filter) 样式属性的 `dropShadow` 函数使用。它由 2 或 3 个长度值和一个可选颜色组成。这些值共同定义了投影的颜色、位置和模糊程度。

## 示例

```js
{
  offsetX: 10,
  offsetY: -3,
  standardDeviation: '15px',
  color: 'blue',
}
```

## 键和值

### `offsetX`

x 轴上的偏移量。可以为正或负。正值表示向右，负值表示向左。

| 类型              | 可选   |
| ----------------- | ------ |
| number \| string  | 否     |

### `offsetY`

y 轴上的偏移量。可以为正或负。正值表示向上，负值表示向下。

| 类型              | 可选   |
| ----------------- | ------ |
| number \| string  | 否     |

### `standardDeviation`

表示在[高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur)算法中使用的标准差。值越大，阴影越模糊。仅非负值有效。默认值为 0。

| 类型              | 可选   |
| ----------------- | ------ |
| number \| string  | 是     |

### `color`

阴影的颜色。默认是 `black`。

| 类型                | 可选   |
| ------------------- | ------ |
| [color](./colors.md) | 是     |

## 使用场景

- [`filter`](./view-style-props.md#filter)
