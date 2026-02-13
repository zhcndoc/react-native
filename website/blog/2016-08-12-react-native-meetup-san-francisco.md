---
title: 旧金山聚会回顾
authors: [hectorramos]
hero: '/blog/img/rnmsf-august-2016-hero.jpg'
tags: [events]
---

上周我有机会参加了在 Zynga 旧金山办公室举办的 [React Native Meetup](https://www.meetup.com/React-Native-San-Francisco/photos/27168649/#452793854)。大约有200人出席，这里是个结识我附近同样对 React Native 感兴趣的开发者的绝佳场所。

![](/blog/assets/rnmsf-august-2016-hero.jpg)

我尤其感兴趣的是了解像 Zynga、Netflix 和 Airbnb 这样的公司是如何使用 React 和 React Native 的。当晚的议程如下：

- React 中的快速原型开发
- 为 React Native 设计 API
- 弥合鸿沟：在现有代码库中使用 React Native

但首先，活动以快速介绍和近期新闻回顾开始：

- 你知道吗，React Native 现已成为 [GitHub 上排名第一的 Java 仓库](https://twitter.com/jamespearce/status/759637111880359937)？
- [rnpm](https://github.com/rnpm/rnpm) 现已成为 React Native 核心的一部分！你现在可以用 `react-native link` 替代 `rnpm link` 来[安装带有原生依赖的库](/docs/linking-libraries-ios)。
- React Native Meetup 社区正在快速增长！目前全球各地的 React Native Meetup 组已有超过4,800名开发者。

如果你附近有[这样的聚会](https://www.meetup.com/find/?allMeetups=false&keywords=react+native&radius=Infinity&userFreeform=San+Francisco%2C+CA&mcId=z94105&mcName=San+Francisco%2C+CA&sort=recommended&eventFilter=mysugg)，我强烈推荐你参加！

## Zynga 的 React 快速原型开发

第一轮新闻之后，Zynga——我们当晚的主办方——做了简短介绍。Abhishek Chadha 讲述了他们如何使用 React 快速原型开发移动新体验，演示了类似 Draw Something 的快速原型应用。他们采用了与 React Native 类似的方式，通过桥接访问原生 API。当 Abhishek 用设备摄像头拍摄了观众照片后，还在一个人的头上画了顶帽子，演示效果十分生动。

## Netflix 的 React Native API 设计

接下来，是当晚的第一个主题演讲。Netflix 的高级软件工程师 [Clarence Leung](https://twitter.com/clarler) 带来关于为 React Native 设计 API 的分享。首先他指出可能开发的两类库：一类是组件，如标签栏和日期选择器，另一类是提供访问原生服务的库，如相册或应用内支付。构建 React Native 库时可以有两种设计思路：

- 提供平台特定的组件
- 提供跨平台、为 Android 和 iOS 设计相似 API 的库

每种方法都有其考虑点，需按需选择最合适的方案。

**方案一**

以平台特定组件为例，Clarence 提到 React Native 核心的 DatePickerIOS 和 DatePickerAndroid。iOS 上日期选择器作为 UI 一部分渲染，可轻松嵌入现有视图；而 Android 上是以模态呈现，因此分别提供组件是合理的。

**方案二**

相反，相册选择器在 Android 和 iOS 上的表现较为相似。虽然有些小差异——比如 Android 不像 iOS 那样将照片分组（如自拍）——这些均可用 `if` 语句和 `Platform` 组件轻松处理。

无论选择哪种方式，建议尽量缩减 API 设计范围，构建针对应用的专用库。例如，iOS 的应用内购买支持一次性消耗和可续订订阅。如果应用仅需支持消耗型购买，可以剔除跨平台库中的订阅支持。

![](/blog/assets/rnmsf-august-2016-netflix.jpg)

Clarence 演讲结束后有简短问答环节。一个有趣的点是，Netflix 这些库中写的 React Native 代码约有80%能在 Android 和 iOS 上共享。

## 弥合鸿沟：在现有代码库中使用 React Native

当晚最后一场演讲由 Airbnb 的 [Leland Richardson](https://twitter.com/intelligibabble) 带来，主题聚焦在如何在已有代码库中使用 React Native。我很熟悉从零开始用 React Native 编写新应用的便利，非常期待听听 Airbnb 在现有原生应用中采用 React Native 的经验。

Leland 先介绍了“绿地”（Greenfield）与“棕地”（Brownfield）应用。绿地指不考虑任何既有工作的新项目，而棕地则要考虑已有项目的需求、开发流程和团队各种要求。

对于绿地应用，React Native CLI 会为 Android 和 iOS 建立单一仓库，一切运作顺畅。但 Airbnb 面临的首要挑战是 Android 和 iOS 各自拥有独立仓库。多仓库结构的公司在采用 React Native 之前需克服一定障碍。

为此，Airbnb 首先为 React Native 代码库建立了新仓库。他们用 CI 服务器将 Android 和 iOS 仓库镜像到这个新仓库。测试运行并打包后，构建产物同步回原仓库。这样移动端工程师可以在不改变开发环境的情况下开发原生代码，无需安装 npm、运行打包器或记得构建 JavaScript 包。负责编写 React Native 代码的工程师直接在 React Native 仓库工作，无需担心代码同步问题。

不过，这也带来一些弊端，主要是无法发布原子更新。需要同时修改原生和 JavaScript 代码的改动需提交三份独立 PR，且必须小心合并。为避免冲突，若主分支自构建开始后有变动，CI 会阻止变动同步回 Android 和 iOS 仓库，导致高频提交时延迟增加（如新版本发布期间）。

Airbnb 后来转向了单体仓库（mono repo）方式。幸运的是，这已有所考虑，且 Android 和 iOS 团队适应 React Native 后乐于加快合并进程。

这解决了采用多仓库方案时的大多数问题。Leland 提到，这会增加版本控制服务器负担，可能对小型公司造成困扰。

![](/blog/assets/rnmsf-august-2016-airbnb.jpg)

### 导航问题

演讲下半场集中讨论一个我非常关心的话题：React Native 中的导航问题。Leland 介绍了丰富的导航库资源，包括官方和第三方。NavigationExperimental 曾被认为是有潜力的，但实际用起来不适合他们的场景。

事实上，现有导航库很难满足棕地应用需求。棕地应用要求导航状态完全由原生应用掌控。例如用户会话过期时，在呈现 React Native 视图期间，原生应用应能接管并根据需要展示登录界面。

Airbnb 也希望避免在过渡期间用 JavaScript 版本替换原生导航栏，因为会带来突兀感。最初他们限制为模态视图，这显然限制了 React Native 在其应用中的广泛采用。

因此他们决定开发自有导航库：`airbnb-navigation`。目前尚未开源，因为紧耦合 Airbnb 代码库，但计划年底前发布。

我不会详细介绍其 API，以下是主要要点：

- 必须预先注册场景
- 每个场景都在独立的 `RCTRootView` 中显示，在各平台以原生方式呈现（如 iOS 通过 `UINavigationController`）
- 场景中的主 `ScrollView` 应包装在 `ScrollScene` 组件内，这样可以利用原生行为，如 iOS 点击状态栏自动滚动到顶部
- 场景切换由原生处理，无需担心性能
- Android 返回键自动支持
- 可以通过 Navigator.Config UI-less 组件利用基于视图控制器的导航栏样式

同时也需注意：

- 导航栏为原生组件，不易在 JavaScript 端自定义，这是设计所需，因该库硬性规定必须使用原生导航栏
- 传递给场景的 ScreenProps 需进行序列化/反序列化，传输大量数据时需谨慎
- 导航状态由原生应用持有（库的硬性需求），因此 Redux 等不能直接操作导航状态

Leland 演讲后也进行了问答环节。总的来说，Airbnb 对 React Native 很满意。他们对使用 Code Push 来修复问题、绕过 App Store 流程感兴趣，且工程师非常喜欢 Live Reload，因为不必每次小改都等待原生应用重建。

## 结语

活动最后分享了更多 React Native 新闻：

- Deco 宣布了他们的 [React Native Showcase](https://www.decosoftware.com/showcase)，并邀请大家将自己的应用加入列表
- 最近的 [文档大改版](/blog/2016/07/06/toward-better-documentation) 受到赞誉！
- Deco IDE 联合创始人 Devin Abbott 将开设入门级 [React Native 课程](https://www.decosoftware.com/course)

![](/blog/assets/rnmsf-august-2016-docs.jpg)

聚会是与社区其他开发者交流学习的好机会。我期待未来参加更多 React Native 聚会。如果你也参加了，请认出我，并告诉我怎样才能让 React Native 更好地为你服务！