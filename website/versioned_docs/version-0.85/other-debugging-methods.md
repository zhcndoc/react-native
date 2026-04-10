---
id: other-debugging-methods
title: 其他调试方法
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

本页介绍如何使用旧版 JavaScript 调试方法。如果您刚开始使用新的 React Native 或 Expo 应用，我们建议使用 [React Native DevTools](./react-native-devtools)。

## Safari 开发者工具（直接 JSC 调试）

当使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore) (JSC) 作为应用的运行时，您可以使用 Safari 来调试应用的 iOS 版本。

1. **仅限物理设备**：打开“设置”应用，导航到 Safari > 高级，并确保“网页检查器”已开启。
2. 在 Mac 上，打开 Safari 并启用“开发”菜单。可以在 Safari > 设置... 下找到，然后进入“高级”标签页，选择“显示面向网页开发者的功能”。
3. 在“开发”菜单下找到您的设备，并从子菜单中选择"JSContext"项。这将打开 Safari 的网页检查器，其中包括类似于 Chrome DevTools 的控制台和源代码面板。

![打开 Safari 网页检查器](/docs/assets/debugging-safari-developer-tools.jpg)

:::tip
虽然源代码映射可能默认未启用，但您可以遵循 [此指南](https://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html) 或 [视频](https://www.youtube.com/watch?v=GrGqIIz51k4) 来启用它们，并在源代码中的正确位置设置断点。
:::

:::tip
每次应用重新加载时，都会创建一个新的 JSContext。选择“自动显示 JSContext 的网页检查器”可以免除您手动选择最新 JSContext 的需要。
:::

## 远程 JavaScript 调试（已移除）

:::warning 重要
远程 JavaScript 调试已在 React Native 0.79 中被移除。请参阅原始的 [弃用公告](https://github.com/react-native-community/discussions-and-proposals/discussions/734)。

如果您使用的是较旧版本的 React Native，请前往 [对应版本](/versions) 的文档。
:::

![Chrome 中的远程调试器窗口](/docs/assets/debugging-chrome-remote-debugger.jpg)
