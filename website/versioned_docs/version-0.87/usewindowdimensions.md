---
id: usewindowdimensions
title: useWindowDimensions
---

```tsx
import {useWindowDimensions} from 'react-native';
```

当屏幕尺寸或字体缩放发生变化时，`useWindowDimensions` 会自动更新其所有值。你可以像这样获取应用窗口的宽度和高度：

```tsx
const {height, width} = useWindowDimensions();
```

## 示例

```SnackPlayer name=useWindowDimensions&supportedPlatforms=ios,android
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const {height, width, scale, fontScale} = useWindowDimensions();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Window Dimension Data</Text>
        <Text>Height: {height}</Text>
        <Text>Width: {width}</Text>
        <Text>Font scale: {fontScale}</Text>
        <Text>Pixel ratio: {scale}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default App;
```

## 属性

### `fontScale`

```tsx
useWindowDimensions().fontScale;
```

当前使用的字体缩放比例。一些操作系统允许用户将字体大小调大或调小，以获得更舒适的阅读体验。此属性可以让你知道当前生效的缩放比例。

---

### `height`

```tsx
useWindowDimensions().height;
```

应用所占用窗口或屏幕的像素高度。

---

### `scale`

```tsx
useWindowDimensions().scale;
```

应用运行所在设备的像素比。其值可能为：

- `1`，表示一个点等于一个像素（通常 PPI/DPI 为 96，某些平台为 76）。
- `2` 或 `3`，表示 Retina 或高 DPI 显示屏。

---

### `width`

```tsx
useWindowDimensions().width;
```

应用所占用窗口或屏幕的像素宽度。
