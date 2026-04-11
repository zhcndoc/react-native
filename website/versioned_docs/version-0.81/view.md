---
id: view
title: View
---

构建 UI 最基本的组件，`View` 是一个支持使用 [flexbox](flexbox.md)、[样式](style.md)、[一些触摸处理](handling-touches.md) 和 [无障碍](accessibility.md) 控制的容器。`View` 直接映射到无论 React Native 运行在什么平台上的原生视图等价物，无论是 `UIView`、`<div>`、`android.view` 等。

`View` 设计为嵌套在其他视图中，并且可以拥有 0 到多个任何类型的子元素。

此示例创建了一个 `View`，它在行中使用内边距包裹了两个带颜色的框和一个文本组件。

```SnackPlayer name=View%20Example
import React from 'react';
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

> `View` 设计为与 [`StyleSheet`](style.md) 一起使用以获得清晰性和性能，尽管也支持内联样式。

### 合成触摸事件

对于 `View` 响应器属性（例如 `onResponderMove`），传递给它们的合成触摸事件形式为 [PressEvent](pressevent)。

---

# 参考

## 属性

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名称和标签。

参见 [无障碍指南](accessibility.md#accessibility-actions) 获取更多信息。

| 类型 |
| ----- |
| 数组 |

---

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，指示给定的无障碍元素及其包含的任何无障碍元素是否隐藏。默认为 `false`。

参见 [无障碍指南](accessibility.md#accessibilityelementshidden-ios) 获取更多信息。

| 类型 |
| ---- |
| 布尔值 |

---

### `accessibilityHint`

无障碍提示帮助用户理解当他们在无障碍元素上执行操作时会发生什么，当结果从无障碍标签中不清楚时。

| 类型 |
| ------ |
| 字符串 |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，指示当用户与元素交互时屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage) 获取更多信息。

| 类型 |
| ------ |
| 字符串 |

---

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

一个值，指示当颜色反转开启时，此视图应该或不应该被反转。值为 `true` 将告诉视图即使颜色反转开启也不要被反转。

参见 [无障碍指南](accessibility.md#accessibilityignoresinvertcolors) 获取更多信息。

| 类型 |
| ---- |
| 布尔值 |

---

### `accessibilityLabel`

覆盖当用户与元素交互时屏幕阅读器读取的文本。默认情况下，标签是通过遍历所有子元素并累积所有由空格分隔的 `Text` 节点构建的。

| 类型 |
| ------ |
| 字符串 |

---

### `accessibilityLiveRegion` <div className="label android">Android</div>

向无障碍服务指示当此视图更改时是否应通知用户。仅适用于 Android API >= 19。可能的值：

- `'none'` - 无障碍服务不应宣布对此视图的更改。
- `'polite'`- 无障碍服务应宣布对此视图的更改。
- `'assertive'` - 无障碍服务应中断正在进行的语音以立即宣布对此视图的更改。

参见 [Android `View` 文档](https://developer.android.com/reference/android/view/View.html#attr_android:accessibilityLiveRegion) 参考。

| 类型 |
| ----------------------------------- |
| 枚举 ('none', 'polite', 'assertive') |

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
- `'text'` - 当元素应被视为不能更改的静态文本时使用。
- `'adjustable'` - 当元素可以“调整”时使用（例如滑块）。
- `'imagebutton'` - 当元素应被视为按钮且也是图像时使用。
- `'header'` - 当元素充当内容部分的标题时使用（例如导航栏的标题）。
- `'summary'` - 当元素可用于在应用首次启动时提供应用中当前条件的快速摘要时使用。
- `'alert'` - 当元素包含要呈现给用户的重要文本时使用。
- `'checkbox'` - 当元素代表一个可以选中、取消选中或具有混合选中状态的复选框时使用。
- `'combobox'` - 当元素代表一个组合框时使用，允许用户在几个选项中选择。
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
- `'grid'` - 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用以代表网格。将进出网格的公告添加到 android GridView。

| 类型 |
| ------ |
| 字符串 |

---

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

参见 [无障碍指南](accessibility.md#accessibilitystate-ios-android) 获取更多信息。

| 类型 |
| ------------------------------------------------------------------------------------------------ |
| 对象：`{disabled: bool, selected: bool, checked: bool 或 'mixed', busy: bool, expanded: bool}` |

---

### `accessibilityValue`

代表组件的当前值。它可以是组件值的文本描述，或者对于基于范围的组件，如滑块和进度条，它包含范围信息（最小值、当前值和最大值）。

参见 [无障碍指南](accessibility.md#accessibilityvalue-ios-android) 获取更多信息。

| 类型 |
| --------------------------------------------------------------- |
| 对象：`{min: number, max: number, now: number, text: string}` |

---

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。默认为 `false`。

参见 [无障碍指南](accessibility.md#accessibilityviewismodal-ios) 获取更多信息。

| 类型 |
| ---- |
| 布尔值 |

---

### `accessible`

当为 `true` 时，指示视图是一个无障碍元素，并可被屏幕阅读器和硬件键盘等辅助技术发现。默认情况下，所有可触摸元素都是可访问的。

参见 [无障碍指南](accessibility.md#accessible) 获取更多信息。

---

### `aria-busy`

指示元素正在被修改，辅助技术可能希望在通知用户更新之前等待更改完成。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | false |

---

### `aria-checked`

指示可检查元素的状态。此字段可以采用布尔值或 "mixed" 字符串来表示混合复选框。

| 类型 | 默认值 |
| ---------------- | ------- |
| 布尔值，'mixed' | false |

---

### `aria-disabled`

指示元素是可感知的但已禁用，因此不可编辑或以其他方式操作。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | false |

---

### `aria-expanded`

指示可展开元素当前是展开还是折叠。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | false |

---

### `aria-hidden`

指示元素是否对辅助技术隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | false |

---

### `aria-label`

定义标记交互式元素的字符串值。

| 类型 |
| ------ |
| 字符串 |

---

### `aria-labelledby` <div className="label android">Android</div>

标识标记它所应用到的元素的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型 |
| ------ |
| 字符串 |

---

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以从 live region 期望的更新类型。

- **off** 无障碍服务不应宣布对此视图的更改。
- **polite** 无障碍服务应宣布对此视图的更改。
- **assertive** 无障碍服务应中断正在进行的语音以立即宣布对此视图的更改。

| 类型 | 默认值 |
| ---------------------------------------- | ------- |
| 枚举 (`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。优先于 [`accessibilityViewIsModal`](#accessibilityviewismodal-ios) 属性。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | false |

---

### `aria-selected`

指示可选择元素当前是否被选中。

| 类型 |
| ------- |
| 布尔值 |

### `aria-valuemax`

代表基于范围的组件（如滑块和进度条）的最大值。优先于 `accessibilityValue` 属性中的 `max` 值。

| 类型 |
| ------ |
| 数字 |

---

### `aria-valuemin`

代表基于范围的组件（如滑块和进度条）的最小值。优先于 `accessibilityValue` 属性中的 `min` 值。

| 类型 |
| ------ |
| 数字 |

---

### `aria-valuenow`

代表基于范围的组件（如滑块和进度条）的当前值。优先于 `accessibilityValue` 属性中的 `now` 值。

| 类型 |
| ------ |
| 数字 |

---

### `aria-valuetext`

代表组件的文本描述。优先于 `accessibilityValue` 属性中的 `text` 值。

| 类型 |
| ------ |
| 字符串 |

---

### `collapsable`

仅用于布局其子元素或不绘制任何内容的视图可能会自动从原生层次结构中移除作为优化。将此属性设置为 `false` 以禁用此优化并确保此 `View` 存在于原生视图层次结构中。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | true |

---

### `collapsableChildren`

设置为 false 可防止视图的直接子元素从原生视图层次结构中移除，类似于在每个子元素上设置 `collapsable={false}` 的效果。

| 类型 | 默认值 |
| ------- | ------- |
| 布尔值 | true |

---

### `focusable` <div className="label android">Android</div>

此 `View` 是否应可使用非触摸输入设备聚焦，例如，使用硬件键盘接收焦点。

| 类型 |
| ------- |
| 布尔值 |

---

### `hitSlop`

这定义了触摸事件可以开始于离视图多远的地方。典型的界面指南建议触摸目标至少为 30 - 40 点/密度独立像素。

例如，如果一个可触摸视图的高度为 20，触摸高度可以使用 `hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}` 扩展到 40。

> 触摸区域永远不会超出父视图边界，如果触摸命中两个重叠视图，兄弟视图的 Z-index 始终优先。

| 类型 |
| -------------------------------------------------------------------- |
| 对象：`{top: number, left: number, bottom: number, right: number}` |

---

### `id`

用于从原生类定位此视图。优先于 `nativeID` 属性。

> 这会禁用该视图的“仅布局视图移除”优化！

| 类型 |
| ------ |
| 字符串 |

---

### `importantForAccessibility` <div className="label android">Android</div>

控制视图对无障碍的重要性，即它是否触发无障碍事件以及是否报告给查询屏幕的无障碍服务。仅适用于 Android。

可能的值：

- `'auto'` - 系统确定视图是否对无障碍重要 - 默认（推荐）。
- `'yes'` - 视图对无障碍重要。
- `'no'` - 视图对无障碍不重要。
- `'no-hide-descendants'` - 视图对无障碍不重要，其任何后代视图也不重要。

参见 [Android `importantForAccessibility` 文档](https://developer.android.com/reference/android/R.attr.html#importantForAccessibility) 参考。

| 类型 |
| ------------------------------------------------ |
| 枚举 ('auto', 'yes', 'no', 'no-hide-descendants') |

---

### `nativeID`

用于从原生类定位此视图。

> 这会禁用该视图的“仅布局视图移除”优化！

| 类型 |
| ------ |
| 字符串 |

---

### `needsOffscreenAlphaCompositing`

此 `View` 是否需要离屏渲染并使用 alpha 合成，以保留 100% 正确的颜色和混合行为。默认值 (`false`) 回退到将组件及其子元素与应用于绘制每个元素的绘制的 alpha 一起绘制，而不是将整个组件离屏渲染并使用 alpha 值将其合成回来。在您在其上设置不透明度的 `View` 具有多个重叠元素（例如，多个重叠的 `View`，或文本和背景）的情况下，此默认值可能很明显且不理想。

离屏渲染以保留正确的 alpha 行为非常昂贵，且对于非原生开发者来说很难调试，这就是为什么它默认不开启。如果您确实需要为动画启用此属性，请考虑将其与 renderToHardwareTextureAndroid 结合使用，如果视图**内容**是静态的（即，不需要每帧重绘）。如果启用了该属性，此视图将离屏渲染一次，保存在硬件纹理中，然后每帧与 alpha 一起合成到屏幕上，而无需在 GPU 上切换渲染目标。

| 类型 |
| ---- |
| 布尔值 |

---

### `nextFocusDown` <div className="label android">Android</div>

指定当用户向下导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusDown)。

| 类型 |
| ------ |
| 数字 |

---

### `nextFocusForward` <div className="label android">Android</div>

指定当用户向前导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusForward)。

| 类型 |
| ------ |
| 数字 |

---

### `nextFocusLeft` <div className="label android">Android</div>

指定当用户向左导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusLeft)。

| 类型 |
| ------ |
| 数字 |

---

### `nextFocusRight` <div className="label android">Android</div>

指定当用户向右导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusRight)。

| 类型 |
| ------ |
| 数字 |

---

### `nextFocusUp` <div className="label android">Android</div>

指定当用户向上导航时接收焦点的下一个视图。参见 [Android 文档](https://developer.android.com/reference/android/view/View.html#attr_android:nextFocusUp)。

| 类型 |
| ------ |
| 数字 |

---

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数的唯一参数是包含要执行的操作名称的事件。

参见 [无障碍指南](accessibility.md#accessibility-actions) 获取更多信息。

| 类型 |
| -------- |
| 函数 |

---

### `onAccessibilityEscape` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，当用户执行退出手势时，系统将调用此函数。

| 类型 |
| -------- |
| 函数 |

---

### `onAccessibilityTap` <div className="label ios">iOS</div>

当 `accessible` 为 true 时，当用户执行无障碍点击手势时，系统将尝试调用此函数。

| 类型 |
| -------- |
| 函数 |

---

### `onLayout`

在挂载和布局更改时调用。

此事件一旦计算出布局就会立即触发，但在收到事件时，新布局可能尚未反映在屏幕上，特别是如果布局动画正在进行中。

| 类型 |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onMagicTap` <div className="label ios">iOS</div>

当 `accessible` 为 `true` 时，当用户执行魔术点击手势时，系统将调用此函数。

| 类型 |
| -------- |
| 函数 |

---

### `onMoveShouldSetResponder`

此视图想要“声明”触摸响应吗？当它不是响应器时，`View` 上的每次触摸移动都会调用此函数。

| 类型 |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onMoveShouldSetResponderCapture`

如果父 `View` 想要防止子 `View` 在移动时成为响应器，它应该具有此处理程序并返回 `true`。

| 类型 |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onResponderGrant`

View 现在正在响应触摸事件。这是高亮显示并向用户展示正在发生什么的时候。

在 Android 上，从此回调返回 true 以防止任何其他原生组件在此响应器终止之前成为响应器。

| 类型 |
| ----------------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void ｜ boolean` |

---

### `onResponderMove`

用户正在移动他们的手指。

| 类型 |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderReject`

另一个响应器已经激活，并且不会将其释放给请求成为响应器的该 `View`。

| 类型 |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderRelease`

在触摸结束时触发。

| 类型 |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminate`

响应器已从 `View` 中获取。可能在调用 `onResponderTerminationRequest` 后被其他视图获取，或者可能被操作系统无需询问而获取（例如，在 iOS 上与控制中心/通知中心一起发生）

| 类型 |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他一些 `View` 想要成为响应器，并要求此 `View` 释放其响应器。返回 `true` 允许其释放。

| 类型 |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onStartShouldSetResponder`

此视图想要在触摸开始时成为响应器吗？

| 类型 |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父 `View` 想要防止子 `View` 在触摸开始时成为响应器，它应该具有此处理程序并返回 `true`。

| 类型 |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `pointerEvents`

控制 `View` 是否可以成为触摸事件的目标。

- `'auto'`: View 可以成为触摸事件的目标。
- `'none'`: View 永远不会是触摸事件的目标。
- `'box-none'`: View 永远不会是触摸事件的目标，但其子视图可以。它的行为就像视图在 CSS 中具有以下类一样：

```css
.box-none {
  pointer-events: none;
}
.box-none * {
  pointer-events: auto;
}
```

- `'box-only'`: 视图可以成为触摸事件的目标，但其子视图不能。它的行为就像视图在 CSS 中具有以下类一样：

```css
.box-only {
  pointer-events: auto;
}
.box-only * {
  pointer-events: none;
}
```

| 类型 |
| -------------------------------------------- |
| 枚举 ('box-none', 'none', 'box-only', 'auto') |

---

### `removeClippedSubviews`

这是 `RCTView` 暴露的保留性能属性，当有许多子视图（其中大多数在屏幕外）时对于滚动内容很有用。为了使此属性有效，它必须应用于包含许多超出其边界的子视图的视图。子视图还必须具有 `overflow: hidden`，包含视图（或其父视图之一）也应如此。

| 类型 |
| ---- |
| 布尔值 |

---

### `renderToHardwareTextureAndroid` <div className="label android">Android</div>

此 `View` 是否应将其自身（及其所有子元素）渲染到 GPU 上的单个硬件纹理中。

在 Android 上，这对于仅修改不透明度、旋转、平移和/或缩放的动画和交互很有用：在这些情况下，视图不必重绘，显示列表也不必重新执行。纹理可以重用并使用不同的参数重新合成。缺点是这可能会占用有限的视频内存，因此此属性应在交互/动画结束时设置回 false。

| 类型 |
| ---- |
| 布尔值 |

---

### `role`

`role` 向辅助技术用户传达组件的目的。优先于 [`accessibilityRole`](view#accessibilityrole) 属性。

| 类型 |
| -------------------------- |
| [Role](accessibility#role) |

---

### `shouldRasterizeIOS` <div className="label ios">iOS</div>

此 `View` 是否应在合成前渲染为位图。

在 iOS 上，这对于不修改此组件尺寸及其子元素的动画和交互很有用；例如，当翻译静态视图的位置时，光栅化允许渲染器重用静态视图的缓存位图，并在每帧期间快速合成它。

光栅化会产生离屏绘制通道，并且位图会消耗内存。使用此属性时请测试和测量。

| 类型 |
| ---- |
| 布尔值 |

---

### `style`

| 类型 |
| ------------------------------ |
| [View 样式](view-style-props) |

---

### `tabIndex` <div className="label android">Android</div>

此 `View` 是否应可使用非触摸输入设备聚焦，例如，使用硬件键盘接收焦点。
支持以下值：

- `0` - 视图可聚焦
- `-1` - 视图不可聚焦

| 类型 |
| ----------- |
| 枚举 (0, -1) |

---

### `testID`

用于在端到端测试中定位此视图。

> 这会禁用该视图的“仅布局视图移除”优化！

| 类型 |
| ------ |
| 字符串 |
