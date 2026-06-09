---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

一个用于渲染基础扁平列表的高性能接口，支持最实用的特性：

- 完全跨平台。
- 可选的水平模式。
- 可配置的可见性回调。
- 支持页眉。
- 支持页脚。
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

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。使用这种方式而不是 `flexWrap` 布局，可以避免与条目高度逻辑发生冲突。

下面是一个更复杂的可选择示例。

- 通过向 `FlatList` 传递 `extraData={selectedId}`，我们确保当状态变化时 `FlatList` 本身会重新渲染。若不设置此属性，`FlatList` 不会知道自己需要重新渲染任何条目，因为它是一个 `PureComponent`，而且属性比较不会显示任何变化。
- `keyExtractor` 告诉列表使用 `id` 作为 React key，而不是默认的 `key` 属性。

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

这是一个对 [`<VirtualizedList>`](virtualizedlist.md) 的便捷封装，因此它继承了其属性（以及这里未明确列出的 [`<ScrollView>`](scrollview.md) 的属性），并带有以下注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保你的所有数据都已捕获在条目数据中，或像 Flux、Redux、Relay 这样的外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅层相等，它就不会重新渲染。请确保 `renderItem` 函数依赖的所有内容都作为一个不会在更新后仍然 `===` 的属性传入（例如 `extraData`），否则 UI 在变化时可能不会更新。这包括 `data` 属性和父组件状态。
- 为了限制内存并实现平滑滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，并且会短暂看到空白内容。这是一个权衡，可以根据每个应用的需求进行调整，我们也在幕后持续改进它。
- 默认情况下，列表会查找每个条目上的 `key` 属性并将其用作 React key。你也可以提供自定义的 `keyExtractor` 属性。

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

接收 `data` 中的一个条目并将其渲染到列表中。

如有需要，它还会提供 `index` 之类的附加元数据，以及更通用的 `separators.updateProps` 函数，让你可以设置任意想要的属性，以改变前置分隔线或后置分隔线的渲染效果，以防更常用的 `highlight` 和 `unhighlight`（它们会设置 `highlighted: boolean` 属性）不足以满足你的用例。

| 类型     |
| -------- |
| function |

- `item` (Object)：正在渲染的 `data` 中的条目。
- `index` (number)：`data` 数组中与此条目对应的索引。
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

要渲染的条目数组（或类数组列表）。其他数据类型可以通过直接使用 [`VirtualizedList`](virtualizedlist.md) 来支持。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

渲染在每个条目之间，但不会出现在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` 属性，但你也可以通过 `separators.updateProps` 添加自定义属性。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

当列表为空时渲染。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

在所有条目的底部渲染。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

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

在所有条目的顶部渲染。可以是一个 React 组件（例如 `SomeComponent`），也可以是一个 React 元素（例如 `<SomeComponent />`）。

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

`numColumns > 1` 时生成的多条目行的可选自定义样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `extraData`

用于告知列表需要重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` 属性之外的任何内容，就把它放在这里，并以不可变方式处理。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

如果你事先知道条目的大小（高度或宽度），`getItemLayout` 是一种可选优化，可以跳过对动态内容的测量。如果你的条目是固定大小的，`getItemLayout` 会非常高效，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

如果你指定了 `ItemSeparatorComponent`，请记得在偏移量计算中包含分隔线长度（高度或宽度）。为列表中数百个条目添加 `getItemLayout` 可以显著提升性能。

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则将条目水平排列，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少条目。这个数量应足以填满屏幕，但不要太多。注意，为了提升滚动到顶部操作的感知性能，这些条目将不会作为窗口化渲染的一部分被卸载。

| 类型   | 默认值 |
| ------ | ------ |
| number | `10`   |

---

### `initialScrollIndex`

不是从顶部的第一个条目开始，而是从 `initialScrollIndex` 开始。此设置会禁用“滚动到顶部”优化，该优化会让前 `initialNumToRender` 个条目始终保持渲染，并立即渲染从该初始索引开始的条目。需要实现 `getItemLayout`。

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

用于为指定索引处的给定条目提取唯一 key。该 key 用于缓存和作为 React key 来跟踪条目重排。默认提取器会先检查 `item.key`，然后是 `item.id`，最后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `numColumns`

多列只能在 `horizontal={false}` 时渲染，并且会像 `flexWrap` 布局一样蛇形排列。所有条目应具有相同的高度——不支持瀑布流布局。

| 类型   |
| ------ |
| number |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，将添加一个标准的 `RefreshControl` 来实现“下拉刷新”功能。请务必同时正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当各行的可见性发生变化时调用，如 `viewabilityConfig` 属性所定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

在需要偏移量以便加载指示器正确显示时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshing`

在等待来自刷新的新数据时将其设为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
在某些情况下，使用此属性可能会导致 bug（内容丢失）——请自行承担风险使用。
:::

当为 `true` 时，屏幕外子视图会在其脱离屏幕时从原生宿主视图中移除。这可能会提升大型列表的滚动性能。在 Android 上默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `viewabilityConfig`

有关 flow 类型和更多文档，请参见 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js)。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 接受一个类型为 `ViewabilityConfig` 的对象，包含以下属性

| 属性                             | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | number  |
| viewAreaCoveragePercentThreshold | number  |
| itemVisiblePercentThreshold      | number  |
| waitForInteraction               | boolean |

至少需要 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 之一。必须在 `constructor` 中完成此设置，以避免出现以下错误（[参考](https://github.com/facebook/react-native/issues/17408)）：

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

条目在视图中实际可见之前，回调触发所需的最短时间（毫秒）。数值越高，表示即使滚动内容而不停下，也不会将内容标记为可见。

#### viewAreaCoveragePercentThreshold

视口中必须被覆盖的百分比，部分遮挡的条目才会被计为“可见”，范围为 0-100。完全可见的条目始终视为可见。值为 0 表示视口中只要有一个像素就会使条目可见；值为 100 表示条目必须完全可见或覆盖整个视口才会被计为可见。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但考虑的是条目可见部分的百分比，而不是其覆盖的可见区域比例。

#### waitForInteraction

在用户滚动或渲染后调用 `recordInteraction` 之前，不会将任何内容视为可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 配对列表。当其对应的 `ViewabilityConfig` 条件满足时，会调用指定的 `onViewableItemsChanged`。有关 flow 类型和更多文档，请参见 `ViewabilityHelper.js`。

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

提供对底层滚动响应器的句柄。

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

提供对底层可滚动节点的句柄。

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到内容末尾。在没有 `getItemLayout` 属性的情况下，可能会有卡顿。

**参数：**

| 名称   | 类型   |
| ------ | ------ |
| params | object |

`params` 的有效键如下：

- 'animated' (boolean) - 滚动时列表是否执行动画。默认为 `true`。

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

滚动到指定索引处的项目，使其位于可视区域中，其中 `viewPosition` 为 0 时放在顶部，1 时放在底部，0.5 时居中。

:::note
如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键如下：

- 'animated' (boolean) - 滚动时列表是否执行动画。默认为 `true`。
- 'index' (number) - 要滚动到的索引。必需。
- 'viewOffset' (number) - 用于偏移最终目标位置的固定像素值。
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

需要对数据进行线性扫描——如果可能，请改用 `scrollToIndex`。

:::note
如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口外的位置。
:::

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键如下：

- 'animated' (boolean) - 滚动时列表是否执行动画。默认为 `true`。
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

滚动到列表中指定的内容像素偏移位置。

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">必需</div> | object |

`params` 的有效键如下：

- 'offset' (number) - 要滚动到的偏移量。若 `horizontal` 为 true，则该偏移量是 x 值；在其他情况下，该偏移量是 y 值。必需。
- 'animated' (boolean) - 滚动时列表是否执行动画。默认为 `true`。
