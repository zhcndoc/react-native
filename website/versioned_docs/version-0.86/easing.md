---
id: easing
title: 缓动
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Easing` 模块实现了常见的缓动函数。该模块由 [`Animated.timing()`](animated.md#timing) 使用，用于在动画中传达符合物理直觉的运动效果。

你可以在 https://easings.net/ 找到一些常见缓动函数的可视化示例。

### 预定义动画

`Easing` 模块通过以下方法提供了若干预定义动画：

- [`back`](easing.md#back) 提供一种基础动画：对象在向前移动前会先轻微向后
- [`bounce`](easing.md#bounce) 提供一种弹跳动画
- [`ease`](easing.md#ease) 提供一种基础的惯性动画
- [`elastic`](easing.md#elastic) 提供一种基础的弹簧交互

### 标准函数

提供了三个标准缓动函数：

- [`linear`](easing.md#linear)
- [`quad`](easing.md#quad)
- [`cubic`](easing.md#cubic)

[`poly`](easing.md#poly) 函数可用于实现四次、五次以及其他更高次幂函数。

### 其他函数

以下方法提供了其他数学函数：

- [`bezier`](easing.md#bezier) 提供一个三次贝塞尔曲线
- [`circle`](easing.md#circle) 提供一个圆形函数
- [`sin`](easing.md#sin) 提供一个正弦函数
- [`exp`](easing.md#exp) 提供一个指数函数

以下辅助函数用于修改其他缓动函数。

- [`in`](easing.md#in) 正向运行一个缓动函数
- [`inOut`](easing.md#inout) 使任意缓动函数具有对称性
- [`out`](easing.md#out) 反向运行一个缓动函数

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Easing%20Demo&ext=js
import {useRef} from 'react';
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
          点击下方各行以预览缓动效果！
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
      {title: '弹跳', easing: Easing.bounce},
      {title: '缓和', easing: Easing.ease},
      {title: '弹性', easing: Easing.elastic(4)},
    ],
  },
  {
    title: '标准函数',
    data: [
      {title: '线性', easing: Easing.linear},
      {title: '二次', easing: Easing.quad},
      {title: '三次', easing: Easing.cubic},
    ],
  },
  {
    title: '其他函数',
    data: [
      {
        title: '贝塞尔',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: '圆形', easing: Easing.circle},
      {title: '正弦', easing: Easing.sin},
      {title: '指数', easing: Easing.exp},
    ],
  },
  {
    title: '组合',
    data: [
      {
        title: 'In + 弹跳',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + 指数',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + 弹性',
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
import {useRef} from 'react';
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
          点击下方各行以预览缓动效果！
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
      {title: '弹跳', easing: Easing.bounce},
      {title: '缓和', easing: Easing.ease},
      {title: '弹性', easing: Easing.elastic(4)},
    ],
  },
  {
    title: '标准函数',
    data: [
      {title: '线性', easing: Easing.linear},
      {title: '二次', easing: Easing.quad},
      {title: '三次', easing: Easing.cubic},
    ],
  },
  {
    title: '其他函数',
    data: [
      {
        title: '贝塞尔',
        easing: Easing.bezier(0, 2, 1, -1),
      },
      {title: '圆形', easing: Easing.circle},
      {title: '正弦', easing: Easing.sin},
      {title: '指数', easing: Easing.exp},
    ],
  },
  {
    title: '组合',
    data: [
      {
        title: 'In + 弹跳',
        easing: Easing.in(Easing.bounce),
      },
      {
        title: 'Out + 指数',
        easing: Easing.out(Easing.exp),
      },
      {
        title: 'InOut + 弹性',
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

一个阶跃函数，对任何正数 `n` 都返回 1。

---

### `step1()`

```tsx
static step1(n: number);
```

一个阶跃函数，当 `n` 大于或等于 1 时返回 1。

---

### `linear()`

```tsx
static linear(t: number);
```

线性函数，`f(t) = t`。位置与经过的时间一一对应。

https://cubic-bezier.com/#0,0,1,1

---

### `ease()`

```tsx
static ease(t: number);
```

一种基础的惯性交互，类似于物体缓慢加速至目标速度。

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

幂函数。位置等于经过时间的 N 次方。

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

一种基础的弹性交互，类似于弹簧来回振荡。

默认弹性系数为 1，会略微超出一次。弹性系数为 0 时不会产生任何超出，而弹性系数为 N > 1 时大约会超出 N 次。

https://easings.net/#easeInElastic

---

### `back()`

```tsx
static back(s)
```

与 `Animated.parallel()` 配合使用，可创建一种基础效果：动画开始时，对象会先轻微向后回退。

---

### `bounce()`

```tsx
static bounce(t: number);
```

提供一种基础的弹跳效果。

https://easings.net/#easeInBounce

---

### `bezier()`

```tsx
static bezier(x1: number, y1: number, x2: number, y2: number);
```

提供一个三次贝塞尔曲线，相当于 CSS Transitions 的 `transition-timing-function`。

可用于可视化三次贝塞尔曲线的实用工具可在 https://cubic-bezier.com/ 找到。

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

使任意缓动函数具有对称性。该缓动函数会在持续时间的前半段正向运行，然后在剩余时间内反向运行。
