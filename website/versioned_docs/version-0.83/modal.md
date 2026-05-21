---
id: modal
title: 模态框
---

模态框组件是在封闭视图之上呈现内容的基本方式。

## 示例

```SnackPlayer name=Modal&supportedPlatforms=android,ios
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('模态框已被关闭。');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>你好，世界！</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>隐藏模态框</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>显示模态框</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
```

---

# 参考

## 属性

### [视图属性](view.md#props)

继承自 [视图属性](view.md#props)。

---

### 🗑️ `animated`

:::warning[已弃用]
请改用 [`animationType`](modal.md#animationtype) 属性。
:::

---

### `animationType`

`animationType` 属性控制模态框的动画方式。

可选值：

- `slide` 从底部滑入
- `fade` 淡入显示
- `none` 无动画直接显示

| 类型                                 | 默认值  |
| ------------------------------------ | ------- |
| 枚举 (`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

模态框的背景色（或模态框容器的背景色）。如果未提供且 `transparent` 为 `false`，默认为 `white`。当 `transparent` 为 `true` 时此属性被忽略。

| 类型         | 默认值  |
| ------------ | ------- |
| [颜色](colors) | white   |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否强制为底层窗口启用硬件加速。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性确定模态框是否应该显示在系统导航栏之下。但同时 `statusBarTranslucent` 也必须设置为 `true`，导航栏才会变为半透明。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，在模态框被关闭后调用。

| 类型     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

`onOrientationChange` 回调函数会在模态框显示期间屏幕方向发生变化时调用。传入的方向仅可能为 `'portrait'` 或 `'landscape'`。此回调在初始渲染时也会调用，无论当前方向如何。

| 类型     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制模态框是否可以通过向下滑动手势来关闭，这仅在 iOS 有效。
需要实现 `onRequestClose` 属性来处理关闭。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `false` |

---

### `ref`

一个 ref 设置器，当组件挂载时将被赋予对应的 [元素节点](element-nodes)。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。由于这是必需属性，请注意，只要模态框处于打开状态，就不会触发 `BackHandler` 事件。
在 iOS 上，当使用拖拽手势关闭一个 `presentationStyle` 为 `pageSheet` 或 `formSheet` 的 Modal 时，会调用此回调。当启用 `allowSwipeDismissal` 时，此回调会在模态框被关闭后调用。

| 类型                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">电视</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，在模态框显示后调用。

| 类型     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制模态框的呈现风格（通常用于 iPad 或更大尺寸 iPhone）。详情请参阅 https://developer.apple.com/reference/uikit/uimodalpresentationstyle 。

可选值：

- `fullScreen` 全屏覆盖
- `pageSheet` 覆盖一个居中的竖屏宽度视图（仅限更大设备）
- `formSheet` 覆盖一个居中的窄屏宽度视图（仅限更大设备）
- `overFullScreen` 全屏覆盖且允许透明背景

| 类型                                                                 | 默认值                                                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 枚举 (`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `fullScreen`（当 `transparent={false}`）<hr />`overFullScreen`（当 `transparent={true}`） |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性确定模态框是否应该显示在系统状态栏之下。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到指定的屏幕方向列表。在 iOS 上，模态框的旋转依然受应用 Info.plist 中 `UISupportedInterfaceOrientations` 字段限制。

:::note
当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时，此属性会被 iOS 忽略。
:::

| 类型                                                                                                         | 默认值         |
| ------------------------------------------------------------------------------------------------------------ | -------------- |
| 枚举数组 (`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`)      | `['portrait']` |

---

### `transparent`

`transparent` 属性决定模态框是否填充整个视图。设置为 `true` 会让模态框渲染在透明背景之上。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `false` |

---

### `visible`

`visible` 属性决定模态框是否可见。

| 类型  | 默认值  |
| ----- | ------- |
| bool  | `true`  |
