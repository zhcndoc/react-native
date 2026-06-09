---
id: view
title: View
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

`View` 是构建 UI 最基础的组件，它是一个容器，支持 [flexbox](flexbox.md)、[样式](style.md)、[一些触摸处理](handling-touches.md) 和 [无障碍](accessibility.md) 控件。`View` 会直接映射到 React Native 运行所在平台上的原生视图等价物，无论它是 `UIView`、`<div>`、`android.view` 等。

`View` 设计为嵌套在其他视图中，并且可以包含 0 到多个任意类型的子元素。

下面这个示例创建了一个 `View`，它在一行中用内边距包裹了两个带颜色的方块和一个文本组件。

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
`View` 通常与 [`StyleSheet`](style.md) 一起使用，以获得更清晰的代码和更好的性能，不过也支持内联样式。
:::

### 合成触摸事件

对于 `View` 的 responder 属性（例如 `onResponderMove`），传递给它们的合成触摸事件采用 [PressEvent](pressevent) 的形式。

---

# 参考

## 属性

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含名称字段和标签。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| array |

---

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，表示给定的无障碍元素以及其包含的任何无障碍元素是否被隐藏。默认值为 `false`。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityelementshidden-ios)。

| 类型 |
| ---- |
| bool |

---

### `accessibilityHint`

无障碍提示帮助用户理解当他们对无障碍元素执行操作时会发生什么，尤其是在无法仅从无障碍标签中明确结果时。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，表示用户与元素交互时屏幕阅读器应使用的语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，表示当启用颜色反转时，此视图是否应被反转。`true` 表示即使启用了颜色反转，也不要反转该视图。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与该元素交互时朗读的文本。默认情况下，标签会通过遍历所有子元素并收集所有 `Text` 节点（以空格分隔）构建。

| 类型   |
| ------ |
| string |

---

### `accessibilityLiveRegion` <div className="label android">Android</div>

指示无障碍服务在此视图发生变化时是否应通知用户。仅适用于 Android API >= 19。可能的值：

- `'none'` - 无障碍服务不应播报此视图的变化。
- `'polite'`- 无障碍服务应播报此视图的变化。
- `'assertive'` - 无障碍服务应打断正在进行的语音，立即播报此视图的变化。

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
- `'search'` - 当文本输入元素也应被视为搜索框时使用。
- `'image'` - 当元素应被视为图像时使用。例如，也可与按钮或链接组合使用。
- `'keyboardkey'` - 当元素表现为键盘按键时使用。
- `'text'` - 当元素应被视为不可变的静态文本时使用。
- `'adjustable'` - 当元素可以“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且同时也是图像时使用。
- `'header'` - 当元素充当内容区块的标题时使用（例如导航栏标题）。
- `'summary'` - 当应用首次启动时，用于提供当前状态的简要摘要时使用。
- `'alert'` - 当元素包含需要向用户展示的重要文本时使用。
- `'checkbox'` - 当元素表示一个可勾选、可取消勾选或具有混合选中状态的复选框时使用。
- `'combobox'` - 当元素表示一个组合框，允许用户在多个选项中选择时使用。
- `'menu'` - 当组件是一个选项菜单时使用。
- `'menubar'` - 当组件是多个菜单的容器时使用。
- `'menuitem'` - 用于表示菜单中的一项。
- `'progressbar'` - 用于表示指示任务进度的组件。
- `'radio'` - 用于表示单选按钮。
- `'radiogroup'` - 用于表示单选按钮组。
- `'scrollbar'` - 用于表示滚动条。
- `'spinbutton'` - 用于表示打开选项列表的按钮。
- `'switch'` - 用于表示可开关的切换开关。
- `'tab'` - 用于表示标签页。
- `'tablist'` - 用于表示标签页列表。
- `'timer'` - 用于表示计时器。
- `'toolbar'` - 用于表示工具栏（动作按钮或组件的容器）。
- `'grid'` - 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用，用于表示网格。会向 android GridView 添加进入/离开网格的播报。

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

表示组件的当前值。它可以是组件值的文本描述；对于基于范围的组件（例如滑块和进度条），它包含范围信息（最小值、当前值和最大值）。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个值，表示 VoiceOver 是否应忽略与该接收者同级的视图中的元素。默认值为 `false`。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibilityviewismodal-ios)。

| 类型 |
| ---- |
| bool |

---

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素，可被屏幕阅读器和硬件键盘等辅助技术发现。默认情况下，所有可触摸元素都是可访问的。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessible)。

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等到更改完成后再向用户通报更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-checked`

表示可检查元素的状态。此字段可以是布尔值，也可以是 `"mixed"` 字符串来表示混合状态的复选框。

| 类型             | 默认值 |
| ---------------- | ------ |
| boolean, 'mixed' | false  |

---

### `aria-disabled`

表示该元素可感知但已禁用，因此不可编辑或执行其他操作。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-expanded`

表示一个可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-hidden`

表示该元素是否对辅助技术隐藏。

例如，在一个包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-label`

定义一个为交互元素命名的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-labelledby` <div className="label android">Android</div>

标识为其所应用元素提供标签的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">输入字段的标签</Text>
  <TextInput aria-label="输入" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术和用户对该实时区域可预期的更新类型。

- **off** 无障碍服务不应播报此视图的变化。
- **polite** 无障碍服务应播报此视图的变化。
- **assertive** 无障碍服务应打断正在进行的语音，立即播报此视图的变化。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------ |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

一个布尔值，表示 VoiceOver 是否应忽略与该接收者同级的视图中的元素。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-selected`

表示某个可选元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

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

### `collapsable`

仅用于布局子元素或不绘制任何内容的视图，可能会作为一种优化自动从原生层级中移除。将此属性设为 `false` 可禁用该优化，并确保该 `View` 存在于原生视图层级中。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `collapsableChildren`

设为 false 可阻止视图的直接子元素从原生视图层级中移除，效果类似于对每个子元素设置 `collapsable={false}`。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

`experimental_accessibilityOrder` 表示辅助技术聚焦此 `View` 的后代元素的顺序。此属性接收一个字符串数组，其中每个字符串都是某个后代组件的 [`nativeID`](view.md#nativeid)，其顺序将被定义。此属性本身不会启用无障碍功能，每个被引用的组件仍需通过将 [`accessible`](view.md#accessible) 设置为 true 来启用可访问性。此属性既是**可嵌套的**也是**穷尽的**，这意味着

- 如果 `experimental_accessibilityOrder` 包含对某个不可访问组件的引用，它将按默认顺序聚焦该组件的后代。另外，它还可以包含对其他同样具有 `experimental_accessibilityOrder` 的组件的引用。
- 如果某个本来可访问的组件未被 `experimental_accessibilityOrder` 直接引用，或未嵌套在 `experimental_accessibilityOrder` 直接引用的某个容器内，那么它将不可访问。

有关更多信息，请参见 [无障碍指南](accessibility.md#experimental_accessibilityorder)。

| 类型             |
| ---------------- |
| array of strings |

---

### `focusable` <div className="label android">Android</div>

此 `View` 是否应可通过非触摸输入设备获得焦点，例如通过硬件键盘获得焦点。

| 类型    |
| ------- |
| boolean |

---

### `hitSlop`

这定义了触摸事件可以在距离视图多远的地方开始。典型界面指南建议触摸目标至少为 30 - 40 点/与密度无关像素。

例如，如果一个可触摸视图的高度为 20，则可通过 `hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}` 将可触摸高度扩展到 40。

:::note
触摸区域绝不会超出父视图边界；如果一次触摸同时命中两个重叠视图，则同级视图的 Z-index 始终优先。
:::

| 类型                                                                 |
| -------------------------------------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` |

---

### `id`

用于从原生类中定位此视图。其优先级高于 `nativeID` 属性。

:::warning
这会为此视图禁用“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |

---

### `importantForAccessibility` <div className="label android">Android</div>

控制该视图对无障碍是否重要，即它是否触发无障碍事件，以及在查询屏幕时是否会向无障碍服务报告。仅适用于 Android。

可能的值：

- `'auto'` - 由系统决定该视图是否对无障碍重要 - 默认值（推荐）。
- `'yes'` - 该视图对无障碍重要。
- `'no'` - 该视图对无障碍不重要。
- `'no-hide-descendants'` - 该视图对无障碍不重要，其任何子视图也不重要。

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

此 `View` 是否需要先在屏幕外渲染并进行 alpha 合成，以保持 100% 正确的颜色和混合行为。默认值（`false`）会退回到：为绘制每个元素所使用的画笔应用 alpha，然后绘制组件及其子元素，而不是将整个组件离屏渲染后再以 alpha 值合成回来。在你设置透明度的 `View` 包含多个重叠元素（例如多个重叠的 `View`，或文本和背景）时，这种默认行为可能会被察觉且并不理想。

为了保持正确的 alpha 行为而进行离屏渲染成本极高，而且对非原生开发者来说很难调试，因此默认不会开启。如果你确实需要为动画启用此属性，若该视图的**内容**是静态的（即不需要每一帧都重绘），可以考虑将其与 `renderToHardwareTextureAndroid` 结合使用。如果启用了该属性，此 View 将先离屏渲染一次，保存到硬件纹理中，然后每一帧都以 alpha 值合成到屏幕上，而无需在 GPU 上切换渲染目标。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

指定用户向下导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

指定用户向前导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

指定用户向左导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

指定用户向右导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

指定用户向上导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型   |
| ------ |
| number |

---

### `onAccessibilityAction`

当用户执行无障碍操作时调用。传递给该函数的唯一参数是一个包含要执行操作名称的事件。

有关更多信息，请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityEscape` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，系统会在用户执行逃逸手势时调用此函数。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityTap` <div className="label ios">iOS</div>

当 `accessible` 为 true 时，系统会尝试在用户执行无障碍点击手势时调用此函数。

| 类型     |
| -------- |
| function |

---

### `onLayout`

在挂载和布局发生变化时调用。

在布局刚计算完成后就会立即触发此事件，但在接收到该事件时，新布局可能尚未反映到屏幕上，尤其是在布局动画正在进行时。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onMagicTap` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，系统会在用户执行魔法点击手势时调用此函数。

| 类型     |
| -------- |
| function |

---

### `onMoveShouldSetResponder`

此视图是否想“抢占”触摸响应？当 `View` 不是 responder 时，每次触摸移动都会调用此函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onMoveShouldSetResponderCapture`

如果父 `View` 想阻止子 `View` 在移动时成为 responder，应使用此处理函数并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onResponderGrant`

此 View 现在正在响应触摸事件。这是高亮显示并向用户展示正在发生什么的时机。

在 Android 上，从此回调返回 true 可阻止任何其他原生组件在此 responder 结束之前成为 responder。

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

另一个 responder 已处于活动状态，不会将其释放给请求成为 responder 的该 `View`。

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

responder 已从该 `View` 手中被夺走。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，也可能在没有询问的情况下被操作系统夺走（例如 iOS 上的控制中心/通知中心会发生这种情况）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他某个 `View` 想成为 responder，并请求此 `View` 释放其 responder。返回 `true` 允许释放。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onStartShouldSetResponder`

此视图是否希望在触摸开始时成为 responder？

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父 `View` 想阻止子 `View` 在触摸开始时成为 responder，应使用此处理函数并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：`View` 可以成为触摸事件的目标。
- `'none'`：`View` 永远不会成为触摸事件的目标。
- `'box-none'`：`View` 永远不会成为触摸事件的目标，但其子视图可以。它的行为类似于 CSS 中该视图具有以下类：

```css
.box-none {
  pointer-events: none;
}
.box-none * {
  pointer-events: auto;
}
```

- `'box-only'`：`View` 可以成为触摸事件的目标，但其子视图不可以。它的行为类似于 CSS 中该视图具有以下类：

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

一个 ref setter，在挂载时会被分配到一个 [元素节点](element-nodes)。

---

### `removeClippedSubviews`

这是由 `RCTView` 暴露的保留性能属性，对于有许多子视图、其中大多数在屏幕外的滚动内容很有用。要使此属性生效，必须将其应用于一个包含许多伸出其边界的子视图的视图。子视图还必须设置 `overflow: hidden`，容器视图（或其某个父视图）也应如此。

| 类型 |
| ---- |
| bool |

---

### `renderToHardwareTextureAndroid` <div className="label android">Android</div>

此 `View` 是否应将自身（及其所有子元素）渲染到 GPU 上的单个硬件纹理中。

在 Android 上，这对只修改不透明度、旋转、平移和/或缩放的动画和交互很有用：在这些情况下，无需重新绘制视图，也无需重新执行显示列表。纹理可以被重复使用并以不同参数重新合成。缺点是这会消耗有限的视频内存，因此应在交互/动画结束时将此属性重新设为 false。

| 类型 |
| ---- |
| bool |

---

### `role`

`role` 向辅助技术用户传达组件的用途。其优先级高于 [`accessibilityRole`](view#accessibilityrole) 属性。

| 类型                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `shouldRasterizeIOS` <div className="label ios">iOS</div>

此 `View` 在合成之前是否应先渲染为位图。

在 iOS 上，这对不会修改组件尺寸或其子元素的动画和交互很有用；例如，当平移一个静态视图的位置时，栅格化允许渲染器复用静态视图的缓存位图，并在每一帧快速合成。

栅格化会带来一次离屏绘制过程，并且位图会消耗内存。使用此属性时请进行测试和度量。

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

此 `View` 是否应可通过非触摸输入设备获得焦点，例如通过硬件键盘获得焦点。
支持以下值：

- `0` - View 可获得焦点
- `-1` - View 不可获得焦点

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
