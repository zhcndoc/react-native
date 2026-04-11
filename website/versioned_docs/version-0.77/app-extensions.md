---
id: app-extensions
title: 应用扩展
---

应用扩展允许你在主应用之外提供自定义功能和内容。iOS 上有不同类型的应用扩展，它们都在 [应用扩展编程指南](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/index.html#//apple_ref/doc/uid/TP40014214-CH20-SW1) 中涵盖。在本指南中，我们将简要介绍如何在 iOS 上利用应用扩展。

## 扩展中的内存使用

由于这些扩展是在常规应用沙盒之外加载的，很可能会有多个应用扩展同时加载。正如你所料，这些扩展有很小的内存使用限制。在开发应用扩展时请记住这一点。始终强烈建议在真实设备上测试你的应用程序，在开发应用扩展时更是如此：开发人员经常发现他们的扩展在 iOS 模拟器中运行良好，却收到用户报告说他们的扩展在真实设备上无法加载。

### Today 小组件

Today 小组件的内存限制是 16 MB。事实上，使用 React Native 实现的 Today 小组件可能工作不可靠，因为内存使用往往过高。如果你的 Today 小组件显示消息 'Unable to Load'，你可以判断它是否超出了内存限制：

![](/docs/assets/TodayWidgetUnableToLoad.jpg)

务必确保在真实设备上测试你的应用扩展，但要注意这可能还不够，尤其是在处理 Today 小组件时。Debug 配置的构建更可能超出内存限制，而 Release 配置的构建不会立即失败。我们强烈建议你使用 [Xcode 的 Instruments](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/index.html) 来分析你的实际内存使用情况，因为你的 Release 配置构建很可能非常接近 16 MB 限制。在这种情况下，执行常见操作（例如从 API 获取数据）可能会迅速超过 16 MB 限制。

为了尝试 React Native Today 小组件实现的限制，试着扩展 [react-native-today-widget](https://github.com/matejkriz/react-native-today-widget/) 中的示例项目。

### 其他应用扩展

其他类型的应用扩展比 Today 小组件有更大的内存限制。例如，自定义键盘扩展限制为 48 MB，分享扩展限制为 120 MB。使用 React Native 实现此类应用扩展更为可行。一个概念验证示例是 [react-native-ios-share-extension](https://github.com/andrewsardone/react-native-ios-share-extension)。
