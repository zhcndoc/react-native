---
id: toastandroid
title: ToastAndroid
---

React Native 的 ToastAndroid API 将 Android 平台的 ToastAndroid 模块作为 JS 模块暴露。它提供了 `show(message, duration)` 方法，参数如下：

- _message_ 要显示的文本字符串
- _duration_ Toast 显示的时长——可以是 `ToastAndroid.SHORT` 或 `ToastAndroid.LONG`

你也可以使用 `showWithGravity(message, duration, gravity)` 来指定 toast 在屏幕布局中的显示位置。位置可为 `ToastAndroid.TOP`、`ToastAndroid.BOTTOM` 或 `ToastAndroid.CENTER`。

`showWithGravityAndOffset(message, duration, gravity, xOffset, yOffset)` 方法可以进一步指定像素偏移量。

:::note
从 Android 11（API 级别 30）开始，设置重力（gravity）不会对文本 toast 有效。详见 [这里](https://developer.android.com/about/versions/11/behavior-changes-11#text-toast-api-changes)。
:::

```SnackPlayer name=Toast%20Android%20API%20Example&supportedPlatforms=android
import React from 'react';
import {StyleSheet, ToastAndroid, Button, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const showToast = () => {
    ToastAndroid.show('附近出现了一个皮卡丘！', ToastAndroid.SHORT);
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      '你所有的基地都属于我们',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      '一个野生的 toast 出现了！',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button title="切换 Toast" onPress={() => showToast()} />
        <Button
          title="切换带重力的 Toast"
          onPress={() => showToastWithGravity()}
        />
        <Button
          title="切换带重力和偏移的 Toast"
          onPress={() => showToastWithGravityAndOffset()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#888888',
    padding: 8,
  },
});

export default App;
```

---

# 参考

## 方法

### `show()`

```tsx
static show(message: string, duration: number);
```

---

### `showWithGravity()`

该属性仅在 Android API 29 及以下版本有效。在更高的 Android API 上，类似功能建议使用 snackbar 或通知实现。

```tsx
static showWithGravity(message: string, duration: number, gravity: number);
```

---

### `showWithGravityAndOffset()`

该属性仅在 Android API 29 及以下版本有效。在更高的 Android API 上，类似功能建议使用 snackbar 或通知实现。

```tsx
static showWithGravityAndOffset(
  message: string,
  duration: number,
  gravity: number,
  xOffset: number,
  yOffset: number,
);
```

## 属性

### `SHORT`

表示在屏幕上的显示时长。

```tsx
static SHORT: number;
```

---

### `LONG`

表示在屏幕上的显示时长。

```tsx
static LONG: number;
```

---

### `TOP`

表示在屏幕上的位置。

```tsx
static TOP: number;
```

---

### `BOTTOM`

表示在屏幕上的位置。

```tsx
static BOTTOM: number;
```

---

### `CENTER`

表示在屏幕上的位置。

```tsx
static CENTER: number;
```
