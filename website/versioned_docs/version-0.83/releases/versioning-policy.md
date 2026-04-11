---
title: 版本控制政策
---

本页面介绍我们对 `react-native` 包遵循的版本控制政策。

我们对每个 React Native 版本都进行彻底测试，包括手动测试和自动化测试，以确保质量不退步。

React Native 的 `stable` 版本通道遵循下面描述的 0.x.y 发布策略。

React Native 还提供 `nightly` 版本通道，鼓励对实验性功能的早期反馈。

本页面描述了我们对 `react-native` 以及 `@react-native` 范围内包的版本号处理方式。

## 稳定版本发布

React Native 按照固定节奏发布稳定版本。

我们遵循 0.x.y 版本号 schema：

- 破坏性变更将放在新的小版本中发布，即我们将 x 数字递增（例如：0.78.0 到 0.79.0）。
- 新功能和 API 也将在新的小版本中发布，即我们将 x 数字递增（例如：0.78.0 到 0.79.0）。
- 关键 bug 修复将放在新的补丁版本中发布，即我们将 y 数字递增（例如：0.78.1 到 0.78.2）。

稳定版本会定期发布，最新版本在 NPM 上标记为 `latest`。

同一小版本号下的一系列发布称为 **小版本系列**（例如 0.76.x 指 0.76.0、0.76.1、0.76.2 等版本）。

你可以在 [发布页面](./) 了解我们对**稳定性的承诺**。

### 破坏性变更

破坏性变更对所有人都很不便，我们尽力将它们压缩到最少。每次稳定发布中所有的破坏性变更都会在以下位置重点标注：

- [React Native 更新日志](https://github.com/facebook/react-native/blob/main/CHANGELOG.md) 的 _Breaking_ 和 _Removed_ 部分
- 每个版本博客文章的 _Breaking Changes_ 部分

针对每个破坏性变更，我们承诺说明其背后的原因，尽可能提供替代 API，且最大程度减少最终用户的影响。

### 什么是破坏性变更？

我们认为以下情况构成 React Native 的破坏性变更：

- 不兼容的 API 变更（即 API 被更改或移除，导致你的代码因变更无法编译/运行）。示例包括：
  - 任何 JS/Java/Kotlin/Obj-c/C++ API 发生变更，需要你改动代码才能编译。
  - `@react-native/codegen` 内部的非向后兼容变更。
- 重大的行为/运行时变更。示例：
  - 某个属性的布局逻辑发生了巨大变化。
- 开发体验的重大变更。示例：
  - 一个调试功能被完全移除。
- 我们任一传递依赖的重大升级。示例：
  - React 从 18.x 升级到 19.x
  - Android 目标 SDK 从 34 升级到 35。
- 支持的平台版本减少。示例：
  - Android 最低 SDK 从 21 升级到 23
  - iOS 最低版本升级到 15.1

以下情况不被视为破坏性变更：

- 修改以 `unstable_` 前缀开头的 API：这些 API 暴露实验性特性，我们对其最终形态尚无把握。以 `unstable_` 前缀发布，能让我们更快迭代，尽早推出稳定 API。
- 修改私有或内部 API：这类 API 通常以 `internal_`、`private_` 开头，或存在于 `internal/` 或 `private/` 文件夹/包中。尽管一些由于工具限制可能具备公共可见性，我们不认为它们是公共 API，因此会无须提前通知地更改它们。
  - 同样，如果访问诸如 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 或 `__reactInternalInstance$uk43rzhitjg` 之类的内部属性名，则不予保证。你需要自行承担风险。
  - 以 `@FrameworkAPI` 注释的类也被视作内部 API。
- 修改工具链/开发 API：React Native 的部分公共 API 保留给框架和其他工具集成使用，例如 Metro API 或 React Native DevTools API 等，仅供其他框架或工具调用。对这些 API 的修改会直接与受影响方沟通，不视为破坏性变更（不会在版本博客中广泛说明）。
- 开发警告：由于警告不会影响运行时行为，我们可能在任意版本间添加或修改警告。

如果预计某项变更会引发社区普遍问题，我们仍会尽最大努力为生态系统提供渐进式迁移路径。

### 弃用周期

随着 React Native 的持续开发和演进，我们会编写新 API，有时需弃用旧 API。被弃用的 API 将经历弃用周期。

API 一旦弃用，在**随后的**稳定版本中仍将可用。

举例：某 API 在 React Native 0.76.x 中被弃用，0.77.x 依然可用，且通常不会早于 0.78.x 移除。

有时若觉得生态系统需要更多时间迁移，我们会留存弃用 API 更长时间，并通常提供警告提示用户迁移。

## 发布通道

React Native 依赖蓬勃发展的开源社区提交 bug 报告、PR 以及 RFC。为了鼓励反馈，我们支持多个发布通道。

:::note
本节内容对从事框架、库或开发工具开发的人员最为相关。主要使用 React Native 构建面向用户应用的开发者无须关心除 latest 外的其他发布通道。
:::

### latest

`latest` 为稳定的 semver React Native 版本，当你通过 npm 安装 React Native 时即默认获得该版本。这也是你当前使用的通道。直接使用 React Native 构建的面向用户应用也使用此通道。

我们定期发布新的小版本系列，并更新 `latest` 标签，指向最新稳定版本。

### next

在宣布某个 React Native 版本为稳定版前，我们会发布一系列 **候选发布版本**（Release Candidate），从 RC0 开始。这些版本是预发布版（版本号格式如 `0.79.0-rc.0`），并在 NPM 上标记为 `next`。

当新分支切出并开始发布 RC 版本至 NPM 和 GitHub 时，建议你的库/框架跟进测试 `next` 版 React Native。

这将确保你的项目能持续兼容即将发布的 React Native 版本。

然而，请不要在面向用户的应用中直接使用预发布/RC 版本，因为它们尚未被视为生产准备状态。

### nightly

我们还发布 `nightly` 版本通道。Nightly 版本每日从 [facebook/react-native](https://github.com/facebook/react-native) 的 `main` 分支构建发布。Nightly 版本被视为不稳定版本，不推荐用于生产环境。

Nightly 版本号格式为 `0.80.0-nightly-<DATE>-<SHA>`，其中 `<DATE>` 为发布日期，`<SHA>` 为用于发布该版本的提交哈希。

Nightly 发布仅用于测试目的，我们不保证各个 nightly 版本之间的行为一致。它们不遵循 `latest/next` 版本所用的 semver 协议。

建议你建立 CI 工作流，每日针对 react-native@nightly 版本测试你的库，确保其兼容未来的发布。