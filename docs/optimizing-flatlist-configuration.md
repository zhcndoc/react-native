---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对[`虚拟列表`](https://bvaughn.github.io/react-virtualized/#/components/List)概念的实现。）

- **内存消耗:** 列表信息在内存中被存储的多少，这可能导致应用崩溃。

- **响应能力:** 应用对交互作出响应的能力。例如，低响应能力是指你触摸某个组件后，它会等待一小段时间才响应，而不是像预期那样立即响应。

- **空白区域:** 当 `VirtualizedList` 无法足够快地渲染项目时，你可能会滚动到列表中一部分未渲染组件所在的位置，这些位置会显示为空白区域。

- **视口:** 渲染到像素的可见内容区域。

- **窗口:** 应该挂载项目的区域，通常比视口大得多。

## 属性

以下是一组可以帮助提升 `FlatList` 性能的属性：

### `removeClippedSubviews`

| 类型    | 默认值                              |
| ------- | ------------------------------------ |
| 布尔值 | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 通过将视口外的视图排除在原生渲染和绘制遍历之外，可以减少主线程上的耗时，从而降低掉帧风险。

**缺点：** 请注意，这种实现可能存在 bug，例如内容缺失（主要在 iOS 上观察到），尤其是在你使用变换和/或绝对定位做复杂操作时。另请注意，这不会显著节省内存，因为这些视图并不会被释放，只是被分离。

### `maxToRenderPerBatch`

| 类型    | 默认值 |
| ------- | ------ |
| 数字 | 10      |

这是一个可以通过 `FlatList` 传递的 `VirtualizedList` 属性。它控制每批渲染的项目数量，也就是每次滚动时接下来要渲染的那一块项目。

**优点：** 设置更大的数值意味着滚动时更少出现视觉空白区域（提高填充率）。

**缺点：** 每批渲染更多项目意味着更长的 JavaScript 执行时间，可能会阻塞其他事件处理，例如按压操作，从而影响响应能力。

### `updateCellsBatchingPeriod`

| 类型    | 默认值 |
| ------- | ------ |
| 数字 | 50      |

`maxToRenderPerBatch` 告诉你每批渲染多少项目，而 `updateCellsBatchingPeriod` 则告诉你的 `VirtualizedList` 两批渲染之间的延迟时间（单位为毫秒），也就是组件渲染窗口内项目的频率。

**优点：** 将此属性与 `maxToRenderPerBatch` 结合使用，可以让你例如以较低频率渲染更多项目，或者以较高频率渲染更少项目。

**缺点：** 较低频率的批次可能导致空白区域，较高频率的批次可能导致响应能力问题。

### `initialNumToRender`

| 类型    | 默认值 |
| ------- | ------ |
| 数字 | 10      |

初始要渲染的项目数量。

**优点：** 为每种设备精确定义足以覆盖屏幕的项目数量，这可以显著提升初次渲染性能。

**缺点：** 设置过小的 `initialNumToRender` 可能导致空白区域，尤其是在初次渲染时它小到不足以覆盖视口。

### `windowSize`

| 类型    | 默认值 |
| ------- | ------ |
| 数字 | 21      |

这里传入的数字是一个测量单位，其中 1 等同于你的视口高度。默认值是 21（上方 10 个视口，下方 10 个视口，中间 1 个视口）。

**优点：** 更大的 `windowSize` 会降低滚动时看到空白区域的概率。另一方面，更小的 `windowSize` 会让同时挂载的项目更少，从而节省内存。

**缺点：** 更大的 `windowSize` 会带来更多内存消耗。更小的 `windowSize` 会增加看到空白区域的概率。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要尽可能快。

### 使用基础组件

你的组件越复杂，渲染就越慢。尽量避免在列表项中加入过多逻辑和嵌套。如果你在应用中会大量复用这个列表项组件，可以专门为大型列表创建一个组件，并尽量让它们保持最少的逻辑和嵌套。

### 使用轻量组件

你的组件越重，渲染就越慢。避免使用过重的图片（对列表项使用裁剪后的版本或缩略图，尽可能小）。和设计团队沟通，在列表中尽量少使用效果、交互和信息，把它们放到项目详情中展示。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，它只有在传给组件的属性发生变化时才会重新渲染。我们可以使用这个函数来优化 `FlatList` 中的组件。

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

在这个示例中，我们已经确定 `MyListItem` 只有在 `title` 变化时才应重新渲染。我们将比较函数作为第二个参数传给了 `React.memo()`，这样组件就只会在指定属性发生变化时重新渲染。如果比较函数返回 `true`，组件就不会重新渲染。

### 使用缓存优化后的图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得更高性能的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快进入 `loaded` 钩子，JavaScript 线程就能越快再次空闲下来。

### 使用 `getItemLayout`

如果你所有的列表项组件高度相同（或者在横向列表中宽度相同），提供 [getItemLayout](flatlist#getitemlayout) 属性可以让你的 `FlatList` 不必处理异步布局计算。这是一种非常值得采用的优化技术。

如果你的组件尺寸是动态的，而且你确实需要性能，请考虑和设计团队沟通，看看他们是否可以考虑重新设计以获得更好的性能。

### 使用 `keyExtractor` 或 `key`

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。这个属性用于缓存，也用于作为 React 的 `key` 来跟踪项目重排序。

你也可以在项目组件中使用 `key` 属性。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，把 `renderItem` 函数移到返回的 JSX 外部。另外，确保它被 `useCallback` 钩子包裹，以防止每次渲染时都重新创建它。

对于类组件，把 `renderItem` 函数移到 render 函数外部，这样它就不会在每次调用 render 函数时重新创建自身。

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
