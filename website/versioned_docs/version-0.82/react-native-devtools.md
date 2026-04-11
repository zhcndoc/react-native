---
id: react-native-devtools
title: React Native DevTools
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native DevTools 是我们为 React Native 打造的现代调试体验。它从头开始专门构建，旨在比以前的调试方法从根本上更具集成性、正确性和可靠性。

![React Native DevTools 打开到“欢迎”面板](/docs/assets/debugging-rndt-welcome.jpg)

React Native DevTools 专为调试 React 应用问题而设计，并非用于替代原生工具。如果您想检查 React Native 的底层平台层（例如，在开发原生模块时），请使用 Android Studio 和 Xcode 中可用的调试工具（参见 [调试原生代码](/docs/debugging-native-code)）。

<details>
<summary>**💡 兼容性** — 发布于 0.76 版本</summary>

React Native DevTools 支持所有运行 Hermes 的 React Native 应用。它取代了之前的 Flipper、Experimental Debugger 和 Hermes debugger (Chrome) 前端。

无法在任何旧版本的 React Native 上设置 React Native DevTools。

- **Chrome 浏览器 DevTools — 不支持**
  - 不再支持通过 `chrome://inspect` 连接到 React Native。功能可能无法正常工作，因为最新版本的 Chrome DevTools（构建用于匹配最新浏览器功能和 API）未经过测试，且此外端缺乏我们的自定义设置。相反，我们随 React Native DevTools 一起提供了受支持的版本。
- **Visual Studio Code — 不支持**（此前已存在）
  - 第三方扩展如 [Expo Tools](https://github.com/expo/vscode-expo) 和 [Radon IDE](https://ide.swmansion.com/) 可能具有改进的兼容性，但不受 React 团队直接支持。

</details>
<details>
<summary>**💡 反馈与常见问题**</summary>

我们希望您用于跨平台调试 React 的工具可靠、熟悉、简单且连贯。本页描述的所有功能都是本着这些原则构建的，我们也希望在未来提供更多功能。

我们正在积极迭代 React Native DevTools 的未来，并创建了一个集中的 [GitHub 讨论](https://github.com/react-native-community/discussions-and-proposals/discussions/819) 来跟踪问题、常见问题和反馈。

</details>

## 核心功能

React Native DevTools 基于 Chrome DevTools 前端。如果您有 Web 开发背景，其功能应该会很熟悉。作为起点，我们建议浏览 [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)，其中包含完整指南以及视频资源。

### 控制台

![React Native DevTools Sources 视图中的一系列日志，旁边是一个设备](/docs/assets/debugging-rndt-console.jpg)

控制台面板允许您查看和过滤消息、评估 JavaScript、检查对象属性等。

[控制台功能参考 | Chrome DevTools](https://developer.chrome.com/docs/devtools/console/reference)

#### 有用提示

- 如果您的应用有很多日志，请使用过滤框或更改显示的日志级别。
- 使用 [实时表达式](https://developer.chrome.com/docs/devtools/console/live-expressions) 随时间观察值。
- 使用 [保留日志](https://developer.chrome.com/docs/devtools/console/reference#persist) 在重载之间保留消息。
- 使用 <kbd>Ctrl</kbd> + <kbd>L</kbd> 清除控制台视图。

### 源代码与断点

![React Native DevTools Sources 视图中暂停的断点，旁边是一个设备](/docs/assets/debugging-rndt-sources-paused-with-device.jpg)

源代码面板允许您查看应用中的源文件并注册断点。使用断点定义应用应暂停的代码行——允许您检查程序的实时状态并逐步执行代码。

[使用断点暂停代码 | Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints)

:::tip

#### 迷你指南

断点是调试工具包中的基本工具！

1. 使用侧边栏或 <kbd>Cmd ⌘</kbd>+<kbd>P</kbd> / <kbd>Ctrl</kbd>+<kbd>P</kbd> 导航到源文件。
2. 点击代码行旁边的行号列以添加断点。
3. 暂停时使用右上角的导航控件 [逐步执行代码](https://developer.chrome.com/docs/devtools/javascript/reference#stepping)。

:::

#### 有用提示

- 当应用暂停时，会出现“在调试器中暂停”覆盖层。点击它以恢复。
- 注意断点处的右侧面板，它允许您检查当前作用域和调用栈，并设置监视表达式。
- 使用 `debugger;` 语句从文本编辑器快速设置断点。这将通过快速刷新立即到达设备。
- 有多种类型的断点！例如，[条件断点和日志点](https://developer.chrome.com/docs/devtools/javascript/breakpoints#overview)。

### 内存

![在内存面板中检查堆快照](/docs/assets/debugging-rndt-memory.jpg)

内存面板允许您获取堆快照并查看 JavaScript 代码随时间的内存使用情况。

[记录堆快照 | Chrome DevTools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

#### 有用提示

- 使用 <kbd>Cmd ⌘</kbd>+<kbd>F</kbd> / <kbd>Ctrl</kbd>+<kbd>F</kbd> 过滤堆中的特定对象。
- 获取 [分配时间线报告](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler) 对于将内存使用情况随时间显示为图表以识别可能的内存泄漏很有用。

## React DevTools 功能

在集成的 Components 和 Profiler 面板中，您将找到 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器扩展的所有功能。这些功能在 React Native DevTools 中无缝工作。

### React 组件

![使用 React 组件面板选择和定位元素](/docs/assets/debugging-rndt-react-components.gif)

React 组件面板允许您检查和更新渲染的 React 组件树。

- 在 DevTools 中悬停或选择一个元素以在设备上突出显示它。
- 要在 DevTools 中定位元素，点击左上角的“选择元素”按钮，然后点击应用中的任何元素。

#### 有用提示

- 可以使用右侧面板查看和修改组件上的 props 和 state。
- 使用 [React Compiler](https://react.dev/learn/react-compiler) 优化的组件将标注有"Memo ✨"徽章。

:::tip

#### 专业提示：突出显示重新渲染

重新渲染可能是 React 应用性能问题的重要因素。DevTools 可以在组件重新渲染发生时突出显示它们。

- 要启用，点击视图设置 (`⚙︎`) 图标并勾选“组件渲染时突出显示更新”。

![“突出显示更新”设置的位置，旁边是实时渲染覆盖层的演示](/docs/assets/debugging-rndt-highlight-renders.gif)

:::

### React Profiler

![渲染为火焰图的性能分析](/docs/assets/debugging-rndt-react-profiler.jpg)

React Profiler 面板允许您记录性能分析以了解组件渲染和 React 提交的时间。

更多信息，请参阅 [原始 2018 指南](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)（注意其中部分内容可能已过时）。

## 重新连接 DevTools

偶尔，DevTools 可能会与目标设备断开连接。如果发生以下情况，可能会出现此问题：

- 应用已关闭。
- 应用已重新构建（安装了新的原生构建）。
- 应用在原生侧崩溃。
- 开发服务器 (Metro) 已退出。
- 物理设备已断开连接。

断开连接时，将显示一个对话框，消息为“调试连接已关闭”。

![设备断开连接时显示的重连对话框](/docs/assets/debugging-reconnect-menu.jpg)

从这里，您可以：

- **关闭**：选择关闭 (`×`) 图标或点击对话框外部以返回到断开连接前最后状态的 DevTools UI。
- **重新连接**：选择“重新连接 DevTools"，在解决了断开连接的原因后。
