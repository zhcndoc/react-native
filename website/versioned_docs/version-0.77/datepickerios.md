---
id: datepickerios
title: '❌ DatePickerIOS'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=datepicker) 之一。

使用 `DatePickerIOS` 在 iOS 上渲染日期/时间选择器（selector）。这是一个受控组件，因此你必须挂钩 `onDateChange` 回调并更新 `date` 属性，以便组件更新，否则用户的更改将立即还原，以反映 `props.date` 作为真实来源。

### 示例

```SnackPlayer name=DatePickerIOS&supportedPlatforms=ios&disableLinting=true
import React, {useState} from 'react';
import {DatePickerIOS, View, StyleSheet} from 'react-native';

const App = () => {
  const [chosenDate, setChosenDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <DatePickerIOS date={chosenDate} onDateChange={setChosenDate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
```

---

# 参考

## 属性

继承 [View 属性](view.md#props)。

### `date`

当前选中的日期。

| 类型 | 必填 |
| ---- | -------- |
| Date | 是      |

---

### `onChange`

日期更改处理程序。

当用户在 UI 中更改日期或时间时调用此函数。第一个且唯一的参数是一个事件。若要获取选择器更改后的日期，请改用 onDateChange。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onDateChange`

日期更改处理程序。

当用户在 UI 中更改日期或时间时调用此函数。第一个且唯一的参数是一个 Date 对象，代表新的日期和时间。

| 类型     | 必填 |
| -------- | -------- |
| function | 是      |

---

### `maximumDate`

最大日期。

限制可能的日期/时间值范围。

| 类型 | 必填 |
| ---- | -------- |
| Date | 否       |

设置 `maximumDate` 为 2017 年 12 月 31 日的示例：

<center><img src="/docs/assets/DatePickerIOS/maximumDate.gif" width="360"></img></center>

---

### `minimumDate`

最小日期。

限制可能的日期/时间值范围。

| 类型 | 必填 |
| ---- | -------- |
| Date | 否       |

参见 [`maximumDate`](#maximumdate) 获取示例图片。

---

### `minuteInterval`

可选择分钟的间隔。

| 类型                                       | 必填 |
| ------------------------------------------ | -------- |
| enum(1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30) | 否       |

设置 `minuteInterval` 为 `10` 的示例：

<center><img src="/docs/assets/DatePickerIOS/minuteInterval.png" width="360"></img></center>

---

### `mode`

日期选择器模式。

| 类型                                          | 必填 |
| --------------------------------------------- | -------- |
| enum('date', 'time', 'datetime', 'countdown') | 否       |

设置 `mode` 为 `date`、`time` 和 `datetime` 的示例：![](/docs/assets/DatePickerIOS/mode.png)

---

### `locale`

日期选择器的区域设置。值需要是一个 [Locale ID](https://developer.apple.com/library/content/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html)。

| 类型   | 必填 |
| ------ | -------- |
| String | 否       |

---

### `timeZoneOffsetInMinutes`

时区偏移量（分钟）。

默认情况下，日期选择器将使用设备的时区。使用此参数，可以强制特定的时区偏移。例如，要显示太平洋标准时间，传递 -7 \* 60。

| 类型   | 必填 |
| ------ | -------- |
| number | 否       |

---

### `initialDate`

提供一个初始值，当用户开始选择日期时该值会更改。它适用于你不想处理监听事件和更新 date 属性以保持受控状态同步的用例。受控状态存在已知缺陷，会导致其与原生不同步。`initialDate` 属性旨在允许你将原生作为真实来源。

| 类型 | 必填 |
| ---- | -------- |
| Date | 否       |
