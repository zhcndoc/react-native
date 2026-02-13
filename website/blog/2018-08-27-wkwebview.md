---
title: 介绍新的 iOS WebViews
author: Ramanpreet Nara
authorTitle: Facebook 软件工程师
authorURL: 'https://github.com/rsnara'
tags: [工程]
---

长期以来，Apple 一直鼓励使用 WKWebView 代替 UIWebViews。在即将发布的 iOS 12 中，[UIWebViews 将被正式弃用](https://developer.apple.com/videos/play/wwdc2018/234/?time=104)。React Native 的 iOS WebView 实现严重依赖于 UIWebView 类。因此，鉴于这些发展，我们为 React Native 的 WebView 组件构建了一个新的使用 WKWebView 的原生 iOS 后端。

这些更改的收尾工作已经合并在了 [这个提交](https://github.com/facebook/react-native/commit/33b353c97c31190439a22febbd3d2a9ead49d3c9) 中，并将在 0.57 版本中提供。

要启用这个新实现，请使用 [`useWebKit`](https://reactnative.dev/docs/0.63/webview#usewebkit) 属性：

```js
<WebView
  useWebKit={true}
  source={{url: 'https://www.google.com'}}
/>
```

## 改进

`UIWebView` 没有合理的方式来促进 WebView 中运行的 JavaScript 与 React Native 之间的通信。当从 WebView 发送消息时，我们依赖一种 hack 方式将消息传递给 React Native。简而言之，我们把消息数据编码到一个带有特殊 scheme 的 url 中，并导航 WebView 到该 url。在原生端，我们拦截并取消了这次导航，从 url 中解析数据，最终调用 React Native。此实现容易出错且不安全。我很高兴地宣布，我们利用了 `WKWebView` 的特性，完全替换了这种方式。

WKWebView 相比 UIWebView 的其他好处包括更快的 JavaScript 执行速度和多进程架构。详情请见此 [2014 WWDC](https://developer.apple.com/videos/play/wwdc2014/206)。

## 注意事项

如果你的组件使用了以下属性，切换到 WKWebView 时可能会遇到问题。当前我们建议避免使用这些属性：

**行为不一致：**

`automaticallyAdjustContentInsets` 和 `contentInsets`（[提交](https://github.com/facebook/react-native/commit/bacfd9297657569006bab2b1f024ad1f289b1b27)）

当你给 `WKWebView` 添加 contentInsets 时，它不会改变 `WKWebView` 的视口大小。视口大小保持跟框架一样大。而在 `UIWebView` 中，视口会实际改变（如果 contentInsets 为正值，视口会变小）。

`backgroundColor`（[提交](https://github.com/facebook/react-native/commit/215fa14efc2a817c7e038075163491c8d21526fd)）

在新的 iOS WebView 实现中，如果你使用此属性，背景颜色可能会闪烁。此外，`WKWebView` 对透明背景的渲染与 `UIWebView` 不同。更多细节请参考提交描述。

**不支持：**

`scalesPageToFit`（[提交](https://github.com/facebook/react-native/commit/b18fddadfeae5512690a0a059a4fa80c864f43a3)）

WKWebView 不支持 scalesPageToFit 属性，因此我们无法在 React Native 的 WebView 组件上实现此功能。