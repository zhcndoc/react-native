---
id: platform
title: 平台
---

## 示例

```SnackPlayer name=Platform%20API%20Example&supportedPlatforms=ios,android
import React from 'react';
import {Platform, StyleSheet, Text, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text>OS</Text>
          <Text style={styles.value}>{Platform.OS}</Text>
          <Text>OS Version</Text>
          <Text style={styles.value}>{Platform.Version}</Text>
          <Text>isTV</Text>
          <Text style={styles.value}>{Platform.isTV.toString()}</Text>
          {Platform.OS === 'ios' && (
            <>
              <Text>isPad</Text>
              <Text style={styles.value}>{Platform.isPad.toString()}</Text>
            </>
          )}
          <Text>Constants</Text>
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

返回一个对象，其中包含与平台相关的所有可用的通用和特定常量。

**属性：**

| <div className="widerColumn">名称</div>                   | 类型    | 可选 | 描述                                                                                                                                                                                       |
| --------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isTesting                                                 | 布尔值 | 否       |                                                                                                                                                                                                   |
| reactNativeVersion                                        | 对象  | 否       | 关于 React Native 版本的信息。键为 `major`、`minor`、`patch`，可选 `prerelease`，值为 `number`。                                                                   |
| Version <div className="label android">Android</div>      | 数字  | 否       | Android 特定的 OS 版本常量。                                                                                                                                                          |
| Release <div className="label android">Android</div>      | 字符串  | 否       |                                                                                                                                                                                                   |
| Serial <div className="label android">Android</div>       | 字符串  | 否       | Android 设备的硬件序列号。                                                                                                                                                      |
| Fingerprint <div className="label android">Android</div>  | 字符串  | 否       | 唯一标识构建的字符串。                                                                                                                                                      |
| Model <div className="label android">Android</div>        | 字符串  | 否       | Android 设备的最终用户可见名称。                                                                                                                                                 |
| Brand <div className="label android">Android</div>        | 字符串  | 否       | 与产品/硬件关联的消费者可见品牌。                                                                                                                    |
| Manufacturer <div className="label android">Android</div> | 字符串  | 否       | Android 设备的制造商。                                                                                                                                                           |
| ServerHost <div className="label android">Android</div>   | 字符串  | 是      |                                                                                                                                                                                                   |
| uiMode <div className="label android">Android</div>       | 字符串  | 否       | 可能的值为：`'car'`、`'desk'`、`'normal'`、`'tv'`、`'watch'` 和 `'unknown'`。了解更多关于 [Android ModeType](https://developer.android.com/reference/android/app/UiModeManager.html)。 |
| forceTouchAvailable <div className="label ios">iOS</div>  | 布尔值 | 否       | 指示设备上 3D Touch 的可用性。                                                                                                                                                |
| interfaceIdiom <div className="label ios">iOS</div>       | 字符串  | 否       | 设备的界面类型。了解更多关于 [UIUserInterfaceIdiom](https://developer.apple.com/documentation/uikit/uiuserinterfaceidiom)。                                                  |
| osVersion <div className="label ios">iOS</div>            | 字符串  | 否       | iOS 特定的 OS 版本常量。                                                                                                                                                              |
| systemName <div className="label ios">iOS</div>           | 字符串  | 否       | iOS 特定的 OS 名称常量。                                                                                                                                                                 |

---

### `isPad` <div className="label ios">iOS</div>

```tsx
static isPad: boolean;
```

返回一个布尔值，定义设备是否为 iPad。

| 类型    |
| ------- |
| 布尔值 |

---

### `isTV`

```tsx
static isTV: boolean;
```

返回一个布尔值，定义设备是否为电视。

| 类型    |
| ------- |
| 布尔值 |

---

### `isVision`

```tsx
static isVision: boolean;
```

返回一个布尔值，定义设备是否为 Apple Vision。_如果您正在使用 [Apple Vision Pro (Designed for iPad)](https://developer.apple.com/documentation/visionos/determining-whether-to-bring-your-app-to-visionos)，`isVision` 将为 `false`，但 `isPad` 将为 `true`_

| 类型    |
| ------- |
| 布尔值 |

---

### `isTesting`

```tsx
static isTesting: boolean;
```

返回一个布尔值，定义应用程序是否在设置了测试标志的开发模式下运行。

| 类型    |
| ------- |
| 布尔值 |

---

### `OS`

```tsx
static OS: 'android' | 'ios';
```

返回表示当前操作系统的字符串值。

| 类型                       |
| -------------------------- |
| 枚举 (`'android'`, `'ios'`) |

---

### `Version`

```tsx
static Version: 'number' | 'string';
```

返回操作系统的版本。

| 类型                                                                                                 |
| ---------------------------------------------------------------------------------------------------- |
| 数字 <div className="label android">Android</div><hr />字符串 <div className="label ios">iOS</div> |

## 方法

### `select()`

```tsx
static select(config: Record<string, T>): T;
```

返回最适合您当前运行平台的值。

#### 参数：

| 名称   | 类型   | 必需 | 描述                   |
| ------ | ------ | -------- | ----------------------------- |
| config | 对象 | 是      | 参见下方的配置描述。 |

select 方法返回最适合您当前运行平台的值。也就是说，如果您在手机上运行，`android` 和 `ios` 键将优先。如果未指定这些，则将使用 `native` 键，然后是 `default` 键。

`config` 参数是一个具有以下键的对象：

- `android` (any)
- `ios` (any)
- `native` (any)
- `default` (any)

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

这将导致容器在所有平台上具有 `flex: 1`，在 Android 上具有绿色背景色，在 iOS 上具有红色背景色，在其他平台上具有蓝色背景色。

由于相应平台键的值可以是 `any` 类型，[`select`](platform.md#select) 方法也可用于返回特定于平台的组件，如下所示：

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
