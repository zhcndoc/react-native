---
id: animatedvaluexy
title: Animated.ValueXY
---

用于驱动 2D 动画（如平移手势）的 2D 值。API 与普通的 [`Animated.Value`](animatedvalue) 几乎相同，但是是多路复用的。底层包含两个常规的 `Animated.Value`。

## 示例

```SnackPlayer name=Animated.ValueXY%20Example
import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y 是 Animated.Value
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // 自动多路复用
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // 回到零点
      ).start();
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[pan.getLayout(), styles.box]}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#61dafb',
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default DraggableView;
```

---

# 参考

## 方法

### `setValue()`

```tsx
setValue(value: {x: number; y: number});
```

直接设置值。这将停止在该值上运行的任何动画并更新所有绑定的属性。

**参数：**

| 名称  | 类型                     | 是否必填 | 描述 |
| ----- | ------------------------ | -------- | ----------- |
| value | `{x: number; y: number}` | 是      | 值       |

---

### `setOffset()`

```tsx
setOffset(offset: {x: number; y: number});
```

设置一个偏移量，该偏移量将应用于通过 `setValue`、动画或 `Animated.event` 设置的任何值之上。可用于补偿平移手势开始等情况。

**参数：**

| 名称   | 类型                     | 是否必填 | 描述  |
| ------ | ------------------------ | -------- | ------------ |
| offset | `{x: number; y: number}` | 是      | 偏移值 |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基值中并将偏移量重置为零。值的最终输出不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将偏移值设置为基值，并将基值重置为零。值的最终输出不变。

---

### `addListener()`

```tsx
addListener(callback: (value: {x: number; y: number}) => void);
```

向值添加一个异步监听器，以便您可以观察动画的更新。这很有用，因为无法同步读取该值，因为它可能是由原生驱动的。

返回一个字符串，作为监听器的标识符。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                                                                 |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| callback | function | 是      | 回调函数，将接收一个对象，该对象包含一个 `value` 键，设置为新值。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销监听器。`id` 参数应与 `addListener()` 之前返回的标识符匹配。

**参数：**

| 名称 | 类型   | 是否必填 | 描述                        |
| ---- | ------ | -------- | ---------------------------------- |
| id   | string | 是      | 要移除的监听器的 Id。 |

---

### `removeAllListeners()`

```tsx
removeAllListeners();
```

移除所有已注册的监听器。

---

### `stopAnimation()`

```tsx
stopAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何正在运行的动画或跟踪。停止动画后，会使用最终值调用 `callback`，这对于更新状态以使动画位置与布局匹配很有用。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| callback | function | 否       | 将接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何动画并将值重置为其原始值。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| callback | function | 否       | 将接收原始值的函数。 |

---

### `getLayout()`

```tsx
getLayout(): {left: Animated.Value, top: Animated.Value};
```

将 `{x, y}` 转换为 `{left, top}` 以便在 style 中使用，例如：

```tsx
style={this.state.anim.getLayout()}
```

---

### `getTranslateTransform()`

```tsx
getTranslateTransform(): [
  {translateX: Animated.Value},
  {translateY: Animated.Value},
];
```

将 `{x, y}` 转换为可用的平移变换，例如：

```tsx
style={{
  transform: this.state.anim.getTranslateTransform()
}}
```
