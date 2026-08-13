---
id: sectionlist
title: SectionList
---

用于渲染分区列表的高性能界面，支持以下最实用的功能：

- 完全跨平台
- 可配置的可见性回调
- 列表头部支持
- 列表尾部支持
- 项目分隔线支持
- 分区头部支持
- 分区分隔线支持
- 异构数据和项目渲染支持
- 下拉刷新
- 滚动加载

如果不需要分区支持并且想要更简单的界面，请使用 [`<FlatList>`](flatlist.md)。

## 示例

```SnackPlayer name=SectionList%20Example
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

这是对 [`<VirtualizedList>`](virtualizedlist.md) 的便捷封装，因此会继承其属性（以及 [`<ScrollView>`](scrollview.md) 的属性）中此处未明确列出的部分，同时还具有以下注意事项：

- 当内容滚动出渲染窗口时，不会保留内部状态。请确保所有数据都存储在项目数据中，或存储在 Flux、Redux 或 Relay 等外部存储中
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅层相等，它将不会重新渲染。请确保 `renderItem` 函数所依赖的所有内容都作为属性传入（例如 `extraData`），并且更新后不再是 `===`，否则界面可能不会在发生变化时更新。这包括 `data` 属性和父组件状态
- 为了限制内存占用并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，并且可能会暂时看到空白内容。这是可以根据每个应用的需求进行调整的权衡，我们也在幕后持续改进这一点
- 默认情况下，列表会查找每个项目上的 `key` 属性，并将其用作 React key。或者，也可以提供自定义的 `keyExtractor` 属性

---

# 参考

## 属性

### [VirtualizedList Props](virtualizedlist.md#props)

继承 [VirtualizedList Props](virtualizedlist.md#props)。

---

### <div className="label required basic">Required</div>**`renderItem`**

每个分区中每个项目的默认渲染器。可以针对每个分区单独覆盖。应返回一个 React 元素。

| 类型 |
| ---- |
| 函数 |

渲染函数将接收一个包含以下键的对象：

- 'item'（对象）— 此分区的 `data` 键中指定的项目对象
- 'index'（数字）— 项目在分区中的索引
- 'section'（对象）— `sections` 中指定的完整分区对象
- 'separators'（对象）— 包含以下键的对象：
  - 'highlight'（函数）— `() => void`
  - 'unhighlight'（函数）— `() => void`
  - 'updateProps'（函数）— `(select, newProps) => void`
    - 'select'（枚举）— 可用值为 'leading'、'trailing'
    - 'newProps'（对象）

---

### <div className="label required basic">Required</div>**`sections`**

要渲染的实际数据，类似于 [`FlatList`](flatlist.md) 中的 `data` 属性。

| 类型                                   |
| -------------------------------------- |
| [Section](sectionlist.md#section) 数组 |

---

### `extraData`

用于告知列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果 `renderItem`、Header、Footer 等函数依赖 `data` 属性之外的任何内容，请将其放在这里，并以不可变的方式处理。

| 类型 |
| ---- |
| 任意 |

---

### `initialNumToRender`

初始批次中要渲染的项目数量。数量应足以填满屏幕，但不要多出太多。请注意，为了提升滚动到顶部操作的感知性能，这些项目不会作为窗口化渲染的一部分被卸载。

| 类型 | 默认值 |
| ---- | ------ |
| 数字 | `10`   |

---

### `inverted`

反转滚动方向。使用缩放值为 -1 的变换。

| 类型   | 默认值  |
| ------ | ------- |
| 布尔值 | `false` |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不会渲染在顶部或底部。默认情况下，会提供 `highlighted`、`section` 和 `[leading/trailing][Item/Section]` 属性。`renderItem` 提供 `separators.highlight`／`unhighlight`，这会更新 `highlighted` 属性，但也可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型             |
| ---------------- |
| 组件、函数、元素 |

---

### `keyExtractor`

用于提取指定索引处给定项目的唯一 key。Key 用于缓存，也用作 React key 来跟踪项目重新排序。默认提取器会依次检查 `item.key`、`item.id`，最后回退到使用索引，这与 React 的行为一致。请注意，这会为每个项目设置 key，但每个完整分区仍需要自己的 key。

| 类型                                      |
| ----------------------------------------- |
| `(item: object, index: number) => string` |

---

### `ListEmptyComponent`

列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型       |
| ---------- |
| 组件、元素 |

---

### `ListFooterComponent`

在列表最末尾渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型       |
| ---------- |
| 组件、元素 |

---

### `ListHeaderComponent`

在列表最开始渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型       |
| ---------- |
| 组件、元素 |

---

### `onRefresh`

如果提供了此属性，将添加一个标准的 RefreshControl 来实现“下拉刷新”功能。请确保同时正确设置 `refreshing` 属性。要将 RefreshControl 从顶部偏移（例如偏移 100 pts），请使用 `progressViewOffset={100}`。

| 类型 |
| ---- |
| 函数 |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，具体由 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `refreshing`

等待刷新获取新数据时将其设置为 true。

| 类型   | 默认值  |
| ------ | ------- |
| 布尔值 | `false` |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致错误（内容缺失）——使用风险由您自行承担
:::

为 `true` 时，屏幕外的子视图会从其原生承载父视图中移除。对于大型列表，这可能会提升滚动性能。在 Android 上，默认值为 `true`。

| 类型   |
| ------ |
| 布尔值 |

---

### `renderSectionFooter`

在每个分区的底部渲染。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `renderSectionHeader`

在每个分区的顶部渲染。在 iOS 上，默认情况下这些元素会固定在 `ScrollView` 顶部。请参阅 `stickySectionHeadersEnabled`。

| 类型                                                                      |
| ------------------------------------------------------------------------- |
| `md (info: {section: [Section](sectionlist#section)}) => element ｜ null` |

---

### `SectionSeparatorComponent`

在每个分区的顶部和底部渲染（请注意，这与仅在项目之间渲染的 `ItemSeparatorComponent` 不同）。它们用于将分区与上下方的头部分隔开，通常具有与 `ItemSeparatorComponent` 相同的高亮响应。还会接收 `highlighted`、`[leading/trailing][Item/Section]`，以及来自 `separators.updateProps` 的任何自定义属性。

| 类型       |
| ---------- |
| 组件、元素 |

---

### `stickySectionHeadersEnabled`

使分区头部固定在屏幕顶部，直到下一个分区头部将其推出。仅在 iOS 上默认启用，因为这是该平台的标准行为。

| 类型   | 默认值                                                                                               |
| ------ | ---------------------------------------------------------------------------------------------------- |
| 布尔值 | `false` <div className="label android">Android</div><hr/>`true` <div className="label ios">iOS</div> |

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

告知列表发生了交互，这应触发可见性计算，例如当 `waitForInteractions` 为 true 且用户尚未滚动时。通常会通过点击项目或导航操作调用此方法。

---

### `scrollToLocation()`

```tsx
scrollToLocation(params: SectionListScrollParams);
```

滚动到指定 `sectionIndex` 和 `itemIndex`（位于该分区内）的项目，并将其定位在可见区域中：将 `viewPosition` 设置为 `0` 会使其位于顶部（可能被固定头部覆盖），设置为 `1` 会使其位于底部，设置为 `0.5` 会使其位于中间。

:::note
如果未指定 `getItemLayout` 或 `onScrollToIndexFailed` 属性，则无法滚动到渲染窗口之外的位置
:::

**参数：**

| 名称                                                        | 类型 |
| ----------------------------------------------------------- | ---- |
| params <div className="label basic required">Required</div> | 对象 |

有效的 `params` 键包括：

- 'animated'（布尔值）— 列表滚动时是否应执行动画。默认为 `true`
- 'itemIndex'（数字）— 要滚动到的项目在分区内的索引。必填
- 'sectionIndex'（数字）— 包含要滚动到的项目的分区索引。必填
- 'viewOffset'（数字）— 最终目标位置的固定像素偏移量，例如用于补偿固定头部
- 'viewPosition'（数字）— 值为 `0` 时，索引指定的项目位于顶部；值为 `1` 时位于底部；值为 `0.5` 时位于中间

## 类型定义

### Section

用于标识给定分区要渲染的数据的对象。

| 类型 |
| ---- |
| 任意 |

**属性：**

| 名称                                                      | 类型       | 描述                                                                                                              |
| --------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| data <div className="label basic required">Required</div> | 数组       | 用于渲染此分区中项目的数据。由对象组成的数组，类似于 [`FlatList` 的 data 属性](flatlist#required-data)。          |
| key                                                       | 字符串     | 用于跟踪分区重新排序的可选 key。如果不计划对分区重新排序，则默认使用数组索引                                      |
| renderItem                                                | 函数       | 可选地为此分区定义任意项目渲染器，以覆盖列表默认的 [`renderItem`](sectionlist#renderitem)                         |
| ItemSeparatorComponent                                    | 组件、元素 | 可选地为此分区定义任意项目分隔线，以覆盖列表默认的 [`ItemSeparatorComponent`](sectionlist#itemseparatorcomponent) |
| keyExtractor                                              | 函数       | 可选地为此分区定义任意 key 提取器，以覆盖默认的 [`keyExtractor`](sectionlist#keyextractor)                        |
