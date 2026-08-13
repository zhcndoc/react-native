---
id: vibration
title: 振动
---

使设备振动。

## 示例

```SnackPlayer name=Vibration%20Example&supportedPlatforms=ios,android
import {
  Button,
  Platform,
  Text,
  Vibration,
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const Separator = () => {
  return <View style={Platform.OS === 'android' ? styles.separator : null} />;
};

const App = () => {
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC =
    Platform.OS === 'android'
      ? 'wait 1s, vibrate 2s, wait 3s'
      : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={[styles.header, styles.paragraph]}>Vibration API</Text>
        <View>
          <Button title="Vibrate once" onPress={() => Vibration.vibrate()} />
        </View>
        <Separator />
        {Platform.OS === 'android'
          ? [
              <View>
                <Button
                  title="Vibrate for 10 seconds"
                  onPress={() => Vibration.vibrate(10 * ONE_SECOND_IN_MS)}
                />
              </View>,
              <Separator />,
            ]
          : null}
        <Text style={styles.paragraph}>Pattern: {PATTERN_DESC}</Text>
        <Button
          title="Vibrate with pattern"
          onPress={() => Vibration.vibrate(PATTERN)}
        />
        <Separator />
        <Button
          title="Vibrate with pattern until cancelled"
          onPress={() => Vibration.vibrate(PATTERN, true)}
        />
        <Separator />
        <Button
          title="Stop vibration pattern"
          onPress={() => Vibration.cancel()}
          color="#FF0000"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 44,
    padding: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    margin: 24,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
```

:::info
Android 应用应通过将 `<uses-permission android:name="android.permission.VIBRATE"/>` 添加到 `AndroidManifest.xml` 来请求 `android.permission.VIBRATE` 权限。
:::

:::note
Vibration API 在 iOS 上实现为 `AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)` 调用。
:::

---

# 参考

## 方法

### `cancel()`

```tsx
static cancel();
```

在启用重复功能调用 `vibrate()` 后，调用此方法停止振动。

---

### `vibrate()`

```tsx
static vibrate(
  pattern?: number | number[],
  repeat?: boolean
);
```

以固定时长触发振动。

**在 Android 上，**振动时长默认为 400 毫秒，也可以通过将数字作为 `pattern` 参数的值传入来指定任意振动时长。**在 iOS 上，**振动时长固定为大约 400 毫秒。

`vibrate()` 方法可以接受一个 `pattern` 参数，该参数是由表示毫秒时间的数字组成的数组。你可以将 `repeat` 设置为 true，使振动模式循环运行，直到调用 `cancel()`。

**在 Android 上，**`pattern` 数组中的奇数索引表示振动时长，而偶数索引表示间隔时间。**在 iOS 上，**`pattern` 数组中的数字表示间隔时间，因为振动时长是固定的。

**参数：**

| 名称    | 类型                                                                     | 默认值  | 描述                                                                |
| ------- | ------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------- |
| pattern | number <div className="label android">Android</div><hr/>array of numbers | `400`   | 以毫秒为单位的振动时长。<hr/>以毫秒为单位的数字数组形式的振动模式。 |
| repeat  | boolean                                                                  | `false` | 重复振动模式，直到调用 `cancel()`。                                 |
