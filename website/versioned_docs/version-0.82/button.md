---
id: button
title: 按钮
---

一个基本的按钮组件，应在任何平台上都能良好渲染。支持最低程度的自定义。

如果此按钮看起来不适合您的应用，您可以使用 [Pressable](pressable) 构建自己的按钮。如需灵感，请参阅 [Button 组件的源代码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Button.js)。

```tsx
<Button
  onPress={onPressLearnMore}
  title="了解更多"
  color="#841584"
  accessibilityLabel="了解更多关于这个紫色按钮的信息"
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
          该组件需要标题和 onPress 处理函数。建议设置
          accessibilityLabel，以帮助让您的应用对所有人都可用。
        </Text>
        <Button
          title="点击我"
          onPress={() => showAlert('简单按钮被点击')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          以在各个平台上看起来标准的方式调整颜色。在 iOS 上，color 属性控制文本颜色。在 Android 上，color 会调整按钮的背景颜色。
        </Text>
        <Button
          title="点击我"
          color="#f194ff"
          onPress={() => showAlert('调整颜色的按钮被点击')}
        />
      </View>
      <Separator />
      <View>
        <Text style={styles.title}>
          组件的所有交互都已禁用。
        </Text>
        <Button
          title="点击我"
          disabled
          onPress={() => showAlert('无法点击这个按钮')}
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
            onPress={() => showAlert('左侧按钮被点击')}
          />
          <Button
            title="右侧按钮"
            onPress={() => showAlert('右侧按钮被点击')}
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

当用户点击按钮时调用的处理函数。

| 类型                                           |
| ---------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)})` |

---

### <div className="label required basic">必需</div>**`title`**

显示在按钮内部的文本。在 Android 上，给定的标题将被转换为大写形式。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

为盲人无障碍功能显示的文本。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

表示当用户与该元素交互时屏幕阅读器应使用哪种语言的值。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段 name 和 label。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  | 是否必需 |
| ----- | -------- |
| array | 否       |

---

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数的唯一参数是一个包含要执行的操作名称的事件。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     | 是否必需 |
| -------- | -------- |
| function | 否       |

---

### `color`

文本颜色 (iOS)，或按钮的背景颜色 (Android)。

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

| 类型            | 默认值          |
| --------------- | ---------------- |
| [color](colors) | <ColorDefaults/> |

---

### `disabled`

如果为 `true`，则禁用此组件的所有交互。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `hasTVPreferredFocus` <div className="label tv">TV</div>

TV 首选焦点。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `nextFocusDown` <div className="label android">Android</div><div className="label tv">TV</div>

指定当用户向下导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div><div className="label tv">TV</div>

指定当用户向前导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div><div className="label tv">TV</div>

指定当用户向左导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div><div className="label tv">TV</div>

指定当用户向右导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div><div className="label tv">TV</div>

指定当用户向上导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型   |
| ------ |
| number |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 `true`，则在触摸时不播放系统声音。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |
