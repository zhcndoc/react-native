---
id: i18nmanager
title: I18nManager
---

# I18nManager

`I18nManager` 模块提供了管理从右向左 (RTL) 布局支持的工具，适用于阿拉伯语、希伯来语等语言。它提供了一些方法来控制 RTL 行为及检查当前布局方向。

## 示例

### 根据 RTL 改变位置和动画

如果你使用绝对定位元素以与其他 flexbox 元素对齐，在 RTL 语言下可能无法正确对齐。可以使用 `isRTL` 来调整对齐或动画。

```SnackPlayer name=I18nManager%20Change%20Absolute%20Positions%20And%20Animations
import React from 'react';
import {I18nManager, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  // 设置为 true 可在非 RTL 语言环境中看到效果
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

### 开发时使用

```SnackPlayer name=I18nManager%20During%20Development
import React, {useState} from 'react';
import {Alert, I18nManager, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [rtl, setRTL] = useState(I18nManager.isRTL);
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.forceRtl}>
            <Text>强制在开发中启用 RTL：</Text>
            <Switch
              value={rtl}
              onValueChange={value => {
                setRTL(value);
                I18nManager.forceRTL(value);
                Alert.alert(
                  '请重新加载此页面',
                  '请重新加载此页面以更改 UI 方向！' +
                    '此应用中的所有示例都将受影响。' +
                    '查看它们以了解 RTL 布局下的显示效果。',
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

布尔值，指示应用当前是否处于 RTL 布局模式。

`isRTL` 的值由以下逻辑确定：

- 如果 `forceRTL` 为 `true`，则 `isRTL` 返回 `true`
- 如果 `allowRTL` 为 `false`，则 `isRTL` 返回 `false`
- 否则，在以下情况下 `isRTL` 为 `true`：
  - **iOS：**
    - 设备上用户优先的语言是 RTL 语言
    - 应用定义的本地化包含用户选择的语言（在 Xcode 项目文件中定义的 `knownRegions = (...)`）
  - **Android：**
    - 设备上用户优先的语言是 RTL 语言
    - 应用的 `AndroidManifest.xml` 在 `<application>` 元素中定义了 `android:supportsRTL="true"`

### `doLeftAndRightSwapInRTL`

```typescript
static doLeftAndRightSwapInRTL: boolean;
```

布尔值，指示在 RTL 模式下是否自动交换左右（left 和 right）的样式属性。启用时，RTL 布局中的 left 会变为 right，right 会变为 left。

## 方法

### `allowRTL()`

```typescript
static allowRTL: (allowRTL: boolean) => void;
```

启用或禁用应用的 RTL 布局支持。

**参数：**

- `allowRTL` (boolean)：是否允许 RTL 布局

**重要说明：**

- 更改将在下次应用启动时生效，而非立即生效
- 该设置会在应用重启间持久保存

### `forceRTL()`

```typescript
static forceRTL: (forced: boolean) => void;
```

强制应用使用 RTL 布局，无视设备语言设置。主要用于开发时测试 RTL 布局。

避免在生产环境中强制启用 RTL，因为这需要完全重启应用才能生效，会带来较差的用户体验。

**参数：**

- `forced` (boolean)：是否强制使用 RTL 布局

**重要说明：**

- 更改将在下次应用启动时完全生效，而非立即
- 该设置会在应用重启间持久保存
- 仅用于开发和测试。在生产环境中，应该禁用 RTL 或正确处理（参见 `isRTL`）

### `swapLeftAndRightInRTL()`

```typescript
static swapLeftAndRightInRTL: (swapLeftAndRight: boolean) => void;
```

在 RTL 模式下交换 left 和 right 样式属性。启用时，RTL 布局中 left 变为 right，right 变为 left。此设置不会影响 `isRTL` 的值。