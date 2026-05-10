---
id: boxshadowvalue
title: BoxShadowValue 对象类型
---

`BoxShadowValue` 对象由 [`boxShadow`](./view-style-props.md#boxshadow) 样式属性使用。它由 2-4 个长度值、一个可选颜色以及一个可选的 `inset` 布尔值组成。这些值共同定义了阴影的颜色、位置、大小和模糊程度。

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

| Type             | Optional |
| ---------------- | -------- |
| number \| string | No       |

### `offsetY`

y 轴上的偏移量。可以为正或负。正值表示向上，负值表示向下。

| Type             | Optional |
| ---------------- | -------- |
| number \| string | No       |

### `blurRadius`

表示 [高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur) 算法中使用的半径。值越大，阴影越模糊。仅允许非负值。默认值为 0。

| Type             | Optional |
| ---------------- | -------- |
| number \| string | Yes      |

### `spreadDistance`

阴影扩大或缩小的程度。正值会使阴影变大，负值会使阴影变小。

| Type             | Optional |
| ---------------- | -------- |
| number \| string | Yes      |

### `color`

阴影的颜色。默认值为 `black`。

| Type                 | Optional |
| -------------------- | -------- |
| [color](./colors.md) | Yes      |

### `inset`

阴影是否为内阴影。与显示在元素边框盒外部的阴影不同，内阴影会出现在元素边框盒内部周围。

| Type    | Optional |
| ------- | -------- |
| boolean | Yes      |

## 由以下项使用

- [`boxShadow`](./view-style-props.md#boxshadow)
