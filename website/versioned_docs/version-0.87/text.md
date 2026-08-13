---
id: text
title: Text
---

用于显示文本的 React 组件。

`Text` 支持嵌套、样式设置和触摸处理。

在以下示例中，嵌套的标题和正文文本将继承 `styles.baseText` 中的 `fontFamily`，但标题还提供了自己的附加样式。由于字面量换行符，标题和正文会彼此堆叠：

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

Android 和 iOS 都允许你通过使用特定格式（例如粗体或彩色文本）标注字符串的范围来显示格式化文本（iOS 上使用 `NSAttributedString`，Android 上使用 `SpannableString`）。在实际使用中，这非常繁琐。对于 React Native，我们决定采用 Web 范式：你可以嵌套文本来实现相同的效果。

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

在幕后，React Native 会将其转换为扁平的 `NSAttributedString` 或 `SpannableString`，其中包含以下信息：

```
"I am bold and red"
0-9: bold
9-17: bold, red
```

## 容器

相对于布局而言，`<Text>` 元素很独特：其中的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 中的元素不再是矩形，而是在遇到行尾时换行。

```tsx
<Text>
  <Text>First part and </Text>
  <Text>second part</Text>
</Text>
// Text container: the text will be inline, if the space allows it
// |First part and second part|

// otherwise, the text will flow as if it was one
// |First part |
// |and second |
// |part       |

<View>
  <Text>First part and </Text>
  <Text>second part</Text>
</View>
// View container: each text is its own block
// |First part and|
// |second part   |

// otherwise, the text will flow in its own block
// |First part |
// |and        |
// |second part|
```

## 有限的样式继承

在 Web 上，为整个文档设置字体系列和大小的常见方式是利用 CSS 属性继承，如下所示：

```css
html {
  font-family:
    'lucida grande', tahoma, verdana, arial, sans-serif;
  font-size: 11px;
  color: #141823;
}
```

文档中的所有元素都会继承此字体，除非它们自身或它们的某个父元素指定了新规则。

在 React Native 中，我们对此有更严格的要求：**你必须将所有文本节点包裹在 `<Text>` 组件中**。不能将文本节点直接放在 `<View>` 下。

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

你也失去了为整个子树设置默认字体的能力。同时，`fontFamily` 只接受单个字体名称，这一点不同于 CSS 中的 `font-family`。在整个应用中使用一致的字体和大小的推荐方式，是创建一个包含这些设置的 `MyAppText` 组件，并在应用中使用此组件。你还可以使用此组件创建更具体的组件，例如用于其他类型文本的 `MyAppHeaderText`。

```tsx
<View>
  <MyAppText>
    Text styled with the default font for the entire application
  </MyAppText>
  <MyAppHeaderText>Text styled as a header</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个只将其子元素渲染到带有样式的 `Text` 组件中的组件，那么 `MyAppHeaderText` 可以定义如下：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

以这种方式组合 `MyAppText` 可以确保我们获得顶层组件中的样式，同时保留在特定使用场景中添加或覆盖样式的能力。

React Native 仍然具有样式继承的概念，但仅限于文本子树。在此示例中，第二部分同时为粗体和红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们相信，这种限制更多的文本样式设置方式将带来更好的应用：

- （开发者）React 组件在设计时就注重强隔离：你应该能够将组件放置在应用中的任何位置，并相信只要 props 相同，它的外观和行为就会保持一致。可能从 props 外部继承的文本属性会破坏这种隔离。

- （实现者）React Native 的实现也得到了简化。我们不需要在每个元素上都设置 `fontFamily` 字段，也不需要每次显示文本节点时都可能遍历树直到根节点。样式继承只编码在原生 Text 组件内部，不会泄漏到其他组件或系统本身。

---

# 参考

## Props

### `accessibilityHint`

当用户在辅助功能元素上执行操作后的结果无法通过辅助功能标签明确获知时，辅助功能提示可帮助用户了解执行操作后会发生什么。

| Type   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示用户与元素交互时屏幕阅读器应使用的语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| Type   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖用户与元素交互时屏幕阅读器读取的文本。默认情况下，标签通过遍历所有子元素，并将所有 `Text` 节点以空格分隔后累积构成。

| Type   |
| ------ |
| string |

---

### `accessibilityRole`

告知屏幕阅读器将当前获得焦点的元素视为具有特定角色。

在 iOS 上，这些角色映射到相应的 Accessibility Traits。Image button 的功能等同于同时设置 `image` 和 `button` 两个 trait。有关更多信息，请参阅 [Accessibility 指南](accessibility.md#accessibilitytraits-ios)。

在 Android 上，这些角色在 TalkBack 中具有与 iOS Voiceover 中添加 Accessibility Traits 类似的功能

| Type                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告知屏幕阅读器将当前获得焦点的元素视为处于特定状态。

你可以提供一个状态、不提供状态，或提供多个状态。状态必须通过对象传入，例如 `{selected: true, disabled: true}`。

| Type                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含操作对象列表。每个操作对象都应包含 name 和 label 字段。

有关更多信息，请参阅 [Accessibility 指南](accessibility.md#accessibility-actions)。

| Type  | Required |
| ----- | -------- |
| array | No       |

---

### `onAccessibilityAction`

用户执行辅助功能操作时调用。此函数唯一的参数是一个包含要执行的操作名称的事件。

有关更多信息，请参阅 [Accessibility 指南](accessibility.md#accessibility-actions)。

| Type     | Required |
| -------- | -------- |
| function | No       |

---

### `accessible`

设置为 `true` 时，表示该视图是一个辅助功能元素。

有关更多信息，请参阅 [Accessibility 指南](accessibility#accessible-ios-android)。

| Type    | Default |
| ------- | ------- |
| boolean | `true`  |

---

### `adjustsFontSizeToFit`

指定是否应自动缩小字体，以适应给定的样式约束。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

---

### `allowFontScaling`

指定字体是否应缩放，以遵循文本大小辅助功能设置。

| Type    | Default |
| ------- | ------- |
| boolean | `true`  |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API Level 23 及更高版本上确定单词断点时使用的自动连字符频率。

| Type                                | Default  |
| ----------------------------------- | -------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示元素正在被修改，辅助技术可能希望等待更改完成后，再向用户告知更新。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可检查元素的状态。此字段可以接受布尔值，或接受 `"mixed"` 字符串来表示混合复选框。

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示元素可感知但已禁用，因此无法编辑或以其他方式操作。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠。

| Type    | Default |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义用于标记交互元素的字符串值。

| Type   |
| ------ |
| string |

---

### `aria-selected`

表示可选择元素当前是否处于选中状态。

| Type    |
| ------- |
| boolean |

### `dataDetectorType` <div className="label android">Android</div>

确定在文本元素中转换为可点击 URL 的数据类型。默认情况下，不检测任何数据类型。

你只能提供一种类型。

| Type                                                          | Default  |
| ------------------------------------------------------------- | -------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

指定文本视图的禁用状态，用于测试。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

在 iOS 上应用于此元素的 [Dynamic Type](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 字体级别。

| Type                                                                                                                                                     | Default  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

设置 `numberOfLines` 时，此 prop 定义文本的截断方式。必须结合此 prop 设置 `numberOfLines`。

可以是以下值之一：

- `head` - 显示该行，使末尾适合容器，并通过省略号字形指示行首缺失的文本。例如："...wxyz"
- `middle` - 显示该行，使开头和结尾适合容器，并通过省略号字形指示中间缺失的文本。"ab...yz"
- `tail` - 显示该行，使开头适合容器，并通过省略号字形指示行尾缺失的文本。例如："abcd..."
- `clip` - 不绘制超出文本容器边缘的行。

:::note
在 Android 上，当 `numberOfLines` 设置为大于 `1` 的值时，只有 `tail` 值能正常工作
:::

| Type                                           | Default |
| ---------------------------------------------- | ------- |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码中定位此视图。优先级高于 `nativeID` prop。

| Type   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定启用 `allowFontScaling` 时字体可以达到的最大缩放比例。可能的值：

- `null/undefined`：从父节点或全局默认值（0）继承
- `0`：无上限，忽略父节点或全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为此值

| Type   | Default     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定启用 `adjustsFontSizeToFit` 时字体可以达到的最小缩放比例。（取值范围为 0.01-1.0）。

| Type   |
| ------ |
| number |

---

### `nativeID`

用于从原生代码中定位此视图。

| Type   |
| ------ |
| string |

---

### `numberOfLines`

用于在计算文本布局（包括换行）后，使用省略号截断文本，使总行数不超过此数值。将此属性设置为 `0` 会取消设置该值，也就是说不会应用行数限制。

此 prop 通常与 `ellipsizeMode` 一起使用。

| Type   | Default |
| ------ | ------- |
| number | `0`     |

---

### `onLayout`

在挂载和布局发生变化时调用。

| Type                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

长按时调用此函数。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onMoveShouldSetResponder`

此视图是否希望“声明”触摸响应权？当 `View` 未作为 responder 时，每次触摸移动都会调用此函数。

| Type                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onPress`

用户按下时调用的函数，在 `onPressOut` 之后触发。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressIn`

触摸开始后立即调用，在 `onPressOut` 和 `onPress` 之前。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

触摸释放时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderGrant`

View 现在正在响应触摸事件。这是突出显示并向用户展示当前发生情况的时机。

在 Android 上，从此回调返回 true 可防止其他原生组件成为 responder，直到此 responder 终止。

| Type                                                              |
| ----------------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void ｜ boolean` |

---

### `onResponderMove`

用户正在移动手指。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderRelease`

在触摸结束时触发。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminate`

responder 已从 `View` 被夺走。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，也可能由操作系统在未询问的情况下夺走（例如，在 iOS 上打开控制中心或通知中心时会发生）

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他某个 `View` 想要成为 responder，并请求此 `View` 释放其 responder。返回 `true` 可允许释放。

| Type                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父级 `View` 想要阻止子级 `View` 在触摸开始时成为 responder，则应使用返回 `true` 的此处理函数。

| Type                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onTextLayout`

在 Text 布局发生变化时调用。

| Type                                                 |
| ---------------------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图被禁用时，此属性定义触摸可以移出按钮多远，超过该距离后按钮将停用。停用后，尝试将触摸移回，你会看到按钮再次被激活！在滚动视图被禁用时，来回移动几次。请确保传入常量，以减少内存分配。

| Type                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

一个 ref setter，挂载时会被分配一个 [元素节点](element-nodes)。

请注意，`Text` 组件不会提供文本节点，这与 Web 上的段落元素（`<p>`）类似：它们是元素节点而不是文本节点。文本节点可以作为其子节点找到。

---

### `role`

`role` 向辅助技术用户传达组件的用途。优先级高于 [`accessibilityRole`](text#accessibilityrole) prop。

| Type                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `selectable`

允许用户选择文本，以使用原生复制和粘贴功能。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

---

### `selectionColor` <div className="label android">Android</div>

文本的高亮颜色。

| Type            |
| --------------- |
| [color](colors) |

---

### `style`

| Type                                                                 |
| -------------------------------------------------------------------- |
| [Text Style](text-style-props), [View Style Props](view-style-props) |

---

### `suppressHighlighting` <div className="label ios">iOS</div>

为 `true` 时，按下文本不会产生视觉变化。默认情况下，按下文本时会用灰色椭圆高亮显示。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

---

### `testID`

用于在端到端测试中定位此视图。

| Type   |
| ------ |
| string |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API Level 23 及更高版本上设置文本断行策略，可用值为 `simple`、`highQuality`、`balanced`。

| Type                                            | Default       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14 及更高版本上设置断行策略。可用值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| Type                                                        | Default  |
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

| Name      | Type   | Optional | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| ascender  | number | No       | 文本布局发生变化后该行的上升部高度。   |
| capHeight | number | No       | 基线以上大写字母的高度。               |
| descender | number | No       | 文本布局发生变化后该行的下降部高度。   |
| height    | number | No       | 文本布局发生变化后该行的高度。         |
| width     | number | No       | 文本布局发生变化后该行的宽度。         |
| x         | number | No       | Text 组件内该行的 X 坐标。             |
| xHeight   | number | No       | 基线与该行中线之间的距离（字面高度）。 |
| y         | number | No       | Text 组件内该行的 Y 坐标。             |

### TextLayoutEvent

`TextLayoutEvent` 对象会在组件布局发生变化时作为回调结果返回。它包含一个名为 `lines` 的键，其值是一个数组，其中包含与每个渲染文本行对应的 [`TextLayout`](text#textlayout) 对象。

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

| Name   | Type                                    | Optional | Description                        |
| ------ | --------------------------------------- | -------- | ---------------------------------- |
| lines  | array of [TextLayout](text#textlayout)s | No       | 提供每个渲染行的 TextLayout 数据。 |
| target | number                                  | No       | 元素的节点 ID。                    |
