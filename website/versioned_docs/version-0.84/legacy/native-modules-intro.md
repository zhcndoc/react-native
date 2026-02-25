---
id: native-modules-intro
title: 原生模块简介
---

import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'

<NativeDeprecated />

有时候，React Native 应用需要访问 JavaScript 默认不可用的原生平台 API，例如访问 Apple Pay 或 Google Pay 的原生 API。也许你想重用一些现有的 Objective-C、Swift、Java 或 C++ 库，而无需用 JavaScript 重新实现，或者编写一些高性能、多线程的代码用于图像处理等功能。

NativeModule 系统将 Java/Objective-C/C++（原生）类的实例以 JS 对象的形式暴露给 JavaScript (JS)，从而允许你在 JS 中执行任意的原生代码。虽然我们不期望这个功能成为常规开发流程的一部分，但它的存在非常关键。如果 React Native 没有导出你的 JS 应用需要的原生 API，你应该能够自己导出它！

## 原生模块设置

为你的 React Native 应用编写原生模块有几种不同的方式：

1. 创建一个可以在你的 React Native 应用中导入的本地库。详情请阅读 [创建本地库](local-library-setup) 指南。
2. 直接在你的 React Native 应用的 iOS/Android 项目中实现。
3. 作为一个 NPM 包被你的/其他 React Native 应用安装作为依赖。

本指南将首先带你了解如何直接在 React Native 应用中实现一个原生模块。不过，你按照本指南构建的原生模块也可以作为一个 NPM 包分发。如果你对此感兴趣，请查看 [设置原生模块为 NPM 包](native-modules-setup) 指南。

## 入门

在接下来的章节中，我们将带你通过指南，学习如何直接在 React Native 应用中构建原生模块。作为前提，你需要有一个 React Native 应用环境。如果你还没有，可以按照 [这里](../getting-started) 的步骤来搭建。

假设你想从 React Native 应用中的 JavaScript 访问 iOS/Android 的原生日历 API 来创建日历事件。React Native 并没有暴露一个 JavaScript API 用于与原生日历库通信。然而，通过原生模块，你可以编写与原生日历 API 通信的原生代码。然后，你可以通过 JavaScript 在 React Native 应用中调用这些原生代码。

在接下来的章节中，你将为 [Android](native-modules-android) 和 [iOS](native-modules-ios) 创建这样的 Calendar 原生模块。