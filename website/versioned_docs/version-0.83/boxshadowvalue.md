---
id: boxshadowvalue
title: BoxShadowValue 对象类型
---

`BoxShadowValue` 对象由 [`boxShadow`](./view-style-props.md#boxshadow) 样式属性使用。它由 2 到 4 个长度值、一个可选颜色以及一个可选的 `inset` 布尔值组成。这些值共同定义了 box 阴影的颜色、位置、大小和模糊程度。

## 示例

```js
{
  offsetX: 10,
  offsetY: -3,
  blurRadius: '15px',
  spreadDistance: '10px',
  color: 'red',
  inset: true,
}
```

## 键和值

### `offsetX`

x 轴上的偏移量。可以为正或负。正值表示向右，负值表示向左。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 否   |

### `offsetY`

y 轴上的偏移量。可以为正或负。正值表示向上，负值表示向下。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 否   |

### `blurRadius`

表示用于[高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur)算法的半径。数值越大阴影越模糊。仅非负值有效。默认值为 0。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 是   |

### `spreadDistance`

阴影的扩展或收缩距离。正值使阴影变大，负值使阴影变小。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 是   |

### `color`

阴影的颜色。默认是 `black`。

| 类型                | 可选 |
| ------------------- | ---- |
| [color](./colors.md) | 是   |

### `inset`

阴影是否为内阴影。内阴影会显示在元素边框盒的内部，而非外部。

| 类型    | 可选 |
| ------- | ---- |
| boolean | 是   |

## 使用于

- [`boxShadow`](./view-style-props.md#boxshadow)