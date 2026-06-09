---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

> 如果你在寻找一种更广泛、面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。

一个用于使视图能够正确响应触摸的包装组件（仅限 Android）。在 Android 上，这个组件使用原生 state drawable 来显示触摸反馈。

目前它只支持将单个 View 实例作为子节点，因为它的实现方式是用另一个带有一些额外属性设置的 RCTView 节点替换该 View。

原生反馈可触摸组件的背景 drawable 可以通过 `background` 属性进行自定义。

## Example

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

# Reference

## Props

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `background`

决定将用于显示反馈的背景 drawable 类型。它接受一个包含 `type` 属性的对象，以及根据 `type` 不同而附加的额外数据。建议使用静态方法之一来生成该字典。

| Type               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

将其设置为 true，可将 ripple 效果添加到视图前景而不是背景。这在你的某个子视图本身就有背景，或者你在显示图片且不希望 ripple 被它们遮挡时很有用。

请先检查 TouchableNativeFeedback.canUseNativeForeground()，因为它仅适用于 Android 6.0 及以上版本。如果你在旧版本上使用它，会收到警告并回退到背景。

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

创建一个对象，表示 Android 主题中可选元素的默认背景（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制 ripple 效果的半径。

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，表示 Android 主题中无边框可选元素的默认背景（`?android:attr/selectableItemBackgroundBorderless`）。可用于 Android API 21 及以上版本。`rippleRadius` 参数控制 ripple 效果的半径。

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个对象，表示具有指定颜色（字符串形式）的 ripple drawable。如果属性 `borderless` 为 true，ripple 将在视图边界之外渲染（例如可参见原生 actionbar 按钮的这种行为）。此背景类型适用于 Android API 21+。

**Parameters:**

| Name         | Type    | Required | Description                                 |
| ------------ | ------- | -------- | ------------------------------------------- |
| color        | string  | Yes      | ripple 颜色                                  |
| borderless   | boolean | Yes      | ripple 是否可以在其边界之外渲染              |
| rippleRadius | ?number | No       | 控制 ripple 效果的半径                      |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
