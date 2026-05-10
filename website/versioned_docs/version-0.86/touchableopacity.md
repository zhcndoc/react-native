---
id: touchableopacity
title: TouchableOpacity
---

:::tip
如果你正在寻找一种更全面且面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。
:::

用于让视图正确响应触摸的包装器。按下时，被包装视图的透明度会降低，使其变暗。

透明度是通过将子组件包裹在一个 `Animated.View` 中来控制的，该组件会被添加到视图层级中。请注意，这可能会影响布局。

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

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `style`

| 类型                           |
| ------------------------------ |
| [View.style](view-style-props) |

---

### `activeOpacity`

决定触摸激活时被包装视图的透明度应为多少。默认值为 `0.2`。

| 类型   |
| ------ |
| number |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_（仅限 Apple TV）_ TV 首选焦点（参见 View 组件的文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个焦点向下（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个焦点向前（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个焦点向左（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个焦点向右（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个焦点向上（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `ref`

一个 ref setter，在挂载时会被分配一个 [element node](element-nodes)。
