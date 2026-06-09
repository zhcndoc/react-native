---
id: usewindowdimensions
title: useWindowDimensions
---

```tsx
import {useWindowDimensions} from 'react-native';
```

`useWindowDimensions` 会在屏幕尺寸或字体缩放发生变化时自动更新其所有值。您可以像这样获取应用程序窗口的宽度和高度：

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
        <Text>像素比率：{scale}</Text>
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

当前使用的字体缩放比例。某些操作系统允许用户放大或缩小字体尺寸以提高阅读舒适度。此属性将让您知道生效的设置。

---

### `height`

```tsx
useWindowDimensions().height;
```

您的应用所占用的窗口或屏幕的高度（像素）。

---

### `scale`

```tsx
useWindowDimensions().scale;
```

您的应用运行设备的像素比率。值可以是：

- `1` 表示一个点等于一个像素（在某些平台上通常为 96 或 76 PPI/DPI）。
- `2` 或 `3` 表示 Retina 或高 DPI 显示屏。

---

### `width`

```tsx
useWindowDimensions().width;
```

您的应用所占用的窗口或屏幕的宽度（像素）。
