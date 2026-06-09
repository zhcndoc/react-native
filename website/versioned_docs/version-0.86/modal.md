---
id: modal
title: Modal
---

Modal 组件是一种在父视图之上展示内容的基本方式。

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
              <Text style={styles.modalText}>Hello World!</Text>
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

继承 [View Props](view.md#props)。

---

### 🗑️ `animated`

:::warning 已弃用
请改用 [`animationType`](modal.md#animationtype) 属性。
:::

---

### `animationType`

`animationType` 属性控制 modal 的动画方式。

可选值：

- `slide` 从底部滑入
- `fade` 渐隐进入视图
- `none` 无动画显示

| 类型                                 | 默认值 |
| ------------------------------------ | ------ |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

modal 的 `backdropColor`（或 modal 容器的背景色）。如果未提供且 `transparent` 为 `false`，默认值为 `white`。当 `transparent` 为 `true` 时忽略。

| 类型             | 默认值 |
| ---------------- | ------ |
| [color](colors) | white  |

---

### `hardwareAccelerated` <div className="label android">Android</div>

`hardwareAccelerated` 属性控制是否为底层窗口强制启用硬件加速。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `navigationBarTranslucent` <div className="label android">Android</div>

`navigationBarTranslucent` 属性决定你的 modal 是否应显示在系统导航栏下方。不过，还需要将 `statusBarTranslucent` 设为 `true` 才能让导航栏透明。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数会在 modal 被关闭后调用。

| 类型     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当 modal 正在显示时方向发生变化，`onOrientationChange` 回调会被调用。提供的方向仅为 `'portrait'` 或 `'landscape'`。无论当前方向如何，在初始渲染时也会调用此回调。

| 类型     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制在 iOS 上是否可以通过向下滑动来关闭 modal。
这要求你实现 `onRequestClose` 属性来处理关闭操作。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `ref`

挂载时会被赋值为一个 [element node](element-nodes) 的 ref setter。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。由于这是必需属性，只要 modal 处于打开状态，`BackHandler` 事件就不会被发送。
在 iOS 上，当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时通过拖拽手势关闭 Modal，会调用此回调。启用 `allowSwipeDismissal` 后，在关闭 modal 之后也会调用此回调。

| 类型                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数会在 modal 显示后调用。

| 类型     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制 modal 的呈现方式（通常用于 iPad 或大尺寸 iPhone 等较大设备）。详情请参见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可选值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖居中的纵向宽度视图（仅在较大设备上）
- `formSheet` 覆盖居中的窄宽度视图（仅在较大设备上）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| 类型                                                                   | 默认值                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | `transparent={false}` 时为 `fullScreen`<hr />`transparent={true}` 时为 `overFullScreen` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性决定你的 modal 是否应显示在系统状态栏下方。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许 modal 旋转到所指定的任意方向。在 iOS 上，modal 仍受应用 `Info.plist` 中 `UISupportedInterfaceOrientations` 字段所指定内容的限制。

:::note
当使用 `pageSheet` 或 `formSheet` 的 `presentationStyle` 时，此属性在 iOS 上会被忽略。
:::

| 类型                                                                                                           | 默认值        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| enum 数组(`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性决定你的 modal 是否会填满整个视图。将其设为 `true` 会以透明背景渲染 modal。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `visible`

`visible` 属性决定你的 modal 是否可见。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |
