---
id: image-style-props
title: 图像样式属性
---

## 示例

### 图像调整大小模式

```SnackPlayer name=Image%20Resize%20Modes%20Example
import React from 'react';
import {View, Image, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const asset = require('@expo/snack-static/react-native-logo.png');

const DisplayAnImageWithStyle = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Image style={[styles.image, {resizeMode: 'cover'}]} source={asset} />
          <Text style={styles.text}>resizeMode : cover</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {resizeMode: 'contain'}]}
            source={asset}
          />
          <Text style={styles.text}>resizeMode : contain</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {resizeMode: 'stretch'}]}
            source={asset}
          />
          <Text style={styles.text}>resizeMode : stretch</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {resizeMode: 'repeat'}]}
            source={asset}
          />
          <Text style={styles.text}>resizeMode : repeat</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {resizeMode: 'center'}]}
            source={asset}
          />
          <Text style={styles.text}>resizeMode : center</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 12,
    alignItems: 'center',
    gap: 16,
  },
  image: {
    borderWidth: 1,
    borderColor: 'red',
    height: 100,
    width: 200,
  },
  text: {
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default DisplayAnImageWithStyle;
```

### 图像边框

```SnackPlayer name=Style%20BorderWidth%20and%20BorderColor%20Example
import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DisplayAnImageWithStyle = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Image
        style={{
          borderColor: 'red',
          borderWidth: 5,
          height: 100,
          width: 200,
        }}
        source={require('@expo/snack-static/react-native-logo.png')}
      />
      <Text>borderColor & borderWidth</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DisplayAnImageWithStyle;
```

### 图像边框圆角

```SnackPlayer name=Style%20Border%20Radius%20Example
import React from 'react';
import {View, Image, StyleSheet, Text, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const asset = require('@expo/snack-static/react-native-logo.png');

const DisplayAnImageWithStyle = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View>
          <Image
            style={[styles.image, {borderTopRightRadius: 20}]}
            source={asset}
          />
          <Text>borderTopRightRadius</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {borderBottomRightRadius: 20}]}
            source={asset}
          />
          <Text>borderBottomRightRadius</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {borderBottomLeftRadius: 20}]}
            source={asset}
          />
          <Text>borderBottomLeftRadius</Text>
        </View>
        <View>
          <Image
            style={[styles.image, {borderTopLeftRadius: 20}]}
            source={asset}
          />
          <Text>borderTopLeftRadius</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderWidth: 1,
    borderColor: 'red',
    height: 100,
    width: 200,
  },
});

export default DisplayAnImageWithStyle;
```

### 图像色调

```SnackPlayer name=Style%20tintColor%20Function%20Component
import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DisplayAnImageWithStyle = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Image
        style={{
          tintColor: '#000000',
          resizeMode: 'contain',
          height: 100,
          width: 200,
        }}
        source={require('@expo/snack-static/react-native-logo.png')}
      />
      <Text>tintColor</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DisplayAnImageWithStyle;
```

# 参考

## 属性

### `backfaceVisibility`

该属性定义旋转图像的背面是否应该可见。

| 类型                          | 默认值     |
| ----------------------------- | ----------- |
| enum(`'visible'`, `'hidden'`) | `'visible'` |

---

### `backgroundColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderBottomLeftRadius`

| 类型   |
| ------ |
| number |

---

### `borderBottomRightRadius`

| 类型   |
| ------ |
| number |

---

### `borderColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `borderRadius`

| 类型   |
| ------ |
| number |

---

### `borderTopLeftRadius`

| 类型   |
| ------ |
| number |

---

### `borderTopRightRadius`

| 类型   |
| ------ |
| number |

---

### `borderWidth`

| 类型   |
| ------ |
| number |

---

### `opacity`

为图像设置不透明度值。该数字应在 `0.0` 到 `1.0` 范围内。

| 类型   | 默认值 |
| ------ | ------- |
| number | `1.0`   |

---

### `overflow`

| 类型                          | 默认值     |
| ----------------------------- | ----------- |
| enum(`'visible'`, `'hidden'`) | `'visible'` |

---

### `overlayColor` <div className="label android">Android</div>

当图像具有圆角时，指定 overlayColor 会导致角落的剩余空间填充为纯色。这在某些 Android 实现不支持圆角的情况下很有用：

- 某些调整大小模式，例如 `'contain'`
- 动画 GIF

使用此属性的典型方式是将图像显示在纯色背景上，并将 `overlayColor` 设置为与背景相同的颜色。

有关此如何在底层工作的详细信息，请参阅 [Fresco 文档](https://frescolib.org/docs/rounded-corners-and-circles.html)。

| 类型   |
| ------ |
| string |

---

### `resizeMode`

确定当框架与原始图像尺寸不匹配时如何调整图像大小。默认为 `cover`。

- `cover`: 均匀缩放图像（保持图像的纵横比），以便：
  - 图像的两个维度（宽度和高度）将等于或大于视图的相应维度（减去内边距）
  - 缩放图像的一个维度将等于视图的相应维度（减去内边距）

- `contain`: 均匀缩放图像（保持图像的纵横比），以便图像的两个维度（宽度和高度）将等于或小于视图的相应维度（减去内边距）。

- `stretch`: 独立缩放宽度和高度，这可能会改变源的纵横比。

- `repeat`: 重复图像以覆盖视图的框架。图像将保持其大小和纵横比，除非它大于视图，在这种情况下它将均匀缩小以便包含在视图中。

- `center`: 沿两个维度将图像居中在视图中。如果图像大于视图，则均匀缩小以便包含在视图中。

| 类型                                                              | 默认值   |
| ----------------------------------------------------------------- | --------- |
| enum(`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `objectFit`

确定当框架与原始图像尺寸不匹配时如何调整图像大小。

| 类型                                                   | 默认值   |
| ------------------------------------------------------ | --------- |
| enum(`'cover'`, `'contain'`, `'fill'`, `'scale-down'`) | `'cover'` |

---

### `tintColor`

将所有非透明像素的颜色更改为 tintColor。

| 类型               |
| ------------------ |
| [颜色](colors.md) |
