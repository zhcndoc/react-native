---
id: gesture-responder-system
title: 手势响应系统
---

手势响应系统管理应用中手势的生命周期。触摸可以经历多个阶段，因为应用需要判断用户的意图。例如，应用需要确定触摸是在滚动、在控件上滑动，还是在点击。这种情况甚至可能在一次触摸持续期间发生变化。还可能同时存在多个触摸。

触摸响应系统用于让组件在无需额外了解其父组件或子组件的情况下，就这些触摸交互进行协商。

### 最佳实践

为了让应用使用起来更加出色，每个操作都应具备以下属性：

- 反馈/高亮- 向用户显示当前正在处理其触摸的对象，以及释放手势时将会发生什么
- 可取消- 执行操作时，用户应能够在触摸过程中将手指拖开来中止操作

这些功能让用户在使用应用时更加安心，因为用户可以进行尝试和交互，而不必担心犯错。

### TouchableHighlight 和 Touchable\*

响应系统的使用可能很复杂。因此，我们为应当支持“可点击”的对象提供了抽象的 `Touchable` 实现。它使用响应系统，并允许你以声明方式配置点击交互。在任何你会在 Web 上使用按钮或链接的地方，都可以使用 `TouchableHighlight`。

## 响应者生命周期

视图可以通过实现正确的协商方法成为触摸响应者。有两个方法可以询问视图是否希望成为响应者：

- `View.props.onStartShouldSetResponder: evt => true,` - 此视图是否希望在触摸开始时成为响应者？
- `View.props.onMoveShouldSetResponder: evt => true,` - 当视图不是响应者时，在每次触摸移动时调用：此视图是否希望“声明”对触摸的响应权？

如果 View 返回 true 并尝试成为响应者，则会发生以下情况之一：

- `View.props.onResponderGrant: evt => {}` - View 现在开始响应触摸事件。这是高亮显示并向用户说明当前发生了什么的时机
- `View.props.onResponderReject: evt => {}` - 当前响应者是其他对象，并且不会释放响应权

如果视图正在响应，则可以调用以下处理函数：

- `View.props.onResponderMove: evt => {}` - 用户正在移动手指
- `View.props.onResponderRelease: evt => {}` - 在触摸结束时触发，即“touchUp”
- `View.props.onResponderTerminationRequest: evt => true` - 其他对象希望成为响应者。此视图是否应释放响应权？返回 true 将允许释放
- `View.props.onResponderTerminate: evt => {}` - 响应权已从 View 处被夺走。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，也可能是由操作系统在未询问的情况下夺走（在 iOS 上使用控制中心/通知中心时会发生）

`evt` 是具有以下形式的合成触摸事件：

- `nativeEvent`
  - `changedTouches` - 自上一个事件以来发生变化的所有触摸事件组成的数组
  - `identifier` - 触摸的 ID
  - `locationX` - 触摸的 X 坐标，相对于元素
  - `locationY` - 触摸的 Y 坐标，相对于元素
  - `pageX` - 触摸的 X 坐标，相对于根元素
  - `pageY` - 触摸的 Y 坐标，相对于根元素
  - `target` - 接收触摸事件的元素的节点 ID
  - `timestamp` - 触摸的时间标识，可用于计算速度
  - `touches` - 屏幕上当前所有触摸组成的数组

### 捕获阶段的 ShouldSet 处理函数

`onStartShouldSetResponder` 和 `onMoveShouldSetResponder` 以冒泡模式调用，其中最深层的节点最先被调用。这意味着当多个 View 为 `*ShouldSetResponder` 处理函数返回 true 时，最深层的组件将成为响应者。在大多数情况下，这是理想的行为，因为它能确保所有控件和按钮都可用。

但是，有时父组件会希望确保自己成为响应者。这可以通过使用捕获阶段来处理。在响应系统从最深层组件向上冒泡之前，会先执行捕获阶段，触发 `on*ShouldSetResponderCapture`。因此，如果父 View 希望阻止子组件在触摸开始时成为响应者，就应设置一个返回 true 的 `onStartShouldSetResponderCapture` 处理函数。

- `View.props.onStartShouldSetResponderCapture: evt => true,`
- `View.props.onMoveShouldSetResponderCapture: evt => true,`

### PanResponder

如需了解更高级别的手势解释，请查看 [PanResponder](panresponder.md)。
