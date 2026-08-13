---
id: appstate
title: AppState
---

`AppState` 可以告诉你应用处于前台还是后台，并在状态发生变化时通知你。

AppState 经常用于在处理推送通知时确定意图和适当的行为。

### 应用状态

- `active` - 应用正在前台运行
- `background` - 应用正在后台运行。用户可能：
  - 位于其他应用中
  - 位于主屏幕
  - [Android] 位于其他 `Activity` 中，包括自动填充凭据选择器等临时系统活动（即使该活动由你的应用或系统启动）
- [iOS] `inactive` - 这是在前台和后台之间切换时，以及进入多任务视图、打开通知中心或收到来电等非活动期间出现的状态。

如需更多信息，请参阅 [Apple 的文档](https://developer.apple.com/documentation/uikit/app_and_scenes/managing_your_app_s_life_cycle)

## 基本用法

如需查看当前状态，可以检查 `AppState.currentState`，它会保持最新状态。

:::info
如果你使用的是旧版架构，`currentState` 在启动时将为 `null`，直到从原生端异步获取该值。
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

这个示例看起来只会显示“当前状态为：active”，因为应用只有在 `active` 状态下对用户可见。如果你想要尝试运行这段代码，我们建议使用你自己的设备，而不是嵌入式预览。

---

# 参考

## 事件

### `change`

当应用状态发生变化时会接收到此事件。监听器会接收[当前应用状态值](appstate#app-states)中的一个值。

### `memoryWarning` <div className="label ios">iOS</div>

当应用从操作系统收到内存警告时触发。

### `focus` <div className="label android">Android</div>

当应用获得焦点时接收（用户正在与应用交互）。

### `blur` <div className="label android">Android</div>

当用户未主动与应用交互时接收。在用户下拉[通知抽屉](https://developer.android.com/guide/topics/ui/notifiers/notifications#bar-and-drawer)等情况下很有用。`AppState` 不会发生变化，但会触发 `blur` 事件。

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

设置一个函数，以便在 AppState 发生指定事件类型时调用。`eventType` 的有效值[如上所列](#events)。返回 `EventSubscription`。

## 属性

### `currentState`

```tsx
static currentState: AppStateStatus;
```
