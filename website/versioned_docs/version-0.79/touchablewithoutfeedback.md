---
id: touchablewithoutfeedback
title: TouchableWithoutFeedback
---

> 如果您正在寻找一种更广泛且面向未来的方式来处理基于触摸的输入，请查看 [Pressable](pressable.md) API。

除非你有非常充分的理由，否则不要使用。所有响应按压的元素在被触摸时都应该有视觉反馈。

`TouchableWithoutFeedback` 仅支持一个子元素。如果您希望有多个子组件，请将它们包裹在一个 View 中。重要的是，`TouchableWithoutFeedback` 通过克隆其子元素并向其应用响应者属性来工作。因此，任何中间组件都必须将这些属性传递给底层的 React Native 组件。

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

## 属性

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，指示当颜色反转开启时，此视图是否应该被反转。值为 `true` 将告诉视图即使颜色反转开启也不要被反转。

请参阅 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors) 以获取更多信息。

| 类型    |
| ------- |
| Boolean |

---

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素。默认情况下，所有可触摸元素都是可无障碍访问的。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖当用户与元素交互时屏幕阅读器读取的文本。默认情况下，标签是通过遍历所有子元素并累积所有由空格分隔的 `Text` 节点构建的。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，指示当用户与元素交互时屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage) 以获取更多信息。

| 类型   |
| ------ |
| string |

---

### `accessibilityHint`

无障碍提示帮助用户理解当他们在无障碍元素上执行操作时会发生什么，当结果从无障碍标签中不清楚时。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的目的。

`accessibilityRole` 可以是以下之一：

- `'none'` - 当元素没有角色时使用。
- `'button'` - 当元素应被视为按钮时使用。
- `'link'` - 当元素应被视为链接时使用。
- `'search'` - 当文本字段元素也应被视为搜索字段时使用。
- `'image'` - 当元素应被视为图像时使用。例如，可以与按钮或链接组合使用。
- `'keyboardkey'` - 当元素充当键盘键时使用。
- `'text'` - 当元素应被视为无法更改的静态文本时使用。
- `'adjustable'` - 当元素可以“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且也是图像时使用。
- `'header'` - 当元素充当内容部分的标题时使用（例如导航栏的标题）。
- `'summary'` - 当元素可用于在应用首次启动时提供应用中当前条件的快速摘要时使用。
- `'alert'` - 当元素包含要呈现给用户的重要文本时使用。
- `'checkbox'` - 当元素代表一个可以选中、取消选中或具有混合选中状态的复选框时使用。
- `'combobox'` - 当元素代表一个组合框时使用，允许用户在几个选项中进行选择。
- `'menu'` - 当组件是选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于代表菜单中的一个项目。
- `'progressbar'` - 用于代表指示任务进度的组件。
- `'radio'` - 用于代表一个单选按钮。
- `'radiogroup'` - 用于代表一组单选按钮。
- `'scrollbar'` - 用于代表一个滚动条。
- `'spinbutton'` - 用于代表一个打开选项列表的按钮。
- `'switch'` - 用于代表一个可以打开和关闭的开关。
- `'tab'` - 用于代表一个标签页。
- `'tablist'` - 用于代表一个标签页列表。
- `'timer'` - 用于代表一个计时器。
- `'toolbar'` - 用于代表一个工具栏（操作按钮或组件的容器）。

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

请参阅 [无障碍指南](accessibility.md#accessibilitystate-ios-android) 以获取更多信息。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名称和标签。

请参阅 [无障碍指南](accessibility.md#accessibility-actions) 以获取更多信息。

| 类型  |
| ----- |
| array |

---

### `aria-busy`

指示元素正在被修改，辅助技术可能希望等待更改完成后再通知用户更新。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

指示可检查元素的状态。此字段可以采用布尔值或 "mixed" 字符串来表示混合复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

指示元素是可感知的但被禁用，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

指示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-hidden`

指示此无障碍元素内包含的无障碍元素是否被隐藏。

例如，在一个包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略视图 `B` 中的元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义一个标记交互元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以从实时区域期望的更新类型。

- **off** 无障碍服务不应宣布对此视图的更改。
- **polite** 无障碍服务应宣布对此视图的更改。
- **assertive** 无障碍服务应中断正在进行的语音以立即宣布对此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-selected`

指示可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数的唯一参数是一个包含要执行的操作名称的事件。

请参阅 [无障碍指南](accessibility.md#accessibility-actions) 以获取更多信息。

| 类型     |
| -------- |
| function |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），它包含范围信息（最小值、当前值和最大值）。

请参阅 [无障碍指南](accessibility.md#accessibilityvalue-ios-android) 以获取更多信息。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。优先级高于 `accessibilityValue` 属性中的 `max` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。优先级高于 `accessibilityValue` 属性中的 `min` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。优先级高于 `accessibilityValue` 属性中的 `now` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuetext`

表示组件的文本描述。优先级高于 `accessibilityValue` 属性中的 `text` 值。

| 类型   |
| ------ |
| string |

---

### `delayLongPress`

从 `onPressIn` 到调用 `onLongPress` 之前的持续时间（毫秒）。

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

这定义了您的触摸可以从按钮开始多远。当移出按钮时，这会添加到 `pressRetentionOffset`。

> 触摸区域永远不会超出父视图边界，如果触摸命中两个重叠视图，兄弟视图的 Z-index 始终优先。

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 number |

### `id`

用于从原生代码定位此视图。优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `onBlur`

当项目失去焦点时调用。

| 类型     |
| -------- |
| function |

---

### `onFocus`

当项目接收焦点时调用。

| 类型     |
| -------- |
| function |

---

### `onLayout`

在挂载和布局更改时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

如果 `onPressIn` 之后的时间持续超过 370 毫秒，则调用。此时间段可以使用 [`delayLongPress`](#delaylongpress) 进行自定义。

| 类型     |
| -------- |
| function |

---

### `onPress`

当触摸释放时调用，但如果被取消则不调用（例如，由滚动窃取响应者锁）。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

一旦可触摸元素被按下即调用，甚至在 onPress 之前调用。这在发出网络请求时可能很有用。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `onPressOut`

一旦触摸释放即调用，甚至在 onPress 之前。第一个函数参数是 [PressEvent](pressevent) 形式的事件。

| 类型     |
| -------- |
| function |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了您的触摸可以从按钮移多远，然后才停用按钮。一旦停用，尝试将其移回，您将看到按钮再次被激活！当滚动视图被禁用时，来回移动几次。确保传入一个常量以减少内存分配。

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

如果为 true，则在触摸时不播放系统声音。

| 类型    |
| ------- |
| Boolean |
