---
id: usewindowdimensions
title: useWindowDimensions
---

```tsx
import {useWindowDimensions} from 'react-native';
```

`useWindowDimensions` 会在屏幕尺寸或字体缩放变化时自动更新其所有值。你可以像这样获取应用窗口的宽度和高度：

```tsx
const {height, width} = useWindowDimensions();
```

## 示例

```SnackPlayer name=useWindowDimensions&supportedPlatforms=ios,android
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const {height, width, scale, fontScale} = useWindowDimensions();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Window Dimension Data</Text>
        <View>
          <Text>Height: {height}</Text>
          <Text>Width: {width}</Text>
          <Text>Font scale: {fontScale}</Text>
          <Text>Pixel ratio: {scale}</Text>
        </View>
        <View
          style={{
            width: 100 * fontScale,
            padding: 16 * fontScale,
            ...styles.box,
          }}>
          <Text style={{fontSize: 14 / fontScale}}>Dynamic Box</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  header: {
    fontSize: 20,
  },
  box: {
    minWidth: 100,
    backgroundColor: '#06bcee',
  },
});

export default App;
```

## 属性

### `fontScale`

```tsx
useWindowDimensions().fontScale;
```

当前使用的字体缩放比例。某些操作系统允许用户将字体大小放大或缩小，以提高阅读舒适度。该属性可让你了解当前生效的设置。

:::note
改变字体大小比例后，可以动态调整内边距、外边距和容器高度等 UI 元素尺寸，以确保体验一致且易于访问。开发者可以利用 `fontScale` 属性，让应用更好地适应用户对较大或较小文字的偏好，提升可读性和易用性。
:::

---

### `height`

```tsx
useWindowDimensions().height;
```

应用所占窗口或屏幕的像素高度。

---

### `scale`

```tsx
useWindowDimensions().scale;
```

应用运行设备的像素比。取值可以是：

- `1`，表示一个点等于一个像素（通常 PPI/DPI 为 96，某些平台为 76）。
- `2` 或 `3`，表示 Retina 或高 DPI 显示屏。

---

### `width`

```tsx
useWindowDimensions().width;
```

应用所占窗口或屏幕的像素宽度。
