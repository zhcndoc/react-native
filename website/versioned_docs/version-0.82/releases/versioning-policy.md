---
title: 版本控制策略
---

本页描述了我们在 `react-native` 包上遵循的版本控制策略。

我们会对每个版本的 React Native 进行彻底测试，包括手动测试和自动化测试，以确保质量不会倒退。

React Native 的 `stable` 渠道遵循下述的 0.x.y 发布策略。

React Native 还提供 `nightly` 发布渠道，以鼓励对实验性功能进行早期反馈。

本页描述了我们对 `react-native` 以及 `@react-native` 作用域下包的版本号方法。

## 稳定发布版本

React Native 定期发布稳定版本。

我们遵循 0.x.y 版本控制方案：

- 破坏性变更将在新的次版本中发布，即我们增加 x 数字（例如：0.78.0 到 0.79.0）。
- 新功能和 API 也将在新的次版本中发布，即我们增加 x 数字（例如：0.78.0 到 0.79.0）。
- 关键错误修复将在新的补丁版本中发布，即我们增加 y 数字（例如：0.78.1 到 0.78.2）。

稳定版本定期发布，最新版本在 NPM 上标记为 `latest`。

同一主版本号下的一系列发布称为 **次版本系列**（例如 0.76.x 是 0.76.0、0.76.1、0.76.2 等的次版本系列）。

你可以在 [发布页面](./) 阅读更多关于我们要 **对稳定性的承诺**。

### 破坏性变更

破坏性变更对所有人都不方便，我们正试图将它们减少到最低限度。我们在每个稳定版本中发布的所有破坏性变更将在以下位置突出显示：

- [React Native 变更日志](https://github.com/facebook/react-native/blob/main/CHANGELOG.md) 的 _Breaking_ 和 _Removed_ 部分
- 每篇发布博客文章的 _Breaking Changes_ 部分

对于每个破坏性变更，我们承诺解释其背后的原因，尽可能提供替代 API，并最小化对最终用户的影响。

### 什么是破坏性变更？

我们认为以下情况属于 React Native 的破坏性变更：

- 不兼容的 API 变更（即 API 被变更或移除，导致你的代码因该变更而无法再编译/运行）。例如：
  - 任何 JS/Java/Kotlin/Obj-c/C++ API 的变更，需要你的代码随之变更才能编译。
  - `@react-native/codegen` 内部不向后兼容的变更。
- 重大的行为/运行时变更。例如：
  - 某个属性的布局逻辑发生剧烈变化。
- 开发体验的重大变更。例如：
  - 完全移除了某个调试功能。
- 任何传递依赖的主要版本升级。例如：
  - 将 React 从 18.x 升级到 19.x
  - 将 Android 上的 Target SDK 从 34 升级到 35）。
- 任何支持的平台版本减少。例如：
  - 将 Android 上的 min SDK 从 21 升级到 23
  - 将 min iOS 版本升级到 15.1。

我们不认为以下变更是破坏性变更：

- 修改以 `unstable_` 前缀开头的 API：这些 API 暴露实验性功能，我们对其最终形态没有信心。通过带有 `unstable_` 前缀发布这些内容，我们可以更快迭代并早日获得稳定的 API。
- 更改私有或内部 API：这些 API 通常带有 `internal_` 、`private_` 前缀，或位于 `internal/` 或 `private/` 文件夹/包内。虽然其中一些 API 可能因工具限制而具有公共可见性，但我们不认为它们是我们公共 API 的一部分，因此我们会在不事先通知的情况下更改它们。
  - 同样，如果你访问内部属性名，如 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 或 `__reactInternalInstance$uk43rzhitjg`，没有任何保证。后果自负。
  - 使用 `@FrameworkAPI` 注解的类也被视为内部类
- 更改工具/开发 API：React Native 的一些公共 API 保留用于与框架和其他工具集成。例如，一些 Metro API 或 React Native DevTools API 应该仅由其他框架或工具使用。对这些 API 的更改会直接与受影响的工具讨论，不被视为破坏性变更（我们不会在发布博客文章中广泛沟通这些内容）。
- 开发警告：由于警告不影响运行时行为，我们可能会在任何版本之间添加新警告或修改现有警告。

如果我们预期某个变更会在社区中引起广泛问题，我们仍将尽最大努力为生态系统提供渐进式迁移路径。

### 弃用周期

随着我们继续开发和演进 React Native，我们编写新的 API，有时需要弃用现有的 API。这些 API 将经历弃用周期。

一旦 API 被弃用，它将在 **后续** 稳定版本中 **也** 保持可用。

例如：如果某个 API 在 React Native 0.76.x 中被弃用，它在 0.77.x 中仍然可用，并且不会早于 React Native 0.78.x 被移除。

有时我们决定将弃用的 API 保留更长时间，如果我们觉得生态系统需要更多时间从中迁移。对于这些 API，我们通常提供警告以帮助用户迁移离开它们。

## 发布渠道

React Native 依赖蓬勃发展的开源社区来提交错误报告、发起拉取请求和提交 RFC。为了鼓励反馈，我们支持多个发布渠道。

:::note
本节内容与从事框架、库或开发者工具开发的开发者最相关。主要使用 React Native 构建面向用户的应用程序的开发者无需担心 latest 以外的发布渠道。
:::

### latest

`latest` 用于稳定的、符合语义化版本的 React Native 发布。这是你从 npm 安装 React Native 时获得的版本。这是你今天已经在使用 的渠道。直接使用 React Native 的面向用户的应用程序使用此渠道。

我们定期发布更新的 React Native 次版本系列，并更新 `latest` 标签以反映最新的稳定版本。

### next

在我们宣布新的 React Native 版本稳定之前，我们会发布一系列 **发布候选版本**，从 RC0 开始。这些版本是预发布版本（遵循版本控制方案 `0.79.0-rc.0`），并在 NPM 上标记为 `next`。

当创建新分支时，并且 RC 版本开始在 NPM 和 GitHub 上发布，针对 React Native 的 `next` 版本测试你的库/框架是个好主意。

这将确保你的项目将继续与即将到来的 React Native 版本良好配合。

但是，不要直接在面向用户的应用程序中使用预发布版本/RC，因为它们不被视为生产就绪。

### nightly

我们还发布 `nightly` 发布渠道。Nightly 版本每天从 [facebook/react-native](https://github.com/facebook/react-native) 的 `main` 分支发布。Nightly 版本被视为 React Native 的不稳定版本，不建议用于生产环境。

Nightly 版本遵循版本控制方案 `0.80.0-nightly-<DATE>-<SHA>`，其中 `<DATE>` 是 nightly 的日期，`<SHA>` 是用于发布此 nightly 的提交的 SHA。

Nightly 发布仅用于测试目的，我们不保证行为不会在 nightly 之间发生变化。它们不遵循我们用于 latest/next 发布的 semver 协议。

设置一个 CI 工作流每天针对 react-native@nightly 版本测试你的库是个好主意，以确保你的库将继续与未来版本配合工作。
