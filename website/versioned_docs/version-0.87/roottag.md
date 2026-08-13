---
id: roottag
title: RootTag
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`RootTag` 是分配给 React Native surface 的原生根视图的不透明标识符——即 Android 或 iOS 上的 `ReactRootView` 或 `RCTRootView` 实例。简而言之，它是一个 surface 标识符。

## 何时使用 RootTag？

对于大多数 React Native 开发者来说，你可能不需要处理 `RootTag`。

当应用渲染**多个 React Native 根视图**，并且你需要根据 surface 的不同来采用不同的原生 API 调用时，`RootTag` 会很有用。例如，当应用使用原生导航，并且每个屏幕都是一个独立的 React Native 根视图时，就属于这种情况。

在原生导航中，每个 React Native 根视图都会渲染在平台的导航视图中（例如，Android 的 `Activity`、iOS 的 `UINavigationViewController`）。这样，你就可以利用平台的导航范式，例如原生的外观和交互以及导航过渡效果。可以通过[原生模块](https://reactnative.dev/docs/next/native-modules-intro)将与原生导航 API 交互的功能暴露给 React Native。

例如，要更新屏幕的标题栏，你可以调用导航模块的 API `setTitle("Updated Title")`，但它需要知道要更新堆栈中的哪个屏幕。此时需要使用 `RootTag` 来标识根视图及其承载容器。

`RootTag` 的另一个使用场景是，当你的应用需要根据 JavaScript 调用所源自的根视图，将某个 JavaScript 调用归因到原生端时。此时需要使用 `RootTag` 来区分来自不同 surface 的调用来源。

## 如何访问 RootTag……如果你需要的话

在 0.65 及更早版本中，RootTag 通过[旧版 context](https://github.com/facebook/react-native/blob/v0.64.1/Libraries/ReactNative/AppContainer.js#L56)进行访问。为了让 React Native 为 React 18 及更高版本中即将推出的 Concurrent 功能做好准备，我们将在 0.66 中通过 `RootTagContext` 迁移到最新的 [Context API](https://react.dev/reference/react/createContext)。0.65 版本同时支持旧版 context 和推荐使用的 `RootTagContext`，以便开发者有时间迁移调用位置。请参阅重大变更摘要。

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

你可以从 React 文档中进一步了解适用于[类](https://react.dev/reference/react/Component#static-contexttype)和 [hooks](https://react.dev/reference/react/useContext) 的 Context API。

### 0.65 中的重大变更

`RootTagContext` 原名为 `unstable_RootTagContext`，并在 0.65 中更名为 `RootTagContext`。请更新代码库中对 `unstable_RootTagContext` 的任何使用。

### 0.66 中的重大变更

对 `RootTag` 的旧版 context 访问方式将被移除，并由 `RootTagContext` 替代。从 0.65 开始，我们鼓励开发者主动将对 `RootTag` 的访问迁移到 `RootTagContext`。

## 未来计划

随着新的 React Native 架构不断推进，未来将对 `RootTag` 进行迭代，旨在保持 `RootTag` 类型的不透明性，并避免 React Native 代码库发生反复变更。请不要依赖 RootTag 当前与数字互为别名这一事实！如果你的应用依赖 RootTag，请关注我们的版本变更日志，你可以在[这里](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)找到这些日志。
