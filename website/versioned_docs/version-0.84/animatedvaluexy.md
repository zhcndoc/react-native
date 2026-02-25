---
id: animatedvaluexy
title: Animated.ValueXY
---

用于驱动二维动画（例如拖拽手势）的二维值。API 与普通的 [`Animated.Value`](animatedvalue) 几乎相同，但进行了复用。内部包含两个常规的 `Animated.Value`。

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
        pan, // 自动复用
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // 回到初始位置
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

直接设置值。此操作会停止正在运行的任何动画并更新所有绑定属性。

**参数：**

| 名称  | 类型                     | 必填 | 说明       |
| ----- | ------------------------ | ---- | ---------- |
| value | `{x: number; y: number}` | 是   | 值         |

---

### `setOffset()`

```tsx
setOffset(offset: {x: number; y: number});
```

设置一个偏移值，会叠加在通过 `setValue`、动画或 `Animated.event` 设置的值之上。用于补偿诸如拖拽手势开始时的位置。

**参数：**

| 名称   | 类型                     | 必填 | 说明       |
| ------ | ------------------------ | ---- | ---------- |
| offset | `{x: number; y: number}` | 是   | 偏移值     |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基础值中，并将偏移重置为零。最终输出值保持不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将偏移值设置为当前基础值，并重置基础值为零。最终输出值保持不变。

---

### `addListener()`

```tsx
addListener(callback: (value: {x: number; y: number}) => void);
```

添加一个异步监听器，可用于观察动画更新。由于值可能由原生驱动，无法同步读取，因此该方法很有用。

返回一个用于标识监听器的字符串。

**参数：**

| 名称     | 类型     | 必填 | 说明                                                       |
| -------- | -------- | ---- | ---------------------------------------------------------- |
| callback | function | 是   | 回调函数，将接收一个包含新值的对象，该对象含有 `value` 键。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应与之前由 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必填 | 说明               |
| ---- | ------ | ---- | ------------------ |
| id   | string | 是   | 要移除的监听器 ID。 |

---

### `removeAllListeners()`

```tsx
removeAllListeners();
```

移除所有注册的监听器。

---

### `stopAnimation()`

```tsx
stopAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何正在运行的动画或跟踪。动画停止后会调用 `callback`，参数为最终值，方便更新状态与动画位置同步。

**参数：**

| 名称     | 类型     | 必填 | 说明                  |
| -------- | -------- | ---- | --------------------- |
| callback | function | 否   | 接收最终值的回调函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止所有动画并重置值为初始值。

**参数：**

| 名称     | 类型     | 必填 | 说明                    |
| -------- | -------- | ---- | ----------------------- |
| callback | function | 否   | 接收初始值的回调函数。   |

---

### `getLayout()`

```tsx
getLayout(): {left: Animated.Value, top: Animated.Value};
```

将 `{x, y}` 转换为 `{left, top}`，方便用于样式中，例如：

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
