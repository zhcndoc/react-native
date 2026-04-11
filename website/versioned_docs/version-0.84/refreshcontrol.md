---
id: refreshcontrol
title: RefreshControl
---

该组件用于 ScrollView 或 ListView 内，实现下拉刷新功能。当 ScrollView 处于 `scrollY: 0` 时，向下滑动会触发 `onRefresh` 事件。

## 示例

```SnackPlayer name=RefreshControl&supportedPlatforms=ios,android
import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text>下拉查看刷新控件指示器</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

:::note
`refreshing` 是一个受控属性，这就是为什么需要在 `onRefresh` 函数中将其设置为 `true`，否则刷新指示器会立即停止。
:::

---

# 参考

## 属性

### [View 属性](view.md#props)

继承自 [View 属性](view.md#props)。

---

### <div className="label required basic">必填</div>**`refreshing`**

是否显示正在刷新状态。

| 类型    |
| ------- |
| 布尔值 |

---

### `colors` <div className="label android">Android</div>

刷新指示器使用的颜色（至少一个）。

| 类型                         |
| ---------------------------- |
| 颜色数组 ([colors](colors.md)) |

---

### `enabled` <div className="label android">Android</div>

是否启用下拉刷新功能。

| 类型    | 默认值  |
| ------- | ------- |
| 布尔值 | `true`  |

---

### `onRefresh`

开始刷新时调用的回调。

| 类型     |
| -------- |
| 函数 |

---

### `progressBackgroundColor` <div className="label android">Android</div>

刷新指示器的背景色。

| 类型               |
| ------------------ |
| 颜色 ([color](colors.md)) |

---

### `progressViewOffset`

刷新指示器顶部的偏移量。

| 类型   | 默认值 |
| ------ | ------- |
| 数字 | `0`     |

---

### `size` <div className="label android">Android</div>

刷新指示器的大小。

| 类型                         | 默认值     |
| ---------------------------- | ----------- |
| 枚举 (`'default'`, `'large'`) | `'default'` |

---

### `tintColor` <div className="label ios">iOS</div>

刷新指示器颜色。

| 类型               |
| ------------------ |
| 颜色 ([color](colors.md)) |

---

### `title` <div className="label ios">iOS</div>

刷新指示器下方显示的标题。

| 类型   |
| ------ |
| 字符串 |

---

### `titleColor` <div className="label ios">iOS</div>

刷新指示器标题的颜色。

| 类型               |
| ------------------ |
| 颜色 ([color](colors.md)) |
