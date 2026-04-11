---
id: textinput
title: TextInput
---

通过键盘向应用输入文本的基础组件。Props 提供了几种功能的可配置性，例如自动纠正、自动大写、占位符文本和不同的键盘类型，例如数字键盘。

最基本的用例是放置一个 `TextInput` 并订阅 `onChangeText` 事件以读取用户输入。还有其他事件，例如 `onSubmitEditing` 和 `onFocus` 可以订阅。一个最小化的例子：

```SnackPlayer name=TextInput%20Example
import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default TextInputExample;
```

通过原生元素暴露的两个方法是 `.focus()` 和 `.blur()`，它们将以编程方式聚焦或失焦 TextInput。

请注意，某些 props 仅在 `multiline={true/false}` 时可用。此外，仅应用于元素一侧的边框样式（例如 `borderBottomColor`、`borderLeftWidth` 等）在 `multiline=true` 时将不会应用。为了实现相同的效果，你可以将 `TextInput` 包裹在 `View` 中：

```SnackPlayer name=Multiline%20TextInput%20Example
import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const MultilineTextInputExample = () => {
  const [value, onChangeText] = React.useState('Useless Multiline Placeholder');

  // 如果你在文本框中输入的内容是一种颜色，
  // 背景将会变为该颜色。
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: value.toLowerCase(),
        }}>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={text => onChangeText(text)}
          value={value}
          style={styles.textInput}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    margin: 12,
  },
});

export default MultilineTextInputExample;
```

`TextInput` 默认在其视图底部有一个边框。此边框的填充由系统提供的背景图像设置，无法更改。避免这种情况的解决方案是 either 不显式设置高度，在这种情况下系统将负责在正确位置显示边框，或者通过将 `underlineColorAndroid` 设置为 transparent 来不显示边框。

请注意，在 Android 上，在输入中进行文本选择可能会将应用的 activity `windowSoftInputMode` 参数更改为 `adjustResize`。这可能会导致具有 position: 'absolute' 的组件在键盘活动时出现问题。要避免此行为，请在 AndroidManifest.xml 中指定 `windowSoftInputMode` ( https://developer.android.com/guide/topics/manifest/activity-element.html ) 或使用原生代码以编程方式控制此参数。

---

# 参考

## 属性

### [View 属性](view.md#props)

继承 [View 属性](view.md#props)。

---

### `allowFontScaling`

指定字体是否应缩放以尊重文本大小无障碍设置。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoCapitalize`

告诉 `TextInput` 自动大写某些字符。此属性不受某些键盘类型支持，例如 `name-phone-pad`。

- `characters`: 所有字符。
- `words`: 每个单词的首字母。
- `sentences`: 每个句子的首字母 (_默认_)。
- `none`: 不自动大写任何内容。

| 类型                                             |
| ------------------------------------------------ |
| enum('none', 'sentences', 'words', 'characters') |

---

### `autoComplete`

指定系统的自动完成提示，以便它可以提供自动填充。在 Android 上，系统将始终尝试通过使用启发式方法识别内容类型来提供自动填充。要禁用自动完成，请将 `autoComplete` 设置为 `off`。

以下值跨平台有效：

- `additional-name`
- `address-line1`
- `address-line2`
- `birthdate-day` (iOS 17+)
- `birthdate-full` (iOS 17+)
- `birthdate-month` (iOS 17+)
- `birthdate-year` (iOS 17+)
- `cc-csc` (iOS 17+)
- `cc-exp` (iOS 17+)
- `cc-exp-day` (iOS 17+)
- `cc-exp-month` (iOS 17+)
- `cc-exp-year` (iOS 17+)
- `cc-number`
- `country`
- `current-password`
- `email`
- `family-name`
- `given-name`
- `honorific-prefix`
- `honorific-suffix`
- `name`
- `new-password`
- `off`
- `one-time-code`
- `postal-code`
- `street-address`
- `tel`
- `username`

<div className="label basic ios">iOS</div>

以下值仅在 iOS 上有效：

- `cc-family-name` (iOS 17+)
- `cc-given-name` (iOS 17+)
- `cc-middle-name` (iOS 17+)
- `cc-name` (iOS 17+)
- `cc-type` (iOS 17+)
- `nickname`
- `organization`
- `organization-title`
- `url`

<div className="label basic android">Android</div>

以下值仅在 Android 上有效：

- `gender`
- `name-family`
- `name-given`
- `name-middle`
- `name-middle-initial`
- `name-prefix`
- `name-suffix`
- `password`
- `password-new`
- `postal-address`
- `postal-address-country`
- `postal-address-extended`
- `postal-address-extended-postal-code`
- `postal-address-locality`
- `postal-address-region`
- `sms-otp`
- `tel-country-code`
- `tel-device`
- `tel-national`
- `username-new`

| 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('additional-name', 'address-line1', 'address-line2', 'birthdate-day', 'birthdate-full', 'birthdate-month', 'birthdate-year', 'cc-csc', 'cc-exp', 'cc-exp-day', 'cc-exp-month', 'cc-exp-year', 'cc-number', 'country', 'current-password', 'email', 'family-name', 'given-name', 'honorific-prefix', 'honorific-suffix', 'name', 'new-password', 'off', 'one-time-code', 'postal-code', 'street-address', 'tel', 'username', 'cc-family-name', 'cc-given-name', 'cc-middle-name', 'cc-name', 'cc-type', 'nickname', 'organization', 'organization-title', 'url', 'gender', 'name-family', 'name-given', 'name-middle', 'name-middle-initial', 'name-prefix', 'name-suffix', 'password', 'password-new', 'postal-address', 'postal-address-country', 'postal-address-extended', 'postal-address-extended-postal-code', 'postal-address-locality', 'postal-address-region', 'sms-otp', 'tel-country-code', 'tel-device', 'tel-national', 'username-new') |

---

### `autoCorrect`

如果为 `false`，禁用自动纠正。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoFocus`

如果为 `true`，聚焦输入框。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `blurOnSubmit`

> **已弃用。** 请注意 `submitBehavior` 现在取代了 `blurOnSubmit` 并将覆盖 `blurOnSubmit` 定义的任何行为。参见 [submitBehavior](textinput#submitbehavior)

如果为 `true`，提交时文本字段将失焦。单行字段的默认值为 true，多行字段的默认值为 false。请注意，对于多行字段，将 `blurOnSubmit` 设置为 `true` 意味着按下返回键将使字段失焦并触发 `onSubmitEditing` 事件，而不是在字段中插入换行符。

| 类型 |
| ---- |
| bool |

---

### `caretHidden`

如果为 `true`，隐藏光标。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `clearButtonMode` <div className="label ios">iOS</div>

清除按钮何时应出现在文本视图右侧。此属性仅支持单行 TextInput 组件。默认值为 `never`。

| 类型                                                       |
| ---------------------------------------------------------- |
| enum('never', 'while-editing', 'unless-editing', 'always') |

---

### `clearTextOnFocus` <div className="label ios">iOS</div>

如果为 `true`，当编辑开始时自动清除文本字段。

| 类型 |
| ---- |
| bool |

---

### `contextMenuHidden`

如果为 `true`，隐藏上下文菜单。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `dataDetectorTypes` <div className="label ios">iOS</div>

确定文本输入中转换为可点击 URL 的数据类型。仅在 `multiline={true}` 和 `editable={false}` 时有效。默认情况下不检测数据类型。

你可以提供一种类型或多种类型的数组。

`dataDetectorTypes` 的可能值为：

- `'phoneNumber'`
- `'link'`
- `'address'`
- `'calendarEvent'`
- `'none'`
- `'all'`

| 类型                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all'), ,array of enum('phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all') |

---

### `defaultValue`

提供一个初始值，当用户开始输入时该值将改变。适用于你不想处理监听事件和更新 value prop 以保持受控状态同步的用例。

| 类型   |
| ------ |
| string |

---

### `disableKeyboardShortcuts` <div className="label ios">iOS</div>

如果为 `true`，禁用键盘快捷键（撤销/重做和复制按钮）。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `cursorColor` <div className="label android">Android</div>

当提供时，它将设置组件中光标（或 "caret"）的颜色。与 `selectionColor` 的行为不同，光标颜色将独立于文本选择框的颜色进行设置。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `disableFullscreenUI` <div className="label android">Android</div>

当 `false` 时，如果文本输入周围有少量可用空间（例如手机上的横向方向），操作系统可能会选择让用户在全屏文本输入模式下编辑文本。当 `true` 时，此功能被禁用，用户将始终直接在文本输入内编辑文本。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `editable`

如果为 `false`，文本不可编辑。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `enablesReturnKeyAutomatically` <div className="label ios">iOS</div>

如果为 `true`，当没有文本时键盘禁用返回键，并在有文本时自动启用它。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `enterKeyHint`

确定返回键上应显示什么文本。优先于 `returnKeyType` prop。

以下值跨平台有效：

- `done`
- `next`
- `search`
- `send`
- `go`

_仅 Android_

以下值仅在 Android 上有效：

- `previous`

_仅 iOS_

以下值仅在 iOS 上有效：

- `enter`

| 类型                                                              |
| ----------------------------------------------------------------- |
| enum('enter', 'done', 'next', 'previous', 'search', 'send', 'go') |

---

### `importantForAutofill` <div className="label android">Android</div>

告诉操作系统你的应用中的各个字段是否应包含在 Android API Level 26+ 的自动完成视图结构中。可能的值为 `auto`、`no`、`noExcludeDescendants`、`yes` 和 `yesExcludeDescendants`。默认值为 `auto`。

- `auto`: 让 Android 系统使用其启发式方法确定视图是否对自动完成重要。
- `no`: 此视图对自动完成不重要。
- `noExcludeDescendants`: 此视图及其子项对自动完成不重要。
- `yes`: 此视图对自动完成重要。
- `yesExcludeDescendants`: 此视图对自动完成重要，但其子项对自动完成不重要。

| 类型                                                                       |
| -------------------------------------------------------------------------- |
| enum('auto', 'no', 'noExcludeDescendants', 'yes', 'yesExcludeDescendants') |

---

### `inlineImageLeft` <div className="label android">Android</div>

如果定义，提供的图像资源将渲染在左侧。图像资源必须位于 `/android/app/src/main/res/drawable` 内并引用如下

```
<TextInput
 inlineImageLeft='search_icon'
/>
```

| 类型   |
| ------ |
| string |

---

### `inlineImagePadding` <div className="label android">Android</div>

内联图像（如果有）与文本输入本身之间的填充。

| 类型   |
| ------ |
| number |

---

### `inputAccessoryViewID` <div className="label ios">iOS</div>

一个可选标识符，将自定义 [InputAccessoryView](inputaccessoryview.md) 链接到此文本输入。当此文本输入聚焦时，InputAccessoryView 将渲染在键盘上方。

| 类型   |
| ------ |
| string |

---

### `inputAccessoryViewButtonLabel` <div className="label ios">iOS</div>

一个可选标签，覆盖默认 [InputAccessoryView](inputaccessoryview.md) 按钮标签。

默认情况下，默认按钮标签未本地化。使用此属性提供本地化版本。

| 类型   |
| ------ |
| string |

---

### `inputMode`

工作原理类似于 HTML 中的 `inputmode` 属性，它确定打开哪个键盘，例如 `numeric`，并且优先于 `keyboardType`。

支持以下值：

- `none`
- `text`
- `decimal`
- `numeric`
- `tel`
- `search`
- `email`
- `url`

| 类型                                                                        |
| --------------------------------------------------------------------------- |
| enum('decimal', 'email', 'none', 'numeric', 'search', 'tel', 'text', 'url') |

---

### `keyboardAppearance` <div className="label ios">iOS</div>

确定键盘的颜色。

| 类型                             |
| -------------------------------- |
| enum('default', 'light', 'dark') |

---

### `keyboardType`

确定打开哪个键盘，例如 `numeric`。

[在此处](https://davidl.fr/blog/keyboard-react-native-ios-android#all-react-native-keyboard-type-examples-i-os-on-the-left-android-on-the-right) 查看所有类型的截图。

以下值跨平台有效：

- `default`
- `number-pad`
- `decimal-pad`
- `numeric`
- `email-address`
- `phone-pad`
- `url`

_仅 iOS_

以下值仅在 iOS 上有效：

- `ascii-capable`
- `numbers-and-punctuation`
- `name-phone-pad`
- `twitter`
- `web-search`

_仅 Android_

以下值仅在 Android 上有效：

- `visible-password`

| 类型                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search', 'visible-password') |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14+ 上设置换行策略。可能的值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值  |
| ----------------------------------------------------------- | -------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

---

### `lineBreakModeIOS` <div className="label ios">iOS</div>

在 iOS 上设置换行模式。可能的值为 `wordWrapping`、`char`、`clip`、`head`、`middle` 和 `tail`。

| 类型                                                                       | 默认值          |
| -------------------------------------------------------------------------- | ---------------- |
| enum(`'wordWrapping'`, `'char'`, `'clip'`, `'head'`, `'middle'`, `'tail'`) | `'wordWrapping'` |

---

### `maxFontSizeMultiplier`

指定当 `allowFontScaling` 启用时字体可达到的最大缩放比例。可能的值：

- `null/undefined` (默认): 从父节点或全局默认值 (0) 继承
- `0`: 无最大值，忽略父节点/全局默认值
- `>= 1`: 将此节点的 `maxFontSizeMultiplier` 设置为此值

| 类型   |
| ------ |
| number |

---

### `maxLength`

限制可输入的最大字符数。使用此代替在 JS 中实现逻辑以避免闪烁。

| 类型   |
| ------ |
| number |

---

### `multiline`

如果为 `true`，文本输入可以是多行。默认值为 `false`。

:::note
值得注意的是，这在 iOS 上将文本对齐到顶部，而在 Android 上居中对齐。在两个平台上获得相同行为，请使用 `textAlignVertical` 设置为 `top`。
:::

| 类型 |
| ---- |
| bool |

---

### `numberOfLines`

:::note
`numberOfLines` 在 iOS 上仅在 [新架构](/architecture/landing-page) 上可用
:::

设置 `TextInput` 的最大行数。与 multiline 设置为 `true` 一起使用以能够填充行。

| 类型   |
| ------ |
| number |

---

### `onBlur`

当文本输入失焦时调用的回调。

> 注意：如果你试图从 `nativeEvent` 访问 `text` 值，请记住你得到的结果值可能是 `undefined`，这可能会导致意外错误。如果你试图找到 TextInput 的最后一个值，可以使用 [`onEndEditing`](textinput#onendediting) 事件，它在编辑完成时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onChange`

当文本输入的文本变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {eventCount, target, text}}`) => void |

---

### `onChangeText`

当文本输入的文本变化时调用的回调。变化的文本作为单个字符串参数传递给回调处理程序。

| 类型     |
| -------- |
| function |

---

### `onContentSizeChange`

当文本输入的内容大小变化时调用的回调。

仅针对多行文本输入调用。

| 类型                                                       |
| ---------------------------------------------------------- |
| (`{nativeEvent: {contentSize: {width, height} }}`) => void |

---

### `onEndEditing`

当文本输入结束时调用的回调。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

当触摸 engaged 时调用的回调。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

当触摸 released 时调用的回调。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onFocus`

当文本输入聚焦时调用的回调。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onKeyPress`

当按下键时调用的回调。这将使用对象调用，其中 `keyValue` 对于相应键为 `'Enter'` 或 `'Backspace'`，否则为输入的字符，包括 `' '` 表示空格。在 `onChange` 回调之前触发。注意：在 Android 上，仅处理软键盘的输入，不处理硬件键盘输入。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {key: keyValue} }`) => void |

---

### `onLayout`

在挂载和布局变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onScroll`

在内容滚动时调用。也可能包含来自 `ScrollEvent` 的其他属性，但在 Android 上出于性能原因不提供 `contentSize`。

| 类型                                                |
| --------------------------------------------------- |
| (`{nativeEvent: {contentOffset: {x, y} }}`) => void |

---

### `onSelectionChange`

当文本输入选择变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {selection: {start, end} }}`) => void |

---

### `onSubmitEditing`

当文本输入的提交按钮被按下时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {text, eventCount, target}}`) => void |

请注意，在 iOS 上，当使用 `keyboardType="phone-pad"` 时，此方法不会被调用。

---

### `placeholder`

在文本输入输入之前将渲染的字符串。

| 类型   |
| ------ |
| string |

---

### `placeholderTextColor`

占位符字符串的文本颜色。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `readOnly`

如果为 `true`，文本不可编辑。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `returnKeyLabel` <div className="label android">Android</div>

将返回键设置为标签。使用它代替 `returnKeyType`。

| 类型   |
| ------ |
| string |

---

### `returnKeyType`

确定返回键的外观。在 Android 上你也可以使用 `returnKeyLabel`。

_跨平台_

以下值跨平台有效：

- `done`
- `go`
- `next`
- `search`
- `send`

_仅 Android_

以下值仅在 Android 上有效：

- `none`
- `previous`

_仅 iOS_

以下值仅在 iOS 上有效：

- `default`
- `emergency-call`
- `google`
- `join`
- `route`
- `yahoo`

| 类型                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- |
| enum('done', 'go', 'next', 'search', 'send', 'none', 'previous', 'default', 'emergency-call', 'google', 'join', 'route', 'yahoo') |

### `rejectResponderTermination` <div className="label ios">iOS</div>

如果为 `true`，允许 TextInput 将触摸事件传递给父组件。这允许组件如 SwipeableListView 在 iOS 上从 TextInput 可滑动，就像 Android 上默认情况一样。如果为 `false`，TextInput 始终请求处理输入（除非禁用）。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `rows` <div className="label android">Android</div>

设置 `TextInput` 的行数。与 multiline 设置为 `true` 一起使用以能够填充行。

| 类型   |
| ------ |
| number |

---

### `scrollEnabled` <div className="label ios">iOS</div>

如果为 `false`，文本视图的滚动将被禁用。默认值为 `true`。仅与 `multiline={true}` 一起工作。

| 类型 |
| ---- |
| bool |

---

### `secureTextEntry`

如果为 `true`，文本输入模糊输入的文本，以便敏感文本如密码保持安全。默认值为 `false`。不适用于 `multiline={true}`。

| 类型 |
| ---- |
| bool |

---

### `selection`

文本输入选择的开始和结束。将 start 和 end 设置为相同的值以定位光标。

| 类型                                  |
| ------------------------------------- |
| object: `{start: number,end: number}` |

---

### `selectionColor`

文本输入的高亮、选择_handle_和光标颜色。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `selectionHandleColor` <div className="label android">Android</div>

设置选择_handle_的颜色。与 `selectionColor` 不同，它允许独立于选择颜色自定义选择_handle_颜色。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `selectTextOnFocus`

如果为 `true`，聚焦时所有文本将自动被选中。

| 类型 |
| ---- |
| bool |

---

### `showSoftInputOnFocus`

当 `false` 时，它将防止字段聚焦时显示软键盘。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `smartInsertDelete` <div className="label ios">iOS</div>

如果为 `false`，iOS 系统在粘贴操作后不会插入额外空格，也不会在剪切或删除操作后删除一个或两个空格。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `spellCheck` <div className="label ios">iOS</div>

如果为 `false`，禁用拼写检查样式（即红色下划线）。默认值继承自 `autoCorrect`。

| 类型 |
| ---- |
| bool |

---

### `submitBehavior`

当按下返回键时，

对于单行输入：

- `'newline'` 默认为 `'blurAndSubmit'`
- `undefined` 默认为 `'blurAndSubmit'`

对于多行输入：

- `'newline'` 添加换行符
- `undefined` 默认为 `'newline'`

对于单行和多行输入：

- `'submit'` 将仅发送提交事件而不使输入失焦
- `'blurAndSubmit`' 将使输入失焦并发送提交事件

| 类型                                       |
| ------------------------------------------ |
| enum('submit', 'blurAndSubmit', 'newline') |

---

### `textAlign`

将输入文本对齐到输入字段的左侧、中心或右侧。

`textAlign` 的可能值为：

- `left`
- `center`
- `right`

| 类型                            |
| ------------------------------- |
| enum('left', 'center', 'right') |

---

### `textContentType` <div className="label ios">iOS</div>

向键盘和系统提供关于用户输入内容的预期语义含义的信息。

:::note
[`autoComplete`](#autocomplete) 提供相同的功能并适用于所有平台。你可以使用 [`Platform.select`](/docs/next/platform#select) 来处理不同的平台行为。

避免同时使用 `textContentType` 和 `autoComplete`。为了向后兼容，当同时设置这两个属性时，`textContentType` 优先。
:::

你可以将 `textContentType` 设置为 `username` 或 `password` 以启用来自设备钥匙串的登录详细信息自动填充。

`newPassword` 可用于指示用户可能想要保存在钥匙串中的新密码输入，`oneTimeCode` 可用于指示字段可以通过短信到达的代码自动填充。

要禁用自动填充，请将 `textContentType` 设置为 `none`。

`textContentType` 的可能值为：

- `none`
- `addressCity`
- `addressCityAndState`
- `addressState`
- `birthdate` (iOS 17+)
- `birthdateDay` (iOS 17+)
- `birthdateMonth` (iOS 17+)
- `birthdateYear` (iOS 17+)
- `countryName`
- `creditCardExpiration` (iOS 17+)
- `creditCardExpirationMonth` (iOS 17+)
- `creditCardExpirationYear` (iOS 17+)
- `creditCardFamilyName` (iOS 17+)
- `creditCardGivenName` (iOS 17+)
- `creditCardMiddleName` (iOS 17+)
- `creditCardName` (iOS 17+)
- `creditCardNumber`
- `creditCardSecurityCode` (iOS 17+)
- `creditCardType` (iOS 17+)
- `emailAddress`
- `familyName`
- `fullStreetAddress`
- `givenName`
- `jobTitle`
- `location`
- `middleName`
- `name`
- `namePrefix`
- `nameSuffix`
- `newPassword`
- `nickname`
- `oneTimeCode`
- `organizationName`
- `password`
- `postalCode`
- `streetAddressLine1`
- `streetAddressLine2`
- `sublocality`
- `telephoneNumber`
- `URL`
- `username`

| 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| enum('none', 'addressCity', 'addressCityAndState', 'addressState', 'birthdate', 'birthdateDay', 'birthdateMonth', 'birthdateYear', 'countryName', 'creditCardExpiration', 'creditCardExpirationMonth', 'creditCardExpirationYear', 'creditCardFamilyName', 'creditCardGivenName', 'creditCardMiddleName', 'creditCardName', 'creditCardNumber', 'creditCardSecurityCode', 'creditCardType', 'emailAddress', 'familyName', 'fullStreetAddress', 'givenName', 'jobTitle', 'location', 'middleName', 'name', 'namePrefix', 'nameSuffix', 'newPassword', 'nickname', 'oneTimeCode', 'organizationName', 'password', 'postalCode', 'streetAddressLine1', 'streetAddressLine2', 'sublocality', 'telephoneNumber', 'URL', 'username') |

---

### `passwordRules` <div className="label ios">iOS</div>

当在 iOS 上使用 `textContentType` 为 `newPassword` 时，我们可以让 OS 知道密码的最低要求，以便它可以生成一个满足这些要求的密码。为了创建有效的 `PasswordRules` 字符串，请查看 [Apple 文档](https://developer.apple.com/password-rules/)。

> 如果密码生成对话框没有出现，请确保：
>
> - 自动填充已启用：**设置** → **密码与账户** → 切换“开” **自动填充密码**，
> - 使用 iCloud 钥匙串：**设置** → **Apple ID** → **iCloud** → **钥匙串** → 切换“开” **iCloud 钥匙串**。

| 类型   |
| ------ |
| string |

---

### `style`

请注意，并非所有 Text 样式都受支持，不支持的不完整列表包括：

- `borderLeftWidth`
- `borderTopWidth`
- `borderRightWidth`
- `borderBottomWidth`
- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomRightRadius`
- `borderBottomLeftRadius`

[样式](style.md)

| 类型                  |
| --------------------- |
| [Text](text.md#style) |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API Level 23+ 上设置文本断行策略，可能的值为 `simple`、`highQuality`、`balanced`。默认值为 `highQuality`。

| 类型                                      |
| ----------------------------------------- |
| enum('simple', 'highQuality', 'balanced') |

---

### `underlineColorAndroid` <div className="label android">Android</div>

`TextInput` 下划线的颜色。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `value`

文本输入显示的值。`TextInput` 是一个受控组件，这意味着如果提供，原生值将被强制匹配此 value prop。对于大多数用途，这效果很好，但在某些情况下这可能导致闪烁 - 一个常见原因是通过保持值相同来防止编辑。除了设置相同的值外，要么设置 `editable={false}`，要么设置/更新 `maxLength` 以防止不必要的编辑而不闪烁。

| 类型   |
| ------ |
| string |

## 方法

### `.focus()`

```tsx
focus();
```

使原生输入框请求焦点。

### `.blur()`

```tsx
blur();
```

使原生输入框失去焦点。

### `clear()`

```tsx
clear();
```

移除 `TextInput` 中的所有文本。

---

### `isFocused()`

```tsx
isFocused(): boolean;
```

如果输入框当前处于聚焦状态则返回 `true`；否则返回 `false`。

# 已知问题

- [react-native#19096](https://github.com/facebook/react-native/issues/19096): 不支持 Android 的 `onKeyPreIme`。
- [react-native#19366](https://github.com/facebook/react-native/issues/19366): 通过返回键关闭 Android 键盘后调用 .focus() 不会再次弹出键盘。
- [react-native#26799](https://github.com/facebook/react-native/issues/26799): 当 `keyboardType="email-address"` 或 `keyboardType="phone-pad"` 时，不支持 Android 的 `secureTextEntry`。
