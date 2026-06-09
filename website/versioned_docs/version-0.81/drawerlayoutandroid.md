---
id: drawerlayoutandroid
title: DrawerLayoutAndroid
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

一个封装了平台 `DrawerLayout` 的 React 组件（仅限 Android）。抽屉（通常用于导航）通过 `renderNavigationView` 渲染，直接子元素是主视图（内容放置的位置）。导航视图最初在屏幕上不可见，但可以从 `drawerPosition` 属性指定的窗口一侧滑入，其宽度可以通过 `drawerWidth` 属性设置。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=DrawerLayoutAndroid%20Component%20Example&supportedPlatforms=android&ext=js
import {useRef, useState} from 'react';
import {Button, DrawerLayoutAndroid, Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  const changeDrawerPosition = () => {
    if (drawerPosition === 'left') {
      setDrawerPosition('right');
    } else {
      setDrawerPosition('left');
    }
  };

  const navigationView = () => (
    <SafeAreaView style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.paragraph}>我在抽屉里！</Text>
      <Button
        title="关闭抽屉"
        onPress={() => drawer.current.closeDrawer()}
      />
    </SafeAreaView>
  );

  return (
    <SafeAreaProvider>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.paragraph}>抽屉在 {drawerPosition} 侧！</Text>
          <Button
            title="更改抽屉位置"
            onPress={() => changeDrawerPosition()}
          />
          <Text style={styles.paragraph}>
            从侧边滑动或按下面的按钮来查看它！
          </Text>
          <Button
            title="打开抽屉"
            onPress={() => drawer.current.openDrawer()}
          />
        </SafeAreaView>
      </DrawerLayoutAndroid>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=DrawerLayoutAndroid%20Component%20Example&supportedPlatforms=android&ext=tsx
import {useRef, useState} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
} from 'react-native';

const App = () => {
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>(
    'left',
  );
  const changeDrawerPosition = () => {
    if (drawerPosition === 'left') {
      setDrawerPosition('right');
    } else {
      setDrawerPosition('left');
    }
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.paragraph}>我在抽屉里！</Text>
      <Button
        title="关闭抽屉"
        onPress={() => drawer.current?.closeDrawer()}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}>
      <View style={styles.container}>
        <Text style={styles.paragraph}>抽屉在 {drawerPosition} 侧！</Text>
        <Button
          title="更改抽屉位置"
          onPress={() => changeDrawerPosition()}
        />
        <Text style={styles.paragraph}>
          从侧边滑动或按下面的按钮来查看它！
        </Text>
        <Button
          title="打开抽屉"
          onPress={() => drawer.current?.openDrawer()}
        />
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default App;
```

</TabItem>
</Tabs>

---

# 参考

## 属性

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### `drawerBackgroundColor`

指定抽屉的背景颜色。默认值是 `white`。如果你想设置抽屉的不透明度，请使用 rgba。示例：

```tsx
return (
  <DrawerLayoutAndroid drawerBackgroundColor="rgba(0,0,0,0.5)" />
);
```

| 类型               | 必需 |
| ------------------ | -------- |
| [color](colors.md) | 否       |

---

### `drawerLockMode`

指定抽屉的锁定模式。抽屉可以处于 3 种状态：

- unlocked（默认），表示抽屉会响应触摸手势（打开/关闭）。
- locked-closed，表示抽屉将保持关闭状态且不响应手势。
- locked-open，表示抽屉将保持打开状态且不响应手势。抽屉仍然可以通过程序方式打开和关闭（`openDrawer`/`closeDrawer`）。

| 类型                                             | 必需 |
| ------------------------------------------------ | -------- |
| enum('unlocked', 'locked-closed', 'locked-open') | 否       |

---

### `drawerPosition`

指定抽屉从屏幕哪一侧滑入。默认设置为 `left`。

| 类型                  | 必需 |
| --------------------- | -------- |
| enum('left', 'right') | 否       |

---

### `drawerWidth`

指定抽屉的宽度，更准确地说，是从窗口边缘拉入的视图宽度。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `keyboardDismissMode`

决定在拖动时是否会收起键盘。

- 'none'（默认），拖动不会收起键盘。
- 'on-drag'，当拖动开始时键盘会被收起。

| 类型                    | 必需 |
| ----------------------- | -------- |
| enum('none', 'on-drag') | 否       |

---

### `onDrawerClose`

每当导航视图关闭时调用的函数。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerOpen`

每当导航视图打开时调用的函数。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerSlide`

每当与导航视图发生交互时调用的函数。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerStateChanged`

当抽屉状态发生变化时调用的函数。抽屉可以处于 3 种状态：

- idle，表示此时没有与导航视图发生交互
- dragging，表示当前正在与导航视图交互
- settling，表示曾与导航视图发生交互，且导航视图正在完成关闭或打开动画

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `renderNavigationView`

将渲染在屏幕侧边并可被拉入的导航视图。

| 类型     | 必需 |
| -------- | -------- |
| function | 是       |

---

### `statusBarBackgroundColor`

让抽屉占据整个屏幕并绘制状态栏的背景，以便它可以覆盖状态栏打开。它仅在 API 21+ 上有效。

| 类型               | 必需 |
| ------------------ | -------- |
| [color](colors.md) | 否       |

## 方法

### `closeDrawer()`

```tsx
closeDrawer();
```

关闭抽屉。

---

### `openDrawer()`

```tsx
openDrawer();
```

打开抽屉。
