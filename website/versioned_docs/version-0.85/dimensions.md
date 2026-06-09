---
id: dimensions
title: 尺寸
---

:::info
[`useWindowDimensions`](usewindowdimensions) 是 React 组件首选的 API。与 `Dimensions` 不同，它会随着窗口尺寸的变化而更新。这与 React 的范式非常契合。
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
虽然尺寸会立即可用，但它们可能会变化（例如由于设备旋转、折叠屏设备等），因此任何依赖这些常量的渲染逻辑或样式都应尽量在每次渲染时调用此函数，而不是缓存该值（例如使用内联样式，而不是在 `StyleSheet` 中设置值）。
:::

如果你的目标设备是折叠屏设备，或者设备可能会改变屏幕尺寸或应用窗口尺寸，你可以使用 `Dimensions` 模块中提供的事件监听器，如下例所示。

## 示例

```SnackPlayer name=Dimensions%20Example
import {useState, useEffect} from 'react';
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

添加事件处理程序。支持的事件：

- `change`：当 `Dimensions` 对象中的某个属性发生变化时触发。事件处理程序的参数是一个 [`DimensionsValue`](#dimensionsvalue) 类型对象。

---

### `get()`

```tsx
static get(dim: 'window' | 'screen'): ScaledSize;
```

初始尺寸在调用 `runApplication` 之前就已设置，因此在运行任何其他 `require` 之前它们应该已经可用，但之后可能会更新。

示例：`const {height, width} = Dimensions.get('window');`

**参数：**

| 名称                                                               | 类型   | 描述                                                                       |
| ------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------- |
| dim <div className="label basic required two-lines">必填</div> | string | 调用 `set` 时定义的尺寸名称。返回该尺寸的值。 |

:::note
在 Android 上，`window` 尺寸会减去状态栏（如果未设置为透明）和底部导航栏的大小。
:::

## 类型定义

### DimensionsValue

**属性：**

| 名称   | 类型                                | 描述                             |
| ------ | ----------------------------------- | -------------------------------- |
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
