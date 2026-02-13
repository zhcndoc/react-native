---
title: React Native 2019年6月开源更新
authors: [cpojer]
tags: [公告]
---

## 代码与社区健康状况

在过去六个月中，超过550名贡献者向 React Native 提交了总计2800次提交。社区中有400名贡献者创建了超过 [1,150个拉取请求（Pull Requests）](https://github.com/facebook/react-native/pulls?page=24&q=is%3Apr+closed%3A%3E2018-12-01&utf8=%E2%9C%93)，其中有 [820个拉取请求](https://github.com/facebook/react-native/pulls?utf8=%E2%9C%93&q=is%3Apr+closed%3A%3E2018-12-01+label%3A%22Merged%22+)被合并。

在过去六个月中，平均每天的拉取请求数量已从3个增加到约6个，尽管我们通过 Lean Core 计划将网站、CLI 和许多模块从 React Native 中拆分出去。现在平均未处理拉取请求数量低于25个，我们通常在数小时或几天内回复并提出建议和审查意见。

### 有意义的社区贡献

我们想特别强调一些我们认为非常棒的近期贡献：

- **辅助功能（Accessibility）：** React Native 0.60 将带来在 Android 和 iOS 上辅助功能 API 的多项改进。所有新特性均直接使用底层平台提供的 API，因此可与 Android 和 iOS 原生的辅助技术集成。感谢 [Marc Mulcahy](https://github.com/marcmulcahy)、[Alan Kenyon](https://github.com/facebook/react-native/pull/24746)、[Estevão Lucas](https://github.com/elucaswork)、[Sam Mathias Weggersen](https://github.com/sweggersen) 和 [Janic Duplessis](https://twitter.com/janicduplessis) 的贡献：
  - [新增辅助角色和状态](https://github.com/facebook/react-native/pull/24095) 以及 [新的辅助状态 API](https://github.com/facebook/react-native/pull/24608)。为多种组件添加了若干缺失的辅助角色，以及一个更利于未来网页支持的新 API。
  - [AccessibilityInfo.announceForAccessibility](https://github.com/facebook/react-native/pull/24746)。增加对 Android 的支持，之前仅支持 iOS。
  - [扩展辅助操作支持](https://github.com/facebook/react-native/pull/24695)。添加回调以处理用户定义操作相关的辅助功能。
  - [支持 iOS 辅助标志](https://github.com/facebook/react-native/pull/23913) 和 [“减少动画”支持](https://github.com/facebook/react-native/pull/23839)。
  - [Android 键盘辅助改进](https://github.com/facebook/react-native/pull/24359)。新增 `clickable` 属性和 `onClick` 回调，用于通过键盘导航调用操作（注意：该属性不久将重命名为 `focusable`）。
  - [使用 CALayers 绘制文本](https://github.com/facebook/react-native/pull/24387)。修复了 iOS 上放大文本消失的问题。
- **新应用屏幕：** 社区提出了一个 [新应用屏幕设计](https://github.com/react-native-community/discussions-and-proposals/issues/122)，该设计已在 0.60 实现。此屏幕是大多数用户首次使用 React Native 时看到的内容，现在它将首次用户引导至文档，同时外观与我们即将改版的网站协调一致 🌟。特别感谢 [Orta](https://twitter.com/orta)、[Adam Shurson](https://www.linkedin.com/in/ashurson/)、[Glauber Castro](https://github.com/glauberfc)、[Karan Singh](https://github.com/karanpratapsingh)、[Eli Perkins](https://twitter.com/_eliperkins)、[Lucas Bento](https://twitter.com/lbentosilva) 和 [Eric Lewis](https://twitter.com/ericlewis) 的贡献与合作！
  - 可以通过“_[React Native Show](https://www.youtube.com/watch?v=ImlAqMZxveg)_”视频系列体验新应用屏幕。
- **TurboModule 类型：** 新的 [TurboModules 系统](https://github.com/react-native-community/discussions-and-proposals/issues/40)要求为所有原生模块提供 [类型定义](https://github.com/facebook/react-native/issues/24875)，以保证原生操作的类型安全。在短短两周内，社区共贡献了约40个拉取请求完善 flow 类型定义的原生模块。除了前述人员，我们还要感谢 [Michał Chudziak](https://twitter.com/michalchudziak)、[Michał Pierzchała](https://twitter.com/thymikee)、[Wojtek Szafraniec](https://github.com/wojteg1337)、[Jean Regisser](https://github.com/jeanregisser) 以及所有提交了一个或多个拉取请求的贡献者。
- **Haste：** 自2015年起，React Native 采用了 [“haste”模块系统](https://github.com/reactjs/reactjs.org/commit/0629e3e2289ed54fac854472aec9a5f6c8318c98#diff-c42b758729cb89976b3a8fd51d1227fa)，该系统允许通过全局 ID 而非相对路径导入模块，虽然方便但许多工具支持不佳。[James Ide](https://twitter.com/JI) 提议删除 haste，类似于 React 多年前所做的，该计划通过一个 [总任务](https://github.com/facebook/react-native/issues/24316)进行了规划，且他提交了18个拉取请求推动实现！想了解详情请查看他的 [Twitter 线程](https://twitter.com/JI/status/1136369775083319296)。
- **Android Fragment：** [John Shelley](https://github.com/jpshelley) 提出的 React Native 支持通过 [Android Fragment](https://github.com/facebook/react-native/pull/12199) 运行的方案已被合并，并将在 0.61 中提供支持。[这里了解更多关于 Android Fragment](https://developer.android.com/guide/components/fragments)。

### Lean Core 计划

[Lean Core](https://github.com/react-native-community/discussions-and-proposals/issues/6) 的主要动机是将模块从 React Native 中拆分至独立仓库，以便获得更好的维护。在短短六个月内，[WebView](https://github.com/react-native-community/react-native-webview)、[NetInfo](https://github.com/react-native-community/react-native-netinfo)、[AsyncStorage](https://github.com/react-native-community/react-native-async-storage)、[网站](https://github.com/facebook/react-native-website)及[CLI](https://github.com/react-native-community/cli) 这几个仓库合计收到了超过800个拉取请求。除了更好的维护外，这些项目还能比 React Native 主体更频繁地独立发布。

我们也趁机从 React Native 中移除了过时的 polyfill 和遗留组件。过去，为支持老版本 JavaScriptCore (JSC) 中的语言特性如 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)，必须使用 polyfill。现在 React Native 捆绑的是更新版本，因此这些 polyfill 被删除。

这项工作仍在进行中，原生与 JavaScript 两边还有许多内容需要拆分或删除，但已有迹象表明我们成功扭转了代码体积持续增长的趋势：比如查看 JavaScript bundle 大小，一年前的 0.54 版本为530KB，6个月后 0.57 版本增长到了607KB（+77KB），而现在在 master 分支上我们看到了减小了28KB至579KB，整体差异超过100KB！

随着 Lean Core 努力的第一轮结束，我们将更加审慎地对待向 React Native 添加的新 API，并将持续评估缩小和加速 React Native 的方法，同时寻找方式赋能社区接管各个组件的维护。

## 用户反馈

六个月前，我们曾向社区提问 “[你不喜欢 React Native 的哪些方面？](https://github.com/react-native-community/discussions-and-proposals/issues/64)”，很好地概述了人们面临的问题。我们在几个月前对该帖作了[回复](https://github.com/react-native-community/discussions-and-proposals/issues/104)，现在是总结针对最重要问题取得进展的时刻：

- **升级体验：** React Native 社区围绕升级体验做了多项改进：[自动链接](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md)、通过 [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) 提供的更好升级命令及即将上线的升级助手网站。我们还会通过每个大版本发布博客，让大家了解破坏性变更和新特性。所有这些改进都会让0.60之后的升级大为简化。
- **支持与不确定性：** 众多用户对拉取请求缺乏活动及 Facebook 在 React Native 上投入的不确定感到挫败。正如前文所示，我们可以自信地说，我们已准备好迎接更多拉取请求，期待您的提议和贡献！
- **性能：** React Native 0.59 推出了全新更快的 JavaScriptCore (JSC) 版本。另外，我们一直致力于让默认启用 [inline-requires](/docs/performance#ram-bundles-inline-requires) 更加容易，接下来几个月还将带来更多激动人心的更新。
- **文档：** 我们近期启动了 [全面重写 React Native 文档](https://github.com/facebook/react-native-website/issues/929)的工作。如果你想贡献文档，非常欢迎！
- **Xcode 警告：** 我们已经 [清理掉所有现存警告](https://github.com/facebook/react-native/issues/22609)，并努力避免引入新的警告。
- **热重载：** React 团队正在开发 [全新热重载系统](https://twitter.com/dan_abramov/status/1126948870137753605)，即将集成进 React Native。

遗憾的是，我们尚未能解决所有问题：

- **调试：** 我们修复了许多日常遇到的不便问题，但调试体验仍未达到理想水平。我们意识到调试 React Native 体验较差，未来会优先改进。
- **Metro 符号链接支持：** 目前尚未找到简单直接的解决方案。不过，React Native 用户分享了[各种可行的解决方案](https://github.com/facebook/metro/issues/1)，或许能帮到你。

鉴于过去半年变化巨大，我们再次向你提问。如果您正在使用最新版本 React Native 并愿意反馈意见，请在我们新一期的 [“你不喜欢 React Native 的哪些方面？”](https://github.com/react-native-community/discussions-and-proposals/issues/134) 话题下留言。

## 持续集成

Facebook 首先将所有拉取请求及内部更改合并至其私有仓库，然后将所有提交同步回 GitHub。Facebook 的基础设施与常见持续集成服务不同，且非所有开源测试都在 Facebook 内部完成。这导致同步到 GitHub 的提交经常会出现测试失败，修复耗费大量时间。

React Native 团队的 [Héctor Ramos](https://twitter.com/hectorramos) 过去两个月一直在改进 Facebook 和 GitHub 上的持续集成系统。现在大部分开源测试都在提交变更至 React Native Facebook 版本前运行，这将保持 GitHub 同步提交时的持续集成稳定。

## 接下来

务必关注我们关于 React Native 未来发展的演讲！未来几个月，Facebook React Native 团队成员将出席 [Chain React](https://infinite.red/ChainReactConf) 和 [React Native EU](https://react-native.eu/) 会议。同时，敬请期待即将发布的 0.60 版本。_令人振奋_ ✨