---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList：** `FlatList` 背后的组件（React Native 对 [`Virtual List`](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存占用：** 列表信息存储在内存中的量，这可能导致应用崩溃。

- **响应性：** 应用响应交互的能力。例如，响应性较低是指你触摸某个组件后，它需要等待一会儿才响应，而不是像预期那样立即响应。

- **空白区域：** 当 `VirtualizedList` 无法足够快速地渲染项目时，你可能会进入列表中包含未渲染组件的部分，这些组件会显示为空白区域。

- **视口：** 渲染到像素上的内容可见区域。

- **窗口：** 项目应该挂载的区域，通常比视口大得多。

## Props

以下是一些有助于提升 `FlatList` 性能的 props：

### `removeClippedSubviews`

| 类型    | 默认值                              |
| ------- | ----------------------------------- |
| Boolean | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 通过将视口之外的视图排除在原生渲染和绘制遍历之外，可以减少主线程耗时，从而降低丢帧的风险。

**缺点：** 请注意，此实现可能存在一些问题，例如内容缺失（主要在 iOS 上观察到），尤其是在使用复杂的变换和／或绝对定位时。还请注意，这不会节省大量内存，因为视图并未被释放，只是被分离。

### `maxToRenderPerBatch`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

这是一个可以通过 `FlatList` 传递的 `VirtualizedList` prop。它控制每批渲染的项目数量，也就是每次滚动时渲染的下一批项目数量。

**优点：** 设置更大的数值意味着滚动时出现视觉空白区域的情况更少（提高填充率）。

**缺点：** 每批项目越多，JavaScript 执行时间可能越长，从而阻塞其他事件处理，例如点击，影响响应性。

### `updateCellsBatchingPeriod`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 50     |

`maxToRenderPerBatch` 用于告知每批渲染的项目数量，而设置 `updateCellsBatchingPeriod` 则用于告知你的 `VirtualizedList` 每批渲染之间的延迟时间（以毫秒为单位），也就是组件渲染窗口中项目的频率。

**优点：** 将此 prop 与 `maxToRenderPerBatch` 结合使用，可以让你灵活地选择例如以较低频率的批次渲染更多项目，或以较高频率的批次渲染更少项目。

**缺点：** 频率较低的批次可能导致空白区域，频率较高的批次可能导致响应性问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

初始渲染的项目数量。

**优点：** 为每种设备精确定义能够覆盖屏幕的项目数量。这可以显著提升初始渲染性能。

**缺点：** 设置较低的 `initialNumToRender` 可能导致空白区域，尤其是在初始渲染时该数值太小而无法覆盖视口的情况下。

### `windowSize`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 21     |

这里传入的数值是一个测量单位，其中 1 等于你的视口高度。默认值为 21（上方 10 个视口、下方 10 个视口，以及中间 1 个视口）。

**优点：** 较大的 `windowSize` 会降低滚动时看到空白区域的可能性。另一方面，较小的 `windowSize` 会减少同时挂载的项目数量，从而节省内存。

**缺点：** `windowSize` 越大，内存占用越多。`windowSize` 越小，看到空白区域的可能性越大。

## 列表项目

下面是一些有关列表项目组件的提示。它们是列表的核心，因此需要运行得足够快。

### 使用基础组件

组件越复杂，渲染速度就越慢。尽量避免在列表项目中加入大量逻辑和嵌套。如果你在应用中大量复用此列表项目组件，请只为大型列表创建组件，并使其尽可能少包含逻辑和嵌套。

### 使用轻量组件

组件越繁重，渲染速度就越慢。避免使用过大的图片（对于列表项目，请使用裁剪后的版本或缩略图，并尽可能缩小）。与设计团队沟通，在列表中尽可能少使用效果、交互和信息。将它们显示在项目详情中。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，只有在传递给组件的 props 发生变化时才会重新渲染。我们可以使用此函数来优化 FlatList 中的组件。

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

在此示例中，我们确定只有 title 发生变化时，MyListItem 才应该重新渲染。我们将比较函数作为 React.memo() 的第二个参数传入，以便仅在指定的 prop 发生变化时重新渲染组件。如果比较函数返回 true，组件将不会重新渲染。

### 使用缓存的优化图片

你可以使用社区软件包（例如 [Dream11](https://github.com/ds-horizon) 提供的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得性能更好的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快到达 `loaded` hook，你的 JavaScript 线程就能越快恢复空闲。

### 使用 `getItemLayout`

如果所有列表项目组件的高度都相同（对于水平列表则是宽度相同），提供 [getItemLayout](flatlist#getitemlayout) prop 后，`FlatList` 就不需要管理异步布局计算。这是一种非常值得采用的优化技术。

如果组件的尺寸是动态的，而你确实需要性能，请考虑询问设计团队是否可以重新设计，以获得更好的性能。

### 使用 `keyExtractor` 或 `key`

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。此 prop 用于缓存，也用作 React 的 `key` 来跟踪项目重新排序。

你也可以在项目组件中使用 `key` prop。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，将 `renderItem` 函数移到返回的 JSX 外部。同时，确保将它包装在 `useCallback` hook 中，以防止它在每次渲染时被重新创建。

对于类组件，将 `renderItem` 函数移到 render 函数外部，这样每次调用 render 函数时就不会重新创建它。

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
