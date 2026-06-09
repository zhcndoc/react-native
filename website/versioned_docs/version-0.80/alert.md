---
id: alert
title: Alert
---

启动一个带有指定标题和消息的警报对话框。

可选地提供按钮列表。点击任何按钮将触发相应的 onPress 回调并关闭警报。默认情况下，唯一的按钮将是 'OK' 按钮。

这是一个同时在 Android 和 iOS 上工作的 API，可以显示静态警报。提示用户输入某些信息的警报仅在 iOS 上可用。

## 示例

```SnackPlayer name=Alert%20Example&supportedPlatforms=ios,android
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const createTwoButtonAlert = () =>
    Alert.alert('警报标题', '我的警报消息', [
      {
        text: '取消',
        onPress: () => console.log('已按下取消'),
        style: 'cancel',
      },
      {text: '确定', onPress: () => console.log('已按下确定')},
    ]);

  const createThreeButtonAlert = () =>
    Alert.alert('警报标题', '我的警报消息', [
      {
        text: '稍后再问我',
        onPress: () => console.log('稍后再问我已按下'),
      },
      {
        text: '取消',
        onPress: () => console.log('已按下取消'),
        style: 'cancel',
      },
      {text: '确定', onPress: () => console.log('已按下确定')},
    ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button title={'2 按钮警报'} onPress={createTwoButtonAlert} />
        <Button title={'3 按钮警报'} onPress={createThreeButtonAlert} />
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

在 iOS 上，你可以指定任意数量的按钮。每个按钮可以可选地指定样式或被强调，可用选项由 [AlertButtonStyle](#alertbuttonstyle-ios) 枚举和 [AlertButton](alert#alertbutton) 上的 `isPreferred` 字段表示。

## Android

在 Android 上，最多可以指定三个按钮。Android 有中性、负面和正面按钮的概念：

- 如果你指定一个按钮，它将是 'positive' 按钮（例如 'OK'）
- 两个按钮意味着 'negative', 'positive'（例如 'Cancel', 'OK'）
- 三个按钮意味着 'neutral', 'negative', 'positive'（例如 'Later', 'Cancel', 'OK'）

Android 上的警报可以通过点击警报框外部来关闭。默认情况下它是禁用的，可以通过提供可选的 [AlertOptions](alert#alertoptions) 参数并将 cancelable 属性设置为 `true` 来启用，即<br/>`{cancelable: true}`。

可以通过在 `options` 参数中提供 `onDismiss` 回调属性来处理取消事件。

### 示例 <div className="label android">Android</div>

```SnackPlayer name=Alert%20Android%20Dissmissable%20Example&supportedPlatforms=android
import {StyleSheet, Button, Alert} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const showAlert = () =>
  Alert.alert(
    '警报标题',
    '我的警报消息',
    [
      {
        text: '取消',
        onPress: () => Alert.alert('已按下取消'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          '通过点击警报对话框外部关闭了此警报。',
        ),
    },
  );

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Button title="显示警报" onPress={showAlert} />
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

| 名称                                                       | 类型                               | 描述                                                             |
| ---------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| title <div className="label basic required">必需</div> | string                             | 对话框的标题。传递 `null` 或空字符串将隐藏标题。 |
| message                                                    | string                             | 出现在对话框标题下方的可选消息。              |
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

创建并显示一个提示框以输入一些文本形式的警报。

**参数：**

| 名称                                                       | 类型                                            | 描述                                                                                                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title <div className="label basic required">必需</div> | string                                          | 对话框的标题。                                                                                                                                                                                   |
| message                                                    | string                                          | 出现在文本输入框上方的可选消息。                                                                                                                                                |
| callbackOrButtons                                          | function<hr/>[AlertButton](alert#alertButton)[] | 如果传递的是函数，当用户点击 'OK' 时，它将使用提示框的值被调用<br/>`(text: string) => void`。<hr/>如果传递的是数组，按钮将根据数组内容进行配置。 |
| type                                                       | [AlertType](alert#alerttype-ios)                | 这配置了文本输入。                                                                                                                                                                       |
| defaultValue                                               | string                                          | 文本输入中的默认文本。                                                                                                                                                                       |
| keyboardType                                               | string                                          | 第一个文本字段（如果存在）的键盘类型。TextInput [keyboardTypes](textinput#keyboardtype) 之一。                                                                                          |
| options                                                    | [AlertOptions](alert#alertoptions)              | 可选的 Alert 配置。                                                                                                                                                                      |

---

## 类型定义

### AlertButtonStyle <div className="label ios">iOS</div>

一个 iOS 警报按钮样式。

| 类型 |
| ---- |
| enum |

**常量：**

| 值           | 描述               |
| --------------- | ------------------------- |
| `'default'`     | 默认按钮样式。     |
| `'cancel'`      | 取消按钮样式。      |
| `'destructive'` | 破坏性按钮样式。 |

---

### AlertType <div className="label ios">iOS</div>

一个 iOS 警报类型。

| 类型 |
| ---- |
| enum |

**常量：**

| 值              | 描述                  |
| ------------------ | ---------------------------- |
| `'default'`        | 默认警报，无输入 |
| `'plain-text'`     | 纯文本输入警报       |
| `'secure-text'`    | 安全文本输入警报      |
| `'login-password'` | 登录和密码警报     |

---

### AlertButton

一个描述警报中按钮配置的对象。

| 类型             |
| ---------------- |
| 对象数组 |

**对象属性：**

| 名称                                             | 类型                                           | 描述                                                                    |
| ------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| text                                             | string                                         | 按钮标签。                                                                  |
| onPress                                          | function                                       | 按钮被按下时的回调函数。                                      |
| style <div className="label ios">iOS</div>       | [AlertButtonStyle](alert#alertbuttonstyle-ios) | 按钮样式，在 Android 上此属性将被忽略。                        |
| isPreferred <div className="label ios">iOS</div> | boolean                                        | 按钮是否应被强调，在 Android 上此属性将被忽略。 |

---

### AlertOptions

| 类型   |
| ------ |
| object |

**属性：**

| 名称                                                    | 类型     | 描述                                                                                                               |
| ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| cancelable <div className="label android">Android</div> | boolean  | 定义是否可以通过点击警报框外部来关闭警报。                                                    |
| userInterfaceStyle <div className="label ios">iOS</div> | string   | 用于警报的界面样式，可以设置为 `light` 或 `dark`，否则将使用默认系统样式。 |
| onDismiss <div className="label android">Android</div>  | function | 警报被关闭时触发的回调函数。                                                                    |
