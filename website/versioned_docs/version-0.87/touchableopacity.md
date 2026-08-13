---
id: touchableopacity
title: TouchableOpacity
---

:::tip
如果你正在寻找一种更全面且面向未来的触摸输入处理方式，请查看 [Pressable](pressable.md) API。
:::

用于使视图正确响应触摸的包装器。按下时，包装视图的不透明度会降低，使其变暗。

不透明度通过将子元素包装在 `Animated.View` 中进行控制，该元素会被添加到视图层次结构中。请注意，这可能会影响布局。

## 示例

```SnackPlayer name=TouchableOpacity%20Example
import {useState} from 'react';
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

继承 [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)。

---

### `style`

| 类型                           |
| ------------------------------ |
| [View.style](view-style-props) |

---

### `activeOpacity`

确定触摸处于活动状态时包装视图的不透明度。默认为 `0.2`。

| 类型   |
| ------ |
| number |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

（仅限 Apple TV）TV 首选焦点（请参阅 View 组件的文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 向下的下一个焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 向前的下一个焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 向左的下一个焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 向右的下一个焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 向上的下一个焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `ref`

一个 ref setter，在挂载时会被赋值为一个 [元素节点](element-nodes)。
