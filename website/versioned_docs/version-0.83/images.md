---
id: images
title: 图片
---

## 静态图片资源

React Native 提供了一种统一的方式来管理 Android 和 iOS 应用中的图片和其他媒体资产。要向应用中添加静态图片，只需将图片放在源码树中的某处，并像这样引用它：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块解析相同。在上面的示例中，打包器将在引用它的组件所在的同一文件夹中查找 `my-icon.png`。

你可以使用 `@2x` 和 `@3x` 后缀为不同屏幕密度提供图片。如果你有如下文件结构：

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

...打包器会根据设备的屏幕密度打包并加载对应的图片。例如，iPhone 7 会使用 `check@2x.png`，而 iPhone 7 Plus 或 Nexus 5 会使用 `check@3x.png`。如果没有与屏幕密度完全匹配的图片，将选择最接近的最佳选项。

在 Windows 上，如果你添加了新图片，可能需要重启打包器。

这里是一些你将获得的好处：

1. Android 和 iOS 使用相同的系统。
2. 图片与 JavaScript 代码放在同一文件夹，组件自给自足。
3. 无全局命名空间，不用担心命名冲突。
4. 只有真正使用的图片才会被打包进应用。
5. 添加和更改图片不需要重新编译应用，可像平常那样刷新模拟器。
6. 打包器知道图片尺寸，无需在代码中重复声明。
7. 图片可以通过 [npm](https://www.npmjs.com/) 包分发。

要使其正常工作，`require` 中的图片名必须是静态已知的。

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

注意，以这种方式 require 的图片资源会包含图片尺寸（宽度、高度）信息。如果你需要动态缩放图片（比如使用 flex），可能需要在样式属性上手动设置 `{width: undefined, height: undefined}`。

## 静态非图片资源

上述 `require` 语法同样可用于静态包含音频、视频或文档文件。大多数常见文件类型都支持，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html`、`.pdf` 等。完整列表见 [打包器默认设置](https://github.com/facebook/metro/blob/main/packages/metro-config/src/defaults/defaults.js#L16-L51)。

你可以通过在 [Metro 配置](https://metrobundler.dev/docs/configuration) 中添加 [`assetExts` 解析器选项](https://metrobundler.dev/docs/configuration#resolver-options) 来支持其他文件类型。

需要注意的是，视频必须使用绝对定位而非 `flexGrow`，因为目前非图片资源的尺寸信息不会被传递。这个限制不会影响直接链接到 Xcode 或 Android 资源文件夹中的视频。

## 来自混合应用资源的图片

如果你开发混合应用（部分 UI 用 React Native，部分 UI 用平台代码），仍然可以使用已经打包进应用的图片。

对于通过 Xcode 资产目录或 Android drawable 文件夹包含的图片，使用不带扩展名的图片名：

```tsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

对于 Android 资产文件夹中的图片，使用 `asset:/` 方案：

```tsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

这些方法没有安全检查，确保图片在应用中可用由你负责。你也必须手动指定图片尺寸。

## 网络图片

你应用中展示的很多图片在编译时不可用，或者你想动态加载一些图片以减小二进制包体积。与静态资源不同的是，_你需要手动指定图片的尺寸_。强烈建议你使用 https，以符合 iOS 上的 [应用传输安全](publishing-to-app-store.md#1-enable-app-transport-security) 要求。

```tsx
// 推荐
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// 不推荐
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求配置

如果你想设置 HTTP 请求方法、头信息或请求体，可以在 source 对象上定义这些属性：

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

有时候，你可能会从 REST API 调用获取编码后的图片数据。你可以使用 `'data:'` URI 方案使用这些图片。和网络资源一样，_需要手动指定图片尺寸_。

:::info
这只推荐用于非常小且动态的图片，例如来自数据库列表的图标。
:::

```tsx
// 至少要包含宽度和高度！
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

有时你可能只想在本地缓存中已有图片时才显示它，比如先显示低分辨率占位图，再显示高分辨率图。或者你愿意显示过期图片以节省流量。`cache` 源属性让你能控制网络层如何使用缓存。

- `default`：使用平台默认策略。
- `reload`：强制从来源加载数据，不使用已有缓存。
- `force-cache`：使用缓存数据（不管是否过期），缓存不存在时才从来源加载。
- `only-if-cached`：只使用缓存数据（不管是否过期），缓存不存在时不尝试加载，视为加载失败。

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

示例请参考 [CameraRoll](https://github.com/react-native-community/react-native-cameraroll)，用于访问 `Images.xcassets` 之外的本地资源。

### Drawable 资源

Android 支持通过 `xml` 文件类型加载 [drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource)，这意味着你可以使用 [矢量 drawable](https://developer.android.com/develop/ui/views/graphics/vector-drawable-resources) 渲染图标，或者使用 [形状 drawable](https://developer.android.com/guide/topics/resources/drawable-resource#Shape) 绘制形状！你可以像导入其他 [静态资源](#静态图片资源) 或 [混合资源](#来自混合应用资源的图片) 一样导入和使用这些资源类型。你必须手动指定图片尺寸。

对于与 JS 代码同目录的静态 drawable，使用 `require` 或 `import` 语法（两者效果相同）：

```tsx
<Image
  source={require('./img/my_icon.xml')}
  style={{width: 40, height: 40}}
/>
```

对于包含在 Android drawable 文件夹（即 `res/drawable`）中的 drawable，使用不带扩展名的资源名：

```tsx
<Image
  source={{uri: 'my_icon'}}
  style={{width: 40, height: 40}}
/>
```

drawable 资源与其他图片类型的一个主要区别是必须在 Android 应用编译时引用资源，因为 Android 需要运行 [Android 资源打包工具（AAPT）](https://developer.android.com/tools/aapt2) 来打包资源。AAPT 生成的二进制 XML 文件格式无法被 Metro 通过网络加载。如果你更改资源目录或名称，需要每次重建 Android 应用。

#### 创建 XML drawable 资源

Android 提供了丰富的文档介绍支持的 drawable 资源类型，详见其 [Drawable 资源](https://developer.android.com/guide/topics/resources/drawable-resource) 指南，其中附带原始 XML 文件示例。你也可以利用 Android Studio 的工具如 [矢量资源工作室](https://developer.android.com/studio/write/vector-asset-studio) 从 SVG 和 Adobe Photoshop Document（PSD）文件创建矢量 drawable。

:::info
如果你想将 XML 文件视为静态图片资源（即通过 `import` 或 `require` 语句导入），应尽量避免在 XML 文件中引用其他资源。如果想引用其他 drawable 或属性，比如 [颜色状态列表](https://developer.android.com/guide/topics/resources/color-list-resource) 或 [尺寸资源](https://developer.android.com/guide/topics/resources/more-resources#Dimension)，应将 drawable 作为 [混合资源](#来自混合应用资源的图片) 并按名称导入。
:::

### 最佳相册（Camera Roll）图片

iOS 会为同一张图片保存多个尺寸，为性能考虑选择与展示尺寸尽可能接近的图像非常重要。比如显示 200x200 缩略图时，不应该使用 3264x2448 的全尺寸原图作为源。如果有完全匹配的尺寸，React Native 会选择它；否则会选用至少大 50% 的第一张图片，以避免从尺寸较近大小缩放时产生模糊。以上所有操作都是默认完成的，无需你手动编写繁琐且易出错的代码。

## 为什么不自动设置所有图片的尺寸？

_在浏览器中_，如果不给图片指定尺寸，浏览器会渲染一个 0x0 元素，下载图片后再以正确尺寸渲染。这会导致 UI 在图片加载时跳动，体验很差，这就是所谓的[累计布局偏移](https://web.dev/cls/)。

_在 React Native 中_，故意不实现此行为。虽然开发者需要预先知道远程图片的尺寸（或宽高比），但这能带来更好的用户体验。通过 `require('./my-icon.png')` 语法加载的静态图片因为加载时即知其尺寸，_可以自动设置尺寸_。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 以对象形式传递 source

React Native 中的一个有意思的设计是，`src` 属性被命名为 `source`，并且不是字符串，而是一个带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

在基础设施端，这使得我们可以为该对象附加元数据。例如，当你使用 `require('./my-icon.png')` 时，我们会加上实际位置和尺寸信息（但不要依赖此行为，未来可能变化！）。这是为将来做的扩展，比如未来可能支持雪碧图，输出可以是 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}`，所有调用都透明支持雪碧图。

在用户层面，这让你可以在对象上标注有用属性，如图片尺寸，以便计算展示大小。你可以随意使用它作为存储更多图片信息的数据结构。

## 通过嵌套实现背景图

熟悉 Web 的开发者常常希望有 `background-image` 功能。为满足这一需求，可以使用 `<ImageBackground>` 组件，它与 `<Image>` 拥有相同的属性，并且可以在其内部嵌套任意子组件以层叠显示。

某些情况下你可能不想使用 `<ImageBackground>`，因为其实现较为基础。更多信息请参考 `<ImageBackground>` 的[文档](imagebackground.md)，需要时还可以创建自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

注意，你必须指定宽度和高度样式属性。

## iOS 边框圆角样式

请注意，以下特定角落的边框圆角样式属性可能会被 iOS 的图片组件忽略：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 线程外解码

图片解码可能需要超过一帧的时间。在 Web 端，解码在主线程执行，是帧率下降的主要原因之一。而在 React Native 中，图片解码在不同线程进行。实际使用中，你已经需要处理图片未下载完成的情况，因此解码时多显示几帧占位图并不影响代码逻辑。

## 配置 iOS 图片缓存限制

在 iOS 上，我们提供了一个 API 用于覆盖 React Native 默认的图片缓存限制。此 API 应在原生 AppDelegate 代码中调用（例如，在 `didFinishLaunchingWithOptions` 方法内）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数说明：**

| 名称            | 类型    | 是否必填 | 说明               |
| -------------- | ------- | -------- | ------------------ |
| imageSizeLimit | number  | 是       | 单张图片缓存尺寸限制。 |
| totalCostLimit | number  | 是       | 总缓存成本限制。       |

以上例子中，单张图片缓存大小限制设置为 4 MB，总缓存成本限制设置为 200 MB。