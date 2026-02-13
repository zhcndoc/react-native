---
id: touchablehighlight
title: TouchableHighlight
---

:::tip
如果您正在寻找一种更全面且面向未来的触摸输入处理方法，请查看 [Pressable](pressable.md) API。
:::

用于让视图能够正确响应触摸的包装器。在按下时，包装视图的不透明度会降低，从而允许底层颜色透出，变暗或给视图着色。

底层颜色是通过将子组件包装在一个新的 View 中实现的，这可能会影响布局，并且如果使用不当，比如没有显式将被包装视图的 backgroundColor 设置为不透明的颜色，可能会导致不想要的视觉伪影。

TouchableHighlight 必须有且仅有一个子元素（不能是零个或多个）。如果您想包含多个子组件，请将它们包装在一个 View 中。

```tsx
function MyComponent(props: MyComponentProps) {
  return (
    <View {...props} style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>My Component</Text>
    </View>
  );
}

<TouchableHighlight
  activeOpacity={0.6}
  underlayColor="#DDDDDD"
  onPress={() => alert('Pressed!')}>
  <MyComponent />
</TouchableHighlight>;
```

## 示例

```SnackPlayer name=TouchableHighlight%20Example
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TouchableHighlightExample = () => {
  const [count, setCount] = useState(0);
  const onPress = () => setCount(count + 1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableHighlight onPress={onPress}>
          <View style={styles.button}>
            <Text>Touch Here</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{count || null}</Text>
        </View>
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
  countText: {
    color: '#FF00FF',
  },
});

export default TouchableHighlightExample;
```

---

# 参考资料

## Props

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `activeOpacity`

决定触摸激活时被包装视图的不透明度。该值应在 0 到 1 之间。默认为 0.85。需要设置 `underlayColor`。

| 类型   |
| ------ |
| number |

---

### `onHideUnderlay`

当底层颜色隐藏后立即调用。

| 类型     |
| -------- |
| function |

---

### `onShowUnderlay`

当底层颜色显示后立即调用。

| 类型     |
| -------- |
| function |

---

### `ref`

一个 ref 设置器，组件挂载后会被赋值为一个 [element node](element-nodes)。

---

### `style`

| 类型       |
| ---------- |
| View.style |

---

### `underlayColor`

触摸激活时显示的底层颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_（仅限 Apple TV）_ TV 首选焦点（参见 View 组件文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 向下的下一个焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 向前的下一个焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 向左的下一个焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 向右的下一个焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 向上的下一个焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `testOnly_pressed`

适用于快照测试。

| 类型 |
| ---- |
| bool |
