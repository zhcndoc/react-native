---
id: alert
title: 警告
---

使用指定的标题和消息弹出警告对话框。

也可以提供一个按钮列表。点击任意按钮都会触发相应的 onPress 回调并关闭警告。默认情况下，唯一的按钮将是一个 'OK' 按钮。

这是一个同时适用于 Android 和 iOS 的 API，可显示静态警告。提示用户输入一些信息的警告仅在 iOS 上可用。

## 示例

```SnackPlayer name=Alert%20Example&supportedPlatforms=ios,android
import React from 'react';
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const createTwoButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const createThreeButtonAlert = () =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button title={'2-Button Alert'} onPress={createTwoButtonAlert} />
        <Button title={'3-Button Alert'} onPress={createThreeButtonAlert} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default App;
```

## iOS

在 iOS 上，你可以指定任意数量的按钮。每个按钮都可以可选地指定一种样式或设置为强调显示，可用选项由 [AlertButtonStyle](#alertbuttonstyle-ios) 枚举以及 [AlertButton](alert#alertbutton) 上的 `isPreferred` 字段表示。

## Android

在 Android 上，最多可以指定三个按钮。Android 有中性按钮、负向按钮和正向按钮的概念：

- 如果你指定一个按钮，它将是“正向”按钮（例如“OK”）
- 两个按钮表示“负向”、“正向”（例如“Cancel”、“OK”）
- 三个按钮表示“中性”、“负向”、“正向”（例如“Later”、“Cancel”、“OK”）

Android 上的警告可以通过点击警告框外部来关闭。默认情况下此功能是禁用的，可以通过提供一个可选的 [AlertOptions](alert#alertoptions) 参数并将 cancelable 属性设为 `true` 来启用，即<br/>`{cancelable: true}`。

取消事件可以通过在 `options` 参数中提供 `onDismiss` 回调属性来处理。

### 示例 <div className="label android">Android</div>

```SnackPlayer name=Alert%20Android%20Dissmissable%20Example&supportedPlatforms=android
import React from 'react';
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const showAlert = () =>
  Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
      {
        text: 'Cancel',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    },
  );

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Button title="Show alert" onPress={showAlert} />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

---

# 参考

## 方法

### `alert()`

```tsx
static alert (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
);
```

**参数：**

| Name                                                       | Type                               | Description                                                             |
| ---------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| title <div className="label basic required">Required</div> | string                             | 对话框的标题。传入 `null` 或空字符串将隐藏标题。 |
| message                                                    | string                             | 显示在对话框标题下方的可选消息。              |
| buttons                                                    | [AlertButton](alert#alertbutton)[] | 包含按钮配置的可选数组。                     |
| options                                                    | [AlertOptions](alert#alertoptions) | 可选的 Alert 配置。                                        |

---

### `prompt()` <div className="label ios">iOS</div>

```tsx
static prompt: (
  title: string,
  message?: string,
  callbackOrButtons?: ((text: string) => void) | AlertButton[],
  type?: AlertType,
  defaultValue?: string,
  keyboardType?: string,
);
```

以 Alert 的形式创建并显示一个输入文本的提示框。

**参数：**

| Name                                                       | Type                                            | Description                                                                                                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title <div className="label basic required">Required</div> | string                                          | 对话框的标题。                                                                                                                                                                                   |
| message                                                    | string                                          | 显示在文本输入框上方的可选消息。                                                                                                                                                |
| callbackOrButtons                                          | function<hr/>[AlertButton](alert#alertButton)[] | 如果传入一个函数，当用户点击“OK”时，会以提示框的值调用该函数<br/>`(text: string) => void`。<hr/>如果传入一个数组，将根据数组内容配置按钮。 |
| type                                                       | [AlertType](alert#alerttype-ios)                | 用于配置文本输入框。                                                                                                                                                                       |
| defaultValue                                               | string                                          | 文本输入框中的默认文本。                                                                                                                                                                       |
| keyboardType                                               | string                                          | 第一个文本框的键盘类型（如果存在）。TextInput [keyboardTypes](textinput#keyboardtype) 之一。                                                                                          |
| options                                                    | [AlertOptions](alert#alertoptions)              | 可选的 Alert 配置。                                                                                                                                                                      |

---

## 类型定义

### AlertButtonStyle <div className="label ios">iOS</div>

iOS 警告按钮样式。

| Type |
| ---- |
| enum |

**常量：**

| Value           | Description               |
| --------------- | ------------------------- |
| `'default'`     | 默认按钮样式。     |
| `'cancel'`      | 取消按钮样式。      |
| `'destructive'` | 危险按钮样式。 |

---

### AlertType <div className="label ios">iOS</div>

iOS 警告类型。

| Type |
| ---- |
| enum |

**常量：**

| Value              | Description                  |
| ------------------ | ---------------------------- |
| `'default'`        | 无输入的默认警告 |
| `'plain-text'`     | 纯文本输入警告       |
| `'secure-text'`    | 安全文本输入警告      |
| `'login-password'` | 登录和密码警告     |

---

### AlertButton

描述警告中按钮配置的对象。

| Type             |
| ---------------- |
| array of objects |

**对象属性：**

| Name                                             | Type                                           | Description                                                                    |
| ------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| text                                             | string                                         | 按钮标签。                                                                  |
| onPress                                          | function                                       | 按钮被按下时的回调函数。                                      |
| style <div className="label ios">iOS</div>       | [AlertButtonStyle](alert#alertbuttonstyle-ios) | 按钮样式，在 Android 上此属性将被忽略。                        |
| isPreferred <div className="label ios">iOS</div> | boolean                                        | 按钮是否应被强调显示，在 Android 上此属性将被忽略。 |

---

### AlertOptions

| Type   |
| ------ |
| object |

**属性：**

| Name                                                    | Type     | Description                                                                                                               |
| ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| cancelable <div className="label android">Android</div> | boolean  | 定义是否可以通过点击警告框外部来关闭警告。                                                    |
| userInterfaceStyle <div className="label ios">iOS</div> | string   | 用于警告的界面样式，可设置为 `light` 或 `dark`，否则将使用默认系统样式。 |
| onDismiss <div className="label android">Android</div>  | function | 警告被关闭时触发的回调函数。                                                                    |
