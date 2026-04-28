---
id: transforms
title: 变换
---

变换是样式属性，可以帮助你使用二维或三维变换来修改组件的外观和位置。然而，一旦你应用了变换，变换组件周围的布局保持不变，因此可能会与附近的组件重叠。你可以对变换后的组件、附近组件应用 margin，或者对容器应用 padding，以防止这种重叠。

## 示例

```SnackPlayer name=Transforms%20Example
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.box}>
          <Text style={styles.text}>原始对象</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scale: 2}],
            },
          ]}>
          <Text style={styles.text}>缩放 2 倍</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scaleX: 2}],
            },
          ]}>
          <Text style={styles.text}>X 轴缩放 2 倍</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scaleY: 2}],
            },
          ]}>
          <Text style={styles.text}>Y 轴缩放 2 倍</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotate: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>旋转 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotateX: '45deg'}, {rotateZ: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>X 和 Z 轴旋转 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotateY: '45deg'}, {rotateZ: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>Y 和 Z 轴旋转 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewX: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>X 轴倾斜 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewY: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>Y 轴倾斜 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewX: '30deg'}, {skewY: '30deg'}],
            },
          ]}>
          <Text style={styles.text}>X 和 Y 轴倾斜 30 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{translateX: -50}],
            },
          ]}>
          <Text style={styles.text}>X 轴平移 -50</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{translateY: 50}],
            },
          ]}>
          <Text style={styles.text}>Y 轴平移 50</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [
                {
                  matrix: [1, 0.5, 0, 0, 0.5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                },
              ],
            },
          ]}>
          <Text style={styles.text}>矩阵变换</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  box: {
    height: 100,
    width: 100,
    borderRadius: 5,
    marginVertical: 40,
    backgroundColor: '#61dafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
    color: '#000',
    textAlign: 'center',
  },
});

export default App;
```

---

# 参考

## 变换 (Transform)

`transform` 接受一个变换对象数组或者空格分隔的字符串值。每一个对象都指定将要变换的属性作为键，变换时使用的值作为值。对象不应合并。每个对象应只包含一对键值。

旋转变换需要字符串，以便可以用度 (deg) 或弧度 (rad) 来表达变换。例如：

```js
{
  transform: [{rotateX: '45deg'}, {rotateZ: '0.785398rad'}],
}
```

同样效果也可以用空格分隔的字符串表示：

```js
{
  transform: 'rotateX(45deg) rotateZ(0.785398rad)',
}
```

倾斜变换需要使用字符串，以便用度 (deg) 来表达变换。例如：

```js
{
  transform: [{skewX: '45deg'}],
}
```

### 矩阵变换 (Matrix Transform)

`matrix` 变换接受一个 4x4 变换矩阵，作为包含 16 个数字的数组传入。它允许你在一次操作中组合平移、旋转、缩放和倾斜等复杂变换。

矩阵以列优先顺序指定：

```js
{
  transform: [
    {
      matrix: [
        scaleX,
        skewY,
        0,
        0,
        skewX,
        scaleY,
        0,
        0,
        0,
        0,
        1,
        0,
        translateX,
        translateY,
        0,
        1,
      ],
    },
  ];
}
```

举例，应用缩放和倾斜的组合：

```js
{
  transform: [
    {
      matrix: [
        1, 0.5, 0, 0, 0.5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ],
    },
  ];
}
```

:::note
矩阵变换在你需要应用预先计算好的变换矩阵时非常有用，比如来自动画库的矩阵，或构建 UI 编辑器应用时。对于基础变换，建议使用单独的变换属性（scale、rotate、translate 等），因为它们更容易阅读。
:::

| 类型                                                                                                                                                                                                                                                                                                          | 是否必需 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 对象数组：`{matrix: number[]}`, `{perspective: number}`, `{rotate: string}`, `{rotateX: string}`, `{rotateY: string}`, `{rotateZ: string}`, `{scale: number}`, `{scaleX: number}`, `{scaleY: number}`, `{translateX: number}`, `{translateY: number}`, `{skewX: string}`, `{skewY: string}` 或 字符串 | 否       |

---

### 🗑️ `decomposedMatrix`, `rotation`, `scaleX`, `scaleY`, `transformMatrix`, `translateX`, `translateY`

:::warning[Deprecated]
使用 [`transform`](transforms#transform) 属性代替。
:::

## 变换原点 (Transform Origin)

`transformOrigin` 属性设置视图变换的原点。变换原点是应用变换时绕转的点。默认情况下，变换原点是 `center`。

# 示例

```SnackPlayer name=TransformOrigin%20Example
import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet, Easing} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.transformOriginWrapper}>
          <Animated.View
            style={[
              styles.transformOriginView,
              {
                transform: [{rotate: spin}],
              },
            ]}
          />
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
  transformOriginWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  transformOriginView: {
    backgroundColor: 'pink',
    width: 100,
    height: 100,
    transformOrigin: 'top',
  },
});

export default App;
```

### 值

变换原点支持 `px`、百分比以及关键字 `top`、`left`、`right`、`bottom` 和 `center`。

`transformOrigin` 可指定一个值、两个值或三个值，每个值表示一个偏移量。

#### 单值语法：

- 值必须是 `px`、百分比，或者以下关键字之一：`left`、`center`、`right`、`top`、`bottom`。

```js
{
  transformOrigin: '20px',
  transformOrigin: 'bottom',
}
```

#### 双值语法：

- 第一个值（x 轴偏移）必须是 `px`、百分比，或者关键字之一：`left`、`center`、`right`。
- 第二个值（y 轴偏移）必须是 `px`、百分比，或者关键字之一：`top`、`center`、`bottom`。

```js
{
  transformOrigin: '10px 2px',
  transformOrigin: 'left top',
  transformOrigin: 'top right',
}
```

#### 三值语法：

- 前两个值与双值语法相同。
- 第三个值（z 轴偏移）必须是 `px`，总是表示 Z 轴偏移。

```js
{
  transformOrigin: '2px 30% 10px',
  transformOrigin: 'right bottom 20px',
}
```

#### 数组语法

`transformOrigin` 也支持数组语法，便于与 Animated API 一起使用，同时避免字符串解析，提高效率。

```js
{
  // 使用数字值
  transformOrigin: [10, 30, 40],
  // 数字与百分比混用
  transformOrigin: [10, '20%', 0],
}
```

你也可以参考 MDN 关于 [变换原点](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin) 的相关指南获取更多信息。
