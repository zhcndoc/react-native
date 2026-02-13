---
title: 'React Native 0.82 - 新纪元'
authors: [vzaidman, cortinico, gabrieldonadel, alanjhughes]
tags: [工程]
date: 2025-10-08
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# **React Native 0.82 - 新纪元**

今天我们很高兴发布 React Native 0.82：第一版完全运行在新架构（New Architecture）上的 React Native。

这是 React Native 的一个里程碑版本，我们相信这是一个新纪元的开始。在未来的版本中，我们将移除遗留架构（Legacy Architecture）中的剩余代码，以减少安装包大小并简化代码库。

此外，0.82 还推出了实验性的 Hermes 新版本 Hermes V1 的可选支持。我们也通过升级 React 版本到 19.1.1 启用多个 React 新功能，并加入了对 DOM Node API 的支持。

### 重点内容

- [仅支持新架构](/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [实验性 Hermes V1](/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)
- [React 19.1.1](/blog/2025/10/08/react-native-0.82#react-1911)
- [DOM Node API](/blog/2025/10/08/react-native-0.82#dom-node-apis)

<!--truncate-->

## 仅支持新架构

在 React Native 0.76 版本中，我们宣布了 [新架构](/blog/2024/10/23/the-new-architecture-is-here) 已成为 React Native 的默认架构。

从那时起，新架构经历了测试和完善，我们有信心将它作为当前及未来 React Native 版本的**唯一**架构。

这意味着，如果你在 Android 上尝试设置 `newArchEnabled=false`，或者在 iOS 上使用 `RCT_NEW_ARCH_ENABLED=0` 安装 CocoaPods，这些设置将被忽略，应用仍然会运行在新架构下。

### 如何迁移

如果你还没有迁移项目到新架构，我们建议先迁移到 React Native 0.81 或 Expo SDK 54。这是最后支持使用遗留架构的版本。它们包含了专门帮助迁移到新架构的警告和性能改进。
<br/> 然后在 0.81 版本启用新架构，确认你的应用正常运行。
<br/> 一旦在 0.81 中使用了新架构，你就可以安全更新到 React Native 0.82，该版本将禁止启用遗留架构。

如果有不兼容的第三方依赖阻碍了你的迁移，我们建议你直接联系库的维护者。

如果是 React Native 核心的 bug 阻碍了你迁移，欢迎通过我们的 [问题追踪器](https://github.com/facebook/react-native/issues/new/choose) 联络我们。

### 互操作层和第三方库兼容性

我们将在未来可预见的时期内保留互操作层代码。所有互操作层必需的类和函数暂时不会被删除。后续我们会分享相关移除互操作层的更新。

我们也验证了提供对两个架构向后兼容的第三方库在 0.82 版本（仅新架构）下依旧可用。

### 遗留架构类的移除

为了保持向后兼容并减少破坏性变动，此版本不会从 React Native 核心库中移除遗留架构的任何 API。彻底移除遗留架构将显著缩减整体包大小，因此计划从下个版本开始进行移除。

更多信息可参阅 [RFC0929: React Native 遗留架构移除](https://github.com/react-native-community/discussions-and-proposals/pull/929)。

## 实验性 Hermes V1

React Native 0.82 新增支持可选启用 Hermes V1。

Hermes V1 是 Hermes 的下一代版本。我们已经在我们的应用中进行了内部试验，现在是社区尝试它的时机。它在编译器和虚拟机层面都做了改进，可以提升 Hermes 性能。

初步测试和基准显示，Hermes V1 在多种场景下性能优于当前 Hermes。我们观察到包加载时间和首次可交互时间（TTI）的提升。性能改进高度依赖于具体应用情况。

在一个现实且复杂的应用 [Expensify app](https://github.com/Expensify/App) 中，我们测试得出以下提升：

| 指标 | Android（低端设备） | iOS |
| --- | --- | --- |
| 包加载时间 | 快 3.2% | 快 9% |
| 总体 TTI | 快 7.6% | 快 2.5% |
| 内容 TTI | 快 7.2% | 快 7.5% |

总体 TTI 指从包加载完成到应用中第一个屏幕渲染并可交互的时间。

内容 TTI 指从组件首次渲染到该组件可交互的时间。

Hermes V1 尚未包含 JS 到原生的编译（之前称为“静态 Hermes”）或 React Native EU 2023 展示的 JIT 编译功能。我们仍在测试这些功能，进展会及时分享。

### 如何启用 Hermes V1

:::info

由于 Hermes V1 仍处于实验阶段，需要从源码构建 React Native 才能尝试。等 Hermes V1 在后续 React Native 版本默认发布后，这限制将被取消。

:::

尝试在项目中使用 Hermes V1，请按照如下步骤：

1. 通过修改 `package.json` 中对应部分，强制你的包管理器解析 Hermes V1 编译器的实验版本（当前版本号格式仅适用于 Hermes V1 实验阶段）：

<Tabs>
  <TabItem label="yarn" value="yarn" default>
    ```
    "resolutions": {
        "hermes-compiler": "250829098.0.1"
    }
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```
    "overrides": {
        "hermes-compiler": "250829098.0.1"
    }
    ```
  </TabItem>
</Tabs>

2. 在 Android 上启用 Hermes V1，在 `android/gradle.properties` 文件中添加：

```sh title="android/gradle.properties"
hermesV1Enabled=true
```

并配置 React Native [从源码构建](https://reactnative.dev/contributing/how-to-build-from-source#android)，编辑 `android/settings.gradle`：

```jsx title="android/settings.gradle"
  includeBuild('../node_modules/react-native') {
      dependencySubstitution {
          substitute(module("com.facebook.react:react-android")).using(project(":packages:react-native:ReactAndroid"))
          substitute(module("com.facebook.react:react-native")).using(project(":packages:react-native:ReactAndroid"))
          substitute(project(":packages:react-native:ReactAndroid:hermes-engine")).using(module("com.facebook.hermes:hermes-android:250829098.0.1"))
      }
  }
```

3. 在 iOS 上启用 Hermes V1，执行安装 pods 命令时设置环境变量 `RCT_HERMES_V1_ENABLED=1`：

```sh
RCT_HERMES_V1_ENABLED=1 bundle exec pod install
```

注意 Hermes V1 不兼容预编译的 React Native 构建，因此安装 pods 时不要使用 `RCT_USE_PREBUILT_RNCORE` 标志。

4. 要确认你的应用是否运行的是 Hermes V1，可以在应用或者开发工具控制台执行以下代码以获取 Hermes 版本，应与步骤 1 中版本号相符（`250829098.0.1`）：

```jsx
// 在 Hermes V1 中预期输出 "250829098.0.1"
HermesInternal.getRuntimeProperties()['OSS Release Version'];
```

## React 19.1.1

本次发布的 React Native 搭载了最新版 React 稳定版：[React 19.1.1](https://github.com/facebook/react/releases/tag/v19.1.1)。

该 React 版本对 React Native 提供完整的 owner 栈支持。在 React Native 0.80（React 19.1.0）中，我们提到过在使用 [`@babel/plugin-transform-function-name`](https://babeljs.io/docs/babel-plugin-transform-function-name) Babel 插件时，owner 栈未被完全支持。本次更新解除该限制，使所有 React Native 用户都能使用 owner 栈。

| 之前                                                                                                               | 之后                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| <center>![没有 Owner Stack 的错误示例](../static/blog/assets/0.82-owners-stack-before.png)</center>                  | <center>![启用 Owner Stack 的错误示例](../static/blog/assets/0.82-owners-stack-after.png)</center>            |

React 19.1.1 还改进了在 React Native Suspense 边界中 [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) 和 [`startTransition`](https://react.dev/reference/react/startTransition) 的稳定性。这些关键功能旨在提升应用响应速度。此前这两者在 React Native 中与 Suspense 联合使用时，会错误地显示回退组件。19.1.1 版本已使它们行为与 Web 一致，表现稳定可靠。

## DOM Node API

从 React Native 0.82 起，原生组件将通过 ref 提供类似 DOM 的节点。

<!--alex ignore just retext-equality-->

以前，原生组件提供的是 React Native 特有的对象，仅包含少量方法如 `measure` 和 `setNativeProps`。本次发布后，这些组件将提供[实现了部分 DOM API](https://reactnative.dev/docs/element-nodes) 的节点，允许遍历 UI 树、测量布局等功能，类似于 Web。例如：

```jsx
function MyComponent(props) {
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;

    // 新方法
    element.parentNode;
    element.parentElement;
    element.childNodes;
    element.children;
    const bounds = element.getBoundingClientRect();
    const doc = element.ownerDocument;
    const maybeElement = doc.getElementById('some-view');

    // 仍支持遗留方法
    element.measure((x, y, width, height, pageX, pageY) => {
      /* ... */
    });
  }, []);

  return <View ref={ref} />;
}
```

此外，这次改动也暴露了原生叶子 [文本节点](https://reactnative.dev/docs/text-nodes)（由 `Text` 组件创建）和表示 React Native 根节点的 [文档节点](https://reactnative.dev/docs/document-nodes)。

这是向后兼容的改动，因为新节点仍会实现遗留方法（如 `measure`）。

更多信息请查阅我们的[文档](https://reactnative.dev/docs/nodes)。

## 其他变动

### Web 性能 API（Canary 版）

React Native 现在实现了部分 Web 性能 API：

- [高精度时间](https://www.w3.org/TR/hr-time-3/)：定义了 `performance.now()` 和 `performance.timeOrigin`。
- [性能时间线](https://w3c.github.io/performance-timeline/)：定义了 `PerformanceObserver` 及性能对象中访问条目的方法（`getEntries()`, `getEntriesByType()`, `getEntriesByName()`）。
- [用户定时](https://w3c.github.io/user-timing/)：定义了 `performance.mark` 和 `performance.measure`。
- [事件定时 API](https://w3c.github.io/event-timing/)：定义了上报给 `PerformanceObserver` 的事件条目类型。
- [长任务 API](https://w3c.github.io/longtasks/)：定义了上报给 `PerformanceObserver` 的长任务条目类型。

它们允许你在运行时跟踪应用性能不同方面（用于遥测），并将在未来版本的 React Native DevTools 性能面板中可见。

目前**仅在 [canary 发行级别](https://reactnative.dev/docs/releases/release-levels) 可用**，未来会在正式版中发布。

### 优化的 Android 调试构建类型

从 React Native 0.82 开始，你可以使用 `debugOptimized` 构建类型来加快开发速度。

以往，Android 默认创建两个构建变体：

- `debug`，开发时默认使用，支持连接 React Native DevTools、Metro、Android JVM 和 C++ 调试器。
- `release`，生产环境发布用，完全优化且具混淆和性能优化，调试较困难。

考虑到大多数 React Native 开发者开发时不需要使用 C++ 调试器，新增了 `debugOptimized` 类型。

使用 `debugOptimized` 后动画和重渲染更快，因为启用了多项 C++ 优化，同时你依然可以使用 React Native DevTools 调试 JavaScript。

使用 `debugOptimized` 不能使用 C++ 原生调试器，想要使用需回退到 `debug` 构建。

运行 `debugOptimized` 变体命令示例如下：

<Tabs>
  <TabItem label="Community CLI" value="Community CLI" default>
    ```
    npx react-native run-android --mode debugOptimized
    ```
  </TabItem>
  <TabItem value="Expo" label="Expo">
    ```
    npx expo run:android --variant debugOptimized
    ```
  </TabItem>
</Tabs>

:::info

`debugOptimized` 构建类型也已回移植到 React Native 0.81 和 Expo SDK 54。

:::

以下示例展示了多动画界面下不同构建类型的性能表现。

`debug` 版本约为 20FPS，`debugOptimized` 版本约为 60FPS：
| `debug` | `debugOptimized` |
| ------- | ---------------- |
| ![debug 模式运行示例](../static/blog/assets/0.82-debug.gif) | ![debugOptimized 模式运行示例](../static/blog/assets/0.82-debug-optimized.gif) |

## 破坏性变更

### 未捕获的 promise 拒绝现在会触发 `console.error`

继上个版本[改进未捕获 JS 错误报告机制](/blog/2025/08/12/react-native-0.81#improved-reporting-of-uncaught-javascript-errors) 后，现将通过同样方式报告未捕获的 promise 拒绝：

![promise 拒绝错误报告示例](../static/blog/assets/0.82-uncaught-promise-rejection-report.png)

此前因 bug，这类错误会完全被吞掉忽略，因此升级到 0.81 后可能突然出现大量之前未报的数据。也会导致后台收到大量新 JavaScript 错误报告。

### 其他破坏性变更

#### 通用

- 将 `ReactNativeFeatureFlags` 移至 `src/private`
  - 一般情况下你不应依赖 `ReactNativeFeatureFlags`，它是私有 API。
- 更新了 `Appearance.setColorScheme()` 参数类型，不再接受 nullable 值
  - 需使用 'unspecified' 来代替 null/undefined 用于重置颜色方案的边缘情况。

#### iOS

- 将 `RCTDisplayLink` 迁移走遗留 API `RCTModuleData`，未来计划移除该 API。

#### Android

- 移除类 `com.facebook.react.bridge.JSONArguments`，此前意外设为 `public`
- 废弃 `MessageQueueThreadPerfStats`
  - 已废弃此 API，并替换为空实现。你不应依赖该 API 获取的统计数据，因为之前数据不准确。
- 将 Gradle 从 8.x 升级至 9.0.0
  - Gradle 9.0.0 主要变更列表见 [这里](https://gradle.org/whats-new/gradle-9/)，我们预期对用户无影响。

#### C++

- 删除 `CallbackWrapper.h` 和 `LongLivedObject.h` 的向后兼容头文件
  - 应该改为使用 `#include <react/bridging/LongLivedObject.h>` 和 `#include <react/bridging/CallbackWrapper.h>`。
  - 不应再使用旧的 `#import <ReactCommon/….h>` 引入方式。

完整破坏性变更列表见 [0.82 版本 CHANGELOG](https://github.com/facebook/react-native/blob/main/CHANGELOG.md#v0820)。

## 致谢

React Native 0.82 包含来自 93 位贡献者的超过 868 条提交。感谢大家的努力！

特别感谢在此版本贡献突出的社区成员：

- [Dawid Małecki](https://github.com/coado) 和 [Jakub Piasecki](https://github.com/j-piasecki) 协助推出 Hermes V1。
- [Krystof Woldrich](https://github.com/krystofwoldrich) 辅助修复未捕获 promise 拒绝被吞的 bug。
- [Riccardo Cipolleschi](https://github.com/cipolleschi) 协助撰写 React 19.1.1 和 Hermes V1 相关章节。
- [Rubén Norte](https://github.com/rubennorte) 协助撰写 DOM API 和性能 API 章节。
- [Tomasz Zawadzki](https://github.com/tomekzaw/) 协助调试 `debugOptimized` 性能测试。

## 升级到 0.82

请使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 查看现有项目在不同版本间的代码变更，同时参考[升级文档](/docs/upgrading)。

创建新项目：

```bash
npx @react-native-community/cli@latest init MyProject --version latest
```

若使用 Expo，React Native 0.82 将包含在 expo@canary 版本中。

下一个 SDK（SDK 55）将随 React Native 下一个稳定版 0.83 发布。

:::info

0.82 现为 React Native 最新稳定版本，0.79.x 将进入不再支持状态。详情见 [React Native 支持策略](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md)。

:::