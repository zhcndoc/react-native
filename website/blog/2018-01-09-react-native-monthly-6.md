---
title: 'React Native 每月速递 #6'
author: Tomislav Tenodi
authorTitle: Speck 创始人
authorURL: 'https://twitter.com/TomislavTenodi'
authorImageURL: 'https://pbs.twimg.com/profile_images/877237660225609729/bKFDwfAq.jpg'
authorTwitter: TomislavTenodi
tags: [engineering]
---

React Native 月度会议依然如火如荼地进行着！请务必查看本文底部的备注，了解下一次会议时间。

### Expo

- 祝贺 [Devin Abbott](https://github.com/dabbott) 和 [Houssein Djirdeh](https://twitter.com/hdjirdeh) 发布了《Full Stack React Native》一书的预发布版！这本书通过构建多个小应用来带你学习 React Native。
- 发布了第一个（实验性）版本的 [reason-react-native-scripts](https://github.com/react-community/reason-react-native-scripts)，帮助大家轻松尝试 [ReasonML](https://reasonml.github.io/)。
- Expo SDK 24 已[发布](https://blog.expo.io/expo-sdk-v24-0-0-is-now-available-bfcac3b50d51)！它使用了 [React Native 0.51](https://github.com/facebook/react-native/releases/tag/v0.51.0)，包括许多新功能和改进：独立应用中的图片打包（首次加载无需缓存！）、图片处理 API（裁切、缩放、旋转、翻转）、人脸检测 API、全新发布频道功能（为指定频道设置活跃版本及回滚）、用于跟踪独立应用构建的网页仪表盘，以及修复了 Android OpenGL 实现与多任务管理器的长期 bug，仅举几例。
- 从今年一月开始，我们将投入更多资源支持 React Navigation。我们坚信仅使用 React 组件及 Animated 和 `react-native-gesture-handler` 等基础库来构建 React Native 导航既可能又理想，我们对计划中的一些改进感到非常兴奋。如果你想为社区贡献力量，可以关注 [react-native-maps](https://github.com/react-community/react-native-maps) 和 [react-native-svg](https://github.com/react-native-community/react-native-svg)，两者都非常需要帮助！

### Infinite Red

- 我们已确定 [Chain React 会议](https://infinite.red/ChainReactConf)的主题演讲嘉宾：[Kent C. Dodds](https://twitter.com/kentcdodds) 和 [Tracy Lee](https://twitter.com/ladyleet)。征稿公告将很快发布。
- [社区聊天室](https://community.infinite.red/)现有1600名成员。
- [React Native 通讯](https://reactnative.cc/)订阅人数达到8500人。
- 目前正在研究提高 RN 抗崩溃能力的最佳实践，后续会有报告分享。
- 正在为 [Solidarity](https://shift.infinite.red/effortless-environment-reports-d129d53eb405) 添加错误报告功能。
- 发布了关于如何在 [React Native 和 Android](https://shift.infinite.red/simple-react-native-android-releases-319dc5e29605)上发布应用的操作指南。

### Microsoft

- 已启动一个[拉取请求](https://github.com/Microsoft/react-native-windows/pull/1419)，旨在将 React Native Windows 桥接核心迁移到 .NET Standard，从而实现跨操作系统通用。这样许多其他 .NET Core 平台就能用自己的线程模型、JavaScript 运行时和 UIManager 扩展该桥接（例如 JavaScriptCore、Xamarin.Mac、Linux Gtk#及三星 Tizen 选项）。

### Wix

- [Detox](https://github.com/wix/detox)
  - 为了让端到端测试规模化并减少 CI 时间，我们正在开发 Detox 的并行支持。
  - 提交了[拉取请求](https://github.com/facebook/react-native/pull/16948)，以支持自定义 flavor 构建，更好地支持 E2E 测试的 mock。
- [DetoxInstruments](https://github.com/wix/DetoxInstruments)
  - DetoxInstruments 的杀手级功能开发极具挑战性，任意时刻获取 JavaScript 调用栈需要 JSCore 的自定义实现以支持 JS 线程挂起。在 Wix 内部 app 上测试该性能分析器揭示了 JS 线程的一些有趣见解。
  - 该项目尚不够稳定供公众使用，但开发积极进行中，我们希望很快能发布。
- [React Native Navigation](https://github.com/wix/react-native-navigation)
  - V2 版本开发速度显著提升，之前仅有一名开发者兼职（20% 时间）开发，现在已有 3 名开发者全职投入！
- Android 性能优化
  - 用 RN 捆绑的旧版 JSCore 替换为它的最新版本（基于 webkitGTK 项目的最新代码，带有自定义 JIT 配置）使 JS 线程性能提升了40%。接下来将编译 64 位版本。此工作基于 [JSC 安卓构建脚本](https://github.com/SoftwareMansion/jsc-android-buildscripts)。可在[此处](https://github.com/DanielZlotin/jsc-android-buildscripts/tree/tip)查看当前状态。

## 下一次会议

目前有讨论考虑将本次会议重心调整为集中讨论单一具体主题（例如导航、将 React Native 模块拆分到独立仓库、文档等）。这样我们觉得能为 React Native 社区贡献更多。这可能会在下次会议中实施。欢迎通过推特告诉我们你希望被讨论的主题。