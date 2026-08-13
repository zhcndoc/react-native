---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于渲染基本扁平列表的高性能界面，支持以下最实用的功能：

- 完全跨平台
- 可选的水平模式
- 可配置的可见性回调
- 支持头部
- 支持尾部
- 支持分隔线
- 下拉刷新
- 滚动加载
- 支持 ScrollToIndex
- 支持多列

如果需要分区支持，请使用 [`<SectionList>`](sectionlist.md)。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Simple%20FlatList%20Example&ext=js
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Simple%20FlatList%20Example&ext=tsx
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {title: string};

const Item = ({title}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
</Tabs>

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。与 `flexWrap` 布局相比，使用这种方式可以避免与项目高度逻辑发生冲突。

下面是一个更复杂的可选择示例。

- 通过向 `FlatList` 传递 `extraData={selectedId}`，可以确保 `FlatList` 本身会在状态变化时重新渲染。如果不设置此属性，`FlatList` 将不知道需要重新渲染任何项目，因为它是一个 `PureComponent`，而属性比较不会显示任何变化
- `keyExtractor` 告诉列表使用 `id` 作为 React key，而不是默认的 `key` 属性

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=flatlist-selectable&ext=js
import {useState} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [selectedId, setSelectedId] = useState();

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=flatlist-selectable&ext=tsx
import {useState} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

type ItemData = {
  id: string;
  title: string;
};

const DATA: ItemData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({item}: {item: ItemData}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
```

</TabItem>
</Tabs>

这是 [`<VirtualizedList>`](virtualizedlist.md) 的便捷封装，因此会继承其属性（以及 [`<ScrollView>`](scrollview.md) 的属性）中此处未明确列出的部分，同时还存在以下注意事项：

- 当内容滚出渲染窗口时，不会保留内部状态。请确保所有数据都保存在项目数据中，或保存在 Flux、Redux 或 Relay 等外部存储中
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅比较相等，它就不会重新渲染。请确保 `renderItem` 函数所依赖的所有内容都作为属性传入（例如 `extraData`），并且在更新后不再是 `===`，否则 UI 可能不会在发生变化时更新。这包括 `data` 属性和父组件状态
- 为了限制内存占用并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，并且可能会暂时看到空白内容。这是一个可以根据每个应用需求进行调整的权衡，我们也在幕后持续改进
- 默认情况下，列表会查找每个项目上的 `key` 属性，并将其用作 React key。或者，也可以提供自定义的 `keyExtractor` 属性

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必需</div> **`renderItem`**

```tsx
renderItem({
  item: ItemT,
  index: number,
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
  }
}): JSX.Element;
```

从 `data` 中获取一个项目，并将其渲染到列表中。

如果需要，还会提供 `index` 等额外元数据，以及更通用的 `separators.updateProps` 函数，你可以使用它设置任意属性，以更改前置分隔线或后置分隔线的渲染方式，以防更常见的 `highlight` 和 `unhighlight`（设置 `highlighted: boolean` 属性）无法满足你的使用场景。

| 类型     |
| -------- |
| function |

- `item`（Object）：正在从 `data` 中渲染的项目
- `index`（number）：此项目在 `data` 数组中对应的索引
- `separators`（Object）
  - `highlight`（Function）
  - `unhighlight`（Function）
  - `updateProps`（Function）
    - `select`（enum('leading', 'trailing')）
    - `newProps`（Object）

使用示例：

```tsx
<FlatList
  ItemSeparatorComponent={
    Platform.OS !== 'android' &&
    (({highlighted}) => (
      <View
        style={[style.separator, highlighted && {marginLeft: 0}]}
      />
    ))
  }
  data={[{title: 'Title Text', key: 'item1'}]}
  renderItem={({item, index, separators}) => (
    <TouchableHighlight
      key={item.key}
      onPress={() => this._onPress(item)}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={{backgroundColor: 'white'}}>
        <Text>{item.title}</Text>
      </View>
    </TouchableHighlight>
  )}
/>
```

---

### <div className="label required basic">必需</div> **`data`**

要渲染的项目数组（或类似数组的列表）。通过直接使用 [`VirtualizedList`](virtualizedlist.md)，还可以使用其他数据类型。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不会渲染在顶部或底部。默认情况下会提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 提供 `separators.highlight`／`unhighlight`，它们会更新 `highlighted` 属性，但你也可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

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

### `ListFooterComponent`

渲染在所有项目的底部。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 View 的样式。

| 类型                          |
| ----------------------------- |
| [View 样式](view-style-props) |

---

### `ListHeaderComponent`

渲染在所有项目的顶部。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 View 的样式。

| 类型                          |
| ----------------------------- |
| [View 样式](view-style-props) |

---

### `columnWrapperStyle`

为 `numColumns > 1` 时生成的多项目行提供可选的自定义样式。

| 类型                          |
| ----------------------------- |
| [View 样式](view-style-props) |

---

### `extraData`

用于告知列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` 属性之外的任何内容，请将其放在这里，并以不可变方式处理。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

如果你预先知道项目的大小（高度或宽度），`getItemLayout` 是一种可选的优化方式，可以跳过动态内容的测量。如果项目大小固定，例如以下情况，`getItemLayout` 会非常高效：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

对于包含数百个项目的列表，添加 `getItemLayout` 可以显著提升性能。如果指定了 `ItemSeparatorComponent`，请记得在偏移量计算中包含分隔线的长度（高度或宽度）。

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则水平并排渲染项目，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染的项目数。数量应足以填满屏幕，但不要多太多。请注意，为了提升滚动到顶部操作的感知性能，这些项目在窗口化渲染过程中永远不会被卸载。

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

反转滚动方向。使用缩放值为 `-1` 的变换。

| 类型    |
| ------- |
| boolean |

---

### `keyExtractor`

```tsx
(item: ItemT, index: number) => string;
```

用于提取指定索引处给定项目的唯一 key。Key 用于缓存，也用作 React key，以跟踪项目重新排序。默认提取器会依次检查 `item.key`、`item.id`，最后回退到使用索引，就像 React 一样。

| 类型     |
| -------- |
| function |

---

### `numColumns`

只有在 `horizontal={false}` 时才能渲染多列，并且其排列方式类似于 `flexWrap` 布局的交错排列。所有项目的高度都应相同，不支持 masonry 布局。

| 类型   |
| ------ |
| number |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，将添加标准 RefreshControl，以实现“下拉刷新”功能。请确保同时正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，具体取决于 `viewabilityConfig` 属性的定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

需要为加载指示器设置偏移量，以便其正确显示时设置此属性。

| 类型   |
| ------ |
| number |

---

### `refreshing`

等待刷新获取新数据时将其设置为 true。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致错误（内容缺失），使用风险由你自行承担
:::

当为 `true` 时，屏幕外的子视图会从其原生承载父视图中移除。这可能会提升大型列表的滚动性能。在 Android 上，默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `viewabilityConfig`

有关 flow 类型和更多文档，请参阅 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js)。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 接受 `ViewabilityConfig` 类型，即一个包含以下属性的对象

| 属性                             | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | number  |
| viewAreaCoveragePercentThreshold | number  |
| itemVisiblePercentThreshold      | number  |
| waitForInteraction               | boolean |

必须至少提供 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 其中之一。需要在 `constructor` 中完成此设置，以避免出现以下错误（[参考](https://github.com/facebook/react-native/issues/17408)）：

```
  Error: Changing viewabilityConfig on the fly is not supported
```

```tsx
constructor (props) {
  super(props)

  this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95
  }
}
```

```tsx
<FlatList
    viewabilityConfig={this.viewabilityConfig}
  ...
```

#### minimumViewTime

在触发可见性回调之前，项目必须实际处于可见状态的最短时间（以毫秒为单位）。数值较大意味着，在不停止的情况下滚动浏览内容不会将其标记为可见。

#### viewAreaCoveragePercentThreshold

对于部分被遮挡的项目，其覆盖视口的百分比必须达到此值才会被视为“可见”，范围为 0～100。完全可见的项目始终会被视为可见。值为 0 表示视口中的单个像素就会使项目可见，值为 100 表示项目必须完全可见或覆盖整个视口，才会被视为可见。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但考虑的是项目的可见百分比，而不是项目所覆盖的可见区域比例。

#### waitForInteraction

在用户滚动或渲染后调用 `recordInteraction` 之前，不会将任何内容视为可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`／`onViewableItemsChanged` 对的列表。当对应的 `ViewabilityConfig` 条件满足时，会调用特定的 `onViewableItemsChanged`。有关 flow 类型和更多文档，请参阅 `ViewabilityHelper.js`。

| 类型                                   |
| -------------------------------------- |
| array of ViewabilityConfigCallbackPair |

## 方法

### `flashScrollIndicators()`

```tsx
flashScrollIndicators();
```

短暂显示滚动指示器。

---

### `getNativeScrollRef()`

```tsx
getNativeScrollRef(): React.ElementRef<typeof ScrollViewComponent>;
```

提供对底层滚动组件的引用

---

### `getScrollResponder()`

```tsx
getScrollResponder(): ScrollResponderMixin;
```

提供对底层滚动响应器的操作句柄。

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

提供对底层滚动节点的操作句柄。

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。不使用 `getItemLayout` 属性时，可能会出现卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` key 包括：

- 'animated'（boolean）- 列表滚动时是否执行动画。默认为 `true`

---

### `scrollToIndex()`

```tsx
scrollToIndex: (params: {
  index: number;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
});
```

滚动到指定索引处的项目，使其位于可见区域中，其中 `viewPosition` 为 0 时将其置于顶部，为 1 时置于底部，为 0.5 时置于中间。

:::note
如果未指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置
:::

**参数：**

| 名称                                                    | 类型   |
| ------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` key 包括：

- 'animated'（boolean）- 列表滚动时是否执行动画。默认为 `true`
- 'index'（number）- 要滚动到的索引。必需
- 'viewOffset'（number）- 用于偏移最终目标位置的固定像素数
- 'viewPosition'（number）- 值为 `0` 时将索引指定的项目置于顶部，值为 `1` 时置于底部，值为 `0.5` 时置于中间

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  animated?: ?boolean,
  item: Item,
  viewPosition?: number,
});
```

需要线性扫描数据，如果可能，请改用 `scrollToIndex`。

:::note
如果未指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置
:::

**参数：**

| 名称                                                    | 类型   |
| ------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` key 包括：

- 'animated'（boolean）- 列表滚动时是否执行动画。默认为 `true`
- 'item'（object）- 要滚动到的项目。必需
- 'viewPosition'（number）

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中特定的内容像素偏移量。

**参数：**

| 名称                                                    | 类型   |
| ------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` key 包括：

- 'offset'（number）- 要滚动到的偏移量。当 `horizontal` 为 true 时，偏移量是 x 值；其他情况下偏移量是 y 值。必需
- 'animated'（boolean）- 列表滚动时是否执行动画。默认为 `true`
