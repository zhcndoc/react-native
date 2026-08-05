---
id: animations
title: 动画
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

动画对于创造出色的用户体验非常重要。静止的对象在开始移动时必须克服惯性。运动中的对象具有动量，而且很少会立即停下。动画能让你在界面中传达出符合物理直觉的运动效果。

React Native 提供了两套互补的动画系统：[`Animated`](animations#animated-api) 用于对特定值进行细粒度、交互式控制，而 [`LayoutAnimation`](animations#layoutanimation-api) 用于全局布局事务的动画。

## `Animated` API

[`Animated`](animated) API 旨在以高性能且简洁的方式表达各种有趣的动画和交互模式。`Animated` 侧重于输入与输出之间的声明式关系，中间可以配置各种变换，并通过 `start`/`stop` 方法控制基于时间的动画执行。

`Animated` 导出了六种可设为动画的组件类型：`View`、`Text`、`Image`、`ScrollView`、`FlatList` 和 `SectionList`。你也可以使用 `Animated.createAnimatedComponent()` 自定义创建动画组件。

例如，一个在挂载时淡入的容器视图可能如下所示：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer ext=js
import {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 透明度的初始值：0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // 特殊的可设动画 View
      style={{
        ...props.style,
        opacity: fadeAnim, // 将透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 然后你可以在组件中用 `FadeInView` 替代 `View`：
export default () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FadeInView
        style={{
          width: 250,
          height: 50,
          backgroundColor: 'powderblue',
        }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>
          淡入
        </Text>
      </FadeInView>
    </View>
  );
};
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer ext=tsx
import {useEffect, useRef, type PropsWithChildren, type FC} from 'react';
import {Animated, Text, View, type ViewStyle} from 'react-native';

type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView: FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 透明度的初始值：0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // 特殊的可设动画 View
      style={{
        ...props.style,
        opacity: fadeAnim, // 将透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 然后你可以在组件中用 `FadeInView` 替代 `View`：
export default () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FadeInView
        style={{
          width: 250,
          height: 50,
          backgroundColor: 'powderblue',
        }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>
          淡入
        </Text>
      </FadeInView>
    </View>
  );
};
```

</TabItem>
</Tabs>

让我们拆解一下这里发生了什么。在 `FadeInView` 的渲染方法中，使用 `useRef` 初始化了一个名为 `fadeAnim` 的新 `Animated.Value`。`View` 上的 `opacity` 属性映射到了这个动画值。幕后会提取这个数值，并将其用于设置 `opacity`。

当组件挂载时，`opacity` 会被设为 0。然后会在 `fadeAnim` 动画值上启动一个缓动动画，它会在每一帧根据数值变化更新所有依赖映射（在这个例子里只有 `opacity`），直到值动画到最终值 1。

这种方式经过了优化，比调用 `setState` 并重新渲染更快。由于整个配置是声明式的，我们将来还可以实现更多优化，例如将配置序列化，并将动画运行在高优先级线程上。

### 配置动画

动画具有高度可配置性。自定义和预定义的缓动函数、延迟、时长、衰减系数、弹簧常量等，都可以根据动画类型进行调整。

`Animated` 提供了多种动画类型，其中最常用的是 [`Animated.timing()`](animated#timing)。它支持使用多种预定义缓动函数之一随时间对某个值进行动画，也可以使用你自己的缓动函数。缓动函数通常用于动画中，以传达对象逐渐加速和减速的效果。

默认情况下，`timing` 会使用一个 easeInOut 曲线，表示逐渐加速到全速，并在结束时逐渐减速至停止。你可以通过传入 `easing` 参数来指定不同的缓动函数。也支持自定义 `duration`，甚至支持动画开始前的 `delay`。

例如，如果我们想创建一个持续 2 秒的动画，让一个对象在移动到最终位置之前先轻微后退一下：

```tsx
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

请查看 `Animated` API 参考中的 [配置动画](animated#configuring-animations) 部分，了解内置动画支持的所有配置参数。

### 组合动画

动画可以组合起来按顺序或并行播放。顺序动画可以在前一个动画完成后立即播放，也可以在指定延迟后开始。`Animated` API 提供了多个方法，例如 `sequence()` 和 `delay()`，它们各自接收一个要执行的动画数组，并在需要时自动调用 `start()`/`stop()`。

例如，下面的动画先缓慢停下，然后又在旋转的同时弹回：

```tsx
Animated.sequence([
  // 先衰减，再弹回起点并旋转
  Animated.decay(position, {
    // 缓慢停下
    velocity: {x: gestureState.vx, y: gestureState.vy}, // 手势释放时的速度
    deceleration: 0.997,
    useNativeDriver: true,
  }),
  Animated.parallel([
    // 衰减之后，并行执行：
    Animated.spring(position, {
      toValue: {x: 0, y: 0}, // 返回起点
      useNativeDriver: true,
    }),
    Animated.timing(twirl, {
      // 并旋转
      toValue: 360,
      useNativeDriver: true,
    }),
  ]),
]).start(); // 启动顺序组
```

如果某个动画被停止或中断，同组中的所有其他动画也会停止。`Animated.parallel` 提供了 `stopTogether` 选项，可将其设为 `false` 来禁用这种行为。

你可以在 `Animated` API 参考中的 [组合动画](animated#composing-animations) 部分找到完整的组合方法列表。

### 组合动画值

你可以通过加法、乘法、除法或取模来 [组合两个动画值](animated#combining-animated-values) 以创建新的动画值。

有些情况下，动画值需要在计算中对另一个动画值取反。例如，反转缩放比例（2x --> 0.5x）：

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### 插值

每个属性都可以先经过插值处理。插值会将输入范围映射到输出范围，通常使用线性插值，但也支持缓动函数。默认情况下，它会对给定范围之外的曲线进行外推，但你也可以让它把输出值限制住。

一个将 0-1 范围映射为 0-100 范围的基本示例是：

```tsx
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

例如，你可能会认为 `Animated.Value` 是从 0 到 1 变化的，但把位置从 150px 动画到 0px，把透明度从 0 动画到 1。这可以通过像下面这样修改上面的 `style` 来实现：

```tsx
  style={{
    opacity: this.state.fadeAnim, // 直接绑定
    transform: [{
      translateY: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
      }),
    }],
  }}
```

[`interpolate()`](animated#interpolate) 也支持多个范围段，这对于定义死区和其他有用技巧很方便。例如，要实现一个在 -300 处取反、到 -100 时变为 0、然后在 0 时回到 1、再在 100 时回到 0，之后进入一个保持 0 的死区，你可以这样做：

```tsx
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

映射结果如下：

```
Input | Output
------|-------
  -400|    450
  -300|    300
  -200|    150
  -100|      0
   -50|    0.5
     0|      1
    50|    0.5
   100|      0
   101|      0
   200|      0
```

`interpolate()` 也支持映射为字符串，这样你既可以动画数值，也可以动画带单位的值和颜色。例如，如果你想做一个旋转动画，可以这样：

```tsx
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` 还支持任意缓动函数，其中许多已经在 [`Easing`](easing) 模块中实现。`interpolate()` 还可以对 `outputRange` 的外推行为进行配置。你可以通过设置 `extrapolate`、`extrapolateLeft` 或 `extrapolateRight` 选项来指定外推方式。默认值是 `extend`，但你可以使用 `clamp` 来防止输出值超过 `outputRange`。

### 跟踪动态值

通过将动画的 `toValue` 设置为另一个动画值而不是普通数字，动画值也可以跟踪其他值。例如，Messenger 在 Android 上使用的那种“Chat Heads”动画，可以通过固定在另一个动画值上的 `spring()` 来实现，或者使用 `duration` 为 0 的 `timing()` 来实现刚性跟踪。它们也可以与插值组合使用：

```tsx
Animated.spring(follower, {toValue: leader}).start();
Animated.timing(opacity, {
  toValue: pan.x.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
  }),
  useNativeDriver: true,
}).start();
```

`leader` 和 `follower` 这两个动画值会使用 `Animated.ValueXY()` 来实现。`ValueXY` 是处理二维交互的便捷方式，例如平移或拖拽。它本质上是一个基础封装，内部包含两个 `Animated.Value` 实例以及一些调用它们的辅助函数，因此在很多情况下可以直接替代 `Value`。它让我们能够在上面的示例中同时跟踪 x 和 y 值。

### 跟踪手势

像平移或滚动这样的手势，以及其他事件，都可以使用 [`Animated.event`](animated#event) 直接映射到动画值。这通过一种结构化的映射语法完成，因此可以从复杂的事件对象中提取值。第一层是一个数组，用于支持跨多个参数的映射，而该数组中包含嵌套对象。

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

下面的示例实现了一个水平滚动轮播，其中滚动位置指示器通过 `ScrollView` 中使用的 `Animated.event` 进行动画处理

#### 带 Animated Event 的 ScrollView 示例

```SnackPlayer name=Animated&supportedPlatforms=ios,android
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
  useAnimatedValue,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const images = new Array(6).fill(
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
);

const App = () => {
  const scrollX = useAnimatedValue(0);

  const {width: windowWidth} = useWindowDimensions();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal={true}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ])}
            scrollEventThrottle={1}>
            {images.map((image, imageIndex) => {
              return (
                <View
                  style={{width: windowWidth, height: 250}}
                  key={imageIndex}>
                  <ImageBackground source={{uri: image}} style={styles.card}>
                    <View style={styles.textContainer}>
                      <Text style={styles.infoText}>
                        {'Image - ' + imageIndex}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {images.map((image, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [8, 16, 8],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[styles.normalDot, {width}]}
                />
              );
            })}
          </View>
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
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

当使用 `PanResponder` 时，你可以使用以下代码从 `gestureState.dx` 和 `gestureState.dy` 中提取 x 和 y 位置。我们在数组的第一个位置使用 `null`，因为我们只关心传递给 `PanResponder` 处理函数的第二个参数，也就是 `gestureState`。

```tsx
onPanResponderMove={Animated.event(
  [null, // 忽略原生事件
  // 从 gestureState 提取 dx 和 dy
  // 类似于 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

#### 带 Animated Event 的 PanResponder 示例

```SnackPlayer name=Animated
import {useRef} from 'react';
import {Animated, View, StyleSheet, PanResponder, Text} from 'react-native';

const App = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>拖动并释放这个方块！</Text>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <View style={styles.box} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default App;
```

### 响应当前动画值

你可能会注意到，在动画过程中并没有明显的方法来读取当前值。这是因为由于优化，当前值可能只在原生运行时中可知。如果你需要针对当前值运行 JavaScript，有两种方式：

- `spring.stopAnimation(callback)` 会停止动画并用最终值调用 `callback`。这在处理手势过渡时很有用。
- `spring.addListener(callback)` 会在动画运行时异步调用 `callback`，提供一个最近的值。这在触发状态变化时很有用，例如当用户把一个 bobble 拖得更靠近某个选项时将其吸附过去，因为这类较大的状态变化对少量帧延迟不如像平移这类需要以 60 fps 运行的连续手势敏感。

`Animated` 的设计目标是完全可序列化，因此动画可以以高性能方式运行，而不依赖于正常的 JavaScript 事件循环。这确实会影响 API，所以当某些操作相比完全同步的系统显得更棘手时，请记住这一点。可以查看 `Animated.Value.addListener` 作为绕过这些限制的一种方式，但要谨慎使用，因为它在未来可能会带来性能影响。

### 使用原生驱动

`Animated` API 的设计目标是可序列化。通过使用 [原生驱动](/blog/2017/02/14/using-native-driver-for-animated)，我们会在动画开始前把关于动画的一切都发送到原生端，让原生代码可以在 UI 线程上执行动画，而无需在每一帧都经过桥接。动画启动后，即使 JS 线程被阻塞，也不会影响动画。

通过在启动动画时的配置中设置 `useNativeDriver: true`，就可以让普通动画使用原生驱动。不包含 `useNativeDriver` 属性的动画出于兼容历史原因会默认为 `false`，但会发出警告（在 TypeScript 中也会产生类型检查错误）。

```tsx
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- 将其设为 true
}).start();
```

动画值只能兼容一种驱动，因此如果你在启动某个值的动画时使用了原生驱动，请确保该值上的每个动画也都使用原生驱动。

原生驱动同样适用于 `Animated.event`。这对于跟随滚动位置的动画尤其有用，因为如果没有原生驱动，由于 React Native 的异步特性，动画总会比手势慢一帧。

```tsx
<Animated.ScrollView // <-- 使用 Animated ScrollView 包装器
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: this.state.animatedValue},
        },
      },
    ],
    {useNativeDriver: true}, // <-- 将其设为 true
  )}>
  {content}
</Animated.ScrollView>
```

你可以运行 [RNTester 应用](https://github.com/facebook/react-native/blob/main/packages/rn-tester/)，然后加载 Native Animated Example，来查看原生驱动的实际效果。你也可以查看 [源代码](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js) 了解这些示例是如何制作出来的。

#### 注意事项

并不是你能用 `Animated` 做到的所有事情目前都受原生驱动支持。主要限制是你只能对非布局属性进行动画：像 `transform` 和 `opacity` 这样的属性可以工作，但 Flexbox 和位置属性不行。使用 `Animated.event` 时，它只能用于直接事件，而不能用于冒泡事件。这意味着它不能与 `PanResponder` 一起工作，但可以用于诸如 `ScrollView#onScroll` 之类的场景。

当动画正在运行时，它可能会阻止 `VirtualizedList` 组件渲染更多行。如果你需要在用户滚动列表时运行一个较长或循环的动画，可以在动画配置中使用 `isInteraction: false` 来避免这个问题。

### 请记住

在使用 `rotateY`、`rotateX` 等变换样式时，请确保变换样式中的 `perspective` 已设置。目前某些动画在 Android 上如果没有它可能无法渲染。下面是示例。

```tsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // 如果没有这一行，这个动画在 Android 上将无法渲染，而在 iOS 上工作正常
    ],
  }}
/>
```

### 其他示例

RNTester 应用中有多个 `Animated` 的使用示例：

- [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
- [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)。

## `LayoutAnimation` API

`LayoutAnimation` 允许你全局配置 `create` 和 `update` 动画，这些动画会在下一次渲染/布局周期中用于所有视图。这对于进行 Flexbox 布局更新很有用，因为你无需为了直接对其进行动画而去测量或计算特定属性；当布局变化可能影响祖先组件时，它尤其有用。例如，“查看更多”展开会同时增大父组件的尺寸并把下一行向下推，这种情况原本需要组件之间显式协调，才能让它们同步执行动画。

请注意，尽管 `LayoutAnimation` 非常强大且相当有用，但它提供的控制远少于 `Animated` 和其他动画库，因此如果无法让 `LayoutAnimation` 实现你想要的效果，你可能需要采用另一种方法。

还要注意，要让它在 **Android** 上正常工作，你需要通过 `UIManager` 设置以下标志：

```tsx
UIManager.setLayoutAnimationEnabledExperimental(true);
```

```SnackPlayer name=LayoutAnimations
import {useState} from 'react';
import {
  NativeModules,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default function App() {
  const [state, setState] = useState({
    w: 100,
    h: 100,
  });

  const onPress = () => {
    // 为更新添加动画
    LayoutAnimation.spring();
    setState({w: state.w + 15, h: state.h + 15});
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, {width: state.w, height: state.h}]} />
      <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Press me!</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

此示例使用了一个预设值，你可以根据需要自定义动画；更多信息请参见 [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js)。

## 其他说明

### `requestAnimationFrame`

`requestAnimationFrame` 是一个你可能很熟悉的浏览器 polyfill。它只接受一个函数作为参数，并在下一次重绘之前调用该函数。它是动画的基础构建块，支撑着所有基于 JavaScript 的动画 API。一般来说，你不需要自己调用它——动画 API 会为你管理每一帧的更新。

### `setNativeProps`

如 [直接操作部分](legacy/direct-manipulation) 所述，`setNativeProps` 允许我们直接修改原生承载组件（也就是实际由原生视图支撑的组件，而不是复合组件）的属性，而无需通过 `setState` 重新渲染组件层级。

我们可以在 Rebound 示例中使用它来更新缩放比例——如果我们正在更新的组件嵌套很深，并且还没有通过 `shouldComponentUpdate` 做过优化，这可能会很有帮助。

如果你发现动画出现丢帧（运行速度低于每秒 60 帧）的情况，可以考虑使用 `setNativeProps` 或 `shouldComponentUpdate` 对其进行优化。或者，你可以通过 [使用 `useNativeDriver` 选项](/blog/2017/02/14/using-native-driver-for-animated) 在 UI 线程而不是 JavaScript 线程上运行动画。你还可以考虑将计算密集型工作推迟到 JS 线程空闲时执行（例如使用 `requestIdleCallback`）。你可以使用应用内开发菜单中的“FPS 监视器”工具来监控帧率。
