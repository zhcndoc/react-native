---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

更方便的 [`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 组件的基础实现，这些组件的文档也更完善。通常情况下，只有当你需要比 [`FlatList`](flatlist.md) 提供的更多灵活性时才真正需要使用它，例如用于不可变数据而非普通数组。

虚拟化通过维护有限的活跃项目渲染窗口，并用适当大小的空白区域替换渲染窗口外的所有项目，极大地改善了大列表的内存使用和性能。窗口会根据滚动行为进行调整，且如果项目远离可见区域，则通过低优先级（在任何正在运行的交互之后）渐进式渲染；否则通过高优先级渲染，以最小化看到空白区域的可能性。

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

- 当内容滚动出渲染窗口时，内部状态不会保存。请确保所有数据都包含在项目数据中或存储于外部存储库中，如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，意味着如果 `props` 浅比较相等，它不会重新渲染。请确保你的 `renderItem` 函数依赖的所有内容都通过 props （例如 `extraData`）传入，且在更新后不是 `===`，否则 UI 可能不会响应变化。这包括 `data` 属性和父组件状态。
- 为了限制内存占用并支持流畅滚动，内容是异步离屏渲染的。这意味着可能出现快速滚动超过填充速度，短暂出现空白内容的情况。这是一种权衡，可以根据应用需求进行调整，我们也正在幕后持续改进。
- 默认情况下，列表会寻找每个项目的 `key` 属性作为 React key。你也可以提供自定义的 `keyExtractor` 属性。

---

# 参考

## 属性

### [ScrollView 属性](scrollview.md#props)

继承 [ScrollView 属性](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 用以获取项目的不可见数据类型。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必需</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

从任意数据源中提取项目的通用访问器。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`getItemCount`**

```tsx
(data: any) => number;
```

确定数据源中项目的数量。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中获取项目并渲染到列表。

| 类型     |
| -------- |
| function |

---

### `CellRendererComponent`

允许自定义通过 `renderItem`/`ListItemComponent` 渲染的单元如何包装进入底层 ScrollView。该组件必须接受事件处理器以通知 VirtualizedList 单元内的变化。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

在每个项目间渲染，但不会出现在顶部或底部。默认提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 提供 `separators.highlight`/`unhighlight` 以更新 `highlighted` 属性，且可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| 组件，函数，元素             |

---

### `ListEmptyComponent`

列表为空时渲染。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `ListItemComponent`

每条数据项通过该元素渲染。可以是 React 组件类，或渲染函数。

| 类型                |
| ------------------- |
| 组件，函数          |

---

### `ListFooterComponent`

渲染在所有项目底部。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `ListFooterComponentStyle`

用于 `ListFooterComponent` 内部视图的样式。

| 类型          | 是否必需 |
| ------------- | -------- |
| ViewStyleProp | 否       |

---

### `ListHeaderComponent`

渲染在所有项目顶部。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `ListHeaderComponentStyle`

用于 `ListHeaderComponent` 内部视图的样式。

| 类型                           |
| ------------------------------ |
| [视图样式](view-style-props)   |

---

### `debug`

启用额外日志和视觉叠加，帮助调试使用和实现，但会明显影响性能。

| 类型    |
| ------- |
| boolean |

---

### 🗑️ `disableVirtualization`

:::warning 已废弃
虚拟化可显著提升性能和内存优化，但会完全卸载不在渲染窗口内的 React 实例。仅应在调试时禁用。
:::

| 类型    |
| ------- |
| boolean |

---

### `extraData`

标记属性，告诉列表需要重新渲染（因其实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` 之外的内容，请把它放在这里并保持不可变。

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

若为 `true`，项目将水平排列，而非垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次渲染的项目数量。应足够填满屏幕但不要过多。注意这些项目永远不会被卸载，以提升滚动到顶部操作的感知性能。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `initialScrollIndex`

而非从第一个项目顶部开始，使用此索引开始。禁用“滚动到顶部”优化，直接渲染从此索引开始的项目。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| number |

---

### `inverted`

反转滚动方向。使用 `-1` 缩放变换。

| 类型    |
| ------- |
| boolean |

---

### `keyExtractor`

```tsx
(item: any, index: number) => string;
```

用于提取指定索引项目的唯一键。键用于缓存及作为 React key 跟踪项目重新排序。默认提取器先检查 `item.key`，然后 `item.id`，最后回退到索引，类似 React。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次渲染的最大项目数量。一次渲染越多，填充率越好，但可能影响响应性，因为渲染可能干扰按钮点击或其他交互响应。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置在距离列表逻辑末尾的 `onEndReachedThreshold` 以内时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

距离内容末尾触发 `onEndReached` 回调的阈值（以列表可见长度为单位）。例如，值为 0.5 时，当内容末尾到列表末尾距离在半个可见长度内即触发。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onRefresh`

```tsx
() => void;
```

若提供，将添加标准 `RefreshControl` 以支持“下拉刷新”功能。确保正确设置 `refreshing` 属性。

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

处理滚动到未测量索引失败的情况。推荐措施为自计算偏移并调用 `scrollTo`，或滚动至最大可滚动距离后等待更多项目渲染再重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置在距离列表逻辑起点的 `onStartReachedThreshold` 以内时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

距离内容起点触发 `onStartReached` 回调的阈值（以列表可见长度为单位）。例如，值为 0.5 时，当内容起点到列表起点距离在半个可见长度内即触发。

| 类型   | 默认值 |
| ------ | ------- |
| number | `2`     |

---

### `onViewableItemsChanged`

当行的可视状态改变时调用，依据 `viewabilityConfig` 属性定义。

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

设置此项以便加载指示器正确显示时需要的偏移。

| 类型   |
| ------ |
| number |

---

### `refreshControl`

自定义刷新控件元素。设置后覆盖内部默认 `<RefreshControl>` 组件，且忽略 `onRefresh` 和 `refreshing` 属性。仅适用于垂直的 VirtualizedList。

| 类型    |
| ------- |
| 元素    |

---

### `refreshing`

等待刷新获得新数据时设置为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
使用此属性可能在某些情况下导致 BUG（内容丢失）——请谨慎使用。
:::

为 `true` 时，离屏的子视图会从其本地视图树中移除，可能提升大列表滚动性能。在 Android 上默认为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderScrollComponent`

```tsx
(props: object) => element;
```

渲染自定义滚动组件，例如带有不同样式的 `RefreshControl`。

| 类型     |
| -------- |
| function |

---

### `viewabilityConfig`

详见 `ViewabilityHelper.js` 中的 flow 类型和更多文档。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig` 与 `onViewableItemsChanged` 的配对列表。当对应的条件满足时，会调用相应的 `onViewableItemsChanged`。详见 `ViewabilityHelper.js` 的 flow 类型和更多文档。

| 类型                                   |
| ------------------------------------- |
| ViewabilityConfigCallbackPair 数组    |

---

### `updateCellsBatchingPeriod`

低优先级项目渲染批次之间的时间间隔，例如渲染较远离屏幕外的项目。与 `maxToRenderPerBatch` 具有类似的填充率/响应性权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

确定可见区域外渲染的最大项目数，以可见长度为单位。例如，列表填满屏幕，`windowSize = 21`（默认）将渲染整个屏幕范围并向上向下各多出 10 个屏幕内容。减少此值会降低内存消耗并可能提升性能，但快速滚动时更可能看到短暂空白。

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

提供对底层滚动响应器的引用。注意 `this._scrollRef` 不一定是 `ScrollView`，因此调用前需确认其响应 `getScrollResponder`。

---

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。若未实现 `getItemLayout`，可能出现卡顿。

**参数：**

| 名称    | 类型   |
| ------- | ------ |
| params  | 对象   |

支持的 params 键：

- `'animated'`（布尔），是否开启滚动动画，默认 `true`。

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

参数如下：

- 'index'（数字），必需。
- 'animated'（布尔），可选。
- 'viewOffset'（数字），可选。
- 'viewPosition'（数字），可选。

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

参数如下：

- 'item'（项目），必需。
- 'animated'（布尔），可选。
- 'viewOffset'（数字），可选。
- 'viewPosition'（数字），可选。

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中特定像素偏移位置。

参数 `offset` 期望滚动到的偏移量。在 `horizontal` 为 true 时，偏移是 x 轴值，否则为 y 轴值。

参数 `animated`（默认 `true`）指定滚动时是否执行动画。