---
id: settings
title: Settings
---

`Settings` serves as a wrapper for [`NSUserDefaults`](https://developer.apple.com/documentation/foundation/nsuserdefaults)，a persistent key-value store available only on iOS。

## 示例

```SnackPlayer name=Settings%20Example&supportedPlatforms=ios
import {useState} from 'react';
import {Button, Settings, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [data, setData] = useState(() => Settings.get('data'));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Stored value:</Text>
        <Text style={styles.value}>{data}</Text>
        <Button
          onPress={() => {
            Settings.set({data: 'React'});
            setData(Settings.get('data'));
          }}
          title="Store 'React'"
        />
        <Button
          onPress={() => {
            Settings.set({data: 'Native'});
            setData(Settings.get('data'));
          }}
          title="Store 'Native'"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    marginVertical: 12,
  },
});

export default App;
```

---

# 参考

## 方法

### `clearWatch()`

```tsx
static clearWatch(watchId: number);
```

`watchId` 是最初配置订阅时由 `watchKeys()` 返回的编号。

---

### `get()`

```tsx
static get(key: string): any;
```

获取 `NSUserDefaults` 中给定 `key` 的当前值。

---

### `set()`

```tsx
static set(settings: Record<string, any>);
```

在 `NSUserDefaults` 中设置一个或多个值。

---

### `watchKeys()`

```tsx
static watchKeys(keys: string | array<string>, callback: () => void): number;
```

订阅通知，以便在 `NSUserDefaults` 中由 `keys` 参数指定的任意键的值发生更改时收到通知。返回一个 `watchId` 编号，可与 `clearWatch()` 一起使用以取消订阅。

:::note
`watchKeys()` 的设计会忽略内部的 `set()` 调用，并且仅在 React Native 代码之外发生更改时触发回调。
:::
