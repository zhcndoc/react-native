---
id: keyboardavoidingview
title: KeyboardAvoidingView
---

该组件会根据键盘的高度自动调整自身的高度、位置或底部内边距，以确保在虚拟键盘显示时仍然保持可见。

## 示例

```SnackPlayer name=KeyboardAvoidingView&supportedPlatforms=android,ios
import React from 'react';
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
          <Text style={styles.header}>Header</Text>
          <TextInput placeholder="Username" style={styles.textInput} />
          <View style={styles.btnContainer}>
            <Button title="Submit" onPress={() => null} />
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

继承自 [View 属性](view.md#props)。

---

### `behavior`

指定对键盘出现时的反应方式。

:::note
Android 和 iOS 对此属性的处理方式不同。建议在 iOS 和 Android 上都设置 `behavior`。
:::

| 类型                                        |
| ------------------------------------------- |
| 枚举(`'height'`, `'position'`, `'padding'`) |

---

### `contentContainerStyle`

当 `behavior` 为 `'position'` 时，内容容器（View）的样式。

| 类型                              |
| --------------------------------- |
| [View 样式](view-style-props.md) |

---

### `enabled`

是否启用 KeyboardAvoidingView。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `keyboardVerticalOffset`

这是用户屏幕顶部与 React Native 视图之间的距离，在某些情况下可能非零。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |
