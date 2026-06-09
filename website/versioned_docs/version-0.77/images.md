---
id: images
title: 图片
---

## 静态图片资源

React Native 提供了一种统一的方式来管理 Android 和 iOS 应用中的图片和其他媒体资源。要向应用添加静态图片，请将其放置在源代码树的某处，并按如下方式引用它：

```tsx
<Image source={require('./my-icon.png')} />
```

图片名称的解析方式与 JS 模块的解析方式相同。在上面的示例中，打包器将在与要求它的组件相同的文件夹中查找 `my-icon.png`。

您可以使用 `@2x` 和 `@3x` 后缀为不同的屏幕密度提供图片。如果您有以下文件结构：

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

...打包器将捆绑并提供与设备屏幕密度相对应的图片。例如，`check@2x.png` 会在 iPhone 7 上使用，而 `check@3x.png` 会在 iPhone 7 Plus 或 Nexus 5 上使用。如果没有与屏幕密度匹配的图片，则会选择最接近的最佳选项。

在 Windows 上，如果您向项目添加了新图片，可能需要重启打包器。

以下是您获得的一些好处：

1. Android 和 iOS 上的系统相同。
2. 图片与您的 JavaScript 代码位于同一文件夹中。组件是自包含的。
3. 没有全局命名空间，即您不必担心名称冲突。
4. 只有实际使用的图片才会被打包进您的应用中。
5. 添加和更改图片不需要重新编译应用，您可以像往常一样刷新模拟器。
6. 打包器知道图片尺寸，无需在代码中重复。
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

请注意，以这种方式要求的图片源包含图片的尺寸（宽、高）信息。如果您需要动态缩放图片（即通过 flex），可能需要在样式属性上手动设置 `{width: undefined, height: undefined}`。

## 静态非图片资源

上述 `require` 语法也可用于在项目中静态包含音频、视频或文档文件。支持大多数常见文件类型，包括 `.mp3`、`.wav`、`.mp4`、`.mov`、`.html` 和 `.pdf`。完整列表请参阅 [打包器默认配置](https://github.com/facebook/metro/blob/master/packages/metro-config/src/defaults/defaults.js#L14-L44)。

您可以通过在 [Metro 配置](https://metrobundler.dev/docs/configuration) 中添加 [`assetExts` 解析器选项](https://metrobundler.dev/docs/configuration#resolver-options) 来添加对其他类型的支持。

需要注意的是，视频必须使用绝对定位而不是 `flexGrow`，因为目前非图片资源不会传递尺寸信息。对于直接链接到 Xcode 或 Android Assets 文件夹的视频，不会出现此限制。

## 来自混合应用资源的图片

如果您正在构建混合应用（部分 UI 在 React Native 中，部分 UI 在平台代码中），您仍然可以使用已捆绑到应用中的图片。

对于通过 Xcode asset catalogs 包含或在 Android drawable 文件夹中的图片，使用不带扩展名的图片名称：

```tsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

对于 Android assets 文件夹中的图片，使用 `asset:/` 方案：

```tsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

这些方法不提供安全检查。您需要保证这些图片在应用中可用。此外，您必须手动指定图片尺寸。

## 网络图片

您在应用中显示的许多图片在编译时可能不可用，或者您希望动态加载某些图片以减小二进制大小。与静态资源不同，_您需要手动指定图片的尺寸_。强烈建议您也使用 https，以满足 iOS 上的 [App Transport Security](publishing-to-app-store.md#1-enable-app-transport-security) 要求。

```tsx
// 正确
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// 错误
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

### 图片的网络请求

如果您想随图片请求设置 HTTP 动词、Headers 或 Body 等内容，可以通过在源对象上定义这些属性来实现：

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

有时，您可能会从 REST API 调用中获取编码后的图片数据。您可以使用 `'data:'` URI 方案来使用这些图片。与网络资源一样，_您需要手动指定图片的尺寸_。

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

在某些情况下，您可能只想在图片已存在于本地缓存中时才显示它，即作为高分辨率可用之前的低分辨率占位符。在其他情况下，您可能不关心图片是否过时，并愿意显示过时的图片以节省带宽。`cache` 源属性让您控制网络层如何与缓存交互。

- `default`: 使用 native 平台的默认策略。
- `reload`: URL 的数据将从原始源加载。不应使用现有缓存数据来满足 URL 加载请求。
- `force-cache`: 现有缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与请求对应的现有数据，则数据从原始源加载。
- `only-if-cached`: 现有缓存数据将用于满足请求，无论其年龄或过期日期如何。如果缓存中没有与 URL 加载请求对应的现有数据，则不会尝试从原始源加载数据，并且加载被视为失败。

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

请参阅 [CameraRoll](https://github.com/react-native-community/react-native-cameraroll) 以了解如何使用 `Images.xcassets` 之外的本地资源的示例。

### 最佳相机胶卷图片

iOS 会在相机胶卷中为同一图片保存多种尺寸，出于性能原因，选择尽可能接近的尺寸非常重要。当显示 200x200 缩略图时，您不希望使用全质量 3264x2448 图片作为源。如果有完全匹配的尺寸，React Native 会选择它，否则它将使用至少大 50% 的第一个尺寸，以避免在从接近尺寸调整大小时出现模糊。所有这些都是默认完成的，因此您不必担心编写繁琐（且容易出错）的代码来自己完成。

## 为什么不自动调整所有大小？

_在浏览器中_，如果您不给图片指定大小，浏览器将渲染一个 0x0 元素，下载图片，然后根据正确的大小渲染图片。这种行为的大问题是，随着图片加载，您的 UI 会到处跳动，这会导致非常糟糕的用户体验。这称为 [累积布局偏移](https://web.dev/cls/)。

_在 React Native 中_，此行为是故意未实现的。开发者需要提前知道远程图片的尺寸（或纵横比），这会增加工作量，但我们相信这会带来更好的用户体验。通过 `require('./my-icon.png')` 语法从应用包加载的静态图片_可以自动调整大小_，因为它们的尺寸在挂载时立即可用。

例如，`require('./my-icon.png')` 的结果可能是：

```tsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## 源作为对象

在 React Native 中，一个有趣的决定是 `src` 属性被命名为 `source`，并且不接受字符串，而是接受带有 `uri` 属性的对象。

```tsx
<Image source={{uri: 'something.jpg'}} />
```

在基础设施方面，原因是这允许我们将元数据附加到此对象。例如，如果您使用 `require('./my-icon.png')`，我们会添加有关其实际位置和尺寸的信息（不要依赖此事实，它将来可能会改变！）。这也是为了未来兼容性，例如我们可能希望在某个时候支持雪碧图，而不是输出 `{uri: ...}`，我们可以输出 `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}` 并在所有现有调用点透明地支持雪碧图。

在用户方面，这让您可以用有用的属性（例如图片尺寸）来注解对象，以便计算它将显示的大小。请随意将其用作数据结构来存储有关图片的更多信息。

## 通过嵌套实现背景图片

熟悉 Web 开发的开发者经常请求的一个功能是 `background-image`。要处理此用例，您可以使用 `<ImageBackground>` 组件，它具有与 `<Image>` 相同的 props，并可以向其中添加任何您想要分层叠加在其上方的子元素。

在某些情况下，您可能不想使用 `<ImageBackground>`，因为其实现比较基础。请参阅 `<ImageBackground>` 的 [文档](imagebackground.md) 以了解更多详情，并在需要时创建您自己的自定义组件。

```tsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

请注意，您必须指定一些宽度和高度样式属性。

## iOS 边框半径样式

请注意，iOS 的图片组件可能会忽略以下特定角落的边框半径样式属性：

- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomLeftRadius`
- `borderBottomRightRadius`

## 子线程解码

图片解码可能需要超过一帧的时间。这是 Web 上掉帧的主要原因之一，因为解码是在主线程中完成的。在 React Native 中，图片解码是在不同的线程中完成的。实际上，您已经需要处理图片尚未下载的情况，因此在解码期间多显示几帧占位符不需要任何代码更改。

## 配置 iOS 图片缓存限制

在 iOS 上，我们暴露了一个 API 来覆盖 React Native 的默认图片缓存限制。这应该在您的原生 AppDelegate 代码中调用（例如在 `didFinishLaunchingWithOptions` 内）。

```objectivec
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**参数：**

| 名称           | 类型   | 是否必填 | 描述             |
| -------------- | ------ | -------- | ----------------------- |
| imageSizeLimit | number | 是      | 图片缓存大小限制。 |
| totalCostLimit | number | 是      | 总缓存成本限制。 |

在上面的代码示例中，图片大小限制设置为 4 MB，总成本限制设置为 200 MB。
