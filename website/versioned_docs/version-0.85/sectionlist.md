---
id: sectionlist
title: SectionList
---

一个用于渲染分区列表的高性能接口，支持以下最实用的功能：

- 完全跨平台。
- 可配置的可见性回调。
- 列表头部支持。
- 列表底部支持。
- 项分隔符支持。
- 分区头部支持。
- 分区分隔符支持。
- 异构数据和项渲染支持。
- 下拉刷新。
- 滚动加载。

如果你不需要分区支持且想要更简单的接口，请使用 [`<FlatList>`](flatlist.md)。

## 示例

```SnackPlayer name=SectionList%20Example
import React from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});

export default App;
```

这是 [`<VirtualizedList>`](virtualizedlist.md) 的便捷包装器，因此继承了其属性（以及 [`<ScrollView>`](scrollview.md) 的属性），除非此处明确列出，并注意以下注意事项：

- 当内容滚动出渲染窗口时，内部状态不会保留。确保所有数据都捕获在 item 数据或外部存储中，如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅相等，它将不会重新渲染。确保你的 `renderItem` 函数依赖的所有内容都作为 prop 传递（例如 `extraData`），并且在更新后不 `===`，否则你的 UI 可能不会随变化更新。这包括 `data` prop 和父组件状态。
- 为了限制内存并实现平滑滚动，内容是异步离线渲染的。这意味着有可能滚动速度快于填充率，暂时看到空白内容。这是一个可以根据每个应用的需求进行调整的权衡，我们正在幕后改进它。
- 默认情况下，列表会在每个 item 上查找 `key` prop 并将其用作 React key。或者，你可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必需</div>**`renderItem`**

每个分区中每个项的默认渲染器。可以在每个分区的基础上覆盖。应返回一个 React 元素。

| 类型     |
| -------- |
| function |

渲染函数将传递一个包含以下键的对象：

- 'item' (object) - 此项的对象，如该分区的 `data` 键中指定
- 'index' (number) - 项在分区内的索引。
- 'section' (object) - `sections` 中指定的完整分区对象。
- 'separators' (object) - 一个包含以下键的对象：
  - 'highlight' (function) - `() => void`
  - 'unhighlight' (function) - `() => void`
  - 'updateProps' (function) - `(select, newProps) => void`
    - 'select' (enum) - 可能的值为 'leading', 'trailing'
    - 'newProps' (object)

---

### <div className="label required basic">必需</div>**`sections`**

要渲染的实际数据，类似于 [`FlatList`](flatlist.md) 中的 `data` 属性。

| 类型                                        |
| ------------------------------------------- |
| [Section](sectionlist.md#section) 数组 |

---

### `extraData`

一个标记属性，用于告诉列表重新渲染（因为它实现了 `PureComponent`）。如果你的任何 `renderItem`、Header、Footer 等函数依赖于 `data` 属性之外的任何内容，请将其放在此处并将其视为不可变的。

| 类型 |
| ---- |
| any  |

---

### `initialNumToRender`

初始批次中要渲染多少项。这应该足以填充屏幕，但不要太多。注意，为了提高滚动到顶部操作的感知性能，这些项作为窗口化渲染的一部分永远不会被卸载。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `inverted`

反转滚动方向。使用 -1 的缩放变换。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `ItemSeparatorComponent`

渲染在每项之间，但不在顶部或底部。默认情况下，提供 `highlighted`、`section` 和 `[leading/trailing][Item/Section]` 属性。`renderItem` 提供 `separators.highlight`/`unhighlight` 将更新 `highlighted` 属性，但你也可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `keyExtractor`

用于提取指定索引处给定项的唯一键。键用于缓存并作为 React 键来跟踪项重新排序。默认提取器检查 `item.key`，然后 `item.id`，然后回退到使用索引，就像 React 一样。注意，这为每个项设置键，但每个整体分区仍然需要自己的键。

| 类型                                    |
| --------------------------------------- |
| (item: object, index: number) => string |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

渲染在列表的最末尾。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponent`

渲染在列表的最开头。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `onRefresh`

如果提供，将为“下拉刷新”功能添加标准的 RefreshControl。确保也正确设置 `refreshing` 属性。要将 RefreshControl 从顶部偏移（例如 100 pts），使用 `progressViewOffset={100}`。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当行的可见性变化时调用，由 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `refreshing`

当等待刷新带来的新数据时设置为 true。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能导致错误（内容丢失）- 使用风险自负。
:::

当 `true` 时，离屏子视图在离屏时从其原生备份父视图中移除。这可能会提高大列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderSectionFooter`

渲染在每个分区的底部。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `renderSectionHeader`

渲染在每个分区的顶部。默认情况下，这些在 iOS 上粘滞在 `ScrollView` 的顶部。参见 `stickySectionHeadersEnabled`。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `SectionSeparatorComponent`

渲染在每个分区的顶部和底部（注意这与 `ItemSeparatorComponent` 不同，后者仅渲染在项之间）。这些旨在将分区与上方和下方的头部分开，通常具有与 `ItemSeparatorComponent` 相同的高亮响应。还接收 `highlighted`、`[leading/trailing][Item/Section]` 以及来自 `separators.updateProps` 的任何自定义属性。

| 类型               |
| ------------------ |
| component, element |

---

### `stickySectionHeadersEnabled`

使分区头粘滞在屏幕顶部，直到下一个分区头将其推离。仅在 iOS 上默认启用，因为那是那里的平台标准。

| 类型    | 默认值                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------- |
| boolean | `false` <div className="label android">Android</div><hr/>`true` <div className="label ios">iOS</div> |

## 方法

### `flashScrollIndicators()` <div className="label ios">iOS</div>

```tsx
flashScrollIndicators();
```

短暂显示滚动指示器。

---

### `recordInteraction()`

```tsx
recordInteraction();
```

通知列表已发生交互，这将触发可见性计算，例如，如果 `waitForInteractions` 为 true 且用户尚未滚动。这通常由项上的点击或导航操作调用。

---

### `scrollToLocation()`

```tsx
scrollToLocation(params: SectionListScrollParams);
```

滚动到指定 `sectionIndex` 和 `itemIndex`（在部分内）的项，并将其定位在可见区域内，其中 `viewPosition` 设置为 `0` 将其置于顶部（可能会被粘性头部覆盖），`1` 置于底部，`0.5` 居中。

:::note
如果不指定 `getItemLayout` 或 `onScrollToIndexFailed` 属性，则无法滚动到渲染窗口之外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键包括：

- 'animated' (boolean) - 列表在滚动时是否执行动画。默认为 `true`。
- 'itemIndex' (number) - 要滚动到的项在部分内的索引。必需。
- 'sectionIndex' (number) - 包含要滚动到的项的部分的索引。必需。
- 'viewOffset' (number) - 偏移最终目标位置的固定像素数，例如用于补偿粘性头部。
- 'viewPosition' (number) - 值 `0` 将索引指定的项置于顶部，`1` 置于底部，`0.5` 居中。

## 类型定义

### Section

标识要针对给定部分渲染的数据的对象。

| 类型 |
| ---- |
| any  |

**属性：**

| 名称                                                      | 类型               | 描述                                                                                                                                                         |
| --------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data <div className="label basic required">必需</div> | array              | 用于渲染此部分中项的数据。对象数组，很像 [`FlatList` 的 data 属性](flatlist#required-data)。                                         |
| key                                                       | string             | 可选的键，用于跟踪部分重新排序。如果您不打算重新排序部分，默认将使用数组索引。                              |
| renderItem                                                | function           | 可选为此部分定义任意项渲染器，覆盖列表的默认 [`renderItem`](sectionlist#renderitem)。                          |
| ItemSeparatorComponent                                    | component, element | 可选为此部分定义任意项分隔符，覆盖列表的默认 [`ItemSeparatorComponent`](sectionlist#itemseparatorcomponent)。 |
| keyExtractor                                              | function           | 可选为此部分定义任意键提取器，覆盖列表的默认 [`keyExtractor`](sectionlist#keyextractor)。                                   |
