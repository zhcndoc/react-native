---
id: datepickerandroid
title: '❌ DatePickerAndroid'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=datepicker) 之一。

打开标准的 Android 日期选择器对话框。

### 示例

```jsx
try {
  const {action, year, month, day} = await DatePickerAndroid.open(
    {
      // 使用 `new Date()` 获取当前日期。
      // 2020 年 5 月 25 日。月份 0 代表一月。
      date: new Date(2020, 4, 25),
    },
  );
  if (action !== DatePickerAndroid.dismissedAction) {
    // 选中的年、月 (0-11)、日
  }
} catch ({code, message}) {
  console.warn('Cannot open date picker', message);
}
```

---

# 参考

## 方法

### `open()`

```jsx
static open(options)
```

打开标准的 Android 日期选择器对话框。

`options` 对象可用的键有：

- `date`（`Date` 对象或毫秒时间戳）- 默认显示的日期
- `minDate`（`Date` 或毫秒时间戳）- 可选择的最小日期
- `maxDate`（`Date` 对象或毫秒时间戳）- 可选择的最大日期
- `mode`（`enum('calendar', 'spinner', 'default')`）- 设置日期选择器模式为 calendar/spinner/default
  - 'calendar'：以日历模式显示日期选择器。
  - 'spinner'：以滚轮模式显示日期选择器。
  - 'default'：根据 Android 版本显示默认的原生日期选择器（滚轮/日历）。

返回一个 Promise，如果用户选择了日期，该 Promise 将解析为一个包含 `action`、`year`、`month` (0-11)、`day` 的对象。如果用户关闭了对话框，Promise 仍会被解析，其中 action 为 `DatePickerAndroid.dismissedAction`，所有其他键为 undefined。**务必**在读取值之前检查 `action` 是否等于 `DatePickerAndroid.dateSetAction`。

注意，在使用 `minDate` 和 `maxDate` 选项时，原生日期选择器对话框在 Android 4 及更低版本上存在一些 UI 问题。

---

### `dateSetAction()`

```jsx
static dateSetAction()
```

已选择日期。

---

### `dismissedAction()`

```jsx
static dismissedAction()
```

对话框已关闭。
