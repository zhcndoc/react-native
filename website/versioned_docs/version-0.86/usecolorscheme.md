---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` 这个 React Hook 提供并订阅来自 [`Appearance`](appearance) 模块的颜色方案更新。返回值表示当前激活的颜色方案。该值可能会在之后更新，例如通过直接的用户操作（如设备设置中的主题选择，或通过 [`setColorScheme`](appearance#setcolorscheme) 由应用级别选择的用户界面样式）或按照计划更新（如遵循昼夜周期的浅色和深色主题）。

### 返回值

- `'light'`：应用浅色配色方案。
- `'dark'`：应用深色配色方案。
- `'unspecified'`：**_从未返回_**（类型标注错误）。
- `null`：如果原生 Appearance 模块不可用，则可能返回。

---

## 示例

```SnackPlayer
import React from 'react';
import {Text, StyleSheet, useColorScheme} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>useColorScheme(): {colorScheme}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

你可以在 [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js) 中找到一个完整示例，演示如何将此 Hook 与 React Context 结合使用，为你的应用添加对浅色和深色主题的支持。
