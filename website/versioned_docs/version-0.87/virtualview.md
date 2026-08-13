---
id: virtualview
title: VirtualView 🧪
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

<ExperimentalAPIWarning />

`VirtualView` 是一个行为类似于 [`View`](view) 的核心组件。

当它是 [`ScrollView`](scrollview) 的后代时，它会获得额外的虚拟化能力，以减少被滚动视口遮挡时的内存占用。

```tsx
<ScrollView>
  <VirtualView>
    <Text>Hello world!</Text>
  </VirtualView>
</ScrollView>
```

没有祖先 [`ScrollView`](scrollview) 的 `VirtualView` 不具备任何虚拟化能力。

## 虚拟化

当 `VirtualView` 离开 [`ScrollView`](scrollview) 的可见区域时，它会变为隐藏状态。隐藏时，`VirtualView` 会缓存其最近的布局，并可能卸载其子元素——这一过程称为虚拟化。

当 `VirtualView` 返回 [`ScrollView`](scrollview) 的可见区域时，它会变为可见状态。可见时，其子元素将**保证**被渲染。此保证通过阻止主线程渲染会显示 `VirtualView` 的下一帧来实现，直到其子元素可以被渲染为止。

<img src="/docs/assets/d_virtualview_modes.svg" width="700" alt="VirtualView 模式和阈值示意图" />

:::note
在未来的开发中，隐藏的 `VirtualView` 可能会改为在 [`<Activity mode="hidden">`](https://react.dev/reference/react/Activity) 中渲染其子元素，以在平衡内存开销的同时尽可能长时间地保留状态。
:::

### 阻塞主线程

这是 React Native 功能集中首次出现渲染 React 组件可以阻塞主线程的情况。这是由[新架构](/architecture/landing-page)启用的新能力！

阻塞主线程可以通过防止使用 [`FlatList`](flatlist) 等组件时有时会出现的空白帧闪烁，来提供更好的用户体验。它还可以通过使用主线程优先级来实现更好的性能，而主线程通常也会在性能更高的核心上运行。

但是，阻塞主线程也会带来一些权衡。如果某个更新操作（例如挂载 `VirtualView` 的子元素）耗时过长，现在就可能导致丢帧。丢失超过几帧可能会让应用感觉卡顿且无响应，从而导致更糟糕的用户体验。丢失过多帧可能会使操作系统显示一个模态框，表示应用无响应，甚至可能终止你的应用！

:::warning
DevTools 目前不支持在主线程上调试 JavaScript。这意味着，如果你使用断点调试由 `onModeChange` 调用的代码，而该代码在主线程上执行，你的调试器可能会冻结。

调试 JavaScript 代码的其他部分应该可以按预期工作。我们正在努力在将 `VirtualView` 发布到 React Native 的稳定渠道之前解决这一差距。
:::

### 预渲染

`VirtualView` 让你可以从主线程渲染中获益，同时通过在需要之前更早地进行渲染来减轻丢帧带来的缺点。这称为“预渲染”。

默认情况下，每个 `VirtualView` 会在接近 [`ScrollView`](scrollview) 的可见区域时预渲染其子元素。发生这种情况时，其子元素会以较低优先级在后台线程上渲染（使用一个[过渡](https://react.dev/reference/react/startTransition)）。这确保主线程和 React 可以以更高优先级处理其他关键的用户交互。

:::note
`VirtualView` 的预渲染逻辑目前不可配置。用于确定预渲染时机的算法正在积极进行设计迭代，并且很可能会在未来版本中发生变化。
:::

---

## Props

### `children`

要在此 `VirtualView` 内部渲染的内容。

| 类型                     |
| ------------------------ |
| [React Node](react-node) |

---

### `onModeChange`

当 `VirtualView` 改变渲染其子元素的方式时调用。

如果提供了回调，根据内部状态变化的不同，该回调可能会在不同线程和不同优先级下调用。可以通过检查事件上的 `mode` 属性来判断：

- 如果 `mode` 是 [`VirtualViewMode.Visible`](#virtualviewmode)，则回调会以即时优先级在主线程上调用
- 如果 `mode` 是 [`VirtualViewMode.Prerender`](#virtualviewmode) 或 [`VirtualViewMode.Hidden`](#virtualviewmode)，则回调会以过渡优先级在后台线程上调用

回调不会连续以相同的 `mode` 值调用。但是，对于事件的顺序几乎没有保证。此外，即使它变为可见，如果子元素已成功预渲染，回调也可能永远不会以 [`VirtualViewMode.Visible`](#virtualviewmode) 调用。

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

| 名称          | 类型                                | 描述                                                 |
| ------------- | ----------------------------------- | ---------------------------------------------------- |
| mode          | [VirtualViewMode](#virtualviewmode) | `VirtualView` 的新模式。                             |
| target        | element                             | 触发此事件的 `VirtualView`。                         |
| targetRect    | [Rect](rect)                        | `target` 相对于最近祖先 `ScrollView` 的布局。        |
| thresholdRect | [Rect](rect)                        | 触发此事件的阈值相对于最近祖先 `ScrollView` 的布局。 |

:::note
例如，如果一个 `VirtualView` 进入 [`ScrollView`](scrollview) 的可见区域……

- `mode` 将是 [`VirtualViewMode.Visible`](#virtualviewmode)
- `thresholdRect` 将描述最近祖先 [`ScrollView`](scrollview) 的可见视口
- `targetRect` 将是与 `thresholdRect` 重叠的 `target` 布局（即，它位于 [`ScrollView`](scrollview) 的可见区域内）

:::

### `VirtualViewMode`

`VirtualView` 的可能模式。

| 名称      | 值  | 描述                             |
| --------- | --- | -------------------------------- |
| Visible   | `0` | 目标视图可见。                   |
| Prerender | `1` | 目标视图隐藏，但可以进行预渲染。 |
| Hidden    | `2` | 目标视图隐藏。                   |

---

## 静态方法

### `createHiddenVirtualView()`

```tsx
static createHiddenVirtualView(height: number): typeof VirtualView;
```

`VirtualView` 最初会将其子元素渲染为可见状态，即使它最初被祖先 [`ScrollView`](scrollview) 遮挡。这是因为组件最初渲染时，祖先 [`ScrollView`](scrollview) 是否存在——更不用说其大小和滚动位置——都是未知的。

对于高级用例，`createHiddenVirtualView()` 会创建一个组件，该组件使用提供的估算布局来渲染最初处于隐藏状态的 `VirtualView`。

```tsx
const HiddenVirtualView = createHiddenVirtualView(100);

<ScrollView>
  <HiddenVirtualView>
    <Text>Hello world!</Text>
  </HiddenVirtualView>
</ScrollView>;
```

**参数：**

| 名称                                                        | 类型   | 描述                                |
| ----------------------------------------------------------- | ------ | ----------------------------------- |
| height <div className="label basic required">Required</div> | number | 初始渲染 `VirtualView` 的估算高度。 |
