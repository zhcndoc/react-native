---
id: react-native-devtools
title: React Native DevTools
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native DevTools 是我们为 React Native 提供的现代调试体验。它从零开始专门构建，旨在从根本上比以往的调试方法更集成、更正确、更可靠。

![React Native DevTools 打开到“Welcome”面板](/docs/assets/debugging-rndt-welcome-083.jpg)

React Native DevTools 旨在用于调试 React 应用相关的问题，而不是取代原生工具。如果你想检查 React Native 的底层平台层（例如在开发 Native Module 时），请使用 Android Studio 和 Xcode 中可用的调试工具（参见 [调试原生代码](/docs/debugging-native-code)）。

<details>
<summary>**💡 兼容性** — 在 0.76 中发布</summary>

React Native DevTools 支持所有运行 Hermes 的 React Native 应用。它取代了之前的 Flipper、Experimental Debugger 和 Hermes debugger（Chrome）前端。

无法在任何更早版本的 React Native 上设置 React Native DevTools。

- **Chrome 浏览器 DevTools — 不支持**
  - 通过 `chrome://inspect` 连接到 React Native 已不再受支持。某些功能可能无法正常工作，因为最新版本的 Chrome DevTools（它们是为了匹配最新的浏览器能力和 API 而构建的）尚未经过测试，并且此前端缺少我们的自定义内容。作为替代，我们随 React Native DevTools 提供了受支持的版本。
- **Visual Studio Code — 不支持**（已存在）
  - [Expo Tools](https://github.com/expo/vscode-expo) 和 [Radon IDE](https://ide.swmansion.com/) 等第三方扩展可能具有更好的兼容性，但并未得到 React 团队的直接支持。

</details>
<details>
<summary>**💡 反馈与常见问题**</summary>

我们希望你用于在所有平台上调试 React 的工具可靠、熟悉、简单且一致。本页描述的所有功能都基于这些原则构建，我们也希望在未来提供更多能力。

我们正在积极迭代 React Native DevTools 的未来，并创建了一个集中的 [GitHub discussion](https://github.com/react-native-community/discussions-and-proposals/discussions/819) 来跟踪问题、常见问题和反馈。

</details>

## 核心功能

React Native DevTools 基于 Chrome DevTools 前端。如果你有 Web 开发背景，它的功能应该会很熟悉。作为起点，我们建议浏览 [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)，其中包含完整指南以及视频资源。

### 控制台

![React Native DevTools Sources 视图中的一系列日志，以及一台设备](/docs/assets/debugging-rndt-console.jpg)

Console 面板允许你查看和筛选消息、求值 JavaScript、检查对象属性等。

[Console features reference | Chrome DevTools](https://developer.chrome.com/docs/devtools/console/reference)

#### 实用提示

- 如果你的应用有很多日志，请使用过滤框或更改显示的日志级别。
- 使用 [Live Expressions](https://developer.chrome.com/docs/devtools/console/live-expressions) 随时间观察值。
- 使用 [Preserve Logs](https://developer.chrome.com/docs/devtools/console/reference#persist) 在刷新后保留消息。
- 使用 <kbd>Ctrl</kbd> + <kbd>L</kbd> 清空控制台视图。

### Sources 与断点

![React Native DevTools Sources 视图中的一个暂停断点，以及一台设备](/docs/assets/debugging-rndt-sources-paused-with-device.jpg)

Sources 面板允许你查看应用中的源文件并设置断点。使用断点来定义一行代码，使你的应用在此处暂停——从而让你检查程序的实时状态，并逐步执行代码。

[Pause your code with breakpoints | Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints)

:::tip

#### 小指南

断点是你调试工具箱中的基础工具！

1. 使用侧边栏或 <kbd>Cmd ⌘</kbd>+<kbd>P</kbd> / <kbd>Ctrl</kbd>+<kbd>P</kbd> 导航到源文件。
2. 点击代码行旁边的行号栏以添加断点。
3. 在暂停时，使用右上角的导航控件 [逐步执行代码](https://developer.chrome.com/docs/devtools/javascript/reference#stepping)。

:::

#### 实用提示

- 当你的应用暂停时，会出现 “Paused in Debugger” 覆盖层。点按它以继续运行。
- 在断点处要留意右侧面板，它们允许你检查当前作用域和调用栈，并设置监视表达式。
- 使用 `debugger;` 语句可以从文本编辑器中快速设置断点。通过 Fast Refresh，它会立即到达设备。
- 断点有多种类型！例如，[条件断点和日志点](https://developer.chrome.com/docs/devtools/javascript/breakpoints#overview)。

### 网络 <div className="label primary">自 0.83 起</div>

![React Native DevTools Network 面板中的一个网络请求](/docs/assets/debugging-rndt-network.jpg)

Network 面板允许你查看和检查应用发出的网络请求。记录的请求会提供详细元数据，例如时间和发送/接收的标头，以及响应预览。

当 DevTools 打开时，网络请求会自动记录。我们支持 Chrome 的大多数功能，但有一些例外。更多内容见下文。

<details>
<summary><strong>💡 网络事件覆盖范围，Expo 支持</strong></summary>

**会捕获哪些网络事件？**

目前，我们通过 `fetch()`、`XMLHttpRequest` 和 `<Image>` 记录所有网络调用——对 Expo Fetch 等自定义网络库的支持将在后续提供。

**Expo Network 的差异**

因此，使用 Expo 的应用仍会看到 “Expo Network” 面板——这是 Expo 框架提供的一个单独实现，它会记录这些额外的请求来源，但功能略少。

- 覆盖 Expo 特定的网络事件。
- 不支持请求发起方。
- 不集成 Performance 面板。

我们正在与 Expo 合作，在未来版本中将 Expo Fetch 和第三方网络库集成到我们的新 Network 检查流程中。

**未实现的功能**

在发布时，我们在 React Native 中尚不支持以下功能：

- WebSocket 事件
- 网络响应模拟
- 模拟网络限速

</details>

<details>
<summary><strong>💡 响应预览缓冲区大小</strong></summary>

如果你正在检查大量响应数据，请注意响应预览会缓存在设备上的一个缓冲区中，最大大小为 100MB。这意味着如果缓存过大，我们可能会逐出响应预览（但不会逐出元数据），且会优先逐出最早的请求。

</details>

#### 实用提示

- 使用 Initiator 选项卡查看网络请求在你的应用中是在哪里发起的调用栈。
- 网络事件也会显示在 Performance 面板中的 Network 轨道里。

### 性能 <div className="label primary">自 0.83 起</div>

![React Native DevTools Performance 面板中的一条性能轨迹](/docs/assets/debugging-rndt-performance.jpg)

性能跟踪允许你在应用内记录性能会话，以了解 JavaScript 代码是如何运行的，以及哪些操作耗时最多。在 React Native 中，我们会在单一性能时间线中展示 JavaScript 执行、React Performance 轨道、Network 事件以及自定义的 [User Timings](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)。

#### 实用提示

- 使用 [Annotations](https://developer.chrome.com/docs/devtools/performance/annotations)（按住 Shift 拖动）为性能轨迹添加标签和标注——在将轨迹 [下载并分享](https://developer.chrome.com/docs/devtools/performance/save-trace) 给同事之前非常有用。Annotations 还提供了一种快速衡量以 **秒** 为单位时间跨度的方法。
- 在你的应用中使用 [`PerformanceObserver` API](./global-PerformanceObserver.md) 来在运行时观察性能事件——如果你想捕获性能遥测，这会很有用。

#### 了解更多

- [React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks)
- [Performance APIs > User Timings | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
- ["Debug Like a Senior — React Native Performance Panel" | Software Mansion](https://blog.swmansion.com/react-native-debugging-new-performance-panel-in-react-native-0-83-21ca90871f6d)

### 内存

![在 Memory 面板中检查堆快照](/docs/assets/debugging-rndt-memory.jpg)

Memory 面板允许你拍摄堆快照，并随时间查看 JavaScript 代码的内存使用情况。

[Record heap snapshots | Chrome DevTools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

#### 实用提示

- 使用 <kbd>Cmd ⌘</kbd>+<kbd>F</kbd> / <kbd>Ctrl</kbd>+<kbd>F</kbd> 筛选堆中的特定对象。
- 进行 [allocation timeline report](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler) 有助于以图表形式查看随时间变化的内存使用情况，从而识别可能的内存泄漏。

## React DevTools 功能

在集成的 Components 和 Profiler 面板中，你会找到 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展的所有功能。这些功能在 React Native DevTools 中可无缝工作。

### React Components

![使用 React Components 面板选择并定位元素](/docs/assets/debugging-rndt-react-components.gif)

React Components 面板允许你检查并更新已渲染的 React 组件树。

- 在 DevTools 中悬停或选择一个元素，可在设备上高亮显示它。
- 要在 DevTools 中定位某个元素，点击左上角的 “Select element” 按钮，然后点按应用中的任意元素。

#### 实用提示

- 可以使用右侧面板在运行时查看和修改组件的 props 与 state。
- 使用 [React Compiler](https://react.dev/learn/react-compiler) 优化的组件会带有 “Memo ✨” 徽标标注。

:::tip

#### 专业提示：高亮重新渲染

重新渲染可能是 React 应用性能问题的重要原因。DevTools 可以在组件重新渲染发生时将其高亮显示。

- 要启用此功能，点击 View Settings（`⚙︎`）图标，并勾选 “Highlight updates when components render”。

![“highlight updates” 设置的位置，旁边是一段实时渲染覆盖层的录制](/docs/assets/debugging-rndt-highlight-renders.gif)

:::

### React Profiler

![以火焰图形式呈现的性能分析](/docs/assets/debugging-rndt-react-profiler.jpg)

React Profiler 面板允许你记录性能分析，以了解组件渲染和 React commits 的时序。

更多信息请参阅 [原始的 2018 指南](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)（请注意其中部分内容可能已过时）。

## 重新连接 DevTools

有时，DevTools 可能会与目标设备断开连接。这可能发生在以下情况：

- 应用已关闭。
- 应用被重新构建（安装了新的原生构建版本）。
- 应用在原生端崩溃。
- 开发服务器（Metro）已退出。
- 物理设备已断开连接。

断开连接时，将会显示一个对话框，提示信息为“Debugging connection was closed”。

![设备断开连接时显示的重新连接对话框](/docs/assets/debugging-reconnect-menu.jpg)

在这里，你可以执行以下操作之一：

- **Dismiss**：选择关闭（`×`）图标，或点击对话框外部，返回到断开连接前最后状态的 DevTools 界面。
- **Reconnect**：在解决导致断开连接的原因后，选择“Reconnect DevTools”。
