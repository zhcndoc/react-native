---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对[`虚拟列表`](https://bvaughn.github.io/react-virtualized/#/components/List)概念的实现。）

- **内存消耗:** 有多少关于你的列表的信息被存储在内存中，这可能会导致应用崩溃。

- **响应能力:** 应用对交互做出响应的能力。例如，低响应能力就是当你触摸某个组件时，它不会立即按预期响应，而是会稍等一下才响应。

- **空白区域:** 当 `VirtualizedList` 无法足够快地渲染你的项目时，你可能会进入列表中一部分未渲染组件所在的区域，它们看起来像空白空间。

- **视口:** 渲染到像素的可见内容区域。

- **窗口:** 应当被挂载的项目所在区域，通常比视口大得多。

## Props

下面是一组可以帮助提升 `FlatList` 性能的 props：

### removeClippedSubviews

| 类型    | 默认值                               |
| ------- | ------------------------------------ |
| Boolean | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 通过将视口之外的视图排除在原生渲染和绘制遍历之外，这可以减少主线程上的耗时，从而降低掉帧风险。

**缺点：** 请注意，这种实现可能存在 bug，例如内容缺失（主要在 iOS 上观察到），尤其是在你使用复杂的变换和/或绝对定位时。另外请注意，这不会节省显著的内存，因为这些视图并不会被释放，只是被分离了。

### maxToRenderPerBatch

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

这是一个可以通过 `FlatList` 传递的 `VirtualizedList` prop。它控制每批渲染的项目数量，也就是每次滚动时接下来渲染的一组项目。

**优点：** 设置更大的数值意味着滚动时可见空白区域更少（提高填充率）。

**缺点：** 每批渲染更多项目意味着 JavaScript 执行时间更长，可能会阻塞其他事件处理，比如点击，损害响应能力。

### updateCellsBatchingPeriod

| 类型   | 默认值 |
| ------ | ------ |
| Number | 50     |

`maxToRenderPerBatch` 用于说明每批渲染的项目数量，而设置 `updateCellsBatchingPeriod` 则会告诉你的 `VirtualizedList` 两次批量渲染之间的延迟毫秒数（也就是组件渲染窗口内项目的频率）。

**优点：** 将此 prop 与 `maxToRenderPerBatch` 结合使用，你可以例如在较低频率的批次中渲染更多项目，或者在较高频率的批次中渲染更少项目。

**缺点：** 较低频率的批次可能导致空白区域，较高频率的批次可能导致响应能力问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

初始要渲染的项目数量。

**优点：** 为每种设备精确定义可以覆盖屏幕的项目数量。这对于初始渲染来说可能会带来很大的性能提升。

**缺点：** 设置较低的 `initialNumToRender` 可能会导致空白区域，尤其是在它太小、无法在初始渲染时覆盖视口的情况下。

### windowSize

| 类型   | 默认值 |
| ------ | ------ |
| Number | 21     |

这里传入的数字是一个度量单位，其中 1 等同于你的视口高度。默认值是 21（上方 10 个视口、下方 10 个视口，以及中间 1 个视口）。

**优点：** 更大的 `windowSize` 会降低滚动时看到空白空间的概率。另一方面，更小的 `windowSize` 会让同时挂载的项目更少，从而节省内存。

**缺点：** 更大的 `windowSize` 会带来更多内存消耗。更小的 `windowSize` 会让看到空白区域的概率更高。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要足够快。

### 使用基础组件

你的组件越复杂，渲染就越慢。尽量避免列表项中存在过多逻辑和嵌套。如果你在应用中大量复用这个列表项组件，请专门为大型列表创建一个组件，并尽量让它们保持最少的逻辑和嵌套。

### 使用轻量组件

你的组件越重，渲染就越慢。避免使用过重的图片（列表项应尽量使用裁剪后的版本或缩略图，越小越好）。与设计团队沟通，在列表中尽量减少特效、交互和信息量。把它们展示在项目详情中。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，只有当传递给组件的 props 发生变化时才会重新渲染。我们可以使用这个函数来优化 FlatList 中的组件。

```tsx
import {memo} from 'react';
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

在这个示例中，我们确定 MyListItem 只有在 title 变化时才应重新渲染。我们将比较函数作为 `React.memo()` 的第二个参数传入，这样组件只有在指定的 prop 发生变化时才会重新渲染。如果比较函数返回 true，组件就不会重新渲染。

### 使用缓存优化过的图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得更高性能的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快到达 `loaded` hook，你的 JavaScript 线程就能越快再次空闲下来。

### 使用 getItemLayout

如果你的所有列表项组件高度相同（或者在横向列表中宽度相同），提供 [getItemLayout](flatlist#getitemlayout) prop 可以让 `FlatList` 不再需要管理异步布局计算。这是一种非常理想的优化技术。

如果你的组件尺寸是动态的，而且你确实需要性能，可以考虑询问设计团队是否能重新设计，以便获得更好的性能。

### 使用 keyExtractor 或 key

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。这个 prop 用于缓存，也作为 React 的 `key` 来跟踪项目重新排序。

你也可以在项目组件中使用 `key` prop。

### 避免在 renderItem 中使用匿名函数

对于函数组件，把 `renderItem` 函数移到返回的 JSX 之外。同时，确保它被 `useCallback` hook 包裹，以防止它在每次渲染时都被重新创建。

对于类组件，把 `renderItem` 函数移到 render 函数之外，这样它就不会在每次调用 render 函数时都重新创建自身。

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
