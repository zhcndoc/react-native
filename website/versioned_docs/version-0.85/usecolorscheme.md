---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` 这个 React 钩子提供并订阅来自 [`Appearance`](appearance) 模块的配色方案更新。返回值表示当前激活的配色方案。该值可能会在之后更新，方式可以是直接由用户操作（例如在设备设置中选择主题，或通过 [`setColorScheme`](appearance#setcolorscheme) 在应用级别选择用户界面样式），也可以按计划更新（例如遵循昼夜循环的浅色和深色主题）。

### 返回值

- `'light'`：应用浅色配色方案。
- `'dark'`：应用深色配色方案。
- `'unspecified'`：**_永远不会返回_**（类型标注错误）。
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

您可以在 [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js) 中找到一个完整的示例，该示例演示了如何将此钩子与 React 上下文一起使用，以为您的应用程序添加浅色和深色主题支持。
