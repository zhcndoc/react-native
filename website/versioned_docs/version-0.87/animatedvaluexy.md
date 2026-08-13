---
id: animatedvaluexy
title: Animated.ValueXY
---

用于驱动二维动画（例如平移手势）的二维值。API 几乎与普通的 [`Animated.Value`](animatedvalue) 完全相同，但经过多路复用。底层包含两个常规的 `Animated.Value`

## 示例

```SnackPlayer name=Animated.ValueXY%20Example
import {useRef} from 'react';
import {Animated, PanResponder, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
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

直接设置值。这将停止当前在该值上运行的任何动画，并更新所有绑定的属性。

**参数：**

| 名称  | 类型                     | 必填 | 描述 |
| ----- | ------------------------ | ---- | ---- |
| value | `{x: number; y: number}` | 是   | 值   |

---

### `setOffset()`

```tsx
setOffset(offset: {x: number; y: number});
```

设置一个偏移量，该偏移量会应用于已设置的任何值之上，无论该值是通过 `setValue`、动画还是 `Animated.event` 设置的。适用于补偿平移手势开始位置等情况。

**参数：**

| 名称   | 类型                     | 必填 | 描述   |
| ------ | ------------------------ | ---- | ------ |
| offset | `{x: number; y: number}` | 是   | 偏移值 |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基础值中，并将偏移量重置为零。该值的最终输出保持不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将基础值设置为偏移值，并将基础值重置为零。该值的最终输出保持不变。

---

### `addListener()`

```tsx
addListener(callback: (value: {x: number; y: number}) => void);
```

向该值添加一个异步监听器，以便观察动画的更新。当该值可能由原生代码驱动时，无法同步读取它，因此此方法非常有用。

返回一个用作监听器标识符的字符串。

**参数：**

| 名称     | 类型     | 必填 | 描述                                                            |
| -------- | -------- | ---- | --------------------------------------------------------------- |
| callback | function | 是   | 回调函数，该函数将接收一个对象，其中的 `value` 键被设置为新值。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应与之前由 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必填 | 描述                  |
| ---- | ------ | ---- | --------------------- |
| id   | string | 是   | 要移除的监听器的 ID。 |

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

停止任何正在运行的动画或跟踪。停止动画后，会使用最终值调用 `callback`，这对于更新状态以使布局与动画位置保持一致非常有用。

**参数：**

| 名称     | 类型     | 必填 | 描述               |
| -------- | -------- | ---- | ------------------ |
| callback | function | 否   | 接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何动画，并将值重置为其初始值。

**参数：**

| 名称     | 类型     | 必填 | 描述               |
| -------- | -------- | ---- | ------------------ |
| callback | function | 否   | 接收初始值的函数。 |

---

### `getLayout()`

```tsx
getLayout(): {left: Animated.Value, top: Animated.Value};
```

将 `{x, y}` 转换为 `{left, top}`，以便在样式中使用，例如

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

将 `{x, y}` 转换为可用的平移变换，例如

```tsx
style={{
  transform: this.state.anim.getTranslateTransform()
}}
```
