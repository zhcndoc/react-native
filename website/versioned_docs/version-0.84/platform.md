---
id: platform
title: 平台
---

## 示例

```SnackPlayer name=Platform%20API%20Example&supportedPlatforms=ios,android
import {Platform, StyleSheet, Text, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text>操作系统</Text>
          <Text style={styles.value}>{Platform.OS}</Text>
          <Text>操作系统版本</Text>
          <Text style={styles.value}>{Platform.Version}</Text>
          <Text>是否为电视</Text>
          <Text style={styles.value}>{Platform.isTV.toString()}</Text>
          {Platform.OS === 'ios' && (
            <>
              <Text>是否为 iPad</Text>
              <Text style={styles.value}>{Platform.isPad.toString()}</Text>
            </>
          )}
          <Text>常量</Text>
          <Text style={styles.value}>
            {JSON.stringify(Platform.constants, null, 2)}
          </Text>
        </ScrollView>
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
    fontWeight: '600',
    padding: 4,
    marginBottom: 8,
  },
  safeArea: {
    flex: 1,
  },
});

export default App;
```

---

# 参考

## 属性

### `constants`

```tsx
static constants: PlatformConstants;
```

返回一个包含与当前平台相关的所有可用通用和特定常量的对象。

**属性:**

| <div className="widerColumn">名称</div>                     | 类型    | 可选 | 说明                                                                                                                                                                                            |
| ---------------------------------------------------------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isTesting                                                  | boolean | 否   |                                                                                                                                                                                                   |
| reactNativeVersion                                         | object  | 否   | React Native 版本信息。键为 `major`、`minor`、`patch`，可选 `prerelease`，值均为数字。                                                                                                            |
| Version <div className="label android">Android</div>       | number  | 否   | Android 特定的操作系统版本常量。                                                                                                                                                                  |
| Release <div className="label android">Android</div>       | string  | 否   |                                                                                                                                                                                                   |
| Serial <div className="label android">Android</div>        | string  | 否   | Android 设备的硬件序列号。                                                                                                                                                                        |
| Fingerprint <div className="label android">Android</div>   | string  | 否   | 唯一标识构建的字符串。                                                                                                                                                                            |
| Model <div className="label android">Android</div>         | string  | 否   | Android 设备对最终用户显示的名称。                                                                                                                                                                |
| Brand <div className="label android">Android</div>         | string  | 否   | 产品/硬件所关联的消费品品牌名称。                                                                                                                                                                |
| Manufacturer <div className="label android">Android</div>  | string  | 否   | Android 设备的制造商。                                                                                                                                                                            |
| ServerHost <div className="label android">Android</div>    | string  | 是   |                                                                                                                                                                                                   |
| uiMode <div className="label android">Android</div>        | string  | 否   | 可能值：`'car'`、`'desk'`、`'normal'`、`'tv'`、`'watch'` 和 `'unknown'`。更多信息请参阅 [Android ModeType](https://developer.android.com/reference/android/app/UiModeManager.html)。         |
| forceTouchAvailable <div className="label ios">iOS</div>   | boolean | 否   | 指示设备是否支持 3D Touch。                                                                                                                                                                      |
| interfaceIdiom <div className="label ios">iOS</div>        | string  | 否   | 设备的界面类型。更多信息请参阅 [UIUserInterfaceIdiom](https://developer.apple.com/documentation/uikit/uiuserinterfaceidiom)。                                                               |
| osVersion <div className="label ios">iOS</div>             | string  | 否   | iOS 特定的操作系统版本常量。                                                                                                                                                                    |
| systemName <div className="label ios">iOS</div>            | string  | 否   | iOS 特定的操作系统名称常量。                                                                                                                                                                    |

---

### `isPad` <div className="label ios">iOS</div>

```tsx
static isPad: boolean;
```

返回一个布尔值，表示设备是否为 iPad。

| 类型    |
| ------- |
| boolean |

---

### `isTV`

```tsx
static isTV: boolean;
```

返回一个布尔值，表示设备是否为电视。

| 类型    |
| ------- |
| boolean |

---

### `isVision`

```tsx
static isVision: boolean;
```

返回一个布尔值，表示设备是否为 Apple Vision。_如果你在使用 [Apple Vision Pro (设计用于 iPad)](https://developer.apple.com/documentation/visionos/determining-whether-to-bring-your-app-to-visionos)，则 `isVision` 会是 `false`，但 `isPad` 会是 `true`。_

| 类型    |
| ------- |
| boolean |

---

### `isTesting`

```tsx
static isTesting: boolean;
```

返回一个布尔值，表示应用是否在开发者模式下并且设置了测试标志。

| 类型    |
| ------- |
| boolean |

---

### `OS`

```tsx
static OS: 'android' | 'ios';
```

返回一个字符串，表示当前操作系统。

| 类型                       |
| -------------------------- |
| 枚举(`'android'`, `'ios'`) |

---

### `Version`

```tsx
static Version: 'number' | 'string';
```

返回当前操作系统的版本。

| 类型                                                                                               |
| -------------------------------------------------------------------------------------------------- |
| number <div className="label android">Android</div><hr />string <div className="label ios">iOS</div> |

## 方法

### `select()`

```tsx
static select(config: Record<string, T>): T;
```

返回当前运行平台最匹配的值。

#### 参数：

| 名称   | 类型   | 必填   | 说明                       |
| ------ | ------ | ------ | -------------------------- |
| config | object | 是     | 见下方配置说明。           |

`select` 方法返回当前运行平台最匹配的值。也就是说，如果你运行在手机上，会优先选择 `android` 和 `ios` 键对应的值；如果这些没有指定，则会使用 `native` 键；最后是 `default` 键。

`config` 参数是一个包含以下键的对象：

- `android` (任意类型)
- `ios` (任意类型)
- `native` (任意类型)
- `default` (任意类型)

**示例用法：**

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        backgroundColor: 'green',
      },
      ios: {
        backgroundColor: 'red',
      },
      default: {
        // 其他平台，例如 web
        backgroundColor: 'blue',
      },
    }),
  },
});
```

这将导致 container 在所有平台拥有 `flex: 1`，在 Android 上背景色为绿色，iOS 上为红色，其他平台为蓝色。

因为对应平台键的值类型可以是任意类型，[`select`](platform.md#select) 方法也可以用来返回平台特定的组件，如下所示：

```tsx
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

```tsx
const Component = Platform.select({
  native: () => require('ComponentForNative'),
  default: () => require('ComponentForWeb'),
})();

<Component />;
```
