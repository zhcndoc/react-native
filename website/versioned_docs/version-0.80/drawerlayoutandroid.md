---
id: drawerlayoutandroid
title: DrawerLayoutAndroid
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

封装了平台 `DrawerLayout` 的 React 组件（仅限 Android）。抽屉（通常用于导航）通过 `renderNavigationView` 渲染，直接子元素是主视图（您的内容所在处）。导航视图最初在屏幕上不可见，但可以通过 `drawerPosition` 属性指定的窗口侧面拉入，其宽度可以通过 `drawerWidth` 属性设置。

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=DrawerLayoutAndroid%20Component%20Example&supportedPlatforms=android&ext=js
import React, {useRef, useState} from 'react';
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
      <Text style={styles.paragraph}>I'm in the Drawer!</Text>
      <Button
        title="Close drawer"
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
          <Text style={styles.paragraph}>Drawer on the {drawerPosition}!</Text>
          <Button
            title="Change Drawer Position"
            onPress={() => changeDrawerPosition()}
          />
          <Text style={styles.paragraph}>
            Swipe from the side or press button below to see it!
          </Text>
          <Button
            title="Open drawer"
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
import React, {useRef, useState} from 'react';
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
      <Text style={styles.paragraph}>I'm in the Drawer!</Text>
      <Button
        title="Close drawer"
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
        <Text style={styles.paragraph}>Drawer on the {drawerPosition}!</Text>
        <Button
          title="Change Drawer Position"
          onPress={() => changeDrawerPosition()}
        />
        <Text style={styles.paragraph}>
          Swipe from the side or press button below to see it!
        </Text>
        <Button
          title="Open drawer"
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

### [View 属性](view.md#props)

继承 [View 属性](view.md#props)。

---

### `drawerBackgroundColor`

指定抽屉的背景颜色。默认值为 `white`。如果您想设置抽屉的透明度，请使用 rgba。例如：

```tsx
return (
  <DrawerLayoutAndroid drawerBackgroundColor="rgba(0,0,0,0.5)" />
);
```

| 类型               | 必填 |
| ------------------ | -------- |
| [颜色](colors.md) | 否       |

---

### `drawerLockMode`

指定抽屉的锁定模式。抽屉可以锁定在 3 种状态：

- unlocked（默认），意味着抽屉将响应（打开/关闭）触摸手势。
- locked-closed，意味着抽屉将保持关闭且不响应手势。
- locked-open，意味着抽屉将保持打开且不响应手势。抽屉仍然可以通过编程方式打开和关闭（`openDrawer`/`closeDrawer`）。

| 类型                                             | 必填 |
| ------------------------------------------------ | -------- |
| enum('unlocked', 'locked-closed', 'locked-open') | 否       |

---

### `drawerPosition`

指定抽屉将滑入的屏幕侧边。默认设置为 `left`。

| 类型                  | 必填 |
| --------------------- | -------- |
| enum('left', 'right') | 否       |

---

### `drawerWidth`

指定抽屉的宽度，更确切地说是指可以从窗口边缘拉入的视图的宽度。

| 类型   | 必填 |
| ------ | -------- |
| number | 否       |

---

### `keyboardDismissMode`

确定是否在响应拖动时收起键盘。

- 'none'（默认），拖动不会收起键盘。
- 'on-drag'，当拖动开始时键盘被收起。

| 类型                    | 必填 |
| ----------------------- | -------- |
| enum('none', 'on-drag') | 否       |

---

### `onDrawerClose`

每当导航视图关闭时调用的函数。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerOpen`

每当导航视图打开时调用的函数。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerSlide`

每当与导航视图有交互时调用的函数。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onDrawerStateChanged`

当抽屉状态改变时调用的函数。抽屉可以处于 3 种状态：

- idle，意味着当时没有与导航视图发生的交互
- dragging，意味着当前正在与导航视图进行交互
- settling，意味着之前与导航视图有交互，且导航视图正在完成其关闭或打开动画

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `renderNavigationView`

将渲染到屏幕侧面并可被拉入的导航视图。

| 类型     | 必填 |
| -------- | -------- |
| function | 是      |

---

### `statusBarBackgroundColor`

使抽屉占据整个屏幕并绘制状态栏背景，以允许其打开在状态栏之上。仅对 API 21+ 生效。

| 类型               | 必填 |
| ------------------ | -------- |
| [颜色](colors.md) | 否       |

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
