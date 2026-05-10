---
id: interactionmanager
title: 🗑️ InteractionManager
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::warning 已废弃
请避免进行长时间运行的工作，并改用 [`requestIdleCallback`](global-requestIdleCallback)。
:::

InteractionManager 允许将长时间运行的工作安排在所有交互/动画完成之后执行。特别是，这使得 JavaScript 动画能够流畅运行。

应用可以通过以下方式安排在交互之后运行的任务：

```tsx
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

将其与其他调度替代方案进行比较：

- `requestAnimationFrame()`：用于随时间对视图进行动画处理的代码。
- `setImmediate/setTimeout()`：稍后运行代码，请注意这可能会延迟动画。
- `runAfterInteractions()`：稍后运行代码，而不会延迟正在进行的动画。

触摸处理系统会将一个或多个活动触摸视为一次“交互”，并会延迟 `runAfterInteractions()` 回调，直到所有触摸都结束或被取消。

InteractionManager 还允许应用通过在动画开始时创建一个交互“句柄”，并在完成时清除它来注册动画：

```tsx
const handle = InteractionManager.createInteractionHandle();
// 运行动画...（`runAfterInteractions` 任务会被加入队列）
 // 稍后，在动画完成时：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄都已清除，则队列中的任务会运行
```

`runAfterInteractions` 接受一个普通回调函数，或一个带有 `gen` 方法的 `PromiseTask` 对象，该方法返回一个 `Promise`。如果提供了 `PromiseTask`，那么在开始执行下一个可能先前已同步加入队列的任务之前，它会被完全解析（包括那些也通过 `runAfterInteractions` 安排更多任务的异步依赖）。

默认情况下，队列中的任务会在一个 `setImmediate` 批次中循环一起执行。如果调用 `setDeadline` 并传入一个正数，那么任务只会执行到接近截止时间为止（按 js 事件循环运行时间计算），此时执行将通过 `setTimeout` 让出，从而允许诸如触摸之类的事件开始交互并阻止队列中的任务继续执行，使应用更具响应性。

---

## 示例

### 基础

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
  ios: '按 Cmd+R 重新加载，\n' + '按 Cmd+D 或摇晃以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃设备或按菜单按钮打开开发者菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认会创建一个交互句柄，如果你想禁用它
    // 可以将 isInteraction 设置为 false 来禁用。
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

  // 动画结束后运行一个方法
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
  ios: '按 Cmd+R 重新加载，\n' + '按 Cmd+D 或摇晃以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃设备或按菜单按钮打开开发者菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认会创建一个交互句柄，如果你想禁用它
    // 可以将 isInteraction 设置为 false 来禁用。
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

  // 动画结束后运行一个方法
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
  ios: '按 Cmd+R 重新加载，\n' + '按 Cmd+D 或摇晃以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃设备或按菜单按钮打开开发者菜单',
});

// 你可以创建自定义的交互/动画，并为 InteractionManager
// 提供支持
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

  // 交互结束后运行一个方法
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
  ios: '按 Cmd+R 重新加载，\n' + '按 Cmd+D 或摇晃以打开开发者菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃设备或按菜单按钮打开开发者菜单',
});

// 你可以创建自定义的交互/动画，并为 InteractionManager
// 提供支持
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

  // 交互结束后运行一个方法
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

安排一个函数在所有交互完成后运行。返回一个可取消的“promise”。

---

### `createInteractionHandle()`

```tsx
static createInteractionHandle(): Handle;
```

通知管理器某个交互已开始。

---

### `clearInteractionHandle()`

```tsx
static clearInteractionHandle(handle: Handle);
```

通知管理器某个交互已完成。

---

### `setDeadline()`

```tsx
static setDeadline(deadline: number);
```

一个正数会在 eventLoopRunningTime 达到截止值后使用 setTimeout 来调度任何任务，否则所有任务都将在一次 setImmediate 批处理中执行（默认）。
