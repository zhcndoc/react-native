---
id: native-platform
title: 原生平台
---

您的应用可能需要访问 react-native 或社区维护的数百个 [第三方库](https://reactnative.directory/) 中没有直接提供的平台功能。也许您想从 JavaScript 运行时重用一些现有的 Objective-C、Swift、Java、Kotlin 或 C++ 代码。无论出于什么原因，React Native 都提供了一套强大的 API，帮助您将原生代码连接到 JavaScript 应用代码中。

本指南介绍：

- **原生模块（Native Modules）：** 没有用户界面（UI）的原生库。例如持久存储、通知、网络事件。这些作为 JavaScript 函数和对象供用户访问。
- **原生组件（Native Component）：** 原生平台视图、控件和控制器，通过 React 组件供应用的 JavaScript 代码使用。

:::note
您可能以前熟悉：

- [旧版原生模块](./legacy/native-modules-intro)；
- [旧版原生组件](./legacy/native-components-android)；

这些是我们已弃用的原生模块和组件 API。感谢我们的互操作层，您仍然可以在新架构中使用许多这些旧库。您应考虑：

- 使用替代库，
- 升级到对新架构有一流支持的新版库，
- 或亲自将这些库移植到 Turbo 原生模块或 Fabric 原生组件。

:::

1. 原生模块
   - [Android 和 iOS](turbo-native-modules.md)
   - [跨平台 C++](the-new-architecture/pure-cxx-modules.md)
   - [高级：自定义 C++ 类型](the-new-architecture/custom-cxx-types.md)
2. Fabric 原生组件
   - [Android 和 iOS](fabric-native-components.md)