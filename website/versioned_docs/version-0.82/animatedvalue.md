---
id: animatedvalue
title: Animated.Value
---

用于驱动动画的标准值。一个 `Animated.Value` 可以以同步方式驱动多个属性，但一次只能由一种机制驱动。使用新机制（例如启动新动画或调用 `setValue`）将停止任何之前的机制。

通常使用 `useAnimatedValue(0);` 初始化，或在类组件中使用 `new Animated.Value(0);` 初始化。

---

# 参考

## 方法

### `setValue()`

```tsx
setValue(value: number);
```

直接设置值。这将停止在该值上运行的任何动画并更新所有绑定的属性。

**参数：**

| 名称  | 类型   | 是否必填 | 描述 |
| ----- | ------ | -------- | ----------- |
| value | number | 是      | 值       |

---

### `setOffset()`

```tsx
setOffset(offset: number);
```

设置一个偏移量，该偏移量会叠加在任何设置的值之上，无论是通过 `setValue`、动画还是 `Animated.event`。这对于补偿平移手势开始等情况很有用。

**参数：**

| 名称   | 类型   | 是否必填 | 描述  |
| ------ | ------ | -------- | ------------ |
| offset | number | 是      | 偏移值 |

---

### `flattenOffset()`

```tsx
flattenOffset();
```

将偏移值合并到基值中，并将偏移量重置为零。值的最终输出保持不变。

---

### `extractOffset()`

```tsx
extractOffset();
```

将偏移值设置为基值，并将基值重置为零。值的最终输出保持不变。

---

### `addListener()`

```tsx
addListener(callback: (state: {value: number}) => void): string;
```

向值添加一个异步监听器，以便您可以观察来自动画的更新。这很有用，因为无法同步读取该值，因为它可能是由原生驱动的。

返回一个字符串，作为监听器的标识符。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                                                                 |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| callback | function | 是      | 回调函数，将接收一个对象，该对象包含一个设置为新值的 `value` 键。 |

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

移除所有注册的监听器。

---

### `stopAnimation()`

```tsx
stopAnimation(callback?: (value: number) => void);
```

停止任何正在运行的动画或跟踪。`callback` 在停止动画后使用最终值调用，这对于更新状态以匹配动画位置与布局很有用。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| callback | function | 否       | 将接收最终值的函数。 |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: number) => void);
```

停止任何动画并将值重置为其原始值。

**参数：**

| 名称     | 类型     | 是否必填 | 描述                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| callback | function | 否       | 将接收原始值的函数。 |

---

### `interpolate()`

```tsx
interpolate(config: InterpolationConfigType);
```

在更新属性之前插值，例如将 0-1 映射到 0-10。

参见 `AnimatedInterpolation.js`

**参数：**

| 名称   | 类型   | 是否必填 | 描述 |
| ------ | ------ | -------- | ----------- |
| config | object | 是      | 见下文。  |

`config` 对象由以下键组成：

- `inputRange`：数字数组
- `outputRange`：数字或字符串数组
- `easing`（可选）：给定输入数字返回数字的函数
- `extrapolate`（可选）：字符串，例如 'extend', 'identity' 或 'clamp'
- `extrapolateLeft`（可选）：字符串，例如 'extend', 'identity' 或 'clamp'
- `extrapolateRight`（可选）：字符串，例如 'extend', 'identity' 或 'clamp'

---

### `animate()`

```tsx
animate(animation, callback);
```

通常仅在内部使用，但可由自定义 Animation 类使用。

**参数：**

| 名称      | 类型      | 是否必填 | 描述         |
| --------- | --------- | -------- | ------------------- |
| animation | Animation | 是      | 参见 `Animation.js`。 |
| callback  | function  | 是      | 回调函数。  |
