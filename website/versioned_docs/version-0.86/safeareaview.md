---
id: safeareaview
title: '🗑️ SafeAreaView'
---

:::warning 已弃用
请改用 [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)。
:::

`SafeAreaView` 的作用是在设备的安全区域边界内渲染内容。目前它仅适用于 iOS 11 或更高版本的 iOS 设备。

`SafeAreaView` 会渲染嵌套内容，并自动应用内边距，以反映未被导航栏、标签栏、工具栏以及其他祖先视图遮挡的那部分视图区域。此外，也是最重要的一点，安全区域的内边距反映了屏幕的物理限制，例如圆角或摄像头刘海（即 iPhone 13 上的传感器区域）。

## 示例

使用时，请将顶层视图用一个应用了 `flex: 1` 样式的 `SafeAreaView` 包裹起来。你也可以使用与应用设计相匹配的背景颜色。

```SnackPlayer name=SafeAreaView&supportedPlatforms=ios
import React from 'react';
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

### [View Props](view.md#props)

继承 [View Props](view.md#props)。

:::note
由于该组件使用内边距来实现其行为，因此应用到 `SafeAreaView` 的样式中的 padding 规则会被忽略，并且可能会因平台不同而导致不同的结果。详情请参见 [#22211](https://github.com/facebook/react-native/issues/22211)。
:::
