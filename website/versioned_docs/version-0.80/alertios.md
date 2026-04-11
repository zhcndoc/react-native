---
id: alertios
title: '❌ AlertIOS'
---

> **已移除。** 请使用 [`Alert`](alert) 代替。

`AlertIOS` 提供创建 iOS 警报对话框或创建用户输入提示的功能。

创建 iOS 警报：

```jsx
AlertIOS.alert(
  'Sync Complete',
  'All your data are belong to us.',
);
```

创建 iOS 提示框：

```jsx
AlertIOS.prompt('Enter a value', null, text =>
  console.log('You entered ' + text),
);
```

如果您不需要创建仅限 iOS 的提示框，我们建议使用 [`Alert.alert`](alert) 方法以获得跨平台支持。

---

# 参考

## 方法

### `alert()`

```jsx
static alert(title: string, [message]: string, [callbackOrButtons]: ?(() => void), ButtonsArray, [type]: AlertType): [object Object]
```

创建并显示弹出警报。

**参数：**

| 名称              | 类型                                                | 必需 | 描述                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title             | string                                              | 是      | 对话框的标题。传递 null 或 '' 将隐藏标题。                                                                                                                                                                                                                                                                                                      |
| message           | string                                              | 否       | 出现在对话框标题下方的可选消息。                                                                                                                                                                                                                                                                                                       |
| callbackOrButtons | ?(() => void),[ButtonsArray](alertios#buttonsarray) | 否       | 此可选参数应为单参数函数或按钮数组。如果传递函数，当用户点击 'OK' 时将调用它。如果传递按钮配置数组，每个按钮应包含 `text` 键，以及可选的 `onPress` 和 `style` 键。`style` 应为 'default'、'cancel' 或 'destructive' 之一。 |
| type              | [AlertType](alertios#alerttype)                     | 否       | 已弃用，请勿使用。                                                                                                                                                                                                                                                                                                                                          |

自定义按钮示例：

```jsx
AlertIOS.alert(
  'Update available',
  'Keep your app up to date to enjoy the latest features',
  [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Install',
      onPress: () => console.log('Install Pressed'),
    },
  ],
);
```

---

### `prompt()`

```jsx
static prompt(title: string, [message]: string, [callbackOrButtons]: ?((text: string) => void), ButtonsArray, [type]: AlertType, [defaultValue]: string, [keyboardType]: string): [object Object]
```

创建并显示提示框以输入文本。

**参数：**

| 名称              | 类型                                                            | 必需 | 描述                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title             | string                                                          | 是      | 对话框的标题。                                                                                                                                                                                                                                                                                                                                                                                    |
| message           | string                                                          | 否       | 出现在文本输入框上方的可选消息。                                                                                                                                                                                                                                                                                                                                                 |
| callbackOrButtons | ?((text: string) => void),[ButtonsArray](alertios#buttonsarray) | 否       | 此可选参数应为单参数函数或按钮数组。如果传递函数，当用户点击 'OK' 时将使用提示框的值调用它。如果传递按钮配置数组，每个按钮应包含 `text` 键，以及可选的 `onPress` 和 `style` 键（参见示例）。`style` 应为 'default'、'cancel' 或 'destructive' 之一。 |
| type              | [AlertType](alertios#alerttype)                                 | 否       | 配置文本输入。'plain-text'、'secure-text' 或 'login-password' 之一。                                                                                                                                                                                                                                                                                                                |
| defaultValue      | string                                                          | 否       | 文本输入框中的默认文本。                                                                                                                                                                                                                                                                                                                                                                        |
| keyboardType      | string                                                          | 否       | 第一个文本字段（如果存在）的键盘类型。'default'、'email-address'、'numeric'、'phone-pad'、'ascii-capable'、'numbers-and-punctuation'、'url'、'number-pad'、'name-phone-pad'、'decimal-pad'、'twitter' 或 'web-search' 之一。                                                                                                                                                              |

自定义按钮示例：

```jsx
AlertIOS.prompt(
  'Enter password',
  'Enter your password to claim your $1.5B in lottery winnings',
  [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: password =>
        console.log('OK Pressed, password: ' + password),
    },
  ],
  'secure-text',
);
```

,

默认按钮和自定义回调示例：

```jsx
AlertIOS.prompt(
  'Update username',
  null,
  text => console.log('Your username is ' + text),
  null,
  'default',
);
```

## 类型定义

### AlertType

警报按钮类型

| 类型  |
| ----- |
| $Enum |

**常量：**

| 值          | 描述                  |
| -------------- | ---------------------------- |
| default        | 无输入的经典警报 |
| plain-text     | 纯文本输入警报       |
| secure-text    | 安全文本输入警报      |
| login-password | 登录和密码警报     |

---

### AlertButtonStyle

警报按钮样式

| 类型  |
| ----- |
| $Enum |

**常量：**

| 值       | 描述              |
| ----------- | ------------------------ |
| default     | 默认按钮样式     |
| cancel      | 取消按钮样式      |
| destructive | 破坏性按钮样式 |

---

### ButtonsArray

按钮数组

| 类型  |
| ----- |
| Array |

**属性：**

| 名称      | 类型                                          | 描述                           |
| --------- | --------------------------------------------- | ------------------------------------- |
| [text]    | string                                        | 按钮标签                          |
| [onPress] | function                                      | 按钮按下时的回调函数 |
| [style]   | [AlertButtonStyle](alertios#alertbuttonstyle) | 按钮样式                          |

**常量：**

| 值   | 描述                           |
| ------- | ------------------------------------- |
| text    | 按钮标签                          |
| onPress | 按钮按下时的回调函数 |
| style   | 按钮样式                          |
