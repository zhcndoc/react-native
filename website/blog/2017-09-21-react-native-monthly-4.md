---
title: 'React Native 月刊 #4'
authors: [grabbou]
tags: [工程]
---

React Native 月度会议持续进行！以下是各团队的会议记录：

### Callstack

- [React Native EU](https://react-native.eu) 已经结束。来自33个国家的300多名参与者访问了弗罗茨瓦夫。演讲视频可以在 [YouTube](https://www.youtube.com/channel/UCUNE_g1mQPuyW975WjgjYxA/videos) 上观看。
- 会议结束后，我们正逐步恢复开源项目的发布时间表。值得一提的是，我们正在开发[react-native-opentok](https://github.com/callstack/react-native-opentok)的下一个版本，修复了大部分现有问题。

### GeekyAnts

尝试通过以下方式降低开发者使用 React Native 的门槛：

- 在 [React Native EU](https://react-native.eu) 宣布了 [BuilderX.io](https://builderx.io/)。BuilderX 是一款设计工具，可以直接操作 JavaScript 文件（目前仅支持 React Native），生成美观、易读且可编辑的代码。
- 推出了 [ReactNativeSeed.com](https://reactnativeseed.com/) ，为你的下一个 React Native 项目提供一套初始化模板。模板选项丰富，包括 TypeScript 和 Flow 用于数据类型，状态管理支持 MobX、Redux 和 mobx-state-tree，支持 CRNA 及纯 React-Native 技术栈。

### Expo

- 即将发布 SDK 21，支持 react-native 0.48.3，同时带来一系列修复、稳定性提升和新功能，包括视频录制、新的启动屏 API、支持 `react-native-gesture-handler` 以及改进的错误处理。
- 关于 [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)，[Krzysztof Magiera](https://github.com/kmagiera) 来自 [Software Mansion](https://swmansion.com/) 持续推进此项目，我们协助测试并资助了部分开发时间。SDK 21 集成该功能后，大家可以在 Snack 中轻松试用，非常期待大家的创意展现。
- 关于改进的错误日志和处理——详情可见[这段 Expo 内部 PR 的 gist](https://gist.github.com/brentvatne/00407710a854627aa021fdf90490b958)（特别是“问题2”部分），以及[这次提交](https://github.com/expo/xdl/commit/1d62eca293dfb867fc0afc920c3dad94b7209987)，它处理了导入 npm 标准库模块失败的情况。React Native 有很多机会在上游改进错误信息，我们会持续推动相关 PR，也欢迎社区加入。
- [native.directory](https://native.directory/) 持续增长，你可以从[GitHub 仓库](https://github.com/react-community/native-directory)添加你的项目。
- 参加北美各地的黑客马拉松活动，包括 [PennApps](https://pennapps.com/)、[Hack The North](https://hackthenorth.com/)、[HackMIT](https://hackmit.org/) 以及即将到来的 [MHacks](https://mhacks.org/)。

### Facebook

- 正在改进 Android 平台上的 `<Text>` 和 `<TextInput>` 组件。（包括 `<TextInput>` 的原生自动增长，深层嵌套的 `<Text>` 组件布局问题，更好的代码结构以及性能优化）。
- 我们依旧在寻找更多贡献者，帮助处理问题和 Pull Request。

### Microsoft

- 发布了 CodePush 的代码签名功能。React Native 开发者现在可以在 CodePush 中对应用包进行签名。相关公告见 [这里](https://microsoft.github.io/code-push/articles/CodeSigningAnnouncement.html)。
- 正在完成 CodePush 与 Mobile Center 的集成，同时考虑增加测试和崩溃集成。

## 下一次会议

下一次会议定于 2017 年 10 月 10 日星期三。鉴于这仅是我们的第四次会议，我们希望了解这些会议记录如何为 React Native 社区带来帮助。如果你有任何关于如何改进会议成果的建议，欢迎通过 [Twitter](https://twitter.com/grabbou) 联系我。