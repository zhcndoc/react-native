---
id: appstate
title: AppState
---

`AppState` 可告诉你应用当前是在前台还是后台，并在状态变化时通知你。

AppState 经常用于在处理推送通知时确定意图以及正确的行为。

### App States

- `active` - 应用正在前台运行
- `background` - 应用正在后台运行。用户可能处于以下任一情况：
  - 在另一个应用中
  - 在主屏幕上
  - [Android] 在另一个 `Activity` 中，包括临时系统活动，例如自动填充凭据选择器（即使由你的应用或系统启动）
- [iOS] `inactive` - 这是一个在前后台切换期间，以及在空闲期间出现的状态，例如进入多任务视图、打开通知中心或来电时。

更多信息请参阅 [Apple 的文档](https://developer.apple.com/documentation/uikit/app_and_scenes/managing_your_app_s_life_cycle)

## Basic Usage

要查看当前状态，可以检查 `AppState.currentState`，它会保持最新。

:::info
如果你使用的是旧架构，`currentState` 在启动时将为 `null`，直到它从原生端异步获取完成。
:::

```SnackPlayer name=AppState%20Example
import {useRef, useState, useEffect} from 'react';
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
        console.log('App 已进入前台！');
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

这个示例看起来只会显示“当前状态是：active”，因为应用只有在 `active` 状态下才对用户可见。如果你想尝试这段代码，我们建议使用自己的设备，而不是嵌入式预览。

---

# Reference

## Events

### `change`

当应用状态发生变化时会收到此事件。监听器会接收 [当前应用状态值](appstate#app-states) 中的一个。

### `memoryWarning` <div className="label ios">iOS</div>

当应用从操作系统收到内存警告时触发。

### `focus` <div className="label android">Android</div>

当应用获得焦点时接收（用户正在与应用交互）。

### `blur` <div className="label android">Android</div>

当用户没有主动与应用交互时接收。在用户下拉 [通知栏](https://developer.android.com/guide/topics/ui/notifiers/notifications#bar-and-drawer) 的场景中很有用。`AppState` 不会变化，但会触发 `blur` 事件。

## Methods

### `addEventListener()`

```tsx
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

设置一个函数，每当 AppState 上发生指定类型的事件时都会调用它。`eventType` 的有效值 [列在上面](#events)。返回 `EventSubscription`。

## Properties

### `currentState`

```tsx
static currentState: AppStateStatus;
```
