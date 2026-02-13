---
id: animatedvalue
title: Animated.Value
---

用于驱动动画的标准值。一个 `Animated.Value` 可以以同步方式驱动多个属性，但一次只能被一种机制驱动。使用新的机制（例如启动一个新动画，或调用 `setValue`）会停止任何之前的机制。

通常通过 `useAnimatedValue(0);` 或在类组件中使用 `new Animated.Value(0);` 来初始化。

---

# 参考

## 方法

### `setValue()`

```tsx
setValue(value: number);
```

直接设置值。这将停止任何正在运行的动画，并更新所有绑定的属性。

**参数:**

| 名称  | 类型   | 必填 | 说明     |
| ----- | ------ | ---- | -------- |
| value | number | 是   | 值       |

---

### `setOffset()`

```tsx
setOffset(offset: number);
```

设置一个偏移值，应用于无论是通过 `setValue`，动画，还是 `Animated.event` 设置的值之上。对于补偿如开始手势拖动（pan gesture）等情况很有用。

**参数:**

| 名称   | 类型   | 必填 | 说明         |
| ------ | ------ | ---- | ------------ |
| offset | number | 是   | 偏移值       |

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
addListener(callback: (state: {value: number}) => void): string;
```

为值添加异步监听器，以便观察动画中的更新。由于值可能由原生驱动，无法同步读取，因此此功能很有用。

返回一个字符串，作为监听器的标识符。

**参数:**

| 名称     | 类型     | 必填 | 说明                                                             |
| -------- | -------- | ---- | ---------------------------------------------------------------- |
| callback | function | 是   | 回调函数，将接收一个包含新值的 `{value}` 键的对象。              |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应匹配之前 `addListener()` 返回的标识符。

**参数:**

| 名称 | 类型   | 必填 | 说明               |
| ---- | ------ | ---- | ------------------ |
| id   | string | 是   | 要移除的监听器的ID |

---

### `removeAllListeners()`

```tsx
removeAllListeners();
```

移除所有已注册的监听器。

---

### `stopAnimation()`

```tsx
stopAnimation(callback?: (value: number) => void);
```

停止任何正在运行的动画或跟踪。停止动画后会调用 `callback`，并传入最终值，可用于更新状态以匹配动画和布局位置。

**参数:**

| 名称     | 类型     | 必填 | 说明                     |
| -------- | -------- | ---- | ------------------------ |
| callback | function | 否   | 接收最终值的回调函数     |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: number) => void);
```

停止任何动画并将值重置为初始值。

**参数:**

| 名称     | 类型     | 必填 | 说明                       |
| -------- | -------- | ---- | -------------------------- |
| callback | function | 否   | 接收初始值的回调函数       |

---

### `interpolate()`

```tsx
interpolate(config: InterpolationConfigType);
```

在更新属性前对值进行插值，例如将 0-1 映射到 0-10。

详见 `AnimatedInterpolation.js`

**参数:**

| 名称   | 类型   | 必填 | 说明       |
| ------ | ------ | ---- | ---------- |
| config | object | 是   | 见下文说明 |

`config` 对象包含以下键：

- `inputRange`：数字数组
- `outputRange`：数字或字符串数组
- `easing`（可选）：输入一个数字返回一个数字的函数
- `extrapolate`（可选）：字符串，如 'extend'、'identity' 或 'clamp'
- `extrapolateLeft`（可选）：字符串，如 'extend'、'identity' 或 'clamp'
- `extrapolateRight`（可选）：字符串，如 'extend'、'identity' 或 'clamp'

---

### `animate()`

```tsx
animate(animation, callback);
```

通常仅供内部使用，但自定义 Animation 类也可调用。

**参数:**

| 名称      | 类型      | 必填 | 说明               |
| --------- | --------- | ---- | ------------------ |
| animation | Animation | 是   | 参见 `Animation.js` |
| callback  | function  | 是   | 回调函数           |
