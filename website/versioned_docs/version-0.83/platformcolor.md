---
id: platformcolor
title: PlatformColor
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```js
PlatformColor(color1, [color2, ...colorN]);
```

你可以通过向 `PlatformColor` 函数传递原生颜色的对应字符串值来访问目标平台上的原生颜色。你向 `PlatformColor` 函数传入一个字符串，只要该颜色在该平台存在，它就会返回对应的原生颜色，你可以在应用的任何部分使用它。

如果你向 `PlatformColor` 函数传递多个字符串值，它会将第一个值视为默认颜色，其余的作为备用颜色。

```js
PlatformColor('bogusName', 'linkColor');
```

由于原生颜色可能会对主题和/或高对比度敏感，这些平台特定的逻辑也会在你的组件内部生效。

### 支持的颜色

有关支持的系统颜色类型的完整列表，请参见：

- Android：
  - [R.attr](https://developer.android.com/reference/android/R.attr) - `?attr` 前缀
  - [R.color](https://developer.android.com/reference/android/R.color) - `@android:color` 前缀
- iOS（Objective-C 和 Swift 表示法）：
  - [UIColor 标准颜色](https://developer.apple.com/documentation/uikit/uicolor/standard_colors)
  - [UIColor UI 元素颜色](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

#### 开发者笔记

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::info
如果你熟悉设计系统，另一种思考方式是 `PlatformColor` 让你能够利用本地设计系统的颜色标记，从而让你的应用无缝融入其中！
:::

</TabItem>
</Tabs>

## 示例

```SnackPlayer name=PlatformColor%20Example&supportedPlatforms=android,ios
import {Platform, PlatformColor, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>我是一个特殊的标签颜色！</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  label: {
    padding: 16,
    fontWeight: '800',
    ...Platform.select({
      ios: {
        color: PlatformColor('label'),
        backgroundColor: PlatformColor('systemTealColor'),
      },
      android: {
        color: PlatformColor('?android:attr/textColor'),
        backgroundColor: PlatformColor('@android:color/holo_blue_bright'),
      },
      default: {color: 'black'},
    }),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

传给 `PlatformColor` 函数的字符串值必须与运行该应用的原生平台上的字符串完全匹配。为了避免运行时错误，建议将该函数包裹在平台检查中，比如使用 `Platform.OS === 'platform'` 或 `Platform.select()`，如上面示例所示。

:::note
你可以在 [PlatformColorExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PlatformColor/PlatformColorExample.js) 找到一个完整示例，演示了 `PlatformColor` 的正确且预期的使用方法。
:::