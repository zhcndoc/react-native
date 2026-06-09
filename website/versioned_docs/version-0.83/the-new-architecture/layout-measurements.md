# 测量布局

有时，你需要测量当前布局，以便对整体布局进行一些更改，或者根据测量结果做出决策并调用某些特定逻辑。

React Native 提供了一些原生方法，用于获取视图的测量信息。

调用这些方法的最佳时机是在 `useLayoutEffect` 钩子中：这样可以得到这些测量的最新数值，并且能在测量完成后的同一帧中应用更改。

典型代码如下所示：

```tsx
function AComponent(children) {
  const targetRef = useRef(null)

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // 使用测量结果做一些操作
    });
  }, [ /* 在此处加入依赖 */]);

  return (
    <View ref={targetRef}>
     {children}
    <View />
  );
};
```

:::note
这里描述的方法适用于 React Native 提供的大多数默认组件。然而，对于那些没有直接绑定到原生视图的组合组件，这些方法是**不可用**的。这通常包括你在自己的应用中定义的大多数组件。
:::

## measure(callback)

测定给定视图在屏幕上的位置（`x` 和 `y`），以及视口中的 `width` 和 `height`。结果通过异步回调返回。如果成功，回调将接收以下参数：

- `x`：被测视图在视口中的起点（左上角）的 `x` 坐标。
- `y`：被测视图在视口中的起点（左上角）的 `y` 坐标。
- `width`：视图的宽度。
- `height`：视图的高度。
- `pageX`：视图在视口（通常是整个屏幕）中的 `x` 坐标。
- `pageY`：视图在视口（通常是整个屏幕）中的 `y` 坐标。

同时，`measure()` 返回的 `width` 和 `height` 是组件在视口中的宽高。

## measureInWindow(callback)

测定给定视图在窗口中的位置（`x` 和 `y`），通过异步回调返回结果。如果 React 根视图被嵌入到另一个原生视图中，这个方法返回的是绝对坐标。如果成功，回调将接收以下参数：

- `x`：视图在当前窗口中的 `x` 坐标。
- `y`：视图在当前窗口中的 `y` 坐标。
- `width`：视图的宽度。
- `height`：视图的高度。