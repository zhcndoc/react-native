---
id: statusbar
title: 状态栏
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于控制应用状态栏的组件。状态栏通常位于屏幕顶部，显示当前时间、Wi‑Fi 和蜂窝网络信息、电池电量和/或其他状态图标。

### 与 Navigator 一起使用

可以同时挂载多个 `StatusBar` 组件。属性会按照 `StatusBar` 组件挂载的顺序进行合并。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=StatusBar%20Component%20Example&supportedPlatforms=android,ios&ext=js
import React, {useState} from 'react';
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
          StatusBar 可见性：{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar 样式：{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar 过渡：{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换 StatusBar"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改 StatusBar 样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改 StatusBar 过渡"
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
import React, {useState} from 'react';
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
          StatusBar 可见性：{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar 样式：{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar 过渡：{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换 StatusBar"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改 StatusBar 样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改 StatusBar 过渡"
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

对于不适合使用组件的情况，也提供了一个以组件上的静态函数形式暴露的命令式 API。不过，不建议对同一个 prop 同时使用静态 API 和组件，因为通过静态 API 设置的任何值，都会在下一次渲染时被组件设置的值覆盖。

---

# 参考

## 常量

### `currentHeight` <div className="label android">Android</div>

状态栏的高度，如果存在刘海屏，也包括刘海高度。

---

## 属性

### `animated`

如果状态栏属性变化之间的过渡应当带有动画。支持 `backgroundColor`、`barStyle` 和 `hidden` 属性。

| 类型    | 必填 | 默认值 |
| ------- | ---- | ------ |
| boolean | 否   | `false` |

---

### `backgroundColor` <div className="label android">Android</div>

状态栏的背景颜色。

:::warning
由于 Android 15 引入的边到边强制机制，在 API 级别 35 中设置状态栏背景色已被弃用，设置后将不会生效。你可以在 [这里阅读更多关于我们的边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型             | 必填 | 默认值                                                             |
| ---------------- | ---- | ------------------------------------------------------------------ |
| [color](colors) | 否   | 默认系统 StatusBar 背景色，若未定义则为 `'black'` |

---

### `barStyle`

设置状态栏文字的颜色。

在 Android 上，这只会对 API 23 及以上版本产生影响。

| 类型                                      | 必填 | 默认值      |
| ----------------------------------------- | ---- | ----------- |
| [StatusBarStyle](statusbar#statusbarstyle) | 否   | `'default'` |

---

### `hidden`

状态栏是否隐藏。

| 类型    | 必填 | 默认值 |
| ------- | ---- | ------ |
| boolean | 否   | `false` |

---

### `networkActivityIndicatorVisible` <div className="label ios">iOS</div>

网络活动指示器是否应当可见。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

---

### `showHideTransition` <div className="label ios">iOS</div>

使用 `hidden` prop 显示和隐藏状态栏时的过渡效果。

| 类型                                               | 默认值   |
| -------------------------------------------------- | -------- |
| [StatusBarAnimation](statusbar#statusbaranimation) | `'fade'` |

---

### `translucent` <div className="label android">Android</div>

状态栏是否半透明。当 `translucent` 设置为 `true` 时，应用会在状态栏下方绘制内容。在使用半透明状态栏颜色时这很有用。

:::warning
由于 Android 15 引入的边到边强制机制，在 API 级别 35 中将状态栏设置为半透明已被弃用，设置后将不会生效。你可以在 [这里阅读更多关于我们的边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

## 方法

### `popStackEntry()`

```tsx
static popStackEntry(entry: StatusBarProps);
```

获取并移除栈中的最后一个 StatusBar 条目。

**参数：**

| 名称                                                      | 类型 | 描述                         |
| --------------------------------------------------------- | ---- | ---------------------------- |
| entry <div className="label basic required">Required</div> | any  | `pushStackEntry` 返回的条目。 |

---

### `pushStackEntry()`

```tsx
static pushStackEntry(props: StatusBarProps): StatusBarProps;
```

将一个 StatusBar 条目压入栈中。完成后应将返回值传给 `popStackEntry`。

**参数：**

| 名称                                                      | 类型 | 描述                                                         |
| --------------------------------------------------------- | ---- | ------------------------------------------------------------ |
| props <div className="label basic required">Required</div> | any  | 包含要在栈条目中使用的 StatusBar 属性的对象。 |

---

### `replaceStackEntry()`

```tsx
static replaceStackEntry(
  entry: StatusBarProps,
  props: StatusBarProps
): StatusBarProps;
```

用新的属性替换现有的 StatusBar 栈条目。

**参数：**

| 名称                                                      | 类型 | 描述                                                                        |
| --------------------------------------------------------- | ---- | --------------------------------------------------------------------------- |
| entry <div className="label basic required">Required</div> | any  | 要替换的 `pushStackEntry` 返回的条目。                                             |
| props <div className="label basic required">Required</div> | any  | 包含要在替换后的栈条目中使用的 StatusBar 属性的对象。 |

---

### `setBackgroundColor()` <div className="label android">Android</div>

```tsx
static setBackgroundColor(color: ColorValue, animated?: boolean);
```

设置状态栏的背景颜色。

:::warning
由于 Android 15 引入的边到边强制机制，在 API 级别 35 中设置状态栏背景色已被弃用，设置后将不会生效。你可以在 [这里阅读更多关于我们的边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                      | 类型    | 描述             |
| --------------------------------------------------------- | ------- | ---------------- |
| color <div className="label basic required">Required</div> | string  | 背景颜色。       |
| animated                                                   | boolean | 为样式更改添加动画。 |

---

### `setBarStyle()`

```tsx
static setBarStyle(style: StatusBarStyle, animated?: boolean);
```

设置状态栏样式。

**参数：**

| 名称                                                      | 类型                                       | 描述              |
| --------------------------------------------------------- | ------------------------------------------ | ----------------- |
| style <div className="label basic required">Required</div> | [StatusBarStyle](statusbar#statusbarstyle) | 要设置的状态栏样式。 |
| animated                                                   | boolean                                    | 为样式更改添加动画。 |

---

### `setHidden()`

```tsx
static setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

显示或隐藏状态栏。

**参数：**

| 名称                                                       | 类型                                               | 描述                                               |
| ---------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| hidden <div className="label basic required">Required</div> | boolean                                            | 隐藏状态栏。                                       |
| animation <div className="label ios">iOS</div>              | [StatusBarAnimation](statusbar#statusbaranimation) | 更改状态栏 hidden 属性时的动画。 |

---

### 🗑️ `setNetworkActivityIndicatorVisible()` <div className="label ios">iOS</div>

:::warning Deprecated
状态栏网络活动指示器不支持 iOS 13 及更高版本。此功能将在未来版本中移除。
:::

```tsx
static setNetworkActivityIndicatorVisible(visible: boolean);
```

控制网络活动指示器的可见性。

**参数：**

| 名称                                                        | 类型    | 描述         |
| ----------------------------------------------------------- | ------- | ------------- |
| visible <div className="label basic required">Required</div> | boolean | 显示指示器。 |

---

### `setTranslucent()` <div className="label android">Android</div>

```tsx
static setTranslucent(translucent: boolean);
```

控制状态栏的半透明性。

:::warning
由于 Android 15 引入的边到边强制机制，在 API 级别 35 中将状态栏设置为半透明已被弃用，设置后将不会生效。你可以在 [这里阅读更多关于我们的边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                             | 类型    | 描述         |
| ---------------------------------------------------------------- | ------- | ------------- |
| translucent <div className="label basic required">Required</div> | boolean | 设置为半透明。 |

## 类型定义

### StatusBarAnimation

iOS 上过渡的状态栏动画类型。

| Type |
| ---- |
| enum |

**常量：**

| Value     | Type   | Description     |
| --------- | ------ | --------------- |
| `'fade'`  | string | 淡入淡出动画    |
| `'slide'` | string | 滑动动画        |
| `'none'`  | string | 无动画          |

---

### StatusBarStyle

状态栏样式类型。

| Type |
| ---- |
| enum |

**常量：**

| Value             | Type   | Description                                                |
| ----------------- | ------ | ---------------------------------------------------------- |
| `'default'`       | string | 默认状态栏样式（iOS 为深色，Android 为浅色）               |
| `'light-content'` | string | 白色文本和图标                                            |
| `'dark-content'`  | string | 深色文本和图标（Android 需要 API>=23）                    |
