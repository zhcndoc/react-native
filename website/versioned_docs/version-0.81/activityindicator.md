---
id: activityindicator
title: ActivityIndicator
---

显示一个圆形加载指示器。

## 示例

```SnackPlayer name=ActivityIndicator%20Example
import React from 'react';
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

### [View 属性](view#props)

继承 [View 属性](view#props)。

---

### `animating`

是否显示指示器 (`true`) 或隐藏它 (`false`)。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `color`

旋转指示器的前景色。

| 类型            | 默认值                                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [颜色](colors) | `null` (系统强调色默认颜色)<div className="label android">Android</div><hr/><ins style={{background: '#999'}} className="color-box" />`'#999999'` <div className="label ios">iOS</div> |

---

### `hidesWhenStopped` <div className="label ios">iOS</div>

当停止动画时是否隐藏指示器。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `size`

指示器的大小。

| 类型                                                                               | 默认值   |
| ---------------------------------------------------------------------------------- | --------- |
| 枚举 (`'small'`, `'large'`)<hr/>数字 <div className="label android">Android</div> | `'small'` |
