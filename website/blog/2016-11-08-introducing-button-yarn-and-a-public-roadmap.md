---
title: 介绍 Button、更快的 Yarn 安装以及公开路线图
authors: [hectorramos]
tags: [announcement]
---

我们听到很多人反映，React Native 的工作内容非常多，跟踪进展可能会很困难。为了帮助大家了解正在进行的工作，我们现在发布了 [React Native 路线图](https://github.com/facebook/react-native/wiki/Roadmap)。大致来说，相关工作可以分为三个优先重点：

- **核心库**。为最有用的组件和 API 添加更多功能。
- **稳定性**。改进底层架构，减少 bug 并提升代码质量。
- **开发者体验**。帮助 React Native 开发者能够更快开发。

如果你有觉得有价值的新功能建议，欢迎访问 [Canny](https://react-native.canny.io/feature-requests)，在这里你可以建议新功能并讨论已有提案。

## React Native 的新内容

今天发布的 [React Native 0.37 版本](https://github.com/facebook/react-native/releases/tag/v0.37.0) 引入了一个新的核心组件，让在任何应用中添加一个可点击按钮变得非常简单。我们还引入了对新包管理工具 [Yarn](https://yarnpkg.com/) 的支持，这将加速更新应用依赖的整个过程。

## 介绍 Button 组件

今天我们推出了一个基础的 `<Button />` 组件，在所有平台上都拥有良好的展示效果。这个新组件解决了我们收到的最常见反馈之一：React Native 是少数没有开箱即用按钮的移动开发工具之一。

![简单按钮在 Android 和 iOS 上的效果](/blog/assets/button-android-ios.png)

```jsx
<Button
  onPress={onPressMe}
  title="Press Me"
  accessibilityLabel="Learn more about this Simple Button"
/>
```

有经验的 React Native 开发者知道如何制作按钮：在 iOS 上用 TouchableOpacity 实现默认样式，在 Android 上用 TouchableNativeFeedback 实现水波纹效果，然后加上一些样式。自定义按钮的制作和安装并不特别难，但我们的目标是使 React Native 极其易学。将基础按钮加入核心组件后，初学者可以在第一天就开发出很棒的东西，而不必花时间格式化按钮或学习 Touchable 的细节。

Button 组件旨在在各个平台上都表现良好且原生化，但不会支持所有自定义按钮的复杂功能。这是一个很好的起点，但并不意味着要替代你已有的所有按钮。想了解更多，请查看带有可运行示例的 [Button 新文档](/docs/button)！

## 使用 Yarn 加快 `react-native init`

你现在可以使用新 JavaScript 包管理器 [Yarn](https://yarnpkg.com/) 来显著加快 `react-native init` 的速度。想体验提升，请 [安装 yarn](https://yarnpkg.com/en/docs/install) 并将 `react-native-cli` 升级到 1.2.0：

```sh
$ npm install -g react-native-cli
```

设置新应用时，你应该可以看到 “Using yarn” ：

![使用 yarn](/blog/assets/yarn-rncli.png)

简单的本地测试中，`react-native init` 在良好的网络环境下**大约耗时 1 分钟**（而使用 npm 3.10.8 时大约需要 3 分钟）。安装 yarn 是可选的，但强烈推荐。

## 感谢！

感谢所有为本次发布做出贡献的人。完整的 [发布说明](https://github.com/facebook/react-native/releases/tag/v0.37.0) 已在 GitHub 上公开。拥有 24 个以上的 bug 修复和新功能，React Native 在大家的共同努力下持续变得更好。