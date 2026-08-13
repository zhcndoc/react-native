---
id: app-extensions
title: 应用扩展
---

应用扩展让你能够在主应用之外提供自定义功能和内容。iOS 上有不同类型的应用扩展，相关内容都包含在 [App Extension Programming Guide](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/index.html#//apple_ref/doc/uid/TP40014214-CH20-SW1) 中。在本指南中，我们将简要介绍如何在 iOS 上利用应用扩展。

## 扩展中的内存使用

由于这些扩展是在常规应用沙盒之外加载的，因此很可能会同时加载多个应用扩展。正如你所料，这些扩展的内存使用限制都很小。在开发应用扩展时，请牢记这一点。始终强烈建议在真实设备上测试你的应用，而在开发应用扩展时更应如此：开发者经常会发现他们的扩展在 iOS Simulator 中运行良好，但随后却收到用户报告，称其扩展无法在真实设备上加载。

### Today widget

Today widget 的内存限制为 16 MB。事实上，使用 React Native 实现的 Today widget 可能运行不稳定，因为其内存使用量往往过高。如果显示“Unable to Load”消息，就可以判断你的 Today widget 是否超出了内存限制：

![](/docs/assets/TodayWidgetUnableToLoad.jpg)

始终确保在真实设备上测试应用扩展，但请注意，这可能还不够，尤其是在处理 Today widget 时。使用调试配置构建的版本更有可能超出内存限制，而使用发布配置构建的版本不会立即失败。我们强烈建议使用 [Xcode 的 Instruments](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/index.html) 来分析真实环境中的内存使用情况，因为你的发布配置构建版本很可能已经非常接近 16 MB 的限制。在这种情况下，执行一些常见操作（例如从 API 获取数据）就可能很快超过 16 MB 的限制。

若要试验 React Native Today widget 实现的限制，请尝试扩展 [react-native-today-widget](https://github.com/matejkriz/react-native-today-widget/) 中的示例项目。

### 其他应用扩展

其他类型的应用扩展拥有比 Today widget 更高的内存限制。例如，自定义键盘扩展的限制为 48 MB，而共享扩展的限制为 120 MB。使用 React Native 实现这类应用扩展更具可行性。[react-native-ios-share-extension](https://github.com/andrewsardone/react-native-ios-share-extension) 就是一个概念验证示例。
