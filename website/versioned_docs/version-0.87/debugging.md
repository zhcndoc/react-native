---
id: debugging
title: 调试基础
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::note
调试功能，例如 Dev Menu、LogBox 和 React Native DevTools，在发布（生产）构建中已禁用
:::

## 打开 Dev Menu

React Native 提供了一个应用内开发者菜单，可访问调试功能。你可以通过摇晃设备或使用键盘快捷键访问 Dev Menu：

- iOS 模拟器：<kbd>Ctrl</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>Z</kbd>（或“设备”>“摇晃”）
- Android 模拟器：<kbd>Cmd ⌘</kbd> + <kbd>M</kbd>（macOS）或 <kbd>Ctrl</kbd> + <kbd>M</kbd>（Windows 和 Linux）

替代方式（Android）：`adb shell input keyevent 82`

![React Native Dev Menu](/docs/assets/debugging-dev-menu-083.jpg)

## 打开 DevTools

[React Native DevTools](./react-native-devtools) 是 React Native 内置的调试器。它可以让你检查并了解 JavaScript 代码的运行方式，类似于 Web 浏览器。

要打开 DevTools，可以：

- 在 Dev Menu 中选择“Open DevTools”
- 在 CLI 中按 <kbd>j</kbd>

![打开到“Welcome”面板的 React Native DevTools](/docs/assets/debugging-rndt-welcome-083.jpg)

首次启动时，DevTools 会打开欢迎面板，同时打开控制台抽屉，你可以在其中查看日志并与 JavaScript 运行时交互。你可以从窗口顶部导航到其他面板，包括集成的 React Components Inspector 和 Profiler。

请参阅我们的 [React Native DevTools 指南](./react-native-devtools)了解更多信息。

## LogBox

LogBox 是一个应用内工具，当你的应用记录警告或错误时，它会显示这些警告或错误。

![LogBox 警告和展开的 LogBox 语法错误](/docs/assets/debugging-logbox-076.jpg)

### 致命错误

当发生不可恢复的错误时，例如 JavaScript 语法错误，LogBox 会打开并显示错误位置。在此状态下，LogBox 无法关闭，因为你的代码无法执行。语法错误修复后，LogBox 会自动关闭——无论是通过 Fast Refresh 还是手动重新加载。

### 控制台错误和警告

控制台错误和警告会以屏幕通知的形式显示，并带有红色或黄色徽章。

- **错误**会显示通知数量。点击通知可查看展开视图，并翻阅其他日志
- **警告**会显示没有详细信息的通知横幅，提示你打开 React Native DevTools

当 React Native DevTools 打开时，除了致命错误外，所有错误都会在 LogBox 中隐藏。由于 LogBox 提供了各种可以隐藏或调整某些日志级别的选项，我们建议将 React Native DevTools 中的 Console 面板作为事实来源。

<details>
<summary>**💡 忽略日志**</summary>

可以通过 `LogBox` API 配置 LogBox。

```js
import {LogBox} from 'react-native';
```

#### 忽略所有日志

可以使用 `LogBox.ignoreAllLogs()` 禁用 LogBox 通知。在产品演示等场景中，这会很有用。

```js
LogBox.ignoreAllLogs();
```

#### 忽略特定日志

可以通过 `LogBox.ignoreLogs()` 按日志禁用通知。对于噪声较多的警告或无法修复的警告（例如第三方依赖中的警告），这会很有用。

```js
LogBox.ignoreLogs([
  // Exact message
  'Warning: componentWillReceiveProps has been renamed',

  // Substring or regex match
  /GraphQL error: .*/,
]);
```

:::note

LogBox 会将 React 的某些错误视为警告，这意味着它们不会显示为应用内错误通知。高级用户可以通过使用 [`LogBoxData.setWarningFilter()`](https://github.com/facebook/react-native/blob/d334f4d77eea538dff87fdcf2ebc090246cfdbb0/packages/react-native/Libraries/LogBox/Data/LogBoxData.js#L338) 自定义 LogBox 的警告过滤器来更改此行为。

:::

</details>

## 性能监视器

在 Android 和 iOS 上，开发期间可以通过在 Dev Menu 中选择 **“Perf Monitor”** 来切换应用内性能浮层。请[在此](/docs/performance)了解有关此功能的更多信息。

![iOS 和 Android 上的性能监视器浮层](/docs/assets/debugging-performance-monitor.jpg)

:::info
Performance Monitor 在应用内运行，仅可作为参考。对于准确的性能测量，我们建议研究 Android Studio 和 Xcode 中的原生工具。
:::
