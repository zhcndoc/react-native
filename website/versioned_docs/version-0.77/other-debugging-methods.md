---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页介绍如何使用传统的 JavaScript 调试方法。如果你刚开始使用新的 React Native 或 Expo 应用，我们推荐使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接 JSC 调试）

当使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore) (JSC) 作为应用的运行时，你可以使用 Safari 来调试应用的 iOS 版本。

1. **仅限物理设备**：打开设置应用，导航到 Safari > 高级，并确保"Web 检查器”已开启。
2. 在 Mac 上，打开 Safari 并启用开发菜单。可以在 Safari > 设置... 中找到，然后进入高级标签页，选择“显示面向网页开发者的功能”。
3. 在开发菜单下找到你的设备，并从子菜单中选择"JSContext"项。这将打开 Safari 的 Web 检查器，其中包括类似于 Chrome DevTools 的 Console 和 Sources 面板。

![打开 Safari Web 检查器](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然 source maps 默认可能未启用，但你可以遵循 [本指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html) 或 [视频](https://www.youtube.com/watch?v=GrGqIIz51k4) 来启用它们，并在源代码中的正确位置设置断点。
:::

:::tip
每次应用重新加载时，都会创建一个新的 JSContext。选择“自动显示 JSContext 的 Web 检查器”可以免除你手动选择最新 JSContext 的需要。
:::

## 远程 JavaScript 调试（已弃用）

:::warning
远程 JavaScript 调试已在 React Native 0.73 中弃用，并将在未来的版本中移除。
:::

远程 JavaScript 调试将外部网页浏览器（Chrome）连接到你的应用，并在网页中运行你的 JavaScript 代码。这允许你像使用任何网页应用一样使用 Chrome 的调试器。请注意，浏览器环境可能非常不同，并非所有 React Native 模块在这种调试方式下都能工作。

### 设置

自 React Native 0.73 起，必须使用 `NativeDevSettings` 模块**手动启用**远程 JavaScript 调试。

```js
import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';

function MyApp() {
  // 将此赋值给仅用于开发的按钮或 useEffect 调用
  const connectToRemoteDebugger = () => {
    NativeDevSettings.setIsDebuggingRemotely(true);
  };
}
```

当调用 `NativeDevSettings.setIsDebuggingRemotely(true)` 时，这将在 [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui) 打开一个新标签页。

从此页面，通过以下方式打开 Chrome DevTools：

- 视图 > 开发者 > 开发者工具
- <kbd>⌥ Option</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>I</kbd> (macOS) / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> (Windows 和 Linux)。

Console 和 Sources 面板将允许你检查 React Native 代码。

![Chrome 中的远程调试器窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)

:::info
在远程 JavaScript 调试模式下，Chrome 中的 React DevTools 网页版将无法与 React Native 配合使用。请参阅 [React Native DevTools](./react-native-devtools) 指南，了解如何在我们的集成调试器中使用 React DevTools。
:::

:::note
在 Android 上，如果调试器和设备之间的时间发生漂移，动画和事件行为等事项可能无法正常工作。这可以通过运行 ``adb shell "date `date +%m%d%H%M%Y.%S%3N`"`` 来修复。如果使用物理设备，则需要 root 权限。
:::

### 在物理设备上调试

:::info
如果你使用的是 Expo CLI，这已经为你配置好了。
:::

<Tabs groupId="platform" defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="ios">

在 iOS 设备上，打开文件 [`RCTWebSocketExecutor.mm`](https://github.com/facebook/react-native/blob/master/packages/react-native/React/CoreModules/RCTWebSocketExecutor.mm) 并将"localhost"更改为你计算机的 IP 地址。

</TabItem>
<TabItem value="android">

在通过 USB 连接的 Android 5.0+ 设备上，你可以使用 [`adb` 命令行工具](http://developer.android.com/tools/help/adb.html) 设置从设备到计算机的端口转发：

```sh
adb reverse tcp:8081 tcp:8081
```

</TabItem>
</Tabs>

:::note
如果你遇到任何问题，可能是你的某个 Chrome 扩展程序以意外方式与调试器交互。尝试禁用所有扩展程序，然后逐个重新启用，直到找到有问题的扩展程序。
:::
