---
id: modal
title: 模态框
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
            Alert.alert('Modal 已关闭。');
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

### [View 属性](view.md#props)

继承 [View 属性](view.md#props)。

---

### 🗑️ `animated`

:::warning[Deprecated]
请改用 [`animationType`](modal.md#animationtype) 属性。
:::

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

模态框的 `backdropColor`（或模态框容器的背景颜色）。如果未提供且 transparent 为 `false`，则默认为 `white`。如果 `transparent` 为 `true`，则忽略此属性。

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

`navigationBarTranslucent` 属性确定您的模态框是否应该位于系统导航栏下方。但是，还需要将 `statusBarTranslucent` 设置为 `true` 才能使导航栏半透明。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `onDismiss` <div className="label ios">iOS</div>

`onDismiss` 属性允许传递一个函数，该函数将在模态框被关闭后调用。

| 类型     |
| -------- |
| 函数 |

---

### `onOrientationChange` <div className="label ios">iOS</div>

当模态框显示时方向发生变化，会调用 `onOrientationChange` 回调。提供的方向仅为 'portrait' 或 'landscape'。无论当前方向如何，此回调也会在初始渲染时调用。

| 类型     |
| -------- |
| 函数 |

---

### `allowSwipeDismissal` <div className="label ios">iOS</div>

控制在 iOS 上是否可以通过向下滑动手势关闭模态框。
这需要您实现 `onRequestClose` 属性来处理关闭操作。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `ref`

一个 ref 设置器，挂载时将被分配一个 [元素节点](element-nodes)。

---

### `onRequestClose`

当用户在 Android 上点击硬件返回按钮，或在 Apple TV 上点击菜单按钮时，会调用 `onRequestClose` 回调。因此，由于这是必需的属性，只要模态框处于打开状态，就不会触发 `BackHandler` 事件。
在 iOS 上，当使用 `presentationStyle` 为 `pageSheet` 或 `formSheet` 的拖拽手势关闭 Modal 时，会调用此回调。当启用 `allowSwipeDismissal` 时，该回调会在关闭模态框后被调用。

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

`presentationStyle` 属性控制模态框的外观（通常在 iPad 或 Plus 尺寸 iPhone 等较大设备上）。详见 https://developer.apple.com/reference/uikit/uimodalpresentationstyle。

可能的值：

- `fullScreen` 完全覆盖屏幕
- `pageSheet` 覆盖居中的肖像宽度视图（仅在较大设备上）
- `formSheet` 覆盖居中的窄宽度视图（仅在较大设备上）
- `overFullScreen` 完全覆盖屏幕，但允许透明

| 类型                                                                   | 默认值                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| enum(`'fullScreen'`, `'pageSheet'`, `'formSheet'`, `'overFullScreen'`) | 如果 `transparent={false}` 则为 `fullScreen`<hr />如果 `transparent={true}` 则为 `overFullScreen` |

---

### `statusBarTranslucent` <div className="label android">Android</div>

`statusBarTranslucent` 属性确定您的模态框是否应该位于系统状态栏下方。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `false` |

---

### `supportedOrientations` <div className="label ios">iOS</div>

`supportedOrientations` 属性允许模态框旋转到任何指定的方向。在 iOS 上，模态框仍然受限于应用 Info.plist 中 UISupportedInterfaceOrientations 字段指定的内容。

:::note
当在 iOS 上使用 `pageSheet` 或 `formSheet` 的 `presentationStyle` 时，此属性将被忽略。
:::

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
