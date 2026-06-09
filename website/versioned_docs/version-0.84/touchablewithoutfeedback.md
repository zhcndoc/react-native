---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

:::tip
如果你正在寻找一种更全面、面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。
:::

除非你有非常充分的理由，否则不要使用。所有对按压有响应的元素在被触摸时都应该有视觉反馈。

`TouchableWithoutFeedback` 只支持一个子元素。如果你希望有多个子组件，请将它们包裹在一个 View 中。需要特别注意的是，`TouchableWithoutFeedback` 的工作方式是克隆其子元素并将 responder props 应用到它上面。因此，任何中间组件都必须将这些 props 传递给底层的 React Native 组件。

## 使用模式

```tsx
function MyComponent(props: MyComponentProps) {
  return (
    <View {...props} style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>我的组件</Text>
    </View>
  );
}

<TouchableWithoutFeedback onPress={() => alert('Pressed!')}>
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

## 属性

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，表示当开启颜色反转时，此视图应该或不应该被反转。值为 `true` 时，即使开启了颜色反转，也会告知视图不要被反转。

更多信息请参阅 [Accessibility guide](accessibility.md#accessibilityignoresinvertcolors)。

| Type    |
| ------- |
| Boolean |

---

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素。默认情况下，所有可触摸元素都是可访问的。

| Type |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖用户与元素交互时由屏幕阅读器读出的文本。默认情况下，该标签通过遍历所有子元素并收集所有以空格分隔的 `Text` 节点来构建。

| Type   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，表示用户与元素交互时屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| Type   |
| ------ |
| string |

---

### `accessibilityHint`

无障碍提示帮助用户理解在无障碍标签无法清楚说明结果时，对无障碍元素执行某个操作后会发生什么。

| Type   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 用于向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下之一：

- `'none'` - 当元素没有角色时使用。
- `'button'` - 当元素应被当作按钮处理时使用。
- `'link'` - 当元素应被当作链接处理时使用。
- `'search'` - 当文本框元素也应被当作搜索字段处理时使用。
- `'image'` - 当元素应被当作图像处理时使用。例如，它可以与按钮或链接组合使用。
- `'keyboardkey'` - 当元素充当键盘按键时使用。
- `'text'` - 当元素应被当作不可变的静态文本时使用。
- `'adjustable'` - 当元素可以被“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被当作按钮处理且本身也是图像时使用。
- `'header'` - 当元素充当内容区域的标题时使用（例如导航栏标题）。
- `'summary'` - 当应用首次启动时，元素可用于提供当前状态的快速摘要时使用。
- `'alert'` - 当元素包含需要呈现给用户的重要文本时使用。
- `'checkbox'` - 当元素表示可选中的复选框，可被选中、取消选中或处于混合选中状态时使用。
- `'combobox'` - 当元素表示组合框，允许用户在多个选项中进行选择时使用。
- `'menu'` - 当组件是一个选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于表示菜单中的一项。
- `'progressbar'` - 用于表示指示任务进度的组件。
- `'radio'` - 用于表示单选按钮。
- `'radiogroup'` - 用于表示一组单选按钮。
- `'scrollbar'` - 用于表示滚动条。
- `'spinbutton'` - 用于表示打开选项列表的按钮。
- `'switch'` - 用于表示可开启和关闭的开关。
- `'tab'` - 用于表示标签页。
- `'tablist'` - 用于表示标签页列表。
- `'timer'` - 用于表示计时器。
- `'toolbar'` - 用于表示工具栏（动作按钮或组件的容器）。

| Type   |
| ------ |
| string |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

更多信息请参阅 [Accessibility guide](accessibility.md#accessibilitystate-ios-android)。

| Type                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的动作。`accessibilityActions` 属性应包含一个动作对象列表。每个动作对象应包含字段名和标签。

更多信息请参阅 [Accessibility guide](accessibility.md#accessibility-actions)。

| Type  |
| ----- |
| array |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等待更改完成后再向用户告知更新。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可检查元素的状态。此字段可以接受布尔值或 `"mixed"` 字符串，以表示混合状态的复选框。

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可被感知但已禁用，因此不可编辑或不可操作。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示一个可展开元素当前是展开还是折叠。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-hidden`

表示该元素对辅助技术是否可见。

例如，在一个包含兄弟视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义一个用于标识交互元素的字符串值。

| Type   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术以及用户可以从实时区域预期到的更新类型。

- **off** 辅助功能服务不应播报对此视图的更改。
- **polite** 辅助功能服务应播报对此视图的更改。
- **assertive** 辅助功能服务应打断当前语音，立即播报对此视图的更改。

| Type                                     | Default |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，表示 VoiceOver 是否应忽略接收者兄弟视图中的元素。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-selected`

表示某个可选元素当前是否被选中。

| Type    |
| ------- |
| boolean |

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数唯一的参数是一个事件，其中包含要执行的动作名称。

更多信息请参阅 [Accessibility guide](accessibility.md#accessibility-actions)。

| Type     |
| -------- |
| function |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），它包含范围信息（最小值、当前值和最大值）。

更多信息请参阅 [Accessibility guide](accessibility.md#accessibilityvalue-ios-android)。

| Type                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。其优先级高于 `accessibilityValue` 属性中的 `max` 值。

| Type   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。其优先级高于 `accessibilityValue` 属性中的 `min` 值。

| Type   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。其优先级高于 `accessibilityValue` 属性中的 `now` 值。

| Type   |
| ------ |
| number |

---

### `aria-valuetext`

表示组件的文本描述。其优先级高于 `accessibilityValue` 属性中的 `text` 值。

| Type   |
| ------ |
| string |

---

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 之间的持续时间（毫秒）。

| Type   |
| ------ |
| number |

---

### `delayPressIn`

从触摸开始到调用 `onPressIn` 之间的持续时间（毫秒）。

| Type   |
| ------ |
| number |

---

### `delayPressOut`

从触摸释放到调用 `onPressOut` 之间的持续时间（毫秒）。

| Type   |
| ------ |
| number |

---

### `disabled`

如果为 true，则禁用该组件的所有交互。

| Type |
| ---- |
| bool |

---

### `hitSlop`

这定义了你的触摸可以在距离按钮多远的地方开始。在离开按钮时，这会被加到 `pressRetentionOffset` 上。

:::note
触摸区域永远不会超出父视图边界，并且如果一次触摸命中两个重叠视图，兄弟视图的 Z-index 始终优先。
:::

| Type                   |
| ---------------------- |
| [Rect](rect) or number |

### `id`

用于从原生代码中定位此视图。其优先级高于 `nativeID` 属性。

| Type   |
| ------ |
| string |

---

### `onBlur`

在项目失去焦点时调用。

| Type                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onFocus`

在项目获得焦点时调用。

| Type                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onLayout`

在挂载时以及布局变化时调用。

| Type                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

如果 `onPressIn` 之后的持续时间超过 370 毫秒，则调用。此时间段可通过 [`delayLongPress`](#delaylongpress) 自定义。

| Type     |
| -------- |
| function |

---

### `onPress`

当触摸释放时调用，但如果被取消则不会调用（例如被抢占 responder lock 的滚动操作）。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| Type     |
| -------- |
| function |

---

### `onPressIn`

在可触摸元素被按下后立即调用，甚至早于 `onPress`。这在发起网络请求时可能很有用。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| Type     |
| -------- |
| function |

---

### `onPressOut`

在触摸释放后立即调用，甚至早于 `onPress`。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| Type     |
| -------- |
| function |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了你的触摸在按钮上方可以移动多远，超过后按钮会被停用。停用后，把它再移回来，你会发现按钮会再次被激活！在滚动视图被禁用时，可以来回移动几次。请确保传入一个常量以减少内存分配。

| Type                   |
| ---------------------- |
| [Rect](rect) or number |

### `nativeID`

| Type   |
| ------ |
| string |

### `testID`

用于在端到端测试中定位此视图。

| Type   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 true，则不会在触摸时播放系统声音。

| Type    |
| ------- |
| Boolean |
