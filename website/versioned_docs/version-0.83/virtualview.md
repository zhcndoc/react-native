---
id: virtualview
title: VirtualView 🧪
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

<ExperimentalAPIWarning />

`VirtualView` 是一个核心组件，其行为类似于 [`View`](view)。

当它是 [`ScrollView`](scrollview) 的子孙时，它将获得附加的虚拟化能力，以在被滚动视口遮挡时减少内存占用。

```tsx
<ScrollView>
  <VirtualView>
    <Text>Hello world!</Text>
  </VirtualView>
</ScrollView>
```

没有祖先 [`ScrollView`](scrollview) 的 `VirtualView` 不具备任何虚拟化能力。

## 虚拟化

当 `VirtualView` 离开 [`ScrollView`](scrollview) 的可见区域时，它会变为隐藏。当隐藏时，`VirtualView` 会缓存其最近一次的布局，并可能卸载其子组件——这个过程称为虚拟化。

当 `VirtualView` 返回到 [`ScrollView`](scrollview) 的可见区域时，它会变为可见。可见时，其子组件将被**保证**渲染。该保证是通过阻止主线程渲染会显示 `VirtualView` 的下一帧，直到其子组件能够被渲染来维护的。

<img src="/docs/assets/d_virtualview_modes.svg" width="700" alt="VirtualView 模式与阈值示意图。" />

:::note
在未来的开发中，隐藏的 `VirtualView` 也可能会在 [`<Activity mode="hidden">`](https://react.dev/reference/react/Activity) 中渲染其子组件，以尽可能长时间地保持状态，同时平衡内存开销。
:::

### 阻塞主线程

这是 React Native 功能集中首次允许渲染 React 组件阻塞主线程的能力。这是由 [新架构](/architecture/landing-page) 支持的新功能！

阻塞主线程可以通过防止使用类似 [`FlatList`](flatlist) 组件时偶尔出现的空白帧闪烁，提升用户体验。它还可以通过使用主线程优先级（通常运行于更高性能的核心）来提升性能。

然而，阻塞主线程也有权衡。如果更新操作（例如挂载 `VirtualView` 的子组件）耗时过长，可能会丢帧。丢失超过几帧会导致体验变差，使应用显得迟缓且无响应。严重丢帧可能导致操作系统弹出无响应的模态窗口，甚至终止应用！

:::warning
DevTools 目前不支持调试主线程上的 JavaScript。这意味着如果你在 `onModeChange` 中使用断点调试（它在主线程执行），调试器可能会冻结。

调试 JavaScript 其他部分应正常工作。我们正在努力在将 `VirtualView` 推向 React Native 稳定版本之前解决这一缺陷。
:::

### 预渲染

`VirtualView` 让你在享受主线程渲染带来的好处时，可以通过提前渲染来减轻丢帧的缺点。这称为“预渲染”。

默认情况下，当一个 `VirtualView` 接近 [`ScrollView`](scrollview) 的可见区域时，它会预渲染其子组件。此时，子组件会在后台线程以较低优先级（使用 [transition](https://react.dev/reference/react/startTransition)）渲染。这确保主线程和 React 可以以更高优先级处理其他关键用户交互。

:::note
`VirtualView` 的预渲染逻辑当前不可配置。确定该逻辑的算法正在积极设计中，未来版本可能会发生变化。
:::

---

## 属性

### `children`

在该 `VirtualView` 内渲染的内容。

| 类型                   |
| ---------------------- |
| [React 节点](react-node) |

---

### `onModeChange`

当 `VirtualView` 发生子组件渲染模式变化时调用。

如果提供了回调，调用线程和优先级可能因内部状态变化不同而异。可通过检查事件的 `mode` 属性来识别：

- 如果 `mode` 是 [`VirtualViewMode.Visible`](#virtualviewmode)，回调在主线程以立即优先级被调用。
- 如果 `mode` 是 [`VirtualViewMode.Prerender`](#virtualviewmode) 或 [`VirtualViewMode.Hidden`](#virtualviewmode)，回调在后台线程以过渡优先级被调用。

回调不会连续收到相同的 `mode` 值。但事件的顺序没有严格保证。如果子组件已成功预渲染，即使变为可见，回调也可能不会收到 [`VirtualViewMode.Visible`](#virtualviewmode)。

| 类型                                               |
| -------------------------------------------------- |
| `md ([ModeChangeEvent](#modechangeevent)) => void` |

---

### `nativeID`

用于在原生类中定位此视图的标识符。

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                     |
| ------------------------ |
| [视图样式](view-style-props) |

---

## 类型定义

### `ModeChangeEvent`

传递给 [`onModeChange`](#onmodechange) 的参数。

| 类型   |
| ------ |
| 对象   |

**属性：**

| 名称            | 类型                                | 描述                                                                                      |
| --------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| mode            | [VirtualViewMode](#virtualviewmode) | `VirtualView` 的新模式。                                                                   |
| target          | 元素                               | 发出此事件的 `VirtualView`。                                                              |
| targetRect      | [Rect](rect)                       | `target` 相对于最近的祖先 `ScrollView` 的布局。                                            |
| thresholdRect   | [Rect](rect)                       | 触发此事件的阈值区域相对于最近祖先 `ScrollView` 的布局。                                   |

:::note
例如，当 `VirtualView` 进入 [`ScrollView`](scrollview) 的可见区域时……

- `mode` 会是 [`VirtualViewMode.Visible`](#virtualviewmode)
- `thresholdRect` 描述最近祖先 [`ScrollView`](scrollview) 的可见视口
- `targetRect` 是 `target` 与 `thresholdRect` 重叠的布局（即在 [`ScrollView`](scrollview) 的可见区域内）

:::

### `VirtualViewMode`

`VirtualView` 的可能模式。

| 名称        | 值    | 描述                                         |
| ----------- | ----- | --------------------------------------------- |
| Visible     | `0`   | 目标视图可见。                                |
| Prerender   | `1`   | 目标视图隐藏，但可以预渲染。                   |
| Hidden      | `2`   | 目标视图隐藏。                                |

---

## 静态方法

### `createHiddenVirtualView()`

```tsx
static createHiddenVirtualView(height: number): typeof VirtualView;
```

`VirtualView` 初次渲染时会将子组件显示出来，即使它最初被祖先 [`ScrollView`](scrollview) 遮挡。这是因为组件初始渲染时，并不知道祖先 [`ScrollView`](scrollview) 是否存在——更不用说其大小和滚动位置。

对于高级用例，`createHiddenVirtualView()` 创建一个组件，该组件渲染一个具有给定估计布局的初始隐藏的 `VirtualView`。

```tsx
const HiddenVirtualView = createHiddenVirtualView(100);

<ScrollView>
  <HiddenVirtualView>
    <Text>Hello world!</Text>
  </HiddenVirtualView>
</ScrollView>;
```

**参数：**

| 名称                                                        | 类型   | 描述                                       |
| ----------------------------------------------------------- | ------ | ------------------------------------------ |
| height <div className="label basic required">必需</div>   | number | 初始渲染时 `VirtualView` 的估计高度。      |