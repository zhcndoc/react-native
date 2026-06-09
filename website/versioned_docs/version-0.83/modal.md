---
id: modal
title: Modal
---

Modal 组件是一种在包围视图之上展示内容的基本方式。

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

### [View 属性](view.md#props)

继承自 [View 属性](view.md#props)。

---

### 🗑️ `animated`

:::warning[已弃用]
请改用 [`animationType`](modal.md#animationtype) 属性。
:::

---

### `animationType`

`animationType` 属性控制 Modal 的动画方式。

可选值：

- `slide` 从底部滑入
- `fade` 淡入显示
- `none` 不带动画显示

| 类型                                | 默认值 |
| ----------------------------------- | ------- |
| enum(`'none'`, `'slide'`, `'fade'`) | `none`  |

---

### `backdropColor`

Modal 的 `backdropColor`（或 Modal 容器的背景色）。如果未提供且 `transparent` 为 `false`，默认值为 `white`。如果 `transparent` 为 `true`，则会被忽略。

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

`navigationBarTranslucent` 属性决定你的 Modal 是否应显示在系统导航栏下方。不过，还需要将 `statusBarTranslucent` 设为 `true` 才能让导航栏透明。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传入一个函数，该函数会在 Modal 被关闭后调用。

| 类型     |
| -------- |
| function |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当 Modal 显示时发生方向变化，`onOrientationChange` 回调会被调用。提供的方向仅为 `'portrait'` 或 `'landscape'`。无论当前方向如何，此回调也会在首次渲染时调用。

| 类型     |
| -------- |
| function |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制是否可以在 iOS 上通过向下滑动来关闭 Modal。
这要求你实现 `onRequestClose` 属性来处理关闭逻辑。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `ref`

挂载时会被赋值为一个 [元素节点](element-nodes) 的 ref setter。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回键或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。因此，由于这是必需属性，只要 Modal 处于打开状态，`BackHandler` 事件就不会被触发。
在 iOS 上，当 Modal 使用拖拽手势并且 `presentationStyle` 为 `pageSheet` 或 `formSheet` 时，也会调用此回调。当启用 `allowSwipeDismissal` 时，关闭 Modal 后会调用此回调。

| 类型                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function <div className="label basic required">必需</div><div className="label android">Android</div><div className="label tv">TV</div><hr />function <div className="label ios">iOS</div> |

---

### `onShow`

`onShow` 属性允许传入一个函数，该函数会在 Modal 显示后调用。

| 类型     |
| -------- |
| function |

---

### `presentationStyle` <div className="label ios">iOS</div>

`presentationStyle` 属性控制 Modal 的呈现方式（通常在 iPad 或加大尺寸 iPhone 等较大设备上）。详情请参见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

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

`statusBarTranslucent` 属性决定你的 Modal 是否应显示在系统状态栏下方。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许 Modal 旋转到所指定的任意方向。在 iOS 上，Modal 仍受应用 `Info.plist` 中 `UISupportedInterfaceOrientations` 字段的限制。

:::note
当使用 `pageSheet` 或 `formSheet` 的 `presentationStyle` 时，此属性在 iOS 上将被忽略。
:::

| 类型                                                                                                           | 默认值        |
| -------------------------------------------------------------------------------------------------------------- | -------------- |
| array of enums(`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`) | `['portrait']` |

---

### `transparent`

`transparent` 属性决定你的 Modal 是否会填满整个视图。将其设为 `true` 会在透明背景上渲染 Modal。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `visible`

`visible` 属性决定你的 Modal 是否可见。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true`  |
