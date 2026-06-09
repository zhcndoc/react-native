---
id: modal
title: Modal
---

`Modal` 组件是一种在封闭视图之上呈现内容的基本方式。

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
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
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

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### `animated`

> **已弃用。** 请改用 [`animationType`](modal.md#animationtype) 属性。

---

### `animationType`

`animationType` 属性控制模态框的动画方式。

可选值：

- `slide` 从底部滑入
- `fade` 淡入显示
- `none` 不使用动画直接显示

| 类型                                | 默认值 |
| ----------------------------------- | ------- |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

模态框的 `backdropColor`（或模态框容器的背景色）。如果未提供且 `transparent` 为 `false`，默认值为 `white`。当 `transparent` 为 `true` 时会被忽略。

| 类型            | 默认值 |
| --------------- | ------- |
| [color](colors) | white   |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否为底层窗口强制启用硬件加速。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性决定你的模态框是否应显示在系统导航栏下方。不过，还需要将 `statusBarTranslucent` 设为 `true` 才能使导航栏透明。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数会在模态框被关闭后调用一次。

| 类型     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当模态框显示期间方向发生变化时，会调用 `onOrientationChange` 回调。提供的方向仅为 `'portrait'` 或 `'landscape'`。无论当前方向如何，该回调也会在初始渲染时调用。

| 类型     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制是否可以在 iOS 上通过向下滑动关闭模态框。
这需要你实现 `onRequestClose` 属性来处理关闭逻辑。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `onRequestClose`

当用户在 Android 上点按硬件返回按钮，或在 Apple TV 上点按菜单按钮时，会调用 `onRequestClose` 回调。由于这是必需属性，请注意在模态框打开期间不会触发 `BackHandler` 事件。
在 iOS 上，当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时，通过拖拽手势关闭 Modal 会调用此回调。当启用 `allowSwipeDismissal` 时，关闭模态框后也会调用此回调。

| 类型                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数会在模态框显示后调用一次。

| 类型     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制模态框的显示方式（通常用于 iPad 或大屏 iPhone 等较大设备）。详情请参阅 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可选值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 居中覆盖竖屏宽度的视图（仅适用于较大设备）
- `formSheet` 居中覆盖窄宽度的视图（仅适用于较大设备）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| 类型                                                                   | 默认值                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `transparent={false}` 时为 `fullScreen`<hr />`transparent={true}` 时为 `overFullScreen` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性决定你的模态框是否应显示在系统状态栏下方。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到所指定的任意方向。在 iOS 上，模态框仍会受到应用 `Info.plist` 中 `UISupportedInterfaceOrientations` 字段设置的限制。

> 当 `presentationStyle` 使用 `pageSheet` 或 `formSheet` 时，iOS 会忽略此属性。

| 类型                                                                                                           | 默认值        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| array of enums(`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性决定你的模态框是否会填满整个视图。将其设为 `true` 会在透明背景上渲染模态框。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `visible`

`visible` 属性决定你的模态框是否可见。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |
