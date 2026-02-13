---
title: React Native 在 Marketplace 的性能表现
author: Aaron Chiu
authorTitle: Facebook 软件工程师
authorURL: 'https://www.facebook.com/aaronechiu'
authorFBID: 1057500063
authorTwitter: AaaChiuuu
tags: [engineering]
---

React Native 在 Facebook 旗下的多个应用中均有使用，包括主 Facebook 应用中的顶级标签页。本文主要聚焦一个高度可见的产品，[Marketplace](https://newsroom.fb.com/news/2016/10/introducing-marketplace-buy-and-sell-with-your-local-community/)。该产品已在十几个国家上线，帮助用户发现其他用户提供的商品和服务。

在 2017 年上半年，通过 Relay 团队、Marketplace 团队、Mobile JS 平台团队和 React Native 团队的共同努力，我们将 Android 平台上 [2010-11 年代级别设备](https://code.facebook.com/posts/307478339448736/year-class-a-classification-system-for-android/)的 Marketplace 交互时间（TTI）缩短了一半。Facebook 历来将这些设备视为低端 Android 设备，它们在所有平台和设备类型中具有最慢的 TTI。

典型的 React Native 启动过程大致如下图所示：

![](/blog/assets/RNPerformanceStartup.png)

> 免责声明：图中比例不具代表性，具体情况将根据 React Native 的配置和使用方式有所不同。

我们首先初始化 React Native 核心（亦即“Bridge”），接着运行产品特定的 JavaScript，这部分决定了 React Native 将在本地用哪些视图进行渲染，这一步在“Native Processing Time”中完成。

### 不同的做法

我们早期犯的一个错误是让[Systrace 和 CTScan](https://code.facebook.com/posts/747457662026706/performance-instrumentation-for-android-apps/)主导了我们的性能工作。这些工具帮助我们发现了许多明显的问题（低垂的果实），但我们后来发现 Systrace 和 CTScan **并不能代表真实生产环境的场景**，也无法模拟实际使用时的情况。时间分解中的比例常常不准确，有时偏差极大。在极端情况下，一些我们以为只需几毫秒的操作，实际耗时却达数百甚至数千毫秒。话虽如此，CTScan 仍然有用，我们发现它能在生产前捕获三分之一的性能回归。

在 Android 上，我们将这些工具的局限归因于：1）React Native 是一个多线程框架；2）Marketplace 与复杂视图（如新闻推送和其他顶级标签页）共存；3）计算时间波动极大。因此，本半年度，我们几乎完全依靠生产环境的测量数据和时间分解，作为决策和优先级排序的依据。

### 生产环境检测之路

在生产环境中做性能监测乍看简单，但实际上过程颇为复杂。该过程经历了多个 2-3 周的迭代周期；原因在于从提交代码到主分支、发布应用到 Play 商店，到收集足够生产环境样本进而确认工作有效性存在较大延迟。每个迭代周期，我们都要验证时间分解的准确性、粒度合适性以及各项数值是否正确累计到整体时间。我们无法依赖 alpha 和 beta 版本，因为它们的数据无法代表整体用户群。其实质是，我们非常细致地基于数百万样本的汇总结果构建了一份非常精确的生产追踪。

我们细致核实每个毫秒在时间分解中的正确计入，原因之一是早期发现检测工具存在遗漏。初期时间分解未考虑到因线程切换导致的阻塞。线程切换本身花费不大，但切换到已经繁忙的线程会非常耗时。我们最终通过在关键时刻人为插入 `Thread.sleep()` 调用，在本地重现了这些阻塞情形，并通过以下方式予以解决：

1. 移除对 AsyncTask 的依赖，
2. 取消在 UI 线程上强制初始化 ReactContext 和 NativeModules，
3. 取消启动时对 ReactRootView 的强制测量依赖。

这三步合力减少了启动时间超过 25%。

生产数据指标还挑战了我们之前的一些假设。例如，我们过去习惯在启动路径中预加载许多 JavaScript 模块，认为将模块合并到一个包中可降低初始化成本。但事实上，预加载和模块集中加载的成本远大于带来的好处。通过重新配置 inline require 黑名单，并剔除启动路径中的多余模块（如仅需 [Relay Modern](https://relay.dev/docs/new-in-relay-modern)时不引入 Relay Classic），我们实现了 `RUN_JS_BUNDLE` 阶段比之前快超过 75%。

产品特定的本地模块优化也带来了显著提升。例如，通过对本地模块依赖采用懒注入策略，我们将其耗时削减了 98%。通过避免 Marketplace 启动时与其他模块竞争资源，我们同样缩短了启动时间。

最棒的是，许多这种改进对所有用 React Native 构建的页面均有广泛适用性。

## 总结

许多人认为 React Native 的启动性能瓶颈是 JavaScript 执行缓慢或网络延迟过高。虽然优化 JavaScript 执行确实能非同小可地减少 TTI，但这些因素各自占据的时间比之前普遍认为的要少得多。

到目前为止，最重要的经验是——_测量，测量，再测量！_ 一些优化得益于将运行时开销转移到构建时，比如 Relay Modern 和 [Lazy NativeModules](https://github.com/facebook/react-native/commit/797ca6c219b2a44f88f10c61d91e8cc21e2f306e)；另一些则来自更聪明的代码并行化或死代码剔除；还有一部分依赖 React Native 体系内的大规模架构改进，如解决线程阻塞问题。性能优化没有“一劳永逸”的方案，更长远的成效基于持续的检测和改进。不要被认知偏见左右决策，而应仔细收集并解读生产数据，引导后续工作。

## 未来规划

长期来看，我们期望 Marketplace 的 TTI 能与类似原生产品相当，整体上实现 React Native 性能与原生性能并驾齐驱。此外，尽管本半年度我们已将 Bridge 启动成本大幅降低约 80%，后续计划通过类似 [Prepack](https://prepack.io/) 等项目以及更多构建时处理，将 React Native Bridge 的开销逼近零。