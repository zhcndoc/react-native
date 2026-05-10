---
id: virtualview
title: VirtualView 🧪
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

<ExperimentalAPIWarning />

`VirtualView` 是一个核心组件，其行为类似于 [`View`](view)。

当它是 [`ScrollView`](scrollview) 的后代时，它会获得额外的虚拟化能力，以便在被滚动视口遮挡时减少内存占用。

```tsx
<ScrollView>
  <VirtualView>
    <Text>Hello world!</Text>
  </VirtualView>
</ScrollView>
```

一个没有祖先[`ScrollView`](scrollview) 的 `VirtualView` 不具备任何虚拟化能力。

## 虚拟化

当 `VirtualView` 离开 [`ScrollView`](scrollview) 的可见区域时，它会变为隐藏状态。隐藏时，`VirtualView` 会缓存其最近一次布局，并且可能卸载其子组件——这一过程称为虚拟化。

当 `VirtualView` 返回到 [`ScrollView`](scrollview) 的可见区域时，它会变为可见状态。可见时，其子组件 _保证_ 会被渲染。这个保证是通过阻塞主线程来实现的：在 `VirtualView` 的子组件能够被渲染之前，不渲染下一帧中会显示出 `VirtualView` 的内容。

<img src="/docs/assets/d_virtualview_modes.svg" width="700" alt="VirtualView 模式和阈值示意图。" />

:::note
在未来的发展中，隐藏的 `VirtualView` 可能会改为在 [`<Activity mode="hidden">`](https://react.dev/reference/react/Activity) 中渲染其子组件，以尽可能长时间保留状态，同时平衡内存开销。
:::

### 阻塞主线程

这是 React Native 功能集中首次出现“渲染 React 组件会阻塞主线程”的能力。这是 [新架构](/architecture/landing-page) 启用的一项新能力！

阻塞主线程可以通过防止某些情况下使用诸如 [`FlatList`](flatlist) 之类组件时出现的空白帧闪烁，来提供更好的用户体验。它还可以通过使用主线程优先级来提升性能，而主线程通常也运行在更高性能的核心上。

不过，阻塞主线程也有代价。如果某个更新操作（例如挂载 `VirtualView` 的子组件）耗时过长，现在就可能掉帧。掉帧超过几帧会让应用显得卡顿、无响应，从而带来更差的用户体验。掉帧过多甚至可能导致操作系统弹出一个模态提示，表明应用没有响应，或者直接终止你的应用！

:::warning
DevTools 目前不支持在主线程上调试 JavaScript。这意味着如果你使用断点调试从 `onModeChange` 调用的代码，而这段代码是在主线程上执行的，你的调试器可能会卡住。

调试 JavaScript 代码的其他部分应当仍能按预期工作。我们正在努力在将 `VirtualView` 发布到 React Native 稳定频道之前弥补这一缺口。
:::

### 预渲染

`VirtualView` 通过在需要之前更早地渲染，从而在缓解掉帧缺点的同时，让你受益于主线程渲染。这称为“预渲染”。

默认情况下，每个 `VirtualView` 在接近 [`ScrollView`](scrollview) 的可见区域时都会预渲染其子组件。发生这种情况时，其子组件会在后台线程上以较低优先级渲染（使用 [transition](https://react.dev/reference/react/startTransition)）。这可确保主线程和 React 能够以更高优先级处理其他关键用户交互。

:::note
`VirtualView` 的预渲染逻辑目前不可配置。用于确定这一行为的算法正在积极设计迭代中，并很可能在未来的版本中发生变化。
:::

---

## 属性

### `children`

要在此 `VirtualView` 内部渲染的内容。

| 类型                     |
| ------------------------ |
| [React Node](react-node) |

---

### `onModeChange`

当 `VirtualView` 改变其渲染子组件的方式时调用。

如果提供了回调，它可能会根据内部状态变化从不同线程和不同优先级被调用。可以通过检查事件上的 `mode` 属性来判断：

- 如果 `mode` 是 [`VirtualViewMode.Visible`](#virtualviewmode)，则回调是在主线程上以即时优先级调用的。
- 如果 `mode` 是 [`VirtualViewMode.Prerender`](#virtualviewmode) 或 [`VirtualViewMode.Hidden`](#virtualviewmode)，则回调是在后台线程上以过渡优先级调用的。

回调不会连续两次以相同的 `mode` 值被调用。不过，事件的顺序保证很少。如果子组件成功完成了预渲染，那么即使它变为可见，回调也可能永远不会以 [`VirtualViewMode.Visible`](#virtualviewmode) 被调用。

| 类型                                               |
| -------------------------------------------------- |
| `md ([ModeChangeEvent](#modechangeevent)) => void` |

---

### `nativeID`

用于从原生类中定位此视图的标识符。

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

## 类型定义

### `ModeChangeEvent`

传递给 [`onModeChange`](#onmodechange) 的参数。

| 类型   |
| ------ |
| object |

**属性：**

| 名称          | 类型                                | 描述                                                                                       |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| mode          | [VirtualViewMode](#virtualviewmode) | `VirtualView` 的新模式。                                                                    |
| target        | element                             | 触发此事件的 `VirtualView`。                                                                |
| targetRect    | [Rect](rect)                        | `target` 相对于最近祖先 `ScrollView` 的布局。                                              |
| thresholdRect | [Rect](rect)                        | 触发此事件的阈值布局，相对于最近祖先 `ScrollView`。                                        |

:::note
例如，如果一个 `VirtualView` 进入了 [`ScrollView`](scrollview) 的可见区域...

- `mode` 将是 [`VirtualViewMode.Visible`](#virtualviewmode)
- `thresholdRect` 将描述最近祖先 [`ScrollView`](scrollview) 的可见视口
- `targetRect` 将是与 `thresholdRect` 重叠的 `target` 布局（即它位于 [`ScrollView`](scrollview) 的可见区域内）

:::

### `VirtualViewMode`

`VirtualView` 的可能模式。

| 名称      | 值   | 描述                                    |
| --------- | ---- | --------------------------------------- |
| Visible   | `0`  | 目标视图可见。                          |
| Prerender | `1`  | 目标视图隐藏，但可以预渲染。            |
| Hidden    | `2`  | 目标视图隐藏。                          |

---

## 静态方法

### `createHiddenVirtualView()`

```tsx
static createHiddenVirtualView(height: number): typeof VirtualView;
```

`VirtualView` 初始渲染其子组件时会将其视为可见，即使它一开始就被祖先 [`ScrollView`](scrollview) 遮挡住。这是因为当组件首次渲染时，祖先 [`ScrollView`](scrollview) 的存在——更不用说它的大小和滚动位置了——都是未知的。

对于高级使用场景，`createHiddenVirtualView()` 会创建一个组件，用于以提供的估算布局渲染一个初始隐藏的 `VirtualView`。

```tsx
const HiddenVirtualView = createHiddenVirtualView(100);

<ScrollView>
  <HiddenVirtualView>
    <Text>Hello world!</Text>
  </HiddenVirtualView>
</ScrollView>;
```

**参数：**

| 名称                                                        | 类型   | 描述                                            |
| ----------------------------------------------------------- | ------ | ----------------------------------------------- |
| height <div className="label basic required">Required</div> | number | 初始渲染 `VirtualView` 的估计高度。             |
