---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于渲染基础扁平列表的高性能接口，支持最实用的功能：

- 完全跨平台。
- 可选的横向模式。
- 可配置的可见性回调。
- 支持页眉。
- 支持页脚。
- 支持分隔线。
- 下拉刷新。
- 滚动加载。
- 支持 ScrollToIndex。
- 支持多列。

如果你需要分组支持，请使用 [`<SectionList>`](sectionlist.md)。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Simple%20FlatList%20Example&ext=js
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: '第一项',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二项',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三项',
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
    title: '第一项',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二项',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三项',
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

如需渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。使用这种方式而不是 `flexWrap` 布局，可以避免与项目高度逻辑发生冲突。

下面是一个更复杂的可选择示例。

- 通过向 `FlatList` 传递 `extraData={selectedId}`，我们确保在状态变化时 `FlatList` 本身会重新渲染。若不设置此属性，`FlatList` 不会知道它需要重新渲染任何项目，因为它是一个 `PureComponent`，而属性比较不会显示任何变化。
- `keyExtractor` 告诉列表使用 `id` 作为 react key，而不是默认的 `key` 属性。

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
    title: '第一项',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二项',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三项',
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
    title: '第一项',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二项',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三项',
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

这是对 [`<VirtualizedList>`](virtualizedlist.md) 的一个便捷封装，因此会继承其属性（以及此处未明确列出的 [`<ScrollView>`](scrollview.md) 的属性），并带有以下注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保你的所有数据都已捕获在项目数据中，或者捕获在 Flux、Redux、Relay 等外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅层相等，它将不会重新渲染。请确保 `renderItem` 函数依赖的一切都作为不会在更新后保持 `===` 的属性传入（例如 `extraData`），否则你的 UI 可能不会在变化时更新。这包括 `data` 属性和父组件状态。
- 为了限制内存并实现流畅滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充率，从而短暂看到空白内容。这是一种权衡，可根据每个应用的需求进行调整，我们也在后台持续改进它。
- 默认情况下，列表会在每个项目上查找 `key` 属性并将其用作 React key。或者，你可以提供自定义的 `keyExtractor` 属性。

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

接收 `data` 中的一个项目并将其渲染到列表中。

如果你需要，除了提供如 `index` 之类的附加元数据外，还提供一个更通用的 `separators.updateProps` 函数，它允许你设置任意你想要的属性，用来改变前导分隔线或尾部分隔线的渲染；如果更常见的 `highlight` 和 `unhighlight`（它们会设置 `highlighted: boolean` 属性）不足以满足你的用例，这个函数会很有用。

| 类型     |
| -------- |
| function |

- `item`（对象）：正在渲染的 `data` 中的项目。
- `index`（number）：`data` 数组中与该项目对应的索引。
- `separators`（对象）
  - `highlight`（Function）
  - `unhighlight`（Function）
  - `updateProps`（Function）
    - `select`（enum('leading', 'trailing')）
    - `newProps`（对象）

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
  data={[{title: '标题文本', key: 'item1'}]}
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

要渲染的项目数组（或类数组列表）。其他数据类型可以通过直接使用 [`VirtualizedList`](virtualizedlist.md) 来支持。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

渲染在每个项目之间，但不在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` 属性，但你也可以通过 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

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

在所有项目底部渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `ListHeaderComponent`

在所有项目顶部渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 View 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `columnWrapperStyle`

当 `numColumns > 1` 时生成的多项目行的可选自定义样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `extraData`

用于告诉列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖 `data` 属性之外的任何内容，就把它放在这里，并将其视为不可变。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

如果你事先知道项目的尺寸（高度或宽度），`getItemLayout` 是一种可选优化，可在动态内容测量时跳过测量。如果你的项目大小固定，`getItemLayout` 会很高效，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

如果你指定了 `ItemSeparatorComponent`，请记得在 offset 计算中包含分隔线长度（高度或宽度）。为列表中的数百个项目添加 `getItemLayout` 可以显著提升性能。

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则水平排列项目而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少个项目。这个数量应足以填满屏幕，但不要多太多。注意这些项目永远不会作为窗口化渲染的一部分被卸载，以提升滚动回到顶部操作时的感知性能。

| 类型   | 默认值 |
| ------ | ------ |
| number | `10`    |

---

### `initialScrollIndex`

不从顶部的第一个项目开始，而是从 `initialScrollIndex` 开始。这样会禁用“滚动到顶部”优化，该优化会让前 `initialNumToRender` 个项目始终保持渲染，并立即渲染从该初始索引开始的项目。需要实现 `getItemLayout`。

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
(item: ItemT, index: number) => string;
```

用于为指定索引处的给定项目提取唯一 key。该 key 用于缓存，并作为 react key 来跟踪项目重新排序。默认提取器会依次检查 `item.key`、`item.id`，然后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `numColumns`

多列只能在 `horizontal={false}` 时渲染，并且会像 `flexWrap` 布局那样锯齿式排列。项目应当全部具有相同高度——不支持 masonry 布局。

| 类型   |
| ------ |
| number |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，会添加一个标准的 `RefreshControl` 来实现“下拉刷新”功能。请确保同时正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

在行的可见性发生变化时调用，具体由 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

当需要偏移量才能让加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshing`

在等待刷新新数据时将此项设为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能会导致 bug（内容缺失）——请自行承担风险。
:::

当为 `true` 时，屏幕外的子视图会在离屏时从其原生 backing superview 中移除。对于大型列表，这可能会提升滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `viewabilityConfig`

有关 flow type 和更多文档，请参阅 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js)。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 采用类型为 `ViewabilityConfig` 的对象，包含以下属性

| 属性                             | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | number  |
| viewAreaCoveragePercentThreshold | number  |
| itemVisiblePercentThreshold      | number  |
| waitForInteraction               | boolean |

至少需要 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 之一。必须在 `constructor` 中完成此设置，以避免以下错误（[参考](https://github.com/facebook/react-native/issues/17408)）：

```
  错误：不支持动态更改 viewabilityConfig
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

项目在可见性回调被触发之前，必须实际可见的最短时间（毫秒）。数值越高，表示在滚动内容时不停下来就不会将内容标记为可见。

#### viewAreaCoveragePercentThreshold

对于部分遮挡的项目，要被计为“可见”，视口中必须覆盖的百分比，范围为 0-100。完全可见的项目始终被视为可见。值为 0 表示视口中的单个像素即可使项目可见，值为 100 表示项目必须完全可见或覆盖整个视口才会被计为可见。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但考虑的是项目可见的百分比，而不是其覆盖的可见区域比例。

#### waitForInteraction

在用户滚动或渲染后调用 `recordInteraction` 之前，不会将任何内容视为可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 配对列表。当某个对应的 `ViewabilityConfig` 条件满足时，会调用相应的 `onViewableItemsChanged`。有关 flow type 和更多文档，请参阅 `ViewabilityHelper.js`。

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

提供底层滚动组件的引用

---

### `getScrollResponder()`

```tsx
getScrollResponder(): ScrollResponderMixin;
```

提供底层滚动响应器的句柄。

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

提供底层可滚动节点的句柄。

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。若没有 `getItemLayout` 属性，可能会出现卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

`params` 的有效键包括：

- 'animated'（boolean）- 滚动时列表是否执行动画。默认为 `true`。

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

滚动到指定索引处的项目，使其位于可视区域中；其中 `viewPosition` 为 0 时放在顶部，为 1 时放在底部，为 0.5 时居中。

:::note
如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键包括：

- 'animated'（boolean）- 滚动时列表是否执行动画。默认为 `true`。
- 'index'（number）- 要滚动到的索引。必需。
- 'viewOffset'（number）- 用于偏移最终目标位置的固定像素数。
- 'viewPosition'（number）- 值为 `0` 时，将索引指定的项目放在顶部；`1` 时放在底部；`0.5` 时居中。

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  animated?: ?boolean,
  item: Item,
  viewPosition?: number,
});
```

需要对数据进行线性扫描——如果可能，请改用 `scrollToIndex`。

:::note
如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键包括：

- 'animated'（boolean）- 滚动时列表是否执行动画。默认为 `true`。
- 'item'（object）- 要滚动到的项目。必需。
- 'viewPosition'（number）

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中指定的内容像素偏移位置。

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键包括：

- 'offset'（number）- 要滚动到的偏移量。若 `horizontal` 为 true，则偏移量为 x 值；在其他情况下，偏移量为 y 值。必需。
- 'animated'（boolean）- 滚动时列表是否执行动画。默认为 `true`。
