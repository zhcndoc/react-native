# 什么是 Codegen？

**Codegen** 是一个用来避免编写大量重复代码的工具。使用 Codegen **不是强制性的**：你也可以手动编写所有生成的代码。然而，Codegen 会生成脚手架代码，能够为你节省大量时间。

React Native 会在每次构建 iOS 或 Android 应用时自动调用 Codegen。有时，你可能希望手动运行 Codegen 脚本，以便了解哪些类型和文件实际上被生成了：这在开发 [Turbo 原生模块](/docs/turbo-native-modules-introduction) 和 Fabric 原生组件时是一个常见场景。

<!-- TODO: 添加 TM 和 FC 的链接 -->

## Codegen 如何工作

**Codegen** 是一个与 React Native 应用紧密结合的过程。Codegen 脚本存放在 `react-native` NPM 包内，应用在构建时调用这些脚本。

Codegen 会遍历你的项目中的文件夹，从你在 `package.json` 中指定的目录开始，寻找一些特定的 JS 文件，这些文件包含了自定义模块和组件的规范（或称 specs）。规范文件是用带类型的方言写成的 JS 文件：React Native 当前支持 Flow 和 TypeScript。

每当 Codegen 发现一个规范文件时，它会生成与之关联的样板代码。Codegen 先生成 C++ 的连接代码，然后依据平台生成特定代码，Android 使用 Java，iOS 使用 Objective-C++。