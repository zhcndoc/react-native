---
id: progressbarandroid
title: '🗑️ ProgressBarAndroid'
---

> **已弃用。** 请使用 [社区包](https://reactnative.directory/?search=progressbar) 之一代替。

仅适用于 Android 的 React 组件，用于指示应用正在加载或应用中存在一些活动。

### 示例

```SnackPlayer name=ProgressBarAndroid&supportedPlatforms=android
import React from 'react';
import {View, StyleSheet, ProgressBarAndroid, Text} from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.example}>
        <Text>Circle Progress Indicator</Text>
        <ProgressBarAndroid />
      </View>
      <View style={styles.example}>
        <Text>Horizontal Progress Indicator</Text>
        <ProgressBarAndroid styleAttr="Horizontal" />
      </View>
      <View style={styles.example}>
        <Text>Colored Progress Indicator</Text>
        <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
      </View>
      <View style={styles.example}>
        <Text>Fixed Progress Value</Text>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={0.5}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  example: {
    marginVertical: 24,
  },
});

export default App;
```

---

# 参考

## 属性

继承 [View 属性](view.md#props)。

### `animating`

是否显示 ProgressBar（true，默认值）或隐藏它（false）。

| 类型 | 必填 |
| ---- | -------- |
| bool | 否       |

---

### `color`

进度条的颜色。

| 类型               | 必填 |
| ------------------ | -------- |
| [颜色](colors.md) | 否       |

---

### `indeterminate`

进度条是否显示不确定进度。注意，仅当 styleAttr 为 Horizontal 时此值才可为 false，并且需要 `progress` 值。

| 类型              | 必填 |
| ----------------- | -------- |
| indeterminateType | 否       |

---

### `progress`

进度值（介于 0 和 1 之间）。

| 类型   | 必填 |
| ------ | -------- |
| number | 否       |

---

### `styleAttr`

ProgressBar 的样式。其中之一：

- Horizontal
- Normal（默认）
- Small
- Large
- Inverse
- SmallInverse
- LargeInverse

| 类型                                                                                      | 必填 |
| ----------------------------------------------------------------------------------------- | -------- |
| enum('Horizontal', 'Normal', 'Small', 'Large', 'Inverse', 'SmallInverse', 'LargeInverse') | 否       |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   | 必填 |
| ------ | -------- |
| string | 否       |
