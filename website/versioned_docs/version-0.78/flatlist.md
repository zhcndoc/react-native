---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

一个用于渲染基本扁平列表的高性能接口，支持以下最实用的功能：

- 完全跨平台。
- 可选的水平模式。
- 可配置的可见性回调。
- 支持头部。
- 支持底部。
- 支持分隔符。
- 下拉刷新。
- 滚动加载。
- 支持 ScrollToIndex。
- 支持多列。

如果你需要分区支持，请使用 [`<SectionList>`](sectionlist.md)。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Simple%20FlatList%20Example&ext=js
import React from 'react';
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
import React from 'react';
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

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。使用此方法而不是 `flexWrap` 布局可以防止与项目高度逻辑发生冲突。

下面是一个更复杂的可选择示例。

- 通过传递 `extraData={selectedId}` 给 `FlatList`，我们确保当状态改变时 `FlatList` 本身会重新渲染。如果不设置此属性，`FlatList` 将不知道它需要重新渲染任何项目，因为它是一个 `PureComponent` 并且属性比较不会显示任何变化。
- `keyExtractor` 告诉列表使用 `id` 作为 react 键，而不是默认的 `key` 属性。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=flatlist-selectable&ext=js
import React, {useState} from 'react';
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
import React, {useState} from 'react';
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

这是 [`<VirtualizedList>`](virtualizedlist.md) 的便捷包装器，因此继承了其属性（以及 [`<ScrollView>`](scrollview.md) 的属性），除非此处明确列出，并注意以下注意事项：

- 当内容滚动出渲染窗口时，内部状态不会保留。确保所有数据都捕获在项目数据或外部存储中，如 Flux、Redux 或 Relay。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅相等，它将不会重新渲染。确保你的 `renderItem` 函数依赖的所有内容都作为属性传递（例如 `extraData`），并且在更新后不 `===`，否则你的 UI 可能不会随变化更新。这包括 `data` 属性和父组件状态。
- 为了限制内存并实现平滑滚动，内容在屏幕外异步渲染。这意味着有可能滚动速度快于填充率，并暂时看到空白内容。这是一个可以根据每个应用程序的需求进行调整的权衡，我们正在幕后改进它。
- 默认情况下，列表查找每个项目上的 `key` 属性并将其用作 React 键。或者，你可以提供自定义 `keyExtractor` 属性。

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

从 `data` 中获取一项并将其渲染到列表中。

提供额外的元数据，如 `index`（如果你需要），以及更通用的 `separators.updateProps` 函数，它允许你设置任何想要更改的属性，以改变前导分隔符或尾随分隔符的渲染，以防更常见的 `highlight` 和 `unhighlight`（它们设置 `highlighted: boolean` 属性）不足以满足你的用例。

| 类型     |
| -------- |
| 函数 |

- `item` (对象): 正在渲染的来自 `data` 的项目。
- `index` (数字): 该项目在 `data` 数组中对应的索引。
- `separators` (对象)
  - `highlight` (函数)
  - `unhighlight` (函数)
  - `updateProps` (函数)
    - `select` (枚举('leading', 'trailing'))
    - `newProps` (对象)

示例用法：

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

要渲染的项目数组（或类数组列表）。其他数据类型可以通过直接针对 [`VirtualizedList`](virtualizedlist.md) 来使用。

| 类型      |
| --------- |
| 类数组 |

---

### `ItemSeparatorComponent`

渲染在每项之间，但不在顶部或底部。默认情况下，提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 提供 `separators.highlight`/`unhighlight` 将更新 `highlighted` 属性，但你也可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| 组件，函数，元素 |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素 |

---

### `ListFooterComponent`

渲染在所有项目的底部。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素 |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `ListHeaderComponent`

渲染在所有项目的顶部。可以是 React 组件（例如 `SomeComponent`），或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件，元素 |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `columnWrapperStyle`

当 `numColumns > 1` 时，为生成的多项目行可选的自定义样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `extraData`

用于告诉列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的任何 `renderItem`、Header、Footer 等函数依赖于 `data` 属性之外的任何内容，请将其放在这里并将其视为不可变。

| 类型 |
| ---- |
| 任意  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

`getItemLayout` 是一个可选的优化，如果你提前知道项目的大小（高度或宽度），它可以跳过动态内容的测量。如果你有固定大小的项目，`getItemLayout` 非常高效，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

添加 `getItemLayout` 可以大大提高数百个项目列表的性能。如果你指定了 `ItemSeparatorComponent`，请记住在偏移计算中包含分隔符长度（高度或宽度）。

| 类型     |
| -------- |
| 函数 |

---

### `horizontal`

如果为 `true`，则水平相邻渲染项目，而不是垂直堆叠。

| 类型    |
| ------- |
| 布尔值 |

---

### `initialNumToRender`

初始批次中要渲染多少项目。这应该足以填充屏幕，但不要太多。注意，作为窗口化渲染的一部分，这些项目永远不会被卸载，以提高滚动到顶部操作的感知性能。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `10`    |

---

### `initialScrollIndex`

不从第一项的顶部开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化（该优化保持前 `initialNumToRender` 个项目始终渲染），并立即渲染从此初始索引开始的项目。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| 数字 |

---

### `inverted`

反转滚动方向。使用 `-1` 的缩放变换。

| 类型    |
| ------- |
| 布尔值 |

---

### `keyExtractor`

```tsx
(item: ItemT, index: number) => string;
```

用于提取指定索引处给定项目的唯一键。键用于缓存并作为 react 键来跟踪项目重新排序。默认提取器检查 `item.key`，然后 `item.id`，然后回退到使用索引，就像 React 所做的那样。

| 类型     |
| -------- |
| 函数 |

---

### `numColumns`

多列只能在 `horizontal={false}` 时渲染，并将像 `flexWrap` 布局一样曲折排列。项目应该都具有相同的高度 - 不支持砌体布局。

| 类型   |
| ------ |
| 数字 |

---

### `onRefresh`

```tsx
() => void;
```

如果提供，将为“下拉刷新”功能添加标准的 RefreshControl。确保也正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| 函数 |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，由 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

当需要偏移量以使加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| 数字 |

---

### `refreshing`

在等待刷新新数据时将其设置为 true。

| 类型    |
| ------- |
| 布尔值 |

---

### `removeClippedSubviews`

这可以提高大列表的滚动性能。在 Android 上默认值为 `true`。

> 注意：在某些情况下可能有 bug（内容缺失）- 使用风险自负。

| 类型    |
| ------- |
| 布尔值 |

---

### `viewabilityConfig`

参见 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js) 了解 flow 类型和更多文档。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 接受一个类型为 `ViewabilityConfig` 的对象，包含以下属性

| 属性                         | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | 数字  |
| viewAreaCoveragePercentThreshold | 数字  |
| itemVisiblePercentThreshold      | 数字  |
| waitForInteraction               | 布尔值 |

至少需要 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 中的一个。这需要在 `constructor` 中完成，以避免以下错误 ([参考](https://github.com/facebook/react-native/issues/17408))：

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

在项目物理可见后触发可见性回调之前所需的最短时间（毫秒）。数字较高意味着不停止地滚动内容不会将内容标记为可见。

#### viewAreaCoveragePercentThreshold

部分遮挡的项目被视为“可见”所需的视口覆盖百分比，0-100。完全可见的项目始终被视为可见。值为 0 意味着视口中的单个像素使项目可见，值为 100 意味着项目必须完全可见或覆盖整个视口才算作可见。

#### itemVisiblePercentThreshold

类似于 `viewAreaCoveragePercentThreshold`，但考虑的是项目可见的百分比，而不是其覆盖的可见区域的比例。

#### waitForInteraction

在用户滚动或渲染后调用 `recordInteraction` 之前，没有任何内容被视为可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 对的列表。当特定的 `onViewableItemsChanged` 对应的 `ViewabilityConfig` 条件满足时，它将被调用。参见 `ViewabilityHelper.js` 了解 flow 类型和更多文档。

| 类型                                   |
| -------------------------------------- |
| ViewabilityConfigCallbackPair 数组 |

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

提供对底层滚动响应器的句柄。

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

提供对底层滚动节点的句柄。

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。如果没有 `getItemLayout` 属性，可能会卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

有效的 `params` 键包括：

- 'animated' (boolean) - 列表滚动时是否执行动画。默认为 `true`。

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

滚动到指定索引的项，使其位于可见区域内，其中 `viewPosition` 0 将其置于顶部，1 置于底部，0.5 居中。

> 注意：如果不指定 `getItemLayout` 属性，无法滚动到渲染窗口之外的位置。

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键包括：

- 'animated' (boolean) - 列表滚动时是否执行动画。默认为 `true`。
- 'index' (number) - 要滚动到的索引。必需。
- 'viewOffset' (number) - 偏移最终目标位置的固定像素数。
- 'viewPosition' (number) - 值为 `0` 时将索引指定的项置于顶部，`1` 置于底部，`0.5` 置于中间。

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  animated?: ?boolean,
  item: Item,
  viewPosition?: number,
});
```

需要线性扫描数据 - 如果可能，请改用 `scrollToIndex`。

> 注意：如果不指定 `getItemLayout` 属性，无法滚动到渲染窗口之外的位置。

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键包括：

- 'animated' (boolean) - 列表滚动时是否执行动画。默认为 `true`。
- 'item' (object) - 要滚动到的项。必需。
- 'viewPosition' (number)

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

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键包括：

- 'offset' (number) - 要滚动到的偏移量。如果 `horizontal` 为 true，则偏移量为 x 值，其他情况下偏移量为 y 值。必需。
- 'animated' (boolean) - 列表滚动时是否执行动画。默认为 `true`。
