---
id: animatedvaluexy
title: Animated.ValueXY
---

用于驱动二维动画的二维值，例如拖拽手势。API 几乎与普通 [`Animated.Value`](animatedvalue) 完全相同，但可进行多路复用。内部包含两个常规的 `Animated.Value`。

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

直接设置值。这会停止任何正在运行的动画，并更新所有绑定的属性。

**参数：**

| 名称  | 类型                     | 必填 | 说明 |
| ----- | ------------------------ | ---- | ---- |
| value | `{x: number; y: number}` | 是   | 值   |

---

### `setOffset()`

```tsx
setOffset(offset: {x: number; y: number});
```

设置一个偏移量，它会叠加在已设置的值之上，无论该值是通过 `setValue`、动画还是 `Animated.event` 设置的。适用于补偿诸如拖拽手势开始时的位置等情况。

**参数：**

| 名称   | 类型                     | 必填 | 说明     |
| ------ | ------------------------ | ---- | -------- |
| offset | `{x: number; y: number}` | 是   | 偏移值   |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基础值中，并将偏移重置为零。该值的最终输出保持不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将偏移值设置为基础值，并将基础值重置为零。该值的最终输出保持不变。

---

### `addListener()`

```tsx
addListener(callback: (value: {x: number; y: number}) => void);
```

为该值添加一个异步监听器，以便你可以观察动画更新。这很有用，因为无法同步读取该值，因为它可能由原生端驱动。

返回一个字符串，作为该监听器的标识符。

**参数：**

| 名称      | 类型     | 必填 | 说明                                                                                 |
| --------- | -------- | ---- | ------------------------------------------------------------------------------------ |
| callback  | function | 是   | 回调函数，将接收一个对象，其中 `value` 键的值为新值。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应与之前由 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必填 | 说明                        |
| ---- | ------ | ---- | --------------------------- |
| id   | string | 是   | 要移除的监听器的 Id。 |

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

停止任何正在运行的动画或跟踪。`callback` 会在停止动画后以最终值调用，这对于更新状态以使布局与动画位置保持一致很有用。

**参数：**

| 名称      | 类型     | 必填 | 说明                                   |
| --------- | -------- | ---- | -------------------------------------- |
| callback  | function | 否   | 一个会接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何动画，并将值重置为其初始值。

**参数：**

| 名称      | 类型     | 必填 | 说明                                      |
| --------- | -------- | ---- | ----------------------------------------- |
| callback  | function | 否   | 一个会接收初始值的函数。 |

---

### `getLayout()`

```tsx
getLayout(): {left: Animated.Value, top: Animated.Value};
```

将 `{x, y}` 转换为用于样式的 `{left, top}`，例如

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
