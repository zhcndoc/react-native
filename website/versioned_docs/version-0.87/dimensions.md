---
id: dimensions
title: Dimensions
---

:::info
[`useWindowDimensions`](usewindowdimensions) 是 React 组件的首选 API。与 `Dimensions` 不同，它会随着窗口尺寸的更新而更新。这与 React 范式配合得很好。
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
尽管尺寸会立即可用，但它们可能会发生变化（例如由于设备旋转、可折叠设备等），因此任何依赖于这些常量的渲染逻辑或样式都应尝试在每次渲染时调用此函数，而不是缓存该值（例如，使用内联样式，而不是在 `StyleSheet` 中设置值）。
:::

如果你的目标设备是可折叠设备，或者设备可以改变屏幕尺寸或应用窗口尺寸，则可以使用 Dimensions 模块中提供的事件监听器，如下面的示例所示。

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

- `change`：当 `Dimensions` 对象中的属性发生变化时触发。传递给事件处理程序的参数是 [`DimensionsValue`](#dimensionsvalue) 类型的对象。

---

### `get()`

```tsx
static get(dim: 'window' | 'screen'): ScaledSize;
```

初始尺寸会在调用 `runApplication` 之前设置，因此在运行任何其他 require 之前就应该可用，但之后可能会更新。

示例：`const {height, width} = Dimensions.get('window');`

**参数：**

| 名称                                                           | 类型   | 描述                                          |
| -------------------------------------------------------------- | ------ | --------------------------------------------- |
| dim <div className="label basic required two-lines">必填</div> | string | 调用 `set` 时定义的尺寸名称。返回该尺寸的值。 |

:::note
对于 Android，`window` 尺寸会减去状态栏（如果不是半透明状态）和底部导航栏的尺寸。
:::

## 类型定义

### DimensionsValue

**属性：**

| 名称   | 类型                                | 描述                 |
| ------ | ----------------------------------- | -------------------- |
| window | [ScaledSize](dimensions#scaledsize) | 可见应用窗口的尺寸。 |
| screen | [ScaledSize](dimensions#scaledsize) | 设备屏幕的尺寸。     |

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
