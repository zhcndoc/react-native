---
id: modal
title: 模态框
---

`Modal` 组件是一种在包裹视图上方展示内容的基本方式。

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
            Alert.alert('模态框已关闭。');
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

## Props

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### 🗑️ `animated`

:::warning[已弃用]
请改用 [`animationType`](modal.md#animationtype) 属性。
:::

---

### `animationType`

`animationType` 属性控制模态框的动画方式。

可能的值：

- `slide` 从底部滑入
- `fade` 淡入显示
- `none` 不带动画显示

| Type                                | Default |
| ----------------------------------- | ------- |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

模态框的 `backdropColor`（或模态框容器的背景色）。如果未提供且 `transparent` 为 `false`，默认值为 `white`。如果 `transparent` 为 `true`，则忽略。

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

`navigationBarTranslucent` 属性决定模态框是否应显示在系统导航栏下方。不过，要使导航栏透明，还需要将 `statusBarTranslucent` 设为 `true`。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数会在模态框被关闭后调用。

| Type     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当模态框显示时，`onOrientationChange` 回调会在屏幕方向变化时调用。提供的方向仅为 'portrait' 或 'landscape'。无论当前方向如何，此回调也会在初始渲染时调用。

| Type     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制在 iOS 上是否可以通过向下滑动关闭模态框。
这需要你实现 `onRequestClose` 属性来处理关闭。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `ref`

挂载时会分配给一个 [element node](element-nodes) 的 ref 赋值器。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。因此由于这是必需属性，请注意只要模态框打开，`BackHandler` 事件就不会被触发。
在 iOS 上，当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 的拖拽手势关闭 Modal 时，会调用此回调。启用 `allowSwipeDismissal` 后，在关闭模态框之后也会调用此回调。

| Type                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数会在模态框显示后调用。

| Type     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制模态框的显示方式（通常用于 iPad 或更大屏幕的 iPhone）。详见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可能的值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖居中的竖屏宽度视图（仅在较大设备上）
- `formSheet` 覆盖居中的窄宽度视图（仅在较大设备上）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| Type                                                                   | Default                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `transparent={false}` 时为 `fullScreen`<hr />`transparent={true}` 时为 `overFullScreen` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性决定模态框是否应显示在系统状态栏下方。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到所指定的任意方向。在 iOS 上，模态框仍受应用 Info.plist 中 `UISupportedInterfaceOrientations` 字段的限制。

:::note
当 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时，此属性在 iOS 上将被忽略。
:::

| Type                                                                                                           | Default        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| array of enums(`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性决定模态框是否会填满整个视图。将其设为 `true` 时，会在透明背景上渲染模态框。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `visible`

`visible` 属性决定模态框是否可见。

| Type | Default |
| ---- | ------- |
| bool | `true`  |
