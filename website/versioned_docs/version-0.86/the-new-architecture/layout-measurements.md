# 测量布局

有时候，你需要测量当前布局，以便对整体布局应用一些更改，或者做出决策并调用某些特定逻辑。

React Native 提供了一些原生方法来了解视图的测量值。

调用这些方法的最佳方式是在 `useLayoutEffect` 钩子中：这样可以获得这些测量值的最新结果，并且在测量完成后的同一帧内应用更改。

典型代码如下：

```tsx
function AComponent(children) {
  const targetRef = React.useRef(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // 使用这些测量值做些事情
    });
  }, [ /* 在这里添加依赖项 */]);

  return (
    <View ref={targetRef}>
     {children}
    <View />
  );
}
```

:::note
这里描述的方法可用于 React Native 提供的大多数默认组件。不过，它们对没有直接由原生视图支持的组合组件是 _不可用的_。这通常包括你在自己应用中定义的大多数组件。
:::

## measure(callback)

确定给定视图在屏幕上的位置（`x` 和 `y`）、`width` 和 `height`，并通过异步回调返回这些值。如果成功，回调将使用以下参数调用：

- `x`：已测量视图在视口中的原点（左上角）的 `x` 坐标。
- `y`：已测量视图在视口中的原点（左上角）的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
- `pageX`：视图在视口中的 `x` 坐标（通常是整个屏幕）。
- `pageY`：视图在视口中的 `y` 坐标（通常是整个屏幕）。

此外，`measure()` 返回的 `width` 和 `height` 也是组件在视口中的 `width` 和 `height`。

## measureInWindow(callback)

确定给定视图在窗口中的位置（`x` 和 `y`），并通过异步回调返回这些值。如果 React 根视图嵌入在另一个原生视图中，这将为你提供绝对坐标。如果成功，回调将使用以下参数调用：

- `x`：当前窗口中视图的 `x` 坐标。
- `y`：当前窗口中视图的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
