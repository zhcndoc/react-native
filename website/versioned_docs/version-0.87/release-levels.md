---
id: release-levels
title: 发布级别
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 提供了让社区采用单个新功能的能力，只要这些功能的设计和实现已基本完成，即使它们尚未包含在稳定版本中。这种方式称为**发布级别**。

你可以配置 React Native 的发布级别，使你的 React Native 实例初始化时，将 Feature Flags 设置为 `EXPERIMENTAL`、`CANARY` 或 `STABLE` 模式。

:::note
这种方式与 [React 中的 Canary 和 Experimental 发布版本](https://react.dev/blog/2023/05/03/react-canaries)类似，但有一个关键区别：无论发布级别如何，使用的都是相同版本的 React JS 和 React Native 代码。  
React Native 也没有使用 `@canary` 或 `@experimental` NPM 标签，因为发布级别同时适用于 React Native 的稳定版本和 nightly 版本
:::

此外，由于 react-native 使用 React 版本的方式，将发布级别设置为 `EXPERIMENTAL` 或 `CANARY` **不会**导致使用 `react@nightly` 或 `react@canary`（[你可以在这里阅读更多相关信息](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/README.md#react--react-native-versions)）。

## 何时使用各个发布级别

- **`STABLE`**：
  - 用于所有生产应用，以及不需要提前访问未发布功能的库
  - 这是稳定版本和 nightly 版本的默认级别
- **`CANARY`**：
  - 如果你是框架作者、高级应用开发者，或者需要在新功能正式稳定发布之前测试或采用这些功能，请使用此级别
  - 不建议用于生产应用或面向用户的应用
- **`EXPERIMENTAL`**：
  - 仅用于测试新功能早期开发阶段的表现并提供反馈
  - 不建议用于生产应用或面向用户的应用

## 如何使用 Canary 和 Experimental 初始化 React Native

### Android

`DefaultNewArchitectureEntryPoint` 类现在具有 `releaseLevel` 属性（默认值：`STABLE`）。  
功能标志系统使用此属性，为所选发布级别选择相应的功能标志集合。

```kotlin title="Example usage"
DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.CANARY
DefaultNewArchitectureEntryPoint.load()
```

构建系统会为每个发布级别生成不同的功能标志覆盖类，确保为每个阶段启用正确的功能。

### iOS

`RCTReactNativeFactory` 类现在具有一个接受 `releaseLevel` 参数的初始化器。功能标志设置使用此参数来选择正确的功能标志覆盖项。

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

系统确保每个应用实例中只有一个发布级别处于活动状态，如果使用不同发布级别创建多个工厂，则应用会崩溃。
