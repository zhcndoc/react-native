---
id: animated
title: Animated
---

`Animated` 库旨在让动画流畅、强大，并且易于构建和维护。`Animated` 专注于输入与输出之间的声明式关系、中间可配置的变换，以及用于控制基于时间的动画执行的 `start`/`stop` 方法。

创建动画的核心流程是创建一个 `Animated.Value`，将其连接到动画组件的一个或多个样式属性，然后使用 `Animated.timing()` 通过动画驱动更新。

:::note
不要直接修改动画值。你可以使用 [`useRef` Hook](https://react.dev/reference/react/useRef) 返回一个可变的 ref 对象。此 ref 对象的 `current` 属性会被初始化为给定参数，并在整个组件生命周期内持续存在。
:::

## 示例

以下示例包含一个 `View`，它将根据动画值 `fadeAnim` 淡入和淡出

```SnackPlayer name=Animated%20Example
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  useAnimatedValue,
} from 'react-native';

const App = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useAnimatedValue(0);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
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
              // Bind opacity to animated value
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

请参考 [Animations](animations#animated-api) 指南，查看 `Animated` 的更多实际示例。

## 概览

你可以将以下两种值类型与 `Animated` 一起使用：

- [`Animated.Value()`](animated#value) 用于单个值
- [`Animated.ValueXY()`](animated#valuexy) 用于向量

`Animated.Value` 可以绑定到样式属性或其他 props，也可以进行插值。单个 `Animated.Value` 可以驱动任意数量的属性。

### 配置动画

`Animated` 提供三种动画类型。每种动画类型都提供特定的动画曲线，用于控制值如何从初始值变化到最终值：

- [`Animated.decay()`](animated#decay) 从初始速度开始，并逐渐减速至停止
- [`Animated.spring()`](animated#spring) 提供基本的弹簧物理模型
- [`Animated.timing()`](animated#timing) 使用[缓动函数](easing)随时间对值进行动画处理

在大多数情况下，你会使用 `timing()`。默认情况下，它使用对称的 easeInOut 曲线，表现对象逐渐加速至全速，并最终逐渐减速至停止的过程。

### 使用动画

通过在动画上调用 `start()` 来启动动画。`start()` 接受一个完成回调，动画完成时会调用该回调。如果动画正常完成运行，完成回调会接收到 `{finished: true}`。如果动画是因为在完成前对其调用了 `stop()` 而结束的（例如因为手势或另一个动画中断了它），则会接收到 `{finished: false}`。

```tsx
Animated.timing({}).start(({finished}) => {
  /* completion callback */
});
```

### 使用原生驱动程序

使用原生驱动程序时，我们会在动画开始前将与动画相关的所有内容发送到原生端，使原生代码能够在 UI 线程上执行动画，而不必在每一帧都经过桥接。一旦动画启动，即使 JS 线程被阻塞，也不会影响动画。

你可以在动画配置中指定 `useNativeDriver: true` 来使用原生驱动程序。请参考 [Animations](animations#using-the-native-driver) 指南了解更多信息。

### 可动画组件

只有可动画组件才能执行动画。这些特殊组件负责将动画值绑定到属性，并执行有针对性的原生更新，从而避免每一帧都产生 React 渲染和协调过程的开销。它们还会在卸载时处理清理，因此默认情况下是安全的。

- [`createAnimatedComponent()`](animated#createanimatedcomponent) 可用于使组件变得可动画。

`Animated` 使用上述包装器导出以下可动画组件：

- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SectionList`

### 组合动画

还可以使用组合函数以复杂方式组合动画：

- [`Animated.delay()`](animated#delay) 在给定延迟后启动动画
- [`Animated.parallel()`](animated#parallel) 同时启动多个动画
- [`Animated.sequence()`](animated#sequence) 按顺序启动动画，等待每个动画完成后再启动下一个
- [`Animated.stagger()`](animated#stagger) 按顺序并行启动动画，但会逐个增加延迟

还可以将动画串联起来，只需将一个动画的 `toValue` 设置为另一个 `Animated.Value`。请参阅 Animations 指南中的[跟踪动态值](animations#tracking-dynamic-values)。

默认情况下，如果某个动画停止或被中断，组中的所有其他动画也会停止。

### 组合动画值

你可以通过加法、减法、乘法、除法或取模来组合两个动画值，从而创建新的动画值：

- [`Animated.add()`](animated#add)
- [`Animated.subtract()`](animated#subtract)
- [`Animated.divide()`](animated#divide)
- [`Animated.modulo()`](animated#modulo)
- [`Animated.multiply()`](animated#multiply)

### 插值

`interpolate()` 函数允许将输入范围映射到不同的输出范围。默认情况下，它会将曲线外推到给定范围之外，但你也可以让它限制输出值。它默认使用线性插值，同时也支持缓动函数。

- [`interpolate()`](animatedvalue#interpolate)

请在 [Animation](animations#interpolation) 指南中阅读更多关于插值的信息。

### 处理手势和其他事件

手势（例如平移或滚动）以及其他事件可以使用 `Animated.event()` 直接映射到动画值。该功能使用结构化映射语法，因此可以从复杂的事件对象中提取值。第一层是一个数组，用于支持跨多个参数进行映射，该数组包含嵌套对象。

- [`Animated.event()`](animated#event)

例如，在处理水平滚动手势时，你可以执行以下操作，将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

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

当给定值是 ValueXY 而不是 Value 时，每个配置选项都可以是 `{x: ..., y: ...}` 形式的向量，而不是标量。

### `decay()`

```tsx
static decay(value, config): CompositeAnimation;
```

根据衰减系数，使值从初始速度变化到零。

Config 是一个对象，可能包含以下选项：

- `velocity`：初始速度。必填
- `deceleration`：衰减率。默认值为 0.997
- `isInteraction`：此动画是否创建“交互句柄”。默认值为 true
- `useNativeDriver`：为 true 时使用原生驱动程序。必填

---

### `timing()`

```tsx
static timing(value, config): CompositeAnimation;
```

使值沿着计时缓动曲线变化。[`Easing`](easing) 模块提供了大量预定义曲线，你也可以使用自己的函数。

Config 是一个对象，可能包含以下选项：

- `duration`：动画时长（毫秒）。默认值为 500
- `easing`：用于定义曲线的缓动函数。默认值为 `Easing.inOut(Easing.ease)`
- `delay`：延迟后启动动画（毫秒）。默认值为 0
- `isInteraction`：此动画是否创建“交互句柄”。默认值为 true
- `useNativeDriver`：为 true 时使用原生驱动程序。必填

---

### `spring()`

```tsx
static spring(value, config): CompositeAnimation;
```

根据基于[阻尼谐振荡](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator)的分析弹簧模型对值进行动画处理。它会跟踪速度状态，在 `toValue` 更新时创建流畅的运动，并且可以串联。

Config 是一个对象，可能包含以下选项。

请注意，你只能定义 bounciness/speed、tension/friction 或 stiffness/damping/mass 中的一组，不能定义多组：

friction/tension 或 bounciness/speed 选项与 [`Facebook Pop`](https://github.com/facebook/pop)、[Rebound](https://github.com/facebookarchive/rebound) 和 [Origami](https://origami.design/) 中的弹簧模型相匹配。

- `friction`：控制“弹性”／过冲。默认值为 7
- `tension`：控制速度。默认值为 40
- `speed`：控制动画速度。默认值为 12
- `bounciness`：控制弹性。默认值为 8

将 stiffness/damping/mass 指定为参数后，`Animated.spring` 会使用基于[阻尼谐振荡](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator)运动方程的分析弹簧模型。此行为更加精确，也更忠实地反映了弹簧动力学背后的物理原理，并且与 iOS 的 CASpringAnimation 实现非常相似。

- `stiffness`：弹簧刚度系数。默认值为 100
- `damping`：定义由于摩擦力，弹簧运动应受到的阻尼程度。默认值为 10
- `mass`：连接在弹簧末端的物体质量。默认值为 1

其他配置选项如下：

- `velocity`：连接在弹簧上的物体的初始速度。默认值为 0（物体处于静止状态）
- `overshootClamping`：布尔值，表示是否应限制弹簧运动并禁止弹跳。默认值为 false
- `restDisplacementThreshold`：静止位移阈值，低于该阈值时弹簧会被视为处于静止状态。默认值为 0.001
- `restSpeedThreshold`：弹簧被视为处于静止状态时的速度，单位为每秒像素。默认值为 0.001
- `delay`：延迟后启动动画（毫秒）。默认值为 0
- `isInteraction`：此动画是否创建“交互句柄”。默认值为 true
- `useNativeDriver`：为 true 时使用原生驱动程序。必填

---

### `add()`

```tsx
static add(a: Animated, b: Animated): AnimatedAddition;
```

创建一个由两个动画值相加而成的新动画值。

---

### `subtract()`

```tsx
static subtract(a: Animated, b: Animated): AnimatedSubtraction;
```

创建一个通过从第一个动画值中减去第二个动画值而得到的新动画值。

---

### `divide()`

```tsx
static divide(a: Animated, b: Animated): AnimatedDivision;
```

创建一个通过第一个动画值除以第二个动画值得到的新动画值。

---

### `multiply()`

```tsx
static multiply(a: Animated, b: Animated): AnimatedMultiplication;
```

创建一个由两个动画值相乘而成的新动画值。

---

### `modulo()`

```tsx
static modulo(a: Animated, modulus: number): AnimatedModulo;
```

创建一个新动画值，其值为给定动画值的（非负）模

---

### `diffClamp()`

```tsx
static diffClamp(a: Animated, min: number, max: number): AnimatedDiffClamp;
```

创建一个限制在两个值之间的新动画值。它使用与上一个值之间的差值，因此即使该值远离边界，当它再次开始接近边界时也会开始变化。（`value = clamp(value + diff, min, max)`）。

例如，这对于滚动事件很有用：向上滚动时显示导航栏，向下滚动时隐藏导航栏。

---

### `delay()`

```tsx
static delay(time: number): CompositeAnimation;
```

在给定延迟后启动动画。

---

### `sequence()`

```tsx
static sequence(animations: CompositeAnimation[]): CompositeAnimation;
```

按顺序启动动画数组，等待每个动画完成后再启动下一个。如果当前正在运行的动画停止，则不会启动后续动画。

---

### `parallel()`

```tsx
static parallel(
  animations: CompositeAnimation[],
  config?: ParallelConfig
): CompositeAnimation;
```

同时启动动画数组中的所有动画。默认情况下，如果其中一个动画停止，所有动画都会停止。你可以使用 `stopTogether` 标志覆盖此行为。

---

### `stagger()`

```tsx
static stagger(
  time: number,
  animations: CompositeAnimation[]
): CompositeAnimation;
```

动画数组可以并行运行（相互重叠），但会以连续延迟按顺序启动。适合实现拖尾效果。

---

### `loop()`

```tsx
static loop(
  animation: CompositeAnimation[],
  config?: LoopAnimationConfig
): CompositeAnimation;
```

持续循环给定动画，使其每次到达末尾时重置，并从头开始。如果子动画设置为 `useNativeDriver: true`，循环将不会阻塞 JS 线程。此外，在动画运行期间，循环可能会阻止基于 `VirtualizedList` 的组件渲染更多行。你可以在子动画配置中传入 `isInteraction: false` 来解决此问题。

Config 是一个对象，可能包含以下选项：

- `iterations`：动画应循环的次数。默认值为 `-1`（无限）

---

### `event()`

```tsx
static event(
  argMapping: Mapping[],
  config?: EventConfig
): (...args: any[]) => void;
```

接收一个映射数组，并根据映射从每个参数中提取值，然后对映射的输出调用 `setValue`。例如：

```tsx
onScroll={Animated.event(
  [{nativeEvent: {contentOffset: {x: this._scrollX}}}],
  {listener: (event: ScrollEvent) => console.log(event)}, // Optional async listener
)}
 ...
onPanResponderMove: Animated.event(
  [
    null, // raw event arg ignored
    {dx: this._panX},
  ], // gestureState arg
  {
    listener: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => console.log(event, gestureState),
  } // Optional async listener
);
```

Config 是一个对象，可能包含以下选项：

- `listener`：可选的异步监听器
- `useNativeDriver`：为 true 时使用原生驱动程序。必填

---

### `forkEvent()`

```jsx
static forkEvent(event: AnimatedEvent, listener: Function): AnimatedEvent;
```

用于监视通过 props 传入的动画事件的高级命令式 API。它允许向现有的 `AnimatedEvent` 添加新的 JavaScript 监听器。如果 `animatedEvent` 是 JavaScript 监听器，它会将两个监听器合并为一个；如果 `animatedEvent` 为 null／undefined，则会直接赋值 JavaScript 监听器。在可能的情况下，请直接使用值。

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

通过在动画上调用 start() 来启动动画。start() 接受一个完成回调，当动画完成，或因为在动画完成前对其调用了 stop() 而结束时，会调用该回调。

**参数：**

| 名称     | 类型                                    | 必填 | 描述                                                                       |
| -------- | --------------------------------------- | ---- | -------------------------------------------------------------------------- |
| callback | `(result: {finished: boolean}) => void` | 否   | 动画正常完成运行后，或因为在动画完成前对其调用了 stop() 而结束时调用的函数 |

带回调的 Start 示例：

```tsx
Animated.timing({}).start(({finished}) => {
  /* completion callback */
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

停止任何正在运行的动画，并将值重置为其原始值。

## 属性

### `Value`

用于驱动动画的标准值类。通常在函数组件中使用 `useAnimatedValue(0);` 初始化，或在 class 组件中使用 `new Animated.Value(0);` 初始化。

你可以在单独的 [页面](animatedvalue)上详细了解 `Animated.Value` API。

---

### `ValueXY`

用于驱动二维动画的二维值类，例如平移手势。

你可以在单独的 [页面](animatedvaluexy)上详细了解 `Animated.ValueXY` API。

---

### `Interpolation`

导出以便在 flow 中使用 Interpolation 类型。

---

### `Node`

为便于类型检查而导出。所有动画值都派生自此类。

---

### `createAnimatedComponent`

使任何 React 组件变得可动画。用于创建 `Animated.View` 等组件。

---

### `attachNativeEvent`

将动画值附加到视图事件的命令式 API。如果可能，优先使用带有 `useNativeDriver: true` 的 `Animated.event`。
