---
id: fast-refresh
title: Fast Refresh
---

Fast Refresh 是 React Native 的一项功能，可以让你近乎即时地看到 React 组件更改后的反馈。Fast Refresh 默认启用，你可以在 [React Native 开发菜单](/docs/debugging#accessing-the-in-app-developer-menu)中切换“启用 Fast Refresh”。启用 Fast Refresh 后，大多数编辑应该会在一两秒内显示出来。

## 工作原理

- 如果你编辑的模块**只导出 React 组件**，Fast Refresh 将只更新该模块的代码，并重新渲染你的组件。你可以编辑该文件中的任何内容，包括样式、渲染逻辑、事件处理函数或副作用。
- 如果你编辑的模块包含*不是* React 组件的导出内容，Fast Refresh 将重新运行该模块，以及导入它的其他模块。因此，如果 `Button.js` 和 `Modal.js` 都导入了 `Theme.js`，编辑 `Theme.js` 将会更新这两个组件。
- 最后，如果你**编辑的文件**被 **React 树之外的模块**导入，Fast Refresh **将退回执行完整重新加载**。你可能有一个用于渲染 React 组件的文件，同时还导出一个被**非 React 组件**导入的值。例如，你的组件可能还导出了一个常量，而某个非 React 工具模块导入了它。在这种情况下，可以考虑将该常量迁移到单独的文件中，然后在两个文件中都导入它。这样就能重新启用 Fast Refresh。其他情况通常也可以用类似的方式解决。

## 错误恢复能力

如果你在 Fast Refresh 会话期间出现**语法错误**，可以修复错误后再次保存文件。红屏将会消失。包含语法错误的模块会被阻止运行，因此你无需重新加载应用。

如果你在**模块初始化期间出现运行时错误**（例如，将 `StyleSheet.create` 错误地写成了 `Style.create`），修复错误后 Fast Refresh 会话将继续。红屏将会消失，并且模块将被更新。

如果你犯了一个导致**组件内部出现运行时错误**的错误，修复错误后 Fast Refresh 会话*也*会继续。在这种情况下，React 将使用更新后的代码重新挂载你的应用。

如果你的应用中有[错误边界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)（这对于在生产环境中优雅地处理失败是个好主意），它们会在红屏后下一次编辑时重试渲染。从这个角度来说，拥有错误边界可以避免你总是被踢回根应用屏幕。不过请注意，错误边界不应该过于细粒度。React 在生产环境中会使用它们，因此应该始终经过有意识的设计。

## 限制

Fast Refresh 会尝试保留你正在编辑的组件中的本地 React 状态，但只有在这样做安全的情况下才会保留。以下是一些你可能会看到每次编辑文件时本地状态都被重置的原因：

- 类组件不会保留本地状态（只有函数组件和 Hooks 会保留状态）。
- 你正在编辑的模块除了 React 组件之外，可能还有*其他*导出内容。
- 有时，模块会导出调用高阶组件（如 `createNavigationContainer(MyScreen)`）后的结果。如果返回的组件是类，状态将被重置。

从长远来看，随着越来越多的代码库迁移到函数组件和 Hooks，你可以期待在更多情况下保留状态。

## 提示

- Fast Refresh 默认会保留函数组件（以及 Hooks）中的 React 本地状态。
- 有时你可能希望*强制*重置状态，并重新挂载组件。例如，如果你正在调整一个只在挂载时发生的动画，这会很有用。为此，你可以在正在编辑的文件中的任意位置添加 `// @refresh reset`。此指令仅作用于该文件，并指示 Fast Refresh 在每次编辑时重新挂载该文件中定义的组件。

## Fast Refresh 与 Hooks

在可能的情况下，Fast Refresh 会尝试保留组件在编辑前后的状态。具体来说，只要你不更改参数或 Hook 调用的顺序，`useState` 和 `useRef` 就会保留之前的值。

带有依赖项的 Hooks——例如 `useEffect`、`useMemo` 和 `useCallback`——在 Fast Refresh 期间将*始终*更新。Fast Refresh 运行期间会忽略它们的依赖项列表。

例如，当你将 `useMemo(() => x * 2, [x])` 编辑为 `useMemo(() => x * 10, [x])` 时，它将重新运行，即使 `x`（依赖项）没有改变。如果 React 不这样做，你的编辑就不会反映在屏幕上！

有时，这可能会导致意外结果。例如，即使依赖项为空数组的 `useEffect`，也仍然会在 Fast Refresh 期间重新运行一次。不过，即使没有 Fast Refresh，编写能够适应 `useEffect` 偶尔重新运行的代码也是一种良好实践。这样也更容易让你之后向其中引入新的依赖项。
