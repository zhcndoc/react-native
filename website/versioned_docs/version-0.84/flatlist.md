---
id: flatlist
title: FlatList
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于渲染基本平面列表的高性能界面，支持最实用的功能：

- 跨平台支持。
- 可选的横向模式。
- 可配置的可视性回调。
- 支持头部组件。
- 支持底部组件。
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
    title: '第一个条目',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二个条目',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三个条目',
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
    title: '第一个条目',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二个条目',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三个条目',
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

要渲染多列，请使用 [`numColumns`](flatlist.md#numcolumns) 属性。使用此方法而非 `flexWrap` 布局，可以避免与项目高度计算冲突。

下面是更复杂的可选择示例。

- 通过向 `FlatList` 传递 `extraData={selectedId}`，确保 `FlatList` 在状态发生变化时会重新渲染。若不设置此属性，`FlatList` 作为 `PureComponent` 不会因为浅比较无变化而重新渲染任何项目。
- `keyExtractor` 告诉列表使用 `id` 作为 react key，而不是默认的 `key` 属性。

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
    title: '第一个条目',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二个条目',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三个条目',
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
    title: '第一个条目',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: '第二个条目',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: '第三个条目',
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

这是 [`<VirtualizedList>`](virtualizedlist.md) 的便捷封装，因此继承了它的属性（以及 [`<ScrollView>`](scrollview.md) 没有明确列出的属性），但有以下注意事项：

- 当内容滚动出渲染窗口时，内部状态不会被保留。确保所有数据都包含在条目数据或外部存储（如 Flux、Redux 或 Relay）中。
- 这是一个 `PureComponent`，意味着如果 `props` 在浅层比较上相同，它不会重新渲染。确保你 `renderItem` 函数依赖的所有内容都作为非 `===` 的属性传入（例如 `extraData`），否则界面可能无法更新。包括 `data` 属性以及父组件状态。
- 为限制内存并实现流畅滚动，内容异步离屏渲染。这意味着可能发生滚动速度快于渲染速度，暂时看到空白内容。这是一个折衷方案，可以根据应用需求调整，开发团队也在持续改进。
- 默认情况下，列表查找每个项的 `key` 属性用作 React key。也可以通过提供自定义的 `keyExtractor` 属性来指定。

---

# 参考

## 属性

### [VirtualizedList 属性](virtualizedlist.md#props)

继承自 [VirtualizedList 属性](virtualizedlist.md#props)。

---

### <div className="label required basic">必填</div> **`renderItem`**

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

从 `data` 中取一个条目，并渲染成列表项。

提供额外元数据，比如需要时的 `index`，以及更通用的 `separators.updateProps` 函数，可设置任意属性以改变前置或后置分隔符的渲染，适用于标准的 `highlight` 和 `unhighlight`（设置 `highlighted: boolean` 属性）不能满足需求的情况。

| 类型     |
| -------- |
| function |

- `item` (对象): 当前渲染的条目。
- `index` (数字): 当前条目在 `data` 数组中的索引。
- `separators` (对象)
  - `highlight` (函数)
  - `unhighlight` (函数)
  - `updateProps` (函数)
    - `select` (枚举: 'leading' | 'trailing')
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

### <div className="label required basic">必填</div> **`data`**

要渲染的条目数组（或类数组）。其他数据类型可以通过直接使用 [`VirtualizedList`](virtualizedlist.md) 支持。

| 类型      |
| --------- |
| ArrayLike |

---

### `ItemSeparatorComponent`

渲染在每个条目之间，但不出现在最顶部或最底部。默认传入 `highlighted` 和 `leadingItem` 属性。`renderItem` 提供 `separators.highlight`/`unhighlight`，会更新 `highlighted` 属性，也可以用 `separators.updateProps` 添加自定义属性。可以是 React 组件（如 `SomeComponent`）或 React 元素（如 `<SomeComponent />`）。

| 类型                         |
| ---------------------------- |
| 组件、函数、元素             |

---

### `ListEmptyComponent`

在列表为空时渲染。可以是 React 组件（如 `SomeComponent`）或 React 元素（如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件、元素         |

---

### `ListFooterComponent`

渲染在所有条目底部。可以是 React 组件（如 `SomeComponent`）或 React 元素（如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件、元素         |

---

### `ListFooterComponentStyle`

为 `ListFooterComponent` 的内部 View 提供样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props)  |

---

### `ListHeaderComponent`

渲染在所有条目顶部。可以是 React 组件（如 `SomeComponent`）或 React 元素（如 `<SomeComponent />`）。

| 类型               |
| ------------------ |
| 组件、元素         |

---

### `ListHeaderComponentStyle`

为 `ListHeaderComponent` 的内部 View 提供样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props)  |

---

### `columnWrapperStyle`

当 `numColumns > 1` 时，生成的多项行的可选自定义样式。

| 类型                           |
| ------------------------------ |
| [View 样式](view-style-props)  |

---

### `extraData`

标记属性，用于告知列表需要重新渲染（因为实现了 `PureComponent`）。如果你的 `renderItem`、Header、Footer 等函数依赖于 `data` 以外的内容，请将其放在这里，并作为不可变数据处理。

| 类型 |
| ---- |
| 任意 |

---

### `getItemLayout`

```tsx
(data, index) => {length: number, offset: number, index: number}
```

`getItemLayout` 是一个可选优化，如果你提前知道条目的大小（高度或宽度），可以跳过动态内容测量。对固定大小条目非常有效，例如：

```tsx
  getItemLayout={(data, index) => (
    {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  )}
```

对几百条目以上的列表，添加 `getItemLayout` 可大幅提升性能。如果指定了 `ItemSeparatorComponent`，记得在计算 offset 时把分隔符长度（高度或宽度）考虑进去。

| 类型     |
| -------- |
| 函数     |

---

### `horizontal`

若为 `true`，条目水平排列而非垂直堆叠。

| 类型    |
| ------- |
| 布尔值  |

---

### `initialNumToRender`

初始批次渲染条目数量。应足够填满屏幕，但不要过多。注意，这些条目在窗口渲染中永远不会被卸载，以提升滚动到顶部的感知性能。

| 类型   | 默认值 |
| ------ | ------- |
| 数字   | `10`    |

---

### `initialScrollIndex`

非从第一个条目开始，而是从 `initialScrollIndex` 位置开始。禁用“滚动到顶部”优化，直接渲染指定初始条目。需要实现 `getItemLayout`。

| 类型   |
| ------ |
| 数字   |

---

### `inverted`

反转滚动方向。使用 scale 变换 `-1`。

| 类型    |
| ------- |
| 布尔值  |

---

### `keyExtractor`

```tsx
(item: ItemT, index: number) => string;
```

用于从指定索引的条目中提取唯一 key。Key 用于缓存及跟踪条目重排序。默认提取顺序为 `item.key`，然后 `item.id`，最后回退到索引（与 React 处理方式一致）。

| 类型     |
| -------- |
| 函数     |

---

### `numColumns`

多列仅支持 `horizontal={false}`，布局按锯齿形排列，如同 `flexWrap`。条目高度应相同，不支持 Masonry 布局。

| 类型   |
| ------ |
| 数字   |

---

### `onRefresh`

```tsx
() => void;
```

如提供，则添加标准的刷新控件以支持“下拉刷新”。确保正确设置 `refreshing` 属性。

| 类型     |
| -------- |
| 函数     |

---

### `onViewableItemsChanged`

当行的可视状态发生变化时调用，依据 `viewabilityConfig` 属性。

| 类型                                                                                                  |
| ----------------------------------------------------------------------------------------------------- |
| `(callback: {changed: [ViewToken](viewtoken)[], viewableItems: [ViewToken](viewtoken)[]} => void`      |

---

### `progressViewOffset`

设置该值可使加载指示器正确显示时的偏移。

| 类型   |
| ------ |
| 数字   |

---

### `refreshing`

刷新数据时设为 `true`。

| 类型    |
| ------- |
| 布尔值  |

---

### `removeClippedSubviews`

:::warning
使用此属性可能导致某些情况下内容缺失的 bug - 请自行评估风险使用。
:::

设置为 `true` 时，离屏的子视图会从原生视图层级中移除，可能提升长列表的滚动性能。Android 默认值为 `true`。

| 类型    |
| ------- |
| 布尔值  |

---

### `viewabilityConfig`

请参阅 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js) 及其 Flow 类型和详细文档。

| 类型              |
| ----------------- |
| ViewabilityConfig |

`viewabilityConfig` 是类型为 `ViewabilityConfig` 的对象，包含属性：

| 属性                               | 类型     |
| ---------------------------------- | -------- |
| minimumViewTime                    | 数字     |
| viewAreaCoveragePercentThreshold  | 数字     |
| itemVisiblePercentThreshold       | 数字     |
| waitForInteraction                | 布尔值   |

至少需要设置 `viewAreaCoveragePercentThreshold` 或 `itemVisiblePercentThreshold` 其中一项。必须在构造函数中配置，否则会出现如下错误（参见[链接](https://github.com/facebook/react-native/issues/17408)）：

```
  Error: Changing viewabilityConfig on the fly is not supported
```

示例：

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

条目必须物理可见的最短时间（毫秒），才触发可视性回调。该值较大时，快速滚动时条目不会被视为已查看。

#### viewAreaCoveragePercentThreshold

部分遮挡条目视为“可视”的视口覆盖百分比，范围 0-100。完全可见的条目总是视为可视。0 表示视口内任何像素均视为可见，100 表示条目必须全部可见或占满整个视口才计为可视。

#### itemVisiblePercentThreshold

与 `viewAreaCoveragePercentThreshold` 类似，但衡量的是条目本身可见百分比，而不是其占用视口的比例。

#### waitForInteraction

未滚动或未调用 `recordInteraction` 前，视为不可见。

---

### `viewabilityConfigCallbackPairs`

`ViewabilityConfig` 和 `onViewableItemsChanged` 的配对列表。当满足特定 `ViewabilityConfig` 条件时，调用对应的 `onViewableItemsChanged`。详情见 `ViewabilityHelper.js` 及其 Flow 类型文档。

| 类型                                   |
| -------------------------------------- |
| ViewabilityConfigCallbackPair 数组    |

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

获取底层滚动组件的引用。

---

### `getScrollResponder()`

```tsx
getScrollResponder(): ScrollResponderMixin;
```

获取底层滚动响应器的句柄。

---

### `getScrollableNode()`

```tsx
getScrollableNode(): any;
```

获取底层可滚动节点的句柄。

### `scrollToEnd()`

```tsx
scrollToEnd(params?: {animated?: boolean});
```

滚动到底部内容。若无 `getItemLayout`，可能不够流畅。

**参数：**

| 名称    | 类型   |
| ------- | ------ |
| params  | 对象   |

有效 `params` 属性：

- `animated` (布尔) - 是否启用动画，默认 `true`。

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

滚动到指定索引条目，使其在视图中的位置由 `viewPosition` 控制：`0` 置于顶部，`1` 置于底部，`0.5` 置于中间。

:::note
若无 `getItemLayout`，无法滚动到渲染窗口外。
:::

**参数：**

| 名称                                                      | 类型   |
| --------------------------------------------------------- | ------ |
| params <div className="label basic required">必填</div>   | 对象   |

有效参数：

- `animated` (布尔) - 是否启用动画，默认 `true`。
- `index` (数字) - 目标索引，必填。
- `viewOffset` (数字) - 目标位置的像素偏移量。
- `viewPosition` (数字) - 条目在视图中的位置，0 为顶部，1 为底部，0.5 居中。

---

### `scrollToItem()`

```tsx
scrollToItem(params: {
  animated?: ?boolean,
  item: Item,
  viewPosition?: number,
});
```

需要遍历数据，若有可能应使用 `scrollToIndex`。

:::note
若无 `getItemLayout`，无法滚动到渲染窗口外。
:::

**参数：**

| 名称                                                      | 类型   |
| --------------------------------------------------------- | ------ |
| params <div className="label basic required">必填</div>   | 对象   |

有效参数：

- `animated` (布尔) - 是否启用动画，默认 `true`。
- `item` (对象) - 目标条目，必填。
- `viewPosition` (数字)

---

### `scrollToOffset()`

```tsx
scrollToOffset(params: {
  offset: number;
  animated?: boolean;
});
```

滚动到列表中特定像素偏移。

**参数：**

| 名称                                                      | 类型   |
| --------------------------------------------------------- | ------ |
| params <div className="label basic required">必填</div>   | 对象   |

有效参数：

- `offset` (数字) - 偏移量。在水平模式下是 x 坐标，否则是 y 坐标，必填。
- `animated` (布尔) - 是否启用动画，默认 `true`。
