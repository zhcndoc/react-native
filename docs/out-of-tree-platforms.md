---
id: out-of-tree-platforms
title: 树外平台
---

React Native 不仅适用于 Android 和 iOS 设备——我们的合作伙伴和社区也维护着将 React Native 带到其他平台的项目，例如：

**来自合作伙伴**

- [React Native macOS](https://github.com/microsoft/react-native-macos) - 面向 macOS 和 Cocoa 的 React Native。
- [React Native Windows](https://github.com/microsoft/react-native-windows) - 面向微软通用 Windows 平台（UWP）的 React Native。
- [React Native visionOS](https://github.com/callstack/react-native-visionos) - 面向苹果 visionOS 的 React Native。
- [React Native OpenHarmony](https://atomgit.com/CPF-RN/ohos_react_native) - 面向 OpenHarmony 的 React Native。

**来自社区**

- [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) - 面向 Apple TV 和 Android TV 设备的 React Native。
- [React Native Web](https://github.com/necolas/react-native-web) - 使用 React DOM 在网页上运行的 React Native。
- [React Native Skia](https://github.com/react-native-skia/react-native-skia) - 使用 [Skia](https://skia.org/) 作为渲染器的 React Native。目前支持 Linux 和 macOS。

## 创建你自己的 React Native 平台

从零开始创建 React Native 平台的过程仍然没有得到很完善的文档说明——New Architecture 和 [Fabric](/architecture/fabric-renderer) 的目标之一就是让平台维护变得更容易。

### 打包

从 React Native 0.57 起，你现在可以将你的 React Native 平台注册到 React Native 的 JavaScript 打包器 [Metro](https://metrobundler.dev/)。这意味着你可以在 `npx react-native bundle` 中传入 `--platform example`，它会查找后缀为 `.example.js` 的 JavaScript 文件。

要将你的平台注册到 RNPM，你的模块名称必须匹配以下模式之一：

- `react-native-example` - 它会搜索所有以 `react-native-` 开头的顶层模块
- `@org/react-native-example` - 它会搜索任何作用域下以 `react-native-` 开头的模块
- `@react-native-example/module` - 它会搜索所有名称以 `@react-native-` 开头的作用域下的模块

你还必须在你的 `package.json` 中包含如下条目：

```json
{
  "rnpm": {
    "haste": {
      "providesModuleNodeModules": ["react-native-example"],
      "platforms": ["example"]
    }
  }
}
```

`"providesModuleNodeModules"` 是一个模块数组，它们会被添加到 Haste 模块搜索路径中；`"platforms"` 是一个平台后缀数组，它们将被添加为有效的平台。
