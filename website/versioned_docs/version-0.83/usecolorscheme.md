---
id: usecolorscheme
title: useColorScheme
---

```tsx
import {useColorScheme} from 'react-native';
```

`useColorScheme` is a React Hook that provides and subscribes to color scheme updates from the [`Appearance`](appearance) module. The return value indicates the user's current preferred color scheme. This value may update in the future, which can happen due to direct user action (for example, a theme choice in device settings) or scheduled updates (for example, switching between light and dark themes following the day/night cycle).

### Supported color schemes

- `"light"`: The user prefers a light theme.
- `"dark"`: The user prefers a dark theme.
- `null`: The user has not indicated a preferred color scheme.

---

## Example

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

A complete example can be found in [`AppearanceExample.js`](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/Appearance/AppearanceExample.js), which demonstrates using this hook together with React context to add support for light and dark themes to your app.