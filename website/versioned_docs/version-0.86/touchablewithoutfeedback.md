---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

:::tip
如果你在寻找一种更全面、面向未来的方式来处理基于触摸的输入，可以查看 [Pressable](pressable.md) API。
:::

除非你有非常充分的理由，否则不要使用。所有响应按压的元素在被触摸时都应该有可视反馈。

`TouchableWithoutFeedback` 只支持一个子元素。如果你希望有多个子组件，请将它们包裹在一个 View 中。重要的是，`TouchableWithoutFeedback` 的工作方式是克隆其子元素并将 responder props 应用到它上面。因此，任何中间组件都必须将这些 props 传递给底层的 React Native 组件。

## 用法模式

```tsx
function MyComponent(props: MyComponentProps) {
  return (
    <View {...props} style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>我的组件</Text>
    </View>
  );
}

<TouchableWithoutFeedback onPress={() => alert('已按下！')}>
  <MyComponent />
</TouchableWithoutFeedback>;
```

## 示例

```SnackPlayer name=TouchableWithoutFeedback
import {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TouchableWithoutFeedbackExample = () => {
  const [count, setCount] = useState(0);

  const onPress = () => {
    setCount(count + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>计数：{count}</Text>
        </View>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.button}>
            <Text>点这里</Text>
          </View>
        </TouchableWithoutFeedback>
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

export default TouchableWithoutFeedbackExample;
```

---

# 参考

## Props

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，表示当启用颜色反转时，此视图是否应被反转。值为 `true` 会告诉视图即使在启用颜色反转时也不要被反转。

更多信息请参见 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型    |
| ------- |
| Boolean |

---

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素。默认情况下，所有可触摸元素都是可访问的。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与该元素交互时所朗读的文本。默认情况下，该标签通过遍历所有子元素并收集所有 `Text` 节点、以空格分隔的方式构建。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

表示屏幕阅读器在用户与该元素交互时应使用的语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityHint`

无障碍提示可帮助用户理解在无障碍元素上执行操作时会发生什么，前提是这一结果不能从无障碍标签中明确看出。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 会向辅助技术的用户传达组件的用途。

`accessibilityRole` 可以是以下值之一：

- `'none'` - 当元素没有角色时使用。
- `'button'` - 当元素应被视为按钮时使用。
- `'link'` - 当元素应被视为链接时使用。
- `'search'` - 当文本输入框元素也应被视为搜索框时使用。
- `'image'` - 当元素应被视为图像时使用。例如，它可以与 button 或 link 组合使用。
- `'keyboardkey'` - 当元素充当键盘按键时使用。
- `'text'` - 当元素应被视为不可更改的静态文本时使用。
- `'adjustable'` - 当元素可以被“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且同时也是图像时使用。
- `'header'` - 当元素充当内容区域的标题时使用（例如导航栏的标题）。
- `'summary'` - 当应用首次启动时，元素可用于提供对当前应用状态的快速摘要时使用。
- `'alert'` - 当元素包含应呈现给用户的重要文本时使用。
- `'checkbox'` - 当元素表示可勾选、取消勾选或具有混合勾选状态的复选框时使用。
- `'combobox'` - 当元素表示组合框，允许用户在多个选项中选择时使用。
- `'menu'` - 当组件是一个选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于表示菜单中的一项。
- `'progressbar'` - 用于表示指示任务进度的组件。
- `'radio'` - 用于表示单选按钮。
- `'radiogroup'` - 用于表示一组单选按钮。
- `'scrollbar'` - 用于表示滚动条。
- `'spinbutton'` - 用于表示打开选项列表的按钮。
- `'switch'` - 用于表示可开启和关闭的开关。
- `'tab'` - 用于表示选项卡。
- `'tablist'` - 用于表示选项卡列表。
- `'timer'` - 用于表示计时器。
- `'toolbar'` - 用于表示工具栏（包含操作按钮或组件的容器）。

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

描述辅助技术用户看到的组件当前状态。

更多信息请参见 [无障碍指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名和标签。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| array |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等到更改完成后再通知用户更新内容。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示一个可勾选元素的状态。该字段既可以接受布尔值，也可以接受 `"mixed"` 字符串来表示混合勾选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可以被感知但处于禁用状态，因此不可编辑或无法操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示一个可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-hidden`

表示该元素是否对辅助技术隐藏。

例如，在一个包含兄弟视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义一个用于标记交互元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术和用户对该实时区域更新的预期类型。

- **off** 辅助功能服务不应宣布此视图的更改。
- **polite** 辅助功能服务应宣布此视图的更改。
- **assertive** 辅助功能服务应打断当前语音，立即宣布此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

一个布尔值，表示 VoiceOver 是否应忽略该接收器同级视图中的元素。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-selected`

表示一个可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数的唯一参数是一个事件，其中包含要执行的操作名称。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；对于基于范围的组件，例如滑块和进度条，它包含范围信息（最小值、当前值和最大值）。

更多信息请参见 [无障碍指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。其优先级高于 `accessibilityValue` 属性中的 `max` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。其优先级高于 `accessibilityValue` 属性中的 `min` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。其优先级高于 `accessibilityValue` 属性中的 `now` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuetext`

表示该组件的文本描述。其优先级高于 `accessibilityValue` 属性中的 `text` 值。

| 类型   |
| ------ |
| string |

---

### `delayLongPress`

从 `onPressIn` 到调用 `onLongPress` 的持续时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `delayPressIn`

从触摸开始到调用 `onPressIn` 之前的持续时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `delayPressOut`

从触摸释放到调用 `onPressOut` 之前的持续时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `disabled`

如果为 true，则禁用此组件的所有交互。

| 类型 |
| ---- |
| bool |

---

### `hitSlop`

定义你的触摸可以在离按钮多远的位置开始。这个值会在离开按钮时加到 `pressRetentionOffset` 上。

:::note
触摸区域绝不会超出父视图边界，并且如果一次触摸命中两个重叠视图，兄弟视图的 Z-index 始终优先。
:::

| 类型                   |
| ---------------------- |
| [Rect](rect) or number |

### `id`

用于从原生代码中定位此视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `onBlur`

当项目失去焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onFocus`

当项目获得焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onLayout`

在挂载时以及布局变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

如果 `onPressIn` 之后的持续时间超过 370 毫秒，则调用。此时间可通过 [`delayLongPress`](#delaylongpress) 自定义。

| 类型     |
| -------- |
| function |

---

### `onPress`

当触摸被释放时调用，但如果被取消则不会调用（例如，被滚动视图抢占响应锁）。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

在可触摸元素被按下后立即调用，甚至早于 `onPress`。这在发起网络请求时很有用。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressOut`

在触摸释放后立即调用，甚至早于 `onPress`。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `pressRetentionOffset`

当滚动视图被禁用时，它定义了你的触摸在使按钮失效之前可以偏离按钮多远。一旦失效，尝试把它移回去，你会看到按钮又被重新激活了！在滚动视图被禁用时，可以来回移动几次。确保传入一个常量以减少内存分配。

| 类型                   |
| ---------------------- |
| [Rect](rect) or number |

### `nativeID`

| 类型   |
| ------ |
| string |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 true，则触摸时不会播放系统声音。

| 类型    |
| ------- |
| Boolean |
