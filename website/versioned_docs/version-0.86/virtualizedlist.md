---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 的一个更方便的基础实现，并且为这些组件提供了更好的文档。一般来说，只有在你需要比 [`FlatList`](flatlist.md) 提供的更多灵活性时才应该使用它，例如使用不可变数据而不是普通数组。

虚拟化通过维护一个有限的活动项渲染窗口，并将渲染窗口之外的所有项替换为大小合适的空白空间，极大地改善了大型列表的内存占用和性能。该窗口会根据滚动行为自适应；如果项目距离可见区域较远，则会以低优先级（在任何正在进行的交互之后）逐步渲染，否则会以高优先级渲染，以尽量减少看到空白空间的可能性。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=VirtualizedListExample&ext=js
import {View, VirtualizedList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const getItem = (_data, index) => ({
  id: Math.random().toString(12).substring(0),
  title: `项目 ${index + 1}`,
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
  title: `项目 ${index + 1}`,
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

一些需要记住的事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保所有数据都被捕获在 item 数据中，或外部存储中，例如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，这意味着如果 `props` 仍然是浅相等的，它就不会重新渲染。请确保 `renderItem` 函数所依赖的所有内容都作为一个在更新后不再 `===` 的 prop 传入，否则你的 UI 可能不会在变化时更新。这包括 `data` prop 和父组件状态。
- 为了限制内存并实现流畅滚动，内容会在屏幕外异步渲染。这意味着滚动速度有可能快于填充速率，并且会短暂看到空白内容。这是一种权衡，可以根据每个应用的需求进行调整，我们也一直在幕后努力改进它。
- 默认情况下，列表会在每个 item 上查找一个 `key` prop，并将其用作 React key。或者，你可以提供一个自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [ScrollView 属性](scrollview.md#props)

继承 [ScrollView 属性](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 用于提取项目的不透明数据块。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必需</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

用于从任意类型的数据块中提取项目的通用访问器。

| 类型 |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`getItemCount`**

```tsx
(data: any) => number;
```

确定数据块中包含多少个项目。

| 类型 |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中取出一个项目并将其渲染到列表中

| 类型 |
| -------- |
| function |

---

### `CellRendererComponent`

CellRendererComponent 允许你自定义由 `renderItem`/`ListItemComponent` 渲染的单元格在插入到底层 ScrollView 时的包裹方式。此组件必须接受事件处理器，以通知 VirtualizedList 单元格内的变化。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` 属性，但你也可以通过 `separators.updateProps` 添加自定义属性。可以是 React 组件类、渲染函数或已渲染的元素。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React 组件类或已渲染的元素。

| 类型               |
| ------------------ |
| component, element |

---

### `ListItemComponent`

每个项目都使用此元素渲染。可以是 React 组件类或渲染函数。

| 类型                |
| ------------------- |
| component, function |

---

### `ListFooterComponent`

渲染在所有项目的底部。可以是 React 组件类或已渲染的元素。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 View 的样式。

| 类型          | 必需 |
| ------------- | ---- |
| ViewStyleProp | 否   |

---

### `ListHeaderComponent`

渲染在所有项目的顶部。可以是 React 组件类或已渲染的元素。

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

`debug` 会开启额外日志和可视化覆盖层，以帮助调试使用和实现问题，但会显著影响性能。

| 类型    |
| ------- |
| boolean |

---

### 🗑️ `disableVirtualization`

:::warning[已弃用]
虚拟化提供了显著的性能和内存优化，但会完全卸载渲染窗口之外的 react 实例。你通常只需要在调试时禁用它。
:::

| 类型    |
| ------- |
| boolean |

---

### `extraData`

一个标记属性，用于告诉列表重新渲染（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` prop 之外的任何内容，就把它放在这里，并以不可变方式处理。

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

如果为 `true`，则水平而不是垂直地并排渲染项目。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次要渲染多少个项目。这个数量应该足以填满屏幕，但不要多太多。请注意，为了提升滚动到顶部操作的感知性能，这些项目在窗口化渲染中不会被卸载。

| 类型   | 默认值 |
| ------ | ------ |
| number | `10`   |

---

### `initialScrollIndex`

不是从顶部的第一个项目开始，而是从 `initialScrollIndex` 开始。这样会禁用“滚动到顶部”优化，该优化会始终渲染前 `initialNumToRender` 个项目；启用后会立即渲染从该初始索引开始的项目。需要实现 `getItemLayout`。

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

用于为指定索引处的给定项目提取唯一 key。该 key 用于缓存，并作为 react key 跟踪项目重排。默认提取器会先检查 `item.key`，再检查 `item.id`，然后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次中最多渲染的项目数。一次渲染更多项目意味着更好的填充率，但响应性可能会受影响，因为渲染内容可能干扰按钮点击或其他交互的响应。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置进入列表逻辑末尾的 `onEndReachedThreshold` 范围内时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

列表尾部边缘距离内容末尾多远时触发 `onEndReached` 回调。因此，值为 `0.5` 时，当内容末尾进入列表可见长度的一半范围内时会触发 `onEndReached`。

| 类型   | 默认值 |
| ------ | ------ |
| number | `2`    |

---

### `onRefresh`

```tsx
() => void;
```

如果提供，将添加标准的 `RefreshControl` 用于“下拉刷新”功能。请确保同时正确设置 `refreshing` 属性。

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

用于处理滚动到尚未测量的索引时的失败情况。建议的做法是：自己计算偏移量并滚动到该位置，或者尽可能滚动，然后在渲染更多项目后重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置进入列表逻辑起始处的 `onStartReachedThreshold` 范围内时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

列表起始边缘距离内容起始处多远时触发 `onStartReached` 回调。因此，值为 `0.5` 时，当内容起始处进入列表可见长度的一半范围内时会触发 `onStartReached`。

| 类型   | 默认值 |
| ------ | ------ |
| number | `2`    |

---

### `onViewableItemsChanged`

当行的可见性变化时调用，如 `viewabilityConfig` 属性所定义。

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

自定义刷新控件元素。设置后，它会覆盖内部构建的默认 `<RefreshControl>` 组件。`onRefresh` 和 `refreshing` 属性也会被忽略。仅适用于垂直方向的 VirtualizedList。

| 类型    |
| ------- |
| element |

---

### `refreshing`

在等待刷新得到新数据时将其设为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
在某些情况下可能会导致 bug（内容缺失）——使用风险自负。
:::

这可能会提高大型列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderScrollComponent`

```tsx
(props: object) => element;
```

渲染一个自定义滚动组件，例如使用不同的 `RefreshControl`。

| 类型     |
| -------- |
| function |

---

### `viewabilityConfig`

有关 flow 类型和更多文档，请参见 `ViewabilityHelper.js`。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 对的列表。当某个 `ViewabilityConfig` 的条件满足时，会调用对应的 `onViewableItemsChanged`。有关 flow 类型和更多文档，请参见 `ViewabilityHelper.js`。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

---

### `updateCellsBatchingPeriod`

低优先级项目渲染批次之间的时间间隔，例如用于渲染离屏较远的项目。与 `maxToRenderPerBatch` 类似，也是在填充率与响应性之间进行权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

以可见长度为单位，确定可见区域之外渲染的最大项目数。因此，如果你的列表填满屏幕，`windowSize={21}`（默认值）将渲染可见屏幕区域，以及视口上方最多 10 屏、下方最多 10 屏的内容。减小该数值会降低内存消耗并可能提升性能，但会增加快速滚动时短暂显示未渲染内容空白区域的可能性。

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

滚动到内容末尾。如果没有 `getItemLayout` 属性，这可能会出现卡顿。

**参数：**

| 名称 | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` 键包括：

- `'animated'` (`boolean`) - 滚动时列表是否带动画。默认值为 `true`。

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

- `'index'` (`number`)。必需。
- `'animated'` (`boolean`)。可选。
- `'viewOffset'` (`number`)。可选。
- `'viewPosition'` (`number`)。可选。

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

- `'item'` (`Item`)。必需。
- `'animated'` (`boolean`)。可选。
- `'viewOffset'` (`number`)。可选。
- `'viewPosition'` (`number`)。可选。

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中指定的内容像素偏移位置。

`offset` 参数是要滚动到的偏移量。如果 `horizontal` 为 true，则该偏移量是 x 值；否则，它是 y 值。

`animated` 参数（默认 `true`）定义列表在滚动时是否带动画。
