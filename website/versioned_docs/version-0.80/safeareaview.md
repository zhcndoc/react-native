---
id: safeareaview
title: SafeAreaView
---

`SafeAreaView` 的目的是在设备的安全区域边界内渲染内容。它目前仅适用于 iOS 版本 11 或更高版本的 iOS 设备。

`SafeAreaView` 渲染嵌套内容，并自动应用内边距，以反映未被导航栏、标签栏、工具栏和其他祖先视图覆盖的视图部分。此外，最重要的是，安全区域的内边距反映了屏幕的物理限制，例如圆角或摄像头凹槽（即 iPhone 13 上的传感器外壳区域）。

## 示例

要使用它，请用 `SafeAreaView` 包裹你的顶层视图，并为其应用 `flex: 1` 样式。你可能还想使用与应用设计相匹配的背景颜色。

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

> 由于使用内边距来实现组件的行为，应用于 `SafeAreaView` 的样式中的内边距规则将被忽略，并且可能导致根据不同平台产生不同的结果。详见 [#22211](https://github.com/facebook/react-native/issues/22211)。
