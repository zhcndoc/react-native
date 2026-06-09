---
id: sectionlist
title: SectionList
---

一个高性能的分段列表渲染接口，支持最实用的功能：

- 完全跨平台。
- 可配置的视图可见性回调。
- 列表头支持。
- 列表尾支持。
- 项目分隔符支持。
- 分段头支持。
- 分段分隔符支持。
- 支持异构数据和项目渲染。
- 下拉刷新。
- 滚动加载。

如果你不需要分段支持且想要一个更简单的接口，使用 [`<FlatList>`](flatlist.md)。

## 示例

```SnackPlayer name=SectionList%20Example
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    title: '主菜',
    data: ['披萨', '汉堡', '烩饭'],
  },
  {
    title: '配菜',
    data: ['薯条', '洋葱圈', '炸虾'],
  },
  {
    title: '饮料',
    data: ['水', '可乐', '啤酒'],
  },
  {
    title: '甜点',
    data: ['芝士蛋糕', '冰淇淋'],
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

这是 [`<VirtualizedList>`](virtualizedlist.md) 的一个便捷包装，因此继承了其属性（以及 [`<ScrollView>`](scrollview.md) 的属性），未在此处显式列出的属性仍然可用，同时需注意以下事项：

- 当内容滚动出渲染窗口时，内部状态不会被保留。确保所有数据都存储在项目数据或外部存储（如 Flux、Redux 或 Relay）中。
- 这是一个 `PureComponent`，意味着如果 `props` 浅比较相等则不会重新渲染。确保你 `renderItem` 函数依赖的一切都通过 props 传递（例如 `extraData`），且更新后不能是浅相等，否则 UI 可能不会更新。这包括 `data` 属性和父组件状态。
- 为了限制内存并实现流畅滚动，内容异步在屏幕外渲染。可能会出现滚动速度超过渲染速度，暂时看到空白内容的情况。这是可以调节的折中方案，我们正在后台改进。
- 默认情况下，列表会查找每个项目的 `key` 属性作为 React 的 key。你也可以提供自定义的 `keyExtractor` 属性。

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必需</div>**`renderItem`**

每个分段中的每个项目的默认渲染器。可针对每个分段单独覆盖。应返回一个 React 元素。

| 类型     |
| -------- |
| 函数 |

渲染函数将接收一个带有以下键的对象：

- 'item' (对象) - 此分段 `data` 中指定的项目对象
- 'index' (数字) - 项目在分段内的索引。
- 'section' (对象) - 指定的完整分段对象。
- 'separators' (对象) - 包含以下键的对象：
  - 'highlight' (函数) - `() => void`
  - 'unhighlight' (函数) - `() => void`
  - 'updateProps' (函数) - `(select, newProps) => void`
    - 'select' (枚举) - 可能值为 'leading' 或 'trailing'
    - 'newProps' (对象)

---

### <div className="label required basic">必需</div>**`sections`**

实际要渲染的数据，类似于 [`FlatList`](flatlist.md) 中的 `data` 属性。

| 类型                                        |
| ------------------------------------------- |
| [Section](sectionlist.md#section) 数组      |

---

### `extraData`

用于通知列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、头部、尾部 等函数依赖于 `data` 属性之外的任何东西，请将它放在这里且保持不可变。

| 类型 |
| ---- |
| 任意  |

---

### `initialNumToRender`

初始批量渲染的项目数量。应足够填满屏幕，但不要过多。注意，这些项目不会随窗口渲染被卸载，以提升滚动到顶部动作的感知性能。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `10`    |

---

### `inverted`

反转滚动方向。使用 -1 的缩放变换。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | `false` |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不在顶部或底部。默认会提供 `highlighted`、`section` 和 `[leading/trailing][Item/Section]` 属性。`renderItem` 提供 `separators.highlight` / `unhighlight` 来更新 `highlighted` 属性，也可以通过 `separators.updateProps` 添加自定义属性。可为 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| 组件，函数，元素             |

---

### `keyExtractor`

用于从指定索引的给定项目中提取唯一键。键用于缓存以及作为 React key 用于跟踪项目重新排序。默认提取器检查 `item.key`，然后是 `item.id`，最后使用索引，类似 React。注意，这设置的是每个项目的键，每个整体分段仍需自己的 key。

| 类型                                    |
| --------------------------------------- |
| (item: object, index: number) => string |

---

### `ListEmptyComponent`

列表为空时渲染。可为 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `ListFooterComponent`

渲染在列表的最末端。可为 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `ListHeaderComponent`

渲染在列表的最开头。可为 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `onRefresh`

如果提供，将添加标准的 RefreshControl 用于“下拉刷新”功能。确保正确设置 `refreshing` 属性。若需向下偏移 RefreshControl（例如 100 点），使用 `progressViewOffset={100}`。

| 类型     |
| -------- |
| 函数      |

---

### `onViewableItemsChanged`

当行的视图可见性发生变化时调用，依据 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]}) => void` |

---

### `refreshing`

设置为 true 表示等待新数据刷新中。

| 类型    | 默认值  |
| ------- | ------- |
| 布尔值 | `false` |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能导致 BUG（内容缺失）——请自行谨慎使用。
:::

为 `true` 时，屏幕外的子视图会从其原生视图树中移除，可能提升大列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| 布尔值 |

---

### `renderSectionFooter`

渲染在每个分段的底部。

| 类型                                                                                 |
| ------------------------------------------------------------------------------------ |
| `md (info: {section: [Section](sectionlist#section)}) => 元素 ｜ null`           |

---

### `renderSectionHeader`

渲染在每个分段的顶部。这些头部默认在 iOS 的 `ScrollView` 中会固定至顶部。详见 `stickySectionHeadersEnabled`。

| 类型                                                                                 |
| ------------------------------------------------------------------------------------ |
| `md (info: {section: [Section](sectionlist#section)}) => 元素 ｜ null`           |

---

### `SectionSeparatorComponent`

渲染在每个分段的顶部和底部（注意这与仅渲染在项目之间的 `ItemSeparatorComponent` 不同）。此组件用于将分段与上下的头部分隔开，通常与 `ItemSeparatorComponent` 具有相同的高亮响应。也接收 `highlighted`、`[leading/trailing][Item/Section]` 和通过 `separators.updateProps` 传递的任何自定义属性。

| 类型               |
| ------------------ |
| 组件，元素         |

---

### `stickySectionHeadersEnabled`

使分段头部粘贴在屏幕顶部，直到被下一个分段头推开。在 iOS 默认启用，因为这是平台标准。

| 类型    | 默认值                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------- |
| 布尔值 | `false` <div className="label android">Android</div><hr/>`true` <div className="label ios">iOS</div> |

## 方法

### `flashScrollIndicators()` <div className="label ios">iOS</div>

```tsx
flashScrollIndicators();
```

瞬间显示滚动指示器。

---

### `recordInteraction()`

```tsx
recordInteraction();
```

告知列表发生了交互，触发视图可见性检测，例如当 `waitForInteractions` 为真且用户未滚动时。通常由项目点击或导航操作调用。

---

### `scrollToLocation()`

```tsx
scrollToLocation(params: SectionListScrollParams);
```

滚动至指定 `sectionIndex` 和该分段中指定的 `itemIndex` 所在项的位置，其中 `viewPosition` 设置为 `0` 表示将该项置于顶部（可能被粘性头覆盖），`1` 表示置于底部，`0.5` 表示居中。

:::note
如果未指定 `getItemLayout` 或 `onScrollToIndexFailed` 属性，无法滚动到渲染窗口外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div>     | 对象   |

有效的 `params` 键包括：

- 'animated' (boolean) - 是否以动画滚动，默认 `true`。
- 'itemIndex' (number) - 要滚动到的项在分段中的索引。必需。
- 'sectionIndex' (number) - 包含该项的分段索引。必需。
- 'viewOffset' (number) - 在最终目标位置的固定像素偏移，用于补偿粘性头等。
- 'viewPosition' (number) - 值为 `0` 时将指定项放置顶部，`1` 放置底部，`0.5` 居中。

## 类型定义

### Section

标识给定分段所渲染数据的对象。

| 类型 |
| ---- |
| 任意  |

**属性：**

| 名称                                                      | 类型               | 说明                                                                                                                    |
| --------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| data <div className="label basic required">必需</div>     | 数组               | 本分段渲染项目的数据。对象数组，类似于 [`FlatList` 的 data 属性](flatlist#required-data)。                              |
| key                                                       | 字符串             | 可选，用于追踪分段重新排序的键。如果不打算重新排序分段，默认使用数组索引。                                              |
| renderItem                                                | 函数               | 可选，为此分段自定义项目渲染，覆盖列表的默认 [`renderItem`](sectionlist#renderitem)。                                   |
| ItemSeparatorComponent                                    | 组件，元素         | 可选，为此分段自定义项目分隔符，覆盖列表的默认 [`ItemSeparatorComponent`](sectionlist#itemseparatorcomponent)。        |
| keyExtractor                                              | 函数               | 可选，为此分段自定义键提取器，覆盖列表的默认 [`keyExtractor`](sectionlist#keyextractor)。                              |