---
id: roottag
title: RootTag
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`RootTag` 是分配给 React Native surface 的原生根视图的一个不透明标识符——也就是说，分别对应 Android 或 iOS 上的 `ReactRootView` 或 `RCTRootView` 实例。简而言之，它是一个 surface 标识符。

## 什么时候使用 RootTag？

对于大多数 React Native 开发者来说，你大概率不需要处理 `RootTag`。

当应用渲染**多个 React Native 根视图**，并且你需要根据不同的 surface 以不同方式处理原生 API 调用时，`RootTag` 很有用。一个例子是应用使用原生导航，而每个屏幕都是一个独立的 React Native 根视图。

在原生导航中，每个 React Native 根视图都会渲染到平台的导航视图中（例如，Android 使用 `Activity`，iOS 使用 `UINavigationViewController`）。借此，你可以利用平台的导航范式，例如原生的外观和感觉以及导航转场。与原生导航 API 交互的功能可以通过 [native module](https://reactnative.dev/docs/next/native-modules-intro) 暴露给 React Native。

例如，要更新某个屏幕的标题栏，你会调用导航模块的 API `setTitle("Updated Title")`，但它需要知道要更新栈中的哪一个屏幕。这里需要 `RootTag` 来标识根视图及其宿主容器。

`RootTag` 的另一个使用场景是，当你的应用需要基于某个 JavaScript 调用的来源根视图，将其归因于原生端时。此时需要 `RootTag` 来区分来自不同 surface 的调用来源。

## 如果需要，如何访问 RootTag

在 0.65 及以下版本中，可以通过 [legacy context](https://github.com/facebook/react-native/blob/v0.64.1/Libraries/ReactNative/AppContainer.js#L56) 访问 RootTag。为了让 React Native 为 React 18 及更高版本中即将到来的 Concurrent 特性做准备，我们正在通过 0.66 中的 `RootTagContext` 迁移到最新的 [Context API](https://react.dev/reference/react/createContext)。0.65 版本同时支持 legacy context 和推荐的 `RootTagContext`，以便开发者有时间迁移他们的调用点。参见 breaking changes 总结。

如何通过 `RootTagContext` 访问 `RootTag`。

```js
import {RootTagContext} from 'react-native';
import NativeAnalytics from 'native-analytics';
import NativeNavigation from 'native-navigation';

function ScreenA() {
  const rootTag = useContext(RootTagContext);

  const updateTitle = title => {
    NativeNavigation.setTitle(rootTag, title);
  };

  const handleOneEvent = () => {
    NativeAnalytics.logEvent(rootTag, 'one_event');
  };

  // ...
}

class ScreenB extends React.Component {
  static contextType: typeof RootTagContext = RootTagContext;

  updateTitle(title) {
    NativeNavigation.setTitle(this.context, title);
  }

  handleOneEvent() {
    NativeAnalytics.logEvent(this.context, 'one_event');
  }

  // ...
}
```

可以在 React 文档中了解更多关于 [classes](https://react.dev/reference/react/Component#static-contexttype) 和 [hooks](https://react.dev/reference/react/useContext) 的 Context API。

### 0.65 中的破坏性变更

`RootTagContext` 之前名为 `unstable_RootTagContext`，并在 0.65 中更名为 `RootTagContext`。请更新代码库中任何对 `unstable_RootTagContext` 的使用。

### 0.66 中的破坏性变更

访问 `RootTag` 的 legacy context 将被移除，并由 `RootTagContext` 取代。从 0.65 开始，我们建议开发者主动将 `RootTag` 的访问迁移到 `RootTagContext`。

## 未来计划

随着新的 React Native 架构不断推进，`RootTag` 未来还会有迭代，目标是保持 `RootTag` 类型的不透明性，并防止 React Native 代码库中的频繁变动。请不要依赖 RootTag 目前别名为 number 这一事实！如果你的应用依赖 RootTag，请留意我们的版本变更日志，你可以在[这里](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)找到。
