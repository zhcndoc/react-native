---
id: statusbar
title: 状态栏
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用于控制应用状态栏的组件。状态栏是屏幕顶部的区域，通常会显示当前时间、Wi‑Fi 和蜂窝网络信息、电池电量和/或其他状态图标。

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
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
          hidden={hidden}
        />
        <Text style={styles.textStyle}>
          StatusBar 可见性:{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar 样式:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar 过渡:{'\n'}
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
          barStyle={statusBarStyle}
          showHideTransition={statusBarTransition}
          hidden={hidden}
        />
        <Text style={styles.textStyle}>
          StatusBar 可见性:{'\n'}
          {hidden ? '隐藏' : '可见'}
        </Text>
        <Text style={styles.textStyle}>
          StatusBar 样式:{'\n'}
          {statusBarStyle}
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.textStyle}>
            StatusBar 过渡:{'\n'}
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

对于不适合使用组件的场景，也提供了一个作为组件静态函数暴露的命令式 API。不过，不建议对同一属性同时使用静态 API 和组件，因为通过静态 API 设置的任何值都会在下一次渲染时被组件设置的值覆盖。

---

# 参考。

## 常量

### `currentHeight` <div className="label android">Android</div>

状态栏的高度，如果存在刘海屏，则包含刘海的高度。

---

## 属性

### `animated`

状态栏属性变化之间的过渡是否应进行动画。支持 `barStyle` 和 `hidden` 属性。

| 类型    | 必填 | 默认值  |
| ------- | ---- | ------- |
| boolean | 否   | `false` |

---

### `barStyle`

设置状态栏文字的颜色。

在 Android 上，这只会对 API 版本 23 及以上产生影响。

| 类型                                       | 必填 | 默认值      |
| ------------------------------------------ | ---- | ----------- |
| [StatusBarStyle](statusbar#statusbarstyle) | 否   | `'default'` |

---

### `hidden`

状态栏是否隐藏。

| 类型    | 必填 | 默认值  |
| ------- | ---- | ------- |
| boolean | 否   | `false` |

---

### `showHideTransition` <div className="label ios">iOS</div>

使用 `hidden` 属性显示和隐藏状态栏时的过渡效果。

| 类型                                               | 默认值   |
| -------------------------------------------------- | -------- |
| [StatusBarAnimation](statusbar#statusbaranimation) | `'fade'` |

## 方法

### `popStackEntry()`

```tsx
static popStackEntry(entry: StatusBarProps);
```

获取并移除栈中的最后一个 StatusBar 条目。

**参数：**

| 名称                                                   | 类型 | 描述                             |
| ------------------------------------------------------ | ---- | -------------------------------- |
| entry <div className="label basic required">必填</div> | any  | 从 `pushStackEntry` 返回的条目。 |

---

### `pushStackEntry()`

```tsx
static pushStackEntry(props: StatusBarProps): StatusBarProps;
```

将一个 StatusBar 条目压入栈中。完成后应将返回值传递给 `popStackEntry`。

**参数：**

| 名称                                                   | 类型 | 描述                                          |
| ------------------------------------------------------ | ---- | --------------------------------------------- |
| props <div className="label basic required">必填</div> | any  | 包含要在栈条目中使用的 StatusBar 属性的对象。 |

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

| 名称                                                   | 类型 | 描述                                          |
| ------------------------------------------------------ | ---- | --------------------------------------------- |
| entry <div className="label basic required">必填</div> | any  | 要替换的、由 `pushStackEntry` 返回的条目。    |
| props <div className="label basic required">必填</div> | any  | 包含要用于替换栈条目的 StatusBar 属性的对象。 |

---

### `setBarStyle()`

```tsx
static setBarStyle(style: StatusBarStyle, animated?: boolean);
```

设置状态栏样式。

**参数：**

| 名称                                                   | 类型                                       | 描述                 |
| ------------------------------------------------------ | ------------------------------------------ | -------------------- |
| style <div className="label basic required">必填</div> | [StatusBarStyle](statusbar#statusbarstyle) | 要设置的状态栏样式。 |
| animated                                               | boolean                                    | 为样式更改添加动画。 |

---

### `setHidden()`

```tsx
static setHidden(hidden: boolean, animation?: StatusBarAnimation);
```

显示或隐藏状态栏。

**参数：**

| 名称                                                    | 类型                                               | 描述                             |
| ------------------------------------------------------- | -------------------------------------------------- | -------------------------------- |
| hidden <div className="label basic required">必填</div> | boolean                                            | 隐藏状态栏。                     |
| animation <div className="label ios">iOS</div>          | [StatusBarAnimation](statusbar#statusbaranimation) | 更改状态栏 hidden 属性时的动画。 |

---

## 类型定义

### StatusBarAnimation

iOS 上过渡动画的状态栏动画类型。

| 类型 |
| ---- |
| 枚举 |

**常量：**

| 值        | 类型   | 描述     |
| --------- | ------ | -------- |
| `'fade'`  | string | 淡出动画 |
| `'slide'` | string | 滑动动画 |
| `'none'`  | string | 无动画   |

---

### StatusBarStyle

状态栏样式类型。

| 类型 |
| ---- |
| 枚举 |

**常量：**

| 值                | 类型   | 描述                                         |
| ----------------- | ------ | -------------------------------------------- |
| `'default'`       | string | 默认状态栏样式（iOS 为深色，Android 为浅色） |
| `'light-content'` | string | 白色文本和图标                               |
| `'dark-content'`  | string | 深色文本和图标（Android 需要 API>=23）       |
