---
id: appstate
title: AppState
---

`AppState` 可以告诉你应用程序是在前台还是后台运行，并在状态发生变化时通知你。

AppState 常用于确定在处理推送通知时的意图和正确行为。

### 应用状态

- `active` - 应用在前台运行
- `background` - 应用在后台运行。用户可能处于以下任一情况：
  - 在另一个应用中
  - 在主屏幕上
  - [Android] 在另一个 `Activity` 上，包括临时系统活动，例如自动填充凭据选择器（即使它是由你的应用或系统启动的）
- [iOS] `inactive` - 这是在前后台切换期间发生的一种状态，也会出现在无活动期间，例如进入多任务视图、打开通知中心，或来电时。

更多信息请参见 [Apple 官方文档](https://developer.apple.com/documentation/uikit/app_and_scenes/managing_your_app_s_life_cycle)

## 基本用法

要查看当前状态，你可以检查 `AppState.currentState`，它将保持最新。

:::info
如果你使用的是旧架构，`currentState` 在启动时为 `null`，直到从原生端异步检索到它。
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
        <Text>当前状态是：{appStateVisible}</Text>
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

此示例似乎只会显示“当前状态是：active"，因为应用程序仅在 `active` 状态下才对用户可见。如果你想尝试此代码，我们建议使用你自己的设备而不是嵌入式预览。

---

# 参考

## 事件

### `change`

当应用状态发生变化时触发该事件。监听器会接收到 [当前应用状态值](appstate#app-states) 之一。

### `memoryWarning` <div className="label ios">iOS</div>

当应用收到操作系统的内存警告时触发。

### `focus` <div className="label android">Android</div>

当应用获得焦点（用户正在与应用交互）时接收该事件。

### `blur` <div className="label android">Android</div>

当用户不再主动与应用交互时接收该事件。在用户下拉 [通知抽屉](https://developer.android.com/guide/topics/ui/notifiers/notifications#bar-and-drawer) 时很有用。此时 `AppState` 不会改变，但 `blur` 事件会被触发。

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

设置一个函数，当在 AppState 上发生指定事件类型时会调用该函数。`eventType` 的有效值 [见上文](#events)。返回一个 `EventSubscription`。

## 属性

### `currentState`

```tsx
static currentState: AppStateStatus;
```
