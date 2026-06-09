---
id: keyboard
title: 键盘
---

`Keyboard` 模块用于控制键盘事件。

### 用法

Keyboard 模块允许你监听原生事件并对其作出响应，同时也可以对键盘进行更改，例如将其收起。

```SnackPlayer name=Keyboard%20Example&supportedPlatforms=ios,android
import {useState, useEffect} from 'react';
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
          placeholder="Click here…"
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

`addListener` 函数会将一个 JavaScript 函数连接到一个已识别的原生键盘通知事件。

然后该函数会返回监听器的引用。

**参数：**

| Name                                                                     | Type     | Description                                                                    |
| ------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| eventName <div className="label basic two-lines required">Required</div> | string   | 标识你正在监听的事件的字符串。请参见下面的列表。 |
| callback <div className="label basic two-lines required">Required</div>  | function | 当事件触发时要调用的函数                                 |

**`eventName`**

这可以是以下任意一种：

- `keyboardWillShow`
- `keyboardDidShow`
- `keyboardWillHide`
- `keyboardDidHide`
- `keyboardWillChangeFrame`
- `keyboardDidChangeFrame`

:::note
只有 `keyboardDidShow` 和 `keyboardDidHide` 事件在 Android 上可用。如果你的 activity 将 `android:windowSoftInputMode` 设置为 `adjustResize` 或 `adjustNothing`，在 Android 10 或更低版本上，这些事件将不会触发。
:::

---

### `dismiss()`

```tsx
static dismiss();
```

关闭活动键盘并移除焦点。

---

### `scheduleLayoutAnimation`

```tsx
static scheduleLayoutAnimation(event: KeyboardEvent);
```

用于将 TextInput（或其他键盘辅助视图）的大小或位置变化与键盘移动同步。

---

### `isVisible()`

```tsx
static isVisible(): boolean;
```

键盘最后一次已知是否可见。

---

### `metrics()`

```tsx
static metrics(): KeyboardMetrics | undefined;
```

如果软键盘可见，则返回其度量信息。
