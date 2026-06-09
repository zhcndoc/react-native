---
id: activityindicator
title: ActivityIndicator
---

显示一个圆形加载指示器。

## 示例

```SnackPlayer name=ActivityIndicator%20Example
import {ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={[styles.container, styles.horizontal]}>
      <ActivityIndicator />
      <ActivityIndicator size="large" />
      <ActivityIndicator size="small" color="#0000ff" />
      <ActivityIndicator size="large" color="#00ff00" />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default App;
```

# 参考

## 属性

### [View Props](view#props)

继承 [View Props](view#props)。

---

### `animating`

是否显示指示器（`true`）或隐藏它（`false`）。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `color`

旋转指示器的前景色。

| 类型            | 默认值                                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [color](colors) | `null`（系统强调色默认颜色）<div className="label android">Android</div><hr/><ins style={{background: '#999'}} className="color-box" />`'#999999'` <div className="label ios">iOS</div> |

---

### `hidesWhenStopped` <div className="label ios">iOS</div>

指示器在不处于动画状态时是否应隐藏。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `ref`

一个 ref 设置器，在挂载时会被分配一个 [element node](element-nodes)。

---

### `size`

指示器的大小。

| 类型                                                                               | 默认值   |
| ---------------------------------------------------------------------------------- | --------- |
| enum(`'small'`, `'large'`)<hr/>number <div className="label android">Android</div> | `'small'` |
