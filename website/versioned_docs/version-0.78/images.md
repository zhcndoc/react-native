---
id: images
title: 图片
---

## 静态图片资源

React Native 提供了一种统一的方式来管理 Android 和 iOS 应用中的图片和其他媒体资产。要向应用添加静态图片，请将其放置在源代码树的某个位置，并按如下方式引用它：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块的解析方式相同。在上面的示例中，打包器将在与要求它的组件相同的文件夹中查找 `my-icon.png`。

你可以使用 `@2x` 和 `@3x` 后缀为不同的屏幕密度提供图片。如果你有以下的文件结构：

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

...打包器会打包并提供与设备屏幕密度相对应的图片。例如，在 iPhone 7 上会使用 `check@2x.png`，而在 iPhone 7 Plus 或 Nexus 5 上会使用 `check@3x.png`。如果没有与屏幕密度匹配的图片，将选择最接近的最佳选项。

在 Windows 上，如果你向项目添加了新图片，可能需要重启打包器。

以下是你获得的一些好处：

1. Android 和 iOS 上的系统相同。
2. 图片与 JavaScript 代码位于同一文件夹中。组件是自包含的。
3. 没有全局命名空间，即你不必担心名称冲突。
4. 只有实际使用的图片才会被打包到你的应用中。
5. 添加和更改图片不需要重新编译应用，你可以像往常一样刷新模拟器。
6. 打包器知道图片尺寸，无需在代码中重复指定。
7. 图片可以通过 [npm](https://www.npmjs.com/) 包分发。

为了使此功能正常工作，`require` 中的图片名称必须是静态已知的。

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

请注意，以这种方式要求的图片源包含图片的尺寸（宽、高）信息。如果你需要动态缩放图片（即通过 flex），可能需要在样式属性上手动设置 `{width: undefined, height: undefined}`。

## 静态非图片资源

上述描述的 `require` 语法也可用于将音频、视频或文档文件静态包含在你的项目中。支持大多数常见的文件类型，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html` 和 `.pdf`。请参阅 [bundler defaults](https://github.com/facebook/metro/blob/master/packages/metro-config/src/defaults/defaults.js#L14-L44) 获取完整列表。

你可以通过在 [Metro 配置](https://metrobundler.dev/docs/configuration) 中添加 [`assetExts` resolver 选项](https://metrobundler.dev/docs/configuration#resolver-options) 来添加对其他类型的支持。

需要注意的是，视频必须使用绝对定位而不是 `flexGrow`，因为目前非图片资产不会传递尺寸信息。对于直接链接到 Xcode 或 Android Assets 文件夹的视频，不会出现此限制。

## 来自混合应用资源的图片

如果你正在构建混合应用（某些 UI 在 React Native 中，某些 UI 在平台代码中），你仍然可以使用已捆绑到应用中的图片。

对于通过 Xcode 资产目录或 Android drawable 文件夹包含的图片，请使用不带扩展名的图片名称：

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

这些方法不提供安全检查。由你保证这些图片在应用中可用。此外，你必须手动指定图片尺寸。

## 网络图片

你在应用中显示的许多图片在编译时不可用，或者你希望动态加载某些图片以减小二进制文件大小。与静态资源不同，*你需要手动指定图片的尺寸*。强烈建议你也使用 https 以满足 iOS 上的 [App Transport Security](publishing-to-app-store.md#1-enable-app-transport-security) 要求。

```tsx
// 正确
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// 错误
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求

如果你想设置诸如 HTTP 动词、Headers 或 Body 等内容以及图片请求，你可以通过在源对象上定义这些属性来实现：

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

有时，你可能会从 REST API 调用中获取编码的图片数据。你可以使用 `'data:'` URI 方案来使用这些图片。与网络资源一样，*你需要手动指定图片的尺寸*。

:::info
这仅推荐用于非常小且动态的图片，例如来自数据库的列表中的图标。
:::

```tsx
// 至少包含宽度和高度！
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

在某些情况下，你可能只想显示已存在于本地缓存中的图片，例如低分辨率占位符，直到高分辨率可用。在其他情况下，你不关心图片是否过时，并且愿意显示过时的图片以节省带宽。`cache` 源属性让你控制网络层如何与缓存交互。

- `default`：使用 native 平台的默认策略。
- `reload`：URL 的数据将从原始源加载。不应使用现有的缓存数据来满足 URL 加载请求。
- `force-cache`：现有的缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与请求对应的现有数据，则数据从原始源加载。
- `only-if-cached`：现有的缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从原始源加载数据，并且加载被视为失败。

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

请参阅 [CameraRoll](https://github.com/react-native-community/react-native-cameraroll) 以获取使用 `Images.xcassets` 之外的本地资源的示例。

### Drawable 资源

Android 支持通过 `xml` 文件类型加载 [drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource)。这意味着你可以使用 [vector drawables](https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources) 来渲染图标，或使用 [shape drawables](https://developer.android.com/guide/topics/resources/drawable-resource#Shape) 来绘制形状！你可以像使用任何其他 [静态资源](#static-image-resources) 或 [混合资源](#images-from-hybrid-apps-resources) 一样导入和使用这些资源类型。你必须手动指定图片尺寸。

对于与 JS 代码位于一起的静态 drawables，使用 `require` 或 `import` 语法（两者作用相同）：

```tsx
<Image
  source={require('./img/my_icon.xml')}
  style={{width: 40, height: 40}}
/>
```

对于包含在 Android drawable 文件夹（即 `res/drawable`）中的 drawables，请使用不带扩展名的资源名称：

```tsx
<Image
  source={{uri: 'my_icon'}}
  style={{width: 40, height: 40}}
/>
```

drawable 资源与其他图片类型之间的一个关键区别是，资产必须在 Android 应用的编译时被引用，因为 Android 需要运行 [Android Asset Packaging Tool (AAPT)](https://developer.android.com/tools/aapt2) 来打包资产。AAPT 创建的二进制 XML 文件格式无法通过 Metro 通过网络加载。如果你更改了资产的目录或名称，每次都需要重新构建 Android 应用。

#### 创建 XML drawable 资源

Android 在其 [Drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource) 指南中提供了有关每种支持的 drawable 资源类型的综合文档，以及原始 XML 文件的示例。你可以利用 Android Studio 中的工具，如 [Vector Asset Studio](https://developer.android.com/studio/write/vector-asset-studio)，从 Scalable Vector Graphic (SVG) 和 Adobe Photoshop Document (PSD) 文件创建 vector drawables。

:::info
如果你想将 XML 文件视为静态图片资源（即使用 `import` 或 `require` 语句），则应尽量避免在创建的 XML 文件中引用其他资源。如果你希望利用对其他 drawables 或属性的引用，例如 [color state lists](https://developer.android.com/guide/topics/resources/color-list-resource) 或 [dimension resources](https://developer.android.com/guide/topics/resources/more-resources#Dimension)，则应将 drawable 作为 [混合资源](#images-from-hybrid-apps-resources) 包含并按名称导入。
:::

### 最佳相机胶卷图片

iOS 为你的相机胶卷中的同一图片保存多种尺寸，出于性能原因，选择尽可能接近的尺寸非常重要。当显示 200x200 缩略图时，你不希望使用全质量 3264x2448 图片作为源。如果有完全匹配的图片，React Native 将选择它，否则它将使用至少大 50% 的第一张图片，以避免在调整接近尺寸时出现模糊。所有这些都是默认完成的，因此你不必担心编写繁琐（且容易出错）的代码来自己完成。

## 为什么不自动调整所有内容的大小？

_在浏览器中_ 如果你不给图像指定大小，浏览器将会渲染一个 0x0 的元素，下载图像，然后根据正确的大小渲染图像。这种行为的大问题是，随着图像加载，你的 UI 会四处跳动，这会导致非常糟糕的用户体验。这被称为 [累积布局偏移](https://web.dev/cls/)。

_在 React Native 中_ 这种行为是故意不实现的。开发者需要预先知道远程图像的尺寸（或纵横比）会更麻烦一些，但我们相信这会带来更好的用户体验。通过 `require('./my-icon.png')` 语法从应用包中加载的静态图像_可以自动调整大小_，因为它们的尺寸在挂载时立即可用。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 源作为对象

在 React Native 中，一个有趣的决定是 `src` 属性被命名为 `source`，并且不接受字符串，而是接受一个带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

在基础设施方面，原因是它允许我们将元数据附加到此对象。例如，如果你使用的是 `require('./my-icon.png')`，那么我们会添加关于其实际位置和大小信息（不要依赖这个事实，它将来可能会改变！）。这也是为了面向未来，例如我们可能希望在某个时候支持雪碧图，而不是输出 `{uri: ...}`，我们可以输出 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}` 并在所有现有的调用站点透明地支持雪碧图。

在用户方面，这让你可以用有用的属性（例如图像的尺寸）来标注对象，以便计算它将显示的大小。随意将其用作数据结构来存储有关图像的更多信息。

## 通过嵌套实现背景图像

熟悉 Web 的开发者常见的一个功能请求是 `background-image`。要处理此用例，你可以使用 `<ImageBackground>` 组件，它具有与 `<Image>` 相同的 props，并且可以向其中添加任何你想要叠加在其上的子元素。

在某些情况下你可能不想使用 `<ImageBackground>`，因为实现比较基础。请参阅 `<ImageBackground>` 的 [文档](imagebackground.md) 以了解更多见解，并在需要时创建你自己的自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

请注意，你必须指定一些宽度和高度样式属性。

## iOS 边框半径样式

请注意，以下特定角落的边框半径样式属性可能会被 iOS 的图像组件忽略：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 非主线程解码

图像解码可能需要超过一帧的时间。这是 Web 上掉帧的主要来源之一，因为解码是在主线程中完成的。在 React Native 中，图像解码是在不同的线程中完成的。在实践中，你已经需要处理图像尚未下载的情况，因此在解码期间多显示几帧占位符不需要任何代码更改。

## 配置 iOS 图像缓存限制

在 iOS 上，我们公开了一个 API 来覆盖 React Native 的默认图像缓存限制。这应该在你的原生 AppDelegate 代码中调用（例如在 `didFinishLaunchingWithOptions` 内）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数：**

| 名称           | 类型   | 必需 | 描述             |
| -------------- | ------ | -------- | ----------------------- |
| imageSizeLimit | number | 是      | 图像缓存大小限制。 |
| totalCostLimit | number | 是      | 总缓存成本限制。 |

在上面的代码示例中，图像大小限制设置为 4 MB，总成本限制设置为 200 MB。
