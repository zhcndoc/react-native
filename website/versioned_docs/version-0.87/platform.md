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

返回一个包含与平台相关的所有可用通用常量和特定常量的对象。

**属性：**

| <div className="widerColumn">名称</div>                   | 类型    | 可选 | 描述                                                                                                                                                                                       |
| --------------------------------------------------------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isTesting                                                 | boolean | 否   |                                                                                                                                                                                            |
| reactNativeVersion                                        | object  | 否   | React Native 版本信息。键为 `major`、`minor`、`patch`，以及可选的 `prerelease`，值为 `number`。                                                                                            |
| Version <div className="label android">Android</div>      | number  | 否   | Android 特有的 OS 版本常量。                                                                                                                                                               |
| Release <div className="label android">Android</div>      | string  | 否   |                                                                                                                                                                                            |
| Serial <div className="label android">Android</div>       | string  | 否   | Android 设备的硬件序列号。                                                                                                                                                                 |
| Fingerprint <div className="label android">Android</div>  | string  | 否   | 唯一标识构建版本的字符串。                                                                                                                                                                 |
| Model <div className="label android">Android</div>        | string  | 否   | 对最终用户可见的 Android 设备名称。                                                                                                                                                        |
| Brand <div className="label android">Android</div>        | string  | 否   | 产品或硬件将关联的面向消费者的品牌。                                                                                                                                                       |
| Manufacturer <div className="label android">Android</div> | string  | 否   | Android 设备的制造商。                                                                                                                                                                     |
| ServerHost <div className="label android">Android</div>   | string  | 是   |                                                                                                                                                                                            |
| uiMode <div className="label android">Android</div>       | string  | 否   | 可能的值包括：`'car'`、`'desk'`、`'normal'`、`'tv'`、`'watch'` 和 `'unknown'`。详细信息请参阅 [Android ModeType](https://developer.android.com/reference/android/app/UiModeManager.html)。 |
| forceTouchAvailable <div className="label ios">iOS</div>  | boolean | 否   | 指示设备上 3D Touch 的可用性。                                                                                                                                                             |
| interfaceIdiom <div className="label ios">iOS</div>       | string  | 否   | 设备的界面类型。详细信息请参阅 [UIUserInterfaceIdiom](https://developer.apple.com/documentation/uikit/uiuserinterfaceidiom)。                                                              |
| osVersion <div className="label ios">iOS</div>            | string  | 否   | iOS 特有的 OS 版本常量。                                                                                                                                                                   |
| systemName <div className="label ios">iOS</div>           | string  | 否   | iOS 特有的 OS 名称常量。                                                                                                                                                                   |

---

### `isPad` <div className="label ios">iOS</div>

```tsx
static isPad: boolean;
```

返回一个布尔值，用于定义设备是否为 iPad。

| 类型    |
| ------- |
| boolean |

---

### `isTV`

```tsx
static isTV: boolean;
```

返回一个布尔值，用于定义设备是否为电视。

| 类型    |
| ------- |
| boolean |

---

### `isVision`

```tsx
static isVision: boolean;
```

返回一个布尔值，用于定义设备是否为 Apple Vision。_如果你使用的是 [Apple Vision Pro（为 iPad 设计）](https://developer.apple.com/documentation/visionos/determining-whether-to-bring-your-app-to-visionos)，`isVision` 将为 `false`，但 `isPad` 将为 `true`_

| 类型    |
| ------- |
| boolean |

---

### `isTesting`

```tsx
static isTesting: boolean;
```

返回一个布尔值，用于定义应用是否在设置了测试标志的开发者模式下运行。

| 类型    |
| ------- |
| boolean |

---

### `OS`

```tsx
static OS: 'android' | 'ios';
```

返回表示当前 OS 的字符串值。

| 类型                         |
| ---------------------------- |
| enum（`'android'`、`'ios'`） |

---

### `Version`

```tsx
static Version: 'number' | 'string';
```

返回 OS 的版本。

| 类型                                                                                                 |
| ---------------------------------------------------------------------------------------------------- |
| number <div className="label android">Android</div><hr />string <div className="label ios">iOS</div> |

## 方法

### `select()`

```tsx
static select(config: Record<string, T>): T;
```

返回与你当前运行的平台最匹配的值。

#### 参数：

| 名称   | 类型   | 必需 | 描述                       |
| ------ | ------ | ---- | -------------------------- |
| config | object | 是   | 请参阅下面的 config 描述。 |

`select` 方法会返回与你当前运行的平台最匹配的值。也就是说，如果你运行在手机上，`android` 和 `ios` 键将优先使用。如果未指定这些键，则会使用 `native` 键，然后使用 `default` 键。

`config` 参数是一个包含以下键的对象：

- `android`（任意）
- `ios`（任意）
- `native`（任意）
- `default`（任意）

**使用示例：**

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
        // other platforms, web for example
        backgroundColor: 'blue',
      },
    }),
  },
});
```

这将使所有平台上的容器都具有 `flex: 1`，在 Android 上具有绿色背景，在 iOS 上具有红色背景，在其他平台上具有蓝色背景。

由于对应平台键的值可以是 `any` 类型，因此 [`select`](platform.md#select) 方法还可以用于返回特定于平台的组件，如下所示：

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
