---
id: button
title: 按钮
---

一个基础的按钮组件，应该能在任何平台上良好渲染。支持最小程度的自定义。

如果这个按钮在你的应用中看起来不合适，你可以使用 [Pressable](pressable) 来构建你自己的按钮。想要获取灵感，可以查看 [按钮组件的源码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Button.js)。

```tsx
<Button
  onPress={onPressLearnMore}
  title="了解更多"
  color="#841584"
  accessibilityLabel="了解这个紫色按钮的更多信息"
/>
```

## 示例

```SnackPlayer name=Button%20Example&ext=js
import React from 'react';
import {StyleSheet, Button, View, Text, Alert, Platform} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const Separator = () => <View style={styles.separator} />;

function showAlert(message) {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert(message);
  }
}

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          标题和 onPress 处理函数是必需的。建议设置 accessibilityLabel 以帮助让每个人都能使用你的应用。
        </Text>
        <Button
          title="按我"
          onPress={() => showAlert('简单按钮被按下')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          在每个平台上以标准方式调整颜色。在 iOS 上，color 属性控制文本颜色。在 Android 上，color 调整按钮的背景色。
        </Text>
        <Button
          title="按我"
          color="#f194ff"
          onPress={() => showAlert('调整颜色的按钮被按下')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          组件的所有交互均被禁用。
        </Text>
        <Button
          title="按我"
          disabled
          onPress={() => showAlert('这个按钮无法被按下')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          这种布局策略让标题定义按钮的宽度。
        </Text>
        <View style={styles.fixToText}>
          <Button
            title="左侧按钮"
            onPress={() => showAlert('左侧按钮被按下')}
          />
          <Button
            title="右侧按钮"
            onPress={() => showAlert('右侧按钮被按下')}
          />
        </View>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
```

---

# 参考

## 属性

### <div className="label required basic">必需</div>**`onPress`**

用户点击按钮时调用的处理函数。

| 类型                                           |
| ---------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)})` |

---

### <div className="label required basic">必需</div>**`title`**

按钮内部显示的文本。在 Android 上，该标题会被转换成大写形式。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

为盲人辅助功能显示的文本。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示用户与该元素交互时屏幕阅读器应使用的语言。应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityActions`

辅助功能动作允许辅助技术以编程方式调用组件的动作。`accessibilityActions` 属性应包含动作对象列表。每个动作对象应包含字段 name 和 label。

更多信息请参见 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  | 必需  |
| ----- | ----- |
| array | 否    |

---

### `onAccessibilityAction`

当用户执行辅助功能动作时调用。该函数唯一的参数是包含要执行动作名称的事件。

更多信息请参见 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     | 必需  |
| -------- | ----- |
| function | 否    |

---

### `color`

文本颜色（iOS）或按钮背景颜色（Android）。

```mdx-code-block
export function ColorDefaults() {
  return (
    <>
      <ins style={{ background: "#2196F3" }} className="color-box" />{" "}<code>'#2196F3'</code>
      {" "}<div className="label android">Android</div>
      <hr />
      <ins style={{ background: "#007AFF" }} className="color-box" />{" "}<code>'#007AFF'</code>
      {" "}<div className="label ios">iOS</div>
    </>
  );
}
```

| 类型            | 默认值           |
| --------------- | ---------------- |
| [color](colors) | <ColorDefaults/> |

---

### `disabled`

如果为 `true`，将禁用此组件的所有交互。

| 类型 | 默认 |
| ---- | ---- |
| bool | `false` |

---

### `hasTVPreferredFocus` <div className="label tv">TV</div>

电视上的首选聚焦。

| 类型 | 默认 |
| ---- | ---- |
| bool | `false` |

---

### `nextFocusDown` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向下导航时，接收焦点的下一个视图。详情请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向前导航时，接收焦点的下一个视图。详情请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向左导航时，接收焦点的下一个视图。详情请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向右导航时，接收焦点的下一个视图。详情请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向上导航时，接收焦点的下一个视图。详情请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型   |
| ------ |
| number |

---

### `testID`

用于在端到端测试中定位该视图。

| 类型   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 `true`，触摸时不播放系统声音。

| 类型    | 默认 |
| ------- | ---- |
| boolean | `false` |
