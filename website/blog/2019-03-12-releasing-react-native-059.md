---
title: 发布 React Native 0.59
author: Ryan Turner
authorTitle: 核心维护者 & React Native 开发者
authorURL: 'https://twitter.com/turnrye'
authorImageURL: 'https://avatars0.githubusercontent.com/u/701035?s=460&v=4'
authorTwitter: turnrye
tags: [公告, 发布]
---

欢迎来到 React Native 0.59 版本！这是又一个重磅发布，包含了 88 位贡献者提交的 644 个提交。贡献的形式多种多样，因此 _感谢你们_ 维护问题、培育社区，以及教授大家 React Native。本月带来了一些备受期待的变更，希望你会喜欢。

## 🎣 Hooks 来了

React Hooks 是本次发布的重要内容，它们让你可以跨组件重用有状态的逻辑。关于 hooks 话题非常热，如果你还没听说过，可以看看下面这些精彩资源：

> - [引入 Hooks](https://reactjs.org/docs/hooks-intro.html) 讲解了为什么我们要在 React 中引入 Hooks。
> - [Hooks 概览](https://reactjs.org/docs/hooks-overview.html) 是对内置 Hooks 的快速介绍。
> - [创建你自己的 Hooks](https://reactjs.org/docs/hooks-custom.html) 展示了如何用自定义 Hooks 复用代码。
> - [理解 React Hooks](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) 探索了 Hooks 带来的新可能性。
> - [useHooks.com](https://usehooks.com/) 展示社区维护的 Hooks 配方和演示。

务必在你的应用中尝试使用。我们希望你能像我们一样为这种复用感到振奋。

## 📱 更新的 JSC 带来性能提升和 Android 64 位支持

React Native 使用 JSC（[JavaScriptCore](https://webkit.org/)）来驱动应用。Android 上的 JSC 版本较旧，很多现代 JavaScript 特性不支持。更糟的是，它的性能远不及 iOS 上的现代 JSC。随着本次版本发布，情况有了改变。

感谢 [@DanielZlotin](https://github.com/danielzlotin), [@dulmandakh](https://github.com/dulmandakh), [@gengjiawen](https://github.com/gengjiawen), [@kmagiera](https://github.com/kmagiera) 和 [@kudo](https://github.com/kudo) 的精彩工作，JSC 赶上了近年来的进展。这带来了 64 位支持、现代 JavaScript 支持以及[显著的性能提升](https://github.com/react-native-community/jsc-android-buildscripts/tree/master/measure)。同时，也感谢他们让这个过程变得可维护，这样我们未来能够轻松利用 WebKit 的改进。感谢 Software Mansion 和 Expo 让这项工作成为可能。

## 💨 使用内联 require 加快应用启动速度

我们想帮助大家让 React Native 应用默认性能更好，并正努力将 Facebook 的优化带给社区。应用按需加载资源，避免启动时变慢。该功能称为“内联 require”，它让 Metro 可以识别可延迟加载的组件。组件层级复杂且多样的应用将会体验到最大的改进。

![0.59 模板中的 `metro.config.js` 文件示例，展示了如何启用 `inlineRequires`](/blog/assets/inline-requires.png)

我们需要社区反馈效果如何，再决定是否默认启用。当你升级到 0.59 后，会看到一个新的 `metro.config.js` 文件；将选项切换为 true 并给我们[反馈](https://twitter.com/hashtag/inline-requires)吧！更多关于内联 require，请查看[性能文档](/docs/performance#inline-requires)并对你的应用进行基准测试。

## 🚅 精简核心正在进行中

React Native 是一个庞大且复杂的项目，代码库也很复杂。这使得代码不易接近贡献者，测试困难，且作为开发依赖显得臃肿。[精简核心](https://github.com/react-native-community/discussions-and-proposals/issues/6) 是我们为解决这些问题，将代码迁移到独立库以便更好管理的努力。过去几个版本已经开始了这一步伐，[让我们认真起来](https://www.youtube.com/watch?v=FMLKb4or8yg)。

你可能会注意到，更多组件已正式弃用。这是好消息，这些功能现在都有了活跃维护的负责人。请注意警告信息并迁移到新的库中，因为这些组件未来版本会被移除。下面表格列出了组件、弃用状态及迁移去处。

| 组件                  | 是否弃用？  | 新归宿                                                                                                                                                 |
| -------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AsyncStorage**     | 0.59        | [@react-native-community/react-native-async-storage](https://github.com/react-native-community/react-native-async-storage)                               |
| **ImageStore**       | 0.59        | [expo-file-system](https://github.com/expo/expo/tree/master/packages/expo-file-system) 或 [react-native-fs](https://github.com/itinance/react-native-fs) |
| **MaskedViewIOS**    | 0.59        | [@react-native-community/react-native-masked-view](https://github.com/react-native-community/react-native-masked-view)                                   |
| **NetInfo**          | 0.59        | [@react-native-community/react-native-netinfo](https://github.com/react-native-community/react-native-netinfo)                                           |
| **Slider**           | 0.59        | [@react-native-community/react-native-slider](https://github.com/react-native-community/react-native-slider)                                             |
| **ViewPagerAndroid** | 0.59        | [@react-native-community/react-native-viewpager](https://github.com/react-native-community/react-native-viewpager)                                       |

未来几个月，还会有更多组件沿着这条路走向更精简的核心。我们正在寻求帮助——欢迎前往[精简核心专题](https://github.com/facebook/react-native/issues/23313)参与。

## 👩🏽‍💻 CLI 改进

React Native 的命令行工具是开发者进入生态的入口，但长期存在问题且无官方支持。CLI 工具已迁移到[新仓库](https://github.com/react-native-community/react-native-cli)，一支[专注的维护团队](https://blog.callstack.io/the-react-native-cli-has-a-new-home-79b63838f0e6)已做出令人兴奋的改进。

日志格式更好，命令几乎瞬间执行——你会立即感受到差异：

![0.58 版本中 CLI 启动较慢](/blog/assets/0.58-cli-speed.png) ![0.59 版本中 CLI 几乎瞬间响应](/blog/assets/0.59-cli-speed.png)

## 🚀 升级到 0.59

我们听到了大家对 [React Native 升级流程](https://github.com/react-native-community/discussions-and-proposals/issues/68)的反馈，正在采取措施在[未来版本](https://github.com/react-native-community/discussions-and-proposals/issues/64#issuecomment-444775432)中提升体验。升级到 0.59 推荐使用 [`rn-diff-purge`](https://github.com/react-native-community/rn-diff-purge) 来确定你当前版本与 0.59 之间的差异，然后手动应用这些更改。升级完成后，便可使用改进后的 `react-native upgrade` 命令（基于 `rn-diff-purge`）来升级到 0.60 及后续版本。

## 🔨 重大变更

0.59 对 Android 支持进行了整理，遵循 Google 最新推荐，可能导致已有应用出现问题。问题表现为运行时崩溃，并提示“你需要为该 Activity 使用 Theme.AppCompat 主题（或其派生）”。建议更新项目的 `AndroidManifest.xml` 文件，确保 `android:theme` 值为 AppCompat 主题（如 `@style/Theme.AppCompat.Light.NoActionBar`）。

`react-native-git-upgrade` 命令在 0.59 中被移除，建议使用新改进的 `react-native upgrade` 命令替代。

## 🤗 致谢

许多新贡献者帮助[启用从 flow 类型生成原生代码](https://github.com/facebook/react-native/issues/22990)和[解决 Xcode 警告](https://github.com/facebook/react-native/issues/22609)——这是学习 React Native 工作原理和为社区做贡献的好方式。谢谢大家！期待未来出现类似的议题。

以上是我们重点标注的内容，还有很多令人激动的更新。查看完整更新请阅读[更新日志](https://github.com/react-native-community/react-native-releases/blob/master/CHANGELOG.md)。0.59 是一个巨大版本——迫不及待想让你试用。

今年剩余时间还有更多改进，敬请期待！

[Ryan](https://github.com/turnrye) 和整个 [React Native 核心团队](https://twitter.com/reactnative)