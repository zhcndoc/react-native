---
id: optimizing-flatlist-configuration
title: 优化 FlatList 配置
---

## 术语

- **VirtualizedList:** `FlatList` 背后的组件（React Native 对 [`Virtual List`](https://bvaughn.github.io/react-virtualized/#/components/List) 概念的实现。）

- **内存消耗：** 列表信息在内存中存储的多少，这可能导致应用崩溃。

- **响应性：** 应用对交互做出响应的能力。例如，低响应性是指你触摸某个组件后，它会等待一会儿才响应，而不是像预期那样立即响应。

- **空白区域：** 当 `VirtualizedList` 无法足够快地渲染项目时，你可能会进入列表中一部分尚未渲染组件所在的区域，看起来像空白空间。

- **视口：** 渲染到像素的可见内容区域。

- **窗口：** 应该挂载项目的区域，通常比视口大得多。

## 属性

以下是一些可以帮助提升 `FlatList` 性能的属性：

### `removeClippedSubviews`

| 类型    | 默认值                               |
| ------- | ------------------------------------ |
| Boolean | Android 上为 `true`，否则为 `false` |

如果为 `true`，视口之外的视图会自动从原生视图层级中分离。

**优点：** 通过将视口之外的视图排除在原生渲染和绘制遍历之外，可以减少主线程耗时，从而降低掉帧风险。

**缺点：** 请注意，这种实现可能存在 bug，例如内容缺失（主要在 iOS 上观察到），尤其是在你使用复杂的变换和/或绝对定位时。另外要注意，这并不会显著节省内存，因为这些视图并没有被释放，只是被分离了。

### `maxToRenderPerBatch`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

这是一个可通过 `FlatList` 传递的 `VirtualizedList` 属性。它控制每批次渲染的项目数量，也就是每次滚动时接下来渲染的那一批项目。

**优点：** 设置更大的数值意味着滚动时更少出现视觉空白区域（提高填充率）。

**缺点：** 每批次渲染更多项目意味着 JavaScript 执行时间更长，可能阻塞其他事件处理，比如点击，从而影响响应性。

### `updateCellsBatchingPeriod`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 50     |

`maxToRenderPerBatch` 告诉你每批次渲染的项目数量，而设置 `updateCellsBatchingPeriod` 则会告诉你的 `VirtualizedList` 两次批次渲染之间的延迟时间（毫秒）（也就是你的组件渲染窗口内项目的频率）。

**优点：** 将此属性与 `maxToRenderPerBatch` 结合使用，可以让你例如以较低频率渲染更多项目，或以较高频率渲染更少项目。

**缺点：** 较低频率的批次可能导致空白区域，较高频率的批次可能引发响应性问题。

### initialNumToRender

| 类型   | 默认值 |
| ------ | ------ |
| Number | 10     |

初始要渲染的项目数量。

**优点：** 为每种设备定义可以覆盖屏幕的精确项目数量。这对于初始渲染来说可以带来显著的性能提升。

**缺点：** 设置过低的 `initialNumToRender` 可能会导致空白区域，尤其是在初始渲染时不足以覆盖视口的情况下。

### `windowSize`

| 类型   | 默认值 |
| ------ | ------ |
| Number | 21     |

这里传入的数字是一个测量单位，其中 1 等同于你的视口高度。默认值是 21（上方 10 个视口，下方 10 个视口，中间 1 个）。

**优点：** 更大的 `windowSize` 会降低滚动时看到空白区域的概率。另一方面，更小的 `windowSize` 会让同时挂载的项目更少，从而节省内存。

**缺点：** 更大的 `windowSize` 会带来更多内存消耗。更小的 `windowSize` 会增加看到空白区域的概率。

## 列表项

下面是一些关于列表项组件的建议。它们是列表的核心，因此需要足够快。

### 使用基础组件

你的组件越复杂，渲染就越慢。尽量避免在列表项中包含过多逻辑和嵌套。如果你在应用中经常复用这个列表项组件，可以专门为大型列表创建一个组件，并让它尽可能少地包含逻辑和嵌套。

### 使用轻量组件

你的组件越重，渲染就越慢。避免使用过大的图片（为列表项使用裁剪版或缩略图，尽可能小）。与设计团队沟通，在列表中尽量减少特效、交互和信息量。把它们展示在项目详情中。

### 使用 `memo()`

`React.memo()` 会创建一个记忆化组件，该组件只有在传入的 props 发生变化时才会重新渲染。我们可以使用这个函数来优化 FlatList 中的组件。

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

在这个示例中，我们已经确定 MyListItem 只有在 title 发生变化时才应重新渲染。我们将比较函数作为第二个参数传给了 React.memo()，这样组件只有在指定的 prop 发生变化时才会重新渲染。如果比较函数返回 true，则该组件不会重新渲染。

### 使用缓存优化图片

你可以使用社区包（例如来自 [Dream11](https://github.com/ds-horizon) 的 [@d11/react-native-fast-image](https://github.com/ds-horizon/react-native-fast-image)）来获得性能更好的图片。列表中的每张图片都是一个 `new Image()` 实例。它越快到达 `loaded` 钩子，JavaScript 线程就能越快再次释放出来。

### 使用 `getItemLayout`

如果你所有列表项组件的高度都相同（对于横向列表则是宽度相同），提供 [getItemLayout](flatlist#getitemlayout) 属性可以让 `FlatList` 无需管理异步布局计算。这是一种非常理想的优化技术。

如果你的组件尺寸是动态的，而且你确实需要性能，可以考虑问问设计团队是否能通过重新设计来提升性能。

### 使用 `keyExtractor` 或 `key`

你可以为 `FlatList` 组件设置 [`keyExtractor`](flatlist#keyextractor)。这个属性用于缓存，并作为 React 的 `key` 来跟踪项目重排序。

你也可以在你的项目组件中使用 `key` 属性。

### 避免在 `renderItem` 中使用匿名函数

对于函数组件，将 `renderItem` 函数移到返回的 JSX 外部。另外，确保它被包裹在 `useCallback` 钩子中，以防止它在每次渲染时都被重新创建。

对于类组件，将 `renderItem` 函数移到 render 函数外部，这样它就不会在每次调用 render 函数时重新创建自身。

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
