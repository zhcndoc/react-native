---
id: actionsheetios
title: ActionSheetIOS
---

显示原生 iOS [Action Sheet](https://developer.apple.com/design/human-interface-guidelines/action-sheets) 组件

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
          // cancel action
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

显示 iOS action sheet。`options` 对象必须包含以下一个或多个属性：

- `options`（字符串数组）- 按钮标题列表（必需）
- `cancelButtonIndex`（整数）- `options` 中取消按钮的索引
- `cancelButtonTintColor`（字符串）- 用于更改取消按钮文本颜色的 [颜色](colors)
- `destructiveButtonIndex`（整数或整数数组）- `options` 中具有破坏性操作的按钮索引
- `title`（字符串）- 显示在 action sheet 上方的标题
- `message`（字符串）- 显示在标题下方的消息
- `anchor`（数字）- action sheet 应锚定到的节点（用于 iPad）
- `tintColor`（字符串）- 用于非破坏性操作按钮标题的 [颜色](colors)
- `disabledButtonIndices`（数字数组）- 应被禁用的按钮索引列表
- `userInterfaceStyle`（字符串）- action sheet 使用的界面样式，可以设置为 `light` 或 `dark`，否则将使用默认系统样式

`callback` 函数接收一个参数，即所选项目的从零开始的索引

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
      /* destructive action */
    }
  },
);
```

---

### `dismissActionSheet()`

```tsx
static dismissActionSheet();
```

关闭当前显示的最上层 iOS action sheet；如果不存在 action sheet，则会显示警告

---

### `showShareActionSheetWithOptions()`

```tsx
static showShareActionSheetWithOptions: (
  options: ShareActionSheetIOSOptions,
  failureCallback: (error: Error) => void,
  successCallback: (success: boolean, method: string) => void,
);
```

显示 iOS 分享 sheet。`options` 对象应包含 `message` 和 `url` 中的一个或两个，并且还可以包含 `subject` 或 `excludedActivityTypes`：

- `url`（字符串）- 要分享的 URL
- `message`（字符串）- 要分享的消息
- `subject`（字符串）- 消息的主题
- `excludedActivityTypes`（数组）- 要从 ActionSheet 中排除的活动

:::note
如果 `url` 指向本地文件，或是经过 base64 编码的 uri，则会加载并直接分享其所指向的文件。通过这种方式，你可以分享图片、视频、PDF 文件等。如果 `url` 指向远程文件或地址，则必须符合 [RFC 2396](https://www.ietf.org/rfc/rfc2396.txt) 中所述的 URL 格式。例如，不包含正确协议（HTTP/HTTPS）的网页 URL 将不会被分享
:::

`failureCallback` 函数接收一个参数，即错误对象。该对象唯一已定义的属性是类型为 `string` 的可选 `stack` 属性

`successCallback` 函数接收两个参数：

- 表示成功或失败的布尔值
- 在成功的情况下，表示分享方式的字符串
