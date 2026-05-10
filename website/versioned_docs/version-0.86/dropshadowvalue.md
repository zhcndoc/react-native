---
id: dropshadowvalue
title: DropShadowValue 对象类型
---

`DropShadowValue` 对象由 [`filter`](./view-style-props.md#filter) 样式属性用于 `dropShadow` 函数。它由 2 个或 3 个长度值和一个可选颜色组成。这些值共同定义了阴影的颜色、位置和模糊程度。

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

| Type             | Optional |
| ---------------- | -------- |
| number \| string | No       |

### `offsetY`

y 轴上的偏移量。可以为正或负。正值表示向上，负值表示向下。

| Type             | Optional |
| ---------------- | -------- |
| number \| string | No       |

### `standardDeviation`

表示 [Gaussian blur](https://en.wikipedia.org/wiki/Gaussian_blur) 算法中使用的标准差。值越大，阴影越模糊。仅非负值有效。默认值为 0。

| Type             | Optional |
| ---------------- | -------- |
| number \| string | Yes      |

### `color`

阴影的颜色。默认值为 `black`。

| Type                 | Optional |
| -------------------- | -------- |
| [color](./colors.md) | Yes      |

## 由以下使用

- [`filter`](./view-style-props.md#filter)
