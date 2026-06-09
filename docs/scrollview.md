---
id: scrollview
title: 滚动视图
---

一个封装平台原生 ScrollView 并提供与触摸锁定“responder”系统集成的组件。

请记住，ScrollView 要正常工作必须具有有界高度，因为它会通过滚动交互将无限高度的子元素放入一个有界容器中。要限制 ScrollView 的高度，可以直接设置视图的高度（不推荐），或者确保所有父视图都具有有界高度。忘记在视图层级中向下传递 `{flex: 1}` 可能会在这里导致错误，而元素检查器可以帮助你快速调试这些问题。

目前还不支持让其他已包含的 responder 阻止该 ScrollView 成为 responder。

`<ScrollView>` 与 [`<FlatList>`](flatlist.md) - 该用哪一个？

`ScrollView` 会一次性渲染所有 React 子组件，但这会带来性能上的缺点。

设想你有一个很长的项目列表想要显示，可能足够占满好几个屏幕。一次性为所有内容创建 JS 组件和原生视图，其中很多甚至可能根本不会显示，会导致渲染变慢并增加内存占用。

这时就该 `FlatList` 登场了。`FlatList` 会在项目即将显示时按需渲染，并移除滚动到屏幕之外很远的项目，以节省内存和处理时间。

如果你希望在项目之间渲染分隔线、使用多列、实现无限滚动加载，或者利用它开箱即用支持的其他各种特性，`FlatList` 也非常方便。

## 示例

```SnackPlayer name=ScrollView%20Example
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
          culpa qui deserunt mollit anim id est laborum.
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

一个 React 组件，用于渲染粘性标题，应与 `stickyHeaderIndices` 一起使用。如果你的粘性标题使用了自定义变换，可能需要设置此组件，例如当你希望列表拥有一个可动画和可隐藏的标题时。如果未提供该组件，将使用默认的 [`ScrollViewStickyHeader`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader.js) 组件。

| 类型               |
| ------------------ |
| component, element |

---

### `alwaysBounceHorizontal` <div className="label ios">iOS</div>

当为 true 时，即使内容比 ScrollView 本身更小，滚动视图在到达末尾时也会水平回弹。

| 类型 | 默认值                                               |
| ---- | ----------------------------------------------------- |
| bool | `horizontal={true}` 时为 `true`<hr/>否则为 `false` |

---

### `alwaysBounceVertical` <div className="label ios">iOS</div>

当为 true 时，即使内容比 ScrollView 本身更小，滚动视图在到达末尾时也会垂直回弹。

| 类型 | 默认值                                               |
| ---- | ----------------------------------------------------- |
| bool | `horizontal={true}` 时为 `false`<hr/>否则为 `true` |

---

### `automaticallyAdjustContentInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整位于导航栏或标签栏/工具栏后面的滚动视图的内容 inset。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `automaticallyAdjustKeyboardInsets` <div className="label ios">iOS</div>

控制当键盘改变尺寸时，ScrollView 是否应自动调整其 `contentInset` 和 `scrollViewInsets`。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `automaticallyAdjustsScrollIndicatorInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整滚动指示器的 inset。请参阅 Apple 关于该属性的[文档](https://developer.apple.com/documentation/uikit/uiscrollview/3198043-automaticallyadjustsscrollindica)。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `bounces` <div className="label ios">iOS</div>

当为 true 时，如果内容沿滚动方向的轴比 ScrollView 更大，滚动视图在到达内容末尾时会回弹。当为 false 时，即使 `alwaysBounce*` 属性为 `true`，也会禁用所有回弹。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `bouncesZoom` <div className="label ios">iOS</div>

当为 `true` 时，手势可以驱动缩放超过最小/最大值，并且在手势结束时会动画到最小/最大值；否则缩放不会超过限制。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `canCancelContentTouches` <div className="label ios">iOS</div>

当为 `false` 时，一旦开始跟踪，就不会尝试在触摸移动时拖拽。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `centerContent` <div className="label ios">iOS</div>

当为 `true` 时，如果内容小于 ScrollView 的边界，滚动视图会自动将内容居中；当内容大于 ScrollView 时，此属性无效。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

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

滚动视图内容距滚动视图边缘的内缩量。

| 类型                                                                 | 默认值                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `contentInsetAdjustmentBehavior` <div className="label ios">iOS</div>

此属性指定安全区域 inset 如何用于修改滚动视图的内容区域。适用于 iOS 11 及更高版本。

| 类型                                                           | 默认值   |
| -------------------------------------------------------------- | --------- |
| enum(`'automatic'`, `'scrollableAxes'`, `'never'`, `'always'`) | `'never'` |

---

### `contentOffset`

用于手动设置起始滚动偏移量。

| 类型  | 默认值        |
| ----- | -------------- |
| Point | `{x: 0, y: 0}` |

---

### `decelerationRate`

一个浮点数，用于决定用户抬起手指后滚动视图减速的速度。你也可以使用字符串快捷值 `"normal"` 和 `"fast"`，它们分别对应底层 iOS 设置中的 `UIScrollViewDecelerationRateNormal` 和 `UIScrollViewDecelerationRateFast`。

- `'normal'` 在 iOS 上为 0.998，在 Android 上为 0.985。
- `'fast'` 在 iOS 上为 0.99，在 Android 上为 0.9。

| 类型                               | 默认值    |
| ---------------------------------- | ---------- |
| enum(`'fast'`, `'normal'`), number | `'normal'` |

---

### `directionalLockEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 会尝试在拖动时只锁定为垂直或水平滚动。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `disableIntervalMomentum`

当为 true 时，无论手势多快，滚动视图都会停在下一个索引位置（相对于松手时的滚动位置）。当页面宽度小于水平 ScrollView 的宽度，或页面高度小于垂直 ScrollView 的高度时，可用于分页。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `disableScrollViewPanResponder`

当为 true 时，会禁用 ScrollView 上默认的 JS pan responder，ScrollView 内部触摸的完全控制权会交给其子组件。尤其在启用 `snapToInterval` 时非常有用，因为它不遵循典型的触摸模式。若未启用 `snapToInterval`，不要在普通 ScrollView 场景下使用此属性，否则在滚动时可能会触发意外的触摸事件。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `endFillColor` <div className="label android">Android</div>

有时 ScrollView 占用的空间会大于其内容填充的空间。在这种情况下，此属性会用一种颜色填充 ScrollView 剩余区域，以避免设置背景并产生不必要的过度绘制。这是一项高级优化，在一般情况下并不需要。

| 类型            |
| --------------- |
| [颜色](colors) |

---

### `fadingEdgeLength` <div className="label android">Android</div>

使滚动内容的边缘淡出。

如果该值大于 `0`，则会根据当前滚动方向和位置相应地设置淡出边缘，以指示是否还有更多内容可显示。

| 类型                                               | 默认值 |
| -------------------------------------------------- | ------- |
| number<hr />object: `{start: number, end: number}` | `0`     |

---

### `horizontal`

当为 `true` 时，滚动视图的子元素会按行水平排列，而不是按列垂直排列。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `indicatorStyle` <div className="label ios">iOS</div>

滚动指示器的样式。

- `'default'` 与 `black` 相同。
- `'black'`，滚动指示器为 `black`。这种样式适合浅色背景。
- `'white'`，滚动指示器为 `white`。这种样式适合深色背景。

| 类型                                    | 默认值     |
| --------------------------------------- | ----------- |
| enum(`'default'`, `'black'`, `'white'`) | `'default'` |

---

### `invertStickyHeaders`

如果应让粘性标题固定在 ScrollView 底部而不是顶部。通常与反向 ScrollView 一起使用。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `keyboardDismissMode`

决定键盘是否会响应拖动而被关闭。

- `'none'`，拖动不会关闭键盘。
- `'on-drag'`，在拖动开始时键盘会被关闭。

**仅限 iOS**

- `'interactive'`，键盘会随着拖动以交互方式被关闭，并与触摸同步移动，向上拖动会取消关闭。在 Android 上不支持该模式，其行为与 `'none'` 相同。

| 类型                                                                                                                                                            | 默认值  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'none'`, `'on-drag'`) <div className="label android">Android</div><hr />enum(`'none'`, `'on-drag'`, `'interactive'`) <div className="label ios">iOS</div> | `'none'` |

---

### `keyboardShouldPersistTaps`

决定在点击后键盘应何时保持可见。

- `'never'`，当键盘弹出时，点击聚焦文本输入框之外的区域会关闭键盘。发生这种情况时，子组件不会收到该点击。
- `'always'`，键盘不会自动关闭，滚动视图也不会拦截点击，但滚动视图的子组件可以接收点击。
- `'handled'`，如果该点击已被滚动视图的子组件处理（或被祖先捕获），键盘不会自动关闭。
- `false`，**_已废弃_**，请改用 `'never'`
- `true`，**_已废弃_**，请改用 `'always'`

| 类型                                                      | 默认值   |
| --------------------------------------------------------- | --------- |
| enum(`'always'`, `'never'`, `'handled'`, `false`, `true`) | `'never'` |

---

### `maintainVisibleContentPosition`

设置后，滚动视图会调整滚动位置，使当前可见且索引大于或等于 `minIndexForVisible` 的第一个子元素不会改变位置。这对于双向加载内容的列表非常有用，例如聊天线程；否则新消息的到来可能会导致滚动位置跳动。`0` 是常见值，但也可以使用其他值，例如 `1`，以跳过加载指示器或其他不应保持位置的内容。

可选的 `autoscrollToTopThreshold` 可用于在调整后让内容自动滚动到顶部，前提是用户在调整之前距离顶部仍在阈值范围内。这对于类似聊天的应用也很有用：你希望看到新消息滚动到位，但如果用户已经向上滚动了一段距离，此时再强行滚动回去会造成干扰。

注意事项 1：在启用此功能时对 scrollview 中的元素重新排序，可能会导致明显的跳动和卡顿。这个问题理论上可以修复，但目前没有计划处理。就目前而言，不要对使用此功能的任何 ScrollView 或 List 的内容重新排序。

注意事项 2：这会使用原生代码中的 `contentOffset` 和 `frame.origin` 来计算可见性。遮挡、变换以及其他复杂情况不会被纳入“是否可见”的判断。

| 类型                                                                     |
| ------------------------------------------------------------------------ |
| object: `{minIndexForVisible: number, autoscrollToTopThreshold: number}` |

---

### `maximumZoomScale` <div className="label ios">iOS</div>

允许的最大缩放比例。

| 类型   | 默认值 |
| ------ | ------- |
| number | `1.0`   |

---

### `minimumZoomScale` <div className="label ios">iOS</div>

允许的最小缩放比例。

| 类型   | 默认值 |
| ------ | ------- |
| number | `1.0`   |

---

### `nestedScrollEnabled` <div className="label android">Android</div>

为 Android API 21+ 启用嵌套滚动。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `onContentSizeChange`

当 ScrollView 的可滚动内容视图发生变化时调用。

处理函数将接收两个参数：内容宽度和内容高度 `(contentWidth, contentHeight)`。

它通过附加到该 ScrollView 所渲染的内容容器上的 onLayout 处理函数来实现。

| 类型     |
| -------- |
| function |

---

### `onMomentumScrollBegin`

当动量滚动开始时调用（即 ScrollView 开始滑行时发生的滚动）。

| 类型     |
| -------- |
| function |

---

### `onMomentumScrollEnd`

当动量滚动结束时调用（即 ScrollView 滑行停止时发生的滚动）。

| 类型     |
| -------- |
| function |

---

### `onScroll`

滚动过程中每帧最多触发一次。该事件具有以下结构（所有未指定类型的值都是数字）：

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

| 类型     |
| -------- |
| function |

---

### `onScrollBeginDrag`

当用户开始拖动滚动视图时调用。

| 类型     |
| -------- |
| function |

---

### `onScrollEndDrag`

当用户停止拖动滚动视图，而滚动视图要么停止、要么开始滑行时调用。

| 类型     |
| -------- |
| function |

---

### `onScrollToTop` <div className="label ios">iOS</div>

当状态栏被点击后滚动视图滚动到顶部时触发。

| 类型     |
| -------- |
| function |

---

### `overScrollMode` <div className="label android">Android</div>

用于覆盖 overScroll 模式的默认值。

可选值：

- `'auto'` - 只有当内容足够大、可以有意义地滚动时，才允许用户对该视图进行超滚动。
- `'always'` - 始终允许用户对该视图进行超滚动。
- `'never'` - 从不允许用户对该视图进行超滚动。

| 类型                                  | 默认值  |
| ------------------------------------- | -------- |
| enum(`'auto'`, `'always'`, `'never'`) | `'auto'` |

---

### `pagingEnabled`

当为 true 时，滚动视图在滚动时会停在其尺寸的整数倍位置。可用于水平分页。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `persistentScrollbar` <div className="label android">Android</div>

使滚动条在不使用时不会变为透明。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `pinchGestureEnabled` <div className="label ios">iOS</div>

当为 true 时，ScrollView 允许使用捏合手势进行放大和缩小。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `refreshControl`

一个 RefreshControl 组件，用于为 ScrollView 提供下拉刷新功能。仅适用于垂直 ScrollView（`horizontal` 属性必须为 `false`）。

参见 [RefreshControl](refreshcontrol)。

| 类型    |
| ------- |
| element |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致 bug（内容缺失）——风险自担。
:::

当为 `true` 时，屏幕外的子视图在离开屏幕后会从其原生承载的父视图中移除。这可能会提升大型列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `scrollEnabled`

当为 false 时，视图无法通过触摸交互滚动。

注意，仍然可以通过调用 `scrollTo` 来滚动视图。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `scrollEventThrottle`

限制滚动时触发滚动事件的频率，单位为毫秒。当滚动响应中需要执行开销较大的工作时，这可能很有用。值 &le; `16` 将禁用节流，无论设备刷新率如何。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |

---

### `scrollIndicatorInsets` <div className="label ios">iOS</div>

滚动视图指示器距滚动视图边缘的内缩量。通常应设置为与 `contentInset` 相同的值。

| 类型                                                                 | 默认值                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `scrollPerfTag` <div className="label android">Android</div>

用于记录此 ScrollView 的滚动性能的标签。会强制开启动量事件（见 sendMomentumEvents）。默认情况下它不会起任何作用，若要让它有用，你需要实现一个自定义原生 FpsListener。

| 类型   |
| ------ |
| string |

---

### `scrollsChildToFocus` <div className="label android">Android</div>

当为 `true` 时，ScrollView 会自动滚动以将获得焦点的子元素带入视图。将其设置为 `false` 可禁用此行为，并在焦点变化时手动控制滚动位置。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `scrollToOverflowEnabled` <div className="label ios">iOS</div>

当为 `true` 时，滚动视图可以通过编程方式滚动到超出其内容尺寸的区域。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `scrollsToTop` <div className="label ios">iOS</div>

当为 `true` 时，点击状态栏会让滚动视图滚动到顶部。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `showsHorizontalScrollIndicator`

当为 `true` 时，显示水平滚动指示器。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `showsVerticalScrollIndicator`

当为 `true` 时，显示垂直滚动指示器。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `snapToAlignment`

当设置了 `snapToInterval` 时，`snapToAlignment` 将定义吸附与 ScrollView 的关系。

可选值：

- `'start'` 会将吸附对齐到左侧（水平）或顶部（垂直）。
- `'center'` 会将吸附对齐到中心。
- `'end'` 会将吸附对齐到右侧（水平）或底部（垂直）。

| 类型                                 | 默认值   |
| ------------------------------------ | --------- |
| enum(`'start'`, `'center'`, `'end'`) | `'start'` |

---

### `snapToEnd`

与 `snapToOffsets` 配合使用。默认情况下，列表末尾会被视为一个吸附偏移量。将 `snapToEnd` 设置为 false 可禁用此行为，并允许列表在末尾与最后一个 `snapToOffsets` 偏移量之间自由滚动。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `snapToInterval`

设置后，滚动视图会停在 `snapToInterval` 值的整数倍位置。可用于对长度小于滚动视图的子元素进行分页。通常与 `snapToAlignment` 和 `decelerationRate="fast"` 一起使用。会覆盖配置较少的 `pagingEnabled` 属性。

| 类型   |
| ------ |
| number |

---

### `snapToOffsets`

设置后，滚动视图会停在定义的偏移位置。可用于对不同尺寸、且长度小于滚动视图的子元素进行分页。通常与 `decelerationRate="fast"` 一起使用。会覆盖配置较少的 `pagingEnabled` 和 `snapToInterval` 属性。

| 类型            |
| --------------- |
| array of number |

---

### `snapToStart`

与 `snapToOffsets` 配合使用。默认情况下，列表开头会被视为一个吸附偏移量。将 `snapToStart` 设置为 `false` 可禁用此行为，并允许列表在起始位置与第一个 `snapToOffsets` 偏移量之间自由滚动。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `stickyHeaderHiddenOnScroll`

当设置为 `true` 时，粘性标题在向下滚动列表时会隐藏，在向上滚动时会停靠到列表顶部。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `stickyHeaderIndices`

一个子元素索引数组，用于决定滚动时哪些子元素会停靠到屏幕顶部。例如，传入 `stickyHeaderIndices={[0]}` 会使第一个子元素固定到滚动视图顶部。你也可以使用 `[x,y,z]` 让多个项目在位于顶部时变为粘性。此属性不支持与 `horizontal={true}` 一起使用。

| 类型            |
| --------------- |
| array of number |

---

### `zoomScale` <div className="label ios">iOS</div>

滚动视图内容的当前缩放比例。

| 类型   | 默认值 |
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

将内容滚动到指定的 x、y 偏移位置，可立即执行，也可使用平滑动画。

**示例：**

`scrollTo({x: 0, y: 0, animated: true})`

:::note
这个奇怪的函数签名是因为出于历史原因，该函数除了接受选项对象外，也接受单独的参数作为替代方式。由于存在歧义（y 在 x 之前），这已被弃用，不应使用。
:::

---

### `scrollToEnd()`

```tsx
scrollToEnd(options?: {animated?: boolean});
```

如果这是一个垂直的 ScrollView，则滚动到底部。如果这是一个水平的 ScrollView，则滚动到右侧。

使用 `scrollToEnd({animated: true})` 可进行平滑动画滚动，使用 `scrollToEnd({animated: false})` 可立即滚动。如果未传入任何选项，`animated` 默认为 `true`。
