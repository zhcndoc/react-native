---
id: backhandler
title: BackHandler
---

Backhandler API 可检测用于返回导航的硬件按钮按下事件，让你注册系统返回操作的事件监听器，并让你控制应用程序的响应方式。它仅适用于 Android。

事件订阅会按相反顺序调用（即，最后注册的订阅会先被调用）。

- **如果某个订阅返回 true，**那么更早注册的订阅将不会被调用。
- **如果没有订阅返回 true，或者没有注册任何订阅，**则会以编程方式调用默认的返回按钮功能来退出应用。

:::warning[模态框用户警告]
如果你的应用显示了一个已打开的 `Modal`，`BackHandler` 将不会发布任何事件（[参见 `Modal` 文档](modal#onrequestclose)）。
:::

## Pattern

```tsx
const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  function () {
    /**
     * this.onMainScreen 和 this.goBack 只是示例，
     * 这里需要使用你自己的实现。
     *
     * 通常你会在这里使用 navigator 跳转到上一个状态。
     */

    if (!this.onMainScreen()) {
      this.goBack();
      /**
       * 当返回 true 时，事件不会继续向上传播
       * 且不会执行其他返回操作
       */
      return true;
    }
    /**
     * 返回 false 会让事件继续向上传播，并让其他事件监听器
     * 或系统默认的返回操作得以执行。
     */
    return false;
  },
);

// 在卸载时取消订阅该监听器
subscription.remove();
```

## Example

以下示例实现了一个场景：当用户想退出应用时进行确认：

```SnackPlayer name=BackHandler&supportedPlatforms=android
import {useEffect} from 'react';
import {Text, StyleSheet, BackHandler, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('请稍等！', '你确定要返回吗？', [
        {
          text: '取消',
          onPress: () => null,
          style: 'cancel',
        },
        {text: '是', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>点击返回按钮！</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
```

`BackHandler.addEventListener` 会创建一个事件监听器，并返回一个 `NativeEventSubscription` 对象，该对象应使用 `NativeEventSubscription.remove` 方法清除。

## 与 React Navigation 搭配使用

如果你使用 React Navigation 在不同屏幕之间导航，可以参考他们关于[自定义 Android 返回按钮行为](https://reactnavigation.org/docs/custom-android-back-button-handling/)的指南。

## Backhandler hook

[React Native Hooks](https://github.com/react-native-community/hooks#usebackhandler) 提供了一个很不错的 `useBackHandler` hook，可以简化设置事件监听器的过程。

---

# Reference

## Methods

### `addEventListener()`

```tsx
static addEventListener(
  eventName: BackPressEventName,
  handler: () => boolean | null | undefined,
): NativeEventSubscription;
```

---

### `exitApp()`

```tsx
static exitApp();
```
