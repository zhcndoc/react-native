---
id: keyboard
title: 键盘
---

`Keyboard` 模块用于控制键盘事件。

### 用法

Keyboard 模块允许你监听原生事件并做出响应，同时也可以对键盘进行操作，比如收起键盘。

```SnackPlayer name=Keyboard%20Example&supportedPlatforms=ios,android
import React, {useState, useEffect} from 'react';
import {Keyboard, Text, TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const Example = () => {
  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <TextInput
          style={style.input}
          placeholder="点击这里…"
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text style={style.status}>{keyboardStatus}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 36,
  },
  input: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  status: {
    padding: 16,
    textAlign: 'center',
  },
});

export default Example;
```

---

# 参考

## 方法

### `addListener()`

```tsx
static addListener: (
  eventType: KeyboardEventName,
  listener: KeyboardEventListener,
) => EmitterSubscription;
```

`addListener` 函数用于将一个 JavaScript 函数连接到指定的原生键盘通知事件。

此函数返回监听器的引用。

**参数说明：**

| 名称                                                                     | 类型     | 说明                                                                           |
| ------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| eventName <div className="label basic two-lines required">必填</div>    | string   | 用于标识你监听事件的字符串。详见下面的事件列表。                                |
| callback <div className="label basic two-lines required">必填</div>     | function | 事件触发时调用的函数                                                           |

**`eventName`**

该参数可以是下列任意一个：

- `keyboardWillShow`
- `keyboardDidShow`
- `keyboardWillHide`
- `keyboardDidHide`
- `keyboardWillChangeFrame`
- `keyboardDidChangeFrame`

:::note
在 Android 上，仅支持 `keyboardDidShow` 和 `keyboardDidHide` 事件。如果你的 Activity 设置了 `android:windowSoftInputMode` 为 `adjustResize` 或 `adjustNothing`，且系统版本是 Android 10 或更低，则事件不会被触发。
:::

---

### `dismiss()`

```tsx
static dismiss();
```

收起当前激活的键盘并移除焦点。

---

### `scheduleLayoutAnimation`

```tsx
static scheduleLayoutAnimation(event: KeyboardEvent);
```

用于同步 TextInput（或其他键盘辅助视图）的尺寸或位置变化与键盘的移动。

---

### `isVisible()`

```tsx
static isVisible(): boolean;
```

返回键盘当前是否处于可见状态。

---

### `metrics()`

```tsx
static metrics(): KeyboardMetrics | undefined;
```

返回软键盘的尺寸信息（如果键盘可见）。