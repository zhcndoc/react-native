---
id: usewindowdimensions
title: useWindowDimensions
---

```tsx
import {useWindowDimensions} from 'react-native';
```

`useWindowDimensions` 会在屏幕尺寸或字体缩放发生变化时自动更新所有值。你可以这样获取应用窗口的宽度和高度：

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
        <Text style={styles.header}>窗口尺寸数据</Text>
        <Text>高度：{height}</Text>
        <Text>宽度：{width}</Text>
        <Text>字体缩放：{fontScale}</Text>
        <Text>像素比：{scale}</Text>
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

当前使用的字体缩放比例。一些操作系统允许用户将字体大小调大或调小以方便阅读。此属性会告诉你当前的缩放比例。

---

### `height`

```tsx
useWindowDimensions().height;
```

应用占据的窗口或屏幕的高度（单位为像素）。

---

### `scale`

```tsx
useWindowDimensions().scale;
```

应用运行所在设备的像素比。可能的值有：

- `1` 表示一个点等于一个像素（通常 PPI/DPI 为 96，某些平台为 76）。
- `2` 或 `3` 表示 Retina 或高分辨率显示屏。

---

### `width`

```tsx
useWindowDimensions().width;
```

应用占据的窗口或屏幕的宽度（单位为像素）。