---
id: inputaccessoryview
title: InputAccessoryView
---

一个用于在 iOS 上自定义键盘输入辅助视图的组件。输入辅助视图会在 `TextInput` 获得焦点时显示在键盘上方。该组件可用于创建自定义工具栏。

使用此组件时，将你自定义的工具栏包裹在 InputAccessoryView 组件内，并设置一个 `nativeID`。然后，将该 `nativeID` 传递给你希望绑定的 `TextInput` 的 `inputAccessoryViewID` 属性。一个基础示例如下：

```SnackPlayer name=InputAccessoryView&supportedPlatforms=ios
import React, {useState} from 'react';
import {
  Button,
  InputAccessoryView,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const inputAccessoryViewID = 'uniqueID';
const initialText = '';

const App = () => {
  const [text, setText] = useState(initialText);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardDismissMode="interactive">
          <TextInput
            style={styles.textInput}
            inputAccessoryViewID={inputAccessoryViewID}
            onChangeText={setText}
            value={text}
            placeholder={'Please type here…'}
          />
        </ScrollView>
      </SafeAreaView>
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <Button onPress={() => setText(initialText)} title="Clear text" />
      </InputAccessoryView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    padding: 16,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default App;
```

该组件也可用于创建固定在键盘顶部的文本输入框（粘性文本输入框）。做法是用 `InputAccessoryView` 组件包裹一个 `TextInput`，但不设置 `nativeID`。示例请参阅 [InputAccessoryViewExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/InputAccessoryView/InputAccessoryViewExample.js)。

---

# 参考

## 属性

### `backgroundColor`

| 类型               |
| ------------------ |
| [颜色](colors.md)  |

---

### `nativeID`

用于将此 `InputAccessoryView` 与指定的 TextInput(s) 关联的 ID。

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                             |
| -------------------------------- |
| [视图样式](view-style-props.md) |

# 已知问题

- [react-native#18997](https://github.com/facebook/react-native/issues/18997)：不支持多行 `TextInput`
- [react-native#20157](https://github.com/facebook/react-native/issues/20157)：无法与底部标签栏（bottom tab bar）一起使用