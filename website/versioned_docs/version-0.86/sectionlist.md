---
id: sectionlist
title: SectionList
---

一个高性能的分组列表渲染接口，支持最实用的功能：

- 完全跨平台。
- 可配置的可视性回调。
- 支持列表头部。
- 支持列表尾部。
- 支持项分隔符。
- 支持分组头部。
- 支持分组分隔符。
- 支持异构数据和项渲染。
- 下拉刷新。
- 滚动加载。

如果你不需要分组支持，并且想要一个更简单的接口，请使用 [`<FlatList>`](flatlist.md)。

## 示例

```SnackPlayer name=SectionList%20Example
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    title: '主菜',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: '配菜',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: '饮品',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: '甜点',
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

这是对 [`<VirtualizedList>`](virtualizedlist.md) 的一个便捷封装，因此会继承其属性（以及那些未在此明确列出的 [`<ScrollView>`](scrollview.md) 的属性），并附带以下注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保你的所有数据都已捕获在项数据中，或保存在外部存储中，例如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅层相等，它将不会重新渲染。请确保你的 `renderItem` 函数依赖的所有内容都作为一个不会在更新后仍然 `===` 的 prop 传入（例如 `extraData`），否则你的 UI 可能不会在变化时更新。这包括 `data` prop 和父组件状态。
- 为了限制内存并实现流畅滚动，内容会在屏幕外异步渲染。这意味着有可能滚动速度快于填充速率，从而短暂看到空白内容。这是一种权衡，可以根据每个应用的需要进行调整，我们也正在幕后努力改进它。
- 默认情况下，列表会在每个项上查找 `key` prop，并将其用作 React key。或者，你可以提供一个自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必需</div>**`renderItem`**

每个分组中每个项的默认渲染器。可以按分组覆盖。应返回一个 React 元素。

| 类型     |
| -------- |
| function |

渲染函数将接收一个包含以下键的对象：

- 'item' (object) - 此分组的 `data` 键中指定的项对象
- 'index' (number) - 项在分组中的索引。
- 'section' (object) - `sections` 中指定的完整分组对象。
- 'separators' (object) - 一个包含以下键的对象：
  - 'highlight' (function) - `() => void`
  - 'unhighlight' (function) - `() => void`
  - 'updateProps' (function) - `(select, newProps) => void`
    - 'select' (enum) - 可能的值为 'leading'、'trailing'
    - 'newProps' (object)

---

### <div className="label required basic">必需</div>**`sections`**

实际要渲染的数据，类似于 [`FlatList`](flatlist.md) 中的 `data` prop。

| 类型                                        |
| ------------------------------------------- |
| [Section](sectionlist.md#section) 的数组 |

---

### `extraData`

用于告诉列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` prop 之外的任何内容，就把它放在这里，并以不可变方式处理。

| 类型 |
| ---- |
| any  |

---

### `initialNumToRender`

初始批次中要渲染多少项。这个数量应足以填满屏幕，但不要多得太多。注意，为了提升滚动到顶部操作的感知性能，这些项将不会作为窗口化渲染的一部分被卸载。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `inverted`

反转滚动方向。使用 -1 的 scale 变换。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `ItemSeparatorComponent`

渲染于每个项之间，但不会在顶部或底部。默认会提供 `highlighted`、`section` 以及 `[leading/trailing][Item/Section]` 属性。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们将更新 `highlighted` 属性，但你也可以通过 `separators.updateProps` 添加自定义属性。可以是一个 React 组件（例如 `SomeComponent`），或者一个 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `keyExtractor`

用于在指定索引处提取给定项的唯一键。该键用于缓存以及作为 React key 来跟踪项的重新排序。默认提取器会先检查 `item.key`，然后是 `item.id`，最后像 React 一样回退到使用索引。注意，这会为每个项设置键，但每个整体分组仍然需要自己的键。

| 类型                                    |
| --------------------------------------- |
| (item: object, index: number) => string |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是一个 React 组件（例如 `SomeComponent`），或者一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

渲染于列表的最末尾。可以是一个 React 组件（例如 `SomeComponent`），或者一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponent`

渲染于列表的最开始。可以是一个 React 组件（例如 `SomeComponent`），或者一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `onRefresh`

如果提供，将添加标准的 `RefreshControl` 以实现“下拉刷新”功能。请确保也正确设置 `refreshing` prop。要让 `RefreshControl` 与顶部之间留出偏移（例如 100 pt），请使用 `progressViewOffset={100}`。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，由 `viewabilityConfig` prop 定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `refreshing`

在等待刷新返回的新数据时将其设为 true。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `removeClippedSubviews`

:::warning
在某些情况下使用此属性可能会导致 bug（内容缺失）——请自行承担风险。
:::

当为 `true` 时，屏幕外的子视图在离屏时会从其原生 backing superview 中移除。这可能会提高大型列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderSectionFooter`

渲染于每个分组的底部。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `renderSectionHeader`

渲染于每个分组的顶部。在 iOS 上，这些默认会固定在 `ScrollView` 顶部。参见 `stickySectionHeadersEnabled`。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `SectionSeparatorComponent`

渲染于每个分组的顶部和底部（注意这与仅渲染于项之间的 `ItemSeparatorComponent` 不同）。这些用于将分组与上下方的标题分隔开，通常具有与 `ItemSeparatorComponent` 相同的高亮响应。还会接收 `highlighted`、`[leading/trailing][Item/Section]` 以及来自 `separators.updateProps` 的任何自定义属性。

| 类型               |
| ------------------ |
| component, element |

---

### `stickySectionHeadersEnabled`

使分组标题固定在屏幕顶部，直到下一个标题将其顶走。默认仅在 iOS 上启用，因为这是那里的平台标准。

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

告知列表已发生一次交互，这应触发可视性计算，例如当 `waitForInteractions` 为 true 且用户尚未滚动时。通常由对条目的点击或导航操作调用。

---

### `scrollToLocation()`

```tsx
scrollToLocation(params: SectionListScrollParams);
```

将滚动到指定的 `sectionIndex` 和 `itemIndex`（在该 section 内）对应的条目，并定位在可视区域中，使 `viewPosition` 设为 `0` 时位于顶部（且可能被粘性头部遮挡），`1` 时位于底部，`0.5` 时居中显示。

:::note
如果不指定 `getItemLayout` 或 `onScrollToIndexFailed` 属性，就无法滚动到渲染窗口之外的位置。
:::

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必填</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时列表是否应执行动画。默认为 `true`。
- 'itemIndex' (number) - 要滚动到的条目在该 section 内的索引。必填。
- 'sectionIndex' (number) - 包含要滚动到的条目的 section 索引。必填。
- 'viewOffset' (number) - 用于偏移最终目标位置的固定像素值，例如用于补偿粘性头部。
- 'viewPosition' (number) - 值为 `0` 时将指定索引的条目放在顶部，`1` 时放在底部，`0.5` 时居中显示。

## 类型定义

### Section

一个用于标识给定 section 中要渲染的数据的对象。

| Type |
| ---- |
| any  |

**属性：**

| Name                                                      | Type               | Description                                                                                                                                                         |
| --------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data <div className="label basic required">必填</div> | array              | 用于渲染该 section 中条目的数据。对象数组，类似于 [`FlatList` 的 data 属性](flatlist#required-data)。                                         |
| key                                                       | string             | 用于跟踪 section 重排序的可选键。如果你不打算对 section 重新排序，默认会使用数组索引。                              |
| renderItem                                                | function           | 可为该 section 定义任意条目渲染器，以覆盖列表默认的 [`renderItem`](sectionlist#renderitem)。                          |
| ItemSeparatorComponent                                    | component, element | 可为该 section 定义任意条目分隔符，以覆盖列表默认的 [`ItemSeparatorComponent`](sectionlist#itemseparatorcomponent)。 |
| keyExtractor                                              | function           | 可为该 section 定义任意键提取器，以覆盖默认的 [`keyExtractor`](sectionlist#keyextractor)。                                   |
