---
id: actionsheetios
title: ActionSheetIOS
---

显示 iOS 原生的 [Action Sheet](https://developer.apple.com/design/human-interface-guidelines/action-sheets) 组件。

## 示例

```SnackPlayer name=ActionSheetIOS%20Example&supportedPlatforms=ios
import {useState} from 'react';
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

显示一个 iOS action sheet。`options` 对象必须包含以下一项或多项：

- `options`（字符串数组）- 按钮标题列表（必需）
- `cancelButtonIndex`（int）- `options` 中取消按钮的索引
- `cancelButtonTintColor`（string）- 用于更改取消按钮文本颜色的 [color](colors)
- `destructiveButtonIndex`（int 或 int 数组）- `options` 中危险按钮的索引
- `title`（string）- 显示在 action sheet 上方的标题
- `message`（string）- 显示在标题下方的消息
- `anchor`（number）- action sheet 应锚定到的节点（用于 iPad）
- `tintColor`（string）- 用于非危险按钮标题的 [color](colors)
- `disabledButtonIndices`（number 数组）- 应被禁用的按钮索引列表
- `userInterfaceStyle`（string）- action sheet 使用的界面样式，可设置为 `light` 或 `dark`，否则将使用默认系统样式

`callback` 函数接收一个参数，即所选项的从零开始的索引。

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
      /* 危险操作 */
    }
  },
);
```

---

### `dismissActionSheet()`

```tsx
static dismissActionSheet();
```

关闭当前显示的最上层 iOS action sheet，如果没有 action sheet 显示，则会提示警告。

---

### `showShareActionSheetWithOptions()`

```tsx
static showShareActionSheetWithOptions: (
  options: ShareActionSheetIOSOptions,
  failureCallback: (error: Error) => void,
  successCallback: (success: boolean, method: string) => void,
);
```

显示 iOS 分享面板。`options` 对象应包含 `message` 和 `url` 中的一项或两项，并且还可以额外包含 `subject` 或 `excludedActivityTypes`：

- `url`（string）- 要分享的 URL
- `message`（string）- 要分享的消息
- `subject`（string）- 消息的主题
- `excludedActivityTypes`（array）- 要从 ActionSheet 中排除的活动

:::note
如果 `url` 指向本地文件，或是一个 base64 编码的 uri，则它指向的文件将被直接加载并共享。通过这种方式，你可以共享图片、视频、PDF 文件等。如果 `url` 指向远程文件或地址，它必须符合 [RFC 2396](https://www.ietf.org/rfc/rfc2396.txt) 中描述的 URL 格式。例如，没有正确协议（HTTP/HTTPS）的网页 URL 将不会被共享。
:::

`failureCallback` 函数接收一个参数，即错误对象。此对象上定义的唯一属性是可选的 `stack` 属性，类型为 `string`。

`successCallback` 函数接收两个参数：

- 一个表示成功或失败的布尔值
- 一个字符串，在成功时表示分享方式
