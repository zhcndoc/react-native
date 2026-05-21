---
id: appstate
title: AppState
---

`AppState` 可以告诉你应用是在前台还是后台，并在状态变化时通知你。

AppState 常用于在处理推送通知时确定意图和适当的行为。

### 应用状态

- `active` - 应用正在前台运行
- `background` - 应用正在后台运行。用户此时可能处于以下任一状态：
  - 在另一个应用中
  - 在主屏幕上
  - [Android] 在另一个 `Activity` 中，包括临时的系统活动，例如自动填充凭据选择器（即使它是由你的应用或系统启动的）
- [iOS] `inactive` - 这是在前台与后台之间切换时出现的一种状态，以及在诸如进入多任务视图、打开通知中心或有来电时的空闲期间出现的状态。

更多信息，请参阅 [Apple 的文档](https://developer.apple.com/documentation/uikit/app_and_scenes/managing_your_app_s_life_cycle)

## 基本用法

要查看当前状态，你可以检查 `AppState.currentState`，它将保持最新。

:::info
如果你使用的是旧架构，`currentState` 在启动时将变为 `null`，直到从原生端异步检索到它。
:::

```SnackPlayer name=AppState%20Example
import React, {useRef, useState, useEffect} from 'react';
import {AppState, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const AppStateExample = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Current state is: {appStateVisible}</Text>
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
});

export default AppStateExample;
```

此示例似乎只会显示“当前状态是：active"，因为应用只有在 `active` 状态下才对用户可见。如果你想尝试这段代码，我们建议使用你自己的设备而不是嵌入式预览。

---

# 参考

## 事件

### `change`

当应用状态发生变化时会收到此事件。监听器会使用 [当前应用状态值之一](appstate#app-states) 调用。

### `memoryWarning` <div className="label ios">iOS</div>

当应用收到操作系统的内存警告时触发。

### `focus` <div className="label android">Android</div>

当应用获得焦点（用户正在与应用交互）时接收。

### `blur` <div className="label android">Android</div>

当用户未积极与应用交互时接收。适用于用户下拉 [通知栏](https://developer.android.com/guide/topics/ui/notifiers/notifications#bar-and-drawer) 的情况。`AppState` 不会改变，但 `blur` 事件会被触发。

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

设置一个函数，每当 AppState 上发生指定的事件类型时该函数将被调用。`eventType` 的有效值 [如上所列](#events)。返回 `EventSubscription`。

## 属性

### `currentState`

```tsx
static currentState: AppStateStatus;
```
