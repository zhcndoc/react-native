# 什么是 Codegen？

**Codegen** 是一个避免编写大量重复代码的工具。使用 Codegen **不是强制的**：你可以手动编写所有生成的代码。然而，**Codegen** 生成的骨架代码可以为你节省大量时间。

React Native 每次构建 iOS 或 Android 应用时都会自动调用 **Codegen**。偶尔，你可能希望手动运行 **Codegen** 脚本，以了解实际生成了哪些类型和文件：这在开发 Turbo 原生模块和 Fabric 原生组件时是一个常见场景。

<!-- TODO: 添加指向 TM 和 FC 的链接 -->

## Codegen 是如何工作的

**Codegen** 是一个与 React Native 应用紧密耦合的过程。**Codegen** 脚本位于 `react-native` NPM 包内，应用在构建时会调用这些脚本。

**Codegen** 会遍历项目中的文件夹，从你在 `package.json` 中指定的目录开始，寻找包含自定义模块和组件规范（或 specs）的特定 JS 文件。Spec 文件是用类型化方言编写的 JS 文件：React Native 目前支持 Flow 和 TypeScript。

每次 **Codegen** 找到 spec 文件时，它都会生成与之关联的样板代码。**Codegen** 会生成一些 C++ 胶水代码，然后生成平台特定的代码，Android 使用 Java，iOS 使用 Objective-C++。
