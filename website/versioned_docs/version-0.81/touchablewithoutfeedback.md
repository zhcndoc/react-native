---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

> 如果你正在寻找一种更全面且面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。

除非你有非常充分的理由，否则不要使用。所有响应按下的元素在被触摸时都应有视觉反馈。

`TouchableWithoutFeedback` 只支持一个子元素。如果你希望包含多个子组件，请将它们包裹在一个 View 中。重要的是，`TouchableWithoutFeedback` 的工作方式是克隆其子元素并将 responder props 应用到它上面。因此，任何中间组件都必须将这些 props 传递到底层的 React Native 组件。

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
            <Text>点按这里</Text>
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

一个值，表示当启用颜色反转时，此视图是否应被反转。值为 `true` 将告诉视图即使启用了颜色反转也不要被反转。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors)。

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

覆盖屏幕阅读器在用户与该元素交互时朗读的文本。默认情况下，该标签通过遍历所有子元素并累积所有 `Text` 节点（以空格分隔）来构造。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，表示屏幕阅读器在用户与该元素交互时应使用的语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityHint`

无障碍提示有助于用户在无障碍标签无法清楚说明结果时，理解对该无障碍元素执行某个操作后会发生什么。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 用于向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下之一：

- `'none'` - 当元素没有角色时使用。
- `'button'` - 当元素应被视为按钮时使用。
- `'link'` - 当元素应被视为链接时使用。
- `'search'` - 当文本框元素也应被视为搜索框时使用。
- `'image'` - 当元素应被视为图像时使用。例如，可与按钮或链接组合使用。
- `'keyboardkey'` - 当元素充当键盘按键时使用。
- `'text'` - 当元素应被视为不可更改的静态文本时使用。
- `'adjustable'` - 当元素可以被“调节”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且同时也是图像时使用。
- `'header'` - 当元素充当内容区段的标题时使用（例如导航栏标题）。
- `'summary'` - 当应用首次启动时，可用于提供当前应用状态的快速摘要时使用。
- `'alert'` - 当元素包含需要向用户呈现的重要文本时使用。
- `'checkbox'` - 当元素表示一个可选中、可取消选中或具有混合选中状态的复选框时使用。
- `'combobox'` - 当元素表示一个组合框，允许用户从多个选项中选择时使用。
- `'menu'` - 当组件是一个选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于表示菜单中的一项。
- `'progressbar'` - 用于表示指示任务进度的组件。
- `'radio'` - 用于表示单选按钮。
- `'radiogroup'` - 用于表示一组单选按钮。
- `'scrollbar'` - 用于表示滚动条。
- `'spinbutton'` - 用于表示打开选项列表的按钮。
- `'switch'` - 用于表示可开关的开关。
- `'tab'` - 用于表示标签页。
- `'tablist'` - 用于表示标签页列表。
- `'timer'` - 用于表示计时器。
- `'toolbar'` - 用于表示工具栏（动作按钮或组件的容器）。

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

描述组件的当前状态给辅助技术用户。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含字段名和标签。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| array |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等待更改完成后再将更新通知给用户。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示一个可检查元素的状态。该字段可以接受布尔值或 `"mixed"` 字符串来表示混合复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可以被感知但已被禁用，因此不可编辑或不可操作。

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

例如，在一个包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设为 `true` 会使 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义用于标记交互元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术以及用户对该实时区域所能预期的更新类型。

- **off** 辅助功能服务不应播报对此视图的更改。
- **polite** 辅助功能服务应播报对此视图的更改。
- **assertive** 辅助功能服务应打断当前语音，立即播报对此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，表示 VoiceOver 是否应忽略该接收者同级视图中的元素。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

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

当用户执行无障碍操作时触发。此函数的唯一参数是一个包含要执行操作名称的事件。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；或者对于基于范围的组件，例如滑块和进度条，它包含范围信息（最小值、当前值和最大值）。

有关更多信息，请参阅 [无障碍指南](accessibility.md#accessibilityvalue-ios-android)。

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

表示该组件的文本描述。其优先级高于 `accessibilityValue` 属性中的 `text` 值。

| 类型   |
| ------ |
| string |

---

### `delayLongPress`

在 `onPressIn` 之后到调用 `onLongPress` 之前的持续时间（毫秒）。

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

从释放触摸到调用 `onPressOut` 之前的持续时间（毫秒）。

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

这定义了你的触摸可以在离按钮多远处开始。它会在从按钮移开时附加到 `pressRetentionOffset` 上。

> 触摸区域绝不会超出父视图边界，如果一次触摸命中了两个重叠的视图，同级视图的 Z-index 始终优先。

| 类型                   |
| ---------------------- |
| [Rect](rect) or number |

### `id`

用于从原生代码中定位该视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `onBlur`

当项目失去焦点时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onFocus`

当项目获得焦点时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onLayout`

在挂载和布局变化时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

如果 `onPressIn` 之后的持续时间超过 370 毫秒，则调用。该时间段可通过 [`delayLongPress`](#delaylongpress) 自定义。

| 类型     |
| -------- |
| function |

---

### `onPress`

在触摸释放时调用，但如果已取消则不会调用（例如，被滚动视图抢占 responder 锁）。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

在可触摸元素被按下时立即调用，甚至早于 `onPress`。这在发起网络请求时可能很有用。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressOut`

在触摸释放时立即调用，甚至早于 `onPress`。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了你的触摸在失去按钮激活之前可以离开按钮多远。一旦失去激活状态，尝试把它移回去，你会看到按钮再次被激活！在滚动视图被禁用时，可以反复来回移动几次。请确保传入一个常量以减少内存分配。

| 类型                   |
| ---------------------- |
| [Rect](rect) or number |

### `nativeID`

| 类型   |
| ------ |
| string |

---

### `testID`

用于在端到端测试中定位该视图。

| 类型   |
| ------ |
| string |

---

### `touchSoundDisabled` <div className="label android">Android</div>

如果为 true，则不会在触摸时播放系统声音。

| 类型    |
| ------- |
| Boolean |
