---
id: gesture-responder-system
title: 手势响应系统
---

手势响应系统负责管理应用中手势的生命周期。当应用确定用户意图时，一次触摸可能会经历多个阶段。例如，应用需要判断这次触摸是在滚动、在控件上滑动，还是在轻触。在一次触摸持续期间，这个判断甚至可能发生变化。也可能同时存在多个触摸。

触摸响应系统用于让组件在彼此对父组件或子组件没有额外了解的情况下，协商这些触摸交互。

### 最佳实践

为了让你的应用体验更好，每个操作都应具备以下属性：

- 反馈/高亮- 向用户显示当前由谁处理其触摸，以及在其松开手势时将会发生什么
- 可取消性- 在执行操作时，用户应能够通过将手指移开来在触摸过程中中止它

这些特性会让用户在使用应用时更加安心，因为它允许人们大胆尝试并进行交互，而不必担心犯错。

### TouchableHighlight 和 Touchable\*

响应系统可能比较复杂。因此，我们为那些应该“可点击”的内容提供了一个抽象的 `Touchable` 实现。它使用响应系统，并允许你以声明式方式配置点击交互。在任何你会在网页上使用按钮或链接的地方都使用 `TouchableHighlight`。

## 响应器生命周期

视图可以通过实现正确的协商方法来成为触摸响应器。以下有两种方法用于询问视图是否希望成为响应器：

- `View.props.onStartShouldSetResponder: evt => true,` - 这个视图是否希望在触摸开始时成为响应器？
- `View.props.onMoveShouldSetResponder: evt => true,` - 当视图不是响应器时，每次触摸移动都会调用此方法：这个视图是否希望“声明”触摸响应能力？

如果 View 返回 true 并尝试成为响应器，以下情况之一会发生：

- `View.props.onResponderGrant: evt => {}` - 该视图现在正在响应触摸事件。此时应进行高亮，并向用户显示正在发生什么
- `View.props.onResponderReject: evt => {}` - 其他内容当前是响应器，并且不会释放它

如果该视图正在响应，则可以调用以下处理器：

- `View.props.onResponderMove: evt => {}` - 用户正在移动手指
- `View.props.onResponderRelease: evt => {}` - 在触摸结束时触发，即“touchUp”
- `View.props.onResponderTerminationRequest: evt => true` - 其他内容想要成为响应器。该视图是否应该释放响应器？返回 true 允许释放
- `View.props.onResponderTerminate: evt => {}` - 响应器已从 View 中被移除。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，或者也可能未经询问就被操作系统夺走（在 iOS 上使用控制中心/通知中心时会发生）

`evt` 是一个合成触摸事件，形式如下：

- `nativeEvent`
  - `changedTouches` - 自上一个事件以来已发生变化的所有触摸事件数组
  - `identifier` - 该触摸的 ID
  - `locationX` - 触摸相对于元素的 X 坐标
  - `locationY` - 触摸相对于元素的 Y 坐标
  - `pageX` - 触摸相对于根元素的 X 坐标
  - `pageY` - 触摸相对于根元素的 Y 坐标
  - `target` - 接收触摸事件的元素节点 id
  - `timestamp` - 触摸的时间标识符，便于计算速度
  - `touches` - 屏幕上所有当前触摸的数组

### 捕获式 ShouldSet 处理器

`onStartShouldSetResponder` 和 `onMoveShouldSetResponder` 以冒泡模式调用，最深层的节点会最先被调用。这意味着当多个 Views 的 `*ShouldSetResponder` 处理器都返回 true 时，最深层的组件会成为响应器。在大多数情况下这是理想的，因为它能确保所有控件和按钮都可用。

然而，有时父组件会希望确保自己成为响应器。这可以通过使用捕获阶段来处理。在响应系统从最深层组件向上冒泡之前，它会先执行捕获阶段，触发 `on*ShouldSetResponderCapture`。因此，如果父 View 希望在触摸开始时阻止子组件成为响应器，它应提供一个返回 true 的 `onStartShouldSetResponderCapture` 处理器。

- `View.props.onStartShouldSetResponderCapture: evt => true,`
- `View.props.onMoveShouldSetResponderCapture: evt => true,`

### PanResponder

如需更高层级的手势解析，请查看 [PanResponder](panresponder.md)。
