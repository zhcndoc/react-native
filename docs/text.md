---
id: text
title: 文本
---

用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本会从 `styles.baseText` 继承 `fontFamily`，但标题会提供自己额外的样式。由于字面换行符的存在，标题和正文会垂直堆叠：

```SnackPlayer name=Text%20Function%20Component%20Example
import {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInANest = () => {
  const [titleText, setTitleText] = useState("Bird's Nest");
  const bodyText = '这其实并不是一个鸟巢。';

  const onPressTitle = () => {
    setTitleText("Bird's Nest [pressed]");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.baseText}>
          <Text style={styles.titleText} onPress={onPressTitle}>
            {titleText}
            {'\n'}
            {'\n'}
          </Text>
          <Text numberOfLines={5}>{bodyText}</Text>
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TextInANest;
```

## 嵌套文本

Android 和 iOS 都允许你通过为字符串中的特定范围标注特定格式（如粗体或彩色文本）来显示格式化文本（iOS 上是 `NSAttributedString`，Android 上是 `SpannableString`）。实际上，这非常繁琐。对于 React Native，我们决定采用 Web 的范式：你可以通过嵌套文本来实现相同的效果。

```SnackPlayer name=Nested%20Text%20Example
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const BoldAndBeautiful = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.baseText}>
        我很粗体
        <Text style={styles.innerText}> 并且是红色</Text>
      </Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    fontWeight: 'bold',
  },
  innerText: {
    color: 'red',
  },
});

export default BoldAndBeautiful;
```

在底层，React Native 会将其转换为一个扁平的 `NSAttributedString` 或 `SpannableString`，其中包含以下信息：

```
"I am bold and red"
0-9: bold
9-17: bold, red
```

## 容器

与布局相关时，`<Text>` 元素是独特的：其内部的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 内的元素不再是矩形，而是在到达行尾时自动换行。

```tsx
<Text>
  <Text>First part and </Text>
  <Text>second part</Text>
</Text>
// 文本容器：如果空间允许，文本会以内联方式显示
// |First part and second part|

// 否则，文本会像一个整体那样流动
// |First part |
// |and second |
// |part       |

<View>
  <Text>First part and </Text>
  <Text>second part</Text>
</View>
// View 容器：每段文本都是自己的块
// |First part and|
// |second part   |

// 否则，文本会在自己的块中流动
// |First part |
// |and        |
// |second part|
```

## 有限的样式继承

在 Web 上，为整个文档设置字体族和字号的常见方式，是利用继承的 CSS 属性，例如：

```css
html {
  font-family:
    'lucida grande', tahoma, verdana, arial, sans-serif;
  font-size: 11px;
  color: #141823;
}
```

文档中的所有元素都会继承这个字体，除非它们或其某个父级指定了新的规则。

在 React Native 中，我们对此更加严格：**你必须将所有文本节点包裹在 `<Text>` 组件内**。不能在 `<View>` 下直接放置文本节点。

```tsx
// 错误：会抛出异常，`<View>` 不能直接包含文本节点作为子元素
<View>
  Some text
</View>

// 正确
<View>
  <Text>
    Some text
  </Text>
</View>
```

你也会失去为整个子树设置默认字体的能力。与此同时，`fontFamily` 只接受单个字体名称，这与 CSS 中的 `font-family` 不同。在应用中保持字体和字号一致的推荐方式，是创建一个包含这些样式的组件 `MyAppText`，并在整个应用中使用它。你也可以基于这个组件创建更具体的组件，比如 `MyAppHeaderText`，用于其他类型的文本。

```tsx
<View>
  <MyAppText>
    使用应用程序整个默认字体样式的文本
  </MyAppText>
  <MyAppHeaderText>作为标题样式的文本</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个组件，它只会把自身的子元素以带样式的 `Text` 组件形式渲染出来，那么 `MyAppHeaderText` 可以这样定义：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

以这种方式组合 `MyAppText` 可以确保我们从顶层组件获得样式，同时仍然保留在特定使用场景中添加/覆盖样式的能力。

React Native 仍然具有样式继承的概念，但仅限于文本子树。在这种情况下，第二部分会同时加粗并显示为红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们认为，这种更受约束的文本样式设置方式会带来更好的应用：

-（开发者）React 组件在设计上强调强隔离：你应该能够把一个组件放到应用中的任何位置，并相信只要 props 相同，它的外观和行为就会保持一致。那些可能从 props 外部继承的文本属性会破坏这种隔离性。

-（实现者）React Native 的实现也更简单了。我们不需要在每一个元素上都设置 `fontFamily` 字段，也不需要在每次显示文本节点时都潜在地遍历树一直到根节点。样式继承只会编码在原生 Text 组件内部，不会泄漏到其他组件或系统本身。

---

# 参考

## 属性

### `accessibilityHint`

无障碍提示可以帮助用户理解在无障碍元素上执行操作时会发生什么，尤其是在从无障碍标签中无法清楚看出结果时。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，用于指示用户与该元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与该元素交互时读取的文本。默认情况下，标签会通过遍历所有子元素并累积所有由空格分隔的 `Text` 节点来构建。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告诉屏幕阅读器将当前聚焦的元素视为具有特定角色。

在 iOS 上，这些角色会映射到对应的无障碍特征。Image button 的功能与同时设置为 `image` 和 `button` 特征时相同。更多信息请参见 [无障碍指南](accessibility.md#accessibilitytraits-ios)。

在 Android 上，这些角色在 TalkBack 上的作用与在 iOS 的 VoiceOver 上添加无障碍特征类似

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告诉屏幕阅读器将当前聚焦的元素视为处于某种特定状态。

你可以提供一个状态、不提供状态，或者提供多个状态。状态必须通过对象传入，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含字段名称和标签。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  | 必需 |
| ----- | ---- |
| array | 否   |

---

### `onAccessibilityAction`

当用户执行无障碍操作时触发。此函数唯一的参数是一个包含要执行操作名称的事件。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     | 必需 |
| -------- | ---- |
| function | 否   |

---

### `accessible`

设置为 `true` 时，表示该视图是一个无障碍元素。

更多信息请参见 [无障碍指南](accessibility#accessible-ios-android)。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `true`  |

---

### `adjustsFontSizeToFit`

指定字体是否应自动缩小以适应给定的样式约束。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

---

### `allowFontScaling`

指定字体是否应缩放以遵守文本大小无障碍设置。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `true` |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API Level 23+ 上确定单词断行时自动连字符的使用频率。

| 类型                                | 默认值  |
| ----------------------------------- | ------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等到更改完成后再向用户通报更新。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | false   |

---

### `aria-checked`

表示可勾选元素的状态。该字段可以接收布尔值或 `"mixed"` 字符串来表示混合状态的复选框。

| 类型             | 默认值 |
| ---------------- | ------ |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可感知但已禁用，因此不可编辑或以其他方式操作。

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

### `aria-label`

定义用于标识交互元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-selected`

表示可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `dataDetectorType` <div className="label android">Android</div>

确定在文本元素中被转换为可点击 URL 的数据类型。默认情况下，不检测任何数据类型。

你只能提供一种类型。

| 类型                                                          | 默认值  |
| ------------------------------------------------------------- | ------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

用于测试目的，指定文本视图的禁用状态。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

要在 iOS 上应用于该元素的 [Dynamic Type](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 级别。

| 类型                                                                                                                                                     | 默认值  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

当设置了 `numberOfLines` 时，此属性定义文本将如何截断。`numberOfLines` 必须与此属性一起设置。

可选值如下：

- `head` - 显示该行时，使末尾部分适配容器，并用省略号字符指示行首缺失的文本。例如：`"...wxyz"`
- `middle` - 显示该行时，使开头和结尾适配容器，并用省略号字符指示中间缺失的文本。`"ab...yz"`
- `tail` - 显示该行时，使开头部分适配容器，并用省略号字符指示行尾缺失的文本。例如：`"abcd..."`
- `clip` - 文本行不会绘制到文本容器边缘之外。

:::note
在 Android 上，当 `numberOfLines` 被设置为大于 `1` 的值时，只有 `tail` 值才能正常工作。
:::

| 类型                                           | 默认值 |
| ---------------------------------------------- | ------ |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码中定位此视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定在启用 `allowFontScaling` 时字体能够达到的最大缩放比例。可选值：

- `null/undefined`：继承自父节点或全局默认值（0）
- `0`：无限制，忽略父级/全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为该值

| 类型   | 默认值     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定在启用 `adjustsFontSizeToFit` 时字体能够达到的最小缩放比例。（取值 0.01-1.0）。

| 类型   |
| ------ |
| number |

---

### `nativeID`

用于从原生代码中定位此视图。

| 类型   |
| ------ |
| string |

---

### `numberOfLines`

在计算文本布局（包括自动换行）后，使用省略号截断文本，使总行数不超过此数值。将该属性设为 `0` 会取消该值，这意味着不会应用行数限制。

此属性通常与 `ellipsizeMode` 一起使用。

| 类型   | 默认值 |
| ------ | ------ |
| number | `0`     |

---

### `onLayout`

在挂载时以及布局变化时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

长按时调用此函数。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onMoveShouldSetResponder`

这个视图是否希望“抢占”触摸响应？当 `View` 不是 responder 时，每次触摸移动都会调用此方法。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onPress`

用户按下时调用的函数，在 `onPressOut` 之后触发。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressIn`

触摸刚接触时立即调用，在 `onPressOut` 和 `onPress` 之前。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

触摸释放时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderGrant`

`View` 现在正在响应触摸事件。这是高亮显示并向用户展示正在发生什么的时机。

在 Android 上，从此回调中返回 `true` 可阻止任何其他原生组件在该 responder 结束之前成为 responder。

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

### `onResponderRelease`

在触摸结束时触发。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminate`

responder 已从 `View` 中被移除。它可能是在调用 `onResponderTerminationRequest` 后被其他视图接管，也可能在未请求的情况下被操作系统接管（例如：iOS 上控制中心/通知中心会发生这种情况）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

某个其他 `View` 想要成为 responder，并请求此 `View` 释放其 responder。返回 `true` 允许其释放。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父级 `View` 想在触摸开始时阻止子级 `View` 成为 responder，就应使用此处理函数，并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onTextLayout`

在 Text 布局发生变化时触发。

| 类型                                                 |
| ---------------------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图被禁用时，此属性定义在按钮失活之前，触摸可以离开按钮多远。按钮失活后，尝试把手指移回去，你会看到按钮再次被激活！在滚动视图被禁用时，来回移动几次。确保传入一个常量以减少内存分配。

| 类型                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

在挂载时会被赋值为一个 [element node](element-nodes) 的 ref setter。

请注意，`Text` 组件不会提供文本节点，就像 Web 上的段落元素（`<p>`）是元素节点而不是文本节点一样。文本节点可以在它们的子节点中找到。

---

### `role`

`role` 会将组件的用途传达给辅助技术用户。其优先级高于 [`accessibilityRole`](text#accessibilityrole) 属性。

| 类型                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `selectable`

允许用户选择文本，以使用原生复制和粘贴功能。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

---

### `selectionColor` <div className="label android">Android</div>

文本的高亮颜色。

| 类型            |
| --------------- |
| [color](colors) |

---

### `style`

| 类型                                                                 |
| -------------------------------------------------------------------- |
| [Text Style](text-style-props), [View Style Props](view-style-props) |

---

### `suppressHighlighting` <div className="label ios">iOS</div>

当为 `true` 时，按下文本时不会产生任何视觉变化。默认情况下，文本按下时会以灰色椭圆高亮显示。

| 类型    | 默认值 |
| ------- | ------ |
| boolean | `false` |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   |
| ------ |
| string |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API Level 23+ 上设置文本断行策略，可选值为 `simple`、`highQuality`、`balanced`。

| 类型                                            | 默认值       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14+ 上设置断行策略。可选值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值  |
| ----------------------------------------------------------- | ------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

## 类型定义

### TextLayout

`TextLayout` 对象是 [`TextLayoutEvent`](text#textlayoutevent) 回调的一部分，并包含 `Text` 行的测量数据。

#### 示例

```js
{
    capHeight: 10.496,
    ascender: 14.624,
    descender: 4,
    width: 28.224,
    height: 18.624,
    xHeight: 6.048,
    x: 0,
    y: 0
}
```

#### 属性

| 名称      | 类型   | 可选 | 描述                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------------- |
| ascender  | number | 否   | 文本布局变化后该行的上升高度。             |
| capHeight | number | 否   | 基线以上大写字母的高度。                        |
| descender | number | 否   | 文本布局变化后该行的下降高度。            |
| height    | number | 否   | 文本布局变化后该行的高度。                   |
| width     | number | 否   | 文本布局变化后该行的宽度。                    |
| x         | number | 否   | `Text` 组件内部该行的 X 坐标。                        |
| xHeight   | number | 否   | 基线与该行中线（正文字号）之间的距离。 |
| y         | number | 否   | `Text` 组件内部该行的 Y 坐标。                        |

### TextLayoutEvent

`TextLayoutEvent` 对象会在组件布局变化时作为回调结果返回。它包含一个名为 `lines` 的键，其值为一个数组，数组中包含与每一条已渲染文本行对应的 [`TextLayout`](text#textlayout) 对象。

#### 示例

```js
{
  lines: [
    TextLayout,
    TextLayout,
    // ...
  ];
  target: 1127;
}
```

#### 属性

| 名称   | 类型                                    | 可选 | 描述                                           |
| ------ | --------------------------------------- | ---- | ----------------------------------------------------- |
| lines  | [TextLayout](text#textlayout) 的数组 | 否   | 为每一条已渲染行提供 `TextLayout` 数据。 |
| target | number                                  | 否   | 元素的节点 id。                           |
