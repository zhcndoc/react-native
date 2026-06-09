---
id: refreshcontrol
title: RefreshControl
---

此组件用于在 `ScrollView` 或 `ListView` 中添加下拉刷新功能。当 `ScrollView` 处于 `scrollY: 0` 时，向下滑动会触发 `onRefresh` 事件。

## 示例

```SnackPlayer name=RefreshControl&supportedPlatforms=ios,android
import {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
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
          <Text>下拉查看 RefreshControl 指示器</Text>
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
`refreshing` 是一个受控属性，因此需要在 `onRefresh` 函数中将其设为 `true`，否则刷新指示器会立即停止。
:::

---

# 参考

## 属性

### [View Props](view.md#props)

继承 [View Props](view.md#props)。

---

### <div className="label required basic">必填</div>**`refreshing`**

视图是否应显示正在刷新的状态。

| 类型    |
| ------- |
| boolean |

---

### `colors` <div className="label android">Android</div>

用于绘制刷新指示器的颜色（至少一种）。

| 类型                         |
| ---------------------------- |
| [color](colors.md) 数组 |

---

### `enabled` <div className="label android">Android</div>

是否启用下拉刷新功能。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `onRefresh`

当视图开始刷新时调用。

| 类型     |
| -------- |
| function |

---

### `progressBackgroundColor` <div className="label android">Android</div>

刷新指示器的背景颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `progressViewOffset`

进度视图顶部偏移量。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |

---

### `size` <div className="label android">Android</div>

刷新指示器的大小。

| 类型                         | 默认值      |
| ---------------------------- | ----------- |
| enum(`'default'`, `'large'`) | `'default'` |

---

### `tintColor` <div className="label ios">iOS</div>

刷新指示器的颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `title` <div className="label ios">iOS</div>

显示在刷新指示器下方的标题。

| 类型   |
| ------ |
| string |

---

### `titleColor` <div className="label ios">iOS</div>

刷新指示器标题的颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |
