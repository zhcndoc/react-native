---
id: gesture-responder-system
title: 手势响应系统
---

手势响应系统管理应用中手势的生命周期。一次触摸可以经历多个阶段，应用需要判断用户的意图。例如，应用需要确定触摸是在滚动、在控件上滑动还是点击。这种意图甚至可能在触摸的持续过程中发生变化。触摸也可能是多点同时发生的。

触摸响应系统的存在使组件能够协商这些触摸交互，而无需了解其父组件或子组件的额外信息。

### 最佳实践

为了让你的应用体验良好，每个操作应具备以下属性：

- 反馈/高亮 — 向用户显示是谁在处理他们的触摸，以及当他们释放手势时会发生什么
- 可取消性 — 触发操作时，用户应该能够通过将手指拖离来中止操作

这些特性让用户在使用应用时更加安心，因为它允许人们进行尝试与交互，而无需担心犯错。

### TouchableHighlight 和 Touchable\*

响应系统使用起来比较复杂。因此，我们提供了一个抽象的 `Touchable` 实现，用于那些应该“可点击”的元素。它使用响应系统，并允许你声明式地配置点击交互。在任何需要按钮或链接的地方，都可以使用 `TouchableHighlight`。

## 响应者生命周期

一个视图可以通过实现正确的协商方法来成为触摸响应者。有两个方法用于询问视图是否想要成为响应者：

- `View.props.onStartShouldSetResponder: evt => true,` — 视图是否想在触摸开始时成为响应者？
- `View.props.onMoveShouldSetResponder: evt => true,` — 在视图不是响应者时，每次触摸移动都会调用此方法：视图是否想“声明”触摸响应权？

如果视图返回 true 并尝试成为响应者，将发生以下情况之一：

- `View.props.onResponderGrant: evt => {}` — 视图现在开始响应触摸事件。此时可以高亮显示并告诉用户发生了什么
- `View.props.onResponderReject: evt => {}` — 其他组件当前是响应者且不会释放权利

如果视图正在响应，可以调用以下处理函数：

- `View.props.onResponderMove: evt => {}` — 用户正在移动手指
- `View.props.onResponderRelease: evt => {}` — 触摸结束时触发，即“松开触摸”
- `View.props.onResponderTerminationRequest: evt => true` — 其他组件想成为响应者。此视图是否应释放响应权？返回 true 允许释放
- `View.props.onResponderTerminate: evt => {}` — 响应权已被从视图中夺走。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，或者被操作系统强制夺走（如 iOS 的控制中心/通知中心）

`evt` 是一个合成触摸事件，格式如下：

- `nativeEvent`
  - `changedTouches` — 自上次事件以来发生变化的所有触摸事件数组
  - `identifier` — 触摸的 ID
  - `locationX` — 触摸在元素内的 X 位置
  - `locationY` — 触摸在元素内的 Y 位置
  - `pageX` — 触摸相对于根元素的 X 位置
  - `pageY` — 触摸相对于根元素的 Y 位置
  - `target` — 接收触摸事件的元素节点 ID
  - `timestamp` — 触摸的时间标识，有助于速度计算
  - `touches` — 当前屏幕上所有触摸的数组

### 捕获 ShouldSet 处理函数

`onStartShouldSetResponder` 和 `onMoveShouldSetResponder` 以冒泡模式被调用，最深的节点最先被调用。这意味着当多个视图对应的 `*ShouldSetResponder` 处理函数返回 true 时，最深层的组件会成为响应者。这在大多数情况下是期望的，因为可以确保所有控件和按钮都能正常使用。

但有时父组件希望确保自己成为响应者。这可以通过捕获阶段处理。在响应系统从最深组件冒泡之前，会先执行捕获阶段，触发 `on*ShouldSetResponderCapture`。因此，如果父视图想阻止子视图在触摸开始时成为响应者，它应实现返回 true 的 `onStartShouldSetResponderCapture` 处理函数。

- `View.props.onStartShouldSetResponderCapture: evt => true,`
- `View.props.onMoveShouldSetResponderCapture: evt => true,`

### PanResponder

对于更高级的手势识别，请参考 [PanResponder](panresponder.md)。