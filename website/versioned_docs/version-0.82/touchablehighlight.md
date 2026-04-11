---
id: touchablehighlight
title: TouchableHighlight
---

:::tip
如果您正在寻找一种更广泛且面向未来的处理触摸输入的方式，请查看 [Pressable](pressable.md) API。
:::

一个用于使视图正确响应触摸的包装器。按下时，被包裹视图的不透明度会降低，从而允许底色显示出来，使视图变暗或着色。

底色来自于将子组件包裹在一个新的 View 中，这可能会影响布局，如果未正确使用，有时会导致不必要的视觉伪影，例如如果被包裹视图的 backgroundColor 未显式设置为不透明颜色。

TouchableHighlight 必须只有一个子组件（不能为零或多于一个）。如果您希望有多个子组件，请将它们包裹在一个 View 中。

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

# 参考

## 属性

### [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)。

---

### `activeOpacity`

确定触摸激活时被包裹视图的不透明度应为多少。值应在 0 到 1 之间。默认为 0.85。需要设置 `underlayColor`。

| 类型   |
| ------ |
| number |

---

### `onHideUnderlay`

在底色隐藏后立即调用。

| 类型     |
| -------- |
| function |

---

### `onShowUnderlay`

在底色显示后立即调用。

| 类型     |
| -------- |
| function |

---

### `ref`

一个 ref 设置器，挂载时将被分配一个 [元素节点](element-nodes)。

---

### `style`

| 类型       |
| ---------- |
| View.style |

---

### `underlayColor`

触摸激活时将显示出来的底色颜色。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅限 Apple TV)_ TV 首选焦点（参见 View 组件文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个向下焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个向前焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个向左焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个向右焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个向上焦点（参见 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `testOnly_pressed`

便于快照测试。

| 类型 |
| ---- |
| bool |
