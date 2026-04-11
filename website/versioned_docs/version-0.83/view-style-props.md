---
id: view-style-props
title: 视图样式属性
---

### 示例

```SnackPlayer name=ViewStyleProps
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />
      <View style={styles.middle} />
      <View style={styles.bottom} />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    margin: 10,
  },
  top: {
    flex: 0.3,
    backgroundColor: 'grey',
    borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middle: {
    flex: 0.3,
    backgroundColor: 'beige',
    borderWidth: 5,
  },
  bottom: {
    flex: 0.3,
    backgroundColor: 'pink',
    borderWidth: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default App;
```

# 参考

## 属性

### `backfaceVisibility`

| 类型                          |
| ----------------------------- |
| 枚举 (`'visible'`, `'hidden'`) |

---

### `backgroundColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBottomColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBlockColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBlockEndColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBlockStartColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBottomEndRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderBottomLeftRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderBottomRightRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderBottomStartRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderStartEndRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderStartStartRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderEndEndRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderEndStartRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderBottomWidth`

| 类型   |
| ------ |
| 数字 |

---

### `borderColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderCurve` <div className="label ios">iOS</div>

在 iOS 13 及以上版本中，可以改变边框的圆角曲线。

| 类型                               |
| ---------------------------------- |
| 枚举 (`'circular'`, `'continuous'`) |

---

### `borderEndColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderLeftColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderLeftWidth`

| 类型   |
| ------ |
| 数字 |

---

### `borderRadius`

如果圆角边框未显示，尝试同时设置 `overflow: 'hidden'`。

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderRightColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderRightWidth`

| 类型   |
| ------ |
| 数字 |

---

### `borderStartColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderStyle`

| 类型                                    |
| --------------------------------------- |
| 枚举 (`'solid'`, `'dotted'`, `'dashed'`) |

---

### `borderTopColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderTopEndRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderTopLeftRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderTopRightRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderTopStartRadius`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderTopWidth`

| 类型                              |
| --------------------------------- |
| 数字，字符串（百分比值） |

---

### `borderWidth`

| 类型   |
| ------ |
| 数字 |

### `boxShadow`

:::note
`boxShadow` 仅在 [新架构](/architecture/landing-page) 中可用。外部阴影仅支持 **Android 9 及以上**，内部阴影仅支持 **Android 10 及以上**。
:::

为元素添加阴影效果，可以控制阴影的位置、颜色、大小和模糊度。该阴影出现在元素边框盒子的外侧或内侧，取决于阴影是否为 _内部阴影 (inset)_。这是对 [同名 Web 样式属性](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) 的规范兼容实现。更多参数详见 [BoxShadowValue](./boxshadowvalue) 文档。

这些阴影可组合使用，一个 `boxShadow` 可以由多个不同的阴影组成。

`boxShadow` 可以是模仿 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#syntax) 的字符串，或是 [BoxShadowValue](./boxshadowvalue) 对象数组。

| 类型                               |
| ---------------------------------- |
| BoxShadowValue 对象数组 \| 字符串 |

### `cursor` <div className="label ios">iOS</div>

在 iOS 17 及以上版本，将其设置为 `pointer`，可以在有指针 (比如 iOS 上的触控板、手写笔，或者 visionOS 中用户的视线) 悬停时显示悬停效果。

| 类型                          |
| ----------------------------- |
| 枚举 (`'auto'`, `'pointer'`) |

---

### `elevation` <div className="label android">Android</div>

设置视图的海拔高度，使用 Android 的底层 [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation)。这会为元素添加阴影，并影响重叠视图的 z 轴排序。仅支持 Android 5.0 以上版本，较早版本无效。

| 类型   |
| ------ |
| 数字 |

---

### `filter`

:::note
`filter` 仅在 [新架构](/architecture/landing-page) 中可用
:::

向 `View` 添加图形滤镜。滤镜由若干 _滤镜函数_ 组成，每一个代表对 `View` 图形组成的原子改变。完整的有效滤镜函数列表如下。`filter` 也会应用于 `View` 的子孙元素。`filter` 等同于设置了 `overflow: 'hidden'`，所以子孙元素会被限制在 `View` 的边界内。

以下滤镜函数适用于所有平台：

- `brightness`：改变 `View` 的亮度。接受非负数或百分数。
- `opacity`：改变 `View` 的不透明度（alpha 值）。接受非负数或百分数。

:::note
出于性能及规范兼容性考虑，这仅是 iOS 支持的两种滤镜函数。计划探索用 SwiftUI 替代 UIKit 实现的潜在解决方案。
:::

<div className="label basic android">Android</div>

以下滤镜函数仅适用于 Android：

- `blur`：使用 [高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur) 模糊 `View`，参数代表模糊半径（无百分比，只接受非负 DIP 值）。值越大模糊越明显。
- `contrast`：改变 `View` 对比度。接受非负数或百分比。
- `dropShadow`：在 `View` 的 alpha 遮罩周围添加阴影（仅非零 alpha 像素投射阴影）。接受可选的阴影颜色，以及 2 或 3 个长度参数。2 个参数时分别为 `offsetX` 和 `offsetY`，表示阴影在横纵轴的偏移。3 个参数时第三个为用于阴影高斯模糊的标准差，值越大阴影越模糊。详细参数见 [DropShadowValue](./dropshadowvalue.md)。
- `grayscale`：将 `View` 转为 [灰度](https://en.wikipedia.org/wiki/Grayscale)，通过指定程度。接受非负数或百分比，1 或 100% 表示完全灰度。
- `hueRotate`：改变 `View` 的 [色相](https://en.wikipedia.org/wiki/Hue)。参数为色轮上的旋转角度，例如 `360deg` 无效果。角度单位可为 `deg` 或 `rad`。
- `invert`：反转 `View` 颜色。接受非负数或百分比，1 或 100% 表示完全反转。
- `sepia`：将 `View` 转为 [棕褐色调](https://en.wikipedia.org/wiki/Sepia_(color))。接受非负数或百分比，1 或 100% 表示完全棕褐色。
- `saturate`：改变 `View` 的 [饱和度](https://en.wikipedia.org/wiki/Colorfulness)。接受非负数或百分比。

:::note
`blur` 和 `dropShadow` 仅支持 **Android 12 及以上**。
:::

`filter` 支持的类型为上述滤镜函数对象的数组，或模仿 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#syntax) 的字符串。

| 类型                                                                                       |
| ------------------------------------------------------------------------------------------ |
| 对象数组：`{brightness: number\|string}`、`{opacity: number\|string}`、`{blur: number\|string}`、`{contrast: number\|string}`、`{dropShadow: DropShadowValue\|string}`、`{grayscale: number\|string}`、`{hueRotate: number\|string}`、`{invert: number\|string}`、`{sepia: number\|string}`、`{saturate: number\|string}` 或字符串 |

---

### `mixBlendMode`

:::note
`mixBlendMode` 仅在 [新架构](/architecture/landing-page) 和 **Android 10 及以上** 中可用
:::

控制 `View` 如何与其 **堆叠上下文** 中的其他元素颜色混合。完整混合函数说明见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)。

如需更细粒度的混合控制，请参见 [isolation](layout-props#isolation)。

##### mixBlendMode 取值

- `normal`：元素绘制在背景之上，不做混合。
- `multiply`：用源颜色乘以目标颜色，替代目标。
- `screen`：乘以背景色和源色补色后，再取补色。
- `overlay`：根据背景色值选择乘法或屏幕模式。
- `darken`：选择背景色和源色中较暗者。
- `lighten`：选择背景色和源色中较亮者。
- `color-dodge`：加亮背景颜色以反映源颜色；用黑色绘制无变化。
- `color-burn`：加暗背景颜色以反映源颜色；用白色绘制无变化。
- `hard-light`：根据源颜色值选择乘法或屏幕模式，类似对背景投射强光。
- `soft-light`：根据源颜色值加暗或加亮颜色，类似对背景投射散射光。
- `difference`：从较亮颜色中减去较暗颜色。
- `exclusion`：产生类似 Difference 但对比度较低的效果。
- `hue`：创建具有源色色相、背景色饱和度和明度的新色。
- `saturation`：创建具有源色饱和度、背景色色相和明度的新色。
- `color`：创建具有源色色相和饱和度、背景色明度的新色。保留背景灰度，适合着色单色图像或给彩色图像着色。
- `luminosity`：创建具有源色明度、背景色色相和饱和度的新色。此效果与 Color 模式相反。

| 类型                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 枚举 (`'normal'`, `'multiply'`, `'screen'`, `'overlay'`, `'darken'`, `'lighten'`, `'color-dodge'`, `'color-burn'`, `'hard-light'`, `'soft-light'`, `'difference'`, `'exclusion'`, `'hue'`, `'saturation'`, `'color'`, `'luminosity'`) |

---

### `opacity`

| 类型   |
| ------ |
| 数字 |

---

### `outlineColor`

:::note
`outlineColor` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置元素轮廓线颜色。详见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color)。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `outlineOffset`

:::note
`outlineOffset` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置轮廓线与元素边界之间的距离，不影响布局。详见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)。

| 类型   |
| ------ |
| 数字 |

---

### `outlineStyle`

:::note
`outlineStyle` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置元素轮廓线样式。详见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style)。

| 类型                                    |
| --------------------------------------- |
| 枚举 (`'solid'`, `'dotted'`, `'dashed'`) |

---

### `outlineWidth`

:::note
`outlineWidth` 仅在 [新架构](/architecture/landing-page) 中可用
:::

绘制元素外围的轮廓宽度，不影响布局。详见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width)。

| 类型   |
| ------ |
| 数字 |

---

### `pointerEvents`

控制是否允许 `View` 成为触摸事件目标。

- `'auto'`：View 可以成为触摸事件目标。
- `'none'`：View 永远不会成为触摸事件目标。
- `'box-none'`：View 永远不会成为触摸事件目标，但其子视图可以。
- `'box-only'`：View 可以成为触摸事件目标，但其子视图不可以。

| 类型                                                  |
| ----------------------------------------------------- |
| 枚举 (`'auto'`, `'box-none'`, `'box-only'`, `'none'` ) |