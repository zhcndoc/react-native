---
title: React Native 中的指针事件
authors: [lunaleaps, vincentriemer]
tags: [公告]
date: 2022-12-13
---

# React Native 中的指针事件

今天我们分享一个针对 React Native 的实验性跨平台指针 API。我们将介绍其动机、工作原理以及它对 React Native 用户的优势。文中包含了启用指南，我们也非常期待听到你的反馈！

自我们分享了[多平台愿景](https://reactnative.dev/blog/2021/08/26/many-platform-vision)以来，已经过去一年多，阐述了构建超越移动端的优势，以及这如何为所有平台设定更高标准。在此期间，我们增加了对 VR、桌面和 Web 上 React Native 的投入。由于这些平台的硬件和交互方式存在差异，便引发了 React Native 应如何整体处理输入的问题。

<!--truncate-->

### 超越触摸

桌面和 VR 历来依赖鼠标和键盘输入，而移动端则主要依赖触摸。随着触屏笔记本的普及，以及移动端通过键盘和手写笔支持交互的需求增长，这一叙事已经演变。React Native 现有的触摸事件系统尚不具备处理这些需求的能力。

因此，非官方平台的用户往往会分叉 React Native，或者创建自定义的原生组件和模块来支持关键功能，例如悬停检测或左键点击。这种分歧导致事件处理器属性冗余，不同平台对应相似功能的处理器并存，增加了框架复杂性，并使跨平台代码共享变得繁琐。基于这些原因，团队有动力提供一个跨平台的指针 API。

React Native 致力于提供强大且富有表现力的 API，以支持多平台开发，并保持各平台的特有体验。设计这样一个API固然有挑战，但幸好指针领域已有先例可供借鉴。

### 参考 Web 平台

Web 也面临类似在多平台扩展同时兼顾未来设计的挑战。万维网联盟（W3C）负责制定标准和提案，构建一个跨平台及浏览器互操作的网络。

与我们需求最相关的是，W3C 定义了一种抽象输入形式——指针。 [Pointer Events](https://www.w3.org/TR/pointerevents3/) 规范基于鼠标事件构建，旨在提供一套统一的事件和接口用于跨设备指针输入，同时允许在必要时针对特定设备进行处理。

遵循 Pointer Events 规范带给 React Native 用户诸多好处。除了应对上述问题之外，它提升了那些历史上未考虑多输入类型交互平台的能力。比如给你的 Android 手机连接蓝牙鼠标，或让 Apple Pencil 支持 iPad M2 上的悬停。

符合规范还为 Web 与 React Native 之间的知识共享提供了契机。对于 Web 上的 Pointer Events 预期的理解也能够帮助 React Native 开发者。但我们也认识到，React Native 的需求不同于 Web，我们对规范的采纳是尽力而为，带有清晰记录的偏离，以便明确预期。与此相关的工作还包括对某些 Web 标准的调整，旨在[减少 API 碎片化](https://github.com/react-native-community/discussions-and-proposals/pull/496)，尤其在无障碍和性能 API 上。

## 移植 Web 平台测试

虽然 Pointer Events 规范提供了 API 接口和行为描述，但我们发现规范本身不足以让我们有足够信心基于其进行修改和验证。Web 浏览器则通过另一机制确保合规与互操作性——[Web Platform Tests](https://web-platform-tests.org/) ！

Web 平台测试面向浏览器的命令式 DOM API 编写，而 React Native 使用自己的一套视图原语，这意味着测试代码无法直接共用。为此，我们为 React Native 设计了类似的测试 API，从而便于移植这些 Web 平台测试。

我们实现了一个新的手动测试框架，目前用它通过 RNTester 验证实现。这些测试暂称为 RNTester 平台测试，仍较为基础。我们的实现允许将测试案例构建成组件进行渲染，测试结果仅通过 UI 报告。

![GIF 展示了 React Native (iOS)（左侧）与 Web（右侧）上运行的“Pointer Events hoverable pointer attributes test”的并排对比。](/blog/assets/pointer-events-wpt-demo.gif)

随着我们不断完善指针事件实现，这些测试将持续发挥作用。测试也会扩展至 Android 和 iOS 之外的平台。当测试套件的数量增加时，我们将寻求实现自动化测试执行，更好地捕捉实现中的回归。

## 工作原理

Pointer Events 实现很大程度上基于现有触摸事件分发的基础设施。在 Android 和 iOS 上我们利用相应的 MotionEvent 和 UITouch 事件。下图展示了事件分发的一般流程。

![代码流程示意图：Android 和 iOS UI 输入事件如何转化为 Pointer Events。Android 端，输入处理器“onTouchEvent”和“onHoverEvent”触发“MotionEvents”，被解释为 Pointer Events 并通过 JSI 分发给 React 渲染器。iOS 端路径类似，输入处理器“touchesBegan”，“touchesMoved”，“touchesEnded”和“hovering”将“UITouch”和“UIEvent”解释为 Pointer Events。](/blog/assets/pointer-events-code-flow.png)

以 Android 为例，利用平台事件的一般方法为：

1. 遍历 `MotionEvent` 中的所有指针，进行深度优先搜索，确定每个指针的目标 React 视图及其祖先链。
2. 将 `MotionEvent` 的类别映射到相应的指针事件。`MotionEvent` 与 `PointerEvent` 之间存在一对多的关系。下图中，虚线表示若指针设备不支持悬停则触发的事件。

![图解 Android MotionEvents 类型与触发的 Pointer Events 的关系。若指针设备不支持悬停，部分事件会有条件触发。 “ACTION_DOWN”和“ACTION_POINTER_DOWN”触发 pointerdown，并有条件触发 pointerenter，pointerover。 “ACTION_MOVE”和“ACTION_HOVER_MOVE”触发 pointerover，pointermove，pointerout，pointerup。 “ACTION_UP”和“ACTION_POINTER_UP”触发 pointerup，并有条件触发 pointerout，pointerleave。](/blog/assets/pointer-events-motionevent-relationship.png)

3. 根据 `MotionEvent` 的平台细节和之前的交互缓存状态，构建 `PointerEvent` 接口对象。（例如，[`button` 属性](https://w3c.github.io/pointerevents/#the-button-property)）
4. 将指针事件从 Android 端分发至 React Native 的[核心事件队列](https://github.com/facebook/react-native/blob/main/ReactCommon/react/renderer/core/EventQueueProcessor.cpp#L20)，通过 JSI 调用 `react-native-renderer` 中的 [`dispatchEvent`](https://github.com/facebook/react/blob/main/packages/react-native-renderer/src/ReactFabricEventEmitter.js#L83) 方法，该方法遍历 React 树，执行事件的冒泡与捕获阶段。

## 实现进度

我们当前实现 Pointer Events 规范时，重点放在了最常用事件的基础实现上，这些事件涵盖了按下、悬停、移动等交互。

### 事件支持情况

| 已实现         | 进行中           | 尚未实现              |
| -------------- | ---------------- | --------------------- |
| onPointerOver  | onPointerCancel  | onClick               |
| onPointerEnter |                  | onContextMenu         |
| onPointerDown  |                  | onGotPointerCapture   |
| onPointerMove  |                  | onLostPointerCapture  |
| onPointerUp    |                  | onPointerRawUpdate    |
| onPointerOut   |                  |                       |
| onPointerLeave |                  |                       |

:::info

onPointerCancel 已绑定到底层平台的“cancel”事件，但这并不一定与 Web 平台的触发时机对应。

:::

### 事件属性

对于上述事件，我们已实现 PointerEvent 对象中大部分预期属性——不过在 React Native 中，它们通过 `event.nativeEvent` 属性暴露。你可以在 [事件对象的 Flow 类型接口定义](https://github.com/facebook/react-native/blob/59ee57352738f030b41589a450209e51e44bbb06/Libraries/Types/CoreEventTypes.js#L175) 中查看所有已实现属性的枚举。值得注意的是，`relatedTarget` 属性尚未完整实现，因为以这种临时方式暴露原生视图引用并非易事。

## 未来工作与探索

除了上述事件外，还有一些关联的 Pointer Events API，我们计划将其纳入后续工作，包括：

- 指针捕获 API
  - 包含在元素引用上暴露的命令式 API，如 `setPointerCapture()`、`releasePointerCapture()` 和 `hasPointerCapture()`。
- `touch-action` 样式属性
  - Web 中使用此 CSS 属性声明式地协调浏览器与网站自有事件处理逻辑间的手势。在 React Native 中，可以用于协调 View 的指针事件处理器与父 ScrollView 之间的事件响应。
- `click`、`contextmenu`、`auxclick`
  - `click` 是抽象的交互定义，可能通过无障碍范式或其他特有平台交互触发。

原生 Pointer Events 实现的另一个优势是，我们可以重新审视并改进当前仅限于触摸事件、通过 JavaScript 由 Responder、Pressability 和 PanResponder API 处理的各种手势处理方式。

此外，我们正在探索为 React Native 宿主组件实现 `EventTarget` 接口（即支持 `add`/`removeEventListener`），这将有望使更多用户层抽象的指针交互处理成为可能。

## 试用指南

我们的指针事件实现目前仍属实验性质，期待社区对现有工作提供反馈。如果你想试用该 API，需要启用若干特性开关：

### 启用特性开关

:::danger

重写以下原生特性开关（如 `RCTConstants` 和 `ReactFeatureFlags`）技术上涉及 React Native 内部，不排除未来版本变动可能导致配置失效。我们正努力逐步淘汰这些开关，以便更广泛地推出指针事件功能。

:::

:::note

指针事件仅针对[新架构（Fabric）](https://reactnative.dev/docs/the-new-architecture/use-app-template)实现，目前仅适用于 React Native 0.71 及以上版本（本文撰写时处于候选发布状态）。

:::

在你的入口 JavaScript 文件（默认 React Native 应用模板中的 index.js）中，需要启用指针事件对应的 JS 端标志 `shouldEmitW3CPointerEvents`，以及在 `Pressability` 中使用指针事件实现悬停的标志 `shouldPressibilityUseW3CPointerEventsForHover`。

```js
import ReactNativeFeatureFlags from 'react-native/Libraries/ReactNative/ReactNativeFeatureFlags';

// 启用 JS 端的 W3C PointerEvent 实现
ReactNativeFeatureFlags.shouldEmitW3CPointerEvents = () => true;

// 在 Pressability 中启用由 PointerEvent 实现支持的悬停事件
ReactNativeFeatureFlags.shouldPressibilityUseW3CPointerEventsForHover =
  () => true;
```

### iOS 相关配置

为了确保指针事件能从原生 iOS 渲染器发送，你需要在原生应用的初始化代码中（通常是 `AppDelegate.mm`）打开一个原生特性开关。

```objc
#import <React/RCTConstants.h>

// ...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    RCTSetDispatchW3CPointerEvents(YES);

    // ...
}
```

注意，为确保 Pointer Event 实现在 iOS 上能区分鼠标和触摸指针，你还需要在 Xcode 项目的 `info.plist` 中添加 [`UIApplicationSupportsIndirectInputEvents`](https://developer.apple.com/documentation/bundleresources/information_property_list/uiapplicationsupportsindirectinputevents) 条目。

### Android 相关配置

与 iOS 类似，Android 也有一个需要在应用初始化时启用的特性开关，通常是在根 React 活动或 Surface 的 `onCreate` 方法内。

```java
import com.facebook.react.config.ReactFeatureFlags;

//... 初始化代码的某处

@Override
public void onCreate() {
    ReactFeatureFlags.dispatchPointerEvents = true;
}
```

### JavaScript 示例

```js
function onPointerOver(event) {
  console.log(
    '光标悬停蓝色区域偏移：',
    event.nativeEvent.offsetX,
    event.nativeEvent.offsetY,
  );
}

// ... 在某组件中使用
<View
  onPointerOver={onPointerOver}
  style={{height: 100, width: 100, backgroundColor: 'blue'}}
/>;
```

## 欢迎反馈

如今，指针事件已被我们的 VR 平台采纳，并为 Oculus Store 提供支持，但我们仍期待社区早期反馈，针对我们的方法和已有实现提出建议。我们也非常期待未来与大家分享更多进展。如有疑问或想法，欢迎加入指针事件的[专门讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/557)。