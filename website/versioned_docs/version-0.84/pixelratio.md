---
id: pixelratio
title: 像素比例 (PixelRatio)
---

`PixelRatio` 让你可以访问设备的像素密度和字体缩放比例。

## 获取正确尺寸的图片

如果你使用的是高像素密度设备，应该获取更高分辨率的图片。一个简单的经验法则是将你展示的图片尺寸乘以像素比例。

```tsx
const image = getImage({
  width: PixelRatio.getPixelSizeForLayoutSize(200),
  height: PixelRatio.getPixelSizeForLayoutSize(100),
});
<Image source={image} style={{width: 200, height: 100}} />;
```

## 像素网格对齐

在 iOS 中，你可以为元素指定任意精度的位置和尺寸，比如 29.674825。但实际物理显示屏只有固定数量的像素，比如 iPhone SE（第一代）是 640×1136，iPhone 11 是 828×1792。iOS 会尽量忠实地呈现用户设定的数值，将一个原始像素拆分为多个像素以“欺骗”视觉。这个技巧的缺点是会使得最终元素看起来模糊。

实际上，我们发现开发者并不希望有这种模糊特性，他们不得不通过手动四舍五入来避免出现模糊的元素。在 React Native 中，我们会自动对所有像素进行四舍五入。

我们在何时进行四舍五入必须非常小心。你绝不能同时使用四舍五入和值未四舍五入的数值，否则会累积四舍五入误差。有一次四舍五入误差就很致命了，因为一个像素的边框可能会消失或变成两倍宽。

在 React Native 中，JavaScript 和布局引擎中的所有数值都是高精度的。只有在主线程上为原生元素设置位置和尺寸时才进行四舍五入。此外，四舍五入是相对于根元素的，而不是父元素，以避免累积四舍五入误差。

## 示例

```SnackPlayer name=PixelRatio%20Example
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
          <Text>当前的像素比例是：</Text>
          <Text style={styles.value}>{PixelRatio.get()}</Text>
        </View>
        <View style={styles.container}>
          <Text>当前的字体缩放比例是：</Text>
          <Text style={styles.value}>{PixelRatio.getFontScale()}</Text>
        </View>
        <View style={styles.container}>
          <Text>在此设备上，布局宽度为</Text>
          <Text style={styles.value}>{size} px</Text>
          <Image source={cat} />
        </View>
        <View style={styles.container}>
          <Text>的图片，需要像素宽度为</Text>
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

返回设备像素密度。部分示例：

- `PixelRatio.get() === 1`
  - [mdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 1.5`
  - [hdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 2`
  - iPhone SE、6S、7、8
  - iPhone XR
  - iPhone 11
  - [xhdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 3`
  - iPhone 6S Plus、7 Plus、8 Plus
  - iPhone X、XS、XS Max
  - iPhone 11 Pro、11 Pro Max
  - Pixel、Pixel 2
  - [xxhdpi Android 设备](https://material.io/tools/devices/)
- `PixelRatio.get() === 3.5`
  - Nexus 6
  - Pixel XL、Pixel 2 XL
  - [xxxhdpi Android 设备](https://material.io/tools/devices/)

---

### `getFontScale()`

```tsx
static getFontScale(): number;
```

返回字体大小的缩放因子。此值用于计算绝对字体大小，因此依赖字体大小的元素应使用此值进行计算。

- Android 上反映用户在 **设置 > 显示 > 字体大小** 中设置的偏好
- iOS 上反映用户在 **设置 > 显示与亮度 > 文字大小** 中设置的偏好，值也可以在 **设置 > 辅助功能 > 显示与文字大小 > 更大文字** 中调整

如果未设置字体缩放，则返回设备的像素比例。

---

### `getPixelSizeForLayoutSize()`

```tsx
static getPixelSizeForLayoutSize(layoutSize: number): number;
```

将布局尺寸（dp）转换为像素尺寸（px）。

保证返回整数。

---

### `roundToNearestPixel()`

```tsx
static roundToNearestPixel(layoutSize: number): number;
```

将布局尺寸（dp）四舍五入为对应整数像素数的最近布局尺寸。例如，在像素比例为 3 的设备上，`PixelRatio.roundToNearestPixel(8.4) = 8.33`，对应精确的 (8.33 * 3) = 25 个像素。