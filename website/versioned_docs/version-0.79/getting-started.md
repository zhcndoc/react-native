---
id: environment-setup
title: 开始使用 React Native
hide_table_of_contents: true
---

import PlatformSupport from '@site/src/theme/PlatformSupport';
import BoxLink from '@site/src/theme/BoxLink';

**React Native 允许熟悉 React 的开发者创建原生应用。** 同时，原生开发者可以使用 React Native 通过编写一次通用功能来实现原生平台之间的一致性。

我们相信，体验 React Native 的最佳方式是通过 **框架**，这是一个包含所有必要 API 的工具箱，让您能够构建生产就绪的应用。

您也可以在不使用框架的情况下使用 React Native，但我们发现大多数开发者受益于使用像 [Expo](https://expo.dev) 这样的 React Native 框架。Expo 提供了基于文件的路由、高质量的通用库以及编写插件修改原生代码而无需管理原生文件等功能。

<details>
<summary>我可以不使用框架而使用 React Native 吗？</summary>

可以。您可以不使用框架而使用 React Native。**但是，如果您正在使用 React Native 构建新应用，我们建议使用框架。**

简而言之，您将能够花时间编写您的应用，而不是除了应用之外还要自己编写整个框架。

React Native 社区花费了数年时间完善导航、访问原生 API、处理原生依赖等方法。大多数应用都需要这些核心功能。React Native 框架从您应用开始就提供了它们。

如果没有框架，您要么必须编写自己的解决方案来实现核心功能，要么必须拼凑一组现有的库来创建框架的骨架。无论是在启动应用时，还是在后来维护它时，这都需要付出切实的努力。

如果您的应用有不寻常的限制，框架无法很好地满足，或者您更喜欢自己解决这些问题，您可以使用 Android Studio、Xcode 在不使用框架的情况下制作 React Native 应用。如果您对此路径感兴趣，了解如何 [设置您的环境](set-up-your-environment) 以及如何 [不使用框架开始](getting-started-without-a-framework)。

</details>

## 使用 Expo 启动新的 React Native 项目

<PlatformSupport platforms={['android', 'ios', 'tv', 'web']} />

Expo 是一个生产级的 React Native 框架。Expo 提供了使应用开发更容易的开发者工具，例如基于文件的路由、原生模块的标准库等等。

Expo 的框架是免费且开源的，在 [GitHub](https://github.com/expo) 和 [Discord](https://chat.expo.dev) 上拥有活跃的社区。Expo 团队与 Meta 的 React Native 团队紧密合作，将最新的 React Native 功能带入 Expo SDK。

Expo 团队还提供 Expo Application Services (EAS)，这是一组可选服务，在开发过程的每一步补充 Expo 框架。

要创建新的 Expo 项目，请在终端中运行以下命令：

```shell
npx create-expo-app@latest
```

创建应用后，查看 Expo 入门指南的其余部分以开始开发您的应用。

<BoxLink href="https://docs.expo.dev/get-started/set-up-your-environment">继续使用 Expo</BoxLink>
