---
id: accessibility
title: 无障碍
description: 使用 React Native 专为与 Android 和 iOS 配合使用而设计的一套 API，创建可被辅助技术访问的移动应用。
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

Android 和 iOS 都提供了将应用与辅助技术（如内置的屏幕阅读器 VoiceOver (iOS) 和 TalkBack (Android)）集成的 API。React Native 拥有互补的 API，让你的应用能够容纳所有用户。

:::info
Android 和 iOS 的方法略有不同，因此 React Native 的实现可能因平台而异。
:::

## 无障碍属性

### `accessible`

当为 `true` 时，表示该视图可被屏幕阅读器和硬件键盘等辅助技术发现。请注意，这并不一定意味着该视图会被 VoiceOver 或 TalkBack 聚焦。有很多原因会导致这种情况，例如 VoiceOver 不允许嵌套的无障碍元素，或者 TalkBack 选择聚焦某些父元素 instead。

默认情况下，所有可触摸元素都是可访问的。

在 Android 上，`accessible` 将被转换为原生的 [`focusable`](<https://developer.android.com/reference/android/view/View#setFocusable(boolean)>)。在 iOS 上，它转换为原生的 [`isAccessibilityElement`](https://developer.apple.com/documentation/uikit/uiaccessibilityelement/isaccessibilityelement?language=objc)。

```tsx
<View>
  <View accessible={true} />
  <View />
</View>
```

在上面的示例中，无障碍焦点仅适用于具有 `accessible` 属性的第一个子视图，而不适用于没有 `accessible` 的父视图或兄弟视图。

### `accessibilityLabel`

当视图被标记为可访问时，最好在视图上设置 `accessibilityLabel`，以便使用 VoiceOver 或 TalkBack 的用户知道他们选择了什么元素。当选择关联元素时，屏幕阅读器将口头表达此字符串。

要使用，请在你的 View、Text 或 Touchable 上将 `accessibilityLabel` 属性设置为自定义字符串：

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Tap me!"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Press me!</Text>
  </View>
</TouchableOpacity>
```

在上面的示例中，TouchableOpacity 元素上的 `accessibilityLabel` 默认为 "Press me!"。该标签是通过连接所有由空格分隔的 Text 节点子项构成的。

### `accessibilityLabelledBy` <div className="label android">Android</div>

引用另一个元素 [nativeID](view.md#nativeid) 用于构建复杂的表单。
`accessibilityLabelledBy` 的值应与相关元素的 `nativeID` 匹配：

```tsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput
    accessibilityLabel="input"
    accessibilityLabelledBy="formLabel"
  />
</View>
```

在上面的示例中，当聚焦于 TextInput 时，屏幕阅读器会宣布 `Input, Edit Box for Label for Input Field`。

### `accessibilityHint`

无障碍提示可用于在仅凭无障碍标签不清楚时，为用户提供关于操作结果的额外上下文。

在你的 View、Text 或 Touchable 上为 `accessibilityHint` 属性提供自定义字符串：

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Go back"
  accessibilityHint="Navigates to the previous screen"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Back</Text>
  </View>
</TouchableOpacity>
```

<div className="label ios basic">iOS</div>

在上面的示例中，如果用户在设备的 VoiceOver 设置中启用了提示，VoiceOver 将在标签之后读取提示。有关 `accessibilityHint` 的指南，请阅读 [iOS 开发者文档](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint)

<div className="label android basic">Android</div>

在上面的示例中，TalkBack 将在标签之后读取提示。目前，无法在 Android 上关闭提示。

### `accessibilityLanguage` <div className="label ios">iOS</div>

通过使用 `accessibilityLanguage` 属性，屏幕阅读器将理解在读取元素的 **标签**、**值** 和 **提示** 时使用哪种语言。提供的字符串值必须遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

```tsx
<View
  accessible={true}
  accessibilityLabel="Pizza"
  accessibilityLanguage="it-IT">
  <Text>🍕</Text>
</View>
```

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

反转屏幕颜色是 iOS 和 iPadOS 中为色盲、低视力或视力障碍人士提供的无障碍功能。如果在此设置开启时你不想反转某个视图（可能是照片），请将此属性设置为 `true`。

### `accessibilityLiveRegion` <div className="label android">Android</div>

当组件动态变化时，我们希望 TalkBack 通知最终用户。这是通过 `accessibilityLiveRegion` 属性实现的。它可以设置为 `none`、`polite` 和 `assertive`：

- **none** 无障碍服务不应宣布对此视图的更改。
- **polite** 无障碍服务应宣布对此视图的更改。
- **assertive** 无障碍服务应中断正在进行的语音，立即宣布对此视图的更改。

```tsx
<TouchableWithoutFeedback onPress={addOne}>
  <View style={styles.embedded}>
    <Text>Click me</Text>
  </View>
</TouchableWithoutFeedback>
<Text accessibilityLiveRegion="polite">
  Clicked {count} times
</Text>
```

在上面的示例中，方法 `addOne` 更改了状态变量 `count`。当触发 TouchableWithoutFeedback 时，由于其 `accessibilityLiveRegion="polite"` 属性，TalkBack 会读取 Text 视图中的文本。

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的目的。

`accessibilityRole` 可以是以下之一：

- **adjustable** 当元素可以“调整”时使用（例如滑块）。
- **alert** 当元素包含要呈现给用户的重要文本时使用。
- **button** 当元素应被视为按钮时使用。
- **checkbox** 当元素代表可以选中、取消选中或具有混合选中状态的复选框时使用。
- **combobox** 当元素代表组合框时使用，允许用户在几个选项中进行选择。
- **header** 当元素充当内容部分的标题时使用（例如导航栏的标题）。
- **image** 当元素应被视为图像时使用。可以与按钮或链接组合。
- **imagebutton** 当元素应被视为按钮且也是图像时使用。
- **keyboardkey** 当元素充当键盘键时使用。
- **link** 当元素应被视为链接时使用。
- **menu** 当组件是选项菜单时使用。
- **menubar** 当组件是多个菜单的容器时使用。
- **menuitem** 用于代表菜单中的项目。
- **none** 当元素没有角色时使用。
- **progressbar** 用于代表指示任务进度的组件。
- **radio** 用于代表单选按钮。
- **radiogroup** 用于代表一组单选按钮。
- **scrollbar** 用于代表滚动条。
- **search** 当文本字段元素也应被视为搜索字段时使用。
- **spinbutton** 用于代表打开选项列表的按钮。
- **summary** 当元素可用于在应用首次启动时提供应用中当前条件的快速摘要时使用。
- **switch** 用于代表可以打开和关闭的开关。
- **tab** 用于代表标签页。
- **tablist** 用于代表标签页列表。
- **text** 当元素应被视为无法更改的静态文本时使用。
- **timer** 用于代表计时器。
- **togglebutton** 用于代表切换按钮。应与 accessibilityState checked 一起使用，以指示按钮是切换打开还是关闭。
- **toolbar** 用于代表工具栏（操作按钮或组件的容器）。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用以代表网格。将进出网格公告添加到 Android 的 GridView。

### `accessibilityShowsLargeContentViewer` <div className="label ios">iOS</div>

一个布尔值，确定当用户在该元素上执行长按时是否显示大内容查看器。

适用于 iOS 13.0 及更高版本。

### `accessibilityLargeContentTitle` <div className="label ios">iOS</div>

当显示大内容查看器时，将用作其标题的字符串。

需要将 `accessibilityShowsLargeContentViewer` 设置为 `true`。

```tsx
<View
  accessibilityShowsLargeContentViewer={true}
  accessibilityLargeContentTitle="Home Tab">
  <Text>Home</Text>
</View>
```

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

`accessibilityState` 是一个对象。它包含以下字段：

| 名称     | 描述                                                                                                                           | 类型               | 是否必需 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- |
| disabled | 指示元素是否被禁用。                                                                                     | 布尔值            | 否       |
| selected | 指示可选择元素当前是否被选中。                                                                  | 布尔值            | 否       |
| checked  | 指示可检查元素的状态。此字段可以是布尔值或 "mixed" 字符串以代表混合复选框。 | 布尔值或 'mixed' | 否       |
| busy     | 指示元素当前是否忙碌。                                                                                | 布尔值            | 否       |
| expanded | 指示可展开元素当前是展开还是折叠。                                                           | 布尔值            | 否       |

要使用，请将 `accessibilityState` 设置为具有特定定义的对象。

### `accessibilityValue`

代表组件的当前值。它可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），它包含范围信息（最小值、当前值和最大值）。

`accessibilityValue` 是一个对象。它包含以下字段：

| 名称 | 描述                                                                                    | 类型    | 是否必需                  |
| ---- | ---------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| min  | 此组件范围的最小值。                                                   | 整数 | 如果设置了 `now` 则为必需。 |
| max  | 此组件范围的最大值。                                                   | 整数 | 如果设置了 `now` 则为必需。 |
| now  | 此组件范围的当前值。                                                   | 整数 | 否                        |
| text | 此组件值的文本描述。如果设置，将覆盖 `min`、`now` 和 `max`。 | 字符串  | 否                        |

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `accessibilityViewIsModal` 设置为 `true` 会导致 VoiceOver 忽略视图 `A` 中的元素。另一方面，如果视图 `B` 包含子视图 `C` 并且你在视图 `C` 上将 `accessibilityViewIsModal` 设置为 `true`，VoiceOver 不会忽略视图 `A` 中的元素。

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，指示给定的无障碍元素及其包含的任何无障碍元素是否被隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `accessibilityElementsHidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 视图及其包含的任何元素。这类似于 Android 属性 `importantForAccessibility="no-hide-descendants"`。

### `aria-valuemax`

代表基于范围的组件（如滑块和进度条）的最大值。

### `aria-valuemin`

代表基于范围的组件（如滑块和进度条）的最小值。

### `aria-valuenow`

代表基于范围的组件（如滑块和进度条）的当前值。

### `aria-valuetext`

代表组件的文本描述。

### `aria-busy`

指示元素正在被修改，辅助技术可能希望等到更改完成后再通知用户更新。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | false   |

### `aria-checked`

指示可检查元素的状态。此字段可以是布尔值或 "mixed" 字符串以代表混合复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| 布尔值，'mixed' | false   |

### `aria-disabled`

指示元素是可感知但被禁用的，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | false   |

### `aria-expanded`

指示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | false   |

### `aria-hidden`

指示元素是否对辅助技术隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | false   |

### `aria-label`

定义一个可用于命名元素的字符串值。

| 类型   |
| ------ |
| 字符串 |

### `aria-labelledby` <div className="label android">Android</div>

标识标记它所应用元素的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| 字符串 |

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以从实时区域预期的更新类型。

- **off** 无障碍服务不应宣布对此视图的更改。
- **polite** 无障碍服务应宣布对此视图的更改。
- **assertive** 无障碍服务应中断正在进行的语音，立即宣布对此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| 枚举 (`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。

| 类型    | 默认值 |
| ------- | ------- |
| 布尔值 | false   |

### `aria-selected`

指示可选择元素当前是否被选中。

| 类型    |
| ------- |
| 布尔值 |

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

:::note
为了简洁起见，以下示例中省略了布局，尽管它决定了默认的焦点顺序。假设文档顺序与布局顺序匹配。
:::

`experimental_accessibilityOrder` 允许你定义辅助技术聚焦后代组件的顺序。它是一个 [`nativeIDs`](view.md#nativeid) 数组，这些 ID 设置在你控制其顺序的组件上。例如：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
</View>
```

辅助技术将聚焦 `nativeID` 为 `B` 的 `View`，然后是 `C`，然后是 `A`。

`experimental_accessibilityOrder` 不会为其引用的组件“开启”无障碍功能，这仍然需要单独完成。所以如果我们在上面移除 `C` 的 `accessible={true}`，如下所示

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C"/>
</View>
```

那么新顺序将是 `B` 然后是 `A`，即使 `C` 仍在 `experimental_accessibilityOrder` 中。

但是，`experimental_accessibilityOrder` 会“关闭”它未引用的组件的无障碍功能。

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
  <View accessible={true} nativeID="D"/>
</View>
```

上面示例的顺序将是 `B`、`C`、`A`。`D` 将永远不会被聚焦。在这个意义上，`experimental_accessibilityOrder` 是 _穷尽的_。

仍然有有效的理由将非无障碍组件包含在 `experimental_accessibilityOrder` 中。考虑

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C">
    <View accessible={true} nativeID="D"/>
    <View accessible={true} nativeID="E"/>
    <View accessible={true} nativeID="F"/>
  </View>
</View>
```

焦点顺序将是 `B`、`D`、`E`、`F`、`A`。即使 `D`、`E` 和 `F` 未在 `experimental_accessibilityOrder` 中直接引用，`C` 也被直接引用了。在这种情况下，`C` 是一个 _无障碍容器_ - 它包含无障碍元素，但本身不可无障碍。如果无障碍容器在 `experimental_accessibilityOrder` 中被引用，则应用其包含元素的默认顺序。在这个意义上，`experimental_accessibilityOrder` 是 _可嵌套的_。

`experimental_accessibilityOrder` 也可以引用另一个具有 `experimental_accessibilityOrder` 的组件

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C" experimental_accessibilityOrder={['F', 'E', 'D']}>
    <View accessible={true} nativeID="D"/>
    <View accessible={true} nativeID="E"/>
    <View accessible={true} nativeID="F"/>
  </View>
</View>
```

焦点顺序将是 `B`、`F`、`E`、`D`、`A`。

组件不能同时是无障碍容器和无障碍元素 (`accessible={true}`)。所以如果我们有

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C" experimental_accessibilityOrder={['F', 'E', 'D']}>
    <View accessible={true} nativeID="D"/>
    <View accessible={true} nativeID="E"/>
    <View accessible={true} nativeID="F"/>
  </View>
</View>
```

焦点顺序将是 `B`、`C`、`A`。`D`、`E` 和 `F` 不再位于容器中，因此 `experimental_accessibilityOrder` 的穷尽性质意味着它们将被排除。

### `importantForAccessibility` <div className="label android">Android</div>

在两个具有相同父组件的重叠 UI 组件的情况下，默认的无障碍焦点可能会有不可预测的行为。`importantForAccessibility` 属性将通过控制视图是否触发无障碍事件以及是否向无障碍服务报告来解决此问题。它可以设置为 `auto`、`yes`、`no` 和 `no-hide-descendants`（最后一个值将强制无障碍服务忽略该组件及其所有子组件）。

```tsx
<View style={styles.container}>
  <View
    style={[styles.layout, {backgroundColor: 'green'}]}
    importantForAccessibility="yes">
    <Text>First layout</Text>
  </View>
  <View
    style={[styles.layout, {backgroundColor: 'yellow'}]}
    importantForAccessibility="no-hide-descendants">
    <Text>Second layout</Text>
  </View>
</View>
```

在上面的示例中，`yellow` 布局及其后代对 TalkBack 和所有其他无障碍服务完全不可见。因此，我们可以使用具有相同父组件的重叠视图而不会混淆 TalkBack。

### `onAccessibilityEscape` <div className="label ios">iOS</div>

将此属性分配给一个自定义函数，当有人执行“退出”手势（即双指 Z 形手势）时将调用该函数。退出函数应在用户界面中分层向后移动。这可能意味着在导航层次结构中向上或向后移动，或关闭模态用户界面。如果所选元素没有 `onAccessibilityEscape` 函数，系统将尝试向上遍历视图层次结构，直到找到具有该函数的视图，或者发出提示表示无法找到。

### `onAccessibilityTap` <div className="label ios">iOS</div>

使用此属性分配一个自定义函数，当有人双击选中的可访问元素激活它时将调用该函数。

### `onMagicTap` <div className="label ios">iOS</div>

将此属性分配给一个自定义函数，当有人执行“魔术点击”手势（即双指双击）时将调用该函数。魔术点击函数应执行用户可以在组件上采取的最相关操作。在 iPhone 的电话应用中，魔术点击会接听电话或结束当前通话。如果所选元素没有 `onMagicTap` 函数，系统将向上遍历视图层次结构，直到找到具有该函数的视图。

### `role`

`role` 传达组件的目的，并且优先于 [`accessibilityRole`](accessibility#accessibilityrole) 属性。

`role` 可以是以下之一：

- **alert** 当元素包含要呈现给用户的重要文本时使用。
- **button** 当元素应被视为按钮时使用。
- **checkbox** 当元素代表可以选中、取消选中或具有混合选中状态的复选框时使用。
- **combobox** 当元素代表组合框时使用，允许用户在几个选项中进行选择。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用以代表网格。将进出网格公告添加到 Android 的 GridView。
- **heading** 当元素充当内容部分的标题时使用（例如导航栏的标题）。
- **img** 当元素应被视为图像时使用。例如，可以与按钮或链接组合。
- **link** 当元素应被视为链接时使用。
- **list** 用于标识项目列表。
- **listitem** 用于标识列表中的项目。
- **menu** 当组件是选项菜单时使用。
- **menubar** 当组件是多个菜单的容器时使用。
- **menuitem** 用于代表菜单中的项目。
- **none** 当元素没有角色时使用。
- **presentation** 当元素没有角色时使用。
- **progressbar** 用于代表指示任务进度的组件。
- **radio** 用于代表单选按钮。
- **radiogroup** 用于代表一组单选按钮。
- **scrollbar** 用于代表滚动条。
- **searchbox** 当文本字段元素也应被视为搜索字段时使用。
- **slider** 当元素可以“调整”时使用（例如滑块）。
- **spinbutton** 用于代表打开选项列表的按钮。
- **summary** 当元素可用于在应用首次启动时提供应用中当前条件的快速摘要时使用。
- **switch** 用于代表可以打开和关闭的开关。
- **tab** 用于代表标签页。
- **tablist** 用于代表标签页列表。
- **timer** 用于代表计时器。
- **toolbar** 用于代表工具栏（操作按钮或组件的容器）。

## 无障碍操作

无障碍操作允许辅助技术以编程方式调用组件的操作。为了支持无障碍操作，组件必须完成两件事：

- 通过 `accessibilityActions` 属性定义它支持的操作列表。
- 实现一个 `onAccessibilityAction` 函数来处理操作请求。

`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含以下字段：

| 名称 | 类型 | 必填 |
| ----- | ------ | -------- |
| name | string | 是 |
| label | string | 否 |

操作要么代表标准操作，例如点击按钮或调整滑块，要么代表特定于给定组件的自定义操作，例如删除电子邮件消息。`name` 字段对于标准操作和自定义操作都是必填的，但 `label` 对于标准操作是可选的。

添加对标准操作的支持时，`name` 必须是以下之一：

- `'magicTap'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内时，用户用两根手指双击。
- `'escape'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内时，用户执行了两指擦除手势（左、右、左）。
- `'activate'` - 激活组件。无论是否使用辅助技术，这都应执行相同的操作。当屏幕阅读器用户双击组件时触发。
- `'increment'` - 增加可调整组件的值。在 iOS 上，当组件具有 `'adjustable'` 角色且用户将焦点放在其上并向上滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将无障碍焦点放在组件上并按下音量增加按钮时，TalkBack 会生成此操作。
- `'decrement'` - 减少可调整组件的值。在 iOS 上，当组件具有 `'adjustable'` 角色且用户将焦点放在其上并向下滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将无障碍焦点放在组件上并按下音量减少按钮时，TalkBack 会生成此操作。
- `'longpress'` - 仅限 Android - 当用户将无障碍焦点放在组件上，然后双击并按住一根手指在屏幕上时，会生成此操作。无论是否使用辅助技术，这都应执行相同的操作。
- `'expand'` - 仅限 Android - 此操作“展开”组件，以便 TalkBack 宣布“已展开”提示。
- `'collapse'` - 仅限 Android - 此操作“折叠”组件，以便 TalkBack 宣布“已折叠”提示。

`label` 字段对于标准操作是可选的，辅助技术通常不使用它。对于自定义操作，它是一个本地化字符串，包含要向用户展示的操作描述。

为了处理操作请求，组件必须实现一个 `onAccessibilityAction` 函数。此函数的唯一参数是一个事件，包含要执行的操作名称。下面来自 RNTester 的示例展示了如何创建定义和处理几个自定义操作的组件。

```tsx
<View
  accessible={true}
  accessibilityActions={[
    {name: 'cut', label: 'cut'},
    {name: 'copy', label: 'copy'},
    {name: 'paste', label: 'paste'},
  ]}
  onAccessibilityAction={event => {
    switch (event.nativeEvent.actionName) {
      case 'cut':
        Alert.alert('Alert', 'cut action success');
        break;
      case 'copy':
        Alert.alert('Alert', 'copy action success');
        break;
      case 'paste':
        Alert.alert('Alert', 'paste action success');
        break;
    }
  }}
/>
```

## 检查是否启用了屏幕阅读器

`AccessibilityInfo` API 允许你确定屏幕阅读器当前是否处于活动状态。有关详细信息，请参阅 [AccessibilityInfo 文档](accessibilityinfo)。

## 发送无障碍事件 <div className="label android">Android</div>

有时触发 UI 组件上的无障碍事件很有用（即当自定义视图出现在屏幕上或将无障碍焦点设置到视图时）。原生 UIManager 模块为此公开了一个方法 'sendAccessibilityEvent'。它需要两个参数：一个视图标签和一个事件类型。支持的事件类型是 `typeWindowStateChanged`、`typeViewFocused` 和 `typeViewClicked`。

```tsx
import {Platform, UIManager, findNodeHandle} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.sendAccessibilityEvent(
    findNodeHandle(this),
    UIManager.AccessibilityEventTypes.typeViewFocused,
  );
}
```

## 测试 TalkBack 支持 <div className="label android">Android</div>

要启用 TalkBack，请转到 Android 设备或模拟器上的“设置”应用。点击“无障碍”，然后点击"TalkBack"。切换“使用服务”开关以启用或禁用它。

Android 模拟器默认未安装 TalkBack。你可以通过 Google Play 商店在模拟器上安装 TalkBack。确保选择一个安装了 Google Play 商店的模拟器。这些可在 Android Studio 中找到。

你可以使用音量键快捷方式来切换 TalkBack。要开启音量键快捷方式，请转到“设置”应用，然后进入“无障碍”。在顶部，开启音量键快捷方式。

要使用音量键快捷方式，同时按下两个音量键 3 秒钟以启动无障碍工具。

此外，如果你愿意，可以通过命令行使用以下命令切换 TalkBack：

```shell
# 禁用
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# 启用
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

## 测试 VoiceOver 支持 <div className="label ios">iOS</div>

要在 iOS 或 iPadOS 设备上启用 VoiceOver，请转到“设置”应用，点击“通用”，然后点击“无障碍”。在那里你会发现许多可供人们使用的工具，以使他们的设备更易用，包括 VoiceOver。要启用 VoiceOver，请点击“视觉”下的"VoiceOver"，然后切换顶部出现的开关。

在“无障碍”设置的最底部，有一个“无障碍快捷方式”。你可以使用它通过连按三次主屏幕按钮来切换 VoiceOver。

模拟器上不提供 VoiceOver，但你可以使用 Xcode 中的 Accessibility Inspector 通过应用程序使用 macOS VoiceOver。请注意，最好始终使用设备进行测试，因为 macOS 的 VoiceOver 可能会导致体验差异。

## 其他资源

- [打造无障碍的 React Native 应用](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
