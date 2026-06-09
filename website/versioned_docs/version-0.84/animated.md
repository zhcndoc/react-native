---
id: animated
title: 动画（Animated）
---

`Animated` 库旨在使动画构建流畅、高效且轻松维护。`Animated` 关注输入与输出之间的声明式关系，中间可配置的变换，以及用于控制基于时间的动画执行的 `start`/`stop` 方法。

创建动画的核心流程是创建一个 `Animated.Value`，将其连接到动画组件的一个或多个样式属性上，然后通过使用 `Animated.timing()` 来驱动动画更新。

:::note
不要直接修改动画值。你可以使用 [`useRef` Hook](https://react.dev/reference/react/useRef) 返回一个可变的 ref 对象，该对象的 `current` 属性会被初始化为给定参数并在组件整个生命周期内保持不变。
:::

## 示例

下面的示例包含一个 `View`，它将基于动画值 `fadeAnim` 进行淡入和淡出。

```SnackPlayer name=Animated%20Example
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Animated, Text, View, StyleSheet, Button} from 'react-native';

const App = () => {
  // fadeAnim 将用作透明度的值。初始值：0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // 在 5 秒内将 fadeAnim 的值变为 1
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // 在 3 秒内将 fadeAnim 的值变为 0
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
              // 绑定透明度到动画值
              opacity: fadeAnim,
            },
          ]}>
          <Text style={styles.fadingText}>淡出视图！</Text>
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

请参阅 [动画](animations#animated-api) 指南，查看更多 `Animated` 的应用示例。

## 概述

你可以使用 `Animated` 的两种值类型：

- [`Animated.Value()`](animated#value) 用于单个值
- [`Animated.ValueXY()`](animated#valuexy) 用于二维向量

`Animated.Value` 可以绑定到样式属性或其他属性，并且可以进行插值。一个单一的 `Animated.Value` 可以驱动任意数量的属性。

### 配置动画

`Animated` 提供三种动画类型。每种动画类型提供特定的动画曲线，控制值从初始值到最终值的动画变化：

- [`Animated.decay()`](animated#decay) 从初速度开始，逐渐减速至停止。
- [`Animated.spring()`](animated#spring) 提供基本的弹簧物理模型。
- [`Animated.timing()`](animated#timing) 使用 [缓动函数](easing) 随时间对值进行动画。

在大多数情况下，你会使用 `timing()`。默认情况下，它使用对称的 easeInOut 曲线，模拟物体逐渐加速到最大速度，然后逐渐减速停止的过程。

### 使用动画

动画通过调用动画对象的 `start()` 启动。`start()` 接受一个完成回调函数，当动画执行完毕时调用。如果动画正常结束，回调会接收到 `{finished: true}`。如果动画是因为调用了 `stop()`（例如被手势或另一个动画中断）而提前结束，回调会接收到 `{finished: false}`。

```tsx
Animated.timing({}).start(({finished}) => {
  /* 完成回调 */
});
```

### 使用原生驱动

使用原生驱动时，动画的所有信息会先发送到原生层，然后由原生代码在 UI 线程执行动画，无需在每一帧都通过桥接调用 JS 线程。这样动画启动后，即使 JS 线程被阻塞，也不会影响动画表现。

你可以通过在动画配置中指定 `useNativeDriver: true` 来使用原生驱动。更多信息可见 [动画](animations#using-the-native-driver) 指南。

### 可动画组件

只有可动画组件才能被动画化。这些组件负责将动画值绑定到属性，并进行针对性的原生更新，避免每帧都进行 React 的渲染和协调过程。它们还会在卸载时进行清理，默认情况下是安全的。

- [`createAnimatedComponent()`](animated#createanimatedcomponent) 可用于使组件支持动画。

`Animated` 通过上述包装导出以下可动画组件：

- `Animated.Image`
- `Animated.ScrollView`
- `Animated.Text`
- `Animated.View`
- `Animated.FlatList`
- `Animated.SectionList`

### 组合动画

动画也可以通过组合函数以复杂的方式组合：

- [`Animated.delay()`](animated#delay) 延迟一段时间后启动动画。
- [`Animated.parallel()`](animated#parallel) 同时启动多个动画。
- [`Animated.sequence()`](animated#sequence) 按顺序启动动画，等待一个完成后再启动下一个。
- [`Animated.stagger()`](animated#stagger) 按顺序启动动画，且各动画间有延迟，实现错落效果。

动画还可以通过将一个动画的 `toValue` 设置为另一个 `Animated.Value` 实现链式动画。更多请参见动画指南中 [动态值跟踪](animations#tracking-dynamic-values)。

默认情况下，如果其中一个动画被停止或中断，组内所有动画都会停止。

### 组合动画值

你可以通过加、减、乘、除或取模操作将两个动画值组合成为新的动画值：

- [`Animated.add()`](animated#add)
- [`Animated.subtract()`](animated#subtract)
- [`Animated.divide()`](animated#divide)
- [`Animated.modulo()`](animated#modulo)
- [`Animated.multiply()`](animated#multiply)

### 插值

`interpolate()` 函数允许将输入范围映射到不同的输出范围。默认情况下，会对超出范围的值进行外推，也可以设置为限制输出值。默认使用线性插值，也支持缓动函数。

- [`interpolate()`](animatedvalue#interpolate)

更多插值内容请见 [动画](animations#interpolation) 指南。

### 处理手势和其他事件

手势（如平移或滚动）和其他事件可通过 `Animated.event()` 直接映射到动画值。该方法使用结构化映射语法，从复杂事件对象中提取值。第一层是数组，支持映射多个参数，数组中包含嵌套对象。

- [`Animated.event()`](animated#event)

例如，处理横向滚动手势时，可以将 `event.nativeEvent.contentOffset.x` 映射给 `scrollX`（一个 `Animated.Value`）：

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

当传入的是 ValueXY 而非 Value 时，每个配置选项可为形式为 `{x: ..., y: ...}` 的向量，而非标量。

### `decay()`

```tsx
static decay(value, config): CompositeAnimation;
```

根据衰减系数，从初始速度开始使值动画到零。

配置对象可用选项：

- `velocity`：初速度。必填。
- `deceleration`：衰减率。默认 0.997。
- `isInteraction`：此动画是否创建 `InteractionManager` 的“交互句柄”。默认 true。
- `useNativeDriver`：是否使用原生驱动。必填。

---

### `timing()`

```tsx
static timing(value, config): CompositeAnimation;
```

沿定时缓动曲线对值进行动画。[`Easing`](easing) 模块内置大量预设的曲线，也可自定义函数。

配置对象可用选项：

- `duration`：动画时长（毫秒）。默认 500。
- `easing`：缓动函数定义曲线。默认是 `Easing.inOut(Easing.ease)`。
- `delay`：动画开始前延迟（毫秒）。默认 0。
- `isInteraction`：此动画是否创建 `InteractionManager` 的“交互句柄”。默认 true。
- `useNativeDriver`：是否使用原生驱动。必填。

---

### `spring()`

```tsx
static spring(value, config): CompositeAnimation;
```

基于 [阻尼谐振动](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator) 的解析弹簧模型，使值动画。追踪速度状态，以支持平滑运动和对 `toValue` 更新的连续响应，并可链式调用。

配置对象可用选项说明：

你只能定义以下三组参数中的一组，不能多组同时定义：

- 弹性/速度（bounciness/speed）
- 张力/摩擦（tension/friction）
- 刚度/阻尼/质量（stiffness/damping/mass）

张力/摩擦或弹性/速度选项对应于 [`Facebook Pop`](https://github.com/facebook/pop)、[Rebound](https://github.com/facebookarchive/rebound)、[Origami](https://origami.design/) 中的弹簧模型。

- `friction`: 控制反弹/超越量。默认 7。
- `tension`: 控制速度。默认 40。
- `speed`: 控制动画速度。默认 12。
- `bounciness`: 控制弹性。默认 8。

指定刚度/阻尼/质量参数时，`Animated.spring` 使用基于阻尼谐振动运动方程的解析弹簧模型。此行为更精确，物理表现更逼真，类似 iOS 的 CASpringAnimation 实现。

- `stiffness`: 弹簧刚度系数。默认 100。
- `damping`: 弹簧运动的摩擦阻尼。默认 10。
- `mass`: 附着弹簧末端物体的质量。默认 1。

其他配置选项：

- `velocity`: 物体的初始速度。默认 0（静止）。
- `overshootClamping`: 是否禁止反弹。默认 false。
- `restDisplacementThreshold`: 定义弹簧被视为静止时的位移阈值。默认 0.001。
- `restSpeedThreshold`: 弹簧被视为静止时的速度阈值（单位：像素/秒）。默认 0.001。
- `delay`: 动画开始延迟（毫秒）。默认 0。
- `isInteraction`: 是否创建 `InteractionManager` 的“交互句柄”。默认 true。
- `useNativeDriver`: 是否使用原生驱动。必填。

---

### `add()`

```tsx
static add(a: Animated, b: Animated): AnimatedAddition;
```

创建一个新的动画值，由两个动画值相加组成。

---

### `subtract()`

```tsx
static subtract(a: Animated, b: Animated): AnimatedSubtraction;
```

创建一个新的动画值，由第一个动画值减去第二个动画值组成。

---

### `divide()`

```tsx
static divide(a: Animated, b: Animated): AnimatedDivision;
```

创建一个新的动画值，由第一个动画值除以第二个动画值组成。

---

### `multiply()`

```tsx
static multiply(a: Animated, b: Animated): AnimatedMultiplication;
```

创建一个新的动画值，由两个动画值相乘组成。

---

### `modulo()`

```tsx
static modulo(a: Animated, modulus: number): AnimatedModulo;
```

创建一个新的动画值，为提供的动画值的（非负）取模值。

---

### `diffClamp()`

```tsx
static diffClamp(a: Animated, min: number, max: number): AnimatedDiffClamp;
```

创建一个新的动画值，限制在两个值之间。它使用上一个值的差分，即使当前值远离边界，也会在值开始靠近边界时才改变。（`value = clamp(value + diff, min, max)`）

此方法在滚动事件中非常有用，例如，向上滚动显示导航栏，向下滚动隐藏导航栏。

---

### `delay()`

```tsx
static delay(time: number): CompositeAnimation;
```

延迟指定时间后启动动画。

---

### `sequence()`

```tsx
static sequence(animations: CompositeAnimation[]): CompositeAnimation;
```

顺序启动一组动画，等待上一个完成后再启动下一个。如果当前运行的动画被停止，则后续动画不再启动。

---

### `parallel()`

```tsx
static parallel(
  animations: CompositeAnimation[],
  config?: ParallelConfig
): CompositeAnimation;
```

同时启动一组动画。默认情况下，若其中一个动画停止，所有动画都会停止。可以通过 `stopTogether` 标志覆盖此行为。

---

### `stagger()`

```tsx
static stagger(
  time: number,
  animations: CompositeAnimation[]
): CompositeAnimation;
```

组内动画可以重叠执行，但依次启动且启动时间有间隔。适合实现拖尾效果。

---

### `loop()`

```tsx
static loop(
  animation: CompositeAnimation[],
  config?: LoopAnimationConfig
): CompositeAnimation;
```

无限循环给定的动画，每次结束后重置并重新开始。如果子动画设置为 `useNativeDriver: true`，循环将不会阻塞 JS 线程。此外，循环动画可防止基于 `VirtualizedList` 的组件在动画运行时渲染更多行。你可以在子动画配置中传入 `isInteraction: false` 来避免该问题。

配置对象可用选项：

- `iterations`: 动画循环次数。默认 `-1`（无限循环）。

---

### `event()`

```tsx
static event(
  argMapping: Mapping[],
  config?: EventConfig
): (...args: any[]) => void;
```

接收映射数组，根据映射从每个参数中提取值，并调用映射输出的 `setValue`。例如：

```tsx
onScroll={Animated.event(
  [{nativeEvent: {contentOffset: {x: this._scrollX}}}],
  {listener: (event: ScrollEvent) => console.log(event)}, // 可选异步监听器
)}
...
onPanResponderMove: Animated.event(
  [
    null, // 忽略原始事件参数
    {dx: this._panX},
  ], // gestureState 参数
  {
    listener: (
      event: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => console.log(event, gestureState),
  } // 可选异步监听器
);
```

配置对象可用选项：

- `listener`: 可选异步监听器。
- `useNativeDriver`: 是否使用原生驱动。必填。

---

### `forkEvent()`

```jsx
static forkEvent(event: AnimatedEvent, listener: Function): AnimatedEvent;
```

高级命令式 API，用于在通过属性传入的动画事件上侦查。允许向已存在的 `AnimatedEvent` 添加新的 JS 监听器。如果 `animatedEvent` 本身就是 JS 监听器，将两个监听器合并为一个；如果 `animatedEvent` 为 null/undefined，直接赋值为 JS 监听器。建议尽可能直接使用值。

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

通过调用 `start()` 启动动画。`start()` 接受一个完成回调，该回调会在动画结束时调用，或在动画被调用 `stop()` 而提前终止时调用。

**参数：**

| 名称      | 类型                                    | 必填 | 说明                                                                                      |
| --------- | --------------------------------------- | ---- | ----------------------------------------------------------------------------------------- |
| callback  | `(result: {finished: boolean}) => void` | 否   | 动画正常完成或因调用 `stop()` 而提前结束时调用的函数                                     |

包含回调的启动示例：

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

停止正在运行的动画。

---

### `reset()`

```tsx
static reset();
```

停止正在运行的动画，并将值重置为初始值。

## Attributes

### `Value`

A standard value class used to drive animations. It is typically initialized with `useAnimatedValue(0);` or, in class components, with `new Animated.Value(0);`.

You can learn more about the `Animated.Value` API on a separate [page](animatedvalue).

---

### `ValueXY`

A value class used to drive two-dimensional animations, such as pan gestures.

You can learn more about the `Animated.ValueXY` API on a separate [page](animatedvaluexy).

---

### `Interpolation`

Exported for use as the Interpolation type in Flow.

---

### `Node`

Exported for type checking. All animated values inherit from this class.

---

### `createAnimatedComponent`

Makes any React component animatable. Used to create `Animated.View` and similar components.

---

### `attachNativeEvent`

An imperative API used to bind animated values to view events. Prefer `Animated.event` with `useNativeDriver: true` whenever possible.
