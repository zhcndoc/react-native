---
id: roottag
title: RootTag
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`RootTag` 是一个不透明标识符，分配给 React Native 表面的原生根视图——即 Android 或 iOS 上的 `ReactRootView` 或 `RCTRootView` 实例。简而言之，它是一个表面标识符。

## 何时使用 RootTag？

对于大多数 React Native 开发者来说，你可能不需要处理 `RootTag`。

`RootTag` 在应用渲染 **多个 React Native 根视图** 且你需要根据表面不同地处理原生 API 调用时很有用。一个例子是应用使用原生导航且每个屏幕都是一个独立的 React Native 根视图。

在原生导航中，每个 React Native 根视图都渲染在平台的导航视图中（例如，Android 的 `Activity`，iOS 的 `UINavigationViewController`）。通过这种方式，你可以利用平台的导航范式，如原生外观和感觉以及导航过渡。与原生导航 API 交互的功能可以通过 [原生模块](https://reactnative.dev/docs/next/native-modules-intro) 暴露给 React Native。

例如，要更新屏幕的标题栏，你会调用导航模块的 API `setTitle("Updated Title")`，但它需要知道更新堆栈中的哪个屏幕。此处需要 `RootTag` 来识别根视图及其宿主容器。

`RootTag` 的另一个用例是当你的应用需要根据其起源根视图将某些 JavaScript 调用归因于原生时。需要 `RootTag` 来区分来自不同表面的调用源。

## 如何访问 RootTag... 如果你需要的话

在 0.65 及以下版本中，RootTag 通过 [遗留 context](https://github.com/facebook/react-native/blob/v0.64.1/Libraries/ReactNative/AppContainer.js#L56) 访问。为了让 React Native 为 React 18 及更高版本中即将到来的 Concurrent 特性做好准备，我们正在 0.66 中通过 `RootTagContext` 迁移到最新的 [Context API](https://react.dev/reference/react/createContext)。0.65 版本同时支持遗留 context 和推荐的 `RootTagContext`，以便开发者有时间迁移他们的调用点。请参阅破坏性变更摘要。

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

从 React 文档中了解更多关于 [类](https://react.dev/reference/react/Component#static-contexttype) 和 [hooks](https://react.dev/reference/react/useContext) 的 Context API 信息。

### 0.65 中的破坏性变更

`RootTagContext` 以前名为 `unstable_RootTagContext`，并在 0.65 中更改为 `RootTagContext`。请更新代码库中任何 `unstable_RootTagContext` 的用法。

### 0.66 中的破坏性变更

对 `RootTag` 的遗留 context 访问将被移除并替换为 `RootTagContext`。从 0.65 开始，我们鼓励开发者主动将 `RootTag` 访问迁移到 `RootTagContext`。

## 未来计划

随着新的 React Native 架构的推进，`RootTag` 将会有未来的迭代，目的是保持 `RootTag` 类型不透明并防止 React Native 代码库中的变动。请不要依赖 RootTag 当前别名为数字这一事实！如果你的应用依赖 RootTags，请密切关注我们的版本变更日志，你可以在 [这里](https://github.com/facebook/react-native/blob/main/CHANGELOG.md) 找到。
