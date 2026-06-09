---
id: touchablehighlight
title: TouchableHighlight
---

:::tip
如果你正在寻找一种更全面、面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。
:::

一个用于让视图正确响应触摸的包装组件。按下时，包裹视图的不透明度会降低，从而让底层颜色透出来，使视图变暗或带上色调。

底层颜色来自于将子组件包裹在一个新的 View 中，这可能会影响布局，并且如果使用不当，有时会导致不希望出现的视觉瑕疵，例如包裹视图的 `backgroundColor` 没有显式设置为不透明颜色时。

TouchableHighlight 必须只有一个子元素（不能是零个或多个）。如果你希望包含多个子组件，请将它们包裹在一个 View 中。

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

## Props

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `activeOpacity`

决定触摸激活时包裹视图应具有的不透明度。取值应在 0 到 1 之间。默认值为 0.85。需要设置 `underlayColor`。

| Type   |
| ------ |
| number |

---

### `onHideUnderlay`

在底层颜色隐藏后立即调用。

| Type     |
| -------- |
| function |

---

### `onShowUnderlay`

在底层颜色显示后立即调用。

| Type     |
| -------- |
| function |

---

### `ref`

一个 ref setter，在挂载时会被分配一个 [element node](element-nodes)。

---

### `style`

| Type       |
| ---------- |
| View.style |

---

### `underlayColor`

触摸激活时会透出的底层颜色。

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `hasTVPreferredFocus` <div className="label ios">iOS</div>

_(仅适用于 Apple TV)_ TV 首选焦点（请参阅 View 组件的文档）。

| Type |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个焦点向下（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个焦点向前（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个焦点向左（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个焦点向右（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个焦点向上（请参阅 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `testOnly_pressed`

适用于快照测试。

| Type |
| ---- |
| bool |
