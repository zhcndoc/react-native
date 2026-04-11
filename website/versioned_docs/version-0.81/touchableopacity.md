---
id: touchableopacity
title: TouchableOpacity
---

> 如果你正在寻找一种更广泛且面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。

一个使视图能够正确响应触摸的包装器。按下时，被包装视图的不透明度会降低，使其变暗。

不透明度是通过将子元素包装在 `Animated.View` 中来控制的，该视图被添加到视图层次结构中。请注意，这可能会影响布局。

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

继承 [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)。

---

### `style`

| 类型                           |
| ------------------------------ |
| [View.style](view-style-props) |

---

### `activeOpacity`

确定触摸激活时被包装视图的不透明度应为多少。默认为 `0.2`。

| 类型   |
| ------ |
| number |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅限 Apple TV)_ TV 首选焦点（请参阅 View 组件的文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个向下焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个向前焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个向左焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个向右焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个向上焦点（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |
