---
id: view
title: View
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

`View` 是构建 UI 最基础的组件，是一个容器，支持 [flexbox](flexbox.md)、[style](style.md)、[部分触摸处理](handling-touches.md) 以及 [可访问性](accessibility.md) 控件。`View` 会直接映射到 React Native 运行平台上的原生视图等效项，无论该平台是 `UIView`、`<div>`、`android.view` 等。

`View` 设计为嵌套在其他视图中，并且可以包含 0 到多个任意类型的子元素。

这个示例创建了一个 `View`，它在一行中包裹了两个带颜色的方框和一个文本组件，并带有内边距。

```SnackPlayer name=View%20Example
import {View, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ViewBoxesWithColorAndText = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flexDirection: 'row'}}>
        <View style={{height: 100, backgroundColor: 'blue', flex: 0.2}} />
        <View style={{height: 100, backgroundColor: 'red', flex: 0.4}} />
        <Text>Hello World!</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ViewBoxesWithColorAndText;
```

:::note
`View` 通常与 [`StyleSheet`](style.md) 一起使用，以提高清晰度和性能，不过也支持内联样式。
:::

### 合成触摸事件

对于 `View` 的 responder 属性（例如 `onResponderMove`），传递给它们的合成触摸事件采用 [PressEvent](pressevent) 的形式。

---

# 参考

## 属性

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含字段名和标签。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| array |

---

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，表示给定的无障碍元素及其包含的任何无障碍元素是否被隐藏。默认值为 `false`。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityelementshidden-ios)。

| 类型 |
| ---- |
| bool |

---

### `accessibilityHint`

无障碍提示可帮助用户理解当他们对无障碍元素执行操作时会发生什么，尤其是在无障碍标签无法明确说明结果时。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，表示用户与该元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，表示在启用颜色反转时，此视图是否应被反转。值为 `true` 时，即使开启了颜色反转，也会告知视图不要被反转。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖用户与元素交互时屏幕阅读器朗读的文本。默认情况下，该标签通过遍历所有子元素并收集所有以空格分隔的 `Text` 节点来构建。

| 类型   |
| ------ |
| string |

---

### `accessibilityLiveRegion` <div className="label android">Android</div>

指示无障碍服务用户是否应在此视图发生变化时收到通知。仅适用于 Android API >= 19。可选值：

- `'none'` - 无障碍服务不应播报对此视图的更改。
- `'polite'`- 无障碍服务应播报对此视图的更改。
- `'assertive'` - 无障碍服务应打断当前语音，立即播报对此视图的更改。

有关参考，请参见 [Android `View` 文档](https://developer.android.com/reference/android/view/View.html#attr_android:accessibilityLiveRegion)。

| 类型                                |
| ----------------------------------- |
| enum('none', 'polite', 'assertive') |

---

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下值之一：

- `'none'` - 当元素没有角色时使用。
- `'button'` - 当元素应被视为按钮时使用。
- `'link'` - 当元素应被视为链接时使用。
- `'search'` - 当文本输入框元素也应被视为搜索框时使用。
- `'image'` - 当元素应被视为图像时使用。例如，也可与按钮或链接组合使用。
- `'keyboardkey'` - 当元素作为键盘按键使用时。
- `'text'` - 当元素应被视为不可更改的静态文本时使用。
- `'adjustable'` - 当元素可以“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且同时也是图像时使用。
- `'header'` - 当元素作为内容区块的标题时使用（例如导航栏标题）。
- `'summary'` - 当应用首次启动时，元素可用于提供应用当前状态的快速摘要时使用。
- `'alert'` - 当元素包含需要向用户呈现的重要文本时使用。
- `'checkbox'` - 当元素表示一个可选中、可取消选中或具有混合选中状态的复选框时使用。
- `'combobox'` - 当元素表示一个组合框，允许用户在多个选项中选择时使用。
- `'menu'` - 当组件是一个选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于表示菜单中的一项。
- `'progressbar'` - 用于表示指示任务进度的组件。
- `'radio'` - 用于表示单选按钮。
- `'radiogroup'` - 用于表示单选按钮组。
- `'scrollbar'` - 用于表示滚动条。
- `'spinbutton'` - 用于表示一个会打开选项列表的按钮。
- `'switch'` - 用于表示可开启和关闭的开关。
- `'tab'` - 用于表示标签页。
- `'tablist'` - 用于表示标签页列表。
- `'timer'` - 用于表示计时器。
- `'toolbar'` - 用于表示工具栏（动作按钮或组件的容器）。
- `'grid'` - 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用，用于表示网格。会向 Android GridView 添加进出网格的播报。

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；对于基于范围的组件，例如滑块和进度条，则包含范围信息（最小值、当前值和最大值）。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个值，表示 VoiceOver 是否应忽略与接收者同级的视图中的元素。默认值为 `false`。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityviewismodal-ios)。

| 类型 |
| ---- |
| bool |

---

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素，可被屏幕阅读器和硬件键盘等辅助技术发现。默认情况下，所有可触控元素都是可访问的。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessible)。

---

### `aria-busy`

表示某个元素正在被修改，并且辅助技术可能希望等待更改完成后再向用户通报更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-checked`

表示可勾选元素的状态。此字段可以接受布尔值或 `"mixed"` 字符串来表示混合复选框状态。

| 类型             | 默认值 |
| ---------------- | ------ |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可见但已禁用，因此不可编辑或不可操作。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-hidden`

表示该元素是否对辅助技术隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 上的 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-label`

定义一个用于标记交互元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-labelledby` <div className="label android">Android</div>

标识为其应用的元素提供标签的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">输入字段标签</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术以及用户对该实时区域可预期的更新类型。

- **off** 无障碍服务不应播报对此视图的更改。
- **polite** 无障碍服务应播报对此视图的更改。
- **assertive** 无障碍服务应打断当前语音，立即播报对此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------ |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，表示 VoiceOver 是否应忽略与接收者同级的视图中的元素。优先于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-selected`

表示一个可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `aria-valuemax`

表示基于范围的组件的最大值，例如滑块和进度条。优先于 `accessibilityValue` 属性中的 `max` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuemin`

表示基于范围的组件的最小值，例如滑块和进度条。优先于 `accessibilityValue` 属性中的 `min` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuenow`

表示基于范围的组件的当前值，例如滑块和进度条。优先于 `accessibilityValue` 属性中的 `now` 值。

| 类型   |
| ------ |
| number |

---

### `aria-valuetext`

表示该组件的文本描述。优先于 `accessibilityValue` 属性中的 `text` 值。

| 类型   |
| ------ |
| string |

---

### `collapsable`

仅用于布局其子元素或不绘制任何内容的视图，可能会作为优化被自动从原生层级中移除。将此属性设置为 `false` 可禁用此优化，并确保该 `View` 存在于原生视图层级中。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `collapsableChildren`

设置为 false 可防止视图的直接子元素从原生视图层级中移除，效果类似于在每个子元素上设置 `collapsable={false}`。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

`experimental_accessibilityOrder` 指示辅助技术聚焦此 `View` 后代的顺序。此属性接收一个字符串数组，其中每个字符串都是某个后代组件的 [`nativeID`](view.md#nativeid)，其顺序正在被定义。此属性本身不会启用可访问性；每个被引用的组件仍需通过将 [`accessible`](view.md#accessible) 设置为 true 来使其可访问。此属性既支持**可嵌套**也支持**穷尽式**，含义如下：

- 如果 `experimental_accessibilityOrder` 包含对某个不可访问组件的引用，它将按默认顺序聚焦该组件的后代。此外，它还可以包含对其他同样具有 `experimental_accessibilityOrder` 的组件的引用。
- 如果某个本来可访问的组件未被 `experimental_accessibilityOrder` 直接引用，或者未嵌套在 `experimental_accessibilityOrder` 直接引用的某个容器中，那么它将不可访问。

有关更多信息，请参见 [无障碍指南](accessibility.md#experimental_accessibilityorder)。

| 类型             |
| ---------------- |
| array of strings |

---

### `focusable` <div className="label android">Android</div>

此 `View` 是否应可被非触摸输入设备聚焦，例如通过硬件键盘获得焦点。

| 类型    |
| ------- |
| boolean |

---

### `hitSlop`

这定义了触摸事件距离视图多远的范围内也可以开始。典型界面指南建议触控目标至少为 30 - 40 点/与密度无关像素。

例如，如果一个可触控视图的高度为 20，则可通过 `hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}` 将可触控高度扩展到 40。

:::note
触摸区域绝不会超出父视图边界；如果一次触摸命中了两个重叠视图，则同级视图的 Z-index 始终优先。
:::

| 类型                                                                 |
| -------------------------------------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` |

---

### `id`

用于从原生类中定位此视图。优先于 `nativeID` 属性。

:::warning
这会为此视图禁用“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |

---

### `importantForAccessibility` <div className="label android">Android</div>

控制该视图对无障碍的重要性，即它是否触发无障碍事件，以及当屏幕查询无障碍服务时是否会被报告。仅适用于 Android。

可选值：

- `'auto'` - 由系统决定该视图是否对无障碍重要 - 默认值（推荐）。
- `'yes'` - 该视图对无障碍重要。
- `'no'` - 该视图对无障碍不重要。
- `'no-hide-descendants'` - 该视图对无障碍不重要，其所有后代视图也不重要。

有关参考，请参见 [Android `importantForAccessibility` 文档](https://developer.android.com/reference/android/R.attr.html#importantForAccessibility)。

| 类型                                             |
| ------------------------------------------------ |
| enum('auto', 'yes', 'no', 'no-hide-descendants') |

---

### `nativeID`

用于从原生类中定位此视图。

:::warning
这会为此视图禁用“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |

---

### `needsOffscreenAlphaCompositing`

此 `View` 是否需要在屏幕外渲染并以 alpha 进行合成，以便保留 100% 正确的颜色和混合行为。默认值（`false`）会退回为：对组件及其子元素进行绘制时，在用于绘制每个元素的画笔上应用 alpha，而不是将完整组件屏幕外渲染后再以 alpha 值合成回来。如果你正在设置透明度的 `View` 包含多个重叠元素（例如多个重叠的 `View`，或文本与背景），这种默认行为可能会被注意到且并不理想。

为保留正确的 alpha 行为而进行屏幕外渲染代价极高，并且对于非原生开发者而言很难调试，因此默认并未开启。如果你确实需要为动画启用此属性，请考虑在视图**内容**是静态的情况下将其与 renderToHardwareTextureAndroid 结合使用（即它不需要每一帧都重绘）。如果启用了该属性，此 View 将先在屏幕外渲染一次，保存到硬件纹理中，然后在每一帧以 alpha 合成到屏幕上，而无需在 GPU 上切换渲染目标。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

当用户向下导航时，指定下一个获得焦点的视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

当用户向前导航时，指定下一个获得焦点的视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

当用户向左导航时，指定下一个获得焦点的视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

当用户向右导航时，指定下一个获得焦点的视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

当用户向上导航时，指定下一个获得焦点的视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型   |
| ------ |
| number |

---

### `onAccessibilityAction`

当用户执行无障碍操作时触发。该函数唯一的参数是一个事件，其中包含要执行的操作名称。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityEscape` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行逃逸手势时系统将调用此函数。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityTap` <div className="label ios">iOS</div>

当 `accessible` 为 true 时，用户执行无障碍轻点手势时，系统将尝试调用此函数。

| 类型     |
| -------- |
| function |

---

### `onLayout`

在挂载时以及布局变化时触发。

该事件会在布局计算完成后立即触发，但在收到事件时，新布局可能尚未反映到屏幕上，尤其是在布局动画正在进行时。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onMagicTap` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行 magic tap 手势时系统将调用此函数。

| 类型     |
| -------- |
| function |

---

### `onMoveShouldSetResponder`

该视图是否希望“声明”触摸响应？当 `View` 不是 responder 时，每次触摸移动都会调用此函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onMoveShouldSetResponderCapture`

如果父级 `View` 希望阻止子级 `View` 在移动时成为 responder，则应使用此处理函数并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onResponderGrant`

此 View 现在正在响应触摸事件。此时适合进行高亮并向用户展示正在发生的事情。

在 Android 上，此回调返回 true 可阻止任何其他原生组件在该 responder 结束之前成为 responder。

| 类型                                                              |
| ----------------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void ｜ boolean` |

---

### `onResponderMove`

用户正在移动手指。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderReject`

另一个 responder 已经处于活动状态，并且不会将其释放给请求成为 responder 的该 `View`。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderRelease`

在触摸结束时触发。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminate`

responder 已从 `View` 中被取走。可能是在调用 `onResponderTerminationRequest` 后被其他视图取走，也可能是在未询问的情况下被操作系统取走（例如在 iOS 上的控制中心/通知中心中会发生）。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

某个其他 `View` 想要成为 responder，并请求此 `View` 释放其 responder。返回 `true` 允许其释放。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onStartShouldSetResponder`

该视图是否希望在触摸开始时成为 responder？

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父级 `View` 希望阻止子级 `View` 在触摸开始时成为 responder，则应使用此处理函数并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：`View` 可以成为触摸事件的目标。
- `'none'`：`View` 永远不会成为触摸事件的目标。
- `'box-none'`：`View` 永远不会成为触摸事件的目标，但其子视图可以。其行为类似于该视图在 CSS 中具有以下类：

```css
.box-none {
  pointer-events: none;
}
.box-none * {
  pointer-events: auto;
}
```

- `'box-only'`：该视图可以成为触摸事件的目标，但其子视图不可以。其行为类似于该视图在 CSS 中具有以下类：

```css
.box-only {
  pointer-events: auto;
}
.box-only * {
  pointer-events: none;
}
```

| 类型                                         |
| -------------------------------------------- |
| enum('box-none', 'none', 'box-only', 'auto') |

---

### `ref`

一个 ref 设置器，在挂载时将被赋值为一个 [元素节点](element-nodes)。

---

### `removeClippedSubviews`

这是由 `RCTView` 暴露的一个保留性能属性，在包含许多子视图且其中大部分都在屏幕外时，对滚动内容很有用。要使此属性生效，必须将其应用于一个包含许多超出边界子视图的视图。这些子视图还必须具有 `overflow: hidden`，容器视图（或其某个父视图）也应如此。

| 类型 |
| ---- |
| bool |

---

### `renderToHardwareTextureAndroid` <div className="label android">Android</div>

此 `View` 是否应将自身（及其所有子元素）渲染到 GPU 上的单个硬件纹理中。

在 Android 上，这对仅修改透明度、旋转、平移和/或缩放的动画和交互很有用：在这些情况下，视图无需重绘，显示列表也无需重新执行。纹理可以重用，并以不同参数重新合成。缺点是这会消耗有限的视频内存，因此应在交互/动画结束时将此属性重新设为 false。

| 类型 |
| ---- |
| bool |

---

### `role`

`role` 向辅助技术用户传达组件的用途。优先于 [`accessibilityRole`](view#accessibilityrole) 属性。

| 类型                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `shouldRasterizeIOS` <div className="label ios">iOS</div>

此 `View` 是否应在合成前渲染为位图。

在 iOS 上，这对不会修改组件尺寸或其子元素的动画和交互很有用；例如，在平移静态视图的位置时，光栅化允许渲染器重用静态视图的缓存位图，并在每一帧快速合成它。

光栅化会带来一次屏幕外绘制过程，并且位图会占用内存。使用此属性时请进行测试和度量。

| 类型 |
| ---- |
| bool |

---

### `style`

| 类型                           |
| ------------------------------ |
| [View Style](view-style-props) |

---

### `tabIndex` <div className="label android">Android</div>

此 `View` 是否应可被非触摸输入设备聚焦，例如通过硬件键盘获得焦点。
支持以下值：

- `0` - View 可聚焦
- `-1` - View 不可聚焦

| 类型        |
| ----------- |
| enum(0, -1) |

---

### `testID`

用于在端到端测试中定位此视图。

:::warning
这会为此视图禁用“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |
