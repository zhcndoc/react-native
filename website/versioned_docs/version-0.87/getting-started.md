---
id: environment-setup
title: 开始使用 React Native
hide_table_of_contents: true
---

import PlatformSupport from '@site/src/theme/PlatformSupport';
import BoxLink from '@site/src/theme/BoxLink';

**React Native 让熟悉 React 的开发者能够创建原生应用。**与此同时，原生开发者可以使用 React Native，通过只编写一次通用功能，在原生平台之间实现一致性。

我们相信，体验 React Native 的最佳方式是使用**框架**，这是一个包含所有必要 API 的工具箱，可让你构建可用于生产环境的应用。

你也可以在不使用框架的情况下使用 React Native，不过我们发现，大多数开发者都能从使用 React Native 框架（如 [Expo](https://expo.dev)）中受益。Expo 提供了基于文件的路由、高质量的通用库，以及编写插件来修改原生代码而无需管理原生文件等功能。

<details>
<summary>我可以在不使用框架的情况下使用 React Native 吗？</summary>

可以。你可以在不使用框架的情况下使用 React Native。**不过，如果你要使用 React Native 构建新应用，我们建议使用框架。**

简而言之，除了编写应用之外，你还可以把时间花在编写应用本身，而不是自己编写一个完整的框架。

React Native 社区花费了多年时间来完善导航、访问原生 API、处理原生依赖等方面的方案。大多数应用都需要这些核心功能。React Native 框架会从应用开发之初就提供这些功能。

如果不使用框架，你要么必须编写自己的解决方案来实现核心功能，要么必须将一组现有库拼凑起来，创建一个框架的骨架。这需要投入实际的工作，无论是在开始开发应用时，还是在之后维护应用时都是如此。

如果你的应用存在框架无法很好满足的特殊限制，或者你更愿意自行解决这些问题，那么你可以使用 Android Studio、Xcode 在不使用框架的情况下创建 React Native 应用。如果你对这条路径感兴趣，请了解如何[设置环境](set-up-your-environment)，以及如何[在不使用框架的情况下开始使用](getting-started-without-a-framework)。

</details>

## 使用 Expo 开始新的 React Native 项目

<PlatformSupport platforms={['android', 'ios', 'tv', 'web']} />

Expo 是一个可用于生产环境的 React Native 框架。Expo 提供了让应用开发更加轻松的开发者工具，例如基于文件的路由、原生模块标准库等诸多功能。

Expo 框架免费且开源，在 [GitHub](https://github.com/expo) 和 [Discord](https://chat.expo.dev) 上拥有活跃的社区。Expo 团队与 Meta 的 React Native 团队密切合作，将最新的 React Native 功能带到 Expo SDK 中。

Expo 团队还提供 Expo Application Services（EAS），这是一组可选服务，在开发过程的每个步骤中为 Expo 这一框架提供补充支持。

要创建新的 Expo 项目，请在终端中运行以下命令：

```shell
npx create-expo-app@latest
```

创建应用后，请查看 Expo 其余的入门指南，开始开发你的应用。

<BoxLink href="https://docs.expo.dev/get-started/set-up-your-environment">继续使用 Expo</BoxLink>
