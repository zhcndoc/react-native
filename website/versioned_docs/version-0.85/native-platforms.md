---
id: native-platform
title: 原生平台
---

您的应用程序可能需要访问某些平台功能，而这些功能无法直接从 react-native 或社区维护的数百个 [第三方库](https://reactnative.directory/) 中获得。也许您想从 JavaScript 运行时复用一些现有的 Objective-C、Swift、Java、Kotlin 或 C++ 代码。无论出于何种原因，React Native 都提供了一套强大的 API，用于将您的原生代码连接到 JavaScript 应用程序代码。

本指南介绍：

- **原生模块：** 没有用户界面 (UI) 的原生库。示例包括持久存储、通知、网络事件。用户可以通过 JavaScript 函数和对象访问它们。
- **原生组件：** 原生平台视图、小部件和控制器，可通过 React 组件供应用程序的 JavaScript 代码使用。

:::note
您之前可能熟悉以下内容：

- [旧版原生模块](./legacy/native-modules-intro);
- [旧版原生组件](./legacy/native-components-android);

这些是我们已弃用的原生模块和组件 API。得益于我们的互操作层，您仍然可以在新架构中使用许多这些旧版库。您应该考虑：

- 使用替代库，
- 升级到对新架构有一流支持的更新库版本，或
- 亲自将这些库移植到 Turbo 原生模块或 Fabric 原生组件。

:::

1. 原生模块
   - [Android 和 iOS](turbo-native-modules.md)
   - [使用 C++ 进行跨平台开发](the-new-architecture/pure-cxx-modules.md)
   - [高级：自定义 C++ 类型](the-new-architecture/custom-cxx-types.md)
2. Fabric 原生组件
   - [Android 和 iOS](fabric-native-components.md)
