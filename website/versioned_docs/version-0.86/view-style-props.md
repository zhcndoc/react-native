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
    backgroundColor: '灰色',
    borderWidth: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middle: {
    flex: 0.3,
    backgroundColor: '米色',
    borderWidth: 5,
  },
  bottom: {
    flex: 0.3,
    backgroundColor: '粉色',
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

### `experimental_backgroundImage`

<ExperimentalAPIWarning />

`experimental_backgroundImage` 提供了使用类似 Web 的语法绘制 [`linear-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/linear-gradient) ([0.76.x+](https://github.com/facebook/react-native/blob/main/CHANGELOG-0.7x.md#v0760)) 和 [`radial-gradient()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) ([0.80.x+](https://github.com/facebook/react-native/blob/main/CHANGELOG.md#v0800)) 的能力。

```tsx
// 简单用法：
<View style={{
  experimental_backgroundImage: 'linear-gradient(45deg, blue, red)'
}} />
<View style={{
  experimental_backgroundImage: 'radial-gradient(ellipse farthest-corner at 30% 40%, red, blue)'
}} />
```

更复杂的使用示例可以在 RNTester 应用中找到（支持 `PlatformColor`）：

- <a href={`https://github.com/facebook/react-native/blob/${getCoreBranchNameForCurrentVersion()}/packages/rn-tester/js/examples/LinearGradient/LinearGradientExample.js`}>LinearGradientExample.js</a>
- <a href={`https://github.com/facebook/react-native/blob/${getCoreBranchNameForCurrentVersion()}/packages/rn-tester/js/examples/RadialGradient/RadialGradientExample.js`}>RadialGradientExample.js</a>

| 类型                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 字符串、对象数组：`{type: 'linear-gradient', direction: string, colorStops: object[] }`、`{type: 'radial-gradient', shape: string, position: object, size: string, colorStops: object[] }` |

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

| 类型               |
| ------------------ |
| [color](colors.md) |

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

| 类型                     |
| ------------------------ |
| 数字、字符串（百分比值） |

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

### `borderStartStartRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderEndEndRadius`

| 类型                       |
| -------------------------- |
| number，string（百分比值） |

---

### `borderEndStartRadius`

| 类型                     |
| ------------------------ |
| 数字、字符串（百分比值） |

---

### `borderBottomWidth`

| 类型   |
| ------ |
| number |

---

### `borderColor`

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `borderCurve` <div className="label ios">iOS</div>

在 iOS 13+ 上，可以更改边框的角曲线。

| 类型                               |
| ---------------------------------- |
| enum(`'circular'`, `'continuous'`) |

---

### `borderEndColor`

| 类型               |
| ------------------ |
| [color](colors.md) |

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

如果圆角边框不可见，也可以尝试同时应用 `overflow: 'hidden'`。

| 类型                      |
| ------------------------- |
| number, string (百分比值) |

---

### `borderRightColor`

| 类型               |
| ------------------ |
| [color](colors.md) |

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

| 类型                     |
| ------------------------ |
| 数字、字符串（百分比值） |

---

### `borderTopLeftRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

### `borderTopRightRadius`

| 类型                       |
| -------------------------- |
| number, string（百分比值） |

---

### `borderTopStartRadius`

| 类型                     |
| ------------------------ |
| 数字、字符串（百分比值） |

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
`boxShadow` 仅在 [新架构](/architecture/landing-page) 中可用。外发阴影仅支持 **Android 9+**。内发阴影仅支持 **Android 10+**。
:::

为元素添加阴影效果，并可控制阴影的位置、颜色、大小和模糊程度。根据阴影是否为 _inset_，该阴影会出现在元素边框盒的外部或内部。这是对同名 [Web 样式属性](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) 的符合规范的实现。可在 [BoxShadowValue](./boxshadowvalue) 文档中阅读有关所有可用参数的更多信息。

这些阴影可以组合在一起，因此单个 `boxShadow` 可以由多个不同的阴影组成。

`boxShadow` 接受一个模拟 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow#syntax) 的字符串，或一个由 [BoxShadowValue](./boxshadowvalue) 对象组成的数组。

| Type                                      |
| ----------------------------------------- |
| array of BoxShadowValue objects \| string |

### `cursor` <div className="label ios">iOS</div>

在 iOS 17+ 上，设置为 `pointer` 可在指针（例如 iOS 上的触控板或手写笔，或 visionOS 上用户的视线）悬停在视图上方时启用悬停效果。

| 类型                        |
| --------------------------- |
| enum(`'auto'`, `'pointer'`) |

---

### `elevation` <div className="label android">Android</div>

使用 Android 底层的 [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation) 设置视图的海拔。它会为项目添加投影阴影，并影响重叠视图的 z 顺序。仅支持 Android 5.0+，在更早版本上无效。

| 类型   |
| ------ |
| number |

---

### `filter`

:::note
`filter` 仅在 [新架构](/architecture/landing-page) 中可用
:::

为 `View` 添加图形滤镜。该滤镜由任意数量的 _filter functions_ 组成，每个函数都表示对 `View` 图形合成的某种原子级更改。有效滤镜函数的完整列表如下。`filter` 会作用于 `View` 的后代以及 `View` 本身。`filter` 隐含 `overflow: hidden`，因此后代会被裁剪以适应 `View` 的边界。

以下滤镜函数可跨平台工作：

- `brightness`：更改 `View` 的亮度。接受非负数或百分比。
- `opacity`：更改 `View` 的不透明度，或 alpha。接受非负数或百分比。

:::note
由于性能和规范兼容性方面的问题，这些是在 iOS 上可用的仅有两个滤镜函数。我们计划探索一些使用 SwiftUI 而不是 UIKit 来实现的潜在替代方案。
:::

<div className="label basic android">Android</div>

以下滤镜函数仅在 Android 上可用：

- `blur`：使用 [高斯模糊](https://en.wikipedia.org/wiki/Gaussian_blur) 模糊 `View`，其中指定的长度表示模糊算法中使用的半径。任何非负的 DIP 值都有效（不支持百分比）。数值越大，结果越模糊。
- `contrast`：更改 `View` 的对比度。接受非负数或百分比。
- `dropShadow`：围绕 `View` 的 alpha 蒙版添加阴影（只有 `View` 中非零 alpha 像素会投射阴影）。接受一个可选颜色作为阴影颜色，以及 2 或 3 个长度值。如果指定 2 个长度，则将其解释为 `offsetX` 和 `offsetY`，分别用于在 X 和 Y 方向平移阴影。如果给出第 3 个长度，则将其解释为用于阴影的高斯模糊标准差——数值越大，阴影越模糊。有关参数的更多信息，请参见 [DropShadowValue](./dropshadowvalue.md)。
- `grayscale`：按指定程度将 `View` 转换为 [灰度](https://en.wikipedia.org/wiki/Grayscale)。接受非负数或百分比，其中 `1` 或 `100%` 表示完全灰度化。
- `hueRotate`：更改 `View` 的 [色相](https://en.wikipedia.org/wiki/Hue)。此函数的参数定义了围绕色轮旋转色相的角度，因此例如 `360deg` 将不会产生效果。该角度可以使用 `deg` 或 `rad` 单位。
- `invert`：反转 `View` 中的颜色。接受非负数或百分比，其中 `1` 或 `100%` 表示完全反转。
- `sepia`：将 `View` 转换为 [棕褐色](<https://en.wikipedia.org/wiki/Sepia_(color)>)。接受非负数或百分比，其中 `1` 或 `100%` 表示完全棕褐化。
- `saturate`：更改 `View` 的 [饱和度](https://en.wikipedia.org/wiki/Colorfulness)。接受非负数或百分比。

:::note
`blur` 和 `dropShadow` 仅支持 **Android 12+**
:::

`filter` 接受由上述滤镜函数组成的对象数组，或模仿 [Web 语法](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#syntax) 的字符串。

| 类型                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 对象数组：`{brightness: number\|string}`、`{opacity: number\|string}`、`{blur: number\|string}`、`{contrast: number\|string}`、`{dropShadow: DropShadowValue\|string}`、`{grayscale: number\|string}`、`{hueRotate: number\|string}`、`{invert: number\|string}`、`{sepia: number\|string}`、`{saturate: number\|string}` 或字符串 |

---

### `mixBlendMode`

:::note
`mixBlendMode` 仅在 [新架构](/architecture/landing-page) 中可用，并且仅支持 **Android 10+**
:::

控制 `View` 如何将其颜色与其 **堆叠上下文** 中的其他元素进行混合。有关每种混合方式的完整概述，请查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)。

如需更细粒度地控制哪些内容应该彼此混合，请参见 [isolation](layout-props#isolation)。

##### mixBlendMode 值

- `normal`：元素绘制在其背景之上，不进行混合。
- `multiply`：源颜色与目标颜色相乘，并替换目标颜色。
- `screen`：将背景和源颜色值的补色相乘，然后对结果取补色。
- `overlay`：根据背景颜色值进行相乘或滤色。
- `darken`：选取背景色和源色中较深的颜色。
- `lighten`：选取背景色和源色中较浅的颜色。
- `color-dodge`：使背景色变亮以反映源颜色。用黑色绘制不会产生变化。
- `color-burn`：使背景色变暗以反映源颜色。用白色绘制不会产生变化。
- `hard-light`：根据源颜色值进行相乘或滤色。效果类似于在背景上照射强烈聚光灯。
- `soft-light`：根据源颜色值使颜色变暗或变亮。效果类似于在背景上照射柔和的漫射光。
- `difference`：从较浅的颜色中减去两个组成颜色中较深的那个。
- `exclusion`：产生类似于 Difference 模式但对比度更低的效果。
- `hue`：创建一种具有源颜色色相以及背景颜色饱和度和亮度的颜色。
- `saturation`：创建一种具有源颜色饱和度以及背景颜色色相和亮度的颜色。
- `color`：创建一种具有源颜色色相和饱和度以及背景颜色亮度的颜色。这会保留背景的灰度级，并可用于为单色图像着色或为彩色图像加色调。
- `luminosity`：创建一种具有源颜色亮度以及背景颜色色相和饱和度的颜色。这会产生与 Color 模式相反的效果。
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
`outlineColor` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置元素轮廓线的颜色。更多详情请参见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color)。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `outlineOffset`

:::note
`outlineOffset` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置轮廓线与元素边界之间的间距。不影响布局。更多详情请参见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)。

| 类型   |
| ------ |
| number |

---

### `outlineStyle`

:::note
`outlineStyle` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置元素轮廓线的样式。更多详情请参见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style)。

| 类型                                    |
| --------------------------------------- |
| enum(`'solid'`, `'dotted'`, `'dashed'`) |

---

### `outlineWidth`

:::note
`outlineWidth` 仅在 [新架构](/architecture/landing-page) 中可用
:::

元素周围绘制的轮廓线宽度，位于边框之外。不影响布局。更多详情请参见 [Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width)。

| 类型   |
| ------ |
| number |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：View 可以成为触摸事件的目标。
- `'none'`：View 从不成为触摸事件的目标。
- `'box-none'`：View 从不成为触摸事件的目标，但其子视图可以。
- `'box-only'`：View 可以成为触摸事件的目标，但其子视图不可以。

| 类型                                                  |
| ----------------------------------------------------- |
| enum(`'auto'`, `'box-none'`, `'box-only'`, `'none'` ) |
