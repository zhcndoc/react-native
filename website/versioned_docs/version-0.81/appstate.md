---
id: appstate
title: AppState
---

`AppState` 可以告诉你应用当前是在前台还是后台，并在状态变化时通知你。

AppState 常用于在处理推送通知时判断意图以及采取合适的行为。

### App 状态

- `active` - 应用正在前台运行
- `background` - 应用正在后台运行。用户此时可能处于以下任一情况：
  - 在另一个应用中
  - 在主屏幕上
  - [Android] 在另一个 `Activity` 上，包括临时系统活动，例如自动填充凭据选择器（即使由你的应用或系统启动）
- [iOS] `inactive` - 这是一个在前台与后台之间切换时出现的状态，以及在不活跃期间出现的状态，例如进入多任务视图、打开通知中心，或来电时。

更多信息请参阅 [Apple 的文档](https://developer.apple.com/documentation/uikit/app_and_scenes/managing_your_app_s_life_cycle)

## 基本用法

要查看当前状态，可以检查 `AppState.currentState`，它会保持最新。

:::info
如果你使用的是旧架构，`currentState` 在启动时会是 `null`，直到它从原生端异步获取到为止。
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
        console.log('应用已进入前台！');
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

这个示例最终只会显示“当前状态是：active”，因为应用只有在 `active` 状态下才对用户可见。如果你想尝试这段代码，我们建议使用自己的设备，而不是内嵌预览。

---

# 参考

## 事件

### `change`

当应用状态发生变化时会收到此事件。监听器会被调用，并传入 [当前应用状态值](appstate#app-states) 之一。

### `memoryWarning` <div className="label ios">iOS</div>

当应用从操作系统收到内存警告时触发。

### `focus` <div className="label android">Android</div>

当应用获得焦点时收到（用户正在与应用交互）。

### `blur` <div className="label android">Android</div>

当用户没有在积极与应用交互时收到。适用于用户下拉 [通知栏](https://developer.android.com/guide/topics/ui/notifiers/notifications#bar-and-drawer) 的场景。`AppState` 不会改变，但会触发 `blur` 事件。

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

设置一个函数，每当 AppState 上指定类型的事件发生时都会调用它。`eventType` 的有效值如上所示 [列出](#events)。返回 `EventSubscription`。

## 属性

### `currentState`

```tsx
static currentState: AppStateStatus;
```
