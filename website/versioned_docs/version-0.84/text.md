---
id: text
title: 文本
---

一个用于显示文本的 React 组件。

`Text` 支持嵌套、样式和触摸处理。

在下面的示例中，嵌套的标题和正文文本将继承 `styles.baseText` 中的 `fontFamily`，但标题提供了自己的附加样式。标题和正文将因为字面换行符而堆叠显示：

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

Android 和 iOS 都允许你通过注释字符串范围以指定加粗或彩色文字等格式来显示格式化的文本（iOS 上为 `NSAttributedString`，Android 上为 `SpannableString`）。实际上，这非常繁琐。对于 React Native，我们决定采用 Web 的做法，通过嵌套文本来实现相同效果。

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

在幕后，React Native 会将其转换为一个扁平的 `NSAttributedString` 或 `SpannableString`，包含如下信息：

```
"I am bold and red"
0-9: 加粗
9-17: 加粗，红色
```

## 容器

`<Text>` 元素相较于布局是独特的：其内部不再使用 Flexbox 布局，而是使用文本布局。这意味着 `<Text>` 中的元素不再是矩形，而是在遇到行尾时换行。

```tsx
<Text>
  <Text>First part and </Text>
  <Text>second part</Text>
</Text>
// Text 容器：文本会行内显示，如果空间允许的话
// |First part and second part|

// 否则，文本将像一个整体流式显示
// |First part |
// |and second |
// |part       |

<View>
  <Text>First part and </Text>
  <Text>second part</Text>
</View>
// View 容器：每个文本是独立块
// |First part and|
// |second part   |

// 否则，文本会各自流式显示在块内
// |First part |
// |and        |
// |second part|
```

## 有限的样式继承

在 Web 上，为整个文档设置字体家族和大小的常用方法是利用继承的 CSS 属性，如下：

```css
html {
  font-family:
    'lucida grande', tahoma, verdana, arial, sans-serif;
  font-size: 11px;
  color: #141823;
}
```

文档中的所有元素都将继承该字体，除非它们或它们的某个父元素指定了新的规则。

在 React Native 中，限制更严格：**你必须把所有文本节点包裹在 `<Text>` 组件内**。不能让文本节点直接在 `<View>` 下。

```tsx
// 错误：会引发异常，不能让文本节点作为 <View> 的子节点
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

你也无法为整个子树设置默认字体。同时，`fontFamily` 仅接受单个字体名称，区别于 CSS 中的 `font-family`。推荐的做法是在应用内创建一个包含统一字体和大小的组件 `MyAppText`，在全应用中使用它。你也可以用它去创建更具体的组件，如 `MyAppHeaderText` 用于其他种类文本。

```tsx
<View>
  <MyAppText>
    使用全应用默认字体样式的文本
  </MyAppText>
  <MyAppHeaderText>作为标题样式的文本</MyAppHeaderText>
</View>
```

假设 `MyAppText` 是一个只渲染其子节点到带样式的 `Text` 组件的组件，那么 `MyAppHeaderText` 可以定义如下：

```tsx
const MyAppHeaderText = ({children}) => {
  return (
    <MyAppText>
      <Text style={{fontSize: 20}}>{children}</Text>
    </MyAppText>
  );
};
```

这样组合 `MyAppText`，保证了能从顶层组件获得样式，但同时又能在特定场景下添加/覆盖样式。

React Native 仍然存在样式继承的概念，但仅限于文本子树。在这种情况下，第二部分文本将同时是加粗和红色。

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

我们认为这种受限的文本样式设定方式会带来更好的应用：

- （开发者）React 组件设计时有强隔离性：你应能把组件放进应用任何位置，只要 props 不变，它表现和外观都一样。能从外部继承的文本属性会破坏这种隔离。

- （实现者）React Native 的实现也更简化。我们不需要在每个元素上维护一个 `fontFamily` 字段，也不用每次展示文本节点时可能向上遍历树到根部。样式继承只编码在原生 Text 组件内，不泄露到其它组件或系统。

---

# 参考

## 属性

### `accessibilityHint`

辅助功能提示，帮助用户了解在当前辅助元素上执行操作会发生什么情况，当仅靠辅助标签不能明确告知时使用。

| 类型   |
| ------ |
| string |

---

### `accessibilityLanguage` <div className="label ios">iOS</div>

指示屏幕阅读器在用户与元素交互时应使用哪种语言。应遵循 [BCP 47 规范](https://www.rfc-editor.org/info/bcp47)。

详情见 [iOS 的 `accessibilityLanguage` 文档](https://developer.apple.com/documentation/objectivec/nsobject/1615192-accessibilitylanguage)。

| 类型   |
| ------ |
| string |

---

### `accessibilityLabel`

覆盖屏幕阅读器读取的文本。默认情况下，标签会通过遍历所有子元素并累积所有 `Text` 节点（用空格分隔）构建。

| 类型   |
| ------ |
| string |

---

### `accessibilityRole`

告知屏幕阅读器当前聚焦元素的特定角色。

iOS 上，这些角色映射成对应的辅助功能特征。图像按钮的功能相当于同时设置了 'image' 和 'button' 特征。详见 [辅助功能指南](accessibility.md#accessibilitytraits-ios)。

Android 上，这些角色在 TalkBack 中的功能类似于在 iOS VoiceOver 中添加辅助功能特征。

| 类型                                                 |
| ---------------------------------------------------- |
| [AccessibilityRole](accessibility#accessibilityrole) |

---

### `accessibilityState`

告知屏幕阅读器当前聚焦元素处于某种状态。

可以提供一个状态、无状态或多个状态。状态必须通过一个对象传入，例如 `{selected: true, disabled: true}`。

| 类型                                                   |
| ------------------------------------------------------ |
| [AccessibilityState](accessibility#accessibilitystate) |

---

### `accessibilityActions`

辅助功能动作允许辅助技术以编程方式调用组件动作。`accessibilityActions` 属性应包含动作对象列表。每个动作对象应包含名称和标签字段。

详情见 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型  | 必填   |
| ----- | ------ |
| array | 否     |

---

### `onAccessibilityAction`

用户执行辅助操作时调用。该函数的唯一参数是一个包含动作名称的事件。

详情见 [辅助功能指南](accessibility.md#accessibility-actions)。

| 类型     | 必填   |
| -------- | ------ |
| function | 否     |

---

### `accessible`

设置为 `true` 表示该视图是一个辅助功能元素。

详情见 [辅助功能指南](accessibility#accessible-ios-android)。

| 类型    | 默认   |
| ------- | ------ |
| boolean | `true` |

---

### `adjustsFontSizeToFit`

指定字体是否应自动缩小以适应给定的样式限制。

| 类型    | 默认   |
| ------- | ------ |
| boolean | `false` |

---

### `allowFontScaling`

指定字体是否应响应文本大小辅助设置进行缩放。

| 类型    | 默认   |
| ------- | ------ |
| boolean | `true` |

---

### `android_hyphenationFrequency` <div className="label android">Android</div>

设置在 Android API 23+ 上自动断字的频率。

| 类型                                | 默认    |
| ----------------------------------- | ------- |
| 枚举(`'none'`, `'normal'`,`'full'`) | `'none'` |

---

### `aria-busy`

指示元素正在被修改，辅助技术可能会等待更改完成后再告知用户。

| 类型    | 默认   |
| ------- | ------ |
| boolean | false  |

---

### `aria-checked`

指示可勾选元素的状态。该字段可以是布尔值或表示混合状态的字符串 "mixed"。

| 类型             | 默认   |
| ---------------- | ------ |
| boolean, 'mixed'  | false  |

---

### `aria-disabled`

指示元素可感知但禁用，不可编辑或操作。

| 类型    | 默认   |
| ------- | ------ |
| boolean | false  |

---

### `aria-expanded`

指示可展开元素当前是展开还是折叠状态。

| 类型    | 默认   |
| ------- | ------ |
| boolean | false  |

---

### `aria-label`

定义用于标记交互式元素的字符串值。

| 类型   |
| ------ |
| string |

---

### `aria-selected`

指示可选元素当前是否被选中。

| 类型    |
| ------- |
| boolean |

### `dataDetectorType` <div className="label android">Android</div>

确定文本元素中被转为可点击 URL 的数据类型。默认不检测任何数据类型。

只可以提供一个类型。

| 类型                                                          | 默认    |
| ------------------------------------------------------------- | ------- |
| 枚举(`'phoneNumber'`, `'link'`, `'email'`, `'none'`, `'all'`) | `'none'` |

---

### `disabled` <div className="label android">Android</div>

指定文本视图的禁用状态，主要用于测试目的。

| 类型 | 默认   |
| ---- | ------ |
| bool | `false` |

---

### `dynamicTypeRamp` <div className="label ios">iOS</div>

应用于 iOS 上的 [动态字体](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically) 级别。

| 类型                                                                                         | 默认    |
| -------------------------------------------------------------------------------------------- | ------- |
| 枚举(`'caption2'`, `'caption1'`, `'footnote'`, `'subheadline'`, `'callout'`, `'body'`, `'headline'`, `'title3'`, `'title2'`, `'title1'`, `'largeTitle'`) | `'body'` |

---

### `ellipsizeMode`

设置当 `numberOfLines` 被设定时文本的截断方式。`numberOfLines` 必须与该属性配合使用。

可选值：

- `head` - 文本末尾显示完整，开头被省略号替代，例如 "...wxyz"
- `middle` - 文本开头和末尾显示完整，中间被省略号替代，例如 "ab...yz"
- `tail` - 文本开头显示完整，末尾被省略号替代，例如 "abcd..."
- `clip` - 不显示超过文本容器边界的部分

:::note
在 Android 上，当 `numberOfLines` 大于 1 时，只有 `tail` 能正常工作。
:::

| 类型                                           | 默认    |
| ---------------------------------------------- | ------- |
| 枚举(`'head'`, `'middle'`, `'tail'`, `'clip'`) | `tail`  |

---

### `id`

用于从原生代码定位该视图。优先级高于 `nativeID` 属性。

| 类型   |
| ------ |
| string |

---

### `maxFontSizeMultiplier`

指定当启用 `allowFontScaling` 时字体可达到的最大缩放倍数。可能值：

- `null/undefined`：继承父节点或全局默认值（0）
- `0`：无限制，忽略父/全局默认值
- `>= 1`：将本节点的最大字体缩放倍数设置为该值

| 类型   | 默认       |
| ------ | ---------- |
| number | `undefined` |

---

### `minimumFontScale`

指定当启用 `adjustsFontSizeToFit` 时字体可达到的最小缩放倍数（范围 0.01-1.0）。

| 类型   |
| ------ |
| number |

---

### `nativeID`

用于从原生代码定位该视图。

| 类型   |
| ------ |
| string |

---

### `numberOfLines`

限制文本显示的最大行数，计算文本布局（包括换行）后，超出部分截断加省略号。设置为 `0` 表示不限制行数。

通常与 `ellipsizeMode` 一起使用。

| 类型   | 默认   |
| ------ | ------ |
| number | `0`    |

---

### `onLayout`

组件挂载与布局变化时调用。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onLongPress`

长按时调用的函数。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onMoveShouldSetResponder`

视图是否想成为触摸响应者的判断函数。当视图不是响应者时，每次触摸移动都会调用。

| 类型                                      |
| ----------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onPress`

用户按压时调用，在 `onPressOut` 后触发。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressIn`

触摸开始时立即调用，在 `onPressOut` 和 `onPress` 之前。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

触摸释放时调用。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderGrant`

视图开始响应触摸事件。此时可高亮显示以提示用户。

在 Android 上，返回 true 以阻止其它原生组件成为响应者，直到当前响应者终止。

| 类型                                          |
| --------------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void ｜ boolean` |

---

### `onResponderMove`

用户手指移动时调用。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderRelease`

触摸结束时调用。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminate`

响应者被移交至他人。可能是其它视图调用 `onResponderTerminationRequest` 后取得，或系统无须同意强行取得（如 iOS 上控制中心/通知中心弹出时）。

| 类型                                     |
| ---------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onResponderTerminationRequest`

有其它视图请求成为响应者，询问当前视图是否愿意释放响应权。返回 `true` 表示允许。

| 类型                                      |
| ----------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onStartShouldSetResponderCapture`

父视图想阻止子视图在触摸开始时成为响应者时，应实现此函数并返回 `true`。

| 类型                                      |
| ----------------------------------------- |
| `md ({nativeEvent: [PressEvent](pressevent)}) => boolean` |

---

### `onTextLayout`

文本布局改变时调用。

| 类型                                     |
| ---------------------------------------- |
| ([`TextLayoutEvent`](text#textlayoutevent)) => mixed |

---

### `pressRetentionOffset`

当滚动视图禁用时，定义触摸离开按钮多远之前按钮仍保持激活状态。若超出该范围，则按钮失效。重新移回按钮范围按钮将重新激活。建议传递常量以减少内存分配。

| 类型               |
| ------------------ |
| [Rect](rect), number |

---

### `ref`

一个 Ref 设置器，挂载时赋值为一个 [元素节点](element-nodes)。

注意，`Text` 组件不提供文本节点，就像 Web 上的段落元素 (`<p>`) 是元素节点而非文本节点一样。文本节点可在其子节点中找到。

---

### `role`

`role` 向辅助技术用户传达组件目的。优先于 [`accessibilityRole`](text#accessibilityrole) 属性。

| 类型                     |
| ------------------------ |
| [Role](accessibility#role) |

---

### `selectable`

允许用户选择文本，使用系统本地的复制粘贴功能。

| 类型    | 默认   |
| ------- | ------ |
| boolean | `false` |

---

### `selectionColor` <div className="label android">Android</div>

文本选中时的高亮颜色。

| 类型           |
| -------------- |
| [color](colors) |

---

### `style`

| 类型                                                                 |
| -------------------------------------------------------------------- |
| [文本样式](text-style-props), [视图样式属性](view-style-props)         |

---

### `suppressHighlighting` <div className="label ios">iOS</div>

设置为 `true` 时，按下文本时无视觉变化。默认按下时会显示灰色椭圆高亮。

| 类型    | 默认   |
| ------- | ------ |
| boolean | `false` |

---

### `testID`

用于端到端测试中定位此视图。

| 类型   |
| ------ |
| string |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API 23+ 上设置文本换行策略，可选 `simple`、`highQuality`、`balanced`。

| 类型                                           | 默认         |
| ---------------------------------------------- | ------------ |
| 枚举(`'simple'`, `'highQuality'`, `'balanced'`) | `highQuality` |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

iOS 14+ 上设置换行策略。可选值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                         | 默认    |
| ------------------------------------------------------------ | ------- |
| 枚举(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`)  | `'none'` |

## 类型定义

### TextLayout

`TextLayout` 对象是 [`TextLayoutEvent`](text#textlayoutevent) 回调中的一部分，包含 `Text` 行的测量数据。

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

| 名称       | 类型    | 可选  | 描述                                                     |
| ---------- | ------- | ----- | -------------------------------------------------------- |
| ascender   | number  | 否    | 文本布局改变后行的升部高度。                             |
| capHeight  | number  | 否    | 大写字母基线以上的高度。                                 |
| descender  | number  | 否    | 文本布局改变后行的降部高度。                             |
| height     | number  | 否    | 文本布局改变后行的高度。                                 |
| width      | number  | 否    | 文本布局改变后行的宽度。                                 |
| x          | number  | 否    | 行在 Text 组件内的 X 坐标。                              |
| xHeight    | number  | 否    | 基线到行中体（x-height）之间的距离。                     |
| y          | number  | 否    | 行在 Text 组件内的 Y 坐标。                              |

### TextLayoutEvent

`TextLayoutEvent` 对象作为回调中组件布局改变的结果返回。包含键 `lines`，值为对应每行渲染文本的 [`TextLayout`](text#textlayout) 对象数组。

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

| 名称   | 类型                                   | 可选  | 描述                                      |
| ------ | -------------------------------------- | ----- | ----------------------------------------- |
| lines  | [`TextLayout`](text#textlayout) 数组  | 否    | 提供每行渲染文本的布局数据。              |
| target | number                                | 否    | 元素的节点 ID。                           |