---
id: accessibility
title: 无障碍
description: 使用 React Native 提供的一组专为与 Android 和 iOS 协同工作的 API，创建对辅助技术友好的移动应用。
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

Android 和 iOS 都提供了用于将应用与辅助技术集成的 API，例如内置的屏幕阅读器 VoiceOver（iOS）和 TalkBack（Android）。React Native 还提供了互补的 API，使你的应用能够适配所有用户。

:::info
Android 和 iOS 的实现方式略有不同，因此 React Native 的实现可能会因平台而异。
:::

## 无障碍属性

### `accessible`

当为 `true` 时，表示该视图可被辅助技术发现，例如屏幕阅读器和硬件键盘。注意，这并不一定意味着 VoiceOver 或 TalkBack 会将焦点放到该视图上。原因有很多，例如 VoiceOver 不允许嵌套的无障碍元素，或者 TalkBack 选择聚焦某个父元素。

默认情况下，所有可触摸元素都是可访问的。

在 Android 上，`accessible` 会被转换为原生 [`focusable`](<https://developer.android.com/reference/android/view/View#setFocusable(boolean)>)。在 iOS 上，它会被转换为原生 [`isAccessibilityElement`](https://developer.apple.com/documentation/uikit/uiaccessibilityelement/isaccessibilityelement?language=objc)。

```tsx
<View>
  <View accessible={true} />
  <View />
</View>
```

在上面的示例中，无障碍焦点只会出现在第一个带有 `accessible` 属性的子视图上，而不会出现在父视图或没有 `accessible` 的兄弟视图上。

### `accessibilityLabel`

当一个视图被标记为可访问时，最好为该视图设置一个 `accessibilityLabel`，这样使用 VoiceOver 或 TalkBack 的用户就知道他们选中了哪个元素。屏幕阅读器会在选中关联元素时读出这个字符串。

使用时，请在你的 View、Text 或 Touchable 上将 `accessibilityLabel` 属性设置为自定义字符串：

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

在上面的示例中，TouchableOpacity 元素上的 `accessibilityLabel` 默认会是 "Press me!"。该标签会通过将所有 Text 节点子元素用空格连接起来构造。

### `accessibilityLabelledBy` <div className="label android">Android</div>

对另一个元素 [nativeID](view.md#nativeid) 的引用，用于构建复杂表单。
`accessibilityLabelledBy` 的值应与相关元素的 `nativeID` 匹配：

```tsx
<View>
  <Text nativeID="formLabel">输入字段标签</Text>
  <TextInput
    accessibilityLabel="input"
    accessibilityLabelledBy="formLabel"
  />
</View>
```

在上面的示例中，屏幕阅读器在聚焦 TextInput 时会播报 `Input, Label for Input Field 的编辑框`。

### `accessibilityHint`

当仅凭无障碍标签无法清楚表达操作结果时，无障碍提示可用于向用户提供额外上下文。

请在你的 View、Text 或 Touchable 上将 `accessibilityHint` 属性设置为自定义字符串：

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="返回"
  accessibilityHint="导航到上一屏幕"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Back</Text>
  </View>
</TouchableOpacity>
```

<div className="label ios basic">iOS</div>

在上面的示例中，如果用户在设备的 VoiceOver 设置中启用了提示，VoiceOver 会在标签之后读出该提示。关于 `accessibilityHint` 的指南，请阅读 [iOS Developer Docs](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint)

<div className="label android basic">Android</div>

在上面的示例中，TalkBack 会在标签之后读出该提示。目前在 Android 上无法关闭提示。

### `accessibilityLanguage` <div className="label ios">iOS</div>

通过使用 `accessibilityLanguage` 属性，屏幕阅读器将能够理解在朗读元素的**标签**、**值**和**提示**时应使用哪种语言。所提供的字符串值必须符合 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

```tsx
<View
  accessible={true}
  accessibilityLabel="Pizza"
  accessibilityLanguage="it-IT">
  <Text>🍕</Text>
</View>
```

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

反转屏幕颜色是 iOS 和 iPadOS 中一项可用于色盲、低视力或视力障碍人士的无障碍功能。如果某个视图在此设置开启时不希望被反转，例如照片，请将此属性设置为 `true`。

### `accessibilityLiveRegion` <div className="label android">Android</div>

当组件动态变化时，我们希望 TalkBack 提醒最终用户。这可通过 `accessibilityLiveRegion` 属性实现。它可以设置为 `none`、`polite` 和 `assertive`：

- **none** 无障碍服务不应播报此视图的变化。
- **polite** 无障碍服务应播报此视图的变化。
- **assertive** 无障碍服务应打断当前语音，立即播报此视图的变化。

```tsx
<TouchableWithoutFeedback onPress={addOne}>
  <View style={styles.embedded}>
    <Text>点击我</Text>
  </View>
</TouchableWithoutFeedback>
<Text accessibilityLiveRegion="polite">
  已点击 {count} 次
</Text>
```

在上面的示例方法 `addOne` 中，会改变状态变量 `count`。当触发 TouchableWithoutFeedback 时，由于其 `accessibilityLiveRegion="polite"` 属性，TalkBack 会读取 Text 视图中的文本。

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下之一：

- **adjustable** 用于元素可以被“调节”的场景（例如滑块）。
- **alert** 用于元素包含需要向用户呈现的重要文本的场景。
- **button** 用于元素应被视为按钮的场景。
- **checkbox** 用于元素表示可勾选、取消勾选或混合勾选状态的复选框的场景。
- **combobox** 用于元素表示组合框的场景，允许用户在多个选项中选择。
- **header** 用于元素充当内容区块标题的场景（例如导航栏标题）。
- **image** 用于元素应被视为图像的场景。可与按钮或链接组合使用。
- **imagebutton** 用于元素应被视为按钮且同时也是图像的场景。
- **keyboardkey** 用于元素充当键盘按键的场景。
- **link** 用于元素应被视为链接的场景。
- **menu** 用于组件是一个选项菜单的场景。
- **menubar** 用于组件是多个菜单容器的场景。
- **menuitem** 用于表示菜单中的项目。
- **none** 用于元素没有角色的场景。
- **progressbar** 用于表示指示任务进度的组件。
- **radio** 用于表示单选按钮。
- **radiogroup** 用于表示一组单选按钮。
- **scrollbar** 用于表示滚动条。
- **search** 用于文本字段元素也应被视为搜索字段的场景。
- **spinbutton** 用于表示打开选项列表的按钮。
- **summary** 用于应用首次启动时，元素可用于提供当前状态的快速摘要。
- **switch** 用于表示可开启和关闭的开关。
- **tab** 用于表示标签页。
- **tablist** 用于表示标签页列表。
- **text** 用于元素应被视为不可更改的静态文本的场景。
- **timer** 用于表示计时器。
- **togglebutton** 用于表示切换按钮。应与 accessibilityState 的 checked 一起使用，以指示按钮是否处于开启或关闭状态。
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用，用于表示网格。会向 Android 的 GridView 添加进出网格的播报。

### `accessibilityShowsLargeContentViewer` <div className="label ios">iOS</div>

一个布尔值，用于确定用户长按元素时是否显示大内容查看器。

适用于 iOS 13.0 及更高版本。

### `accessibilityLargeContentTitle` <div className="label ios">iOS</div>

当显示大内容查看器时，用作其标题的字符串。

需要将 `accessibilityShowsLargeContentViewer` 设置为 `true`。

```tsx
<View
  accessibilityShowsLargeContentViewer={true}
  accessibilityLargeContentTitle="Home Tab">
  <Text>Home</Text>
</View>
```

### `accessibilityState`

描述组件当前状态给辅助技术用户。

`accessibilityState` 是一个对象。它包含以下字段：

| 名称     | 描述                                                                                                                               | 类型               | 必需 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---- |
| disabled | 表示该元素是否被禁用。                                                                                                             | boolean            | 否   |
| selected | 表示一个可选择元素当前是否被选中。                                                                                                 | boolean            | 否   |
| checked  | 表示可勾选元素的状态。此字段可以是布尔值或 "mixed" 字符串，用于表示混合状态复选框。                                                 | boolean or 'mixed' | 否   |
| busy     | 表示该元素当前是否处于忙碌状态。                                                                                                     | boolean            | 否   |
| expanded | 表示可展开元素当前是展开还是折叠。                                                                                                   | boolean            | 否   |

使用时，请将 `accessibilityState` 设置为具有特定定义的对象。

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；或者对于基于范围的组件，例如滑块和进度条，它包含范围信息（最小值、当前值和最大值）。

`accessibilityValue` 是一个对象。它包含以下字段：

| 名称 | 描述                                                                                      | 类型    | 必需                     |
| ---- | ----------------------------------------------------------------------------------------- | ------- | ------------------------ |
| min  | 此组件范围的最小值。                                                                       | integer | 如果设置了 `now`，则必需。 |
| max  | 此组件范围的最大值。                                                                       | integer | 如果设置了 `now`，则必需。 |
| now  | 此组件范围的当前值。                                                                       | integer | 否                       |
| text | 此组件值的文本描述。如果设置，将覆盖 `min`、`now` 和 `max`。                               | string  | 否                       |

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个布尔值，表示 VoiceOver 是否应忽略接收者同级视图中的元素。

例如，在一个包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 上的 `accessibilityViewIsModal` 设置为 `true` 会导致 VoiceOver 忽略视图 `A` 中的元素。另一方面，如果视图 `B` 包含子视图 `C`，并且你将视图 `C` 上的 `accessibilityViewIsModal` 设置为 `true`，则 VoiceOver 不会忽略视图 `A` 中的元素。

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，表示给定的无障碍元素以及其包含的任何无障碍元素是否被隐藏。

例如，在一个包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 上的 `accessibilityElementsHidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 视图及其包含的任何元素。这类似于 Android 属性 `importantForAccessibility="no-hide-descendants"`。

### `aria-valuemax`

表示基于范围的组件的最大值，例如滑块和进度条。

### `aria-valuemin`

表示基于范围的组件的最小值，例如滑块和进度条。

### `aria-valuenow`

表示基于范围的组件的当前值，例如滑块和进度条。

### `aria-valuetext`

表示组件的文本描述。

### `aria-busy`

表示元素正在被修改，辅助技术可能希望等到更改完成后再向用户通报更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

### `aria-checked`

表示可勾选元素的状态。此字段可以是布尔值或 "mixed" 字符串，用于表示混合状态复选框。

| 类型               | 默认值 |
| ------------------ | ------ |
| boolean, 'mixed' | false  |

### `aria-disabled`

表示该元素可被感知，但已被禁用，因此不可编辑或执行其他操作。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

### `aria-expanded`

表示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

### `aria-hidden`

表示该元素对辅助技术隐藏。

例如，在一个包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 上的 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略 `B` 元素及其子元素。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

### `aria-label`

定义一个可用于为元素命名的字符串值。

| 类型   |
| ------ |
| string |

### `aria-labelledby` <div className="label android">Android</div>

标识用于为其所应用的元素添加标签的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">输入字段标签</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| string |

### `aria-live` <div className="label android">Android</div>

表示某个元素将被更新，并描述用户代理、辅助技术和用户对该实时区域的更新可以预期的类型。

- **off** 无障碍服务不应播报此视图的变化。
- **polite** 无障碍服务应播报此视图的变化。
- **assertive** 无障碍服务应打断当前语音，立即播报此视图的变化。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------ |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

一个布尔值，表示 VoiceOver 是否应忽略接收者同级视图中的元素。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false  |

### `aria-selected`

表示一个可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

:::note
为了简洁起见，下面的示例中省略了布局，尽管它决定了默认的焦点顺序。请假设文档顺序与布局顺序一致。
:::

`experimental_accessibilityOrder` 允许你定义辅助技术聚焦子组件的顺序。它是一个应用于你所控制顺序的组件上的 [`nativeID`](view.md#nativeid) 数组。例如：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
</View>
```

辅助技术会先聚焦 `nativeID` 为 `B` 的 `View`，然后是 `C`，最后是 `A`。

`experimental_accessibilityOrder` 不会为它引用的组件“开启”无障碍功能，这仍然需要单独完成。因此，如果我们像下面这样移除上方 `C` 上的 `accessible={true}`

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C"/>
</View>
```

那么新的顺序将是 `B` 然后 `A`，即使 `C` 仍然在 `experimental_accessibilityOrder` 中。

不过，`experimental_accessibilityOrder` 会“关闭”它未引用的组件的无障碍功能。

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
  <View accessible={true} nativeID="D"/>
</View>
```

上面示例中的顺序会是 `B`、`C`、`A`。`D` 永远不会获得焦点。从这个意义上说，`experimental_accessibilityOrder` 是 _穷尽式_ 的。

在 `experimental_accessibilityOrder` 中包含一个非可访问组件仍然有合理的理由。考虑：

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

焦点顺序将是 `B`、`D`、`E`、`F`、`A`。尽管 `D`、`E` 和 `F` 没有被 `experimental_accessibilityOrder` 直接引用，但 `C` 被直接引用了。在这种情况下，`C` 是一个 _无障碍容器_——它包含可访问元素，但自身不是可访问元素。如果在 `experimental_accessibilityOrder` 中引用了一个无障碍容器，那么它所包含元素的默认顺序就会被应用。从这个意义上说，`experimental_accessibilityOrder` 是 _可嵌套_ 的。

`experimental_accessibilityOrder` 也可以引用另一个带有 `experimental_accessibilityOrder` 的组件

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

一个组件不能同时是无障碍容器和无障碍元素（`accessible={true}`）。所以如果我们有

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

焦点顺序将会是 `B`、`C`、`A`。`D`、`E` 和 `F` 不再处于容器中，因此 `experimental_accessibilityOrder` 的穷尽性意味着它们会被排除。

### `importantForAccessibility` <div className="label android">Android</div>

当同一父组件下有两个重叠的 UI 组件时，默认的无障碍焦点行为可能不可预测。`importantForAccessibility` 属性可以通过控制某个视图是否触发无障碍事件以及是否向无障碍服务报告来解决这个问题。它可以设置为 `auto`、`yes`、`no` 和 `no-hide-descendants`（最后一个值会强制无障碍服务忽略该组件及其所有子组件）。

```tsx
<View style={styles.container}>
  <View
    style={[styles.layout, {backgroundColor: 'green'}]}
    importantForAccessibility="yes">
    <Text>第一个布局</Text>
  </View>
  <View
    style={[styles.layout, {backgroundColor: 'yellow'}]}
    importantForAccessibility="no-hide-descendants">
    <Text>第二个布局</Text>
  </View>
</View>
```

在上面的示例中，`yellow` 布局及其后代对 TalkBack 和所有其他无障碍服务都是完全不可见的。因此，我们可以在不让 TalkBack 混淆的情况下使用具有相同父级的重叠视图。

### `onAccessibilityEscape` <div className="label ios">iOS</div>

将此属性赋值给一个自定义函数，当有人执行“退出”手势时会被调用，该手势是一个双指 Z 字形手势。退出函数应在用户界面中按层级向后返回。这可能意味着在导航层级中向上或后退，或者关闭一个模态用户界面。如果所选元素没有 `onAccessibilityEscape` 函数，系统会尝试沿视图层级向上查找，直到找到一个具有该函数的视图，或者发出提示音表示未找到。

### `onAccessibilityTap` <div className="label ios">iOS</div>

使用此属性为一个自定义函数赋值，当有人在选中一个可访问元素后通过双击激活它时会调用该函数。

### `onMagicTap` <div className="label ios">iOS</div>

将此属性赋值给一个自定义函数，当有人执行“魔法点击”手势时会被调用，该手势是双指双击。魔法点击函数应执行用户在组件上最相关的操作。在 iPhone 的电话应用中，魔法点击会接听电话或结束当前通话。如果所选元素没有 `onMagicTap` 函数，系统会沿视图层级向上查找，直到找到一个具有该函数的视图。

### `role`

`role` 用于传达组件的用途，并且优先于 [`accessibilityRole`](accessibility#accessibilityrole) 属性。

`role` 可以是以下之一：

- **alert** 用于元素包含需要向用户呈现的重要文本的场景。
- **button** 用于元素应被视为按钮的场景。
- **checkbox** 用于元素表示可勾选、取消勾选或混合勾选状态的复选框的场景。
- **combobox** 用于元素表示组合框的场景，允许用户在多个选项中选择。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用，用于表示网格。会向 android GridView 添加进出网格的播报。
- **heading** 用于元素充当内容区块标题的场景（例如导航栏标题）。
- **img** 用于元素应被视为图像的场景。例如，可与按钮或链接组合使用。
- **link** 用于元素应被视为链接的场景。
- **list** 用于标识项目列表。
- **listitem** 用于标识列表中的一项。
- **menu** 用于组件是一个选项菜单的场景。
- **menubar** 用于组件是多个菜单容器的场景。
- **menuitem** 用于表示菜单中的项目。
- **none** 用于元素没有角色的场景。
- **presentation** 用于元素没有角色的场景。
- **progressbar** 用于表示指示任务进度的组件。
- **radio** 用于表示单选按钮。
- **radiogroup** 用于表示一组单选按钮。
- **scrollbar** 用于表示滚动条。
- **searchbox** 用于文本字段元素也应被视为搜索字段的场景。
- **slider** 用于元素可以被“调节”的场景（例如滑块）。
- **spinbutton** 用于表示打开选项列表的按钮。
- **summary** 用于应用首次启动时，元素可用于提供当前状态的快速摘要。
- **switch** 用于表示可开启和关闭的开关。
- **tab** 用于表示标签页。
- **tablist** 用于表示标签页列表。
- **timer** 用于表示计时器。
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）。

## 辅助功能操作

辅助功能操作允许辅助技术以编程方式调用组件的操作。要支持辅助功能操作，组件必须做两件事：

- 通过 `accessibilityActions` 属性定义其支持的操作列表。
- 实现一个 `onAccessibilityAction` 函数来处理操作请求。

`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含以下字段：

| 名称  | 类型   | 必需 |
| ----- | ------ | ---- |
| name  | string | 是   |
| label | string | 否   |

操作要么表示标准操作，例如点击按钮或调整滑块；要么表示特定于某个组件的自定义操作，例如删除电子邮件消息。`name` 字段对标准操作和自定义操作都是必需的，但标准操作的 `label` 是可选的。

在添加对标准操作的支持时，`name` 必须是以下之一：

- `'magicTap'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户用两根手指双击。
- `'escape'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户执行两根手指的擦拭手势（左、右、左）。
- `'activate'` - 激活组件。这应在有无辅助技术的情况下执行相同的操作。当屏幕阅读器用户双击组件时触发。
- `'increment'` - 增加可调节组件的值。在 iOS 上，当组件角色为 `'adjustable'`，且用户将焦点置于其上并向上滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将辅助功能焦点置于组件上并按下音量加按钮时，TalkBack 会生成此操作。
- `'decrement'` - 减少可调节组件的值。在 iOS 上，当组件角色为 `'adjustable'`，且用户将焦点置于其上并向下滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将辅助功能焦点置于组件上并按下音量减按钮时，TalkBack 会生成此操作。
- `'longpress'` - 仅限 Android - 当用户将辅助功能焦点置于组件上，然后双击并用一根手指按住屏幕时，会生成此操作。这应在有无辅助技术的情况下执行相同的操作。
- `'expand'` - 仅限 Android - 此操作会“展开”组件，以便 TalkBack 朗读“已展开”的提示。
- `'collapse'` - 仅限 Android - 此操作会“折叠”组件，以便 TalkBack 朗读“已折叠”的提示。

`label` 字段对标准操作是可选的，辅助技术通常不会使用。对于自定义操作，它是一个本地化字符串，包含要向用户呈现的操作描述。

要处理操作请求，组件必须实现 `onAccessibilityAction` 函数。此函数唯一的参数是一个事件，其中包含要执行的操作名称。下面来自 RNTester 的示例展示了如何创建一个定义并处理多个自定义操作的组件。

```tsx
<View
  accessible={true}
  accessibilityActions={[
    {name: 'cut', label: '剪切'},
    {name: 'copy', label: '复制'},
    {name: 'paste', label: '粘贴'},
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

## 检查屏幕阅读器是否已启用

`AccessibilityInfo` API 可让你确定屏幕阅读器当前是否处于激活状态。有关详情，请参阅 [AccessibilityInfo 文档](accessibilityinfo)。

## 发送辅助功能事件 <div className="label android">Android</div>

有时在 UI 组件上触发辅助功能事件会很有用（例如，当自定义视图出现在屏幕上时，或者将辅助功能焦点设置到某个视图时）。原生 UIManager 模块为此暴露了一个 `sendAccessibilityEvent` 方法。它接受两个参数：视图标签和事件类型。支持的事件类型有 `typeWindowStateChanged`、`typeViewFocused` 和 `typeViewClicked`。

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

要启用 TalkBack，请前往 Android 设备或模拟器上的“设置”应用。点按“辅助功能”，然后点按 TalkBack。切换“使用服务”开关以启用或禁用它。

Android 模拟器默认未安装 TalkBack。你可以通过 Google Play 商店在模拟器上安装 TalkBack。请确保选择已安装 Google Play 商店的模拟器。这些可在 Android Studio 中获得。

你可以使用音量键快捷方式来切换 TalkBack。要开启音量键快捷方式，请前往“设置”应用，然后进入“辅助功能”。在顶部启用音量键快捷方式。

要使用音量键快捷方式，请同时按住两个音量键 3 秒以启动辅助功能工具。

另外，如果你愿意，也可以通过命令行切换 TalkBack：

```shell
# 禁用
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# 启用
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

## 测试 VoiceOver 支持 <div className="label ios">iOS</div>

要在你的 iOS 或 iPadOS 设备上启用 VoiceOver，请前往“设置”应用，点按“通用”，然后点按“辅助功能”。在那里你会找到许多可供用户启用的工具，以让设备更易于使用，其中包括 VoiceOver。要启用 VoiceOver，请在“视觉”下点按 VoiceOver，并切换顶部出现的开关。

在“辅助功能”设置的最底部，有一个“辅助功能快捷键”。你可以通过三击 Home 按钮来使用它切换 VoiceOver。

VoiceOver 无法通过模拟器使用，但你可以使用 Xcode 中的 Accessibility Inspector，通过应用程序使用 macOS 的 VoiceOver。请注意，最好始终使用真机测试，因为 macOS 的 VoiceOver 可能会带来不同的体验。

## 其他资源

- [让 React Native 应用更具可访问性](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
