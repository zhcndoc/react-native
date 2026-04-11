---
id: environment-setup
title: 开始使用 React Native
hide_table_of_contents: true
---

import PlatformSupport from '@site/src/theme/PlatformSupport';
import BoxLink from '@site/src/theme/BoxLink';

**React Native 允许熟悉 React 的开发者创建原生应用。** 同时，原生开发者也可以使用 React Native 通过编写一次通用功能，实现原生平台间的功能统一。

我们相信，体验 React Native 的最佳方式是通过一个 **框架**，一个拥有所有必要 API 的工具箱，让你能够构建生产就绪的应用。

你也可以不使用框架直接使用 React Native，不过我们发现大多数开发者使用像 [Expo](https://expo.dev) 这样的 React Native 框架会更受益。Expo 提供文件路由、高质量的通用库以及编写插件修改原生代码的能力，而无需管理原生文件。

<details>
<summary>我可以不用框架直接使用 React Native 吗？</summary>

可以。你可以不用框架直接使用 React Native。**但是，如果你正在用 React Native 构建一个新应用，我们推荐使用框架。**

简单来说，你能更多时间专注于写应用，而不是除了写应用还要花大量时间自己实现一个框架。

React Native 社区花了多年时间完善导航、访问原生 API、处理原生依赖等方案。大多数应用都需要这些核心功能。一个 React Native 框架能从应用一开始就为你提供这些功能。

没有框架的话，你要么自己写方案来实现这些核心功能，要么拼凑现有的库来搭建一个框架骨架。这需要大量工作，不仅在开始开发时如此，后续维护也是如此。

如果你的应用有些特殊限制，框架不能很好满足你的需求，或者你更喜欢自己解决这些问题，你可以用 Android Studio、Xcode 不依赖框架制作 React Native 应用。如果你对这条路径感兴趣，可以学习如何 [设置你的开发环境](set-up-your-environment) 以及如何 [开始无框架开发](getting-started-without-a-framework)。

</details>

## 使用 Expo 启动一个新的 React Native 项目

<PlatformSupport platforms={['android', 'ios', 'tv', 'web']} />

Expo 是一个生产级别的 React Native 框架。Expo 提供开发工具，让开发变得更轻松，比如文件路由、标准的原生模块库等功能。

Expo 的框架是免费且开源的，并在 [GitHub](https://github.com/expo) 和 [Discord](https://chat.expo.dev) 拥有活跃社区。Expo 团队与 Meta 的 React Native 团队紧密合作，将最新的 React Native 功能带入 Expo SDK。

Expo 团队还提供 Expo 应用服务（EAS），这是一个可选的服务集，补充了 Expo 框架在开发过程中各个步骤的能力。

要创建一个新的 Expo 项目，请在终端运行以下命令：

```shell
npx create-expo-app@latest
```

创建好应用后，可以查看 Expo 的后续入门指南，开始你的应用开发之旅。

<BoxLink href="https://docs.expo.dev/get-started/set-up-your-environment">继续使用 Expo</BoxLink>