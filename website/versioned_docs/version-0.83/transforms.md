---
id: transforms
title: 变换
---

变换是一些样式属性，可帮助你通过 2D 或 3D 变换来修改组件的外观和位置。不过，一旦应用了变换，布局在被变换的组件周围仍然保持不变，因此可能会与附近的组件重叠。你可以为被变换的组件、附近的组件设置 `margin`，或者为容器设置 `padding`，以防止这种重叠。

## 示例

```SnackPlayer name=Transforms%20Example
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
          <Text style={styles.text}>绕 X 和 Z 轴旋转 45 度</Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{rotateY: '45deg'}, {rotateZ: '45deg'}],
            },
          ]}>
          <Text style={styles.text}>绕 Y 和 Z 轴旋转 45 度</Text>
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
          <Text style={styles.text}>X 轴平移 -50 </Text>
        </View>

        <View
          style={[
            styles.box,
            {
              transform: [{translateY: 50}],
            },
          ]}>
          <Text style={styles.text}>Y 轴平移 50 </Text>
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

## 变换

`transform` 接受一个由变换对象组成的数组，或以空格分隔的字符串值。每个对象都指定要被变换的属性作为键，以及在变换中使用的值。对象不应组合使用。每个对象只使用一个键/值对。

旋转变换要求使用字符串，这样 transform 可以用角度（deg）或弧度（rad）表示。例如：

```js
{
  transform: [{rotateX: '45deg'}, {rotateZ: '0.785398rad'}],
}
```

也可以使用空格分隔的字符串来实现相同效果：

```js
{
  transform: 'rotateX(45deg) rotateZ(0.785398rad)',
}
```

倾斜变换要求使用字符串，这样 transform 可以用角度（deg）表示。例如：

```js
{
  transform: [{skewX: '45deg'}],
}
```

### 矩阵变换

`matrix` 变换接受一个 4x4 的变换矩阵，形式为包含 16 个数字的数组。这使你可以在单个操作中应用组合了平移、旋转、缩放和倾斜的复杂变换。

矩阵按列主序指定：

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
当你需要应用预先计算好的变换矩阵时，例如来自动画库的矩阵，或者在构建 UI 编辑器应用时，矩阵变换非常有用。对于基本变换，建议使用各个独立的变换属性（scale、rotate、translate 等），因为它们更易读。
:::

| 类型                                                                                                                                                                                                                                                                                                          | 是否必需 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 对象数组：`{matrix: number[]}`、`{perspective: number}`、`{rotate: string}`、`{rotateX: string}`、`{rotateY: string}`、`{rotateZ: string}`、`{scale: number}`、`{scaleX: number}`、`{scaleY: number}`、`{translateX: number}`、`{translateY: number}`、`{skewX: string}`、`{skewY: string}` 或字符串 | 否       |

---

### 🗑️ `decomposedMatrix`、`rotation`、`scaleX`、`scaleY`、`transformMatrix`、`translateX`、`translateY`

:::warning[已弃用]
请改用 [`transform`](transforms#transform) 属性。
:::

## 变换原点

`transformOrigin` 属性用于设置视图变换的原点。变换原点是应用变换时围绕的那个点。默认情况下，变换的原点是 `center`。

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

变换原点支持 `px`、`percentage` 以及关键字 `top`、`left`、`right`、`bottom`、`center` 的值。

`transformOrigin` 属性可以使用一个、两个或三个值来指定，每个值表示一个偏移量。

#### 单值语法：

- 该值必须是 `px`、`percentage`，或者关键字 `left`、`center`、`right`、`top`、`bottom` 之一。

```js
{
  transformOrigin: '20px',
  transformOrigin: 'bottom',
}
```

#### 双值语法：

- 第一个值（x 偏移）必须是 `px`、`percentage`，或者关键字 `left`、`center`、`right` 之一。
- 第二个值（y 偏移）必须是 `px`、`percentage`，或者关键字 `top`、`center`、`bottom` 之一。

```js
{
  transformOrigin: '10px 2px',
  transformOrigin: 'left top',
  transformOrigin: 'top right',
}
```

#### 三值语法：

- 前两个值与双值语法相同。
- 第三个值（z 偏移）必须是 `px`。它始终表示 Z 轴偏移。

```js
{
  transformOrigin: '2px 30% 10px',
  transformOrigin: 'right bottom 20px',
}
```

#### 数组语法

`transformOrigin` 也支持数组语法。它便于与 Animated API 一起使用，也避免了字符串解析，因此应该更高效。

```js
{
  // 使用数值
  transformOrigin: [10, 30, 40],
  // 混合数值和百分比值
  transformOrigin: [10, '20%', 0],
}
```

你可以参考 MDN 的 [变换原点](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin) 指南获取更多信息。
