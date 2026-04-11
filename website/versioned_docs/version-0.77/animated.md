---
id: animated
title: Animated
---

`Animated` 库旨在使动画流畅、强大且易于构建和维护。`Animated` 专注于输入和输出之间的声明式关系、中间的可配置变换，以及用于控制基于时间的动画执行的 `start`/`stop` 方法。

创建动画的核心工作流程是创建一个 `Animated.Value`，将其连接到动画组件的一个或多个样式属性，然后通过使用 `Animated.timing()` 的动画来驱动更新。

> 不要直接修改动画值。你可以使用 [`useRef` Hook](https://react.dev/reference/react/useRef) 返回一个可变 ref 对象。此 ref 对象的 `current` 属性初始化为给定参数，并在整个组件生命周期中持久存在。

## 示例

以下示例包含一个 `View`，它将基于动画值 `fadeAnim` 进行淡入和淡出

```SnackPlayer name=Animated%20Example&supportedPlatforms=ios,android
import React, {useRef} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
} from 'react-native';

const App = () => {
  // fadeAnim 将用作 opacity 的值。初始值：0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // 将在 5 秒内将 fadeAnim 值更改为 1
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // 将在 3 秒内将 fadeAnim 值更改为 0
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              // 将 opacity 绑定到动画值
              opacity: fadeAnim,
            },
          ]}>
          <Text style={styles.fadingText}>Fading View!</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <Button title="Fade In View" onPress={fadeIn} />
          <Button title="Fade Out View" onPress={fadeOut} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default App;
```

参考 [动画](animations#animated-api) 指南以查看 `Animated` 的其他示例。

## 概述

你可以配合 `Animated` 使用两种值类型：

- [`Animated.Value()`](animated#value) 用于单个值
- [`Animated.ValueXY()`](animated#valuexy) 用于向量

`Animated.Value` 可以绑定到样式属性或其他 props，也可以进行插值。单个 `Animated.Value` 可以驱动任意数量的属性。

### 配置动画

`Animated` 提供三种类型的动画。每种动画类型提供特定的动画曲线，控制你的值如何从初始值动画到最终值：

- [`Animated.decay()`](animated#decay) 以初始速度开始并逐渐减速至停止。
- [`Animated.spring()`](animated#spring) 提供基本的弹簧物理模型。
- [`Animated.timing()`](animated#timing) 使用 [缓动函数](easing) 随时间动画化一个值。

在大多数情况下，你将使用 `timing()`。默认情况下，它使用对称的 easeInOut 曲线，传达物体逐渐加速到全速并通过逐渐减速到停止的过程。

### 使用动画

通过调用动画上的 `start()` 来启动动画。`start()` 接受一个完成回调，当动画完成时将调用该回调。如果动画正常完成运行，完成回调将使用 `{finished: true}` 调用。如果动画是因为在完成前调用了 `stop()` 而完成（例如，因为它被手势或另一个动画中断），那么它将收到 `{finished: false}`。

```tsx
Animated.timing({}).start(({finished}) => {
  /* 完成回调 */
});
```

### 使用原生驱动

通过使用原生驱动，我们在启动动画之前将有关动画的所有内容发送到原生端，允许原生代码在 UI 线程上执行动画，而无需在每一帧上都通过桥接。一旦动画开始，JS 线程可以被阻塞而不影响动画。

你可以通过在动画配置中指定 `useNativeDriver: true` 来使用原生驱动。请参阅 [动画](animations#using-the-native-driver) 指南以了解更多信息。

### 可动画组件

只有可动画组件可以进行动画处理。这些独特的组件完成了将动画值绑定到属性的魔法，并进行有针对性的原生更新，以避免每一帧上 React 渲染和协调过程的成本。它们还处理卸载时的清理，因此默认情况下是安全的。

- [`createAnimatedComponent()`](animated#createanimatedcomponent) 可用于使组件可动画化。

`Animated` 使用上述包装器导出以下可动画组件：

- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SectionList`

### 组合动画

动画也可以使用组合函数以复杂的方式组合：

- [`Animated.delay()`](animated#delay) 在给定的延迟后启动动画。
- [`Animated.parallel()`](animated#parallel) 同时启动多个动画。
- [`Animated.sequence()`](animated#sequence) 按顺序启动动画，等待每个动画完成后再启动下一个。
- [`Animated.stagger()`](animated#stagger) 按顺序并行启动动画，但具有连续的延迟。

动画也可以通过将一个动画的 `toValue` 设置为另一个 `Animated.Value` 来链接在一起。请参阅动画指南中的 [跟踪动态值](animations#tracking-dynamic-values)。

默认情况下，如果一个动画停止或中断，则组中的所有其他动画也会停止。

### 组合动画值

你可以通过加、减、乘、除或取模来组合两个动画值，以制作一个新的动画值：

- [`Animated.add()`](animated#add)
- [`Animated.subtract()`](animated#subtract)
- [`Animated.divide()`](animated#divide)
- [`Animated.modulo()`](animated#modulo)
- [`Animated.multiply()`](animated#multiply)

### 插值

`interpolate()` 函数允许输入范围映射到不同的输出范围。默认情况下，它将外推给定范围之外的曲线，但你也可以让它钳制输出值。默认情况下它使用线性插值，但也支持缓动函数。

- [`interpolate()`](animatedvalue#interpolate)

在 [动画](animations#interpolation) 指南中阅读更多关于插值的信息。

### 处理手势和其他事件

手势（如平移或滚动）和其他事件可以使用 `Animated.event()` 直接映射到动画值。这是通过结构化映射语法完成的，以便可以从复杂的事件对象中提取值。第一级是一个数组，允许跨多个参数进行映射，该数组包含嵌套对象。

- [`Animated.event()`](animated#event)

例如，当使用水平滚动手势时，你将执行以下操作以将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

```tsx
 onScroll={Animated.event(
   // scrollX = e.nativeEvent.contentOffset.x
   [{nativeEvent: {
        contentOffset: {
          x: scrollX
        }
      }
    }]
 )}
```

---

# 参考

## 方法

当给定值是 ValueXY 而不是 Value 时，每个配置选项可以是 `{x: ..., y: ...}` 形式的向量，而不是标量。

### `decay()`

```tsx
static decay(value, config): CompositeAnimation;
```

基于衰减系数将值从初始速度动画化到零。

Config 是一个对象，可能具有以下选项：

- `velocity`: 初始速度。必需。
- `deceleration`: 衰减率。默认 0.997。
- `isInteraction`: 此动画是否在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`: 为 true 时使用原生驱动。必需。

---

### `timing()`

```tsx
static timing(value, config): CompositeAnimation;
```

沿定时缓动曲线动画化一个值。[`Easing`](easing) 模块有很多预定义的曲线，或者你可以使用自己的函数。

Config 是一个对象，可能具有以下选项：

- `duration`: 动画长度（毫秒）。默认 500。
- `easing`: 定义曲线的缓动函数。默认是 `Easing.inOut(Easing.ease)`。
- `delay`: 延迟后启动动画（毫秒）。默认 0。
- `isInteraction`: 此动画是否在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`: 为 true 时使用原生驱动。必需。

---

### `spring()`

```tsx
static spring(value, config): CompositeAnimation;
```

根据基于 [阻尼谐波振荡](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 的分析弹簧模型动画化一个值。跟踪速度状态以在 `toValue` 更新时创建流畅的运动，并且可以链接在一起。

Config 是一个对象，可能具有以下选项。

请注意，你只能定义 bounciness/speed、tension/friction 或 stiffness/damping/mass 中的一组，而不能定义多组：

friction/tension 或 bounciness/speed 选项匹配 [`Facebook Pop`](https://github.com/facebook/pop)、[Rebound](https://github.com/facebookarchive/rebound) 和 [Origami](https://origami.design/) 中的弹簧模型。

- `friction`: 控制“弹性”/过冲。默认 7。
- `tension`: 控制速度。默认 40。
- `speed`: 控制动画速度。默认 12。
- `bounciness`: 控制弹性。默认 8。

指定 stiffness/damping/mass 作为参数会使 `Animated.spring` 使用基于 [阻尼谐波振荡](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 运动方程的分析弹簧模型。这种行为稍微更精确且忠实于弹簧动力学背后的物理原理，并密切模仿 iOS 的 CASpringAnimation 中的实现。

- `stiffness`: 弹簧刚度系数。默认 100。
- `damping`: 定义弹簧的运动应如何因摩擦力而阻尼。默认 10。
- `mass`: 连接到弹簧末端的物体的质量。默认 1。

其他配置选项如下：

- `velocity`: 连接到弹簧的物体的初始速度。默认 0（物体处于静止状态）。
- `overshootClamping`: 布尔值，指示弹簧是否应被钳制且不反弹。默认 false。
- `restDisplacementThreshold`: 低于此值的静止位移阈值，弹簧应被视为静止。默认 0.001。
- `restSpeedThreshold`: 弹簧应被视为静止的速度（像素/秒）。默认 0.001。
- `delay`: 延迟后启动动画（毫秒）。默认 0。
- `isInteraction`: 此动画是否在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`: 为 true 时使用原生驱动。必需。

---

### `add()`

```tsx
static add(a: Animated, b: Animated): AnimatedAddition;
```

创建一个由两个相加的 Animated 值组成的新 Animated 值。

---

### `subtract()`

```tsx
static subtract(a: Animated, b: Animated): AnimatedSubtraction;
```

创建一个由第一个 Animated 值减去第二个 Animated 值组成的新 Animated 值。

---

### `divide()`

```tsx
static divide(a: Animated, b: Animated): AnimatedDivision;
```

创建一个由第一个 Animated 值除以第二个 Animated 值组成的新 Animated 值。

---

### `multiply()`

```tsx
static multiply(a: Animated, b: Animated): AnimatedMultiplication;
```

创建一个由两个相乘的 Animated 值组成的新 Animated 值。

---

### `modulo()`

```tsx
static modulo(a: Animated, modulus: number): AnimatedModulo;
```

创建一个新 Animated 值，它是提供的 Animated 值的（非负）模。

---

### `diffClamp()`

```tsx
static diffClamp(a: Animated, min: number, max: number): AnimatedDiffClamp;
```

创建一个新的 Animated 值，限制在 2 个值之间。它使用与最后一个值的差值，因此即使值远离边界，当值再次开始接近时它也会开始变化。(`value = clamp(value + diff, min, max)`)。

这对于滚动事件很有用，例如，向上滚动时显示导航栏，向下滚动时隐藏它。

---

### `delay()`

```tsx
static delay(time: number): CompositeAnimation;
```

在给定的延迟后启动动画。

---

### `sequence()`

```tsx
static sequence(animations: CompositeAnimation[]): CompositeAnimation;
```

按顺序启动动画数组，等待每个动画完成后再启动下一个。如果当前运行的动画停止，则不会启动后续动画。

---

### `parallel()`

```tsx
static parallel(
  animations: CompositeAnimation[],
  config?: ParallelConfig
): CompositeAnimation;
```

同时启动动画数组。默认情况下，如果其中一个动画停止，它们都将停止。你可以使用 `stopTogether` 标志覆盖此行为。

---

### `stagger()`

```tsx
static stagger(
  time: number,
  animations: CompositeAnimation[]
): CompositeAnimation;
```

动画数组可以并行运行（重叠），但按顺序启动并具有连续的延迟。适合做跟随效果。

---

### `loop()`

```tsx
static loop(
  animation: CompositeAnimation[],
  config?: LoopAnimationConfig
): CompositeAnimation;
```

连续循环给定的动画，以便每次到达结束时，它重置并从头开始。如果子动画设置为 `useNativeDriver: true`，则循环不会阻塞 JS 线程。此外，当动画运行时，循环可以防止基于 `VirtualizedList` 的组件渲染更多行。你可以在子动画配置中传递 `isInteraction: false` 来修复此问题。

Config 是一个对象，可能具有以下选项：

- `iterations`: 动画应循环的次数。默认 `-1`（无限）。

---

### `event()`

```tsx
static event(
  argMapping: Mapping[],
  config?: EventConfig
): (...args: any[]) => void;
```

接受一个映射数组，并相应地从每个参数中提取值，然后在映射的输出上调用 `setValue`。例如：

```tsx
onScroll={Animated.event(
  [{nativeEvent: {contentOffset: {x: this._scrollX}}}],
  {listener: (event: ScrollEvent) => console.log(event)}, // 可选的异步监听器
)}
 ...
onPanResponderMove: Animated.event(
  [
    null, // 原始事件参数被忽略
    {dx: this._panX},
  ], // gestureState 参数
  {
    listener: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => console.log(event, gestureState),
  } // 可选的异步监听器
);
```

Config 是一个对象，可能具有以下选项：

- `listener`: 可选的异步监听器。
- `useNativeDriver`: 为 true 时使用原生驱动。必需。

---

### `forkEvent()`

```jsx
static forkEvent(event: AnimatedEvent, listener: Function): AnimatedEvent;
```

用于监听通过 props 传递的动画事件的高级命令式 API。它允许向现有的 `AnimatedEvent` 添加新的 javascript 监听器。如果 `animatedEvent` 是一个 javascript 监听器，它将把 2 个监听器合并为一个，如果 `animatedEvent` 是 null/undefined，它将直接分配 javascript 监听器。尽可能直接使用值。

---

### `unforkEvent()`

```jsx
static unforkEvent(event: AnimatedEvent, listener: Function);
```

---

### `start()`

```tsx
static start(callback?: (result: {finished: boolean}) => void);
```

通过调用动画上的 start() 来启动动画。start() 接受一个完成回调，当动画完成运行或动画因在完成前调用 stop() 而完成时将调用该回调。

**参数：**

| 名称     | 类型                                    | 是否必需 | 描述                                                                                                                                                     |
| -------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| callback | `(result: {finished: boolean}) => void` | 否       | 动画正常完成运行后或动画因在完成前调用 stop() 而完成时将调用的函数 |

带回调的启动示例：

```tsx
Animated.timing({}).start(({finished}) => {
  /* 完成回调 */
});
```

---

### `stop()`

```tsx
static stop();
```

停止任何正在运行的动画。

---

### `reset()`

```tsx
static reset();
```

停止任何正在运行的动画并将值重置为其原始值。

## 属性

### `Value`

用于驱动动画的标准值类。通常在类组件中使用 `useAnimatedValue(0);` 或 `new Animated.Value(0);` 进行初始化。

您可以在单独的 [页面](animatedvalue) 上阅读更多关于 `Animated.Value` API 的信息。

---

### `ValueXY`

用于驱动 2D 动画（例如平移手势）的 2D 值类。

您可以在单独的 [页面](animatedvaluexy) 上阅读更多关于 `Animated.ValueXY` API 的信息。

---

### `Interpolation`

导出以便在 flow 中使用 Interpolation 类型。

---

### `Node`

导出以便于类型检查。所有动画值都派生自此类。

---

### `createAnimatedComponent`

使任何 React 组件可动画化。用于创建 `Animated.View` 等。

---

### `attachNativeEvent`

用于将动画值附加到视图上的事件的命令式 API。如果可能，推荐优先使用带有 `useNativeDriver: true` 的 `Animated.event`。
