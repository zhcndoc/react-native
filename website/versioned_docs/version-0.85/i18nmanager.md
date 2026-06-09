---
id: i18nmanager
title: I18nManager
---

# I18nManager

`I18nManager` 模块提供了用于管理从右到左（RTL）布局支持的实用工具，适用于阿拉伯语、希伯来语等语言。它提供了用于控制 RTL 行为以及检查当前布局方向的方法。

## 示例

### 根据 RTL 更改位置和动画

如果你将元素绝对定位以与其他 flexbox 元素对齐，它们在 RTL 语言中可能无法对齐。可以使用 `isRTL` 来调整对齐或动画。

```SnackPlayer name=I18nManager%20Change%20Absolute%20Positions%20And%20Animations
import {I18nManager, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  // 将 `true` 改为在非 RTL 语言中查看效果
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
          {isRTL ? <Text>后退 &gt;</Text> : <Text>&lt; 后退</Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
```

### 在开发期间

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
            <Text>在开发中强制使用 RTL：</Text>
            <Switch
              value={rtl}
              onValueChange={value => {
                setRTL(value);
                I18nManager.forceRTL(value);
                Alert.alert(
                  '重新加载此页面',
                  '请重新加载此页面以更改 UI 方向！' +
                    '此应用中的所有示例都会受到影响。' +
                    '查看它们以了解它们在 RTL 布局中的外观。',
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

- 如果 `forceRTL` 为 `true`，则 `isRTL` 返回 `true`
- 如果 `allowRTL` 为 `false`，则 `isRTL` 返回 `false`
- 否则，在以下情况下 `isRTL` 将为 `true`：
  - **iOS：**
    - 设备上用户首选语言是 RTL 语言
    - 应用定义的本地化内容包含用户选择的语言（如 Xcode 项目文件中定义的 `knownRegions = (...)`）
  - **Android：**
    - 设备上用户首选语言是 RTL 语言
    - 应用的 `AndroidManifest.xml` 在 `<application>` 元素上定义了 `android:supportsRTL="true"`

### `doLeftAndRightSwapInRTL`

```typescript
static doLeftAndRightSwapInRTL: boolean;
```

一个布尔值，表示在 RTL 模式下是否应自动交换 left 和 right 样式属性。启用后，在 RTL 布局中 left 会变为 right，right 会变为 left。

## 方法

### `allowRTL()`

```typescript
static allowRTL: (allowRTL: boolean) => void;
```

为应用启用或禁用 RTL 布局支持。

**参数：**

- `allowRTL`（boolean）：是否允许 RTL 布局

**重要说明：**

- 更改会在下次应用启动时生效，而不是立即生效
- 此设置会在应用重启之间持久保存

### `forceRTL()`

```typescript
static forceRTL: (forced: boolean) => void;
```

强制应用使用 RTL 布局，而不受设备语言设置影响。这主要用于在开发期间测试 RTL 布局。

避免在生产应用中强制启用 RTL，因为这需要完整重启应用后才会生效，这会带来较差的用户体验。

**参数：**

- `forced`（boolean）：是否强制使用 RTL 布局

**重要说明：**

- 更改会在下次应用启动时完全生效，而不是立即生效
- 该设置会在应用重启之间持久保存
- 仅用于开发和测试。在生产环境中，你应该完全禁止 RTL，或者适当地处理它（参见 `isRTL`）

### `swapLeftAndRightInRTL()`

```typescript
static swapLeftAndRightInRTL: (swapLeftAndRight: boolean) => void;
```

在 RTL 模式下交换 left 和 right 样式属性。启用后，在 RTL 布局中 left 会变为 right，right 会变为 left。不会影响 `isRTL` 的值。
