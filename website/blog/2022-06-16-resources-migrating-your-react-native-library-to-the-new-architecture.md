---
title: 帮助迁移 React Native 库到新架构
authors: [cipolleschi]
tags: [公告]
date: 2022-06-16
---

**简短摘要**：我们正在改进支持 React Native 新架构的资源。我们已经发布了一个帮助迁移您的应用的仓库（[RNNewArchitectureApp](https://github.com/react-native-community/RNNewArchitectureApp)）以及一个针对库的仓库（[RNNewArchitectureLibraries](https://github.com/react-native-community/RNNewArchitectureLibraries)）。我们还在改造网站上的[新架构指南](https://github.com/facebook/react-native-website/pull/3037)，并创建了一个[GitHub 工作组](https://github.com/reactwg/react-native-new-architecture/discussions)，以解答与新架构相关的问题。

<!--truncate-->

## 介绍

在本文中，我们将分享一些用于帮助您将**本地模块**和**本地组件**迁移到它们的**新架构**等价物——**TurboModule**和**Fabric 组件**的工具和资源更新。

React Native 用户依赖大量的开源库来构建应用。为了实现完整且一致的生态系统，这些库有必要迁移，以便所有人都能受益于新架构解锁的功能和性能提升。

以下是我们正在进行的支持库开发者迁移到新架构的工作：

- **文档**：我们正在扩展网站上的[新架构指南](https://github.com/facebook/react-native-website/pull/3037)，涵盖更多新架构的概念以及如何开发您的组件。
- **示例迁移**：我们搭建了两个仓库，演示如何将 React Native 应用迁移到新架构（[RNNewArchitectureApp](https://github.com/react-native-community/RNNewArchitectureApp)），以及如何创建同时兼容两种架构的**Fabric 组件**和**TurboModule**（[RNNewArchitectureLibraries](https://github.com/react-native-community/RNNewArchitectureLibraries)）。
- **支持**：今年早些时候，我们建立了一个专门的[GitHub 工作组](https://github.com/reactwg/react-native-new-architecture/discussions)，用于讨论和解答有关新架构的问题。

本文将深入介绍这些资源，并详细说明如何高效地使用它们。最后，我们将提供目前最常用 React Native 库的迁移状态快照。

### 文档

在过去六个月里，我们添加了一个[采用新架构的指南](https://github.com/reactwg/react-native-new-architecture#guides)以及关于 Fabric 的[架构深入解析](/architecture/overview)。我们计划扩展内容，包含更多关于创建 TurboModules、理解 Codegen 等的指南和文档，并预计在 0.70 版本发布时提供更新。

目前，**新架构**指南涵盖了如何[迁移您的应用](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md)和[迁移您的库](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-libraries-prerequisites.md)，以正确支持新架构。

如果您对该指南的演进感兴趣或有反馈，欢迎关注[此](https://github.com/facebook/react-native-website/pull/3037)拉取请求。

### 示例迁移

对于希望通过代码跟进的开发者，我们准备了两个示例仓库。

#### RNNewArchitectureApp

[此仓库](https://github.com/react-native-community/RNNewArchitectureApp)用于演示如何将应用、本地模块和本地组件从 React Native 0.67 版本的旧架构迁移到新架构及最新版本的 React Native。每个提交对应一个独立的迁移步骤。

<figure>
    <img src="/blog/assets/new-arch-example-steps-to-migrate-an-app.png" alt="迁移应用的示例步骤" />
    <figcaption>RNNewArchitectureApp 仓库中的迁移提交列表</figcaption>
</figure>

仓库结构如下：

- **main** 分支无代码，仅有 README.md 介绍其他分支。
- 多个迁移分支，展示从特定 React Native 版本迁移到另一个版本的过程。

一些迁移分支包含一个 **RUN.md** 文件，用更易读的方式描述了每个提交所执行的具体步骤。

我们计划保持该示例随着最新的稳定版本持续更新，新增对任何即将发布的 React Native 次版本的迁移支持。如果您发现在任何步骤中有问题，请在仓库中提交 Issue。我们将一直维护此仓库，直到大多数 React Native 用户迁移完成。

#### RNNewArchitectureLibraries

类似地，[此仓库](https://github.com/react-native-community/RNNewArchitectureLibraries)提供了一步步创建**TurboModule**和**Fabric 组件**的指南，重点确保新旧架构间的向下兼容性。

仓库组织方式与前一个类似：

- **main** 分支无代码，仅有 README.md 介绍其他分支。
- 其他分支展示如何开发**TurboModules**和**Fabric 组件**。

我们计划根据 React Native 的新版本持续更新该示例，特别是那些影响库开发的版本，同时添加更多使用高级特性（如实现命令、事件发射器、自定义状态）的示例。如果发现错误，请在示例仓库提交 issue。

### 支持

我们已创建一个专门的[工作组](https://github.com/reactwg/react-native-new-architecture)，为社区提供提问、新架构相关更新的空间。如果您是库维护者，这是一个寻找问题答案和反馈需求的重要渠道。加入请参照[此说明](https://github.com/reactwg/react-native-new-architecture#how-to-join-the-working-group)。欢迎所有人参与。

工作组分为多个板块：

- [公告](https://github.com/reactwg/react-native-new-architecture/discussions/categories/announcements)：分享 React Native 新架构推广的重要里程碑和更新。
- [深入解析](https://github.com/reactwg/react-native-new-architecture/discussions/categories/deep-dive)：讨论深入技术专题。
- [文档](https://github.com/reactwg/react-native-new-architecture/discussions/categories/documentation)：交流新架构文档和迁移资料。
- [库](https://github.com/reactwg/react-native-new-architecture/discussions/categories/libraries)：讨论第三方库及其迁移新架构的进展。
- [问答](https://github.com/reactwg/react-native-new-architecture/discussions/categories/q-a)：向社区提问获取新架构相关帮助。
- [版本发布](https://github.com/reactwg/react-native-new-architecture/discussions/categories/releases)：聊发布版本特定的 bug 和构建问题。

有效利用该群组的方法：

- **确保您的库已列在[库](https://github.com/reactwg/react-native-new-architecture/discussions/categories/libraries)板块**。这样我们能分享您库的迁移状态，也有助于了解库作者面临的难题，更好地支持您。
- **遇到阻碍时，充分利用[问答](https://github.com/reactwg/react-native-new-architecture/discussions/categories/q-a)板块求助**。团队和社区专家会尽力支持。
- **关注其他板块，留意可能影响您的话题**。新版本可能带来您期待的 API。您可以通过 GitHub 订阅相关讨论。

我们计划持续支持该群组，直至**新架构默认启用且所有主要库均已迁移完成**。

### 热门库迁移状态

库的维护者们在[工作组](https://github.com/reactwg/react-native-new-architecture/discussions/categories/libraries)分享了各自的迁移进度，我们这里提供简要概览：

- [react-native-gesture-handler](https://github.com/reactwg/react-native-new-architecture/discussions/15)：✅ 已迁移
- [react-native-navigation](https://github.com/reactwg/react-native-new-architecture/discussions/17)：🏃‍♂️ 正在进行中
- [react-native-pager-view](https://github.com/reactwg/react-native-new-architecture/discussions/16)：🏃‍♂️ 正在进行中
- [react-native-reanimated](https://github.com/reactwg/react-native-new-architecture/discussions/14)：✅ 已迁移，正在测试和性能分析
- [react-native-screens](https://github.com/reactwg/react-native-new-architecture/discussions/13)：🏃‍♂️ 正在进行中
- [react-native-slider](https://github.com/reactwg/react-native-new-architecture/discussions/38)：🎬 已启动
- [react-native-template-new-architecture](https://github.com/reactwg/react-native-new-architecture/discussions/21)：✅ 已迁移，正在逐步采用/测试更多配套库
- [react-native-template-typescript](https://github.com/reactwg/react-native-new-architecture/discussions/22)：✅ 已迁移
- [react-native-webview](https://github.com/reactwg/react-native-new-architecture/discussions/19)：🎬 已启动

## 后续计划

我们致力于支持 React Native 社区采用新架构。具体来说，我们将继续：

- 在**工作组**中提供尽力支持。
- 在 **RNNewArchitecture** 仓库中提供更多示例，展示新架构的强大能力。
- 提供清晰且最新的**新架构**文档。
- 跟踪重要 React Native 库的迁移状态。
- 简化开发者的迁移路径。

此外，React Native 0.69 版本将提升新架构的开发体验，包含应用和库开发者的改进信息。您可以在[这里](https://github.com/reactwg/react-native-releases/discussions/21)了解 0.69.0 版本的更多内容。

我们对与大家一起用**新架构**创造的未来充满期待！