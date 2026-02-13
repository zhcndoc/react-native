---
id: architecture-overview
title: 架构概览
slug: /overview
---

:::info
欢迎阅读架构概览！如果你刚开始学习 React Native，请参考 <a href="/docs/getting-started">入门指南</a> 部分。继续阅读，了解 React Native 内部的工作原理！

本部分内容仍在进行中，未来会添加更多资料。请务必稍后回来查看更新的信息。
:::

架构概览旨在分享 React Native 内部工作机制的概念性概述。目标读者包括库作者和核心贡献者。如果你是应用开发者，熟悉这些内容并非使用 React Native 的必要条件。你仍然可以从这部分内容中获益，因为它能让你深入了解 React Native 的底层运行机制。欢迎在本部分的 <a href="https://github.com/reactwg/react-native-new-architecture/discussions/9">工作组讨论</a> 中分享你的反馈。

## 目录

- [关于新架构](landing-page)
- 渲染
  - [Fabric](fabric-renderer)
  - [渲染、提交与挂载](render-pipeline)
  - [跨平台实现](xplat-implementation)
  - [视图扁平化](view-flattening)
  - [线程模型](threading-model)
- 构建工具
  - [集成 Hermes](bundled-hermes)
- [术语表](glossary)