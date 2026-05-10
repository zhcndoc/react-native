---
id: native-modules-intro
title: 原生模块简介
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

有时，React Native 应用需要访问 JavaScript 中默认不可用的原生平台 API，例如用于访问 Apple Pay 或 Google Pay 的原生 API。你可能希望复用一些现有的 Objective-C、Swift、Java 或 C++ 库，而不必在 JavaScript 中重新实现它们，或者为图像处理之类的任务编写一些高性能、多线程的代码。

NativeModule 系统将 Java/Objective-C/C++（原生）类的实例作为 JS 对象暴露给 JavaScript（JS），从而允许你在 JS 中执行任意原生代码。虽然我们并不期望这个功能成为常规开发流程的一部分，但它的存在是至关重要的。如果 React Native 没有导出你的 JS 应用所需的原生 API，你应该能够自己导出它！

## 原生模块设置

为你的 React Native 应用编写原生模块有不同的方式：

1. 创建一个可在你的 React Native 应用中导入的本地库。阅读 [创建本地库](local-library-setup) 指南以了解更多信息。
2. 直接在你的 React Native 应用的 iOS/Android 项目中编写
3. 作为一个可由你或其他 React Native 应用安装为依赖项的 NPM 包。

本指南将首先带你了解如何在 React Native 应用中直接实现一个原生模块。不过，你将在以下指南中构建的原生模块可以作为 NPM 包分发。如果你对此感兴趣，请查看 [将原生模块作为 NPM 包设置](native-modules-setup) 指南。

## 开始使用

在以下章节中，我们将通过指南带你了解如何在 React Native 应用中直接构建一个原生模块。作为前提，你需要有一个可供开发的 React Native 应用。如果你还没有，可以按照 [这里](../getting-started) 的步骤来设置一个 React Native 应用。

设想你想要在 React Native 应用中通过 JavaScript 访问 iOS/Android 原生日历 API，以便创建日历事件。React Native 并没有暴露用于与原生日历库通信的 JavaScript API。不过，通过原生模块，你可以编写与原生日历 API 通信的原生代码。然后，你就可以在 React Native 应用中通过 JavaScript 调用这段原生代码。

在接下来的章节中，你将为 [Android](native-modules-android) 和 [iOS](native-modules-ios) 创建这样一个日历原生模块。
