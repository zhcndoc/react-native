---
id: settings
title: 设置
---

`Settings` 充当 [`NSUserDefaults`](https://developer.apple.com/documentation/foundation/nsuserdefaults) 的包装器，它是仅在 iOS 上可用的持久键值存储。

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
        <Text>存储的值：</Text>
        <Text style={styles.value}>{data}</Text>
        <Button
          onPress={() => {
            Settings.set({data: 'React'});
            setData(Settings.get('data'));
          }}
          title="存储 'React'"
        />
        <Button
          onPress={() => {
            Settings.set({data: 'Native'});
            setData(Settings.get('data'));
          }}
          title="存储 'Native'"
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

`watchId` 是在最初配置订阅时由 `watchKeys()` 返回的数字。

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

订阅以便在 `keys` 参数指定的任意键的值在 `NSUserDefaults` 中发生变化时收到通知。返回一个可与 `clearWatch()` 一起使用以取消订阅的 `watchId` 数字。

:::note
`watchKeys()` 按设计会忽略内部的 `set()` 调用，并且只在 React Native 代码外部发生的变更时触发回调。
:::
