---
id: platformcolor
title: PlatformColor
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```js
PlatformColor(color1, [color2, ...colorN]);
```

您可以通过提供原生颜色对应的字符串值，使用 `PlatformColor` 函数访问目标平台上的原生颜色。您将字符串传递给 `PlatformColor` 函数，如果该平台上存在该颜色，它将返回相应的原生颜色，您可以在应用程序的任何部分使用它。

如果您向 `PlatformColor` 函数传递多个字符串值，它会将第一个值视为默认值，其余值视为回退值。

```js
PlatformColor('bogusName', 'linkColor');
```

由于原生颜色可能会对主题和/或高对比度敏感，这种特定于平台的逻辑也会在组件内部生效。

### 支持的颜色

有关支持的系统颜色类型完整列表，请参阅：

- Android：
  - [R.attr](https://developer.android.com/reference/android/R.attr) - `?attr` 前缀
  - [R.color](https://developer.android.com/reference/android/R.color) - `@android:color` 前缀
- iOS（Objective-C 和 Swift 记法）：
  - [UIColor Standard Colors](https://developer.apple.com/documentation/uikit/uicolor/standard_colors)
  - [UIColor UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

#### 开发者注释

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::info
如果您熟悉设计系统，可以这样理解：`PlatformColor` 让您能够接入本地设计系统的颜色令牌，因此您的应用可以自然融入其中！
:::

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

传递给 `PlatformColor` 函数的字符串值必须与应用运行所在原生平台上的字符串完全一致。为避免运行时错误，应该通过平台检查来包装该函数，如上面的示例所示，可以使用 `Platform.OS === 'platform'` 或 `Platform.select()`。

:::note
您可以在 [PlatformColorExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PlatformColor/PlatformColorExample.js) 中找到一个演示 `PlatformColor` 正确且预期用法的完整示例。
:::
