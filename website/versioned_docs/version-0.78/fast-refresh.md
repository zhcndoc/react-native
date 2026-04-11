---
id: fast-refresh
title: 快速刷新
---

Fast Refresh 是一项 React Native 功能，允许你对 React 组件的更改获得近乎即时的反馈。Fast Refresh 默认启用，你可以在 [React Native 开发菜单](/docs/debugging#accessing-the-in-app-developer-menu) 中切换“启用快速刷新”。启用 Fast Refresh 后，大多数编辑应在一两秒内可见。

## 工作原理

- 如果你编辑一个**仅导出 React 组件**的模块，Fast Refresh 将仅更新该模块的代码，并重新渲染你的组件。你可以编辑该文件中的任何内容，包括样式、渲染逻辑、事件处理程序或效果。
- 如果你编辑一个导出内容_不是_ React 组件的模块，Fast Refresh 将重新运行该模块以及导入它的其他模块。所以如果 `Button.js` 和 `Modal.js` 都导入 `Theme.js`，编辑 `Theme.js` 将更新这两个组件。
- 最后，如果你**编辑了一个文件**，该文件**被 React 树之外的模块导入**，Fast Refresh **将回退到执行完全重载**。你可能有一个文件渲染了 React 组件，但也导出了一个被**非 React 组件**导入的值。例如，也许你的组件还导出了一个常量，并且一个非 React 工具模块导入了它。在这种情况下，考虑将常量迁移到单独的文件中，并将其导入到这两个文件中。这将重新启用 Fast Refresh 工作。其他情况通常可以用类似的方式解决。

## 错误恢复能力

如果你在 Fast Refresh 会话期间出现**语法错误**，你可以修复它并再次保存文件。红盒将消失。带有语法错误的模块会被阻止运行，因此你不需要重新加载应用。

如果你在**模块初始化期间出现运行时错误**（例如，输入 `Style.create` 而不是 `StyleSheet.create`），一旦你修复了错误，Fast Refresh 会话将继续。红盒将消失，模块将被更新。

如果你犯了一个导致**组件内部运行时错误**的错误，修复错误后，Fast Refresh 会话_也_将继续。在这种情况下，React 将使用更新后的代码重新挂载你的应用。

如果你的应用中有 [错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)（这是生产环境中优雅失败的好主意），它们将在红盒后的下一次编辑时重试渲染。从这个意义上说，拥有错误边界可以防止你总是被踢回根应用屏幕。但是，请记住错误边界不应该_太_细粒度。它们被 React 用于生产环境，应该始终有意设计。

## 局限性

Fast Refresh 尝试保留你正在编辑的组件中的本地 React 状态，但仅在安全的情况下这样做。以下是你可能看到每次编辑文件时本地状态被重置的几个原因：

- 类组件不保留本地状态（只有函数组件和 Hooks 保留状态）。
- 你正在编辑的模块除了 React 组件外可能还有_其他_导出。
- 有时，模块会导出调用高阶组件的结果，例如 `createNavigationContainer(MyScreen)`。如果返回的组件是类，状态将被重置。

长期来看，随着你的代码库更多地转向函数组件和 Hooks，你可以预期在更多情况下状态会被保留。

## 提示

- Fast Refresh 默认保留函数组件（和 Hooks）中的 React 本地状态。
- 有时你可能想要_强制_重置状态，并重新挂载组件。例如，如果你正在调整仅在挂载时发生的动画，这可能很方便。为此，你可以在正在编辑的文件中的任何位置添加 `// @refresh reset`。此指令仅限于该文件，并指示 Fast Refresh 在每次编辑时重新挂载该文件中定义的组件。

## Fast Refresh 和 Hooks

可能情况下，Fast Refresh 尝试在编辑之间保留组件的状态。特别是，`useState` 和 `useRef` 会保留其之前的值，只要你不变更改它们的参数或 Hook 调用的顺序。

带有依赖项的 Hooks——例如 `useEffect`、`useMemo` 和 `useCallback`——在 Fast Refresh 期间将_始终_更新。在 Fast Refresh 发生时，它们的依赖项列表将被忽略。

例如，当你将 `useMemo(() => x * 2, [x])` 编辑为 `useMemo(() => x * 10, [x])` 时，即使 `x`（依赖项）未更改，它也会重新运行。如果 React 不这样做，你的编辑将不会反映在屏幕上！

有时，这可能会导致意想不到的结果。例如，即使是带有空依赖项数组的 `useEffect` 在 Fast Refresh 期间仍然会重新运行一次。但是，即使没有 Fast Refresh，编写能够抵御 `useEffect` 偶尔重新运行的代码也是一个好习惯。这使得你以后更容易为其引入新的依赖项。
