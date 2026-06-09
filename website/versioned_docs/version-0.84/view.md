---
id: view
title: 视图
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

构建用户界面最基本的组件，`View` 是一个容器，支持使用 [flexbox](flexbox.md)、[样式](style.md)、[部分触摸处理](handling-touches.md) 以及 [辅助功能](accessibility.md) 控制。`View` 直接映射到 React Native 运行的任意平台上的原生视图对应物，无论是 `UIView`、`<div>`、`android.view` 等。

`View` 设计为可以嵌套在其他视图内部，并且可以拥有零个或多个任意类型的子元素。

以下示例创建了一个 `View`，在一行内包裹两个带颜色的盒子和一个文本组件，带有内边距。

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
`View` 设计推荐与 [`StyleSheet`](style.md) 一起使用，以提高代码清晰度和性能，虽然也支持内联样式。
:::

### 合成触摸事件

对于 `View` 的响应者属性（如 `onResponderMove`），传入的合成触摸事件形式为 [PressEvent](pressevent)。

---

# 参考资料

## 属性

---

### `accessibilityActions`

辅助功能操作允许辅助技术通过编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含名称和标签字段。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  |
| ----- |
| 数组  |

---

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

布尔值，指示该辅助功能元素以及它包含的任何辅助功能元素是否被隐藏。默认值为 `false`。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilityelementshidden-ios)。

| 类型  |
| ----- |
| 布尔值 |

---

### `accessibilityHint`

辅助功能提示帮助用户理解当他们操作此辅助功能元素时将发生什么，尤其是当结果无法从辅助功能标签中清楚看出时。

| 类型  |
| ----- |
| 字符串 |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示当用户与元素交互时屏幕朗读器应使用哪种语言。应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型  |
| ----- |
| 字符串 |

---

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

指示在启用颜色反转时，此视图是否应被反转。值为 `true` 时，即使启用了颜色反转，也将告诉视图不被反转。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilityignoresinvertcolors)。

| 类型  |
| ----- |
| 布尔值 |

---

### `accessibilityLabel`

覆盖屏幕朗读器在用户与元素交互时朗读的文字。默认情况下，标签由遍历所有子元素并累积所有 `Text` 节点内容，以空格分隔组成。

| 类型  |
| ----- |
| 字符串 |

---

### `accessibilityLiveRegion` <div className="label android">Android</div>

指示辅助功能服务是否应在此视图发生变化时通知用户。仅适用于 Android API >= 19。可选值：

- `'none'` - 辅助功能服务不应宣布此视图的变化。
- `'polite'` - 辅助功能服务应宣布此视图的变化。
- `'assertive'` - 辅助功能服务应中断正在进行的语音，立即宣布此视图的变化。

参考 [Android `View` 文档](https://developer.android.com/reference/android/view/View.html#attr_android:accessibilityLiveRegion)。

| 类型                             |
| -------------------------------- |
| 枚举 ('none', 'polite', 'assertive') |

---

### `accessibilityRole`

`accessibilityRole` 用于向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下任意值：

- `'none'` - 表示元素无角色。
- `'button'` - 元素应被视为按钮。
- `'link'` - 元素应被视为链接。
- `'search'` - 文本字段元素同时应被视为搜索字段。
- `'image'` - 元素应被视为图像。可与按钮或链接组合使用。
- `'keyboardkey'` - 元素充当键盘按键。
- `'text'` - 元素应视为静态文本，不会变化。
- `'adjustable'` - 元素可被“调节”（如滑块）。
- `'imagebutton'` - 元素既是按钮也是图像。
- `'header'` - 元素作为内容段落的标题（如导航栏标题）。
- `'summary'` - 元素可用作应用启动时提供当前状态的快速摘要。
- `'alert'` - 元素包含需向用户呈现的重要文本。
- `'checkbox'` - 元素代表复选框，可能被选中、未选中或混合选中状态。
- `'combobox'` - 元素代表组合框，允许用户选择多个选项。
- `'menu'` - 元素为一个菜单。
- `'menubar'` - 元素为包含多个菜单的容器。
- `'menuitem'` - 代表菜单中的一项。
- `'progressbar'` - 代表用于显示任务进度的组件。
- `'radio'` - 代表单选按钮。
- `'radiogroup'` - 代表单选按钮组。
- `'scrollbar'` - 代表滚动条。
- `'spinbutton'` - 代表打开选择列表的按钮。
- `'switch'` - 代表可开关的开关控件。
- `'tab'` - 代表标签页。
- `'tablist'` - 代表标签页列表。
- `'timer'` - 代表计时器。
- `'toolbar'` - 代表工具栏（动作按钮或组件的容器）。
- `'grid'` - 与 `ScrollView`、`VirtualizedList`、`FlatList` 或 `SectionList` 配合使用代表网格，增加进/出网格时的通知。

| 类型  |
| ----- |
| 字符串 |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                         |
| ------------------------------------------------------------ |
| 对象：`{disabled: bool, selected: bool, checked: bool 或 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityValue`

表示组件的当前值。可以是组件值的文本描述，或者对于基于范围的组件，如滑块和进度条，包含范围信息（最小值、当前值和最大值）。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                       |
| ---------------------------------------------------------- |
| 对象：`{min: number, max: number, now: number, text: string}` |

---

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

指示 VoiceOver 是否应该忽略与接收器为同级的其他视图中的元素。默认值为 `false`。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibilityviewismodal-ios)。

| 类型  |
| ----- |
| 布尔值 |

---

### `accessible`

当为 `true` 时，表示此视图是可被辅助技术（例如屏幕阅读器和硬件键盘）发现的辅助功能元素。默认情况下，所有可触摸元素都是可访问的。

更多信息请参阅 [辅助功能指南](accessibility.md#accessible)。

---

### `aria-busy`

表示元素正被修改，辅助技术可能希望等待修改完成后再通知用户。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | false   |

---

### `aria-checked`

表示可检查元素的状态。此字段可以是布尔值或字符串 `'mixed'`，用于表示混合状态的复选框。

| 类型               | 默认   |
| ------------------ | ------- |
| 布尔值或 `'mixed'` | false   |

---

### `aria-disabled`

表示元素是可感知的但被禁用，因此不可编辑或操作。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | false   |

---

### `aria-expanded`

表示可展开元素当前是否处于展开或折叠状态。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | false   |

---

### `aria-hidden`

表示元素是否被辅助技术隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 及其子元素。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | false   |

---

### `aria-label`

定义标签交互元素的字符串值。

| 类型  |
| ----- |
| 字符串 |

---

### `aria-labelledby` <div className="label android">Android</div>

标识标记该元素的元素。`aria-labelledby` 的值应该匹配相关元素的 [`nativeID`](view.md#nativeid)：

```tsx
<View>
  <Text nativeID="formLabel">输入字段标签</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型  |
| ----- |
| 字符串 |

---

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以预期来自该直播区域的更新类型。

- **off** 辅助功能服务不应宣布此视图的变化。
- **polite** 辅助功能服务应宣布此视图的变化。
- **assertive** 辅助功能服务应打断当前语音立即宣布视图变化。

| 类型                               | 默认   |
| --------------------------------- | ------- |
| 枚举 (`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略与接收器为同级的其他视图中的元素。此属性优先于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | false   |

---

### `aria-selected`

表示一个可选元素当前是否被选中。

| 类型  |
| ----- |
| 布尔值 |

---

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。优先级高于 `accessibilityValue` 属性中的 `max`。

| 类型  |
| ----- |
| 数字  |

---

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。优先级高于 `accessibilityValue` 属性中的 `min`。

| 类型  |
| ----- |
| 数字  |

---

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。优先级高于 `accessibilityValue` 属性中的 `now`。

| 类型  |
| ----- |
| 数字  |

---

### `aria-valuetext`

表示组件的文本描述。优先级高于 `accessibilityValue` 属性中的 `text`。

| 类型  |
| ----- |
| 字符串 |

---

### `collapsable`

仅用于布局子元素或不绘制任何内容的视图，可能会为优化自动从原生层级中移除。将此属性设置为 `false` 以禁用此优化，确保此 `View` 存在于原生视图层级中。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | true    |

---

### `collapsableChildren`

设置为 `false` 可以防止视图的直接子视图被从原生视图层级中移除，效果类似于对每个子视图设置 `collapsable={false}`。

| 类型    | 默认   |
| ------- | ------- |
| 布尔值  | true    |

---

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

`experimental_accessibilityOrder` 指示辅助技术聚焦该 `View` 的后代元素的顺序。此属性接受字符串数组，每个字符串是某个后代组件的 [`nativeID`](view.md#nativeid)，用以定义顺序。此属性本身不启用辅助访问功能，每个引用的组件仍需通过设置 [`accessible`](view.md#accessible) 为 true 来可访问。此属性具有**可嵌套**且**详尽**的特性：

- 如果 `experimental_accessibilityOrder` 包含对非可访问组件的引用，则默认以常规顺序聚焦该组件的后代。此外，它也可以包含对具有自身 `experimental_accessibilityOrder` 的其他组件的引用。
- 如果某些本应可访问的组件未直接在 `experimental_accessibilityOrder` 中引用，或未嵌套在直接引用容器内，则这些组件将不可访问。

详见 [辅助功能指南](accessibility.md#experimental_accessibilityorder)。

| 类型  |
| ----- |
| 字符串数组 |

---

### `focusable` <div className="label android">Android</div>

指示此 `View` 是否可通过非触摸输入设备获得焦点，例如硬件键盘。

| 类型  |
| ----- |
| 布尔值 |

---

### `hitSlop`

定义触摸事件可在视图边界外多远开始。一般界面指南推荐触摸目标尺寸至少为 30 - 40 点（独立于密度的像素）。

例如，如果一个可触摸视图高度为 20，通过 `hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}` 可以将可触摸高度扩展至 40。

:::note
触摸区域永远不会超出父视图的边界，并且如果触摸区域覆盖多个视图，兄弟视图的 Z-index 始终具有优先权。
:::

| 类型                                                          |
| ------------------------------------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` |

---

### `id`

用于在原生类中定位此视图。优先级高于 `nativeID` 属性。

:::warning
此设置会禁用该视图的“仅布局视图移除”优化！
:::

| 类型  |
| ----- |
| 字符串 |

---

### `importantForAccessibility` <div className="label android">Android</div>

控制视图对辅助功能的重要性，即是否触发辅助事件，是否被查询屏幕的辅助服务报告。仅适用于 Android。

可选值：

- `'auto'` - 系统决定视图辅助功能重要性，默认（推荐）。
- `'yes'` - 视图对辅助功能重要。
- `'no'` - 视图对辅助功能不重要。
- `'no-hide-descendants'` - 视图及其所有后代对辅助功能均不重要。

参考 [Android `importantForAccessibility` 文档](https://developer.android.com/reference/android/R.attr.html#importantForAccessibility)。

| 类型                                            |
| ------------------------------------------------ |
| 枚举 ('auto', 'yes', 'no', 'no-hide-descendants') |

---

### `nativeID`

用于在原生类中定位此视图。

:::warning
此设置会禁用该视图的“仅布局视图移除”优化！
:::

| 类型  |
| ----- |
| 字符串 |

---

### `needsOffscreenAlphaCompositing`

指示该 `View` 是否需要离屏渲染并以 alpha 混合，以确保 100% 正确的颜色和混合行为。默认值 (`false`) 会应用 alpha 值绘制组件及其子元素，而非离屏渲染并混合。这在视图包含多个重叠元素（如多个重叠的 `View` 或文字和背景）时可能导致颜色表现不理想。

离屏渲染开销极大，调试困难，故默认关闭。如果因为动画需要启用此属性，建议结合 `renderToHardwareTextureAndroid` 使用（如果视图内容静态，即不需每帧重绘）。这样视图会被离屏渲染一次，缓存为硬件纹理，然后每帧以 alpha 合成，无需频繁切换 GPU 渲染目标。

| 类型  |
| ----- |
| 布尔值 |

---

### `nextFocusDown` <div className="label android">Android</div>

指定用户导航向下时应获取焦点的下一个视图。参考 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型  |
| ----- |
| 数字  |

---

### `nextFocusForward` <div className="label android">Android</div>

指定用户导航向前时应获取焦点的下一个视图。参考 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型  |
| ----- |
| 数字  |

---

### `nextFocusLeft` <div className="label android">Android</div>

指定用户导航向左时应获取焦点的下一个视图。参考 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型  |
| ----- |
| 数字  |

---

### `nextFocusRight` <div className="label android">Android</div>

指定用户导航向右时应获取焦点的下一个视图。参考 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型  |
| ----- |
| 数字  |

---

### `nextFocusUp` <div className="label android">Android</div>

指定用户导航向上时应获取焦点的下一个视图。参考 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型  |
| ----- |
| 数字  |

---

### `onAccessibilityAction`

用户执行辅助功能操作时会调用此函数。函数唯一参数为事件，包含要执行操作的名称。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型   |
| ------ |
| 函数   |

---

### `onAccessibilityEscape` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行退出手势时系统调用此函数。

| 类型   |
| ------ |
| 函数   |

---

### `onAccessibilityTap` <div className="label ios">iOS</div>

当 `accessible` 为真时，用户执行辅助功能点击手势时，系统尝试调用此函数。

| 类型   |
| ------ |
| 函数   |

---

### `onLayout`

组件挂载及布局变化时触发。

此事件在布局计算完成后立即触发，但此时新布局可能尚未在屏幕上显示，特别是处于布局动画期间时。

| 类型                                                     |
| -------------------------------------------------------- |
| `(md ({nativeEvent: [LayoutEvent](layoutevent)}) => void)` |

---

### `onMagicTap` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行魔法点击手势时系统调用此函数。

| 类型   |
| ------ |
| 函数   |

---

### `onMoveShouldSetResponder`

此视图是否希望“声明”触摸响应器？当视图不是响应者时，每一步触摸移动都会调用此函数。

| 类型                                                     |
| -------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => boolean)` |

---

### `onMoveShouldSetResponderCapture`

当父视图想要阻止子视图在移动时成为响应者，应提供此处理函数并返回 `true`。

| 类型                                                     |
| -------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => boolean)` |

---

### `onResponderGrant`

视图现在成为触摸事件的响应者。此时应高亮显示并向用户显示状态。

在 Android 上，若要防止其他原生组件在此响应者终止前成为响应者，应返回 `true`。

| 类型                                                             |
| ----------------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void ｜ boolean` |

---

### `onResponderMove`

用户正在移动手指。

| 类型                                                    |
| ------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => void)` |

---

### `onResponderReject`

已有其他响应者活跃且不会放弃响应权，该视图请求成为响应者被拒绝时调用。

| 类型                                                    |
| ------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => void)` |

---

### `onResponderRelease`

触摸结束时触发。

| 类型                                                    |
| ------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => void)` |

---

### `onResponderTerminate`

响应者被夺走。可能发生于调用 `onResponderTerminationRequest` 后被其他视图夺走，或被系统无询问夺走（例如 iOS 控制中心/通知中心出现时）。

| 类型                                                    |
| ------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => void)` |

---

### `onResponderTerminationRequest`

有其他视图希望成为响应者，请求此视图释放响应者，如果返回 `true` 则允许释放。

| 类型                                                    |
| ------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => void)` |

---

### `onStartShouldSetResponder`

视图是否希望在触摸开始时成为响应者？

| 类型                                                     |
| -------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => boolean)` |

---

### `onStartShouldSetResponderCapture`

父视图想要阻止子视图在触摸开始时成为响应者，应提供此处理函数并返回 `true`。

| 类型                                                     |
| -------------------------------------------------------- |
| `(md ({nativeEvent: [PressEvent](pressevent)}) => boolean)` |

---

### `pointerEvents`

控制 `View` 是否能成为触摸事件目标。

- `'auto'`：视图可以成为触摸目标。
- `'none'`：视图永远不会成为触摸目标。
- `'box-none'`：视图本身永远不是触摸目标，但子视图可以。效果类似于以下 CSS：

```css
.box-none {
  pointer-events: none;
}
.box-none * {
  pointer-events: auto;
}
```

- `'box-only'`：视图本身可以成为触摸目标，但子视图不能。效果类似于以下 CSS：

```css
.box-only {
  pointer-events: auto;
}
.box-only * {
  pointer-events: none;
}
```

| 类型                                 |
| ------------------------------------ |
| 枚举 ('box-none', 'none', 'box-only', 'auto') |

---

### `ref`

一个 ref 设置函数，挂载时会被赋值为对应的 [元素节点](element-nodes)。

---

### `removeClippedSubviews`

这是 `RCTView` 暴露的保留性能属性，当内容多且大部分视图在屏幕外滚动时非常有用。为了使其生效，需应用于包含许多超出自身边界子视图的视图。子视图需设置 `overflow: hidden`，且其容器视图（或某一父视图）亦应如此。

| 类型  |
| ----- |
| 布尔值 |

---

### `renderToHardwareTextureAndroid` <div className="label android">Android</div>

指示此 `View` 是否应该将自身（及所有子元素）渲染为 GPU 上的单一硬件纹理。

在 Android 上，对于只改动透明度、旋转、平移和/或缩放的动画和交互很有用：视图无需重绘，显示列表无需重复执行。纹理可以重复使用并以不同参数复合。缺点是可能消耗有限的视频内存，因此动画结束后应将此属性设为 false。

| 类型  |
| ----- |
| 布尔值 |

---

### `role`

`role` 用于向辅助技术用户传达组件的用途。优先级高于 [`accessibilityRole`](view#accessibilityrole)。

| 类型          |
| ------------- |
| [Role](accessibility#role) |

---

### `shouldRasterizeIOS` <div className="label ios">iOS</div>

指示此 `View` 是否应先作为位图渲染后再进行混合。

在 iOS 上，适用于未修改尺寸及子控件的动画和交互；例如，平移静态视图时，光栅化允许渲染器复用缓存的静态视图位图，快速复合每一帧。

光栅化会带来离屏绘制开销和内存消耗，使用时需测试和测量性能。

| 类型  |
| ----- |
| 布尔值 |

---

### `style`

| 类型                               |
| ---------------------------------- |
| [视图样式](view-style-props)       |

---

### `tabIndex` <div className="label android">Android</div>

指示此 `View` 是否应通过非触摸输入设备（如硬件键盘）可聚焦。支持以下值：

- `0` - 视图可聚焦
- `-1` - 视图不可聚焦

| 类型           |
| -------------- |
| 枚举 (0, -1)  |

---

### `testID`

用于定位此视图以进行端到端测试。

:::warning
此设置会禁用该视图的“仅布局视图移除”优化！
:::

| 类型  |
| ----- |
| 字符串 |