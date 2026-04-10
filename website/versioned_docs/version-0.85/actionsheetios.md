---
id: actionsheetios
title: ActionSheetIOS
---

显示 iOS 原生的 [操作表](https://developer.apple.com/design/human-interface-guidelines/action-sheets) 组件。

## 示例

```SnackPlayer name=ActionSheetIOS%20Example&supportedPlatforms=ios
import React, {useState} from 'react';
import {ActionSheetIOS, Button, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [result, setResult] = useState('🔮');

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Generate number', 'Reset'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // 取消操作
        } else if (buttonIndex === 1) {
          setResult(String(Math.floor(Math.random() * 100) + 1));
        } else if (buttonIndex === 2) {
          setResult('🔮');
        }
      },
    );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.result}>{result}</Text>
        <Button onPress={onPress} title="Show Action Sheet" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  result: {
    fontSize: 64,
    textAlign: 'center',
  },
});

export default App;
```

# 参考

## 方法

### `showActionSheetWithOptions()`

```tsx
static showActionSheetWithOptions: (
  options: ActionSheetIOSOptions,
  callback: (buttonIndex: number) => void,
);
```

显示 iOS 操作表。`options` 对象必须包含以下一项或多项：

- `options`（字符串数组）- 按钮标题列表（必填）
- `cancelButtonIndex`（int）- `options` 中取消按钮的索引
- `cancelButtonTintColor`（string）- 用于更改取消按钮文本颜色的 [颜色](colors)
- `destructiveButtonIndex`（int 或 int 数组）- `options` 中破坏性按钮的索引
- `title`（string）- 显示在操作表上方的标题
- `message`（string）- 显示在标题下方的消息
- `anchor`（number）- 操作表应锚定到的节点（用于 iPad）
- `tintColor`（string）- 用于非破坏性按钮标题的 [颜色](colors)
- `disabledButtonIndices`（数字数组）- 应禁用的按钮索引列表
- `userInterfaceStyle`（string）- 操作表使用的界面风格，可设置为 `light` 或 `dark`，否则将使用默认系统风格

`callback` 函数接受一个参数，即所选项目的从零开始的索引。

最小示例：

```tsx
ActionSheetIOS.showActionSheetWithOptions(
  {
    options: ['Cancel', 'Remove'],
    destructiveButtonIndex: 1,
    cancelButtonIndex: 0,
  },
  buttonIndex => {
    if (buttonIndex === 1) {
      /* 破坏性操作 */
    }
  },
);
```

---

### `dismissActionSheet()`

```tsx
static dismissActionSheet();
```

关闭当前展示的最上层 iOS 操作表，如果没有操作表正在展示，则会显示警告。

---

### `showShareActionSheetWithOptions()`

```tsx
static showShareActionSheetWithOptions: (
  options: ShareActionSheetIOSOptions,
  failureCallback: (error: Error) => void,
  successCallback: (success: boolean, method: string) => void,
);
```

显示 iOS 分享表。`options` 对象应包含 `message` 和 `url` 中的一个或两个，并且还可以具有 `subject` 或 `excludedActivityTypes`：

- `url`（string）- 要分享的 URL
- `message`（string）- 要分享的消息
- `subject`（string）- 消息的主题
- `excludedActivityTypes`（array）- 要从操作表中排除的活动

:::note
如果 `url` 指向本地文件，或是 base64 编码的 uri，则它指向的文件将被加载并直接分享。通过这种方式，你可以分享图片、视频、PDF 文件等。如果 `url` 指向远程文件或地址，它必须符合 [RFC 2396](https://www.ietf.org/rfc/rfc2396.txt) 中描述的 URL 格式。例如，没有适当协议（HTTP/HTTPS）的 Web URL 将不会被分享。
:::

`failureCallback` 函数接受一个参数，一个错误对象。此对象上定义的唯一属性是类型为 `string` 的可选 `stack` 属性。

`successCallback` 函数接受两个参数：

- 一个表示成功或失败的布尔值
- 一个字符串，在成功的情况下，表示分享的方法
