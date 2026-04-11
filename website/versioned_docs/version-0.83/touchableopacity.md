---
id: touchableopacity
title: TouchableOpacity
---

:::tip
如果你正在寻找一种更全面且具有未来兼容性的触摸输入处理方式，可以查看 [Pressable](pressable.md) API。
:::

一个用于使视图正确响应触摸的包装组件。在按下时，包装视图的透明度会降低，使其变暗。

透明度通过将子组件包裹在一个 `Animated.View` 中来控制，该组件被添加到视图层级中。请注意，这可能会影响布局。

## 示例

```SnackPlayer name=TouchableOpacity%20Example
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [count, setCount] = useState(0);
  const onPress = () => setCount(prevCount => prevCount + 1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.countContainer}>
          <Text>Count: {count}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text>Press Here</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
});

export default App;
```

---

# 参考

## 属性

### [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)。

---

### `style`

| 类型                           |
| ------------------------------ |
| [View.style](view-style-props) |

---

### `activeOpacity`

确定触摸激活时，包装视图的透明度。默认值为 `0.2`。

| 类型   |
| ------ |
| number |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅限 Apple TV)_ TV 优先聚焦（详见 View 组件文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 向下下一个聚焦元素（详见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 向前下一个聚焦元素（详见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 向左下一个聚焦元素（详见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 向右下一个聚焦元素（详见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 向上下一个聚焦元素（详见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `ref`

一个 ref 设置器，组件挂载时会被赋值为一个 [元素节点](element-nodes)。
