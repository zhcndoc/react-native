---
id: debugging
title: 调试基础
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::note
调试功能，例如 Dev Menu、LogBox 和 React Native DevTools，在发布（生产）构建中被禁用。
:::

## 打开 Dev Menu

React Native 提供了一个应用内开发者菜单，可用于访问调试功能。你可以通过摇晃设备或使用键盘快捷键打开 Dev Menu：

- iOS 模拟器：<kbd>Ctrl</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>Z</kbd>（或 Device > Shake）
- Android 模拟器：<kbd>Cmd ⌘</kbd> + <kbd>M</kbd>（macOS）或 <kbd>Ctrl</kbd> + <kbd>M</kbd>（Windows 和 Linux）

替代方式（Android）：`adb shell input keyevent 82`。

![React Native Dev Menu](/docs/assets/debugging-dev-menu-083.jpg)

## 打开 DevTools

[React Native DevTools](./react-native-devtools) 是我们为 React Native 内置的调试器。它允许你检查并理解你的 JavaScript 代码是如何运行的，类似于网页浏览器。

要打开 DevTools，请执行以下任一操作：

- 在 Dev Menu 中选择 "Open DevTools"。
- 在 CLI 中按 <kbd>j</kbd>。

![React Native DevTools opened to the "Welcome" pane](/docs/assets/debugging-rndt-welcome-083.jpg)

首次启动时，DevTools 会打开欢迎面板，同时打开一个控制台抽屉，你可以在其中查看日志并与 JavaScript 运行时交互。从窗口顶部，你可以切换到其他面板，包括集成的 React 组件检查器和性能分析器。

在我们的 [React Native DevTools 指南](./react-native-devtools) 中了解更多。

## LogBox

LogBox 是一个应用内工具，当你的应用记录警告或错误时会显示出来。

![A LogBox warning and an expanded LogBox syntax error](/docs/assets/debugging-logbox-076.jpg)

### 致命错误

当发生无法恢复的错误时，例如 JavaScript 语法错误，LogBox 会在错误位置打开。在这种状态下，LogBox 无法关闭，因为你的代码无法执行。只要语法错误被修复，LogBox 就会自动关闭——无论是通过 Fast Refresh 还是手动重新加载之后。

### 控制台错误和警告

控制台错误和警告会以带有红色或黄色徽标的屏幕通知形式显示。

- **错误** 会显示通知计数。点击通知可查看展开视图，并在其他日志之间分页浏览。
- **警告** 会显示不含详细信息的通知横幅，提示你打开 React Native DevTools。

当 React Native DevTools 打开时，除致命错误外的所有错误都会被隐藏到 LogBox 中。我们建议将 React Native DevTools 中的 Console 面板作为事实来源，因为 LogBox 提供了各种选项，可能会隐藏或调整某些日志的级别。

<details>
<summary>**💡 忽略日志**</summary>

可以通过 `LogBox` API 配置 LogBox。

```js
import {LogBox} from 'react-native';
```

#### 忽略所有日志

可使用 `LogBox.ignoreAllLogs()` 禁用 LogBox 通知。这在某些场景下很有用，例如进行产品演示。

```js
LogBox.ignoreAllLogs();
```

#### 忽略特定日志

可通过 `LogBox.ignoreLogs()` 按日志逐个禁用通知。这对噪音较多的警告或那些无法修复的警告很有用，例如第三方依赖中的警告。

```js
LogBox.ignoreLogs([
  // 精确消息
  'Warning: componentWillReceiveProps has been renamed',

  // 子串或正则匹配
  /GraphQL error: .*/,
]);
```

:::note

LogBox 会将 React 的某些错误视为警告，这意味着它们不会作为应用内错误通知显示。高级用户可以通过使用 [`LogBoxData.setWarningFilter()`](https://github.com/facebook/react-native/blob/d334f4d77eea538dff87fdcf2ebc090246cfdbb0/packages/react-native/Libraries/LogBox/Data/LogBoxData.js#L338) 自定义 LogBox 的警告过滤器来更改此行为。

:::

</details>

## 性能监视器

在 Android 和 iOS 上，可以在开发期间通过在 Dev Menu 中选择 **"Perf Monitor"** 来切换应用内性能浮层。点击[这里](/docs/performance)了解有关此功能的更多信息。

![iOS 和 Android 上的性能监视器浮层](/docs/assets/debugging-performance-monitor.jpg)

:::info
性能监视器在应用内运行，仅供参考。我们建议在 Android Studio 和 Xcode 中查看原生工具，以获得准确的性能测量。
:::
