---
id: virtualizedlist
title: VirtualizedList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

更便于使用的 [`<FlatList>`](flatlist.md) 和 [`<SectionList>`](sectionlist.md) 组件的基础实现，这些组件也有更完善的文档。通常，只有在你需要比 [`FlatList`](flatlist.md) 提供更多灵活性时才应使用它，例如使用不可变数据而不是普通数组时。

虚拟化通过维护一个有限的活动项目渲染窗口，并将渲染窗口之外的所有项目替换为适当大小的空白区域，大幅改善大型列表的内存占用和性能。该窗口会根据滚动行为进行调整；如果项目距离可见区域较远，则会以低优先级增量渲染（在任何正在运行的交互完成后），否则会以高优先级渲染，从而最大限度地减少看到空白区域的可能性。

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

- 当内容滚动到渲染窗口之外时，不会保留内部状态。请确保所有数据都保存在项目数据中，或保存在 Flux、Redux 或 Relay 等外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 浅比较相等，它就不会重新渲染。请确保 `renderItem` 函数所依赖的所有内容都作为 prop（例如 `extraData`）传入，并且该 prop 在更新后不再是 `===`，否则你的 UI 可能不会因变化而更新。这包括 `data` prop 和父组件状态。
- 为了限制内存占用并实现流畅滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，并且可能会暂时看到空白内容。这是一个可以根据每个应用的需求进行调整的权衡，我们也在幕后持续改进。
- 默认情况下，列表会查找每个项目上的 `key` prop，并将其用作 React key。或者，你也可以提供自定义的 `keyExtractor` prop。

---

# 参考

## Props

### [ScrollView Props](scrollview.md#props)

继承 [ScrollView Props](scrollview.md#props)。

---

### `data`

传递给 `getItem` 和 `getItemCount` 以获取项目的不透明数据类型。

| 类型 |
| ---- |
| any  |

---

### <div className="label required basic">必填</div> **`getItem`**

```tsx
(data: any, index: number) => any;
```

用于从任意类型的数据块中提取项目的通用访问器。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必填</div> **`getItemCount`**

```tsx
(data: any) => number;
```

确定数据块中包含多少个项目。

| 类型     |
| -------- |
| function |

---

### <div className="label required basic">必填</div> **`renderItem`**

```tsx
(info: any) => ?React.Element<any>
```

从 `data` 中获取一个项目，并将其渲染到列表中

| 类型     |
| -------- |
| function |

---

### `CellRendererComponent`

CellRendererComponent 用于自定义由 `renderItem`/`ListItemComponent` 渲染的单元格在放入底层 ScrollView 时的包装方式。此组件必须接受用于通知 VirtualizedList 单元格内部变化的事件处理器。

| 类型                                     |
| ---------------------------------------- |
| `React.ComponentType<CellRendererProps>` |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不会渲染在顶部或底部。默认情况下会提供 `highlighted` 和 `leadingItem` props。`renderItem` 提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` prop，但你也可以使用 `separators.updateProps` 添加自定义 props。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListItemComponent`

每个数据项目都使用此元素进行渲染。可以是 React 组件类，也可以是渲染函数。

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

用于 `ListFooterComponent` 内部 View 的样式。

| 类型          | 必填 |
| ------------- | ---- |
| ViewStyleProp | 否   |

---

### `ListHeaderComponent`

渲染在所有项目的顶部。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

用于 `ListHeaderComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `debug`

`debug` 会启用额外的日志记录和可视化叠加层，以帮助调试使用和实现问题，但会显著影响性能。

| 类型    |
| ------- |
| boolean |

---

### 🗑️ `disableVirtualization`

:::warning[已弃用]
虚拟化可以显著优化性能和内存，但会完全卸载渲染窗口之外的 react 实例。你应该只在调试时禁用此功能。
:::

| 类型    |
| ------- |
| boolean |

---

### `extraData`

用于告知列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖 `data` prop 之外的任何内容，请将其放在这里，并以不可变方式处理。

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

如果为 `true`，则水平排列项目，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染的项目数。数量应足以填满屏幕，但不要多出太多。请注意，为了改善滚动到顶部操作的感知性能，这些项目不会作为窗口化渲染的一部分被卸载。

| 类型   | 默认值 |
| ------ | ------ |
| number | `10`   |

---

### `initialScrollIndex`

不从顶部的第一个项目开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化，该优化会始终保持前 `initialNumToRender` 个项目处于渲染状态，并立即渲染从此初始索引开始的项目。要求实现 `getItemLayout`。

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

用于提取指定索引处给定项目的唯一 key。Key 用于缓存，也作为 React key 来跟踪项目重新排序。默认提取器会依次检查 `item.key`、`item.id`，最后回退到使用索引，就像 React 的行为一样。

| 类型     |
| -------- |
| function |

---

### `maxToRenderPerBatch`

每个增量渲染批次中要渲染的最大项目数。一次渲染的项目越多，填充速率越好，但响应能力可能会下降，因为渲染内容可能会影响对按钮点击或其他交互的响应。

| 类型   |
| ------ |
| number |

---

### `onEndReached`

当滚动位置进入距离列表逻辑末尾 `onEndReachedThreshold` 的范围内时调用一次。

| 类型                                        |
| ------------------------------------------- |
| `(info: {distanceFromEnd: number}) => void` |

---

### `onEndReachedThreshold`

列表的尾部边缘必须距离内容末尾多远（以列表可见长度为单位）才会触发 `onEndReached` 回调。因此，值为 0.5 时，当内容末尾位于列表可见长度的一半以内时，将触发 `onEndReached`。

| 类型   | 默认值 |
| ------ | ------ |
| number | `2`    |

---

### `onRefresh`

```tsx
() => void;
```

如果提供，则会添加标准的 `RefreshControl` 以实现“下拉刷新”功能。请确保同时正确设置 `refreshing` prop。

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

用于处理滚动到尚未测量的索引时发生的失败。建议的操作是自行计算偏移量并调用 `scrollTo`，或者尽可能滚动，然后在渲染更多项目后重试。

| 类型     |
| -------- |
| function |

---

### `onStartReached`

当滚动位置进入距离列表逻辑起点 `onStartReachedThreshold` 的范围内时调用一次。

| 类型                                          |
| --------------------------------------------- |
| `(info: {distanceFromStart: number}) => void` |

---

### `onStartReachedThreshold`

列表的前缘必须距离内容起点多远（以列表可见长度为单位）才会触发 `onStartReached` 回调。因此，值为 0.5 时，当内容起点位于列表可见长度的一半以内时，将触发 `onStartReached`。

| 类型   | 默认值 |
| ------ | ------ |
| number | `2`    |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，具体定义由 `viewabilityConfig` prop 决定。

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

需要为加载指示器设置偏移量以正确显示时，设置此属性。

| 类型   |
| ------ |
| number |

---

### `refreshControl`

自定义刷新控件元素。设置后，它会覆盖内部构建的默认 `<RefreshControl>` 组件。`onRefresh` 和 `refreshing` props 也会被忽略。仅适用于垂直 VirtualizedList。

| 类型    |
| ------- |
| element |

---

### `refreshing`

等待刷新获取新数据时将其设置为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致错误（内容缺失）——使用风险由你自行承担
:::

当为 `true` 时，屏幕外的子视图会从其原生承载 superview 中移除。对于大型列表，这可能会改善滚动性能。在 Android 上，默认值为 `true`。

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

有关流类型和更多文档，请参阅 `ViewabilityHelper.js`。

| 类型              |
| ----------------- |
| ViewabilityConfig |

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 对的列表。当对应的 `ViewabilityConfig` 条件满足时，会调用特定的 `onViewableItemsChanged`。有关流类型和更多文档，请参阅 `ViewabilityHelper.js`。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

---

### `updateCellsBatchingPeriod`

低优先级项目渲染批次之间的时间间隔，例如用于渲染距离屏幕较远的项目。与 `maxToRenderPerBatch` 类似，这也是填充速率和响应能力之间的权衡。

| 类型   |
| ------ |
| number |

---

### `windowSize`

以可见长度为单位，确定在可见区域之外渲染的最大项目数。因此，如果列表填满屏幕，则 `windowSize={21}`（默认值）会渲染可见屏幕区域，以及视口上方最多 10 个屏幕和下方最多 10 个屏幕。减小此数值会降低内存占用，并可能改善性能，但会增加快速滚动时暂时显示未渲染内容空白区域的可能性。

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

提供对底层滚动响应器的句柄。请注意，`this._scrollRef` 可能不是 `ScrollView`，因此在调用 `getScrollResponder` 之前，需要检查它是否响应此方法。

---

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。没有 `getItemLayout` prop 时可能会出现卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` key 包括：

- `'animated'`（boolean）- 列表滚动时是否应执行动画。默认为 `true`。

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

- 'index'（number）。必填
- 'animated'（boolean）。可选
- 'viewOffset'（number）。可选
- 'viewPosition'（number）。可选

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

- 'item'（Item）。必填
- 'animated'（boolean）。可选
- 'viewOffset'（number）。可选
- 'viewPosition'（number）。可选

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

将列表滚动到特定的内容像素偏移量。

参数 `offset` 表示要滚动到的偏移量。当 `horizontal` 为 true 时，偏移量是 x 值；在其他情况下，偏移量是 y 值。

参数 `animated`（默认为 `true`）定义列表滚动时是否应执行动画。
