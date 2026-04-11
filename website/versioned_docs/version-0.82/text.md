---
id: text
title: 文本
---

一个用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本将从 `styles.baseText` 继承 `fontFamily`，但标题提供了其自己的额外样式。由于字面换行符，标题和正文将彼此堆叠：

```SnackPlayer name=Text%20Function%20Component%20Example
import React, {useState} from 'react';
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

Android 和 iOS 都允许你通过用特定格式（如粗体或彩色文本）注释字符串的范围来显示格式化文本（iOS 上的 `NSAttributedString`，Android 上的 `SpannableString`）。实际上，这非常繁琐。对于 React Native，我们决定为此使用 Web 范式，你可以嵌套文本来实现相同的效果。

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

在幕后，React Native 将其转换为包含以下信息的扁平 `NSAttributedString` 或 `SpannableString`：

```
"I am bold and red"
0-9: bold
9-17: bold, red
```

## 容器

`<Text>` 元素在布局方面是独特的：内部的所有内容不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 内部的元素不再是矩形，而是在看到行尾时换行。

```tsx
<Text>
  <Text>First part and </Text>
  <Text>second part</Text>
</Text>
// 文本容器：如果空间允许，文本将是内联的
// |First part and second part|

// 否则，文本将流式排列，就像它是一个整体一样
// |First part |
// |and second |
// |part       |

<View>
  <Text>First part and </Text>
  <Text>second part</Text>
</View>
// View 容器：每个文本都是自己的块
// |First part and|
// |second part   |

// 否则，文本将在其自己的块中流动
// |First part |
// |and        |
// |second part|
```

## 有限的样式继承

在 Web 上，为整个文档设置字体家族和大小的常用方法是利用继承的 CSS 属性，如下所示：

```css
html {
  font-family:
    'lucida grande', tahoma, verdana, arial, sans-serif;
  font-size: 11px;
  color: #141823;
}
```

文档中的所有元素都将继承此字体，除非它们或其父元素之一指定了新规则。

在 React Native 中，我们对此更加严格：**你必须将所有文本节点包装在 `<Text>` 组件内**。你不能在 `<View>` 下直接拥有文本节点。

```tsx
// 错误：将抛出异常，不能有文本节点作为 <View> 的子节点
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

你也失去了为整个子树设置默认字体的能力。同时，`fontFamily` 只接受单个字体名称，这与 CSS 中的 `font-family` 不同。在整个应用程序中使用一致字体和大小的推荐方法是创建一个包含它们的组件 `MyAppText`，并在整个应用程序中使用此组件。你也可以使用此组件创建更具体的组件，如 `MyAppHeaderText` 用于其他类型的文本。

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

以这种方式组合 `MyAppText` 确保我们获得来自顶层组件的样式，但使我们在特定用例中添加/覆盖它们的能力。

React Native 仍然有样式继承的概念，但仅限于文本子树。在这种情况下，第二部分将既是粗体又是红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们相信这种更受限的文本样式方式将产生更好的应用程序：

- (开发者) React 组件的设计具有强大的隔离性：你应该能够将组件放在应用程序的任何地方，相信只要属性相同，它的外观和行为方式就会相同。可以从属性外部继承的文本属性将破坏这种隔离。

- (实现者) React Native 的实现也得到了简化。我们不需要在每个元素上都有一个 `fontFamily` 字段，也不需要每次显示文本节点时都可能遍历树直到根节点。样式继承仅编码在原生 Text 组件内部，不会泄漏到其他组件或系统本身。

---

# 参考

## 属性

### `accessibilityHint`

无障碍提示帮助用户理解当他们在无障碍元素上执行操作时会发生什么，当结果从无障碍标签中不清楚时。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

表示屏幕阅读器在与元素交互时应使用哪种语言的值。它应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

请参阅 [iOS `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage) 以获取更多信息。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖用户与元素交互时屏幕阅读器读取的文本。默认情况下，标签是通过遍历所有子元素并累积所有由空格分隔的 `Text` 节点构建的。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告诉屏幕阅读器将当前聚焦的元素视为具有特定角色。

在 iOS 上，这些角色映射到相应的无障碍特性。图像按钮的功能与将特性设置为“image”和“button”相同。请参阅 [无障碍指南](accessibility.md#accessibilitytraits-ios) 以获取更多信息。

在 Android 上，这些角色在 TalkBack 上具有类似的功能，就像在 iOS 上的 Voiceover 中添加无障碍特性一样。

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告诉屏幕阅读器将当前聚焦的元素视为处于特定状态。

你可以提供一个状态、无状态或多个状态。状态必须通过对象传递，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

无障碍操作允许辅助技术以编程方式调用组件的操作。`accessibilityActions` 属性应包含一个操作对象列表。每个操作对象应包含字段名称和标签。

请参阅 [无障碍指南](accessibility.md#accessibility-actions) 以获取更多信息。

| 类型  | 必需 |
| ----- | -------- |
| array | 否       |

---

### `onAccessibilityAction`

当用户执行无障碍操作时调用。此函数的唯一参数是包含要执行的操作名称的事件。

请参阅 [无障碍指南](accessibility.md#accessibility-actions) 以获取更多信息。

| 类型     | 必需 |
| -------- | -------- |
| function | 否       |

---

### `accessible`

当设置为 `true` 时，表示视图是一个无障碍元素。

请参阅 [无障碍指南](accessibility#accessible-ios-android) 以获取更多信息。

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

指定字体是否应缩放以尊重文本大小无障碍设置。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `true`  |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API Level 23+ 上确定单词断行时使用的自动连字符频率。

| 类型                                | 默认值  |
| ----------------------------------- | -------- |
| enum(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

表示元素正在被修改，辅助技术可能希望在通知用户更新之前等待更改完成。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-checked`

表示可检查元素的状态。此字段可以采用布尔值或 "mixed" 字符串来表示混合复选框。

| 类型             | 默认值 |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

---

### `aria-disabled`

表示元素是可感知的但已禁用，因此不可编辑或以其他方式操作。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-expanded`

表示可展开元素当前是展开还是折叠。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | false   |

---

### `aria-label`

定义标记交互式元素的字符串值。

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

确定文本元素中转换为可点击 URL 的数据类型。默认情况下，不检测任何数据类型。

你只能提供一种类型。

| 类型                                                          | 默认值  |
| ------------------------------------------------------------- | -------- |
| enum(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

指定文本视图的禁用状态以用于测试目的。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

要在 iOS 上应用于此元素的 [动态类型](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 等级。

| 类型                                                                                                                                                     | 默认值  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| enum(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

当设置 `numberOfLines` 时，此属性定义文本将如何被截断。`numberOfLines` 必须与此属性结合设置。

这可以是以下值之一：

- `head` - 显示行以便末尾适合容器，行开头缺失的文本由省略号字形指示。例如，"...wxyz"
- `middle` - 显示行以便开头和末尾适合容器，中间缺失的文本由省略号字形指示。"ab...yz"
- `tail` - 显示行以便开头适合容器，行末尾缺失的文本由省略号字形指示。例如，"abcd..."
- `clip` - 行不会绘制在文本容器边缘之外。

:::note
在 Android 上，当 `numberOfLines` 设置为高于 `1` 的值时，只有 `tail` 值能正常工作。
:::

| 类型                                           | 默认值 |
| ---------------------------------------------- | ------- |
| enum(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码定位此视图。优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定当 `allowFontScaling` 启用时字体可达到的最大缩放比例。可能的值：

- `null/undefined`：从父节点或全局默认值继承 (0)
- `0`：无最大值，忽略父节点/全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为此值

| 类型   | 默认值     |
| ------ | ----------- |
| number | `undefined` |

---

### `minimumFontScale`

指定当 `adjustsFontSizeToFit` 启用时字体可达到的最小缩放比例。(值 0.01-1.0)。

| 类型   |
| ------ |
| number |

---

### `nativeID`

用于从原生代码定位此视图。

| 类型   |
| ------ |
| string |

---

### `numberOfLines`

用于在计算文本布局后用省略号截断文本，包括换行，使得总行数不超过此数字。将此属性设置为 `0` 将导致取消设置此值，这意味着不会应用行限制。

此属性通常与 `ellipsizeMode` 一起使用。

| 类型   | 默认值 |
| ------ | ------- |
| number | `0`     |

---

### `onLayout`

在挂载和布局更改时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

此函数在长按时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onMoveShouldSetResponder`

此视图想要“声明”触摸响应吗？当 `View` 不是响应者时，每次触摸移动都会调用此函数。

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

当触摸开始时立即调用，在 `onPressOut` 和 `onPress` 之前。

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

视图现在正在响应触摸事件。这是高亮显示并向用户展示正在发生的事情的时候。

在 Android 上，从此回调返回 true 以防止任何其他原生组件成为响应者，直到此响应者终止。

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

响应者已被从 `View` 移除。可能在调用 `onResponderTerminationRequest` 后被其他视图接管，或者可能被操作系统无需询问而接管（例如，在 iOS 上与控制中心/通知中心一起发生）

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

其他 `View` 想要成为响应者，并要求此 `View` 释放其响应者。返回 `true` 允许其释放。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

如果父 `View` 想要防止子 `View` 在触摸开始时成为响应者，它应该具有此处理程序并返回 `true`。

| 类型                                                      |
| --------------------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onTextLayout`

在文本布局更改时调用。

| 类型                                                 |
| ---------------------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图被禁用时，这定义了在按钮停用之前你的触摸可以移动多远。一旦停用，尝试将其移回，你会看到按钮再次被激活！当滚动视图被禁用时，来回移动几次。确保你传入一个常量以减少内存分配。

| 类型                 |
| -------------------- |
| [Rect](rect), number |

---

### `ref`

一个 ref 设置器，挂载时将被分配一个 [元素节点](element-nodes)。

请注意，`Text` 组件不提供文本节点，就像 Web 上的段落元素 (`<p>`) 是元素节点而不是文本节点一样。文本节点可以作为它们的子节点找到。

---

### `role`

`role` 向辅助技术的用户传达组件的目的。优先级高于 [`accessibilityRole`](text#accessibilityrole) 属性。

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
| [文本样式](text-style-props), [View 样式属性](view-style-props) |

---

### `suppressHighlighting` <div className="label ios">iOS</div>

当为 `true` 时，按下文本时不会进行视觉更改。默认情况下，按下时灰色椭圆高亮显示文本。

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

设置 Android API Level 23+ 上的文本断行策略，可能的值是 `simple`, `highQuality`, `balanced`。

| 类型                                            | 默认值       |
| ----------------------------------------------- | ------------- |
| enum(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

设置 iOS 14+ 上的换行策略。可能的值是 `none`, `standard`, `hangul-word` 和 `push-out`。

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
| ascender  | number | 否   | 文本布局更改后的行上升高度。             |
| capHeight | number | 否   | 基线上方大写字母的高度。                        |
| descender | number | 否   | 文本布局更改后的行下降高度。            |
| height    | number | 否   | 文本布局更改后的行高。                   |
| width     | number | 否   | 文本布局更改后的行宽。                    |
| x         | number | 否   | Text 组件内部的行 X 坐标。                        |
| xHeight   | number | 否   | 基线与行中线之间的距离（字身大小）。 |
| y         | number | 否   | Text 组件内部的行 Y 坐标。                        |

### TextLayoutEvent

`TextLayoutEvent` 对象在组件布局更改时作为回调结果返回。它包含一个名为 `lines` 的键，其值是一个数组，包含对应于每个渲染文本行的 [`TextLayout`](text#textlayout) 对象。

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
| lines  | [TextLayout](text#textlayout) 数组 | 否   | 提供每个渲染行的 TextLayout 数据。 |
| target | number                                  | 否   | 元素的节点 ID。                           |
