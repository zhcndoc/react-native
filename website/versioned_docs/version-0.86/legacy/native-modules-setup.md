---
id: native-modules-setup
title: Native Modules NPM Package Setup
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

原生模块通常以 npm 包的形式分发，不过除了常规的 JavaScript 之外，它们还会为每个平台包含一些原生代码。要了解更多关于 npm 包的信息，你可能会觉得 [这份指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) 很有用。

为了为原生模块设置基本的项目结构，我们将使用社区工具 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create)。你可以进一步深入了解这个库的工作方式，但就我们的需求而言，我们只会执行基础脚本：

```shell
npx create-react-native-library@latest react-native-awesome-module
```

其中 `react-native-awesome-module` 是你希望为新模块起的名称。完成后，你将进入 `react-native-awesome-module` 文件夹，并通过运行以下命令来引导示例项目：

```shell
yarn
```

当引导完成后，你将可以通过执行以下命令之一来启动示例应用：

```shell
# Android 应用
yarn example android
# iOS 应用
yarn example ios
```

当上述所有步骤完成后，你就可以继续阅读 [Android 原生模块](native-modules-android) 或 [iOS 原生模块](native-modules-ios) 指南来添加一些代码。
