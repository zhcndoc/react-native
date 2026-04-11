---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

:::tip
如果你正在寻找一种更广泛且面向未来的处理触摸输入的方式，请查看 [Pressable](pressable.md) API。
:::

一个用于使视图正确响应触摸的包装器（仅限 Android）。在 Android 上，此组件使用原生状态 drawable 来显示触摸反馈。

目前它仅支持将单个 View 实例作为子节点，因为它是通过用另一个设置了一些额外属性的 RCTView 节点实例替换该 View 来实现的。

原生反馈触摸的背景 drawable 可以通过 `background` 属性进行自定义。

## 示例

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

# 参考

## 属性

### [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)

继承 [TouchableWithoutFeedback 属性](touchablewithoutfeedback.md#props)。

---

### `background`

确定将用于显示反馈的背景 drawable 的类型。它接受一个带有 `type` 属性的对象，以及取决于 `type` 的额外数据。建议使用其中一种静态方法来生成该字典。

| 类型               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

设置为 true 可将涟漪效果添加到视图的前景，而不是背景。如果你的某个子视图有自己的背景，或者你例如正在显示图像，并且你不希望涟漪被它们覆盖，这很有用。

首先检查 TouchableNativeFeedback.canUseNativeForeground()，因为这仅在 Android 6.0 及以上版本可用。如果你尝试在旧版本上使用此功能，你将收到警告并回退到背景。

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

| 类型   |
| ------ |
| number |

## 方法

### `SelectableBackground()`

```tsx
static SelectableBackground(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，表示可选择元素的 Android 主题默认背景（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制涟漪效果的半径。

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个对象，表示无边框可选择元素的 Android 主题默认背景（`?android:attr/selectableItemBackgroundBorderless`）。在 Android API 级别 21+ 上可用。`rippleRadius` 参数控制涟漪效果的半径。

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个对象，表示具有指定颜色（作为字符串）的涟漪 drawable。如果属性 `borderless` 计算为 true，涟漪将在视图边界外渲染（参见原生操作栏按钮作为该行为的示例）。此背景类型在 Android API 级别 21+ 上可用。

**参数：**

| 名称         | 类型    | 是否必填 | 描述                                 |
| ------------ | ------- | -------- | ------------------------------------------- |
| color        | string  | 是      | 涟漪颜色                            |
| borderless   | boolean | 是      | 涟漪是否可以渲染在其边界之外 |
| rippleRadius | ?number | 否       | 控制涟漪效果的半径    |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
