---
id: inputaccessoryview
title: InputAccessoryView
---

一个用于自定义 iOS 键盘输入辅助视图的组件。只要 `TextInput` 获得焦点，输入辅助视图就会显示在键盘上方。此组件可用于创建自定义工具栏。

要使用此组件，请用 InputAccessoryView 组件包裹你的自定义工具栏，并设置一个 `nativeID`。然后，将该 `nativeID` 作为你想要使用的任意 `TextInput` 的 `inputAccessoryViewID` 传入。下面是一个基本示例：

```SnackPlayer name=InputAccessoryView&supportedPlatforms=ios
import {useState} from 'react';
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
            placeholder={'请在此输入…'}
          />
        </ScrollView>
      </SafeAreaView>
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <Button onPress={() => setText(initialText)} title="清除文本" />
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

此组件也可用于创建粘性文本输入框（即锚定在键盘顶部的文本输入框）。要实现这一点，请用 `InputAccessoryView` 组件包裹一个 `TextInput`，并且不要设置 `nativeID`。示例请参见 [InputAccessoryViewExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/InputAccessoryView/InputAccessoryViewExample.js)。

---

# 参考

## Props

### `backgroundColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `nativeID`

用于将此 `InputAccessoryView` 与指定的 TextInput 关联起来的 ID。

| 类型   |
| ------ |
| string |

---

### `style`

| 类型                              |
| --------------------------------- |
| [视图样式](view-style-props.md) |

# 已知问题

- [react-native#18997](https://github.com/facebook/react-native/issues/18997)：不支持多行 `TextInput`
- [react-native#20157](https://github.com/facebook/react-native/issues/20157)：不能与底部标签栏同时使用
