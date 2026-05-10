---
title: 版本控制策略
---

本页面描述了我们为 `react-native` 包遵循的版本控制策略。

我们会通过手动测试和自动化测试全面测试 React Native 的每个版本，以确保质量不会回退。

React Native 的 `stable` 渠道遵循下文所述的 0.x.y 发布策略。

React Native 还提供了一个 `nightly` 发布渠道，以鼓励对实验性功能尽早提供反馈。

本页面描述了我们对 `react-native` 以及 `@react-native` 作用域下包的版本号处理方式。

## 稳定版发布版本

React Native 会按固定节奏发布稳定版。

我们遵循 0.x.y 版本方案：

- 破坏性变更会在新的次版本中发布，即我们会递增 x 数字（例如：0.78.0 到 0.79.0）。
- 新功能和 API 也会在新的次版本中发布，即我们会递增 x 数字（例如：0.78.0 到 0.79.0）。
- 关键 bug 修复会在新的补丁版本中发布，即我们会递增 y 数字（例如：0.78.1 到 0.78.2）。

稳定版会 नियमित 发布，最新版本会在 NPM 上标记为 `latest`。

同一次版本号下的一系列发布称为一个 **次版本系列**（例如 0.76.x 是 0.76.0、0.76.1、0.76.2 等的次版本系列）。

你可以在[发布页面](./)中阅读更多关于我们的 **稳定性承诺**。

### 破坏性变更

破坏性变更对所有人来说都很不方便，我们正努力将其尽量减少到最低限度。我们在每个稳定版中发布的所有破坏性变更都会在以下位置突出说明：

- [React Native 更新日志](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)中的 _Breaking_ 和 _Removed_ 部分
- 每篇发布博文中的 _Breaking Changes_ 部分

对于每一项破坏性变更，我们承诺解释其背后的原因，尽可能提供替代 API，并将对最终用户的影响降到最低。

### 什么是破坏性变更？

我们将以下情况视为 React Native 的破坏性变更：

- 不兼容的 API 变更（即某个 API 被修改或移除，导致你的代码由于该变更而无法再编译/运行）。例如：
  - 任何需要你修改代码才能编译通过的 JS/Java/Kotlin/Obj-c/C++ API 变更。
  - `@react-native/codegen` 中不向后兼容的变更。
- 显著的行为/运行时变更。例如：
  - 某个 prop 的布局逻辑发生了剧烈变化。
- 开发体验上的重大变更。例如：
  - 某个调试功能被完全移除。
- 我们任何传递依赖的重大版本升级。例如：
  - 将 React 从 18.x 升级到 19.x
  - 将 Android 的 Target SDK 从 34 升级到 35）。
- 我们支持的平台版本降低。例如：
  - 将 Android 的最小 SDK 从 21 升级到 23
  - 将 iOS 的最低版本升级到 15.1。

我们不认为以下变更属于破坏性变更：

- 修改以 `unstable_` 前缀开头的 API：这些 API 暴露的是实验性功能，我们对它们最终形态没有把握。通过以 `unstable_` 前缀发布它们，我们可以更快迭代，更早得到稳定的 API。
- 对私有或内部 API 的更改：这些 API 通常以前缀 `internal_`、`private_` 开头，或者位于 `internal/` 或 `private/` 文件夹/包中。尽管由于工具限制，其中一些 API 可能具有公开可见性，但我们不把它们视为公共 API，因此会在不提前通知的情况下修改它们。
  - 同样，如果你访问像 `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 或 `__reactInternalInstance$uk43rzhitjg` 这样的内部属性名，也没有任何保证。后果自负。
  - 标注为 `@FrameworkAPI` 的类也被视为内部 API
- 对工具/开发 API 的更改：React Native 的一些公共 API 是预留给框架和其他工具集成使用的。例如，部分 Metro API 或 React Native DevTools API 预期仅供其他框架或工具使用。对这些 API 的更改会直接与受影响的工具讨论，不视为破坏性变更（我们不会在发布博文中广泛通知）。
- 开发警告：由于警告不会影响运行时行为，我们可能会在任意版本之间新增警告或修改现有警告。

如果我们预计某项变更会在社区中造成广泛问题，我们仍会尽最大努力为整个生态提供渐进式迁移路径。

### 弃用周期

随着我们持续开发和演进 React Native，我们会编写新的 API，有时也需要弃用现有 API。这些 API 将经历一个弃用周期。

一旦某个 API 被弃用，它将在**后续**的**多个**稳定版中**仍然**可用。

例如：如果某个 API 在 React Native 0.76.x 中被弃用，它仍会在 0.77.x 中可用，并且不会早于 React Native 0.78.x 被移除。

有时如果我们认为生态需要更多时间从某个弃用 API 迁移开，我们会决定更久地保留该 API。对于这些 API，我们通常会提供警告，以帮助用户完成迁移。

## 发布渠道

React Native 依赖蓬勃发展的开源社区来提交 bug 报告、开启 pull request 以及提交 RFC。为了鼓励反馈，我们确实支持多个发布渠道。

:::note
本节对于从事框架、库或开发者工具的开发者来说最相关。主要使用 React Native 构建面向用户应用的开发者通常无需担心 `latest` 之外的发布渠道。
:::

### latest

`latest` 用于稳定的、符合 semver 的 React Native 发布版本。你从 npm 安装 React Native 时得到的就是它。这是你今天已经在使用的渠道。直接使用 React Native 的面向用户应用会使用这个渠道。

我们会定期发布更新的 React Native 次版本系列，并更新 `latest` 标签以反映最新的稳定版。

### next

在我们将新的 React Native 版本 घोषित为稳定版之前，我们会发布一系列 **release candidate**，从 RC0 开始。这些版本是预发布版本（遵循 `0.79.0-rc.0` 的版本方案），并在 NPM 上标记为 `next`。

当发生新的分支切出，并且 RC 开始发布到 NPM 和 GitHub 时，建议你使用 `next` 版本的 React Native 对你的库/框架进行测试。

这将确保你的项目能够继续与即将到来的 React Native 版本良好配合。

不过，请不要在面向用户的应用中直接使用预发布版本/RC，因为它们不被视为适合生产环境。

### nightly

我们还会发布 `nightly` 发布渠道。Nightly 版本每天都会从 [facebook/react-native](https://github.com/facebook/react-native) 的 `main` 分支发布。Nightly 版本被视为不稳定的 React Native 版本，不建议用于生产环境。

Nightly 版本遵循 `0.80.0-nightly-<DATE>-<SHA>` 的版本方案，其中 `<DATE>` 是 nightly 的日期，`<SHA>` 是用于发布该 nightly 的提交 SHA。

nightly 发布仅用于测试目的，我们不保证不同 nightly 之间的行为不会发生变化。它们不遵循我们在 `latest`/`next` 发布中使用的 semver 协议。

建议你设置一个 CI 工作流，每天使用 react-native@nightly 版本测试你的库，以确保你的库在未来版本中继续正常工作。
