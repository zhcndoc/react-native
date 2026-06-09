---
id: sectionlist
title: SectionList
---

一种高性能的分组列表渲染接口，支持以下最实用的功能：

- 完全跨平台。
- 可配置的可见性回调。
- 支持列表头部。
- 支持列表尾部。
- 支持项目分隔线。
- 支持分组头部。
- 支持分组分隔线。
- 支持异构数据和项目渲染。
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
    title: '饮料',
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

这是对 [`<VirtualizedList>`](virtualizedlist.md) 的一个便捷封装，因此会继承其未在此处明确列出的 props（以及 [`<ScrollView>`](scrollview.md) 的 props），并带有以下注意事项：

- 当内容滚动到渲染窗口外时，内部状态不会被保留。请确保你的所有数据都保存在 item data 或外部存储中，例如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅相等，它就不会重新渲染。请确保你的 `renderItem` 函数所依赖的一切都作为 prop 传入（例如 `extraData`），并且在更新后它们不再 `===`，否则你的 UI 可能不会在变更时更新。这也包括 `data` prop 和父组件 state。
- 为了限制内存并实现流畅滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，并且可能会短暂看到空白内容。这是一种需要在性能与体验之间权衡的取舍，可以根据每个应用的需求进行调整，我们也在幕后持续改进它。
- 默认情况下，列表会在每个 item 上查找 `key` prop，并将其用作 React key。你也可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必需</div>**`renderItem`**

每个分组中每个项目的默认渲染器。可以按分组覆盖。应返回一个 React 元素。

| 类型     |
| -------- |
| function |

渲染函数将接收一个对象，其中包含以下键：

- 'item' (object) - 该项目对象，如本分组的 `data` 键中所指定
- 'index' (number) - 项目在该分组中的索引。
- 'section' (object) - `sections` 中所指定的完整分组对象。
- 'separators' (object) - 一个包含以下键的对象：
  - 'highlight' (function) - `() => void`
  - 'unhighlight' (function) - `() => void`
  - 'updateProps' (function) - `(select, newProps) => void`
    - 'select' (enum) - 可能的值为 'leading'、'trailing'
    - 'newProps' (object)

---

### <div className="label required basic">必需</div>**`sections`**

要渲染的实际数据，类似于 [`FlatList`](flatlist.md) 中的 `data` prop。

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

初始批次中要渲染多少个项目。这个数量应足以填满屏幕，但不要多于必要数量。请注意，这些项目永远不会作为窗口化渲染的一部分被卸载，以改善滚动到顶部操作的感知性能。

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

渲染于每个项目之间，但不会出现在顶部或底部。默认会提供 `highlighted`、`section` 以及 `[leading/trailing][Item/Section]` props。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` prop，但你也可以使用 `separators.updateProps` 添加自定义 props。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `keyExtractor`

用于在指定索引处为给定 item 提取唯一 key。该 key 用于缓存，并作为 React key 追踪 item 的重新排序。默认的提取器会先检查 `item.key`，然后是 `item.id`，最后像 React 一样回退使用索引。请注意，这会为每个 item 设置 key，但每个整体分组仍然需要自己的 key。

| 类型                                    |
| --------------------------------------- |
| (item: object, index: number) => string |

---

### `ListEmptyComponent`

列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

渲染在列表的最末尾。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponent`

渲染在列表的最开始。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `onRefresh`

如果提供此项，将添加一个标准的 RefreshControl 来实现“下拉刷新”功能。请同时正确设置 `refreshing` prop。若要让 RefreshControl 从顶部向下偏移（例如 100 个点），请使用 `progressViewOffset={100}`。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，如 `viewabilityConfig` prop 所定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `refreshing`

在等待刷新后的新数据时将其设为 true。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能会导致 bug（内容缺失）——请自行承担风险。
:::

当为 `true` 时，屏幕外的子视图会在离开屏幕后从其原生承载的父视图中移除。这可能会提高大型列表的滚动性能。在 Android 上，默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `renderSectionFooter`

渲染在每个分组的底部。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `renderSectionHeader`

渲染在每个分组的顶部。在 iOS 上，默认情况下这些标题会固定在 `ScrollView` 的顶部。请参见 `stickySectionHeadersEnabled`。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `SectionSeparatorComponent`

渲染在每个分组的顶部和底部（注意这不同于 `ItemSeparatorComponent`，后者只渲染在项目之间）。这些分隔线用于将分组与上下方的标题分开，通常具有与 `ItemSeparatorComponent` 相同的高亮响应。还会接收 `highlighted`、`[leading/trailing][Item/Section]` 以及来自 `separators.updateProps` 的任何自定义 props。

| 类型               |
| ------------------ |
| component, element |

---

### `stickySectionHeadersEnabled`

使分组标题固定在屏幕顶部，直到下一个标题将其顶出。由于这是该平台的标准行为，因此仅在 iOS 上默认启用。

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

滚动到指定 `sectionIndex` 和 `itemIndex`（在该 section 内）的项目，并将其放置在可视区域中，使 `viewPosition` 设为 `0` 时位于顶部（可能会被粘性头部遮挡）、`1` 时位于底部、`0.5` 时居中显示。

:::note
如果不指定 `getItemLayout` 或 `onScrollToIndexFailed` 属性，就无法滚动到渲染窗口之外的位置。
:::

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">Required</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时列表是否执行动画。默认值为 `true`。
- 'itemIndex' (number) - 要滚动到的项目在该 section 内的索引。必填。
- 'sectionIndex' (number) - 包含要滚动到的项目的 section 索引。必填。
- 'viewOffset' (number) - 用于偏移最终目标位置的固定像素数，例如用于补偿粘性头部。
- 'viewPosition' (number) - 值为 `0` 时将指定索引的项目放在顶部，`1` 时放在底部，`0.5` 时居中显示。

## 类型定义

### Section

一个用于标识要在给定 section 中渲染的数据的对象。

| Type |
| ---- |
| any  |

**属性：**

| Name                                                      | Type               | Description                                                                                                                                                         |
| --------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data <div className="label basic required">Required</div> | array              | 用于在此 section 中渲染项目的数据。对象数组，类似于 [`FlatList` 的 data 属性](flatlist#required-data)。                                         |
| key                                                       | string             | 可选键，用于跟踪 section 重新排序。如果你不打算重新排序 sections，默认会使用数组索引。                              |
| renderItem                                                | function           | 可为此 section 选填定义任意项目渲染器，以覆盖列表默认的 [`renderItem`](sectionlist#renderitem)。                          |
| ItemSeparatorComponent                                    | component, element | 可为此 section 选填定义任意项目分隔符，以覆盖列表默认的 [`ItemSeparatorComponent`](sectionlist#itemseparatorcomponent)。 |
| keyExtractor                                              | function           | 可为此 section 选填定义任意键提取器，以覆盖默认的 [`keyExtractor`](sectionlist#keyextractor)。                                   |
