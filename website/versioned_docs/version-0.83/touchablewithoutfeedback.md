---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

:::tip
如果你正在寻找一种更全面、更具未来适应性的方式来处理触摸输入，请查看 [Pressable](pressable.md) API。
:::

除非有非常充分的理由，否则不要使用。所有响应按压的元素在被触摸时都应具有视觉反馈。

`TouchableWithoutFeedback` 只支持一个子元素。如果你希望包含多个子组件，请将它们包装在一个 View 中。重要的是，`TouchableWithoutFeedback` 通过克隆其子组件并将响应者属性应用到它来工作。因此，任何中间组件都需要将这些属性传递给底层的 React Native 组件。

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
import React, {useState} from 'react';
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
            <Text>点这里触摸</Text>
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

指示当启用颜色反转时，该视图是否应被反转。`true` 表示即使启用了颜色反转，该视图也不被反转。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型    |
| ------- |
| Boolean |

---

### `accessible`

为 `true` 时，表示该视图是一个辅助功能元素。默认情况下，所有可触摸元素都是可访问的。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖屏幕阅读器与用户交互时朗读的文本。默认标签通过遍历所有子元素并累积所有的 `Text` 节点，用空格分隔构成。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指定屏幕阅读器应使用的语言，遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityHint`

辅助功能提示，用于帮助用户理解执行操作后会发生什么，当该结果无法从辅助功能标签明确看出时使用。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 用于向辅助技术的用户传达组件的用途。

`accessibilityRole` 可以是以下之一：

- `'none'` - 元素无角色。
- `'button'` - 元素应被视为按钮。
- `'link'` - 元素应被视为链接。
- `'search'` - 文本字段元素也应被视为搜索字段。
- `'image'` - 元素应被视为图像。可与按钮或链接结合使用。
- `'keyboardkey'` - 元素充当键盘按键。
- `'text'` - 元素应被视为静态文本，不可变化。
- `'adjustable'` - 元素可“调整”（例如滑块）。
- `'imagebutton'` - 元素既是按钮又是图像。
- `'header'` - 元素充当内容区域的标题（例如导航栏标题）。
- `'summary'` - 元素用于在应用启动时快速提供当前状态摘要。
- `'alert'` - 元素包含重要文本，应呈现给用户。
- `'checkbox'` - 元素代表可选中、未选中或混合状态的复选框。
- `'combobox'` - 元素代表组合框，允许用户从多个选项中选择。
- `'menu'` - 元素是一个选项菜单。
- `'menubar'` - 元素是多个菜单的容器。
- `'menuitem'` - 元素是菜单内的项目。
- `'progressbar'` - 元素表示任务进度条。
- `'radio'` - 元素表示单选按钮。
- `'radiogroup'` - 元素表示单选按钮组。
- `'scrollbar'` - 元素表示滚动条。
- `'spinbutton'` - 元素表示打开选择列表的按钮。
- `'switch'` - 元素表示开关，可开或关。
- `'tab'` - 元素表示标签页。
- `'tablist'` - 元素表示标签页列表。
- `'timer'` - 元素表示计时器。
- `'toolbar'` - 元素表示工具栏（动作按钮或组件的容器）。

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

描述组件当前状态，供辅助技术使用。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| 对象：`{disabled: bool, selected: bool, checked: bool 或 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

辅助功能动作允许辅助技术以编程方式调用组件的动作。该属性应包含一个动作对象列表，每个对象应包含名称和标签字段。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| 数组 |

---

### `aria-busy`

表示元素正在被修改，辅助技术可能希望等待变更完成后再通知用户。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可选中元素的状态。可为布尔值或字符串 "mixed"（混合状态复选框）。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean，'mixed' | false   |

---

### `aria-disabled`

表示该元素可感知，但被禁用，不可编辑或操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-hidden`

表示元素是否对辅助技术隐藏。

例如，在包含兄弟视图 A 和 B 的窗口中，将 `aria-hidden` 设为 `true` 的视图 B 会使 VoiceOver 忽略 B 视图及其子视图。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义交互元素的文本标签。

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示元素将被更新，并描述用户代理、辅助技术和用户可以预期的动态区域更新类型。

- **off** 辅助服务不应该朗读该视图的变更。
- **polite** 辅助服务应礼貌地朗读变更。
- **assertive** 辅助服务应立即中断正在朗读内容，优先朗读变更。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| 枚举 (`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略与接收者视图为兄弟关系的元素。在 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性前有优先级。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-selected`

表示当前是否选中可选元素。

| 类型    |
| ------- |
| boolean |

### `onAccessibilityAction`

当用户执行辅助功能动作时调用。函数唯一参数是包含要执行动作名称的事件。

更多信息见 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| 函数     |

---

### `accessibilityValue`

表示组件的当前值。可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），包含范围信息（最小值、当前值和最大值）。

更多信息见 [辅助功能指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| 对象：`{min: number, max: number, now: number, text: string}` |

---

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。优先于 `accessibilityValue` 中的 `max`。

| 类型   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。优先于 `accessibilityValue` 中的 `min`。

| 类型   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。优先于 `accessibilityValue` 中的 `now`。

| 类型   |
| ------ |
| number |

---

### `aria-valuetext`

表示组件的文本描述。优先于 `accessibilityValue` 中的 `text`。

| 类型   |
| ------ |
| string |

---

### `delayLongPress`

从 `onPressIn` 开始，到调用 `onLongPress` 的延迟时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `delayPressIn`

触摸开始到调用 `onPressIn` 的延迟时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `delayPressOut`

触摸释放到调用 `onPressOut` 的延迟时间（毫秒）。

| 类型   |
| ------ |
| number |

---

### `disabled`

为 `true` 时，禁用该组件的所有交互。

| 类型 |
| ---- |
| bool |

---

### `hitSlop`

定义触摸开始点可以与按钮边界的最大距离。该距离会加到 `pressRetentionOffset` 上，当触摸点离开按钮区域时生效。

:::note
触摸区域永远不会超出父视图边界，并且如果两个重叠视图都被触摸，具有更高 Z-index 的视图优先响应。
:::

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 数字    |

### `id`

用于从原生代码定位此视图。优先于 `nativeID`。

| 类型   |
| ------ |
| string |

---

### `onBlur`

当元素失去焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onFocus`

当元素获得焦点时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onLayout`

组件挂载及布局变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

从 `onPressIn` 开始超过 370 毫秒后调用。该时间可用 [`delayLongPress`](#delaylongpress) 自定义。

| 类型     |
| -------- |
| 函数     |

---

### `onPress`

触摸释放时调用，若被取消（例如滚动抢占响应锁）则不调用。第一个函数参数是一个 [PressEvent](pressevent) 事件。

| 类型     |
| -------- |
| 函数     |

---

### `onPressIn`

一开始按下触摸时调用，甚至早于 `onPress`。可用于发起网络请求。第一个函数参数是一个 [PressEvent](pressevent) 事件。

| 类型     |
| -------- |
| 函数     |

---

### `onPressOut`

触摸释放时调用，早于 `onPress`。第一个函数参数是一个 [PressEvent](pressevent) 事件。

| 类型     |
| -------- |
| 函数     |

---

### `pressRetentionOffset`

当滚动视图被禁用时，定义触摸可以偏离按钮的最大距离，超过此距离按钮将被失效。失效后，将触摸点移回按钮内，按钮会再次激活！可多次演示。建议传入常量以减少内存分配。

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 数字    |

---

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

为 `true` 时，触摸时不播放系统音效。

| 类型    |
| ------- |
| Boolean |