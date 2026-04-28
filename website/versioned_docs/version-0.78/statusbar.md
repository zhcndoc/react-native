---
id: statusbar
title: StatusBar
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于控制应用状态栏的组件。状态栏通常是屏幕顶部的区域，显示当前时间、Wi-Fi 和蜂窝网络信息、电池电量和/或其他状态图标。

### 与 Navigator 一起使用

可以同时挂载多个 `StatusBar` 组件。属性将按照 `StatusBar` 组件挂载的顺序进行合并。

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
          状态栏可见性：{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          状态栏样式：{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            状态栏过渡：{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换状态栏"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改状态栏样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改状态栏过渡"
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
          状态栏可见性：{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          状态栏样式：{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            状态栏过渡：{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换状态栏"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改状态栏样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改状态栏过渡"
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

对于不使用组件不理想的情况，还有一个作为组件上的静态函数暴露的命令式 API。然而，不建议对同一属性同时使用静态 API 和组件，因为静态 API 设置的任何值将在下一次渲染中被组件设置的值覆盖。

---

# 参考

## 常量

### `currentHeight` <div className="label android">Android</div>

状态栏的高度，包括缺口（notch）高度（如果存在）。

---

## 属性

### `animated`

状态栏属性变化之间的过渡是否应该动画化。支持 `backgroundColor`、`barStyle` 和 `hidden` 属性。

| 类型    | 必填 | 默认值  |
| ------- | -------- | ------- |
| boolean | 否       | `false` |

---

### `backgroundColor` <div className="label android">Android</div>

状态栏的背景颜色。

:::warning
由于 Android 15 引入的边到边（edge-to-edge）强制要求，在 API 级别 35 中设置状态栏背景颜色已弃用，设置它将无效。您可以在此处阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型            | 必填 | 默认值                                                                |
| --------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [颜色](colors) | 否       | 默认系统 StatusBar 背景颜色，如果未定义则为 `'black'` |

---

### `barStyle`

设置状态栏文本的颜色。

在 Android 上，这只会影响 API 版本 23 及以上版本。

| 类型                                       | 必填 | 默认值     |
| ------------------------------------------ | -------- | ----------- |
| [StatusBarStyle](statusbar#statusbarstyle) | 否       | `'default'` |

---

### `hidden`

是否隐藏状态栏。

| 类型    | 必填 | 默认值  |
| ------- | -------- | ------- |
| boolean | 否       | `false` |

---

### `networkActivityIndicatorVisible` <div className="label ios">iOS</div>

网络活动指示器是否应该可见。

| 类型    | 默认值  |
| ------- | ------- |
| boolean | `false` |

---

### `showHideTransition` <div className="label ios">iOS</div>

使用 `hidden` 属性显示和隐藏状态栏时的过渡效果。

| 类型                                               | 默认值  |
| -------------------------------------------------- | -------- |
| [StatusBarAnimation](statusbar#statusbaranimation) | `'fade'` |

---

### `translucent` <div className="label android">Android</div>

状态栏是否半透明。当 translucent 设置为 `true` 时，应用将在状态栏下方绘制。这对于使用半透明状态栏颜色时很有用。

:::warning
由于 Android 15 引入的边到边（edge-to-edge）强制要求，在 API 级别 35 中将状态栏设置为半透明已弃用，设置它将无效。您可以在此处阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型    | 默认值  |
| ------- | ------- |
| boolean | `false` |

## 方法

### `popStackEntry()`

```tsx
static popStackEntry(entry: StatusBarProps);
```

获取并从栈中移除最后一个 StatusBar 条目。

**参数：**

| 名称                                                       | 类型 | 描述                           |
| ---------------------------------------------------------- | ---- | ------------------------------------- |
| entry <div className="label basic required">必填</div> | any  | 从 `pushStackEntry` 返回的条目。 |

---

### `pushStackEntry()`

```tsx
static pushStackEntry(props: StatusBarProps): StatusBarProps;
```

将一个 StatusBar 条目推入栈。完成时应将返回值传递给 `popStackEntry`。

**参数：**

| 名称                                                       | 类型 | 描述                                                      |
| ---------------------------------------------------------- | ---- | ---------------------------------------------------------------- |
| props <div className="label basic required">必填</div> | any  | 包含要在栈条目中使用的 StatusBar 属性的对象。 |

---

### `replaceStackEntry()`

```tsx
static replaceStackEntry(
  entry: StatusBarProps,
  props: StatusBarProps
): StatusBarProps;
```

用新属性替换现有的 StatusBar 栈条目。

**参数：**

| 名称                                                       | 类型 | 描述                                                                  |
| ---------------------------------------------------------- | ---- | ---------------------------------------------------------------------------- |
| entry <div className="label basic required">必填</div> | any  | 从 `pushStackEntry` 返回的要替换的条目。                             |
| props <div className="label basic required">必填</div> | any  | 包含要在替换栈条目中使用的 StatusBar 属性的对象。 |

---

### `setBackgroundColor()` <div className="label android">Android</div>

```tsx
static setBackgroundColor(color: ColorValue, animated?: boolean);
```

设置状态栏的背景颜色。

:::warning
由于 Android 15 引入的边到边（edge-to-edge）强制要求，在 API 级别 35 中设置状态栏背景颜色已弃用，设置它将无效。您可以在此处阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                       | 类型    | 描述               |
| ---------------------------------------------------------- | ------- | ------------------------- |
| color <div className="label basic required">必填</div> | string  | 背景颜色。         |
| animated                                                   | boolean | 动画化样式变化。 |

---

### `setBarStyle()`

```tsx
static setBarStyle(style: StatusBarStyle, animated?: boolean);
```

设置状态栏样式。

**参数：**

| 名称                                                       | 类型                                       | 描述               |
| ---------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| style <div className="label basic required">必填</div> | [StatusBarStyle](statusbar#statusbarstyle) | 要设置的状态栏样式。  |
| animated                                                   | boolean                                    | 动画化样式变化。 |

---

### `setHidden()`

```tsx
static setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

显示或隐藏状态栏。

**参数：**

| 名称                                                        | 类型                                               | 描述                                             |
| ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| hidden <div className="label basic required">必填</div> | boolean                                            | 隐藏状态栏。                                    |
| animation <div className="label ios">iOS</div>              | [StatusBarAnimation](statusbar#statusbaranimation) | 更改状态栏 hidden 属性时的动画。 |

---

### 🗑️ `setNetworkActivityIndicatorVisible()` <div className="label ios">iOS</div>

:::warning[Deprecated]
状态栏网络活动指示器在 iOS 13 及更高版本中不受支持。此功能将在未来版本中移除。
:::

```tsx
static setNetworkActivityIndicatorVisible(visible: boolean);
```

控制网络活动指示器的可见性。

**参数：**

| 名称                                                         | 类型    | 描述         |
| ------------------------------------------------------------ | ------- | ------------------- |
| visible <div className="label basic required">必填</div> | boolean | 显示指示器。 |

---

### `setTranslucent()` <div className="label android">Android</div>

```tsx
static setTranslucent(translucent: boolean);
```

控制状态栏的半透明度。

:::warning
由于 Android 15 引入的边到边（edge-to-edge）强制要求，在 API 级别 35 中将状态栏设置为半透明已弃用，设置它将无效。您可以在此处阅读更多关于我们的 [边到边建议](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                             | 类型    | 描述         |
| ---------------------------------------------------------------- | ------- | ------------------- |
| translucent <div className="label basic required">必填</div> | boolean | 设置为半透明。 |

## 类型定义

### StatusBarAnimation

iOS 上过渡用的状态栏动画类型。

| 类型 |
| ---- |
| enum |

**常量：**

| 值     | 类型   | 描述     |
| --------- | ------ | --------------- |
| `'fade'`  | string | 淡入淡出动画  |
| `'slide'` | string | 滑动动画 |
| `'none'`  | string | 无动画    |

---

### StatusBarStyle

状态栏样式类型。

| 类型 |
| ---- |
| enum |

**常量：**

| 值             | 类型   | 描述                                                |
| ----------------- | ------ | ---------------------------------------------------------- |
| `'default'`       | string | 默认状态栏样式（iOS 为深色，Android 为浅色） |
| `'light-content'` | string | 白色文本和图标                                      |
| `'dark-content'`  | string | 深色文本和图标（Android 上需要 API>=23）         |
