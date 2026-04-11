---
id: nodes
title: 来自 ref 的节点
---

React Native 应用渲染一个代表 UI 的原生视图树，类似于 React DOM 在 Web 上的做法（DOM 树）。React Native 通过 [ref](https://react.dev/learn/manipulating-the-dom-with-refs) 提供对该树的命令式访问，这些 ref 由所有原生组件返回（包括由内置组件如 [`View`](/docs/next/view) 渲染的组件）。

React Native 提供 3 种类型的节点：

- [元素](/docs/next/element-nodes)：元素节点代表原生视图树中的原生组件（类似于 Web 上的 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 节点）。它们由所有原生组件通过 ref 提供。
- [文本](/docs/next/text-nodes)：文本节点代表树上的原始文本内容（类似于 Web 上的 [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text) 节点）。它们无法通过 `ref` 直接访问，但可以使用元素 ref 上的 [`childNodes`](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes) 等方法访问。
- [文档](/docs/next/document-nodes)：文档节点代表一个完整的原生视图树（类似于 Web 上的 [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) 节点）。像文本节点一样，它们只能通过其他节点访问，使用诸如 [`ownerDocument`](https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument) 之类的属性。

与 Web 上一样，这些节点可用于遍历渲染后的 UI 树、访问布局信息或执行命令式操作（如 `focus`）。

:::info
**与 Web 不同，这些节点不允许突变**（例如：[`node.appendChild`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)），因为树内容完全由 React 渲染器管理。
:::
