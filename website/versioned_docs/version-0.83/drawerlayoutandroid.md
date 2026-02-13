---
id: drawerlayoutandroid
title: DrawerLayoutAndroid
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React 组件，封装了平台的 `DrawerLayout`（仅限 Android）。抽屉（通常用于导航）通过 `renderNavigationView` 渲染，直接子元素为主视图（即你的内容区域）。导航视图初始时不显示在屏幕上，但可以从由 `drawerPosition` 属性指定的窗口侧边滑出，其宽度可通过 `drawerWidth` 属性设置。

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
            title="切换抽屉位置"
            onPress={() => changeDrawerPosition()}
          />
          <Text style={styles.paragraph}>
            从侧边滑动或点击下面的按钮即可查看！
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
          title="切换抽屉位置"
          onPress={() => changeDrawerPosition()}
        />
        <Text style={styles.paragraph}>
          从侧边滑动或点击下面的按钮即可查看！
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

### [View 属性](view.md#props)

继承自 [View 属性](view.md#props)。

---

### `drawerBackgroundColor`

指定抽屉的背景颜色。默认值为 `white`。如果想设置抽屉的不透明度，可以使用 rgba，例如：

```tsx
return (
  <DrawerLayoutAndroid drawerBackgroundColor="rgba(0,0,0,0.5)" />
);
```

| 类型                 | 必需 |
| -------------------- | ---- |
| [color](colors.md)   | 否   |

---

### `drawerLockMode`

指定抽屉的锁定模式。抽屉可锁定为三种状态：

- unlocked（默认），意味着抽屉会响应触摸手势（打开/关闭）。
- locked-closed，意味着抽屉保持关闭状态，不响应手势。
- locked-open，意味着抽屉保持打开状态，不响应手势。抽屉仍然可以通过代码调用（`openDrawer`/`closeDrawer`）打开或关闭。

| 类型                                             | 必需 |
| ------------------------------------------------ | ---- |
| enum('unlocked', 'locked-closed', 'locked-open') | 否   |

---

### `drawerPosition`

指定抽屉从屏幕哪一侧滑出，默认值为 `left`。

| 类型                  | 必需 |
| --------------------- | ---- |
| enum('left', 'right') | 否   |

---

### `drawerWidth`

指定抽屉宽度，更确切地说，是从窗口边缘滑出的视图宽度。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `keyboardDismissMode`

决定拖动时是否关闭键盘。

- 'none'（默认），拖动不关闭键盘。
- 'on-drag'，拖动开始时关闭键盘。

| 类型                    | 必需 |
| ----------------------- | ---- |
| enum('none', 'on-drag') | 否   |

---

### `onDrawerClose`

每当导航视图关闭时调用的函数。

| 类型     | 必需 |
| -------- | ---- |
| function | 否   |

---

### `onDrawerOpen`

每当导航视图打开时调用的函数。

| 类型     | 必需 |
| -------- | ---- |
| function | 否   |

---

### `onDrawerSlide`

每当导航视图发生交互时调用的函数。

| 类型     | 必需 |
| -------- | ---- |
| function | 否   |

---

### `onDrawerStateChanged`

抽屉状态改变时调用的函数。抽屉有三种状态：

- idle，表示当前没有与导航视图的交互。
- dragging，表示正在与导航视图交互。
- settling，表示之前有交互，导航视图正在完成关闭或打开的动画。

| 类型     | 必需 |
| -------- | ---- |
| function | 否   |

---

### `renderNavigationView`

渲染导航视图，该视图会显示在屏幕侧边并可拉出。

| 类型     | 必需 |
| -------- | ---- |
| function | 是   |

---

### `statusBarBackgroundColor`

让抽屉覆盖整个屏幕并绘制状态栏的背景色，以便它能覆盖状态栏打开。仅在 API 21+ 有效。

| 类型                 | 必需 |
| -------------------- | ---- |
| [color](colors.md)   | 否   |

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
