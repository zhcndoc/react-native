---
id: images
title: 图片
---

## 静态图片资源

React Native 为在 Android 和 iOS 应用中管理图片及其他媒体资源提供了一种统一的方式。要向应用添加一张静态图片，只需将其放在源码树中的某个位置，然后像这样引用它：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块的解析方式相同。在上面的示例中，打包器会在引用它的组件所在的同一文件夹中查找 `my-icon.png`。

你可以使用 `@2x` 和 `@3x` 后缀为不同屏幕密度提供图片。如果你的文件结构如下：

```
.
├── button.js
└── img
    ├── check.png
    ├── check@2x.png
    └── check@3x.png
```

并且 `button.js` 代码包含：

```tsx
<Image source={require('./img/check.png')} />
```

那么打包器会打包并提供与设备屏幕密度相对应的图片。例如，`check@2x.png` 会在 iPhone 7 上使用，而 `check@3x.png` 会在 iPhone 7 Plus 或 Nexus 5 上使用。如果没有与屏幕密度匹配的图片，将选择最接近的最佳选项。

在 Windows 上，如果你向项目中添加了新图片，可能需要重新启动打包器。

你会获得以下一些好处：

1. Android 和 iOS 使用相同的系统。
2. 图片与 JavaScript 代码位于同一文件夹中。组件是自包含的。
3. 没有全局命名空间，也就是说，你不必担心名称冲突。
4. 只有实际使用的图片才会被打包进应用。
5. 添加和修改图片不需要重新编译应用，你可以像平常一样刷新模拟器。
6. 打包器知道图片尺寸，无需在代码中重复声明。
7. 图片可以通过 [npm](https://www.npmjs.com/) 包分发。

要使其正常工作，`require` 中的图片名称必须在静态分析时可知。

```tsx
// 正确
<Image source={require('./my-icon.png')} />;

// 错误
const icon = this.props.active
  ? 'my-icon-active'
  : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />;

// 正确
const icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;
```

请注意，以这种方式 `require` 的图片源包含了供 Image 使用的尺寸（宽度、高度）信息。如果你需要动态缩放图片（例如通过 flex），可能需要在 style 属性上手动设置 `{width: undefined, height: undefined}`。

### 在资源目录中打包图片（iOS）

默认情况下，打包器会将每张必需的图片以及所有 `@2x` 和 `@3x` 变体作为独立文件复制到 iOS 应用中，并放置在 JavaScript 包旁边。在 iOS 上，你也可以将它们编译到[资源目录](https://developer.apple.com/documentation/xcode/managing-assets-with-asset-catalogs)中，这样系统只会随应用附带设备所需的图片比例。

要启用此功能，请在应用的 `Info.plist` 中将 `RCTUseAssetCatalog` 键设置为 `true`：

```xml
<key>RCTUseAssetCatalog</key>
<true/>
```

启用后，iOS 构建脚本会在构建时将打包的图片编译到 `RNAssets.bundle` 资源目录中。你的 `require('./my-icon.png')` 调用保持完全不变，也不需要对 Xcode 项目进行任何修改。

更改此设置后，请务必执行一次全量清理构建。

## 静态非图像资源

上面描述的 `require` 语法同样可以用于在项目中静态引入音频、视频或文档文件。它支持大多数常见文件类型，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html`、`.pdf` 等。完整列表请参见 [打包器默认配置](https://github.com/facebook/metro/blob/main/packages/metro-config/src/defaults/defaults.js#L16-L51)。

你可以通过在 [Metro 配置](https://metrobundler.dev/docs/configuration) 中添加 [`assetExts` 解析器选项](https://metrobundler.dev/docs/configuration#resolver-options) 来支持其他类型。

需要注意的是，视频必须使用绝对定位而不是 `flexGrow`，因为目前非图片资源不会传递尺寸信息。对于直接链接到 Xcode 或 Android 的资源文件夹中的视频，则不存在这个限制。

## 来自混合应用资源的图片

如果你正在构建一个混合应用（部分 UI 使用 React Native，部分 UI 使用平台代码），你仍然可以使用已经打包进应用的图片。

对于通过 Xcode asset catalog 或 Android drawable 文件夹包含的图片，请使用不带扩展名的图片名：

```tsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

对于 Android assets 文件夹中的图片，请使用 `asset:/` 协议：

```tsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

这些方式不提供任何安全检查。你需要自行保证这些图片在应用中可用。此外，你还必须手动指定图片尺寸。

## 网络图片

你在应用中展示的很多图片在编译时并不可用，或者你希望动态加载一些图片以减小二进制体积。与静态资源不同，_你需要手动指定图片的尺寸_。强烈建议你同时使用 https，以满足 iOS 上 [App Transport Security](publishing-to-app-store.md#1-enable-app-transport-security) 的要求。

```tsx
// 正确
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// 错误
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求

如果你希望在图片请求中一起设置 HTTP 方法、Headers 或 Body 等内容，可以通过在 source 对象上定义这些属性来实现：

```tsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    method: 'POST',
    headers: {
      Pragma: 'no-cache',
    },
    body: '请求正文写在这里',
  }}
  style={{width: 400, height: 400}}
/>
```

## URI 数据图片

有时，你可能会从 REST API 调用中获取经过编码的图片数据。你可以使用 `'data:'` URI 方案来使用这些图片。与网络资源一样，_你需要手动指定图片的尺寸_。

:::info
仅建议将其用于非常小且动态的图片，例如数据库列表中的图标。
:::

```tsx
// 至少要包含 width 和 height！
<Image
  style={{
    width: 51,
    height: 51,
    resizeMode: 'contain',
  }}
  source={{
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  }}
/>
```

### 缓存控制

在某些情况下，你可能只想在图片已经存在于本地缓存中时才显示它，例如先显示一个低分辨率占位图，直到更高分辨率的图片可用。另一些情况下，你并不在意图片是否过期，并愿意显示过期图片以节省带宽。`cache` 源属性可以让你控制网络层与缓存的交互方式。

- `default`：使用原生平台的默认策略。
- `reload`：该 URL 的数据将从源头重新加载。不会使用任何现有缓存数据来满足 URL 加载请求。
- `force-cache`：无论缓存数据的年龄或过期时间如何，都会使用现有缓存数据来满足请求。如果缓存中没有与该请求对应的现有数据，则会从源头加载数据。
- `only-if-cached`：无论缓存数据的年龄或过期时间如何，都会使用现有缓存数据来满足请求。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从源头加载数据，并且该加载会被视为失败。

```tsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    cache: 'only-if-cached',
  }}
  style={{width: 400, height: 400}}
/>
```

## 本地文件系统图片

有关使用位于 `Images.xcassets` 之外的本地资源的示例，请参见 [CameraRoll](https://github.com/react-native-community/react-native-cameraroll)。

### Drawable 资源

Android 支持通过 `xml` 文件类型加载 [drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource)。这意味着你可以使用 [vector drawables](https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources) 来渲染图标，或者使用 [shape drawables](https://developer.android.com/guide/topics/resources/drawable-resource#Shape) 来绘制形状！你可以像使用其他任何 [静态资源](#static-image-resources) 或 [混合资源](#images-from-hybrid-apps-resources) 一样导入并使用这些资源类型。你必须手动指定图片尺寸。

对于与 JS 代码放在一起的静态 drawable，请使用 `require` 或 `import` 语法（两者效果相同）：

```tsx
<Image
  source={require('./img/my_icon.xml')}
  style={{width: 40, height: 40}}
/>
```

对于包含在 Android drawable 文件夹中的 drawable（即 `res/drawable`），请使用不带扩展名的资源名：

```tsx
<Image
  source={{uri: 'my_icon'}}
  style={{width: 40, height: 40}}
/>
```

drawable 资源与其他图片类型之间一个关键区别是，Android 应用在编译时必须引用该资源，因为 Android 需要运行 [Android Asset Packaging Tool (AAPT)](https://developer.android.com/tools/aapt2) 来打包资源。AAPT 创建的二进制 XML 文件格式无法通过 Metro 从网络加载。如果你更改了资源的目录或名称，每次都需要重新构建 Android 应用。

#### 创建 XML drawable 资源

Android 在其 [Drawable resources](https://developer.android.com/guide/topics/resources/drawable-resource) 指南中为所有受支持的 drawable 资源类型提供了完整文档，并附有原始 XML 文件示例。你可以使用 Android Studio 中的工具，例如 [Vector Asset Studio](https://developer.android.com/studio/write/vector-asset-studio)，从 Scalable Vector Graphic (SVG) 和 Adobe Photoshop Document (PSD) 文件创建 vector drawable。

:::info
如果你想将 XML 文件视为静态图片资源（即通过 `import` 或 `require` 语句引用），应尽量避免在你创建的 XML 文件中引用其他资源。如果你希望利用对其他 drawable 或属性的引用，例如 [color state lists](https://developer.android.com/guide/topics/resources/color-list-resource) 或 [dimension resources](https://developer.android.com/guide/topics/resources/more-resources#Dimension)，则应将 drawable 作为 [混合资源](#images-from-hybrid-apps-resources) 包含，并通过名称导入。
:::

### 最佳 Camera Roll 图片

iOS 会在 Camera Roll 中为同一张图片保存多个尺寸，从性能角度看，选择尽可能接近的那一张非常重要。如果你要显示一张 200x200 的缩略图，就不应该把完整质量的 3264x2448 图片作为源使用。如果存在完全匹配的图片，React Native 会选择它；否则它会选择第一张至少大 50% 的图片，以避免从较小尺寸缩放时出现模糊。以上所有操作默认都会完成，因此你不必担心手动编写那些繁琐且容易出错的代码。

## 为什么不自动调整所有内容的大小？

_在浏览器中_，如果你不给图片指定大小，浏览器会先渲染一个 0x0 的元素，下载图片，然后再根据正确的尺寸渲染图片。这种行为的最大问题是，随着图片加载，UI 会到处跳动，这会带来非常差的用户体验。这被称为 [累积布局偏移](https://web.dev/cls/)。

_在 React Native 中_，这种行为是有意不实现的。开发者需要提前知道远程图片的尺寸（或宽高比），这会增加一些工作量，但我们认为这会带来更好的用户体验。通过 `require('./my-icon.png')` 语法从应用包中加载的静态图片 _可以自动设置大小_，因为它们的尺寸在挂载时就能立即获取。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 将源作为对象

在 React Native 中，一个有趣的设计是，`src` 属性被命名为 `source`，并且不接受字符串，而是接受一个带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

在基础设施层面，这样做的原因是它允许我们给这个对象附加元数据。例如，如果你使用 `require('./my-icon.png')`，我们就会添加关于其实际位置和大小的信息（不要依赖这一点，未来可能会变化！）。这也是为了未来做准备，例如我们将来可能希望支持 sprite，而不是输出 `{uri: ...}`，我们可以输出 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}`，从而在所有现有调用点无感知地支持 sprite。

在用户侧，这让你可以用诸如图片尺寸之类的有用属性来注解这个对象，以便计算它最终显示出来的大小。你也可以把它当作自己的数据结构，用来存储更多关于图片的信息。

## 通过嵌套实现背景图

对熟悉 Web 的开发者来说，一个常见的需求是 `background-image`。要处理这个用例，你可以使用 `<ImageBackground>` 组件，它和 `<Image>` 有相同的 props，并且你可以在其中添加任意子元素，将它们叠放在图片上方。

在某些情况下，你可能不想使用 `<ImageBackground>`，因为它的实现比较基础。更多说明请参阅 `<ImageBackground>` 的[文档](imagebackground.md)，并在需要时创建你自己的自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

请注意，你必须指定一些 `width` 和 `height` 样式属性。

## iOS 边框圆角样式

请注意，下面这些针对角落的 `border radius` 样式属性可能会被 iOS 的图片组件忽略：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 异步解码

图片解码可能需要超过一帧的时间。这是 Web 上帧率下降的主要来源之一，因为解码是在主线程中完成的。在 React Native 中，图片解码是在另一个线程中完成的。实际上，你本来就需要处理图片尚未下载完成的情况，因此在图片解码期间多显示几帧占位内容并不需要任何代码改动。

## 配置 iOS 图片缓存限制

在 iOS 上，我们提供了一个 API，用于覆盖 React Native 的默认图片缓存限制。这个 API 应该在你的原生 `AppDelegate` 代码中调用（例如在 `didFinishLaunchingWithOptions` 中）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数：**

| 名称           | 类型   | 必需 | 描述               |
| -------------- | ------ | ---- | ------------------ |
| imageSizeLimit | number | 是   | 图片缓存大小限制。 |
| totalCostLimit | number | 是   | 总缓存成本限制。   |

在上面的代码示例中，图片大小限制被设置为 4 MB，总成本限制被设置为 200 MB。
