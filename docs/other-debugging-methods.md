---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页面介绍如何使用传统的 JavaScript 调试方法。如果你正在为新的 React Native 或 Expo 应用开始开发，我们建议使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接 JSC 调试）

当你的应用使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)（JSC）作为运行时引擎时，你可以使用 Safari 来调试 iOS 版本的应用。

1. **仅限实体设备**：打开“设置”应用，进入 Safari > 高级，并确保已开启“Web 检查器”。
2. 在你的 Mac 上，打开 Safari 并启用“开发”菜单。你可以在 Safari > 设置... 中找到它，然后切换到“高级”标签页，再勾选“为网页开发者显示功能”。
3. 在“开发”菜单下找到你的设备，并从子菜单中选择“JSContext”项。这将打开 Safari 的 Web 检查器，其中包含类似于 Chrome DevTools 的“控制台”和“资源”面板。

![Opening Safari Web Inspector](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然源映射可能默认未启用，但你可以按照[这篇指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html)或[视频](https://www.youtube.com/watch?v=GrGqIIz51k4)来启用它们，并在源代码中的正确位置设置断点。
:::

:::tip
每次应用重新加载时，都会创建一个新的 JSContext。选择“Automatically Show Web Inspectors for JSContexts”可以避免你手动选择最新的 JSContext。
:::

## 远程 JavaScript 调试（已移除）

:::warning[重要]
自 React Native 0.79 起，远程 JavaScript 调试已被移除。请查看原始的 [弃用公告](https://github.com/react-native-community/discussions-and-proposals/discussions/734)。

如果你使用的是较旧版本的 React Native，请前往与你的版本对应的文档 [for your version](/versions)。
:::

![Chrome 中的远程调试器窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)
