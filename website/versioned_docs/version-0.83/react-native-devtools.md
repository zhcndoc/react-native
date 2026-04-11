---
id: react-native-devtools
title: React Native 调试工具
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 调试工具是我们为 React Native 提供的现代化调试体验。从零开始专门构建，旨在比以往的调试方法更具集成性、准确性和可靠性。

![React Native 调试工具打开“欢迎”窗格](/docs/assets/debugging-rndt-welcome-083.jpg)

React Native 调试工具旨在调试 React 应用相关的问题，而不是替代原生工具。如果您想检查 React Native 的底层平台层（例如，在开发原生模块时），请使用 Android Studio 和 Xcode 中提供的调试工具（参见 [调试原生代码](/docs/debugging-native-code)）。

<details>
<summary>**💡 兼容性** — 0.76 版本发布</summary>

React Native 调试工具支持所有运行 Hermes 的 React Native 应用。它替代了之前的 Flipper、实验性调试器以及 Hermes 调试器（Chrome）前端。

不可能将 React Native 调试工具用于旧版本的 React Native。

- **Chrome 浏览器开发者工具 — 不支持**
  - 不再支持通过 `chrome://inspect` 连接 React Native。功能可能无法正常工作，因为最新版 Chrome DevTools（构建匹配最新浏览器功能和 API）未经测试，且前端缺少我们自定义的改进。取而代之的是，我们随 React Native 调试工具一起提供一个支持版本。
- **Visual Studio Code — 不支持**（已有情况）
  - 第三方扩展如 [Expo Tools](https://github.com/expo/vscode-expo) 和 [Radon IDE](https://ide.swmansion.com/) 可能兼容性有所提升，但 React 团队不直接支持。

</details>
<details>
<summary>**💡 反馈与常见问题**</summary>

我们希望您用来调试 React 各平台的工具可靠、熟悉、简单且统一。本页描述的所有功能均基于这些原则构建，我们也希望未来提供更多能力。

我们正在积极迭代 React Native 调试工具的未来，并创建了一个集中讨论的 [GitHub 讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/819)，跟踪问题、常见问答和反馈。

</details>

## 核心功能

React Native 调试工具基于 Chrome DevTools 前端。如果您有 Web 开发背景，会觉得它的功能很熟悉。建议先浏览 [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools)，其中包含完整指南和视频资源。

### 控制台

![React Native 调试工具 Sources 视图中的一系列日志，旁边是设备](/docs/assets/debugging-rndt-console.jpg)

控制台面板允许您查看和筛选消息，执行 JavaScript，检查对象属性等。

[控制台功能参考 | Chrome DevTools](https://developer.chrome.com/docs/devtools/console/reference)

#### 实用小贴士

- 如果您的应用产生大量日志，请使用过滤框或更改显示的日志级别。
- 使用 [实时表达式](https://developer.chrome.com/docs/devtools/console/live-expressions) 监视变量随时间变化。
- 通过 [保留日志](https://developer.chrome.com/docs/devtools/console/reference#persist) 功能可在重新加载后保持消息不丢失。
- 使用 <kbd>Ctrl</kbd> + <kbd>L</kbd> 清空控制台视图。

### 源码和断点

![React Native 调试工具 Sources 视图中的暂停断点，旁边是设备](/docs/assets/debugging-rndt-sources-paused-with-device.jpg)

Sources 面板允许您查看应用的源文件并设置断点。断点是在代码行设置的暂停点，允许您检查程序的实时状态，并逐步执行代码。

[使用断点暂停代码 | Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints)

:::tip

#### 小指南

断点是调试利器！

1. 使用侧边栏或 <kbd>Cmd ⌘</kbd>+<kbd>P</kbd> / <kbd>Ctrl</kbd>+<kbd>P</kbd> 导航到源文件。
2. 点击代码行号栏旁边添加断点。
3. 使用右上角的导航控件在暂停时 [逐步执行代码](https://developer.chrome.com/docs/devtools/javascript/reference#stepping)。

:::

#### 实用小贴士

- 当应用暂停时，会出现“在调试器中暂停”的覆盖层，点击该层即可继续运行。
- 断点处请关注右侧面板，可检查当前作用域、调用栈并设置观察表达式。
- 使用 `debugger;` 语句在代码中快速设置断点，Fast Refresh 会立即生效。
- 有多种断点类型！例如，[条件断点和日志断点](https://developer.chrome.com/docs/devtools/javascript/breakpoints#overview)。

### 网络 <div className="label primary">自 0.83 版本起</div>

![React Native 调试工具 Network 面板中的网络请求](/docs/assets/debugging-rndt-network.jpg)

Network 面板允许您查看和检查应用发出的网络请求。记录的请求提供详细元数据，如时长、请求头/响应头及响应预览。

打开调试工具时，网络请求会被自动记录。我们支持大部分 Chrome 功能，但有一些例外，详见下文。

<details>
<summary><strong>💡 网络事件覆盖与 Expo 支持</strong></summary>

**捕获哪些网络事件？**

当前，我们记录通过 `fetch()`、`XMLHttpRequest` 和 `<Image>` 发起的所有网络调用，后续将支持自定义网络库（如 Expo Fetch）。

**Expo 网络差异**

因此，使用 Expo 的应用仍会看到"Expo Network"面板 —— 这是 Expo 框架的独立实现，会记录额外请求源，但功能略有限制：

- 覆盖 Expo 专用的网络事件。
- 不支持请求发起者显示。
- 不集成 Performance 面板。

我们正与 Expo 团队合作，未来版本将整合 Expo Fetch 及第三方网络库的新网络检测管线。

**未实现的功能**

首次发布时，我们尚未在 React Native 中支持：

- WebSocket 事件
- 网络响应模拟
- 网络节流模拟

</details>

<details>
<summary><strong>💡 响应预览缓冲区大小</strong></summary>

如果您检查大量响应数据，响应预览缓存在设备上限为 100MB 的缓冲区内。该缓存太大时，会优先清理最旧请求的响应预览（元数据不会清理）。

</details>

#### 实用小贴士

- 使用“发起者”标签查看网络请求的调用栈位置。
- 网络事件也会在 Performance 面板的 Network 轨迹中显示。

### 性能 <div className="label primary">自 0.83 版本起</div>

![React Native 调试工具 Performance 面板中的性能追踪](/docs/assets/debugging-rndt-performance.jpg)

性能追踪允许您记录性能会话，了解 JavaScript 代码运行状况及耗时所在。React Native 中，我们展示 JavaScript 执行、React 性能轨迹、网络事件和自定义 [用户时序](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)，并在统一的时间线中呈现。

#### 实用小贴士

- 使用 [注释](https://developer.chrome.com/docs/devtools/performance/annotations)（Shift 拖动）标注性能追踪，方便 [保存和共享](https://developer.chrome.com/docs/devtools/performance/save-trace) 给团队成员。注释还能快速查看时间跨度（单位为秒）。
- 在应用中使用 [`PerformanceObserver` API](./global-PerformanceObserver.md) 监听性能事件，便于捕获运行时性能遥测。

#### 了解更多

- [React 性能轨迹](https://react.dev/reference/dev-tools/react-performance-tracks)
- [性能 API > 用户时序 | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
- ["像资深开发者一样调试 — React Native 性能面板" | Software Mansion](https://blog.swmansion.com/react-native-debugging-new-performance-panel-in-react-native-0-83-21ca90871f6d)

### 内存

![在 Memory 面板中查看堆快照](/docs/assets/debugging-rndt-memory.jpg)

Memory 面板允许您捕获堆快照并查看 JavaScript 内存使用情况的时间变化。

[记录堆快照 | Chrome DevTools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

#### 实用小贴士

- 使用 <kbd>Cmd ⌘</kbd>+<kbd>F</kbd> / <kbd>Ctrl</kbd>+<kbd>F</kbd> 过滤堆中的特定对象。
- 生成 [内存分配时间线报告](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler) 可查看内存随时间变化的图形，辅助识别可能的内存泄漏。

## React DevTools 功能

在集成的 Components 和 Profiler 面板中，您可以使用 [React DevTools](https://react.dev/learn/react-developer-tools) 浏览器插件的全部功能。它们与 React Native 调试工具无缝协作。

### React 组件

![使用 React Components 面板选择和定位元素](/docs/assets/debugging-rndt-react-components.gif)

React Components 面板允许您检查和更新渲染的 React 组件树。

- 在 DevTools 中悬停或选中元素，即可在设备上高亮显示。
- 若要在 DevTools 中定位某个元素，点击左上角“选中元素”按钮，然后在应用中点击任何元素。

#### 实用小贴士

- 组件的 Props 和 State 可在右侧面板实时查看和修改。
- 优化过的组件（使用 [React Compiler](https://react.dev/learn/react-compiler)）会带有"Memo ✨"徽章。

:::tip

#### 高级技巧：高亮重新渲染

重新渲染是 React 应用性能问题的常见原因。DevTools 可实时高亮显示组件重新渲染。

- 只需点击视图设置（`⚙︎`）图标，勾选“组件渲染时高亮更新”。

![高亮更新设置位置，以及实时渲染叠加动画](/docs/assets/debugging-rndt-highlight-renders.gif)

:::

### React 性能分析器

![火焰图形式展示的性能分析结果](/docs/assets/debugging-rndt-react-profiler.jpg)

React Profiler 面板允许您录制性能剖析，理解组件渲染和 React 提交的时间节点。

更多信息请参考 [2018 年的原始指南](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)（注意有部分内容可能过期）。

## 重新连接调试工具

调试工具有时会与目标设备断开连接，可能原因包括：

- 应用被关闭。
- 应用重新构建（安装了新的原生构建）。
- 应用原生端崩溃。
- 开发服务器（Metro）关闭。
- 物理设备断开连接。

断开连接后，会显示“调试连接已关闭”消息的对话框。

![设备断开连接时显示的重新连接对话框](/docs/assets/debugging-reconnect-menu.jpg)

您可以选择：

- **关闭**：点击关闭（`×`）图标或对话框外区域，返回断开前的调试工具界面。
- **重新连接**：选中“重新连接调试工具”，排查断开原因后再次连接。