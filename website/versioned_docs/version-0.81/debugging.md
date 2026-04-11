---
id: debugging
title: 调试基础
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::note
调试功能（例如开发菜单、LogBox 和 React Native DevTools）在发布（生产）构建中是禁用的。
:::

## 打开开发菜单

React Native 提供了一个应用内开发菜单，用于访问调试功能。您可以通过摇晃设备或使用键盘快捷键来访问开发菜单：

- iOS 模拟器：<kbd>Ctrl</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>Z</kbd>（或 Device > Shake）
- Android 模拟器：<kbd>Cmd ⌘</kbd> + <kbd>M</kbd>（macOS）或 <kbd>Ctrl</kbd> + <kbd>M</kbd>（Windows 和 Linux）

替代方法（Android）：`adb shell input keyevent 82`。

![React Native 开发菜单](/docs/assets/debugging-dev-menu-076.jpg)

## 打开 DevTools

[React Native DevTools](./react-native-devtools) 是我们为 React Native 内置的调试器。它允许您检查和理解 JavaScript 代码的运行方式，类似于网页浏览器。

要打开 DevTools，可以：

- 在开发菜单中选择“打开 DevTools"。
- 在 CLI 中按 <kbd>j</kbd> 键（`npx react-native start`）。

首次启动时，DevTools 将打开欢迎面板，以及一个打开的控制台抽屉，您可以在其中查看日志并与 JavaScript 运行时交互。从窗口顶部，您可以导航到其他面板，包括集成的 React 组件检查器和性能分析器。

![React Native DevTools 打开到“欢迎”面板](/docs/assets/debugging-rndt-welcome.jpg)

React Native DevTools 由 React Native 内置的专用调试架构提供支持，并使用 [Chrome DevTools](https://developer.chrome.com/docs/devtools) 前端的定制版本。这使我们能够提供熟悉的、与浏览器对齐的调试功能，这些功能深度集成并为端到端的可靠性而构建。

在我们的 [React Native DevTools 指南](./react-native-devtools) 中了解更多。

:::note
React Native DevTools 仅适用于 Hermes 引擎，并且需要安装 Google Chrome 或 Microsoft Edge。
:::

:::info

#### Flipper 和替代调试工具

React Native DevTools 取代了之前的 Flipper、Experimental Debugger 和 Hermes debugger (Chrome) 前端。如果您使用的是较旧版本的 React Native，请前往 [您的版本](/versions) 的文档。

对于使用 JavaScriptCore 而不是 Hermes 的应用，直接 JSC 调试仍然可用（参见 [其他调试方法](./other-debugging-methods)）。

React Native DevTools 旨在调试 React 应用相关问题，而不是取代原生工具。如果您想检查 React Native 的底层平台层（例如，在开发原生模块时），请使用 Xcode 和 Android Studio 中可用的调试工具（参见 [调试原生代码](/docs/next/debugging-native-code)）。

其他有用链接：

- <a href="https://shift.infinite.red/why-you-dont-need-flipper-in-your-react-native-app-and-how-to-get-by-without-it-3af461955109" target="_blank">为什么你在 React Native 应用中不需要 Flipper……以及如何在没有它的情况下继续工作&nbsp;↗</a>

:::

## LogBox

LogBox 是一个应用内工具，当应用记录警告或错误时会显示。

![LogBox 警告和展开的 LogBox 语法错误](/docs/assets/debugging-logbox-076.jpg)

### 致命错误

当发生不可恢复的错误时，例如 JavaScript 语法错误，LogBox 将打开并显示错误位置。在这种状态下，LogBox 无法关闭，因为您的代码无法执行。一旦语法错误被修复——通过快速刷新或手动重新加载——LogBox 将自动关闭。

### 控制台错误和警告

控制台错误和警告显示为带有红色或黄色徽章的屏幕通知。

- **错误**将显示通知计数。点击通知可查看展开视图并分页浏览其他日志。
- **警告**将显示不带详情的通知横幅，提示您打开 React Native DevTools。

当 React Native DevTools 打开时，除致命错误外的所有错误将对 LogBox 隐藏。由于各种 LogBox 选项可以隐藏或调整某些日志的级别，我们建议使用 React Native DevTools 内的控制台面板作为事实来源。

<details>
<summary>**💡 忽略日志**</summary>

可以通过 `LogBox` API 配置 LogBox。

```js
import {LogBox} from 'react-native';
```

#### 忽略所有日志

可以使用 `LogBox.ignoreAllLogs()` 禁用 LogBox 通知。这在某些情况下很有用，例如进行产品演示。

```js
LogBox.ignoreAllLogs();
```

#### 忽略特定日志

可以基于每条日志禁用通知。这对于嘈杂的警告或无法修复的警告很有用，例如在第三方依赖中。

```js
LogBox.ignoreLogs([
  // 确切消息
  'Warning: componentWillReceiveProps has been renamed',

  // 子字符串或正则匹配
  /GraphQL error: .*/,
]);
```

:::note

LogBox 会将来自 React 的某些错误视为警告，这意味着它们不会显示为应用内错误通知。高级用户可以通过使用 [`LogBoxData.setWarningFilter()`](https://github.com/facebook/react-native/blob/d334f4d77eea538dff87fdcf2ebc090246cfdbb0/packages/react-native/Libraries/LogBox/Data/LogBoxData.js#L338) 自定义 LogBox 的警告过滤器来更改此行为。

:::

</details>

## 性能监视器

在 Android 和 iOS 上，可以通过在开发菜单中选择 **"性能监视器"** 来切换应用内性能覆盖层。[此处](/docs/performance) 了解更多关于此功能的信息。

![iOS 和 Android 上的性能监视器覆盖层](/docs/assets/debugging-performance-monitor.jpg)

:::info
性能监视器在应用内运行，仅供参考。我们建议在 Android Studio 和 Xcode 下调查原生工具以获得准确的性能测量。
:::
