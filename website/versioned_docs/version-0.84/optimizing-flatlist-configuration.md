---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList：** `FlatList` 背后的组件（React Native 对 [`虚拟列表`](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存消耗：** 关于列表的信息被储存在内存中的多少，这可能导致应用崩溃。

- **响应性：** 应用响应交互的能力。例如，响应性差时，你点击一个组件会有短暂等待，而不是预期的立即响应。

- **空白区域：** 当 `VirtualizedList` 渲染不够快时，你可能会进入列表的空白部分，这些部分的组件没有被渲染出来，显示为空白。

- **视口（Viewport）：** 可见内容的像素渲染区域。

- **窗口（Window）：** 应该挂载项目的区域，通常比视口大得多。

## 属性

以下是有助于提升 `FlatList` 性能的一些属性：

### `removeClippedSubviews`

| 类型      | 默认值                              |
| --------- | ----------------------------------- |
| 布尔值    | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口外的视图会被自动从原生视图层级中分离。

**优点：** 通过排除视口外的视图，减少主线程花费的时间，从而降低掉帧风险。

**缺点：** 需要注意此实现可能存在 Bug（主要是在 iOS 上），如内容缺失，尤其是在使用复杂变换和/或绝对定位时。另外，此操作不会显著节省内存，因为视图并未被释放，仅仅是分离。

### `maxToRenderPerBatch`

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | 10     |

这是 `VirtualizedList` 的一个属性，可以通过 `FlatList` 传递。控制每个批次渲染的项目数量，即每次滚动时渲染的下一批项目。

**优点：** 设置更大的值意味着滚动时空白区域更少（提升填充率）。

**缺点：** 每批渲染更多项目可能导致 JavaScript 执行时间变长，有阻塞其他事件处理（如点击），降低响应性。

### `updateCellsBatchingPeriod`

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | 50     |

`maxToRenderPerBatch` 指定每批渲染项目数，而 `updateCellsBatchingPeriod` 指定两批渲染之间的毫秒延迟（即组件渲染窗口项目的频率）。

**优点：** 配合 `maxToRenderPerBatch` 使用，可以实现例如少量多批或者大量少批的渲染策略。

**缺点：** 批次过少可能导致空白区域，批次过多可能影响响应性。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | 10     |

初次渲染的项目数量。

**优点：** 定义精确的数量，覆盖各种设备的屏幕，这对初次渲染性能有很大提升。

**缺点：** 设置过低可能导致初次渲染时出现空白区域，特别是数量不足以覆盖视口时。

### `windowSize`

| 类型   | 默认值 |
| ------ | ------ |
| 数字   | 21     |

这里传入的数字是以视口高度为单位的测量值。默认是 21（上方 10 个视口，下方 10 个视口，中间 1 个视口）。

**优点：** 更大的 `windowSize` 意味着滚动时空白空间更少。反之，更小的 `windowSize` 会减少同时挂载的项目数，节省内存。

**缺点：** 更大的 `windowSize` 会增加内存消耗。更小的 `windowSize` 会增加空白区域出现的概率。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要足够快。

### 使用基础组件

你的组件越复杂，渲染就越慢。尽量避免列表项中有大量逻辑和嵌套。如果列表项组件在应用中被大量复用，专门为大型列表创建一个组件，且尽量减少逻辑和嵌套。

### 使用轻量级组件

组件越重渲染越慢。避免使用大图（列表项中使用裁剪版本或缩略图，越小越好）。与设计团队沟通，尽量减少列表中的特效、交互和信息，详情页再展示。

### 使用 `memo()`

`React.memo()` 创建一个备忘录组件，只有当传递给组件的 props 发生变化时才重新渲染。我们可以用它来优化 FlatList 中的组件。

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

在此示例中，我们设定了只有 `title` 变化时 `MyListItem` 才重新渲染。我们把比较函数作为第二个参数传给 `React.memo()`，只有当指定的属性变化时才进行重新渲染。如果比较函数返回 `true`，组件将不会重新渲染。

### 使用缓存的优化图片

你可以使用社区包（例如 Dream11 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来实现更高性能的图片。列表中的每张图片都是一个 `new Image()` 实例，图片越快触发加载完成钩子，JavaScript 线程释放得越快。

### 使用 `getItemLayout`

如果所有列表项组件高度（或水平列表的宽度）相同，提供 [`getItemLayout`](flatlist#getitemlayout) 属性可以避免 `FlatList` 进行异步布局计算。这是一种非常理想的优化方式。

如果组件尺寸动态且你非常需要提升性能，可以考虑请设计团队讨论是否能重新设计以优化性能。

### 使用 `keyExtractor` 或 `key`

你可以给 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor) 属性。这个属性用于缓存和作为 React 的 `key` 来追踪项目重新排序。

你也可以在列表项组件中使用 `key` 属性。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，将 `renderItem` 函数移出返回的 JSX 之外，并确保它被 `useCallback` 包裹，以防止每次渲染时重新创建。

对于类组件，将 `renderItem` 函数移出 `render` 函数外部，避免每次调用 `render` 时都重新创建。

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