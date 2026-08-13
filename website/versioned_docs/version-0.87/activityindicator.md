---
id: activityindicator
title: ActivityIndicator
---

显示圆形加载指示器。

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

## Props

### [View Props](view#props)

继承 [View Props](view#props)。

---

### `animating`

是否显示指示器（`true`）或将其隐藏（`false`）。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `color`

加载指示器的前景色。

| 类型            | 默认值                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [color](colors) | `null`（系统强调色默认颜色）<div className="label android">Android</div><hr/><ins style={{background: '#999'}} className="color-box" />`'#999999'` <div className="label ios">iOS</div> |

---

### `hidesWhenStopped` <div className="label ios">iOS</div>

是否应在不执行动画时隐藏指示器。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `ref`

挂载时将分配一个 [元素节点](element-nodes) 的 ref 设置器。

---

### `size`

指示器的大小。

| 类型                                                                               | 默认值    |
| ---------------------------------------------------------------------------------- | --------- |
| enum(`'small'`, `'large'`)<hr/>number <div className="label android">Android</div> | `'small'` |
