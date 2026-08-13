---
id: animatedvalue
title: Animated.Value
---

用于驱动动画的标准值。一个 `Animated.Value` 可以以同步方式驱动多个属性，但同一时间只能由一种机制驱动。使用新的机制（例如启动新动画或调用 `setValue`）将停止之前的机制。

通常在类组件中使用 `useAnimatedValue(0);` 或 `new Animated.Value(0);` 进行初始化。

---

# 参考

## 方法

### `setValue()`

```tsx
setValue(value: number);
```

直接设置值。这将停止在该值上运行的所有动画，并更新所有绑定的属性。

**参数：**

| 名称  | 类型   | 必填 | 描述 |
| ----- | ------ | ---- | ---- |
| value | number | 是   | 值   |

---

### `setOffset()`

```tsx
setOffset(offset: number);
```

设置一个偏移量，该偏移量会应用于所设置的任何值之上，无论该值是通过 `setValue`、动画还是 `Animated.event` 设置的。适用于补偿平移手势起始位置等情况。

**参数：**

| 名称   | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| offset | number | 是   | 偏移值 |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基础值中，并将偏移量重置为零。该值的最终输出不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将基础值设置为偏移值，并将基础值重置为零。该值的最终输出不变。

---

### `addListener()`

```tsx
addListener(callback: (state: {value: number}) => void): string;
```

向该值添加异步监听器，以便观察动画带来的更新。这很有用，因为无法同步读取该值，因为它可能由原生驱动。

返回一个用作监听器标识符的字符串。

**参数：**

| 名称     | 类型     | 必填 | 描述                                                              |
| -------- | -------- | ---- | ----------------------------------------------------------------- |
| callback | function | 是   | 将接收一个对象的回调函数，该对象包含一个设置为新值的 `value` 键。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

取消注册监听器。`id` 参数应与之前由 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必填 | 描述                  |
| ---- | ------ | ---- | --------------------- |
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
stopAnimation(callback?: (value: number) => void);
```

停止所有正在运行的动画或跟踪。停止动画后，将使用最终值调用 `callback`，这对于更新状态以使其与动画位置和布局相匹配很有用。

**参数：**

| 名称     | 类型     | 必填 | 描述                 |
| -------- | -------- | ---- | -------------------- |
| callback | function | 否   | 将接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: number) => void);
```

停止所有动画，并将值重置为其初始值。

**参数：**

| 名称     | 类型     | 必填 | 描述                 |
| -------- | -------- | ---- | -------------------- |
| callback | function | 否   | 将接收初始值的函数。 |

---

### `interpolate()`

```tsx
interpolate(config: InterpolationConfigType);
```

在更新属性之前对值进行插值，例如将 0-1 映射到 0-10。

请参阅 `AnimatedInterpolation.js`

**参数：**

| 名称   | 类型   | 必填 | 描述     |
| ------ | ------ | ---- | -------- |
| config | object | 是   | 见下文。 |

`config` 对象由以下键组成：

- `inputRange`：数字数组
- `outputRange`：数字或字符串数组
- `easing`（可选）：给定输入数字后返回一个数字的函数
- `extrapolate`（可选）：字符串，例如 'extend'、'identity' 或 'clamp'
- `extrapolateLeft`（可选）：字符串，例如 'extend'、'identity' 或 'clamp'
- `extrapolateRight`（可选）：字符串，例如 'extend'、'identity' 或 'clamp'

---

### `animate()`

```tsx
animate(animation, callback);
```

通常仅在内部使用，但也可以由自定义 Animation 类使用。

**参数：**

| 名称      | 类型      | 必填 | 描述                    |
| --------- | --------- | ---- | ----------------------- |
| animation | Animation | 是   | 请参阅 `Animation.js`。 |
| callback  | function  | 是   | 回调函数。              |
