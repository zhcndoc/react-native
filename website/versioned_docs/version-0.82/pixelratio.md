---
id: pixelratio
title: PixelRatio
---

`PixelRatio` 让你可以访问设备的像素密度和字体缩放比例。

## 获取正确尺寸的图像

如果你在高像素密度设备上，你应该获取更高分辨率的图像。一个经验法则是将你显示的图像尺寸乘以像素比率。

```tsx
const image = getImage({
  width: PixelRatio.getPixelSizeForLayoutSize(200),
  height: PixelRatio.getPixelSizeForLayoutSize(100),
});
<Image source={image} style={{width: 200, height: 100}} />;
```

## 像素网格吸附

在 iOS 中，你可以以任意精度指定元素的位置和尺寸，例如 29.674825。但是，最终物理显示只有固定数量的像素，例如 iPhone SE（第 1 代）为 640×1136，或 iPhone 11 为 828×1792。iOS 试图通过将一个原始像素扩展到多个像素来欺骗眼睛，从而尽可能忠实地反映用户值。这种技术的缺点是它会使生成的元素看起来模糊。

在实践中，我们发现开发者不需要这个功能，他们必须通过手动舍入来解决这个问题，以避免元素模糊。在 React Native 中，我们会自动舍入所有像素。

我们必须小心何时进行这种舍入。你永远不想同时使用舍入和未舍入的值，因为你会累积舍入误差。即使只有一个舍入误差也是致命的，因为一个像素的边框可能会消失或变大两倍。

在 React Native 中，JavaScript 中和布局引擎内的所有内容都使用任意精度数字工作。只有当我们在主线程上设置原生元素的位置和尺寸时，我们才会进行舍入。此外，舍入是相对于根节点而不是父节点进行的，同样是为了避免累积舍入误差。

## 示例

```SnackPlayer name=PixelRatio%20Example
import React from 'react';
import {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const size = 50;
const cat = {
  uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
  width: size,
  height: size,
};

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text>Current Pixel Ratio is:</Text>
          <Text style={styles.value}>{PixelRatio.get()}</Text>
        </View>
        <View style={styles.container}>
          <Text>Current Font Scale is:</Text>
          <Text style={styles.value}>{PixelRatio.getFontScale()}</Text>
        </View>
        <View style={styles.container}>
          <Text>On this device images with a layout width of</Text>
          <Text style={styles.value}>{size} px</Text>
          <Image source={cat} />
        </View>
        <View style={styles.container}>
          <Text>require images with a pixel width of</Text>
          <Text style={styles.value}>
            {PixelRatio.getPixelSizeForLayoutSize(size)} px
          </Text>
          <Image
            source={cat}
            style={{
              width: PixelRatio.getPixelSizeForLayoutSize(size),
              height: PixelRatio.getPixelSizeForLayoutSize(size),
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    marginBottom: 12,
    marginTop: 4,
  },
});

export default App;
```

---

# 参考

## 方法

### `get()`

```tsx
static get(): number;
```

返回设备像素密度。一些示例：

- `PixelRatio.get() === 1`
  - [mdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 1.5`
  - [hdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 2`
  - iPhone SE, 6S, 7, 8
  - iPhone XR
  - iPhone 11
  - [xhdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 3`
  - iPhone 6S Plus, 7 Plus, 8 Plus
  - iPhone X, XS, XS Max
  - iPhone 11 Pro, 11 Pro Max
  - Pixel, Pixel 2
  - [xxhdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 3.5`
  - Nexus 6
  - Pixel XL, Pixel 2 XL
  - [xxxhdpi Android 设备](https://material.io/tools/devices/)

---

### `getFontScale()`

```tsx
static getFontScale(): number;
```

返回字体大小的缩放因子。这是用于计算绝对字体大小的比率，因此任何严重依赖于此的元素都应使用此来进行计算。

- 在 Android 上，值反映用户在 **设置 > 显示 > 字体大小** 中设置的偏好
- 在 iOS 上，值反映用户在 **设置 > 显示与亮度 > 文本大小** 中设置的偏好，值也可以在 **设置 > 辅助功能 > 显示与文本大小 > 更大字体** 中更新

如果未设置字体缩放，这将返回设备像素比率。

---

### `getPixelSizeForLayoutSize()`

```tsx
static getPixelSizeForLayoutSize(layoutSize: number): number;
```

将布局大小 (dp) 转换为像素大小 (px)。

保证返回一个整数。

---

### `roundToNearestPixel()`

```tsx
static roundToNearestPixel(layoutSize: number): number;
```

将布局大小 (dp) 舍入到最接近的对应于整数像素数的布局大小。例如，在 PixelRatio 为 3 的设备上，`PixelRatio.roundToNearestPixel(8.4) = 8.33`，这正好对应 (8.33 \* 3) = 25 像素。
