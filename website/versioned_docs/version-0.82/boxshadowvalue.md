---
id: boxshadowvalue
title: BoxShadowValue 对象类型
---

`BoxShadowValue` 对象由 [`boxShadow`](./view-style-props.md#boxshadow) 样式属性接受。它由 2-4 个长度值、一个可选的颜色和一个可选的 `inset` 布尔值组成。这些值共同定义了盒阴影的颜色、位置、大小和模糊度。

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

x 轴上的偏移量。它可以是正数或负数。正值表示向右，负值表示向左。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 否   |

### `offsetY`

y 轴上的偏移量。它可以是正数或负数。正值表示向上，负值表示向下。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 否   |

### `blurRadius`

表示 [高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur) 算法中使用的半径。值越大，阴影越模糊。只有非负值有效。默认值为 0。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 是   |

### `spreadDistance`

阴影扩大或缩小的程度。正值会使阴影扩大，负值会使阴影缩小。

| 类型             | 可选 |
| ---------------- | ---- |
| number \| string | 是   |

### `color`

阴影的颜色。默认值为 `black`。

| 类型                 | 可选 |
| -------------------- | ---- |
| [颜色](./colors.md) | 是   |

### `inset`

阴影是否为内阴影。内阴影将出现在元素边框盒的内部，而不是外部。

| 类型    | 可选 |
| ------- | ---- |
| boolean | 是   |

## 使用于

- [`boxShadow`](./view-style-props.md#boxshadow)
