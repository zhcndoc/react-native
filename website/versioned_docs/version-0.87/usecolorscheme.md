---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` React Hook 提供并订阅来自 [`Appearance`](appearance) 模块的颜色方案更新。返回值表示当前启用的颜色方案。该值可能会在之后更新，更新可能是由用户直接操作触发的（例如在设备设置中选择主题，或通过 [`setColorScheme`](appearance#setcolorscheme) 选择应用级别的用户界面样式），也可能按计划更新（例如跟随昼夜循环的浅色和深色主题）。

### 返回值

- `'light'`：应用浅色颜色方案
- `'dark'`：应用深色颜色方案
- `null`：如果原生 Appearance 模块不可用，可能会返回此值

---

## 示例

```SnackPlayer
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

你可以在 [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js) 中找到一个完整示例，该示例演示了如何将此 Hook 与 React 上下文结合使用，为你的应用添加对浅色和深色主题的支持
