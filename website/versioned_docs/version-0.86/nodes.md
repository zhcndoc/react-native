---
id: nodes
title: 来自 refs 的节点
---

React Native 应用会渲染一个原生视图树来表示 UI，类似于 React DOM 在 Web 上的工作方式（DOM 树）。React Native 通过 [refs](https://react.dev/learn/manipulating-the-dom-with-refs) 提供对这棵树的命令式访问，这些 refs 会由所有原生组件返回（包括由内置组件如 [`View`](/docs/next/view) 渲染的组件）。

React Native 提供 3 种类型的节点：

- [元素](/docs/next/element-nodes)：元素节点表示原生视图树中的原生组件（类似于 Web 上的 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 节点）。它们通过 refs 由所有原生组件提供。
- [文本](/docs/next/text-nodes)：文本节点表示树上的原始文本内容（类似于 Web 上的 [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text) 节点）。它们不能通过 `refs` 直接访问，但可以通过元素 refs 上的方法（如 [`childNodes`](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)）访问。
- [文档](/docs/next/document-nodes)：文档节点表示一个完整的原生视图树（类似于 Web 上的 [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) 节点）。和文本节点一样，它们只能通过其他节点访问，使用诸如 [`ownerDocument`](https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument) 之类的属性。

和在 Web 上一样，这些节点可用于遍历渲染后的 UI 树、访问布局信息，或执行诸如 `focus` 之类的命令式操作。

:::info
**与 Web 不同，这些节点不允许修改**（例如：[`node.appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)），因为树的内容完全由 React 渲染器管理。
:::
