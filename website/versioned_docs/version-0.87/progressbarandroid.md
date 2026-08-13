---
id: progressbarandroid
title: '🗑️ ProgressBarAndroid'
---

:::warning[已弃用]
请改用[社区软件包](https://reactnative.directory/?search=progressbar)。
:::

仅限 Android 的 React 组件，用于指示应用正在加载或应用中正在进行某些活动。

### 示例

```SnackPlayer name=ProgressBarAndroid&supportedPlatforms=android
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

是否显示 ProgressBar（true，默认值）或将其隐藏（false）。

| Type | Required |
| ---- | -------- |
| bool | No       |

---

### `color`

进度条的颜色。

| Type               | Required |
| ------------------ | -------- |
| [color](colors.md) | No       |

---

### `indeterminate`

进度条是否显示不确定进度。请注意，只有当 styleAttr 为 Horizontal 时，此属性才能为 false，并且需要提供 `progress` 值。

| Type              | Required |
| ----------------- | -------- |
| indeterminateType | No       |

---

### `progress`

进度值（介于 0 和 1 之间）。

| Type   | Required |
| ------ | -------- |
| number | No       |

---

### `styleAttr`

ProgressBar 的样式。可选值包括：

- Horizontal
- Normal（默认）
- Small
- Large
- Inverse
- SmallInverse
- LargeInverse

| Type                                                                                      | Required |
| ----------------------------------------------------------------------------------------- | -------- |
| enum('Horizontal', 'Normal', 'Small', 'Large', 'Inverse', 'SmallInverse', 'LargeInverse') | No       |

---

### `testID`

用于在端到端测试中定位此视图。

| Type   | Required |
| ------ | -------- |
| string | No       |
