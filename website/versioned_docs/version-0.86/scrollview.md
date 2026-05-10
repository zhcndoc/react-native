---
id: scrollview
title: ScrollView
---

一个包装平台原生 ScrollView 并提供与触摸锁定“响应器”系统集成的组件。

请注意，ScrollView 必须具有有限高度才能正常工作，因为它们会在一个有界容器中包含无界高度的子元素（通过滚动交互）。为了限制 ScrollView 的高度，可以直接设置该视图的高度（不推荐），或者确保所有父视图都有有限高度。忘记将 `{flex: 1}` 逐层传递到视图栈中会在这里导致错误，而元素检查器可以帮助快速调试。

目前还不支持其他被包含的响应器阻止此 scroll view 成为响应器。

`<ScrollView>` 与 [`<FlatList>`](flatlist.md) - 该使用哪个？

`ScrollView` 会一次性渲染其所有 react 子组件，但这会带来性能方面的缺点。

设想你有一个非常长的项目列表需要显示，也许内容长度相当于好几个屏幕。一次性为所有内容创建 JS 组件和原生视图，其中很多内容甚至可能根本不会显示，这会导致渲染变慢并增加内存使用。

这时就轮到 `FlatList` 上场了。`FlatList` 会在项目即将出现时延迟渲染它们，并移除滚动到屏幕外很远的项目，以节省内存和处理时间。

如果你想在项目之间渲染分隔线、多列布局、无限滚动加载，或者其他任何它开箱即用支持的功能，`FlatList` 也很方便。

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

### [View Props](view.md#props)

继承 [View Props](view#props)。

---

### `StickyHeaderComponent`

一个 React 组件，用于渲染粘性头部，应与 `stickyHeaderIndices` 一起使用。如果你的粘性头部使用了自定义变换，你可能需要设置此组件，例如当你希望列表拥有一个可动画且可隐藏的头部时。如果未提供该组件，将使用默认的 [`ScrollViewStickyHeader`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader.js) 组件。

| Type               |
| ------------------ |
| component, element |

---

### `alwaysBounceHorizontal` <div className="label ios">iOS</div>

当为 true 时，即使内容比 ScrollView 本身更小，滚动视图在到达末尾时也会水平回弹。

| Type | Default                                               |
| ---- | ----------------------------------------------------- |
| bool | `true` when `horizontal={true}`<hr/>`false` otherwise |

---

### `alwaysBounceVertical` <div className="label ios">iOS</div>

当为 true 时，即使内容比 ScrollView 本身更小，滚动视图在到达末尾时也会垂直回弹。

| Type | Default |
| ---- | ------- |
| bool | `false` when `horizontal={true}`<hr/>`true` otherwise |

---

### `automaticallyAdjustContentInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整位于导航栏或标签栏/工具栏后方的滚动视图内容内边距。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `automaticallyAdjustKeyboardInsets` <div className="label ios">iOS</div>

控制当键盘改变大小时，ScrollView 是否应自动调整其 `contentInset` 和 `scrollViewInsets`。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `automaticallyAdjustsScrollIndicatorInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整滚动指示器内边距。请参阅 Apple 关于该属性的[文档](https://developer.apple.com/documentation/uikit/uiscrollview/3198043-automaticallyadjustsscrollindica)。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `bounces` <div className="label ios">iOS</div>

当为 true 时，如果内容沿滚动方向的轴大于 ScrollView，本滚动视图在到达内容末尾时会回弹。为 `false` 时，即使 `alwaysBounce*` 属性为 `true`，也会禁用所有回弹。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `bouncesZoom` <div className="label ios">iOS</div>

当为 `true` 时，手势可以将缩放驱动到最小/最大值之外，并且缩放会在手势结束时动画到最小/最大值，否则缩放不会超过限制。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `canCancelContentTouches` <div className="label ios">iOS</div>

当为 `false` 时，一旦开始跟踪，就不会在触摸移动时尝试拖动。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `centerContent` <div className="label ios">iOS</div>

当为 `true` 时，如果内容比 ScrollView 边界更小，滚动视图会自动将内容居中；当内容比 ScrollView 更大时，此属性无效。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `contentContainerStyle`

这些样式将应用于包裹所有子视图的滚动视图内容容器。例如：

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

| Type                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `contentInset` <div className="label ios">iOS</div>

滚动视图内容相对于滚动视图边缘的内缩量。

| Type                                                                 | Default                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `contentInsetAdjustmentBehavior` <div className="label ios">iOS</div>

此属性指定安全区域内边距如何用于修改滚动视图的内容区域。适用于 iOS 11 及更高版本。

| Type                                                           | Default   |
| -------------------------------------------------------------- | --------- |
| enum(`'automatic'`, `'scrollableAxes'`, `'never'`, `'always'`) | `'never'` |

---

### `contentOffset`

用于手动设置起始滚动偏移量。

| Type  | Default        |
| ----- | -------------- |
| Point | `{x: 0, y: 0}` |

---

### `decelerationRate`

一个浮点数，用于确定用户抬起手指后滚动视图减速的速度。你也可以使用字符串快捷值 `"normal"` 和 `"fast"`，它们分别对应底层 iOS 中 `UIScrollViewDecelerationRateNormal` 和 `UIScrollViewDecelerationRateFast` 的设置。

- `'normal'`，iOS 上为 0.998，Android 上为 0.985。
- `'fast'`，iOS 上为 0.99，Android 上为 0.9。

| Type                               | Default    |
| ---------------------------------- | ---------- |
| enum(`'fast'`, `'normal'`), number | `'normal'` |

---

### `directionalLockEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 在拖动时会尝试仅锁定为垂直或水平滚动。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `disableIntervalMomentum`

当为 true 时，无论手势速度如何，滚动视图都会停在下一个索引（相对于释放时的滚动位置）。这可用于分页，当页面宽度小于水平 ScrollView 的宽度或垂直 ScrollView 的高度时尤其有用。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `disableScrollViewPanResponder`

当为 true 时，会禁用 ScrollView 上默认的 JS pan responder，并将 ScrollView 内部触摸的全部控制权交给其子组件。如果启用了 `snapToInterval`，这尤其有用，因为它不遵循典型的触摸模式。不要在没有 `snapToInterval` 的常规 ScrollView 场景中使用此属性，因为它可能会在滚动时导致意外触摸发生。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `endFillColor` <div className="label android">Android</div>

有时 scrollview 占据的空间会大于其内容填充的空间。在这种情况下，该属性会用一种颜色填充 scrollview 的剩余区域，以避免设置背景并产生不必要的过度绘制。这是一种高级优化，在一般情况下并不需要。

| Type            |
| --------------- |
| [color](colors) |

---

### `fadingEdgeLength` <div className="label android">Android</div>

让滚动内容的边缘渐隐。

如果值大于 `0`，将根据当前滚动方向和位置相应设置渐隐边缘，以指示是否还有更多内容可显示。

| Type                                               | Default |
| -------------------------------------------------- | ------- |
| number<hr />object: `{start: number, end: number}` | `0`     |

---

### `horizontal`

当为 `true` 时，滚动视图的子元素会横向排列成一行，而不是纵向排列成一列。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `indicatorStyle` <div className="label ios">iOS</div>

滚动指示器的样式。

- `'default'` 等同于 `black`。
- `'black'`，滚动指示器为 `black`。此样式适合浅色背景。
- `'white'`，滚动指示器为 `white`。此样式适合深色背景。

| Type                                    | Default     |
| --------------------------------------- | ----------- |
| enum(`'default'`, `'black'`, `'white'`) | `'default'` |

---

### `invertStickyHeaders`

如果粘性头部应固定在 ScrollView 底部而不是顶部。通常与反转的 ScrollView 一起使用。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `keyboardDismissMode`

确定在拖动时是否应关闭键盘。

- `'none'`，拖动不会关闭键盘。
- `'on-drag'`，在开始拖动时关闭键盘。

**仅限 iOS**

- `'interactive'`，键盘会随着拖动以交互方式关闭，并与触摸同步移动，向上拖动会取消关闭。在 Android 上不支持此模式，其行为与 `'none'` 相同。

| Type                                                                                                                                                            | Default  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'none'`, `'on-drag'`) <div className="label android">Android</div><hr />enum(`'none'`, `'on-drag'`, `'interactive'`) <div className="label ios">iOS</div> | `'none'` |

---

### `keyboardShouldPersistTaps`

确定在点击后键盘应何时保持可见。

- `'never'`，当键盘弹出时，点击聚焦文本输入框外部会关闭键盘。发生这种情况时，子组件不会收到此次点击。
- `'always'`，键盘不会自动关闭，滚动视图也不会捕获点击，但滚动视图的子组件可以捕获点击。
- `'handled'`，当点击已被滚动视图的子组件处理（或被祖先捕获）时，键盘不会自动关闭。
- `false`，**_已弃用_**，请改用 `'never'`
- `true`，**_已弃用_**，请改用 `'always'`

| Type                                                      | Default   |
| --------------------------------------------------------- | --------- |
| enum(`'always'`, `'never'`, `'handled'`, `false`, `true`) | `'never'` |

---

### `maintainVisibleContentPosition`

设置后，滚动视图会调整滚动位置，使当前可见且位于 `minIndexForVisible` 处或之后的第一个子元素不会改变位置。这对于双向加载内容的列表很有用，例如聊天线程，否则新消息到来可能会导致滚动位置跳动。`0` 是常见值，但也可以使用其他值，例如 `1`，以跳过加载中的指示器或其他不应保持位置的内容。

可选的 `autoscrollToTopThreshold` 可用于在调整完成后，如果用户在调整前处于顶部阈值范围内，则让内容自动滚动到顶部。这对于类似聊天的应用也很有用，你希望看到新消息滚动到位，但如果用户已经向上滚动了一段距离，则不希望因为一次大幅滚动而造成干扰。

注意事项 1：在启用此功能的情况下重新排序 scrollview 中的元素，很可能会导致跳动和卡顿。这个问题可以修复，但目前没有计划进行修复。暂时不要重新排序任何使用此功能的 ScrollView 或 List 内容。

注意事项 2：这会在原生代码中使用 `contentOffset` 和 `frame.origin` 来计算可见性。遮挡、变换以及其他复杂情况不会被纳入内容是否“可见”的判断。

| Type                                                                     |
| ------------------------------------------------------------------------ |
| object: `{minIndexForVisible: number, autoscrollToTopThreshold: number}` |

---

### `maximumZoomScale` <div className="label ios">iOS</div>

允许的最大缩放比例。

| Type   | Default |
| ------ | ------- |
| number | `1.0`   |

---

### `minimumZoomScale` <div className="label ios">iOS</div>

允许的最小缩放比例。

| Type   | Default |
| ------ | ------- |
| number | `1.0`   |

---

### `nestedScrollEnabled` <div className="label android">Android</div>

为 Android API 21 及以上版本启用嵌套滚动。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `onContentSizeChange`

当 ScrollView 的可滚动内容视图发生变化时调用。

处理函数会接收两个参数：内容宽度和内容高度 `(contentWidth, contentHeight)`。

它是使用附加到该 ScrollView 所渲染内容容器上的 onLayout 处理函数实现的。

| Type     |
| -------- |
| function |

---

### `onMomentumScrollBegin`

当动量滚动开始时调用（即 ScrollView 开始滑行时发生的滚动）。

| Type     |
| -------- |
| function |

---

### `onMomentumScrollEnd`

当动量滚动结束时调用（即 ScrollView 滑行并停止时发生的滚动）。

| Type     |
| -------- |
| function |

---

### `onScroll`

滚动期间每帧最多触发一次。事件具有以下形状（所有未指定类型的值都是数字）：

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
    // 仅限 iOS
    targetContentOffset: {x, y}
  }
}
```

| Type     |
| -------- |
| function |

---

### `onScrollBeginDrag`

当用户开始拖动滚动视图时调用。

| Type     |
| -------- |
| function |

---

### `onScrollEndDrag`

当用户停止拖动滚动视图，并且它要么停止要么开始滑行时调用。

| Type     |
| -------- |
| function |

---

### `onScrollToTop` <div className="label ios">iOS</div>

当状态栏被点击后滚动视图滚动到顶部时触发。

| Type     |
| -------- |
| function |

---

### `overScrollMode` <div className="label android">Android</div>

用于覆盖 overScroll 模式的默认值。

可能的值：

- `'auto'` - 仅当内容足够大、能够有意义地滚动时，允许用户对该视图进行过度滚动。
- `'always'` - 始终允许用户对该视图进行过度滚动。
- `'never'` - 从不允许用户对该视图进行过度滚动。

| Type                                  | Default  |
| ------------------------------------- | -------- |
| enum(`'auto'`, `'always'`, `'never'`) | `'auto'` |

---

### `pagingEnabled`

当为 true 时，滚动时滚动视图会停在其尺寸的整数倍位置。这可用于水平分页。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `persistentScrollbar` <div className="label android">Android</div>

使滚动条在不使用时不会变为透明。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `pinchGestureEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 允许使用捏合手势进行放大和缩小。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `refreshControl`

一个 RefreshControl 组件，用于为 ScrollView 提供下拉刷新功能。仅适用于垂直 ScrollView（`horizontal` 属性必须为 `false`）。

参见 [RefreshControl](refreshcontrol)。

| Type    |
| ------- |
| element |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致 bug（内容缺失）——请自行承担风险。
:::

当为 `true` 时，屏幕外的子视图在离开屏幕后会从其原生宿主父视图中移除。这可能会提升大型列表的滚动性能。在 Android 上默认值为 `true`。

| Type    |
| ------- |
| boolean |

---

### `scrollEnabled`

当为 false 时，视图不能通过触摸交互滚动。

请注意，仍然可以通过调用 `scrollTo` 来滚动视图。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `scrollEventThrottle`

限制滚动时触发滚动事件的频率，以毫秒为单位指定时间间隔。当响应滚动执行开销较大的工作时，这可能会很有用。值 &le; `16` 将禁用节流，无论设备刷新率如何。

| Type   | Default |
| ------ | ------- |
| number | `0`     |

---

### `scrollIndicatorInsets` <div className="label ios">iOS</div>

滚动视图指示器相对于滚动视图边缘的内缩量。通常应将其设置为与 `contentInset` 相同的值。

| Type                                                                 | Default                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `scrollPerfTag` <div className="label android">Android</div>

用于记录此 scroll view 滚动性能的标签。会强制开启动量事件（参见 sendMomentumEvents）。它默认不会起任何作用，你需要实现一个自定义原生 FpsListener 才能使其有用。

| Type   |
| ------ |
| string |

---

### `scrollToOverflowEnabled` <div className="label ios">iOS</div>

当为 `true` 时，可以通过程序化方式将滚动视图滚动到超出其内容大小的范围。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `scrollsToTop` <div className="label ios">iOS</div>

当为 `true` 时，点击状态栏会使滚动视图滚动到顶部。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `showsHorizontalScrollIndicator`

当为 `true` 时，显示水平滚动指示器。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `showsVerticalScrollIndicator`

当为 `true` 时，显示垂直滚动指示器。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `snapToAlignment`

当设置了 `snapToInterval` 时，`snapToAlignment` 将定义吸附与滚动视图之间的关系。

可能的值：

- `'start'` 会将吸附对齐到左侧（水平）或顶部（垂直）。
- `'center'` 会将吸附对齐到中心。
- `'end'` 会将吸附对齐到右侧（水平）或底部（垂直）。

| Type                                 | Default   |
| ------------------------------------ | --------- |
| enum(`'start'`, `'center'`, `'end'`) | `'start'` |

---

### `snapToEnd`

与 `snapToOffsets` 配合使用。默认情况下，列表末尾会算作一个吸附偏移量。将 `snapToEnd` 设为 false 可禁用此行为，并允许列表在末尾与最后一个 `snapToOffsets` 偏移量之间自由滚动。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `snapToInterval`

设置后，滚动视图会停在 `snapToInterval` 值的整数倍位置。这可用于对长度小于滚动视图的子元素进行分页。通常与 `snapToAlignment` 和 `decelerationRate="fast"` 结合使用。会覆盖配置较少的 `pagingEnabled` 属性。

| Type   |
| ------ |
| number |

---

### `snapToOffsets`

设置后，滚动视图会停在定义的偏移位置。这可用于对各种不同尺寸、且长度小于滚动视图的子元素进行分页。通常与 `decelerationRate="fast"` 结合使用。会覆盖配置较少的 `pagingEnabled` 和 `snapToInterval` 属性。

| Type            |
| --------------- |
| array of number |

---

### `snapToStart`

与 `snapToOffsets` 配合使用。默认情况下，列表开头会算作一个吸附偏移量。将 `snapToStart` 设为 `false` 可禁用此行为，并允许列表在开头与第一个 `snapToOffsets` 偏移量之间自由滚动。

| Type | Default |
| ---- | ------- |
| bool | `true`  |

---

### `stickyHeaderHiddenOnScroll`

设置为 `true` 时，滚动列表向下时粘性头部会隐藏，而向上滚动时会固定在列表顶部。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `stickyHeaderIndices`

一个子元素索引数组，用于确定在滚动时哪些子元素会固定到屏幕顶部。例如，传入 `stickyHeaderIndices={[0]}` 会使第一个子元素固定在滚动视图顶部。你也可以像 `[x,y,z]` 这样使用，使多个项目在位于顶部时保持粘性。此属性不支持与 `horizontal={true}` 同时使用。

| Type            |
| --------------- |
| array of number |

---

### `zoomScale` <div className="label ios">iOS</div>

滚动视图内容当前的缩放比例。

| Type   | Default |
| ------ | ------- |
| number | `1.0`   |

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

将内容滚动到给定的 x、y 偏移位置，可以立即滚动，也可以平滑动画滚动。

**示例：**

`scrollTo({x: 0, y: 0, animated: true})`

:::note
这个奇怪的函数签名是因为出于历史原因，该函数也接受单独的参数作为选项对象的替代方式。由于存在歧义（y 在 x 之前），这已被弃用，不应使用。
:::

---

### `scrollToEnd()`

```tsx
scrollToEnd(options?: {animated?: boolean});
```

如果这是一个垂直的 ScrollView，则滚动到底部。如果这是一个水平的 ScrollView，则滚动到右侧。

使用 `scrollToEnd({animated: true})` 进行平滑动画滚动，使用 `scrollToEnd({animated: false})` 进行立即滚动。如果未传入任何选项，`animated` 默认为 `true`。
