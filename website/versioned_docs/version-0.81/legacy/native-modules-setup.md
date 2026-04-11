---
id: native-modules-setup
title: 原生模块 NPM 包设置
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

原生模块通常作为 npm 包分发，不同的是，除了常规的 JavaScript 代码外，它们还会包含每个平台的一些原生代码。若要了解更多关于 npm 包的信息，你可能会发现 [本指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) 很有用。

为了设置原生模块的基本项目结构，我们将使用名为 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create) 的社区工具。你可以进一步深入研究该库的工作原理，但就我们的需求而言，我们只需执行基本脚本：

```shell
npx create-react-native-library@latest react-native-awesome-module
```

其中 `react-native-awesome-module` 是你想要为新模块命名的名称。执行此操作后，你将进入 `react-native-awesome-module` 文件夹并通过运行以下命令来引导示例项目：

```shell
yarn
```

引导完成后，你将能够通过执行以下命令之一来启动示例应用：

```shell
# Android 应用
yarn example android
# iOS 应用
yarn example ios
```

完成上述所有步骤后，你将能够继续参考 [Android 原生模块](native-modules-android) 或 [iOS 原生模块](native-modules-ios) 指南来添加一些代码。
