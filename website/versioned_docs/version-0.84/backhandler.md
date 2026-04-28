---
id: backhandler
title: 返回按钮处理器（BackHandler）
---

BackHandler API 用于检测硬件返回按钮的按下事件，允许你为系统的返回操作注册事件监听器，并控制应用的响应方式。该功能仅限于 Android 平台。

事件订阅按逆序调用（即最后注册的订阅最先被调用）。

- **如果某个订阅返回 true，** 则先前注册的订阅将不被调用。
- **如果没有订阅返回 true 或根本没有注册订阅，** 则会程序化地调用默认的返回按钮功能来退出应用。

:::warning[Warning for modal users]
如果你的应用显示了一个已打开的 `Modal`，`BackHandler` 将不会触发任何事件（[参见 `Modal` 文档](modal#onrequestclose)）。
:::

## 使用示例

```tsx
const subscription = BackHandler.addEventListener(
  'hardwareBackPress',
  function () {
    /**
     * this.onMainScreen 和 this.goBack 只是示例，
     * 你需要根据自己的实现调整这里的逻辑。
     *
     * 通常情况下，你会使用导航器返回到上一个状态。
     */

    if (!this.onMainScreen()) {
      this.goBack();
      /**
       * 返回 true 表示事件不会被冒泡，
       * 且不会执行其他的返回操作。
       */
      return true;
    }
    /**
     * 返回 false 会允许事件冒泡，
     * 并执行其他事件监听器或系统默认的返回操作。
     */
    return false;
  },
);

// 在组件卸载时取消订阅监听
subscription.remove();
```

## 示例

下面的示例展示了一个场景：当用户按返回键时，确认是否退出应用：

```SnackPlayer name=BackHandler&supportedPlatforms=android
import React, {useEffect} from 'react';
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
        {text: '确定', onPress: () => BackHandler.exitApp()},
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

`BackHandler.addEventListener` 会创建一个事件监听器并返回一个 `NativeEventSubscription` 对象，该对象应通过调用其 `NativeEventSubscription.remove` 方法进行取消订阅。

## 与 React Navigation 一起使用

如果你使用 React Navigation 在不同屏幕间导航，可以参考他们的指南：[自定义安卓返回按钮行为](https://reactnavigation.org/docs/custom-android-back-button-handling/)

## BackHandler Hook

[React Native Hooks](https://github.com/react-native-community/hooks#usebackhandler) 提供了一个非常方便的 `useBackHandler` Hook，使设置事件监听更简单。

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
