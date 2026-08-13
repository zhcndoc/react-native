---
id: transforms
title: 变换
---

变换是一些样式属性，可帮助你使用 2D 或 3D 变换修改组件的外观和位置。但是，应用变换后，变换组件周围的布局保持不变，因此它可能会与附近的组件重叠。你可以为变换组件、附近的组件应用 margin，或为容器应用 padding，以防止此类重叠。

## 示例

```SnackPlayer name=Transforms%20Example
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.box}>
          <Text style={styles.text}>Original Object</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scale: 2}],
            },
          ]}>
          <Text style={styles.text}>Scale by 2</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scaleX: 2}],
            },
          ]}>
          <Text style={styles.text}>ScaleX by 2</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{scaleY: 2}],
            },
          ]}>
          <Text style={styles.text}>ScaleY by 2</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotate: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>Rotate by 45 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotateX: '45deg'}, {rotateZ: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>Rotate X&Z by 45 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotateY: '45deg'}, {rotateZ: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>Rotate Y&Z by 45 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewX: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>SkewX by 45 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewY: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>SkewY by 45 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{skewX: '30deg'}, {skewY: '30deg'}],
            },
          ]}>
          <Text style={styles.text}>Skew X&Y by 30 deg</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{translateX: -50}],
            },
          ]}>
          <Text style={styles.text}>TranslateX by -50 </Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{translateY: 50}],
            },
          ]}>
          <Text style={styles.text}>TranslateY by 50 </Text>
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
          <Text style={styles.text}>Matrix Transform</Text>
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

## Transform

`transform` 接受一个变换对象数组或以空格分隔的字符串值。每个对象将要变换的属性指定为键，并将变换中要使用的值指定为值。对象不应合并。每个对象使用一个键值对。

rotate 变换要求使用字符串，以便变换可以用度（deg）或弧度（rad）表示。例如：

```js
{
  transform: [{rotateX: '45deg'}, {rotateZ: '0.785398rad'}],
}
```

也可以使用以空格分隔的字符串实现相同的效果：

```js
{
  transform: 'rotateX(45deg) rotateZ(0.785398rad)',
}
```

skew 变换要求使用字符串，以便变换可以用度（deg）表示。例如：

```js
{
  transform: [{skewX: '45deg'}],
}
```

### Matrix Transform

`matrix` 变换接受一个由 16 个数字组成的 4x4 变换矩阵数组。这使你可以在单个操作中应用结合平移、旋转、缩放和倾斜的复杂变换。

矩阵以列主序指定：

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

例如，要应用缩放和倾斜的组合：

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
当你需要应用预先计算的变换矩阵时，Matrix 变换非常有用，例如使用动画库中的矩阵，或构建 UI 编辑器应用程序时。对于基本变换，建议使用单独的变换属性（scale、rotate、translate 等），因为它们更具可读性。
:::

| 类型                                                                                                                                                                                                                                                                                                 | 必填 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 对象数组：`{matrix: number[]}`、`{perspective: number}`、`{rotate: string}`、`{rotateX: string}`、`{rotateY: string}`、`{rotateZ: string}`、`{scale: number}`、`{scaleX: number}`、`{scaleY: number}`、`{translateX: number}`、`{translateY: number}`、`{skewX: string}`、`{skewY: string}` 或字符串 | 否   |

---

### 🗑️ `decomposedMatrix`、`rotation`、`scaleX`、`scaleY`、`transformMatrix`、`translateX`、`translateY`

:::warning[Deprecated]
请改用 [`transform`](transforms#transform) prop
:::

## Transform Origin

`transformOrigin` 属性设置视图变换的原点。变换原点是应用变换时围绕的点。默认情况下，变换的原点是 `center`。

# 示例

```SnackPlayer name=TransformOrigin%20Example
import {useEffect, useRef} from 'react';
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

Transform origin 支持 `px`、`percentage` 以及关键字 `top`、`left`、`right`、`bottom`、`center` 值。

`transformOrigin` 属性可以使用一个、两个或三个值指定，其中每个值表示一个偏移量。

#### 单值语法：

- 该值必须是 `px`、`percentage`，或关键字 `left`、`center`、`right`、`top` 和 `bottom` 之一

```js
{
  transformOrigin: '20px',
  transformOrigin: 'bottom',
}
```

#### 双值语法：

- 第一个值（x 偏移量）必须是 `px`、`percentage`，或关键字 `left`、`center` 和 `right` 之一
- 第二个值（y 偏移量）必须是 `px`、`percentage`，或关键字 `top`、`center` 和 `bottom` 之一

```js
{
  transformOrigin: '10px 2px',
  transformOrigin: 'left top',
  transformOrigin: 'top right',
}
```

#### 三值语法：

- 前两个值与双值语法相同
- 第三个值（z 偏移量）必须是 `px`。它始终表示 Z 偏移量

```js
{
  transformOrigin: '2px 30% 10px',
  transformOrigin: 'right bottom 20px',
}
```

#### 数组语法

`transformOrigin` 也支持数组语法。使用 Animated API 时，这种语法更加方便。同时它还避免了字符串解析，因此效率应该更高。

```js
{
  // Using numeric values
  transformOrigin: [10, 30, 40],
  // Mixing numeric and percentage values
  transformOrigin: [10, '20%', 0],
}
```

你可以参考 MDN 的 [Transform origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin) 指南以获取更多信息。
