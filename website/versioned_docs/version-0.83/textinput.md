---
id: textinput
title: TextInput
---

用于通过键盘向应用输入文本的基础组件。Props 可配置多项功能，例如自动更正、自动大写、占位文本和不同的键盘类型（如数字键盘）。

最基本的用法是放置一个 `TextInput`，并订阅 `onChangeText` 事件来读取用户输入。还可以订阅其他事件，例如 `onSubmitEditing` 和 `onFocus`。一个最小示例：

```SnackPlayer name=TextInput%20Example
import {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [text, onChangeText] = useState('Useless Text');
  const [number, onChangeNumber] = useState('');

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

通过原生元素公开的两个方法是 `.focus()` 和 `.blur()`，可用于以编程方式聚焦或取消聚焦 TextInput。

请注意，某些 props 仅在 `multiline={true/false}` 时可用：

```SnackPlayer name=Multiline%20TextInput%20Example
import {useState} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const MultilineTextInputExample = () => {
  const [value, onChangeText] = useState('Useless Multiline Placeholder');

  // If you type something in the text box that is a color,
  // the background will change to that color.
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

`TextInput` 默认会在其视图底部显示边框。此边框的内边距由系统提供的背景图像设置，且无法更改。避免此问题的方法有两种：不显式设置高度，此时系统会负责在正确位置显示边框；或者将 `underlineColorAndroid` 设置为 transparent 来不显示边框。

请注意，在 Android 上对输入框中的文本执行选择操作，可能会将应用的 activity `windowSoftInputMode` 参数更改为 `adjustResize`。这可能会导致键盘处于活动状态时，具有 position: 'absolute' 的组件出现问题。若要避免此行为，可以在 AndroidManifest.xml（ https://developer.android.com/guide/topics/manifest/activity-element.html ）中指定 `windowSoftInputMode`，或者使用原生代码以编程方式控制此参数。

---

# 参考

## Props

### [View Props](view.md#props)

继承 [View Props](view.md#props)。

---

### `allowFontScaling`

指定字体是否应进行缩放，以遵循辅助功能中的文本大小设置。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoCapitalize`

告知 `TextInput` 自动将某些字符大写。某些键盘类型（例如 `name-phone-pad`）不支持此属性。

- `characters`：所有字符
- `words`：每个单词的首字母
- `sentences`：每个句子的首字母（_默认_）
- `none`：不自动将任何内容大写

| 类型                                             |
| ------------------------------------------------ |
| enum('none', 'sentences', 'words', 'characters') |

---

### `autoComplete`

为系统指定自动完成提示，以便系统提供自动填充。在 Android 上，系统始终会尝试使用启发式方法识别内容类型来提供自动填充。若要禁用自动完成，请将 `autoComplete` 设置为 `off`。

以下值适用于所有平台：

- `additional-name`
- `address-line1`
- `address-line2`
- `birthdate-day`（iOS 17+）
- `birthdate-full`（iOS 17+）
- `birthdate-month`（iOS 17+）
- `birthdate-year`（iOS 17+）
- `cc-csc`（iOS 17+）
- `cc-exp`（iOS 17+）
- `cc-exp-day`（iOS 17+）
- `cc-exp-month`（iOS 17+）
- `cc-exp-year`（iOS 17+）
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

以下值仅适用于 iOS：

- `cc-family-name`（iOS 17+）
- `cc-given-name`（iOS 17+）
- `cc-middle-name`（iOS 17+）
- `cc-name`（iOS 17+）
- `cc-type`（iOS 17+）
- `nickname`
- `organization`
- `organization-title`
- `url`

<div className="label basic android">Android</div>

以下值仅适用于 Android：

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

如果为 `false`，则禁用自动更正。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoFocus`

如果为 `true`，则聚焦输入框。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### 🗑️ `blurOnSubmit`

:::warning[已弃用]
请注意，`submitBehavior` 现在取代了 `blurOnSubmit`，并会覆盖 `blurOnSubmit` 定义的任何行为。请参阅 [submitBehavior](textinput#submitbehavior)。
:::

如果为 `true`，文本字段将在提交时取消聚焦。单行字段的默认值为 true，多行字段的默认值为 false。请注意，对于多行字段，将 `blurOnSubmit` 设置为 `true` 意味着按下回车键会使字段取消聚焦并触发 `onSubmitEditing` 事件，而不是在字段中插入换行符。

| 类型 |
| ---- |
| bool |

---

### `caretHidden`

如果为 `true`，则隐藏插入符。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `clearButtonMode` <div className="label ios">iOS</div>

清除按钮应何时显示在文本视图的右侧。此属性仅适用于单行 TextInput 组件。默认值为 `never`。

| 类型                                                       |
| ---------------------------------------------------------- |
| enum('never', 'while-editing', 'unless-editing', 'always') |

---

### `clearTextOnFocus` <div className="label ios">iOS</div>

如果为 `true`，则在开始编辑时自动清除文本字段。

| 类型 |
| ---- |
| bool |

---

### `contextMenuHidden`

如果为 `true`，则隐藏上下文菜单。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `dataDetectorTypes` <div className="label ios">iOS</div>

确定文本输入中应转换为可点击 URL 的数据类型。仅当 `multiline={true}` 且 `editable={false}` 时有效。默认情况下不会检测任何数据类型。

可以提供一种类型，也可以提供包含多种类型的数组。

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

提供一个初始值，该值会在用户开始输入时发生变化。适用于不希望处理事件监听并更新 value prop 来保持受控状态同步的场景。

| 类型   |
| ------ |
| string |

---

### `disableKeyboardShortcuts` <div className="label ios">iOS</div>

如果为 `true`，则禁用键盘快捷键（撤销／重做和复制按钮）。

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `cursorColor` <div className="label android">Android</div>

提供此属性时，会设置组件中光标（或“插入符”）的颜色。与 `selectionColor` 的行为不同，光标颜色会独立于文本选择框的颜色进行设置。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `disableFullscreenUI` <div className="label android">Android</div>

当值为 `false` 时，如果文本输入周围可用空间较小（例如手机处于横屏方向），操作系统可能会让用户在全屏文本输入模式中编辑文本。当值为 `true` 时，此功能会被禁用，用户始终会直接在文本输入框中编辑文本。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `editable`

如果为 `false`，则文本不可编辑。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `enablesReturnKeyAutomatically` <div className="label ios">iOS</div>

如果为 `true`，则当没有文本时键盘会禁用回车键，有文本时会自动启用回车键。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `enterKeyHint`

确定回车键上应显示的文本。其优先级高于 `returnKeyType` prop。

以下值适用于所有平台：

- `done`
- `next`
- `search`
- `send`
- `go`

_仅限 Android_

以下值仅适用于 Android：

- `previous`

_仅限 iOS_

以下值仅适用于 iOS：

- `enter`

| 类型                                                              |
| ----------------------------------------------------------------- |
| enum('enter', 'done', 'next', 'previous', 'search', 'send', 'go') |

---

### `importantForAutofill` <div className="label android">Android</div>

告知操作系统，在 Android API Level 26 及更高版本上，应用中的各个字段是否应出现在用于自动填充的视图结构中。可能的值为 `auto`、`no`、`noExcludeDescendants`、`yes` 和 `yesExcludeDescendants`。默认值为 `auto`。

- `auto`：让 Android System 使用启发式方法确定该视图对于自动填充是否重要
- `no`：该视图对于自动填充不重要
- `noExcludeDescendants`：该视图及其子元素对于自动填充不重要
- `yes`：该视图对于自动填充很重要
- `yesExcludeDescendants`：该视图对于自动填充很重要，但其子元素对于自动填充不重要

| 类型                                                                       |
| -------------------------------------------------------------------------- |
| enum('auto', 'no', 'noExcludeDescendants', 'yes', 'yesExcludeDescendants') |

---

### `inlineImageLeft` <div className="label android">Android</div>

如果已定义，则提供的图像资源会渲染在左侧。图像资源必须位于 `/android/app/src/main/res/drawable` 中，并按如下方式引用

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

内联图像（如果有）与文本输入框本身之间的内边距。

| 类型   |
| ------ |
| number |

---

### `inputAccessoryViewID` <div className="label ios">iOS</div>

一个可选标识符，用于将自定义 [InputAccessoryView](inputaccessoryview.md) 关联到此文本输入框。当此文本输入框获得焦点时，InputAccessoryView 会渲染在键盘上方。

| 类型   |
| ------ |
| string |

---

### `inputAccessoryViewButtonLabel` <div className="label ios">iOS</div>

一个可选标签，用于覆盖默认的 [InputAccessoryView](inputaccessoryview.md) 按钮标签。

默认情况下，默认按钮标签不会进行本地化。使用此属性可以提供本地化版本。

| 类型   |
| ------ |
| string |

---

### `inputMode`

其作用类似于 HTML 中的 `inputmode` 属性，用于确定要打开的键盘，例如 `numeric`，并且其优先级高于 `keyboardType`。

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

确定要打开的键盘，例如 `numeric`。

请在[此处](https://davidl.fr/blog/keyboard-react-native-ios-android#all-react-native-keyboard-type-examples-i-os-on-the-left-android-on-the-right)查看所有类型的截图。

以下值适用于所有平台：

- `default`
- `number-pad`
- `decimal-pad`
- `numeric`
- `email-address`
- `phone-pad`
- `url`

_仅限 iOS_

以下值仅适用于 iOS：

- `ascii-capable`
- `numbers-and-punctuation`
- `name-phone-pad`
- `twitter`
- `web-search`

_仅限 Android_

以下值仅适用于 Android：

- `visible-password`

| 类型                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search', 'visible-password') |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14 及更高版本上设置换行策略。可能的值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值   |
| ----------------------------------------------------------- | -------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

---

### `lineBreakModeIOS` <div className="label ios">iOS</div>

在 iOS 上设置换行模式。可能的值为 `wordWrapping`、`char`、`clip`、`head`、`middle` 和 `tail`。

| 类型                                                                       | 默认值           |
| -------------------------------------------------------------------------- | ---------------- |
| enum(`'wordWrapping'`, `'char'`, `'clip'`, `'head'`, `'middle'`, `'tail'`) | `'wordWrapping'` |

---

### `maxFontSizeMultiplier`

指定启用 `allowFontScaling` 时字体可以达到的最大缩放比例。可能的值：

- `null/undefined`（默认）：从父节点或全局默认值（0）继承
- `0`：没有最大值，忽略父节点／全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为此值

| 类型   |
| ------ |
| number |

---

### `maxLength`

限制可输入的最大字符数。使用此属性而不是在 JS 中实现逻辑，以避免闪烁。

| 类型   |
| ------ |
| number |

---

### `multiline`

如果为 `true`，文本输入框可以包含多行文本。默认值为 `false`。

:::note
需要注意的是，在 iOS 上，这会将文本对齐到顶部，而在 Android 上会将文本居中。将其与设置为 `top` 的 `textAlignVertical` 一起使用，可使两个平台的行为一致。
:::

| 类型 |
| ---- |
| bool |

---

### `numberOfLines`

:::note
iOS 上的 `numberOfLines` 仅适用于[新架构](/architecture/landing-page)
:::

设置 `TextInput` 的最大行数。将其与设置为 `true` 的 multiline 一起使用，才能填充这些行。

| 类型   |
| ------ |
| number |

---

### `onBlur`

文本输入框取消聚焦时调用的回调。

:::note
如果你尝试从 `nativeEvent` 访问 `text` 值，请注意，得到的结果可能是 `undefined`，从而导致意外错误。如果你想查找 TextInput 的最后一个值，可以使用 [`onEndEditing`](textinput#onendediting) 事件，该事件会在编辑完成时触发。
:::

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onChange`

文本输入框的文本发生变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {eventCount, target, text}}`) => void |

---

### `onChangeText`

文本输入框的文本发生变化时调用的回调。变更后的文本会作为单个字符串参数传递给回调处理函数。

| 类型     |
| -------- |
| function |

---

### `onContentSizeChange`

文本输入框的内容尺寸发生变化时调用的回调。

仅对多行文本输入框调用。

| 类型                                                       |
| ---------------------------------------------------------- |
| (`{nativeEvent: {contentSize: {width, height} }}`) => void |

---

### `onEndEditing`

文本输入结束时调用的回调。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

触摸开始时调用的回调。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onPressOut`

触摸释放时调用的回调。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

---

### `onFocus`

文本输入框获得焦点时调用的回调。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onKeyPress`

按下按键时调用的回调。此回调会接收一个对象：对于相应的按键，`keyValue` 为 `'Enter'` 或 `'Backspace'`；对于其他按键，则为输入的字符，包括空格的 `' '`。此回调会在 `onChange` 回调之前触发。注意：在 Android 上，仅处理软键盘输入，不处理硬件键盘输入。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {key: keyValue} }`) => void |

---

### `onLayout`

在挂载和布局发生变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onScroll`

内容滚动时调用。可能还包含来自 `ScrollEvent` 的其他属性，但在 Android 上出于性能原因不会提供 `contentSize`。

| 类型                                                |
| --------------------------------------------------- |
| (`{nativeEvent: {contentOffset: {x, y} }}`) => void |

---

### `onSelectionChange`

文本输入框的文本选择发生变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {selection: {start, end} }}`) => void |

---

### `onSubmitEditing`

按下文本输入框的提交按钮时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {text, eventCount, target}}`) => void |

请注意，在 iOS 上，使用 `keyboardType="phone-pad"` 时不会调用此方法。

---

### `placeholder`

文本输入之前会显示的字符串。

| 类型   |
| ------ |
| string |

---

### `placeholderTextColor`

占位字符串的文本颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `readOnly`

如果为 `true`，则文本不可编辑。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `returnKeyLabel` <div className="label android">Android</div>

将回车键设置为指定标签。使用它来代替 `returnKeyType`。

| 类型   |
| ------ |
| string |

---

### `returnKeyType`

确定回车键的外观。在 Android 上，也可以使用 `returnKeyLabel`。

_跨平台_

以下值适用于所有平台：

- `done`
- `go`
- `next`
- `search`
- `send`

_仅限 Android_

以下值仅适用于 Android：

- `none`
- `previous`

_仅限 iOS_

以下值仅适用于 iOS：

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

如果为 `true`，则允许 TextInput 将触摸事件传递给父组件。这样，SwipeableListView 等组件就可以在 iOS 上从 TextInput 开始滑动，这与 Android 上的默认行为一致。如果为 `false`，TextInput 始终会请求处理输入（禁用时除外）。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `rows` <div className="label android">Android</div>

设置 `TextInput` 的行数。将其与设置为 `true` 的 multiline 一起使用，才能填充这些行。

| 类型   |
| ------ |
| number |

---

### `scrollEnabled` <div className="label ios">iOS</div>

如果为 `false`，则禁用文本视图滚动。默认值为 `true`。仅适用于 `multiline={true}`。

| 类型 |
| ---- |
| bool |

---

### `secureTextEntry`

如果为 `true`，则文本输入框会隐藏输入的文本，从而确保密码等敏感文本的安全。默认值为 `false`。不适用于 `multiline={true}`。

| 类型 |
| ---- |
| bool |

---

### `selection`

文本输入框选择区域的起始位置和结束位置。将 start 和 end 设置为相同的值即可定位光标。

| 类型                                  |
| ------------------------------------- |
| object: `{start: number,end: number}` |

---

### `selectionColor`

文本输入框的高亮颜色、选择手柄颜色和光标颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectionHandleColor` <div className="label android">Android</div>

设置选择手柄的颜色。与 `selectionColor` 不同，它允许独立于选择区域颜色自定义选择手柄颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectTextOnFocus`

如果为 `true`，则获得焦点时自动选择所有文本。

| 类型 |
| ---- |
| bool |

---

### `showSoftInputOnFocus`

当值为 `false` 时，会阻止字段获得焦点时显示软键盘。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `smartInsertDelete` <div className="label ios">iOS</div>

如果为 `false`，iOS 系统不会在粘贴操作后插入额外空格，也不会在剪切或删除操作后删除一个或两个空格。

| 类型 | 默认值 |
| ---- | ------ |
| bool | `true` |

---

### `spellCheck` <div className="label ios">iOS</div>

如果为 `false`，则禁用拼写检查样式（即红色下划线）。默认值继承自 `autoCorrect`。

| 类型 |
| ---- |
| bool |

---

### `submitBehavior`

按下回车键时，

对于单行输入框：

- `'newline'` 默认为 `'blurAndSubmit'`
- `undefined` 默认为 `'blurAndSubmit'`

对于多行输入框：

- `'newline'` 添加换行符
- `undefined` 默认为 `'newline'`

对于单行和多行输入框：

- `'submit'` 只发送提交事件，不会使输入框取消聚焦
- `'blurAndSubmit`' 会使输入框取消聚焦并发送提交事件

| 类型                                       |
| ------------------------------------------ |
| enum('submit', 'blurAndSubmit', 'newline') |

---

### `textAlign`

将输入文本对齐到输入字段的左侧、中央或右侧。

`textAlign` 的可能值为：

- `left`
- `center`
- `right`

| 类型                            |
| ------------------------------- |
| enum('left', 'center', 'right') |

---

### `textContentType` <div className="label ios">iOS</div>

向键盘和系统提供用户输入内容预期语义含义的信息。

:::note
[`autoComplete`](#autocomplete) 提供相同的功能，并且适用于所有平台。你可以使用 [`Platform.select`](/docs/next/platform#select) 来实现不同平台的行为。

避免同时使用 `textContentType` 和 `autoComplete`。为了向后兼容，同时设置两个属性时，`textContentType` 优先。
:::

可以将 `textContentType` 设置为 `username` 或 `password`，以启用从设备钥匙串自动填充登录信息。

`newPassword` 可用于表示用户可能希望保存到钥匙串中的新密码输入，`oneTimeCode` 可用于表示字段可以由通过 SMS 接收的代码自动填充。

若要禁用自动填充，请将 `textContentType` 设置为 `none`。

`textContentType` 的可能值为：

- `none`
- `addressCity`
- `addressCityAndState`
- `addressState`
- `birthdate`（iOS 17+）
- `birthdateDay`（iOS 17+）
- `birthdateMonth`（iOS 17+）
- `birthdateYear`（iOS 17+）
- `countryName`
- `creditCardExpiration`（iOS 17+）
- `creditCardExpirationMonth`（iOS 17+）
- `creditCardExpirationYear`（iOS 17+）
- `creditCardFamilyName`（iOS 17+）
- `creditCardGivenName`（iOS 17+）
- `creditCardMiddleName`（iOS 17+）
- `creditCardName`（iOS 17+）
- `creditCardNumber`
- `creditCardSecurityCode`（iOS 17+）
- `creditCardType`（iOS 17+）
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

在 iOS 上将 `textContentType` 设置为 `newPassword` 时，可以让 OS 知道密码的最低要求，从而使其生成符合要求的密码。要创建适用于 `PasswordRules` 的有效字符串，请参阅 [Apple Docs](https://developer.apple.com/password-rules/)。

:::tip
如果密码生成对话框没有出现，请确保：

- 已启用 AutoFill：**Settings** → **Passwords & Accounts** → 将 **AutoFill Passwords** 切换为“On”
- 使用了 iCloud Keychain：**Settings** → **Apple ID** → **iCloud** → **Keychain** → 将 **iCloud Keychain** 切换为“On”
  :::

| 类型   |
| ------ |
| string |

---

### `style`

请注意，并非所有 Text 样式都受支持，以下是不受支持样式的不完整列表：

- `borderLeftWidth`
- `borderTopWidth`
- `borderRightWidth`
- `borderBottomWidth`
- `borderTopLeftRadius`
- `borderTopRightRadius`
- `borderBottomRightRadius`
- `borderBottomLeftRadius`

[Styles](style.md)

| 类型                  |
| --------------------- |
| [Text](text.md#style) |

---

### `textBreakStrategy` <div className="label android">Android</div>

在 Android API Level 23 及更高版本上设置文本换行策略，可能的值为 `simple`、`highQuality`、`balanced`。默认值为 `highQuality`。

| 类型                                      |
| ----------------------------------------- |
| enum('simple', 'highQuality', 'balanced') |

---

### `underlineColorAndroid` <div className="label android">Android</div>

`TextInput` 下划线的颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `value`

文本输入框要显示的值。`TextInput` 是受控组件，这意味着如果提供了此 value prop，原生值将被强制与该值保持一致。对于大多数用法，这样做效果很好，但在某些情况下可能导致闪烁——一个常见原因是通过保持 value 不变来阻止编辑。除了设置相同的值之外，还应设置 `editable={false}`，或者设置／更新 `maxLength`，以防止不需要的编辑而不产生闪烁。

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

如果输入框当前已获得焦点，则返回 `true`；否则返回 `false`。

# 已知问题

- [react-native#19096](https://github.com/facebook/react-native/issues/19096)：不支持 Android 的 `onKeyPreIme`
- [react-native#19366](https://github.com/facebook/react-native/issues/19366)：通过返回按钮关闭 Android 键盘后调用 .focus()，不会再次调起键盘
- [react-native#26799](https://github.com/facebook/react-native/issues/26799)：当 `keyboardType="email-address"` 或 `keyboardType="phone-pad"` 时，不支持 Android 的 `secureTextEntry`
