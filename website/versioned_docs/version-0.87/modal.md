---
id: modal
title: Modal
---

Modal 组件是一种在包含视图上方呈现内容的基本方式。

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

## Props

### [View Props](view.md#props)

继承 [View Props](view.md#props)。

---

### `animationType`

`animationType` 属性控制模态框的动画方式。

可能的值：

- `slide` 从底部滑入
- `fade` 淡入视图
- `none` 无动画显示

| Type                                  | Default |
| ------------------------------------- | ------- |
| enum（`'none'`、`'slide'`、`'fade'`） | `none`  |

---

### `backdropColor`

模态框的 `backdropColor`（或模态框容器的背景色）。如果未提供且 `transparent` 为 `false`，则默认为 `white`。如果 `transparent` 为 `true`，则会忽略此属性。

| Type            | Default |
| --------------- | ------- |
| [color](colors) | white   |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否强制为底层窗口启用硬件加速。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性决定模态框是否应延伸到系统导航栏下方。不过，还需要将 `statusBarTranslucent` 设置为 `true`，才能使导航栏变为半透明。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数将在模态框关闭后调用。

| Type     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

模态框显示期间方向发生变化时，会调用 `onOrientationChange` 回调。提供的方向只有 `'portrait'` 或 `'landscape'`。无论当前方向如何，此回调也会在初始渲染时调用。

| Type     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制是否可以在 iOS 上向下滑动关闭模态框。
这要求你实现 `onRequestClose` 属性来处理关闭操作。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `ref`

一个 ref setter，在挂载时会被分配一个 [element node](element-nodes)。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮，或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。由于这是必需的属性，请注意，只要模态框处于打开状态，就不会触发 `BackHandler` 事件。
在 iOS 上，当使用拖动手势关闭 `presentationStyle` 为 `pageSheet` 或 `formSheet` 的 Modal 时，会调用此回调。启用 `allowSwipeDismissal` 后，此回调会在模态框关闭后调用。

| Type                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">Required</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数将在模态框显示后调用。

| Type     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制模态框的显示方式（通常适用于 iPad 或大屏 iPhone 等较大设备）。详情请参阅 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可能的值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖以纵向宽度居中的视图（仅适用于较大设备）
- `formSheet` 覆盖以窄宽度居中的视图（仅适用于较大设备）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| Type                                                                     | Default                                                                             |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| enum（`'fullScreen'`、`'pageSheet'`、`'formSheet'`、`'overFullScreen'`） | `fullScreen` if `transparent={false}`<hr />`overFullScreen` if `transparent={true}` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性决定模态框是否应延伸到系统状态栏下方。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到指定的任一方向。在 iOS 上，模态框仍受应用 `Info.plist` 的 `UISupportedInterfaceOrientations` 字段中指定内容的限制。

:::note
在 iOS 上使用 `presentationStyle` 的 `pageSheet` 或 `formSheet` 时，此属性会被忽略。
:::

| Type                                                                                                             | Default        |
| ---------------------------------------------------------------------------------------------------------------- | -------------- |
| array of enums（`'portrait'`、`'portrait-upside-down'`、`'landscape'`、`'landscape-left'`、`'landscape-right'`） | `['portrait']` |

---

### `transparent`

`transparent` 属性决定模态框是否填充整个视图。将其设置为 `true` 会使模态框以透明背景呈现。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `visible`

`visible` 属性决定模态框是否可见。

| Type | Default |
| ---- | ------- |
| bool | `true`  |
