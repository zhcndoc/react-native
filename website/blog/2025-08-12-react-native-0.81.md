---
title: 'React Native 0.81 - 支持 Android 16、更快的 iOS 构建等'
authors: [motiz88, vzaidman, gabrieldonadel, chrfalch]
tags: [engineering]
date: 2025-08-12
---

# **React Native 0.81 - 支持 Android 16、更快的 iOS 构建等**

今天我们很高兴发布 React Native 0.81！

本版本支持 Android 16（API 级别 36），并包含多项稳定性提升和错误修复，同时试验性支持通过预编译实现更快的 iOS 构建。

### 亮点

- [支持 Android 16](/blog/2025/08/12/react-native-0.81#android-16-support)
- [SafeAreaView 弃用](/blog/2025/08/12/react-native-0.81#safeareaview-deprecation)
- [社区维护的 JavaScriptCore 支持](/blog/2025/08/12/react-native-0.81#community-maintained-javascriptcore-support)
- [试验性预编译的 iOS 构建](/blog/2025/08/12/react-native-0.81#experimental-precompiled-ios-builds)

<!--truncate-->

## 亮点

### 支持 Android 16

基于 React Native 0.81 构建的 Android 应用程序将默认面向 **Android 16**（API 级别 36）。

正如 Google 之前宣布的那样，Android 16 要求[应用以边缘到边缘（edge-to-edge）方式显示](https://developer.android.com/develop/ui/views/layout/edge-to-edge)，并且不支持[选择退出](https://developer.android.com/about/versions/16/behavior-changes-16)。

为支持这一点，我们已弃用 `<SafeAreaView>` 组件，[具体公告见此](https://github.com/react-native-community/discussions-and-proposals/discussions/827)，推荐使用替代方案。[详情见下文](#safeareaview-deprecation) —— 这些方案将更好地支持边缘到边缘显示。

我们还新增了 `edgeToEdgeEnabled` gradle 属性，允许你选择是否在所有低于 Android 16 的支持版本中启用边缘到边缘显示。

针对面向 Android 16 的应用，默认启用了[预测性返回手势](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)。大多数用例中，[BackHandler](https://reactnative.dev/docs/backhandler) API 的行为应保持不变。但如果你的应用依赖于自定义本地代码处理返回（例如重写 `onBackPressed()` 方法），你可能需要手动迁移代码或[暂时选择退出](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-out)。升级后请彻底测试应用的返回导航。

Google 现在期望应用支持[大屏设备的自适应布局](https://developer.android.com/develop/ui/compose/layouts/adaptive)，无论屏幕方向或尺寸如何。虽然目前你可以选择退出，但建议在 Android 17 之前测试并更新应用，使其在大屏幕上具备响应式 UI。

从 2025 年 11 月 1 日起，所有 Google Play 应用提交必须满足针对 Android 15+ 设备的本地二进制文件 16 KB 页面大小要求。**React Native 已符合 16KB 页面大小规范**。请确保你的所有本地代码和第三方库也符合该规范。

有关 Android 16 变更和迁移步骤的更多信息，请参考此[讨论与提案帖子](https://github.com/react-native-community/discussions-and-proposals/discussions/921)。

### SafeAreaView 弃用

内置的 `<SafeAreaView>` 组件最初设计用于提供**有限的，仅针对 iOS 的支持**，以保持内容不被摄像头凹口、圆角等遮挡。它不兼容 Android 上的边缘到边缘渲染，且不允许除 padding 之外的自定义。因此，许多应用倾向于采用更具跨平台性和灵活性的解决方案，比如 <code>[react-native-safe-area-context](https://appandflow.github.io/react-native-safe-area-context/)</code>。

在 React Native 0.81 中，传统的 `<SafeAreaView>` 组件被弃用，使用时将在 React Native DevTools 中看到警告。

它将在未来的 React Native 版本中被移除。我们建议你迁移使用 `react-native-safe-area-context` 或类似库，以确保应用在所有平台上显示最佳。

### 社区维护的 JavaScriptCore 支持

[正如我们去年宣布的](https://reactnative.dev/blog/2025/04/08/react-native-0.79#jsc-moving-to-community-package)，JavaScriptCore (JSC) 引擎的支持已迁移到一个[社区维护的包](https://github.com/react-native-community/javascriptcore)，该包独立于 React Native 本身发布。React Native 0.81 版本中，将移除内置的 JavaScriptCore。所有需要 JavaScriptCore 的应用，现在应使用社区包以升级至 0.81。[安装说明详见这里](https://github.com/react-native-community/javascriptcore#installation)。

此变更不影响使用 Hermes 的应用。

### 试验性预编译的 iOS 构建

React Native 0.81 引入了预编译的 iOS 构建，在以 React Native 为主要依赖的项目中，编译时间最高可缩短 10 倍。该功能由 Expo 和 Meta 合作开发，扩展了我们此前在 React Native 0.80 中推出的工作，[详情见此](https://reactnative.dev/blog/2025/06/12/react-native-0.80#experimental---react-native-ios-dependencies-are-now-prebuilt)。

该功能仍属试验阶段，但我们希望未来版本能为所有应用启用此功能。如果你想在自己的应用中试用预编译构建，可以在运行 `pod install` 时指定以下环境变量：

```bash
RCT_USE_RN_DEP=1 RCT_USE_PREBUILT_RNCORE=1 bundle exec pod install
```

请在[此 GitHub 讨论](https://github.com/react-native-community/discussions-and-proposals/discussions/923)中提供反馈。

我们已知的两个限制，并正在积极解决：

- 预编译构建中，你无法调试或进入 React Native 的内部实现。但你仍可调试你自己的本地代码，同时使用预编译版本的 React Native。
- Xcode 26 测试版本不支持预编译构建，因为 IDE 默认启用了[Swift 显式模块](https://developer.apple.com/documentation/xcode-release-notes/xcode-26-release-notes#Resolved-Issues-in-Xcode-26-Beta:~:text=Starting%20from%20Xcode%2026%2C%20Swift%20explicit%20modules%20will%20be%20the%20default%20mode%20for%20building%20all%20Swift%20targets)。要在 Xcode 26 中使用预编译构建，请在项目中将 `SWIFT_ENABLE_EXPLICIT_MODULES` 设置为 `NO`。我们将在后续补丁中处理此问题。

你可以阅读 Expo 的完整博客文章了解更多，[iOS 预编译 React Native：0.81 带来极速构建](https://expo.dev/blog/precompiled-react-native-for-ios)。

## 重大变更

### Node.js 最低版本提升至 20

React Native 现需 [Node.js](https://nodejs.org/) 20.19.4 版本（迄今最新的[维护 LTS](https://nodejs.org/en/about/previous-releases)版本）或更高。升级 React Native 0.81 时，可能需要升级你开发或 CI 环境中的 Node.js。

### Xcode 最低版本提升至 16.1

构建 iOS 项目现需 [Xcode 16.1](https://developer.apple.com/documentation/xcode-release-notes/xcode-16_1-release-notes) 或更高版本。升级 React Native 0.81 时，可能需要升级开发或 CI 环境中的 Xcode。

### Metro：支持 Community CLI 项目中的高级配置

Metro 现在会尊重 Community CLI 项目中的 `metro.config.js` 文件中指定的 <code>[resolveRequest](https://metrobundler.dev/docs/configuration#resolverequest)</code> 和 <code>[getModulesRunBeforeMainModule](https://metrobundler.dev/docs/configuration/#getmodulesrunbeforemainmodule)</code> 选项。此前设置它们无效。如果你在 <code>[metro.config.js](https://metrobundler.dev/docs/configuration/)</code> 中自定义了这些选项，可能需要删除以恢复之前行为。

### 改进未捕获 JavaScript 错误的报告

React Native DevTools 现在显示未捕获 JavaScript 错误的原始消息和堆栈信息，以及错误的[原因](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)（如有），并针对组件抛出的错误提供[所有者堆栈](https://react.dev/reference/react/captureOwnerStack#owner-stack-vs-component-stack)。这使得错误更易调试和修复。

![包含原因和所有者堆栈的示例错误](../static/blog/assets/0.81-improved-uncaught-error.png)

如果你将 JavaScript 错误日志发送至后端或第三方错误服务，升级 React Native 0.81 后，日志可能会有变化（例如，过去由 `console.error` 报告的错误现在可能以抛出异常形式出现），你可能需要相应调整后台逻辑。

### `RN_SERIALIZABLE_STATE` 与 C++ 标志

本版本新增了宏 `RN_SERIALIZABLE_STATE`，支持在新架构的组件上实现可序列化状态。

如果你是库作者，并且拥有**自定义**的 `CMakeLists.txt` 文件，你需要在该文件中添加此宏，否则你的 C++ 代码可能无法编译。

为支持该宏，我们新增了 CMake 函数 `target_compile_reactnative_options`，它会自动设置该宏及所有必要的 C++ 标志。你可在 `CMakeLists.txt` 中这样调用：

```cmake
target_compile_reactnative_options(myLibraryName PRIVATE)
```

你可以查看 [react-native-screens 如何设置该宏的例子](https://github.com/software-mansion/react-native-screens/pull/3114/commits/b4d283c8fc65e36ec60726fd7513735ccc7e1fe9)。

此改动主要影响更高级复杂的库。若你的库使用 codegen 且无自定义 CMake 文件，则不受影响。

### 其他重大变更

以下列表包含我们怀疑对你的产品代码有轻微影响且值得注意的一些变更：

#### Android

- 我们将若干类设为内部（internal）。这些类并非公共 API，不应被访问。我们已通知或提交补丁至受影响的库：
  - `com.facebook.react.fabric.mounting.MountingManager`
  - `com.facebook.react.views.text.TextLayoutManager`
- 我们将 `textAlignVertical` 的[本地属性](https://github.com/facebook/react-native/blob/841866c35401ae05fa9c6a2a3e9b42714bbd291e/packages/react-native/ReactCommon/react/renderer/attributedstring/ParagraphAttributes.h#L83)从 `TextAttribute.h` 移至 `ParagraphAttribute.h`
  - `textAlignVertical` 属性仅影响最顶层的文本视图（段落视图），但历史上属于文本属性。为更准确体现平台限制，它已移至段落属性。
  - 该变更**不**影响 `<Text>` 组件的 JS API。
  - 仅当你实现了与 C++ Text API 交互的 Fabric 组件时才受影响。
  - 若受影响，请将代码中的 `TextAttributes.h` 替换为 `ParagraphAttribute.h`。

完整破坏性变更请参阅 [0.81 版本 CHANGELOG](https://github.com/facebook/react-native/blob/main/CHANGELOG.md#v0810)。

## 致谢

React Native 0.81 包含了来自 110 位贡献者的 1110 多次提交。感谢大家的辛勤付出！

<!--alex ignore special retext-equality-->

我们特别感谢此次发布中做出重大贡献的社区成员：

- [Christian Falch](https://github.com/chrfalch) 对预编译 iOS 构建的卓越贡献。<!-- // @case-police-ignore Mathieu -->
- [Mathieu Acthernoene](https://github.com/zoontek) 对 Android 边缘到边缘支持的重要贡献
- [Enrique López-Mañas](https://github.com/kikoso) 协助测试 Android 16 集成与 SafeAreaView 弃用

## 升级至 0.81

对于已有项目，请使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 查看版本间的代码变动，同时参考升级文档。

新建项目可执行：

```
npx @react-native-community/cli@latest init MyProject --version latest
```

如果你使用 Expo，React Native 0.81 将作为默认版本支持于即将发布的 Expo SDK 54 中。

:::info

0.81 已成为最新的 React Native 稳定版本，0.78.x 已进入不再支持阶段。更多信息请见 [React Native 支持政策](https://githubwg/react-native-releases/blob/main/docs/support.md)。

:::