---
id: nodes
title: 来自 refs 的节点
---

React Native 应用渲染一个表示 UI 的原生视图树，类似于 React DOM 在 Web 上渲染的 DOM 树。React Native 通过 [refs](https://react.dev/learn/manipulating-the-dom-with-refs) 提供对该树的命令式访问，所有原生组件（包括内置组件如 [`View`](/docs/next/view) 渲染的组件）都会返回 refs。

React Native 提供 3 种类型的节点：

- [元素](/docs/next/element-nodes)：元素节点表示原生视图树中的原生组件（类似 Web 上的 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 节点）。它们通过 refs 由所有原生组件提供。
- [文本](/docs/next/text-nodes)：文本节点表示树上的原始文本内容（类似 Web 上的 [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text) 节点）。它们不能通过 `refs` 直接访问，但可以通过元素 refs 上的类似 [`childNodes`](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes) 的方法访问。
- [文档](/docs/next/document-nodes)：文档节点表示完整的原生视图树（类似 Web 上的 [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) 节点）。和文本节点一样，它们只能通过其他节点访问，使用类似 [`ownerDocument`](https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument) 的属性。

与 Web 上类似，这些节点可以用来遍历已渲染的 UI 树，访问布局信息或执行诸如 `focus` 之类的命令式操作。

:::info
**与 Web 不同，这些节点不允许变更**（例如：[`node.appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)），因为树的内容完全由 React 渲染器管理。
:::