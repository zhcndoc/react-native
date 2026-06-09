---
id: animatedvaluexy
title: Animated.ValueXY
---

用于驱动 2D 动画的二维值，例如拖拽手势。其 API 与普通 [`Animated.Value`](animatedvalue) 几乎相同，但支持多路复用。内部包含两个普通的 `Animated.Value`。

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

直接设置值。这会停止当前在该值上运行的任何动画，并更新所有绑定的属性。

**参数：**

| 名称  | 类型                     | 必需 | 描述 |
| ----- | ------------------------ | ---- | ---- |
| value | `{x: number; y: number}` | 是   | 值    |

---

### `setOffset()`

```tsx
setOffset(offset: {x: number; y: number});
```

设置一个偏移量，该偏移量会叠加在已设置的值之上，无论该值是通过 `setValue`、动画还是 `Animated.event` 设置的。适用于补偿诸如手势开始位置之类的情况。

**参数：**

| 名称   | 类型                     | 必需 | 描述     |
| ------ | ------------------------ | ---- | -------- |
| offset | `{x: number; y: number}` | 是   | 偏移值 |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基础值中，并将偏移重置为零。值的最终输出保持不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将偏移值设置为基础值，并将基础值重置为零。值的最终输出保持不变。

---

### `addListener()`

```tsx
addListener(callback: (value: {x: number; y: number}) => void);
```

为该值添加一个异步监听器，以便你可以观察动画的更新。这样做很有用，因为值可能由原生驱动，因此无法同步读取。

返回一个字符串，作为监听器的标识符。

**参数：**

| 名称     | 类型     | 必需 | 描述                                                                                 |
| -------- | -------- | ---- | ------------------------------------------------------------------------------------ |
| callback | function | 是   | 回调函数，它会接收一个对象，其中 `value` 键被设置为新值。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应与之前 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必需 | 描述                        |
| ---- | ------ | ---- | --------------------------- |
| id   | string | 是   | 被移除的监听器的 Id。 |

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

停止任何正在运行的动画或跟踪。`callback` 会在动画停止后接收最终值，这对于更新状态以使布局与动画位置一致很有用。

**参数：**

| 名称     | 类型     | 必需 | 描述                                   |
| -------- | -------- | ---- | -------------------------------------- |
| callback | function | 否   | 一个会接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: {x: number; y: number}) => void);
```

停止任何动画，并将值重置为其初始值。

**参数：**

| 名称     | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| callback | function | No       | A function that will receive the original value. |

---

### `getLayout()`

```tsx
getLayout(): {left: Animated.Value, top: Animated.Value};
```

将 `{x, y}` 转换为 `{left, top}` 以用于样式，例如：

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
