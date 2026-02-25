---
id: native-modules-setup
title: 原生模块 NPM 包设置
---

import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'

<NativeDeprecated />

原生模块通常以 npm 包的形式分发，不过除了常规的 JavaScript 代码外，还会包含每个平台特定的原生代码。若想了解更多关于 npm 包的信息，你可以参考 [这篇指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)。

为了搭建原生模块的基本项目结构，我们将使用社区工具 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create)。你可以进一步深入了解该库的工作原理，但就我们的需求而言，只需执行基础脚本：

```shell
npx create-react-native-library@latest react-native-awesome-module
```

其中 `react-native-awesome-module` 是你想为新模块指定的名称。完成后，进入 `react-native-awesome-module` 文件夹，并通过运行以下命令来初始化示例项目：

```shell
yarn
```

初始化完成后，你可以通过执行以下命令之一来启动示例应用：

```shell
# Android 应用
yarn example android
# iOS 应用
yarn example ios
```

完成以上所有步骤后，你可以继续参阅[Android 原生模块](native-modules-android)或[iOS 原生模块](native-modules-ios)指南，添加具体代码。