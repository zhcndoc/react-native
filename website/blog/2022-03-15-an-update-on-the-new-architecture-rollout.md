---
title: 新架构推广的最新进展
authors: [cortinico]
tags: [公告]
date: 2022-03-15
---

大家好，  
[正如之前所公布](/blog/2022/01/21/react-native-h2-2021-recap#the-new-architecture-rollout-and-releases):

:::info
2022 年将成为开源领域新架构的大年。
:::

如果你还没有时间深入了解新的 React Native 架构（Fabric 渲染器和 TurboModule 系统），现在正是**最好的时机**！

我们想与社区分享一些我们准备的举措和资料，确保每个人都能一起参与这项工作。

<!--truncate-->

### 工作组

最近，我们在 GitHub 上推出了 [React Native 新架构工作组](https://github.com/reactwg/react-native-new-architecture)，这是一个**仅用于讨论**的仓库，用于协调和支持新架构在生态系统中的推广。

我们希望该工作组成为社区的一个空间，大家可以在这里**相互交流**、分享**想法**，并**讨论**在采用新架构过程中遇到的挑战。此外，我们也会通过该工作组向更广泛的社区**共享**信息和更新，以确保透明度。

为了保持讨论的针对性，我们决定该工作组**公开阅读**，但**写入权限仅限于获批用户**。

如果你希望参与讨论，可以通过[此表单](https://forms.gle/8emgdwFZXuzEpyyn9)填写申请，或者**提名你认为能为讨论带来价值的人**加入。

**欢迎所有人申请加入讨论。**

和任何讨论社区一样，我们再次强调对他人观点的**尊重**和包容的重要性。如果你还没看过，请务必阅读我们的[**行为准则**](https://github.com/reactwg/react-native-new-architecture/blob/main/CODE_OF_CONDUCT.md)。

### 迁移指南

经过多轮评审和反馈，我们终于合并了**迁移指南**（前称为 _实战手册_）。你可以在[新架构工作组](https://github.com/reactwg/react-native-new-architecture#guides)找到它。

该迁移指南将通过逐步指导展示如何**创建自定义 Fabric 组件或 TurboModule**。同时，指南还会告诉你如何**适配现有应用或库**以使用新架构。

此外，我们还想提醒大家访问我们网站上的全新[架构栏目](/architecture/overview)。那里有多篇深入文章，详细解释了 React Native 的内部机制。特别是[Fabric 专区](/architecture/fabric-renderer)，可以帮助你了解新架构中的渲染管线。

最后，请考虑**在工作组中分享你对该文档的反馈**，[点此查看讨论](https://github.com/reactwg/react-native-new-architecture/discussions/7)。我们一直在寻求开发者的意见，确保提供你们觉得最有用的内容。

未来几个月，我们会继续完善并增加更多文档来帮助大家。

### 新架构模版

React Native **0.68.0** 即将发布。这个版本是新架构推广的一个重要里程碑，因为它是首个在**新建应用模版中**包含**可选择开启新架构开关**的版本。

这意味着你只需在模版中**修改一行代码**即可尝试新架构。我们还在模版中添加了详尽的**注释和文档**，确保你无需额外阅读材料即可直接使用。希望这能通过**减少代码量**帮助你更轻松地采用新架构。

<!-- alex ignore simple -->

在后续版本中，我们将继续更新模版，使其更加简洁易用。

要在任一平台启用新架构，你可以：

- iOS 平台，在 `ios` 文件夹内运行 `RCT_NEW_ARCH_ENABLED=1 bundle exec pod install`。
- Android 平台，将 `newArchEnabled` 属性设置为 `true`，方法有**以下三种任选其一**：
  - 修改 `android/gradle.properties` 文件中的相应行。
  - 设置环境变量 `ORG_GRADLE_PROJECT_newArchEnabled=true`
  - 通过 Gradle 参数 `-PnewArchEnabled=true` 运行

然后你就可以通过 `yarn react-native run-android` 或 `run-ios` 命令**运行你的应用**，此时会启用 Fabric 和 TurboModules。

请考虑尝试这个新模版，并且[报告任何你遇到的 Bug 或异常行为](https://github.com/reactwg/react-native-new-architecture/discussions/5)。过去几个月，我们辛苦修复了许多难以发现的 Bug 和构建失败，这些都得益于社区的持续反馈和测试。

### 第三方库生态

没有**第三方库作者和维护者**的全面支持，社区无法顺利迁移到新架构。

我们理解这可能是一个复杂且繁琐的过程，也理解支持用户在**旧架构和新架构之间**过渡的重要性。接下来的几个月，我们会重点支持库开发者，帮助他们完成迁移。

如果你是**库开发者**，[欢迎你在新架构工作组中发布更新](https://github.com/reactwg/react-native-new-architecture/discussions/categories/libraries)，说明你的库的**迁移状态**。这不仅能吸引早期采用者，也帮助我们了解是否存在阻碍迁移的问题。

如果你是**库使用者**，可以[在这里留言](https://github.com/reactwg/react-native-new-architecture/discussions/6)请求某个库的迁移。如果我们发现某个库成为了多个用户的阻碍，我们会尝试联系维护者，了解为何尚未完成迁移。

最后，我们要特别感谢 Software Mansion 发布了支持两种架构版本的 [`react-native-screens`](https://github.com/software-mansion/react-native-screens) 新版本。此外，他们还发布了一篇博客文章([为 react-native-screens 引入 Fabric](https://blog.swmansion.com/introducing-fabric-to-react-native-screens-fd17bf18858e))，分享了他们的迁移经历。希望这篇分享能为你的迁移提供启发和帮助。

### 版本发布

0.68 预发布版本推动了[去年下半年我们定义的发布流程改进](/blog/2022/01/19/version-067#improvements-to-release-process)的落实。

我们很高兴地分享，0.68 版本实现了：

- 成功将发布工作引入了内部轮值机制。大量依赖于[更完善的发布流程文档](/contributing/overview)，能够减少“关键人物依赖”问题，降低风险。
- 启动了与合作伙伴的讨论，支持[Copilot 轮值](https://github.com/reactwg/react-native-releases/blob/main/docs/roles-and-responsibilities.md)。我们希望此举提升流程透明度，也告知合作伙伴在哪里投入资源以支持 React Native 及其生态系统。
- [吸纳了多位社区的发布支持者和测试者](https://github.com/reactwg/react-native-releases/discussions/11)。半年多前我们呼吁社区帮忙，很多朋友积极响应！测试者和支持者的反馈帮助我们修复了关键 Bug 和回归问题，特别是围绕新架构，为即将发布的版本做好准备。谢谢所有报名并测试发布的朋友！

随着 React Native 0.69 的发布，我们将继续完善该流程，理想情况下让合作伙伴在更早阶段发出发布信号，并引入更多协助人员。正如以往，[欢迎任何反馈](https://github.com/reactwg/react-native-releases/discussions)。如果你想成为发布测试者或支持者，[请在此报名](https://forms.gle/fPuPE1MZRDGWNqpd6)。

### 向 Hermes 作为默认引擎迈进

新架构推广的关键点之一是：采用新的 JavaScript 引擎 —— **Hermes**。

基于新架构，我们将**把 Hermes 设为默认引擎**，所有新文档和模版都会启用 Hermes。

请注意，我们会继续与社区合作，确保**其它引擎**如 JSC（JavaScript Core）**依然受支持**。你仍可选择使用你喜爱的引擎，但需要**显式关闭 Hermes**。

为了提升 Hermes 的稳定性，我们正努力改变 Hermes 的**发行模式**。具体来说，希望使 Hermes 的发布流程**更贴近** React Native 的发布流程。

这样可以让我们发布一个包含**完全兼容**的内嵌 JS 引擎的 React Native 版本。你无需再面对难以调试和理解的运行时崩溃和 Hermes 兼容性问题。

此外，这也会**缩短** Hermes 改进和 Bug 修复的周期，使我们更**快速响应** React Native 用户需求。

未来几个月我们会持续分享更多相关内容。与此同时，欢迎在工作组中[加入该话题讨论](https://github.com/reactwg/react-native-new-architecture/discussions/4)。

如果你还没用过 Hermes，现在正是尝试的好时机。遇到任何问题或阻碍，请务必反馈。

至此，内容结束。

感谢 Andrei、Aleksandar、Dmitry、Eli、Luna、Héctor 和 Neil 审阅本文并为相关工作提供宝贵贡献。

期待**阅读你们的迁移故事**。