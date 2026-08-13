---
id: scrollview
title: ScrollView
---

封装平台 ScrollView，同时提供与触摸锁定“responder”系统的集成

请注意，ScrollView 必须具有有界高度才能正常工作，因为它们通过滚动交互将具有无界高度的子元素放入有界容器中。要限制 ScrollView 的高度，可以直接设置视图的高度（不建议），或者确保所有父视图都具有有界高度。忘记将 `{flex: 1}` 传递到视图层级中可能会导致此处出现错误，而元素检查器可以帮助快速调试此问题

目前还不支持其他包含的 responder 阻止此滚动视图成为 responder

`<ScrollView>` 与 [`<FlatList>`](flatlist.md)——应该使用哪一个？

`ScrollView` 会一次性渲染所有 React 子组件，但这会带来性能方面的影响

假设你有一个非常长的项目列表想要显示，可能包含好几屏内容。一次性为所有内容创建 JS 组件和原生视图，其中很多内容甚至可能不会显示，这会导致渲染变慢并增加内存使用量

这正是 `FlatList` 发挥作用的地方。`FlatList` 会在项目即将出现时延迟渲染，并移除滚动到屏幕之外很远的项目，以节省内存和处理时间

如果你想在项目之间渲染分隔线、使用多列、进行无限滚动加载，或使用它开箱即用支持的其他任何功能，`FlatList` 同样很方便

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

继承 [View 属性](view#props)

---

### `StickyHeaderComponent`

用于渲染粘性标题的 React Component，应与 `stickyHeaderIndices` 一起使用。如果粘性标题使用了自定义变换，例如希望列表具有动画效果且可隐藏的标题，则可能需要设置此组件。如果未提供组件，将使用默认的 [`ScrollViewStickyHeader`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader.js) 组件

| 类型               |
| ------------------ |
| component, element |

---

### `alwaysBounceHorizontal` <div className="label ios">iOS</div>

为 `true` 时，即使内容小于滚动视图本身，滚动视图在到达末尾时也会水平回弹

| 类型 | 默认值                                                 |
| ---- | ------------------------------------------------------ |
| bool | `horizontal={true}` 时为 `true`<hr/>其他情况为 `false` |

---

### `alwaysBounceVertical` <div className="label ios">iOS</div>

为 `true` 时，即使内容小于滚动视图本身，滚动视图在到达末尾时也会垂直回弹

| 类型 | 默认值                                                 |
| ---- | ------------------------------------------------------ |
| bool | `horizontal={true}` 时为 `false`<hr/>其他情况为 `true` |

---

### `automaticallyAdjustContentInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整放置在导航栏或标签栏／工具栏后面的滚动视图的内容内边距

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `automaticallyAdjustKeyboardInsets` <div className="label ios">iOS</div>

控制 ScrollView 是否应在键盘尺寸发生变化时自动调整其 `contentInset` 和 `scrollViewInsets`

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `automaticallyAdjustsScrollIndicatorInsets` <div className="label ios">iOS</div>

控制 iOS 是否应自动调整滚动指示器内边距。请参阅 Apple 的[属性文档](https://developer.apple.com/documentation/uikit/uiscrollview/3198043-automaticallyadjustsscrollindica)

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `bounces` <div className="label ios">iOS</div>

为 `true` 时，如果内容在滚动方向上的尺寸大于滚动视图，滚动视图在到达内容末尾时会回弹。为 `false` 时，即使 `alwaysBounce*` 属性为 `true`，也会禁用所有回弹

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `bouncesZoom` <div className="label ios">iOS</div>

为 `true` 时，手势可以将缩放驱动到最小值／最大值之外，并且缩放会在手势结束时动画回到最小值／最大值；否则缩放不会超出限制

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `canCancelContentTouches` <div className="label ios">iOS</div>

为 `false` 时，一旦开始跟踪，即使触摸发生移动，也不会尝试拖动

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `centerContent` <div className="label ios">iOS</div>

为 `true` 时，当内容小于滚动视图边界时，滚动视图会自动将内容居中；当内容大于滚动视图时，此属性不起作用

| 类型 | 默认值  |
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

| 类型                          |
| ----------------------------- |
| [View 样式](view-style-props) |

---

### `contentInset` <div className="label ios">iOS</div>

滚动视图内容与滚动视图边缘之间的内嵌距离

| 类型                                                                 | 默认值                                   |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `contentInsetAdjustmentBehavior` <div className="label ios">iOS</div>

此属性指定如何使用安全区域内边距来修改滚动视图的内容区域。iOS 11 及更高版本可用

| 类型                                                           | 默认值    |
| -------------------------------------------------------------- | --------- |
| enum(`'automatic'`, `'scrollableAxes'`, `'never'`, `'always'`) | `'never'` |

---

### `contentOffset`

用于手动设置初始滚动偏移量

| 类型  | 默认值         |
| ----- | -------------- |
| Point | `{x: 0, y: 0}` |

---

### `decelerationRate`

用于确定用户抬起手指后滚动视图减速速度的浮点数。也可以使用字符串快捷方式 `"normal"` 和 `"fast"`，它们分别对应底层 iOS 设置 `UIScrollViewDecelerationRateNormal` 和 `UIScrollViewDecelerationRateFast`

- `'normal'`：iOS 上为 0.998，Android 上为 0.985
- `'fast'`：iOS 上为 0.99，Android 上为 0.9

| 类型                               | 默认值     |
| ---------------------------------- | ---------- |
| enum(`'fast'`, `'normal'`)，number | `'normal'` |

---

### `directionalLockEnabled` <div className="label ios">iOS</div>

为 `true` 时，ScrollView 会在拖动时尝试锁定为仅垂直滚动或仅水平滚动

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `disableIntervalMomentum`

为 `true` 时，无论手势速度如何，滚动视图都会停在下一个索引处（相对于释放时的滚动位置）。当页面小于水平 ScrollView 的宽度或垂直 ScrollView 的高度时，可以使用此属性进行分页

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `disableScrollViewPanResponder`

为 `true` 时，ScrollView 上默认的 JS pan responder 会被禁用，ScrollView 内部触摸的完全控制权将交给其子组件。当启用 `snapToInterval` 时，此属性尤其有用，因为它不遵循典型的触摸模式。在没有 `snapToInterval` 的常规 ScrollView 使用场景中不要使用此属性，否则滚动时可能发生意外触摸

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `endFillColor` <div className="label android">Android</div>

有时滚动视图占用的空间会大于其内容填充的空间。在这种情况下，此属性会用一种颜色填充滚动视图的剩余部分，从而避免设置背景并产生不必要的过度绘制。这是一项高级优化，通常情况下不需要使用

| 类型           |
| -------------- |
| [颜色](colors) |

---

### `fadingEdgeLength` <div className="label android">Android</div>

淡出滚动内容的边缘

如果值大于 `0`，则会根据当前滚动方向和位置相应设置渐隐边缘，以指示是否还有更多内容可显示

| 类型                                               | 默认值 |
| -------------------------------------------------- | ------ |
| number<hr />object: `{start: number, end: number}` | `0`    |

---

### `horizontal`

为 `true` 时，滚动视图的子元素会水平排列成一行，而不是垂直排列成一列

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `indicatorStyle` <div className="label ios">iOS</div>

滚动指示器的样式

- `'default'`：与 `black` 相同
- `'black'`：滚动指示器为 `black`。此样式适用于浅色背景
- `'white'`：滚动指示器为 `white`。此样式适用于深色背景

| 类型                                    | 默认值      |
| --------------------------------------- | ----------- |
| enum(`'default'`, `'black'`, `'white'`) | `'default'` |

---

### `invertStickyHeaders`

粘性标题是否应固定在底部而不是顶部 ScrollView。这通常与反向 ScrollView 一起使用

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `keyboardDismissMode`

确定键盘是否会响应拖动而关闭

- `'none'`：拖动不会关闭键盘
- `'on-drag'`：拖动开始时关闭键盘

**仅限 iOS**

- `'interactive'`：键盘会随拖动以交互方式关闭，并与触摸同步移动；向上拖动会取消关闭。在 Android 上不支持此选项，其行为与 `'none'` 相同

| 类型                                                                                                                                                            | 默认值   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'none'`，`'on-drag'`) <div className="label android">Android</div><hr />enum(`'none'`，`'on-drag'`，`'interactive'`) <div className="label ios">iOS</div> | `'none'` |

---

### `keyboardShouldPersistTaps`

确定点击后键盘何时应保持可见

- `'never'`：键盘弹出时，点击已聚焦文本输入框之外的区域会关闭键盘。发生这种情况时，子元素不会收到点击事件
- `'always'`：键盘不会自动关闭，滚动视图也不会捕获点击，但滚动视图的子元素可以捕获点击
- `'handled'`：当点击由滚动视图的子元素处理（或由祖先捕获）时，键盘不会自动关闭

| 类型                                     | 默认值    |
| ---------------------------------------- | --------- |
| enum(`'always'`, `'never'`, `'handled'`) | `'never'` |

---

### `maintainVisibleContentPosition`

设置后，滚动视图会调整滚动位置，使当前可见且索引大于或等于 `minIndexForVisible` 的第一个子元素位置保持不变。这对于双向加载内容的列表很有用，例如聊天线程，因为新消息到达时可能会导致滚动位置跳动。通常使用值 0，但也可以使用 1 等其他值，以跳过加载指示器或其他不应保持位置的内容

可选的 `autoscrollToTopThreshold` 可用于在调整后自动将内容滚动到顶部，前提是用户在调整之前位于距离顶部阈值范围内。这对于类似聊天的应用也很有用：你希望看到新消息滚动到位，但如果用户已经向上滚动了一段距离，则不希望滚动大量内容造成干扰

注意事项 1：启用此功能后，在滚动视图中重新排序元素可能会导致跳动和卡顿。此问题可以修复，但目前没有相关计划。目前，请不要对使用此功能的任何 ScrollView 或 List 的内容重新排序

注意事项 2：此功能在原生代码中使用 `contentOffset` 和 `frame.origin` 来计算可见性。关于内容是否“可见”，不会考虑遮挡、变换和其他复杂因素

| 类型                                                                     |
| ------------------------------------------------------------------------ |
| object: `{minIndexForVisible: number, autoscrollToTopThreshold: number}` |

---

### `maximumZoomScale` <div className="label ios">iOS</div>

允许的最大缩放比例

| 类型   | 默认值 |
| ------ | ------ |
| number | `1.0`  |

---

### `minimumZoomScale` <div className="label ios">iOS</div>

允许的最小缩放比例

| 类型   | 默认值 |
| ------ | ------ |
| number | `1.0`  |

---

### `nestedScrollEnabled` <div className="label android">Android</div>

为 Android API level 21 及更高版本启用嵌套滚动

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `onContentSizeChange`

当 ScrollView 的可滚动内容视图发生变化时调用

处理函数会接收两个参数：内容宽度和内容高度 `(contentWidth, contentHeight)`

它通过附加到 ScrollView 所渲染内容容器的 onLayout 处理函数实现

| 类型     |
| -------- |
| function |

---

### `onMomentumScrollBegin`

动量滚动开始时调用（即 ScrollView 开始滑行时发生的滚动）

| 类型     |
| -------- |
| function |

---

### `onMomentumScrollEnd`

动量滚动结束时调用（即 ScrollView 滑行至停止时发生的滚动）

| 类型     |
| -------- |
| function |

---

### `onScroll`

滚动期间每帧最多触发一次。事件结构如下（未指定类型的所有值均为数字）：

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
| function |

---

### `onScrollBeginDrag`

用户开始拖动滚动视图时调用

| 类型     |
| -------- |
| function |

---

### `onScrollEndDrag`

用户停止拖动滚动视图，并且滚动视图停止或开始滑行时调用

| 类型     |
| -------- |
| function |

---

### `onScrollToTop` <div className="label ios">iOS</div>

点击状态栏后滚动视图滚动到顶部时触发

| 类型     |
| -------- |
| function |

---

### `overScrollMode` <div className="label android">Android</div>

用于覆盖 overScroll 模式的默认值

可能的值：

- `'auto'`——仅当内容足够大、能够进行有意义的滚动时，才允许用户对该视图进行过度滚动
- `'always'`——始终允许用户对该视图进行过度滚动
- `'never'`——从不允许用户对该视图进行过度滚动

| 类型                                  | 默认值   |
| ------------------------------------- | -------- |
| enum(`'auto'`，`'always'`，`'never'`) | `'auto'` |

---

### `pagingEnabled`

为 `true` 时，滚动视图滚动过程中会停在滚动视图尺寸的整数倍处。可用于水平分页

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `persistentScrollbar` <div className="label android">Android</div>

使滚动条在未使用时不会变为透明

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `pinchGestureEnabled` <div className="label ios">iOS</div>

为 `true` 时，ScrollView 允许使用捏合手势进行放大和缩小

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `refreshControl`

用于为 ScrollView 提供下拉刷新功能的 RefreshControl 组件。仅适用于垂直 ScrollView（`horizontal` 属性必须为 `false`）

请参阅 [RefreshControl](refreshcontrol)

| 类型    |
| ------- |
| element |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致错误（内容缺失）——使用风险由你自行承担
:::

为 `true` 时，屏幕外的子视图会从其原生承载父视图中移除。对于大型列表，这可能会改善滚动性能。在 Android 上，默认值为 `true`

| 类型    |
| ------- |
| boolean |

---

### `scrollEnabled`

为 `false` 时，无法通过触摸交互滚动视图

请注意，始终可以通过调用 `scrollTo` 滚动视图

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `scrollEventThrottle`

限制滚动时触发滚动事件的频率，以毫秒为单位指定时间间隔。当响应滚动执行开销较大的操作时，此属性可能很有用。值 &le; `16` 时将禁用节流，与设备的刷新率无关

| 类型   | 默认值 |
| ------ | ------ |
| number | `0`    |

---

### `scrollIndicatorInsets` <div className="label ios">iOS</div>

滚动视图指示器与滚动视图边缘之间的内嵌距离。通常应将其设置为与 `contentInset` 相同的值

| 类型                                                                 | 默认值                                   |
| -------------------------------------------------------------------- | ---------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `scrollPerfTag` <div className="label android">Android</div>

用于记录此滚动视图滚动性能的标签。会强制开启动量事件（请参阅 sendMomentumEvents）。此属性开箱即用时不会执行任何操作，你需要实现自定义原生 FpsListener 才能使其发挥作用

| 类型   |
| ------ |
| string |

---

### `scrollsChildToFocus` <div className="label android">Android</div>

为 `true` 时，ScrollView 会自动滚动，使获得焦点的子元素进入可视区域。设置为 `false` 可禁用此行为，并在焦点变化时手动控制滚动位置

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `scrollToOverflowEnabled` <div className="label ios">iOS</div>

为 `true` 时，可以通过程序将滚动视图滚动到超出其内容尺寸的位置

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `scrollsToTop` <div className="label ios">iOS</div>

为 `true` 时，点击状态栏后滚动视图会滚动到顶部

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `showsHorizontalScrollIndicator`

为 `true` 时，显示水平滚动指示器

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `showsVerticalScrollIndicator`

为 `true` 时，显示垂直滚动指示器

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `snapToAlignment`

设置 `snapToInterval` 后，`snapToAlignment` 将定义吸附位置与滚动视图之间的关系

可能的值：

- `'start'`：将吸附位置对齐到左侧（水平）或顶部（垂直）
- `'center'`：将吸附位置对齐到中心
- `'end'`：将吸附位置对齐到右侧（水平）或底部（垂直）

| 类型                                 | 默认值    |
| ------------------------------------ | --------- |
| enum(`'start'`，`'center'`，`'end'`) | `'start'` |

---

### `snapToEnd`

与 `snapToOffsets` 一起使用。默认情况下，列表末尾会被视为吸附偏移量。将 `snapToEnd` 设置为 `false` 可禁用此行为，并允许列表在末尾与最后一个 `snapToOffsets` 偏移量之间自由滚动

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `snapToInterval`

设置后，会使滚动视图停在 `snapToInterval` 值的整数倍处。可用于在滚动视图中分页显示长度较小的子元素。通常与 `snapToAlignment` 和 `decelerationRate="fast"` 一起使用。会覆盖可配置性较低的 `pagingEnabled` 属性

| 类型   |
| ------ |
| number |

---

### `snapToOffsets`

设置后，会使滚动视图停在定义的偏移量处。可用于在滚动视图中分页显示大小不同且长度较小的子元素。通常与 `decelerationRate="fast"` 一起使用。会覆盖可配置性较低的 `pagingEnabled` 和 `snapToInterval` 属性

| 类型            |
| --------------- |
| array of number |

---

### `snapToStart`

与 `snapToOffsets` 一起使用。默认情况下，列表开头会被视为吸附偏移量。将 `snapToStart` 设置为 `false` 可禁用此行为，并允许列表在开头与第一个 `snapToOffsets` 偏移量之间自由滚动

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `stickyHeaderHiddenOnScroll`

设置为 `true` 时，向下滚动列表会隐藏粘性标题，向上滚动时粘性标题会停靠在列表顶部

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `stickyHeaderIndices`

用于确定哪些子元素在滚动时会停靠在屏幕顶部的子元素索引数组。例如，传入 `stickyHeaderIndices={[0]}` 会使第一个子元素固定在滚动视图顶部。也可以使用 [x，y，z] 让多个项目在到达顶部时保持粘性。此属性不支持与 `horizontal={true}` 一起使用

| 类型            |
| --------------- |
| array of number |

---

### `zoomScale` <div className="label ios">iOS</div>

滚动视图内容的当前缩放比例

| 类型   | 默认值 |
| ------ | ------ |
| number | `1.0`  |

---

## 方法

### `flashScrollIndicators()`

```tsx
flashScrollIndicators();
```

短暂显示滚动指示器

---

### `scrollTo()`

```tsx
scrollTo(
  options?: {x?: number, y?: number, animated?: boolean} | number,
  deprecatedX?: number,
  deprecatedAnimated?: boolean,
);
```

滚动到指定的 x、y 偏移量，可以立即滚动，也可以使用平滑动画滚动

**示例：**

`scrollTo({x: 0, y: 0, animated: true})`

:::note
这种奇怪的函数签名是因为出于历史原因，该函数除了 options 对象外，还接受单独的参数作为替代方式。由于存在歧义（y 在 x 之前），这种方式已被弃用，不应使用
:::

---

### `scrollToEnd()`

```tsx
scrollToEnd(options?: {animated?: boolean});
```

如果这是垂直 ScrollView，则滚动到底部。如果这是水平 ScrollView，则向右滚动

使用 `scrollToEnd({animated: true})` 进行平滑动画滚动，使用 `scrollToEnd({animated: false})` 立即滚动。如果未传入选项，`animated` 默认为 `true`
