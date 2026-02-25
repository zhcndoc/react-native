---
id: animations
title: 动画
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

动画对于创建出色的用户体验非常重要。静止的物体在开始移动时必须克服惯性。运动中的物体具有动量，通常不会立即停止。动画使您能够在界面中传达物理上可信的运动。

React Native 提供了两种互补的动画系统：用于精细且交互式控制特定数值的 [`Animated`](animations#animated-api)，以及用于全局布局变更动画的 [`LayoutAnimation`](animations#layoutanimation-api)。

## `Animated` API

[`Animated`](animated) API 旨在以高性能的方式简洁地表达各种有趣的动画和交互模式。`Animated` 关注输入和输出之间的声明式关系，中间配有可配置的变换，以及用于控制基于时间的动画执行的 `start`/`stop` 方法。

`Animated` 导出六种可动画化的组件类型：`View`、`Text`、`Image`、`ScrollView`、`FlatList` 和 `SectionList`，但您也可以使用 `Animated.createAnimatedComponent()` 创建自己的动画组件。

例如，一个在挂载时淡入的容器视图可能如下所示：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer ext=js
import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';

const FadeInView = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 初始不透明度值为 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // 特殊的可动画视图
      style={{
        ...props.style,
        opacity: fadeAnim, // 将不透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 您可以在组件中用 `FadeInView` 替代 `View`：
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
  const fadeAnim = useRef(new Animated.Value(0)).current; // 初始不透明度值为 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // 特殊的可动画视图
      style={{
        ...props.style,
        opacity: fadeAnim, // 将不透明度绑定到动画值
      }}>
      {props.children}
    </Animated.View>
  );
};

// 您可以在组件中用 `FadeInView` 替代 `View`：
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

让我们拆解这里发生的事情。在 `FadeInView` 的渲染方法中，通过 `useRef` 初始化了一个新的 `Animated.Value`，称为 `fadeAnim`。该视图的 `opacity` 属性映射到这个动画值。幕后会提取数值并用于设置不透明度。

组件挂载时，不透明度设为 0。随后，在 `fadeAnim` 动画值上启动了一个缓动动画，它会在每一帧更新所有依赖映射（在此例中只有不透明度），直至动画值达到最终的 1。

这是以一种比调用 `setState` 并重新渲染更快且经过优化的方式完成的。由于整个配置是以声明式编写的，我们可以实现进一步的优化，将配置序列化，并在高优先级线程上运行动画。

### 配置动画

动画高度可配置。可根据动画类型调整自定义或预定义缓动函数、延迟、持续时间、衰减因子、弹簧常量等等。

`Animated` 提供了多种动画类型，最常用的是 [`Animated.timing()`](animated#timing)。它支持使用多种预定义缓动函数之一（也可以使用自定义）在一段时间内对数值进行动画。缓动函数通常用于动画中，表达物体的渐进加速和减速。

默认情况下，`timing` 将使用 easeInOut 曲线，体现渐进加速至最大速度，最终渐进减速至停止。您可以通过传入 `easing` 参数指定不同的缓动函数。还支持自定义 `duration` 或动画开始前的 `delay`。

例如，如果我们想创建一个 2 秒的动画，让物体在移动到最终位置之前稍稍后退：

```tsx
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

欲了解所有内置动画支持的配置参数，请参见 [`Animated` API 参考](animated#configuring-animations) 的“配置动画”章节。

### 组合动画

动画可以组合并顺序或并行播放。顺序动画可紧接前一个动画完成后播放，也可在指定延迟后开始。`Animated` API 提供了多种方法，如 `sequence()` 和 `delay()`，它们接受动画数组并自动调用所需的 `start()`/`stop()`。

例如，下面的动画先缓慢停止，然后弹回同时旋转（并行）：

```tsx
Animated.sequence([
  // 衰减后，弹回到起始位置并旋转
  Animated.decay(position, {
    // 缓慢停止
    velocity: {x: gestureState.vx, y: gestureState.vy}, // 手势释放时的速度
    deceleration: 0.997,
    useNativeDriver: true,
  }),
  Animated.parallel([
    // 衰减后并行执行：
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

如果某个动画被停止或中断，则组内其他动画也会停止。`Animated.parallel` 的 `stopTogether` 选项可设为 `false` 以禁用此行为。

完整版的组合方法列表请参见 [`Animated` API 参考](animated#composing-animations) 的“组合动画”章节。

### 组合动画值

您可以通过加法、乘法、除法或取模将两个动画值[组合成新的动画值](animated#combining-animated-values)。

在某些场景下，需要反转某个动画值以进行计算。例如反转缩放（2倍 --> 0.5倍）：

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### 插值

每个属性都可以先经过插值处理。插值是将输入范围映射到输出范围，通常采用线性插值，也支持缓动函数。默认情况下，它会在给定范围之外外推，但你也可以设置为钳制输出值。

一个将 0-1 范围映射到 0-100 范围的基本插值示例如下：

```tsx
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

例如，您可以将 `Animated.Value` 视为从 0 到 1，但将位置动画从 150px 变到 0px，且将不透明度从 0 变到 1。做法是修改上述例子中的 `style`：

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

[`interpolate()`](animated#interpolate) 也支持多段范围，非常适合定义死区和其他小技巧。例如，要实现一个在 -300 时取负值、-100 时变为 0、0 时变为 1、100 时再回落到 0，且之后的值保持死区 0 的映射，可以这样做：

```tsx
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

映射关系如下：

```
输入  | 输出
------|-------
 -400 |  450
 -300 |  300
 -200 |  150
 -100 |    0
  -50 |  0.5
    0 |    1
   50 |  0.5
  100 |    0
  101 |    0
  200 |    0
```

`interpolate()` 还支持映射到字符串，使你可以动画颜色或带单位的数值。例如，动画旋转时，你可以这样写：

```tsx
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` 还支持任意缓动函数，许多已经在 [`Easing`](easing) 模块中实现。此外，`interpolate()` 具有对输出范围外推的配置，可以通过设置 `extrapolate`、`extrapolateLeft`、`extrapolateRight` 选项控制。默认值为 `extend`，但可以用 `clamp` 限制输出值不超出 `outputRange`。

### 跟踪动态数值

动画值可以通过将动画的 `toValue` 设为另一个动画值（而不是普通数字）来跟踪其他值。例如，Messenger 安卓版的“聊天头”动画可以用一个以另一个动画值为目标的 `spring()` 实现，或者用 `timing()`（duration 为 0）实现刚性跟踪，也可与插值组合：

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

`leader` 和 `follower` 动画值可以用 `Animated.ValueXY()` 实现。`ValueXY` 是处理二维交互（如平移或拖动）的便捷包装，内部包含两个 `Animated.Value` 和部分辅助函数，使 `ValueXY` 在诸多场景下可以替代单独的动画值，用于同时跟踪 x 和 y。

### 跟踪手势

手势（如平移或滚动）和其他事件可以利用 [`Animated.event`](animated#event) 直接映射到动画值。通过结构化映射，从复杂事件对象中抽取值。第一层是数组以支持多参数映射，数组内含嵌套对象。

例如处理横向滚动手势时，您可以将 `event.nativeEvent.contentOffset.x` 映射到 `scrollX`（一个 `Animated.Value`）：

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

下面的示例实现了一个横向滚动的走马灯，其中滚动位置指示器由 `ScrollView` 中的 `Animated.event` 动画驱动。

#### ScrollView 与 Animated Event 示例

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

当使用 `PanResponder` 时，可以用如下代码将 `gestureState.dx` 和 `gestureState.dy` 中的 x、y 位置提取出来。第一个数组元素为 `null`，因为我们只对传给 `PanResponder` 处理函数的第二个参数（`gestureState`）感兴趣。

```tsx
onPanResponderMove={Animated.event(
  [null, // 忽略原生事件
  // 从 gestureState 中提取 dx 和 dy
  // 相当于 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

#### 带 Animated Event 的 PanResponder 示例

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
      <Text style={styles.titleText}>拖拽 & 松开此方块！</Text>
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

您可能注意到动画进行中没有明确方式读取当前值。这是由于优化，当前值可能只存在于原生运行环境中。如果需要在动画值改变时执行 JS 代码，有两种方法：

- `spring.stopAnimation(callback)` 在动画停止时调用 `callback` 并传入最终值，适用于手势转换时。
- `spring.addListener(callback)` 在动画进行中异步地调用 `callback`，提供最新值，适用于触发状态更改（比如当用户拖动时让控件“吸附”到新选项），这些大规模状态变更比连续手势（如平移）对少许帧延迟的容忍度更高。

`Animated` 设计为可序列化，因此动画能高性能运行且独立于常规 JS 事件循环。这影响了 API 设计，有时完成某些目标略显复杂。您可以考虑用 `Animated.Value.addListener` 解决部分限制，但应谨慎使用以避免对性能的潜在影响。

### 使用原生驱动

`Animated` API 设计为可序列化。采用 [原生驱动](/blog/2017/02/14/using-native-driver-for-animated) 时，动画所有信息在启动前发送至原生端，允许原生代码在 UI 线程运行动画，免去每一帧都需过桥通信。一旦动画启动，JS 线程阻塞也不会影响动画效果。

普通动画使用原生驱动，只需在启动动画时设置 `useNativeDriver: true`。未设置该属性的动画默认使用 false（为兼容旧版），但会发出警告（在 TypeScript 里还有类型错误）。

```tsx
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- 设为 true
}).start();
```

动画值只兼容单一驱动器，若对某个值启动动画时使用原生驱动，请确保所有相关动画都使用原生驱动。

原生驱动同样适用于 `Animated.event`，尤其适合跟随滚动位置的动画，否则由于 React Native 的异步特性，动画将总是滞后于手势一帧。

```tsx
<Animated.ScrollView // <-- 使用 Animated ScrollView 包装
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: this.state.animatedValue},
        },
      },
    ],
    {useNativeDriver: true}, // <-- 设为 true
  )}>
  {content}
</Animated.ScrollView>
```

您可以通过运行 [RNTester 应用](https://github.com/facebook/react-native/blob/main/packages/rn-tester/)，加载 Native Animated 示例来体验原生驱动动画。也可以查看[源码](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)了解示例实现。

#### 注意事项

并非 `Animated` 的所有功能目前都支持原生驱动。主要限制是只能动画非布局属性：如 `transform` 和 `opacity` 有效，而 Flexbox 和位置属性无效。使用 `Animated.event` 时只支持直接事件，不支持冒泡事件。这意味着它不支持 `PanResponder`，但适用于诸如 `ScrollView#onScroll`。

运行动画时，可能阻止 `VirtualizedList` 组件渲染更多行。若需要在列表滚动时运行长时间或循环动画，可在动画配置中设置 `isInteraction: false` 以避免该问题。

### 注意事项

使用 `rotateY`、`rotateX` 等变换样式时，确保加上变换样式中的 `perspective`。目前部分动画在 Android 上若缺少它，可能无法正常渲染（而在 iOS 上正常）。示例如下：

```tsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // 缺少这行时，此动画在 Android 不会渲染，但 iOS 正常
    ],
  }}
/>
```

### 更多示例

RNTester 应用包含多种 `Animated` 使用示例：

- [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
- [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)

## `LayoutAnimation` API

`LayoutAnimation` 允许您全局配置渲染/布局周期内所有视图使用的 `create` 和 `update` 动画。这对于 Flexbox 布局更新非常实用，无需显式测量或计算特定属性进行直接动画。当布局更改可能影响父组件时特别有用，比如“查看更多”展开操作同时增加父组件大小并推动下面的行，这通常需要多个组件间显式协调才能同步动画。

请注意，尽管 `LayoutAnimation` 非常强大且实用，但其控制能力远小于 `Animated` 及其他动画库。如果 `LayoutAnimation` 无法满足需求，您可能需要采用其他方法。

**在 Android 上使其工作，您需要通过 `UIManager` 设置以下标志：**

```tsx
UIManager.setLayoutAnimationEnabledExperimental(true);
```

```SnackPlayer name=LayoutAnimations
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
    // 执行动画更新
    LayoutAnimation.spring();
    setState({w: state.w + 15, h: state.h + 15});
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, {width: state.w, height: state.h}]} />
      <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>点我！</Text>
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

这个示例使用了预设值，您可以根据需要自定义动画。更多信息请参阅 [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js)。

## 其他注意事项

### `requestAnimationFrame`

`requestAnimationFrame` 是浏览器的 polyfill，您可能很熟悉。它只接受一个函数作为参数，并在下次重绘前调用该函数。它是 JavaScript 动画的基础构件之一。通常您无需手动调用，它会被动画 API 管理帧更新。

### `setNativeProps`

如[直接操作章节](legacy/direct-manipulation)所述，`setNativeProps` 允许我们直接修改原生支持组件（即真正由原生视图支撑的组件，区别于复合组件）的属性，无需调用 `setState` 并重新渲染组件树。

我们可以在 Rebound 示例中用它来更新缩放。如果被更新的组件深度嵌套且未通过 `shouldComponentUpdate` 优化，使用它会很有帮助。

如果遇到动画丢帧（低于 60fps）问题，可以考虑用 `setNativeProps` 或 `shouldComponentUpdate` 优化，或用 [useNativeDriver 选项](/blog/2017/02/14/using-native-driver-for-animated) 让动画在 UI 线程运行。还可以使用 [InteractionManager](interactionmanager) 推迟计算密集型工作至动画完成后。您可以用应用内开发菜单的 “FPS Monitor” 工具监控帧率。