---
id: button
title: Button
---

一个基础按钮组件，应能在任何平台上良好呈现。支持最基本程度的自定义。

如果这个按钮在你的应用里看起来不合适，你可以使用 [Pressable](pressable) 自己构建按钮。作为参考，可以查看 [Button 组件的源代码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Button.js)。

```tsx
<Button
  onPress={onPressLearnMore}
  title="了解更多"
  color="#841584"
  accessibilityLabel="了解有关这个紫色按钮的更多信息"
/>
```

## 示例

```SnackPlayer name=Button%20Example&ext=js
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
          标题和 onPress 处理函数是必需的。建议设置 accessibilityLabel，以帮助让你的应用对所有人都可用。
        </Text>
        <Button
          title="按我"
          onPress={() => showAlert('Simple Button pressed')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          以在每个平台上看起来都标准的方式调整颜色。在 iOS 上，color 属性控制文本颜色。在 Android 上，color 会调整按钮的背景颜色。
        </Text>
        <Button
          title="按我"
          color="#f194ff"
          onPress={() => showAlert('Button with adjusted color pressed')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          该组件的所有交互都被禁用。
        </Text>
        <Button
          title="按我"
          disabled
          onPress={() => showAlert('Cannot press this one')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          这种布局策略让标题决定按钮的宽度。
        </Text>
        <View style={styles.fixToText}>
          <Button
            title="左侧按钮"
            onPress={() => showAlert('Left button pressed')}
          />
          <Button
            title="右侧按钮"
            onPress={() => showAlert('Right button pressed')}
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

用户点击按钮时要调用的处理函数。

| Type                                           |
| ---------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)})` |

---

### <div className="label required basic">必需</div>**`title`**

显示在按钮内部的文本。在 Android 上，给定的标题会转换为大写形式。

| Type   |
| ------ |
| string |

---

### `accessibilityLabel`

为无障碍辅助功能显示的文本。

| Type   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示当用户与元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| Type   |
| ------ |
| string |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名称和标签。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| Type  | Required |
| ----- | -------- |
| array | No       |

---

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数唯一的参数是一个包含要执行操作名称的事件。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| Type     | Required |
| -------- | -------- |
| function | No       |

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

| Type            | Default          |
| --------------- | ---------------- |
| [color](colors) | <ColorDefaults/> |

---

### `disabled`

如果为 `true`，则禁用此组件的所有交互。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `hasTVPreferredFocus` <div className="label tv">TV</div>

TV 首选焦点。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `nextFocusDown` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向下导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| Type   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向前导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| Type   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向左导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| Type   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向右导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| Type   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div><div className="label tv">TV</div>

指定用户向上导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| Type   |
| ------ |
| number |

---

### `testID`

用于在端到端测试中定位此视图。

| Type   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 `true`，则不播放触摸时的系统声音。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |
