# 测量布局

有时，您需要测量当前布局，以便对整体布局应用一些更改，或者做出决策并调用某些特定逻辑。

React Native 提供了一些原生方法来了解视图的测量值。

调用这些方法的最佳方式是在 `useLayoutEffect` hook 中：这将为您提供这些测量值的最新值，并允许您在计算测量值的同一帧中应用更改。

典型代码如下所示：

```tsx
function AComponent(children) {
  const targetRef = useRef(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // 对测量值做一些操作
    });
  }, [ /* 在此处添加依赖项 */]);

  return (
    <View ref={targetRef}>
     {children}
    <View />
  );
}
```

:::note
此处描述的方法适用于 React Native 提供的大多数默认组件。但是，它们_不_适用于没有直接由原生视图支持的复合组件。这通常包括您在自己的应用中定义的大多数组件。
:::

## measure(callback)

确定给定视图在视口中的屏幕位置（`x` 和 `y`）、`width` 和 `height`。通过异步回调返回值。如果成功，回调将使用以下参数调用：

- `x`：测量视图在视口中的原点（左上角）的 `x` 坐标。
- `y`：测量视图在视口中的原点（左上角）的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
- `pageX`：视图在视口中的 `x` 坐标（通常是整个屏幕）。
- `pageY`：视图在视口中的 `y` 坐标（通常是整个屏幕）。

此外，`measure()` 返回的 `width` 和 `height` 是组件在视口中的 `width` 和 `height`。

## measureInWindow(callback)

确定给定视图在窗口中的位置（`x` 和 `y`），并通过异步回调返回值。如果 React 根视图嵌入在另一个原生视图中，这将为您提供绝对坐标。如果成功，回调将使用以下参数调用：

- `x`：视图在当前窗口中的 `x` 坐标。
- `y`：视图在当前窗口中的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
