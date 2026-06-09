---
id: out-of-tree-platforms
title: 树外平台
---

React Native 不仅仅适用于 Android 和 iOS 设备 —— 我们的合作伙伴和社区维护着让 React Native 支持其它平台的项目，例如：

**来自合作伙伴**

- [React Native macOS](https://github.com/microsoft/react-native-macos) - 适用于 macOS 和 Cocoa 的 React Native。
- [React Native Windows](https://github.com/microsoft/react-native-windows) - 适用于微软通用 Windows 平台（UWP）的 React Native。
- [React Native visionOS](https://github.com/callstack/react-native-visionos) - 适用于苹果 visionOS 的 React Native。

**来自社区**

- [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) - 适用于 Apple TV 和 Android TV 设备的 React Native。
- [React Native Web](https://github.com/necolas/react-native-web) - 在网页上通过 React DOM 运行的 React Native。
- [React Native Skia](https://github.com/react-native-skia/react-native-skia) - 使用 [Skia](https://skia.org/) 作为渲染器的 React Native。目前支持 Linux 和 macOS。

## 创建你自己的 React Native 平台

从零开始创建 React Native 平台的过程仍然没有得到很好的文档化——New Architecture 和 [Fabric](/architecture/fabric-renderer) 的目标之一就是让平台维护更容易。

### 打包

从 React Native 0.57 版本开始，你可以使用 React Native 的 JavaScript 打包器 [Metro](https://metrobundler.dev/) 来注册你的 React Native 平台。这意味着你可以传递 `--platform example` 给 `npx react-native bundle`，它会寻找后缀为 `.example.js` 的 JavaScript 文件。

要用 RNPM 注册你的平台，模块名称必须匹配以下模式之一：

- `react-native-example` —— 会搜索所有以 `react-native-` 开头的顶层模块
- `@org/react-native-example` —— 会搜索任何作用域下以 `react-native-` 开头的模块
- `@react-native-example/module` —— 会搜索所有作用域名称以 `@react-native-` 开头的模块中

你还必须在你的 `package.json` 中添加如下条目：

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

`"providesModuleNodeModules"` 是一个模块数组，这些模块会被添加到 Haste 模块搜索路径中，而 `"platforms"` 是一个平台后缀数组，这些后缀将被添加为有效的平台。