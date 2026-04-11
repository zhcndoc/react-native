---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` React hook 提供并订阅来自 [`Appearance`](appearance) 模块的颜色方案更新。返回值表示当前用户首选的颜色方案。该值可能会稍后更新，要么通过直接的用户操作（例如设备设置中的主题选择），要么按计划更新（例如遵循昼夜循环的浅色和深色主题）。

### 支持的颜色方案

- `"light"`：用户首选浅色主题。
- `"dark"`：用户首选深色主题。
- `null`：用户未指示首选颜色主题。

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

你可以在 [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js) 中找到一个完整的示例，该示例演示了如何将此 hook 与 React context 一起使用，以为你的应用程序添加浅色和深色主题支持。
