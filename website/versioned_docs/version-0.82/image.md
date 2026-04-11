---
id: image
title: 图片
---

一个用于显示不同类型图片的 React 组件，包括网络图片、静态资源、临时本地图片以及来自本地磁盘（例如相册）的图片。

此示例展示了从本地存储获取和显示图片，以及从网络甚至从 `'data:'` URI 方案提供的数据显示图片。

:::note
对于网络和数据图片，你需要手动指定图片的尺寸！
:::

## 示例

```SnackPlayer name=Image%20Example
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const DisplayAnImage = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('@expo/snack-static/react-native-logo.png')}
      />
      <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <Image
        style={styles.logo}
        source={{
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

export default DisplayAnImage;
```

你也可以为图片添加 `style`：

```SnackPlayer name=Styled%20Image%20Example
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
});

const DisplayAnImageWithStyle = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.stretch}
        source={require('@expo/snack-static/react-native-logo.png')}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

export default DisplayAnImageWithStyle;
```

## Android 上的 GIF 和 WebP 支持

当你构建自己的原生代码时，Android 默认不支持 GIF 和 WebP。

你需要根据应用的需求，在 `android/app/build.gradle` 中添加一些可选模块。

```groovy
dependencies {
  // 如果你的应用支持冰激凌三明治 (API 级别 14) 之前的 Android 版本
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // 用于支持 animated GIF
  implementation 'com.facebook.fresco:animated-gif:3.6.0'

  // 用于支持 WebP，包括 animated WebP
  implementation 'com.facebook.fresco:animated-webp:3.6.0'
  implementation 'com.facebook.fresco:webpsupport:3.6.0'

  // 用于支持 WebP，不含动画
  implementation 'com.facebook.fresco:webpsupport:3.6.0'
}
```

:::note
上面列出的版本可能未及时更新。请查看主仓库中的 [`packages/react-native/gradle/libs.versions.toml`](https://github.com/facebook/react-native/blob/main/packages/react-native/gradle/libs.versions.toml) 以查看特定标记版本中使用的 fresco 版本。
:::

---

# 参考

## 属性

### [View 属性](view.md#props)

继承自 [View 属性](view#props)。

---

### `accessible`

当为 true 时，表示该图片是一个无障碍元素。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `accessibilityLabel`

当用户与图片交互时，屏幕阅读器读取的文本。

| 类型   |
| ------ |
| 字符串 |

---

### `alt`

定义图片替代文本描述的字符串，当用户与图片交互时将由屏幕阅读器读取。使用此属性将自动标记该元素为可无障碍访问。

| 类型   |
| ------ |
| 字符串 |

---

### `blurRadius`

blurRadius：添加到图片的模糊滤镜的模糊半径。

| 类型   |
| ------ |
| 数字 |

:::tip
在 IOS 上，你需要将 `blurRadius` 增加到 `5` 以上。
:::

---

### `capInsets` <div className="label ios">iOS</div>

当图片调整大小时，由 `capInsets` 指定的大小的角落将保持固定大小，但图片的中心内容和边框将被拉伸。这对于创建可调整大小的圆角按钮、阴影和其他可调整大小的资源很有用。更多信息请参阅 [官方 Apple 文档](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets)。

| 类型         |
| ------------ |
| [Rect](rect) |

---

### `crossOrigin`

指定获取图片资源时使用的 CORS 模式的关键字字符串。其工作方式类似于 HTML 中的 crossorigin 属性。

- `anonymous`：图片请求中不交换用户凭证。
- `use-credentials`：在图片请求中将 `Access-Control-Allow-Credentials` 标头值设置为 `true`。

| 类型                                     | 默认值       |
| ---------------------------------------- | ------------- |
| enum(`'anonymous'`, `'use-credentials'`) | `'anonymous'` |

---

### `defaultSource`

加载图片源时显示的静态图片。

| 类型                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

:::note
在 Android 上，default source 属性在调试构建中被忽略。
:::

---

### `fadeDuration` <div className="label android">Android</div>

淡入动画持续时间（毫秒）。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `300`   |

---

### `height`

图片组件的高度。

| 类型   |
| ------ |
| 数字 |

---

### `loadingIndicatorSource`

类似于 `source`，此属性表示用于渲染图片加载指示器的资源。加载指示器会显示直到图片准备好显示，通常在图片下载完成后。

| 类型                                                  |
| ----------------------------------------------------- |
| [ImageSource](image#imagesource)（仅 `uri`）, 数字 |

---

### `onError`

加载错误时调用。

| 类型                                |
| ----------------------------------- |
| (`{nativeEvent: {error} }`) => void |

---

### `onLayout`

挂载和布局变化时调用。

| 类型                                                    |
| ------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)} => void` |

---

### `onLoad`

加载成功完成时调用。

**示例：** `onLoad={({nativeEvent: {source: {width, height}}}) => setImageRealSize({width, height})}`

| 类型                                                                |
| ------------------------------------------------------------------- |
| `md ({nativeEvent: [ImageLoadEvent](image#imageloadevent)} => void` |

---

### `onLoadEnd`

加载成功或失败时调用。

| 类型       |
| ---------- |
| () => void |

---

### `onLoadStart`

加载开始时调用。

**示例：** `onLoadStart={() => this.setState({loading: true})}`

| 类型       |
| ---------- |
| () => void |

---

### `onPartialLoad` <div className="label ios">iOS</div>

图片部分加载完成时调用。什么是“部分加载”的定义取决于加载器，但这旨在用于渐进式 JPEG 加载。

| 类型       |
| ---------- |
| () => void |

---

### `onProgress`

下载进度时调用。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {loaded, total} }`) => void |

---

### `progressiveRenderingEnabled` <div className="label android">Android</div>

当为 `true` 时，启用渐进式 jpeg 流 - https://frescolib.org/docs/progressive-jpegs。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `referrerPolicy`

指示获取资源时使用哪个引用者的字符串。设置图片请求中 `Referrer-Policy` 标头的值。工作方式类似于 HTML 中的 `referrerpolicy` 属性。

| 类型                                                                                                                                                                                     | 默认值                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| enum(`'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`) | `'strict-origin-when-cross-origin'` |

---

### `ref`

挂载时将分配给 [元素节点](element-nodes) 的 ref 设置器。

---

### `resizeMethod` <div className="label android">Android</div>

当图片尺寸与图片视图尺寸不同时，用于调整图片大小的机制。默认为 `auto`。

- `auto`：使用启发式方法在 `resize` 和 `scale` 之间选择。

- `resize`：一种软件操作，在解码之前更改内存中的编码图片。当图片远大于视图时，应使用此方法代替 `scale`。

- `scale`：图片被绘制为缩小或放大。与 `resize` 相比，`scale` 更快（通常硬件加速）并产生更高质量的图片。如果图片小于视图，应使用此方法。如果图片略大于视图，也应使用此方法。

- `none`：不执行采样，图片以其完整分辨率显示。这应该仅在少数情况下使用，因为它被认为是不安全的，因为当尝试渲染消耗过多内存的图片时，Android 将抛出运行时异常。

有关 `resize` 和 `scale` 的更多详情可在 https://frescolib.org/docs/resizing 找到。

| 类型                                            | 默认值  |
| ----------------------------------------------- | -------- |
| enum(`'auto'`, `'resize'`, `'scale'`, `'none'`) | `'auto'` |

---

### `resizeMode`

确定当帧不匹配原始图片尺寸时如何调整图片大小。默认为 `cover`。

- `cover`：统一缩放图片（保持图片的纵横比），以便
  - 图片的两个维度（宽度和高度）将等于或大于视图的相应维度（减去内边距）
  - 缩放后图片的至少一个维度将等于视图的相应维度（减去内边距）

- `contain`：统一缩放图片（保持图片的纵横比），以便图片的两个维度（宽度和高度）将等于或小于视图的相应维度（减去内边距）。

- `stretch`：独立缩放宽度和高度，这可能会改变源的纵横比。

- `repeat`：重复图片以覆盖视图的帧。图片将保持其大小和纵横比，除非它大于视图，在这种情况下它将统一缩小以便包含在视图中。

- `center`：沿两个维度将图片居中在视图中。如果图片大于视图，统一缩小它以便包含在视图中。

| 类型                                                              | 默认值   |
| ----------------------------------------------------------------- | --------- |
| enum(`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `resizeMultiplier` <div className="label android">Android</div>

当 `resizeMethod` 设置为 `resize` 时，目标尺寸乘以此值。`scale` 方法用于执行剩余的调整大小。`1.0` 的默认值意味着位图大小设计为适合目标尺寸。大于 `1.0` 的乘数将设置比目标尺寸更大的调整大小选项，并且生成的位图将从硬件大小缩小。默认为 `1.0`。

此属性在目标尺寸相当小而源图片显著较大的情况下最有用。`resize` 调整大小方法执行下采样，源和目标图片大小之间会丢失大量图片质量，通常导致图片模糊。通过使用乘数，解码后的图片略大于目标大小但小于源图片（如果源图片足够大）。这允许混叠伪影通过缩放操作在乘数图片上产生伪质量。

如果你有一个尺寸为 200x200 的源图片和 24x24 的目标尺寸，`2.0` 的 resizeMultiplier 将告诉 Fresco 将图片下采样到 48x48。Fresco 选择最接近的 2 的幂（所以是 50x50）并将图片解码为该大小的位图。如果没有乘数，最接近的 2 的幂将是 25x25。结果图片由系统缩小。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `1.0`   |

---

### `source`

图片源（远程 URL 或本地文件资源）。

此属性还可以包含几个远程 URL，与它们的宽度和高度一起指定，并可能带有 scale/其他 URI 参数。原生端将根据图片容器的测量大小选择最佳的 `uri` 进行显示。可以添加 `cache` 属性来控制网络请求如何与本地缓存交互。（更多信息请参阅 [图片的缓存控制](images#cache-control)）。

目前支持的格式有 `png`、`jpg`、`jpeg`、`bmp`、`gif`、`webp`、`psd`（仅 iOS）。此外，iOS 支持几种 RAW 图片格式。请参阅 Apple 的文档以获取当前支持的相机型号列表（对于 iOS 12，请参阅 https://support.apple.com/en-ca/HT208967）。

请注意，`webp` 格式仅在 **与 JavaScript 代码捆绑时** 在 iOS 上受支持。

| 类型                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

---

### `src`

代表图片远程 URL 的字符串。此属性优先于 `source` 属性。

**示例：** `src={'https://reactnative.dev/img/tiny_logo.png'}`

| 类型   |
| ------ |
| 字符串 |

---

### `srcSet`

代表逗号分隔的可能候选图片源列表的字符串。每个图片源包含一个图片 URL 和一个像素密度描述符。如果未指定描述符，则默认为 `1x` 描述符。

如果 `srcSet` 不包含 `1x` 描述符，则 `src` 中的值用作带有 `1x` 描述符的图片源（如果提供）。

此属性优先于 `src` 和 `source` 属性。

**示例：** `srcSet={'https://reactnative.dev/img/tiny_logo.png 1x, https://reactnative.dev/img/header_logo.svg 2x'}`

| 类型   |
| ------ |
| 字符串 |

---

### `style`

| 类型                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [图片样式属性](image-style-props#props), [布局属性](layout-props#props), [阴影属性](shadow-props#props), [变换](transforms#props) |

---

### `testID`

用于 UI 自动化测试脚本的唯一标识符。

| 类型   |
| ------ |
| 字符串 |

---

### `tintColor`

将所有非透明像素的颜色更改为 `tintColor`。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `width`

图片组件的宽度。

| 类型   |
| ------ |
| 数字 |

## 方法

### `abortPrefetch()` <div className="label android">Android</div>

```tsx
static abortPrefetch(requestId: number);
```

中止预取请求。

**参数：**

| 名称                                                           | 类型   | 描述                             |
| -------------------------------------------------------------- | ------ | --------------------------------------- |
| requestId <div className="label basic required">必需</div> | number | `prefetch()` 返回的请求 ID。 |

---

### `getSize()`

```tsx
static getSize(uri: string): Promise<{width: number, height: number}>;
```

在显示图像之前检索其宽度和高度（以像素为单位）。如果找不到图像或下载失败，此方法可能会失败。

为了检索图像尺寸，可能需要先加载或下载图像，之后它将被缓存。这意味着原则上你可以使用此方法预加载图像，但它并未为此目的进行优化，并且将来可能会以实现不完全加载/下载图像数据的方式实施。合适的、受支持的预加载图像方式将作为单独的 API 提供。

**参数：**

| <div className="wideColumn">名称</div>                   | 类型   | 描述                |
| -------------------------------------------------------- | ------ | -------------------------- |
| uri <div className="label basic required">必需</div> | string | 图像的位置。 |

---

### `getSizeWithHeaders()`

```tsx
static getSizeWithHeaders(
  uri: string,
  headers: {[index: string]: string}
): Promise<{width: number, height: number}>;
```

在显示图像之前检索其宽度和高度（以像素为单位），并提供为请求设置请求头的能力。如果找不到图像或下载失败，此方法可能会失败。它也不适用于静态图像资源。

为了检索图像尺寸，可能需要先加载或下载图像，之后它将被缓存。这意味着原则上你可以使用此方法预加载图像，但它并未为此目的进行优化，并且将来可能会以实现不完全加载/下载图像数据的方式实施。合适的、受支持的预加载图像方式将作为单独的 API 提供。

**参数：**

| <div className="wideColumn">名称</div>                       | 类型   | 描述                  |
| ------------------------------------------------------------ | ------ | ---------------------------- |
| uri <div className="label basic required">必需</div>     | string | 图像的位置。   |
| headers <div className="label basic required">必需</div> | object | 请求的请求头。 |

---

### `prefetch()`

```tsx
await Image.prefetch(url);
```

通过将远程图像下载到磁盘缓存以供后续使用来预取该图像。返回一个解析为布尔值的 Promise。

**参数：**

| 名称                                                     | 类型                                                  | 描述                                            |
| -------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| url <div className="label basic required">必需</div> | string                                                | 图像的远程位置。                      |
| callback                                                 | 函数 <div className="label android">Android</div> | 将使用 `requestId` 调用的函数。 |

---

### `queryCache()`

```tsx
static queryCache(
  urls: string[],
): Promise<Record<string, 'memory' | 'disk' | 'disk/memory'>>;
```

执行缓存查询。返回一个 Promise，解析为从 URL 到缓存状态的映射，例如 "disk"、"memory" 或 "disk/memory"。如果请求的 URL 不在映射中，则意味着它不在缓存中。

**参数：**

| 名称                                                      | 类型  | 描述                                |
| --------------------------------------------------------- | ----- | ------------------------------------------ |
| urls <div className="label basic required">必需</div> | array | 要检查缓存的图像 URL 列表。 |

---

### `resolveAssetSource()`

```tsx
static resolveAssetSource(source: ImageSourcePropType): {
  height: number;
  width: number;
  scale: number;
  uri: string;
};
```

将资产引用解析为具有 `uri`、`scale`、`width` 和 `height` 属性的对象。

**参数：**

| <div className="wideColumn">名称</div>                      | 类型                                     | 描述                                                                  |
| ----------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| source <div className="label basic required">必需</div> | [ImageSource](image#imagesource), number | 一个数字（`require('./foo.png')` 返回的不透明类型）或一个 ImageSource。 |

## 类型定义

### ImageCacheEnum <div className="label ios">iOS</div>

可用于设置潜在缓存响应的缓存处理或策略的枚举。

| 类型                                                               | 默认值     |
| ------------------------------------------------------------------ | ----------- |
| enum(`'default'`, `'reload'`, `'force-cache'`, `'only-if-cached'`) | `'default'` |

- `default`：使用原生平台的默认策略。
- `reload`：URL 的数据将从原始来源加载。不应使用现有缓存数据来满足 URL 加载请求。
- `force-cache`：现有缓存数据将用于满足请求，无论其时效或过期日期如何。如果缓存中没有与请求对应的现有数据，则数据从原始来源加载。
- `only-if-cached`：现有缓存数据将用于满足请求，无论其时效或过期日期如何。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从原始来源加载数据，并且加载被视为失败。

### ImageLoadEvent

`onLoad` 回调中返回的对象。

| 类型   |
| ------ |
| object |

**属性：**

| 名称   | 类型   | 描述                         |
| ------ | ------ | ----------------------------------- |
| source | object | [源对象](#source-object) |

#### 源对象

**属性：**

| 名称   | 类型   | 描述                                                  |
| ------ | ------ | ------------------------------------------------------------ |
| width  | number | 加载图像的宽度。                                   |
| height | number | 加载图像的高度。                                  |
| uri    | string | 表示图像资源标识符的字符串。 |

### ImageSource

| 类型                             |
| -------------------------------- |
| object, array of objects, number |

**属性（如果作为对象或对象数组传递）：**

| <div className="wideColumn">名称</div>     | 类型                                       | 描述                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| uri                                        | string                                     | 表示图像资源标识符的字符串，可以是 http 地址、本地文件路径或静态图像资源的名称。                              |
| width                                      | number                                     | 如果在构建时已知，则可以指定，在这种情况下，该值将用于设置默认 `<Image/>` 组件的尺寸。                                                     |
| height                                     | number                                     | 如果在构建时已知，则可以指定，在这种情况下，该值将用于设置默认 `<Image/>` 组件的尺寸。                                                     |
| scale                                      | number                                     | 用于指示图像的缩放因子。如果未指定，默认为 `1.0`，意味着一个图像像素等于一个显示点 / DIP。                                   |
| bundle<div className="label ios">iOS</div> | string                                     | 图像包含在内的 iOS 资产包。如果未设置，默认为 `[NSBundle mainBundle]`。                                                                        |
| method                                     | string                                     | 要使用的 HTTP 方法。如果未指定，默认为 `'GET'`。                                                                                                                        |
| headers                                    | object                                     | 表示随远程图像请求一起发送的 HTTP 请求头的对象。                                                                                           |
| body                                       | string                                     | 随请求发送的 HTTP 主体。这必须是有效的 UTF-8 字符串，并将完全按指定发送，不应用任何额外编码（例如 URL 转义或 base64）。 |
| cache<div className="label ios">iOS</div>  | [ImageCacheEnum](image#imagecacheenum-ios) | 确定请求如何处理潜在缓存的响应。                                                                                                                    |

**如果传递数字：**

- `number` - 由类似 `require('./image.jpg')` 返回的不透明类型。
