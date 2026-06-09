---
id: touchablehighlight
title: TouchableHighlight
---

:::tip
如果你正在寻找一种更全面、面向未来的方式来处理基于触摸的输入，可以看看 [Pressable](pressable.md) API。
:::

用于让视图正确响应触摸的包装组件。按下时，被包装视图的透明度会降低，从而使底层颜色显示出来，让视图变暗或带有色调。

底层效果来自于将子元素包裹在一个新的 View 中，这可能会影响布局；如果使用不当，有时还会导致不希望出现的视觉瑕疵，例如没有明确将被包装视图的 `backgroundColor` 设置为不透明颜色时。

TouchableHighlight 必须只有一个子元素（不能是零个，也不能多于一个）。如果你希望有多个子组件，请将它们包裹在一个 View 中。

```tsx
function MyComponent(props: MyComponentProps) {
  return (
    <View {...props} style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>我的组件</Text>
    </View>
  );
}

<TouchableHighlight
  activeOpacity={0.6}
  underlayColor="#DDDDDD"
  onPress={() => alert('已按下！')}>
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
            <Text>点这里</Text>
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

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `activeOpacity`

确定触摸激活时被包装视图的不透明度应是多少。该值应介于 0 和 1 之间。默认值为 0.85。需要设置 `underlayColor`。

| 类型   |
| ------ |
| number |

---

### `onHideUnderlay`

在底层效果隐藏后立即调用。

| 类型     |
| -------- |
| function |

---

### `onShowUnderlay`

在底层效果显示后立即调用。

| 类型     |
| -------- |
| function |

---

### `ref`

一个 ref 设置器，在挂载时会被分配一个 [元素节点](element-nodes)。

---

### `style`

| 类型       |
| ---------- |
| View.style |

---

### `underlayColor`

在触摸激活时会透出的底层颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅限 Apple TV)_ TV 首选焦点（参见 View 组件的文档）。

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

### `testOnly_pressed`

用于快照测试的便捷属性。

| 类型 |
| ---- |
| bool |
