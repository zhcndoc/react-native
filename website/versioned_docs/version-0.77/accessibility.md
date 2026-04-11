---
id: accessibility
title: 无障碍
description: 使用 React Native 专为 Android 和 iOS 设计的一套 API，创建可被辅助技术访问的移动应用。
---

Android 和 iOS 都提供了 API，用于将应用与辅助技术（如捆绑的屏幕阅读器 VoiceOver (iOS) 和 TalkBack (Android)）集成。React Native 拥有互补的 API，让您的应用能够适应所有用户。

:::info
Android 和 iOS 的方法略有不同，因此 React Native 的实现可能因平台而异。
:::

## 无障碍属性

### `accessible`

当为 `true` 时，表示该视图是一个无障碍元素。当视图是无障碍元素时，它将其子元素分组为单个可选择组件。默认情况下，所有可触摸元素都是可访问的。

在 Android 上，react-native View 的 `accessible={true}` 属性将被转换为原生的 `focusable={true}`。

```tsx
<View accessible={true}>
  <Text>text one</Text>
  <Text>text two</Text>
</View>
```

在上面的示例中，无障碍焦点仅可用于具有 `accessible` 属性的父视图，而不能单独用于 'text one' 和 'text two'。

### `accessibilityLabel`

当视图标记为可访问时，最好在视图上设置 `accessibilityLabel`，以便使用 VoiceOver 或 TalkBack 的用户知道他们选择了什么元素。当选择关联元素时，屏幕阅读器将口头表达此字符串。

要使用，请在您的 View、Text 或 Touchable 上将 `accessibilityLabel` 属性设置为自定义字符串：

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

在上面的示例中，TouchableOpacity 元素上的 `accessibilityLabel` 默认为"Press me!"。该标签是通过连接所有用空格分隔的 Text 节点子项构建的。

### `accessibilityLabelledBy` <div className="label android">Android</div>

引用另一个元素 [nativeID](view.md#nativeid) 用于构建复杂表单。
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

在上面的示例中，当聚焦于 TextInput 时，屏幕阅读器会宣布“输入，用于输入字段标签的编辑框”。

### `accessibilityHint`

当仅凭无障碍标签不清楚操作结果时，无障碍提示可用于向用户提供有关操作结果的附加上下文。

在您的 View、Text 或 Touchable 上为 `accessibilityHint` 属性提供自定义字符串：

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

在上面的示例中，如果用户在设备的 VoiceOver 设置中启用了提示，VoiceOver 将在标签之后读取提示。在 [iOS 开发者文档](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint) 中阅读有关 `accessibilityHint` 指南的更多信息。

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

反转屏幕颜色是 iOS 和 iPadOS 中为色盲、低视力或视力障碍人士提供的无障碍功能。如果在此设置开启时您不希望反转某个视图（可能是照片），请将此属性设置为 `true`。

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

在上面的示例中，方法 `addOne` 更改状态变量 `count`。当触发 TouchableWithoutFeedback 时，由于其 `accessibilityLiveRegion="polite"` 属性，TalkBack 会读取 Text 视图中的文本。

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
- **menuitem** 用于代表菜单中的项。
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
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用以代表网格。将网格进出公告添加到 Android 的 GridView 中。

### `accessibilityShowsLargeContentViewer` <div className="label ios">iOS</div>

一个布尔值，确定当用户对元素执行长按时是否显示大内容查看器。

在 iOS 13.0 及更高版本中可用。

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

| 名称     | 描述                                                                                                                           | 类型               | 必填 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- |
| disabled | 指示元素是否被禁用。                                                                                     | boolean            | 否       |
| selected | 指示可选择元素当前是否被选中。                                                                  | boolean            | 否       |
| checked  | 指示可检查元素的状态。此字段可以采用布尔值或"mixed"字符串来表示混合复选框。 | boolean or 'mixed' | 否       |
| busy     | 指示元素当前是否忙碌。                                                                                | boolean            | 否       |
| expanded | 指示可展开元素当前是展开还是折叠。                                                           | boolean            | 否       |

要使用，请将 `accessibilityState` 设置为具有特定定义的对象。

### `accessibilityValue`

表示组件的当前值。它可以是组件值的文本描述，或者对于基于范围的组件（如滑块和进度条），它包含范围信息（最小值、当前值和最大值）。

`accessibilityValue` 是一个对象。它包含以下字段：

| 名称 | 描述                                                                                    | 类型    | 必填                  |
| ---- | ---------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| min  | 此组件范围的最小值。                                                   | integer | 如果设置了 `now` 则必填。 |
| max  | 此组件范围的最大值。                                                   | integer | 如果设置了 `now` 则必填。 |
| now  | 此组件范围的当前值。                                                   | integer | 否                        |
| text | 此组件值的文本描述。如果设置，将覆盖 `min`、`now` 和 `max`。 | string  | 否                        |

### `accessibilityViewIsModal` <div className="label ios">iOS</div>

一个布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `accessibilityViewIsModal` 设置为 `true` 会导致 VoiceOver 忽略视图 `A` 中的元素。另一方面，如果视图 `B` 包含子视图 `C` 并且您在视图 `C` 上将 `accessibilityViewIsModal` 设置为 `true`，VoiceOver 不会忽略视图 `A` 中的元素。

### `accessibilityElementsHidden` <div className="label ios">iOS</div>

一个布尔值，指示此无障碍元素内包含的无障碍元素是否隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `accessibilityElementsHidden` 设置为 `true` 会导致 VoiceOver 忽略视图 `B` 中的元素。这类似于 Android 属性 `importantForAccessibility="no-hide-descendants"`。

### `aria-valuemax`

表示基于范围的组件（如滑块和进度条）的最大值。

### `aria-valuemin`

表示基于范围的组件（如滑块和进度条）的最小值。

### `aria-valuenow`

表示基于范围的组件（如滑块和进度条）的当前值。

### `aria-valuetext`

表示组件的文本描述。

### `aria-busy`

指示元素正在被修改，辅助技术可能希望等待更改完成后再通知用户更新。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-checked`

指示可检查元素的状态。此字段可以采用布尔值或"mixed"字符串来表示混合复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

### `aria-disabled`

指示元素是可感知但已禁用的，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-expanded`

指示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-hidden`

指示此无障碍元素内包含的无障碍元素是否隐藏。

例如，在包含兄弟视图 `A` 和 `B` 的窗口中，在视图 `B` 上将 `aria-hidden` 设置为 `true` 会导致 VoiceOver 忽略视图 `B` 中的元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-label`

定义标记交互式元素的字符串值。

| 类型   |
| ------ |
| string |

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
| string |

### `aria-live` <div className="label android">Android</div>

指示元素将被更新，并描述用户代理、辅助技术和用户可以从活动区域预期的更新类型。

- **off** 无障碍服务不应宣布对此视图的更改。
- **polite** 无障碍服务应宣布对此视图的更改。
- **assertive** 无障碍服务应中断正在进行的语音，立即宣布对此视图的更改。

| 类型                                     | 默认值 |
| ---------------------------------------- | ------- |
| enum(`'assertive'`, `'off'`, `'polite'`) | `'off'` |

---

### `aria-modal` <div className="label ios">iOS</div>

布尔值，指示 VoiceOver 是否应忽略接收器兄弟视图内的元素。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

### `aria-selected`

指示可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `importantForAccessibility` <div className="label android">Android</div>

在具有相同父级的两个重叠 UI 组件的情况下，默认无障碍焦点可能具有不可预测的行为。`importantForAccessibility` 属性将通过控制视图是否触发无障碍事件以及是否报告给无障碍服务来解决此问题。它可以设置为 `auto`、`yes`、`no` 和 `no-hide-descendants`（最后一个值将强制无障碍服务忽略组件及其所有子项）。

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

在上面的示例中，`yellow` 布局及其后代对 TalkBack 和所有其他无障碍服务完全不可见。因此，我们可以使用具有相同父级的重叠视图而不会混淆 TalkBack。

### `onAccessibilityEscape` <div className="label ios">iOS</div>

将此属性分配给自定义函数，当有人执行"escape"手势（即双指 Z 形手势）时将调用该函数。转义函数应在用户界面中分层向后移动。这可能意味着在导航层次结构中向上或向后移动，或关闭模态用户界面。如果所选元素没有 `onAccessibilityEscape` 函数，系统将尝试遍历视图层次结构，直到找到具有该函数的视图，或者发出提示音表示无法找到。

### `onAccessibilityTap` <div className="label ios">iOS</div>

使用此属性分配自定义函数，当有人通过双击选中的可访问元素激活它时将调用该函数。

### `onMagicTap` <div className="label ios">iOS</div>

将此属性分配给自定义函数，当有人执行"magic tap"手势（即双指双击）时将调用该函数。magic tap 函数应执行用户可以在组件上采取的最相关操作。在 iPhone 上的电话应用中，magic tap 会接听电话或结束当前通话。如果所选元素没有 `onMagicTap` 函数，系统将遍历视图层次结构，直到找到具有该函数的视图。

### `role`

`role` 传达组件的目的，并优先于 [`accessibilityRole`](accessibility#accessibilityrole) 属性。

`role` 可以是以下之一：

- **alert** 当元素包含要呈现给用户的重要文本时使用。
- **button** 当元素应被视为按钮时使用。
- **checkbox** 当元素代表可以选中、取消选中或具有混合选中状态的复选框时使用。
- **combobox** 当元素代表组合框时使用，允许用户在几个选项中进行选择。
- **grid** 与 ScrollView、VirtualizedList、FlatList 或 SectionList 一起使用以代表网格。将网格进出公告添加到 Android 的 GridView 中。
- **heading** 当元素充当内容部分的标题时使用（例如导航栏的标题）。
- **img** 当元素应被视为图像时使用。例如，可以与按钮或链接组合。
- **link** 当元素应被视为链接时使用。
- **list** 用于标识项目列表。
- **listitem** 用于标识列表中的项。
- **menu** 当组件是选项菜单时使用。
- **menubar** 当组件是多个菜单的容器时使用。
- **menuitem** 用于代表菜单中的项。
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

无障碍操作允许辅助技术以编程方式调用组件的操作。要支持无障碍操作，组件必须做两件事：

- 通过 `accessibilityActions` 属性定义它支持的操作列表。
- 实现一个 `onAccessibilityAction` 函数来处理操作请求。

`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含以下字段：

| 名称  | 类型   | 必填 |
| ----- | ------ | -------- |
| name  | string | 是      |
| label | string | 否       |

操作要么代表标准操作，例如点击按钮或调整滑块，要么代表特定于给定组件的自定义操作，例如删除电子邮件消息。`name` 字段对于标准操作和自定义操作都是必需的，但 `label` 对于标准操作是可选的。

添加对标准操作的支持时，`name` 必须是以下之一：

- `'magicTap'` - 仅限 iOS - 当 VoiceOver 焦点在组件上或组件内时，用户用两根手指双击。
- `'escape'` - 仅限 iOS - 当 VoiceOver 焦点在组件上或组件内时，用户执行了两指擦除手势（左、右、左）。
- `'activate'` - 激活组件。无论是否有辅助技术，这都应执行相同的操作。当屏幕阅读器用户双击组件时触发。
- `'increment'` - 增加可调整组件的值。在 iOS 上，当组件具有 `'adjustable'` 角色且用户将焦点放在其上并向上滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将无障碍焦点放在组件上并按音量增加按钮时，TalkBack 会生成此操作。
- `'decrement'` - 减少可调整组件的值。在 iOS 上，当组件具有 `'adjustable'` 角色且用户将焦点放在其上并向下滑动时，VoiceOver 会生成此操作。在 Android 上，当用户将无障碍焦点放在组件上并按音量减少按钮时，TalkBack 会生成此操作。
- `'longpress'` - 仅限 Android - 当用户将无障碍焦点放在组件上，然后双击并按住一根手指在屏幕上时生成此操作。无论是否有辅助技术，这都应执行相同的操作。

`label` 字段对于标准操作是可选的，辅助技术通常不使用它。对于自定义操作，它是一个本地化字符串，包含要向用户展示的操作描述。

要处理操作请求，组件必须实现一个 `onAccessibilityAction` 函数。此函数的唯一参数是一个包含要执行的操作名称的事件。下面来自 RNTester 的示例展示了如何创建定义和处理几个自定义操作的组件。

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

`AccessibilityInfo` API 允许你确定屏幕阅读器当前是否处于活动状态。详见 [AccessibilityInfo 文档](accessibilityinfo)。

## 发送无障碍事件 <div className="label android">Android</div>

有时触发 UI 组件上的无障碍事件很有用（即当自定义视图出现在屏幕上或将无障碍焦点设置到视图时）。原生 UIManager 模块为此公开了一个方法 'sendAccessibilityEvent'。它接受两个参数：一个视图标签和一个事件类型。支持的事件类型是 `typeWindowStateChanged`、`typeViewFocused` 和 `typeViewClicked`。

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

要启用 TalkBack，请进入 Android 设备或模拟器上的设置应用。点击无障碍，然后点击 TalkBack。切换“使用服务”开关以启用或禁用它。

Android 模拟器默认没有安装 TalkBack。你可以通过 Google Play 商店在模拟器上安装 TalkBack。确保选择一个安装了 Google Play 商店的模拟器。这些可在 Android Studio 中找到。

你可以使用音量键快捷方式来切换 TalkBack。要开启音量键快捷方式，请进入设置应用，然后无障碍。在顶部，开启音量键快捷方式。

要使用音量键快捷方式，同时按下两个音量键 3 秒钟以启动无障碍工具。

此外，如果你愿意，可以通过命令行使用以下命令切换 TalkBack：

```shell
# 禁用
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# 启用
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

## 测试 VoiceOver 支持 <div className="label ios">iOS</div>

要在 iOS 或 iPadOS 设备上启用 VoiceOver，请进入设置应用，点击通用，然后无障碍。在那里你会发现许多工具可供人们启用他们的设备以更可用，包括 VoiceOver。要启用 VoiceOver，点击“视觉”下的 VoiceOver 并切换顶部出现的开关。

在无障碍设置的最底部，有一个“无障碍快捷方式”。你可以使用它通过三击主屏幕按钮来切换 VoiceOver。

VoiceOver 无法通过模拟器使用，但你可以使用 Xcode 的 Accessibility Inspector 通过应用程序使用 macOS VoiceOver。注意，最好始终使用设备进行测试，因为 macOS 的 VoiceOver 可能会导致体验不同。

## 其他资源

- [使 React Native 应用无障碍](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
