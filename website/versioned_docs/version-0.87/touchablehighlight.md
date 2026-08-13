---
id: touchablehighlight
title: TouchableHighlight
---

:::tip
如果你正在寻找一种更全面且面向未来的触摸输入处理方式，请查看 [Pressable](pressable.md) API。
:::

用于使视图正确响应触摸的包装器。按下时，包装视图的不透明度会降低，从而使底层颜色透出，使视图变暗或着色。

底层来自将子元素包装在一个新的 View 中，这可能会影响布局，如果使用不当，有时还会导致不需要的视觉瑕疵，例如包装视图的 backgroundColor 未明确设置为不透明颜色。

TouchableHighlight 必须有一个子元素（不能没有，也不能多于一个）。如果你希望包含多个子组件，请将它们包装在一个 View 中。

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
import {useState} from 'react';
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

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `activeOpacity`

确定触摸处于活动状态时包装视图的不透明度。值应介于 0 和 1 之间。默认为 0.85。需要设置 `underlayColor`。

| Type   |
| ------ |
| number |

---

### `onHideUnderlay`

底层隐藏后立即调用。

| Type     |
| -------- |
| function |

---

### `onShowUnderlay`

底层显示后立即调用。

| Type     |
| -------- |
| function |

---

### `ref`

在挂载时，将被分配一个 [element node](element-nodes) 的 ref setter。

---

### `style`

| Type       |
| ---------- |
| View.style |

---

### `underlayColor`

触摸处于活动状态时将透出的底层颜色。

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_（仅限 Apple TV）_ TV 首选焦点（请参阅 View 组件的文档）。

| Type |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 向下的下一个焦点（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 向前的下一个焦点（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 向左的下一个焦点（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 向右的下一个焦点（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 向上的下一个焦点（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `testOnly_pressed`

便于快照测试。

| Type |
| ---- |
| bool |
