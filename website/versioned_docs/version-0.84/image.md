---
id: image
title: 图片
---

一个用于显示不同类型图片的 React 组件，包括网络图片、静态资源、临时本地图片和本地磁盘上的图片，例如相机胶卷。

此示例展示了如何从本地存储获取并显示图片，以及从网络和 `'data:'` URI 方案中提供的数据中显示图片。

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

当你构建自己的原生代码时，Android 默认不支持 GIF 和 WebP。

你需要根据应用需求，在 `android/app/build.gradle` 中添加一些可选模块。

```groovy
dependencies {
  // 如果你的应用支持 Ice Cream Sandwich 之前版本的 Android（API 级别 14）
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // 支持动画 GIF
  implementation 'com.facebook.fresco:animated-gif:3.6.0'

  // 支持 WebP，包括动画 WebP
  implementation 'com.facebook.fresco:animated-webp:3.6.0'
  implementation 'com.facebook.fresco:webpsupport:3.6.0'

  // 支持不带动画的 WebP
  implementation 'com.facebook.fresco:webpsupport:3.6.0'
}
```

:::note
上述版本可能不会及时更新。请查看主仓库中的 [`packages/react-native/gradle/libs.versions.toml`](https://github.com/facebook/react-native/blob/main/packages/react-native/gradle/libs.versions.toml) 以确认特定标签版本中使用的 fresco 版本。
:::

---

# 参考

## 属性

### [View 属性](view.md#props)

继承自 [View 属性](view#props)。

---

### `accessible`

当为 true 时，表示该图片是一个无障碍元素。

| 类型   | 默认值  |
| ------ | ------- |
| bool   | `false` |

---

### `accessibilityLabel`

当用户与图片交互时，屏幕阅读器朗读的文本。

| 类型   |
| ------ |
| string |

---

### `alt`

定义图片的替代文字描述的字符串，当用户与图片交互时屏幕阅读器会朗读此内容。使用该属性会自动将该元素标记为可访问。

| 类型   |
| ------ |
| string |

---

### `blurRadius`

给图片添加的模糊滤镜的模糊半径。

| 类型   |
| ------ |
| number |

:::tip
在 iOS 上，`blurRadius` 需要设置大于 5 才能生效。
:::

---

### `capInsets` <div className="label ios">iOS</div>

当图片被调整大小时，`capInsets` 指定的尺寸的角保持固定大小，但图片的中央内容和边界会被拉伸。这对于创建可调整大小的圆角按钮、阴影和其他可调整大小的资源很有用。更多信息请参考 [苹果官方文档](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets)。

| 类型         |
| ------------ |
| [Rect](rect) |

---

### `crossOrigin`

指定请求图片资源时使用的 CORS 模式的关键字字符串。其作用类似于 HTML 中的 crossorigin 属性。

- `anonymous`：图片请求中不交换用户凭证。
- `use-credentials`：在图片请求中设置 `Access-Control-Allow-Credentials` 头为 `true`。

| 类型                                    | 默认值        |
| ------------------------------------- | ------------ |
| enum(`'anonymous'`, `'use-credentials'`) | `'anonymous'` |

---

### `defaultSource`

加载图片时显示的静态图片。

| 类型                    |
| ----------------------- |
| [ImageSource](image#imagesource) |

:::note
在 Android 的调试构建中，`defaultSource` 属性会被忽略。
:::

---

### `fadeDuration` <div className="label android">Android</div>

淡入动画的持续时间，单位为毫秒。

| 类型   | 默认值  |
| ------ | ------- |
| number | `300`   |

---

### `height`

图片组件的高度。

| 类型   |
| ------ |
| number |

---

### `loadingIndicatorSource`

与 `source` 类似，该属性表示用于渲染加载指示器的资源。加载指示器会显示直到图片准备显示，通常是在图片下载完成后。

| 类型                                                      |
| --------------------------------------------------------- |
| [ImageSource](image#imagesource) （仅支持 `uri`），数字  |

---

### `onError`

加载出错时调用的回调。

| 类型                              |
| --------------------------------- |
| (`{nativeEvent: {error}}`) => void |

---

### `onLayout`

组件挂载和布局变化时调用。

| 类型                                      |
| ----------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLoad`

图片加载成功时调用。

**示例：** `onLoad={({nativeEvent: {source: {width, height}}}) => setImageRealSize({width, height})}`

| 类型                                              |
| ------------------------------------------------- |
| `md ({nativeEvent: [ImageLoadEvent](image#imageloadevent)}) => void` |

---

### `onLoadEnd`

加载成功或失败后调用。

| 类型     |
| -------- |
| () => void |

---

### `onLoadStart`

开始加载时调用。

**示例：** `onLoadStart={() => this.setState({loading: true})}`

| 类型     |
| -------- |
| () => void |

---

### `onPartialLoad` <div className="label ios">iOS</div>

部分加载完成时调用。什么算“部分加载”依赖于加载器，通常用于渐进式 JPEG 加载。

| 类型     |
| -------- |
| () => void |

---

### `onProgress`

下载进度时调用。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {loaded, total}}`) => void |

---

### `progressiveRenderingEnabled` <div className="label android">Android</div>

为 true 时启用渐进式 JPEG 流式加载 - https://frescolib.org/docs/progressive-jpegs。

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `referrerPolicy`

获取资源时使用的引用策略字符串。设置图片请求中 `Referrer-Policy` 头的值。其作用类似于 HTML 中的 `referrerpolicy` 属性。

| 类型                                                                                                                                            | 默认值                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| enum(`'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`) | `'strict-origin-when-cross-origin'` |

---

### `ref`

挂载时分配给元素节点的 ref 设置函数。

---

### `resizeMethod` <div className="label android">Android</div>

当图片尺寸与视图尺寸不同时，用于调整图片尺寸的机制。默认值为 `auto`。

- `auto`：使用启发式规则，自动在 `resize` 和 `scale` 之间选择。
- `resize`：一种修改内存中编码图片的软件操作，在图片解码前调整尺寸。当图片远大于视图时应使用该方法。
- `scale`：图片被绘制时缩放。相比 `resize`，`scale` 更快（通常有硬件加速）且产出更高质量图片。图片小于视图时应使用该方法。稍大于视图也应使用该方法。
- `none`：不进行采样，图片以全分辨率显示。仅在极少数情况下使用，因为 Android 在渲染占用过多内存的图片时会抛出运行时异常。

有关 `resize` 和 `scale` 的更多细节，请参见 https://frescolib.org/docs/resizing。

| 类型                                        | 默认值   |
| ------------------------------------------- | -------- |
| enum(`'auto'`, `'resize'`, `'scale'`, `'none'`) | `'auto'` |

---

### `resizeMode`

当图片框架尺寸与原始图片尺寸不匹配时，如何调整图片大小。默认值为 `cover`。

- `cover`：保持图片纵横比均匀缩放，使得图片的宽高都不小于视图相应尺寸（减去内边距），且至少有一个边长与视图对应尺寸相等。
- `contain`：保持图片纵横比均匀缩放，使得图片宽高都不大于视图相应尺寸（减去内边距）。
- `stretch`：独立缩放宽和高，可能改变图片的纵横比。
- `repeat`：重复图片覆盖视图框架。图片保持大小和纵横比，除非比视图大，则均匀缩小以适应。
- `center`：图片在视图内居中显示，若图片大于视图，则均匀缩小至适应视图范围。

| 类型                                                           | 默认值    |
| -------------------------------------------------------------- | --------- |
| enum(`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `resizeMultiplier` <div className="label android">Android</div>

当 `resizeMethod` 设置为 `resize` 时，目标尺寸会乘以该值。系统会使用 `scale` 方法完成剩余的缩放。默认值 `1.0` 表示位图大小设计与目标尺寸一致。大于`1.0` 的倍数意味着 resize 选项比目标尺寸大，生成的位图将从硬件尺寸缩小。默认 `1.0`。

该属性在目标尺寸较小且源图较大时最为有效。`resize` 方法执行下采样，会在源图与目标尺寸间丢失较多质量，导致模糊图像。通过使用倍数，解码图比目标尺寸稍大但比源图小（如果源图够大），缩放操作产生伪质量，通过抗锯齿伪装成更佳质量。

举例来说，若源图是 200x200，目标是 24x24，`resizeMultiplier` 设置为 `2.0` 会让 Fresco 下采样到 48x48。Fresco 会选取最接近的 2 的幂次方（即 50x50）解码为位图。没有倍数则是 25x25，最后图像会被系统缩小。

| 类型   | 默认值  |
| ------ | ------- |
| number | `1.0`   |

---

### `source`

图片资源（可以是远程 URL 或本地文件资源）。

此属性也可包含多个远程 URL，配合其宽高以及可能的缩放/其他 URI 参数。原生端将根据图片容器的实际尺寸选择最合适的 `uri` 显示。可以添加 `cache` 属性控制网络请求与本地缓存的交互。（详见 [图片缓存控制](images#cache-control)）

当前支持的格式有 `png`、`jpg`、`jpeg`、`bmp`、`gif`、`webp`、`psd`（仅 iOS）。此外 iOS 支持多种 RAW 图片格式。具体支持列表请参考苹果官方文档（如 iOS 12 见 https://support.apple.com/en-ca/HT208967）。

注意：`webp` 格式仅在 iOS 上随 JavaScript 代码捆绑时支持。

| 类型                          |
| ----------------------------- |
| [ImageSource](image#imagesource) |

---

### `src`

代表远程图片 URL 的字符串。该属性优先于 `source`。

**示例：** `src={'https://reactnative.dev/img/tiny_logo.png'}`

| 类型   |
| ------ |
| string |

---

### `srcSet`

表示可能的图片资源候选的逗号分隔字符串。每个资源包含图片 URL 和像素密度说明符，如果未指定说明符，默认使用 `1x`。

如果 `srcSet` 没有 `1x` 说明符，`src` 中的值会用作有 `1x` 说明符的图片资源（如果提供）。

该属性优先于 `src` 和 `source`。

**示例：** `srcSet={'https://reactnative.dev/img/tiny_logo.png 1x, https://reactnative.dev/img/header_logo.svg 2x'}`

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [图片样式属性](image-style-props#props)、[布局属性](layout-props#props)、[阴影属性](shadow-props#props)、[变换](transforms#props) |

---

### `testID`

用于 UI 自动化测试脚本的唯一标识字符串。

| 类型   |
| ------ |
| string |

---

### `tintColor`

将所有非透明像素的颜色更改为指定的 `tintColor`。

| 类型        |
| ----------- |
| [颜色](colors.md) |

---

### `width`

图片组件的宽度。

| 类型   |
| ------ |
| number |

## 方法

### `abortPrefetch()` <div className="label android">Android</div>

```tsx
static abortPrefetch(requestId: number);
```

中止预取请求。

**参数：**

| 名称                                                         | 类型   | 描述                                            |
| ------------------------------------------------------------ | ------ | ------------------------------------------------ |
| requestId <div className="label basic required">必填</div> | number | 由 `prefetch()` 返回的请求 ID。                   |

---

### `getSize()`

```tsx
static getSize(uri: string): Promise<{width: number, height: number}>;
```

获取图片显示前的宽和高（像素）。如果图片找不到或下载失败，该方法会失败。

为了获取图片尺寸，图片可能需要先加载或下载，之后会被缓存。因此理论上可以用此方法预加载图片，但它不是专门为此优化，将来可能会改为不完全加载/下载图片数据。正确且受支持的预加载方法将提供另一接口。

**参数：**

| 名称                                                       | 类型   | 描述          |
| ---------------------------------------------------------- | ------ | -------------- |
| uri <div className="label basic required">必填</div>      | string | 图片位置      |

---

### `getSizeWithHeaders()`

```tsx
static getSizeWithHeaders(
  uri: string,
  headers: {[index: string]: string}
): Promise<{width: number, height: number}>;
```

带请求头参数的图片尺寸获取方法。也可能失败，且不适用于静态图片资源。

同样，图片可能需要先加载或下载后缓存。与 `getSize()` 一样，理论可用来预加载，但非专门优化。

**参数：**

| 名称                                                       | 类型                    | 描述          |
| ---------------------------------------------------------- | ----------------------- | -------------- |
| uri <div className="label basic required">必填</div>      | string                  | 图片位置      |
| headers <div className="label basic required">必填</div>  | object                  | 请求头参数    |

---

### `prefetch()`

```tsx
await Image.prefetch(url);
```

预取远程图片以便后续使用，将其下载到磁盘缓存。返回一个 promise，解析为布尔值。

**参数：**

| 名称                                                         | 类型                                                   | 描述                                     |
| ------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| url <div className="label basic required">必填</div>        | string                                                 | 远程图片地址                             |
| callback                                                     | function <div className="label android">Android</div> | 将会被调用并传入 `requestId` 的函数    |

---

### `queryCache()`

```tsx
static queryCache(
  urls: string[],
): Promise<Record<string, 'memory' | 'disk' | 'disk/memory'>>;
```

查询缓存状态。返回一个 promise，解析为 URL 到缓存状态的映射，比如 "disk"、"memory" 或 "disk/memory"。如果映射中没有请求的 URL，表示该 URL 未缓存。

**参数：**

| 名称                                                         | 类型   | 描述                     |
| ------------------------------------------------------------ | ------ | ------------------------ |
| urls <div className="label basic required">必填</div>      | array  | 要检查缓存的图片 URL 列表 |

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

将资源引用解析为包含 `uri`、`scale`、`width` 和 `height` 属性的对象。

**参数：**

| 名称                                                         | 类型                       | 描述                                              |
| ------------------------------------------------------------ | -------------------------- | ------------------------------------------------- |
| source <div className="label basic required">必填</div>      | [ImageSource](image#imagesource), number | 一个数字（由 `require('./foo.png')` 返回的不透明类型）或 ImageSource |

## 类型定义

### ImageCacheEnum <div className="label ios">iOS</div>

枚举，用于设置可能缓存响应的缓存处理或策略。

| 类型                                                               | 默认值       |
| ------------------------------------------------------------------ | ------------ |
| enum(`'default'`, `'reload'`, `'force-cache'`, `'only-if-cached'`) | `'default'`  |

- `default`：使用原生平台默认策略。
- `reload`：从原始源加载 URL 数据。不使用任何已有缓存数据。
- `force-cache`：无视缓存的日期或过期，使用已有缓存数据。如果没有缓存，则从原始源加载。
- `only-if-cached`：无视缓存的日期或过期，使用已有缓存数据。如果没有对应缓存，不从原始源加载，加载视为失败。

### ImageLoadEvent

`onLoad` 回调中返回的对象。

| 类型   |
| ------ |
| object |

**属性：**

| 名称     | 类型   | 描述                       |
| -------- | ------ | -------------------------- |
| source   | object | [source 对象](#source-object) |

#### source 对象

**属性：**

| 名称   | 类型   | 描述                          |
| ------ | ------ | ----------------------------- |
| width  | number | 加载图片的宽度                |
| height | number | 加载图片的高度                |
| uri    | string | 图片的资源标识字符串          |

### ImageSource

| 类型                     |
| ------------------------ |
| object，数组对象，number |

**作为对象或对象数组传递时的属性：**

| 名称                               | 类型                                      | 描述                                                                                                                            |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| uri                                | string                                    | 图片资源的标识字符串，可以是 HTTP 地址、本地文件路径或静态图片资源名称                                                         |
| width                              | number                                    | 构建时已知时可指定，作为 `<Image/>` 组件默认尺寸                                                                              |
| height                             | number                                    | 构建时已知时可指定，作为 `<Image/>` 组件默认尺寸                                                                              |
| scale                             | number                                    | 图片的缩放因子。若未指定，默认为 `1.0`，即一个图像像素对应一个显示点 / DIP                                                   |
| bundle <div className="label ios">iOS</div>    | string                                    | 图片所在的 iOS 资产包，若未设置，默认为 `[NSBundle mainBundle]`                                                                |
| method                             | string                                    | 使用的 HTTP 方法。默认是 `'GET'`                                                                                              |
| headers                            | object                                    | 远程请求所带的 HTTP 头部对象                                                                                                  |
| body                               | string                                    | HTTP 请求的正文，必须是有效的 UTF-8 字符串，将按原样发送，不进行额外编码（如 URL 转义或 base64）                              |
| cache <div className="label ios">iOS</div>           | [ImageCacheEnum](image#imagecacheenum-ios) | 决定请求如何处理可能缓存的响应                                                                                                  |

**作为数字传递时：**

- `number` - 由 `require('./image.jpg')` 返回的不透明类型。