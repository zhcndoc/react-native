---
id: view
title: 视图
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

构建 UI 最基础的组件 `View` 是一个支持使用 [flexbox](flexbox.md) 进行布局、使用 [style](style.md) 设置样式、进行[一些触摸处理](handling-touches.md)以及控制[辅助功能](accessibility.md)的容器。无论 React Native 运行在哪个平台上，`View` 都会直接映射到该平台对应的原生视图，例如 `UIView`、`<div>`、`android.view` 等。

`View` 旨在嵌套在其他视图中使用，并且可以有 0 到多个任意类型的子元素。

此示例创建了一个 `View`，它将两个带颜色的方框和一个文本组件包装在一个带内边距的行中。

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
为了清晰性和性能，`View` 设计为与 [`StyleSheet`](style.md) 搭配使用，不过也支持内联样式
:::

### 合成触摸事件

对于 `View` responder 属性（例如 `onResponderMove`），传递给它们的合成触摸事件的形式为 [PressEvent](pressevent)

---

# 参考

## 属性

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含名称和标签字段。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibility-actions)

| 类型  |
| ----- |
| array |

---

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，指示给定的辅助功能元素及其包含的任何辅助功能元素是否处于隐藏状态。默认为 `false`。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibilityelementshidden-ios)

| 类型 |
| ---- |
| bool |

---

### `accessibilityHint`

辅助功能提示可帮助用户了解当他们对辅助功能元素执行操作时将会发生什么，尤其是在辅助功能标签无法清晰说明结果的情况下。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，指示用户与元素交互时屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，指示启用颜色反转时是否应对该视图进行反转。值为 `true` 时，即使启用了颜色反转，也会告知视图不要进行反转。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibilityignoresinvertcolors)

| 类型 |
| ---- |
| bool |

---

### `accessibilityLabel`

覆盖用户与元素交互时屏幕阅读器读取的文本。默认情况下，标签通过遍历所有子元素并将所有 `Text` 节点以空格分隔后累积构建而成。

| 类型   |
| ------ |
| string |

---

### `accessibilityLiveRegion` <div className="label android">Android</div>

指示是否应在此视图发生变化时通知用户辅助功能服务。仅适用于 Android API >= 19。可能的值：

- `'none'` - 辅助功能服务不应播报此视图的变化
- `'polite'`- 辅助功能服务应播报此视图的变化
- `'assertive'` - 辅助功能服务应中断正在进行的语音，立即播报此视图的变化

有关参考信息，请参阅 [Android `View` 文档](https://developer.android.com/reference/android/view/View.html#attr_android:accessibilityLiveRegion)。

| 类型                                |
| ----------------------------------- |
| enum('none', 'polite', 'assertive') |

---

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下值之一：

- `'none'` - 用于元素没有角色的情况
- `'button'` - 用于元素应被视为按钮的情况
- `'link'` - 用于元素应被视为链接的情况
- `'search'` - 用于文本字段元素还应被视为搜索字段的情况
- `'image'` - 用于元素应被视为图像的情况。可以与 button 或 link 组合使用，例如
- `'keyboardkey'` - 用于元素充当键盘按键的情况
- `'text'` - 用于元素应被视为无法更改的静态文本的情况
- `'adjustable'` - 用于元素可以被“调整”的情况（例如滑块）
- `'imagebutton'` - 用于元素应被视为按钮且同时为图像的情况
- `'header'` - 用于元素充当内容区域标题的情况（例如导航栏的标题）
- `'summary'` - 用于元素可在应用首次启动时提供应用当前状况的快速摘要的情况
- `'alert'` - 用于元素包含要向用户呈现的重要文本的情况
- `'checkbox'` - 用于元素表示可选中、取消选中或处于混合选中状态的复选框的情况
- `'combobox'` - 用于元素表示允许用户从多个选项中进行选择的组合框的情况
- `'menu'` - 用于组件为选项菜单的情况
- `'menubar'` - 用于组件为多个菜单的容器的情况
- `'menuitem'` - 用于表示菜单中的项目
- `'progressbar'` - 用于表示指示任务进度的组件
- `'radio'` - 用于表示单选按钮
- `'radiogroup'` - 用于表示单选按钮组
- `'scrollbar'` - 用于表示滚动条
- `'spinbutton'` - 用于表示会打开选项列表的按钮
- `'switch'` - 用于表示可打开和关闭的开关
- `'tab'` - 用于表示选项卡
- `'tablist'` - 用于表示选项卡列表
- `'timer'` - 用于表示计时器
- `'toolbar'` - 用于表示工具栏（操作按钮或组件的容器）
- `'grid'` - 与 ScrollView、VirtualizedList、FlatList 或 SectionList 搭配使用时，用于表示网格。会向 Android GridView 添加进入或离开网格的播报

| 类型   |
| ------ |
| string |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibilitystate-ios-android)。

| 类型                                                                                             |
| ------------------------------------------------------------------------------------------------ |
| object: `{disabled: bool, selected: bool, checked: bool or 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；对于滑块和进度条等基于范围的组件，它包含范围信息（最小值、当前值和最大值）。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibilityvalue-ios-android)。

| 类型                                                            |
| --------------------------------------------------------------- |
| object: `{min: number, max: number, now: number, text: string}` |

---

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个值，指示 VoiceOver 是否应忽略与当前接收者同级的视图中的元素。默认为 `false`。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibilityviewismodal-ios)。

| 类型 |
| ---- |
| bool |

---

### `accessible`

当值为 `true` 时，表示该视图是辅助功能元素，并且可被屏幕阅读器和硬件键盘等辅助技术发现。默认情况下，所有可触摸元素都是可访问的。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessible)。

---

### `aria-busy`

表示元素正在被修改，辅助技术可能希望等到更改完成后再向用户通知更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-checked`

表示可勾选元素的状态。此字段可以接受布尔值，或使用 `"mixed"` 字符串表示混合状态的复选框。

| 类型             | 默认值 |
| ---------------- | ------ |
| boolean, 'mixed' | false  |

---

### `aria-disabled`

表示元素可感知但处于禁用状态，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-hidden`

表示元素是否对辅助技术隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设置为 `true` 会使 VoiceOver 忽略 `B` 元素及其子元素。

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

### `aria-labelledby` <div className="label android">Android</div>

标识用于标记应用此属性的元素的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| string |

---

### `aria-live` <div className="label android">Android</div>

表示元素将被更新，并描述用户代理、辅助技术和用户可以从实时区域中预期的更新类型。

- **off** 辅助功能服务不应播报此视图的变化
- **polite** 辅助功能服务应播报此视图的变化
- **assertive** 辅助功能服务应中断正在进行的语音，立即播报此视图的变化

| 类型                                     | 默认值  |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

指示 VoiceOver 是否应忽略与当前接收者同级的视图中的元素的布尔值。其优先级高于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

---

### `aria-selected`

表示可选择元素当前是否处于选中状态。

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

仅用于布局其子元素或不绘制任何内容的视图，可能会作为优化自动从原生层级结构中移除。将此属性设置为 `false` 可禁用此优化，并确保此 `View` 存在于原生视图层级结构中。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `collapsableChildren`

设置为 false 可防止视图的直接子元素从原生视图层级结构中移除，其效果类似于在每个子元素上设置 `collapsable={false}`。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | true   |

---

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

`experimental_accessibilityOrder` 指示辅助技术聚焦此 `View` 后代元素的顺序。此属性接受一个字符串数组，其中每个字符串都是某个后代组件的 [`nativeID`](view.md#nativeid)，用于定义其顺序。此属性本身不会启用辅助功能，每个被引用的组件仍需要通过将 [`accessible`](view.md#accessible) 设置为 true 来实现可访问。此属性同时具有**可嵌套**和**穷尽性**，这意味着

- 如果 `experimental_accessibilityOrder` 包含对某个不可访问组件的引用，它将按默认顺序聚焦该组件的后代。此外，它还可以包含对其他同样具有 `experimental_accessibilityOrder` 的组件的引用
- 如果某个本身可访问的组件未在 `experimental_accessibilityOrder` 中被直接引用，也未嵌套在 `experimental_accessibilityOrder` 直接引用的某个容器中，则该组件将不可访问

有关更多信息，请参阅[辅助功能指南](accessibility.md#experimental_accessibilityorder)。

| 类型             |
| ---------------- |
| array of strings |

---

### `focusable` <div className="label android">Android</div>

此 `View` 是否应支持通过非触摸输入设备获得焦点，例如通过硬件键盘接收焦点。

| 类型    |
| ------- |
| boolean |

---

### `hitSlop`

定义触摸事件可以在距离视图多远的位置开始。典型的界面指南建议触摸目标至少为 30 - 40 点／与密度无关的像素。

例如，如果可触摸视图的高度为 20，则可以使用 `hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}` 将可触摸高度扩展到 40

:::note
触摸区域永远不会超出父视图的边界；如果触摸命中两个重叠的视图，同级视图的 Z-index 始终具有优先权
:::

| 类型                                                                 |
| -------------------------------------------------------------------- |
| object: `{top: number, left: number, bottom: number, right: number}` |

---

### `id`

用于从原生类中定位此视图。其优先级高于 `nativeID` 属性。

:::warning
这会禁用此视图的“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |

---

### `importantForAccessibility` <div className="label android">Android</div>

控制视图对辅助功能的重要性，包括它是否触发辅助功能事件，以及是否会被查询屏幕的辅助功能服务报告。仅适用于 Android。

可能的值：

- `'auto'` - 系统确定视图对辅助功能是否重要——默认值（推荐）
- `'yes'` - 视图对辅助功能很重要
- `'no'` - 视图对辅助功能不重要
- `'no-hide-descendants'` - 视图对辅助功能不重要，其后代视图也不重要

有关参考信息，请参阅 [Android `importantForAccessibility` 文档](https://developer.android.com/reference/android/R.attr.html#importantForAccessibility)。

| 类型                                             |
| ------------------------------------------------ |
| enum('auto', 'yes', 'no', 'no-hide-descendants') |

---

### `nativeID`

用于从原生类中定位此视图。

:::warning
这会禁用此视图的“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |

---

### `needsOffscreenAlphaCompositing`

此 `View` 是否需要在屏幕外进行渲染，并使用 alpha 进行合成，以保留 100% 正确的颜色和混合行为。默认值（`false`）会改为使用绘制每个元素的画笔，以应用 alpha 绘制组件及其子元素，而不是将完整组件渲染到屏幕外后再使用 alpha 值将其合成回去。当设置不透明度的 `View` 包含多个重叠元素时（例如多个重叠的 `View`，或文本和背景），此默认行为可能很明显且不符合预期。

为了保留正确的 alpha 行为而在屏幕外渲染，对于非原生开发者来说代价极高且难以调试，这就是它默认未启用的原因。如果确实需要为动画启用此属性，并且视图的**内容**是静态的（即不需要在每一帧重新绘制），请考虑将其与 renderToHardwareTextureAndroid 结合使用。如果启用该属性，此 View 将在屏幕外渲染一次，保存到硬件纹理中，然后每帧使用 alpha 合成到屏幕上，而无需在 GPU 上切换渲染目标。

| 类型 |
| ---- |
| bool |

---

### `nextFocusDown` <div className="label android">Android</div>

指定用户向下导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型   |
| ------ |
| number |

---

### `nextFocusForward` <div className="label android">Android</div>

指定用户向前导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型   |
| ------ |
| number |

---

### `nextFocusLeft` <div className="label android">Android</div>

指定用户向左导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型   |
| ------ |
| number |

---

### `nextFocusRight` <div className="label android">Android</div>

指定用户向右导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型   |
| ------ |
| number |

---

### `nextFocusUp` <div className="label android">Android</div>

指定用户向上导航时下一个接收焦点的视图。请参阅 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型   |
| ------ |
| number |

---

### `onAccessibilityAction`

用户执行辅助功能操作时调用。此函数唯一的参数是一个事件，其中包含要执行的操作名称。

有关更多信息，请参阅[辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityEscape` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行逃逸手势后，系统将调用此函数。

| 类型     |
| -------- |
| function |

---

### `onAccessibilityTap` <div className="label ios">iOS</div>

当 `accessible` 为 true 时，用户执行辅助功能点击手势后，系统将尝试调用此函数。

| 类型     |
| -------- |
| function |

---

### `onLayout`

在挂载时以及布局发生变化时调用。

布局计算完成后会立即触发此事件，但收到事件时，新布局可能尚未反映在屏幕上，尤其是在布局动画进行期间。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onMagicTap` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，用户执行魔法点击手势后，系统将调用此函数。

| 类型     |
| -------- |
| function |

---

### `onMoveShouldSetResponder`

此视图是否希望“声明”触摸响应权？当 `View` 不是 responder 时，每次触摸移动都会调用此函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onMoveShouldSetResponderCapture`

如果父级 `View` 希望阻止子级 `View` 在移动时成为 responder，则应设置一个返回 `true` 的处理函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onResponderGrant`

View 现在正在响应触摸事件。这是突出显示并向用户展示当前发生情况的时机。

在 Android 上，从此回调返回 true 可防止其他原生组件在此 responder 终止之前成为 responder。

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

另一个 responder 已处于活动状态，并且不会将其释放给请求成为 responder 的那个 `View`。

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

responder 已从 `View` 中被移除。可能是在调用 `onResponderTerminationRequest` 后被其他视图获取，也可能由 OS 在未询问的情况下获取（例如在 iOS 上打开控制中心／通知中心时）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他某个 `View` 希望成为 responder，并请求此 `View` 释放其 responder。返回 `true` 即允许释放。

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

如果父级 `View` 希望阻止子级 `View` 在触摸开始时成为 responder，则应设置一个返回 `true` 的处理函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`：View 可以成为触摸事件的目标
- `'none'`：View 永远不会成为触摸事件的目标
- `'box-none'`：View 永远不会成为触摸事件的目标，但其子视图可以。其行为类似于该视图在 CSS 中具有以下类：

```css
.box-none {
  pointer-events: none;
}
.box-none * {
  pointer-events: auto;
}
```

- `'box-only'`：视图可以成为触摸事件的目标，但其子视图不可以。其行为类似于该视图在 CSS 中具有以下类：

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

一个 ref setter，在挂载时会被赋值为一个[元素节点](element-nodes)。

---

### `removeClippedSubviews`

这是由 `RCTView` 暴露的保留性能属性，适用于包含许多子视图且其中大多数位于屏幕外的滚动内容。要使此属性生效，必须将其应用于包含许多超出自身边界的子视图的视图。子视图还必须设置 `overflow: hidden`，包含视图自身（或其某个父视图）也应如此。

| 类型 |
| ---- |
| bool |

---

### `renderToHardwareTextureAndroid` <div className="label android">Android</div>

此 `View` 是否应将自身（及其所有子元素）渲染到 GPU 上的单个硬件纹理中。

在 Android 上，这对于只修改不透明度、旋转、平移和／或缩放的动画和交互很有用：在这些情况下，不需要重新绘制视图，也不需要重新执行显示列表。纹理可以重复使用，并使用不同的参数重新合成。缺点是这可能会占用有限的视频内存，因此应在交互／动画结束时将此属性重新设置为 false。

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

此 `View` 是否应在合成前渲染为位图。

在 iOS 上，这对于不会修改组件尺寸或其子元素的动画和交互很有用；例如，在平移静态视图的位置时，光栅化允许渲染器重复使用静态视图的缓存位图，并在每一帧快速将其合成。

光栅化会产生一次屏幕外绘制过程，并且位图会占用内存。使用此属性时请进行测试和测量。

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

此 `View` 是否应支持通过非触摸输入设备获得焦点，例如通过硬件键盘接收焦点。
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
这会禁用此视图的“仅布局视图移除”优化！
:::

| 类型   |
| ------ |
| string |
