---
id: release-levels
title: 发布级别
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 允许社区在新功能设计和实现接近完成时，即使还未包含在稳定版本中，也能单独采用这些新功能。这种方式称为 **发布级别**。

你可以配置 React Native 的发布级别，使你的 React Native 实例初始化时将功能标记设置为 `EXPERIMENTAL`、`CANARY` 或 `STABLE` 模式。

:::note
这种方法类似于 [React 中的 Canary 和 Experimental 版本](https://react.dev/blog/2023/05/03/react-canaries)，但有一个关键区别：无论发布级别如何，使用的都是相同版本的 React JS 和 React Native 代码。  
此外，React Native 不使用 `@canary` 或 `@experimental` 这些 NPM 标签，因为发布级别适用于 React Native 的稳定版本和夜间版本。
:::

另外，将发布级别设置为 `EXPERIMENTAL` 或 `CANARY` 并不会导致使用 `react@nightly` 或 `react@canary`，这是由于 react-native 如何使用 React 版本的机制决定的（[你可以在这里了解更多](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/README.md#react--react-native-versions)）。

## 何时使用各发布级别

- **`STABLE`**：
  - 适用于所有生产环境应用和无需提前访问未发布功能的库。
  - 这是稳定版和夜间版的默认级别。
- **`CANARY`**：
  - 若你是框架作者、高级应用开发者，或需要在稳定版发布前测试或采用新功能，可使用此级别。
  - 不推荐用于生产环境或面向用户的应用。
- **`EXPERIMENTAL`**：
  - 仅用于测试和反馈处于早期开发阶段的新功能。
  - 不推荐用于生产环境或面向用户的应用。

## 如何使用 Canary 与 Experimental 初始化 React Native

### Android

`DefaultNewArchitectureEntryPoint` 类现在有一个 `releaseLevel` 属性（默认值：`STABLE`）。  
功能标记系统使用此属性选择适合所选发布级别的功能标记集合。

```kotlin title="示例用法"
DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.CANARY
DefaultNewArchitectureEntryPoint.load()
```

构建系统为每个发布级别生成不同的功能标记覆盖类，确保每个阶段启用正确的功能。

### iOS

`RCTReactNativeFactory` 类现在有一个接收 `releaseLevel` 参数的初始化方法。功能标记设置将使用此参数选择正确的功能标记覆盖。

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

该系统确保每个应用实例只能激活一个发布级别，如果创建了多个带不同发布级别的工厂实例，将导致程序崩溃。
