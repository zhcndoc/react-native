---
id: platformcolor
title: 平台颜色
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```js
PlatformColor(color1, [color2, ...colorN]);
```

您可以使用 `PlatformColor` 函数，通过提供原生颜色对应的字符串值来访问目标平台上的原生颜色。您将一个字符串传递给 `PlatformColor` 函数，只要该平台上存在该颜色，它就会返回对应的原生颜色，您可以将其应用于应用程序的任何部分。

如果您向 `PlatformColor` 函数传递多个字符串值，它会将第一个值视为默认值，其余值视为回退值。

```js
PlatformColor('bogusName', 'linkColor');
```

由于原生颜色可能对主题和/或高对比度敏感，这种平台特定的逻辑也会在您的组件内部进行转换。

### 支持的颜色

有关支持的系统颜色类型的完整列表，请参阅：

- Android：
  - [R.attr](https://developer.android.com/reference/android/R.attr) - `?attr` 前缀
  - [R.color](https://developer.android.com/reference/android/R.color) - `@android:color` 前缀
- iOS（Objective-C 和 Swift 表示法）：
  - [UIColor 标准颜色](https://developer.apple.com/documentation/uikit/uicolor/standard_colors)
  - [UIColor UI 元素颜色](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

> 如果您熟悉设计系统，另一种思考方式是，`PlatformColor` 让您能够利用本地设计系统的颜色令牌，以便您的应用可以完美融合！

</TabItem>
</Tabs>

## 示例

```SnackPlayer name=PlatformColor%20Example&supportedPlatforms=android,ios
import React from 'react';
import {Platform, PlatformColor, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>I am a special label color!</Text>
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

提供给 `PlatformColor` 函数的字符串值必须与应用运行的原生平台上存在的字符串相匹配。为了避免运行时错误，该函数应该包裹在平台检查中，可以通过 `Platform.OS === 'platform'` 或 `Platform.select()` 实现，如上例所示。

> **注意：** 您可以在 [PlatformColorExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PlatformColor/PlatformColorExample.js) 中找到一个完整的示例，该示例演示了 `PlatformColor` 的正确、预期用法。
