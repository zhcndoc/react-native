---
id: easing
title: 缓动
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Easing` 模块实现了常见的缓动函数。此模块由 [`Animated.timing()`](animated.md#timing) 使用，以便在动画中传达物理上可信的运动。

你可以在 https://easings.net/ 找到一些常见缓动函数的可视化效果。

### 预定义动画

`Easing` 模块通过以下方法提供了几种预定义动画：

- [`back`](easing.md#back) 提供一个基本动画，对象在向前移动之前会稍微向后移动
- [`bounce`](easing.md#bounce) 提供弹跳动画
- [`ease`](easing.md#ease) 提供基本惯性动画
- [`elastic`](easing.md#elastic) 提供基本弹簧交互

### 标准函数

提供了三个标准缓动函数：

- [`linear`](easing.md#linear)
- [`quad`](easing.md#quad)
- [`cubic`](easing.md#cubic)

[`poly`](easing.md#poly) 函数可用于实现四次、五次和其他更高幂函数。

### 附加函数

以下方法提供了额外的数学函数：

- [`bezier`](easing.md#bezier) 提供三次贝塞尔曲线
- [`circle`](easing.md#circle) 提供圆形函数
- [`sin`](easing.md#sin) 提供正弦函数
- [`exp`](easing.md#exp) 提供指数函数

以下辅助函数用于修改其他缓动函数。

- [`in`](easing.md#in) 向前运行缓动函数
- [`inOut`](easing.md#inout) 使任何缓动函数对称
- [`out`](easing.md#out) 向后运行缓动函数

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Easing%20Demo&ext=js&supportedPlatforms=ios,android
import React, {useRef} from 'react';
import {
  Animated,
  Easing,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const animate = easing => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      easing,
      useNativeDriver: false,
    }).start();
  };

  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const animatedStyles = [
    styles.box,
    {
      opacity,
      width: size,
      height: size,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
        <StatusBar hidden={true} />
        <Text style={styles.title}>
          Press rows below to preview the Easing!
        </Text>
        <View style={styles.boxContainer}>
          <Animated.View style={animatedStyles} />
        </View>
        <SectionList
          style={styles.list}
          sections={SECTIONS}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => animate(item.easing)}
              style={styles.listRow}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.listHeader}>{title}</Text>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const SECTIONS = [
  {
    title: 'Predefined animations',
    data: [
      {title: 'Bounce', easing: Easing.bounce},
      {title: 'Ease', easing: Easing.ease},
      {title: 'Elastic', easing: Easing.elastic(4)},
    ],
  },
  {
    title: 'Standard functions',
    data: [
      {title: 'Linear', easing: Easing.linear},
      {title: 'Quad', easing: Easing.quad},
      {title: 'Cubic', easing: Easing.cubic},
    ],
  },
  {
    title: 'Additional functions',
    data: [
      {
        title: 'Bezier',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle', easing: Easing.circle},
      {title: 'Sin', easing: Easing.sin},
      {title: 'Exp', easing: Easing.exp},
    ],
  },
  {
    title: 'Combinations',
    data: [
      {
        title: 'In + Bounce',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + Exp',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + Elastic',
        easing: Easing.inOut(Easing.elastic(1)),
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232a',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    color: '#61dafb',
  },
  boxContainer: {
    height: 160,
    alignItems: 'center',
  },
  box: {
    marginTop: 32,
    borderRadius: 4,
    backgroundColor: '#61dafb',
  },
  list: {
    backgroundColor: '#fff',
  },
  listHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f4f4f4',
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  listRow: {
    padding: 8,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Easing%20Demo&ext=tsx
import React, {useRef} from 'react';
import {
  Animated,
  Easing,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type EasingFunction,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const animate = (easing: EasingFunction) => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      easing,
      useNativeDriver: false,
    }).start();
  };

  const size = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const animatedStyles = [
    styles.box,
    {
      opacity,
      width: size,
      height: size,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
        <StatusBar hidden={true} />
        <Text style={styles.title}>
          Press rows below to preview the Easing!
        </Text>
        <View style={styles.boxContainer}>
          <Animated.View style={animatedStyles} />
        </View>
        <SectionList
          style={styles.list}
          sections={SECTIONS}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => animate(item.easing)}
              style={styles.listRow}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.listHeader}>{title}</Text>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const SECTIONS = [
  {
    title: 'Predefined animations',
    data: [
      {title: 'Bounce', easing: Easing.bounce},
      {title: 'Ease', easing: Easing.ease},
      {title: 'Elastic', easing: Easing.elastic(4)},
    ],
  },
  {
    title: 'Standard functions',
    data: [
      {title: 'Linear', easing: Easing.linear},
      {title: 'Quad', easing: Easing.quad},
      {title: 'Cubic', easing: Easing.cubic},
    ],
  },
  {
    title: 'Additional functions',
    data: [
      {
        title: 'Bezier',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle', easing: Easing.circle},
      {title: 'Sin', easing: Easing.sin},
      {title: 'Exp', easing: Easing.exp},
    ],
  },
  {
    title: 'Combinations',
    data: [
      {
        title: 'In + Bounce',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + Exp',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + Elastic',
        easing: Easing.inOut(Easing.elastic(1)),
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232a',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    color: '#61dafb',
  },
  boxContainer: {
    height: 160,
    alignItems: 'center',
  },
  box: {
    marginTop: 32,
    borderRadius: 4,
    backgroundColor: '#61dafb',
  },
  list: {
    backgroundColor: '#fff',
  },
  listHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f4f4f4',
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  listRow: {
    padding: 8,
  },
});

export default App;
```

</TabItem>
</Tabs>

---

# 参考

## 方法

### `step0()`

```tsx
static step0(n: number);
```

一个步进函数，对于任何正的 `n` 值返回 1。

---

### `step1()`

```tsx
static step1(n: number);
```

一个步进函数，如果 `n` 大于或等于 1 则返回 1。

---

### `linear()`

```tsx
static linear(t: number);
```

一个线性函数，`f(t) = t`。位置与流逝时间一一对应。

https://cubic-bezier.com/#0,0,1,1

---

### `ease()`

```tsx
static ease(t: number);
```

基本惯性交互，类似于物体缓慢加速到速度。

https://cubic-bezier.com/#.42,0,1,1

---

### `quad()`

```tsx
static quad(t: number);
```

一个二次函数，`f(t) = t * t`。位置等于流逝时间的平方。

https://easings.net/#easeInQuad

---

### `cubic()`

```tsx
static cubic(t: number);
```

一个三次函数，`f(t) = t * t * t`。位置等于流逝时间的立方。

https://easings.net/#easeInCubic

---

### `poly()`

```tsx
static poly(n: number);
```

一个幂函数。位置等于流逝时间的 N 次幂。

n = 4: https://easings.net/#easeInQuart n = 5: https://easings.net/#easeInQuint

---

### `sin()`

```tsx
static sin(t: number);
```

一个正弦函数。

https://easings.net/#easeInSine

---

### `circle()`

```tsx
static circle(t: number);
```

一个圆形函数。

https://easings.net/#easeInCirc

---

### `exp()`

```tsx
static exp(t: number);
```

一个指数函数。

https://easings.net/#easeInExpo

---

### `elastic()`

```tsx
static elastic(bounciness: number);
```

基本弹性交互，类似于弹簧来回振荡。

默认弹性系数为 1，这会稍微过冲一次。0 弹性系数完全不过冲，而大于 1 的弹性系数 N 将过冲大约 N 次。

https://easings.net/#easeInElastic

---

### `back()`

```tsx
static back(s)
```

与 `Animated.parallel()` 一起使用，创建一个基本效果，对象在动画开始时稍微向后移动。

---

### `bounce()`

```tsx
static bounce(t: number);
```

提供基本弹跳效果。

https://easings.net/#easeInBounce

---

### `bezier()`

```tsx
static bezier(x1: number, y1: number, x2: number, y2: number);
```

提供三次贝塞尔曲线，等同于 CSS Transitions 的 `transition-timing-function`。

一个可视化三次贝塞尔曲线的有用工具可以在 https://cubic-bezier.com/ 找到。

---

### `in()`

```tsx
static in(easing: number);
```

向前运行缓动函数。

---

### `out()`

```tsx
static out(easing: number);
```

向后运行缓动函数。

---

### `inOut()`

```tsx
static inOut(easing: number);
```

使任何缓动函数对称。缓动函数将在持续时间的前半部分向前运行，然后在剩余持续时间向后运行。
