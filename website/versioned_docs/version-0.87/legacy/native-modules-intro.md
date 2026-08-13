---
id: native-modules-intro
title: Native Modules 简介
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

有时，React Native 应用需要访问 JavaScript 默认无法使用的原生平台 API，例如用于访问 Apple 或 Google Pay 的原生 API。你可能希望重用现有的 Objective-C、Swift、Java 或 C++ 库，而不必在 JavaScript 中重新实现；或者编写一些用于图像处理等场景的高性能、多线程代码。

NativeModule 系统将 Java/Objective-C/C++（原生）类的实例作为 JS 对象暴露给 JavaScript（JS），从而允许你在 JS 中执行任意原生代码。虽然我们并不认为此功能会成为常规开发流程的一部分，但它的存在至关重要。如果 React Native 没有导出你的 JS 应用所需的原生 API，你应该能够自行导出！

## 原生模块设置

有多种方式可以为你的 React Native 应用编写原生模块：

1. 创建一个可以在 React Native 应用中导入的本地库。阅读[创建本地库](local-library-setup)指南以了解更多信息。
2. 直接在 React Native 应用的 iOS/Android 项目中创建
3. 创建一个 NPM 软件包，以便你的 React Native 应用或其他 React Native 应用将其作为依赖项安装。

本指南将首先带你了解如何直接在 React Native 应用中实现原生模块。不过，你将在以下指南中构建的原生模块也可以作为 NPM 软件包进行分发。如果你对此感兴趣，请查看[将原生模块设置为 NPM 软件包](native-modules-setup)指南。

## 开始使用

在以下部分中，我们将通过指南带你了解如何直接在 React Native 应用中构建原生模块。作为前提条件，你需要有一个可用于开发的 React Native 应用。如果你还没有 React Native 应用，可以按照[此处](../getting-started)的步骤进行设置。

假设你希望在 React Native 应用中通过 JavaScript 访问 iOS/Android 原生日历 API，以便创建日历事件。React Native 没有提供用于与原生日历库通信的 JavaScript API。不过，通过原生模块，你可以编写与原生日历 API 通信的原生代码。然后，你可以在 React Native 应用中通过 JavaScript 调用这些原生代码。

在以下部分中，你将分别为 [Android](native-modules-android) 和 [iOS](native-modules-ios) 创建这样的 Calendar 原生模块。
