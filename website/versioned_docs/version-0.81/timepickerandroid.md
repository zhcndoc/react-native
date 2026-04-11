---
id: timepickerandroid
title: '❌ TimePickerAndroid'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=timepicker) 之一。

打开标准的 Android 时间选择器对话框。

### 示例

```jsx
try {
  const {action, hour, minute} = await TimePickerAndroid.open({
    hour: 14,
    minute: 0,
    is24Hour: false, // 将显示 '2 PM'
  });
  if (action !== TimePickerAndroid.dismissedAction) {
    // 选中的小时 (0-23), 分钟 (0-59)
  }
} catch ({code, message}) {
  console.warn('Cannot open time picker', message);
}
```

---

# 参考

## 方法

### `open()`

```jsx
static open(options)
```

打开标准的 Android 时间选择器对话框。

`options` 对象可用的键有：

- `hour` (0-23) - 要显示的小时，默认为当前时间
- `minute` (0-59) - 要显示的分钟，默认为当前时间
- `is24Hour` (boolean) - 如果为 `true`，选择器使用 24 小时格式。如果为 `false`，选择器显示上午/下午选择器。如果为 undefined，则使用当前区域设置的默认值。
- `mode` (`enum('clock', 'spinner', 'default')`) - 设置时间选择器模式
  - 'clock': 以时钟模式显示时间选择器。
  - 'spinner': 以滚轮模式显示时间选择器。
  - 'default': 基于 Android 版本显示默认时间选择器。

返回一个 Promise，如果用户选择了时间，它将解析为一个包含 `action`、`hour` (0-23)、`minute` (0-59) 的对象。如果用户关闭了对话框，Promise 仍会被解决，action 为 `TimePickerAndroid.dismissedAction`，所有其他键为 undefined。在读取值之前，**始终**检查 `action`。

---

### `timeSetAction()`

```jsx
static timeSetAction()
```

已选择一个时间。

---

### `dismissedAction()`

```jsx
static dismissedAction()
```

对话框已关闭。
