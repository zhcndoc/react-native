---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

更方便的 [`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 组件的基础实现，它们的文档也更完善。一般来说，只有当你需要比 [`FlatList`](flatlist.md) 提供的更大的灵活性时才应该使用这个，例如用于不可变数据而不是普通数组。

虚拟化通过维护一个有限的活动项渲染窗口，并用适当大小的空白空间替换渲染窗口外的所有项，从而极大地提高了大型列表的内存消耗和性能。窗口适应滚动行为，如果项远离可见区域，则以低优先级（在任何运行的交互之后）增量渲染，否则以高优先级渲染，以尽量减少看到空白空间的可能性。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=VirtualizedListExample&ext=js
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

- 当内容滚动出渲染窗口时，内部状态不会保留。确保所有数据都捕获在项数据或外部存储（如 Flux、Redux 或 Relay）中。
- 这是一个 `PureComponent`，这意味着如果 `props` 浅相等，它将不会重新渲染。确保你的 `renderItem` 函数依赖的所有内容都作为 prop 传递（例如 `extraData`），并且在更新后不 `===`，否则你的 UI 可能不会随变化更新。这包括 `data` prop 和父组件状态。
- 为了限制内存并实现平滑滚动，内容是在屏幕外异步渲染的。这意味着滚动速度可能快于填充率，从而暂时看到空白内容。这是一个可以根据每个应用的需求进行调整的权衡，我们正在幕后改进它。
- 默认情况下，列表查找每个项上的 `key` prop 并将其用作 React key。或者，你可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [ScrollView 属性](scrollview.md#props)

继承 [ScrollView 属性](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 的不透明数据类型，用于检索项。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必需</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

用于从任何类型的数据 blob 中提取项的通用访问器。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`getItemCount`**

```tsx
(data: any) => number;
```

确定数据 blob 中有多少项。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中获取一项并将其渲染到列表中

| 类型     |
| -------- |
| function |

---

### `CellRendererComponent`

CellRendererComponent 允许自定义由 `renderItem`/`ListItemComponent` 渲染的单元格在放入底层 ScrollView 时如何包装。此组件必须接受事件处理程序，以通知 VirtualizedList 单元格内的变化。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

渲染在每项之间，但不在顶部或底部。默认情况下，提供 `highlighted` 和 `leadingItem` props。`renderItem` 提供 `separators.highlight`/`unhighlight` 将更新 `highlighted` prop，但你也可以使用 `separators.updateProps` 添加自定义 props。可以是 React Component（例如 `SomeComponent`），或 React element（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React Component（例如 `SomeComponent`），或 React element（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListItemComponent`

每个数据项都使用此元素渲染。可以是 React Component Class，或渲染函数。

| 类型                |
| ------------------- |
| component, function |

---

### `ListFooterComponent`

渲染在所有项的底部。可以是 React Component（例如 `SomeComponent`），或 React element（例如 `<SomeComponent />`）。

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

渲染在所有项的顶部。可以是 React Component（例如 `SomeComponent`），或 React element（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `debug`

`debug` 将开启额外的日志记录和视觉覆盖，以帮助调试使用情况和实现，但会显著影响性能。

| 类型    |
| ------- |
| boolean |

---

### `disableVirtualization`

> **已弃用。** 虚拟化提供了显著的性能和内存优化，但会完全卸载渲染窗口外的 react 实例。你应该只为了调试目的才需要禁用此功能。

| 类型    |
| ------- |
| boolean |

---

### `extraData`

一个标记属性，用于告诉列表重新渲染（因为它实现了 `PureComponent`）。如果你的任何 `renderItem`、Header、Footer 等函数依赖于 `data` prop 之外的任何内容，将其放在这里并将其视为不可变的。

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

如果为 `true`，则项彼此水平相邻渲染，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少项。这应该足以填充屏幕，但不要太多。注意，这些项作为窗口化渲染的一部分永远不会被卸载，以提高滚动到顶部操作的感知性能。

| 类型   | 默认 |
| ------ | ------- |
| number | `10`    |

---

### `initialScrollIndex`

不是从第一项的顶部开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化（该优化保持前 `initialNumToRender` 项始终渲染），并立即渲染从此初始索引开始的项。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| number |

---

### `inverted`

反转滚动方向。使用 `-1` 的 scale 变换。

| 类型    |
| ------- |
| boolean |

---

### `keyExtractor`

```tsx
(item: any, index: number) => string;
```

用于提取给定项在指定索引处的唯一 key。Key 用于缓存并作为 react key 跟踪项重新排序。默认提取器检查 `item.key`，然后 `item.id`，然后回退到使用索引，就像 React 所做的那样。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次中要渲染的最大项数。一次渲染的越多，填充率越好，但响应能力可能会受到影响，因为渲染内容可能会干扰响应按钮点击或其他交互。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置进入列表逻辑末端的 `onEndReachedThreshold` 范围内时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

列表的尾缘必须距离内容末端多远（以列表可见长度的单位）才能触发 `onEndReached` 回调。因此，值 0.5 将在内容末端位于列表可见长度的一半以内时触发 `onEndReached`。

| 类型   | 默认 |
| ------ | ------- |
| number | `2`     |

---

### `onRefresh`

```tsx
() => void;
```

如果提供，将添加标准的 `RefreshControl` 以实现“下拉刷新”功能。确保也正确设置 `refreshing` prop。

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

用于处理滚动到尚未测量的索引时的失败。建议的操作是要么计算你自己的偏移量并 `scrollTo` 它，要么尽可能滚动，然后在渲染更多项后重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置进入列表逻辑起点的 `onStartReachedThreshold` 范围内时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

列表的前缘必须距离内容起点多远（以列表可见长度的单位）才能触发 `onStartReached` 回调。因此，值 0.5 将在内容起点位于列表可见长度的一半以内时触发 `onStartReached`。

| 类型   | 默认 |
| ------ | ------- |
| number | `2`     |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，由 `viewabilityConfig` prop 定义。

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

当需要偏移量以便加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshControl`

自定义刷新控制元素。设置后，它将覆盖内部构建的默认 `<RefreshControl>` 组件。onRefresh 和 refreshing props 也会被忽略。仅适用于垂直 VirtualizedList。

| 类型    |
| ------- |
| element |

---

### `refreshing`

等待刷新新数据时将此设置为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

这可能会提高大型列表的滚动性能。

> 注意：在某些情况下可能有 bug（内容缺失）- 使用风险自负。

| 类型    |
| ------- |
| boolean |

---

### `renderScrollComponent`

```tsx
(props: object) => element;
```

渲染自定义滚动组件，例如具有不同样式的 `RefreshControl`。

| 类型     |
| -------- |
| function |

---

### `viewabilityConfig`

参见 `ViewabilityHelper.js` 了解 flow 类型和进一步文档。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 对的列表。当对应的 `ViewabilityConfig` 条件满足时，将调用特定的 `onViewableItemsChanged`。参见 `ViewabilityHelper.js` 了解 flow 类型和进一步文档。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

---

### `updateCellsBatchingPeriod`

低优先级项渲染批次之间的时间量，例如用于渲染远离屏幕的项。与 `maxToRenderPerBatch` 类似的填充率/响应能力权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

确定可见区域外渲染的最大项数，以可见长度的单位表示。因此，如果你的列表填充了屏幕，那么 `windowSize={21}`（默认）将渲染可见屏幕区域以及视口上方最多 10 个屏幕和下方 10 个屏幕。减少此数字将减少内存消耗并可能提高性能，但会增加快速滚动可能揭示未渲染内容的暂时空白区域的机会。

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

提供底层滚动响应器的句柄。注意 `this._scrollRef` 可能不是 `ScrollView`，因此我们在调用前需要检查它是否响应 `getScrollResponder`。

---

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。如果没有 `getItemLayout` 属性，可能会卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` 键包括：

- `'animated'` (boolean) - 列表在滚动时是否执行动画。默认为 `true`。

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

- 'index' (number)。必需。
- 'animated' (boolean)。可选。
- 'viewOffset' (number)。可选。
- 'viewPosition' (number)。可选。

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

- 'item' (Item)。必需。
- 'animated' (boolean)。可选。
- 'viewOffset' (number)。可选。
- 'viewPosition' (number)。可选。

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中特定内容的像素偏移量。

参数 `offset` 表示期望滚动的偏移量。如果 `horizontal` 为 true，则偏移量为 x 值；否则为 y 值。

参数 `animated`（默认为 `true`）定义列表在滚动时是否执行动画。
