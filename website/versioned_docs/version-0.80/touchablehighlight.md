---
id: touchablehighlight
title: TouchableHighlight
---

> 如果你在寻找一种更全面、面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。

用于让视图正确响应触摸的包装器。按下时，被包裹视图的透明度会降低，这样底层颜色就会透出来，使视图变暗或带有色调。

底层颜色来自于将子元素包裹在一个新的 View 中，这可能会影响布局；如果使用不当，有时还会导致不希望出现的视觉瑕疵，例如没有明确将被包裹视图的 `backgroundColor` 设置为不透明颜色。

TouchableHighlight 必须有一个子元素（不能为零个，也不能多于一个）。如果你希望拥有多个子组件，请将它们包裹在一个 View 中。

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
            <Text>点按此处</Text>
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

决定触摸激活时被包裹视图的透明度。该值应在 0 到 1 之间。默认值为 0.85。需要设置 `underlayColor`。

| 类型   |
| ------ |
| number |

---

### `onHideUnderlay`

在底层隐藏后立即调用。

| 类型     |
| -------- |
| function |

---

### `onShowUnderlay`

在底层显示后立即调用。

| 类型     |
| -------- |
| function |

---

### `style`

| 类型       |
| ---------- |
| View.style |

---

### `underlayColor`

触摸激活时会透出的底层颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅限 Apple TV)_ TV 首选焦点（请参阅 View 组件的文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个焦点方向为下（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个焦点方向为前（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个焦点方向为左（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个焦点方向为右（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个焦点方向为上（请参阅 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `testOnly_pressed`

便于快照测试。

| 类型 |
| ---- |
| bool |
