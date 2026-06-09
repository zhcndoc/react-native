# 测量布局

有时，你需要测量当前布局，以便对整体布局应用某些更改，或者做出决策并调用某些特定逻辑。

React Native 提供了一些原生方法，用于获取视图的测量值。

调用这些方法的最佳方式是在 `useLayoutEffect` Hook 中：这样你可以获得这些测量值的最新结果，并且还能在测量完成的同一帧内应用更改。

典型代码如下：

```tsx
function AComponent(children) {
  const targetRef = useRef(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // 使用这些测量值执行一些操作
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
这里描述的方法可用于 React Native 提供的大多数默认组件。不过，对于那些并非直接由原生视图支持的复合组件，则 _不_ 可用。这通常包括你在自己应用中定义的大多数组件。
:::

## measure(callback)

确定给定视图在屏幕上的位置（`x` 和 `y`）、`width` 和 `height`。通过异步回调返回这些值。如果成功，回调将使用以下参数被调用：

- `x`：测量视图在视口中原点（左上角）的 `x` 坐标。
- `y`：测量视图在视口中原点（左上角）的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
- `pageX`：视图在视口中的 `x` 坐标（通常是整个屏幕）。
- `pageY`：视图在视口中的 `y` 坐标（通常是整个屏幕）。

此外，`measure()` 返回的 `width` 和 `height` 也是该组件在视口中的 `width` 和 `height`。

## measureInWindow(callback)

确定给定视图在窗口中的位置（`x` 和 `y`），并通过异步回调返回这些值。如果 React 根视图嵌入在另一个原生视图中，这将返回绝对坐标。如果成功，回调将使用以下参数被调用：

- `x`：视图在当前窗口中的 `x` 坐标。
- `y`：视图在当前窗口中的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
