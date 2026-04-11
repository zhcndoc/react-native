---
id: backhandler
title: BackHandler
---

BackHandler API 检测用于后退导航的硬件按钮按下，允许你为系统的后退操作注册事件监听器，并允许你控制应用如何响应。它仅适用于 Android。

事件订阅按相反顺序调用（即最后注册的订阅最先被调用）。

- **如果一个订阅返回 true，** 则较早注册的订阅将不会被调用。
- **如果没有订阅返回 true 或没有注册任何订阅，** 它以编程方式调用默认的后退按钮功能以退出应用。

:::warning 模态框用户警告
如果您的应用显示了一个打开的 `Modal`，`BackHandler` 将不会发布任何事件（[见 `Modal` 文档](modal#onrequestclose)）。
:::

## 模式

```tsx
const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  function () {
    /**
     * this.onMainScreen 和 this.goBack 只是示例，
     * 你需要在这里使用你自己的实现。
     *
     * 通常你会在这里使用 navigator 回到上一个状态。
     */

    if (!this.onMainScreen()) {
      this.goBack();
      /**
       * 当返回 true 时，事件将不会冒泡
       * & 也不会执行其他后退操作
       */
      return true;
    }
    /**
     * 返回 false 将让事件冒泡 & 让其他事件监听器
     * 或系统的默认后退操作被执行。
     */
    return false;
  },
);

// 在卸载时取消订阅监听器
subscription.remove();
```

## 示例

以下示例实现了一个场景，确认用户是否想要退出应用：

```SnackPlayer name=BackHandler&supportedPlatforms=android
import React, {useEffect} from 'react';
import {Text, StyleSheet, BackHandler, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
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
        <Text style={styles.text}>Click Back button!</Text>
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

`BackHandler.addEventListener` 创建一个事件监听器 & 返回一个 `NativeEventSubscription` 对象，该对象应使用 `NativeEventSubscription.remove` 方法清除。

## 与 React Navigation 一起使用

如果您使用 React Navigation 在不同屏幕间导航，您可以遵循他们关于 [自定义 Android 后退按钮行为](https://reactnavigation.org/docs/custom-android-back-button-handling/) 的指南

## BackHandler 钩子

[React Native Hooks](https://github.com/react-native-community/hooks#usebackhandler) 有一个很好的 `useBackHandler` 钩子，它将简化设置事件监听器的过程。

---

# 参考

## 方法

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
