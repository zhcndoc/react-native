---
id: debugging
title: 调试基础
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::note
调试功能，如开发者菜单（Dev Menu）、LogBox 和 React Native DevTools，在发布（生产）版本中被禁用。
:::

## 打开开发者菜单

React Native 提供了一个应用内开发者菜单，可访问调试功能。你可以通过摇晃设备或使用键盘快捷键打开开发者菜单：

- iOS 模拟器：<kbd>Ctrl</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>Z</kbd>（或者 设备 > 摇晃）
- Android 模拟器：<kbd>Cmd ⌘</kbd> + <kbd>M</kbd>（macOS）或 <kbd>Ctrl</kbd> + <kbd>M</kbd>（Windows 和 Linux）

另一种方法（Android）：`adb shell input keyevent 82`。

![React Native 开发者菜单](/docs/assets/debugging-dev-menu-083.jpg)

## 打开 DevTools

[React Native DevTools](./react-native-devtools) 是我们内置的 React Native 调试工具。它允许你检查和理解 JavaScript 代码的运行情况，类似于网页浏览器的开发者工具。

打开 DevTools 的方式有：

- 在开发者菜单中选择“打开 DevTools"。
- 在命令行界面按下 <kbd>j</kbd>。

![React Native DevTools 打开到“欢迎”面板](/docs/assets/debugging-rndt-welcome-083.jpg)

首次启动时，DevTools 会打开到欢迎面板，且打开控制台抽屉，你可以查看日志并与 JavaScript 运行时交互。你可以从窗口顶部导航到其他面板，包括集成的 React 组件检查器和性能分析器。

更多信息请参阅我们的 [React Native DevTools 指南](./react-native-devtools)。

## LogBox

LogBox 是一个应用内工具，用于显示应用中记录的警告或错误。

![LogBox 警告和展开的 LogBox 语法错误](/docs/assets/debugging-logbox-076.jpg)

### 致命错误

当出现无法恢复的错误，例如 JavaScript 语法错误时，LogBox 会自动弹出并显示错误位置。在这种状态下，LogBox 无法关闭，因为代码无法执行。LogBox 会在语法错误修复后自动关闭——无论是通过快速刷新（Fast Refresh）还是手动重新加载。

### 控制台错误和警告

控制台错误和警告会以屏幕上的通知形式显示，带有红色或黄色徽章。

- **错误** 会显示通知计数。点击通知可查看详细展开视图，并翻页浏览其他日志。
- **警告** 会显示通知横幅，没有详细内容，提示你打开 React Native DevTools。

当 React Native DevTools 打开时，除致命错误外，所有错误都会被 LogBox 隐藏。我们推荐在 React Native DevTools 的控制台面板中查看日志，作为真实且权威的信息源，因为 LogBox 有多种选项可以隐藏或调整日志等级。

<details>
<summary>**💡 忽略日志**</summary>

LogBox 可通过 `LogBox` API 进行配置。

```js
import {LogBox} from 'react-native';
```

#### 忽略所有日志

可以用 `LogBox.ignoreAllLogs()` 禁用所有 LogBox 通知。这在进行产品演示时很有用。

```js
LogBox.ignoreAllLogs();
```

#### 忽略特定日志

可以通过 `LogBox.ignoreLogs()` 针对单个日志消息禁用通知。这对噪声警告或者无法修复的警告（例如第三方依赖的问题）特别有用。

```js
LogBox.ignoreLogs([
  // 精确匹配消息
  'Warning: componentWillReceiveProps has been renamed',

  // 子字符串或正则表达式匹配
  /GraphQL error: .*/,
]);
```

:::note

LogBox 会将 React 的某些错误视为警告，因此它们不会作为应用内错误通知显示。高级用户可以通过自定义 LogBox 的警告过滤器，使用 [`LogBoxData.setWarningFilter()`](https://github.com/facebook/react-native/blob/d334f4d77eea538dff87fdcf2ebc090246cfdbb0/packages/react-native/Libraries/LogBox/Data/LogBoxData.js#L338) 改变此行为。

:::

</details>

## 性能监控器

在 Android 和 iOS 上，可以在开发时通过开发者菜单选择 **“性能监控器”（Perf Monitor）** 来切换应用内性能覆盖显示。你可以在 [这里](/docs/performance) 了解更多关于此功能的信息。

![iOS 和 Android 上的性能监控器覆盖层](/docs/assets/debugging-performance-monitor.jpg)

:::info
性能监控器运行于应用内，作为一个参考指南。我们建议使用 Android Studio 和 Xcode 下的原生工具进行准确的性能测量。
:::
