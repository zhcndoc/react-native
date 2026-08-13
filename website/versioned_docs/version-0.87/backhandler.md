---
id: backhandler
title: BackHandler
---

Backhandler API 可检测用于返回导航的硬件按钮按下操作，让你可以为系统返回操作注册事件监听器，并控制应用的响应方式。它仅限 Android。

事件订阅会按相反顺序调用（即最后注册的订阅最先调用）。

- **如果某个订阅返回 true，**则不会调用更早注册的订阅
- **如果没有订阅返回 true 或没有注册订阅，**则会以编程方式调用默认的返回按钮功能来退出应用

:::warning[对 modal 用户的警告]
如果你的应用显示了一个已打开的 `Modal`，`BackHandler` 将不会发布任何事件（[参见 `Modal` 文档](modal#onrequestclose)）
:::

## 模式

```tsx
const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  function () {
    /**
     * this.onMainScreen and this.goBack are just examples,
     * you need to use your own implementation here.
     *
     * Typically you would use the navigator here to go to the last state.
     */

    if (!this.onMainScreen()) {
      this.goBack();
      /**
       * When true is returned the event will not be bubbled up
       * & no other back action will execute
       */
      return true;
    }
    /**
     * Returning false will let the event to bubble up & let other event listeners
     * or the system's default back action to be executed.
     */
    return false;
  },
);

// Unsubscribe the listener on unmount
subscription.remove();
```

## 示例

以下示例实现了这样一种场景：确认用户是否想要退出应用：

```SnackPlayer name=BackHandler&supportedPlatforms=android
import {useEffect} from 'react';
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

`BackHandler.addEventListener` 会创建一个事件监听器，并返回一个 `NativeEventSubscription` 对象，该对象应使用 `NativeEventSubscription.remove` 方法清除

## 与 React Navigation 一起使用

如果你使用 React Navigation 在不同屏幕之间导航，可以参阅其关于[自定义 Android 返回按钮行为](https://reactnavigation.org/docs/custom-android-back-button-handling/)的指南

## Backhandler hook

[React Native Hooks](https://github.com/react-native-community/hooks#usebackhandler) 提供了一个很实用的 `useBackHandler` hook，可以简化设置事件监听器的过程

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
