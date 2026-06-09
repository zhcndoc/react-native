---
id: pixelratio
title: PixelRatio
---

`PixelRatio` 让你可以访问设备的像素密度和字体缩放比例。

## 获取正确尺寸的图片

如果你使用的是高像素密度设备，应该获取更高分辨率的图片。一个经验法则是将你显示的图片尺寸乘以像素比。

```tsx
const image = getImage({
  width: PixelRatio.getPixelSizeForLayoutSize(200),
  height: PixelRatio.getPixelSizeForLayoutSize(100),
});
<Image source={image} style={{width: 200, height: 100}} />;
```

## 像素网格对齐

在 iOS 中，你可以为元素指定任意精度的位置和尺寸，例如 29.674825。但最终，物理显示屏只具有固定数量的像素，例如 iPhone SE（第一代）为 640×1136，iPhone 11 为 828×1792。iOS 会尽可能忠实于用户值，通过将一个原始像素扩展为多个像素来迷惑眼睛。这种技术的缺点是会让最终元素看起来模糊。

在实践中，我们发现开发者并不希望有这个特性，他们不得不通过手动取整来规避它，以避免元素模糊。在 React Native 中，我们会自动对所有像素进行取整。

我们必须小心何时进行这种取整。你绝不能同时使用已取整和未取整的值，因为这样会累积取整误差。哪怕只有一个取整误差也很致命，因为 1 像素的边框可能会消失，或者变成两倍大。

在 React Native 中，JavaScript 中以及布局引擎内的所有内容都使用任意精度数值。只有当我们在主线程上设置原生元素的位置和尺寸时，才会进行取整。此外，取整是相对于根节点而不是父节点进行的，同样是为了避免累积取整误差。

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
          <Text>当前像素比是：</Text>
          <Text style={styles.value}>{PixelRatio.get()}</Text>
        </View>
        <View style={styles.container}>
          <Text>当前字体缩放比例是：</Text>
          <Text style={styles.value}>{PixelRatio.getFontScale()}</Text>
        </View>
        <View style={styles.container}>
          <Text>在这台设备上，布局宽度为</Text>
          <Text style={styles.value}>{size} px</Text>
          <Image source={cat} />
        </View>
        <View style={styles.container}>
          <Text>需要像素宽度为</Text>
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

返回设备像素密度。示例如下：

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

返回字体大小的缩放因子。这是用于计算绝对字体大小的比例，因此任何高度依赖这一点的元素都应使用它来进行计算。

- 在 Android 上，该值反映用户在 **设置 > 显示 > 字体大小** 中设置的偏好
- 在 iOS 上，该值反映用户在 **设置 > 显示与亮度 > 文本大小** 中设置的偏好，也可以在 **设置 > 辅助功能 > 显示与文字大小 > 更大文本** 中更新

如果未设置字体缩放比例，则返回设备像素比。

---

### `getPixelSizeForLayoutSize()`

```tsx
static getPixelSizeForLayoutSize(layoutSize: number): number;
```

将布局尺寸（dp）转换为像素尺寸（px）。

保证返回一个整数。

---

### `roundToNearestPixel()`

```tsx
static roundToNearestPixel(layoutSize: number): number;
```

将布局尺寸（dp）四舍五入到对应于整数像素数量的最接近布局尺寸。例如，在像素比为 3 的设备上，`PixelRatio.roundToNearestPixel(8.4) = 8.33`，这正好对应 `(8.33 \* 3) = 25` 像素。
