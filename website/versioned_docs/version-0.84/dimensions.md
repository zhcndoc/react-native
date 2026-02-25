---
id: dimensions
title: 尺寸
---

:::info
[`useWindowDimensions`](usewindowdimensions) 是 React 组件推荐使用的 API。不同于 `Dimensions`，它会随着窗口尺寸的变化而更新。这与 React 的范式非常契合。
:::

```tsx
import {Dimensions} from 'react-native';
```

你可以使用以下代码获取应用窗口的宽度和高度：

```tsx
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
```

:::note
尽管尺寸信息可以立即获取，但它们可能会变化（例如设备旋转、折叠设备等），因此任何依赖这些常量的渲染逻辑或样式，应该尝试在每次渲染时调用此函数，而不是缓存其值（例如，使用内联样式而非在 `StyleSheet` 中设置值）。
:::

如果你的目标设备包括折叠屏设备或能够改变屏幕尺寸或应用窗口尺寸的设备，可以使用 Dimensions 模块中的事件监听器，如以下示例所示。

## 示例

```SnackPlayer name=Dimensions%20Example
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, Dimensions} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const App = () => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>窗口尺寸</Text>
        {Object.entries(dimensions.window).map(([key, value]) => (
          <Text>
            {key} - {value}
          </Text>
        ))}
        <Text style={styles.header}>屏幕尺寸</Text>
        {Object.entries(dimensions.screen).map(([key, value]) => (
          <Text>
            {key} - {value}
          </Text>
        ))}
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
  header: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default App;
```

# 参考

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: 'change',
  handler: ({
    window,
    screen,
  }: DimensionsValue) => void,
): EmitterSubscription;
```

添加事件处理器。支持的事件：

- `change`：当 `Dimensions` 对象中的属性发生变化时触发。事件处理器的参数是一个 [`DimensionsValue`](#dimensionsvalue) 类型的对象。

---

### `get()`

```tsx
static get(dim: 'window' | 'screen'): ScaledSize;
```

初始尺寸在调用 `runApplication` 之前已设置，因此它们应该在任何其他 require 执行前可用，但可能随后会被更新。

示例：`const {height, width} = Dimensions.get('window');`

**参数：**

| 名称                                                               | 类型   | 说明                                                                       |
| ------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------- |
| dim <div className="label basic required two-lines">必填</div>     | string | 维度名称，如调用 `set` 时定义。返回该维度的值。                           |

:::note
对于 Android，如果状态栏非透明，`window` 维度会减去状态栏的高度和底部导航栏的高度。
:::

## 类型定义

### DimensionsValue

**属性：**

| 名称   | 类型                                | 说明                                       |
| ------ | ----------------------------------- | ------------------------------------------ |
| window | [ScaledSize](dimensions#scaledsize) | 可见应用窗口的尺寸。                       |
| screen | [ScaledSize](dimensions#scaledsize) | 设备屏幕的尺寸。                           |

### ScaledSize

| 类型   |
| ------ |
| object |

**属性：**

| 名称      | 类型   |
| --------- | ------ |
| width     | number |
| height    | number |
| scale     | number |
| fontScale | number |