---
id: interactionmanager
title: 🗑️ InteractionManager
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::warning[Deprecated]
避免长时间运行的工作，并改用 [`requestIdleCallback`](global-requestIdleCallback)。
:::

InteractionManager 允许在任何交互/动画完成后安排长时间运行的工作。特别是，这使得 JavaScript 动画能够流畅运行。

应用程序可以使用以下方法安排在交互之后运行的任务：

```tsx
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

将其与其他调度替代方案进行比较：

- `requestAnimationFrame()` 用于随时间动画化视图的代码。
- `setImmediate/setTimeout()` 稍后运行代码，注意这可能会延迟动画。
- `runAfterInteractions()` 稍后运行代码，而不延迟活动动画。

触摸处理系统将一个或多个活动触摸视为“交互”，并将延迟 `runAfterInteractions()` 回调，直到所有触摸结束或被取消。

InteractionManager 还允许应用程序通过创建交互“句柄”来注册动画，并在完成时清除它：

```tsx
const handle = InteractionManager.createInteractionHandle();
// 运行动画... (`runAfterInteractions` 任务已排队)
// 稍后，动画完成后：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄都被清除，排队的任务将运行
```

`runAfterInteractions` 接受普通回调函数，或带有 `gen` 方法（返回 `Promise`）的 `PromiseTask` 对象。如果提供了 `PromiseTask`，则在开始下一个可能早先同步排队任务之前，它将完全解析（包括通过 `runAfterInteractions` 调度更多任务的异步依赖项）。

默认情况下，排队任务在一个 `setImmediate` 批次中一起在循环中执行。如果调用 `setDeadline` 并传入正数，则任务将只执行到截止日期（就 js 事件循环运行时间而言）临近，此时执行将通过 setTimeout 让出，允许诸如触摸之类的事件启动交互并阻止排队任务执行，使应用程序响应更灵敏。

---

## 示例

### 基本

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=InteractionManager%20Function%20Component%20Basic%20Example&supportedPlatforms=ios,android&ext=js
import React, {useEffect} from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
  useAnimatedValue,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const instructions = Platform.select({
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇动以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇动或按菜单按钮打开开发者菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 当组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认创建一个交互句柄，如果你想禁用该
    // 行为，你可以将 isInteraction 设置为 false 来禁用它。
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [duration, opacity]);

  return opacity;
};

const Ball = ({onShown}) => {
  const opacity = useFadeIn();

  // 在动画后运行方法
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      onShown(),
    );
    return () => interactionPromise.cancel();
  }, [onShown]);

  return <Animated.View style={[styles.ball, {opacity}]} />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>{instructions}</Text>
        <Ball onShown={() => Alert.alert('动画已完成')} />
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
  ball: {
    width: 100,
    height: 100,
    backgroundColor: 'salmon',
    borderRadius: 100,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=InteractionManager%20Function%20Component%20Basic%20Example&supportedPlatforms=ios,android&ext=tsx
import React, {useEffect} from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
  useAnimatedValue,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const instructions = Platform.select({
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇动以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇动或按菜单按钮打开开发者菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 当组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认创建一个交互句柄，如果你想禁用该
    // 行为，你可以将 isInteraction 设置为 false 来禁用它。
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [duration, opacity]);

  return opacity;
};

type BallProps = {
  onShown: () => void;
};

const Ball = ({onShown}: BallProps) => {
  const opacity = useFadeIn();

  // 在动画后运行方法
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      onShown(),
    );
    return () => interactionPromise.cancel();
  }, [onShown]);

  return <Animated.View style={[styles.ball, {opacity}]} />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>{instructions}</Text>
        <Ball onShown={() => Alert.alert('动画已完成')} />
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
  ball: {
    width: 100,
    height: 100,
    backgroundColor: 'salmon',
    borderRadius: 100,
  },
});

export default App;
```

</TabItem>
</Tabs>

### 高级

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=InteractionManager%20Function%20Component%20Advanced%20Example&supportedPlatforms=ios,android&ext=js
import React, {useEffect} from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const instructions = Platform.select({
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇动以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇动或按菜单按钮打开开发者菜单',
});

// 你可以创建自定义交互/动画并添加
// 对 InteractionManager 的支持
const useCustomInteraction = (timeLocked = 2000) => {
  useEffect(() => {
    const handle = InteractionManager.createInteractionHandle();

    setTimeout(
      () => InteractionManager.clearInteractionHandle(handle),
      timeLocked,
    );

    return () => InteractionManager.clearInteractionHandle(handle);
  }, [timeLocked]);
};

const Ball = ({onInteractionIsDone}) => {
  useCustomInteraction();

  // 在交互后运行方法
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => onInteractionIsDone());
  }, [onInteractionIsDone]);

  return <Animated.View style={[styles.ball]} />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>{instructions}</Text>
        <Ball onInteractionIsDone={() => Alert.alert('交互已完成')} />
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
  ball: {
    width: 100,
    height: 100,
    backgroundColor: 'salmon',
    borderRadius: 100,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=InteractionManager%20Function%20Component%20Advanced%20Example&supportedPlatforms=ios,android&ext=tsx
import React, {useEffect} from 'react';
import {
  Alert,
  Animated,
  InteractionManager,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const instructions = Platform.select({
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇动以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇动或按菜单按钮打开开发者菜单',
});

// 你可以创建自定义交互/动画并添加
// 对 InteractionManager 的支持
const useCustomInteraction = (timeLocked = 2000) => {
  useEffect(() => {
    const handle = InteractionManager.createInteractionHandle();

    setTimeout(
      () => InteractionManager.clearInteractionHandle(handle),
      timeLocked,
    );

    return () => InteractionManager.clearInteractionHandle(handle);
  }, [timeLocked]);
};

type BallProps = {
  onInteractionIsDone: () => void;
};

const Ball = ({onInteractionIsDone}: BallProps) => {
  useCustomInteraction();

  // 在交互后运行方法
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => onInteractionIsDone());
  }, [onInteractionIsDone]);

  return <Animated.View style={[styles.ball]} />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>{instructions}</Text>
        <Ball onInteractionIsDone={() => Alert.alert('交互已完成')} />
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
  ball: {
    width: 100,
    height: 100,
    backgroundColor: 'salmon',
    borderRadius: 100,
  },
});

export default App;
```

</TabItem>
</Tabs>

# 参考

## 方法

### `runAfterInteractions()`

```tsx
static runAfterInteractions(task?: (() => any) | SimpleTask | PromiseTask);
```

安排一个函数在所有交互完成后运行。返回一个可取消的"promise"。

---

### `createInteractionHandle()`

```tsx
static createInteractionHandle(): Handle;
```

通知管理器交互已开始。

---

### `clearInteractionHandle()`

```tsx
static clearInteractionHandle(handle: Handle);
```

通知管理器交互已完成。

---

### `setDeadline()`

```tsx
static setDeadline(deadline: number);
```

正数将使用 setTimeout 在 eventLoopRunningTime 达到截止值后调度任何任务，否则所有任务将在一个 setImmediate 批次中执行（默认）。
