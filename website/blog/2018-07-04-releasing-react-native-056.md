---
title: 发布 0.56 版本
author: Lorenzo Sciandra
authorTitle: Drivetribe 核心维护者 & React Native 开发者
authorURL: 'https://github.com/kelset'
authorImageURL: 'https://avatars2.githubusercontent.com/u/16104054?s=460&v=4'
authorTwitter: kelset
tags: [公告, 发布]
---

备受期待的 React Native 0.56 版本现已发布 🎉。这篇博客文章重点介绍了该新版本中的一些[变更](https://github.com/react-native-community/react-native-releases/blob/master/CHANGELOG.md#highlights)。我们也想借此机会说明自三月以来一直让我们忙碌的工作内容。

### 重大变更的两难，或者说，“何时发布？”

[贡献者指南](https://github.com/facebook/react-native/blob/master/CONTRIBUTING.md)解释了所有 React Native 变更需要经过的集成流程。该项目由[许多不同的工具](https://github.com/facebook/react-native-website/issues/370)组成，需协调和持续支持以保持一切正常运行。加上充满活力的开源社区对项目的贡献，你就可以感受到这一切规模令人头晕目眩。

随着 React Native 的广泛采用，重大破坏性变更必须非常谨慎地进行，过程并不像我们期望的那样顺畅。我们决定跳过四月和五月的发布版本，让核心团队整合和测试一套新的破坏性变更。整个过程中我们使用了[专门的社区沟通](https://github.com/react-native-community/react-native-releases/issues/14)渠道，确保 2018 年 6 月的（`0.56.0`）发布尽量让那些耐心等待稳定版本的用户能毫无困难地采用。

`0.56.0` 完美吗？不会，和任何软件一样，但我们已经达到了“等待更稳定”与“测试得到成功结果，准备推动发布”之间的权衡点，我们觉得可以发布了。此外，我们也知道在最终的 `0.56.0` 版本中存在一些尚未解决的问题，例如[这个](https://github.com/facebook/react-native/issues/19955)、[这个](https://github.com/facebook/react-native/issues/19827)、[这个](https://github.com/facebook/react-native/issues/19763)、[还有这个](https://github.com/facebook/react-native/issues/19859)。大多数开发者升级到 `0.56.0` 不会有问题。对于那些因上述问题受阻的开发者，我们希望在讨论中见到你们，也期待和你们一起解决这些问题。

你可以将 `0.56.0` 看作向更稳定框架迈出的坚实基石：可能需要一两周的广泛采用来消除所有边缘情况，但这将促成 2018 年 7 月（`0.57.0`）版本的更好表现。

最后，我们要感谢[67 位贡献者在共计 818 次提交](https://github.com/facebook/react-native/compare/v0.55.4...v0.56.0-rc.4)中付出的努力，他们让你的应用变得更好 👏。

那么，话不多说……

## 重大变更

### Babel 7

你们可能知道，使我们能够使用最新最强大 JavaScript 特性的转译工具 Babel 即将发布其[7 版本](https://babeljs.io/blog/2017/12/27/nearing-the-7.0-release)。由于这个新版本带来了一些重要变化，我们觉得现在是升级的好时机，这也让 [Metro](https://github.com/facebook/metro) 能够[利用其改进](https://github.com/facebook/metro/issues/92)。

如果在升级过程中遇到麻烦，请参考[相关文档部分](https://new.babeljs.io/docs/en/next/v7-migration.html)。

### Android 支持现代化

在 Android 方面，周边工具链发生了诸多变化。我们更新到了 [Gradle 3.5](https://github.com/facebook/react-native/commit/699e5eebe807d1ced660d2d2f39b5679d26925da)、[Android SDK 26](https://github.com/facebook/react-native/commit/065c5b6590de18281a8c592a04240751c655c03c)、[Fresco 1.9.0 和 OkHttp 3.10.0](https://github.com/facebook/react-native/commit/6b07602915157f54c39adbf0f9746ac056ad2d13)，甚至将[NDK API 目标升级到了 API 16](https://github.com/facebook/react-native/commit/5ae97990418db613cd67b1fb9070ece976d17dc7)。这些变更应该不会带来问题，还能加快构建速度。更重要的是，这有助于开发者遵守 [下个月开始生效的 Play 商店新要求](https://android-developers.googleblog.com/2017/12/improving-app-security-and-performance.html)。

在此，我们特别感谢 [Dulmandakh](https://github.com/dulmandakh) 提交的许多 PR ，使这一切成为可能 👏。

未来我们还将继续推进相关措施，大家可以在[专门的 issue](https://github.com/facebook/react-native/issues/19297)中关注 Android 支持的更新规划与讨论（以及一个针对 [JSC 的子话题](https://github.com/facebook/react-native/issues/19737)）。

### 新版 Node、Xcode、React 和 Flow

Node 8 现在是 React Native 的标准版本。虽然我们其实已经开始测试了，但随着 Node 6 进入维护模式，我们现在正式全面采用 Node 8。React 也升级到了 16.4，带来了大量修复。

我们放弃了对 iOS 8 的支持，[使 iOS 9 成为可支持的最低版本](https://github.com/facebook/react-native/commit/f50df4f5eca4b4324ff18a49dcf8be3694482b51)。我们认为这不会成为问题，因为任何能运行 iOS 8 的设备都可以升级至 iOS 9。此举让我们得以移除为运行 iOS 8 的旧设备编写的鲜少使用的兼容代码。

持续集成工具链已升级为[使用 Xcode 9.4](https://github.com/facebook/react-native/commit/c55bcd6ea729cdf57fc14a5478b7c2e3f6b2a94d)，确保所有 iOS 测试都在 Apple 提供的最新开发工具上运行。

我们已升级到 [Flow 0.75](https://github.com/facebook/react-native/commit/6264b6932a08e1cefd83c4536ff7839d91938730)，采用了很多开发者青睐的[新错误格式](https://twitter.com/dan_abramov/status/998610821096857602)。同时，我们为更多组件创建了类型定义。如果你的项目尚未强制使用静态类型，请考虑使用 Flow 来在编码过程中而非运行时发现问题。

### 以及许多其他内容……

例如，YellowBox 已被[替换](https://github.com/facebook/react-native/commit/d0219a0301e59e8b0ef75dbd786318d4b4619f4c)，提供了更佳的调试体验。

完整发布日志请参考[完整变更记录](https://github.com/react-native-community/react-native-releases/blob/master/CHANGELOG.md)。升级时请务必关注[升级指南](/docs/upgrading)，避免迁移到此版本时出现问题。

---

最后说明：从本周开始，React Native 核心团队将恢复举办月度会议。我们会确保及时向大家通报会议内容，并将你的反馈纳入后续会议讨论。

祝大家编码愉快！

[Lorenzo](https://twitter.com/Kelset), [Ryan](https://github.com/turnrye) 及整个 [React Native 核心团队](https://twitter.com/reactnative)

**附注：**和往常一样，请大家注意 React Native 仍处于 0.x 版本，因仍有许多变更进行中——升级时请保持警惕，可能仍会遇到崩溃或故障。提交问题和 PR 时请相互帮助，遵守[行为准则](https://code.fb.com/codeofconduct/)，屏幕那头总有真实的人。