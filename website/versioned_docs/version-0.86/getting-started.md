---
id: environment-setup
title: 开始使用 React Native
hide_table_of_contents: true
---

import PlatformSupport from '@site/src/theme/PlatformSupport';
import BoxLink from '@site/src/theme/BoxLink';

**React Native 允许熟悉 React 的开发者创建原生应用。** 同时，原生开发者可以使用 React Native 通过一次编写通用功能来在各个平台之间获得一致性。

我们认为，体验 React Native 的最佳方式是通过一个 **框架**，也就是一个包含所有必要 API 的工具箱，帮助你构建可投入生产的应用。

你也可以不使用框架来使用 React Native，不过我们发现，大多数开发者会从使用像 [Expo](https://expo.dev) 这样的 React Native 框架中受益。Expo 提供了诸如基于文件的路由、高质量的通用库，以及无需管理原生文件就能编写修改原生代码插件的能力等功能。

<details>
<summary>我可以在不使用框架的情况下使用 React Native 吗？</summary>

可以。你可以不使用框架来使用 React Native。**不过，如果你正在用 React Native 构建一个新应用，我们建议使用框架。**

简而言之，你将能够把时间花在编写应用上，而不是在编写应用的同时还要自己编写整个框架。

React Native 社区多年来一直在完善导航、访问原生 API、处理原生依赖等方面的方案。大多数应用都需要这些核心功能。React Native 框架会在你的应用一开始就提供这些功能。

如果没有框架，你要么必须自己编写实现核心功能的解决方案，要么必须把一组现有库拼凑起来，创建一个框架的骨架。这都需要真正的工作量，无论是在启动应用时，还是之后维护它时。

如果你的应用有一些不适合框架的特殊约束，或者你更喜欢自己解决这些问题，你可以使用 Android Studio、Xcode 在不使用框架的情况下创建 React Native 应用。如果你对这条路径感兴趣，请了解如何[设置你的环境](set-up-your-environment)以及如何[在不使用框架的情况下开始](getting-started-without-a-framework)。

</details>

## 使用 Expo 启动一个新的 React Native 项目

<PlatformSupport platforms={['android', 'ios', 'tv', 'web']} />

Expo 是一个生产级的 React Native 框架。Expo 提供开发者工具，让应用开发更轻松，例如基于文件的路由、原生模块标准库，以及更多功能。

Expo 的框架是免费且开源的，在 [GitHub](https://github.com/expo) 和 [Discord](https://chat.expo.dev) 上拥有活跃的社区。Expo 团队与 Meta 的 React Native 团队紧密合作，将最新的 React Native 功能带入 Expo SDK。

Expo 团队还提供 Expo Application Services（EAS），这是一组可选服务，在开发流程的每个步骤中为 Expo 这个框架提供补充。

要创建一个新的 Expo 项目，请在终端中运行以下命令：

```shell
npx create-expo-app@latest
```

当你创建好应用后，可以查看 Expo 入门指南的其余部分，开始开发你的应用。

<BoxLink href="https://docs.expo.dev/get-started/set-up-your-environment">继续使用 Expo</BoxLink>
