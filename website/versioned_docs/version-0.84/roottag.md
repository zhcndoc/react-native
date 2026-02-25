---
id: roottag
title: RootTag
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`RootTag` 是分配给你的 React Native 界面本地根视图的一个不透明标识符 — 即 Android 的 `ReactRootView` 或 iOS 的 `RCTRootView` 实例。简而言之，它是一个界面标识符。

## 何时使用 RootTag？

对于大多数 React Native 开发者，你可能不需要处理 `RootTag`。

当应用渲染**多个 React Native 根视图**，且你需要根据不同的界面原生 API 调用进行不同处理时，`RootTag` 就很有用。举个例子，当应用使用原生导航且每个屏幕都是一个独立的 React Native 根视图时。

在原生导航中，每个 React Native 根视图都会渲染在平台的导航视图中（例如 Android 的 `Activity`，iOS 的 `UINavigationViewController`）。通过这种方式，你可以利用平台的导航范式，比如原生的外观和感觉以及导航过渡。与原生导航 API 交互的功能可以通过 [原生模块](https://reactnative.dev/docs/next/native-modules-intro) 暴露给 React Native。

例如，要更新某个屏幕的标题栏，你会调用导航模块的 API `setTitle("Updated Title")`，但它需要知道应更新堆栈中的哪一个屏幕。在这里，`RootTag` 是必须的，用以标识根视图及其宿主容器。

另一个 `RootTag` 的使用场景是当你的应用需要基于调用来源的根视图，将某些 JavaScript 调用归属给原生时。`RootTag` 是区分不同界面调用源的必要条件。

## 如果需要，如何访问 RootTag

在 0.65 及更早版本中，RootTag 通过一个[遗留上下文](https://github.com/facebook/react-native/blob/v0.64.1/Libraries/ReactNative/AppContainer.js#L56)访问。为了准备 React 18 及以后的并发特性，我们在 0.66 中通过 `RootTagContext` 迁移到最新的 [Context API](https://react.dev/reference/react/createContext)。0.65 版本同时支持遗留上下文和推荐使用的 `RootTagContext`，以便开发者有时间迁移调用点。详情见破坏性变更总结。

通过 `RootTagContext` 访问 `RootTag` 的方式如下：

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

更多关于 React docs 中的 [类](https://react.dev/reference/react/Component#static-contexttype) 和 [钩子](https://react.dev/reference/react/useContext) 的 Context API 用法，请参阅官方文档。

### 0.65 的破坏性变更

`RootTagContext` 原名为 `unstable_RootTagContext`，在 0.65 中更名为 `RootTagContext`。请更新代码中所有使用 `unstable_RootTagContext` 的地方。

### 0.66 的破坏性变更

旧的上下文访问 `RootTag` 将被移除，改为使用 `RootTagContext`。从 0.65 版本开始，我们鼓励开发者主动将 `RootTag` 访问迁移至 `RootTagContext`。

## 未来规划

随着新 React Native 架构的推进，`RootTag` 将迭代更新，目标是保持 `RootTag` 类型的不透明性，防止 React Native 代码库中的混乱。请不要依赖 RootTag 当前别名为数字的事实！如果你的应用依赖于 RootTags，请持续关注我们的版本更新日志，日志地址见 [这里](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)。