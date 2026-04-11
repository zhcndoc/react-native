---
title: 版本控制策略
---

本页描述了我们在 `react-native` 包中遵循的版本控制策略。

我们对每个版本的 React Native 进行彻底测试，包括手动测试和自动化测试，以确保质量不会倒退。

React Native 的 `stable` 渠道遵循下面描述的 0.x.y 发布策略。

React Native 还提供 `nightly` 发布渠道，以鼓励对实验性功能提供早期反馈。

本页描述了我们对 `react-native` 以及 `@react-native` 作用域下包的版本号方法。

## 稳定发布版本

React Native 定期发布稳定版本。

我们遵循 0.x.y 版本控制方案：

- 破坏性变更将在新的小版本中发布，即我们增加 x 数字（例如：从 0.78.0 到 0.79.0）。
- 新功能和 API 也将在新的小版本中发布，即我们增加 x 数字（例如：从 0.78.0 到 0.79.0）。
- 关键错误修复将在新的补丁版本中发布，即我们增加 y 数字（例如：从 0.78.1 到 0.78.2）。

稳定版本定期发布，最新的版本在 NPM 上标记为 `latest`。

同一小版本号下的一系列发布称为 **小版本系列**（例如 0.76.x 是 0.76.0、0.76.1、0.76.2 等的小版本系列）。

你可以在 [发布页面](./) 阅读更多关于我们 **致力于稳定性** 的信息。

### 破坏性变更

破坏性变更对每个人都不方便，我们正试图将它们减少到最低限度。我们在每个稳定版本中发布的所有破坏性变更将在以下位置突出显示：

- [React Native 变更日志](https://github.com/facebook/react-native/blob/main/CHANGELOG.md) 的 _Breaking_ 和 _Removed_ 部分
- 每个发布博客文章的 _Breaking Changes_ 部分

对于每个破坏性变更，我们致力于解释其背后的原因，如果可能提供替代 API，并尽量减少对最终用户的影响。

### 什么是破坏性变更？

我们认为以下情况属于 React Native 的破坏性变更：

- 不兼容的 API 变更（即 API 被更改或移除，导致你的代码因该变更而无法编译/运行）。示例：
  - 任何 JS/Java/Kotlin/Obj-c/C++ API 的变更，需要更改你的代码才能编译。
  - `@react-native/codegen` 内部不向后兼容的变更。
- 重大的行为/运行时变更。示例：
  - 某个 prop 的布局逻辑发生了巨大变化。
- 开发体验的重大变更。示例：
  - 完全移除了某个调试功能。
- 任何传递依赖的主要版本升级。示例：
  - 将 React 从 18.x 升级到 19.x
  - 将 Android 上的 Target SDK 从 34 升级到 35）。
- 减少任何我们支持的平台版本。示例：
  - 将 Android 上的 min SDK 从 21 升级到 23
  - 将最低 iOS 版本升级到 15.1。

我们不认为以下变更是破坏性的：

- 修改以 `unstable_` 前缀开头的 API：这些 API 暴露实验性功能，我们对其最终形态没有把握。通过带有 `unstable_` 前缀发布这些内容，我们可以更快地迭代并更早获得稳定的 API。
- 对私有或内部 API 的变更：这些 API 通常以前缀 `internal_`、`private_` 开头，或者位于 `internal/` 或 `private/` 文件夹/包内。虽然其中一些 API 可能由于工具限制具有公共可见性，但我们不认为它们是我们公共 API 的一部分，因此我们将不经事先通知就更改它们。
  - 同样，如果你访问内部属性名，如 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 或 `__reactInternalInstance$uk43rzhitjg`，没有任何保证。后果自负。
  - 标注了 `@FrameworkAPI` 的类也被视为内部类
- 对工具/开发 API 的变更：React Native 的一些公共 API 保留用于与框架和其他工具集成。例如，某些 Metro API 或 React Native DevTools API 应该仅由其他框架或工具使用。对这些 API 的变更会与受影响的工具直接讨论，不被视为破坏性变更（我们不会在发布博客文章中广泛传达这些变更）。
- 开发警告：由于警告不影响运行时行为，我们可以在任何版本之间添加新警告或修改现有警告。

如果我们预期某个变更会在社区中引起广泛问题，我们仍将尽最大努力为生态系统提供渐进式的迁移路径。

### 弃用周期

随着我们继续开发和演进 React Native，我们编写新的 API，有时需要弃用现有的 API。这些 API 将经历一个弃用周期。

一旦 API 被弃用，它将在 **后续** 稳定版本中 **也** 保持可用。

例如：如果某个 API 在 React Native 0.76.x 中被弃用，它在 0.77.x 中仍然可用，并且不会早于 React Native 0.78.x 被移除。

有时我们决定将弃用的 API 保留更长时间，如果我们觉得生态系统需要更多时间从中迁移。对于这些 API，我们通常提供警告以帮助用户从中迁移。

## 发布渠道

React Native 依赖一个蓬勃发展的开源社区来提交错误报告、开启拉取请求和提交 RFC。为了鼓励反馈，我们确实支持多个发布渠道。

:::note
本节与从事框架、库或开发工具开发的开发者最相关。主要使用 React Native 构建面向用户应用程序的开发者无需担心除 latest 以外的发布渠道。
:::

### latest

`latest` 用于稳定的、遵循语义版本的 React Native 发布。这是你从 npm 安装 React Native 时得到的版本。这是你今天已经在使用的渠道。直接使用 React Native 的面向用户的应用程序使用此渠道。

我们定期发布更新的 React Native 小版本系列，并更新 `latest` 标签以反映最新的稳定版本。

### next

在我们宣布新的 React Native 发布稳定之前，我们会发布一系列 **发布候选版本**，从 RC0 开始。这些版本是预发布版本（遵循版本控制方案 `0.79.0-rc.0`），并在 NPM 上标记为 `next`。

当发生新的分支切割，并且 RC 开始在 NPM 和 GitHub 上发布时，最好针对 `next` 版本的 React Native 测试你的库/框架。

这将确保你的项目将继续与即将发布的 React Native 版本良好配合。

但是，不要直接在面向用户的应用程序中使用预发布/RC 版本，因为它们不被视为生产就绪。

### nightly

我们还发布 `nightly` 发布渠道。Nightly 版本每天从 [facebook/react-native](https://github.com/facebook/react-native) 的 `main` 分支发布。Nightly 版本被视为 React Native 的不稳定版本，不建议用于生产环境。

Nightly 版本遵循版本控制方案 `0.80.0-nightly-<DATE>-<SHA>`，其中 `<DATE>` 是 nightly 的日期，`<SHA>` 是用于发布此 nightly 的提交的 SHA。

nightly 发布仅用于测试目的，我们不保证行为不会在 nightly 之间发生变化。它们不遵循我们用于 latest/next 发布的 semver 协议。

最好设置一个 CI 工作流，每天针对 react-native@nightly 版本测试你的库，以确保你的库将继续与未来的发布配合工作。
