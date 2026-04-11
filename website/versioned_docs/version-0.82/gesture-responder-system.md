---
id: gesture-responder-system
title: 手势响应器系统
---

手势响应器系统管理应用中手势的生命周期。触摸在应用确定用户意图的过程中会经历几个阶段。例如，应用需要确定触摸是滚动、在组件上滑动还是点击。这甚至在触摸持续期间都可能发生变化。也可能存在多个同时进行的触摸。

需要触摸响应器系统来允许组件协商这些触摸交互，而无需了解其父或子组件的任何额外知识。

### 最佳实践

为了让你的应用感觉很棒，每个操作都应该具有以下属性：

- 反馈/高亮 - 向用户展示是什么在处理他们的触摸，以及当他们释放手势时会发生什么
- 可取消性 - 在执行操作时，用户应该能够通过将手指拖走来中途取消触摸

这些功能让用户在使用应用时更舒适，因为它允许人们在没有犯错恐惧的情况下进行实验和交互。

### TouchableHighlight 和 Touchable\*

响应器系统使用起来可能很复杂。所以我们为应该“可点击”的东西提供了一个抽象的 `Touchable` 实现。它使用响应器系统，并允许你声明式地配置点击交互。在任何你想在网页上使用按钮或链接的地方使用 `TouchableHighlight`。

## 响应器生命周期

视图可以通过实现正确的协商方法成为触摸响应器。有两种方法可以询问视图是否想成为响应器：

- `View.props.onStartShouldSetResponder: evt => true,` - 此视图想在触摸开始时成为响应器吗？
- `View.props.onMoveShouldSetResponder: evt => true,` - 当视图不是响应器时，针对视图上的每次触摸移动调用：此视图想“声明”触摸响应权吗？

如果视图返回 true 并尝试成为响应器，将发生以下情况之一：

- `View.props.onResponderGrant: evt => {}` - 视图现在正在响应触摸事件。这是高亮并向用户展示正在发生什么的时候
- `View.props.onResponderReject: evt => {}` - 其他东西现在是响应器并且不会释放它

如果视图正在响应，可以调用以下处理程序：

- `View.props.onResponderMove: evt => {}` - 用户正在移动他们的手指
- `View.props.onResponderRelease: evt => {}` - 在触摸结束时触发，即 "touchUp"
- `View.props.onResponderTerminationRequest: evt => true` - 其他东西想成为响应器。此视图应该释放响应权吗？返回 true 允许释放
- `View.props.onResponderTerminate: evt => {}` - 响应权已从视图被夺取。可能在调用 `onResponderTerminationRequest` 后被其他视图夺取，也可能被操作系统未经询问就夺取（在 iOS 上发生在控制中心/ 通知中心）

`evt` 是一个具有以下形式合成触摸事件：

- `nativeEvent`
  - `changedTouches` - 自上次事件以来所有已更改触摸事件的数组
  - `identifier` - 触摸的 ID
  - `locationX` - 触摸的 X 位置，相对于元素
  - `locationY` - 触摸的 Y 位置，相对于元素
  - `pageX` - 触摸的 X 位置，相对于根元素
  - `pageY` - 触摸的 Y 位置，相对于根元素
  - `target` - 接收触摸事件的元素的节点 id
  - `timestamp` - 触摸的时间标识符，用于速度计算
  - `touches` - 屏幕上所有当前触摸的数组

### 捕获 ShouldSet 处理程序

`onStartShouldSetResponder` 和 `onMoveShouldSetResponder` 以冒泡模式调用，其中最深的节点最先被调用。这意味着当多个视图为 `*ShouldSetResponder` 处理程序返回 true 时，最深的组件将成为响应器。这在大多数情况下是可取的，因为它确保所有控件和按钮都是可用的。

但是，有时父组件希望确保它成为响应器。这可以通过使用捕获阶段来处理。在响应器系统从最深的组件冒泡之前，它将执行一个捕获阶段，触发 `on*ShouldSetResponderCapture`。因此，如果父视图想要阻止子视图在触摸开始时成为响应器，它应该有一个返回 true 的 `onStartShouldSetResponderCapture` 处理程序。

- `View.props.onStartShouldSetResponderCapture: evt => true,`
- `View.props.onMoveShouldSetResponderCapture: evt => true,`

### PanResponder

对于更高级的手势解释，请查看 [PanResponder](panresponder.md)。
