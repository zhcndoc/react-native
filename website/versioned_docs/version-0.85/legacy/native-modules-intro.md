---
id: native-modules-intro
title: 原生模块简介
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

有时，React Native 应用需要访问 JavaScript 中默认不可用的原生平台 API，例如访问 Apple 或 Google Pay 的原生 API。也许你想复用一些现有的 Objective-C、Swift、Java 或 C++ 库，而不必在 JavaScript 中重新实现它们，或者为图像处理等内容编写一些高性能、多线程的代码。

NativeModule 系统将 Java/Objective-C/C++（原生）类的实例作为 JS 对象暴露给 JavaScript（JS），从而允许你在 JS 内部执行任意原生代码。虽然我们不期望此功能成为常规开发过程的一部分，但它的存在至关重要。如果 React Native 没有导出你的 JS 应用所需的原生 API，你应该能够自己导出它！

## 原生模块设置

为你的 React Native 应用程序编写原生模块有不同的方法：

1. 创建一个可以在你的 React Native 应用程序中导入的本地库。阅读 [创建本地库](local-library-setup) 指南以了解更多。
2. 直接在你的 React Native 应用程序的 iOS/Android 项目中
3. 作为一个 NPM 包，可以由你的/其他 React Native 应用程序作为依赖项安装。

本指南将首先带你了解如何在 React Native 应用程序中直接实现原生模块。但是，你在以下指南中构建的原生模块可以作为 NPM 包分发。如果你感兴趣，请查看 [将原生模块设置为 NPM 包](native-modules-setup) 指南。

## 开始使用

在以下部分中，我们将带你了解如何在 React Native 应用程序中直接构建原生模块的指南。作为先决条件，你需要一个供你使用的 React Native 应用程序。如果你还没有，可以按照 [此处](../getting-started) 的步骤设置一个 React Native 应用程序。

假设你想在 React Native 应用程序中从 JavaScript 访问 iOS/Android 原生日历 API 以创建日历事件。React Native 没有暴露与原生日历库通信的 JavaScript API。但是，通过原生模块，你可以编写与原生日历 API 通信的原生代码。然后你可以在你的 React Native 应用程序中通过 JavaScript 调用该原生代码。

在以下部分中，你将为 [Android](native-modules-android) 和 [iOS](native-modules-ios) 创建这样一个日历原生模块。
