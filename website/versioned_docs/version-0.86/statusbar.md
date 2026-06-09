---
id: statusbar
title: StatusBar
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于控制应用状态栏的组件。状态栏通常位于屏幕顶部，显示当前时间、Wi‑Fi 和蜂窝网络信息、电池电量和/或其他状态图标。

### 与 Navigator 一起使用

可以同时挂载多个 `StatusBar` 组件。属性会按照 `StatusBar` 组件的挂载顺序进行合并。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=StatusBar%20Component%20Example&supportedPlatforms=android,ios&ext=js
import {useState} from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const STYLES = ['default', 'dark-content', 'light-content'];
const TRANSITIONS = ['fade', 'slide', 'none'];

const App = () => {
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );

  const changeStatusBarVisibility = () => setHidden(!hidden);

  const changeStatusBarStyle = () => {
    const styleId = STYLES.indexOf(statusBarStyle) + 1;
    if (styleId === STYLES.length) {
      setStatusBarStyle(STYLES[0]);
    } else {
      setStatusBarStyle(STYLES[styleId]);
    }
  };

  const changeStatusBarTransition = () => {
    const transition = TRANSITIONS.indexOf(statusBarTransition) + 1;
    if (transition === TRANSITIONS.length) {
      setStatusBarTransition(TRANSITIONS[0]);
    } else {
      setStatusBarTransition(TRANSITIONS[transition]);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
          hidden={hidden}
        />
        <Text style={styles.textStyle}>
          StatusBar Visibility:{'\n'}
          {hidden ? 'Hidden' : 'Visible'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar Style:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar Transition:{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="Toggle StatusBar"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="Change StatusBar Style"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="Change StatusBar Transition"
              onPress={changeStatusBarTransition}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=StatusBar%20Component%20Example&supportedPlatforms=android,ios&ext=tsx
import {useState} from 'react';
import {
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  StatusBarStyle,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const STYLES = ['default', 'dark-content', 'light-content'] as const;
const TRANSITIONS = ['fade', 'slide', 'none'] as const;

const App = () => {
  const [hidden, setHidden] = useState(false);
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[0],
  );
  const [statusBarTransition, setStatusBarTransition] = useState<
    'fade' | 'slide' | 'none'
  >(TRANSITIONS[0]);

  const changeStatusBarVisibility = () => setHidden(!hidden);

  const changeStatusBarStyle = () => {
    const styleId = STYLES.indexOf(statusBarStyle) + 1;
    if (styleId === STYLES.length) {
      setStatusBarStyle(STYLES[0]);
    } else {
      setStatusBarStyle(STYLES[styleId]);
    }
  };

  const changeStatusBarTransition = () => {
    const transition = TRANSITIONS.indexOf(statusBarTransition) + 1;
    if (transition === TRANSITIONS.length) {
      setStatusBarTransition(TRANSITIONS[0]);
    } else {
      setStatusBarTransition(TRANSITIONS[transition]);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
          hidden={hidden}
        />
        <Text style={styles.textStyle}>
          StatusBar Visibility:{'\n'}
          {hidden ? 'Hidden' : 'Visible'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar Style:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar Transition:{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="Toggle StatusBar"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="Change StatusBar Style"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="Change StatusBar Transition"
              onPress={changeStatusBarTransition}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default App;
```

</TabItem>
</Tabs>

### 命令式 API

在不适合使用组件的场景下，也可以使用通过组件上的静态函数暴露的命令式 API。不过，不建议对同一个属性同时使用静态 API 和组件，因为静态 API 设置的任何值都会在下一次渲染时被组件设置的值覆盖。

---

# 参考

## 常量

### `currentHeight` <div className="label android">Android</div>

状态栏的高度，包括刘海高度（如果存在）。

---

## 属性

### `animated`

状态栏属性变更之间是否应使用动画。支持 `backgroundColor`、`barStyle` 和 `hidden` 属性。

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | 否      | `false` |

---

### `backgroundColor` <div className="label android">Android</div>

状态栏的背景颜色。

:::warning
由于 Android 15 引入了边到边强制要求，在 API 级别 35 中设置状态栏背景颜色已被弃用，设置后不会产生任何效果。你可以在这里阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| Type            | Required | Default                                                                |
| --------------- | -------- | ---------------------------------------------------------------------- |
| [color](colors) | 否      | 默认系统 StatusBar 背景颜色，或者如果未定义则为 `'black'` |

---

### `barStyle`

设置状态栏文本的颜色。

在 Android 上，这只会对 API 版本 23 及以上产生影响。

| Type                                       | Required | Default     |
| ------------------------------------------ | -------- | ----------- |
| [StatusBarStyle](statusbar#statusbarstyle) | 否      | `'default'` |

---

### `hidden`

状态栏是否隐藏。

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | 否      | `false` |

---

### `networkActivityIndicatorVisible` <div className="label ios">iOS</div>

网络活动指示器是否应可见。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

---

### `showHideTransition` <div className="label ios">iOS</div>

使用 `hidden` 属性显示和隐藏状态栏时的过渡效果。

| Type                                               | Default  |
| -------------------------------------------------- | -------- |
| [StatusBarAnimation](statusbar#statusbaranimation) | `'fade'` |

---

### `translucent` <div className="label android">Android</div>

状态栏是否半透明。将 translucent 设为 `true` 时，应用会在状态栏下方绘制内容。这在使用半透明状态栏颜色时很有用。

:::warning
由于 Android 15 引入了边到边强制要求，在 API 级别 35 中将状态栏设置为半透明已被弃用，设置后不会产生任何效果。你可以在这里阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

## 方法

### `popStackEntry()`

```tsx
static popStackEntry(entry: StatusBarProps);
```

从堆栈中获取并移除最后一个 StatusBar 条目。

**Parameters:**

| Name                                                       | Type | Description             |
| ---------------------------------------------------------- | ---- | ----------------------- |
| entry <div className="label basic required">Required</div> | any  | `pushStackEntry` 返回的条目。 |

---

### `pushStackEntry()`

```tsx
static pushStackEntry(props: StatusBarProps): StatusBarProps;
```

将一个 StatusBar 条目压入堆栈。完成时应将返回值传递给 `popStackEntry`。

**Parameters:**

| Name                                                       | Type | Description                                      |
| ---------------------------------------------------------- | ---- | ------------------------------------------------ |
| props <div className="label basic required">Required</div> | any  | 包含要在堆栈条目中使用的 StatusBar 属性的对象。 |

---

### `replaceStackEntry()`

```tsx
static replaceStackEntry(
  entry: StatusBarProps,
  props: StatusBarProps
): StatusBarProps;
```

使用新属性替换现有的 StatusBar 堆栈条目。

**Parameters:**

| Name                                                       | Type | Description                                                      |
| ---------------------------------------------------------- | ---- | ---------------------------------------------------------------- |
| entry <div className="label basic required">Required</div> | any  | 要替换的 `pushStackEntry` 返回的条目。                             |
| props <div className="label basic required">Required</div> | any  | 包含要用于替换堆栈条目的 StatusBar 属性的对象。 |

---

### `setBackgroundColor()` <div className="label android">Android</div>

```tsx
static setBackgroundColor(color: ColorValue, animated?: boolean);
```

设置状态栏的背景颜色。

:::warning
由于 Android 15 引入了边到边强制要求，在 API 级别 35 中设置状态栏背景颜色已被弃用，设置后不会产生任何效果。你可以在这里阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**Parameters:**

| Name                                                       | Type    | Description      |
| ---------------------------------------------------------- | ------- | ---------------- |
| color <div className="label basic required">Required</div> | string  | 背景颜色。       |
| animated                                                   | boolean | 为样式变更添加动画。 |

---

### `setBarStyle()`

```tsx
static setBarStyle(style: StatusBarStyle, animated?: boolean);
```

设置状态栏样式。

**Parameters:**

| Name                                                       | Type                                       | Description      |
| ---------------------------------------------------------- | ------------------------------------------ | ---------------- |
| style <div className="label basic required">Required</div> | [StatusBarStyle](statusbar#statusbarstyle) | 要设置的状态栏样式。 |
| animated                                                   | boolean                                    | 为样式变更添加动画。 |

---

### `setHidden()`

```tsx
static setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

显示或隐藏状态栏。

**Parameters:**

| Name                                                        | Type                                               | Description                                |
| ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| hidden <div className="label basic required">Required</div> | boolean                                            | 隐藏状态栏。                               |
| animation <div className="label ios">iOS</div>              | [StatusBarAnimation](statusbar#statusbaranimation) | 更改状态栏 hidden 属性时的动画效果。 |

---

### 🗑️ `setNetworkActivityIndicatorVisible()` <div className="label ios">iOS</div>

:::warning Deprecated
状态栏网络活动指示器在 iOS 13 及更高版本中不受支持。该功能将在未来版本中移除。
:::

```tsx
static setNetworkActivityIndicatorVisible(visible: boolean);
```

控制网络活动指示器的可见性。

**Parameters:**

| Name                                                         | Type    | Description     |
| ------------------------------------------------------------ | ------- | --------------- |
| visible <div className="label basic required">Required</div> | boolean | 显示指示器。 |

---

### `setTranslucent()` <div className="label android">Android</div>

```tsx
static setTranslucent(translucent: boolean);
```

控制状态栏的半透明性。

:::warning
由于 Android 15 引入了边到边强制要求，在 API 级别 35 中将状态栏设置为半透明已被弃用，设置后不会产生任何效果。你可以在这里阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**Parameters:**

| Name                                                             | Type    | Description     |
| ---------------------------------------------------------------- | ------- | --------------- |
| translucent <div className="label basic required">Required</div> | boolean | 设为半透明。 |

## 类型定义

### StatusBarAnimation

iOS 上过渡时的状态栏动画类型。

| 类型 |
| ---- |
| 枚举 |

**常量：**

| 值        | 类型   | 描述     |
| --------- | ------ | -------- |
| `'fade'`  | string | 淡出动画  |
| `'slide'` | string | 滑动动画  |
| `'none'`  | string | 无动画    |

---

### StatusBarStyle

状态栏样式类型。

| 类型 |
| ---- |
| 枚举 |

**常量：**

| 值                | 类型   | 描述                                                       |
| ----------------- | ------ | ---------------------------------------------------------- |
| `'default'`       | string | 默认状态栏样式（iOS 为深色，Android 为浅色） |
| `'light-content'` | string | 白色文本和图标                                             |
| `'dark-content'`  | string | 深色文本和图标（Android 上需要 API>=23）                 |
