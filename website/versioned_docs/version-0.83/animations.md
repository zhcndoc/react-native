---
id: animations
title: 动画
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

动画对于创造出色的用户体验非常重要。静止的对象在开始移动时必须克服惯性。运动中的对象具有动量，通常不会立即停止。动画可以让你在界面中传达出符合物理规律、令人信服的运动效果。

React Native 提供了两套互补的动画系统：[`Animated`](animations#animated-api)，用于对特定值进行细粒度且交互式的控制；以及 [`LayoutAnimation`](animations#layoutanimation-api)，用于全局布局事务的动画效果。

## `Animated` API

[`Animated`](animated) API 旨在以高性能的方式简洁地表达各种有趣的动画和交互模式。`Animated` 关注输入和输出之间的声明式关系，在中间提供可配置的转换，并通过 `start`/`stop` 方法控制基于时间的动画执行。

`Animated` 导出六种可做动画的组件类型：`View`、`Text`、`Image`、`ScrollView`、`FlatList` 和 `SectionList`，但你也可以使用 `Animated.createAnimatedComponent()` 创建自己的组件。

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
    <Animated.View // 特殊的可动画 View
      style={{
        ...props.style,
        opacity: fadeAnim, // 将透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 之后你就可以在组件中用 `FadeInView` 代替 `View`：
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
          淡入中
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
    <Animated.View // 特殊的可动画 View
      style={{
        ...props.style,
        opacity: fadeAnim, // 将透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 之后你就可以在组件中用 `FadeInView` 代替 `View`：
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
          淡入中
        </Text>
      </FadeInView>
    </View>
  );
};
```

</TabItem>
</Tabs>

让我们来拆解这里发生了什么。在 `FadeInView` 的 render 方法中，使用 `useRef` 初始化了一个名为 `fadeAnim` 的新的 `Animated.Value`。`View` 上的 opacity 属性映射到了这个动画值。其内部会提取这个数值，并用它来设置 opacity。

当组件挂载时，opacity 会被设为 0。然后会在 `fadeAnim` 动画值上启动一个 easing 动画，在值动画到最终值 1 的过程中，它会在每一帧更新所有依赖它的映射关系（在这里仅仅是 opacity）。

这样做的优化方式比调用 `setState` 并重新渲染更快。由于整个配置都是声明式的，我们将能够实现进一步优化，把配置序列化并在高优先级线程上运行动画。

### 配置动画

动画具有很高的可配置性。自定义和预定义的缓动函数、延迟、持续时间、衰减因子、弹簧常量等，都可以根据动画类型进行调整。

`Animated` 提供了多种动画类型，其中最常用的是 [`Animated.timing()`](animated#timing)。它支持使用各种预定义的缓动函数之一在一段时间内为某个值添加动画，你也可以使用自己的缓动函数。缓动函数通常用于动画中，以传达对象逐渐加速和减速的效果。

默认情况下，`timing` 会使用一种 easeInOut 曲线，表现为逐渐加速到全速，并在结束时逐渐减速直至停止。你可以通过传入 `easing` 参数来指定不同的缓动函数。它也支持自定义 `duration`，甚至支持在动画开始前设置 `delay`。

例如，如果我们想创建一个持续 2 秒的动画，让对象先轻微后退，然后再移动到最终位置：

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

动画可以组合并按顺序或并行播放。顺序动画可以在前一个动画结束后立即播放，也可以在指定延迟后开始。`Animated` API 提供了若干方法，例如 `sequence()` 和 `delay()`，每个方法都接受一个要执行的动画数组，并在需要时自动调用 `start()`/`stop()`。

例如，下面的动画会先平滑减速至停止，然后以并行方式弹回并旋转：

```tsx
Animated.sequence([
  // 先衰减，再弹回起点并旋转
  Animated.decay(position, {
    // 平滑减速至停止
    velocity: {x: gestureState.vx, y: gestureState.vy}, // 来自手势释放时的速度
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
]).start(); // 启动这个顺序动画组
```

如果某个动画停止或被中断，那么组中的所有其他动画也会停止。`Animated.parallel` 有一个 `stopTogether` 选项，可以设置为 `false` 来禁用这一行为。

你可以在 `Animated` API 参考中的 [组合动画](animated#composing-animations) 部分找到完整的方法列表。

### 组合动画值

你可以通过加法、乘法、除法或取模来[组合两个动画值](animated#combining-animated-values)，从而创建一个新的动画值。

某些情况下，一个动画值需要在计算时反转另一个动画值。一个例子是反转缩放比例（2x --> 0.5x）：

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### 插值

每个属性都可以先通过插值处理。插值会将输入区间映射到输出区间，通常使用线性插值，但也支持缓动函数。默认情况下，它会在给定区间之外外推曲线，但你也可以让它将输出值限制住。

一个将 0-1 范围映射到 0-100 范围的基本示例如下：

```tsx
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

例如，你可能希望将 `Animated.Value` 看作从 0 变化到 1，但把位置从 150px 动画到 0px，同时把透明度从 0 动画到 1。这可以通过像下面这样修改上面的 `style` 来实现：

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

[`interpolate()`](animated#interpolate) 也支持多个区间段，这对于定义死区和其他巧妙技巧非常有用。例如，要得到一个在 -300 时为负、在 -100 时回到 0、然后在 0 时回到 1、再在 100 时回到 0，并且在此之后保持为 0 的死区关系，你可以这样做：

```tsx
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

它会像这样映射：

```
输入 | 输出
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

`interpolate()` 也支持映射为字符串，因此你既可以对颜色进行动画，也可以对带单位的值进行动画。例如，如果你想为旋转添加动画，可以这样做：

```tsx
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` 也支持任意缓动函数，其中许多已经在 [`Easing`](easing) 模块中实现。`interpolate()` 还可以对 `outputRange` 的外推行为进行配置。你可以通过设置 `extrapolate`、`extrapolateLeft` 或 `extrapolateRight` 选项来指定外推方式。默认值是 `extend`，但你也可以使用 `clamp` 来防止输出值超过 `outputRange`。

### 跟踪动态值

通过将动画的 `toValue` 设置为另一个动画值，而不是普通数字，动画值也可以跟踪其他值。例如，类似 Messenger 在 Android 上使用的 “Chat Heads” 动画，可以用一个固定在另一个动画值上的 `spring()` 来实现，或者用 `duration` 为 0 的 `timing()` 来实现刚性跟踪。它们也可以与插值组合使用：

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

`leader` 和 `follower` 这两个动画值会使用 `Animated.ValueXY()` 实现。`ValueXY` 是处理二维交互（如平移或拖拽）的便捷方式。它是一个基础包装器，内部包含两个 `Animated.Value` 实例以及一些可调用它们的辅助函数，在很多情况下都能直接替代 `Value`。它让我们能够在上面的示例中同时跟踪 x 和 y 值。

### 跟踪手势

平移或滚动等手势以及其他事件，可以使用 [`Animated.event`](animated#event) 直接映射到动画值。这是通过结构化的映射语法完成的，因此可以从复杂的事件对象中提取值。第一层是一个数组，用于支持跨多个参数的映射，而该数组中包含嵌套对象。

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

下面的示例实现了一个横向滚动的轮播图，其滚动位置指示器使用了 `ScrollView` 中的 `Animated.event` 进行动画处理

#### 使用 Animated Event 的 ScrollView 示例

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

当使用 `PanResponder` 时，你可以使用下面的代码从 `gestureState.dx` 和 `gestureState.dy` 中提取 x 和 y 位置。我们在数组的第一个位置使用 `null`，因为我们只关心传递给 `PanResponder` 处理器的第二个参数，也就是 `gestureState`。

```tsx
onPanResponderMove={Animated.event(
  [null, // 忽略原生事件
  // 从 gestureState 中提取 dx 和 dy
  // 类似于 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

#### 使用 Animated Event 的 PanResponder 示例

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
      <Text style={styles.titleText}>拖动并松开这个方块！</Text>
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

你可能会注意到，在动画过程中没有明显的方法来读取当前值。这是因为由于优化，值可能只会在原生运行时中得知。如果你需要根据当前值运行 JavaScript，有两种方法：

- `spring.stopAnimation(callback)` 会停止动画，并使用最终值调用 `callback`。这在处理手势过渡时很有用。
- `spring.addListener(callback)` 会在动画运行时异步调用 `callback`，提供一个最近的值。这对于触发状态变化很有用，例如当用户把一个 bobble 拖到更接近某个选项时，让它“吸附”到新选项，因为这类较大的状态变化相比像平移这类需要以 60 fps 运行的连续手势而言，对几帧延迟没那么敏感。

`Animated` 的设计目标是完全可序列化，因此动画可以以高性能方式运行，并独立于正常的 JavaScript 事件循环。这确实会影响 API，所以当某些操作相比完全同步系统显得更难实现时，请记住这一点。你可以查看 `Animated.Value.addListener` 作为绕过这些限制的一种方式，但请谨慎使用，因为这在未来可能会带来性能影响。

### 使用原生驱动

`Animated` API 的设计目标是可序列化。通过使用[原生驱动](/blog/2017/02/14/using-native-driver-for-animated)，我们会在动画开始前把与动画相关的一切发送到原生端，使原生代码能够在 UI 线程上执行动画，而无需在每一帧都经过 bridge。动画开始后，即使 JS 线程被阻塞，也不会影响动画。

对普通动画使用原生驱动，只需在启动动画时的配置中设置 `useNativeDriver: true` 即可。不带 `useNativeDriver` 属性的动画出于历史原因默认值为 false，但会发出警告（在 TypeScript 中还会报类型检查错误）。

```tsx
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- 将其设为 true
}).start();
```

动画值只能兼容一种驱动，因此如果你在某个值上使用原生驱动启动了一个动画，请确保该值上的每个动画也都使用原生驱动。

原生驱动也适用于 `Animated.event`。这对于跟随滚动位置的动画尤其有用，因为如果不使用原生驱动，由于 React Native 的异步特性，动画总会比手势慢一帧。

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

你可以通过运行 [RNTester app](https://github.com/facebook/react-native/blob/main/packages/rn-tester/)，然后加载 Native Animated Example 来查看原生驱动的实际效果。你也可以查看 [源代码](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js) 来了解这些示例是如何生成的。

#### 注意事项

并非你能用 `Animated` 做的所有事情目前都支持原生驱动。主要限制是你只能为非布局属性添加动画：像 `transform` 和 `opacity` 这样的属性可以工作，但 Flexbox 和定位属性则不行。使用 `Animated.event` 时，它只能用于直接事件，而不能用于冒泡事件。这意味着它不能与 `PanResponder` 一起工作，但可以用于像 `ScrollView#onScroll` 这样的场景。

当动画运行时，它可能会阻止 `VirtualizedList` 组件渲染更多行。如果你需要在用户滚动列表时运行一个较长或循环的动画，可以在动画配置中使用 `isInteraction: false` 来避免这个问题。

### 另外请注意

在使用 `rotateY`、`rotateX` 等变换样式时，请确保 transform 样式中的 `perspective` 已设置到位。目前某些动画如果没有它，可能无法在 Android 上渲染。下面是示例。

```tsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // 如果没有这一行，这个动画在 Android 上将无法渲染，但在 iOS 上运行正常
    ],
  }}
/>
```

### 更多示例

RNTester app 中有多个 `Animated` 的使用示例：

- [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
- [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)

## `LayoutAnimation` API

`LayoutAnimation` 允许你全局配置 `create` 和 `update` 动画，这些动画会在下一次渲染/布局周期中用于所有视图。这对于在不需要测量或计算具体属性的情况下执行 Flexbox 布局更新、并直接为这些变化添加动画非常有用；当布局变化可能影响祖先节点时，它尤其有用，例如“查看更多”的展开会同时增大父容器的尺寸并推动下方的行向下移动，而这通常需要组件之间显式协调，才能让它们同步动画。

请注意，尽管 `LayoutAnimation` 非常强大且很有用，但它提供的控制远少于 `Animated` 和其他动画库，因此如果你无法让 `LayoutAnimation` 实现你想要的效果，可能需要使用其他方案。

请注意，为了让它在 **Android** 上正常工作，你需要通过 `UIManager` 设置以下标志：

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

这个示例使用了一个预设值，你可以根据需要自定义动画，更多信息请参见 [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js)。

## 其他说明

### `requestAnimationFrame`

`requestAnimationFrame` 是一个来自浏览器的 polyfill，你可能已经很熟悉了。它接受一个函数作为唯一参数，并在下一次重绘之前调用该函数。它是动画的重要基础构件，支撑着所有基于 JavaScript 的动画 API。通常情况下，你不需要自己调用它——动画 API 会为你管理帧更新。

### `setNativeProps`

如 [直接操作部分](legacy/direct-manipulation) 中所述，`setNativeProps` 允许我们直接修改原生承载组件（即实际由原生视图承载的组件，而不是组合组件）的属性，而不必通过 `setState` 重新渲染组件层级。

我们可以在 Rebound 示例中使用它来更新缩放——如果我们要更新的组件嵌套很深，并且尚未通过 `shouldComponentUpdate` 做优化，这可能会很有帮助。

如果你发现动画出现掉帧（每秒帧数低于 60），可以考虑使用 `setNativeProps` 或 `shouldComponentUpdate` 来优化它们。或者你也可以使用 [useNativeDriver 选项](/blog/2017/02/14/using-native-driver-for-animated) 将动画运行在 UI 线程而不是 JavaScript 线程上。你还可以使用 [InteractionManager](interactionmanager) 将任何计算密集型工作推迟到动画完成之后。你可以通过应用内开发菜单中的 “FPS Monitor” 工具来监控帧率。
