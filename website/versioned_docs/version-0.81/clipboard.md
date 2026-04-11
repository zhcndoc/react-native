---
id: clipboard
title: '❌ 剪贴板'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=clipboard) 之一。

`Clipboard` 提供了一个接口，用于在 Android 和 iOS 上设置和获取剪贴板内容

---

## 示例

```SnackPlayer name=Clipboard%20API%20Example&supportedPlatforms=ios,android
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  StyleSheet,
} from 'react-native';

const App = () => {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => copyToClipboard()}>
          <Text>Click here to copy to Clipboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => fetchCopiedText()}>
          <Text>View copied text</Text>
        </TouchableOpacity>

        <Text style={styles.copiedText}>{copiedText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});

export default App;
```

# 参考

## 方法

### `getString()`

```jsx
static getString()
```

获取字符串类型的内容，此方法返回一个 `Promise`，因此你可以使用以下代码来获取剪贴板内容

```jsx
async _getContent() {
  const content = await Clipboard.getString();
}
```

---

### `setString()`

```jsx
static setString(content)
```

设置字符串类型的内容。你可以使用以下代码来设置剪贴板内容

```jsx
_setContent() {
  Clipboard.setString('hello world');
}
```

**参数：**

| 名称 | 类型 | 必填 | 描述 |
| ------- | ------ | -------- | ----------------------------------------- |
| content | string | 是 | 要存储在剪贴板中的内容 |

_注意_

当你尝试将 `string` 和 `number` 以外的任何数据复制到剪贴板时要小心，某些数据需要额外的字符串化。例如，如果你尝试复制数组 - Android 将抛出异常，但 iOS 不会。
