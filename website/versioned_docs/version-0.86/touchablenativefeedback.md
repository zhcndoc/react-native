---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

:::tip
如果你正在寻找一种更全面且更具前瞻性的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。
:::

一个用于让视图能够正确响应触摸的包装组件（仅限 Android）。在 Android 上，这个组件使用原生状态 drawable 来显示触摸反馈。

目前它只支持将单个 View 实例作为子节点，因为它的实现方式是用另一个带有一些额外属性设置的 RCTView 节点实例替换该 View。

原生反馈触摸组件的背景 drawable 可以通过 `background` 属性自定义。

## Example

```SnackPlayer name=TouchableNativeFeedback%20Android%20Component%20Example&supportedPlatforms=android
import React, {useState} from 'react';
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

# Reference

## Props

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `background`

决定将用于显示反馈的背景 drawable 类型。它接受一个带有 `type` 属性的对象，以及取决于 `type` 的额外数据。建议使用静态方法之一来生成该字典。

| Type               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

设置为 true 时，会将涟漪效果添加到视图的前景，而不是背景。如果你的某个子视图本身就有背景，或者你正在显示图片等内容，并且不希望涟漪被它们遮挡，这会很有用。

请先检查 TouchableNativeFeedback.canUseNativeForeground()，因为这仅在 Android 6.0 及以上可用。如果你在较旧版本上使用它，你会收到警告并回退到背景。

| Type |
| ---- |
| bool |

---

### `hasTVPreferredFocus` <div className="label android">Android</div>

TV 首选焦点（参见 View 组件的文档）。

| Type |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

TV 下一个焦点向下（参见 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

TV 下一个焦点向前（参见 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

TV 下一个焦点向左（参见 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

TV 下一个焦点向右（参见 View 组件的文档）。

| Type   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

TV 下一个焦点向上（参见 View 组件的文档）。

| Type   |
| ------ |
| number |

## Methods

### `SelectableBackground()`

```tsx
static SelectableBackground(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，表示 Android 主题中可选元素的默认背景（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制涟漪效果的半径。

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，表示 Android 主题中无边界可选元素的默认背景（`?android:attr/selectableItemBackgroundBorderless`）。适用于 Android API 21 及以上。`rippleRadius` 参数控制涟漪效果的半径。

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个表示具有指定颜色（字符串形式）的 ripple drawable 的对象。如果属性 `borderless` 的值为 true，则涟漪会在视图边界之外渲染（例如原生 actionbar 按钮的行为）。此背景类型适用于 Android API 21 及以上。

**参数：**

| Name         | Type    | Required | Description                                 |
| ------------ | ------- | -------- | ------------------------------------------- |
| color        | string  | Yes      | 涟漪颜色                                    |
| borderless   | boolean | Yes      | 涟漪是否可以在其边界之外渲染                 |
| rippleRadius | ?number | No       | 控制涟漪效果的半径                          |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
