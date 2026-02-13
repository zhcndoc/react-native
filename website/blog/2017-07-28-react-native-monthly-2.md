---
title: 'React Native 月刊 #2'
author: Tomislav Tenodi
authorTitle: Shoutem 产品经理
authorURL: 'https://github.com/tenodi'
authorImageURL: 'https://pbs.twimg.com/profile_images/877237660225609729/bKFDwfAq.jpg'
authorTwitter: TomislavTenodi
tags: [工程]
---

React Native 月度会议继续进行！本次会议我们迎来了 [Infinite Red](https://infinite.red/)，他们是 [Chain React，React Native 大会](https://infinite.red/ChainReactConf) 的幕后高手。由于这里大多数人都在 Chain React 做了演讲，我们将会议推迟了一周。大会中的演讲已[发布到线上](https://www.youtube.com/playlist?list=PLFHvL21g9bk3RxJ1Ut5nR_uTZFVOxu522)，我鼓励大家去看看。那么，让我们来看看我们的团队最近都在忙些什么。

## 团队

在第二次会议中，有 9 个团队参加了我们：

- [Airbnb](https://github.com/airbnb)
- [Callstack](https://github.com/callstack-io)
- [Expo](https://github.com/expo)
- [Facebook](https://github.com/facebook)
- [GeekyAnts](https://github.com/GeekyAnts)
- [Infinite Red](https://github.com/infinitered)
- [Microsoft](https://github.com/microsoft)
- [Shoutem](https://github.com/shoutem)
- [Wix](https://github.com/wix)

## 会议记录

以下是各团队的会议记录：

### Airbnb

- 查看 [Airbnb 仓库](https://github.com/airbnb) 获取与 React Native 相关的项目。

### Callstack

- [Mike Grabowski](https://github.com/grabbou) 一如既往地管理着 React Native 的月度发布，包括发布了一些 Beta 版本。尤其是在推进 v0.43.5 版本发布到 npm，因为它为 Windows 用户解除了阻碍！
- [Haul](https://github.com/callstack-io/haul) 的开发进展缓慢但持续。已有一个 pull request 添加了热模块替换（HMR），其它改进也已发布。最近有几位业界领袖开始采用它。可能计划开始在这方面的全职付费工作。
- [Michał Pierzchała](https://twitter.com/thymikee) 来自 [Jest](https://github.com/facebook/jest) 团队，本月加入了 Callstack。他将帮助维护 [Haul](https://github.com/callstack-io/haul)，并可能参与 [Metro Bundler](https://github.com/facebook/metro) 和 [Jest](https://github.com/facebook/jest) 的工作。
- [Satyajit Sahoo](https://twitter.com/satya164) 也加入了我们，太棒了！
- 开源部门有一堆很酷的项目即将发布。尤其是在将 Material Palette API 引入 React Native 上。计划最终发布我们面向 iOS 的原生组件包，旨在提供 1:1 的原生组件外观与体验。

### Expo

- 最近推出了 [Native Directory](https://native.directory)，帮助提高 React Native 生态中库的发现和评估效率。问题是：库太多，难以测试，需要手动判定，且并不明显哪些是最好该用的库，也很难判断是否兼容 CRNA/Expo。Native Directory 试图解决这些问题。欢迎查看并[添加你的库](https://github.com/react-community/native-directory)。库列表见[这里](https://github.com/react-community/native-directory/blob/master/react-native-libraries.json)。这只是第一步，我们希望这个项目由社区来拥有和维护，而不仅仅是 Expo 的团队。如果你觉得有价值并希望参与改进，欢迎加入！
- 在 Expo SDK 19 的 [Snack](https://snack.expo.io/) 中新增了安装 npm 包的初步支持。如果遇到任何问题请告诉我们，我们还在修复一些 bug。配合 Native Directory，这应能方便测试纯 JS 依赖或包含在 [Expo SDK](https://github.com/expo/expo-sdk) 里的库。试试这些示例：
  - [react-native-modal](https://snack.expo.io/ByBCD_2r-)
  - [react-native-animatable](https://snack.expo.io/SJfJguhrW)
  - [react-native-calendars](https://snack.expo.io/HkoXUdhr-)
- 发布了 [Expo SDK19](https://blog.expo.io/expo-sdk-v19-0-0-is-now-available-821a62b58d3d)，带来了一系列提升，现在使用了[更新版 Android JSC](https://github.com/SoftwareMansion/jsc-android-buildscripts)。
- 正在与 [Alexander Kotliarskyi](https://github.com/frantic) 一起在文档中制作指南，列出提升应用用户体验的技巧。欢迎参与贡献内容或帮忙撰写！
  - 议题: [#14979](https://github.com/facebook/react-native/issues/14979)
  - 初始拉取请求: [#14993](https://github.com/facebook/react-native/pull/14993)
- 持续推进音频/视频、相机、手势（与 Software Mansion 合作开发的 `react-native-gesture-handler`）、GL 相机集成及希望在 SDK20（8 月）中首次推出部分功能，同时其他也会有重大改进。开始构建基础设施以支持 Expo 客户端的后台工作（地理位置、音频、通知等）。
- [Adam Miskiewicz](https://twitter.com/skevy) 在模仿 [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller) 转场效果的 [react-navigation](https://github.com/react-community/react-navigation) 中取得了不错进展。可以先看看他早期的版本，见[他的推文](https://twitter.com/skevy/status/884932473070735361)——相关版本即将发布。还可关注他[提上游](https://github.com/facebook/react-native/commit/8ea6cea39a3db6171dd74838a6eea4631cf42bba)的 `MaskedViewIOS`。如果你有能力且愿意实现 Android 版的 `MaskedView`，那就太棒了！

### Facebook

- Facebook 内部正在探索是否可以将原生的 [ComponentKit](https://componentkit.org/) 和 [Litho](https://fblitho.com/) 组件内嵌到 React Native 中。
- 欢迎为 React Native 贡献！如果你想知道如何贡献，我们的["贡献指南"](https://github.com/facebook/react-native-website/blob/master/CONTRIBUTING.md)详细描述了开发流程及提交首个 pull request 的步骤。除编写代码之外，还能通过 triaging issues（问题处理）或更新文档等方式贡献。
  - 截稿时，React Native 有 **635** 个[未关闭的问题](https://github.com/facebook/react-native/issues)和 **249** 个[待合入的 PR](https://github.com/facebook/react-native/pulls)。这些数量对维护者是巨大压力，且内部修复的问题很难保证及时更新相关任务。
  - 我们尚未确定处理方式以在满足社区的同时减轻维护者负担。一些（非全部）方案包括关闭陈旧的问题、赋予更多人员管理权限、自动关闭不符合模板的问题。我们编写了“维护者期待”指南，设定预期并避免意外。如果你有好建议帮助维护者提高体验，同时让提出问题和 PR 的人感受到被尊重和重视，请告诉我们！

### GeekyAnts

- 在 Chain React 上演示了 Designer 工具，它可处理 React Native 文件。许多参会者报名等候名单。
- 也在关注其他跨平台方案，如 [Google Flutter](https://flutter.io/)（一个重要对比即将发布）、[Kotlin Native](https://github.com/JetBrains/kotlin-native) 和 [Apache Weex](https://weex.incubator.apache.org/)，以了解架构差异和学习它们如何提升 React Native 的整体性能。
- 大部分应用已切换到使用 [react-navigation](https://github.com/react-community/react-navigation)，显著提升了整体性能。
- 还宣布了 [NativeBase Market](https://market.nativebase.io/)——React Native 组件和应用的市场（由开发者为开发者打造）。

### Infinite Red

- 希望介绍 [Reactotron](https://github.com/infinitered/reactotron)。查看[介绍视频](https://www.youtube.com/watch?v=tPBRfxswDjA)。我们很快会添加更多功能！
- 组织了 Chain React 大会。非常棒，感谢大家参与！[视频现已上线！](https://www.youtube.com/playlist?list=PLFHvL21g9bk3RxJ1Ut5nR_uTZFVOxu522)

### Microsoft

- [CodePush](https://github.com/Microsoft/code-push) 已整合进 [Mobile Center](https://mobile.azure.com/)。现有用户的工作流程无变化。
  - 有用户报告出现了重复应用的问题——因为他们已经在 Mobile Center 有应用。我们正努力解决，如果你有两个应用，请告知，我们能帮你合并。
- Mobile Center 现支持 CodePush 的推送通知功能。并演示了如何结合通知和 CodePush 来进行 A/B 测试——这是 React Native 架构的独特优势。
- [VS Code](https://github.com/Microsoft/vscode) 已知在调试 React Native 时出现问题，新版本扩展将在几天内修复。
- 鉴于微软内部还有许多团队也在致力于 React Native，我们将争取下一次会议时有更广泛团队的代表。

### Shoutem

- 完成使 React Native 开发在 [Shoutem](https://shoutem.github.io/) 上更便捷的工作。开发应用时你可以使用所有标准的 `react-native` 命令。
- 在解决如何最佳进行 React Native 性能分析上做了大量工作。许多[文档](/docs/performance)已经过时，我们将尽力提交 PR 更新官方文档，或至少在博客中分享结论。
- 将导航方案切换到 [react-navigation](https://github.com/react-community/react-navigation)，可能很快会给出反馈。
- 发布了[新的 HTML 组件](https://github.com/shoutem/ui/tree/develop/html)，它能将原始 HTML 转换成 React Native 组件树。

### Wix

- 开始向 [Metro Bundler](https://github.com/facebook/metro) 提交包含 [react-native-repackager](https://github.com/wix/react-native-repackager) 功能的 PR。已升级 react-native-repackager 以支持 RN 44（我们生产环境使用的版本）。用于我们的 [detox](https://github.com/wix/detox) 模拟测试框架。
- 过去三周一直在为 Wix 应用编写 detox 测试。这是一次极好的学习体验，了解如何减少如此规模（超 40 名工程师）的应用中的手动 QA。我们修复了若干 detox 问题，新版本刚发布。很高兴地报告，我们目前严格遵循“零闪烁政策”，测试稳定通过。
- Detox for Android 正在良好推进。社区大力协助，预计两周内发布初版。
- 我们的性能测试工具 [DetoxInstruments](https://github.com/wix/detoxinstruments) 正在逐渐膨胀。计划将其变为独立工具，不再紧耦合 detox。它将支持一般 iOS 应用的性能分析，并与 detox 集成，实现自动化性能指标测试。

## 下次会议

下一次会议定于 2017 年 8 月 16 日。作为仅第 2 次会议，我们希望知道这些记录对 React Native 社区有何帮助。欢迎随时在 [Twitter](https://twitter.com/TomislavTenodi) 上联系我，提供改进会议产出方式的建议。