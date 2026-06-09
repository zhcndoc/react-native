---
id: text
title: 文本
---

一个用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本会从 `styles.baseText` 继承 `fontFamily`，但标题会提供自己额外的样式。由于存在字面上的换行，标题和正文会垂直堆叠在一起：

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

Android 和 iOS 都允许你通过为字符串中的某些范围添加特定格式（如粗体或彩色文本）来显示格式化文本（iOS 上使用 `NSAttributedString`，Android 上使用 `SpannableString`）。在实践中，这非常繁琐。对于 React Native，我们决定采用 Web 的范式，即通过嵌套文本来实现相同效果。

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

在幕后，React Native 会将其转换为一个扁平的 `NSAttributedString` 或 `SpannableString`，其中包含以下信息：

```
"I am bold and red"
0-9: 粗体
9-17: 粗体, 红色
```

## 容器

相对于布局而言，`<Text>` 元素是独特的：其中的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 内部的元素不再是矩形，而是在遇到行尾时换行。

```tsx
<Text>
  <Text>第一部分和</Text>
  <Text>第二部分</Text>
</Text>
// Text 容器：如果空间允许，文本会以内联方式显示
// |第一部分和第二部分|

// 否则，文本会像一个整体一样流动
// |第一部分 |
// |和第二部 |
// |分       |

<View>
  <Text>第一部分和</Text>
  <Text>第二部分</Text>
</View>
// View 容器：每段文本都是自己的块
// |第一部分和|
// |第二部分  |

// 否则，文本会以自己的块流动
// |第一部分 |
// |和       |
// |第二部分 |
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

文档中的所有元素都会继承这个字体，除非它们自己或其某个父元素指定了新规则。

在 React Native 中，我们对此更严格：**你必须将所有文本节点包裹在 `<Text>` 组件内**。你不能在 `<View>` 下直接放置文本节点。

```tsx
// 错误：会抛出异常，不能将文本节点作为 <View> 的子元素
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

你也会失去为整个子树设置默认字体的能力。同时，`fontFamily` 只接受单个字体名称，这与 CSS 中的 `font-family` 不同。在整个应用中使用一致字体和字号的推荐方式，是创建一个包含这些设置的组件 `MyAppText`，并在应用中广泛使用这个组件。你也可以基于这个组件创建更具体的组件，比如用于其他文本类型的 `MyAppHeaderText`。

```tsx
<View>
  <MyAppText>
    使用整个应用默认字体样式的文本
  </MyAppText>
  <MyAppHeaderText>作为标题样式的文本</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个组件，它只会将其子元素作为带样式的 `Text` 组件渲染出来，那么 `MyAppHeaderText` 可以定义如下：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

以这种方式组合 `MyAppText` 可以确保我们从顶层组件获得样式，同时又保留在特定使用场景中添加或覆盖这些样式的能力。

React Native 仍然保留样式继承的概念，但仅限于文本子树。在这种情况下，第二部分会同时加粗并显示为红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  我是粗体
  <Text style={{color: 'red'}}>并且是红色</Text>
</Text>
```

我们相信，这种更受约束的文本样式设置方式会带来更好的应用：

- （开发者）React 组件在设计上强调强隔离：你应该能够把组件放到应用中的任何位置，并相信只要 props 相同，它就会以相同的方式外观和行为。那些可能从 props 之外继承而来的文本属性会破坏这种隔离性。

- （实现者）React Native 的实现也更简单。我们不需要在每一个元素上都设置 `fontFamily` 字段，也不需要在每次显示文本节点时都可能向上遍历树直到根节点。样式继承只会编码在原生 Text 组件内部，不会泄漏到其他组件或系统本身。

---

# 参考

## 属性

### `accessibilityHint`

无障碍提示可帮助用户在通过无障碍元素执行操作且结果无法从无障碍标签中明确看出时，理解该操作将会发生什么。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

一个值，用于指示当用户与该元素交互时，屏幕阅读器应使用哪种语言。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

更多信息请参见 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖屏幕阅读器在用户与该元素交互时读取的文本。默认情况下，该标签通过遍历所有子元素并汇总所有以空格分隔的 `Text` 节点构造而成。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告诉屏幕阅读器将当前聚焦的元素视为具有特定角色。

在 iOS 上，这些角色会映射到对应的辅助功能特征。Image button 的功能与同时设置为 'image' 和 'button' 特征时相同。更多信息请参见 [无障碍指南](accessibility.md#accessibilitytraits-ios)。

在 Android 上，这些角色在 TalkBack 上的功能类似于 iOS 中 VoiceOver 添加辅助功能特征的方式。

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告诉屏幕阅读器将当前聚焦的元素视为处于特定状态。

你可以提供一个状态、不给状态，或者提供多个状态。这些状态必须通过对象传入，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

辅助功能操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象都应包含字段名和标签。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型  | 必填 |
| ----- | -------- |
| array | 否       |

---

### `onAccessibilityAction`

当用户执行辅助功能操作时调用。此函数唯一的参数是一个事件，其中包含要执行的操作名称。

更多信息请参见 [无障碍指南](accessibility.md#accessibility-actions)。

| 类型     | 必填 |
| -------- | -------- |
| function | 否       |

---

### `accessible`

当设置为 `true` 时，表示该视图是一个无障碍元素。

更多信息请参见 [无障碍指南](accessibility#accessible-ios-android)。

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

指定字体是否应根据文本大小无障碍设置进行缩放。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

在 Android API 23 及以上版本上设置用于确定断词时自动连字符的频率。

| 类型                                | 默认值  |
| ----------------------------------- | -------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示某个元素正在被修改，辅助技术可能会希望等到更改完成后再向用户告知更新。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示一个可勾选元素的状态。该字段可以是布尔值，也可以是字符串 "mixed" 以表示混合状态的复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示该元素可感知但处于禁用状态，因此不可编辑或无法执行其他操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示某个可展开元素当前是展开还是折叠状态。

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

表示某个可选择元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `dataDetectorType` <div className="label android">Android</div>

决定在文本元素中哪些类型的数据会被转换为可点击的 URL。默认情况下，不会检测任何数据类型。

你只能提供一种类型。

| 类型                                                          | 默认值  |
| ------------------------------------------------------------- | -------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

指定文本视图的禁用状态，仅用于测试目的。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

应用于 iOS 上该元素的 [动态类型](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 层级。

| 类型                                                                                                                                                     | 默认值  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

当设置了 `numberOfLines` 时，此属性定义文本将如何被截断。`numberOfLines` 必须与此属性一起设置。

它可以是以下值之一：

- `head` - 显示该行，使末尾部分适配容器，而行首缺失的文本由省略号标识。例如：`"...wxyz"`
- `middle` - 显示该行，使开头和结尾部分适配容器，而中间缺失的文本由省略号标识。"ab...yz"
- `tail` - 显示该行，使开头部分适配容器，而行尾缺失的文本由省略号标识。例如：`"abcd..."`
- `clip` - 不会绘制超出文本容器边缘的行。

:::note
在 Android 上，当 `numberOfLines` 设置为大于 `1` 的值时，只有 `tail` 值才能正常工作。
:::

| 类型                                           | 默认值 |
| ---------------------------------------------- | ------- |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码中定位此视图。其优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定在启用 `allowFontScaling` 时字体可达到的最大缩放倍数。可取值：

- `null/undefined`：继承自父节点或全局默认值（0）
- `0`：没有上限，忽略父级/全局默认值
- `>= 1`：将该节点的 `maxFontSizeMultiplier` 设置为此值

| 类型   | 默认值     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定在启用 `adjustsFontSizeToFit` 时字体可达到的最小缩放倍数。（值为 0.01-1.0）

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

在计算文本布局（包括自动换行）后，用于在文本末尾添加省略号并截断文本，使总行数不超过该值。将此属性设置为 `0` 会取消该值，这意味着不会应用行数限制。

此属性通常与 `ellipsizeMode` 配合使用。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |

---

### `onLayout`

在挂载时以及布局发生变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

在长按时调用此函数。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onMoveShouldSetResponder`

这个视图是否想要“声明”触摸响应？当 `View` 不是响应者时，每次在其上发生触摸移动都会调用此函数。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onPress`

在用户按下时调用，触发时机在 `onPressOut` 之后。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressIn`

当触摸刚开始接触时立即调用，在 `onPressOut` 和 `onPress` 之前。

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

此时 `View` 正在响应触摸事件。此时适合进行高亮，并向用户显示正在发生的事情。

在 Android 上，从此回调返回 `true` 可以阻止任何其他原生组件在此响应者终止之前成为响应者。

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

响应者已从 `View` 中被夺取。可能是在调用 `onResponderTerminationRequest` 后被其他视图夺走，也可能是在未询问的情况下被操作系统夺走（例如，在 iOS 上会发生在控制中心/通知中心场景中）。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

某个其他 `View` 想成为响应者，并请求此 `View` 释放其响应者身份。返回 `true` 允许释放。

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

在文本布局发生变化时调用。

| 类型                                                 |
| ---------------------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了在按钮失效之前，触摸可以偏离按钮多远。一旦失效，尝试把它移回去，你会看到按钮会再次激活！在滚动视图被禁用时，可以来回移动几次。确保传入一个常量以减少内存分配。

| 类型                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

挂载时会被赋值为一个 [元素节点](element-nodes) 的 ref setter。

请注意，`Text` 组件不会提供文本节点，就像 Web 上的段落元素（`<p>`）是元素节点而不是文本节点一样。文本节点可以在其子节点中找到。

---

### `role`

`role` 会向辅助技术用户传达组件的用途。其优先级高于 [`accessibilityRole`](text#accessibilityrole) 属性。

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

当为 `true` 时，按下文本时不会产生视觉变化。默认情况下，按下文本时会以灰色椭圆高亮显示。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

---

### `testID`

用于在端到端测试中定位此视图。

| 类型   |
| ------ |
| string |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API 23 及以上版本上设置文本断行策略，可选值为 `simple`、`highQuality`、`balanced`。

| 类型                                            | 默认值       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14 及以上版本上设置换行策略。可选值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值  |
| ----------------------------------------------------------- | -------- |
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
| --------- | ------ | ---- | ------------------------------------------------------------ |
| ascender  | number | 否   | 文本布局变化后，该行的升部高度。                             |
| capHeight | number | 否   | 基线以上大写字母的高度。                                     |
| descender | number | 否   | 文本布局变化后，该行的降部高度。                             |
| height    | number | 否   | 文本布局变化后，该行的高度。                                 |
| width     | number | 否   | 文本布局变化后，该行的宽度。                                 |
| x         | number | 否   | `Text` 组件内该行的 X 坐标。                                 |
| xHeight   | number | 否   | 基线与该行中线（主体尺寸）之间的距离。                       |
| y         | number | 否   | `Text` 组件内该行的 Y 坐标。                                 |

### TextLayoutEvent

`TextLayoutEvent` 对象会在回调中作为组件布局变化的结果返回。它包含一个名为 `lines` 的键，其值是一个数组，包含与每一行已渲染文本对应的 [`TextLayout`](text#textlayout) 对象。

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

| 名称   | 类型                                    | 可选 | 描述                                 |
| ------ | --------------------------------------- | ---- | ------------------------------------ |
| lines  | array of [TextLayout](text#textlayout)s | 否   | 提供每一行已渲染文本的 TextLayout 数据。 |
| target | number                                  | 否   | 元素的节点 id。                        |
