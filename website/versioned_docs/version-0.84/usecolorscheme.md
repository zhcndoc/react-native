---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` 这是一个 React 钩子，用于提供并订阅来自 [`Appearance`](appearance) 模块的色彩方案更新。返回值表示当前用户偏好的色彩方案。该值可能会在以后更新，这可能是由于用户直接操作（例如设备设置中的主题选择）或按计划更新（例如跟随昼夜周期变化的浅色和深色主题）。

### 支持的色彩方案

- `"light"`：用户偏好浅色主题。
- `"dark"`：用户偏好深色主题。
- `null`：用户未指示偏好的色彩主题。

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

你可以在 [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js) 中找到一个完整示例，该示例演示了如何将此钩子与 React 上下文配合使用，为你的应用添加对浅色和深色主题的支持。