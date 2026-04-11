---
id: checkbox
title: '❌ 复选框'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=checkbox) 之一。

渲染一个布尔输入框（仅限 Android）。

这是一个受控组件，需要一个 `onValueChange` 回调来更新 `value` 属性，以便组件反映用户操作。如果未更新 `value` 属性，组件将继续渲染提供的 `value` 属性，而不是任何用户操作的预期结果。

## 示例

```SnackPlayer name=CheckBox%20Component%20Example&supportedPlatforms=android,web&ext=js
import React, {useState} from 'react';
import {CheckBox, Text, StyleSheet, View} from 'react-native';

const App = () => {
  const [isSelected, setSelection] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Do you like React Native?</Text>
      </View>
      <Text>Is CheckBox selected: {isSelected ? '👍' : '👎'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default App;
```

---

# 参考

## 属性

继承 [View 属性](view#props)。

---

### `disabled`

如果为 true，用户将无法切换复选框。默认值为 `false`。

| 类型 | 必填 |
| ---- | -------- |
| bool | 否       |

---

### `onChange`

用于属性更改导致组件移除的情况。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onValueChange`

当值改变时调用，并传入新值。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   | 必填 |
| ------ | -------- |
| string | 否       |

---

### `value`

复选框的值。如果为 true，复选框将被选中。默认值为 `false`。

| 类型 | 必填 |
| ---- | -------- |
| bool | 否       |
