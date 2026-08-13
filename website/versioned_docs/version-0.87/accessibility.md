---
id: accessibility
title: 可访问性
description: 使用 React Native 的 API 套件创建可供辅助技术使用的移动应用，该 API 套件旨在与 Android 和 iOS 配合使用。
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

Android 和 iOS 都提供了将应用与辅助技术集成的 API，例如随附的屏幕阅读器 VoiceOver（iOS）和 TalkBack（Android）。React Native 也提供了互补的 API，让你的应用能够适应所有用户。

:::info
Android 和 iOS 的实现方式略有不同，因此 React Native 的实现可能会因平台而异
:::

## Accessibility 属性

### `accessible`

当设置为 `true` 时，表示该视图可被屏幕阅读器和硬件键盘等辅助技术发现。请注意，这并不一定意味着 VoiceOver 或 TalkBack 会聚焦该视图。出现这种情况可能有多种原因，例如 VoiceOver 不允许嵌套辅助功能元素，或者 TalkBack 选择聚焦某个父元素。

默认情况下，所有可触摸元素都具备辅助功能。

在 Android 上，`accessible` 会被转换为原生的 [`focusable`](<https://developer.android.com/reference/android/view/View#setFocusable(boolean)>)。在 iOS 上，它会被转换为原生的 [`isAccessibilityElement`](https://developer.apple.com/documentation/uikit/uiaccessibilityelement/isaccessibilityelement?language=objc)。

```tsx
<View>
  <View accessible={true} />
  <View />
</View>
```

在上面的示例中，只有带有 `accessible` 属性的第一个子视图可以获得辅助功能焦点，父视图以及未设置 `accessible` 的同级视图都不能获得焦点。

### `accessibilityLabel`

当一个视图被标记为可访问时，最好在该视图上设置 `accessibilityLabel`，这样使用 VoiceOver 或 TalkBack 的用户就能知道自己选择了哪个元素。当关联元素被选中时，屏幕阅读器会读出此字符串。

使用时，请在 View、Text 或 Touchable 上将 `accessibilityLabel` 属性设置为自定义字符串：

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

在上面的示例中，TouchableOpacity 元素上的 `accessibilityLabel` 默认会是 "Press me!"。该标签由所有 Text 节点子元素拼接而成，节点之间以空格分隔。

### `accessibilityLabelledBy` <div className="label android">Android</div>

引用另一个元素的 [nativeID](view.md#nativeid)，用于构建复杂表单。
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

在上面的示例中，聚焦 TextInput 时，屏幕阅读器会播报 `Input, Edit Box for Label for Input Field`。

### `accessibilityHint`

当仅通过辅助功能标签无法清楚了解操作结果时，可以使用辅助功能提示向用户提供额外上下文。

在 View、Text 或 Touchable 上为 `accessibilityHint` 属性提供自定义字符串：

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

在上面的示例中，如果用户在设备的 VoiceOver 设置中启用了提示，VoiceOver 会在标签之后读出提示。有关 `accessibilityHint` 指南的更多信息，请参阅 [iOS Developer Docs](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint)

<div className="label android basic">Android</div>

在上面的示例中，TalkBack 会在标签之后读出提示。目前，Android 上无法关闭提示。

### `accessibilityLanguage` <div className="label ios">iOS</div>

通过使用 `accessibilityLanguage` 属性，屏幕阅读器可以了解在读取元素的**标签**、**值**和**提示**时应使用哪种语言。提供的字符串值必须遵循 [BCP 47 specification](https://www.rfc-editor.org/info/bcp47)。

```tsx
<View
  accessible={true}
  accessibilityLabel="Pizza"
  accessibilityLanguage="it-IT">
  <Text>🍕</Text>
</View>
```

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

反转屏幕颜色是 iOS 和 iPadOS 为色盲、低视力或视力障碍人士提供的一项辅助功能。如果启用此设置时，有某个视图不希望被反转（例如照片），请将此属性设置为 `true`。

### `accessibilityLiveRegion` <div className="label android">Android</div>

当组件动态变化时，我们希望 TalkBack 提醒最终用户。`accessibilityLiveRegion` 属性可以实现这一点。它可以设置为 `none`、`polite` 和 `assertive`：

- **none** 辅助功能服务不应播报此视图的变化
- **polite** 辅助功能服务应播报此视图的变化
- **assertive** 辅助功能服务应中断正在进行的语音，立即播报此视图的变化

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

在上面的示例中，`addOne` 方法会修改状态变量 `count`。触发 TouchableWithoutFeedback 时，由于 Text 视图的 `accessibilityLiveRegion="polite"` 属性，TalkBack 会读取其中的文本。

### `accessibilityRole`

`accessibilityRole` 向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下值之一：

- **adjustable** 用于元素可以进行“调整”的情况（例如滑块）
- **alert** 用于元素包含需要呈现给用户的重要文本的情况
- **button** 用于元素应被视为按钮的情况
- **checkbox** 用于元素表示可选中、未选中或处于混合选中状态的复选框
- **combobox** 用于元素表示组合框，允许用户从多个选项中进行选择
- **header** 用于元素充当内容区段的标题（例如导航栏的标题）
- **image** 用于元素应被视为图像的情况。可以与按钮或链接组合使用
- **imagebutton** 用于元素应被视为按钮且同时是图像的情况
- **keyboardkey** 用于元素充当键盘按键的情况
- **link** 用于元素应被视为链接的情况
- **menu** 用于组件是选项菜单的情况
- **menubar** 用于组件是多个菜单的容器的情况
- **menuitem** 用于表示菜单中的项目
- **none** 用于元素没有角色的情况
- **progressbar** 用于表示显示任务进度的组件
- **radio** 用于表示单选按钮
- **radiogroup** 用于表示单选按钮组
- **scrollbar** 用于表示滚动条
- **search** 用于文本字段元素还应被视为搜索字段的情况
- **spinbutton** 用于表示打开选项列表的按钮
- **summary** 用于元素可在应用首次启动时提供当前应用状态的快速摘要
- **switch** 用于表示可以打开和关闭的开关
- **tab** 用于表示选项卡
- **tablist** 用于表示选项卡列表
- **text** 用于元素应被视为无法更改的静态文本的情况
- **timer** 用于表示计时器
- **togglebutton** 用于表示切换按钮。应与 accessibilityState checked 一起使用，以指示按钮是否已切换
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用来表示网格。会为 Android 的 GridView 添加进入和离开网格的播报

### `accessibilityShowsLargeContentViewer` <div className="label ios">iOS</div>

一个布尔值，用于确定用户长按元素时是否显示大内容查看器。

iOS 13.0 及更高版本可用。

### `accessibilityLargeContentTitle` <div className="label ios">iOS</div>

大内容查看器显示时用作其标题的字符串。

要求将 `accessibilityShowsLargeContentViewer` 设置为 `true`。

```tsx
<View
  accessibilityShowsLargeContentViewer={true}
  accessibilityLargeContentTitle="Home Tab">
  <Text>Home</Text>
</View>
```

### `accessibilityState`

向辅助技术用户描述组件的当前状态。

`accessibilityState` 是一个对象，包含以下字段：

| Name     | Description                                                                                                                           | Type               | Required |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- |
| disabled | Indicates whether the element is disabled or not.                                                                                     | boolean            | No       |
| selected | Indicates whether a selectable element is currently selected or not.                                                                  | boolean            | No       |
| checked  | Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes. | boolean or 'mixed' | No       |
| busy     | Indicates whether an element is currently busy or not.                                                                                | boolean            | No       |
| expanded | Indicates whether an expandable element is currently expanded or collapsed.                                                           | boolean            | No       |

使用时，将 `accessibilityState` 设置为具有特定定义的对象。

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述；对于滑块和进度条等基于范围的组件，它包含范围信息（最小值、当前值和最大值）。

`accessibilityValue` 是一个对象，包含以下字段：

| Name | Description                                                                                    | Type    | Required                  |
| ---- | ---------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| min  | The minimum value of this component's range.                                                   | integer | Required if `now` is set. |
| max  | The maximum value of this component's range.                                                   | integer | Required if `now` is set. |
| now  | The current value of this component's range.                                                   | integer | No                        |
| text | A textual description of this component's value. Will override `min`, `now`, and `max` if set. | string  | No                        |

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个布尔值，用于指示 VoiceOver 是否应忽略与当前视图同级的视图中的元素。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `accessibilityViewIsModal` 设置为 `true` 会使 VoiceOver 忽略视图 `A` 中的元素。另一方面，如果视图 `B` 包含子视图 `C`，并将视图 `C` 的 `accessibilityViewIsModal` 设置为 `true`，VoiceOver 不会忽略视图 `A` 中的元素。

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，用于指示给定的辅助功能元素及其包含的任何辅助功能元素是否被隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `accessibilityElementsHidden` 设置为 `true` 会使 VoiceOver 忽略视图 `B` 及其包含的任何元素。这与 Android 属性 `importantForAccessibility="no-hide-descendants"` 类似。

### `aria-valuemax`

表示基于范围的组件（例如滑块和进度条）的最大值。

### `aria-valuemin`

表示基于范围的组件（例如滑块和进度条）的最小值。

### `aria-valuenow`

表示基于范围的组件（例如滑块和进度条）的当前值。

### `aria-valuetext`

表示组件的文本描述。

### `aria-busy`

表示元素正在被修改，辅助技术可能需要等到更改完成后再将更新告知用户。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `aria-checked`

表示可勾选元素的状态。此字段可以使用布尔值，或使用 `"mixed"` 字符串表示混合复选框。

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

### `aria-disabled`

表示元素可感知但已被禁用，因此不可编辑或以其他方式操作。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `aria-expanded`

表示可展开元素当前是展开还是折叠状态。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `aria-hidden`

表示元素是否对辅助技术隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设置为 `true` 会使 VoiceOver 忽略元素 `B` 及其子元素。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `aria-label`

定义可用于命名元素的字符串值。

| Type   |
| ------ |
| string |

### `aria-labelledby` <div className="label android">Android</div>

标识用于标记应用该属性的元素的元素。`aria-labelledby` 的值应与相关元素的 [`nativeID`](view.md#nativeid) 匹配：

```tsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| Type   |
| ------ |
| string |

### `aria-live` <div className="label android">Android</div>

表示元素将会更新，并描述用户代理、辅助技术和用户可从实时区域中预期的更新类型。

- **off** 辅助功能服务不应播报此视图的变化
- **polite** 辅助功能服务应播报此视图的变化
- **assertive** 辅助功能服务应中断正在进行的语音，立即播报此视图的变化

| Type                                     | Default |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

用于指示 VoiceOver 是否应忽略与当前视图同级的视图中的元素的布尔值。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `aria-selected`

表示可选择元素当前是否已选中。

| Type    |
| ------- |
| boolean |

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

:::note
为简洁起见，以下示例中省略了布局，尽管布局决定了默认焦点顺序。假设文档顺序与布局顺序一致
:::

`experimental_accessibilityOrder` 允许你定义辅助技术聚焦后代组件的顺序。它是一个 [`nativeIDs`](view.md#nativeid) 数组，这些 ID 被设置在你要控制顺序的组件上。例如：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
</View>
```

辅助技术会依次聚焦 `nativeID` 为 `B`、`C` 和 `A` 的 `View`。

`experimental_accessibilityOrder` 不会为其引用的组件“开启”辅助功能，这仍然需要单独完成。因此，如果像下面这样移除上例中 `C` 的 `accessible={true}`：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C"/>
</View>
```

那么新的顺序将是 `B`，然后是 `A`，即使 `C` 仍然位于 `experimental_accessibilityOrder` 中。

不过，`experimental_accessibilityOrder` 会“关闭”未被其引用的组件的辅助功能。

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
  <View accessible={true} nativeID="D"/>
</View>
```

上面示例的顺序将是 `B`、`C`、`A`。`D` 永远不会获得焦点。从这个意义上说，`experimental_accessibilityOrder` 是*穷举式的*。

在 `experimental_accessibilityOrder` 中包含不可访问组件仍有合理的原因。请考虑以下示例：

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

焦点顺序将是 `B`、`D`、`E`、`F`、`A`。尽管 `D`、`E` 和 `F` 没有在 `experimental_accessibilityOrder` 中直接引用，但 `C` 被直接引用了。在此情况下，`C` 是一个*辅助功能容器*——它包含可访问元素，但自身不可访问。如果在 `experimental_accessibilityOrder` 中引用了辅助功能容器，则会应用其所包含元素的默认顺序。从这个意义上说，`experimental_accessibilityOrder` 是*可嵌套的*。

`experimental_accessibilityOrder` 还可以引用另一个带有 `experimental_accessibilityOrder` 的组件：

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

组件不能同时是辅助功能容器和辅助功能元素（`accessible={true}`）。因此，如果有：

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

焦点顺序将是 `B`、`C`、`A`。`D`、`E` 和 `F` 不再位于容器中，因此由于 `experimental_accessibilityOrder` 的穷举性质，它们会被排除。

### `importantForAccessibility` <div className="label android">Android</div>

当两个具有相同父元素的 UI 组件重叠时，默认的辅助功能焦点可能会出现不可预测的行为。`importantForAccessibility` 属性可以通过控制视图是否触发辅助功能事件以及是否向辅助功能服务报告该视图来解决此问题。它可以设置为 `auto`、`yes`、`no` 和 `no-hide-descendants`（最后一个值会强制辅助功能服务忽略该组件及其所有子元素）。

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

在上面的示例中，`yellow` 布局及其后代对 TalkBack 和所有其他辅助功能服务完全不可见。因此，我们可以使用具有相同父元素的重叠视图，而不会让 TalkBack 产生混淆。

### `onAccessibilityEscape` <div className="label ios">iOS</div>

将此属性赋值为一个自定义函数。当有人执行“escape”手势时，该函数会被调用。该手势是一个双指 Z 形手势。escape 函数应在用户界面中进行层级回退。这可能意味着在导航层级中向上或返回，或者关闭模态用户界面。如果选中的元素没有 `onAccessibilityEscape` 函数，系统会尝试沿视图层级向上遍历，直到找到具有该函数的视图，或者发出提示音表示无法找到这样的视图。

### `onAccessibilityTap` <div className="label ios">iOS</div>

使用此属性指定一个自定义函数。当有人在选中可访问元素时双击该元素将其激活，该函数会被调用。

### `onMagicTap` <div className="label ios">iOS</div>

将此属性赋值为一个自定义函数。当有人执行“magic tap”手势时，该函数会被调用。该手势是双指双击。magic tap 函数应执行用户在组件上可以采取的最相关操作。在 iPhone 的 Phone 应用中，magic tap 会接听电话或结束当前通话。如果选中的元素没有 `onMagicTap` 函数，系统会沿视图层级向上遍历，直到找到具有该函数的视图。

### `role`

`role` 传达组件的用途，并且优先于 [`accessibilityRole`](accessibility#accessibilityrole) 属性。

`role` 可以是以下值之一：

- **alert** 用于元素包含需要呈现给用户的重要文本的情况
- **button** 用于元素应被视为按钮的情况
- **checkbox** 用于元素表示可选中、未选中或处于混合选中状态的复选框
- **combobox** 用于元素表示组合框，允许用户从多个选项中进行选择
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用来表示网格。会为 android GridView 添加进入和离开网格的播报
- **heading** 用于元素充当内容区段的标题（例如导航栏的标题）
- **img** 用于元素应被视为图像的情况。例如，可以与按钮或链接组合使用
- **link** 用于元素应被视为链接的情况
- **list** 用于标识项目列表
- **listitem** 用于标识列表中的项目
- **menu** 用于组件是选项菜单的情况
- **menubar** 用于组件是多个菜单的容器的情况
- **menuitem** 用于表示菜单中的项目
- **none** 用于元素没有角色的情况
- **presentation** 用于元素没有角色的情况
- **progressbar** 用于表示显示任务进度的组件
- **radio** 用于表示单选按钮
- **radiogroup** 用于表示单选按钮组
- **scrollbar** 用于表示滚动条
- **searchbox** 用于文本字段元素还应被视为搜索字段的情况
- **slider** 用于元素可以进行“调整”的情况（例如滑块）
- **spinbutton** 用于表示打开选项列表的按钮
- **summary** 用于元素可在应用首次启动时提供当前应用状态的快速摘要
- **switch** 用于表示可以打开和关闭的开关
- **tab** 用于表示选项卡
- **tablist** 用于表示选项卡列表
- **timer** 用于表示计时器
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）

## Accessibility Actions

辅助功能操作允许辅助技术以编程方式调用组件的操作。要支持辅助功能操作，组件必须完成以下两件事：

- 通过 `accessibilityActions` 属性定义其支持的操作列表
- 实现一个用于处理操作请求的 `onAccessibilityAction` 函数

`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含以下字段：

| Name  | Type   | Required |
| ----- | ------ | -------- |
| name  | string | Yes      |
| label | string | No       |

操作可以表示标准操作，例如点击按钮或调整滑块，也可以表示特定组件的自定义操作，例如删除电子邮件。标准操作和自定义操作都需要 `name` 字段，但标准操作的 `label` 字段是可选的。

添加对标准操作的支持时，`name` 必须是以下值之一：

- `'magicTap'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户使用双指进行双击
- `'escape'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户执行双指擦除手势（左、右、左）
- `'activate'` - 激活组件。无论是否使用辅助技术，都应执行相同的操作。当屏幕阅读器用户双击组件时触发
- `'increment'` - 增加可调整组件的值。在 iOS 上，当组件的角色为 `'adjustable'`，用户将焦点置于该组件上并向上滑动时，VoiceOver 会生成此操作。在 Android 上，在 TalkBack 8.1 及更低版本中，当用户聚焦组件并按下音量增大按钮时，会生成此操作。在 TalkBack 9.1 及更高版本中，此操作已被“Adjust Reading Control”手势取代（在聚焦的控件上向上滑动）
- `'decrement'` - 减小可调整组件的值。在 iOS 上，当组件的角色为 `'adjustable'`，用户将焦点置于该组件上并向下滑动时，VoiceOver 会生成此操作。在 Android 上，在 TalkBack 8.2 及更低版本中，当用户聚焦组件并按下音量减小按钮时，会生成此操作。在 TalkBack 9.2 及更高版本中，此操作已被“Adjust Reading Control”手势取代（在聚焦的控件上向下滑动）
- `'longpress'` - 仅限 Android - 当用户将辅助功能焦点置于组件上，然后用一根手指双击并按住屏幕时，会生成此操作。无论是否使用辅助技术，都应执行相同的操作
- `'expand'` - 仅限 Android - 此操作会“展开”组件，使 TalkBack 播报“已展开”提示
- `'collapse'` - 仅限 Android - 此操作会“折叠”组件，使 TalkBack 播报“已折叠”提示

标准操作的 `label` 字段是可选的，辅助技术使用它来描述操作的具体结果。例如，TalkBack 使用此字段，将默认的“Double tap to activate”播报替换为“Double tap to open chat”之类的自定义描述。对于自定义操作，`label` 是包含操作描述的本地化字符串，该描述会呈现给用户。

为了处理操作请求，组件必须实现一个 `onAccessibilityAction` 函数。此函数唯一的参数是一个事件，其中包含要执行的操作名称。下面来自 RNTester 的示例展示了如何创建一个定义并处理多个自定义操作的组件。

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

## 检查屏幕阅读器是否已启用

`AccessibilityInfo` API 允许你确定屏幕阅读器当前是否处于活动状态。详情请参阅 [AccessibilityInfo documentation](accessibilityinfo)。

## 发送辅助功能事件 <div className="label android">Android</div>

有时，在 UI 组件上触发辅助功能事件很有用（例如自定义视图出现在屏幕上，或将辅助功能焦点设置到某个视图时）。原生 UIManager 模块公开了一个名为 ‘sendAccessibilityEvent’ 的方法，用于此目的。它接受两个参数：视图标签和事件类型。支持的事件类型包括 `typeWindowStateChanged`、`typeViewFocused` 和 `typeViewClicked`。

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

要启用 TalkBack，请在 Android 设备或模拟器上打开 Settings 应用。点击 Accessibility，然后点击 TalkBack。切换“Use service”开关即可启用或禁用它。

Android 模拟器默认未安装 TalkBack。你可以通过 Google Play Store 在模拟器上安装 TalkBack。请确保选择安装了 Google Play store 的模拟器。这些模拟器可在 Android Studio 中使用。

你可以使用音量键快捷方式来切换 TalkBack。要启用音量键快捷方式，请打开 Settings 应用，然后点击 Accessibility。在顶部启用音量键快捷方式。

要使用音量键快捷方式，请同时按住两个音量键 3 秒，以启动辅助功能工具。

此外，如果你愿意，也可以通过命令行切换 TalkBack：

```shell
# disable
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# enable
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

## 测试 VoiceOver 支持 <div className="label ios">iOS</div>

要在 iOS 或 iPadOS 设备上启用 VoiceOver，请打开 Settings 应用，点击 General，然后点击 Accessibility。在这里，你会看到许多可用工具，帮助用户让设备更易于使用，其中包括 VoiceOver。要启用 VoiceOver，请在“Vision”下点击 VoiceOver，然后切换顶部显示的开关。

在 Accessibility 设置的最底部有一个“Accessibility Shortcut”。你可以通过连续三次点击 Home 按钮来使用它切换 VoiceOver。

模拟器不提供 VoiceOver，但你可以使用 Xcode 中的 Accessibility Inspector，通过应用使用 macOS VoiceOver。请注意，使用设备进行测试始终是最佳选择，因为 macOS 的 VoiceOver 可能会带来不同的体验。

## 其他资源

- [Making React Native Apps Accessible](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
