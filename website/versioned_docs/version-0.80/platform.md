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

返回一个对象，其中包含与平台相关的所有可用的通用和特定常量。

**属性：**

| <div className="widerColumn">名称</div>                   | 类型    | 可选 | 描述                                                                                                                                                                                  |
| --------------------------------------------------------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isDisableAnimations                                       | boolean | 是   | 是否应禁用动画。未设置时，默认使用 `isTesting` 的值。                                                                                                                                 |
| isTesting                                                 | boolean | 否   |                                                                                                                                                                                       |
| reactNativeVersion                                        | object  | 否   | React Native 版本信息。键为 `major`、`minor`、`patch`，可包含可选的 `prerelease`，值为 `number` 类型。                                                                                |
| Version <div className="label android">Android</div>      | number  | 否   | Android 特有的操作系统版本常量。                                                                                                                                                      |
| Release <div className="label android">Android</div>      | string  | 否   |                                                                                                                                                                                       |
| Serial <div className="label android">Android</div>       | string  | 否   | Android 设备的硬件序列号。                                                                                                                                                            |
| Fingerprint <div className="label android">Android</div>  | string  | 否   | 唯一标识此构建的字符串。                                                                                                                                                              |
| Model <div className="label android">Android</div>        | string  | 否   | Android 设备面向最终用户显示的名称。                                                                                                                                                  |
| Brand <div className="label android">Android</div>        | string  | 否   | 与产品或硬件关联、面向消费者的品牌。                                                                                                                                                  |
| Manufacturer <div className="label android">Android</div> | string  | 否   | Android 设备的制造商。                                                                                                                                                                |
| ServerHost <div className="label android">Android</div>   | string  | 是   |                                                                                                                                                                                       |
| uiMode <div className="label android">Android</div>       | string  | 否   | 可选值为：`'car'`、`'desk'`、`'normal'`、`'tv'`、`'watch'` 和 `'unknown'`。更多信息请参阅 [Android ModeType](https://developer.android.com/reference/android/app/UiModeManager.html). |
| forceTouchAvailable <div className="label ios">iOS</div>  | boolean | 否   | 指示设备是否支持 3D Touch。                                                                                                                                                           |
| interfaceIdiom <div className="label ios">iOS</div>       | string  | 否   | 设备的界面类型。更多信息请参阅 [UIUserInterfaceIdiom](https://developer.apple.com/documentation/uikit/uiuserinterfaceidiom).                                                          |
| osVersion <div className="label ios">iOS</div>            | string  | 否   | iOS 特有的操作系统版本常量。                                                                                                                                                          |
| systemName <div className="label ios">iOS</div>           | string  | 否   | iOS 特有的操作系统名称常量。                                                                                                                                                          |

---

### `isDisableAnimations`

```tsx
static isDisableAnimations: boolean;
```

动画关闭时返回 `true`，通常发生在自动化测试期间。未设置时回退到 [`isTesting`](#istesting) 的值。在 Android 上，可通过 `IS_DISABLE_ANIMATIONS` 系统属性设置。

| 类型    |
| ------- |
| boolean |

---

### `isPad` <div className="label ios">iOS</div>

```tsx
static isPad: boolean;
```

返回一个布尔值，定义设备是否为 iPad。

| 类型    |
| ------- |
| boolean |

---

### `isTV`

```tsx
static isTV: boolean;
```

返回一个布尔值，定义设备是否为电视。

| 类型    |
| ------- |
| boolean |

---

### `isVision`

```tsx
static isVision: boolean;
```

返回一个布尔值，定义设备是否为 Apple Vision。_如果您使用的是 [Apple Vision Pro (Designed for iPad)](https://developer.apple.com/documentation/visionos/checking-whether-your-app-is-compatible-with-visionos) `isVision` 将为 `false` 但 `isPad` 将为 `true`_

| 类型    |
| ------- |
| boolean |

---

### `isTesting`

```tsx
static isTesting: boolean;
```

返回一个布尔值，定义应用程序是否在设置了测试标志的开发者模式下运行。

| 类型    |
| ------- |
| boolean |

---

### `OS`

```tsx
static OS: 'android' | 'ios';
```

返回表示当前操作系统的字符串值。

| 类型                       |
| -------------------------- |
| enum(`'android'`, `'ios'`) |

---

### `Version`

```tsx
static Version: 'number' | 'string';
```

返回操作系统的版本。

| 类型                                                                                                 |
| ---------------------------------------------------------------------------------------------------- |
| number <div className="label android">Android</div><hr />string <div className="label ios">iOS</div> |

## 方法

### `select()`

```tsx
static select(config: Record<string, T>): T;
```

返回最适合您当前运行平台的值。

#### 参数：

| 名称   | 类型   | 必填 | 描述               |
| ------ | ------ | ---- | ------------------ |
| config | object | 是   | 见下方的配置描述。 |

select 方法返回最适合您当前运行平台的值。也就是说，如果您在手机上运行，`android` 和 `ios` 键将优先。如果未指定这些，将使用 `native` 键，然后是 `default` 键。

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
