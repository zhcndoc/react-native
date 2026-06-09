---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

一个用于渲染基础扁平列表的高性能接口，支持最常用的功能：

- 完全跨平台。
- 可选的横向模式。
- 可配置的可见性回调。
- 支持头部。
- 支持尾部。
- 支持分隔线。
- 下拉刷新。
- 滚动加载。
- 支持 `ScrollToIndex`。
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

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。与 `flexWrap` 布局相比，这种方式可以避免与项目高度逻辑产生冲突。

下面是一个更复杂、可选择的示例。

- 通过向 `FlatList` 传递 `extraData={selectedId}`，我们可以确保当状态变化时 `FlatList` 自身会重新渲染。若不设置此属性，`FlatList` 不会知道它需要重新渲染任何项目，因为它是 `PureComponent`，而且属性比较不会显示任何变化。
- `keyExtractor` 告诉列表使用 `id` 作为 react 键，而不是默认的 `key` 属性。

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

这是一个对 [`<VirtualizedList>`](virtualizedlist.md) 的便捷封装，因此它继承了其属性（以及 [`<ScrollView>`](scrollview.md) 的属性），这里未明确列出的那些属性也同样适用，同时还有以下注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保你的所有数据都保存在 item 数据中，或者像 Flux、Redux 或 Relay 这样的外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅层相等，它就不会重新渲染。请确保 `renderItem` 函数依赖的所有内容都作为 prop 传入（例如 `extraData`），并且在更新后它们不会 `===` 相等，否则界面在变化时可能不会更新。这包括 `data` prop 和父组件状态。
- 为了限制内存并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，从而会短暂看到空白内容。这是一种可根据每个应用需求进行调整的权衡，我们也在幕后持续改进这一点。
- 默认情况下，列表会查找每个项目上的 `key` prop，并将其用作 React key。或者，你可以提供自定义的 `keyExtractor` prop。

---

# 参考

## 属性

### [VirtualizedList Props](virtualizedlist.md#props)

继承 [VirtualizedList Props](virtualizedlist.md#props)。

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

接收 `data` 中的一个项目，并将其渲染到列表中。

它还提供诸如 `index` 之类的附加元数据，以及一个更通用的 `separators.updateProps` 函数，让你可以设置任意想要的 props，以便改变前置分隔线或后置分隔线的渲染；当更常用的 `highlight` 和 `unhighlight`（它们会设置 `highlighted: boolean` prop）不足以满足你的使用场景时，这会很有用。

| 类型     |
| -------- |
| function |

- `item` (Object)：正在渲染的、来自 `data` 的项目。
- `index` (number)：与 `data` 数组中此项目对应的索引。
- `separators` (Object)
  - `highlight` (Function)
  - `unhighlight` (Function)
  - `updateProps` (Function)
    - `select` (enum('leading', 'trailing'))
    - `newProps` (Object)

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

要渲染的项目数组（或类似数组的列表）。其他数据类型可以通过直接使用 [`VirtualizedList`](virtualizedlist.md) 来支持。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

在每个项目之间渲染，但不会出现在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` props。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` prop，但你也可以通过 `separators.updateProps` 添加自定义 props。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

在所有项目的底部渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponentStyle`

`ListFooterComponent` 内部 `View` 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `ListHeaderComponent`

在所有项目的顶部渲染。可以是 React 组件（例如 `SomeComponent`），也可以是 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListHeaderComponentStyle`

`ListHeaderComponent` 内部 `View` 的样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `columnWrapperStyle`

当 `numColumns > 1` 时，为生成的多项目行提供可选的自定义样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `extraData`

用于告诉列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` prop 之外的任何内容，就把它放在这里，并以不可变方式处理。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

`getItemLayout` 是一种可选优化：如果你事先知道项目的尺寸（高度或宽度），它可以跳过对动态内容的测量。如果你的项目尺寸固定，`getItemLayout` 会很高效，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

如果你指定了 `ItemSeparatorComponent`，请记得在偏移量计算中包含分隔线的长度（高度或宽度）。为列表添加 `getItemLayout` 可以显著提升数百个项目的性能。

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则按水平方向并排渲染项目，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少个项目。这个数量应足以填满屏幕，但不要太多。请注意，为了改善滚动到顶部操作的感知性能，这些项目将不会作为窗口化渲染的一部分被卸载。

| 类型   | 默认值 |
| ------ | ------ |
| number | `10`    |

---

### `initialScrollIndex`

不要从顶部的第一个项目开始，而是从 `initialScrollIndex` 开始。这样会禁用“滚动到顶部”的优化，该优化会使前 `initialNumToRender` 个项目始终保持渲染，并立即渲染从该初始索引开始的项目。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| number |

---

### `inverted`

反转滚动方向。使用值为 `-1` 的 scale 变换。

| 类型    |
| ------- |
| boolean |

---

### `keyExtractor`

```tsx
(item: ItemT, index: number) => string;
```

用于为指定索引处的给定项目提取唯一键。该键用于缓存，并作为 react key 来跟踪项目重排。默认提取器会先检查 `item.key`，然后是 `item.id`，最后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `numColumns`

只有在 `horizontal={false}` 时才能渲染多列，并且会像 `flexWrap` 布局那样呈之字形排列。项目应具有相同的高度——不支持 masonry 布局。

| 类型   |
| ------ |
| number |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，将添加一个标准的 RefreshControl 用于“下拉刷新”功能。请务必同时正确设置 `refreshing` prop。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当行的可见性发生变化时调用，如 `viewabilityConfig` prop 所定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

当需要偏移量才能让加载指示器正确显示时，请设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshing`

在等待来自刷新操作的新数据时将其设为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

这可能会提升大型列表的滚动性能。在 Android 上默认值为 `true`。

> 注意：在某些情况下可能存在 bug（内容缺失）——请自行承担风险使用。

| 类型    |
| ------- |
| boolean |

---

### `viewabilityConfig`

有关 flow 类型和进一步文档，请参见 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js)。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 接受一个 `ViewabilityConfig` 类型的对象，具有以下属性

| 属性                         | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | number  |
| viewAreaCoveragePercentThreshold | number  |
| itemVisiblePercentThreshold      | number  |
| waitForInteraction               | boolean |

至少需要 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 其中之一。为了避免以下错误，需要在 `constructor` 中完成此设置（[参考](https://github.com/facebook/react-native/issues/17408)）：

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

在可见性回调被触发之前，一个项目必须实际可见的最短时间（以毫秒为单位）。数值较高意味着在不停止的情况下滚动浏览内容时，内容不会被标记为可见。

#### viewAreaCoveragePercentThreshold

部分遮挡的项目要被计为“可见”时，视口必须覆盖的百分比，范围为 0-100。完全可见的项目始终被视为可见。值为 0 表示视口中只要有一个像素，项目就会被视为可见；值为 100 表示项目必须完全可见，或者覆盖整个视口，才会被视为可见。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但考虑的是项目可见部分所占的百分比，而不是其覆盖的可见区域比例。

#### waitForInteraction

在用户滚动或在渲染后调用 `recordInteraction` 之前，不会认为任何内容是可见的。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 配对列表。当对应的 `ViewabilityConfig` 条件满足时，会调用特定的 `onViewableItemsChanged`。有关 flow 类型和进一步文档，请参见 `ViewabilityHelper.js`。

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

滚动到内容末尾。如果没有 `getItemLayout` 属性，可能会有卡顿。

**参数：**

| Name   | Type   |
| ------ | ------ |
| params | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认为 `true`。

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

滚动到指定索引的项目，使其位于可视区域中；其中 `viewPosition` 为 0 时将其放在顶部，1 时放在底部，0.5 时居中。

> 注意：如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置。

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认为 `true`。
- 'index' (number) - 要滚动到的索引。必需。
- 'viewOffset' (number) - 最终目标位置的固定像素偏移量。
- 'viewPosition' (number) - 值为 `0` 时将索引指定的项目放在顶部，`1` 时放在底部，`0.5` 时居中。

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  animated?: ?boolean,
  item: Item,
  viewPosition?: number,
});
```

需要对数据进行线性扫描——如果可能，建议改用 `scrollToIndex`。

> 注意：如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置。

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认为 `true`。
- 'item' (object) - 要滚动到的项目。必需。
- 'viewPosition' (number)

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中指定的内容像素偏移量。

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

有效的 `params` 键如下：

- 'offset' (number) - 要滚动到的偏移量。若 `horizontal` 为 true，则该偏移量是 x 值；否则为 y 值。必需。
- 'animated' (boolean) - 滚动时是否执行动画。默认为 `true`。
