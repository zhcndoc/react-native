---
id: images
title: 图片
---

## 静态图片资源

React Native 提供了一种统一的方式来管理 Android 和 iOS 应用中的图片及其他媒体资源。要向应用添加静态图片，请将其放在源代码树中的某个位置，并像这样引用：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块的解析方式相同。在上面的示例中，打包器会在需要该图片的组件所在的文件夹中查找 `my-icon.png`。

你可以使用 `@2x` 和 `@3x` 后缀来为不同的屏幕密度提供图片。如果你有以下文件结构：

```
.
├── button.js
└── img
    ├── check.png
    ├── check@2x.png
    └── check@3x.png
```

……并且 `button.js` 代码包含：

```tsx
<Image source={require('./img/check.png')} />
```

……打包器会根据设备的屏幕密度打包并提供相应的图片。例如，在 iPhone 7 上会使用 `check@2x.png`，而在 iPhone 7 Plus 或 Nexus 5 上会使用 `check@3x.png`。如果没有与屏幕密度匹配的图片，则会选择最接近的最佳选项。

在 Windows 上，如果你向项目中添加了新图片，可能需要重启打包器。

以下是你可以获得的一些好处：

1. Android 和 iOS 使用相同的系统
2. 图片与 JavaScript 代码位于同一文件夹中。组件是自包含的
3. 没有全局命名空间，也就是说，你不必担心名称冲突
4. 只有实际使用的图片才会被打包到应用中
5. 添加和更改图片不需要重新编译应用，你可以像平常一样刷新模拟器
6. 打包器知道图片尺寸，无需在代码中重复定义
7. 图片可以通过 [npm](https://www.npmjs.com/) 包进行分发

要使其正常工作，`require` 中的图片名称必须是静态已知的。

```tsx
// GOOD
<Image source={require('./my-icon.png')} />;

// BAD
const icon = this.props.active
  ? 'my-icon-active'
  : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />;

// GOOD
const icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;
```

请注意，以这种方式引入的图片源会包含图片的尺寸（宽度、高度）信息。如果你需要动态缩放图片（例如通过 flex），可能需要在 style 属性上手动设置 `{width: undefined, height: undefined}`。

### 在资源目录中打包图片（iOS）

默认情况下，打包器会将每个引入的图片以及所有 `@2x` 和 `@3x` 变体作为独立文件复制到 iOS 应用中，并放在 JavaScript 包旁边。在 iOS 上，你也可以将它们编译到 [资源目录](https://developer.apple.com/documentation/xcode/managing-assets-with-asset-catalogs) 中，这样系统只会提供设备所需的缩放比例。

要启用此功能，请在应用的 `Info.plist` 中将 `RCTUseAssetCatalog` 键设置为 `true`：

```xml
<key>RCTUseAssetCatalog</key>
<true/>
```

启用后，iOS 构建脚本会在构建时将已打包的图片编译到 `RNAssets.bundle` 资源目录中。你的 `require('./my-icon.png')` 调用完全保持不变，也不需要对 Xcode 项目进行任何修改。

更改此设置后，请务必执行干净构建。

## 静态非图片资源

上面介绍的 `require` 语法也可以用于将音频、视频或文档文件静态包含在项目中。大多数常见文件类型都受支持，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html`、`.pdf` 等。完整列表请参阅 [打包器默认配置](https://github.com/facebook/metro/blob/main/packages/metro-config/src/defaults/defaults.js#L16-L51)。

你可以在 [Metro 配置](https://metrobundler.dev/docs/configuration)中添加 [`assetExts` 解析器选项](https://metrobundler.dev/docs/configuration#resolver-options)，以支持其他类型。

需要注意的是，视频必须使用绝对定位，而不能使用 `flexGrow`，因为目前不会为非图片资源传递尺寸信息。对于直接链接到 Xcode 或 Android 的 Assets 文件夹中的视频，不存在此限制。

## 来自混合应用资源的图片

如果你正在构建混合应用（部分 UI 使用 React Native，部分 UI 使用平台代码），仍然可以使用已经打包到应用中的图片。

对于通过 Xcode 资源目录或 Android drawable 文件夹包含的图片，请使用不带扩展名的图片名称：

```tsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

对于 Android assets 文件夹中的图片，请使用 `asset:/` 方案：

```tsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

这些方式不提供安全检查。你需要自行确保这些图片在应用中可用。此外，还必须手动指定图片尺寸。

## 网络图片

你将在应用中显示的许多图片在编译时并不可用，或者你希望动态加载一些图片以减小二进制文件大小。与静态资源不同，_你需要手动指定图片的尺寸_。强烈建议同时使用 https，以满足 iOS 上的 [App Transport Security](publishing-to-app-store.md#1-enable-app-transport-security) 要求。

```tsx
// GOOD
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// BAD
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求

如果你希望在图片请求中设置 HTTP 方法、Headers 或 Body 等内容，可以在 source 对象上定义这些属性：

```tsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    method: 'POST',
    headers: {
      Pragma: 'no-cache',
    },
    body: 'Your Body goes here',
  }}
  style={{width: 400, height: 400}}
/>
```

## URI 数据图片

有时，你可能会从 REST API 调用中获取编码后的图片数据。你可以使用 `'data:'` URI 方案来使用这些图片。与网络资源一样，_你需要手动指定图片的尺寸_。

:::info
仅建议将此方式用于非常小且动态的图片，例如来自数据库列表中的图标
:::

```tsx
// include at least width and height!
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

在某些情况下，你可能只想在图片已经位于本地缓存中时显示它，例如在较高分辨率的图片可用之前显示低分辨率占位图。在其他情况下，你可能不在意图片是否过时，并愿意显示过时图片以节省带宽。`cache` source 属性可以控制网络层与缓存的交互方式。

- `default`：使用原生平台的默认策略
- `reload`：从源站加载 URL 的数据。不应使用现有缓存数据来满足 URL 加载请求
- `force-cache`：无论缓存数据的时间或过期日期如何，都使用现有的缓存数据来满足请求。如果缓存中没有与该请求对应的现有数据，则从源站加载数据
- `only-if-cached`：无论缓存数据的时间或过期日期如何，都使用现有的缓存数据来满足请求。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从源站加载数据，并将此次加载视为失败

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

请参阅 [CameraRoll](https://github.com/react-native-community/react-native-cameraroll)，了解如何使用 `Images.xcassets` 之外的本地资源。

### Drawable 资源

Android 支持通过 `xml` 文件类型加载 [drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource)。这意味着你可以使用 [vector drawable](https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources) 来渲染图标，或使用 [shape drawable](https://developer.android.com/guide/topics/resources/drawable-resource#Shape) 来绘制形状！你可以像使用其他[静态资源](#static-image-resources)或[混合资源](#images-from-hybrid-apps-resources)一样导入并使用这些资源类型。你必须手动指定图片尺寸。

对于与 JS 代码放在一起的静态 drawable，请使用 `require` 或 `import` 语法（两者的作用相同）：

```tsx
<Image
  source={require('./img/my_icon.xml')}
  style={{width: 40, height: 40}}
/>
```

对于 Android drawable 文件夹中包含的 drawable（即 `res/drawable`），请使用不带扩展名的资源名称：

```tsx
<Image
  source={{uri: 'my_icon'}}
  style={{width: 40, height: 40}}
/>
```

drawable 资源与其他图片类型之间的一个关键区别是，必须在 Android 应用编译时引用该资源，因为 Android 需要运行 [Android Asset Packaging Tool（AAPT）](https://developer.android.com/tools/aapt2) 来打包资源。AAPT 创建的文件格式二进制 XML 无法通过网络由 Metro 加载。如果更改资源的目录或名称，则每次都需要重新构建 Android 应用。

#### 创建 XML drawable 资源

Android 在其 [Drawable resources](https://developer.android.com/guide/topics/resources/drawable-resource) 指南中提供了各种受支持 drawable 资源类型的完整文档，以及原始 XML 文件示例。你可以使用 Android Studio 中的工具，例如 [Vector Asset Studio](https://developer.android.com/studio/write/vector-asset-studio)，从 Scalable Vector Graphic（SVG）和 Adobe Photoshop Document（PSD）文件创建 vector drawable。

:::info
如果你希望将创建的 XML 文件作为静态图片资源使用（即通过 `import` 或 `require` 语句使用），应尽量避免在 XML 文件中引用其他资源。如果你希望使用对其他 drawable 或属性的引用，例如 [color state list](https://developer.android.com/guide/topics/resources/color-list-resource) 或 [dimension resource](https://developer.android.com/guide/topics/resources/more-resources#Dimension)，则应将 drawable 作为[混合资源](#images-from-hybrid-apps-resources)包含，并通过名称导入
:::

### Camera Roll 中的最佳图片

iOS 会在 Camera Roll 中为同一张图片保存多个尺寸，出于性能原因，选择一个尽可能接近的尺寸非常重要。在显示 200x200 的缩略图时，你不会想使用完整质量的 3264x2448 图片作为源。如果存在完全匹配的尺寸，React Native 会选择它；否则，它会使用至少大 50% 的第一张图片，以避免从接近的尺寸调整大小时出现模糊。所有这些操作默认都会完成，因此你不必担心编写繁琐且容易出错的代码来自己实现。

## 为什么不自动设置所有内容的尺寸？

_在浏览器中_，如果你不给图片设置尺寸，浏览器会渲染一个 0x0 的元素，下载图片，然后根据正确的尺寸渲染图片。这种行为的一个重大问题是，随着图片加载，你的 UI 会到处跳动，从而造成非常糟糕的用户体验。这称为[累积布局偏移](https://web.dev/cls/)。

_在 React Native 中_，这种行为是有意不实现的。开发者需要提前知道远程图片的尺寸（或宽高比），这会增加工作量，但我们相信这样可以带来更好的用户体验。通过 `require('./my-icon.png')` 语法从应用包中加载的静态图片*可以自动设置尺寸*，因为在挂载时就能立即获得其尺寸。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 作为对象的 Source

在 React Native 中，一个有趣的设计决定是，`src` 属性被命名为 `source`，并且不接受字符串，而是接受带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

在基础设施层面，这样设计的原因是它允许我们向该对象附加元数据。例如，如果你使用 `require('./my-icon.png')`，我们就会添加有关其实际位置和尺寸的信息（不要依赖这一事实，它未来可能会发生变化！）。这也为未来提供了扩展空间，例如我们可能希望在某个时候支持 sprites。此时，我们可以输出 `{uri: ...}`，而不是输出 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}`，并在所有现有调用位置透明地支持 sprite。

在用户层面，这使你可以使用有用的属性来注释该对象，例如图片的尺寸，以便计算图片将要显示的大小。你可以放心地将其用作存储更多图片信息的数据结构。

## 通过嵌套实现背景图片

熟悉 Web 的开发者经常请求的一个功能是 `background-image`。要处理这种使用场景，你可以使用 `<ImageBackground>` 组件。它具有与 `<Image>` 相同的 props，并且你可以向其中添加任意子元素，使其叠加在图片之上。

在某些情况下，你可能不希望使用 `<ImageBackground>`，因为其实现比较基础。请参阅 `<ImageBackground>` 的[文档](imagebackground.md)以了解更多信息，并在需要时创建自己的自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

请注意，你必须指定一些宽度和高度样式属性。

## iOS 边框圆角样式

请注意，以下特定于角的边框圆角样式属性可能会被 iOS 的图片组件忽略：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 线程外解码

图片解码可能需要超过一帧的时间。这是 Web 上导致帧丢失的主要原因之一，因为解码是在主线程中完成的。在 React Native 中，图片解码是在另一个线程中完成的。实际上，你本来就需要处理图片尚未下载完成的情况，因此在解码期间多显示几帧占位图不需要进行任何代码更改。

## 配置 iOS 图片缓存限制

在 iOS 上，我们提供了一个 API，可以覆盖 React Native 的默认图片缓存限制。应从原生 AppDelegate 代码中调用此 API（例如在 `didFinishLaunchingWithOptions` 中调用）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数：**

| 名称           | 类型   | 必需 | 描述             |
| -------------- | ------ | ---- | ---------------- |
| imageSizeLimit | number | 是   | 图片缓存大小限制 |
| totalCostLimit | number | 是   | 缓存总开销限制   |

在上面的代码示例中，图片大小限制设置为 4 MB，缓存总开销限制设置为 200 MB。
