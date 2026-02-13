---
id: render-pipeline
title: 渲染、提交与挂载
---

import FabricWarning from './\_fabric-warning.mdx';

<FabricWarning />

React Native 渲染器会经历一系列工作，将 React 逻辑渲染到[宿主平台](architecture-glossary.md#host-platform)。这系列工作被称为渲染管线（render pipeline），会在初始渲染和 UI 状态更新时进行。本文档介绍了渲染管线以及它在不同场景下的差异。

渲染管线可分为三个一般阶段：

1. **渲染（Render）：** React 执行产品逻辑，在 JavaScript 中创建[React 元素树](architecture-glossary.md#react-element-tree-and-react-element)。渲染器基于此树，在 C++ 中创建[React 影子树](architecture-glossary.md#react-shadow-tree-and-react-shadow-node)。
2. **提交（Commit）：** React 影子树创建完毕后，渲染器触发提交。该操作**升级**React 元素树和新创建的 React 影子树为即将“挂载的下一棵树”，并安排其布局信息的计算。
3. **挂载（Mount）：** React 影子树在完成布局计算后，被转换成[宿主视图树](architecture-glossary.md#host-view-tree-and-host-view)。

> 渲染管线的各阶段可能在不同线程上执行。详情请参见[线程模型](threading-model)文档。

![React Native 渲染器数据流](/docs/assets/Architecture/renderer-pipeline/data-flow.jpg)

---

## 初始渲染

假设你想渲染以下内容：

```jsx
function MyComponent() {
  return (
    <View>
      <Text>Hello, World</Text>
    </View>
  );
}

// <MyComponent />
```

在上面示例中，`<MyComponent />` 是一个[React 元素](architecture-glossary.md#react-element-tree-and-react-element)。React 递归调用该元素（或如果使用 JavaScript 类实现，则调用其 `render` 方法），直到所有元素都被减少为终端的[React 宿主组件](architecture-glossary.md#react-host-components-or-host-components)。最终得到一个由 [React 宿主组件](architecture-glossary.md#react-host-components-or-host-components) 组成的_React 元素树_。

### 阶段 1. 渲染

![阶段一：渲染](/docs/assets/Architecture/renderer-pipeline/phase-one-render.png)

在元素递归处理过程中，每当调用一个 _React 元素_，渲染器会同步创建一个[React 影子节点](architecture-glossary.md#react-shadow-tree-and-react-shadow-node)。此操作仅针对 _React 宿主组件_，不会为[React 组合组件](architecture-glossary.md#react-composite-components) 创建。以上例中，`<View>` 生成一个 `ViewShadowNode` 对象，`<Text>` 生成一个 `TextShadowNode` 对象。值得注意的是，没有任何 React 影子节点会直接对应 `<MyComponent>`。

每当 React 创建两个 _React 元素节点_ 之间的父子关系，渲染器会在对应的 _React 影子节点_ 之间创建同样的关系。这样便组装成了 _React 影子树_。

**更多细节**

- 这些操作（创建 _React 影子节点_，创建两节点间的父子节点关系）是同步且线程安全的，从 React（JavaScript）执行到渲染器（C++），通常在 JavaScript 线程上。
- _React 元素树_（以及其构成的元素节点）并非永久存在。它是由 React 的 “fiber” 机制临时实现的表示。代表宿主组件的每个 “fiber” 会存储一个指向 _React 影子节点_ 的 C++ 指针，这由 JSI 技术实现。[详细了解 “fiber” 机制请见此文档。](https://github.com/acdlite/react-fiber-architecture#what-is-a-fiber)
- _React 影子树_ 是不可变的。要更新任何 _React 影子节点_，渲染器必须创建新的一棵 _React 影子树_。不过渲染器提供克隆操作，来提升状态更新性能（详见[React 状态更新](render-pipeline#react-state-updates)）。

上述示例中，渲染阶段完成后的结构如下：

![步骤一](/docs/assets/Architecture/renderer-pipeline/render-pipeline-1.png)

_React 影子树_ 完成后，渲染器触发 _React 元素树_ 的提交。

### 阶段 2. 提交

![阶段二：提交](/docs/assets/Architecture/renderer-pipeline/phase-two-commit.png)

提交阶段包含两个操作：_布局计算_ 和 _树升级_。

- **布局计算：** 计算每个 _React 影子节点_ 的位置和大小。在 React Native 中，这一步调用 Yoga 来完成布局计算。具体需要每个节点的样式信息，这些样式源于 JavaScript 中的 _React 元素_。它还需要 _React 影子树_ 根节点的布局约束——决定了子节点可用空间大小。

![步骤二](/docs/assets/Architecture/renderer-pipeline/render-pipeline-2.png)

- **树升级（新树 → 下一棵树）：** 将新的 _React 影子树_ 升级为即将挂载的“下一棵树”。这表示新树已具备所有挂载所需信息，且表示最新的 _React 元素树_ 状态。“下一棵树”将在 UI 线程的下一个时刻挂载。

**更多细节**

- 这些操作异步在后台线程上执行。
- 绝大多数布局计算完全在 C++ 内完成，但部分组件布局依赖于[宿主平台]（如 `Text`、`TextInput` 等）。文本的大小和位置因平台而异，需在宿主平台层计算。Yoga 会调用宿主平台定义的函数计算这些组件的布局。

### 阶段 3. 挂载

![阶段三：挂载](/docs/assets/Architecture/renderer-pipeline/phase-three-mount.png)

挂载阶段将包含布局数据的 _React 影子树_ 转换成带有渲染像素显示在屏幕上的 _宿主视图树_。回顾一下，_React 元素树_ 是这样的：

```jsx
<View>
  <Text>Hello, World</Text>
</View>
```

高层次上，React Native 渲染器会为每个 _React 影子节点_ 创建一个对应的[宿主视图](architecture-glossary.md#host-view-tree-and-host-view)，并将其挂载到屏幕。例如上述示例中，渲染器为 `<View>` 创建一个 `android.view.ViewGroup` 实例，为 `<Text>` 创建一个 `android.widget.TextView`，并设置文本为 “Hello World”。iOS 则会创建 `UIView` 并通过 `NSLayoutManager` 设置文本内容。每个宿主视图根据其 React 影子节点的属性配置，并用计算好的布局信息设置尺寸和位置。

![步骤二](/docs/assets/Architecture/renderer-pipeline/render-pipeline-3.png)

挂载阶段包含以下三个步骤：

- **树差异计算（Tree Diffing）：** 这一步在完全的 C++ 内部计算“前一棵已渲染树”和“下一棵树”之间的差异，结果是对宿主视图需要执行的原子变更操作列表（如 `createView`、`updateView`、`removeView`、`deleteView` 等）。这一步还负责将 React 影子树扁平化，避免创建不必要的宿主视图。详细算法见[视图扁平化](view-flattening)。
- **树升级（下一棵树 → 已渲染树）：** 原子地将“下一棵树”升级为“前一棵已渲染树”，以使下一轮挂载正确计算差异。
- **视图挂载（View Mounting）：** 将这些原子变更操作应用到对应宿主视图。此操作在宿主平台的 UI 线程上执行。

**更多细节**

- 这些操作在 UI 线程同步执行。如果提交阶段在后台线程执行，挂载阶段会排期到 UI 线程的下一个时刻执行；反之如果提交阶段在 UI 线程执行，则挂载阶段也同步在该线程执行。
- 挂载阶段的调度、实现和执行高度依赖宿主平台，例如当前 Android 和 iOS 的挂载架构存在差异。
- 初始渲染时，“前一已渲染树”为空，因此树差异计算步骤生成的变更操作仅包括创建视图、设置属性和层级添加；树差异计算在处理[React 状态更新](#react-state-updates)时对性能更为关键。
- 目前生产环境测试中，一棵 _React 影子树_ 通常包括约 600–1000 个节点（视图扁平化前），经扁平化后降至约 200 个节点。在 iPad 或桌面应用中，节点数可能成倍增长。

---

## React 状态更新

让我们来看看在 _React 元素树_ 状态更新时，渲染管线各阶段的工作流程。假设你已经完成了以下组件的初次渲染：

```jsx
function MyComponent() {
  return (
    <View>
      <View
        style={{backgroundColor: 'red', height: 20, width: 20}}
      />
      <View
        style={{backgroundColor: 'blue', height: 20, width: 20}}
      />
    </View>
  );
}
```

依照[初始渲染](#initial-render)步骤，生成的树如下：

![渲染管线 4](/docs/assets/Architecture/renderer-pipeline/render-pipeline-4.png)

注意，**节点 3** 对应一个背景为 **红色** 的宿主视图，**节点 4** 对应背景为 **蓝色** 的视图。假设某次状态更新中，第一个嵌套的 `<View>` 的背景色从 `'red'` 变成 `'yellow'`。此时新的 _React 元素树_ 是：

```jsx
<View>
  <View
    style={{backgroundColor: 'yellow', height: 20, width: 20}}
  />
  <View
    style={{backgroundColor: 'blue', height: 20, width: 20}}
  />
</View>
```

**React Native 会如何处理此更新？**

为了更新已经挂载的宿主视图，渲染器需要概念性地更新 _React 元素树_。但为了线程安全，_React 元素树_ 和 _React 影子树_ 都必须是不可变的。这意味着 React 并不会变更现有两棵树，而是必须创建新副本，并带入更新后的属性、样式和子元素。

接下来，让我们看状态更新时，渲染管线的各阶段流程。

### 阶段 1. 渲染

![阶段一：渲染](/docs/assets/Architecture/renderer-pipeline/phase-one-render.png)

当 React 创建包含新状态的 _React 元素树_ 时，会克隆所有受更新影响的 _React 元素_ 和 _React 影子节点_。完成克隆后，新的 _React 影子树_ 会被提交。

React Native 渲染器利用结构共享以减少不可变实现的性能开销。克隆一个 _React 元素_ 并应用新状态时，从此节点向根节点路径上的所有节点都会被克隆。**只有需要更新其属性、样式或子元素的 React 元素才会被克隆。那些未受状态更新影响的元素会被旧树和新树共享。**

以上例中，React 执行以下操作创建新的树：

1. CloneNode(**节点 3**，`{backgroundColor: 'yellow'}`) → **节点 3'**
2. CloneNode(**节点 2**) → **节点 2'**
3. AppendChild(**节点 2'**, **节点 3'**)
4. AppendChild(**节点 2'**, **节点 4**)
5. CloneNode(**节点 1**) → **节点 1'**
6. AppendChild(**节点 1'**, **节点 2'**)

操作完成后，**节点 1'** 代表新 _React 元素树_ 根节点。将**T**指定为“已渲染树”，**T'** 作为“新树”：

![渲染管线 5](/docs/assets/Architecture/renderer-pipeline/render-pipeline-5.png)

你可以看到 **T** 和 **T'** 都共享 **节点 4**。结构共享提升性能并减少内存使用。

### 阶段 2. 提交

![阶段二：提交](/docs/assets/Architecture/renderer-pipeline/phase-two-commit.png)

React 创建新 _React 元素树_ 和 _React 影子树_ 后，需提交它们。

- **布局计算：** 操作与[初始渲染](#initial-render)阶段布局计算相似。不同的是，共享的 _React 影子节点_ 可能会被克隆，因为其父节点的布局变化可能会导致共享节点的布局也需更新。
- **树升级（新树 → 下一棵树）：** 与[初始渲染](#initial-render)阶段的树升级相同。

### 阶段 3. 挂载

![阶段三：挂载](/docs/assets/Architecture/renderer-pipeline/phase-three-mount.png)

- **树升级（下一棵树 → 已渲染树）**：将“下一棵树”原子地升级为“已渲染树”，以便后续挂载阶段对正确树进行差异计算。
- **树差异计算**：计算“已渲染树”**T** 和“下一棵树”**T'**的差异，产生应用于宿主视图的原子变更操作列表。
  - 以上示例操作为：`UpdateView(**节点 3**, {backgroundColor: 'yellow'})`
  - 差异计算可以用于任意已挂载树与任意新的树，渲染器可跳过某些中间版本。
- **视图挂载**：将这些变更应用至对应宿主视图。示例中仅更新 **视图 3** 的 `backgroundColor` 为黄色。

![渲染管线 6](/docs/assets/Architecture/renderer-pipeline/render-pipeline-6.png)

---

## React Native 渲染器状态更新

对于 _影子树_ 中的大部分信息，React 是唯一拥有者，也是唯一可信来源。所有数据来源于 React，数据流单向。

然而，有一个例外和重要机制：C++ 中的组件可持有不直接暴露给 JavaScript 的状态，且 JavaScript 非其可信来源。此类 _C++ 状态_ 由 C++ 和[宿主平台]控制。一般只有当你开发复杂的 _宿主组件_ 且需要 _C++ 状态_ 时才相关。绝大多数 _宿主组件_ 不需此功能。

例如，`ScrollView` 利用此机制让渲染器知晓当前偏移量。更新由宿主平台层触发，具体来自表示该 `ScrollView` 组件的宿主视图。偏移量信息用于类似 [measure](https://reactnative.dev/docs/direct-manipulation#measurecallback) 的 API。因该更新源自宿主平台，且不影响 React 元素树，故其状态数据保存在 _C++ 状态_ 中。

概念上，_C++ 状态_ 更新类似于上文描述的[React 状态更新](render-pipeline#react-state-updates)，但有两点重要区别：

1. 跳过“渲染阶段”，因 React 不参与该过程。
2. 更新可发生在任何线程，包括主线程。

### 阶段 2. 提交

![阶段二：提交](/docs/assets/Architecture/renderer-pipeline/phase-two-commit.png)

执行 _C++ 状态_ 更新时，某段代码请求将 `ShadowNode` (**N**) 的 _C++ 状态_ 设置为值 **S**。React Native 渲染器会反复尝试获取 **N** 的最新已提交版本，克隆它并设置新状态 **S**，再提交新的 **N'** 到树中。如果 React 或其他 _C++ 状态_ 更新期间另行提交，当前 _C++ 状态_ 提交会失败，渲染器将反复重试直到成功提交。此机制避免了数据源冲突和竞态条件。

### 阶段 3. 挂载

![阶段三：挂载](/docs/assets/Architecture/renderer-pipeline/phase-three-mount.png)

此处的挂载阶段基本等同于[React 状态更新](#react-state-updates)的挂载阶段。渲染器依然需要重新计算布局、执行树差异计算等。详情见上文相关章节。