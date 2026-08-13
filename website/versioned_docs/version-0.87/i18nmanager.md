---
id: i18nmanager
title: I18nManager
---

# I18nManager

`I18nManager` 模块提供了用于管理 Arabic、Hebrew 等语言的从右到左（RTL）布局支持的实用工具。它提供了控制 RTL 行为以及检查当前布局方向的方法。

## 示例

### 根据 RTL 更改位置和动画

如果你使用绝对定位来让元素与其他 flexbox 元素对齐，那么它们在 RTL 语言中可能无法对齐。可以使用 `isRTL` 来调整对齐方式或动画。

```SnackPlayer name=I18nManager%20Change%20Absolute%20Positions%20And%20Animations
import {I18nManager, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  // Change to `true` to see the effect in a non-RTL language
  const isRTL = I18nManager.isRTL;
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View
          style={{
            position: 'absolute',
            left: isRTL ? undefined : 0,
            right: isRTL ? 0 : undefined,
          }}>
          {isRTL ? <Text>Back &gt;</Text> : <Text>&lt; Back</Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
```

### 开发期间

```SnackPlayer name=I18nManager%20During%20Development
import {useState} from 'react';
import {Alert, I18nManager, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [rtl, setRTL] = useState(I18nManager.isRTL);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.forceRtl}>
            <Text>Force RTL in Development:</Text>
            <Switch
              value={rtl}
              onValueChange={value => {
                setRTL(value);
                I18nManager.forceRTL(value);
                Alert.alert(
                  'Reload this page',
                  'Please reload this page to change the UI direction! ' +
                    'All examples in this app will be affected. ' +
                    'Check them out to see what they look like in RTL layout.',
                );
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  forceRtl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default App;
```

# 参考

## 属性

### `isRTL`

```typescript
static isRTL: boolean;
```

一个布尔值，表示应用当前是否处于 RTL 布局模式。

`isRTL` 的值由以下逻辑决定：

- 如果 `forceRTL` 为 `true`，`isRTL` 返回 `true`
- 如果 `allowRTL` 为 `false`，`isRTL` 返回 `false`
- 否则，在以下情况下 `isRTL` 将为 `true`：
  - **iOS：**
    - 设备上的用户首选语言是 RTL 语言
    - 应用定义的本地化内容包括用户选择的语言（如 Xcode 项目文件中的定义（`knownRegions = (...)`））
  - **Android：**
    - 设备上的用户首选语言是 RTL 语言
    - 应用的 `AndroidManifest.xml` 在 `<application>` 元素上定义了 `android:supportsRTL="true"`

### `doLeftAndRightSwapInRTL`

```typescript
static doLeftAndRightSwapInRTL: boolean;
```

一个布尔值，表示处于 RTL 模式时是否应自动交换左右样式属性。启用后，在 RTL 布局中，left 会变为 right，right 会变为 left。

## 方法

### `allowRTL()`

```typescript
static allowRTL: (allowRTL: boolean) => void;
```

启用或禁用应用的 RTL 布局支持。

**参数：**

- `allowRTL`（boolean）：是否允许 RTL 布局

**重要说明：**

- 更改将在下次启动应用时生效，而不是立即生效
- 此设置会在应用重启后保留

### `forceRTL()`

```typescript
static forceRTL: (forced: boolean) => void;
```

强制应用使用 RTL 布局，而不考虑设备语言设置。这主要用于在开发期间测试 RTL 布局。

避免在生产应用中强制使用 RTL，因为这需要完整重启应用才能生效，会带来较差的用户体验。

**参数：**

- `forced`（boolean）：是否强制使用 RTL 布局

**重要说明：**

- 更改将在下次启动应用时完全生效，而不是立即生效
- 此设置会在应用重启后保留
- 仅用于开发和测试。在生产环境中，你应完全禁用 RTL，或以适当方式处理 RTL（请参阅 `isRTL`）

### `swapLeftAndRightInRTL()`

```typescript
static swapLeftAndRightInRTL: (swapLeftAndRight: boolean) => void;
```

在 RTL 模式下交换左右样式属性。启用后，在 RTL 布局中，left 会变为 right，right 会变为 left。不影响 `isRTL` 的值。
