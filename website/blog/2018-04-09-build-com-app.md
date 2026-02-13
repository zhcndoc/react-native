---
title: 使用 React Native 构建 - Build.com 应用
author: Garrett McCullough
authorTitle: 高级移动工程师
authorURL: 'https://twitter.com/gwmccull'
authorImageURL: 'https://pbs.twimg.com/profile_images/955503100785172486/UrMKkQXc_400x400.jpg'
authorTwitter: gwmccull
tags: [展示]
---

[Build.com](https://www.build.com/)，总部位于加利福尼亚州奇科，是最大的家居改进商品在线零售商之一。团队已经拥有 18 年以网络为中心的业务，并于 2015 年开始考虑开发移动应用。由于团队规模不大且原生开发经验有限，构建独特的 Android 和 iOS 应用并不实际。相反，我们决定冒险采用全新的 React Native 框架。我们的首次提交是在2015年8月12日，使用 React Native v0.8.0！我们于2016年10月15日在两个应用商店上线。在过去两年中，我们持续升级和扩展应用程序。目前使用的 React Native 版本是 0.53.0。

您可以访问 [https://www.build.com/app](https://www.build.com/app) 来查看该应用。

<p align="center">
  <img src="/blog/assets/build-com-blog-image.jpg" />
</p>

## 功能

我们的应用功能完善，包含您对电商应用的所有期望：产品列表、搜索与排序、复杂产品配置功能、收藏等。我们支持标准信用卡付款方式，同时也支持 PayPal，以及为 iOS 用户提供 Apple Pay。

一些您可能没想到的特色功能包括：

1. 大约 40 个产品配备了 90 种饰面效果的 3D 模型
2. 增强现实 (AR) 功能，允许用户以98%的尺寸精度预览灯具和水龙头在家中的效果。Build.com React Native 应用被苹果 App Store 评为 AR 购物特色应用！AR 现已支持 Android 和 iOS！
3. 协作项目管理功能，允许多人为不同阶段的项目制定购物清单并协作选择

我们正在开发许多新颖且令人兴奋的功能，持续提升应用体验，包括下一阶段的沉浸式 AR 购物。

## 我们的开发流程

Build.com 允许每位开发者选择最适合自己的工具。

- IDE 包括 Atom、IntelliJ、VS Code、Sublime、Eclipse 等。
- 单元测试方面，开发者负责为新组件创建 Jest 单元测试，并利用 `jest-coverage-ratchet` 逐步提升旧组件的测试覆盖率。
- 我们使用 Jenkins 构建 beta 版本和发布候选版本。该流程运作良好，但仍需大量工作来创建发布说明和其他相关文档。
- 集成测试包括一个跨桌面、移动和网页的共享测试人员池。我们的自动化工程师利用 Java 和 Appium 构建自动化集成测试套件。
- 工作流程中还包含详细的 eslint 配置、自定义规则以强制执行测试所需属性，以及阻止有问题代码提交的 pre-push 钩子。

## 应用中使用的库

Build.com 应用依赖多个常用开源库，包括：Redux、Moment、Numeral、Enzyme 及大量 React Native 桥接模块。我们还使用了一些分叉的开源库，这些库或因被弃用，或因我们需要定制功能而分叉。简单统计约有 115 个 JavaScript 和原生依赖。我们希望探索能移除未使用库的工具。

我们正着手通过 TypeScript 添加静态类型支持，并研究可选链功能。这些功能能帮助我们解决几类仍存在的错误：

- 类型错误的数据
- 由于对象不包含预期内容导致数据未定义

## 开源贡献

由于我们严重依赖开源，团队致力于回馈社区。Build.com 允许团队将自建库开源，并鼓励我们为所用库做贡献。

我们已经发布并维护了多款 React Native 库：

- `react-native-polyfill`
- `react-native-simple-store`
- `react-native-contact-picker`

我们也向许多库做出了贡献，包括：React 和 React Native、`react-native-schemes-manager`、`react-native-swipeable`、`react-native-gallery`、`react-native-view-transformer`、`react-native-navigation`。

## 我们的旅程

过去几年，我们见证了 React Native 及其生态的巨大成长。早期，每个 React Native 版本似乎都修复了一些 bug，却引入了更多问题。例如，Android 上的远程 JS 调试曾断裂数月。幸运的是，2017 年开始稳定性大为提升。

### 导航库

导航库一直是我们面临的大难题之一。很长一段时间内，我们使用 Expo 的 ex-nav 库。它运行良好，但最终被弃用。然而，当时我们正处于功能密集开发期，无暇替换导航库，因此不得不分叉该库并为支持 React 16 和 iPhone X 自行打补丁。最终，我们迁移到了 [`react-native-navigation`](https://github.com/wix/react-native-navigation)，希望它能持续获得支持。

### 桥接模块

桥接模块同样存在不小挑战。初期，很多关键桥接缺失。我的一位队友开发了 `react-native-contact-picker`，以便应用访问 Android 通讯录选择器。我们也遇见了许多因 React Native 变动而失效的桥接。例如 React Native v40 版本引入了破坏性变更，升级时我不得不提交 PR 修复 3 至 4 个尚未更新的库。

## 展望未来

随着 React Native 继续发展，我们对社区的期望包括：

- 稳定并改进导航库
- 维护 React Native 生态中的库支持
- 优化添加原生库及桥接模块的体验

React Native 社区中的公司及个人在改善我们共同使用的工具上做出了巨大努力。如果您还未参与开源，真诚邀请您考虑为您使用的库贡献代码或文档。网上有许多入门文章，过程可能比想象的简单许多！