---
id: out-of-tree-platforms
title: 树外平台
---

React Native 不仅适用于 Android 和 iOS 设备——我们的合作伙伴和社区维护着将 React Native 带到其他平台的项目，例如：

**来自合作伙伴**

- [React Native macOS](https://github.com/microsoft/react-native-macos) - 适用于 macOS 和 Cocoa 的 React Native。
- [React Native Windows](https://github.com/microsoft/react-native-windows) - 适用于微软通用 Windows 平台 (UWP) 的 React Native。
- [React Native visionOS](https://github.com/callstack/react-native-visionos) - 适用于 Apple visionOS 的 React Native。

**来自社区**

- [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) - 适用于 Apple TV 和 Android TV 设备的 React Native。
- [React Native Web](https://github.com/necolas/react-native-web) - 使用 React DOM 在 Web 上运行的 React Native。
- [React Native Skia](https://github.com/react-native-skia/react-native-skia) - 使用 [Skia](https://skia.org/) 作为渲染器的 React Native。目前支持 Linux 和 macOS。

## 创建你自己的 React Native 平台

从零开始创建 React Native 平台的过程仍然没有得到很好的文档化——New Architecture 和 [Fabric](/architecture/fabric-renderer) 的目标之一就是让平台维护更容易。

### 打包

从 React Native 0.57 开始，你现在可以将你的 React Native 平台注册到 React Native 的 JavaScript 打包器 [Metro](https://metrobundler.dev/) 中。这意味着你可以将 `--platform example` 传递给 `npx react-native bundle`，它将查找带有 `.example.js` 后缀的 JavaScript 文件。

要将你的平台注册到 RNPM，你的模块名称必须匹配以下模式之一：

- `react-native-example` - 它将搜索所有以 `react-native-` 开头的顶级模块
- `@org/react-native-example` - 它将搜索任何作用域下以 `react-native-` 开头的模块
- `@react-native-example/module` - 它将搜索名称以 `@react-native-` 开头的作用域下的所有模块

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

`"providesModuleNodeModules"` 是一个将被添加到 Haste 模块搜索路径的模块数组，而 `"platforms"` 是一个将被添加为有效平台的平台后缀数组。
