---
id: safeareaview
title: '🗑️ SafeAreaView'
---

:::warning[已弃用]
请改用 [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)。
:::

`SafeAreaView` 的目的是在设备的安全区域边界内渲染内容。它目前仅适用于 iOS 11 及以上版本的 iOS 设备。

`SafeAreaView` 渲染嵌套内容并自动应用内边距，以反映导航栏、标签栏、工具栏及其他父视图未覆盖的视图部分。更重要的是，安全区域的内边距反映了屏幕的物理限制，例如圆角或摄像头缺口（即 iPhone 13 上的传感器区域）。

## 示例

使用时，将你的顶级视图用一个带有 `flex: 1` 样式的 `SafeAreaView` 包裹起来。你可能还想使用与应用设计相匹配的背景颜色。

```SnackPlayer name=SafeAreaView&supportedPlatforms=ios
import {StyleSheet, Text, SafeAreaView} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>页面内容</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;
```

---

# 参考

## 属性

### [View 属性](view.md#props)

继承自 [View 属性](view.md#props)。

:::note
由于该组件通过内边距实现其行为，应用于 `SafeAreaView` 的样式中的内边距规则将被忽略，并且可能因平台不同而导致不同结果。详情请参见 [#22211](https://github.com/facebook/react-native/issues/22211)。
:::