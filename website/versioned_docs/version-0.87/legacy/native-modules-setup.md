---
id: native-modules-setup
title: 原生模块 NPM 软件包设置
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

原生模块通常以 npm 软件包的形式分发，不同之处在于，除了常规的 JavaScript 代码外，它们还会包含各个平台对应的一些原生代码。要进一步了解 npm 软件包，你可能会发现[这份指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)很有帮助。

为了搭建原生模块的基本项目结构，我们将使用名为 [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create) 的社区工具。你可以进一步深入了解该库的工作原理，但对于我们的需求，我们只需执行基本脚本：

```shell
npx create-react-native-library@latest react-native-awesome-module
```

其中，`react-native-awesome-module` 是你希望为新模块使用的名称。完成后，进入 `react-native-awesome-module` 文件夹，并运行以下命令初始化示例项目：

```shell
yarn
```

初始化完成后，你可以执行以下命令之一来启动示例应用：

```shell
# Android app
yarn example android
# iOS app
yarn example ios
```

完成上述所有步骤后，你就可以继续阅读 [Android 原生模块](native-modules-android) 或 [iOS 原生模块](native-modules-ios) 指南，以添加一些代码。
