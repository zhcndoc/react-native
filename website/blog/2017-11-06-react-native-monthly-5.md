---
title: 'React Native 月报 #5'
author: Tomislav Tenodi
authorTitle: Speck 创始人
authorURL: 'https://github.com/tenodi'
authorImageURL: 'https://pbs.twimg.com/profile_images/877237660225609729/bKFDwfAq.jpg'
authorTwitter: TomislavTenodi
tags: [engineering]
---

React Native 月度会议继续进行中！让我们看看各团队最近在忙些什么。

### Callstack

- 我们一直在完善 React Native CI。最重要的是，我们已从 Travis 迁移到 Circle，使 React Native 只保留一个统一的 CI 流程。
- 我们组织了 [Hacktoberfest - React Native 版本](https://blog.callstack.io/announcing-hacktoberfest-7313ea5ccf4f)，与参与者一起尝试向开源项目提交大量 Pull Request。
- 我们持续开发 [Haul](https://github.com/callstack/haul)。上个月我们发布了两个新版本，包括 webpack 3 支持。我们计划添加对 [CRNA](https://github.com/react-community/create-react-native-app) 和 [Expo](https://github.com/expo/expo) 的支持，并改进热模块替换（HMR）。我们的路线图已在 issue 跟踪器公开。如果你想建议改进或提供反馈，欢迎告诉我们！

### Expo

- 发布了 [Expo SDK 22](https://blog.expo.io/expo-sdk-v22-0-0-is-now-available-7745bfe97fc6)（基于 React Native 0.49），并为此更新了 [CRNA](https://github.com/react-community/create-react-native-app)。
  - 包含改进的启动屏 API、基本的 ARKit 支持、“DeviceMotion” API、iOS 11 上的 SFAuthenticationSession 支持及[更多内容](https://blog.expo.io/expo-sdk-v22-0-0-is-now-available-7745bfe97fc6)。
- 你的 [snacks](https://snack.expo.io) 现在可以包含多个 JavaScript 文件，同时可以通过拖拽直接上传图片和其它资源到编辑器中。
- 贡献代码到 [react-navigation](https://github.com/react-community/react-navigation)，以新增对 iPhone X 的支持。
- 聚焦解决使用 Expo 构建大型应用时遇到的难点。例如：
  - 多环境部署的一级支持：包括 staging、生产以及任意频道。频道支持回滚并设置当前发布版本。如果你想成为早期测试者，请告诉我们，[@expo_io](https://twitter.com/expo_io)。
  - 我们也正在改进独立应用构建基础设施，新增在独立应用构建时打包图片和其它非代码资源的支持，同时保持通过 OTA 更新资源的能力。

### Facebook

- 更好的 RTL 支持：
  - 我们引入了多种方向感知的样式。
    - 位置：
      - (left|right) → (start|end)
    - 外边距：
      - margin(Left|Right) → margin(Start|End)
    - 内边距：
      - padding(Left|Right) → padding(Start|End)
    - 边框：
      - borderTop(Left|Right)Radius → borderTop(Start|End)Radius
      - borderBottom(Left|Right)Radius → borderBottom(Start|End)Radius
      - border(Left|Right)Width → border(Start|End)Width
      - border(Left|Right)Color → border(Start|End)Color
  - 在 RTL 中，“left”和“right” 在 position、margin、padding 和 border 样式中的含义被交换。几个月内，我们将移除此行为，使“left”始终表示“左”，“right”始终表示“右”。此破坏性更改被隐藏在一个开关下。在 React Native 组件中使用 `I18nManager.swapLeftAndRightInRTL(false)` 以启用此改动。
- 正在为我们的内部原生模块添加 [Flow](https://github.com/facebook/flow) 类型，并利用这些类型生成 Java 中的接口和 ObjC 中的协议，原生实现必须遵循这些协议。我们希望这些代码生成工具最早能在明年开源。

### Infinite Red

- 推出一款新的开源工具，帮助 React Native 及其他项目。详情见[这里](https://shift.infinite.red/solidarity-the-cli-for-developer-sanity-672fa81b98e9)。
- 正在重构 [Ignite](https://github.com/infinitered/ignite)，为新版本模版做准备（代号：Bowser）。

### Shoutem

- 改善 Shoutem 的开发流程。我们希望简化从创建应用到第一个自定义界面的过程，让新手 React Native 开发者更容易上手。准备了几个工作坊测试新功能。我们还改进了 [Shoutem CLI](https://github.com/shoutem/cli) 来支持新的流程。
- [Shoutem UI](https://github.com/shoutem/ui) 收到了若干组件改进和 bug 修复。我们也检查了其与最新 React Native 版本的兼容性。
- Shoutem 平台收到了若干显著更新，新集成作为 [开源扩展项目](https://github.com/shoutem/extensions) 的一部分发布。看到其他开发者积极为 Shoutem 扩展贡献代码，我们感到十分兴奋。我们积极联系并提供建议与指导。

## 下一次会议

下一次会议定于 2017 年 12 月 6 日星期三。如有任何建议，欢迎通过 [Twitter](https://twitter.com/TomislavTenodi) 联系我，告诉我们如何改进会议成果。
