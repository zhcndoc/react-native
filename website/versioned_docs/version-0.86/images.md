---
id: images
title: 图片
---

## 静态图片资源

React Native 为在 Android 和 iOS 应用中管理图片及其他媒体资源提供了一种统一方式。要向应用添加静态图片，请将其放在源码树中的某个位置，然后像这样引用它：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块的解析方式相同。在上面的示例中，bundler 会在需要它的组件所在的同一文件夹中查找 `my-icon.png`。

你可以使用 `@2x` 和 `@3x` 后缀来为不同屏幕密度提供图片。如果你的文件结构如下：

```
.
├── button.js
└── img
    ├── check.png
    ├── check@2x.png
    └── check@3x.png
```

...并且 `button.js` 代码包含：

```tsx
<Image source={require('./img/check.png')} />
```

...那么 bundler 会打包并提供与设备屏幕密度相对应的图片。例如，`check@2x.png` 将用于 iPhone 7，而 `check@3x.png` 将用于 iPhone 7 Plus 或 Nexus 5。如果没有与屏幕密度匹配的图片，则会选择最接近的最佳选项。

在 Windows 上，如果你向项目中添加了新的图片，可能需要重启 bundler。

你将获得以下一些好处：

1. Android 和 iOS 使用相同的系统。
2. 图片与你的 JavaScript 代码位于同一文件夹中。组件是自包含的。
3. 没有全局命名空间，也就是说，你不必担心名称冲突。
4. 只有实际使用到的图片才会被打包进你的应用。
5. 添加和更改图片不需要重新编译应用，你可以像平常一样刷新模拟器。
6. bundler 知道图片尺寸，无需在代码中重复编写。
7. 图片可以通过 [npm](https://www.npmjs.com/) 包分发。

为了使其正常工作，`require` 中的图片名称必须是静态可知的。

```tsx
// 好
<Image source={require('./my-icon.png')} />;

// 坏
const icon = this.props.active
  ? 'my-icon-active'
  : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />;

// 好
const icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;
```

请注意，以这种方式 `require` 的图片源包含供 Image 使用的尺寸（width、height）信息。如果你需要动态缩放图片（即通过 flex），你可能需要在 style 属性上手动设置 `{width: undefined, height: undefined}`。

## 静态非图片资源

上面描述的 `require` 语法也可以用于在项目中静态包含音频、视频或文档文件。支持大多数常见文件类型，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html`、`.pdf` 等。完整列表请参见 [bundler defaults](https://github.com/facebook/metro/blob/main/packages/metro-config/src/defaults/defaults.js#L16-L51)。

你可以通过在 [Metro 配置](https://metrobundler.dev/docs/configuration) 中添加 [`assetExts` resolver 选项](https://metrobundler.dev/docs/configuration#resolver-options) 来支持其他类型。

需要注意的一点是，视频必须使用绝对定位而不是 `flexGrow`，因为目前非图片资源不会传递尺寸信息。直接链接到 Xcode 中或 Android 的 Assets 文件夹中的视频不受此限制。

## 来自混合应用资源的图片

如果你正在构建一个混合应用（部分 UI 使用 React Native，部分 UI 使用平台代码），你仍然可以使用已经打包进应用的图片。

对于通过 Xcode asset catalogs 或 Android drawable 文件夹包含的图片，请使用不带扩展名的图片名称：

```tsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

对于 Android assets 文件夹中的图片，请使用 `asset:/` scheme：

```tsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

这些方式不提供任何安全检查。你需要自己保证这些图片在应用中可用。此外，你还必须手动指定图片尺寸。

## 网络图片

你在应用中显示的许多图片在编译时并不可用，或者你可能希望动态加载一些图片以减小二进制体积。与静态资源不同，_你需要手动指定图片的尺寸_。强烈建议你同时使用 https，以满足 iOS 上 [App Transport Security](publishing-to-app-store.md#1-enable-app-transport-security) 的要求。

```tsx
// 好
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// 坏
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求

如果你希望在图片请求中同时设置 HTTP-Verb、Headers 或 Body 等内容，可以在 source 对象上定义这些属性：

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

有时，你可能会从 REST API 调用中获取已编码的图片数据。你可以使用 `'data:'` URI scheme 来使用这些图片。与网络资源一样，_你需要手动指定图片的尺寸_。

:::info
这仅建议用于非常小且动态的图片，例如数据库列表中的图标。
:::

```tsx
// 至少包含 width 和 height！
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

在某些情况下，你可能只希望在图片已经位于本地缓存中时才显示它，例如在高分辨率图片可用之前先显示一个低分辨率占位图。在其他情况下，你并不关心图片是否过时，并愿意显示过期图片来节省带宽。`cache` source 属性可以让你控制网络层与缓存的交互方式。

- `default`：使用原生平台的默认策略。
- `reload`：该 URL 的数据将从源头重新加载。不应使用任何现有缓存数据来满足 URL 加载请求。
- `force-cache`：无论缓存数据的年龄或过期日期如何，都将使用现有缓存数据来满足请求。如果缓存中不存在与请求对应的现有数据，则会从源头加载数据。
- `only-if-cached`：无论缓存数据的年龄或过期日期如何，都将使用现有缓存数据来满足请求。如果缓存中不存在与 URL 加载请求对应的现有数据，则不会尝试从源头加载数据，并且加载将被视为失败。

```tsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    cache: 'only-if-cached',
  }}
  style={{width: 400, height: 400}}
/>
```

## 本地文件系统中的图片

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

对于包含在 Android drawable 文件夹中的 drawable（即 `res/drawable`），请使用不带扩展名的资源名称：

```tsx
<Image
  source={{uri: 'my_icon'}}
  style={{width: 40, height: 40}}
/>
```

drawable 资源与其他图片类型之间的一个关键区别是，该资源必须在 Android 应用编译时被引用，因为 Android 需要运行 [Android Asset Packaging Tool (AAPT)](https://developer.android.com/tools/aapt2) 来打包该资源。AAPT 生成的二进制 XML 文件不能通过 Metro 从网络加载。如果你更改了资源的目录或名称，每次都需要重新构建 Android 应用。

#### 创建 XML drawable 资源

Android 在其 [Drawable resources](https://developer.android.com/guide/topics/resources/drawable-resource) 指南中对所有受支持的 drawable 资源类型提供了全面文档，并附有原始 XML 文件示例。你可以使用 Android Studio 中的工具，例如 [Vector Asset Studio](https://developer.android.com/studio/write/vector-asset-studio)，从可缩放矢量图形（SVG）和 Adobe Photoshop Document（PSD）文件创建 vector drawable。

:::info
如果你想将 XML 文件视为静态图片资源（即使用 `import` 或 `require` 语句），应尽量避免在你创建的 XML 文件中引用其他资源。如果你希望使用对其他 drawable 或属性的引用，例如 [color state lists](https://developer.android.com/guide/topics/resources/color-list-resource) 或 [dimension resources](https://developer.android.com/guide/topics/resources/more-resources#Dimension)，则应将你的 drawable 作为 [混合资源](#images-from-hybrid-apps-resources) 包含进来，并通过名称导入它。
:::

### Camera Roll 中的最佳图片

iOS 会在你的 Camera Roll 中为同一张图片保存多个尺寸，从性能角度来看，选择尽可能接近的尺寸非常重要。你不应在显示 200x200 缩略图时将完整质量的 3264x2448 图片作为源。若存在完全匹配项，React Native 会选择它；否则，为了避免从较接近的尺寸缩放时出现模糊，它会使用第一个至少大 50% 的图片。所有这些默认都会完成，因此你不必担心自己编写繁琐且容易出错的代码来实现它。

## 为什么不自动为所有内容设置尺寸？

_在浏览器中_，如果你不给图片指定尺寸，浏览器会先渲染一个 0x0 的元素，下载图片，然后再根据正确的尺寸渲染图片。这种行为的一个大问题是，随着图片加载，你的 UI 会到处跳动，这会带来非常差的用户体验。这被称为 [累计布局偏移](https://web.dev/cls/)。

_在 React Native 中_，这种行为是有意没有实现的。开发者需要提前知道远程图片的尺寸（或宽高比），这会多一些工作，但我们认为这会带来更好的用户体验。通过 `require('./my-icon.png')` 语法从应用包中加载的静态图片 _可以自动设置尺寸_，因为它们的尺寸在挂载时就可以立即获取。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 作为对象的 Source

在 React Native 中，一个有趣的设计是，`src` 属性被命名为 `source`，并且不接受字符串，而是接受一个带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

从基础设施的角度来看，原因是这使我们能够向这个对象附加元数据。例如，如果你使用 `require('./my-icon.png')`，那么我们会添加它的实际位置和尺寸信息（不要依赖这一点，未来可能会改变！）。这也是一种面向未来的设计，例如，我们将来可能希望支持 sprite。到时，与其输出 `{uri: ...}`，我们可以输出 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}`，从而在所有现有调用处透明地支持 sprite。

从用户角度来说，这让你可以用图片尺寸等有用属性来注释这个对象，以便计算它最终将以多大的尺寸显示。你也可以自由地将它作为自己的数据结构，用来存储关于图片的更多信息。

## 通过嵌套实现背景图片

对熟悉 Web 的开发者来说，一个常见的需求是 `background-image`。要处理这种用例，你可以使用 `<ImageBackground>` 组件，它拥有与 `<Image>` 相同的 props，并且可以向其中添加你想要叠加在其上的任意子元素。

在某些情况下，你可能不想使用 `<ImageBackground>`，因为它的实现比较基础。请参考 `<ImageBackground>` 的[文档](imagebackground.md)以了解更多信息，并在需要时创建你自己的自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>内部</Text>
  </ImageBackground>
);
```

请注意，你必须指定某些 width 和 height 样式属性。

## iOS 边框圆角样式

请注意，以下按角落分别设置的 border radius 样式属性可能会被 iOS 的图片组件忽略：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 异步解码

图片解码可能会花费超过一帧的时间。这是 Web 上帧丢失的主要原因之一，因为解码是在主线程中完成的。在 React Native 中，图片解码是在另一个线程中完成的。实际上，你本来就需要处理图片尚未下载完成的情况，因此在解码期间再显示几帧占位内容并不需要修改任何代码。

## 配置 iOS 图片缓存限制

在 iOS 上，我们提供了一个 API 来覆盖 React Native 的默认图片缓存限制。这个 API 应从你的原生 AppDelegate 代码中调用（例如在 `didFinishLaunchingWithOptions` 中）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数：**

| 名称           | 类型   | 是否必需 | 描述             |
| -------------- | ------ | -------- | ---------------- |
| imageSizeLimit | number | 是 | 图片缓存大小限制。 |
| totalCostLimit | number | 是 | 总缓存成本限制。 |

在上面的代码示例中，图片大小限制设置为 4 MB，总成本限制设置为 200 MB。
