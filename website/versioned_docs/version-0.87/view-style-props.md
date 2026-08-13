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

| 类型                          |
| ----------------------------- |
| enum(`'visible'`, `'hidden'`) |

---

### `backgroundColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `backgroundImage`

`backgroundImage` 提供了使用类似 Web 的语法绘制 [`linear-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient) 和 [`radial-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) 的能力。

```tsx
// Simple usage:
<View style={{ backgroundImage: 'linear-gradient(45deg, blue, red)' }} />

<View style={{ backgroundImage: 'radial-gradient(ellipse farthest-corner at 30% 40%, red, blue)' }} />

// Also with PlatformColor:
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

更多复杂的使用示例可以在 RNTester 应用中找到（支持 `PlatformColor`）：

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

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderBottomLeftRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderBottomRightRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderBottomStartRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderStartEndRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderStartStartRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderEndEndRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderEndStartRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderBottomWidth`

| 类型   |
| ------ |
| number |

---

### `borderColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderCurve` <div className="label ios">iOS</div>

在 iOS 13 及更高版本中，可以更改边框的圆角曲线。

| 类型                               |
| ---------------------------------- |
| enum(`'circular'`, `'continuous'`) |

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

| 类型   |
| ------ |
| number |

---

### `borderRadius`

如果圆角边框不可见，也可以尝试应用 `overflow: 'hidden'`。

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderRightColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderRightWidth`

| 类型   |
| ------ |
| number |

---

### `borderStartColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderStyle`

| 类型                                    |
| --------------------------------------- |
| enum(`'solid'`, `'dotted'`, `'dashed'`) |

---

### `borderTopColor`

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `borderTopEndRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderTopLeftRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderTopRightRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderTopStartRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderTopWidth`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderWidth`

| 类型   |
| ------ |
| number |

### `boxShadow`

:::note
`boxShadow` 仅在[新架构](/architecture/landing-page)中可用。外部阴影仅支持 **Android 9+**。内部阴影仅支持 **Android 10+**。
:::

为元素添加阴影效果，并且可以控制阴影的位置、颜色、大小和模糊程度。根据阴影是否为 _inset_，阴影会显示在元素边框框的外部或内部。这是对[同名 Web 样式属性](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)的规范兼容实现。有关所有可用参数的更多信息，请参阅 [BoxShadowValue](./boxshadowvalue) 文档。

这些阴影可以组合使用，因此单个 `boxShadow` 可以由多个不同的阴影组成。

`boxShadow` 可以接受一个模拟 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#syntax)的字符串，也可以接受一个 [BoxShadowValue](./boxshadowvalue) 对象数组。

| 类型                                      |
| ----------------------------------------- |
| array of BoxShadowValue objects \| string |

### `cursor` <div className="label ios">iOS</div>

在 iOS 17 及更高版本中，将其设置为 `pointer` 后，当指针（例如 iOS 上的触控板或触控笔，或者 visionOS 上用户的视线）位于视图上方时，可以启用悬停效果。

| 类型                        |
| --------------------------- |
| enum(`'auto'`, `'pointer'`) |

---

### `elevation` <div className="label android">Android</div>

使用 Android 底层的 [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation) 设置视图的高度。这会为项目添加投影，并影响重叠视图的 z 轴顺序。仅支持 Android 5.0 及更高版本，在更早版本中无效。

| 类型   |
| ------ |
| number |

---

### `filter`

:::note
`filter` 仅在[新架构](/architecture/landing-page)中可用
:::

为 `View` 添加图形滤镜。此滤镜由任意数量的*滤镜函数*组成，每个滤镜函数都代表对 `View` 图形合成效果的某种原子变化。下面定义了所有有效的滤镜函数。`filter` 不仅会应用于 `View` 本身，也会应用于 `View` 的后代元素。`filter` 会隐式设置 `overflow: hidden`，因此后代元素会被裁剪以适应 `View` 的边界。

以下滤镜函数适用于所有平台：

- `brightness`：更改 `View` 的亮度。接受非负数或百分比。
- `opacity`：更改 `View` 的不透明度或 alpha。接受非负数或百分比。

:::note
由于性能和规范兼容性问题，iOS 上仅提供这两个滤镜函数。目前计划探索使用 SwiftUI 而不是 UIKit 来实现的潜在解决方案。
:::

<div className="label basic android">Android</div>

以下滤镜函数仅适用于 Android：

- `blur`：使用[高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur)对 `View` 进行模糊处理，其中指定的长度表示模糊算法所使用的半径。任何非负 DIP 值均有效（不支持百分比）。值越大，结果越模糊。
- `contrast`：更改 `View` 的对比度。接受非负数或百分比。
- `dropShadow`：在 `View` 的 alpha 蒙版周围添加阴影（只有 `View` 中 alpha 非零的像素才会投射阴影）。接受一个表示阴影颜色的可选颜色，以及 2 个或 3 个长度值。如果指定了 2 个长度值，它们将分别解释为 `offsetX` 和 `offsetY`，用于在 X 轴和 Y 轴方向上平移阴影。如果提供了第 3 个长度值，则将其解释为阴影所使用的高斯模糊的标准差，因此值越大，阴影越模糊。有关参数的更多信息，请参阅 [DropShadowValue](./dropshadowvalue.md)。
- `grayscale`：根据指定的程度将 `View` 转换为[灰度](https://en.wikipedia.org/wiki/Grayscale)。接受非负数或百分比，其中 `1` 或 `100%` 表示完全灰度。
- `hueRotate`：更改 `View` 的[色相](https://en.wikipedia.org/wiki/Hue)。此函数的参数定义了色轮周围色相旋转的角度，例如，`360deg` 不会产生任何效果。此角度可以使用 `deg` 或 `rad` 单位。
- `invert`：反转 `View` 中的颜色。接受非负数或百分比，其中 `1` 或 `100%` 表示完全反转。
- `sepia`：将 `View` 转换为[棕褐色](<https://en.wikipedia.org/wiki/Sepia_(color)>)。接受非负数或百分比，其中 `1` 或 `100%` 表示完全棕褐色。
- `saturate`：更改 `View` 的[饱和度](https://en.wikipedia.org/wiki/Colorfulness)。接受非负数或百分比。

:::note
`blur` 和 `dropShadow` 仅支持 **Android 12+**
:::

`filter` 可以接受由上述滤镜函数组成的对象数组，也可以接受一个模拟 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#syntax)的字符串。

| 类型                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| array of objects: `{brightness: number\|string}`, `{opacity: number\|string}`, `{blur: number\|string}`, `{contrast: number\|string}`, `{dropShadow: DropShadowValue\|string}`, `{grayscale: number\|string}`, `{hueRotate: number\|string}`, `{invert: number\|string}`, `{sepia: number\|string}`, `{saturate: number\|string}` or string |

---

### `mixBlendMode`

:::note
`mixBlendMode` 仅在[新架构](/architecture/landing-page)和 **Android 10+** 中可用
:::

控制 `View` 如何在其**堆叠上下文**中与其他元素混合颜色。有关每个混合函数的完整概述，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)。

如需更精细地控制哪些内容应进行混合，请参阅 [isolation](layout-props#isolation)。

##### mixBlendMode 值

- `normal`：元素绘制在其背景之上，不进行混合。
- `multiply`：将源颜色与目标颜色相乘，并替换目标颜色。
- `screen`：将背景色和源颜色值的补色相乘，然后对结果取补色。
- `overlay`：根据背景色值对颜色执行正片叠底或滤色。
- `darken`：选择背景色和源颜色中较暗的颜色。
- `lighten`：选择背景色和源颜色中较亮的颜色。
- `color-dodge`：提亮背景色以反映源颜色。使用黑色绘制不会产生变化。
- `color-burn`：使背景色变暗以反映源颜色。使用白色绘制不会产生变化。
- `hard-light`：根据源颜色值对颜色执行正片叠底或滤色。其效果类似于在背景上照射强烈的聚光灯。
- `soft-light`：根据源颜色值使颜色变暗或变亮。其效果类似于在背景上照射漫射聚光灯。
- `difference`：从较亮的颜色中减去两个组成颜色中较暗的颜色。
- `exclusion`：产生类似于 Difference 模式但对比度更低的效果。
- `hue`：创建一个具有源颜色色相以及背景色饱和度和亮度的颜色。
- `saturation`：创建一个具有源颜色饱和度以及背景色色相和亮度的颜色。
- `color`：创建一个具有源颜色色相和饱和度以及背景色亮度的颜色。这会保留背景的灰度级别，适用于为单色图像着色或为彩色图像添加色调。
- `luminosity`：创建一个具有源颜色亮度以及背景色色相和饱和度的颜色。这会产生与 Color 模式相反的效果。
- `plus-lighter`：将源颜色和目标颜色通道相加，并将每个通道限制在最大值。

| 类型                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enum(`'normal'`, `'multiply'`, `'screen'`, `'overlay'`, `'darken'`, `'lighten'`, `'color-dodge'`, `'color-burn'`, `'hard-light'`, `'soft-light'`, `'difference'`, `'exclusion'`, `'hue'`, `'saturation'`, `'color'`, `'luminosity'`, `'plus-lighter'`) |

---

### `opacity`

| 类型   |
| ------ |
| number |

---

### `outlineColor`

:::note
`outlineColor` 仅在[新架构](/architecture/landing-page)中可用
:::

设置元素轮廓的颜色。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color)。

| 类型              |
| ----------------- |
| [颜色](colors.md) |

---

### `outlineOffset`

:::note
`outlineOffset` 仅在[新架构](/architecture/landing-page)中可用
:::

设置轮廓与元素边界之间的间距。不影响布局。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)。

| 类型   |
| ------ |
| number |

---

### `outlineStyle`

:::note
`outlineStyle` 仅在[新架构](/architecture/landing-page)中可用
:::

设置元素轮廓的样式。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style)。

| 类型                                    |
| --------------------------------------- |
| enum(`'solid'`, `'dotted'`, `'dashed'`) |

---

### `outlineWidth`

:::note
`outlineWidth` 仅在[新架构](/architecture/landing-page)中可用
:::

设置元素周围、边框外部绘制的轮廓宽度。不影响布局。有关更多详细信息，请参阅 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width)。

| 类型   |
| ------ |
| number |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：View 可以成为触摸事件的目标。
- `'none'`：View 永远不会成为触摸事件的目标。
- `'box-none'`：View 永远不会成为触摸事件的目标，但其子视图可以成为目标。
- `'box-only'`：View 可以成为触摸事件的目标，但其子视图不能成为目标。

| 类型                                                  |
| ----------------------------------------------------- |
| enum(`'auto'`, `'box-none'`, `'box-only'`, `'none'` ) |
