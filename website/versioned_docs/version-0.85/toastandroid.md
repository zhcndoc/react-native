---
id: toastandroid
title: ToastAndroid
---

React Native 的 ToastAndroid API 将 Android 平台的 ToastAndroid 模块暴露为一个 JS 模块。它提供了 `show(message, duration)` 方法，该方法接受以下参数：

- _message_ 包含要显示为 Toast 的文本的字符串
- _duration_ Toast 的持续时间——可以是 `ToastAndroid.SHORT` 或 `ToastAndroid.LONG`

你也可以使用 `showWithGravity(message, duration, gravity)` 来指定 Toast 出现在屏幕布局中的位置。可以是 `ToastAndroid.TOP`、`ToastAndroid.BOTTOM` 或 `ToastAndroid.CENTER`。

`showWithGravityAndOffset(message, duration, gravity, xOffset, yOffset)` 方法增加了指定像素偏移量的能力。

:::note
从 Android 11（API 级别 30）开始，设置 gravity 对文本 Toast 无效。有关更改的信息请阅读 [这里](https://developer.android.com/about/versions/11/behavior-changes-11#text-toast-api-changes)。
:::

```SnackPlayer name=Toast%20Android%20API%20Example&supportedPlatforms=android
import {StyleSheet, ToastAndroid, Button, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const showToast = () => {
    ToastAndroid.show('附近出现了一只皮卡丘！', ToastAndroid.SHORT);
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      '你们的一切基础都已归我们所有',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      '一只野生 toast 出现了！',
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

此方法仅在 Android API 29 及以下版本有效。对于更高版本的 Android API 上的类似功能，请考虑使用 snackbar 或 notification。

```tsx
static showWithGravity(message: string, duration: number, gravity: number);
```

---

### `showWithGravityAndOffset()`

此方法仅在 Android API 29 及以下版本有效。对于更高版本的 Android API 上的类似功能，请考虑使用 snackbar 或 notification。

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

指示屏幕上的持续时间。

```tsx
static SHORT: number;
```

---

### `LONG`

指示屏幕上的持续时间。

```tsx
static LONG: number;
```

---

### `TOP`

指示屏幕上的位置。

```tsx
static TOP: number;
```

---

### `BOTTOM`

指示屏幕上的位置。

```tsx
static BOTTOM: number;
```

---

### `CENTER`

指示屏幕上的位置。

```tsx
static CENTER: number;
```
