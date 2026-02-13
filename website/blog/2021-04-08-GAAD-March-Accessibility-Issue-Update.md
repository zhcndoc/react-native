---
title: GAAD 承诺 - 3 月无障碍问题更新
authors: [alexmarlette]
tags: [announcement]
---

自从我们向 GitHub 社区发布详尽审核的差距分析及改进 React Native 无障碍性的议题列表，已经过去四周。在 React Native 社区的帮助下，我们在提升无障碍性方面已经取得了显著进展。社区成员一直在帮助贡献者、审核测试并关注之前的无障碍问题。自 3 月 8 日以来，社区关闭了六个问题，包括四个合并请求，还有七个其他合并请求正在审查流程中。

在这项工作持续进行的同时，Facebook 的 React Native 和无障碍团队正在评估这项倡议之前提交的无障碍缺陷和问题，确认它们是否已包含在现有的差距分析中，或者是否有额外的问题需要纳入项目。已发现一个新的问题并已纳入项目，另外四个问题直接映射到现有问题，预计还有两个问题通过解决其根本原因的现有问题将被关闭。

感谢所有参与的社区成员。你们正真正推动 React Native 更加无障碍，造福所有人！

<!--truncate-->

## 已关闭的合并请求 🎉

- [为按钮无障碍添加 TalkBack 支持：disabled 属性 #31001](https://github.com/facebook/react-native/pull/31001) - 由 [@huzaifaaak ](https://twitter.com/huzaifaaak) 关闭

- [feat：当 TouchableHighlight 被禁用时设置 disabled accessibilityState #31135](https://github.com/facebook/react-native/pull/31135) 由 [@natural_clar](https://twitter.com/natural_clar) 关闭

- [[Android] TextInput 组件选中状态未被播报 #31144](https://github.com/facebook/react-native/pull/31144) 由 [fabriziobertoglio1987](https://fabriziobertoglio.xyz/) 关闭

- [为 TouchableNativeFeedback 无障碍添加 TalkBack 支持：disabled 属性 #31224](https://github.com/facebook/react-native/pull/31224) 由 [@kyamashiro73](https://twitter.com/kyamashiro73) 关闭

- [无障碍/按钮测试 #31189](https://github.com/facebook/react-native/pull/31189) 由 [@huzaifaaak ](https://twitter.com/huzaifaaak) 关闭
  - 添加按钮的 accessibilityState 测试

## 修复内容

- `Button` 组件（由 [#31001](https://github.com/facebook/react-native/pull/31001) 修复）：
  - 现在会播报按钮被禁用状态
  - 按钮禁用时为屏幕阅读器禁用点击功能
  - 播报按钮被选中状态

- `TextInput` 组件（由 [#31144](https://github.com/facebook/react-native/pull/31144) 修复）：
  - 当 accessibilityState 的 "selected" 设置为 true 并且元素获得焦点时，播报“已选中”

- `TouchableHighlight` 组件（由 [#31135](https://github.com/facebook/react-native/pull/31135) 修复）：
  - 组件禁用时为屏幕阅读器禁用点击功能

- `TouchableNativeFeedback` 组件（由 [#31224](https://github.com/facebook/react-native/pull/31224) 修复）：
  - 组件禁用时为屏幕阅读器禁用点击功能

## 其他进展

| 状态                                   | 问题数量 |
| ------------------------------------ | :------: |
| 待办问题                              |    53    |
| 社区进行中的问题                      |     8    |
| React Native 团队进行中的问题         |     5    |
| 正在进行的合并请求                    |     3    |
| 审查中的合并请求                      |     4    |

## 加入我们！

- 新贡献者请阅读 [贡献指南](https://github.com/facebook/react-native/blob/master/CONTRIBUTING.md)，并浏览 React Native GitHub 上的 37 个 [适合初学者的问题](https://github.com/facebook/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22Good+first+issue%22+label%3AAccessibility)。

- 想要挑战更有难度问题的贡献者，请访问[React Native 无障碍改进项目页面](https://github.com/facebook/react-native/projects/15)，查看需要你 React Native 知识的 GitHub 问题。

- 有意更新 React Native 文档以反映正在关闭的无障碍缺陷的技术写手请访问 [React Native 文档](https://github.com/facebook/react-native-website#-overview)。

- 欢迎将此倡议分享给可能提供帮助的任何人！

- 关注 React Native 的 GAAD 承诺开源无障碍社区经理，Twitter: [alexmarlette](https://twitter.com/alexmarlette)，Facebook: [React Native Open Source Accessibility Community Manager](https://www.facebook.com/React-Native-Open-Source-Accessibility-Community-Manager-102732258549941)，随时了解最新进展。