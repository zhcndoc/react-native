---
id: native-platform
title: 原生平台
---

你的应用可能需要访问一些平台特性，而这些特性并不能直接通过 react-native 或社区维护的数百个 [第三方库](https://reactnative.directory/) 获得。也许你想从 JavaScript 运行时重用一些现有的 Objective-C、Swift、Java、Kotlin 或 C++ 代码。无论原因是什么，React Native 都提供了一组强大的 API，用于将你的原生代码连接到你的 JavaScript 应用代码。

本指南介绍：

- **原生模块：** 没有面向用户的用户界面（UI）的原生库。示例包括持久化存储、通知、网络事件。你的用户可以将它们作为 JavaScript 函数和对象访问。
- **原生组件：** 通过 React 组件向应用的 JavaScript 代码提供的原生平台视图、组件和控制器。

:::note
你之前可能熟悉：

- [旧版原生模块](./legacy/native-modules-intro);
- [旧版原生组件](./legacy/native-components-android);

这些是我们已弃用的原生模块和组件 API。借助我们的互操作层，你仍然可以在新架构中使用其中许多旧版库。你应该考虑：

- 使用替代库，
- 升级到对新架构提供一流支持的更新版本库，或者
- 你自己将这些库移植到 Turbo 原生模块或 Fabric 原生组件。

:::

1. 原生模块
   - [Android 和 iOS](turbo-native-modules.md)
   - [使用 C++ 的跨平台](the-new-architecture/pure-cxx-modules.md)
   - [高级：自定义 C++ 类型](the-new-architecture/custom-cxx-types.md)
2. Fabric 原生组件
   - [Android 和 iOS](fabric-native-components.md)
