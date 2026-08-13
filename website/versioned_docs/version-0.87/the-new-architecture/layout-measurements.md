# 测量布局

有时，你需要测量当前布局，以便对整体布局应用一些更改，或做出决策并调用某些特定逻辑。

React Native 提供了一些原生方法，用于了解视图的测量值。

调用这些方法的最佳方式是在 `useLayoutEffect` hook 中：这样可以获取这些测量值的最新值，并且可以在计算出测量值的同一帧中应用更改。

典型代码如下：

```tsx
function AComponent(children) {
  const targetRef = useRef(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      //do something with the measurements
    });
  }, [ /* add dependencies here */]);

  return (
    <View ref={targetRef}>
     {children}
    <View />
  );
}
```

:::note
此处介绍的方法适用于 React Native 提供的大多数默认组件。但是，它们*不*适用于不是直接由原生视图支持的复合组件。这通常包括你在自己的应用中定义的大多数组件。
:::

## measure(callback)

确定给定视图在视口中的位置（`x` 和 `y`）、`width` 和 `height`。通过异步 callback 返回这些值。如果成功，callback 将接收以下参数：

- `x`：被测量视图在视口中的原点（左上角）的 `x` 坐标。
- `y`：被测量视图在视口中的原点（左上角）的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
- `pageX`：视图在视口中的 `x` 坐标（通常是整个屏幕）。
- `pageY`：视图在视口中的 `y` 坐标（通常是整个屏幕）。

此外，`measure()` 返回的 `width` 和 `height` 是组件在视口中的 `width` 和 `height`。

## measureInWindow(callback)

确定给定视图在窗口中的位置（`x` 和 `y`），并通过异步 callback 返回这些值。如果 React 根视图嵌入在另一个原生视图中，此方法将为你提供绝对坐标。如果成功，callback 将接收以下参数：

- `x`：视图在当前窗口中的 `x` 坐标。
- `y`：视图在当前窗口中的 `y` 坐标。
- `width`：视图的 `width`。
- `height`：视图的 `height`。
