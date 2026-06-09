---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对 [`虚拟列表`](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存消耗:** 关于你的列表有多少信息被存储在内存中，这可能会导致应用崩溃。

- **响应性:** 应用对交互做出响应的能力。例如，低响应性是指你触摸某个组件后，它会等一会儿才响应，而不是像预期那样立即响应。

- **空白区域:** 当 `VirtualizedList` 无法足够快地渲染你的项目时，你可能会进入列表中某一部分，那里有尚未渲染的组件，看起来像空白区域。

- **视口:** 渲染到像素中的可见内容区域。

- **窗口:** 项目应被挂载的区域，通常比视口大得多。

## Props

以下是一些可以帮助提升 `FlatList` 性能的 props：

### `removeClippedSubviews`

| 类型    | 默认值                               |
| ------- | ------------------------------------ |
| Boolean | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 这会通过将视口之外的视图排除在原生渲染和绘制遍历之外，减少主线程上的耗时，从而降低掉帧的风险。

**缺点：** 注意，这种实现可能会有 bug，例如内容缺失（主要在 iOS 上观察到），尤其是在你使用变换和/或绝对定位做复杂操作时。另请注意，这不会显著节省内存，因为视图并没有被释放，只是被分离了。

### `maxToRenderPerBatch`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

这是一个可以通过 `FlatList` 传递的 `VirtualizedList` prop。它控制每批渲染的项目数量，也就是每次滚动时接下来渲染的一块项目。

**优点：** 设置更大的数值意味着滚动时可见空白区域更少（提高填充率）。

**缺点：** 每批更多的项目意味着更长的 JavaScript 执行时间，可能会阻塞其他事件处理，例如点击，从而影响响应性。

### `updateCellsBatchingPeriod`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 50     |

`maxToRenderPerBatch` 表示每批渲染的项目数量，而设置 `updateCellsBatchingPeriod` 则告诉你的 `VirtualizedList` 每批渲染之间的延迟时间（以毫秒为单位，即你的组件渲染窗口化项目的频率）。

**优点：** 将这个 prop 与 `maxToRenderPerBatch` 结合使用，可以让你例如以较低频率渲染更多项目，或者以较高频率渲染更少项目。

**缺点：** 较低频率的批次可能会导致空白区域，较高频率的批次可能会导致响应性问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

初始要渲染的项目数量。

**优点：** 为每种设备定义能够覆盖屏幕的精确项目数。这对于初次渲染来说可能是一个很大的性能提升。

**缺点：** 设置过低的 `initialNumToRender` 可能会导致空白区域，尤其是在初次渲染时数量太小，无法覆盖视口的情况下。

### `windowSize`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 21     |

这里传入的数字是一个测量单位，其中 1 等同于你的视口高度。默认值为 21（上方 10 个视口，下方 10 个视口，中间 1 个视口）。

**优点：** 更大的 `windowSize` 会降低滚动时看到空白区域的概率。另一方面，更小的 `windowSize` 会让同时挂载的项目更少，从而节省内存。

**缺点：** 较大的 `windowSize` 会带来更多内存消耗。较小的 `windowSize` 会增加看到空白区域的概率。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要足够快。

### 使用基础组件

你的组件越复杂，渲染速度就越慢。尽量避免列表项中有过多逻辑和嵌套。如果你在应用中大量复用这个列表项组件，可以专门为大型列表创建一个组件，并尽量减少其中的逻辑和嵌套。

### 使用轻量组件

你的组件越重，渲染速度就越慢。避免使用过重的图片（为列表项使用裁剪版或缩略图，尽可能小）。与设计团队沟通，在列表中尽量减少效果、交互和信息量。把它们展示在项目详情中。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，只有当传递给该组件的 props 发生变化时才会重新渲染。我们可以使用这个函数来优化 FlatList 中的组件。

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

在这个示例中，我们确定只有 title 变化时才应重新渲染 MyListItem。我们将比较函数作为 `React.memo()` 的第二个参数传入，这样组件只有在指定 prop 发生变化时才会重新渲染。如果比较函数返回 true，组件就不会重新渲染。

### 使用缓存的优化图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得更高性能的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快触发 `loaded` 钩子，你的 JavaScript 线程就越快能再次空闲。

### 使用 `getItemLayout`

如果你的所有列表项组件都有相同的高度（横向列表则是宽度），提供 [getItemLayout](flatlist#getitemlayout) prop 可以让 `FlatList` 无需管理异步布局计算。这是一种非常理想的优化技术。

如果你的组件尺寸是动态的，并且你确实需要性能，可以考虑和设计团队讨论是否可以重新设计，以获得更好的性能。

### 使用 `keyExtractor` 或 `key`

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。这个 prop 用于缓存，并作为 React 的 `key` 来跟踪项目重排。

你也可以在项目组件中使用 `key` prop。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，把 `renderItem` 函数移到返回的 JSX 之外。另外，确保它被 `useCallback` hook 包裹，以防止它在每次渲染时都被重新创建。

对于类组件，把 `renderItem` 函数移到 `render` 函数之外，这样它就不会在每次调用 `render` 函数时重新创建自己。

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
