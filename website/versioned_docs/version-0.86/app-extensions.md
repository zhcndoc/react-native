---
id: app-extensions
title: App Extensions
---

App 扩展可让你在主应用之外提供自定义功能和内容。iOS 上有不同类型的 App 扩展，它们都在 [App Extension Programming Guide](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/index.html#//apple_ref/doc/uid/TP40014214-CH20-SW1) 中有所介绍。在本指南中，我们将简要说明如何在 iOS 上利用 App 扩展。

## 扩展中的内存使用

由于这些扩展是在常规应用沙盒之外加载的，很有可能会同时加载多个 App 扩展。正如你所预期的，这些扩展的内存使用限制很小。在开发 App 扩展时请牢记这一点。我们始终强烈建议你在真机上测试你的应用，在开发 App 扩展时尤其如此：开发者经常发现他们的扩展在 iOS 模拟器中运行正常，但用户却反馈该扩展在真机上无法加载。

### Today 小组件

Today 小组件的内存限制为 16 MB。实际上，使用 React Native 实现的 Today 小组件可能表现不稳定，因为其内存使用往往过高。如果你的 Today 小组件超过了内存限制，你会看到 “Unable to Load” 消息：

![](/docs/assets/TodayWidgetUnableToLoad.jpg)

务必在真机上测试你的 App 扩展，但请注意，这可能还不够，尤其是在处理 Today 小组件时。使用 Debug 配置构建时更容易超过内存限制，而使用 Release 配置构建时不会立刻失败。我们强烈建议你使用 [Xcode's Instruments](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/index.html) 来分析你在真实环境中的内存使用情况，因为你的 Release 配置构建很可能已经非常接近 16 MB 的限制。在这类情况下，执行一些常见操作，例如从 API 获取数据，就可能很快超出 16 MB 的限制。

如果你想尝试 React Native Today 小组件实现的内存限制，可以试着扩展 [react-native-today-widget](https://github.com/matejkriz/react-native-today-widget/) 中的示例项目。

### 其他 App 扩展

其他类型的 App 扩展相比 Today 小组件具有更高的内存限制。例如，自定义键盘扩展限制为 48 MB，而共享扩展限制为 120 MB。使用 React Native 来实现这类 App 扩展更可行。一个概念验证示例是 [react-native-ios-share-extension](https://github.com/andrewsardone/react-native-ios-share-extension)。
