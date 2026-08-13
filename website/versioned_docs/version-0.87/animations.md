---
id: animations
title: 动画
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Animations 对于创建出色的用户体验非常重要。静止物体在开始移动时必须克服惯性。运动中的物体具有动量，很少会立即停止。Animations 可以让你在界面中传达符合物理规律的运动。

React Native 提供了两个互补的动画系统：用于对特定值进行细粒度和交互式控制的 [`Animated`](animations#animated-api)，以及用于动画化全局布局事务的 [`LayoutAnimation`](animations#layoutanimation-api)。

## `Animated` API

[`Animated`](animated) API 旨在以高性能的方式简洁地表达各种有趣的动画和交互模式。`Animated` 专注于输入和输出之间的声明式关系，以及中间可配置的变换，并提供 `start`／`stop` 方法来控制基于时间的动画执行。

`Animated` 导出六种可动画化的组件类型：`View`、`Text`、`Image`、`ScrollView`、`FlatList` 和 `SectionList`，但你也可以使用 `Animated.createAnimatedComponent()` 创建自己的组件。

例如，一个在挂载时淡入的容器视图可能如下所示：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer ext=js
import {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

// You can then use your `FadeInView` in place of a `View` in your components:
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
import {useEffect, useRef, type PropsWithChildren, type FC} from 'react';
import {Animated, Text, View, type ViewStyle} from 'react-native';

type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView: FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
};

// You can then use your `FadeInView` in place of a `View` in your components:
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

下面来分解一下这里发生了什么。在 `FadeInView` 的渲染方法中，使用 `useRef` 初始化了一个名为 `fadeAnim` 的新 `Animated.Value`。`View` 上的 opacity 属性被映射到这个动画值。幕后会提取这个数值，并用它来设置 opacity。

组件挂载时，opacity 被设置为 0。然后，在 `fadeAnim` 动画值上启动缓动动画；随着该值动画到最终值 1，它会在每一帧更新所有依赖于它的映射（在本例中只有 opacity）。

这种方式经过了优化，比调用 `setState` 并重新渲染更快。由于整个配置都是声明式的，我们将能够进一步优化：序列化配置，并在高优先级线程上运行动画。

### 配置动画

Animations 具有很强的可配置性。根据动画类型，可以调整自定义和预定义的缓动函数、延迟、持续时间、衰减因子、弹簧常量等。

`Animated` 提供了多种动画类型，其中最常用的是 [`Animated.timing()`](animated#timing)。它支持使用各种预定义的缓动函数之一，随时间对值进行动画处理，你也可以使用自己的缓动函数。缓动函数通常用于动画中，以传达物体逐渐加速和减速的过程。

默认情况下，`timing` 使用 easeInOut 曲线，表示逐渐加速至全速，然后逐渐减速并停止。你可以通过传入 `easing` 参数指定其他缓动函数。也支持自定义 `duration`，甚至可以设置动画开始前的 `delay`。

例如，如果我们想创建一个持续 2 秒的动画，让物体在移动到最终位置之前稍微向后退：

```tsx
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

请查看 `Animated` API 参考中的[配置动画](animated#configuring-animations)部分，详细了解内置动画支持的所有配置参数。

### 组合动画

Animations 可以组合起来按顺序或并行播放。连续动画可以在前一个动画完成后立即播放，也可以在指定延迟后开始。`Animated` API 提供了多种方法，例如 `sequence()` 和 `delay()`，这些方法都接收要执行的动画数组，并根据需要自动调用 `start()`／`stop()`。

例如，以下动画会滑行至停止，然后在旋转的同时以弹簧效果回弹：

```tsx
Animated.sequence([
  // decay, then spring to start and twirl
  Animated.decay(position, {
    // coast to a stop
    velocity: {x: gestureState.vx, y: gestureState.vy}, // velocity from gesture release
    deceleration: 0.997,
    useNativeDriver: true,
  }),
  Animated.parallel([
    // after decay, in parallel:
    Animated.spring(position, {
      toValue: {x: 0, y: 0}, // return to start
      useNativeDriver: true,
    }),
    Animated.timing(twirl, {
      // and twirl
      toValue: 360,
      useNativeDriver: true,
    }),
  ]),
]).start(); // start the sequence group
```

如果一个动画被停止或中断，组中的所有其他动画也会停止。`Animated.parallel` 有一个 `stopTogether` 选项，将其设置为 `false` 可以禁用此行为。

你可以在 `Animated` API 参考的[组合动画](animated#composing-animations)部分找到完整的组合方法列表。

### 组合动画值

你可以通过加法、乘法、除法或取模来[组合两个动画值](animated#combining-animated-values)，从而创建一个新的动画值。

有些情况下，动画值需要对另一个动画值求倒数以进行计算。例如，对缩放值求倒数（2x --> 0.5x）：

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### 插值

每个属性都可以先经过插值处理。插值会将输入范围映射到输出范围，通常使用线性插值，但也支持缓动函数。默认情况下，它会将曲线外推到给定范围之外，但你也可以将输出值限制在范围内。

将 0-1 范围转换为 0-100 范围的基本映射如下：

```tsx
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

例如，你可能希望将 `Animated.Value` 视为从 0 变为 1，但让位置从 150px 动画到 0px，同时让 opacity 从 0 动画到 1。可以像下面这样修改上例中的 `style`：

```tsx
  style={{
    opacity: this.state.fadeAnim, // Binds directly
    transform: [{
      translateY: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
      }),
    }],
  }}
```

[`interpolate()`](animated#interpolate) 也支持多个范围区段，这对于定义死区和其他实用技巧很方便。例如，要获得这样的否定关系：在 -300 处为 300，在 -100 处变为 0，然后在 0 处回升到 1，接着在 100 处降回 0，并在此之后对所有值保持为 0 的死区，你可以这样做：

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

`interpolate()` 还支持映射到字符串，因此你可以对颜色以及带单位的值进行动画处理。例如，如果你想对旋转进行动画处理，可以这样做：

```tsx
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` 还支持任意缓动函数，其中许多已经在 [`Easing`](easing) 模块中实现。`interpolate()` 还支持对 `outputRange` 进行外推时的可配置行为。你可以通过设置 `extrapolate`、`extrapolateLeft` 或 `extrapolateRight` 选项来设置外推方式。默认值是 `extend`，但你可以使用 `clamp` 来防止输出值超出 `outputRange`。

### 跟踪动态值

通过将动画的 `toValue` 设置为另一个动画值，而不是普通数字，动画值也可以跟踪其他值。例如，可以通过在另一个动画值上固定一个 `spring()`，或者使用 `timing()` 并将 `duration` 设置为 0 来实现类似 Android 上 Messenger 所使用的“Chat Heads”动画，以进行刚性跟踪。它们也可以与插值组合使用：

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

`leader` 和 `follower` 动画值将使用 `Animated.ValueXY()` 实现。`ValueXY` 是处理二维交互的便捷方式，例如平移或拖动。它是一个基本包装器，其中包含两个 `Animated.Value` 实例和一些会调用它们的辅助函数，因此在许多情况下，`ValueXY` 可以直接替代 `Value`。它使我们能够在上面的示例中同时跟踪 x 和 y 值。

### 跟踪手势

平移或滚动等手势以及其他事件，可以使用 [`Animated.event`](animated#event) 直接映射到动画值。这是通过结构化映射语法完成的，因此可以从复杂的事件对象中提取值。第一层是一个数组，用于支持跨多个参数进行映射，而该数组包含嵌套对象。

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

下面的示例实现了一个水平滚动的轮播图，其中滚动位置指示器使用 `ScrollView` 中的 `Animated.event` 进行动画处理

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

使用 `PanResponder` 时，你可以使用以下代码从 `gestureState.dx` 和 `gestureState.dy` 中提取 x 和 y 位置。我们在数组的第一个位置使用 `null`，因为我们只关心传递给 `PanResponder` 处理程序的第二个参数，也就是 `gestureState`。

```tsx
onPanResponderMove={Animated.event(
  [null, // ignore the native event
  // extract dx and dy from gestureState
  // like 'pan.x = gestureState.dx, pan.y = gestureState.dy'
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

你可能会注意到，在动画运行时，没有明显的方法可以读取当前值。这是因为由于优化的原因，该值可能只能在原生运行时中获知。如果你需要根据当前值运行 JavaScript，有两种方法：

- `spring.stopAnimation(callback)` 会停止动画，并使用最终值调用 `callback`。这在进行手势过渡时很有用
- `spring.addListener(callback)` 会在动画运行期间异步调用 `callback`，并提供一个最近的值。这适合触发状态变化，例如当用户拖动气泡使其靠近某个选项时，将气泡吸附到新的选项上，因为与需要以 60 fps 运行的平移等连续手势相比，这些较大的状态变化对几帧延迟不那么敏感

`Animated` 的设计目标是完全可序列化，从而能够以高性能的方式运行动画，并独立于常规的 JavaScript 事件循环。这确实会影响 API，因此当某些操作相比完全同步的系统更难实现时，请记住这一点。可以查看 `Animated.Value.addListener`，了解如何绕过其中一些限制，但请谨慎使用，因为它未来可能会带来性能影响。

### 使用原生驱动程序

`Animated` API 的设计是可序列化的。通过使用[原生驱动程序](/blog/2017/02/14/using-native-driver-for-animated)，我们会在动画开始前将动画的全部信息发送到原生端，从而允许原生代码在 UI 线程上执行动画，而无需每一帧都经过 bridge。动画开始后，即使 JS 线程被阻塞，也不会影响动画。

在普通动画中使用原生驱动程序，只需在启动动画时将动画配置中的 `useNativeDriver: true` 设置好即可。出于兼容旧版本的原因，没有 `useNativeDriver` 属性的动画默认值为 false，但会发出警告（在 TypeScript 中还会产生类型检查错误）。

```tsx
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- Set this to true
}).start();
```

动画值只能与一个驱动程序兼容，因此如果你在某个值上启动动画时使用了原生驱动程序，请确保该值上的每个动画也都使用原生驱动程序。

原生驱动程序也适用于 `Animated.event`。这对于跟随滚动位置的动画尤其有用，因为如果不使用原生驱动程序，由于 React Native 的异步特性，动画始终会比手势落后一帧。

```tsx
<Animated.ScrollView // <-- Use the Animated ScrollView wrapper
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: this.state.animatedValue},
        },
      },
    ],
    {useNativeDriver: true}, // <-- Set this to true
  )}>
  {content}
</Animated.ScrollView>
```

你可以运行 [RNTester 应用](https://github.com/facebook/react-native/blob/main/packages/rn-tester/)，然后加载 Native Animated Example，查看原生驱动程序的实际效果。你也可以查看[源代码](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)，了解这些示例是如何生成的。

#### 注意事项

目前并非所有可以使用 `Animated` 完成的操作都受到原生驱动程序支持。主要限制是只能对非布局属性进行动画处理：`transform` 和 `opacity` 等属性可以正常工作，但 Flexbox 和 position 属性则不行。使用 `Animated.event` 时，它只适用于直接事件，不适用于冒泡事件。这意味着它不适用于 `PanResponder`，但适用于 `ScrollView#onScroll` 等内容。

动画运行时，可能会阻止 `VirtualizedList` 组件渲染更多行。如果你需要在用户滚动列表时运行长时间或循环动画，可以在动画配置中使用 `isInteraction: false`，以避免此问题。

### 请注意

使用 `rotateY`、`rotateX` 等变换样式时，请确保变换样式中包含 `perspective`。目前，如果没有它，一些动画可能无法在 Android 上渲染。示例如下。

```tsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
    ],
  }}
/>
```

### 其他示例

RNTester 应用中有多个使用 `Animated` 的示例：

- [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
- [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)

## `LayoutAnimation` API

`LayoutAnimation` 允许你全局配置 `create` 和 `update` 动画，这些动画将用于下一次渲染／布局周期中的所有视图。这对于执行 Flexbox 布局更新非常有用，因为无需测量或计算特定属性即可直接对其进行动画处理。当布局变化可能影响祖先元素时，这一功能尤其有用。例如，“查看更多”展开操作同时增大父元素尺寸，并将下面的行向下推移；否则就需要组件之间进行显式协调，才能让它们同步执行动画。

请注意，虽然 `LayoutAnimation` 功能非常强大，也相当实用，但它提供的控制能力远少于 `Animated` 和其他动画库。因此，如果无法使用 `LayoutAnimation` 实现你想要的效果，可能需要采用其他方案。

请注意，要使其在 **Android** 上正常工作，你需要通过 `UIManager` 设置以下标志：

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
    // Animate the update
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

此示例使用了预设值，你可以根据需要自定义动画。如需了解更多信息，请参阅 [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js)。

## 其他说明

### `requestAnimationFrame`

`requestAnimationFrame` 是一个你可能熟悉的浏览器 polyfill。它只接收一个函数作为参数，并在下一次重绘之前调用该函数。它是动画的基本构建模块，也是所有基于 JavaScript 的动画 API 的底层基础。通常，你不需要自己调用它——动画 API 会为你管理帧更新。

### `setNativeProps`

正如[直接操作部分](legacy/direct-manipulation)中所述，`setNativeProps` 允许我们直接修改原生支持组件的属性（实际由原生视图支持的组件，与复合组件不同），而不必调用 `setState` 并重新渲染组件层级结构。

我们可以在 Rebound 示例中使用它来更新缩放值——如果我们更新的组件嵌套很深，并且没有通过 `shouldComponentUpdate` 进行优化，这可能会很有帮助。

如果你发现动画出现掉帧（运行速度低于每秒 60 帧），可以考虑使用 `setNativeProps` 或 `shouldComponentUpdate` 对其进行优化。或者，你可以[使用 useNativeDriver 选项](/blog/2017/02/14/using-native-driver-for-animated)让动画运行在 UI 线程而不是 JavaScript 线程上。你也可以考虑将计算密集型工作推迟到 JS 线程空闲时执行（例如使用 `requestIdleCallback`）。你可以使用应用内开发菜单中的“FPS Monitor”工具监控帧率。
