---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

:::tip
如果你正在寻找一种更全面且面向未来的触摸输入处理方式，请查看 [Pressable](pressable.md) API
:::

除非你有非常充分的理由，否则不要使用它。所有响应按压的元素在被触摸时都应该提供视觉反馈。

`TouchableWithoutFeedback` 只支持一个子元素。如果你希望包含多个子组件，请将它们包裹在一个 View 中。需要特别注意的是，`TouchableWithoutFeedback` 的工作方式是克隆其子元素，并向其应用 responder 属性。因此，任何中间组件都必须将这些属性传递给底层的 React Native 组件。

## 使用模式

```tsx
function MyComponent(props: MyComponentProps) {
  return (
    <View {...props} style={{flex: 1, backgroundColor: '#fff'}}>
      <Text>My Component</Text>
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
          <Text style={styles.countText}>Count: {count}</Text>
        </View>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.button}>
            <Text>Touch Here</Text>
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

指示此视图在开启颜色反转时是否应该反转。值为 `true` 时，即使开启了颜色反转，也会告知视图不要进行反转。

更多信息请参阅 [Accessibility 指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型    |
| ------- |
| Boolean |

---

### `accessible`

为 `true` 时，表示该视图是一个辅助功能元素。默认情况下，所有可触摸元素都可访问。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与元素交互时所朗读的文本。默认情况下，该标签通过遍历所有子元素，并以空格分隔累积所有 `Text` 节点来构造。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示用户与元素交互时屏幕阅读器应使用的语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityHint`

辅助功能提示可帮助用户理解：当他们对辅助功能元素执行操作时会发生什么，而该结果无法仅从辅助功能标签中明确得知。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下值之一：

- `'none'` - 元素没有角色时使用
- `'button'` - 元素应被视为按钮时使用
- `'link'` - 元素应被视为链接时使用
- `'search'` - 文本字段元素还应被视为搜索字段时使用
- `'image'` - 元素应被视为图像时使用。例如，可以与按钮或链接组合使用
- `'keyboardkey'` - 元素充当键盘按键时使用
- `'text'` - 元素应被视为不可更改的静态文本时使用
- `'adjustable'` - 元素可以进行“调整”时使用（例如滑块）
- `'imagebutton'` - 元素应被视为按钮，同时也是图像时使用
- `'header'` - 元素充当内容区域的标题时使用（例如导航栏的标题）
- `'summary'` - 应用首次启动时，元素可用于提供应用当前状态的快速摘要时使用
- `'alert'` - 元素包含需要向用户呈现的重要文本时使用
- `'checkbox'` - 元素表示一个复选框，该复选框可以处于选中、未选中或混合选中状态时使用
- `'combobox'` - 元素表示一个组合框，允许用户从多个选项中进行选择时使用
- `'menu'` - 组件是选项菜单时使用
- `'menubar'` - 组件是多个菜单的容器时使用
- `'menuitem'` - 表示菜单中的项目时使用
- `'progressbar'` - 表示指示任务进度的组件时使用
- `'radio'` - 表示单选按钮时使用
- `'radiogroup'` - 表示单选按钮组时使用
- `'scrollbar'` - 表示滚动条时使用
- `'spinbutton'` - 表示打开选项列表的按钮时使用
- `'switch'` - 表示可打开和关闭的开关时使用
- `'tab'` - 表示选项卡时使用
- `'tablist'` - 表示选项卡列表时使用
- `'timer'` - 表示计时器时使用
- `'toolbar'` - 表示工具栏（操作按钮或组件的容器）时使用

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

更多信息请参阅 [Accessibility 指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含操作对象列表。每个操作对象都应包含名称和标签字段。

更多信息请参阅 [Accessibility 指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| array |

---

### `aria-busy`

指示元素正在被修改，辅助技术可能希望等到更改完成后再向用户告知更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-checked`

指示可勾选元素的状态。此字段可以使用布尔值，也可以使用 `"mixed"` 字符串表示混合复选框。

| 类型             | 默认值 |
| ---------------- | ------ |
| boolean, 'mixed' | false  |

---

### `aria-disabled`

指示元素可被感知但已禁用，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-expanded`

指示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-hidden`

指示元素是否对辅助技术隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设置为 `true` 会使 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-label`

定义用于标记交互式元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以从实时区域中预期的更新类型。

- **off** 辅助功能服务不应播报此视图的更改
- **polite** 辅助功能服务应播报此视图的更改
- **assertive** 辅助功能服务应中断当前语音，立即播报此视图的更改

| 类型                                     | 默认值  |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

指示 VoiceOver 是否应忽略接收者的兄弟视图中的元素。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-selected`

指示可选择元素当前是否处于选中状态。

| 类型    |
| ------- |
| boolean |

### `onAccessibilityAction`

用户执行辅助功能操作时调用。此函数唯一的参数是一个事件，其中包含要执行的操作名称。

更多信息请参阅 [Accessibility 指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；对于基于范围的组件（例如滑块和进度条），则包含范围信息（最小值、当前值和最大值）。

更多信息请参阅 [Accessibility 指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `aria-valuemax`

表示基于范围的组件（例如滑块和进度条）的最大值。其优先级高于 `accessibilityValue` 属性中的 `max` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件（例如滑块和进度条）的最小值。其优先级高于 `accessibilityValue` 属性中的 `min` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件（例如滑块和进度条）的当前值。其优先级高于 `accessibilityValue` 属性中的 `now` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuetext`

表示组件的文本描述。其优先级高于 `accessibilityValue` 属性中的 `text` 值。

| 类型   |
| ------ |
| string |

---

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 之间的持续时间（以毫秒为单位）。

| 类型   |
| ------ |
| number |

---

### `delayPressIn`

从触摸开始到调用 `onPressIn` 之间的持续时间（以毫秒为单位）。

| 类型   |
| ------ |
| number |

---

### `delayPressOut`

从触摸释放到调用 `onPressOut` 之间的持续时间（以毫秒为单位）。

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

定义触摸可以在距离按钮多远的位置开始。在触摸移出按钮时，此范围会添加到 `pressRetentionOffset`。

:::note
触摸区域永远不会超出父视图边界；如果触摸同时命中两个重叠视图，兄弟视图的 Z-index 始终优先
:::

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 number |

### `id`

用于从原生代码中定位此视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `onBlur`

元素失去焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onFocus`

元素获得焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onLayout`

组件挂载和布局发生变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

如果 `onPressIn` 之后经过的时间超过 370 毫秒，则调用。可以使用 [`delayLongPress`](#delaylongpress) 自定义此时间段。

| 类型     |
| -------- |
| function |

---

### `onPress`

触摸释放时调用，但触摸被取消时不会调用（例如，滚动操作抢占 responder 锁）。传递给函数的第一个参数是一个 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

可触摸元素被按下时立即调用，甚至早于 onPress。这在发起网络请求时可能很有用。传递给函数的第一个参数是一个 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressOut`

触摸释放时立即调用，甚至早于 onPress。传递给函数的第一个参数是一个 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了触摸在按钮停用前可以移出按钮多远。停用后，尝试将触摸移回，你会看到按钮再次被激活！在滚动视图被禁用时来回移动几次。请确保传入一个常量，以减少内存分配。

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 number |

---

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

如果为 true，则触摸时不播放系统声音。

| 类型    |
| ------- |
| Boolean |
