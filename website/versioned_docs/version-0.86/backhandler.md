---
id: backhandler
title: BackHandler
---

BackHandler API 会检测用于返回导航的硬件按钮按下事件，允许你为系统的返回操作注册事件监听器，并让你控制应用程序的响应方式。它仅适用于 Android。

事件订阅会按相反顺序调用（即，最后注册的订阅会先调用）。

- **如果某个订阅返回 true，**那么更早注册的订阅将不会被调用。
- **如果没有任何订阅返回 true，或者没有注册任何订阅，**则会以编程方式调用默认的返回按钮功能来退出应用。

:::warning[使用 modal 的用户请注意]
如果你的应用显示了一个已打开的 `Modal`，`BackHandler` 将不会发布任何事件（[请参阅 `Modal` 文档](modal#onrequestclose)）。
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
     * 通常你会在这里使用 navigator 前往最后的状态。
     */

    if (!this.onMainScreen()) {
      this.goBack();
      /**
       * 当返回 true 时，事件不会向上冒泡
       * 且不会执行其他返回操作
       */
      return true;
    }
    /**
     * 返回 false 将允许事件向上冒泡，并让其他事件监听器
     * 或系统的默认返回操作被执行。
     */
    return false;
  },
);

// 在卸载时取消订阅监听器
subscription.remove();
```

## 示例

以下示例实现了一个场景：当用户想退出应用时进行确认：

```SnackPlayer name=BackHandler&supportedPlatforms=android
import {useEffect} from 'react';
import {Text, StyleSheet, BackHandler, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('请稍候！', '你确定要返回吗？', [
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

`BackHandler.addEventListener` 会创建一个事件监听器并返回一个 `NativeEventSubscription` 对象，该对象应使用 `NativeEventSubscription.remove` 方法清除。

## 与 React Navigation 一起使用

如果你使用 React Navigation 在不同屏幕之间导航，可以参考他们关于 [自定义 Android 返回按钮行为](https://reactnavigation.org/docs/custom-android-back-button-handling/) 的指南。

## Backhandler 钩子

[React Native Hooks](https://github.com/react-native-community/hooks#usebackhandler) 提供了一个很不错的 `useBackHandler` 钩子，可以简化设置事件监听器的过程。

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
