---
id: out-of-tree-platforms
title: 树外平台
---

React Native 不仅适用于 Android 和 iOS 设备——我们的合作伙伴和社区维护着一些将 React Native 带到其他平台的项目，例如：

**来自合作伙伴**

- [React Native macOS](https://github.com/microsoft/react-native-macos) ——适用于 macOS 和 Cocoa 的 React Native
- [React Native Windows](https://github.com/microsoft/react-native-windows) ——适用于 Microsoft 的 Universal Windows Platform（UWP）的 React Native
- [React Native visionOS](https://github.com/callstack/react-native-visionos) ——适用于 Apple 的 visionOS 的 React Native
- [React Native OpenHarmony](https://atomgit.com/CPF-RN/ohos_react_native) ——适用于 OpenHarmony 的 React Native

**来自社区**

- [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) ——适用于 Apple TV 和 Android TV 设备的 React Native
- [React Native Web](https://github.com/necolas/react-native-web) ——使用 React DOM 在 Web 上运行的 React Native
- [React Native Skia](https://github.com/react-native-skia/react-native-skia) ——使用 [Skia](https://skia.org/) 作为渲染器的 React Native。目前支持 Linux 和 macOS

## 创建你自己的 React Native 平台

从头开始创建 React Native 平台的过程目前仍没有很完善的文档——新架构和 [Fabric](/architecture/fabric-renderer) 的目标之一就是让平台维护更加容易。

### 打包

从 React Native 0.57 开始，你现在可以将自己的 React Native 平台注册到 React Native 的 JavaScript 打包器 [Metro](https://metrobundler.dev/)。这意味着你可以将 `--platform example` 传递给 `npx react-native bundle`，它会查找带有 `.example.js` 后缀的 JavaScript 文件。

要使用 RNPM 注册你的平台，你的模块名称必须匹配以下模式之一：

- `react-native-example` ——它会搜索所有以 `react-native-` 开头的顶层模块
- `@org/react-native-example` ——它会在任意作用域下搜索以 `react-native-` 开头的模块
- `@react-native-example/module` ——它会在名称以 `@react-native-` 开头的作用域下搜索所有模块

你还必须在 `package.json` 中包含如下条目：

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

`"providesModuleNodeModules"` 是一个模块数组，这些模块会被添加到 Haste 模块搜索路径中；`"platforms"` 是一个平台后缀数组，这些后缀会被添加为有效平台
