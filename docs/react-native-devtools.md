---
id: react-native-devtools
title: React Native DevTools
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native DevTools 是我们为 React Native 打造的现代调试体验。它从零开始构建，旨在相比以往的调试方式实现更深度的集成、更高的准确性和更强的可靠性。

![React Native DevTools 打开的“欢迎”面板](/docs/assets/debugging-rndt-welcome-083.jpg)

React Native DevTools 专为调试 React 应用相关问题而设计，并非用于取代原生工具。如果你想检查 React Native 底层的平台层（例如，在开发原生模块时），请使用 Android Studio 和 Xcode 中提供的调试工具（请参阅[调试原生代码](/docs/debugging-native-code)）。

## 核心功能

React Native DevTools 基于 Chrome DevTools 前端构建。如果你有 Web 开发背景，它的功能应该会让你感到熟悉。作为入门，我们建议浏览 [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)，其中包含完整的指南和视频资源。

### 控制台

![React Native DevTools Sources 视图中的一系列日志，旁边显示设备](/docs/assets/debugging-rndt-console.jpg)

“控制台”面板允许你查看和筛选消息、执行 JavaScript、检查对象属性等。

[控制台功能参考 | Chrome DevTools](https://developer.chrome.com/docs/devtools/console/reference)

#### 实用提示

- 如果你的应用有大量日志，请使用筛选框，或更改要显示的日志级别。
- 使用 [实时表达式](https://developer.chrome.com/docs/devtools/console/live-expressions) 随时间观察值的变化。
- 使用 [保留日志](https://developer.chrome.com/docs/devtools/console/reference#persist) 在重新加载后保留消息。
- 使用 <kbd>Ctrl</kbd> + <kbd>L</kbd> 清除控制台视图。

### 源代码与断点

![React Native DevTools Sources 视图中暂停的断点，旁边显示设备](/docs/assets/debugging-rndt-sources-paused-with-device.jpg)

“源代码”面板允许你查看应用中的源文件并设置断点。使用断点可以定义应用应暂停执行的代码行，从而检查程序的实时状态并逐步执行代码。

[使用断点暂停代码 | Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints)

:::tip

#### 小指南

断点是调试工具箱中的基础工具！

1. 使用侧边栏或 <kbd>Cmd ⌘</kbd>+<kbd>P</kbd> / <kbd>Ctrl</kbd>+<kbd>P</kbd> 导航到源文件。
2. 点击代码行旁边的行号列，在该行添加断点。
3. 暂停时，使用右上角的导航控件[逐步执行代码](https://developer.chrome.com/docs/devtools/javascript/reference#stepping)。

:::

#### 实用提示

- 应用暂停时，会出现“调试器中已暂停”覆盖层。点击它即可恢复执行。
- 在断点处时，请注意右侧面板，它们可以让你检查当前作用域和调用堆栈，并设置监视表达式。
- 在文本编辑器中使用 `debugger;` 语句，可以快速设置断点。通过快速刷新，该断点会立即传递到设备。
- 断点有多种类型！例如，[条件断点和日志点](https://developer.chrome.com/docs/devtools/javascript/breakpoints#overview)。

### 网络 <div className="label primary">自 0.83 起</div>

![React Native DevTools Network 面板中的网络请求](/docs/assets/debugging-rndt-network.jpg)

“网络”面板允许你查看和检查应用发出的网络请求。记录的请求会提供详细的元数据，例如时间信息以及发送/接收的标头，同时还会提供响应预览。

DevTools 打开时会自动记录网络请求。我们支持 Chrome 的大多数功能，但存在一些例外情况。详见下文。

<details>
<summary><strong>💡 网络事件覆盖范围、Expo 支持</strong></summary>

**捕获哪些网络事件？**

目前，我们会记录所有通过 `fetch()`、`XMLHttpRequest` 和 `<Image>` 发出的网络调用，未来还将支持自定义网络库，例如 Expo Fetch。

**Expo 网络的差异**

因此，使用 Expo 的应用仍会看到“Expo Network”面板——这是 Expo 框架的独立实现，会记录这些额外的请求来源，但功能略有减少。

- 支持 Expo 特有的网络事件。
- 不支持请求发起方。
- 不支持与“性能”面板集成。

我们正在与 Expo 合作，计划在未来版本中将 Expo Fetch 和第三方网络库集成到新的网络检查管线中。

**尚未实现的功能**

发布时，React Native 还不支持以下功能：

- WebSocket 事件
- 网络响应模拟
- 模拟网络限速

</details>

<details>
<summary><strong>💡 响应预览缓冲区大小</strong></summary>

如果你正在检查大量响应数据，请注意，响应预览会缓存在设备端缓冲区中，最大容量为 100MB。这意味着如果缓存过大，我们可能会清除响应预览（但不会清除元数据），清除顺序为最早的请求优先。

</details>

#### 实用提示

- 使用“发起方”标签页查看应用中发起网络请求的位置对应的调用堆栈。
- 网络事件也会显示在“性能”面板的“网络”轨道中。

### 性能 <div className="label primary">自 0.83 起</div>

![React Native DevTools Performance 面板中的性能跟踪记录](/docs/assets/debugging-rndt-performance.jpg)

性能跟踪功能允许你在应用中记录性能会话，以了解 JavaScript 代码的运行方式，以及哪些操作耗时最长。在 React Native 中，我们会在单个性能时间线中显示 JavaScript 执行、React 性能轨道、网络事件以及自定义的[用户计时](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)。

#### 实用提示

- 使用[注释](https://developer.chrome.com/docs/devtools/performance/annotations)（按住 Shift 拖动）为性能跟踪记录添加标签和标记——在[下载并分享](https://developer.chrome.com/docs/devtools/performance/save-trace)跟踪记录给团队成员之前，这非常有用。注释还提供了一种快速估算时间跨度的方法，单位为**秒**。
- 在应用中使用 [`PerformanceObserver` API](./global-PerformanceObserver.md)，在运行时观察性能事件——如果你希望收集性能遥测数据，这会很有用。

#### 了解更多

- [React 性能轨道](https://react.dev/reference/dev-tools/react-performance-tracks)
- [性能 API > 用户计时 | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
- [《像资深开发者一样调试——React Native 性能面板》| Software Mansion](https://blog.swmansion.com/react-native-debugging-new-performance-panel-in-react-native-0-83-21ca90871f6d)

### 内存

![在 Memory 面板中检查堆快照](/docs/assets/debugging-rndt-memory.jpg)

“内存”面板允许你获取堆快照，并查看 JavaScript 代码的内存使用情况随时间的变化。

[记录堆快照 | Chrome DevTools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

#### 实用提示

- 使用 <kbd>Cmd ⌘</kbd>+<kbd>F</kbd> / <kbd>Ctrl</kbd>+<kbd>F</kbd> 在堆中筛选特定对象。
- 获取[分配时间线报告](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler)有助于以图表形式查看内存使用情况随时间的变化，从而识别潜在的内存泄漏。

## React DevTools 功能

在集成的 Components 和 Profiler 面板中，你将找到 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展的所有功能。这些功能可以在 React Native DevTools 中无缝运行。

### React Components

![使用 React Components 面板选择和定位元素](/docs/assets/debugging-rndt-react-components.gif)

React Components 面板允许你检查和更新已渲染的 React 组件树。

- 在 DevTools 中将鼠标悬停在元素上或选中元素，即可在设备上高亮显示该元素。
- 要在 DevTools 中定位元素，请点击左上角的“选择元素”按钮，然后在应用中点击任意元素。

#### 实用提示

- 可以使用右侧面板在运行时查看和修改组件的 props 和 state。
- 使用 [React Compiler](https://react.dev/learn/react-compiler) 优化的组件会标注“Memo ✨”徽章。

:::tip

#### 专业提示：高亮重新渲染

重新渲染可能是 React 应用性能问题的重要原因。DevTools 可以在组件重新渲染时将其高亮显示。

- 要启用此功能，请点击“查看设置”（`⚙︎`）图标，然后勾选“组件渲染时高亮显示更新”。

![“高亮显示更新”设置的位置，旁边是实时渲染覆盖层的录制画面](/docs/assets/debugging-rndt-highlight-renders.gif)

:::

### React Profiler

![以火焰图形式呈现的性能分析结果](/docs/assets/debugging-rndt-react-profiler.jpg)

React Profiler 面板允许你录制性能分析结果，以了解组件渲染和 React 提交的耗时。

如需了解更多信息，请参阅[原始的 2018 年指南](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)（请注意，其中部分内容可能已经过时）。

## 重新连接开发者工具

有时，开发者工具可能会与目标设备断开连接。这可能发生在以下情况：

- 应用已关闭。
- 应用已重新构建（安装了新的原生构建版本）。
- 应用在原生端崩溃。
- 开发服务器（Metro）已退出。
- 物理设备已断开连接。

断开连接时，将显示一条消息为“调试连接已关闭”的对话框。

![设备断开连接时显示的重新连接对话框](/docs/assets/debugging-reconnect-menu.jpg)

此时，你可以：

- **关闭**：选择关闭（`×`）图标，或点击对话框外部，以返回断开连接前开发者工具界面的最后状态。
- **重新连接**：解决断开连接的原因后，选择“重新连接开发者工具”。
