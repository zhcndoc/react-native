---
id: release-levels
title: 发布级别
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 为社区提供了这样一种能力：即使某个新功能的设计和实现还未完全完成、甚至在稳定版发布之前，也可以尽快采用该功能。这种方式被称为 **发布级别**。

你可以配置 React Native 的发布级别，使你的 React Native 实例在初始化时将 Feature Flags 设置为 `EXPERIMENTAL`、`CANARY` 或 `STABLE` 模式。

:::note
这种方式类似于 [React 中的 Canary 和 Experimental 发布](https://react.dev/blog/2023/05/03/react-canaries)，但有一个关键区别：无论发布级别如何，使用的都是相同版本的 React JS 和 React Native 代码。  
React Native 也不会使用 `@canary` 或 `@experimental` 的 NPM 标签，因为发布级别同时适用于 React Native 的稳定版和 nightly 版本。
:::

此外，将发布级别设置为 `EXPERIMENTAL` 或 `CANARY` **不会** 导致消耗 `react@nightly` 或 `react@canary`，这是由于 react-native 消费 React 版本的方式所决定的（[你可以在这里阅读更多相关内容](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/README.md#react--react-native-versions)）。

## 何时使用各个发布级别

- **`STABLE`**：
  - 适用于所有生产应用和库，这些项目不需要提前访问尚未发布的功能。
  - 这是稳定版和 nightly 版本的默认级别。
- **`CANARY`:**
  - 如果你是框架作者、高级应用开发者，或者需要在新功能发布到稳定版之前进行测试或采用它们，请使用此级别。
  - 不建议用于生产环境或面向用户的应用。
- **`EXPERIMENTAL`:**
  - 仅用于测试早期开发阶段的新功能并提供反馈
  - 不建议用于生产环境或面向用户的应用。

## 如何使用 Canary 和 Experimental 初始化 React Native

### Android

`DefaultNewArchitectureEntryPoint` 类现在有一个 `releaseLevel` 属性（默认值：`STABLE`）。  
特性标志系统使用该属性来为所选发布级别选择合适的一组特性标志。

```kotlin title="示例用法"
DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.CANARY
DefaultNewArchitectureEntryPoint.load()
```

构建系统会为每个发布级别生成不同的特性标志覆盖类，确保在每个阶段启用正确的功能。

### iOS

`RCTReactNativeFactory` 类现在有一个接收 `releaseLevel` 参数的初始化器。特性标志设置会使用该参数来选择正确的特性标志覆盖。

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

```objc title="AppDelegate.mm"
[[RCTReactNativeFactory alloc] initWithDelegate:delegate releaseLevel:Canary];
```

</TabItem>
<TabItem value="swift">

```swift title="AppDelegate.swift"
let factory = RCTReactNativeFactory(delegate: delegate, releaseLevel: RCTReleaseLevel.Canary)
```

</TabItem>
</Tabs>

系统会确保每个应用实例只激活一个发布级别，如果创建了多个使用不同发布级别的 factory，则会崩溃。
