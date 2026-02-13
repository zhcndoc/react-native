---
title: 2018 年 React Native 社区现状
author: Lorenzo Sciandra
authorTitle: 核心维护者 & React Native 开发者
authorURL: 'https://github.com/kelset'
authorImageURL: 'https://avatars2.githubusercontent.com/u/16104054?s=460&v=4'
authorTwitter: kelset
tags: [公告]
---

2018 年，React Native 社区在开发和沟通 React Native 的方式上做出了诸多改变。我们相信几年后回头看，这次转变将被视为 React Native 的一个转折点。

许多人对 React Native 架构的重写感到兴奋，这就是广为人知的 [Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4)。除了其他改进之外，这将解决 React Native 架构中的根本性限制，并结合 [JSI 和 TurboModules](https://github.com/react-native-community/discussions-and-proposals/issues/40) 为 React Native 的未来成功奠定基础。

2018 年最大的转变是赋能 React Native 社区。从一开始，Facebook 就鼓励来自全球的开发者参与到 React Native 的开源项目中。从那时起，出现了一批核心贡献者，负责包括发布流程在内的各项事务。

这些成员采取了几个重要步骤，使整个社区在塑造项目未来方面更具权能，并提供了以下资源：

## [`react-native-releases`](https://github.com/react-native-community/react-native-releases) 📬

这个仓库创建于一月，双重作用是让所有人可以更协作的方式跟进新版本发布，并向任何想要建议 cherry-pick 的人开放版本内容的讨论（例如[0.57.8](https://github.com/react-native-community/react-native-releases/issues/71)及其之前所有版本）。

它是推动摆脱月度发布周期、以及目前针对 0.57.x 版本采用“长期支持”策略的主力。

这些决定的另一半功劳归于今年创建的另一个仓库：

## [`discussions-and-proposals`](https://github.com/react-native-community/discussions-and-proposals) 🗣

这个仓库创建于七月，拓展了 React Native 更开放对话环境的理念。此前，这个需求由主仓库中标注为 [`For Discussion`](https://github.com/facebook/react-native/labels/For%20Discussion) 的 issue 负责，但我们希望将这策略扩展成类似 RFC 的模式，类似其他库（如 React）采用的做法。

这一实验很快在 React Native 生命周期中找到自己的定位。Facebook 团队现正利用社区 RFC 流程来讨论 [React Native 可改进之处](https://github.com/react-native-community/discussions-and-proposals/issues/64)，并协调围绕 [Lean Core 项目](https://github.com/react-native-community/discussions-and-proposals/issues/6) 的努力——以及其他有趣的讨论。

## [@ReactNativeComm](https://twitter.com/ReactNativeComm) 🐣

我们意识到，沟通这些工作的方式未能达到理想效果。为方便大家更轻松地跟进 React Native 社区的所有动态（从发布到活跃讨论），我们创建了一个可以依赖的新推特账号 [@ReactNativeComm](https://twitter.com/ReactNativeComm)。

如果你没有使用该社交网络，记得你总可以通过 GitHub 观看仓库；这几个月该功能得到改进，可以仅接收版本发布的通知，建议你也试试用它。

## 未来展望 🎓

过去 7-8 个月来，核心贡献者增强了 [React Native Community GitHub 组织](https://github.com/react-native-community) 对 React Native 开发的掌控力，并加强了与 Facebook 的协作。但这始终缺乏类似项目所具备的正式架构。

该组织可以通过对所托管的所有包和仓库施行一套标准，为更广泛的开发者社区树立榜样，提供维护者相互协助、贡献符合社区共识标准代码的统一平台。

2019 年初，我们将出台这套新指南。欢迎在 [专门讨论帖](https://github.com/react-native-community/discussions-and-proposals/issues/63) 中告诉我们你的看法。

我们确信，有了这些改变，社区将变得更加协作，以至于当我们达到 1.0 版本时，我们都能通过这种共同努力，继续构建（甚至更多）精彩的应用 🤗

---

希望你和我们一样，对这个社区的未来充满期待。我们期待你们积极参与上述仓库中的对话，或通过你们出色的代码贡献一份力量。

编程愉快！