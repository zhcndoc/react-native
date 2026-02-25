---
id: app-extensions
title: 应用扩展
---

应用扩展允许您在主应用之外提供自定义功能和内容。iOS 上有不同类型的应用扩展，所有内容均涵盖在 [应用扩展编程指南](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/index.html#//apple_ref/doc/uid/TP40014214-CH20-SW1) 中。在本指南中，我们将简要介绍如何利用 iOS 上的应用扩展。

## 扩展中的内存使用

由于这些扩展加载在常规应用沙盒之外，极有可能多个应用扩展会同时被加载。正如您所料，这些扩展有较小的内存使用限制。在开发应用扩展时请牢记这一点。强烈建议您在真实设备上测试您的应用，开发应用扩展时尤其如此：开发者常发现扩展在 iOS 模拟器中运行正常，但用户却反馈扩展在真实设备上无法加载。

### 今日小组件（Today widget）

今日小组件的内存限制为 16 MB。事实上，使用 React Native 实现的今日小组件可能因内存占用过高而运行不稳定。如果您的今日小组件超过内存限制，会出现“无法加载”（Unable to Load）提示：

![](/docs/assets/TodayWidgetUnableToLoad.jpg)

务必确保在真实设备上测试您的应用扩展，但请注意这可能仍不充分，特别是处理今日小组件时。调试配置的构建更容易超过内存限制，而发布配置的构建则不会立即失败。我们强烈建议您使用 [Xcode 的 Instruments](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/index.html) 来分析真实环境下的内存使用情况，因为发布配置的构建很可能已接近 16 MB 限制。此类情况下，只需执行诸如从 API 获取数据的常见操作，即可能轻易超出 16 MB 内存限制。

想要尝试 React Native 今日小组件实现的内存限制，可以尝试扩展示例项目 [react-native-today-widget](https://github.com/matejkriz/react-native-today-widget/)。

### 其他应用扩展

其他类型的应用扩展的内存限制比今日小组件更大。例如，Custom Keyboard（自定义键盘）扩展的限制为 48 MB，Share（分享）扩展的限制为 120 MB。使用 React Native 实现这类应用扩展的可行性更高。一个概念验证示例是 [react-native-ios-share-extension](https://github.com/andrewsardone/react-native-ios-share-extension)。