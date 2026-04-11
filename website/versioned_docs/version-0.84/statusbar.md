---
id: statusbar
title: 状态栏（StatusBar）
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于控制应用状态栏的组件。状态栏通常位于屏幕顶部区域，显示当前时间、Wi-Fi 和蜂窝网络信息、电池电量及/或其他状态图标。

### 与 Navigator 一起使用

可以同时挂载多个 `StatusBar` 组件。其属性会按照组件挂载的顺序进行合并。

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
          状态栏可见性:{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          状态栏样式:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            状态栏过渡效果:{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换状态栏显示"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改状态栏样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改状态栏过渡效果"
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
          状态栏可见性:{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          状态栏样式:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            状态栏过渡效果:{'\n'}
            {statusBarTransition}
          </Text>
        ) : null}
        <View style={styles.buttonsContainer}>
          <Button
            title="切换状态栏显示"
            onPress={changeStatusBarVisibility}
          />
          <Button
            title="更改状态栏样式"
            onPress={changeStatusBarStyle}
          />
          {Platform.OS === 'ios' ? (
            <Button
              title="更改状态栏过渡效果"
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

对于不适合使用组件的情况，还暴露了以静态函数形式的命令式 API。不过不建议同时针对同一属性使用静态 API 和组件，因为静态 API 设定的值会在组件下一次渲染时被覆盖。

---

# 参考

## 常量

### `currentHeight` <div className="label android">安卓</div>

状态栏的高度，包括刘海高度（如果存在）。

---

## 属性

### `animated`

是否在状态栏属性变化时启用动画。支持 `backgroundColor`、`barStyle` 和 `hidden` 属性。

| 类型    | 必填 | 默认值 |
| ------- | ---- | ------ |
| boolean | 否   | `false` |

---

### `backgroundColor` <div className="label android">安卓</div>

状态栏的背景颜色。

:::warning
由于 Android 15 引入的沉浸式屏幕（edge-to-edge）规范，在 API 级别 35 中设置状态栏背景颜色已被废弃，且无效。关于沉浸式屏幕的更多建议请查看我们的 [沉浸式屏幕推荐](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型             | 必填 | 默认值                                                |
| ---------------- | ---- | ---------------------------------------------------- |
| [color](colors)  | 否   | 默认系统状态栏背景色，未定义时为 `'black'`          |

---

### `barStyle`

设置状态栏文本颜色。

在 Android 上，仅对 API 版本 23 及以上生效。

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

是否显示网络活动指示器。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

---

### `showHideTransition` <div className="label ios">iOS</div>

使用 `hidden` 属性切换状态栏显示和隐藏时的过渡动画效果。

| 类型                                              | 默认值  |
| ------------------------------------------------- | ------- |
| [StatusBarAnimation](statusbar#statusbaranimation) | `'fade'` |

---

### `translucent` <div className="label android">安卓</div>

状态栏是否半透明。设置为 `true` 时，应用会显示在状态栏之下，对半透明背景颜色场景很有用。

:::warning
由于 Android 15 引入的沉浸式屏幕规范，在 API 级别 35 中设置状态栏半透明已被废弃，且无效。更多沉浸式屏幕相关建议请参见 [沉浸式屏幕推荐](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

## 方法

### `popStackEntry()`

```tsx
static popStackEntry(entry: StatusBarProps);
```

获取并移除状态栏栈中最后一个条目。

**参数：**

| 名称                                                     | 类型 | 说明                                  |
| -------------------------------------------------------- | ---- | ------------------------------------- |
| entry <div className="label basic required">必填</div>   | any  | 由 `pushStackEntry` 返回的条目。      |

---

### `pushStackEntry()`

```tsx
static pushStackEntry(props: StatusBarProps): StatusBarProps;
```

将一个状态栏条目压入栈中。返回值应在完成时传递给 `popStackEntry`。

**参数：**

| 名称                                                     | 类型 | 说明                                      |
| -------------------------------------------------------- | ---- | ----------------------------------------- |
| props <div className="label basic required">必填</div>   | any  | 包含状态栏属性的对象，用于栈条目。        |

---

### `replaceStackEntry()`

```tsx
static replaceStackEntry(
  entry: StatusBarProps,
  props: StatusBarProps
): StatusBarProps;
```

用新的属性替换已有的状态栏栈条目。

**参数：**

| 名称                                                     | 类型 | 说明                                                |
| -------------------------------------------------------- | ---- | --------------------------------------------------- |
| entry <div className="label basic required">必填</div>   | any  | 要替换的由 `pushStackEntry` 返回的条目。             |
| props <div className="label basic required">必填</div>   | any  | 用于替换栈条目的状态栏属性对象。                      |

---

### `setBackgroundColor()` <div className="label android">安卓</div>

```tsx
static setBackgroundColor(color: ColorValue, animated?: boolean);
```

设置状态栏背景颜色。

:::warning
由于 Android 15 的沉浸式屏幕规范，API 级别 35 后设置状态栏背景颜色已废弃且无效。详情见我们的 [沉浸式屏幕推荐](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                     | 类型    | 说明                    |
| -------------------------------------------------------- | ------- | ------------------------ |
| color <div className="label basic required">必填</div>   | string  | 背景颜色                |
| animated                                                 | boolean | 是否启用动画切换效果    |

---

### `setBarStyle()`

```tsx
static setBarStyle(style: StatusBarStyle, animated?: boolean);
```

设置状态栏样式。

**参数：**

| 名称                                                     | 类型                                        | 说明                   |
| -------------------------------------------------------- | ------------------------------------------- | ----------------------- |
| style <div className="label basic required">必填</div>   | [StatusBarStyle](statusbar#statusbarstyle) | 要设置的状态栏样式      |
| animated                                                 | boolean                                    | 是否启用动画切换效果    |

---

### `setHidden()`

```tsx
static setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

显示或隐藏状态栏。

**参数：**

| 名称                                                      | 类型                                              | 说明                                     |
| --------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| hidden <div className="label basic required">必填</div>   | boolean                                           | 是否隐藏状态栏                          |
| animation <div className="label ios">iOS</div>            | [StatusBarAnimation](statusbar#statusbaranimation) | 切换隐藏状态栏时的动画效果（iOS）      |

---

### 🗑️ `setNetworkActivityIndicatorVisible()` <div className="label ios">iOS</div>

:::warning 废弃提示
iOS 13 及以后版本不支持状态栏网络活动指示器功能，该方法将在后续版本中移除。
:::

```tsx
static setNetworkActivityIndicatorVisible(visible: boolean);
```

控制网络活动指示器的显示与隐藏。

**参数：**

| 名称                                                       | 类型    | 说明                     |
| ---------------------------------------------------------- | ------- | ------------------------ |
| visible <div className="label basic required">必填</div>   | boolean | 是否显示指示器           |

---

### `setTranslucent()` <div className="label android">安卓</div>

```tsx
static setTranslucent(translucent: boolean);
```

控制状态栏是否半透明。

:::warning
由于 Android 15 的沉浸式屏幕规范，API 级别 35 后设置状态栏半透明已废弃且无效。详情见我们的 [沉浸式屏幕推荐](https://github.com/react-native-community/discussions-and-proposals/discussions/827)。
:::

**参数：**

| 名称                                                       | 类型    | 说明                 |
| ---------------------------------------------------------- | ------- | -------------------- |
| translucent <div className="label basic required">必填</div> | boolean | 是否设置为半透明     |

## 类型定义

### StatusBarAnimation

用于 iOS 状态栏切换过渡动画的类型。

| 类型 |
| ---- |
| 枚举（enum） |

**常量：**

| 值        | 类型   | 说明             |
| --------- | ------ | ---------------- |
| `'fade'`  | string | 渐隐动画         |
| `'slide'` | string | 滑动动画         |
| `'none'`  | string | 无动画           |

---

### StatusBarStyle

状态栏样式类型。

| 类型 |
| ---- |
| 枚举（enum） |

**常量：**

| 值               | 类型   | 说明                                |
| ---------------- | ------ | ----------------------------------- |
| `'default'`      | string | 默认状态栏样式（iOS 为深色，安卓为浅色） |
| `'light-content'`| string | 白色文本和图标                      |
| `'dark-content'` | string | 深色文本和图标（安卓需 API >= 23）  |