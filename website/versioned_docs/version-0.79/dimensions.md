---
id: dimensions
title: 尺寸
---

> [`useWindowDimensions`](usewindowdimensions) 是 React 组件的首选 API。与 `Dimensions` 不同，它会随着窗口尺寸的变化而更新。这与 React 范式很好地配合。

```tsx
import {Dimensions} from 'react-native';
```

您可以使用以下代码获取应用窗口的宽度和高度：

```tsx
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
```

> 虽然尺寸立即可用，但它们可能会发生变化（例如由于设备旋转、折叠设备等），因此任何依赖这些常数的渲染逻辑或样式都应尝试在每次渲染时调用此函数，而不是缓存该值（例如，使用内联样式而不是在 `StyleSheet` 中设置值）。

如果您针对的是折叠设备或可以更改屏幕尺寸或应用窗口尺寸的设备，您可以使用 Dimensions 模块中提供的事件监听器，如下例所示。

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
        <Text style={styles.header}>Window Dimensions</Text>
        {Object.entries(dimensions.window).map(([key, value]) => (
          <Text>
            {key} - {value}
          </Text>
        ))}
        <Text style={styles.header}>Screen Dimensions</Text>
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

添加事件处理程序。支持的事件：

- `change`：当 `Dimensions` 对象内的属性发生变化时触发。事件处理程序的参数是一个 [`DimensionsValue`](#dimensionsvalue) 类型的对象。

---

### `get()`

```tsx
static get(dim: 'window' | 'screen'): ScaledSize;
```

初始尺寸在调用 `runApplication` 之前设置，因此它们在任何其他 require 运行之前应该可用，但可能会稍后更新。

示例：`const {height, width} = Dimensions.get('window');`

**参数：**

| 名称                                                               | 类型   | 描述                                                                       |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------- |
| dim <div className="label basic required two-lines">必需</div> | string | 调用 `set` 时定义的维度名称。返回该维度的值。 |

> 对于 Android，`window` 尺寸将排除 `状态栏`（如果不透明）和 `底部导航栏` 所占用的大小

---

## 类型定义

### DimensionsValue

**属性：**

| 名称   | 类型                                | 描述                             |
| ------ | ----------------------------------- | --------------------------------------- |
| window | [ScaledSize](dimensions#scaledsize) | 可见应用窗口的大小。 |
| screen | [ScaledSize](dimensions#scaledsize) | 设备屏幕的大小。            |

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
