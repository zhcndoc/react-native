---
id: interactionmanager
title: 🗑️ InteractionManager
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::warning 已废弃
避免长时间运行的任务，改用 [`requestIdleCallback`](global-requestIdleCallback)。
:::

InteractionManager 允许在所有交互/动画完成后调度长时间运行的任务。特别是，这样可以使 JavaScript 动画运行更流畅。

应用程序可以使用以下方法在交互完成后调度任务：

```tsx
InteractionManager.runAfterInteractions(() => {
  // ...长时间运行的同步任务...
});
```

对比其他调度方案：

- 用于动画视图随时间变化的代码：`requestAnimationFrame()`
- 延迟执行代码：`setImmediate/setTimeout()`，但这可能会延迟动画。
- 在不延迟活动动画的情况下延迟执行代码：`runAfterInteractions()`

触摸处理系统将一个或多个活动触摸视为一次“交互”，并将延迟 `runAfterInteractions()` 的回调，直到所有触摸结束或被取消。

InteractionManager 还允许应用在动画开始时通过创建一个交互“句柄”，并在动画结束时清除它，来注册动画：

```tsx
const handle = InteractionManager.createInteractionHandle();
// 运行动画...（`runAfterInteractions` 任务被排队）
// 之后，在动画完成时：
InteractionManager.clearInteractionHandle(handle);
// 如果所有句柄都被清除，则运行排队的任务
```

`runAfterInteractions` 接受一个普通回调函数，或者一个带有返回 `Promise` 的 `gen` 方法的 `PromiseTask` 对象。如果提供了 `PromiseTask`，则会完全解析它（包括那些通过 `runAfterInteractions` 进一步调度的异步依赖），然后才开始执行同步时先前可能已经排队的下一个任务。

默认情况下，排队的任务会在一个 `setImmediate` 批次中循环执行。如果调用 `setDeadline` 并传入一个正数，则任务只会执行直到接近截止时间（基于 JS 事件循环运行时间），此时执行将通过 setTimeout 让出，允许触摸等事件启动交互并阻止排队任务运行，使应用更具响应性。

---

## 示例

### 基础示例

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
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇晃打开开发菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃或按菜单键打开开发菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认会创建一个交互句柄，
    // 如果你想关闭该行为，可以将 isInteraction 设置为 false。
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

  // 动画完成后运行某方法
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
        <Ball onShown={() => Alert.alert('动画完成')} />
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
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇晃打开开发菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃或按菜单键打开开发菜单',
});

const useFadeIn = (duration = 5000) => {
  const opacity = useAnimatedValue(0);

  // 组件挂载时运行动画
  useEffect(() => {
    // Animated.timing() 默认会创建一个交互句柄，
    // 如果你想关闭该行为，可以将 isInteraction 设置为 false。
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

  // 动画完成后运行某方法
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
        <Ball onShown={() => Alert.alert('动画完成')} />
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

### 高级示例

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
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇晃打开开发菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃或按菜单键打开开发菜单',
});

// 你可以创建自定义交互/动画并添加对 InteractionManager 的支持
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

  // 交互完成后运行某方法
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
        <Ball onInteractionIsDone={() => Alert.alert('交互完成')} />
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
  ios: '按 Cmd+R 重新加载，\n' + 'Cmd+D 或摇晃打开开发菜单',
  android:
    '双击键盘上的 R 重新加载，\n' +
    '摇晃或按菜单键打开开发菜单',
});

// 你可以创建自定义交互/动画并添加对 InteractionManager 的支持
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

  // 交互完成后运行某方法
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
        <Ball onInteractionIsDone={() => Alert.alert('交互完成')} />
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

调度一个函数，在所有交互完成后运行。返回一个可取消的"promise"。

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

传入正数时，当事件循环运行时间接近截止时间，使用 setTimeout 调度任务；否则所有任务在一个 setImmediate 批次内执行（默认行为）。
