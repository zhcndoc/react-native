---
id: virtualview
title: VirtualView 🧪
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

<ExperimentalAPIWarning />

`VirtualView` 是一个核心组件，其行为类似于 [`View`](view)。

当它是 [`ScrollView`](scrollview) 的后代时，它会获得额外的虚拟化能力，以便在被滚动视口遮挡时减少其内存占用。

```tsx
<ScrollView>
  <VirtualView>
    <Text>Hello world!</Text>
  </VirtualView>
</ScrollView>
```

没有祖先 [`ScrollView`](scrollview) 的 `VirtualView` 不具备任何虚拟化能力。

## 虚拟化

当 `VirtualView` 离开 [`ScrollView`](scrollview) 的可见区域时，它会变为隐藏。当隐藏时，`VirtualView` 将缓存其最近的布局，并可能卸载其子组件——这个过程称为虚拟化。

当 `VirtualView` 返回 [`ScrollView`](scrollview) 的可见区域时，它会变为可见。当可见时，其子组件 _保证_ 会被渲染。此保证通过阻塞主线程渲染下一帧来维持，直到其子组件可以被渲染为止，否则会显示 `VirtualView`。

<img src="/docs/assets/d_virtualview_modes.svg" width="700" alt="VirtualView 模式和阈值的示意图。" />

:::note
在未来的发展中，隐藏的 `VirtualView` 可能会改为在 [`<Activity mode="hidden">`](https://react.dev/reference/react/Activity) 中渲染其子组件，以尽可能保留状态，同时平衡内存开销。
:::

### 阻塞主线程

这是 React Native 功能集中第一次出现渲染 React 组件可以阻塞主线程的情况。这是 [新架构](/architecture/landing-page) 启用的一项新功能！

阻塞主线程可以通过防止有时在使用像 [`FlatList`](flatlist) 这样的组件时发生的白屏闪烁，来提供更好的用户体验。它还可以通过使用主线程优先级来启用更好的性能，这通常也运行在更高性能的核心上。

然而，阻塞主线程也带有权衡。如果更新操作（例如挂载 `VirtualView` 的子组件）花费太长时间完成，现在可能会导致丢帧。丢失超过几帧会导致用户体验变差，使应用感觉卡顿且无响应。丢失太多帧可能会导致操作系统显示模态框指示应用无响应，甚至可能终止你的应用！

:::warning
DevTools 目前不支持在主线程上调试 JavaScript。这意味着如果你使用断点调试从 `onModeChange` 调用的代码（在主线程上执行），你的调试器可能会冻结。

调试所有其他部分的 JavaScript 代码应该按预期工作。我们正在努力在将 `VirtualView` 发布到 React Native 稳定渠道之前弥补这一差距。
:::

### 预渲染

`VirtualView` 使你能够通过更早渲染（在需要之前）来受益于主线程渲染，同时减轻丢帧的缺点。这称为“预渲染”。

默认情况下，每个 `VirtualView` 将在接近 [`ScrollView`](scrollview) 的可见区域时预渲染其子组件。当这种情况发生时，其子组件将在后台线程上以较低优先级渲染（使用 [transition](https://react.dev/reference/react/startTransition)）。这确保主线程和 React 可用于以更高优先级处理其他关键用户交互。

:::note
`VirtualView` 的预渲染逻辑目前不可配置。确定此内容的算法正在进行积极的设计迭代，很可能在未来版本中更改。
:::

---

## 属性

### `children`

在此 `VirtualView` 内渲染的内容。

| 类型                     |
| ------------------------ |
| [React Node](react-node) |

---

### `onModeChange`

当 `VirtualView` 更改其子组件的渲染方式时调用。

如果提供了回调，根据内部状态变更，它可能会从不同的线程和优先级被调用。这可以通过检查事件上的 `mode` 属性来检测：

- 如果 `mode` 是 [`VirtualViewMode.Visible`](#virtualviewmode)，则回调从主线程以即时优先级调用。
- 如果 `mode` 是 [`VirtualViewMode.Prerender`](#virtualviewmode) 或 [`VirtualViewMode.Hidden`](#virtualviewmode)，则回调从后台线程以过渡优先级调用。

回调永远不会连续使用相同的 `mode` 值调用。但是，关于事件顺序的保证很少。此外，即使子组件变得可见，如果子组件成功预渲染，回调也可能永远不会使用 [`VirtualViewMode.Visible`](#virtualviewmode) 调用。

| 类型                                               |
| -------------------------------------------------- |
| `md ([ModeChangeEvent](#modechangeevent)) => void` |

---

### `nativeID`

用于从原生类定位此视图的标识符。

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

提供给 [`onModeChange`](#onmodechange) 的参数。

| 类型   |
| ------ |
| object |

**属性：**

| 名称          | 类型                                | 描述                                                                                       |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| mode          | [VirtualViewMode](#virtualviewmode) | `VirtualView` 的新模式。                                                                    |
| target        | element                             | 发出此事件的 `VirtualView`。                                                                |
| targetRect    | [Rect](rect)                        | `target` 相对于最近的祖先 `ScrollView` 的布局。                                 |
| thresholdRect | [Rect](rect)                        | 触发此事件的阈值相对于最近的祖先 `ScrollView` 的布局。 |

:::note
例如，如果 `VirtualView` 进入 [`ScrollView`](scrollview) 的可见区域...

- `mode` 将是 [`VirtualViewMode.Visible`](#virtualviewmode)
- `thresholdRect` 将描述最近的祖先 [`ScrollView`](scrollview) 的可见视口
- `targetRect` 将是 `target` 与 `thresholdRect` 重叠的布局（即它位于 [`ScrollView`](scrollview) 的可见区域内）

:::

### `VirtualViewMode`

`VirtualView` 的可能模式。

| 名称      | 值  | 描述                                    |
| --------- | --- | --------------------------------------- |
| Visible   | `0` | 目标视图可见。                        |
| Prerender | `1` | 目标视图隐藏，但可以预渲染。 |
| Hidden    | `2` | 目标视图隐藏。                         |

---

## 静态方法

### `createHiddenVirtualView()`

```tsx
static createHiddenVirtualView(height: number): typeof VirtualView;
```

`VirtualView` 初始时将子组件渲染为可见，即使它最初被祖先 [`ScrollView`](scrollview) 遮挡。这是因为当组件初始渲染时，祖先 [`ScrollView`](scrollview) 的存在——更不用说其大小和滚动位置——是未知的。

对于高级用例，`createHiddenVirtualView()` 创建一个组件，渲染一个初始隐藏的 `VirtualView`，并使用提供的估计布局。

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
| ----------------------------------------------------------- | ------ | ---------------------------------------------- |
| height <div className="label basic required">必需</div> | number | 初始渲染 `VirtualView` 的估计高度。 |
