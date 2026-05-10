---
id: usewindowdimensions
title: useWindowDimensions
---

```tsx
import {useWindowDimensions} from 'react-native';
```

`useWindowDimensions` 会在屏幕尺寸或字体缩放发生变化时自动更新其所有值。你可以像这样获取应用窗口的宽度和高度：

```tsx
const {height, width} = useWindowDimensions();
```

## 示例

```SnackPlayer name=useWindowDimensions&supportedPlatforms=ios,android
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const {height, width, scale, fontScale} = useWindowDimensions();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>窗口尺寸数据</Text>
        <Text>高度: {height}</Text>
        <Text>宽度: {width}</Text>
        <Text>字体缩放: {fontScale}</Text>
        <Text>像素比: {scale}</Text>
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

当前使用的字体缩放比例。某些操作系统允许用户将字体大小放大或缩小，以获得更舒适的阅读体验。此属性可让你了解当前生效的设置。

---

### `height`

```tsx
useWindowDimensions().height;
```

你的应用所占用窗口或屏幕的像素高度。

---

### `scale`

```tsx
useWindowDimensions().scale;
```

你的应用运行所在设备的像素比。其值可以是：

- `1`，表示一个点等于一个像素（通常 PPI/DPI 为 96，某些平台上为 76）。
- `2` 或 `3`，表示 Retina 或高 DPI 显示屏。

---

### `width`

```tsx
useWindowDimensions().width;
```

你的应用所占用窗口或屏幕的像素宽度。
