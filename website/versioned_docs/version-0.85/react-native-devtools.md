---
id: react-native-devtools
title: React Native DevTools
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native DevTools 是我们为 React Native 打造的现代调试体验。它从头开始专门构建，旨在比以前的调试方法从根本上更加集成、正确和可靠。

![React Native DevTools 打开到“欢迎”面板](/docs/assets/debugging-rndt-welcome-083.jpg)

React Native DevTools 专为调试 React 应用问题而设计，并非用于替代原生工具。如果你想检查 React Native 的底层平台层（例如，在开发原生模块时），请使用 Android Studio 和 Xcode 中可用的调试工具（参见 [调试原生代码](/docs/debugging-native-code)）。

<details>
<summary>**💡 兼容性** — 于 0.76 版本发布</summary>

React Native DevTools 支持所有运行 Hermes 的 React Native 应用。它取代了之前的 Flipper、Experimental Debugger 和 Hermes debugger (Chrome) 前端。

无法在任何旧版本的 React Native 上设置 React Native DevTools。

- **Chrome 浏览器 DevTools — 不支持**
  - 不再支持通过 `chrome://inspect` 连接到 React Native。功能可能无法正常工作，因为最新版本的 Chrome DevTools（构建用于匹配最新的浏览器功能和 API）未经过测试，且此外端缺少我们的自定义功能。相反，我们随 React Native DevTools 一起提供了受支持的版本。
- **Visual Studio Code — 不支持**（预先存在）
  - 第三方扩展（如 [Expo Tools](https://github.com/expo/vscode-expo) 和 [Radon IDE](https://ide.swmansion.com/)）可能具有改进的兼容性，但不受 React 团队的直接支持。

</details>
<details>
<summary>**💡 反馈与常见问题**</summary>

我们希望你在所有平台上用于调试 React 的工具是可靠、熟悉、简单且连贯的。本页面上描述的所有功能都是本着这些原则构建的，我们也希望在未来提供更多的功能。

我们正在积极迭代 React Native DevTools 的未来，并创建了一个集中的 [GitHub 讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/819) 来跟踪问题、常见问题和反馈。

</details>

## 核心功能

React Native DevTools 基于 Chrome DevTools 前端构建。如果你有 Web 开发背景，它的功能应该会很熟悉。作为起点，我们建议浏览 [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)，其中包含完整的指南以及视频资源。

### 控制台

![React Native DevTools 源代码视图中的一系列日志，旁边是一个设备](/docs/assets/debugging-rndt-console.jpg)

控制台面板允许你查看和过滤消息、评估 JavaScript、检查对象属性等。

[控制台功能参考 | Chrome DevTools](https://developer.chrome.com/docs/devtools/console/reference)

#### 实用技巧

- 如果你的应用有很多日志，请使用过滤框或更改显示的日志级别。
- 使用 [实时表达式](https://developer.chrome.com/docs/devtools/console/live-expressions) 随时间监视值。
- 使用 [保留日志](https://developer.chrome.com/docs/devtools/console/reference#persist) 在重新加载后保留消息。
- 使用 <kbd>Ctrl</kbd> + <kbd>L</kbd> 清除控制台视图。

### 源代码与断点

![React Native DevTools 源代码视图中暂停的断点，旁边是一个设备](/docs/assets/debugging-rndt-sources-paused-with-device.jpg)

源代码面板允许你查看应用中的源文件并注册断点。使用断点定义应用应暂停的代码行——允许你检查程序的实时状态并逐步执行代码。

[使用断点暂停代码 | Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints)

:::tip

#### 迷你指南

断点是调试工具包中的基本工具！

1. 使用侧边栏或 <kbd>Cmd ⌘</kbd>+<kbd>P</kbd> / <kbd>Ctrl</kbd>+<kbd>P</kbd> 导航到源文件。
2. 点击代码行旁边的行号列以添加断点。
3. 暂停时使用右上角的导航控件 [逐步执行代码](https://developer.chrome.com/docs/devtools/javascript/reference#stepping)。

:::

#### 实用技巧

- 当应用暂停时，会出现“调试器中已暂停”覆盖层。点击它以恢复。
- 在断点处注意右侧面板，它允许你检查当前作用域和调用栈，并设置监视表达式。
- 使用 `debugger;` 语句从文本编辑器快速设置断点。这将通过 Fast Refresh 立即到达设备。
- 有多种类型的断点！例如，[条件断点和日志点](https://developer.chrome.com/docs/devtools/javascript/breakpoints#overview)。

### 网络 <div className="label primary">自 0.83 起</div>

![React Native DevTools 网络面板中的网络请求](/docs/assets/debugging-rndt-network.jpg)

网络面板允许你查看和检查应用发出的网络请求。记录的请求提供详细的元数据，如计时和发送/接收的标头，以及响应预览。

当 DevTools 打开时，网络请求会自动记录。我们支持来自 Chrome 的大多数功能，但有一些例外。见下文。

<details>
<summary><strong>💡 网络事件覆盖范围，Expo 支持</strong></summary>

**捕获哪些网络事件？**

今天，我们记录通过 `fetch()`、`XMLHttpRequest` 和 `<Image>` 发出的所有网络调用——对自定义网络库（如 Expo Fetch）的支持将在 later 版本中提供。

**Expo 网络差异**

因此，使用 Expo 的应用将继续看到"Expo 网络”面板——这是 Expo 框架的单独实现，它将记录这些额外的请求源，但功能略有减少。

- 覆盖 Expo 特定的网络事件。
- 不支持请求发起者。
- 无性能面板集成。

我们正在与 Expo 合作，在未来的版本中将 Expo Fetch 和第三方网络库集成到我们的新网络检查管道中。

**未实现的功能**

在发布时，以下是我们尚未在 React Native 中支持的功能：

- WebSocket 事件
- 网络响应模拟
- 模拟网络节流

</details>

<details>
<summary><strong>💡 响应预览缓冲区大小</strong></summary>

如果你正在检查大量响应数据，请注意响应预览缓存于设备上的缓冲区中，最大大小为 100MB。这意味着如果缓存变得太大，我们可能会驱逐响应预览（但不是元数据），最早的请求优先。

</details>

#### 实用技巧

- 使用发起者标签页查看网络请求在应用中发起的调用栈。
- 网络事件也将显示在性能面板的网络轨道中。

### 性能 <div className="label primary">自 0.83 起</div>

![React Native DevTools 性能面板中的性能跟踪](/docs/assets/debugging-rndt-performance.jpg)

性能跟踪允许你记录应用内的性能会话，以了解你的 JavaScript 代码如何运行以及哪些操作耗时最多。在 React Native 中，我们显示 JavaScript 执行、React 性能轨道、网络事件和自定义 [用户计时](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)，渲染在单个性能时间线中。

#### 实用技巧

- 使用 [标注](https://developer.chrome.com/docs/devtools/performance/annotations)（shift-拖动）来标记和标注性能跟踪——在 [下载和分享](https://developer.chrome.com/docs/devtools/performance/save-trace) 跟踪给队友之前很有用。标注还提供了一种快速衡量 **秒** 时间跨度的方法。
- 在你的应用中使用 [`PerformanceObserver` API](./global-PerformanceObserver.md) 在运行时观察性能事件——如果你想捕获性能遥测数据，这很有用。

#### 了解更多

- [React 性能轨道](https://react.dev/reference/dev-tools/react-performance-tracks)
- [性能 API > 用户计时 | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
- ["像高级开发者一样调试 — React Native 性能面板" | Software Mansion](https://blog.swmansion.com/react-native-debugging-new-performance-panel-in-react-native-0-83-21ca90871f6d)

### 内存

![在内存面板中检查堆快照](/docs/assets/debugging-rndt-memory.jpg)

内存面板允许你获取堆快照并查看你的 JavaScript 代码随时间的内存使用情况。

[记录堆快照 | Chrome DevTools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

#### 实用技巧

- 使用 <kbd>Cmd ⌘</kbd>+<kbd>F</kbd> / <kbd>Ctrl</kbd>+<kbd>F</kbd> 过滤堆中的特定对象。
- 获取 [分配时间线报告](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler) 可能有助于以图形方式查看随时间的内存使用情况，以识别可能的内存泄漏。

## React DevTools 功能

在集成的组件和 Profiler 面板中，你将找到 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展的所有功能。这些功能在 React Native DevTools 中无缝工作。

### React 组件

![使用 React 组件面板选择和定位元素](/docs/assets/debugging-rndt-react-components.gif)

React 组件面板允许你检查和更新渲染的 React 组件树。

- 在 DevTools 中悬停或选择一个元素以在设备上高亮显示它。
- 要在 DevTools 中定位元素，点击左上角的“选择元素”按钮，然后点击应用中的任何元素。

#### 实用技巧

- 可以使用右侧面板在运行时查看和修改组件上的 props 和 state。
- 使用 [React Compiler](https://react.dev/learn/react-compiler) 优化的组件将标注有"Memo ✨"徽章。

:::tip

#### 专业提示：高亮重新渲染

重新渲染可能是 React 应用中性能问题的重要贡献者。DevTools 可以在组件重新渲染发生时高亮显示它们。

- 要启用，点击视图设置 (`⚙︎`) 图标并勾选“组件渲染时高亮更新”。

![“高亮更新”设置的位置，旁边是实时渲染覆盖层的记录](/docs/assets/debugging-rndt-highlight-renders.gif)

:::

### React Profiler

![渲染为火焰图的性能分析](/docs/assets/debugging-rndt-react-profiler.jpg)

React Profiler 面板允许你记录性能配置文件，以了解组件渲染和 React 提交的时间。

更多信息，请参阅 [原始 2018 指南](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)（注意，其中部分内容可能已过时）。

## 重新连接 DevTools

偶尔，DevTools 可能会与目标设备断开连接。如果发生以下情况，可能会出现此问题：

- 应用已关闭。
- 应用已重新构建（安装了新的原生构建版本）。
- 应用在原生端崩溃。
- 开发服务器（Metro）已退出。
- 物理设备已断开连接。

断开连接时，将显示一个对话框，消息为“调试连接已关闭”。

![设备断开连接时显示的重连对话框](/docs/assets/debugging-reconnect-menu.jpg)

在此处，您可以：

- **忽略**：选择关闭（`×`）图标或点击对话框外部，以返回到断开连接前最后状态的 DevTools 界面。
- **重新连接**：选择“重新连接 DevTools"，并已解决断开连接的原因。
