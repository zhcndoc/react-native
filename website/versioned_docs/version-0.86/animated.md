---
id: animated
title: 动画
---

`Animated` 库旨在让动画的构建和维护变得流畅、强大且轻松。`Animated` 专注于输入与输出之间的声明式关系、中间可配置的变换，以及用于控制基于时间的动画执行的 `start`/`stop` 方法。

创建动画的核心流程是创建一个 `Animated.Value`，将其绑定到动画组件的一个或多个样式属性上，然后通过 `Animated.timing()` 驱动更新。

:::note
不要直接修改 animated value。你可以使用 [`useRef` Hook](https://react.dev/reference/react/useRef) 返回一个可变的 ref 对象。这个 ref 对象的 `current` 属性会以给定参数初始化，并在组件生命周期内持续存在。
:::

## 示例

下面的示例包含一个 `View`，它会根据 animated value `fadeAnim` 实现淡入和淡出

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
  // fadeAnim 将作为 opacity 的值使用。初始值：0
  const fadeAnim = useAnimatedValue(0);

  const fadeIn = () => {
    // 将在 5 秒内把 fadeAnim 的值改为 1
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // 将在 3 秒内把 fadeAnim 的值改为 0
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
              // 将 opacity 绑定到 animated value
              opacity: fadeAnim,
            },
          ]}>
          <Text style={styles.fadingText}>Fading View!</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <Button title="淡入视图" onPress={fadeIn} />
          <Button title="淡出视图" onPress={fadeOut} />
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

请参阅 [动画](animations#animated-api) 指南，查看更多 `Animated` 的使用示例。

## 概览

`Animated` 可使用两种值类型：

- [`Animated.Value()`](animated#value) 用于单个值
- [`Animated.ValueXY()`](animated#valuexy) 用于向量

`Animated.Value` 可以绑定到样式属性或其他属性，也可以进行插值。单个 `Animated.Value` 可以驱动任意数量的属性。

### 配置动画

`Animated` 提供三种动画类型。每种动画类型都提供一种特定的动画曲线，用于控制数值如何从初始值动画到最终值：

- [`Animated.decay()`](animated#decay) 从初始速度开始，逐渐减速直到停止。
- [`Animated.spring()`](animated#spring) 提供一个基础的弹簧物理模型。
- [`Animated.timing()`](animated#timing) 使用 [缓动函数](easing) 按时间对值进行动画。

在大多数情况下，你会使用 `timing()`。默认情况下，它使用对称的 easeInOut 曲线，体现对象逐渐加速到全速，并在结束时逐渐减速至停止。

### 使用动画

通过在动画上调用 `start()` 来启动动画。`start()` 接收一个完成回调，该回调会在动画结束时被调用。如果动画正常结束，完成回调将收到 `{finished: true}`。如果动画由于在完成前调用了 `stop()` 而结束（例如被手势或另一个动画中断），则它将收到 `{finished: false}`。

```tsx
Animated.timing({}).start(({finished}) => {
  /* 完成回调 */
});
```

### 使用原生驱动

使用原生驱动时，我们会在动画开始前将动画的所有信息发送到原生端，这样原生代码就可以在 UI 线程上执行动画，而无需在每一帧都经过 bridge。动画开始后，即使 JS 线程被阻塞，也不会影响动画。

你可以在动画配置中指定 `useNativeDriver: true` 来使用原生驱动。请参阅 [动画](animations#using-the-native-driver) 指南了解更多。

### 可动画组件

只有可动画组件才能被动画化。这些独特的组件会把 animated value 绑定到属性上，并执行有针对性的原生更新，从而避免每一帧都付出 React 渲染和协调过程的成本。它们还会在卸载时处理清理，因此默认是安全的。

- [`createAnimatedComponent()`](animated#createanimatedcomponent) 可用于将组件变为可动画组件。

`Animated` 使用上述包装器导出了以下可动画组件：

- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SectionList`

### 组合动画

也可以使用组合函数以复杂方式组合动画：

- [`Animated.delay()`](animated#delay) 在给定延迟后启动动画。
- [`Animated.parallel()`](animated#parallel) 同时启动多个动画。
- [`Animated.sequence()`](animated#sequence) 按顺序启动动画，等待每个动画完成后再开始下一个。
- [`Animated.stagger()`](animated#stagger) 按顺序并行启动动画，但彼此之间有连续延迟。

通过将一个动画的 `toValue` 设置为另一个 `Animated.Value`，动画也可以串联起来。请参阅动画指南中的 [跟踪动态值](animations#tracking-dynamic-values)。

默认情况下，如果一个动画停止或被中断，组中的所有其他动画也会停止。

### 组合 animated 值

你可以通过加法、减法、乘法、除法或取模组合两个 animated 值，创建一个新的 animated 值：

- [`Animated.add()`](animated#add)
- [`Animated.subtract()`](animated#subtract)
- [`Animated.divide()`](animated#divide)
- [`Animated.modulo()`](animated#modulo)
- [`Animated.multiply()`](animated#multiply)

### 插值

`interpolate()` 函数允许将输入范围映射到不同的输出范围。默认情况下，它会在给定范围之外外推曲线，但你也可以让它对输出值进行截断。默认使用线性插值，但也支持缓动函数。

- [`interpolate()`](animatedvalue#interpolate)

关于插值的更多内容，请参阅 [动画](animations#interpolation) 指南。

### 处理手势和其他事件

手势，例如拖动或滚动，以及其他事件，都可以使用 `Animated.event()` 直接映射到 animated 值。这通过结构化映射语法完成，因此可以从复杂的事件对象中提取值。第一层是一个数组，用于允许跨多个参数进行映射，而该数组包含嵌套对象。

- [`Animated.event()`](animated#event)

例如，在处理水平滚动手势时，你可以按如下方式将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

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

当给定值是 ValueXY 而不是 Value 时，每个配置选项都可以是形如 `{x: ..., y: ...}` 的向量，而不是标量。

### `decay()`

```tsx
static decay(value, config): CompositeAnimation;
```

根据衰减系数，将一个值从初始速度动画到零。

Config 是一个对象，可能包含以下选项：

- `velocity`：初始速度。必填。
- `deceleration`：衰减率。默认 0.997。
- `isInteraction`：此动画是否会在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`：当为 true 时使用原生驱动。必填。

---

### `timing()`

```tsx
static timing(value, config): CompositeAnimation;
```

沿着一个定时的缓动曲线对值进行动画。[`Easing`](easing) 模块提供了大量预定义曲线，你也可以使用自己的函数。

Config 是一个对象，可能包含以下选项：

- `duration`：动画时长（毫秒）。默认 500。
- `easing`：用于定义曲线的缓动函数。默认是 `Easing.inOut(Easing.ease)`。
- `delay`：在延迟后开始动画（毫秒）。默认 0。
- `isInteraction`：此动画是否会在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`：当为 true 时使用原生驱动。必填。

---

### `spring()`

```tsx
static spring(value, config): CompositeAnimation;
```

根据基于 [阻尼谐振动](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 的解析弹簧模型对值进行动画。跟踪速度状态，以在 `toValue` 更新时创建流畅的运动，并且可以彼此串联。

Config 是一个对象，可能包含以下选项。

请注意，你只能定义 bounciness/speed、tension/friction 或 stiffness/damping/mass 其中之一，不能定义多个：

friction/tension 或 bounciness/speed 选项与 [`Facebook Pop`](https://github.com/facebook/pop)、[Rebound](https://github.com/facebookarchive/rebound) 和 [Origami](https://origami.design/) 中的弹簧模型一致。

- `friction`：控制“弹性”/过冲。默认 7。
- `tension`：控制速度。默认 40。
- `speed`：控制动画速度。默认 12。
- `bounciness`：控制弹性。默认 8。

将 stiffness/damping/mass 作为参数指定后，`Animated.spring` 会使用基于 [阻尼谐振子](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 运动方程的解析弹簧模型。这种行为略微更精确，也更符合弹簧动力学背后的物理规律，并且与 iOS 中的 CASpringAnimation 实现非常相似。

- `stiffness`：弹簧刚度系数。默认 100。
- `damping`：定义由于摩擦力作用，弹簧运动应如何被阻尼。默认 10。
- `mass`：连接在弹簧末端的物体质量。默认 1。

其他配置选项如下：

- `velocity`：连接在弹簧末端物体的初始速度。默认 0（物体处于静止）。
- `overshootClamping`：布尔值，表示是否应对弹簧进行截断并且不产生回弹。默认 false。
- `restDisplacementThreshold`：位移回到静止状态的阈值，低于该值时弹簧应被视为静止。默认 0.001。
- `restSpeedThreshold`：弹簧被视为静止时的速度，单位为像素/秒。默认 0.001。
- `delay`：在延迟后开始动画（毫秒）。默认 0。
- `isInteraction`：此动画是否会在 `InteractionManager` 上创建“交互句柄”。默认 true。
- `useNativeDriver`：当为 true 时使用原生驱动。必填。

---

### `add()`

```tsx
static add(a: Animated, b: Animated): AnimatedAddition;
```

创建一个新的 Animated 值，由两个相加的 Animated 值组成。

---

### `subtract()`

```tsx
static subtract(a: Animated, b: Animated): AnimatedSubtraction;
```

创建一个新的 Animated 值，由第一个 Animated 值减去第二个 Animated 值组成。

---

### `divide()`

```tsx
static divide(a: Animated, b: Animated): AnimatedDivision;
```

创建一个新的 Animated 值，由第一个 Animated 值除以第二个 Animated 值组成。

---

### `multiply()`

```tsx
static multiply(a: Animated, b: Animated): AnimatedMultiplication;
```

创建一个新的 Animated 值，由两个相乘的 Animated 值组成。

---

### `modulo()`

```tsx
static modulo(a: Animated, modulus: number): AnimatedModulo;
```

创建一个新的 Animated 值，它是所提供 Animated 值的（非负）取模结果

---

### `diffClamp()`

```tsx
static diffClamp(a: Animated, min: number, max: number): AnimatedDiffClamp;
```

创建一个受限于两个值之间的新 Animated 值。它使用上一个值之间的差值，因此即使值远离边界，当值再次开始接近时，它也会开始变化。（`value = clamp(value + diff, min, max)`）。

这在滚动事件中很有用，例如，向上滚动时显示导航栏，向下滚动时隐藏它。

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

按顺序启动一组动画，等待每个动画完成后再启动下一个。如果当前正在运行的动画被停止，则不会启动后续动画。

---

### `parallel()`

```tsx
static parallel(
  animations: CompositeAnimation[],
  config?: ParallelConfig
): CompositeAnimation;
```

同时启动一组动画。默认情况下，如果其中一个动画被停止，它们都会被停止。你可以通过 `stopTogether` 标志覆盖这一行为。

---

### `stagger()`

```tsx
static stagger(
  time: number,
  animations: CompositeAnimation[]
): CompositeAnimation;
```

动画数组可以并行运行（重叠），但会按顺序以递增的延迟启动。非常适合制作尾随效果。

---

### `loop()`

```tsx
static loop(
  animation: CompositeAnimation[],
  config?: LoopAnimationConfig
): CompositeAnimation;
```

连续循环给定动画，使其每次到达结尾时都会重置并从头开始。若子动画设置了 `useNativeDriver: true`，则循环不会阻塞 JS 线程。此外，循环会阻止基于 `VirtualizedList` 的组件在动画运行时渲染更多行。你可以在子动画配置中传入 `isInteraction: false` 来解决此问题。

Config 是一个对象，可能包含以下选项：

- `iterations`：动画应循环的次数。默认 `-1`（无限循环）。

---

### `event()`

```tsx
static event(
  argMapping: Mapping[],
  config?: EventConfig
): (...args: any[]) => void;
```

接收一个映射数组，并相应地从每个参数中提取值，然后对映射后的输出调用 `setValue`。例如：

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

Config 是一个对象，可能包含以下选项：

- `listener`：可选的异步监听器。
- `useNativeDriver`：当为 true 时使用原生驱动。必填。

---

### `forkEvent()`

```jsx
static forkEvent(event: AnimatedEvent, listener: Function): AnimatedEvent;
```

用于监听通过 props 传入的 animated 事件的高级命令式 API。它允许向现有的 `AnimatedEvent` 添加一个新的 javascript 监听器。如果 `animatedEvent` 是一个 javascript 监听器，它会将这两个监听器合并为一个；如果 `animatedEvent` 为 null/undefined，则会直接分配该 javascript 监听器。尽可能直接使用值。

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

通过在动画上调用 start() 来启动动画。start() 接收一个完成回调，该回调会在动画正常结束时，或由于在完成前调用了 stop() 而结束时被调用。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ---- | ---- | ---- | ---- |
| callback | `(result: {finished: boolean}) => void` | 否 | 动画正常完成后，或由于在完成前调用了 stop() 而结束时，将被调用的函数 |

带回调的 start 示例：

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

停止任何正在运行的动画，并将值重置为其初始值。

## 属性

### `Value`

用于驱动动画的标准值类。通常在函数组件中使用 `useAnimatedValue(0);` 进行初始化，或在类组件中使用 `new Animated.Value(0);`。

你可以在单独的 [页面](animatedvalue) 中了解更多关于 `Animated.Value` API 的信息。

---

### `ValueXY`

用于驱动二维动画的二维值类，例如平移手势。

你可以在单独的 [页面](animatedvaluexy) 中了解更多关于 `Animated.ValueXY` API 的信息。

---

### `Interpolation`

导出以在 flow 中使用 Interpolation 类型。

---

### `Node`

导出以便于类型检查。所有动画值都继承自此类。

---

### `createAnimatedComponent`

将任何 React 组件变为可动画化组件。用于创建 `Animated.View` 等。

---

### `attachNativeEvent`

用于将动画值以命令式方式附加到视图上的事件。若可能，优先使用带有 `useNativeDriver: true` 的 `Animated.event`。
