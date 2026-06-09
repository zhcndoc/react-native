---
id: scrollview
title: ScrollView
---

封装平台 ScrollView 组件，同时提供与触摸锁定“响应者”系统的集成。

请注意，为了使 ScrollViews 工作，必须有一个有限的高度，因为它们将无界高度的子元素包含在有限高度的容器内（通过滚动交互）。为了限定 ScrollView 的高度，可以直接设置视图的高度（不推荐）或确保所有父视图都有有限高度。忘记将 `{flex: 1}` 传递到底层视图堆栈可能会导致错误，元素检查器可以快速调试此类问题。

当前尚不支持其他容器响应者阻止该滚动视图成为响应者。

`<ScrollView>` 与 [`<FlatList>`](flatlist.md) - 该使用哪一个？

`ScrollView` 会一次性渲染所有 React 子组件，但这会带来性能上的缺点。

设想你有一个很长的列表要显示，可能多屏的内容。一次性创建所有 JS 组件和原生视图，其中许多内容甚至可能不被显示，这会导致渲染缓慢和内存占用增加。

这时 `FlatList` 就派上用场了。`FlatList` 会在条目即将出现时懒加载渲染，并移除滚动远离屏幕的条目，以节省内存和处理时间。

如果你希望在条目之间渲染分隔线、多列布局、无限滚动加载，或者需要其他它开箱即用支持的功能，`FlatList` 也非常实用。

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

继承自 [View 属性](view#props)。

---

### `StickyHeaderComponent`

用于渲染粘性头部的 React 组件，应与 `stickyHeaderIndices` 配合使用。如果你的粘性头部使用了自定义变换（例如你想让列表拥有可动画且可隐藏的头部），你可能需要设置此组件。如果未提供组件，默认使用 [`ScrollViewStickyHeader`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader.js) 组件。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `alwaysBounceHorizontal` <div class="label ios">iOS</div>

如果设置为 true，当横向滚动视图到达边缘时即使内容比滚动视图本身还小也会弹跳。

| 类型 | 默认值                                           |
| ---- | ------------------------------------------------ |
| bool | `horizontal={true}` 时为 `true`<hr/>否则为 `false` |

---

### `alwaysBounceVertical` <div class="label ios">iOS</div>

如果设置为 true，当纵向滚动视图到达边缘时即使内容比滚动视图本身还小也会弹跳。

| 类型 | 默认值                                           |
| ---- | ------------------------------------------------ |
| bool | `horizontal={true}` 时为 `false`<hr/>否则为 `true` |

---

### `automaticallyAdjustContentInsets` <div class="label ios">iOS</div>

控制 iOS 是否自动调整滚动视图内容 Insets，用于放置在导航栏或标签栏/工具栏后面的滚动视图。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `automaticallyAdjustKeyboardInsets` <div class="label ios">iOS</div>

控制滚动视图在键盘大小变化时是否自动调整 `contentInset` 和 `scrollViewInsets`。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `automaticallyAdjustsScrollIndicatorInsets` <div class="label ios">iOS</div>

控制 iOS 是否自动调整滚动条 Insets。详见苹果官方 [文档](https://developer.apple.com/documentation/uikit/uiscrollview/3198043-automaticallyadjustsscrollindica)。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `bounces` <div class="label ios">iOS</div>

如果为 true，当滚动视图沿滚动方向内容大于自身时，达到内容边界会弹跳。为 false 时，即使 `alwaysBounce*` 属性为 true 也会禁用弹跳。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `bouncesZoom` <div class="label ios">iOS</div>

为 true 时，手势可以驱动缩放超过最小/最大限制，手势结束后会动画回到限制值；否则缩放不会超过限制。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `canCancelContentTouches` <div class="label ios">iOS</div>

为 false 时，开始追踪后触摸移动不会尝试拖拽。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `centerContent` <div class="label ios">iOS</div>

为 true 时，当内容尺寸小于滚动视图边界时，自动将内容居中；内容大于视图时无效。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `contentContainerStyle`

应用于包裹所有子视图的滚动视图内容容器样式。示例：

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

| 类型               |
| ------------------ |
| [View 样式](view-style-props) |

---

### `contentInset` <div class="label ios">iOS</div>

滚动视图内容距离滚动视图边缘的内边距尺寸。

| 类型                                                                 | 默认值                             |
| ------------------------------------------------------------------ | -------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `contentInsetAdjustmentBehavior` <div class="label ios">iOS</div>

指定安全区域插入如何用于修改滚动视图内容区。iOS 11 及以上可用。

| 类型                                                             | 默认值    |
| -------------------------------------------------------------- | -------- |
| 枚举 (`'automatic'`, `'scrollableAxes'`, `'never'`, `'always'`) | `'never'` |

---

### `contentOffset`

用于手动设置初始滚动偏移。

| 类型  | 默认值        |
| ----- | ------------ |
| 点对象 | `{x: 0, y: 0}` |

---

### `decelerationRate`

一个浮点数，决定用户停止触摸后滚动视图减速的快慢。也可以使用字符串快捷方式 `"normal"` 和 `"fast"`，对应 iOS 内置的 UIScrollViewDecelerationRateNormal 和 UIScrollViewDecelerationRateFast。

- `'normal'` iOS 为 0.998，Android 为 0.985。
- `'fast'` iOS 为 0.99，Android 为 0.9。

| 类型                             | 默认值    |
| -------------------------------- | -------- |
| 枚举 (`'fast'`, `'normal'`)，数字 | `'normal'` |

---

### `directionalLockEnabled` <div class="label ios">iOS</div>

为 true 时，滚动视图拖动时会尝试锁定为仅纵向或仅横向滚动。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `disableIntervalMomentum`

为 true 时，滚动视图在释放手指后会根据当前位置停止在下一个索引位置（无论手势速度如何）。适用于当页面宽度小于横向滚动视图宽度或高度时的分页。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `disableScrollViewPanResponder`

为 true 时，禁用 ScrollView 默认的 JS pan responder，触摸的完全控制权交给子组件。这对启用了 `snapToInterval` 的情况特别有用，因为它不遵循典型的触摸模式。正常不带 `snapToInterval` 的 ScrollView 则不建议使用此属性，否则可能导致滚动时出现异常触摸。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `endFillColor` <div class="label android">Android</div>

有时滚动视图占据空间比内容大，使用此属性可填充剩余区域的颜色，避免设置背景色导致不必要的过度绘制。这是高级优化，不是通用需求。

| 类型            |
| --------------- |
| [颜色](colors)  |

---

### `fadingEdgeLength` <div class="label android">Android</div>

渐隐滚动内容边缘的长度。

如果值大于 0，将根据当前滚动方向及位置相应设置渐隐长度，表示是否有更多内容显示。

| 类型                                               | 默认值 |
| -------------------------------------------------- | ------ |
| 数字<hr />对象：`{start: number, end: number}`        | `0`    |

---

### `horizontal`

为 true 时，滚动视图的子元素水平排列（行排列），否则默认为垂直排列（列排列）。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `indicatorStyle` <div class="label ios">iOS</div>

滚动指示器的样式。

- `'default'` 同 `black`。
- `'black'` 指示器为黑色，适合浅色背景。
- `'white'` 指示器为白色，适合深色背景。

| 类型                            | 默认值     |
| ------------------------------- | ---------- |
| 枚举 (`'default'`, `'black'`, `'white'`) | `'default'` |

---

### `invertStickyHeaders`

如果为 true，粘性头部会固定在滚动视图底部，而非顶部。通常用于反转的 ScrollViews。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `keyboardDismissMode`

确定是否通过拖动来关闭键盘。

- `'none'` 拖动不关闭键盘。
- `'on-drag'` 拖动开始时关闭键盘。

**仅限 iOS**

- `'interactive'` 键盘与拖动交互关闭，拖动会上移则取消关闭。Android 不支持此功能，行为等同 `'none'`。

| 类型                                                                                                   | 默认值  |
| ---------------------------------------------------------------------------------------------------- | ------- |
| 枚举 (`'none'`, `'on-drag'`) <div class="label android">Android</div><hr />枚举 (`'none'`, `'on-drag'`, `'interactive'`) <div class="label ios">iOS</div> | `'none'` |

---

### `keyboardShouldPersistTaps`

确定点击后键盘是否保持显示。

- `'never'` 键盘弹出时点击焦点外文本输入会关闭键盘，此时子元素不会收到点击事件。
- `'always'` 键盘不会自动关闭，滚动视图不捕获点击，但其子元素可捕获点击。
- `'handled'` 只有当点击被滚动视图子元素处理（或被祖先捕获）时才不会自动关闭键盘。
- `false` 已废弃，用 `'never'` 代替。
- `true` 已废弃，用 `'always'` 代替。

| 类型                                                      | 默认值   |
| --------------------------------------------------------- | -------- |
| 枚举 (`'always'`, `'never'`, `'handled'`, `false`, `true`) | `'never'` |

---

### `maintainVisibleContentPosition`

启用时，滚动视图会调整 scroll 位置，使当前可见且索引大于或等于 `minIndexForVisible` 的首个子元素位置保持不变。适用于双向加载内容的列表，如聊天线程，避免新消息导致滚动跳跃。常设为 0，但也可以用 1 等值跳过加载指示器或不该保持位置的内容。

可选项 `autoscrollToTopThreshold` 可设置自动滚动到顶部阈值：若调整位置前用户接近顶部，则调整后自动滚动顶部。适用于聊天类应用，只在用户接近顶部时显示新消息滚动。

注意事项：

1. 使用此功能时排序内容会导致卡顿和跳动，目前无计划修复。请勿对启用此功能的 ScrollViews 或列表重新排序内容。
2. 该功能基于 native 代码中 `contentOffset` 和 `frame.origin` 计算可见性，不考虑遮挡、变换等复杂情况。

| 类型                                                                           |
| ------------------------------------------------------------------------------ |
| 对象：`{minIndexForVisible: number, autoscrollToTopThreshold: number}`          |

---

### `maximumZoomScale` <div class="label ios">iOS</div>

最大允许的缩放比例。

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | `1.0`  |

---

### `minimumZoomScale` <div class="label ios">iOS</div>

最小允许的缩放比例。

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | `1.0`  |

---

### `nestedScrollEnabled` <div class="label android">Android</div>

开启 Android API 21+ 的嵌套滚动功能。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `onContentSizeChange`

滚动视图的可滚动内容视图尺寸变化时调用。

回调函数接收两个参数：内容宽度和内容高度 `(contentWidth, contentHeight)`。

这是通过在该 ScrollView 渲染的内容容器上绑定 onLayout 事件实现的。

| 类型     |
| -------- |
| 函数     |

---

### `onMomentumScrollBegin`

滚动视图开始动量滚动时触发（即滚动开始滑行时）。

| 类型     |
| -------- |
| 函数     |

---

### `onMomentumScrollEnd`

滚动视图动量滚动结束时触发（即滚动滑行停止时）。

| 类型     |
| -------- |
| 函数     |

---

### `onScroll`

滚动时每帧最多触发一次。事件结构如下（未指定类型的值均为数字）：

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
    // 仅 iOS
    targetContentOffset: {x, y}
  }
}
```

| 类型     |
| -------- |
| 函数     |

---

### `onScrollBeginDrag`

用户开始拖动滚动视图时调用。

| 类型     |
| -------- |
| 函数     |

---

### `onScrollEndDrag`

用户停止拖动滚动视图且滚动停止或开始滑行时调用。

| 类型     |
| -------- |
| 函数     |

---

### `onScrollToTop` <div class="label ios">iOS</div>

状态栏被点击后，滚动视图滚动到顶部时触发。

| 类型     |
| -------- |
| 函数     |

---

### `overScrollMode` <div class="label android">Android</div>

覆盖默认的过度滚动模式。

可选值：

- `'auto'` - 仅当内容足够大以致可以滚动时允许过度滚动。
- `'always'` - 总是允许过度滚动。
- `'never'` - 从不允许过度滚动。

| 类型                                   | 默认值  |
| ------------------------------------ | ------- |
| 枚举 (`'auto'`, `'always'`, `'never'`) | `'auto'` |

---

### `pagingEnabled`

为 true 时，滚动视图滚动时会停留在其大小的整数倍处。可用于横向分页。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `persistentScrollbar` <div class="label android">Android</div>

使滚动条在未使用时不变透明。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `pinchGestureEnabled` <div class="label ios">iOS</div>

为 true 时，ScrollView 允许通过捏合手势进行缩放。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `refreshControl`

用于为 ScrollView 提供下拉刷新功能的 RefreshControl 组件。仅适用于垂直滚动视图（`horizontal` 属性必须为 `false`）。

详情见 [RefreshControl](refreshcontrol)。

| 类型  |
| ----- |
| 元素  |

---

### `removeClippedSubviews`

:::warning
开启此属性可能会在某些情况下导致内容缺失等问题—请自行承担风险使用。
:::

为 true 时，离屏的子视图会从它们的原生父视图中移除，可能提升大型列表的滚动性能。Android 上默认值为 `true`。

| 类型    |
| ------- |
| 布尔值  |

---

### `scrollEnabled`

为 false 时，禁用触摸交互导致的滚动。

注意，仍可通过调用 `scrollTo` 进行滚动。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `scrollEventThrottle`

限制滚动时触发滚动事件的频率（以毫秒为单位）。当滚动响应处理开销较大时很有用。值小于等于 16 会禁用节流，事件频率取决于设备刷新率。

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | `0`    |

---

### `scrollIndicatorInsets` <div class="label ios">iOS</div>

滚动视图的滚动指示器距离滚动视图边缘的内边距。通常应设置为与 `contentInset` 相同。

| 类型                                                                 | 默认值                             |
| ------------------------------------------------------------------ | -------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` | `{top: 0, left: 0, bottom: 0, right: 0}` |

---

### `scrollPerfTag` <div class="label android">Android</div>

标签用于记录滚动性能日志。会强制启用动量事件（参见 sendMomentumEvents）。默认不会有任何效果，需自行实现 native FpsListener 才有意义。

| 类型   |
| ------ |
| 字符串 |

---

### `scrollToOverflowEnabled` <div class="label ios">iOS</div>

为 true 时，滚动视图可程序性滚动超过内容尺寸。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `scrollsToTop` <div class="label ios">iOS</div>

为 true 时，点击状态栏会滚动视图滚动至顶部。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `showsHorizontalScrollIndicator`

为 true 时显示水平滚动指示器。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `showsVerticalScrollIndicator`

为 true 时显示垂直滚动指示器。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `snapToAlignment`

当设置了 `snapToInterval` 时，定义吸附偏移相对于滚动视图的对齐方式。

可选值：

- `'start'` 吸附在左边（横向）或顶部（纵向）。
- `'center'` 吸附在中间。
- `'end'` 吸附在右边（横向）或底部（纵向）。

| 类型                               | 默认值   |
| ---------------------------------- | -------- |
| 枚举 (`'start'`, `'center'`, `'end'`) | `'start'` |

---

### `snapToEnd`

与 `snapToOffsets` 配合使用。默认情况下，列表尾部会作为一个吸附点。设置 `snapToEnd` 为 false 会禁用此行为，允许列表在尾部和最后一个 `snapToOffsets` 偏移间自由滚动。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `snapToInterval`

设置后，滚动视图会在 `snapToInterval` 的倍数处停止滚动。用于长度小于滚动视图的子项分页。通常与 `snapToAlignment` 和 `decelerationRate="fast"` 配合使用。优先级高于功能较弱的 `pagingEnabled`。

| 类型   |
| ------ |
| 数字   |

---

### `snapToOffsets`

设置后，滚动视图会在定义的偏移位置停止滚动。用于长度不一且小于滚动视图的子项分页。通常与 `decelerationRate="fast"` 配合使用。优先级高于功能较弱的 `pagingEnabled` 和 `snapToInterval`。

| 类型            |
| --------------- |
| 数字数组        |

---

### `snapToStart`

与 `snapToOffsets` 配合使用。默认情况下，列表头部为一个吸附点。设置 `snapToStart` 为 false 会禁用此行为，允许列表在起始点和第一个 `snapToOffsets` 偏移之间自由滚动。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |

---

### `stickyHeaderHiddenOnScroll`

设置为 true 后，向下滚动列表时粘性头部隐藏，向上滚动时固定在顶部。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `stickyHeaderIndices`

指定子组件索引数组，决定哪些子组件在滚动时吸附固定在屏幕顶部。例如，传入 `stickyHeaderIndices={[0]}` 会使第一个子组件固定在顶部。也可传入多索引如 [x,y,z]，实现多个粘性头部。此属性不支持 `horizontal={true}`。

| 类型          |
| ------------- |
| 数字数组      |

---

### `zoomScale` <div class="label ios">iOS</div>

当前滚动视图内容的缩放比例。

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | `1.0`  |

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

滚动至指定的 x、y 偏移，可立即滚动或平滑动画滚动。

**示例：**

`scrollTo({x: 0, y: 0, animated: true})`

:::note
之所以有这个奇怪的函数签名，是因为历史原因，该函数既接受一个对象参数，也接受分开的多个参数。由于参数顺序（y 在 x 之前）会造成歧义，该形式已废弃，强烈不推荐使用分开的参数形式。
:::

---

### `scrollToEnd()`

```tsx
scrollToEnd(options?: {animated?: boolean});
```

如果是纵向 `ScrollView`，滚动到底部；如果是横向，滚动到右侧。

使用 `scrollToEnd({animated: true})` 进行平滑动画滚动，`scrollToEnd({animated: false})` 则立即滚动。如果不传参数，`animated` 默认为 `true`。