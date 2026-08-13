---
id: image
title: Image
---

用于显示不同类型图像的 React 组件，包括网络图像、静态资源、临时本地图像以及来自本地磁盘的图像，例如相机胶卷中的图像

此示例展示了如何从本地存储中获取并显示图像，以及如何显示网络图像，甚至显示 `'data:'` uri scheme 中提供的数据

:::note
对于网络图像和数据图像，你需要手动指定图像的尺寸！
:::

## 示例

```SnackPlayer name=Image%20Example
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

你也可以为图像添加 `style`：

```SnackPlayer name=Styled%20Image%20Example
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

构建自己的原生代码时，Android 默认不支持 GIF 和 WebP

你需要根据应用的需求，在 `android/app/build.gradle` 中添加一些可选模块

```groovy
dependencies {
  // If your app supports Android versions before Ice Cream Sandwich (API level 14)
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // For animated GIF support
  implementation 'com.facebook.fresco:animated-gif:3.6.0'

  // For WebP support, including animated WebP
  implementation 'com.facebook.fresco:animated-webp:3.6.0'
  implementation 'com.facebook.fresco:webpsupport:3.6.0'

  // For WebP support, without animations
  implementation 'com.facebook.fresco:webpsupport:3.6.0'
}
```

:::note
上面列出的版本可能未及时更新。请在主仓库中查看 [`packages/react-native/gradle/libs.versions.toml`](https://github.com/facebook/react-native/blob/main/packages/react-native/gradle/libs.versions.toml)，以了解特定标记版本使用的 fresco 版本
:::

---

# 参考

## Props

### [View Props](view.md#props)

继承 [View Props](view#props)

---

### `accessible`

为 true 时，表示该图像是一个可访问性元素

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `accessibilityLabel`

用户与图像交互时，屏幕阅读器读取的文本

| 类型   |
| ------ |
| string |

---

### `alt`

定义图像替代文本描述的字符串，用户与其交互时屏幕阅读器会读取该描述。使用此属性会自动将此元素标记为可访问

| 类型   |
| ------ |
| string |

---

### `blurRadius`

blurRadius：添加到图像上的模糊滤镜的模糊半径

| 类型   |
| ------ |
| number |

:::tip
在 IOS 上，需要将 `blurRadius` 增加到大于 `5`
:::

---

### `capInsets` <div className="label ios">iOS</div>

调整图像大小时，`capInsets` 指定尺寸的角落将保持固定大小，但图像的中心内容和边框会被拉伸。这对于创建可调整大小的圆角按钮、阴影及其他可调整大小的资源很有用。更多信息请参阅 [Apple 官方文档](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets)

| 类型         |
| ------------ |
| [Rect](rect) |

---

### `crossOrigin`

指定获取图像资源时使用的 CORS 模式的关键字字符串。其作用类似于 HTML 中的 crossorigin 属性

- `anonymous`：图像请求中不交换用户凭据
- `use-credentials`：将图像请求中的 `Access-Control-Allow-Credentials` 标头值设置为 `true`

| 类型                                     | 默认值        |
| ---------------------------------------- | ------------- |
| enum(`'anonymous'`, `'use-credentials'`) | `'anonymous'` |

---

### `defaultSource`

加载图像源时显示的静态图像

| 类型                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

:::note
在 Android 上，debug 构建会忽略 default source prop
:::

---

### `fadeDuration` <div className="label android">Android</div>

淡入动画时长，单位为毫秒

| 类型   | 默认值 |
| ------ | ------ |
| number | `300`  |

---

### `height`

图像组件的高度

| 类型   |
| ------ |
| number |

---

### `loadingIndicatorSource`

与 `source` 类似，此属性表示用于渲染图像加载指示器的资源。加载指示器会一直显示，直到图像准备好显示，通常是在图像下载完成之后

| 类型                                                   |
| ------------------------------------------------------ |
| [ImageSource](image#imagesource)（仅限 `uri`），number |

---

### `onError`

加载出错时调用

| 类型                                |
| ----------------------------------- |
| (`{nativeEvent: {error} }`) => void |

---

### `onLayout`

挂载以及布局发生变化时调用

| 类型                                                    |
| ------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)} => void` |

---

### `onLoad`

加载成功完成时调用

**示例：** `onLoad={({nativeEvent: {source: {width, height}}}) => setImageRealSize({width, height})}`

| 类型                                                                |
| ------------------------------------------------------------------- |
| `md ({nativeEvent: [ImageLoadEvent](image#imageloadevent)} => void` |

---

### `onLoadEnd`

加载成功或失败时调用

| 类型       |
| ---------- |
| () => void |

---

### `onLoadStart`

开始加载时调用

**示例：** `onLoadStart={() => this.setState({loading: true})}`

| 类型       |
| ---------- |
| () => void |

---

### `onPartialLoad` <div className="label ios">iOS</div>

图像的部分加载完成时调用。不过，什么构成“部分加载”取决于加载器，该属性主要用于渐进式 JPEG 加载

| 类型       |
| ---------- |
| () => void |

---

### `onProgress`

下载进度发生变化时调用

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {loaded, total} }`) => void |

---

### `progressiveRenderingEnabled` <div className="label android">Android</div>

为 `true` 时，启用渐进式 jpeg 流式传输：https://frescolib.org/docs/progressive-jpegs

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `referrerPolicy`

表示获取资源时使用哪个 referrer 的字符串。设置图像请求中 `Referrer-Policy` 标头的值。其作用类似于 HTML 中的 `referrerpolicy` 属性

| 类型                                                                                                                                                                                     | 默认值                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| enum(`'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`) | `'strict-origin-when-cross-origin'` |

---

### `ref`

挂载时将被赋值为 [element node](element-nodes) 的 ref setter

---

### `resizeMethod` <div className="label android">Android</div>

当图像尺寸与图像视图尺寸不同时，用于调整图像大小的机制。默认为 `auto`

- `auto`：使用启发式方法在 `resize` 和 `scale` 之间进行选择

- `resize`：在图像解码之前，在内存中更改编码图像的软件操作。当图像远大于视图时，应使用此方式，而不是 `scale`

- `scale`：对图像进行缩小或放大绘制。与 `resize` 相比，`scale` 更快（通常由硬件加速），并且生成的图像质量更高。当图像小于视图时，应使用此方式。如果图像仅略大于视图，也应使用此方式

- `none`：不执行采样，以完整分辨率显示图像。仅应在极少数情况下使用，因为这种方式被认为不安全：Android 在尝试渲染占用过多内存的图像时会抛出运行时异常

有关 `resize` 和 `scale` 的更多详细信息，请参阅 https://frescolib.org/docs/resizing

| 类型                                            | 默认值   |
| ----------------------------------------------- | -------- |
| enum(`'auto'`, `'resize'`, `'scale'`, `'none'`) | `'auto'` |

---

### `resizeMode`

当图像框架与原始图像尺寸不匹配时，决定如何调整图像大小。默认为 `cover`

- `cover`：均匀缩放图像（保持图像的宽高比），使得
  - 图像的两个尺寸（宽度和高度）都等于或大于视图的对应尺寸（减去内边距）
  - 缩放后图像的至少一个尺寸等于视图的对应尺寸（减去内边距）

- `contain`：均匀缩放图像（保持图像的宽高比），使得图像的两个尺寸（宽度和高度）都等于或小于视图的对应尺寸（减去内边距）

- `stretch`：独立缩放宽度和高度，这可能会改变 src 的宽高比

- `repeat`：重复图像以覆盖视图框架。图像会保持其大小和宽高比，除非它大于视图；此时会均匀缩小图像，使其包含在视图中

- `center`：在两个尺寸方向上将图像居中显示在视图中。如果图像大于视图，则均匀缩小图像，使其包含在视图中

| 类型                                                              | 默认值    |
| ----------------------------------------------------------------- | --------- |
| enum(`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `resizeMultiplier` <div className="label android">Android</div>

当 `resizeMethod` 设置为 `resize` 时，目标尺寸会乘以此值。剩余的调整大小操作将使用 `scale` 方法执行。默认值 `1.0` 表示位图尺寸被设计为适合目标尺寸。大于 `1.0` 的乘数会将调整大小选项设置为大于目标尺寸，生成的位图则会从硬件尺寸缩小。默认为 `1.0`

此 prop 在目标尺寸很小且源图像明显更大的情况下最有用。`resize` resize method 会执行降采样，源图像尺寸与目标图像尺寸之间会损失大量图像质量，通常会导致图像模糊。使用乘数后，解码后的图像会略大于目标尺寸，但小于源图像（前提是源图像足够大）。这样，混叠伪影可以通过对乘数图像执行缩放操作来产生仿真质量

如果源图像尺寸为 200x200，目标尺寸为 24x24，则 `resizeMultiplier` 为 `2.0` 会告诉 Fresco 将图像降采样为 48x48。Fresco 会选择最接近的 2 的幂（因此为 50x50），并将图像解码为该尺寸的位图。不使用乘数时，最接近的 2 的幂将是 25x25。最终图像会由系统缩小

| 类型   | 默认值 |
| ------ | ------ |
| number | `1.0`  |

---

### `source`

图像源（远程 URL 或本地文件资源）

此 prop 也可以包含多个远程 URL，并同时指定其宽度、高度以及可能的 scale／其他 URI 参数。原生端会根据测得的图像容器尺寸选择要显示的最佳 `uri`。可以添加 `cache` 属性来控制网络请求与本地缓存的交互方式。（更多信息请参阅 [图像缓存控制](images#cache-control)）

当前支持的格式包括 `png`、`jpg`、`jpeg`、`bmp`、`gif`、`webp`、`psd`（仅限 iOS）。此外，iOS 还支持多种 RAW 图像格式。有关当前支持的相机型号列表，请参阅 Apple 的文档（对于 iOS 12，请参阅 https://support.apple.com/en-ca/HT208967）

请注意，`webp` 格式在 iOS 上**仅**在与 JavaScript 代码一起打包时受支持

| 类型                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

---

### `src`

表示图像远程 URL 的字符串。此 prop 的优先级高于 `source` prop

**示例：** `src={'https://reactnative.dev/img/tiny_logo.png'}`

| 类型   |
| ------ |
| string |

---

### `srcSet`

表示以逗号分隔的候选图像源列表的字符串。每个图像源都包含图像 URL 和像素密度描述符。如果未指定描述符，则默认为 `1x` 描述符

如果 `srcSet` 不包含 `1x` 描述符，则使用 `src` 中的值作为具有 `1x` 描述符的图像源（如果提供）

此 prop 的优先级高于 `src` 和 `source` props

**示例：** `srcSet={'https://reactnative.dev/img/tiny_logo.png 1x, https://reactnative.dev/img/header_logo.svg 2x'}`

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Image Style Props](image-style-props#props)、[Layout Props](layout-props#props)、[Shadow Props](shadow-props#props)、[Transforms](transforms#props) |

---

### `testID`

供 UI Automation 测试脚本使用的此元素的唯一标识符

| 类型   |
| ------ |
| string |

---

### `tintColor`

将所有非透明像素的颜色更改为 `tintColor`

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `width`

图像组件的宽度

| 类型   |
| ------ |
| number |

## 方法

### `abortPrefetch()` <div className="label android">Android</div>

```tsx
static abortPrefetch(requestId: number);
```

中止预取请求

**参数：**

| 名称                                                           | 类型   | 描述                       |
| -------------------------------------------------------------- | ------ | -------------------------- |
| requestId <div className="label basic required">Required</div> | number | `prefetch()` 返回的请求 ID |

---

### `getSize()`

```tsx
static getSize(uri: string): Promise<{width: number, height: number}>;
```

在显示图像之前获取其宽度和高度（以像素为单位）。如果找不到图像或下载失败，此方法可能会失败

为了获取图像尺寸，可能需要先加载或下载图像，之后图像会被缓存。这意味着原则上你可以使用此方法预加载图像，但它并未针对这一用途进行优化，未来可能会以不完全加载／下载图像数据的方式实现。后续将提供一种正式且受支持的图像预加载方式，作为单独的 API

**参数：**

| <div className="wideColumn">名称</div>                   | 类型   | 描述       |
| -------------------------------------------------------- | ------ | ---------- |
| uri <div className="label basic required">Required</div> | string | 图像的位置 |

---

### `getSizeWithHeaders()`

```tsx
static getSizeWithHeaders(
  uri: string,
  headers: {[index: string]: string}
): Promise<{width: number, height: number}>;
```

在显示图像之前获取其宽度和高度（以像素为单位），并支持为请求提供标头。如果找不到图像或下载失败，此方法可能会失败。它也不适用于静态图像资源

为了获取图像尺寸，可能需要先加载或下载图像，之后图像会被缓存。这意味着原则上你可以使用此方法预加载图像，但它并未针对这一用途进行优化，未来可能会以不完全加载／下载图像数据的方式实现。后续将提供一种正式且受支持的图像预加载方式，作为单独的 API

**参数：**

| <div className="wideColumn">名称</div>                       | 类型   | 描述       |
| ------------------------------------------------------------ | ------ | ---------- |
| uri <div className="label basic required">Required</div>     | string | 图像的位置 |
| headers <div className="label basic required">Required</div> | object | 请求的标头 |

---

### `prefetch()`

```tsx
await Image.prefetch(url);
```

通过将远程图像下载到磁盘缓存中，为之后使用进行预取。返回一个解析为布尔值的 promise

**参数：**

| 名称                                                     | 类型                                                  | 描述                          |
| -------------------------------------------------------- | ----------------------------------------------------- | ----------------------------- |
| url <div className="label basic required">Required</div> | string                                                | 图像的远程位置                |
| callback                                                 | function <div className="label android">Android</div> | 将使用 `requestId` 调用的函数 |

---

### `queryCache()`

```tsx
static queryCache(
  urls: string[],
): Promise<Record<string, 'memory' | 'disk' | 'disk/memory'>>;
```

执行缓存查询。返回一个 promise，该 promise 解析为从 URL 到缓存状态的映射，例如“disk”、“memory”或“disk/memory”。如果请求的 URL 不在映射中，则表示它不在缓存中

**参数：**

| 名称                                                      | 类型  | 描述                      |
| --------------------------------------------------------- | ----- | ------------------------- |
| urls <div className="label basic required">Required</div> | array | 要检查缓存的图像 URL 列表 |

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

将资源引用解析为一个对象，该对象具有 `uri`、`scale`、`width` 和 `height` 属性

**参数：**

| <div className="wideColumn">名称</div>                      | 类型                                     | 描述                                                                   |
| ----------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| source <div className="label basic required">Required</div> | [ImageSource](image#imagesource)、number | 一个数字（由 `require('./foo.png')` 返回的 opaque type）或 ImageSource |

## 类型定义

### ImageCacheEnum <div className="label ios">iOS</div>

可用于设置潜在缓存响应的缓存处理方式或策略的枚举

| 类型                                                               | 默认值      |
| ------------------------------------------------------------------ | ----------- |
| enum(`'default'`, `'reload'`, `'force-cache'`, `'only-if-cached'`) | `'default'` |

- `default`：使用原生平台的默认策略
- `reload`：URL 的数据将从原始源加载。不应使用现有缓存数据来满足 URL 加载请求
- `force-cache`：无论现有缓存数据的期限或过期日期如何，都会使用现有缓存数据来满足请求。如果缓存中没有与该请求对应的现有数据，则从原始源加载数据
- `only-if-cached`：无论现有缓存数据的期限或过期日期如何，都会使用现有缓存数据来满足请求。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从原始源加载数据，并将此次加载视为失败

### ImageLoadEvent

`onLoad` 回调中返回的对象

| 类型   |
| ------ |
| object |

**属性：**

| 名称   | 类型   | 描述                            |
| ------ | ------ | ------------------------------- |
| source | object | [source object](#source-object) |

#### Source Object

**属性：**

| 名称   | 类型   | 描述                       |
| ------ | ------ | -------------------------- |
| width  | number | 已加载图像的宽度           |
| height | number | 已加载图像的高度           |
| uri    | string | 表示图像资源标识符的字符串 |

### ImageSource

| 类型                     |
| ------------------------ |
| object、对象数组、number |

**属性（作为对象或对象数组传递时）：**

| <div className="wideColumn">名称</div>     | 类型                                       | 描述                                                                                                                      |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| uri                                        | string                                     | 表示图像资源标识符的字符串，可以是 http 地址、本地文件路径或静态图像资源的名称                                            |
| width                                      | number                                     | 如果在构建时已知，则可以指定此值，此时该值将用于设置默认 `<Image/>` 组件尺寸                                              |
| height                                     | number                                     | 如果在构建时已知，则可以指定此值，此时该值将用于设置默认 `<Image/>` 组件尺寸                                              |
| scale                                      | number                                     | 用于表示图像的缩放因子。如果未指定，则默认为 `1.0`，表示一个图像像素对应一个显示点／DIP                                   |
| bundle<div className="label ios">iOS</div> | string                                     | 包含图像的 iOS 资源包。如果未设置，则默认为 `[NSBundle mainBundle]`                                                       |
| method                                     | string                                     | 要使用的 HTTP Method。如果未指定，则默认为 `'GET'`                                                                        |
| headers                                    | object                                     | 表示随远程图像请求一起发送的 HTTP 标头的对象                                                                              |
| body                                       | string                                     | 随请求发送的 HTTP body。必须是有效的 UTF-8 字符串，并且会完全按照指定内容发送，不会应用额外编码（例如 URL 转义或 base64） |
| cache<div className="label ios">iOS</div>  | [ImageCacheEnum](image#imagecacheenum-ios) | 决定请求如何处理潜在的缓存响应                                                                                            |

**传递数字时：**

- `number`——类似 `require('./image.jpg')` 返回的 opaque type
