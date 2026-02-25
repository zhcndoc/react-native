---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页涵盖如何使用传统的 JavaScript 调试方法。如果你是刚开始使用新的 React Native 或 Expo 应用，我们推荐使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接 JSC 调试）

当你的应用使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore) (JSC) 作为运行时，可以用 Safari 调试 iOS 版本的应用。

1. **仅限实体设备**：打开「设置」应用，进入 Safari > 高级，确保“网页检查器”已开启。
2. 在 Mac 端打开 Safari 并启用开发菜单。路径为 Safari > 设置…，然后选择「高级」标签，再勾选“显示开发者菜单”。
3. 在「开发」菜单下找到你的设备，并从子菜单中选择“JSContext”。这将打开 Safari 的网页检查器，其中包含类似于 Chrome DevTools 的控制台和源码面板。

![打开 Safari 网页检查器](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然默认情况下可能没有启用 source maps，但你可以参考 [这篇指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html) 或 [视频](https://www.youtube.com/watch?v=GrGqIIz51k4) 来启用它们，并在源码的正确位置设置断点。
:::

:::tip
每次应用重新加载时，都会创建一个新的 JSContext。选择“自动显示 JSContext 的网页检查器”可以避免你每次都手动选择最新的 JSContext。
:::

## 远程 JavaScript 调试（已移除）

:::warning 重要提示
远程 JavaScript 调试功能自 React Native 0.79 起已被移除。详情请见原[弃用通知](https://github.com/react-native-community/discussions-and-proposals/discussions/734)。

如果你使用的是较老版本的 React Native，请访问对应版本的文档 [查看你的版本](/versions)。
:::

![Chrome 中的远程调试窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)