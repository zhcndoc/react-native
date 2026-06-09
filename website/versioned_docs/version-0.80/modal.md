---
id: modal
title: Modal
---

Modal 组件是一种在外层视图之上展示内容的基础方式。

## 示例

```SnackPlayer name=Modal&supportedPlatforms=android,ios
import {useState} from 'react';
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
            Alert.alert('Modal 已关闭。');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>你好，世界！</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>隐藏 Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>显示 Modal</Text>
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

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### `animated`

> **已弃用。** 请改用 [`animationType`](modal.md#animationtype) 属性。

---

### `animationType`

`animationType` 属性控制 modal 的动画方式。

可选值：

- `slide` 从底部滑入
- `fade` 淡入显示
- `none` 不带动画地出现

| Type                                | Default |
| ----------------------------------- | ------- |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

Modal 的 `backdropColor`（或 modal 容器的背景色）。如果未提供且 `transparent` 为 `false`，默认是 `white`。如果 `transparent` 为 `true`，则会被忽略。

| Type            | Default |
| --------------- | ------- |
| [color](colors) | white   |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否为底层窗口强制启用硬件加速。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性决定你的 modal 是否应该显示在系统导航栏之下。不过，还需要将 `statusBarTranslucent` 设为 `true` 才能让导航栏半透明。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数会在 modal 被关闭后调用一次。

| Type     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当 modal 显示时发生方向变化，`onOrientationChange` 回调会被调用。提供的方向仅为 `'portrait'` 或 `'landscape'`。无论当前方向如何，这个回调也会在首次渲染时被调用。

| Type     |
| -------- |
| function |

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮，或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。因此，由于这是必需属性，请注意只要 modal 处于打开状态，`BackHandler` 事件就不会被触发。
在 iOS 上，当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 的情况下通过拖拽手势关闭 Modal 时，会调用此回调

| Type                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">Required</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数会在 modal 显示后调用一次。

| Type     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制 modal 的显示方式（通常用于 iPad 或大屏 iPhone 等较大设备）。详情请参见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可选值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖居中的竖屏宽度视图（仅在较大设备上）
- `formSheet` 覆盖居中的窄宽度视图（仅在较大设备上）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| Type                                                                   | Default                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `fullScreen` if `transparent={false}`<hr />`overFullScreen` if `transparent={true}` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性决定你的 modal 是否应该显示在系统状态栏之下。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许 modal 旋转到所指定的任意方向。在 iOS 上，modal 仍然会受到应用的 Info.plist 中 `UISupportedInterfaceOrientations` 字段的限制。

> 当 `presentationStyle` 使用 `pageSheet` 或 `formSheet` 时，iOS 会忽略此属性。

| Type                                                                                                           | Default        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| array of enums(`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性决定你的 modal 是否会填满整个视图。将其设为 `true` 会在透明背景上渲染 modal。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `visible`

`visible` 属性决定你的 modal 是否可见。

| Type | Default |
| ---- | ------- |
| bool | `true`  |
