---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

:::tip
如果你正在寻找一种更全面且面向未来的触摸输入处理方式，请查看 [Pressable](pressable.md) API
:::

用于使视图正确响应触摸操作的包装器（仅限 Android）。在 Android 上，此组件使用原生 state drawable 来显示触摸反馈

目前它只支持将单个 View 实例作为子节点，因为它的实现方式是将该 View 替换为另一个具有一些额外属性的 RCTView 节点实例

原生反馈可触摸组件的背景 drawable 可以通过 `background` 属性进行自定义

## 示例

```SnackPlayer name=TouchableNativeFeedback%20Android%20Component%20Example&supportedPlatforms=android
import {useState} from 'react';
import {Text, View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableNativeFeedback
          onPress={() => {
            setRippleColor(randomHexColor());
            setRippleOverflow(!rippleOverflow);
          }}
          background={TouchableNativeFeedback.Ripple(
            rippleColor,
            rippleOverflow,
          )}>
          <View style={styles.touchable}>
            <Text style={styles.text}>TouchableNativeFeedback</Text>
          </View>
        </TouchableNativeFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const randomHexColor = () => {
  return '#000000'.replace(/0/g, function () {
    return Math.round(Math.random() * 16).toString(16);
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  touchable: {
    flex: 0.33,
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
    borderColor: 'black',
    borderWidth: 1,
  },
  text: {
    alignSelf: 'center',
  },
});

export default App;
```

---

# 参考

## 属性

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

---

### `background`

确定用于显示反馈的背景 drawable 类型。它接收一个包含 `type` 属性以及取决于 `type` 的额外数据的对象。建议使用静态方法之一来生成该字典

| Type               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

设置为 true 可将 ripple 效果添加到视图的前景，而不是背景。这在以下情况下很有用：某个子视图有自己的背景，或者你正在显示图像等内容，并且不希望 ripple 被它们覆盖

请先检查 TouchableNativeFeedback.canUseNativeForeground()，因为这仅在 Android 6.0 及更高版本上可用。如果你尝试在更早版本上使用它，将会收到警告，并回退到 background

| Type |
| ---- |
| bool |

---

### `hasTVPreferredFocus` <div className="label android">Android</div>

TV 首选焦点（请参阅 View 组件的文档）

| Type |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个向下焦点（请参阅 View 组件的文档）

| Type   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个向前焦点（请参阅 View 组件的文档）

| Type   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个向左焦点（请参阅 View 组件的文档）

| Type   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个向右焦点（请参阅 View 组件的文档）

| Type   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个向上焦点（请参阅 View 组件的文档）

| Type   |
| ------ |
| number |

## 方法

### `SelectableBackground()`

```tsx
static SelectableBackground(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，用于表示 android 主题中可选择元素的默认背景（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制 ripple 效果的半径

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，用于表示 android 主题中无边框可选择元素的默认背景（`?android:attr/selectableItemBackgroundBorderless`）。在 android API level 21 及更高版本上可用。`rippleRadius` 参数控制 ripple 效果的半径

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个对象，用于表示具有指定颜色（字符串）的 ripple drawable。如果属性 `borderless` 的计算结果为 true，ripple 将在视图边界之外渲染（原生 actionbar 按钮就是这种行为的示例）。此背景类型在 Android API level 21 及更高版本上可用

**参数：**

| Name         | Type    | Required | Description                     |
| ------------ | ------- | -------- | ------------------------------- |
| color        | string  | Yes      | ripple 颜色                     |
| borderless   | boolean | Yes      | ripple 是否可以在其边界之外渲染 |
| rippleRadius | ?number | No       | 控制 ripple 效果的半径          |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
