---
id: progressbarandroid
title: '🗑️ 进度条 Android'
---

:::warning[已弃用]
请改用 [社区包](https://reactnative.directory/?search=progressbar) 之一。
:::

仅限 Android 的 React 组件，用于指示应用正在加载或有活动进行中。

### 示例

```SnackPlayer name=ProgressBarAndroid&supportedPlatforms=android
import {View, StyleSheet, ProgressBarAndroid, Text} from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.example}>
        <Text>圆形进度指示器</Text>
        <ProgressBarAndroid />
      </View>
      <View style={styles.example}>
        <Text>水平进度指示器</Text>
        <ProgressBarAndroid styleAttr="Horizontal" />
      </View>
      <View style={styles.example}>
        <Text>彩色进度指示器</Text>
        <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
      </View>
      <View style={styles.example}>
        <Text>固定进度值</Text>
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

继承自 [View Props](view.md#props)。

### `animating`

是否显示进度条（true，默认）或隐藏（false）。

| 类型   | 必填 |
| ------ | ---- |
| bool   | 否   |

---

### `color`

进度条的颜色。

| 类型           | 必填 |
| -------------- | ---- |
| [color](colors.md) | 否   |

---

### `indeterminate`

进度条是否显示不确定进度。注意，只有当 styleAttr 为 Horizontal 时此属性可设为 false，且需要一个 `progress` 值。

| 类型               | 必填 |
| ------------------ | ---- |
| indeterminateType  | 否   |

---

### `progress`

进度值（介于 0 和 1 之间）。

| 类型     | 必填 |
| -------- | ---- |
| number   | 否   |

---

### `styleAttr`

进度条的样式。可选值：

- Horizontal（水平方向）
- Normal（默认）
- Small（小号）
- Large（大号）
- Inverse（反向）
- SmallInverse（小号反向）
- LargeInverse（大号反向）

| 类型                                                                                        | 必填 |
| ------------------------------------------------------------------------------------------- | ---- |
| enum('Horizontal', 'Normal', 'Small', 'Large', 'Inverse', 'SmallInverse', 'LargeInverse')   | 否   |

---

### `testID`

用于在端对端测试中定位此视图。

| 类型   | 必填 |
| ------ | ---- |
| string | 否   |
