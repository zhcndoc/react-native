---
id: platformcolor
title: PlatformColor
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```js
PlatformColor(color1, [color2, ...colorN]);
```

你可以通过提供本机颜色对应的字符串值，使用 `PlatformColor` 函数访问目标平台上的本机颜色。你需要将字符串传递给 `PlatformColor` 函数，如果该颜色存在于该平台上，它就会返回对应的本机颜色，你可以将其应用于应用的任何部分。

如果你向 `PlatformColor` 函数传递多个字符串值，它会将第一个值视为默认值，其余值视为回退值。

```js
PlatformColor('bogusName', 'linkColor');
```

由于本机颜色可能会受到主题和／或高对比度的影响，这种特定于平台的逻辑也会在组件内部进行转换。

### 支持的颜色

如需查看支持的系统颜色类型的完整列表，请参阅：

- Android：
  - [R.attr](https://developer.android.com/reference/android/R.attr) - `?attr` 前缀
  - [R.color](https://developer.android.com/reference/android/R.color) - `@android:color` 前缀
- iOS（Objective-C 和 Swift 记法）：
  - [UIColor Standard Colors](https://developer.apple.com/documentation/uikit/uicolor/standard_colors)
  - [UIColor UI Element Colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::info
如果你熟悉设计系统，换一种方式来理解就是，`PlatformColor` 允许你使用本地设计系统的颜色 token，从而让你的应用能够自然地融入其中！
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

提供给 `PlatformColor` 函数的字符串值必须与应用运行所在本机平台上的字符串相匹配。为了避免运行时错误，应当通过平台检查来封装该函数，可以使用 `Platform.OS === 'platform'` 或 `Platform.select()`，如上面的示例所示。

:::note
你可以在 [PlatformColorExample.js](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PlatformColor/PlatformColorExample.js) 中找到一个完整示例，演示 `PlatformColor` 的正确预期用法。
:::
