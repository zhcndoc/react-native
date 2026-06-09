---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

作为更易用的 [`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 组件的基础实现，这两个组件也有更完善的文档。一般来说，只有在你需要比 [`FlatList`](flatlist.md) 提供的更大灵活性时才应使用它，例如需要配合不可变数据而不是普通数组时。

虚拟化通过维护一个有限的活动项渲染窗口，并用大小合适的空白空间替换渲染窗口之外的所有项，从而大幅提升大列表的内存占用和性能。该窗口会根据滚动行为自适应，并且当项目距离可见区域较远时，会以低优先级（在所有正在进行的交互之后）逐步渲染；否则会以高优先级渲染，以尽量减少看到空白空间的可能性。

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

一些注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保你的所有数据都保存在 item 数据中，或保存在 Flux、Redux 或 Relay 等外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 是浅比较相等的，它不会重新渲染。请确保 `renderItem` 函数依赖的所有内容都作为一个 prop（例如 `extraData`）传入，并且在更新后它们的引用不再是 `===`，否则你的 UI 在数据变化时可能不会更新。这也包括 `data` prop 和父组件状态。
- 为了限制内存并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度有可能快于填充速率，从而短暂看到空白内容。这是一种权衡，可以根据每个应用的需要进行调整，我们也正在幕后改进它。
- 默认情况下，列表会查找每个 item 上的 `key` prop 并将其用作 React key。或者，你也可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [ScrollView 属性](scrollview.md#props)

继承 [ScrollView 属性](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 用于检索条目的不透明数据类型。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必需</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

用于从任意数据块中提取某个 item 的通用访问器。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`getItemCount`**

```tsx
(data: any) => number;
```

确定数据块中有多少个 item。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中取出一个 item 并将其渲染到列表中

| 类型     |
| -------- |
| function |

---

### `CellRendererComponent`

`CellRendererComponent` 允许自定义 `renderItem`/`ListItemComponent` 渲染的单元在放入底层 `ScrollView` 时的包裹方式。此组件必须接受事件处理器，这些处理器会通知 `VirtualizedList` 单元内部的变化。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

渲染在每个 item 之间，但不在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` prop。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` prop，但你也可以通过 `separators.updateProps` 添加自定义 prop。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListItemComponent`

每个数据项都使用此元素进行渲染。可以是 React 组件类，也可以是渲染函数。

| 类型                |
| ------------------- |
| component, function |

---

### `ListFooterComponent`

渲染在所有项目的底部。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 `View` 的样式。

| 类型          | 必需 |
| ------------- | -------- |
| ViewStyleProp | 否       |

---

### `ListHeaderComponent`

渲染在所有项目的顶部。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 `View` 的样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `debug`

`debug` 会开启额外日志和可视化覆盖层，以帮助调试使用方式和实现，但会显著影响性能。

| 类型    |
| ------- |
| boolean |

---

### 🗑️ `disableVirtualization`

:::warning 已弃用
虚拟化提供了显著的性能和内存优化，但也会完全卸载渲染窗口之外的 react 实例。你通常只需要在调试时关闭它。
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

如果为 `true`，则将 item 横向排列，而不是纵向堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次要渲染多少个 item。这个数量应该足以填满屏幕，但不要太多。注意，为了提升滚动到顶部操作的感知性能，这些 item 作为窗口化渲染的一部分永远不会被卸载。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `initialScrollIndex`

不是从顶部的第一个 item 开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化——该优化会让前 `initialNumToRender` 个 item 始终保持渲染，并会立即渲染从该初始索引开始的 item。需要实现 `getItemLayout`。

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

用于为指定索引处的给定 item 提取唯一 key。该 key 会用于缓存，并作为 React key 追踪 item 重排。默认提取器会依次检查 `item.key`、`item.id`，然后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次中要渲染的 item 最大数量。一次渲染得越多，填充率越好，但响应性可能会下降，因为渲染内容可能会干扰按钮点击或其他交互的响应。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置进入距离列表逻辑末尾 `onEndReachedThreshold` 范围内时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

列表尾边缘距离内容末尾有多远（以列表可见长度为单位）时触发 `onEndReached` 回调。例如，值为 0.5 时，当内容末尾位于列表可见长度的一半以内时就会触发 `onEndReached`。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onRefresh`

```tsx
() => void;
```

如果提供了该项，就会添加标准的 `RefreshControl` 来实现“下拉刷新”功能。请同时确保正确设置 `refreshing` prop。

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

用于处理滚动到尚未测量的索引时的失败。建议的做法是自己计算偏移并调用 `scrollTo`，或者尽可能滚动到接近的位置，然后在渲染出更多 item 后再重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置进入距离列表逻辑起始位置 `onStartReachedThreshold` 范围内时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

列表前边缘距离内容起始位置有多远（以列表可见长度为单位）时触发 `onStartReached` 回调。例如，值为 0.5 时，当内容起始位置位于列表可见长度的一半以内时就会触发 `onStartReached`。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，具体由 `viewabilityConfig` prop 定义。

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

当需要偏移以使加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshControl`

自定义刷新控件元素。设置后会覆盖内部构建的默认 `<RefreshControl>` 组件。`onRefresh` 和 `refreshing` props 也会被忽略。仅适用于垂直 `VirtualizedList`。

| 类型    |
| ------- |
| element |

---

### `refreshing`

在等待新数据刷新时将其设为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能会导致 bug（内容缺失）——请自行承担风险使用。
:::

当为 `true` 时，屏幕外的子视图在离屏后会从其原生父视图中移除。这可能会提升大列表的滚动性能。在 Android 上默认值为 `true`。

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

流类型及进一步文档请参见 `ViewabilityHelper.js`。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 对的列表。当某个对应的 `ViewabilityConfig` 条件被满足时，就会调用其对应的 `onViewableItemsChanged`。流类型及进一步文档请参见 `ViewabilityHelper.js`。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

---

### `updateCellsBatchingPeriod`

低优先级 item 渲染批次之间的时间间隔，例如用于渲染距离屏幕较远的 item。与 `maxToRenderPerBatch` 类似，也是在填充率和响应性之间做权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

决定在可见区域之外渲染多少个 item 的上限，以可见长度为单位。因此，如果你的列表填满屏幕，那么 `windowSize={21}`（默认值）会渲染可见屏幕区域以及视口上方最多 10 屏、下方最多 10 屏。减小这个数值会降低内存占用并可能提升性能，但也会增加快速滚动时出现短暂未渲染空白区域的概率。"

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

滚动到内容末尾。若没有 `getItemLayout` 属性，可能会出现卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` 键如下：

- `'animated'`（boolean）- 列表在滚动时是否执行动画。默认为 `true`。

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

滚动到列表中指定的内容像素偏移位置。

参数 `offset` 表示要滚动到的偏移量。如果 `horizontal` 为 `true`，该偏移量表示 x 值；在其他情况下，该偏移量表示 y 值。

参数 `animated`（默认 `true`）定义列表在滚动时是否执行动画。
