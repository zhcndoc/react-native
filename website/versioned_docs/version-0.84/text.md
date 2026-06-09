我会严格保留原始 Markdown 结构，只翻译可见文本内容，并且不改动代码、标签和属性。现在开始直接处理整段内容。---
id: text
title: 文本
---

一个用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本将继承 `styles.baseText` 中的 `fontFamily`，但标题会提供自己额外的样式。由于字面换行符的存在，标题和正文会彼此堆叠：

```SnackPlayer name=Text%20Function%20Component%20Example
import {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInANest = () => {
  const [titleText, setTitleText] = useState("Bird's Nest");
  const bodyText = 'This is not really a bird nest.';

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

Android 和 iOS 都允许你通过为字符串的某些范围添加特定格式（如粗体或彩色文本）来显示格式化文本（iOS 上使用 `NSAttributedString`，Android 上使用 `SpannableString`）。在实践中，这非常繁琐。对于 React Native，我们决定采用 Web 的范式，即通过嵌套文本来实现相同效果。

```SnackPlayer name=Nested%20Text%20Example
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const BoldAndBeautiful = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.baseText}>
        I am bold
        <Text style={styles.innerText}> and red</Text>
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

`<Text>` 元素在布局方面是独特的：其中的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 内部的元素不再是矩形，而是会在遇到行尾时自动换行。

```tsx
<Text>
  <Text>First part and </Text>
  <Text>second part</Text>
</Text>
// Text 容器：如果空间允许，文本将以内联方式显示
// |First part and second part|

// 否则，文本会像一个整体一样流动
// |First part |
// |and second |
// |part       |

<View>
  <Text>First part and </Text>
  <Text>second part</Text>
</View>
// View 容器：每段文本都是独立的块
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

文档中的所有元素都会继承这个字体，除非它们自己或其某个父级指定了新的规则。

在 React Native 中，我们对此更严格：**你必须将所有文本节点包裹在一个 `<Text>` 组件中**。你不能直接把文本节点放在 `<View>` 下。

```tsx
// BAD: will raise exception, can't have a text node as child of a <View>
<View>
  Some text
</View>

// GOOD
<View>
  <Text>
    Some text
  </Text>
</View>
```

你也会失去为整个子树设置默认字体的能力。同时，`fontFamily` 只接受一个字体名称，这与 CSS 中的 `font-family` 不同。建议在整个应用中保持一致字体和字号的方式，是创建一个包含这些样式的组件 `MyAppText`，并在应用中到处使用它。你也可以用这个组件创建更具体的组件，例如用于其他文本类型的 `MyAppHeaderText`。

```tsx
<View>
  <MyAppText>
    使用整个应用默认字体样式的文本
  </MyAppText>
  <MyAppHeaderText>作为标题样式的文本</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个组件，它只会把其子元素作为带样式的 `Text` 组件渲染出来，那么 `MyAppHeaderText` 可以定义如下：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

以这种方式组合 `MyAppText` 可以确保我们从顶层组件获得样式，同时仍然保留在特定场景中添加或覆盖这些样式的能力。

React Native 仍然具有样式继承的概念，但仅限于文本子树。在这种情况下，第二部分将同时加粗并变为红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们认为，这种更受约束的文本样式方式会带来更好的应用：

- （开发者）React 组件的设计初衷是高度隔离：你应该能够把一个组件放到应用中的任何位置，并相信只要 props 相同，它就会以相同的方式显示和行为。如果文本属性可以从 props 之外继承，就会破坏这种隔离性。

- （实现者）React Native 的实现也得到了简化。我们不需要在每个元素上都放一个 `fontFamily` 字段，也不需要在每次显示文本节点时都可能遍历整个树直到根节点。样式继承只会在原生 Text 组件内部编码，并不会泄漏到其他组件或系统本身。

---

# 参考

## 属性

### `accessibilityHint`

辅助功能提示可帮助用户理解当他们对辅助功能元素执行某个操作时会发生什么，尤其是在这一结果无法从辅助功能标签中清楚得知时。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，用于指示当用户与该元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与该元素交互时朗读的文本。默认情况下，标签会通过遍历所有子元素并累积所有以空格分隔的 `Text` 节点来构造。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告诉屏幕阅读器将当前聚焦的元素视为具有特定角色。

在 iOS 上，这些角色会映射到对应的辅助功能特征。Image button 的功能与同时设置 `'image'` 和 `'button'` 两个特征相同。更多信息请参阅 [辅助功能指南](accessibility.md#accessibilitytraits-ios)。

在 Android 上，这些角色在 TalkBack 中的作用类似于 iOS 的 VoiceOver 中添加辅助功能特征的效果

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告诉屏幕阅读器将当前聚焦的元素视为处于特定状态。

你可以提供一个状态、没有状态，或多个状态。状态必须通过对象传入，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含字段名称和标签。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  | 必需 |
| ----- | -------- |
| array | 否       |

---

### `onAccessibilityAction`

当用户执行辅助功能操作时调用。此函数的唯一参数是一个事件，其中包含要执行的操作名称。

更多信息请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `accessible`

当设置为 `true` 时，表示该视图是一个辅助功能元素。

更多信息请参阅 [辅助功能指南](accessibility#accessible-ios-android)。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `adjustsFontSizeToFit`

指定字体是否应自动缩小以适应给定的样式约束。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `allowFontScaling`

指定字体是否应缩放以符合“文本大小”辅助功能设置。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API 级别 23+ 上确定单词断点时使用的自动连字符频率。

| 类型                                | 默认值  |
| ----------------------------------- | -------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示元素正在被修改，并且辅助技术可能希望等待更改完成后再向用户报告更新。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可勾选元素的状态。此字段可以是布尔值，也可以是字符串 `"mixed"`，用于表示混合状态的复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可感知但已禁用，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠状态。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义一个用于标记交互式元素的字符串值。

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

确定在文本元素中转换为可点击 URL 的数据类型。默认情况下，不检测任何数据类型。

你只能提供一种类型。

| 类型                                                          | 默认值  |
| ------------------------------------------------------------- | -------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

用于测试目的，指定文本视图的禁用状态。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

要在 iOS 上应用到该元素的 [Dynamic Type](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 字号级别。

| 类型                                                                                                                                                     | 默认值  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

当设置了 `numberOfLines` 时，此属性定义文本将如何被截断。`numberOfLines` 必须与此属性一起设置。

可取以下值之一：

- `head` - 这一行会显示为末尾部分适配容器，而开头缺失的文本用省略号字符表示。例如，`"...wxyz"`
- `middle` - 这一行会显示为开头和结尾部分适配容器，而中间缺失的文本用省略号字符表示。`"ab...yz"`
- `tail` - 这一行会显示为开头部分适配容器，而末尾缺失的文本用省略号字符表示。例如，`"abcd..."`
- `clip` - 文本行不会绘制到文本容器边缘之外。

:::note
在 Android 上，当 `numberOfLines` 的值大于 `1` 时，只有 `tail` 值能正常工作。
:::

| 类型                                           | 默认值 |
| ---------------------------------------------- | ------- |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码中定位该视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定在启用 `allowFontScaling` 时，字体可以达到的最大缩放倍率。可取值：

- `null/undefined`：从父节点或全局默认值继承（0）
- `0`：无限制，忽略父级/全局默认值
- `>= 1`：将该节点的 `maxFontSizeMultiplier` 设置为此值

| 类型   | 默认值     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定在启用 `adjustsFontSizeToFit` 时，字体可以达到的最小缩放倍率。（取值范围 0.01-1.0）

| 类型   |
| ------ |
| number |

---

### `nativeID`

用于从原生代码中定位该视图。

| 类型   |
| ------ |
| string |

---

### `numberOfLines`

在计算文本布局（包括换行）后，用于将文本截断并在末尾显示省略号，使总行数不超过该数值。将此属性设为 `0` 会取消该值，这意味着不会应用行数限制。

此属性通常与 `ellipsizeMode` 一起使用。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |

---

### `onLayout`

在挂载和布局变化时调用。

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

这个视图是否想要“声明”触摸响应？当 `View` 不是响应者时，它会在每次触摸移动时被调用。

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

当触摸刚接触时立即调用，在 `onPressOut` 和 `onPress` 之前。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

当触摸释放时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderGrant`

此时 View 正在响应触摸事件。此时可以进行高亮并向用户展示正在发生的事情。

在 Android 上，从此回调返回 `true` 可以阻止任何其他原生组件成为响应者，直到当前响应者终止。

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

响应者已从 `View` 中被移除。可能会在调用 `onResponderTerminationRequest` 后被其他视图接管，或者也可能在未询问的情况下被操作系统接管（例如，在 iOS 上发生于控制中心/通知中心时）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

某个其他 `View` 想要成为响应者，并请求此 `View` 释放其响应者身份。返回 `true` 表示允许释放。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父级 `View` 想要阻止子级 `View` 在触摸开始时成为响应者，则应使用此处理函数并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onTextLayout`

在 Text 布局变化时调用。

| 类型                                                 |
| ---------------------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了在按钮失活之前，你的触摸可以离开按钮多远。一旦失活，再把它移回去，你会看到按钮会重新激活！在滚动视图被禁用时，可以反复来回移动几次。请确保传入一个常量，以减少内存分配。

| 类型                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

挂载时会被赋值为一个 [element node](element-nodes) 的 ref setter。

请注意，`Text` 组件不提供 text node，类似于 Web 上的段落元素（`<p>`）是 element node 而不是 text node。文本节点可以在它们的子节点中找到。

---

### `role`

`role` 会向辅助技术的用户传达组件的用途。其优先级高于 [`accessibilityRole`](text#accessibilityrole) 属性。

| 类型                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `selectable`

允许用户选择文本，以使用原生复制和粘贴功能。

| 类型    | 默认值 |
| ------- | ------- |
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

当为 `true` 时，按下文本时不会产生视觉变化。默认情况下，按下时会用灰色椭圆高亮文本。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `testID`

用于在端到端测试中定位该视图。

| 类型   |
| ------ |
| string |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API 级别 23+ 上设置文本断行策略，可选值为 `simple`、`highQuality`、`balanced`。

| 类型                                            | 默认值       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14+ 上设置断行策略。可选值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值  |
| ----------------------------------------------------------- | -------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

## 类型定义

### TextLayout

`TextLayout` 对象是 [`TextLayoutEvent`](text#textlayoutevent) 回调的一部分，包含 `Text` 行的测量数据。

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
| ascender  | number | 否   | 文本布局变化后，该行的上升部高度。             |
| capHeight | number | 否   | 基线以上大写字母的高度。                        |
| descender | number | 否   | 文本布局变化后，该行的下降部高度。            |
| height    | number | 否   | 文本布局变化后，该行的高度。                   |
| width     | number | 否   | 文本布局变化后，该行的宽度。                    |
| x         | number | 否   | Text 组件内该行的 X 坐标。                        |
| xHeight   | number | 否   | 基线与该行中线（正文字号大小）之间的距离。 |
| y         | number | 否   | Text 组件内该行的 Y 坐标。                        |

### TextLayoutEvent

`TextLayoutEvent` 对象会在组件布局发生变化时作为回调结果返回。它包含一个名为 `lines` 的键，其值是一个数组，数组中包含与每一条已渲染文本行对应的 [`TextLayout`](text#textlayout) 对象。

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
| lines  | [TextLayout](text#textlayout) 的数组 | 否   | 提供每一条已渲染行的 TextLayout 数据。 |
| target | number                                  | 否   | 元素的节点 id。                           |
