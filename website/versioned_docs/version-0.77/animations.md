---
id: animations
title: 动画
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

动画对于创造极佳的用户体验非常重要。静止的物体开始移动时必须克服惯性。运动中的物体具有动量，很少立即停止。动画允许你在界面中传达物理上可信的运动。

React Native 提供了两个互补的动画系统：[`Animated`](animations#animated-api) 用于对特定值进行粒度和交互式控制，[`LayoutAnimation`](animations#layoutanimation-api) 用于动画全局布局事务。

## `Animated` API

[`Animated`](animated) API 旨在以高性能的方式简洁地表达各种有趣的动画和交互模式。`Animated` 专注于输入和输出之间的声明式关系，中间可配置变换，并通过 `start`/`stop` 方法控制基于时间的动画执行。

`Animated` 导出六种可动画组件类型：`View`、`Text`、`Image`、`ScrollView`、`FlatList` 和 `SectionList`，但你也可以使用 `Animated.createAnimatedComponent()` 创建你自己的组件。

例如，一个挂载时淡入的容器视图可能看起来像这样：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer ext=js
import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 不透明度的初始值：0

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
        opacity: fadeAnim, // 将不透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 然后你可以在组件中使用 `FadeInView` 代替 `View`：
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
          Fading in
        </Text>
      </FadeInView>
    </View>
  );
};
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer ext=tsx
import React, {useEffect, useRef, type PropsWithChildren} from 'react';
import {Animated, Text, View, type ViewStyle} from 'react-native';

type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView: React.FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 不透明度的初始值：0

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
        opacity: fadeAnim, // 将不透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 然后你可以在组件中使用 `FadeInView` 代替 `View`：
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
          Fading in
        </Text>
      </FadeInView>
    </View>
  );
};
```

</TabItem>
</Tabs>

让我们分解一下这里发生了什么。在 `FadeInView` 渲染方法中，一个新的 `Animated.Value`  called `fadeAnim` 使用 `useRef` 初始化。`View` 的不透明度属性映射到这个动画值。幕后，数值被提取并用于设置不透明度。

当组件挂载时，不透明度设置为 0。然后，在 `fadeAnim` 动画值上启动缓动动画，随着值动画化为最终值 1，它将在每一帧更新其所有依赖映射（在本例中，仅不透明度）。

这是以一种优化的方式完成的，比调用 `setState` 和重新渲染更快。因为整个配置是声明式的，我们将能够实现进一步的优化，序列化配置并在高优先级线程上运行动画。

### 配置动画

动画是高度可配置的。自定义和预定义的缓动函数、延迟、持续时间、衰减因子、弹簧常数等都可以根据动画类型进行调整。

`Animated` 提供了几种动画类型，最常用的是 [`Animated.timing()`](animated#timing)。它支持使用各种预定义的缓动函数或你自己的函数随时间动画化一个值。缓动函数通常用于动画中以传达物体的逐渐加速和减速。

默认情况下，`timing` 将使用 easeInOut 曲线，传达逐渐加速到全速并通过逐渐减速至停止来结束。你可以通过传递 `easing` 参数来指定不同的缓动函数。还支持自定义 `duration` 甚至在动画开始前设置 `delay`。

例如，如果我们想创建一个 2 秒长的动画，物体在移动到最终位置之前稍微后退：

```tsx
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

查看 `Animated` API 参考的 [配置动画](animated#configuring-animations) 部分，了解有关内置动画支持的所有配置参数的更多信息。

### 组合动画

动画可以组合并按顺序或并行播放。顺序动画可以在上一个动画完成后立即播放，或者在指定延迟后开始。`Animated` API 提供了几种方法，例如 `sequence()` 和 `delay()`，每种方法都接受一个要执行的动画数组，并根据需要自动调用 `start()`/`stop()`。

例如，以下动画滑行至停止，然后旋转着弹回：

```tsx
Animated.sequence([
  // 衰减，然后弹簧回起点并旋转
  Animated.decay(position, {
    // 滑行至停止
    velocity: {x: gestureState.vx, y: gestureState.vy}, // 来自手势释放的速度
    deceleration: 0.997,
    useNativeDriver: true,
  }),
  Animated.parallel([
    // 衰减后，并行：
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
]).start(); // 启动序列组
```

如果一个动画停止或中断，则组中的所有其他动画也会停止。`Animated.parallel` 有一个 `stopTogether` 选项，可以设置为 `false` 以禁用此功能。

你可以在 `Animated` API 参考的 [组合动画](animated#composing-animations) 部分找到组合方法的完整列表。

### 组合动画值

你可以通过加法、乘法、除法或取模 [组合两个动画值](animated#combining-animated-values) 来制作一个新的动画值。

在某些情况下，动画值需要反转另一个动画值进行计算。一个例子是反转缩放（2x --> 0.5x）：

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### 插值

每个属性都可以先经过插值处理。插值将输入范围映射到输出范围，通常使用线性插值，但也支持缓动函数。默认情况下，它将外推给定范围之外的曲线，但你也可以让它限制输出值。

将 0-1 范围转换为 0-100 范围的基本映射如下：

```tsx
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

例如，你可能希望将 `Animated.Value` 视为从 0 到 1，但将位置从 150px 动画化到 0px，不透明度从 0 到 1。这可以通过修改上面示例中的 `style` 来完成，如下所示：

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

[`interpolate()`](animated#interpolate) 还支持多个范围段，这对于定义死区和其他有用的技巧很方便。例如，为了在 -300 处获得否定关系，在 -100 处变为 0，然后在 0 处回到 1，然后在 100 处回到 0，随后是一个死区，对于超出该范围的所有内容保持为 0，你可以这样做：

```tsx
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

映射关系如下：

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

`interpolate()` 还支持映射到字符串，允许你动画化颜色以及带单位的值。例如，如果你想动画化旋转，你可以这样做：

```tsx
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` 还支持任意缓动函数，其中许多已在 [`Easing`](easing) 模块中实现。`interpolate()` 还具有用于外推 `outputRange` 的可配置行为。你可以通过设置 `extrapolate`、`extrapolateLeft` 或 `extrapolateRight` 选项来设置外推。默认值是 `extend`，但你可以使用 `clamp` 来防止输出值超出 `outputRange`。

### 跟踪动态值

动画值也可以通过将动画的 `toValue` 设置为另一个动画值而不是普通数字来跟踪其他值。例如，像 Android 上的 Messenger 使用的"Chat Heads"动画可以使用固定在另一个动画值上的 `spring()` 实现，或者使用 `timing()` 和 `duration` 为 0 进行刚性跟踪。它们也可以与插值组合：

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

`leader` 和 `follower` 动画值将使用 `Animated.ValueXY()` 实现。`ValueXY` 是处理 2D 交互（如平移或拖动）的便捷方法。它是一个基本包装器，包含两个 `Animated.Value` 实例和一些辅助函数调用它们，使 `ValueXY` 在许多情况下成为 `Value` 的直接替代品。它允许我们在上面的示例中跟踪 x 和 y 值。

### 跟踪手势

手势（如平移或滚动）和其他事件可以使用 [`Animated.event`](animated#event) 直接映射到动画值。这是通过结构化映射语法完成的，以便可以从复杂事件对象中提取值。第一级是数组，允许跨多个参数映射，该数组包含嵌套对象。

例如，当处理水平滚动手势时，你将执行以下操作以将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

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

以下示例实现了一个水平滚动轮播，其中滚动位置指示器使用 `ScrollView` 中使用的 `Animated.event` 进行动画化

#### 带有 Animated Event 示例的 ScrollView

```SnackPlayer name=Animated&supportedPlatforms=ios,android
import React from 'react';
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

当使用 `PanResponder` 时，你可以使用以下代码从 `gestureState.dx` 和 `gestureState.dy` 提取 x 和 y 位置。我们在数组的第一个位置使用 `null`，因为我们只对传递给 `PanResponder` 处理程序的第二个参数感兴趣，即 `gestureState`。

```tsx
onPanResponderMove={Animated.event(
  [null, // 忽略原生事件
  // 从 gestureState 提取 dx 和 dy
  // 类似于 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

#### 带有 Animated Event 示例的 PanResponder

```SnackPlayer name=Animated
import React, {useRef} from 'react';
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
      <Text style={styles.titleText}>Drag & Release this box!</Text>
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

你可能注意到没有明确的方法可以在动画进行时读取当前值。这是因为由于优化，值可能只在原生运行时已知。如果你需要响应当前值运行 JavaScript，有两种方法：

- `spring.stopAnimation(callback)` 将停止动画并使用最终值调用 `callback`。这在进行手势过渡时很有用。
- `spring.addListener(callback)` 将在动画运行时异步调用 `callback`，提供最近值。这对于触发状态更改很有用，例如当用户将滑块拖动得更近时将其捕捉到新选项，因为这些较大的状态更改对几帧的延迟不太敏感，而像平移这样的连续手势需要以 60 fps 运行。

`Animated` 设计为完全可序列化，以便动画可以以高性能方式运行，独立于正常的 JavaScript 事件循环。这确实影响了 API，所以当与完全同步的系统相比，做一些事情似乎有点棘手时，请记住这一点。查看 `Animated.Value.addListener` 作为一种绕过这些限制的方法，但请谨慎使用，因为它将来可能会有性能影响。

### 使用原生驱动

`Animated` API 设计为可序列化的。通过使用 [原生驱动](/blog/2017/02/14/using-native-driver-for-animated)，我们在启动动画之前将有关动画的所有内容发送到原生，允许原生代码在 UI 线程上执行动画，而无需在每一帧都通过桥接。一旦动画开始，JS 线程可以被阻塞而不影响动画。

通过使用原生驱动进行普通动画，可以在启动动画时在动画配置中设置 `useNativeDriver: true` 来完成。没有 `useNativeDriver` 属性的动画将出于历史原因默认为 false，但会发出警告（并在 TypeScript 中产生类型检查错误）。

```tsx
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- 将此设置为 true
}).start();
```

动画值仅兼容一个驱动，因此如果你在值上启动动画时使用原生驱动，请确保该值上的每个动画也使用原生驱动。

原生驱动也适用于 `Animated.event`。这对于跟随滚动位置的动画特别有用，因为如果没有原生驱动，由于 React Native 的异步性质，动画将始终比手势落后一帧。

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
    {useNativeDriver: true}, // <-- 将此设置为 true
  )}>
  {content}
</Animated.ScrollView>
```

你可以通过运行 [RNTester 应用](https://github.com/facebook/react-native/blob/main/packages/rn-tester/) 然后加载原生动画示例来查看原生驱动的实际效果。你还可以查看 [源代码](https://github.com/facebook/react-native/blob/master/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js) 以了解这些示例是如何制作的。

#### 注意事项

并非所有你能用 `Animated` 做的事情目前都受原生驱动支持。主要限制是你只能动画化非布局属性：像 `transform` 和 `opacity` 这样的属性将起作用，但 Flexbox 和位置属性将不起作用。当使用 `Animated.event` 时，它仅适用于直接事件而不适用于冒泡事件。这意味着它不适用于 `PanResponder`，但适用于 `ScrollView#onScroll` 之类的事情。

当动画运行时，它可以阻止 `VirtualizedList` 组件渲染更多行。如果你需要在用户滚动列表时运行长或循环动画，你可以在动画配置中使用 `isInteraction: false` 来防止此问题。

### 记住

在使用 `rotateY`、`rotateX` 等变换样式时，确保变换样式 `perspective` 就位。此时某些动画在没有它的情况下可能无法在 Android 上渲染。示例如下。

```tsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // 没有这一行，此动画在 Android 上将无法渲染，而在 iOS 上工作正常
    ],
  }}
/>
```

### 其他示例

RNTester 应用有各种 `Animated` 的使用示例：

- [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
- [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)

## `LayoutAnimation` API

`LayoutAnimation` 允许你全局配置 `create` 和 `update` 动画，这些动画将用于下一次渲染/布局周期中的所有视图。这对于进行 Flexbox 布局更新非常有用，无需费力测量或计算特定属性以便直接对它们进行动画处理，并且当布局变化可能影响祖先组件时特别有用，例如一个“查看更多”的展开操作，它也会增加父组件的大小并将下方的行推下，否则这将需要组件之间的显式协调以便同步动画。

请注意，虽然 `LayoutAnimation` 非常强大且相当有用，但它提供的控制力远少于 `Animated` 和其他动画库，因此如果无法让 `LayoutAnimation` 实现你想要的效果，你可能需要使用其他方法。

请注意，为了让它在 **Android** 上工作，你需要通过 `UIManager` 设置以下标志：

```tsx
UIManager.setLayoutAnimationEnabledExperimental(true);
```

```SnackPlayer name=LayoutAnimations&supportedPlatforms=ios,android
import React, {useState} from 'react';
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
    // 动画更新
    LayoutAnimation.spring();
    setState({w: state.w + 15, h: state.h + 15});
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.box, {width: state.w, height: state.h}]}
      />
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

此示例使用了预设值，你可以根据需要自定义动画，请参阅 [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js) 获取更多信息。

## 附加说明

### `requestAnimationFrame`

`requestAnimationFrame` 是一个你可能熟悉的来自浏览器的 polyfill。它接受一个函数作为唯一参数，并在下一次重绘之前调用该函数。它是动画的基本构建块，是所有基于 JavaScript 的动画 API 的基础。通常情况下，你不需要自己调用它——动画 API 会为你管理帧更新。

### `setNativeProps`

正如 [直接操作部分](legacy/direct-manipulation) 中提到的，`setNativeProps` 允许我们直接修改原生支持组件的属性（实际上是原生视图支持的组件，不同于复合组件），而无需 `setState` 和重新渲染组件层次结构。

我们可以在 Rebound 示例中使用它来更新 scale——如果我们更新的组件嵌套很深且未通过 `shouldComponentUpdate` 进行优化，这可能会很有帮助。

如果你发现动画掉帧（性能低于每秒 60 帧），请考虑使用 `setNativeProps` 或 `shouldComponentUpdate` 来优化它们。或者你可以 [使用 useNativeDriver 选项](/blog/2017/02/14/using-native-driver-for-animated) 在 UI 线程而不是 JavaScript 线程上运行动画。你可能还希望使用 [InteractionManager](interactionmanager) 将任何计算密集型工作推迟到动画完成后。你可以使用应用内开发菜单中的 "FPS Monitor" 工具来监控帧率。
