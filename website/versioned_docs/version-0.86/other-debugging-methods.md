---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页介绍如何使用旧版 JavaScript 调试方法。如果你正在开始一个新的 React Native 或 Expo 应用，我们建议使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接 JSC 调试）

当你的应用运行时使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)（JSC）时，你可以使用 Safari 来调试应用的 iOS 版本。

1. **仅限实体设备**：打开“设置”应用，进入 Safari > 高级，并确保“Web 检查器”已开启。
2. 在你的 Mac 上，打开 Safari 并启用“开发”菜单。可在 Safari > 设置... 中找到，然后切换到“高级”标签页，再勾选“为 Web 开发者显示功能”。
3. 在“开发”菜单下找到你的设备，并从子菜单中选择“JSContext”项。这将打开 Safari 的 Web 检查器，其中包含类似 Chrome DevTools 的 Console 和 Sources 面板。

![打开 Safari Web 检查器](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然默认情况下可能未启用源映射，但你可以按照[本指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html)或[视频](https://www.youtube.com/watch?v=GrGqIIz51k4)来启用它们，并在源代码的正确位置设置断点。
:::

:::tip
每次应用重新加载时，都会创建一个新的 JSContext。选择“自动为 JSContext 显示 Web 检查器”可以省去手动选择最新 JSContext 的麻烦。
:::

## 远程 JavaScript 调试（已移除）

:::warning[重要]
自 React Native 0.79 起，远程 JavaScript 调试已被移除。请参阅原始的[弃用公告](https://github.com/react-native-community/discussions-and-proposals/discussions/734)。

如果你使用的是较旧版本的 React Native，请前往[对应版本](/versions)的文档。
:::

![Chrome 中的远程调试器窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)
