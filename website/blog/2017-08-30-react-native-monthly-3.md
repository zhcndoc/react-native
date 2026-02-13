---
title: 'React Native 月刊 #3'
authors: [grabbou]
tags: [工程]
---

React Native 月度会议继续进行！本月的会议稍微短了一些，因为我们的大多数团队都忙于发布产品。下个月，我们将在波兰弗罗茨瓦夫举办的 [React Native EU](https://react-native.eu/) 大会上见面。务必抢购门票，现场见！与此同时，让我们看看团队们正在做些什么。

## 团队

在第三次会议上，有 5 个团队加入了我们：

- [Callstack](https://github.com/callstack)
- [Expo](https://github.com/expo)
- [Facebook](https://github.com/facebook)
- [Microsoft](https://github.com/microsoft)
- [Shoutem](https://github.com/shoutem)

## 会议纪要

以下是各团队的纪要：

### Callstack

- 最近开源了 [`react-native-material-palette`](https://github.com/callstack-io/react-native-material-palette)。它能从图片中提取主要颜色，帮助你创建视觉上更吸引人的应用。目前仅支持 Android，但我们正在考虑未来添加 iOS 支持。
- 我们已经把 HMR 支持合并到了 [`haul`](https://github.com/callstack-io/haul) 以及其它一堆很酷的新功能！请查看最新版本发布。
- React Native EU 2017 即将来临！下个月全是关于 React Native 和波兰的内容！务必在[这里](https://react-native.eu/)抢购最后的门票。

### Expo

- 推出了对 [Snack](https://snack.expo.io) 中安装 npm 包的支持。Expo 的常规限制依然适用——包不能依赖 Expo 中尚未包含的自定义原生 API。我们还在努力支持在 Snack 中使用多文件和上传资源。[Satyajit](https://github.com/satya164) 将在 [React Native Europe](https://react-native.eu/) 上介绍 Snack。
- 发布了带有相机、支付、安全存储、磁力计、暂停/恢复文件系统下载和改进的启动/加载屏幕的 SDK20。
- 继续与 [Krzysztof](https://github.com/kmagiera) 合作开发 [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)。欢迎大家试用一下，用它重建之前用 PanResponder 或原生手势识别器实现的手势，并告诉我们遇到了哪些问题。
- 试验 JSC 调试协议，正在根据 [Canny](https://expo.canny.io/feature-requests) 上的许多功能需求进行工作。

### Facebook

- 上个月我们讨论了 GitHub 问题追踪器的管理，希望尝试改进，以提升项目的可维护性。
- 目前，打开的问题数保持在约 600 个，并且看起来可能会维持一段时间。过去一个月，我们关闭了 690 个由于缺少活动（定义为过去 60 天内无评论）的问题。在这690个问题中，有 58 个因多种原因被重新打开（例如维护者承诺修复，或贡献者提出保留问题的有力理由）。
- 我们计划在可预见的未来继续自动关闭陈旧问题。我们的目标是每个有影响力的问题都能得到响应，但我们还没达到。我们需要所有维护者协助完成问题筛查，确保不遗漏引入回归或破坏性变更的问题，尤其是那些影响新建项目的问题。有意帮忙的朋友可以使用 Facebook GitHub Bot 来筛查问题和拉取请求。新的维护者指南包含了筛查和使用 GitHub Bot 的更多信息。请加入我们的[问题特别工作组](https://github.com/facebook/react-native/blob/master/bots/IssueCommands.txt)，并鼓励其他活跃社区成员一同加入！

### Microsoft

- 新版 Skype 应用基于 React Native 构建，旨在实现跨平台尽可能多的代码共享。基于 React Native 的 Skype 应用目前已在 Android 和 iOS 应用商店上线。
- 在使用 React Native 构建 Skype 应用时，我们向 React Native 发送了许多拉取请求，修复遇到的 bug 和缺失功能。目前，我们已有约 [70个拉取请求被合并](https://github.com/facebook/react-native/pulls?utf8=%E2%9C%93&q=is%3Apr%20author%3Arigdern%20)。
- React Native 使我们能够基于同一代码库驱动 Android 和 iOS 版 Skype 应用。我们还希望用该代码库支持 Skype Web 应用。为此，我们打造并开源了名为 [ReactXP](https://microsoft.github.io/reactxp/blog/2017/04/06/introducing-reactxp.html) 的轻量层，位于 React/React Native 之上。ReactXP 提供一套跨平台组件，目标为 iOS/Android 时映射到 React Native，目标为 Web 时映射到 react-dom。ReactXP 的目标类似于另一个开源库 React Native for Web。关于这两个库方法的区别，详见 [ReactXP FAQ](https://microsoft.github.io/reactxp/docs/faq.html)。

### Shoutem

- 我们持续努力改进和简化使用 [Shoutem](https://shoutem.github.io/) 构建应用的开发者体验。
- 开始将所有应用迁移到 react-navigation，但最终推迟，等待更稳定版本的发布，或等待某个原生导航方案成熟。
- 将我们所有的 [扩展](https://github.com/shoutem/extensions) 以及大部分开源库（[animation](https://github.com/shoutem/animation)、[theme](https://github.com/shoutem/theme)、[ui](https://github.com/shoutem/ui)）升级到 React Native 0.47.1。

## 下次会议

下次会议定于 2017 年 9 月 13 日星期三。作为我们仅举行的第三次会议，我们想知道这些纪要对 React Native 社区有何帮助。如果你有关于如何改进会议输出的建议，欢迎随时通过我的 [Twitter](https://twitter.com/grabbou) 联系我。