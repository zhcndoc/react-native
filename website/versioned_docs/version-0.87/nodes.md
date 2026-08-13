---
id: nodes
title: 来自 refs 的节点
---

React Native 应用会渲染一个表示 UI 的原生视图树，这与 React DOM 在 Web 上的工作方式（DOM 树）类似。React Native 通过 [refs](https://react.dev/learn/manipulating-the-dom-with-refs) 提供对该树的命令式访问，所有原生组件都会返回 refs（包括由内置组件（如 [`View`](/docs/next/view)）渲染的组件）。

React Native 提供 3 种节点：

- [元素](/docs/next/element-nodes)：元素节点表示原生视图树中的原生组件（类似于 Web 上的 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 节点）。所有原生组件都会通过 refs 提供这些节点。
- [文本](/docs/next/text-nodes)：文本节点表示树中的原始文本内容（类似于 Web 上的 [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text) 节点）。它们无法通过 `refs` 直接访问，但可以使用元素 refs 上的 [`childNodes`](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes) 等方法进行访问。
- [文档](/docs/next/document-nodes)：文档节点表示完整的原生视图树（类似于 Web 上的 [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) 节点）。与文本节点一样，它们只能通过其他节点访问，例如使用 [`ownerDocument`](https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument) 等属性。

与 Web 一样，这些节点可用于遍历渲染的 UI 树、访问布局信息或执行 `focus` 等命令式操作。

:::info
**与 Web 不同，这些节点不允许进行变更**（例如：[`node.appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)），因为树的内容完全由 React 渲染器管理。
:::
