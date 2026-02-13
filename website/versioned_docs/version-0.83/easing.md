---
id: easing
title: 缓动（Easing）
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Easing` 模块实现了常用的缓动函数。该模块被 [`Animated.timing()`](animated.md#timing) 使用，以传递动画中物理上可信的运动效果。

你可以在 https://easings.net/ 查看一些常见缓动函数的可视化演示。

### 预定义动画

`Easing` 模块通过以下方法提供几个预定义动画：

- [`back`](easing.md#back) 提供一个基本动画，物体在向前移动前稍微往后移
- [`bounce`](easing.md#bounce) 提供一个弹跳动画
- [`ease`](easing.md#ease) 提供一个基本的惯性动画
- [`elastic`](easing.md#elastic) 提供一个基本的弹簧效果

### 标准函数

提供三种标准缓动函数：

- [`linear`](easing.md#linear)
- [`quad`](easing.md#quad)
- [`cubic`](easing.md#cubic)

[`poly`](easing.md#poly) 函数用于实现四次、五次及其他更高次幂的函数。

### 额外函数

通过以下方法提供更多数学函数：

- [`bezier`](easing.md#bezier) 提供三次贝塞尔曲线
- [`circle`](easing.md#circle) 提供圆形函数
- [`sin`](easing.md#sin) 提供正弦函数
- [`exp`](easing.md#exp) 提供指数函数

以下辅助函数用于修饰其它缓动函数：

- [`in`](easing.md#in) 让缓动函数正向运行
- [`inOut`](easing.md#inout) 让任意缓动函数对称运行
- [`out`](easing.md#out) 让缓动函数反向运行

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Easing%20Demo&ext=js
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
          点击下面的行以预览缓动效果！
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
    title: '预定义动画',
    data: [
      {title: 'Bounce 弹跳', easing: Easing.bounce},
      {title: 'Ease 缓动', easing: Easing.ease},
      {title: 'Elastic 弹性', easing: Easing.elastic(4)},
    ],
  },
  {
    title: '标准函数',
    data: [
      {title: 'Linear 线性', easing: Easing.linear},
      {title: 'Quad 二次方', easing: Easing.quad},
      {title: 'Cubic 三次方', easing: Easing.cubic},
    ],
  },
  {
    title: '额外函数',
    data: [
      {
        title: 'Bezier 贝塞尔',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle 圆形', easing: Easing.circle},
      {title: 'Sin 正弦', easing: Easing.sin},
      {title: 'Exp 指数', easing: Easing.exp},
    ],
  },
  {
    title: '组合使用',
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
          点击下面的行以预览缓动效果！
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
    title: '预定义动画',
    data: [
      {title: 'Bounce 弹跳', easing: Easing.bounce},
      {title: 'Ease 缓动', easing: Easing.ease},
      {title: 'Elastic 弹性', easing: Easing.elastic(4)},
    ],
  },
  {
    title: '标准函数',
    data: [
      {title: 'Linear 线性', easing: Easing.linear},
      {title: 'Quad 二次方', easing: Easing.quad},
      {title: 'Cubic 三次方', easing: Easing.cubic},
    ],
  },
  {
    title: '额外函数',
    data: [
      {
        title: 'Bezier 贝塞尔',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: 'Circle 圆形', easing: Easing.circle},
      {title: 'Sin 正弦', easing: Easing.sin},
      {title: 'Exp 指数', easing: Easing.exp},
    ],
  },
  {
    title: '组合使用',
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

阶跃函数，当 `n` 为正数时返回 1。

---

### `step1()`

```tsx
static step1(n: number);
```

阶跃函数，当 `n` 大于或等于 1 时返回 1。

---

### `linear()`

```tsx
static linear(t: number);
```

线性函数，`f(t) = t`。位置与经过时间一一对应。

https://cubic-bezier.com/#0,0,1,1

---

### `ease()`

```tsx
static ease(t: number);
```

基本惯性交互，类似物体慢慢加速到速度。

https://cubic-bezier.com/#.42,0,1,1

---

### `quad()`

```tsx
static quad(t: number);
```

二次函数，`f(t) = t * t`。位置等于经过时间的平方。

https://easings.net/#easeInQuad

---

### `cubic()`

```tsx
static cubic(t: number);
```

三次函数，`f(t) = t * t * t`。位置等于经过时间的立方。

https://easings.net/#easeInCubic

---

### `poly()`

```tsx
static poly(n: number);
```

幂函数。位置等于经过时间的 n 次幂。

n = 4: https://easings.net/#easeInQuart  n = 5: https://easings.net/#easeInQuint

---

### `sin()`

```tsx
static sin(t: number);
```

正弦函数。

https://easings.net/#easeInSine

---

### `circle()`

```tsx
static circle(t: number);
```

圆形函数。

https://easings.net/#easeInCirc

---

### `exp()`

```tsx
static exp(t: number);
```

指数函数。

https://easings.net/#easeInExpo

---

### `elastic()`

```tsx
static elastic(bounciness: number);
```

基本弹性交互，类似弹簧往复振荡的效果。

默认弹性系数为 1，会有一次轻微的超出。弹性系数为 0 不会超出，大于 1 的弹性系数会超出约 N 次。

https://easings.net/#easeInElastic

---

### `back()`

```tsx
static back(s)
```

配合 `Animated.parallel()` 使用，创建一个动画开始时物体稍微向后移动的效果。

---

### `bounce()`

```tsx
static bounce(t: number);
```

提供基本的弹跳效果。

https://easings.net/#easeInBounce

---

### `bezier()`

```tsx
static bezier(x1: number, y1: number, x2: number, y2: number);
```

提供三次贝塞尔曲线，等价于 CSS 过渡中的 `transition-timing-function`。

一个很有用的贝塞尔曲线可视化工具在 https://cubic-bezier.com/

---

### `in()`

```tsx
static in(easing: number);
```

正向运行一个缓动函数。

---

### `out()`

```tsx
static out(easing: number);
```

反向运行一个缓动函数。

---

### `inOut()`

```tsx
static inOut(easing: number);
```

使任何缓动函数对称运行。缓动函数在持续时间的前半段正向运行，后半段反向运行。
