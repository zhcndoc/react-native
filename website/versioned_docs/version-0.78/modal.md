---
id: modal
title: Modal
---

Modal 组件是一种在封闭视图之上呈现内容的基本方式。

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
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
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

### [View 属性](view.md#props)

继承 [View 属性](view.md#props)。

---

### `animated`

> **已弃用。** 请改用 [`animationType`](modal.md#animationtype) 属性。

---

### `animationType`

`animationType` 属性控制模态框的动画方式。

可能的值：

- `slide` 从底部滑入
- `fade` 淡入视图
- `none` 无动画出现

| 类型                                | 默认值 |
| ----------------------------------- | ------- |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

模态框的 `backdropColor`（或模态框容器的背景颜色。）如果未提供且 `transparent` 为 `false`，则默认为 `white`。如果 `transparent` 为 `true`，则忽略此属性。

| 类型            | 默认值 |
| --------------- | ------- |
| [颜色](colors) | white   |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否强制底层窗口进行硬件加速。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性确定您的模态框是否应位于系统导航栏下方。但是，也需要将 `statusBarTranslucent` 设置为 `true` 才能使导航栏半透明。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传递一个函数，该函数将在模态框被解散后调用。

| 类型     |
| -------- |
| 函数 |

---

### `onOrientationChange` <div className="label ios">iOS</div>

`onOrientationChange` 回调在模态框显示时方向发生变化时调用。提供的方向仅为 'portrait' 或 'landscape'。无论当前方向如何，此回调也会在初始渲染时调用。

| 类型     |
| -------- |
| 函数 |

---

### `onRequestClose`

`onRequestClose` 回调在用户在 Android 上点击硬件返回键或在 Apple TV 上点击菜单按钮时调用。由于此必需属性，请注意只要模态框打开，`BackHandler` 事件就不会被发出。
在 iOS 上，当 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时，如果使用拖动手势解散模态框，则调用此回调。

| 类型                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 函数 <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">TV</div><hr />函数 <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传递一个函数，该函数将在模态框显示后调用。

| 类型     |
| -------- |
| 函数 |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制模态框如何出现（通常在较大设备上，如 iPad 或 Plus 尺寸的 iPhone）。详见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可能的值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖居中的竖屏宽度视图（仅在较大设备上）
- `formSheet` 覆盖居中的窄宽度视图（仅在较大设备上）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| 类型                                                                   | 默认值                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `transparent={false}` 时为 `fullScreen`<hr />`transparent={true}` 时为 `overFullScreen` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性确定您的模态框是否应位于系统状态栏下方。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到任何指定的方向。在 iOS 上，模态框仍受应用的 Info.plist 中 UISupportedInterfaceOrientations 字段指定的限制。

> 当使用 `pageSheet` 或 `formSheet` 的 `presentationStyle` 时，此属性将被 iOS 忽略。

| 类型                                                                                                           | 默认值        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| 枚举数组 (`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性确定您的模态框是否将填充整个视图。将其设置为 `true` 将在透明背景上渲染模态框。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `visible`

`visible` 属性确定您的模态框是否可见。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |
