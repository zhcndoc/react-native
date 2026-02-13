---
title: 2018 年 React Native 状况报告
author: Sophie Alpert
authorTitle: Facebook React 工程经理
authorURL: 'https://github.com/sophiebits'
authorImageURL: 'https://avatars2.githubusercontent.com/u/6820?s=460&v=4'
authorTwitter: sophiebits
tags: [engineering]
---

自从我们上次发布关于 React Native 的状态更新已经有一段时间了。

在 Facebook，我们比以往任何时候都更多地使用 React Native 用于许多重要项目。我们的一个最受欢迎的产品是 Marketplace，这是我们应用中的顶级标签之一，每月有 8 亿用户使用。自 2015 年创建以来，整个 Marketplace 都是用 React Native 构建的，包含了应用中不同部分的 100 多个全屏视图。

我们还在应用的许多新部分使用 React Native。如果你观看了上个月的 F8 主旨演讲，你会认识血液捐赠（Blood Donations）、危机响应（Crisis Response）、隐私快捷方式（Privacy Shortcuts）和健康检查（Wellness Checks）——这些都是最近用 React Native 构建的功能。而且，主 Facebook 应用之外的项目也使用了 React Native。新的 Oculus Go VR 头显中包含了一个完全用 React Native 构建的[伴随移动应用](https://www.oculus.com/app/)，更不用说 React VR 驱动着头显中的许多体验。

当然，我们也使用许多其他技术来构建我们的应用。[Litho](https://fblitho.com/) 和 [ComponentKit](https://componentkit.org/) 是我们在应用中广泛使用的两个库；它们都提供类似 React 的组件 API 用于构建原生屏幕。React Native 从未以取代所有其他技术为目标——我们专注于让 React Native 本身变得更好，但我们也很高兴看到其他团队从 React Native 借鉴了许多想法，比如将[即时重新加载（instant reload）](https://instagram-engineering.com/instant-feedback-in-ios-engineering-workflows-c3f6508c76c8)引入到非 JavaScript 代码中。

## 架构

当我们在 2013 年启动 React Native 项目时，我们设计了一个 JavaScript 与原生之间的单一“桥”，它是异步的、可序列化的并且是批处理的。正如 React DOM 将 React 状态更新转化为对 DOM API 的命令式、变异式调用（例如 `document.createElement(attrs)` 和 `.appendChild()`），React Native 被设计为返回一个单一的 JSON 消息，列出要执行的变更，如 `[["createView", attrs], ["manageChildren", ...]]`。我们设计整个系统时，确保永远不依赖于同步响应，并保证这个列表中的所有内容都能完全序列化为 JSON 并且可以还原。我们这样做是为了获得灵活性：基于此架构，我们能够构建诸如[Chrome 调试器](/docs/debugging#chrome-developer-tools)这样的工具，通过 WebSocket 连接异步运行所有 JavaScript 代码。

在过去的五年中，我们发现这些最初的原则使得某些功能的开发变得更困难。异步桥意味着你无法将 JavaScript 逻辑直接集成到许多期望同步响应的原生 API 中。批处理桥排队原生调用，导致 React Native 应用调用本地实现函数变得更难。可序列化的桥意味着不必要的复制，而不能在两者间直接共享内存。对于完全用 React Native 构建的应用，这些限制通常是可以忍受的。但对于 React Native 与现有应用代码复杂集成的应用，这些限制令人沮丧。

**我们正在进行一项针对 React Native 的大规模架构重构，使框架更灵活，更好地集成于混合 JavaScript/原生应用的原生系统中。** 通过这个项目，我们将应用过去五年的经验，逐步将架构升级为更现代的架构。我们正在重写 React Native 的许多内部实现，但大多数变化是在底层：现有的 React Native 应用将继续运行，几乎不需要更改。

为了让 React Native 更轻量、更适合现有原生应用，此次重构有三个主要内部改变。首先，我们修改线程模型。更新 UI 时不必总是在三个不同线程上执行工作，而是可以在任意线程同步调用 JavaScript 以处理高优先级更新，同时低优先级任务仍在主线程之外保持响应性。其次，我们将引入 [异步渲染](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)功能，支持多种渲染优先级，并简化异步数据处理。最后，我们简化桥的设计，使其更快更轻量；原生与 JavaScript 之间的直接调用更高效，也便于构建诸如跨语言调用栈跟踪的调试工具。

完成这些改动后，将实现更紧密的集成。目前，集成原生导航和手势处理，或使用 UICollectionView 和 RecyclerView 等原生组件需要复杂的 hack。更新线程模型后，构建这类功能将非常简单。

随着项目接近完成，我们将在今年晚些时候发布更多细节。

## 社区

除了 Facebook 内部的社区外，我们很高兴看到 Facebook 之外有一个繁荣的 React Native 用户和贡献者群体。我们希望更多支持 React Native 社区，既要更好地服务 React Native 用户，也要让项目更易于贡献。

正如架构改变将帮助 React Native 更好地与其他原生基础设施互操作，React Native 在 JavaScript 侧应该更紧凑，更好地融入 JavaScript 生态系统，其中包括使虚拟机和打包工具可替换。我们知道破坏性改动的速度可能让人难以跟上，所以希望找到减少重大版本发布次数的方法。最后，我们知道某些团队需要更全面的文档，比如启动优化方面，我们的专业知识还未完全成文。期待在未来一年看到这些改进。

如果你正在使用 React Native，你就是我们社区的一员；请继续告诉我们如何让 React Native 更好地为你服务。

React Native 是移动开发者工具箱中的一件工具，但它是我们坚信的工具——过去一年中有 500 多位贡献者提交了超过 2500 次代码，我们每天都在不断改进它。
