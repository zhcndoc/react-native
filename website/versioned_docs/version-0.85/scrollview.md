---
id: scrollview
title: ScrollView
---

该组件封装了平台的 ScrollView，同时提供了与触摸锁定“响应者”系统的集成。

请记住，ScrollView 必须具有固定高度才能工作，因为它们将无固定高度的子元素包含在有固定高度的容器中（通过滚动交互）。为了限定 ScrollView 的高度，要么直接设置视图的高度（不推荐），要么确保所有父视图都有固定高度。忘记将 `{flex: 1}` 传递到视图堆栈中可能会导致此处出现错误，元素检查器可以快速调试这些错误。

尚不支持其他包含的响应者阻止此滚动视图成为响应者。

`<ScrollView>` vs [`<FlatList>`](flatlist.md) - 使用哪一个？

`ScrollView` 一次性渲染所有 React 子组件，但这有性能缺点。

想象你有一个很长的列表想要显示，可能有几屏的内容。一次性创建所有 JS 组件和原生视图，其中许多甚至可能不会显示，这将导致渲染缓慢和内存使用增加。

这就是 `FlatList` 发挥作用的地方。`FlatList` 惰性渲染项目，当它们即将出现时渲染，并移除滚动出屏幕很远的项目以节省内存和处理时间。

如果你想在项目之间渲染分隔符、多列、无限滚动加载或它支持的任何其他功能，`FlatList` 也很方便。

## 示例

```SnackPlayer name=ScrollView%20Example
import React from 'react';
import {StyleSheet, Text, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
});

export default App;
```

---

# 参考

## 属性

### [View 属性](view.md#props)

继承 [View 属性](view#props)。

---

### `StickyHeaderComponent`

一个 React 组件，将用于渲染粘性头部，应与 `stickyHeaderIndices` 一起使用。如果你的粘性头部使用自定义变换，例如当你想要列表具有动画且可隐藏的头部时，可能需要设置此组件。如果未提供组件，将使用默认的 [`ScrollViewStickyHeader`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader.js) 组件。

| 类型               |
| ------------------ |
| 组件，元素 |

---

### `alwaysBounceHorizontal` <div className="label ios">iOS</div>

当为 true 时，即使内容小于滚动视图本身，滚动视图在到达尽头时也会在水平方向上反弹。

| 类型 | 默认值                                               |
| ---- | ----------------------------------------------------- |
| 布尔值 | 当 `horizontal={true}` 时为 `true`<hr/>否则为 `false` |

---

### `alwaysBounceVertical` <div className="label ios">iOS</div>

当为 true 时，即使内容小于滚动视图本身，滚动视图在到达尽头时也会在垂直方向上反弹。

| 类型 | 默认值                                               |
| ---- | ----------------------------------------------------- |
| 布尔值 | 当 `horizontal={true}` 时为 `false`<hr/>否则为 `true` |

---

### `automaticallyAdjustContentInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整位于导航栏或标签栏/工具栏后面的滚动视图的内容边距。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `automaticallyAdjustKeyboardInsets` <div className="label ios">iOS</div>

控制 ScrollView 是否应在键盘改变大小时自动调整其 `contentInset` 和 `scrollViewInsets`。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `automaticallyAdjustsScrollIndicatorInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整滚动指示器边距。参见 Apple 的 [关于该属性的文档](https://developer.apple.com/documentation/uikit/uiscrollview/3198043-automaticallyadjustsscrollindica)。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `bounces` <div className="label ios">iOS</div>

当为 true 时，如果内容沿滚动方向轴大于滚动视图，则滚动视图在到达内容尽头时会反弹。当 `false` 时，即使 `alwaysBounce*` 属性为 `true`，它也会禁用所有反弹。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `bouncesZoom` <div className="label ios">iOS</div>

当 `true` 时，手势可以驱动缩放超过最小/最大值，并且缩放将在手势结束时动画化到最小/最大值，否则缩放将不会超过限制。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `canCancelContentTouches` <div className="label ios">iOS</div>

当 `false` 时，一旦跟踪开始，如果触摸移动，将不会尝试拖动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `centerContent` <div className="label ios">iOS</div>

当 `true` 时，当内容小于滚动视图边界时，滚动视图会自动居中内容；当内容大于滚动视图时，此属性无效。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `contentContainerStyle`

这些样式将应用于包裹所有子视图的滚动视图内容容器。示例：

```
return (
  <ScrollView contentContainerStyle={styles.contentContainer}>
  </ScrollView>
);
...
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});
```

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `contentInset` <div className="label ios">iOS</div>

滚动视图内容从滚动视图边缘边距的量。

| 类型                                                                 | 默认值                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `contentInsetAdjustmentBehavior` <div className="label ios">iOS</div>

此属性指定如何使用安全区域边距来修改滚动视图的内容区域。适用于 iOS 11 及更高版本。

| 类型                                                           | 默认值   |
| -------------------------------------------------------------- | --------- |
| 枚举 (`'automatic'`, `'scrollableAxes'`, `'never'`, `'always'`) | `'never'` |

---

### `contentOffset`

用于手动设置起始滚动偏移量。

| 类型  | 默认值        |
| ----- | -------------- |
| 点 | `{x: 0, y: 0}` |

---

### `decelerationRate`

一个浮点数，确定用户抬起手指后滚动视图减速的速度。你也可以使用字符串快捷方式 `"normal"` 和 `"fast"`，它们分别匹配底层 iOS 设置 `UIScrollViewDecelerationRateNormal` 和 `UIScrollViewDecelerationRateFast`。

- `'normal'` iOS 上为 0.998，Android 上为 0.985。
- `'fast'`，iOS 上为 0.99，Android 上为 0.9。

| 类型                               | 默认值    |
| ---------------------------------- | ---------- |
| 枚举 (`'fast'`, `'normal'`)，数字 | `'normal'` |

---

### `directionalLockEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 将尝试在拖动时仅锁定垂直或水平滚动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `disableIntervalMomentum`

当为 true 时，无论手势速度如何，滚动视图都会停在下一个索引（相对于释放时的滚动位置）。当页面小于水平 ScrollView 的宽度或垂直 ScrollView 的高度时，这可用于分页。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `disableScrollViewPanResponder`

当为 true 时，ScrollView 上的默认 JS 平移响应者被禁用，ScrollView 内部触摸的完全控制权留给其子组件。如果启用了 `snapToInterval`，这特别有用，因为它不遵循典型的触摸模式。不要在没有 `snapToInterval` 的常规 ScrollView 用例中使用此属性，因为它可能导致滚动时发生意外的触摸。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `endFillColor` <div className="label android">Android</div>

有时 scrollview 占据的空间比其内容填充的空间多。在这种情况下，此属性将用颜色填充 scrollview 的其余部分，以避免设置背景并创建不必要的过度绘制。这是一个高级优化，在一般情况下不需要。

| 类型            |
| --------------- |
| [颜色](colors) |

---

### `fadingEdgeLength` <div className="label android">Android</div>

淡出滚动内容的边缘。

如果值大于 `0`， fading edges 将根据当前的滚动方向和位置进行设置，指示是否有更多内容要显示。

| 类型                                               | 默认值 |
| -------------------------------------------------- | ------- |
| 数字<hr />对象：`{start: number, end: number}` | `0`     |

---

### `horizontal`

当 `true` 时，滚动视图的子元素水平排列成行，而不是垂直排列成列。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `indicatorStyle` <div className="label ios">iOS</div>

滚动指示器的样式。

- `'default'` 与 `black` 相同。
- `'black'`，滚动指示器为 `black`。此样式适用于浅色背景。
- `'white'`，滚动指示器为 `white`。此样式适用于深色背景。

| 类型                                    | 默认值     |
| --------------------------------------- | ----------- |
| 枚举 (`'default'`, `'black'`, `'white'`) | `'default'` |

---

### `invertStickyHeaders`

如果粘性头部应该粘在 ScrollView 的底部而不是顶部。这通常与倒置的 ScrollViews 一起使用。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `keyboardDismissMode`

确定键盘是否响应拖动而被 dismiss。

- `'none'`，拖动不会 dismiss 键盘。
- `'on-drag'`，当拖动开始时键盘被 dismiss。

**仅限 iOS**

- `'interactive'`，键盘随拖动交互性地被 dismiss 并与触摸同步移动，向上拖动可取消 dismiss。在 Android 上不支持此功能，其行为将与 `'none'` 相同。

| 类型                                                                                                                                                            | 默认值  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 枚举 (`'none'`, `'on-drag'`) <div className="label android">Android</div><hr />枚举 (`'none'`, `'on-drag'`, `'interactive'`) <div className="label ios">iOS</div> | `'none'` |

---

### `keyboardShouldPersistTaps`

确定点击后键盘何时应保持可见。

- `'never'` 当键盘弹出时，点击聚焦文本输入框外部会 dismiss 键盘。当这种情况发生时，子元素不会接收点击。
- `'always'`，键盘不会自动 dismiss，滚动视图不会捕获点击，但滚动视图的子元素可以捕获点击。
- `'handled'`，当点击被滚动视图的子元素处理（或被祖先捕获）时，键盘不会自动 dismiss。
- `false`，**_已弃用_**，改用 `'never'`
- `true`，**_已弃用_**，改用 `'always'`

| 类型                                                      | 默认值   |
| --------------------------------------------------------- | --------- |
| 枚举 (`'always'`, `'never'`, `'handled'`, `false`, `true`) | `'never'` |

---

### `maintainVisibleContentPosition`

设置后，滚动视图将调整滚动位置，以便当前可见且位于或超过 `minIndexForVisible` 的第一个子元素不会改变位置。这对于双向加载内容的列表很有用，例如聊天线程，否则新消息的进入可能会导致滚动位置跳跃。值 0 很常见，但其他值（如 1）可用于跳过加载 spinner 或其他不应保持位置的内容。可选的 `autoscrollToTopThreshold` 可用于在调整后使内容自动滚动到顶部，如果用户在调整前位于顶部阈值内。这也适用于类似聊天的应用程序，你想看到新消息滚动到位，但如果用户已经向上滚动了一段距离，滚动一大堆会具有破坏性。

注意 1：在此启用的情况下重新排序 scrollview 中的元素可能会导致跳跃和抖动。它可以修复，但目前没有计划这样做。现在，不要重新排序使用此功能的任何 ScrollViews 或 Lists 的内容。

注意 2：这在原生代码中使用 `contentOffset` 和 `frame.origin` 来计算可见性。遮挡、变换和其他复杂性不会被考虑为内容是否“可见”。

| 类型                                                                     |
| ------------------------------------------------------------------------ |
| 对象：`{minIndexForVisible: number, autoscrollToTopThreshold: number}` |

---

### `maximumZoomScale` <div className="label ios">iOS</div>

允许的最大缩放比例。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `1.0`   |

---

### `minimumZoomScale` <div className="label ios">iOS</div>

允许的最小缩放比例。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `1.0`   |

---

### `nestedScrollEnabled` <div className="label android">Android</div>

为 Android API 级别 21+ 启用嵌套滚动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `onContentSizeChange`

当 ScrollView 的可滚动内容视图更改时调用。

处理函数将接收两个参数：内容宽度和内容高度 `(contentWidth, contentHeight)`。

它是使用附加到此 ScrollView 渲染的内容容器的 onLayout 处理程序实现的。

| 类型     |
| -------- |
| 函数 |

---

### `onMomentumScrollBegin`

当惯性滚动开始时调用（滚动视图开始滑动时发生的滚动）。

| 类型     |
| -------- |
| 函数 |

---

### `onMomentumScrollEnd`

当惯性滚动结束时调用（滚动视图滑动到停止时发生的滚动）。

| 类型     |
| -------- |
| 函数 |

---

### `onScroll`

滚动期间每帧最多触发一次。事件具有以下形状（所有未指定类型的值均为数字）：

```js
{
  nativeEvent: {
    contentInset: {bottom, left, right, top},
    contentOffset: {x, y},
    contentSize: {height, width},
    layoutMeasurement: {height, width},
    velocity: {x, y},
    responderIgnoreScroll: boolean,
    zoomScale,
    // iOS only
    targetContentOffset: {x, y}
  }
}
```

| 类型     |
| -------- |
| 函数 |

---

### `onScrollBeginDrag`

当用户开始拖动滚动视图时调用。

| 类型     |
| -------- |
| 函数 |

---

### `onScrollEndDrag`

当用户停止拖动滚动视图并且它停止或开始滑动时调用。

| 类型     |
| -------- |
| 函数 |

---

### `onScrollToTop` <div className="label ios">iOS</div>

当状态栏被点击后滚动视图滚动到顶部时触发。

| 类型     |
| -------- |
| 函数 |

---

### `overScrollMode` <div className="label android">Android</div>

用于覆盖 overScroll 模式的默认值。

可能的值：

- `'auto'` - 仅当内容大到足以有意义地滚动时，允许用户过度滚动此视图。
- `'always'` - 始终允许用户过度滚动此视图。
- `'never'` - 从不允许用户过度滚动此视图。

| 类型                                  | 默认值  |
| ------------------------------------- | -------- |
| 枚举 (`'auto'`, `'always'`, `'never'`) | `'auto'` |

---

### `pagingEnabled`

当为 true 时，滚动视图在滚动时停在滚动视图大小的倍数上。这可用于水平分页。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `persistentScrollbar` <div className="label android">Android</div>

导致滚动条在不使用时不变成透明。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `pinchGestureEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 允许使用捏合手势进行缩放。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `refreshControl`

一个 RefreshControl 组件，用于为 ScrollView 提供下拉刷新功能。仅适用于垂直 ScrollViews（`horizontal` 属性必须为 `false`）。

参见 [RefreshControl](refreshcontrol)。

| 类型    |
| ------- |
| 元素 |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能导致错误（内容丢失）- 使用风险自负。
:::

当 `true` 时，离屏子视图在离屏时从其原生备份父视图中移除。这可以提高大列表的滚动性能。在 Android 上，默认值为 `true`。

| 类型    |
| ------- |
| 布尔值 |

---

### `scrollEnabled`

当为 false 时，视图无法通过触摸交互进行滚动。

注意，视图始终可以通过调用 `scrollTo` 进行滚动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `scrollEventThrottle`

限制滚动时触发滚动事件的频率，指定为毫秒的时间间隔。当响应滚动执行昂贵工作时，这可能很有用。值 &le; `16` 将禁用节流，无论设备的刷新率如何。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `0`     |

---

### `scrollIndicatorInsets` <div className="label ios">iOS</div>

滚动视图指示器从滚动视图边缘边距的量。这通常应设置为与 `contentInset` 相同的值。

| 类型                                                                 | 默认值                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `scrollPerfTag` <div className="label android">Android</div>

用于记录此滚动视图上滚动性能的标签。将强制开启动量事件（参见 sendMomentumEvents）。这在开箱即用情况下不起任何作用，你需要实现一个自定义原生 FpsListener 才能使其有用。

| 类型   |
| ------ |
| 字符串 |

---

### `scrollToOverflowEnabled` <div className="label ios">iOS</div>

当 `true` 时，滚动视图可以以编程方式滚动超过其内容大小。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `scrollsToTop` <div className="label ios">iOS</div>

当 `true` 时，当状态栏被点击时，滚动视图滚动到顶部。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `showsHorizontalScrollIndicator`

当 `true` 时，显示水平滚动指示器。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `showsVerticalScrollIndicator`

当 `true` 时，显示垂直滚动指示器。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `snapToAlignment`

当设置 `snapToInterval` 时，`snapToAlignment` 将定义捕捉与滚动视图的关系。

可能的值：

- `'start'` 将捕捉对齐到左侧（水平）或顶部（垂直）。
- `'center'` 将捕捉对齐到中心。
- `'end'` 将捕捉对齐到右侧（水平）或底部（垂直）。

| 类型                                 | 默认值   |
| ------------------------------------ | --------- |
| 枚举 (`'start'`, `'center'`, `'end'`) | `'start'` |

---

### `snapToEnd`

与 `snapToOffsets` 结合使用。默认情况下，列表的末尾算作一个捕捉偏移量。将 `snapToEnd` 设置为 false 以禁用此行为，并允许列表在其末尾和最后一个 `snapToOffsets` 偏移量之间自由滚动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `snapToInterval`

设置后，导致滚动视图停在 `snapToInterval` 值的倍数处。这可用于浏览长度小于滚动视图的子元素。通常与 `snapToAlignment` 和 `decelerationRate="fast"` 结合使用。覆盖配置较少的 `pagingEnabled` 属性。

| 类型   |
| ------ |
| 数字 |

---

### `snapToOffsets`

设置后，导致滚动视图停在定义的偏移量处。这可用于浏览长度小于滚动视图的各种大小的子元素。通常与 `decelerationRate="fast"` 结合使用。覆盖配置较少的 `pagingEnabled` 和 `snapToInterval` 属性。

| 类型            |
| --------------- |
| 数字数组 |

---

### `snapToStart`

与 `snapToOffsets` 结合使用。默认情况下，列表的开头算作一个捕捉偏移量。将 `snapToStart` 设置为 `false` 以禁用此行为，并允许列表在其开头和第一个 `snapToOffsets` 偏移量之间自由滚动。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `stickyHeaderHiddenOnScroll`

当设置为 `true` 时，向下滚动列表时粘性头部将被隐藏，向上滚动时将停靠在列表顶部。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `stickyHeaderIndices`

一个子元素索引数组，确定哪些子元素在滚动时停靠在屏幕顶部。例如，传递 `stickyHeaderIndices={[0]}` 将导致第一个子元素固定在滚动视图的顶部。你也可以使用像 [x,y,z] 这样的方式使多个项目在顶部时粘性。此属性不支持与 `horizontal={true}` 结合使用。

| 类型            |
| --------------- |
| 数字数组 |

---

### `zoomScale` <div className="label ios">iOS</div>

滚动视图内容的当前缩放比例。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `1.0`   |

---

## 方法

### `flashScrollIndicators()`

```tsx
flashScrollIndicators();
```

短暂显示滚动指示器。

---

### `scrollTo()`

```tsx
scrollTo(
  options?: {x?: number, y?: number, animated?: boolean} | number,
  deprecatedX?: number,
  deprecatedAnimated?: boolean,
);
```

滚动到指定的 x, y 偏移量，支持立即滚动或平滑动画滚动。

**示例：**

`scrollTo({x: 0, y: 0, animated: true})`

:::note
奇怪的函数签名是由于历史原因，该函数除了接受选项对象外，还接受单独的参数。由于存在歧义（y 在 x 之前），此用法已弃用，不应使用。
:::

---

### `scrollToEnd()`

```tsx
scrollToEnd(options?: {animated?: boolean});
```

如果是垂直 ScrollView，则滚动到底部。如果是水平 ScrollView，则滚动到右侧。

使用 `scrollToEnd({animated: true})` 进行平滑动画滚动，使用 `scrollToEnd({animated: false})` 进行立即滚动。如果未传递选项，`animated` 默认为 `true`。
