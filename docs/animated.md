---
id: animated
title: Animated
---

`Animated` 库旨在让动画的构建和维护变得流畅、强大且轻松。`Animated` 专注于输入与输出之间的声明式关系，以及中间可配置的转换，并通过 `start`/`stop` 方法来控制基于时间的动画执行。

创建动画的核心流程是先创建一个 `Animated.Value`，将其绑定到动画组件的一个或多个样式属性上，然后使用 `Animated.timing()` 通过动画来驱动更新。

:::note
不要直接修改 animated value。你可以使用 [`useRef` Hook](https://react.dev/reference/react/useRef) 返回一个可变的 ref 对象。该 ref 对象的 `current` 属性会以给定参数初始化，并在组件生命周期内持续存在。
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
  // fadeAnim 将作为 opacity 的值。初始值：0
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

参阅 [Animations](animations#animated-api) 指南，查看更多 `Animated` 的使用示例。

## 概览

你可以将以下两种值类型与 `Animated` 一起使用：

- [`Animated.Value()`](animated#value) 用于单个值
- [`Animated.ValueXY()`](animated#valuexy) 用于向量

`Animated.Value` 可以绑定到样式属性或其他属性，也可以进行插值。一个 `Animated.Value` 可以驱动任意数量的属性。

### 配置动画

`Animated` 提供三种动画类型。每种动画类型都提供一种特定的动画曲线，用于控制值如何从初始值过渡到最终值：

- [`Animated.decay()`](animated#decay) 从初始速度开始，并逐渐减速直至停止。
- [`Animated.spring()`](animated#spring) 提供一个基础的弹簧物理模型。
- [`Animated.timing()`](animated#timing) 使用 [缓动函数](easing) 在一段时间内为值添加动画。

在大多数情况下，你会使用 `timing()`。默认情况下，它使用对称的 easeInOut 曲线，表现为对象逐渐加速到最高速度，并在结束时逐渐减速直至停止。

### 使用动画

通过在动画上调用 `start()` 来启动动画。`start()` 接受一个完成回调，该回调会在动画结束时被调用。如果动画正常结束，完成回调会收到 `{finished: true}`。如果动画因为在完成前被调用 `stop()` 而结束（例如被手势或另一个动画中断），则会收到 `{finished: false}`。

```tsx
Animated.timing({}).start(({finished}) => {
  /* 完成回调 */
});
```

### 使用原生驱动

使用原生驱动时，我们会在动画开始前把关于动画的所有内容发送到原生端，这样原生代码就可以在 UI 线程上执行动画，而无需在每一帧都经过桥接层。一旦动画开始，JS 线程即使被阻塞也不会影响动画。

你可以在动画配置中指定 `useNativeDriver: true` 来使用原生驱动。更多信息请参阅 [Animations](animations#using-the-native-driver) 指南。

### 可动画组件

只有可动画组件才能被动画化。这些特殊组件负责将动画值绑定到属性上，并进行有针对性的原生更新，以避免每一帧都付出 React 渲染和协调过程的成本。它们还会在卸载时处理清理，因此默认是安全的。

- [`createAnimatedComponent()`](animated#createanimatedcomponent) 可用于将组件变为可动画组件。

`Animated` 使用上面的包装器导出以下可动画组件：

- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SectionList`

### 组合动画

还可以使用组合函数以更复杂的方式组合动画：

- [`Animated.delay()`](animated#delay) 在给定延迟后启动动画。
- [`Animated.parallel()`](animated#parallel) 同时启动多个动画。
- [`Animated.sequence()`](animated#sequence) 按顺序启动动画，并在开始下一个之前等待每个动画完成。
- [`Animated.stagger()`](animated#stagger) 按顺序并以并行方式启动动画，但每个动画之间有连续的延迟。

也可以通过将一个动画的 `toValue` 设置为另一个 `Animated.Value` 来将动画链式连接。请参阅 Animations 指南中的 [Tracking dynamic values](animations#tracking-dynamic-values)。

默认情况下，如果一个动画停止或被中断，组中的所有其他动画也会停止。

### 组合 animated 值

你可以通过加法、减法、乘法、除法或取模将两个 animated 值组合成一个新的 animated 值：

- [`Animated.add()`](animated#add)
- [`Animated.subtract()`](animated#subtract)
- [`Animated.divide()`](animated#divide)
- [`Animated.modulo()`](animated#modulo)
- [`Animated.multiply()`](animated#multiply)

### 插值

`interpolate()` 函数允许将输入区间映射到不同的输出区间。默认情况下，它会将曲线在给定区间之外进行外推，但你也可以让它将输出值限制在边界内。它默认使用线性插值，但也支持缓动函数。

- [`interpolate()`](animatedvalue#interpolate)

更多关于插值的内容，请参阅 [Animation](animations#interpolation) 指南。

### 处理手势和其他事件

手势，例如拖动或滚动，以及其他事件，都可以通过 `Animated.event()` 直接映射到 animated 值。这通过结构化的映射语法完成，以便从复杂的事件对象中提取值。第一层是一个数组，用于支持跨多个参数的映射，而该数组中包含嵌套对象。

- [`Animated.event()`](animated#event)

例如，在处理水平滚动手势时，你会按如下方式将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

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

当给定值是 `ValueXY` 而不是 `Value` 时，每个配置项都可以是形如 `{x: ..., y: ...}` 的向量，而不是标量。

### `decay()`

```tsx
static decay(value, config): CompositeAnimation;
```

根据衰减系数，将一个值从初始速度动画到 0。

配置是一个对象，可能包含以下选项：

- `velocity`：初始速度。必需。
- `deceleration`：衰减率。默认 0.997。
- `isInteraction`：此动画是否在 `InteractionManager` 上创建一个“interaction handle”。默认 true。
- `useNativeDriver`：为 true 时使用原生驱动。必需。

---

### `timing()`

```tsx
static timing(value, config): CompositeAnimation;
```

沿着一个定时的缓动曲线为值添加动画。[`Easing`](easing) 模块提供了大量预定义曲线，你也可以使用自己的函数。

配置是一个对象，可能包含以下选项：

- `duration`：动画时长（毫秒）。默认 500。
- `easing`：用于定义曲线的缓动函数。默认是 `Easing.inOut(Easing.ease)`。
- `delay`：在延迟后开始动画（毫秒）。默认 0。
- `isInteraction`：此动画是否在 `InteractionManager` 上创建一个“interaction handle”。默认 true。
- `useNativeDriver`：为 true 时使用原生驱动。必需。

---

### `spring()`

```tsx
static spring(value, config): CompositeAnimation;
```

根据基于 [阻尼谐振荡](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 的解析弹簧模型为值添加动画。它会跟踪速度状态，以便在 `toValue` 更新时创建流畅运动，并且可以链式连接。

配置是一个对象，可能包含以下选项。

请注意，你只能定义 bounciness/speed、tension/friction 或 stiffness/damping/mass 中的一组，而不能同时定义多组：

friction/tension 或 bounciness/speed 选项与 [`Facebook Pop`](https://github.com/facebook/pop)、[Rebound](https://github.com/facebookarchive/rebound) 和 [Origami](https://origami.design/) 中的弹簧模型相匹配。

- `friction`：控制“弹性”/超调。默认 7。
- `tension`：控制速度。默认 40。
- `speed`：控制动画速度。默认 12。
- `bounciness`：控制弹性。默认 8。

将 stiffness/damping/mass 作为参数指定后，`Animated.spring` 会使用基于 [阻尼谐振子](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 运动方程的解析弹簧模型。这个行为稍微更精确，也更贴近弹簧动力学背后的物理原理，并且与 iOS 中的 `CASpringAnimation` 实现非常接近。

- `stiffness`：弹簧刚度系数。默认 100。
- `damping`：定义由于摩擦力导致弹簧运动应如何衰减。默认 10。
- `mass`：连接在弹簧末端的物体质量。默认 1。

其他配置选项如下：

- `velocity`：连接在弹簧末端的物体的初始速度。默认 0（物体静止）。
- `overshootClamping`：布尔值，表示弹簧是否应被钳制而不发生回弹。默认 false。
- `restDisplacementThreshold`：位移距离阈值，低于此值时弹簧应被视为静止。默认 0.001。
- `restSpeedThreshold`：弹簧应被视为静止时的速度阈值，单位为像素/秒。默认 0.001。
- `delay`：在延迟后开始动画（毫秒）。默认 0。
- `isInteraction`：此动画是否在 `InteractionManager` 上创建一个“interaction handle”。默认 true。
- `useNativeDriver`：为 true 时使用原生驱动。必需。

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

创建一个新的 Animated 值，通过从第一个 Animated 值中减去第二个 Animated 值组成。

---

### `divide()`

```tsx
static divide(a: Animated, b: Animated): AnimatedDivision;
```

创建一个新的 Animated 值，通过将第一个 Animated 值除以第二个 Animated 值组成。

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

创建一个新的 Animated 值，将其限制在两个值之间。它使用上一个值的差值，因此即使该值远离边界，只要它开始再次接近边界，就会开始变化。（`value = clamp(value + diff, min, max)`）。

这在滚动事件中非常有用，例如，向上滚动时显示导航栏，向下滚动时将其隐藏。

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

按顺序启动一组动画，在开始下一个之前等待每个动画完成。如果当前正在运行的动画被停止，则不会启动后续动画。

---

### `parallel()`

```tsx
static parallel(
  animations: CompositeAnimation[],
  config?: ParallelConfig
): CompositeAnimation;
```

同时启动一组动画。默认情况下，如果其中一个动画停止，则它们全部都会停止。你可以使用 `stopTogether` 标志覆盖这一行为。

---

### `stagger()`

```tsx
static stagger(
  time: number,
  animations: CompositeAnimation[]
): CompositeAnimation;
```

一组动画可以并行运行（重叠），但会按顺序并以连续延迟启动。适合用于创建拖尾效果。

---

### `loop()`

```tsx
static loop(
  animation: CompositeAnimation[],
  config?: LoopAnimationConfig
): CompositeAnimation;
```

持续循环给定动画，使其每次到达末尾时重置并从头开始重新执行。如果子动画设置为 `useNativeDriver: true`，则循环不会阻塞 JS 线程。此外，循环可能会阻止基于 `VirtualizedList` 的组件在动画运行时渲染更多行。你可以在子动画配置中传入 `isInteraction: false` 来修复这一点。

配置是一个对象，可能包含以下选项：

- `iterations`：动画应循环的次数。默认 `-1`（无限）。

---

### `event()`

```tsx
static event(
  argMapping: Mapping[],
  config?: EventConfig
): (...args: any[]) => void;
```

接收一个映射数组，并按相应方式从每个参数中提取值，然后在映射后的输出上调用 `setValue`。例如：

```tsx
onScroll={Animated.event(
  [{nativeEvent: {contentOffset: {x: this._scrollX}}}],
  {listener: (event: ScrollEvent) => console.log(event)}, // 可选的异步监听器
)}
 ...
onPanResponderMove: Animated.event(
  [
    null, // 原始事件参数会被忽略
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

配置是一个对象，可能包含以下选项：

- `listener`：可选的异步监听器。
- `useNativeDriver`：为 true 时使用原生驱动。必需。

---

### `forkEvent()`

```jsx
static forkEvent(event: AnimatedEvent, listener: Function): AnimatedEvent;
```

用于窥探通过 props 传入的 animated 事件的高级命令式 API。它允许向现有的 `AnimatedEvent` 添加一个新的 javascript 监听器。如果 `animatedEvent` 是一个 javascript 监听器，它会将这两个监听器合并为一个；如果 `animatedEvent` 为 null/undefined，则会直接分配 javascript 监听器。尽可能直接使用值。

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

通过在动画上调用 start() 来启动动画。start() 接受一个完成回调，该回调会在动画结束时或在动画因为在完成前被调用 stop() 而结束时被调用。

**参数：**

| 名称 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| callback | `(result: {finished: boolean}) => void` | 否 | 函数，会在动画正常结束后，或在动画因为在完成前被调用 stop() 而结束后被调用 |

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

停止任何正在运行的动画，并将值重置为其初始值。

## 属性

### `Value`

用于驱动动画的标准值类。通常在函数组件中使用 `useAnimatedValue(0);` 初始化，或在类组件中使用 `new Animated.Value(0);` 初始化。

你可以在单独的 [页面](animatedvalue) 上了解更多关于 `Animated.Value` API 的内容。

---

### `ValueXY`

用于驱动二维动画的二维值类，例如平移手势。

你可以在单独的 [页面](animatedvaluexy) 上了解更多关于 `Animated.ValueXY` API 的内容。

---

### `Interpolation`

导出该项以在 flow 中使用 Interpolation 类型。

---

### `Node`

为方便类型检查而导出。所有动画值都派生自此类。

---

### `createAnimatedComponent`

将任意 React 组件变为可动画化组件。用于创建 `Animated.View` 等。

---

### `attachNativeEvent`

用于将动画值以命令式 API 绑定到视图上的事件。若可能，优先使用带有 `useNativeDriver: true` 的 `Animated.event`。
