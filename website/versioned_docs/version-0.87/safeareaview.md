---
id: safeareaview
title: '🗑️ SafeAreaView'
---

:::warning[已弃用]
请改用 [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)
:::

`SafeAreaView` 的用途是在设备的安全区域边界内渲染内容。目前仅适用于 iOS 11 或更高版本的 iOS 设备。

`SafeAreaView` 会渲染嵌套内容，并自动应用内边距，以反映视图未被导航栏、标签栏、工具栏和其他祖先视图覆盖的部分。此外，也是最重要的一点，安全区域的内边距会反映屏幕的物理限制，例如圆角或摄像头凹槽（即 iPhone 13 上的传感器外壳区域）。

## 示例

要使用它，请将顶层视图包裹在一个应用了 `flex: 1` 样式的 `SafeAreaView` 中。你可能还需要使用与应用设计相匹配的背景颜色。

```SnackPlayer name=SafeAreaView&supportedPlatforms=ios
import {StyleSheet, Text, SafeAreaView} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Page content</Text>
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

继承 [View 属性](view.md#props)。

:::note
由于该组件使用内边距来实现其行为，因此应用于 `SafeAreaView` 的样式中的内边距规则将被忽略，并且可能会导致不同平台上的结果不同。详情请参阅 [#22211](https://github.com/facebook/react-native/issues/22211)
:::
