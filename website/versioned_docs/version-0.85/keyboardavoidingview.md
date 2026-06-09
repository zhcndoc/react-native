---
id: keyboardavoidingview
title: KeyboardAvoidingView
---

此组件将根据键盘高度自动调整其高度、位置或底部内边距，以便在显示虚拟键盘时保持可见。

## 示例

```SnackPlayer name=KeyboardAvoidingView&supportedPlatforms=android,ios
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from 'react-native';

const KeyboardAvoidingComponent = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.header}>标题</Text>
          <TextInput placeholder="用户名" style={styles.textInput} />
          <View style={styles.btnContainer}>
            <Button title="提交" onPress={() => null} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default KeyboardAvoidingComponent;
```

---

# 参考

## 属性

### [View 属性](view.md#props)

继承 [View 属性](view.md#props)。

---

### `behavior`

指定如何响应键盘的存在。

:::note
Android 和 iOS 与此属性的交互方式不同。在 iOS 和 Android 上，都建议设置 `behavior`。
:::

| 类型                                        |
| ------------------------------------------- |
| enum(`'height'`, `'position'`, `'padding'`) |

---

### `contentContainerStyle`

当 behavior 为 `'position'` 时，内容容器 (View) 的样式。

| 类型                              |
| --------------------------------- |
| [View 样式](view-style-props.md) |

---

### `enabled`

启用或禁用 KeyboardAvoidingView。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `keyboardVerticalOffset`

这是用户屏幕顶部与 React Native 视图之间的距离，在某些使用情况下可能不为零。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |
