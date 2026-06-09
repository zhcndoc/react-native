---
id: image-style-props
title: 图片样式属性
---

## 示例

### 图片缩放模式

```SnackPlayer name=Image%20Resize%20Modes%20Example
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

### 图片边框

```SnackPlayer name=Style%20BorderWidth%20and%20BorderColor%20Example
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

### 图片圆角

```SnackPlayer name=Style%20Border%20Radius%20Example
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

### 图片颜色覆盖（Tint）

```SnackPlayer name=Style%20tintColor%20Function%20Component
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

该属性定义旋转图像的背面是否可见。

| 类型                            | 默认值     |
| ----------------------------- | ---------- |
| 枚举 (`'visible'`, `'hidden'`) | `'visible'` |

---

### `backgroundColor`

| 类型         |
| ------------ |
| [颜色](colors.md) |

---

### `borderBottomLeftRadius`

| 类型   |
| ------ |
| 数字   |

---

### `borderBottomRightRadius`

| 类型   |
| ------ |
| 数字   |

---

### `borderColor`

| 类型         |
| ------------ |
| [颜色](colors.md) |

---

### `borderRadius`

| 类型   |
| ------ |
| 数字   |

---

### `borderTopLeftRadius`

| 类型   |
| ------ |
| 数字   |

---

### `borderTopRightRadius`

| 类型   |
| ------ |
| 数字   |

---

### `borderWidth`

| 类型   |
| ------ |
| 数字   |

---

### `opacity`

为图片设置透明度值。取值范围为 `0.0` 到 `1.0`。

| 类型   | 默认值  |
| ------ | ------- |
| 数字   | `1.0`   |

---

### `overflow`

| 类型                            | 默认值     |
| ----------------------------- | ---------- |
| 枚举 (`'visible'`, `'hidden'`) | `'visible'` |

---

### `overlayColor` <div className="label android">Android</div>

当图像有圆角时，指定 `overlayColor` 会导致圆角剩余部分用纯色填充。这在 Android 圆角实现不支持的情况下很有用：

- 某些缩放模式，如 `'contain'`
- 动态 GIF 图

通常使用这种属性的方式是在纯色背景上显示图片，并将 `overlayColor` 设置为与背景相同的颜色。

有关底层实现细节，请参见 [Fresco 文档](https://frescolib.org/docs/rounded-corners-and-circles.html)。

| 类型   |
| ------ |
| 字符串 |

---

### `resizeMode`

确定当框架尺寸与原始图像尺寸不符时如何缩放图片。默认值为 `cover`。

- `cover`: 按比例缩放图像（保持长宽比），使得：
  - 图像的宽度和高度都大于等于视图对应尺寸（减去内边距）
  - 缩放后的图像至少有一个维度等于视图对应维度（减去内边距）

- `contain`: 按比例缩放图像（保持长宽比），使图像宽度和高度都小于等于视图对应尺寸（减去内边距）。

- `stretch`: 独立缩放宽度和高度，可能改变图片长宽比。

- `repeat`: 重复图像以覆盖视图区域。图像会保持大小和长宽比，除非图像比视图大，则按比例缩小以包含在视图内。

- `center`: 将图像在视图中央显示。如果图像比视图大，则按比例缩小使其包含于视图内。

| 类型                                                               | 默认值   |
| ------------------------------------------------------------------ | -------- |
| 枚举 (`'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'`) | `'cover'` |

---

### `objectFit`

确定当框架尺寸与原始图像尺寸不符时如何缩放图片。

| 类型                                           | 默认值   |
| ----------------------------------------------- | -------- |
| 枚举 (`'cover'`, `'contain'`, `'fill'`, `'scale-down'`) | `'cover'` |

---

### `tintColor`

将所有非透明像素的颜色更改为指定的色调颜色。

| 类型         |
| ------------ |
| [颜色](colors.md) |