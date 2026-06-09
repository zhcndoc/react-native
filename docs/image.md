---
id: image
title: 图片
---

用于显示不同类型图片的 React 组件，包括网络图片、静态资源、临时本地图片以及来自本地磁盘的图片，例如相机胶卷中的图片。

此示例展示了如何从本地存储中获取并显示图片，以及来自网络的图片，甚至是通过 `'data:'` URI scheme 提供的数据图片。

:::note
对于网络图片和数据图片，你需要手动指定图片的尺寸！
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

你也可以为图片添加 `style`：

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

在构建自己的原生代码时，Android 默认不支持 GIF 和 WebP。

你需要根据应用需求，在 `android/app/build.gradle` 中添加一些可选模块。

```groovy
dependencies {
  // 如果你的应用支持 Ice Cream Sandwich 之前的 Android 版本（API level 14）
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // 用于支持动画 GIF
  implementation 'com.facebook.fresco:animated-gif:3.6.0'

  // 用于支持 WebP，包括动画 WebP
  implementation 'com.facebook.fresco:animated-webp:3.6.0'
  implementation 'com.facebook.fresco:webpsupport:3.6.0'

  // 用于支持 WebP，但不包含动画
  implementation 'com.facebook.fresco:webpsupport:3.6.0'
}
```

:::note
上面列出的版本可能不会及时更新。请查看主仓库中的 [`packages/react-native/gradle/libs.versions.toml`](https://github.com/facebook/react-native/blob/main/packages/react-native/gradle/libs.versions.toml)，以了解在某个特定标签版本中使用的是哪个 fresco 版本。
:::

---

# 参考

## 属性

### [View Props](view.md#props)

继承 [View Props](view#props)。

---

### `accessible`

当为 true 时，表示该图片是一个无障碍元素。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `accessibilityLabel`

当用户与图片交互时，屏幕阅读器朗读的文本。

| Type   |
| ------ |
| string |

---

### `alt`

定义图片替代文本描述的字符串，当用户与其交互时会被屏幕阅读器朗读。使用此属性会自动将该元素标记为可访问。

| Type   |
| ------ |
| string |

---

### `blurRadius`

blurRadius：添加到图片上的模糊滤镜的模糊半径。

| Type   |
| ------ |
| number |

:::tip
在 iOS 上，你需要将 `blurRadius` 增加到大于 `5`。
:::

---

### `capInsets` <div className="label ios">iOS</div>

当图片被调整大小时，`capInsets` 指定的区域四角会保持固定大小，但图片的中心内容和边框会被拉伸。这对于创建可拉伸的圆角按钮、阴影和其他可拉伸资源很有用。更多信息请参见 [Apple 官方文档](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets)。

| Type         |
| ------------ |
| [Rect](rect) |

---

### `crossOrigin`

一个指定在获取图片资源时使用的 CORS 模式的关键字字符串。其工作方式类似于 HTML 中的 crossorigin 属性。

- `anonymous`：图片请求中不交换用户凭据。
- `use-credentials`：在图片请求中将 `Access-Control-Allow-Credentials` 头的值设为 `true`。

| Type                                     | Default       |
| ---------------------------------------- | ------------- |
| enum(`'anonymous'`, `'use-credentials'`) | `'anonymous'` |

---

### `defaultSource`

在图片源加载期间显示的静态图片。

| Type                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

:::note
在 Android 上，debug 构建会忽略 `defaultSource` 属性。
:::

---

### `fadeDuration` <div className="label android">Android</div>

淡入动画持续时间，单位为毫秒。

| Type   | Default |
| ------ | ------- |
| number | `300`   |

---

### `height`

图片组件的高度。

| Type   |
| ------ |
| number |

---

### `loadingIndicatorSource`

与 `source` 类似，该属性表示用于渲染图片加载指示器的资源。加载指示器会一直显示，直到图片准备好显示，通常是在图片下载完成后。

| Type                                                  |
| ----------------------------------------------------- |
| [ImageSource](image#imagesource) (`uri` only), number |

---

### `onError`

加载错误时调用。

| Type                                |
| ----------------------------------- |
| (`{nativeEvent: {error} }`) => void |

---

### `onLayout`

在挂载时以及布局变化时调用。

| Type                                                    |
| ------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)} => void` |

---

### `onLoad`

当加载成功完成时调用。

**示例：** `onLoad={({nativeEvent: {source: {width, height}}}) => setImageRealSize({width, height})}`

| Type                                                                |
| ------------------------------------------------------------------- |
| `md ({nativeEvent: [ImageLoadEvent](image#imageloadevent)} => void` |

---

### `onLoadEnd`

在加载成功或失败时调用。

| Type       |
| ---------- |
| () => void |

---

### `onLoadStart`

在加载开始时调用。

**示例：** `onLoadStart={() => this.setState({loading: true})}`

| Type       |
| ---------- |
| () => void |

---

### `onPartialLoad` <div className="label ios">iOS</div>

当图片的部分加载完成时调用。关于什么构成“部分加载”的定义取决于加载器本身，但这里主要用于渐进式 JPEG 加载。

| Type       |
| ---------- |
| () => void |

---

### `onProgress`

在下载进度更新时调用。

| Type                                        |
| ------------------------------------------- |
| (`{nativeEvent: {loaded, total} }`) => void |

---

### `progressiveRenderingEnabled` <div className="label android">Android</div>

当为 `true` 时，启用渐进式 jpeg 流式加载 - https://frescolib.org/docs/progressive-jpegs。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `referrerPolicy`

一个字符串，指明在获取资源时应使用哪个 referrer。会将该值设置到图片请求中的 `Referrer-Policy` 头。其工作方式类似于 HTML 中的 `referrerpolicy` 属性。

| Type                                                                                                                                                                                     | Default                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| enum(`'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`) | `'strict-origin-when-cross-origin'` |

---

### `ref`

一个 ref setter，在挂载时会被分配一个 [element node](element-nodes)。

---

### `resizeMethod` <div className="label android">Android</div>

当图片尺寸与图片视图尺寸不同时，用于调整图片大小的机制。默认值为 `auto`。

- `auto`：使用启发式方法在 `resize` 和 `scale` 之间选择。

- `resize`：一种软件操作，会在图片解码前先在内存中修改编码后的图片。当图片远大于视图时，应使用它代替 `scale`。

- `scale`：图片会按缩小或放大后进行绘制。与 `resize` 相比，`scale` 更快（通常由硬件加速）并产生更高质量的图片。当图片小于视图时应使用它。如果图片略大于视图，也应使用它。

- `none`：不进行采样，并以完整分辨率显示图片。这只应在极少数情况下使用，因为它被视为不安全，Android 在渲染占用过多内存的图片时会抛出运行时异常。

关于 `resize` 和 `scale` 的更多细节可参考 https://frescolib.org/docs/resizing。

| Type                                            | Default  |
| ----------------------------------------------- | -------- |
| enum(`'auto'`, `'resize'`, `'scale'`, `'none'`) | `'auto'` |

---

### `resizeMode`

决定当容器与原始图片尺寸不匹配时如何调整图片大小。默认值为 `cover`。

- `cover`：按比例缩放图片（保持图片纵横比），使得
  - 图片的两个维度（宽和高）都大于或等于视图对应的维度（减去内边距）
  - 缩放后图片至少有一个维度等于视图对应的维度（减去内边距）

- `contain`：按比例缩放图片（保持图片纵横比），使得图片的两个维度（宽和高）都小于或等于视图对应的维度（减去内边距）。

- `stretch`：独立缩放宽度和高度，这可能会改变 src 的纵横比。

- `repeat`：重复图片以覆盖视图的整个区域。图片会保持其尺寸和纵横比，除非它大于视图；在这种情况下，它会按比例缩小以适配视图。

- `center`：将图片在视图中沿两个维度居中。如果图片大于视图，则按比例缩小以适配视图。

| Type                                                              | Default   |
| ----------------------------------------------------------------- | --------- |
| enum(`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `resizeMultiplier` <div className="label android">Android</div>

当 `resizeMethod` 设置为 `resize` 时，目标尺寸会乘以此值。随后使用 `scale` 方法完成剩余的缩放。默认值 `1.0` 表示位图大小被设计为适配目标尺寸。大于 `1.0` 的倍率会将调整大小的选项设定得比目标尺寸更大，最终生成的位图将从硬件尺寸缩小。

当目标尺寸较小而源图片显著更大时，此属性最有用。`resize` 调整大小方法会进行降采样，并且源图片与目标图片尺寸之间会丢失大量图像质量，通常会导致图片模糊。通过使用倍率，解码后的图片会略大于目标尺寸，但仍小于源图片（如果源图片足够大）。这允许锯齿伪影通过对放大后的图片进行缩放操作来产生一种伪高质量效果。

如果你的源图片尺寸为 200x200，而目标尺寸为 24x24，`resizeMultiplier` 设为 `2.0` 会告诉 Fresco 将图片降采样到 48x48。Fresco 会选择最接近的 2 的幂（即 50x50），并将图片解码为该大小的位图。如果没有倍率参数，最接近的 2 的幂将是 25x25。最终图片会由系统进行缩小。

| Type   | Default |
| ------ | ------- |
| number | `1.0`   |

---

### `source`

图片源（可以是远程 URL 或本地文件资源）。

此属性也可以包含多个远程 URL，并与它们的宽高以及可能的 scale/其他 URI 参数一起指定。原生端随后会根据图片容器的测量大小选择最佳的 `uri` 来显示。可以添加 `cache` 属性来控制网络请求与本地缓存的交互方式。（更多信息请参见 [图片缓存控制](images#cache-control)）。

当前支持的格式有 `png`、`jpg`、`jpeg`、`bmp`、`gif`、`webp`、`psd`（仅 iOS）。此外，iOS 还支持若干 RAW 图片格式。有关当前支持的相机型号列表，请参见 Apple 的文档（iOS 12 版本请见 https://support.apple.com/en-ca/HT208967）。

请注意，`webp` 格式在 iOS 上**仅在与 JavaScript 代码一起打包时**受支持。

| Type                             |
| -------------------------------- |
| [ImageSource](image#imagesource) |

---

### `src`

表示图片远程 URL 的字符串。此属性的优先级高于 `source` 属性。

**示例：** `src={'https://reactnative.dev/img/tiny_logo.png'}`

| Type   |
| ------ |
| string |

---

### `srcSet`

表示用逗号分隔的候选图片源列表的字符串。每个图片源都包含一个图片 URL 和一个像素密度描述符。如果未指定描述符，则默认为 `1x` 描述符。

如果 `srcSet` 不包含 `1x` 描述符，则会将 `src` 中的值作为带有 `1x` 描述符的图片源使用（如果提供了的话）。

此属性的优先级高于 `src` 和 `source` 两个属性。

**示例：** `srcSet={'https://reactnative.dev/img/tiny_logo.png 1x, https://reactnative.dev/img/header_logo.svg 2x'}`

| Type   |
| ------ |
| string |

---

### `style`

| Type                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Image Style Props](image-style-props#props), [Layout Props](layout-props#props), [Shadow Props](shadow-props#props), [Transforms](transforms#props) |

---

### `testID`

用于 UI 自动化测试脚本中的该元素唯一标识符。

| Type   |
| ------ |
| string |

---

### `tintColor`

将所有不透明像素的颜色更改为 `tintColor`。

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `width`

图片组件的宽度。

| Type   |
| ------ |
| number |

## 方法

### `abortPrefetch()` <div className="label android">Android</div>

```tsx
static abortPrefetch(requestId: number);
```

中止预取请求。

**参数：**

| 名称                                                           | 类型   | 描述                             |
| -------------------------------------------------------------- | ------ | -------------------------------- |
| requestId <div className="label basic required">必需</div> | number | 由 `prefetch()` 返回的请求 ID。 |

---

### `getSize()`

```tsx
static getSize(uri: string): Promise<{width: number, height: number}>;
```

在显示之前获取图像的宽度和高度（以像素为单位）。如果找不到图像，或者下载失败，此方法可能会失败。

为了获取图像尺寸，可能需要先加载或下载该图像，之后它会被缓存。这意味着原则上你可以使用此方法来预加载图像，但它并不是为此目的而优化的，并且将来可能会以一种不会完整加载/下载图像数据的方式实现。一个适当且受支持的图像预加载方式将作为单独的 API 提供。

**参数：**

| <div className="wideColumn">名称</div>                   | 类型   | 描述                |
| -------------------------------------------------------- | ------ | ------------------- |
| uri <div className="label basic required">必需</div> | string | 图像的位置。 |

---

### `getSizeWithHeaders()`

```tsx
static getSizeWithHeaders(
  uri: string,
  headers: {[index: string]: string}
): Promise<{width: number, height: number}>;
```

在显示之前获取图像的宽度和高度（以像素为单位），并且可以为请求提供 headers。如果找不到图像，或者下载失败，此方法可能会失败。它也不适用于静态图像资源。

为了获取图像尺寸，可能需要先加载或下载该图像，之后它会被缓存。这意味着原则上你可以使用此方法来预加载图像，但它并不是为此目的而优化的，并且将来可能会以一种不会完整加载/下载图像数据的方式实现。一个适当且受支持的图像预加载方式将作为单独的 API 提供。

**参数：**

| <div className="wideColumn">名称</div>                       | 类型   | 描述                  |
| ------------------------------------------------------------ | ------ | -------------------- |
| uri <div className="label basic required">必需</div>     | string | 图像的位置。   |
| headers <div className="label basic required">必需</div> | object | 请求的 headers。 |

---

### `prefetch()`

```tsx
await Image.prefetch(url);
```

通过将远程图像下载到磁盘缓存中，为以后使用预取该图像。返回一个解析为布尔值的 promise。

**参数：**

| 名称                                                     | 类型                                                  | 描述                                            |
| -------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| url <div className="label basic required">必需</div> | string                                                | 图像的远程位置。                      |
| callback                                                 | function <div className="label android">Android</div> | 将使用 `requestId` 调用的函数。 |

---

### `queryCache()`

```tsx
static queryCache(
  urls: string[],
): Promise<Record<string, 'memory' | 'disk' | 'disk/memory'>>;
```

执行缓存查询。返回一个 promise，该 promise 会解析为从 URL 到缓存状态的映射，例如 `"disk"`、`"memory"` 或 `"disk/memory"`。如果某个请求的 URL 不在映射中，则表示它不在缓存中。

**参数：**

| 名称                                                      | 类型  | 描述                                |
| --------------------------------------------------------- | ----- | ----------------------------------- |
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

将资源引用解析为一个具有 `uri`、`scale`、`width` 和 `height` 属性的对象。

**参数：**

| <div className="wideColumn">名称</div>                      | 类型                                     | 描述                                                                  |
| ----------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| source <div className="label basic required">必需</div> | [ImageSource](image#imagesource), number | 一个数字（由 `require('./foo.png')` 返回的不透明类型）或一个 ImageSource。 |

## 类型定义

### ImageCacheEnum <div className="label ios">iOS</div>

可用于为可能被缓存的响应设置缓存处理或策略的枚举。

| Type                                                               | Default     |
| ------------------------------------------------------------------ | ----------- |
| enum(`'default'`, `'reload'`, `'force-cache'`, `'only-if-cached'`) | `'default'` |

- `default`：使用原生平台的默认策略。
- `reload`：该 URL 的数据将从源头加载。不得使用任何现有缓存数据来满足 URL 加载请求。
- `force-cache`：现有缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与该请求对应的现有数据，则会从源头加载数据。
- `only-if-cached`：现有缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与某个 URL 加载请求对应的现有数据，则不会尝试从源头加载数据，且该加载将被视为失败。

### ImageLoadEvent

`onLoad` 回调中返回的对象。

| Type   |
| ------ |
| object |

**属性：**

| 名称   | 类型   | 描述                         |
| ------ | ------ | ---------------------------- |
| source | object | [source object](#source-object) |

#### Source Object

**属性：**

| 名称   | 类型   | 描述                                                  |
| ------ | ------ | ----------------------------------------------------- |
| width  | number | 已加载图像的宽度。                                   |
| height | number | 已加载图像的高度。                                  |
| uri    | string | 表示该图像资源标识符的字符串。 |

### ImageSource

| Type                             |
| -------------------------------- |
| object, array of objects, number |

**属性（如果作为对象或对象数组传入）：**

| <div className="wideColumn">名称</div>     | Type                                       | 描述                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| uri                                        | string                                     | 表示图像资源标识符的字符串，它可以是一个 http 地址、本地文件路径，或静态图像资源的名称。                              |
| width                                      | number                                     | 如果在构建时已知，可以指定该值，此时它将用于设置默认的 `<Image/>` 组件尺寸。                                                     |
| height                                     | number                                     | 如果在构建时已知，可以指定该值，此时它将用于设置默认的 `<Image/>` 组件尺寸。                                                     |
| scale                                      | number                                     | 用于指示图像的缩放因子。若未指定，默认为 `1.0`，表示一个图像像素等于一个显示点 / DIP。                                   |
| bundle<div className="label ios">iOS</div> | string                                     | 图像所包含的 iOS 资源包。若未设置，默认为 `[NSBundle mainBundle]`。                                                                        |
| method                                     | string                                     | 要使用的 HTTP 方法。若未指定，默认为 `'GET'`。                                                                                                                        |
| headers                                    | object                                     | 表示要随远程图像请求一起发送的 HTTP headers 的对象。                                                                                           |
| body                                       | string                                     | 要随请求发送的 HTTP body。它必须是有效的 UTF-8 字符串，并会严格按指定内容发送，不会应用额外编码（例如 URL 转义或 base64）。 |
| cache<div className="label ios">iOS</div>  | [ImageCacheEnum](image#imagecacheenum-ios) | 决定请求如何处理可能被缓存的响应。                                                                                                                    |

**如果传入数字：**

- `number` - 由类似 `require('./image.jpg')` 的方式返回的不透明类型。
