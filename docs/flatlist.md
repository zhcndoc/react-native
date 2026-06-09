---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

一个用于渲染基础、扁平列表的高性能接口，支持最常用的功能：

- 完全跨平台。
- 可选的水平模式。
- 可配置的可视性回调。
- 支持头部。
- 支持底部。
- 支持分隔线。
- 下拉刷新。
- 滚动加载。
- 支持 `ScrollToIndex`。
- 支持多列。

如果你需要分段支持，请使用 [`<SectionList>`](sectionlist.md)。

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

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。使用这种方式而不是 `flexWrap` 布局可以避免与项目高度逻辑发生冲突。

下面是一个更复杂、可选择的示例。

- 通过向 `FlatList` 传入 `extraData={selectedId}`，我们可以确保 `FlatList` 自身会在状态变化时重新渲染。若不设置此属性，`FlatList` 将不知道自己需要重新渲染任何项，因为它是一个 `PureComponent`，属性比较不会显示任何变化。
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

这是对 [`<VirtualizedList>`](virtualizedlist.md) 的一个便捷封装，因此它继承了其属性（以及 [`<ScrollView>`](scrollview.md) 的属性），这里未明确列出的部分同样适用，外加以下注意事项：

- 当内容滚出渲染窗口时，内部状态不会被保留。请确保所有数据都保存在 item 数据中，或像 Flux、Redux、Relay 这样的外部存储中。
- 这是一个 `PureComponent`，这意味着如果 `props` 保持浅比较相等，它不会重新渲染。请确保 `renderItem` 函数依赖的所有内容都作为属性传入（例如 `extraData`），并且在更新后不再是 `===`，否则 UI 可能不会随变化更新。这也包括 `data` 属性和父组件状态。
- 为了控制内存并实现流畅滚动，内容会在屏幕外异步渲染。这意味着滚动速度可能快于填充速率，从而短暂看到空白内容。这是一种权衡，可以根据每个应用的需求进行调整，我们也在幕后持续改进这一点。
- 默认情况下，列表会查找每个 item 上的 `key` 属性，并将其用作 React key。也可以提供自定义的 `keyExtractor` 属性。

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

接收 `data` 中的一个 item，并将其渲染到列表中。

如果需要，还会提供 `index` 等额外元数据，以及一个更通用的 `separators.updateProps` 函数，允许你设置任何想要的属性来改变前置分隔线或后置分隔线的渲染方式，以防更常见的 `highlight` 和 `unhighlight`（它们会设置 `highlighted: boolean` 属性）不足以满足你的使用场景。

| 类型     |
| -------- |
| function |

- `item` (Object)：正在渲染的、来自 `data` 的 item。
- `index` (number)：该 item 在 `data` 数组中对应的索引。
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

要渲染的项目数组（或类数组列表）。其他数据类型可以直接通过使用 [`VirtualizedList`](virtualizedlist.md) 来实现。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

在每个 item 之间渲染，但不会出现在顶部或底部。默认会提供 `highlighted` 和 `leadingItem` 属性。`renderItem` 会提供 `separators.highlight`/`unhighlight`，它们会更新 `highlighted` 属性，但你也可以使用 `separators.updateProps` 添加自定义属性。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| component, function, element |

---

### `ListEmptyComponent`

列表为空时渲染。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| component, element |

---

### `ListFooterComponent`

在所有 item 的底部渲染。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

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

在所有 item 的顶部渲染。可以是 React 组件（例如 `SomeComponent`）或 React 元素（例如 `<SomeComponent />`）。

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

当 `numColumns > 1` 时，为生成的多项行提供可选的自定义样式。

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `extraData`

用于告诉列表重新渲染的标记属性（因为它实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` 属性之外的任何内容，就把它放在这里，并且以不可变方式处理。

| 类型 |
| ---- |
| any  |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

如果你事先知道 item 的尺寸（高度或宽度），`getItemLayout` 是一种可选优化，它允许跳过动态内容的测量。若 item 为固定尺寸，`getItemLayout` 效率很高，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

如果你指定了 `ItemSeparatorComponent`，请记得在 `offset` 计算中包含分隔线长度（高度或宽度），这会大幅提升数百个 item 列表的性能。

| 类型     |
| -------- |
| function |

---

### `horizontal`

如果为 `true`，则会将 item 水平排列在彼此旁边，而不是垂直堆叠。

| 类型    |
| ------- |
| boolean |

---

### `initialNumToRender`

初始批次中要渲染多少个 item。这个数量应该足以填满屏幕，但不要多太多。请注意，为了提升滚动回顶部的感知性能，这些 item 作为窗口化渲染的一部分永远不会被卸载。

| 类型   | 默认值 |
| ------ | ------- |
| number | `10`    |

---

### `initialScrollIndex`

不再从顶部的第一个 item 开始，而是从 `initialScrollIndex` 开始。这会禁用“滚动到顶部”优化：该优化会让前 `initialNumToRender` 个 item 始终保持渲染，并立即渲染从该初始索引开始的 item。需要实现 `getItemLayout`。

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

用于为指定索引的给定 item 提取唯一 key。该 key 用于缓存，并作为 React key 跟踪 item 的重新排序。默认提取器会先检查 `item.key`，然后是 `item.id`，最后像 React 一样回退到使用索引。

| 类型     |
| -------- |
| function |

---

### `numColumns`

多列只能在 `horizontal={false}` 时渲染，并且会像 `flexWrap` 布局那样呈之字形排列。item 应具有相同高度——不支持 masonry 布局。

| 类型   |
| ------ |
| number |

---

### `onRefresh`

```tsx
() => void;
```

如果提供此属性，将添加标准的 `RefreshControl` 以实现“下拉刷新”功能。请同时正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| function |

---

### `onViewableItemsChanged`

当各行的可视性发生变化时调用，由 `viewabilityConfig` 属性定义。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `md (callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void;` |

---

### `progressViewOffset`

当需要偏移量以便正确显示加载指示器时设置此项。

| 类型   |
| ------ |
| number |

---

### `refreshing`

在等待刷新后的新数据时将其设为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `removeClippedSubviews`

:::warning
使用此属性在某些情况下可能会导致 bug（内容缺失）——请自行承担风险使用。
:::

当为 `true` 时，屏幕外的子视图在离屏后会从其原生宿主视图中移除。这可能会提升大型列表的滚动性能。在 Android 上，默认值为 `true`。

| 类型    |
| ------- |
| boolean |

---

### `viewabilityConfig`

有关 flow type 和进一步文档，请参见 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js)。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 接受一个 `ViewabilityConfig` 类型对象，包含以下属性

| 属性                             | 类型    |
| -------------------------------- | ------- |
| minimumViewTime                  | number  |
| viewAreaCoveragePercentThreshold | number  |
| itemVisiblePercentThreshold      | number  |
| waitForInteraction               | boolean |

`viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 至少需要设置一个。需要在 `constructor` 中完成，以避免以下错误（[参考](https://github.com/facebook/react-native/issues/17408)）：

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

在可视性回调被触发之前，一个 item 必须实际可见的最短时间（毫秒）。较大的数值意味着，在不停止滚动的情况下浏览内容时，不会把内容标记为可见。

#### viewAreaCoveragePercentThreshold

视口中必须被覆盖的百分比，才能将部分被遮挡的 item 计为“可见”，范围为 0-100。完全可见的 item 始终被视为可见。值为 0 表示视口中的单个像素即可使该 item 可见，值为 100 表示该 item 必须完全可见或覆盖整个视口才算可见。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但考虑的是 item 本身可见的百分比，而不是它覆盖的可视区域比例。

#### waitForInteraction

在用户滚动或在渲染后调用 `recordInteraction` 之前，不会认为任何内容可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig`/`onViewableItemsChanged` 配对列表。当其对应的 `ViewabilityConfig` 条件满足时，会调用指定的 `onViewableItemsChanged`。有关 flow type 和进一步文档，请参见 `ViewabilityHelper.js`。

| Type                                   |
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

滚动到内容末尾。如果没有 `getItemLayout` 属性，可能会出现卡顿。

**参数：**

| Name   | Type   |
| ------ | ------ |
| params | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认值为 `true`。

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

滚动到指定索引的项目，使其位于可视区域中；其中 `viewPosition` 为 0 时表示顶部，1 表示底部，0.5 表示居中。

:::note
如果不指定 `getItemLayout` 属性，则无法滚动到渲染窗口之外的位置。
:::

**参数：**

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">Required</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认值为 `true`。
- 'index' (number) - 要滚动到的索引。必需。
- 'viewOffset' (number) - 用于偏移最终目标位置的固定像素值。
- 'viewPosition' (number) - 值为 `0` 时将索引指定的项目放在顶部，`1` 放在底部，`0.5` 放在中间居中。

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

| Name                                                        | Type   |
| ----------------------------------------------------------- | ------ |
| params <div className="label basic required">Required</div> | object |

有效的 `params` 键如下：

- 'animated' (boolean) - 滚动时是否执行动画。默认值为 `true`。
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
| params <div className="label basic required">Required</div> | object |

有效的 `params` 键如下：

- 'offset' (number) - 要滚动到的偏移量。如果 `horizontal` 为 true，则该偏移量是 x 值；在其他情况下，该偏移量是 y 值。必需。
- 'animated' (boolean) - 滚动时是否执行动画。默认值为 `true`。
