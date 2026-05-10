---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

更方便的 [`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 组件的基础实现，这些组件也有更完善的文档。一般来说，只有在你需要比 [`FlatList`](flatlist.md) 提供的更多灵活性时才应该使用它，例如用于不可变数据而不是普通数组。

虚拟化通过维护一个有限的活动项渲染窗口，并用大小合适的空白空间替换渲染窗口之外的所有项，从而大幅改善大型列表的内存占用和性能。该窗口会根据滚动行为自适应；如果某些项离可见区域较远，则会在低优先级（在所有正在运行的交互结束后）逐步渲染，否则会以高优先级渲染，以尽量减少看到空白区域的可能性。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=VirtualizedListExample&ext=js
import React from 'react';
import {View, VirtualizedList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const getItem = (_data, index) => ({
  id: Math.random().toString(12).substring(0),
  title: `Item ${index + 1}`,
});

const getItemCount = _data => 50;

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=VirtualizedListExample&ext=tsx
import React from 'react';
import {View, VirtualizedList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

type ItemData = {
  id: string;
  title: string;
};

const getItem = (_data: unknown, index: number): ItemData => ({
  id: Math.random().toString(12).substring(0),
  title: `Item ${index + 1}`,
});

const getItemCount = (_data: unknown) => 50;

type ItemProps = {
  title: string;
};

const Item = ({title}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
</Tabs>

---

一些注意事项：

- 当内容滚动出渲染窗口时，内部状态不会被保留。请确保你的所有数据都已捕获在 item 数据中，或存储在 Flux、Redux、Relay 等外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 浅比较相等，它不会重新渲染。请确保 `renderItem` 函数依赖的所有内容都作为 `prop` 传入（例如 `extraData`），并且在更新后不再是 `===`，否则你的 UI 可能不会随着变化而更新。这也包括 `data` prop 和父组件状态。
- 为了限制内存并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，从而短暂看到空白内容。这是在不同应用需求之间的权衡，我们正在努力在幕后改进它。
- 默认情况下，列表会查找每个 item 上的 `key` prop，并将其用作 React key。或者，你也可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [ScrollView 属性](scrollview.md#props)

继承 [ScrollView 属性](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 用于获取条目的不透明数据类型。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必需</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

用于从任意数据块中提取条目的通用访问器。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`getItemCount`**

```tsx
(data: any) => number;
```

决定数据块中有多少条目。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中取出一个条目并将其渲染到列表中

| 类型     |
| -------- |
| function |

---

### `CellRendererComponent`

CellRendererComponent 允许自定义由 `renderItem`/`ListItemComponent` 渲染的单元格在放入底层 ScrollView 时的包裹方式。此组件必须接受事件处理函数，这些处理函数会通知 VirtualizedList 单元格内的变化。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

渲染在每个条目之间，但不在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` props。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` prop，不过你也可以使用 `separators.updateProps` 添加自定义 props。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListItemComponent`

每个数据项都使用此元素进行渲染。可以是一个 React 组件类，也可以是一个渲染函数。

| 类型                |
| ------------------- |
| component, function |

---

### `ListFooterComponent`

渲染在所有条目的底部。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 View 的样式。

| 类型          | 必需 |
| ------------- | -------- |
| ViewStyleProp | 否       |

---

### `ListHeaderComponent`

渲染在所有条目的顶部。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `debug`

`debug` 会开启额外的日志和可视化覆盖层，以帮助调试用法和实现，但会显著降低性能。

| 类型    |
| ------- |
| boolean |

---

### 🗑️ `disableVirtualization`

:::warning 已弃用
虚拟化提供了显著的性能和内存优化，但会完全卸载渲染窗口之外的 react 实例。你通常只会在调试时需要禁用它。
:::

| 类型    |
| ------- |
| boolean |

---

### `extraData`

一个标记属性，用于告诉列表重新渲染（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` prop 之外的任何内容，就把它放在这里，并将其视为不可变。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(
  data: any,
  index: number,
) => {length: number, offset: number, index: number}
```

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则横向而不是纵向并排渲染条目。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少个条目。这个数量应足以填满屏幕，但不要太多。注意，为了提升滚动到顶部操作的感知性能，这些条目永远不会作为窗口化渲染的一部分被卸载。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `initialScrollIndex`

不是从顶部的第一个条目开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化，即保持前 `initialNumToRender` 个条目始终渲染，并立即渲染从该初始索引开始的条目。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| number |

---

### `inverted`

反转滚动方向。使用 `-1` 的缩放变换。

| 类型    |
| ------- |
| boolean |

---

### `keyExtractor`

```tsx
(item: any, index: number) => string;
```

用于为指定索引处的给定条目提取唯一 key。key 用于缓存，并作为 React key 来跟踪条目重新排序。默认提取器会先检查 `item.key`，然后是 `item.id`，最后退回到像 React 那样使用索引。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次中要渲染的最大条目数。一次渲染越多，填充率越好，但响应性可能会下降，因为渲染内容可能会干扰按钮点击或其他交互的响应。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置距离列表逻辑末尾进入 `onEndReachedThreshold` 范围时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

列表尾部边缘距离内容末尾的距离阈值（以列表可见长度为单位），达到该距离时会触发 `onEndReached` 回调。因此，值为 0.5 时，当内容末尾进入列表可见长度一半以内时会触发 `onEndReached`。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，将添加一个标准的 `RefreshControl` 用于“下拉刷新”功能。请务必同时正确设置 `refreshing` prop。

| 类型     |
| -------- |
| function |

---

### `onScrollToIndexFailed`

```tsx
(info: {
  index: number,
  highestMeasuredFrameIndex: number,
  averageItemLength: number,
}) => void;
```

用于处理滚动到尚未测量的索引时的失败。建议的做法是自行计算偏移量并滚动到该位置，或者尽可能滚动到接近的位置，然后在渲染更多条目后重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置距离列表逻辑起始位置进入 `onStartReachedThreshold` 范围时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

列表前沿距离内容起始位置的距离阈值（以列表可见长度为单位），达到该距离时会触发 `onStartReached` 回调。因此，值为 0.5 时，当内容起始位置进入列表可见长度一半以内时会触发 `onStartReached`。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，如 `viewabilityConfig` prop 所定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `persistentScrollbar`

| 类型 |
| ---- |
| bool |

---

### `progressViewOffset`

在需要偏移量以便加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshControl`

自定义刷新控制元素。设置后，它会覆盖内部构建的默认 `<RefreshControl>` 组件。`onRefresh` 和 `refreshing` props 也会被忽略。仅适用于垂直方向的 VirtualizedList。

| 类型    |
| ------- |
| element |

---

### `refreshing`

在等待刷新获得新数据时将其设为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致 bug（内容缺失）——请自行承担风险使用。
:::

当为 `true` 时，屏幕外的子视图在离开屏幕时会从其原生宿主 superview 中移除。这可能会提升大型列表的滚动性能。在 Android 上，默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderScrollComponent`

```tsx
(props: object) => element;
```

渲染自定义滚动组件，例如使用不同样式的 `RefreshControl`。

| 类型     |
| -------- |
| function |

---

### `viewabilityConfig`

请参见 `ViewabilityHelper.js` 以了解 flow 类型和进一步文档。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 配对列表。当对应的 `ViewabilityConfig` 条件满足时，会调用特定的 `onViewableItemsChanged`。请参见 `ViewabilityHelper.js` 以了解 flow 类型和进一步文档。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

---

### `updateCellsBatchingPeriod`

低优先级条目渲染批次之间的时间间隔，例如用于渲染距离屏幕较远的条目。与 `maxToRenderPerBatch` 类似，这也是填充率/响应性之间的权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

决定可见区域之外最多渲染多少个条目，以可见长度为单位。因此，如果你的列表填满屏幕，那么 `windowSize={21}`（默认值）会渲染可见屏幕区域以及视口上方最多 10 屏、下方最多 10 屏的内容。减小该数值会降低内存占用并可能提升性能，但也会增加快速滚动时短暂看到未渲染内容空白区域的概率。

| 类型   |
| ------ |
| number |

## 方法

### `flashScrollIndicators()`

```tsx
flashScrollIndicators();
```

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

---

### `getScrollRef()`

```tsx
getScrollRef():
  | React.ElementRef<typeof ScrollView>
  | React.ElementRef<typeof View>
  | null;
```

---

### `getScrollResponder()`

```tsx
getScrollResponder () => ScrollResponderMixin | null;
```

提供对底层滚动响应器的引用。请注意，`this._scrollRef` 可能不是 `ScrollView`，因此在调用它之前，需要检查它是否响应 `getScrollResponder`。

---

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。如果没有 `getItemLayout` 属性，可能会出现卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` 键包括：

- `'animated'`（boolean）- 滚动时列表是否执行动画。默认为 `true`。

---

### `scrollToIndex()`

```tsx
scrollToIndex(params: {
  index: number;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
});
```

有效的 `params` 包括：

- `'index'`（number）。必填。
- `'animated'`（boolean）。可选。
- `'viewOffset'`（number）。可选。
- `'viewPosition'`（number）。可选。

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  item: ItemT;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
);
```

有效的 `params` 包括：

- `'item'`（Item）。必填。
- `'animated'`（boolean）。可选。
- `'viewOffset'`（number）。可选。
- `'viewPosition'`（number）。可选。

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中指定的内容像素偏移量。

参数 `offset` 表示要滚动到的偏移量。如果 `horizontal` 为 true，则该偏移量是 x 值；在其他情况下，该偏移量是 y 值。

参数 `animated`（默认 `true`）定义列表在滚动时是否执行动画。
