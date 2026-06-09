---
id: segmentedcontrolios
title: '❌ 分段控制器 iOS'
---

> **已从 React Native 中移除。** 请改用 [社区包](https://reactnative.directory/?search=segmentedcontrol) 之一。

使用 `SegmentedControlIOS` 来渲染 iOS 的 UISegmentedControl。

#### 以编程方式更改选中索引

可以通过将 selectedIndex prop 赋值给状态变量，然后更改该变量来动态更改选中索引。请注意，当用户选择一个值并更改索引时，需要更新状态变量，如下例所示。

## 示例

```SnackPlayer name=SegmentedControlIOS%20Example&supportedPlatforms=ios&ext=js
import {useState} from 'react';
import {SegmentedControlIOS, StyleSheet, Text, View} from 'react-native';

const App = () => {
  const [index, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <SegmentedControlIOS
        values={['One', 'Two']}
        selectedIndex={index}
        onChange={event => {
          setIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      <Text style={styles.text}>选中的索引：{index}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  text: {
    marginTop: 24,
  },
});

export default App;
```

---

# 参考

## 属性

继承 [View 属性](view.md#props)。

### `enabled`

如果为 false，用户将无法与控制交互。默认值为 true。

| 类型 | 必填 |
| ---- | -------- |
| bool | 否       |

---

### `momentary`

如果为 true，则选择段不会在视觉上持久化。`onValueChange` 回调仍将按预期工作。

| 类型 | 必填 |
| ---- | -------- |
| bool | 否       |

---

### `onChange`

当用户点击段时调用的回调；将事件作为参数传递

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `onValueChange`

当用户点击段时调用的回调；将段的值作为参数传递

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `selectedIndex`

要被（预）选中的段在 `props.values` 中的索引。

| 类型   | 必填 |
| ------ | -------- |
| number | 否       |

---

### `tintColor`

> **注意：** `tintColor` 在 iOS 13+ 上不受支持。

控件的强调色。

| 类型   | 必填 |
| ------ | -------- |
| string | 否       |

---

### `values`

控件段按钮的标签，按顺序排列。

| 类型            | 必填 |
| --------------- | -------- |
| string 数组      | 否       |
