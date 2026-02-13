---
title: React Native 开源更新 — 2019年3月
authors: [cpojer]
tags: [announcement]
---

我们于2018年第四季度公布了我们的 [React Native 开源路线图](/blog/2018/11/01/oss-roadmap)，决定加大对 React Native 开源社区的投入。

在第一个里程碑中，我们重点关注识别和改进社区中最显眼的方面。我们的目标是减少未合并的拉取请求，缩减项目的表面面积，确定主要用户问题，并建立社区管理的指导方针。

在过去两个月里，我们取得了超过预期的进展。详情请继续阅读：

### 拉取请求

为了构建一个健康的社区，我们必须快速响应代码贡献。过去几年里，我们不太重视社区贡献的审查，积压了280个拉取请求（2018年12月）。在第一个里程碑里，我们将未处理的拉取请求数量减少到约65个。同时，每天新开的拉取请求平均数量从3.5个增长到了7个，这意味着我们在过去三个月处理了大约 [600个拉取请求](https://github.com/facebook/react-native/pulls?page=24&q=is%3Apr+closed%3A%3E2018-12-01&utf8=%E2%9C%93)。

我们合并了 [近三分之二](https://github.com/facebook/react-native/pulls?utf8=%E2%9C%93&q=is%3Apr+closed%3A%3E2018-12-01+label%3A%22Merged%22+) 的拉取请求，关闭了三分之一。关闭的拉取请求没有被合并，原因是它们已经过时或者质量较低，或者不必要地增加了项目表面面积。大部分合并的拉取请求修复了错误，提升了跨平台一致性，或者引入了新功能。其中值得一提的贡献包括提升类型安全和支持 AndroidX 的持续工作。

在 Facebook，我们直接运行 React Native 的主分支，因此所有更改都会先经过测试，确保发布版本的质量。在所有合并的拉取请求中，只有6个引发了问题：4个只影响了内部开发，2个是在发布候选版本阶段被发现。

社区中较为显眼的贡献之一是 [更新后的“RedBox”屏幕](https://github.com/facebook/react-native/pull/22242)。这是社区如何改善开发者体验的一个良好范例。

### 精简核心（Lean Core）

当前 React Native 的表面面积非常广泛，包含许多已经不维护的抽象层，这些在 Facebook 内部使用较少。我们正在努力缩减表面面积，以使 React Native 更加精简，并让社区更好地维护那些 Facebook 内部较少使用的抽象层。

在第一个里程碑中， [我们向社区寻求 Lean Core 项目的帮助](https://twitter.com/reactnative/status/1093171521114247171)。社区反响热烈，我们几乎应接不暇。 [看看不到一个月内完成的所有工作](https://github.com/facebook/react-native/issues/23313)！

最让我们兴奋的是，维护者们积极投入，修复了长期存在的问题，增加了测试，并支持了很多长期以来请求的功能。这些模块获得的支持超过了 React Native 以往任何时候，说明这对社区来说是一个巨大进步。示例项目包括自抽取以来收到大量拉取请求的 [WebView](https://github.com/react-native-community/react-native-webview)，以及由社区成员维护的 CLI，如今已收获了急需的改进和修复，详情见 [React Native CLI 新家园](https://blog.callstack.io/the-react-native-cli-has-a-new-home-79b63838f0e6)。

### 主要用户问题

2018年12月，我们向社区征询了他们关于 [React Native 不满意的地方](https://github.com/react-native-community/discussions-and-proposals/issues/64)。我们汇总了反馈，并对每个问题进行了 [回复](https://github.com/react-native-community/discussions-and-proposals/issues/104)。幸运的是，我们社区面临的许多问题，Facebook 内部同样存在。下一里程碑中，我们计划解决一些主要问题。

其中投票最高的问题之一是升级到 React Native 新版本时的开发体验。遗憾的是，我们在 Facebook 内部并不经历这一问题，因为我们直接使用主分支。值得庆幸的是，社区成员已开始着手改进这一问题：

- 来自 Callstack 的 [Michał Pierzchała](https://github.com/thymikee) 通过在底层使用 [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge)，提升了 react-native upgrade 功能，见 [相关拉取请求](https://github.com/react-native-community/react-native-cli/pull/176/files)。我们同时更新了官网，移除过时的升级说明。
- [计划默认推荐 iOS 项目使用 CocoaPods](https://github.com/facebook/react-native/pull/23563)，这将减少升级 React Native 时工程文件的频繁变动。这也使得安装和链接第三方模块更简单，在 Lean Core 语境下尤为重要，因为预计项目默认将链接更多模块。

### 0.59 版本发布

没有 React Native 社区，特别是 [Mike Grabowski](https://github.com/grabbou) 和 [Lorenzo Sciandra](https://github.com/kelset) 的帮助，我们无法顺利发布版本。我们希望改进发布管理流程，并计划从现在起更加积极参与：

- 将与社区成员协作，为每个主要版本撰写博客文章。
- 在升级新版本时，在 CLI 中直接显示重大破坏性变更。
- 缩短发布所需时间。我们正在探索增加自动化测试并创建更完善的手动测试计划的方案。

许多计划将体现在即将发布的 [React Native 0.59 版本](https://github.com/facebook/react-native/releases/tag/v0.59.0-rc.3) 中。0.59 将带来 React Hooks、针对 Android 的新 64 位 JavaScriptCore 版本以及许多性能和功能提升。目前它已经作为候选版本发布，预计两周内稳定。

### 后续计划

接下来的两个月里，我们将继续管理拉取请求， [保持进度](https://k03lwm00zo.codesandbox.io/)，同时开始减少未处理的 GitHub 问题数。我们将通过 Lean Core 项目持续缩减 React Native 表面面积。计划解决社区排名前5的主要问题。在完善社区指南后，我们将关注网站和文档。

我们非常高兴能在3月于 Facebook 伦敦接待来自社区的十多位贡献者，共同推进多项工作。感谢你们使用 React Native，希望你们能感受到我们在2019年努力带来的改进。数月后我们将带来新更新，_届时也会持续合并你们的拉取请求！_ ⚛️✌️