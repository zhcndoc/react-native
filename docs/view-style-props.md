---
id: view-style-props
title: View 样式属性
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';
import {getCoreBranchNameForCurrentVersion} from '@site/src/getCoreBranchNameForCurrentVersion';

### 示例

```SnackPlayer name=ViewStyleProps
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

| 类型                           |
| ------------------------------ |
| 枚举 (`'visible'`, `'hidden'`) |

---

### `backgroundColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `backgroundImage`

`backgroundImage` 提供了使用类似 Web 的语法绘制 [`linear-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient) 和 [`radial-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) 的能力。

```tsx
// 简单用法：
<View style={{ backgroundImage: 'linear-gradient(45deg, blue, red)' }} />

<View style={{ backgroundImage: 'radial-gradient(ellipse farthest-corner at 30% 40%, red, blue)' }} />

// 也支持 PlatformColor：
<View
style={{
  backgroundImage: [
    {
      type: 'linear-gradient',
      direction: 'to bottom',
      colorStops: [
        {
          color: Platform.select({
            ios: PlatformColor('systemTealColor'),
            android: PlatformColor('@android:color/holo_purple'),
            default: 'blue',
          }),
          positions: ['0%'],
        },
        {color: 'green', positions: ['100%']},
      ],
    },
  ],
}}
/>
```

更多复杂用法示例可在 RNTester 应用中找到（支持 `PlatformColor`）：

- <a href={`https://github.com/facebook/react-native/blob/${getCoreBranchNameForCurrentVersion()}/packages/rn-tester/js/examples/LinearGradient/LinearGradientExample.js`}>LinearGradientExample.js</a>
- <a href={`https://github.com/facebook/react-native/blob/${getCoreBranchNameForCurrentVersion()}/packages/rn-tester/js/examples/RadialGradient/RadialGradientExample.js`}>RadialGradientExample.js</a>

| 类型                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| string, array of objects: `{type: 'linear-gradient', direction: string, colorStops: object[] }`, `{type: 'radial-gradient', shape: string, position: object, size: string, colorStops: object[] }` |

---

### `borderBottomColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderBlockColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderBlockEndColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderBlockStartColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderBottomEndRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderBottomLeftRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderBottomRightRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderBottomStartRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderStartEndRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderStartStartRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderEndEndRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderEndStartRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderBottomWidth`

| 类型 |
| ---- |
| 数字 |

---

### `borderColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderCurve` <div className="label ios">iOS</div>

在 iOS 13+ 上，可以更改边框的角曲线。

| 类型                                |
| ----------------------------------- |
| 枚举 (`'circular'`, `'continuous'`) |

---

### `borderEndColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderLeftColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderLeftWidth`

| 类型 |
| ---- |
| 数字 |

---

### `borderRadius`

如果圆角边框不可见，尝试同时应用 `overflow: 'hidden'`。

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderRightColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderRightWidth`

| 类型 |
| ---- |
| 数字 |

---

### `borderStartColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderStyle`

| 类型                                     |
| ---------------------------------------- |
| 枚举 (`'solid'`, `'dotted'`, `'dashed'`) |

---

### `borderTopColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderTopEndRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderTopLeftRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderTopRightRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderTopStartRadius`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderTopWidth`

| 类型                     |
| ------------------------ |
| 数字，字符串（百分比值） |

---

### `borderWidth`

| 类型 |
| ---- |
| 数字 |

### `boxShadow`

:::note
`boxShadow` 仅在 [新架构](/architecture/landing-page) 上可用。外阴影仅支持 **Android 9+**。内阴影仅支持 **Android 10+**。
:::

为元素添加阴影效果，能够控制阴影的位置、颜色、大小和模糊度。根据阴影是否为 _内嵌 (inset)_，此阴影要么出现在元素边框盒的外部，要么出现在内部。这是 [同名的 Web 样式属性](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) 的符合规范的实现。有关所有可用参数的更多信息，请阅读 [BoxShadowValue](./boxshadowvalue) 文档。

这些阴影可以组合在一起，以便单个 `boxShadow` 可以由多个不同的阴影组成。

`boxShadow` 接受一个字符串或 [BoxShadowValue](./boxshadowvalue) 对象数组，字符串格式与 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#syntax) 类似。

| 类型                              |
| --------------------------------- |
| BoxShadowValue 对象数组 \| 字符串 |

### `cursor` <div className="label ios">iOS</div>

在 iOS 17+ 上，设置为 `pointer` 允许当指针（例如 iOS 上的触控板或手写笔，或 visionOS 上用户的视线）悬停在视图上时产生悬停效果。

| 类型                         |
| ---------------------------- |
| 枚举 (`'auto'`, `'pointer'`) |

---

### `elevation` <div className="label android">Android</div>

设置视图的高程，使用 Android 底层的 [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation)。这会给项目添加投影并影响重叠视图的 Z 轴顺序。仅支持 Android 5.0+，在早期版本上无效。

| 类型 |
| ---- |
| 数字 |

---

### `filter`

:::note
`filter` 仅在 [新架构](/architecture/landing-page) 上可用
:::

为 `View` 添加图形滤镜。此滤镜由任意数量的 _滤镜函数_ 组成，每个函数代表对 `View` 图形构成的某种原子变化。有效滤镜函数的完整列表定义如下。`filter` 将应用于 `View` 的后代以及 `View` 本身。`filter` 意味着 `overflow: hidden`，因此后代将被裁剪以适应 `View` 的边界。

以下滤镜函数适用于所有平台：

- `brightness`：更改 `View` 的亮度。接受非负数字或百分比。
- `opacity`：更改 `View` 的不透明度或 alpha。接受非负数字或百分比。

:::note
由于性能和规范合规性问题，这些是 iOS 上仅有的两个可用滤镜函数。有计划探索使用 SwiftUI 代替 UIKit 来实现此功能的一些潜在变通方案。
:::

<div className="label basic android">Android</div>

以下滤镜函数仅适用于 Android：

- `blur`：使用 [高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur) 模糊 `View`，其中指定的长度代表模糊算法中使用的半径。任何非负 DIP 值均有效（无百分比）。值越大，结果越模糊。
- `contrast`：更改 `View` 的对比度。接受非负数字或百分比。
- `dropShadow`：在 `View` 的 Alpha 遮罩周围添加阴影（仅 `View` 中非零 alpha 像素会投射阴影）。接受一个可选颜色代表阴影颜色，以及 2 或 3 个长度。如果指定了 2 个长度，它们被解释为 `offsetX` 和 `offsetY`，将分别在 X 和 Y 维度上平移阴影。如果给出第 3 个长度，它被解释为用于阴影的高斯模糊的标准差——因此较大的值会使阴影更模糊。有关参数的更多信息，请阅读 [DropShadowValue](./dropshadowvalue.md)。
- `grayscale`：按指定量将 `View` 转换为 [灰度](https://en.wikipedia.org/wiki/Grayscale)。接受非负数字或百分比，其中 `1` 或 `100%` 代表完全灰度。
- `hueRotate`：更改 View 的 [色相](https://en.wikipedia.org/wiki/Hue)。此函数的参数定义色轮的角度，色相将围绕该角度旋转，例如 `360deg` 将无效。此角度可以使用 `deg` 或 `rad` 单位。
- `invert`：反转 `View` 中的颜色。接受非负数字或百分比，其中 `1` 或 `100%` 代表完全反转。
- `sepia`：将 `View` 转换为 [棕褐色](<https://en.wikipedia.org/wiki/Sepia_(color)>)。接受非负数字或百分比，其中 `1` 或 `100%` 代表完全棕褐色。
- `saturate`：更改 `View` 的 [饱和度](https://en.wikipedia.org/wiki/Colorfulness)。接受非负数字或百分比。

:::note
`blur` 和 `dropShadow` 仅支持 **Android 12+**
:::

`filter` 接受由上述滤镜函数组成的对象数组，或一种模拟 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#syntax) 的字符串。

| 类型                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对象数组：`{brightness: number\|string}`、`{opacity: number\|string}`、`{blur: number\|string}`、`{contrast: number\|string}`、`{dropShadow: DropShadowValue\|string}`、`{grayscale: number\|string}`、`{hueRotate: number\|string}`、`{invert: number\|string}`、`{sepia: number\|string}`、`{saturate: number\|string}` 或字符串 |

---

### `mixBlendMode`

:::note
`mixBlendMode` 仅在 [新架构](/architecture/landing-page) 和 **Android 10+** 上可用
:::

控制 `View` 如何与其 **堆叠上下文** 中的其他元素混合颜色。查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) 以全面了解每个混合函数。

对于更细粒度的控制什么应该混合在一起，请参阅 [isolation](layout-props#isolation)。

##### mixBlendMode 值

- `normal`: 元素绘制在其背景之上，不进行混合。
- `multiply`: 源颜色与目标颜色相乘，并替换目标颜色。
- `screen`: 将背景和源颜色值的补色相乘，然后对结果取补。
- `overlay`: 根据背景颜色值，对颜色进行相乘或滤色。
- `darken`: 选择背景和源颜色中较深的颜色。
- `lighten`: 选择背景和源颜色中较浅的颜色。
- `color-dodge`: 使背景颜色变亮以反映源颜色。使用黑色绘制不会产生任何变化。
- `color-burn`: 使背景颜色变暗以反映源颜色。使用白色绘制不会产生变化。
- `hard-light`: 根据源颜色值对颜色进行相乘或滤色。效果类似于在背景上照射强烈聚光灯。
- `soft-light`: 根据源颜色值使颜色变暗或变亮。效果类似于在背景上照射漫射聚光灯。
- `difference`: 从较浅的颜色中减去两种组成颜色中较深的那一种。
- `exclusion`: 产生类似于 Difference 模式但对比度更低的效果。
- `hue`: 创建一种具有源颜色色相以及背景颜色饱和度和亮度的颜色。
- `saturation`: 创建一种具有源颜色饱和度以及背景颜色色相和亮度的颜色。
- `color`: 创建一种具有源颜色色相和饱和度以及背景颜色亮度的颜色。这会保留背景的灰度级别，适用于为单色图像着色或为彩色图像添加色调。
- `luminosity`: 创建一种具有源颜色亮度以及背景颜色色相和饱和度的颜色。这会产生与 Color 模式相反的效果。
- `plus-lighter`: 将源色彩通道与目标色彩通道相加，并将每个通道限制在最大值。

| 类型                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enum(`'normal'`, `'multiply'`, `'screen'`, `'overlay'`, `'darken'`, `'lighten'`, `'color-dodge'`, `'color-burn'`, `'hard-light'`, `'soft-light'`, `'difference'`, `'exclusion'`, `'hue'`, `'saturation'`, `'color'`, `'luminosity'`, `'plus-lighter'`) |

---

### `opacity`

| 类型 |
| ---- |
| 数字 |

---

### `outlineColor`

:::note
`outlineColor` 仅在 [新架构](/architecture/landing-page) 上可用
:::

设置元素轮廓的颜色。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color)。

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `outlineOffset`

:::note
`outlineOffset` 仅在 [新架构](/architecture/landing-page) 上可用
:::

设置轮廓与元素边界之间的空间量。不影响布局。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)。

| 类型 |
| ---- |
| 数字 |

---

### `outlineStyle`

:::note
`outlineStyle` 仅在 [新架构](/architecture/landing-page) 上可用
:::

设置元素轮廓的样式。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style)。

| 类型                                     |
| ---------------------------------------- |
| 枚举 (`'solid'`, `'dotted'`, `'dashed'`) |

---

### `outlineWidth`

:::note
`outlineWidth` 仅在 [新架构](/architecture/landing-page) 上可用
:::

绘制在元素周围、边框外部的轮廓宽度。不影响布局。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width)。

| 类型 |
| ---- |
| 数字 |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：View 可以成为触摸事件的目标。
- `'none'`：View 永远不会成为触摸事件的目标。
- `'box-none'`：View 永远不会成为触摸事件的目标，但其子视图可以。
- `'box-only'`：View 可以成为触摸事件的目标，但其子视图不可以。

| 类型                                                   |
| ------------------------------------------------------ |
| 枚举 (`'auto'`, `'box-none'`, `'box-only'`, `'none'` ) |
