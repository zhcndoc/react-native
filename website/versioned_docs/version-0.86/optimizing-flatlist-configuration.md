---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对 [“虚拟列表”](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存占用:** 关于列表有多少信息被存储在内存中，这可能会导致应用崩溃。

- **响应性:** 应用对交互作出响应的能力。例如，响应性较低是指当你触摸某个组件时，它会等一会儿才响应，而不是按预期立即响应。

- **空白区域:** 当 `VirtualizedList` 无法足够快地渲染项目时，你可能会进入列表中某一部分，其中未渲染的组件会显示为空白空间。

- **可视区域:** 渲染到像素的内容可见区域。

- **窗口:** 应该被挂载项目所在的区域，通常比可视区域大得多。

## 属性

以下是一组可帮助提升 `FlatList` 性能的属性：

### `removeClippedSubviews`

| 类型    | 默认值                              |
| ------- | ------------------------------------ |
| Boolean | Android 上为 `true`，否则为 `false` |

如果为 `true`，则可视区域之外的视图会自动从原生视图层级中分离。

**优点：** 这会减少在主线程上花费的时间，因此通过将可视区域之外的视图排除在原生渲染和绘制遍历之外，降低丢帧风险。

**缺点：** 请注意，此实现可能存在 bug，例如内容缺失（主要在 iOS 上观察到），尤其是在你使用复杂的变换和/或绝对定位时。另请注意，这不会显著节省内存，因为这些视图并未被释放，只是被分离了。

### `maxToRenderPerBatch`

| 类型   | 默认值 |
| ------ | ------- |
| Number | 10      |

这是一个可通过 `FlatList` 传递的 `VirtualizedList` 属性。它控制每批次渲染的项目数量，也就是每次滚动时接下来渲染的一组项目。

**优点：** 设置更大的数值意味着滚动时视觉空白区域更少（提高填充率）。

**缺点：** 每批次更多的项目意味着更长时间的 JavaScript 执行，可能会阻塞其他事件处理，例如点击，从而影响响应性。

### `updateCellsBatchingPeriod`

| 类型   | 默认值 |
| ------ | ------- |
| Number | 50      |

`maxToRenderPerBatch` 决定每批渲染多少项目，而 `updateCellsBatchingPeriod` 则告诉你的 `VirtualizedList`，批次渲染之间的延迟是多少毫秒（也就是你的组件多久渲染一次窗口内的项目）。

**优点：** 将此属性与 `maxToRenderPerBatch` 结合使用，可以让你例如以较低频率渲染更多项目，或以较高频率渲染更少项目。

**缺点：** 较低频率的批次可能会导致空白区域，较高频率的批次可能会引发响应性问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------- |
| Number | 10      |

初始需要渲染的项目数量。

**优点：** 为每种设备精确定义能够覆盖屏幕的项目数量。这可能会显著提升首次渲染性能。

**缺点：** 设置较低的 `initialNumToRender` 可能会导致空白区域，尤其是在它小到不足以在首次渲染时覆盖可视区域的情况下。

### `windowSize`

| 类型   | 默认值 |
| ------ | ------- |
| Number | 21      |

这里传入的数值是一个测量单位，其中 1 等于你的可视区域高度。默认值为 21（上方 10 个可视区域，下方 10 个可视区域，中间 1 个可视区域）。

**优点：** 更大的 `windowSize` 会降低滚动时看到空白空间的概率。另一方面，更小的 `windowSize` 会让同时挂载的项目更少，从而节省内存。

**缺点：** 更大的 `windowSize` 会带来更多内存占用。更小的 `windowSize` 会增加看到空白区域的概率。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要尽可能快。

### 使用基础组件

你的组件越复杂，渲染就越慢。尽量避免在列表项中放入大量逻辑和嵌套。如果你在应用中大量复用这个列表项组件，请只为大型列表创建一个组件，并使其尽可能少地包含逻辑和嵌套。

### 使用轻量组件

你的组件越“重”，渲染就越慢。避免使用大的图片（为列表项使用裁剪版本或缩略图，尽可能小）。与设计团队沟通，在列表中尽量减少效果、交互和信息量。将它们展示在项目详情中。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，只有当传给组件的 props 发生变化时才会重新渲染。我们可以使用这个函数来优化 FlatList 中的组件。

```tsx
import React, {memo} from 'react';
import {View, Text} from 'react-native';

const MyListItem = memo(
  ({title}: {title: string}) => (
    <View>
      <Text>{title}</Text>
    </View>
  ),
  (prevProps, nextProps) => {
    return prevProps.title === nextProps.title;
  },
);

export default MyListItem;
```

在这个示例中，我们已经确定 MyListItem 只有在 title 变化时才应重新渲染。我们将比较函数作为第二个参数传给 React.memo()，这样组件只有在指定的 prop 变化时才会重新渲染。如果比较函数返回 true，则组件不会重新渲染。

### 使用缓存的优化图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得更高性能的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快到达 `loaded` 钩子，你的 JavaScript 线程就能越快再次空闲。

### 使用 `getItemLayout`

如果你的所有列表项组件高度相同（水平列表则为宽度相同），提供 [getItemLayout](flatlist#getitemlayout) 属性可以让 `FlatList` 无需管理异步布局计算。这是一种非常理想的优化技术。

如果你的组件大小是动态的，而且你确实需要性能，可以考虑和设计团队商量，看看是否可以通过重新设计来提升性能。

### 使用 `keyExtractor` 或 `key`

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。这个属性用于缓存，也用于作为 React `key` 来跟踪项目重排。

你也可以在项目组件中使用 `key` 属性。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，请将 `renderItem` 函数移到返回的 JSX 外部。另外，确保它被 `useCallback` 钩子包裹，以防止每次渲染都重新创建它。

对于类组件，请将 `renderItem` 函数移到 render 函数外部，这样它就不会在每次调用 render 函数时重新创建自身。

```tsx
const renderItem = useCallback(({item}) => (
   <View key={item.key}>
      <Text>{item.title}</Text>
   </View>
 ), []);

return (
  // ...
  <FlatList data={items} renderItem={renderItem} />;
  // ...
);
```
