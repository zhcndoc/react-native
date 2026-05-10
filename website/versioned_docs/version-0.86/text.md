---
id: text
title: 文本
---

用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本将继承 `styles.baseText` 中的 `fontFamily`，但标题会提供自己额外的样式。由于存在字面上的换行，标题和正文会堆叠在一起：

```SnackPlayer name=Text%20Function%20Component%20Example
import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInANest = () => {
  const [titleText, setTitleText] = useState("Bird's Nest");
  const bodyText = '这并不是真正的鸟巢。';

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

Android 和 iOS 都允许你通过使用特定格式（如粗体或彩色文本）标注字符串的范围来显示格式化文本（iOS 上是 `NSAttributedString`，Android 上是 `SpannableString`）。实际上，这非常繁琐。对于 React Native，我们决定在这里采用 Web 的范式，你可以嵌套文本来达到相同的效果。

```SnackPlayer name=Nested%20Text%20Example
import React from 'react';
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
0-9: 加粗
9-17: 加粗, 红色
```

## 容器

与布局相关，`<Text>` 元素是独特的：其中的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 内部的元素不再是矩形，而是在遇到行尾时自动换行。

```tsx
<Text>
  <Text>第一部分和 </Text>
  <Text>第二部分</Text>
</Text>
// 文本容器：如果空间允许，文本将以内联方式显示
// |第一部分和 第二部分|

// 否则，文本将像一个整体一样流动
// |第一部分 |
// |和第二 |
// |部分       |

<View>
  <Text>第一部分和 </Text>
  <Text>第二部分</Text>
</View>
// View 容器：每段文本都是自己的块
// |第一部分和|
// |第二部分   |

// 否则，文本将在自己的块中流动
// |第一部分 |
// |和        |
// |第二部分|
```

## 有限的样式继承

在 Web 上，为整个文档设置字体族和大小的常见方式是利用继承的 CSS 属性，例如：

```css
html {
  font-family:
    'lucida grande', tahoma, verdana, arial, sans-serif;
  font-size: 11px;
  color: #141823;
}
```

文档中的所有元素都会继承这个字体，除非它们或它们的某个父元素指定了新的规则。

在 React Native 中，我们对此更加严格：**你必须将所有文本节点包裹在 `<Text>` 组件中**。你不能让文本节点直接位于 `<View>` 下。

```tsx
// 错误：会抛出异常，<View> 的子元素中不能包含文本节点
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

你也会失去为整个子树设置默认字体的能力。同时，`fontFamily` 只接受单个字体名称，这与 CSS 中的 `font-family` 不同。建议在整个应用中使用一致的字体和大小的方式，是创建一个 `MyAppText` 组件来包含它们，并在应用中复用这个组件。你也可以利用这个组件来创建更具体的组件，例如用于其他类型文本的 `MyAppHeaderText`。

```tsx
<View>
  <MyAppText>
    使用整个应用默认字体样式的文本
  </MyAppText>
  <MyAppHeaderText>样式化为标题的文本</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个组件，它只会将其子元素带样式地渲染到一个 `Text` 组件中，那么 `MyAppHeaderText` 可以定义如下：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

以这种方式组合 `MyAppText` 可以确保我们从顶层组件获得样式，同时在特定用例中仍然可以添加/覆盖它们。

React Native 仍然具有样式继承的概念，但仅限于文本子树。在这种情况下，第二部分将同时是加粗和红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们认为，这种更受约束的文本样式设置方式会带来更好的应用：

- （开发者）React 组件在设计时就强调强隔离：你应该能够把一个组件放到应用中的任何位置，并且相信只要 props 相同，它的外观和行为就会相同。可能从 props 外部继承的文本属性会破坏这种隔离性。

- （实现者）React Native 的实现也得到了简化。我们不需要在每个元素上都设置 `fontFamily` 字段，而且在显示文本节点时也不需要每次都沿着树向上遍历到根节点。样式继承只编码在原生 Text 组件内部，不会泄漏到其他组件或系统本身。

---

# 参考

## 属性

### `accessibilityHint`

无障碍提示可帮助用户在无障碍元素的标签无法清楚说明结果时，理解对该元素执行操作后会发生什么。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，用于指示当用户与该元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

有关更多信息，请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与元素交互时读取的文本。默认情况下，该标签是通过遍历所有子元素并收集所有 `Text` 节点、用空格分隔后构造出来的。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告诉屏幕阅读器将当前聚焦的元素视为具有特定角色。

在 iOS 上，这些角色会映射到对应的辅助功能特征。Image button 的功能与同时设置了 'image' 和 'button' 特征时相同。有关更多信息，请参阅 [辅助功能指南](accessibility.md#accessibilitytraits-ios)。

在 Android 上，这些角色在 TalkBack 上的功能与 iOS 中的 VoiceOver 添加辅助功能特征类似

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告诉屏幕阅读器将当前聚焦的元素视为处于某种特定状态。

你可以提供一个状态、没有状态，或多个状态。状态必须通过对象传入，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名和标签。

有关更多信息，请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  | 必需 |
| ----- | -------- |
| array | 否       |

---

### `onAccessibilityAction`

当用户执行辅助功能操作时调用。该函数的唯一参数是一个事件，其中包含要执行的操作名称。

有关更多信息，请参阅 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `accessible`

当设置为 `true` 时，表示该视图是一个无障碍元素。

有关更多信息，请参阅 [辅助功能指南](accessibility#accessible-ios-android)。

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

指定字体是否应缩放以符合文本大小辅助功能设置。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API Level 23+ 上确定单词换行时使用的自动连字符频率。

| 类型                                | 默认值  |
| ----------------------------------- | -------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能希望等到更改完成后再通知用户更新情况。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可勾选元素的状态。该字段可以接受布尔值或 "mixed" 字符串来表示混合状态的复选框。

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

表示一个可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义一个用于标注交互式元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-selected`

表示一个可选择元素当前是否已被选中。

| 类型    |
| ------- |
| boolean |

### `dataDetectorType` <div className="label android">Android</div>

确定在文本元素中会被转换为可点击 URL 的数据类型。默认情况下，不会检测任何数据类型。

你只能提供一种类型。

| 类型                                                          | 默认值  |
| ------------------------------------------------------------- | -------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

指定文本视图在测试用途下的禁用状态。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

应用于 iOS 上该元素的 [Dynamic Type](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 档位。

| 类型                                                                                                                                                     | 默认值  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

当设置了 `numberOfLines` 时，此属性定义文本将如何被截断。`numberOfLines` 必须与此属性一起设置。

此属性可取以下值之一：

- `head` - 显示该行时，使末尾内容适配容器，并用省略号标记行首缺失的文本。例如：`"...wxyz"`
- `middle` - 显示该行时，使开头和结尾内容适配容器，并用省略号标记中间缺失的文本。`"ab...yz"`
- `tail` - 显示该行时，使开头内容适配容器，并用省略号标记行尾缺失的文本。例如：`"abcd..."`
- `clip` - 行不会绘制到文本容器边缘之外。

:::note
在 Android 上，当 `numberOfLines` 设置为大于 `1` 的值时，只有 `tail` 值能正常工作。
:::

| 类型                                           | 默认值 |
| ---------------------------------------------- | ------- |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码中定位该视图。优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定在启用 `allowFontScaling` 时字体可达到的最大缩放比例。可能的值：

- `null/undefined`：继承自父节点或全局默认值（0）
- `0`：没有最大值，忽略父级/全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为该值

| 类型   | 默认值     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定在启用 `adjustsFontSizeToFit` 时字体可达到的最小缩放比例。（取值 0.01-1.0）。

| 类型   |
| ------ | ------ |
| number |

---

### `nativeID`

用于从原生代码中定位该视图。

| 类型   |
| ------ | ------ |
| string |

---

### `numberOfLines`

用于在计算文本布局（包括换行）后使用省略号截断文本，使总行数不超过此值。将此属性设为 `0` 会取消该值，这意味着不会应用行数限制。

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

此视图是否希望“抢占”触摸响应？当 `View` 不是 responder 时，每次触摸移动都会调用它。

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

在触摸接触时立即调用，早于 `onPressOut` 和 `onPress`。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

在触摸释放时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderGrant`

此时 View 正在响应触摸事件。这是高亮并向用户显示正在发生什么的时候。

在 Android 上，从此回调返回 true 可阻止任何其他原生组件成为 responder，直到此 responder 结束。

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

responder 已从 `View` 上被移除。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，也可能在未经询问的情况下被操作系统夺走（例如在 iOS 上使用控制中心/通知中心时会发生这种情况）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他某个 `View` 想要成为 responder，并请求此 `View` 释放其 responder。返回 `true` 允许其释放。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父级 `View` 想要阻止子级 `View` 在触摸开始时成为 responder，它应该拥有此处理函数并返回 `true`。

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

当滚动视图被禁用时，此属性定义你的触摸在使按钮失效之前可以偏离按钮多远。一旦失效，尝试将其移回，你会发现按钮会再次被激活！在滚动视图被禁用时，多次前后移动它。确保传入一个常量以减少内存分配。

| 类型                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

一个 ref setter，在挂载时会被赋值为 [element node](element-nodes)。

请注意，`Text` 组件不会提供 text node，就像 Web 中的段落元素（`<p>`）是 element node 而不是 text node 一样。Text nodes 可以在其子节点中找到。

---

### `role`

`role` 用于向辅助技术的用户传达组件的用途。其优先级高于 [`accessibilityRole`](text#accessibilityrole) 属性。

| 类型                       |
| -------------------------- |
| [Role](accessibility#role) |

---

### `selectable`

让用户可以选择文本，以使用原生复制和粘贴功能。

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

当为 `true` 时，按下文本时不会发生视觉变化。默认情况下，按下时会用一个灰色椭圆高亮文本。

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

在 Android API Level 23+ 上设置文本换行策略，可用值为 `simple`、`highQuality`、`balanced`。

| 类型                                            | 默认值       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14+ 上设置换行策略。可用值为 `none`、`standard`、`hangul-word` 和 `push-out`。

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
| --------- | ------ | ---- | ------------------------------------------------------------ |
| ascender  | number | 否   | 文本布局变化后，该行的上升部高度。                             |
| capHeight | number | 否   | 基线以上的大写字母高度。                                       |
| descender | number | 否   | 文本布局变化后，该行的下降部高度。                             |
| height    | number | 否   | 文本布局变化后，该行的高度。                                   |
| width     | number | 否   | 文本布局变化后，该行的宽度。                                   |
| x         | number | 否   | Text 组件内该行的 X 坐标。                                     |
| xHeight   | number | 否   | 基线与该行中线（主体尺寸）之间的距离。                         |
| y         | number | 否   | Text 组件内该行的 Y 坐标。                                     |

### TextLayoutEvent

`TextLayoutEvent` 对象会在组件布局变化时作为回调结果返回。它包含一个名为 `lines` 的键，其值是一个数组，数组中包含与每一条渲染文本行对应的 [`TextLayout`](text#textlayout) 对象。

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
| ------ | --------------------------------------- | ---- | ---------------------------------------------- |
| lines  | array of [TextLayout](text#textlayout)s | 否   | 为每一条渲染后的文本行提供 TextLayout 数据。    |
| target | number                                  | 否   | 元素的节点 id。                                 |
