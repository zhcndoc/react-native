---
id: view-flattening
title: 视图扁平化
---

import FabricWarning from './\_fabric-warning.mdx';

<FabricWarning />

#### 视图扁平化是 React Native 渲染器的一种优化，旨在避免深层布局树。

React API 设计为声明式且通过组合实现可重用。这为直观开发提供了良好的模型。然而，在实现过程中，该 API 的这些特性导致创建了深层的 [React 元素树](architecture-glossary.md#react-element-tree-and-react-element)，其中绝大多数 React 元素节点仅影响视图的布局，而不在屏幕上渲染任何内容。我们称这类节点为**“仅布局”**节点。

从概念上讲，React 元素树中的每个节点与屏幕上的一个视图有 1:1 的关系，因此渲染一个由大量“仅布局”节点组成的深层 React 元素树会导致渲染性能降低。

以下是一个受“仅布局”视图代价影响的常见用例。

假设你想渲染一张图片和一个由 `TitleComponent` 处理的标题，并且你将此组件作为带有一些 margin 样式的 `ContainerComponent` 的子组件。在分解组件后，React 代码如下：

```jsx
function MyComponent() {
  return (
    <View>                          // ReactAppComponent
      <View style={{margin: 10}} /> // ContainerComponent
        <View style={{margin: 10}}> // TitleComponent
          <Image {...} />
          <Text {...}>这是一个标题</Text>
        </View>
      </View>
    </View>
  );
}
```

作为渲染过程的一部分，React Native 会生成如下树：

![Diagram one](/docs/assets/Architecture/view-flattening/diagram-one.png)

注意，视图（2）和（3）是“仅布局”视图，因为它们在屏幕上渲染，但仅仅在其子视图之上渲染了一个 `10 px` 的 `margin`。

为了提升此类 React 元素树的性能，渲染器实现了视图扁平化机制，将这类节点合并或扁平化，减少在屏幕上渲染的[宿主视图](architecture-glossary.md#host-view-tree-and-host-view)层级的深度。该算法会考虑诸如 `margin`、`padding`、`backgroundColor`、`opacity` 等属性。

视图扁平化算法作为渲染器差异计算阶段的内建部分，这意味着不需要额外的 CPU 资源来优化此类视图的 React 元素树扁平化。与核心部分一样，视图扁平化算法用 C++ 实现，并且其优势默认应用于所有支持的平台。

针对之前的示例，视图（2）和（3）会作为“差异算法”的一部分被扁平化，结果它们的样式将合并到视图（1）中：

![Diagram two](/docs/assets/Architecture/view-flattening/diagram-two.png)

需要注意的是，这项优化让渲染器避免了创建并渲染两个宿主视图。从用户角度来看，屏幕上没有任何可见变化。