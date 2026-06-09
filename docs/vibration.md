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
      ? '等待 1 秒，振动 2 秒，等待 3 秒'
      : '等待 1 秒，振动，等待 2 秒，振动，等待 3 秒';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={[styles.header, styles.paragraph]}>振动 API</Text>
        <View>
          <Button title="振动一次" onPress={() => Vibration.vibrate()} />
        </View>
        <Separator />
        {Platform.OS === 'android'
          ? [
              <View>
                <Button
                  title="振动 10 秒"
                  onPress={() => Vibration.vibrate(10 * ONE_SECOND_IN_MS)}
                />
              </View>,
              <Separator />,
            ]
          : null}
        <Text style={styles.paragraph}>模式：{PATTERN_DESC}</Text>
        <Button
          title="按模式振动"
          onPress={() => Vibration.vibrate(PATTERN)}
        />
        <Separator />
        <Button
          title="按模式振动直到取消"
          onPress={() => Vibration.vibrate(PATTERN, true)}
        />
        <Separator />
        <Button
          title="停止振动模式"
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
Android 应用应通过在 `AndroidManifest.xml` 中添加 `<uses-permission android:name="android.permission.VIBRATE"/>` 来请求 `android.permission.VIBRATE` 权限。
:::

:::note
Vibration API 在 iOS 上作为 `AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)` 调用实现。
:::

---

# 参考

## 方法

### `cancel()`

```tsx
static cancel();
```

在以启用重复的方式调用了 `vibrate()` 之后，使用此方法停止振动。

---

### `vibrate()`

```tsx
static vibrate(
  pattern?: number | number[],
  repeat?: boolean
);
```

触发固定时长的振动。

**在 Android 上，** 振动时长默认为 400 毫秒，也可以通过向 `pattern` 参数传递一个数字来指定任意振动时长。**在 iOS 上，** 振动时长固定为大约 400 毫秒。

`vibrate()` 方法可以接收一个 `pattern` 参数，该参数为由毫秒时间组成的数组。你可以将 `repeat` 设置为 `true`，以循环执行振动模式，直到调用 `cancel()`。

**在 Android 上，** `pattern` 数组中的奇数索引表示振动时长，偶数索引表示间隔时间。**在 iOS 上，** `pattern` 数组中的数字表示间隔时间，因为振动时长是固定的。

**参数：**

| 名称    | 类型                                                                     | 默认值 | 描述                                                                                       |
| ------- | ------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------ |
| pattern | number <div className="label android">Android</div><hr/>array of numbers | `400`   | 毫秒单位的振动时长。<hr/>以毫秒为单位的数字数组形式的振动模式。 |
| repeat  | boolean                                                                  | `false` | 重复振动模式，直到调用 `cancel()`。                                                        |
