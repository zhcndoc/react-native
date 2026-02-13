---
id: touchablenativefeedback
title: TouchableNativeFeedback
---

:::tip
如果你正在寻找一种更全面且更具未来兼容性的触摸交互处理方式，请查看 [Pressable](pressable.md) API。
:::

一个用于使视图正确响应触摸事件的包装器（仅限 Android）。在 Android 上，此组件使用原生状态 drawable 来显示触摸反馈。

目前它只支持拥有单个 View 实例作为子节点，因为它通过用另一个具有一些附加属性设置的 RCTView 节点替换该 View 实现。

原生反馈触摸的背景 drawable 可以通过 `background` 属性自定义。

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

### [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)

继承自 [TouchableWithoutFeedback Props](touchablewithoutfeedback.md#props)。

---

### `background`

决定将用于显示反馈的背景 drawable 类型。它接受一个带有 `type` 属性的对象，以及根据 `type` 不同的额外数据。建议使用静态方法之一生成该字典。

| 类型               |
| ------------------ |
| backgroundPropType |

---

### `useForeground`

设置为 true 时，会将波纹效果添加到视图的前景而非背景。这在你的子视图拥有自己背景，或者例如你正在展示图片且不希望波纹被覆盖时非常有用。

请先检查 TouchableNativeFeedback.canUseNativeForeground()，因为此功能仅在 Android 6.0 及以上版本可用。如果你在较旧版本上尝试使用，会收到警告并回退使用背景。

| 类型 |
| ---- |
| bool |

---

### `hasTVPreferredFocus` <div className="label android">Android</div>

电视优先焦点（请查看 View 组件文档）。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

电视向下的下一个焦点（请查看 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

电视向前的下一个焦点（请查看 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

电视向左的下一个焦点（请查看 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

电视向右的下一个焦点（请查看 View 组件文档）。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

电视向上的下一个焦点（请查看 View 组件文档）。

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

创建一个表示 Android 主题默认可选元素背景的对象（`?android:attr/selectableItemBackground`）。`rippleRadius` 参数控制波纹效果的半径。

---

### `SelectableBackgroundBorderless()`

```tsx
static SelectableBackgroundBorderless(
  rippleRadius: number | null,
): ThemeAttributeBackgroundPropType;
```

创建一个表示 Android 主题默认无边框可选元素背景的对象（`?android:attr/selectableItemBackgroundBorderless`）。仅在 Android API 21 及以上版本可用。`rippleRadius` 参数控制波纹效果的半径。

---

### `Ripple()`

```tsx
static Ripple(
  color: ColorValue,
  borderless: boolean,
  rippleRadius?: number | null,
): RippleBackgroundPropType;
```

创建一个表示具有指定颜色的波纹 drawable 的对象（颜色为字符串）。如果 `borderless` 属性为 true，波纹会渲染在视图边界之外（例如原生 ActionBar 按钮的行为）。此背景类型仅在 Android API 21+ 可用。

**参数：**

| 名称         | 类型    | 必填 | 描述                                 |
| ------------ | ------- | ---- | ------------------------------------ |
| color        | string  | 是   | 波纹颜色                            |
| borderless   | boolean | 是   | 波纹是否可以渲染在边界外           |
| rippleRadius | ?number | 否   | 控制波纹效果的半径                  |

---

### `canUseNativeForeground()`

```tsx
static canUseNativeForeground(): boolean;
```
