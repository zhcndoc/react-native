---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页面介绍如何使用旧版 JavaScript 调试方法。如果你刚开始使用新的 React Native 或 Expo 应用，我们建议使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接调试 JSC）

当使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)（JSC）作为应用的运行时环境时，你可以使用 Safari 调试应用的 iOS 版本。

1. **仅限实体设备**：打开“设置”应用，然后前往 Safari > 高级，并确保已开启“Web 检查器”。
2. 在 Mac 上打开 Safari 并启用“开发”菜单。你可以依次前往 Safari > 设置……，然后打开“高级”标签页，并选择“显示网页开发者功能”。
3. 在“开发”菜单中找到你的设备，并从子菜单中选择“JSContext”项目。这将打开 Safari 的“Web 检查器”，其中包含类似于 Chrome DevTools 的“控制台”和“源代码”面板。

![打开 Safari Web 检查器](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然默认情况下可能未启用源映射，但你可以按照[此指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html)或[视频](https://www.youtube.com/watch?v=GrGqIIz51k4)中的说明启用源映射，并在源代码中的正确位置设置断点。
:::

:::tip
每次重新加载应用时，都会创建一个新的 JSContext。选择“自动显示 JSContext 的 Web 检查器”可以避免你必须手动选择最新的 JSContext。
:::

## 远程 JavaScript 调试（已移除）

:::warning[重要]
远程 JavaScript 调试已于 React Native 0.79 中移除。请参阅原始的[弃用公告](https://github.com/react-native-community/discussions-and-proposals/discussions/734)。

如果你使用的是较旧版本的 React Native，请前往[对应版本的文档](/versions)。
:::

![Chrome 中的远程调试器窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)
