---
id: animatedvalue
title: Animated.Value
---

用于驱动动画的标准值。一个 `Animated.Value` 可以以同步方式驱动多个属性，但一次只能由一种机制驱动。使用新的机制（例如开始一个新的动画，或调用 `setValue`）会停止之前的任何机制。

通常在 `useAnimatedValue(0);` 中初始化，或者在类组件中使用 `new Animated.Value(0);`。

---

# 参考

## 方法

### `setValue()`

```tsx
setValue(value: number);
```

直接设置该值。这将停止在该值上运行的任何动画，并更新所有绑定的属性。

**参数：**

| 名称  | 类型   | 必填 | 描述 |
| ----- | ------ | ---- | ---- |
| value | number | 是   | 值   |

---

### `setOffset()`

```tsx
setOffset(offset: number);
```

设置一个偏移量，该偏移量会叠加到已设置的任何值之上，无论该值是通过 `setValue`、动画还是 `Animated.event` 设置的。适用于补偿诸如平移手势开始时之类的情况。

**参数：**

| 名称   | 类型   | 必填 | 描述     |
| ------ | ------ | ---- | -------- |
| offset | number | 是   | 偏移值   |

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

将偏移值设置为基础值，并将基础值重置为零。该值的最终输出保持不变。

---

### `addListener()`

```tsx
addListener(callback: (state: {value: number}) => void): string;
```

为该值添加一个异步监听器，以便你可以观察动画更新。这很有用，因为没有办法同步读取该值，因为它可能由原生端驱动。

返回一个字符串，作为该监听器的标识符。

**参数：**

| 名称     | 类型     | 必填 | 描述                                                                                 |
| -------- | -------- | ---- | ------------------------------------------------------------------------------------ |
| callback | function | 是   | 回调函数，它将接收一个对象，其中 `value` 键被设置为新值。 |

---

### `removeListener()`

```tsx
removeListener(id: string);
```

注销一个监听器。`id` 参数应与之前由 `addListener()` 返回的标识符匹配。

**参数：**

| 名称 | 类型   | 必填 | 描述                         |
| ---- | ------ | ---- | ---------------------------- |
| id   | string | 是   | 要移除的监听器的 Id。        |

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

停止任何正在运行的动画或跟踪。`callback` 会在动画停止后携带最终值被调用，这对于更新状态以使布局与动画位置一致很有用。

**参数：**

| 名称     | 类型     | 必填 | 描述                                   |
| -------- | -------- | ---- | -------------------------------------- |
| callback | function | 否   | 将接收最终值的函数。                  |

---

### `resetAnimation()`

```tsx
resetAnimation(callback?: (value: number) => void);
```

停止任何动画并将值重置为其初始值。

**参数：**

| 名称     | 类型     | 必填 | 描述                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| callback | function | 否   | 将接收初始值的函数。                    |

---

### `interpolate()`

```tsx
interpolate(config: InterpolationConfigType);
```

在更新属性之前对值进行插值处理，例如将 0-1 映射到 0-10。

参见 `AnimatedInterpolation.js`

**参数：**

| 名称   | 类型   | 必填 | 描述 |
| ------ | ------ | ---- | ---- |
| config | object | 是   | 见下。 |

`config` 对象由以下键组成：

- `inputRange`：一个数字数组
- `outputRange`：一个数字或字符串数组
- `easing`（可选）：给定输入数字后返回一个数字的函数
- `extrapolate`（可选）：一个字符串，例如 'extend'、'identity' 或 'clamp'
- `extrapolateLeft`（可选）：一个字符串，例如 'extend'、'identity' 或 'clamp'
- `extrapolateRight`（可选）：一个字符串，例如 'extend'、'identity' 或 'clamp'

---

### `animate()`

```tsx
animate(animation, callback);
```

通常仅在内部使用，但也可以由自定义的 Animation 类使用。

**参数：**

| 名称      | 类型      | 必填 | 描述         |
| --------- | --------- | ---- | -------------- |
| animation | Animation | 是   | 见 `Animation.js`。 |
| callback  | function  | 是   | 回调函数。    |
