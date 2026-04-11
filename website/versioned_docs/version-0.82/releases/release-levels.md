---
id: release-levels
title: 发布级别
---

React Native 为社区提供了一种能力，可以在新功能的设计和实现接近完成时就开始采用单个新功能，即使它们尚未包含在稳定版本中。这种方法被称为 **发布级别**。

你可以配置 React Native 的发布级别，以便你的 React Native 实例将以设置为 `EXPERIMENTAL`、`CANARY` 或 `STABLE` 模式的功能标志进行初始化。

:::note
这种方法类似于 [React 中的 Canary 和 Experimental 发布](https://react.dev/blog/2023/05/03/react-canaries)，但有一个关键区别：无论发布级别如何，使用的都是相同版本的 React JS 和 React Native 代码。  
React Native 也不使用 `@canary` 或 `@experimental` NPM 标签，因为发布级别适用于 React Native 的稳定版和 nightly 版。
:::

此外，由于 react-native 消费 React 版本的方式，将发布级别设置为 `EXPERIMENTAL` 或 `CANARY` **不会** 导致消费 `react@nightly` 或 `react@canary`（[你可以在此阅读更多相关信息](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/README.md#react--react-native-versions)）。

## 何时使用每个发布级别

- **`STABLE`**：
  - 用于所有不需要早期访问未发布功能的生产应用程序和库。
  - 这是稳定版和 nightly 版的默认级别。
- **`CANARY`:**
  - 如果你是框架作者、高级应用程序开发者，或者需要在稳定版发布之前测试或采用新功能，请使用此级别。
  - 不推荐用于生产或面向用户的应用程序。
- **`EXPERIMENTAL`**：
  - 仅用于在早期开发阶段测试新功能并提供反馈
  - 不推荐用于生产或面向用户的应用程序。

## 如何使用 Canary 和 Experimental 初始化 React Native

### Android

`DefaultNewArchitectureEntryPoint` 类现在有一个 `releaseLevel` 属性（默认值：`STABLE`）。  
功能标志系统使用此属性为所选的发布级别选择适当的功能标志集。

```kotlin title="示例用法"
DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.CANARY
DefaultNewArchitectureEntryPoint.load()
```

构建系统为每个发布级别生成不同的功能标志覆盖类，确保每个阶段启用正确的功能。

### iOS

`RCTReactNativeFactory` 类现在有一个接受 `releaseLevel` 参数的初始化方法。功能标志设置使用此参数来选择正确的功能标志覆盖。

```objc title="示例用法"
[[RCTReactNativeFactory alloc] initWithDelegate:delegate releaseLevel:Canary];
```

系统确保每个应用程序实例只激活一个发布级别，如果使用不同的发布级别创建多个工厂，系统将崩溃。
