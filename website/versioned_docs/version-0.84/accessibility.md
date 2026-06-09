---
id: accessibility
title: 辅助功能（Accessibility）
description: 使用 React Native 提供的一套针对 Android 和 iOS 的辅助功能 API 创建可被辅助技术访问的移动应用。
---

import ExperimentalAPIWarning from './\_experimental-api-warning.mdx';

Android 和 iOS 均提供了用于将应用程序与辅助技术集成的 API，例如内置的屏幕阅读器 VoiceOver（iOS）和 TalkBack（Android）。React Native 拥有配套的 API，使你的应用可以适应所有用户。

:::info
Android 和 iOS 在实现方式上略有不同，因此 React Native 的实现也可能因平台而异。
:::

## 辅助功能属性

### `accessible`

当设为 `true` 时，表示该视图对辅助技术（如屏幕阅读器和硬件键盘）可被发现。请注意，这并不一定意味着该视图会被 VoiceOver 或 TalkBack 聚焦。这可能有多种原因，例如 VoiceOver 不允许嵌套的辅助元素，或者 TalkBack 选择聚焦某个父元素。

默认情况下，所有可触摸元素都是可访问的。

在 Android 上，`accessible` 会被转换为原生的 [`focusable`](<https://developer.android.com/reference/android/view/View#setFocusable(boolean)>)。在 iOS 上，则转换成原生的 [`isAccessibilityElement`](https://developer.apple.com/documentation/uikit/uiaccessibilityelement/isaccessibilityelement?language=objc)。

```tsx
<View>
  <View accessible={true} />
  <View />
</View>
```

在上例中，只有设有 `accessible` 属性的第一个子视图可被辅助功能聚焦，父视图和没有设置 `accessible` 的兄弟视图则不可聚焦。

### `accessibilityLabel`

当视图被标记为可访问时，最好为视图设置一个 `accessibilityLabel`，这样使用 VoiceOver 或 TalkBack 的用户就能知道他们选择了哪个元素。屏幕阅读器在选中对应元素时会朗读该字符串。

用法是在 View、Text 或 Touchable 上设置自定义字符串的 `accessibilityLabel` 属性：

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="点我！"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>按我！</Text>
  </View>
</TouchableOpacity>
```

在上述示例中，TouchableOpacity 元素的 `accessibilityLabel` 默认为“按我！”。标签是所有 Text 节点子元素的内容用空格连接而成。

### `accessibilityLabelledBy` <div className="label android">Android</div>

指向另一个元素的 [nativeID](view.md#nativeid)，用于构建复杂表单。`accessibilityLabelledBy` 的值应匹配相关元素的 `nativeID`：

```tsx
<View>
  <Text nativeID="formLabel">输入框标签</Text>
  <TextInput
    accessibilityLabel="输入框"
    accessibilityLabelledBy="formLabel"
  />
</View>
```

上述例子中，屏幕阅读器在聚焦 TextInput 时会朗读“输入框，编辑框，输入框标签”。

### `accessibilityHint`

辅助功能提示可提供额外上下文，帮助用户理解操作结果，当仅凭辅助标签不够明确时尤为重要。

为 View、Text 或 Touchable 设置自定义的 `accessibilityHint` 属性：

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="返回"
  accessibilityHint="导航到上一个屏幕"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>返回</Text>
  </View>
</TouchableOpacity>
```

<div className="label ios basic">iOS</div>

在上例中，如果用户在设备的 VoiceOver 设置中启用了提示，VoiceOver 会在标签后朗读该提示。更多关于 `accessibilityHint` 的指南，可见 [iOS 开发者文档](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint)

<div className="label android basic">Android</div>

在上例中，TalkBack 也会在标签后朗读提示。当前在 Android 上无法关闭提示功能。

### `accessibilityLanguage` <div className="label ios">iOS</div>

通过 `accessibilityLanguage` 属性，屏幕阅读器可以识别阅读元素的**标签**、**值**和**提示**时应该使用的语言。传入的字符串必须符合 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

```tsx
<View
  accessible={true}
  accessibilityLabel="披萨"
  accessibilityLanguage="it-IT">
  <Text>🍕</Text>
</View>
```

### `accessibilityIgnoresInvertColors` <div className="label ios">iOS</div>

颜色反转是 iOS 和 iPadOS 为色盲、视力低下或视力受限用户提供的辅助功能。如果你不希望界面在启用该功能时反转某个视图（如照片），可以将此属性设置为 `true`。

### `accessibilityLiveRegion` <div className="label android">Android</div>

当组件动态变化时，希望 TalkBack 通知用户，这可通过 `accessibilityLiveRegion` 属性实现。该属性可以设置为 `none`、`polite` 和 `assertive`：

- **none**：辅助服务不应通报对此视图的更改。
- **polite**：辅助服务应在适当时通报视图更改。
- **assertive**：辅助服务应立即中断当前朗读并通报视图更改。

```tsx
<TouchableWithoutFeedback onPress={addOne}>
  <View style={styles.embedded}>
    <Text>点击我</Text>
  </View>
</TouchableWithoutFeedback>
<Text accessibilityLiveRegion="polite">
  点击次数 {count}
</Text>
```

在上述示例中，方法 `addOne` 修改状态变量 `count`，当 TouchableWithoutFeedback 被触发时，TalkBack 会朗读带有 `accessibilityLiveRegion="polite"` 属性的 Text 视图中的文本。

### `accessibilityRole`

`accessibilityRole` 用于向辅助技术用户传达组件的用途。

`accessibilityRole` 可以是以下之一：

- **adjustable** 用于可“调整”的元素（如滑块）。
- **alert** 用于包含需重点呈现给用户的文本的元素。
- **button** 用于作为按钮处理的元素。
- **checkbox** 用于表示可选中、取消选中或部分选中状态的复选框元素。
- **combobox** 用于表示允许用户从多个选项中选择的组合框元素。
- **header** 用于作为内容区域标题的元素（例如导航栏标题）。
- **image** 用于应被视为图像的元素。可与按钮或链接组合使用。
- **imagebutton** 用于同时作为图像和按钮的元素。
- **keyboardkey** 用于作为键盘按键的元素。
- **link** 用于作为链接的元素。
- **menu** 用于表示菜单选项组件。
- **menubar** 用于包含多个菜单的容器。
- **menuitem** 用于表示菜单中的项。
- **none** 用于没有角色的元素。
- **progressbar** 用于表示任务进度的组件。
- **radio** 用于表示单选按钮。
- **radiogroup** 用于表示单选按钮组。
- **scrollbar** 用于表示滚动条。
- **search** 用于应被视为搜索框的文本字段元素。
- **spinbutton** 用于表示打开选择列表的按钮。
- **summary** 用于提供应用首次启动时当前状态快速摘要的元素。
- **switch** 用于表示可开关的切换开关。
- **tab** 用于表示选项卡。
- **tablist** 用于表示选项卡列表。
- **text** 用于应被视为静态文本且不可更改的元素。
- **timer** 用于表示计时器。
- **togglebutton** 用于表示切换按钮。应配合 `accessibilityState` 的 `checked` 用以指示按钮是否已切换。
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 结合使用表示网格。为 Android 的 GridView 添加进出网格的提示。

### `accessibilityShowsLargeContentViewer` <div className="label ios">iOS</div>

布尔值，决定当用户长按该元素时是否显示大内容查看器。

iOS 13.0 及以上可用。

### `accessibilityLargeContentTitle` <div className="label ios">iOS</div>

字符串，用作大内容查看器显示时的标题。

需要同时将 `accessibilityShowsLargeContentViewer` 设置为 `true`。

```tsx
<View
  accessibilityShowsLargeContentViewer={true}
  accessibilityLargeContentTitle="主页标签">
  <Text>主页</Text>
</View>
```

### `accessibilityState`

描述组件当前状态，便于辅助技术用户理解。

`accessibilityState` 是一个对象。包含如下字段：

| 名称       | 描述                                                                                              | 类型               | 是否必需 |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------ | -------- |
| disabled   | 表示元素是否被禁用。                                                                              | boolean            | 否       |
| selected   | 表示可选元素当前是否被选中。                                                                      | boolean            | 否       |
| checked    | 表示可勾选元素的状态。可为布尔值或字符串 "mixed"（表示混合状态）。                                | boolean 或 'mixed' | 否       |
| busy       | 表示元素当前是否处于忙碌状态。                                                                    | boolean            | 否       |
| expanded   | 表示可展开元素当前是展开还是收起状态。                                                            | boolean            | 否       |

使用时，将 `accessibilityState` 设置为相应的对象。

### `accessibilityValue`

表示组件当前的值。可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），包含范围信息（最小值、当前值和最大值）。

`accessibilityValue` 是一个对象。包含如下字段：

| 名称 | 描述                                                                                | 类型    | 是否必需                     |
| ---- | ----------------------------------------------------------------------------------- | ------- | ---------------------------- |
| min  | 组件范围的最小值。                                                                  | integer | 若设置了 `now` 则必需        |
| max  | 组件范围的最大值。                                                                  | integer | 若设置了 `now` 则必需        |
| now  | 组件范围的当前值。                                                                  | integer | 否                           |
| text | 组件值的文本描述，设置后将覆盖 `min`、`now` 和 `max`。                             | string  | 否                           |

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器同级视图中的元素。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `accessibilityViewIsModal` 设置为 `true`，则 VoiceOver 会忽略视图 `A` 中的元素。但如果视图 `B` 包含子视图 `C`，即使对 `C` 设置 `accessibilityViewIsModal` 为 `true`，VoiceOver 仍不会忽略视图 `A` 中的元素。

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

布尔值，表示该辅助元素及其内部所有辅助元素是否隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `accessibilityElementsHidden` 设为 `true`，则 VoiceOver 会忽略视图 `B` 及其所有子元素。这类似于 Android 的属性 `importantForAccessibility="no-hide-descendants"`。

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。

### `aria-valuetext`

表示组件的文本描述。

### `aria-busy`

表示元素正在被修改，辅助技术可能需等待更新完成后才通知用户。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-checked`

表示可勾选元素的状态。可为布尔值或字符串 "mixed"（表示混合状态）。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

### `aria-disabled`

表示元素可感知但已禁用，无法编辑或操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-expanded`

表示可展开元素当前是展开还是收起状态。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-hidden`

表示元素是否对辅助技术隐藏。

例如，在包含同级视图 `A` 和 `B` 的窗口中，将视图 `B` 的 `aria-hidden` 设为 `true`，则 VoiceOver 会忽略视图 `B` 及其子元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-label`

定义用于命名元素的字符串值。

| 类型   |
| ------ |
| string |

### `aria-labelledby` <div className="label android">Android</div>

标识为当前元素提供标签的元素。`aria-labelledby` 的值应匹配相关元素的 [`nativeID`](view.md#nativeid)：

```tsx
<View>
  <Text nativeID="formLabel">输入框标签</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```

| 类型   |
| ------ |
| string |

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可预期的更新类型。

- **off**：辅助服务不应通报对此视图的更改。
- **polite**：辅助服务应适时通报对此视图的更改。
- **assertive**：辅助服务应立即中断当前朗读，通报对此视图的更改。

| 类型                                       | 默认值 |
| ------------------------------------------ | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器同级视图中的元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-selected`

指示可选元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `experimental_accessibilityOrder`

<ExperimentalAPIWarning />

:::note
为了简洁，以下示例均未包含布局，尽管布局决定了默认聚焦顺序。假设文档顺序符合布局顺序。
:::

`experimental_accessibilityOrder` 允许你定义辅助技术聚焦子组件的顺序。它是一个包含设置在组件上的 [`nativeIDs`](view.md#nativeid) 的数组。例如：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
</View>
```

辅助技术将依次聚焦 `nativeID` 为 `B`、`C`、`A` 的视图。

`experimental_accessibilityOrder` 不会为其引用的组件开启可访问性，如果尚未开启，仍需手动设置。因此，如果我们将上述示例中的 `C` 移除 `accessible={true}`：

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View nativeID="C"/>
</View>
```

新的聚焦顺序将变为 `B`，然后 `A`，尽管 `C` 仍在数组中。

但是，`experimental_accessibilityOrder` 会自动关闭不在其引用列表中的组件的可访问性。

```
<View experimental_accessibilityOrder={['B', 'C', 'A']}>
  <View accessible={true} nativeID="A"/>
  <View accessible={true} nativeID="B"/>
  <View accessible={true} nativeID="C"/>
  <View accessible={true} nativeID="D"/>
</View>
```

上述示例中的顺序为 `B`、`C`、`A`，`D` 永远不会被聚焦。因此，`experimental_accessibilityOrder` 是_详尽_的。

包含不可访问组件在 `experimental_accessibilityOrder` 中依然有合理用途。例如：

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

聚焦顺序将是 `B`，然后依次为 `D`、`E`、`F`，最后 `A`。尽管 `D`、`E` 和 `F` 未直接列在 `experimental_accessibilityOrder` 中，但 `C` 被直接引用了。此时，`C` 是一个_辅助功能容器_——它包含可访问元素但自身不可访问。若辅助容器被引用，则其内部元素使用默认顺序。因此，`experimental_accessibilityOrder` 是_可嵌套_的。

`experimental_accessibilityOrder` 还能引用另一个带有 `experimental_accessibilityOrder` 的组件：

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

聚焦顺序将是 `B`、`F`、`E`、`D`、`A`。

组件不能同时是辅助功能容器和辅助功能元素（`accessible={true}`）。因此：

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

此时聚焦顺序为 `B`，`C`，`A`。`D`、`E`、`F` 不再被视为容器内元素，详尽规则导致它们被排除。

### `importantForAccessibility` <div className="label android">Android</div>

当两个重叠的 UI 组件具有相同父级时，默认的辅助焦点行为可能不可预测。`importantForAccessibility` 属性用于控制视图是否触发辅助事件及是否被辅助服务报告。其取值可为 `auto`、`yes`、`no` 和 `no-hide-descendants`（最后一种会强制辅助服务忽略该组件及其所有子组件）。

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

上述示例中，黄色布局及其子孙对 TalkBack 和其他辅助服务完全不可见。如此可以在同父级中使用重叠视图而不会令 TalkBack 混乱。

### `onAccessibilityEscape` <div className="label ios">iOS</div>

为该属性指定自定义函数，当用户执行“逃离”手势（两指 Z 形）时调用。逃离动作应层级返回到上一级界面，例如在导航堆栈后退或关闭模态界面。如果选中的元素无此函数，系统会沿视图层级向上查找，若无则播放提示音。

### `onAccessibilityTap` <div className="label ios">iOS</div>

为该属性指定自定义函数，当用户双击选中元素时调用。

### `onMagicTap` <div className="label ios">iOS</div>

为该属性指定自定义函数，当用户执行“两指双击”魔术手势时调用。魔术手势应执行组件最相关的操作。例如 iPhone 电话应用中，魔术手势能接听或结束电话。如果当前元素无此函数，系统会沿视图层级向上查找。

### `role`

`role` 用于传达组件的用途，优先于 [`accessibilityRole`](accessibility#accessibilityrole) 属性。

`role` 可为以下取值：

- **alert** 用于包含需重点呈现给用户的文本的元素。
- **button** 用于作为按钮处理的元素。
- **checkbox** 用于表示可选中、取消选中或部分选中状态的复选框。
- **combobox** 用于表示允许用户从多个选项中选择的组合框。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 结合使用表示网格。为 Android 的 GridView 添加进出网格的提示。
- **heading** 用于作为内容区域标题的元素（例如导航栏标题）。
- **img** 用于应被视为图像的元素。可与按钮或链接组合使用。
- **link** 用于作为链接的元素。
- **list** 用于标识列表。
- **listitem** 用于标识列表中的项。
- **menu** 用于表示菜单选项组件。
- **menubar** 用于包含多个菜单的容器。
- **menuitem** 用于表示菜单中的项。
- **none** 用于没有角色的元素。
- **presentation** 用于没有角色的元素。
- **progressbar** 用于表示任务进度的组件。
- **radio** 用于表示单选按钮。
- **radiogroup** 用于表示单选按钮组。
- **scrollbar** 用于表示滚动条。
- **searchbox** 用于应被视为搜索框的文本字段。
- **slider** 用于可“调整”的元素（如滑块）。
- **spinbutton** 用于表示打开选择列表的按钮。
- **summary** 用于提供应用首次启动时当前状态快速摘要的元素。
- **switch** 用于表示可开关的切换开关。
- **tab** 用于表示选项卡。
- **tablist** 用于表示选项卡列表。
- **timer** 用于表示计时器。
- **toolbar** 用于表示工具栏（操作按钮或组件的容器）。

## 辅助功能操作（Accessibility Actions）

辅助功能操作允许辅助技术以编程方式调用组件的动作。组件须满足两条件以支持辅助功能操作：

- 通过 `accessibilityActions` 属性定义支持的操作列表。
- 实现 `onAccessibilityAction` 函数，以处理操作请求。

`accessibilityActions` 属性应包含动作对象列表。每个动作对象包含以下字段：

| 名称  | 类型   | 是否必需 |
| ----- | ------ | -------- |
| name  | string | 是       |
| label | string | 否       |

动作可以是标准动作（如点击按钮、调整滑块）或特定组件的自定义动作（如删除邮件）。`name` 字段对标准和自定义动作均必需，`label` 对标准动作可选。

支持的标准动作 `name` 包括：

- `'magicTap'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户用两根手指双击。
- `'escape'` - 仅限 iOS - 当 VoiceOver 焦点位于组件上或组件内部时，用户执行两指扫动手势（左、右、左）。
- `'activate'` - 激活组件。无论是否使用辅助技术，都应执行相同操作。屏幕阅读器用户双击组件时触发。
- `'increment'` - 增加可调组件的值。在 iOS 上，当组件的角色为 `'adjustable'`，且用户将焦点置于其上并向上滑动时，VoiceOver 会生成此操作。在 Android 上，TalkBack 8.1 及以下版本中，当用户聚焦该组件并按下音量加按钮时会生成此操作；在 TalkBack 9.1 及以上版本中，该操作已被“调整阅读控制”手势替代（在聚焦的控件上向上滑动）。
- `'decrement'` - 减少可调组件的值。在 iOS 上，当组件的角色为 `'adjustable'`，且用户将焦点置于其上并向下滑动时，VoiceOver 会生成此操作。在 Android 上，TalkBack 8.2 及以下版本中，当用户聚焦该组件并按下音量减按钮时会生成此操作；在 TalkBack 9.2 及以上版本中，该操作已被“调整阅读控制”手势替代（在聚焦的控件上向下滑动）。
- `'longpress'` - 仅限 Android - 当用户将辅助功能焦点置于组件上，然后双击并按住屏幕上的一根手指时会生成此操作。无论是否使用辅助技术，都应执行相同操作。
- `'expand'` - 仅限 Android - 该操作会“展开”组件，使 TalkBack 播报“已展开”的提示。
- `'collapse'` - 仅限 Android - 该操作会“折叠”组件，使 TalkBack 播报“已折叠”的提示。

`label` 字段对标准动作是可选的，用于辅助技术描述某个动作的具体结果。例如，TalkBack 使用此字段覆盖默认的“轻点两下即可激活”提示，改为自定义描述，例如“轻点两下即可打开聊天”。对于自定义动作，`label` 是包含动作说明的本地化字符串，会展示给用户。

组件要处理操作请求，需实现 `onAccessibilityAction` 函数。函数接收一个事件参数，包含要执行的操作名称。以下示例来自 RNTester，展示了如何定义与处理多个自定义动作：

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
        Alert.alert('提示', '剪切成功');
        break;
      case 'copy':
        Alert.alert('提示', '复制成功');
        break;
      case 'paste':
        Alert.alert('提示', '粘贴成功');
        break;
    }
  }}
/>
```

## 检测屏幕阅读器是否启用

`AccessibilityInfo` API 允许你检测屏幕阅读器当前是否处于激活状态。详见 [AccessibilityInfo 文档](accessibilityinfo)。

## 发送辅助功能事件 <div className="label android">Android</div>

有时需要向 UI 组件触发辅助功能事件（如自定义视图出现在屏幕上，或将辅助焦点设置到视图）。原生 UIManager 模块提供方法 `sendAccessibilityEvent`。该方法接受两个参数：视图标签和事件类型。支持的事件类型有 `typeWindowStateChanged`、`typeViewFocused` 和 `typeViewClicked`。

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

启用 TalkBack，请打开 Android 设备或模拟器上的设置应用，依次点击 辅助功能 → TalkBack，切换“使用服务”开关。

Android 模拟器默认未安装 TalkBack。你可以通过 Google Play 商店安装 TalkBack。确保选择预装 Google Play 商店的模拟器（Android Studio 提供此类模拟器）。

可使用音量键快捷键切换 TalkBack。启用方法：进入设置应用，点击辅助功能，在顶部打开音量键快捷键。

使用时，长按同时按住两个音量键 3 秒即可启动辅助工具。

你也可以通过命令行切换 TalkBack：

```shell
# 禁用
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# 启用
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback.TalkBackService
```

## 测试 VoiceOver 支持 <div className="label ios">iOS</div>

要启用 iOS 或 iPadOS 设备上的 VoiceOver，请打开“设置”应用，点击“通用”，再点击“辅助功能”。这里提供多种辅助工具，包括 VoiceOver。点击“视图”下的 VoiceOver，然后切换顶部的开关开启。

在辅助功能设置最底部，有“辅助功能快捷键”，你可使用三击主屏按钮快速切换 VoiceOver。

模拟器不支持 VoiceOver，但你可以通过 Xcode 的 Accessibility Inspector 使用 macOS 上的 VoiceOver。建议在真机上测试，因为 macOS VoiceOver 体验可能与设备上有所差异。

## 其他资源

- [制作 React Native 应用的辅助功能](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
