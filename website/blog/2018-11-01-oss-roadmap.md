---
title: 开源路线图
author: Héctor Ramos
authorTitle: Facebook 工程师
authorURL: 'https://hectorramos.com/about'
authorImageURL: 'https://s.gravatar.com/avatar/f2223874e66e884c99087e452501f2da?s=128'
authorTwitter: hectorramos
tags: [公告]
---

![](/blog/assets/oss-roadmap-hero.jpg)

今年，React Native 团队专注于对 React Native 进行大规模的[重新架构](https://github.com/react-native-community/discussions-and-proposals/issues/4)。正如 Sophie 在她的[React Native 现状文章](/blog/2018/06/14/state-of-react-native-2018)中提到的那样，我们已经制定了一个计划，更好地支持 Facebook 之外不断壮大的 React Native 用户和贡献者群体。现在，是时候分享我们一直在努力的更多细节了。在此之前，我想先阐述我们对开源 React Native 的长期愿景。

我们对 React Native 的愿景是……

- **一个健康的 GitHub 仓库。** 议题和拉取请求能在合理时间内得到处理。
  - 提高测试覆盖率。
  - 从 Facebook 代码库同步的提交不应破坏开源测试。
  - 更大规模的有意义的社区贡献。
- **稳定的 API，** 使与开源依赖的接口更加简单。
  - Facebook 使用与开源相同的公共 API。
  - 遵循语义化版本控制的 React Native 发布版本。
- **充满活力的生态系统。** 由社区维护的高质量 ViewManagers、本地模块以及多平台支持。
- **优秀的文档。** 重点帮助用户创建高质量体验，以及保持最新的 API 参考文档。

我们已确定以下重点领域来帮助实现这一愿景。

## ✂️ 精简核心

我们的目标是[缩小 React Native 的代码表面](https://github.com/react-native-community/discussions-and-proposals/issues/6)，移除非核心和未使用的组件。我们将把非核心组件转移到社区，以便其更快发展。缩小的代码表面将使管理 React Native 的贡献变得更容易。

[`WebView`](https://github.com/react-native-community/discussions-and-proposals/blob/master/proposals/0001-webview.md) 是一个我们已转交给社区的组件例子。我们正在制定工作流程，以便内部团队在从仓库移除这些组件后依然能继续使用。我们已经确定了[数十个组件](https://github.com/react-native-community/discussions-and-proposals/issues/6)，准备交由社区维护。

## 🎁 开源内部工具与 🛠 工具链更新

Facebook 产品团队的 React Native 开发体验与开源社区存在显著差异。开源社区流行的许多工具在 Facebook 内部并未使用，Facebook 内部可能有等效的工具。在某些情况下，Facebook 团队已经习惯了外部没有的工具。这些差异在我们开源即将推出的架构工作时可能带来挑战。

我们将努力发布一些内部工具，同时提升对开源社区流行工具的支持。以下是我们将解决项目的非详尽列表：

- 开源 JSI，并让社区能够引入自己的 JavaScript 虚拟机，替代 React Native 初始版本中的 JavaScriptCore。关于 JSI 我们将在未来文章详细介绍，目前你可以通过[Parashuram 在 React Conf 的演讲](https://www.youtube.com/watch?v=UcqRXTriUVI)了解更多。
- 支持 Android 上的 64 位库。
- 支持在新架构下的调试。
- 改进对 CocoaPods、Gradle、Maven 以及新 Xcode 构建系统的支持。

## ✅ 测试基础设施

Facebook 工程师发布代码时，只有在通过所有测试后，才视为安全合并。这些测试用于识别修改是否可能破坏我们自己的 React Native 接口。然而，Facebook 使用 React Native 的方式与开源有所不同，这导致我们可能无意中破坏了开源版本的 React Native。

我们将增强内部测试，确保它们运行在尽可能接近开源的环境中，防止破坏测试的代码误传到开源版本。我们还将完善基础设施，使核心仓库在 GitHub 上拥有更好的测试能力，便于未来的拉取请求自带测试。

结合缩小代码表面，这将让贡献者更加自信快速地合并拉取请求。

## 📜 公开 API

Facebook 将通过公开 API 来使用 React Native，与开源用户一致，以减少无意的破坏性改动。我们已经开始转换内部调用点。我们的目标是统一稳定的公共 API，逐步实现 1.0 版本的语义化版本控制。

## 📣 交流沟通

React Native 是[GitHub 上贡献者数量最多的开源项目之一](https://octoverse.github.com/#top-and-trending-projects)。这让我们非常高兴，也想保持这一态势。我们将继续推动吸引参与者的举措，比如提升透明度和开放讨论。文档是新来 React Native 用户首要接触的内容，但过去并未被优先关注。我们想要改变这一点，从恢复自动生成的 API 参考文档开始，创造更多聚焦于打造[优质用户体验](/docs/improvingux)的内容，并完善我们的[发布说明](https://github.com/react-native-community/react-native-releases/issues/47)。

## 时间表

我们计划在未来一年左右陆续完成这些项目。其中一些工作已在进行中，比如[JSI 已经开源](https://github.com/facebook/react-native/compare/e337bcafb0b017311c37f2dbc24e5a757af0a205...8427f64e06456f171f9df0316c6ca40613de7a20)。另一些工作会需要更长时间完成，比如缩小代码表面。我们会尽力及时向社区通报进展。请加入我们的[讨论与提案](https://github.com/react-native-community/discussions-and-proposals)仓库，这是 React Native 社区发起的一个项目，促成了本路线图中提及的多个计划。