---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对 [`Virtual List`](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存消耗：** 关于你的列表有多少信息被存储在内存中，这可能导致应用崩溃。

- **响应性：** 应用响应交互的能力。例如，低响应性是指当你触摸一个组件时，它会等待一会儿才响应，而不是像预期那样立即响应。

- **空白区域：** 当 `VirtualizedList` 无法足够快地渲染你的项目时，你可能会进入列表中没有渲染组件的部分，表现为空白空间。

- **视口：** 渲染为像素的可见内容区域。

- **窗口：** 应该挂载项目的区域，通常比视口大得多。

## 属性

以下是一列可以帮助提高 `FlatList` 性能的属性：

### removeClippedSubviews

| 类型    | 默认值                              |
| ------- | ------------------------------------ |
| Boolean | 在 Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 这减少了主线程上花费的时间，从而通过从原生渲染和绘制遍历中排除视口之外的视图，降低了丢帧的风险。

**缺点：** 请注意，此实现可能存在错误，例如内容丢失（主要在 iOS 上观察到），尤其是如果你正在对变换和/或绝对定位做复杂的事情。还要注意，这不会节省大量内存，因为视图没有被释放，只是被分离了。

### maxToRenderPerBatch

| 类型   | 默认值 |
| ------ | ------- |
| Number | 10      |

这是一个可以通过 `FlatList` 传递的 `VirtualizedList` 属性。它控制每批渲染的项目数量，即每次滚动时渲染的下一块项目。

**优点：** 设置更大的数字意味着滚动时视觉空白区域更少（增加了填充率）。

**缺点：** 每批更多项目意味着更长的 JavaScript 执行时间，可能会阻塞其他事件处理，如点击，损害响应性。

### updateCellsBatchingPeriod

| 类型   | 默认值 |
| ------ | ------- |
| Number | 50      |

虽然 `maxToRenderPerBatch` 告诉每批渲染的项目数量，但设置 `updateCellsBatchingPeriod` 告诉你的 `VirtualizedList` 批渲染之间的延迟毫秒数（你的组件渲染窗口项目的频率）。

**优点：** 将此属性与 `maxToRenderPerBatch` 结合使用，可以让你例如在较不频繁的批中渲染更多项目，或在较频繁的批中渲染更少项目。

**缺点：** 较不频繁的批可能导致空白区域，较频繁的批可能导致响应性问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------- |
| Number | 10      |

初始渲染的项目数量。

**优点：** 定义覆盖每个设备屏幕的确切项目数量。这可以大大提高初始渲染的性能。

**缺点：** 设置较低的 `initialNumToRender` 可能导致空白区域，尤其是如果它太小而无法在初始渲染时覆盖视口。

### windowSize

| 类型   | 默认值 |
| ------ | ------- |
| Number | 21      |

此处传递的数字是一个测量单位，其中 1 相当于你的视口高度。默认值为 21（上方 10 个视口，下方 10 个视口，中间一个）。

**优点：** 更大的 `windowSize` 将导致滚动时看到空白空间的机会更少。另一方面，更小的 `windowSize` 将导致同时挂载的项目更少，节省内存。

**缺点：** 对于更大的 `windowSize`，你将会有更多的内存消耗。对于更小的 `windowSize`，你将会有更大的机会看到空白区域。

## 列表项

以下是关于列表项组件的一些提示。它们是列表的核心，因此需要快速渲染。

### 使用基础组件

组件越复杂，渲染速度越慢。尽量避免在列表项中包含大量逻辑和嵌套。如果你在应用中大量复用此列表项组件，请专门为大型列表创建一个组件，并使其逻辑和嵌套尽可能少。

### 使用轻量组件

组件越重，渲染越慢。避免使用重型图片（对于列表项使用裁剪版本或缩略图，尽可能小）。与设计团队沟通，在列表中尽可能少地使用效果、交互和信息。在 item 的详情页中展示它们。

### 使用 `memo()`

`React.memo()` 创建一个记忆化组件，仅当传递给组件的 props 发生变化时才会重新渲染。我们可以使用此函数来优化 FlatList 中的组件。

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

在此示例中，我们确定 MyListItem 仅在 title 更改时才应重新渲染。我们将比较函数作为第二个参数传递给 React.memo()，以便仅在指定的 prop 更改时才重新渲染组件。如果比较函数返回 true，则组件将不会重新渲染。

### 使用缓存优化图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得性能更高的图片。列表中的每个图片都是一个 `new Image()` 实例。它越快到达 `loaded` 钩子，你的 JavaScript 线程就越快再次空闲。

### 使用 getItemLayout

如果所有列表项组件具有相同的高度（对于水平列表则为宽度），提供 [getItemLayout](flatlist#getitemlayout) 属性可以消除 `FlatList` 管理异步布局计算的需要。这是一个非常理想的优化技术。

如果你的组件具有动态大小且你确实需要性能，请考虑询问你的设计团队是否可以重新设计以获得更好的性能。

### 使用 keyExtractor 或 key

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。此属性用于缓存，并作为 React `key` 来跟踪项目重新排序。

你也可以在 item 组件中使用 `key` 属性。

### 避免在 renderItem 上使用匿名函数

对于函数组件，将 `renderItem` 函数移到返回的 JSX 之外。此外，确保它包裹在 `useCallback` hook 中，以防止每次渲染时重新创建。

对于类组件，将 `renderItem` 函数移到 render 函数之外，这样它就不会在每次调用 render 函数时重新创建自身。

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
