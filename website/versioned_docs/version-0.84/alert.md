---
id: alert
title: 警告
---

显示一个带有指定标题和信息的警告对话框。

可选地提供一个按钮列表。点击任意按钮都会触发相应的 onPress 回调并关闭警告。默认情况下，唯一的按钮是“确定”按钮。

这是一个同时适用于 Android 和 iOS 的 API，可以显示静态警告。提示用户输入信息的警告仅在 iOS 上可用。

## 示例

```SnackPlayer name=Alert%20Example&supportedPlatforms=ios,android
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const createTwoButtonAlert = () =>
    Alert.alert('警告标题', '我的警告信息', [
      {
        text: '取消',
        onPress: () => console.log('取消按钮被点击'),
        style: 'cancel',
      },
      {text: '确定', onPress: () => console.log('确定按钮被点击')},
    ]);

  const createThreeButtonAlert = () =>
    Alert.alert('警告标题', '我的警告信息', [
      {
        text: '稍后提醒我',
        onPress: () => console.log('稍后提醒我按钮被点击'),
      },
      {
        text: '取消',
        onPress: () => console.log('取消按钮被点击'),
        style: 'cancel',
      },
      {text: '确定', onPress: () => console.log('确定按钮被点击')},
    ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button title={'两个按钮警告'} onPress={createTwoButtonAlert} />
        <Button title={'三个按钮警告'} onPress={createThreeButtonAlert} />
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

在 iOS 上可以指定任意数量的按钮。每个按钮可选地指定一个样式或是否被强调，可用选项由 [AlertButtonStyle](#alertbuttonstyle-ios) 枚举和 [AlertButton](alert#alertbutton) 上的 `isPreferred` 字段表示。

## Android

在 Android 上最多可以指定三个按钮。Android 有中立（neutral）、消极（negative）和积极（positive）按钮的概念：

- 如果指定一个按钮，它将是“积极”按钮（如“确定”）
- 两个按钮代表“消极”和“积极”（如“取消”，“确定”）
- 三个按钮代表“中立”，“消极”和“积极”（如“稍后”，“取消”，“确定”）

在 Android 上可以通过点击警告框之外的区域来关闭警告。此功能默认禁用，可以通过传入一个可选的 [AlertOptions](alert#alertoptions) 参数并将 cancelable 属性设置为 `true` 来启用，即<br/>`{cancelable: true}`。

取消事件可以通过在 `options` 参数中提供 `onDismiss` 回调来处理。

### 示例 <div className="label android">Android</div>

```SnackPlayer name=Alert%20Android%20Dissmissable%20Example&supportedPlatforms=android
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const showAlert = () =>
  Alert.alert(
    '警告标题',
    '我的警告信息',
    [
      {
        text: '取消',
        onPress: () => Alert.alert('取消按钮被点击'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          '该警告通过点击警告对话框外部被关闭。',
        ),
    },
  );

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Button title="显示警告" onPress={showAlert} />
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

**参数:**

| 名称                                                       | 类型                               | 描述                                                               |
| ---------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| title <div className="label basic required">必需</div>     | string                             | 对话框标题。传入 `null` 或空字符串将隐藏标题。                    |
| message                                                    | string                             | 可选，在标题下方显示的信息。                                       |
| buttons                                                    | [AlertButton](alert#alertbutton)[] | 可选的按钮配置数组。                                               |
| options                                                    | [AlertOptions](alert#alertoptions) | 可选的警告配置。                                                  |

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

创建并显示一个用于输入文本的提示对话框形式的警告。

**参数:**

| 名称                                                       | 类型                                            | 描述                                                                                                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title <div className="label basic required">必需</div>     | string                                          | 对话框标题。                                                                                                                                                                                   |
| message                                                    | string                                          | 可选，显示在文本输入框上方的信息。                                                                                                                                                            |
| callbackOrButtons                                          | function<hr/>[AlertButton](alert#alertButton)[] | 如果传入函数，它将在用户点击“确定”时被调用，并接受输入的文本 `<br/> (text: string) => void`。<hr/>如果传入数组，则根据数组内容配置按钮。                                                 |
| type                                                       | [AlertType](alert#alerttype-ios)                | 配置文本输入框类型。                                                                                                                                                                           |
| defaultValue                                               | string                                          | 文本输入框的默认文本。                                                                                                                                                                       |
| keyboardType                                               | string                                          | 第一个文本框（如果存在）的键盘类型。取值为 TextInput 的 [keyboardTypes](textinput#keyboardtype) 中之一。                                                                                       |
| options                                                    | [AlertOptions](alert#alertoptions)              | 可选的警告配置。                                                                                                                                                                              |

---

## 类型定义

### AlertButtonStyle <div className="label ios">iOS</div>

iOS 警告按钮样式。

| 类型 |
| ---- |
| 枚举 |

**常量:**

| 值               | 描述                 |
| ---------------- | -------------------- |
| `'default'`      | 默认按钮样式         |
| `'cancel'`       | 取消按钮样式         |
| `'destructive'`  | 破坏性按钮样式       |

---

### AlertType <div className="label ios">iOS</div>

iOS 警告类型。

| 类型 |
| ---- |
| 枚举 |

**常量:**

| 值                  | 描述                     |
| ------------------- | ------------------------ |
| `'default'`         | 默认警告，无输入框         |
| `'plain-text'`      | 纯文本输入框警告           |
| `'secure-text'`     | 安全文本输入框警告         |
| `'login-password'`  | 登录和密码输入框警告       |

---

### AlertButton

描述警告中按钮配置的对象。

| 类型             |
| ---------------- |
| 对象数组         |

**对象属性:**

| 名称                                             | 类型                                           | 描述                                                                 |
| ------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------------------- |
| text                                             | string                                         | 按钮标签                                                              |
| onPress                                          | function                                       | 按钮被点击时的回调函数                                                |
| style <div className="label ios">iOS</div>       | [AlertButtonStyle](alert#alertbuttonstyle-ios) | 按钮样式，Android 上会被忽略                                         |
| isPreferred <div className="label ios">iOS</div> | boolean                                        | 是否应被强调，Android 上会被忽略                                     |

---

### AlertOptions

| 类型   |
| ------ |
| 对象   |

**属性:**

| 名称                                                    | 类型     | 描述                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| cancelable <div className="label android">Android</div> | boolean  | 是否允许点击警告框外部关闭警告                                                         |
| userInterfaceStyle <div className="label ios">iOS</div> | string   | 警告使用的界面样式，可设为 `light` 或 `dark`，否则使用系统默认样式                      |
| onDismiss <div className="label android">Android</div>  | function | 警告被关闭时触发的回调函数                                                              |