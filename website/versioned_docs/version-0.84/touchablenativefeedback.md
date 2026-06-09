---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

:::tip
如果你在寻找一种更全面且更具前瞻性的方式来处理基于触摸的输入，可以查看 [Pressable](pressable.md) API。
:::

一个用于让视图正确响应触摸的包装器（仅限 Android）。在 Android 上，此组件使用原生状态 drawable 来显示触摸反馈。

目前它只支持将单个 View 实例作为子节点，因为它的实现方式是用另一个带有一些额外属性设置的 RCTView 节点替换该 View。

原生反馈触摸组件的背景 drawable 可以通过 `background` 属性自定义。

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

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `background`

决定将用于显示反馈的背景 drawable 类型。它接受一个带有 `type` 属性的对象，以及取决于 `type` 的额外数据。建议使用静态方法之一来生成该字典。

| 类型               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

设置为 true 时，将 ripple 效果添加到视图前景，而不是背景。如果你的某个子视图有自己的背景，或者你正在显示图片且不希望 ripple 被它们遮住，这会很有用。

请先检查 `TouchableNativeFeedback.canUseNativeForeground()`，因为这仅适用于 Android 6.0 及以上版本。如果你在旧版本上使用它，会收到警告并回退到背景模式。

| 类型 |
| ---- |
| bool |

---

### `hasTVPreferredFocus` <div className="label android">Android</div>

TV 首选焦点（参见 View 组件的文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个向下焦点（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个向前焦点（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个向左焦点（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个向右焦点（参见 View 组件的文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个向上焦点（参见 View 组件的文档）。

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

创建一个表示 Android 主题中可选元素默认背景的对象（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制 ripple 效果的半径。

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个表示 Android 主题中无边框可选元素默认背景的对象（`?android:attr/selectableItemBackgroundBorderless`）。适用于 Android API 级别 21+。`rippleRadius` 参数控制 ripple 效果的半径。

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个表示指定颜色（字符串形式）的 ripple drawable 的对象。如果属性 `borderless` 的值为 true，ripple 将在视图边界之外渲染（例如原生 actionbar 按钮的行为）。此背景类型适用于 Android API 级别 21+。

**参数：**

| 名称         | 类型    | 必需 | 描述                                 |
| ------------ | ------- | ---- | ------------------------------------ |
| color        | string  | 是   | ripple 颜色                             |
| borderless   | boolean | 是   | ripple 是否可以在其边界之外渲染       |
| rippleRadius | ?number | 否   | 控制 ripple 效果的半径               |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
