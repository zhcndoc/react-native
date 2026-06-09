---
id: textinput
title: TextInput
---

一个用于通过键盘向应用输入文本的基础组件。Props 提供了多种功能的配置能力，例如自动更正、自动首字母大写、占位文本以及不同的键盘类型，例如数字键盘。

最基本的使用场景是放置一个 `TextInput`，并订阅 `onChangeText` 事件来读取用户输入。也可以订阅其他事件，例如 `onSubmitEditing` 和 `onFocus`。最小示例如下：

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

原生元素暴露的两个方法是 `.focus()` 和 `.blur()`，可用于以编程方式让 TextInput 获得或失去焦点。

请注意，某些 props 仅在 `multiline={true/false}` 时可用。此外，仅应用于元素一侧的边框样式（例如 `borderBottomColor`、`borderLeftWidth` 等）在 `multiline=true` 时不会生效。要实现相同效果，可以将 `TextInput` 包裹在 `View` 中：

```SnackPlayer name=Multiline%20TextInput%20Example
import {useState} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const MultilineTextInputExample = () => {
  const [value, onChangeText] = useState('Useless Multiline Placeholder');

  // 如果你在文本框中输入某个颜色，
  // 背景将会变成该颜色。
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

`TextInput` 默认在其视图底部带有一条边框。这条边框的内边距由系统提供的背景图片决定，且无法更改。避免这一问题的方法要么是不要显式设置高度，此时系统会负责将边框显示在正确位置；要么通过将 `underlineColorAndroid` 设置为透明来不显示边框。

请注意，在 Android 上对输入框执行文本选择可能会将应用的活动 `windowSoftInputMode` 参数改为 `adjustResize`。当键盘处于活动状态时，这可能会导致具有 `position: 'absolute'` 的组件出现问题。要避免这种行为，可以在 AndroidManifest.xml 中指定 `windowSoftInputMode`（ https://developer.android.com/guide/topics/manifest/activity-element.html ），或者使用原生代码以编程方式控制该参数。

---

# 参考

## Props

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### `allowFontScaling`

指定字体是否应缩放以适应文本大小辅助功能设置。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoCapitalize`

告诉 `TextInput` 自动将某些字符大写。某些键盘类型不支持此属性，例如 `name-phone-pad`。

- `characters`：所有字符。
- `words`：每个单词的首字母。
- `sentences`：每个句子的首字母（_默认_）。
- `none`：不自动将任何内容大写。

| 类型                                             |
| ------------------------------------------------ |
| enum('none', 'sentences', 'words', 'characters') |

---

### `autoComplete`

指定系统的自动完成提示，以便其提供自动填充。在 Android 上，系统始终会尝试通过启发式方法识别内容类型来提供自动填充。要禁用自动完成，请将 `autoComplete` 设置为 `off`。

以下值可跨平台使用：

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

以下值仅可在 iOS 上使用：

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

以下值仅可在 Android 上使用：

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

如果为 `false`，将禁用自动更正。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoFocus`

如果为 `true`，会聚焦输入框。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### 🗑️ `blurOnSubmit`

:::warning Deprecated
请注意，`submitBehavior` 现在取代了 `blurOnSubmit`，并会覆盖 `blurOnSubmit` 定义的任何行为。请参见 [submitBehavior](textinput#submitbehavior)。
:::

如果为 `true`，提交时文本字段将失去焦点。单行字段的默认值为 true，多行字段的默认值为 false。请注意，对于多行字段，将 `blurOnSubmit` 设为 `true` 意味着按回车会使字段失焦并触发 `onSubmitEditing` 事件，而不是在字段中插入换行符。

| 类型 |
| ---- |
| bool |

---

### `caretHidden`

如果为 `true`，则隐藏光标。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `clearButtonMode` <div className="label ios">iOS</div>

何时在文本视图右侧显示清除按钮。此属性仅支持单行 TextInput 组件。默认值为 `never`。

| 类型                                                       |
| ---------------------------------------------------------- |
| enum('never', 'while-editing', 'unless-editing', 'always') |

---

### `clearTextOnFocus` <div className="label ios">iOS</div>

如果为 `true`，则在开始编辑时自动清空文本字段。

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

确定在文本输入中转换为可点击 URL 的数据类型。仅在 `multiline={true}` 且 `editable={false}` 时有效。默认情况下不会检测任何数据类型。

你可以提供一种类型或多种类型的数组。

`dataDetectorTypes` 的可选值为：

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

提供一个初始值，当用户开始输入时该值会发生变化。适用于不想处理事件监听并更新 value prop 来保持受控状态同步的场景。

| 类型   |
| ------ |
| string |

---

### `disableKeyboardShortcuts` <div className="label ios">iOS</div>

如果为 `true`，键盘快捷键（撤销/重做以及复制按钮）将被禁用。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `cursorColor` <div className="label android">Android</div>

提供该属性时，会设置组件中光标（或“插入光标”）的颜色。与 `selectionColor` 的行为不同，光标颜色会独立于文本选区框的颜色进行设置。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `disableFullscreenUI` <div className="label android">Android</div>

当为 `false` 时，如果文本输入周围可用空间较小（例如手机横屏时），操作系统可能会选择让用户在全屏文本输入模式中编辑文本。当为 `true` 时，此功能将被禁用，用户将始终直接在文本输入中编辑文本。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `editable`

如果为 `false`，文本将不可编辑。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `enablesReturnKeyAutomatically` <div className="label ios">iOS</div>

如果为 `true`，当没有文本时键盘会禁用回车键，并在有文本时自动启用。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `enterKeyHint`

决定回车键应显示的文本。优先级高于 `returnKeyType` 属性。

以下值可跨平台使用：

- `done`
- `next`
- `search`
- `send`
- `go`

_仅 Android_

以下值仅可在 Android 上使用：

- `previous`

_仅 iOS_

以下值仅可在 iOS 上使用：

- `enter`

| 类型                                                              |
| ----------------------------------------------------------------- |
| enum('enter', 'done', 'next', 'previous', 'search', 'send', 'go') |

---

### `importantForAutofill` <div className="label android">Android</div>

告知操作系统你的应用中的单个字段是否应包含在 Android API Level 26+ 的自动填充视图结构中。可能的值有 `auto`、`no`、`noExcludeDescendants`、`yes` 和 `yesExcludeDescendants`。默认值为 `auto`。

- `auto`：让 Android 系统使用启发式方法判断该视图是否对自动填充重要。
- `no`：该视图对自动填充不重要。
- `noExcludeDescendants`：该视图及其子级对自动填充不重要。
- `yes`：该视图对自动填充重要。
- `yesExcludeDescendants`：该视图对自动填充重要，但其子级不重要。

| 类型                                                                       |
| -------------------------------------------------------------------------- |
| enum('auto', 'no', 'noExcludeDescendants', 'yes', 'yesExcludeDescendants') |

---

### `inlineImageLeft` <div className="label android">Android</div>

如果定义了该属性，提供的图片资源将渲染在左侧。图片资源必须位于 `/android/app/src/main/res/drawable` 中，并像下面这样引用：

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

内联图片（如果有）与文本输入本身之间的内边距。

| 类型   |
| ------ |
| number |

---

### `inputAccessoryViewID` <div className="label ios">iOS</div>

一个可选标识符，用于将自定义的 [InputAccessoryView](inputaccessoryview.md) 关联到该文本输入。该 InputAccessoryView 会在该文本输入获得焦点时显示在键盘上方。

| 类型   |
| ------ |
| string |

---

### `inputAccessoryViewButtonLabel` <div className="label ios">iOS</div>

一个可选标签，用于覆盖默认的 [InputAccessoryView](inputaccessoryview.md) 按钮标签。

默认情况下，默认按钮标签未本地化。请使用此属性提供本地化版本。

| 类型   |
| ------ |
| string |

---

### `inputMode`

其作用类似 HTML 中的 `inputmode` 属性，用于决定打开哪种键盘，例如 `numeric`，并且优先级高于 `keyboardType`。

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

决定键盘的颜色。

| 类型                             |
| -------------------------------- |
| enum('default', 'light', 'dark') |

---

### `keyboardType`

决定要打开哪种键盘，例如 `numeric`。

查看所有类型的截图 [这里](https://davidl.fr/blog/keyboard-react-native-ios-android#all-react-native-keyboard-type-examples-i-os-on-the-left-android-on-the-right)。

以下值可跨平台使用：

- `default`
- `number-pad`
- `decimal-pad`
- `numeric`
- `email-address`
- `phone-pad`
- `url`

_仅 iOS_

以下值仅可在 iOS 上使用：

- `ascii-capable`
- `numbers-and-punctuation`
- `name-phone-pad`
- `twitter`
- `web-search`

_仅 Android_

以下值仅可在 Android 上使用：

- `visible-password`

| 类型                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search', 'visible-password') |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

设置 iOS 14+ 的换行策略。可能的值为 `none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值  |
| ----------------------------------------------------------- | -------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

---

### `lineBreakModeIOS` <div className="label ios">iOS</div>

设置 iOS 上的换行模式。可能的值为 `wordWrapping`、`char`、`clip`、`head`、`middle` 和 `tail`。

| 类型                                                                       | 默认值          |
| -------------------------------------------------------------------------- | ---------------- |
| enum(`'wordWrapping'`, `'char'`, `'clip'`, `'head'`, `'middle'`, `'tail'`) | `'wordWrapping'` |

---

### `maxFontSizeMultiplier`

指定在启用 `allowFontScaling` 时字体可达到的最大缩放值。可能的取值：

- `null/undefined`（默认）：继承自父节点或全局默认值（0）
- `0`：没有最大值，忽略父级/全局默认值
- `>= 1`：将此节点的 `maxFontSizeMultiplier` 设置为该值

| 类型   |
| ------ |
| number |

---

### `maxLength`

限制可输入的最大字符数。请使用此属性而不是在 JS 中实现逻辑，以避免闪烁。

| 类型   |
| ------ |
| number |

---

### `multiline`

如果为 `true`，文本输入可为多行。默认值为 `false`。

:::note
请注意，这会在 iOS 上将文本顶部对齐，而在 Android 上将其居中。将 `textAlignVertical` 设置为 `top` 可在两个平台上获得相同的行为。
:::

| 类型 |
| ---- |
| bool |

---

### `numberOfLines`

:::note
iOS 上的 `numberOfLines` 仅在[新架构](/architecture/landing-page)中可用
:::

设置 `TextInput` 的最大行数。将其与 `multiline` 设为 `true` 一起使用，以便填充这些行。

| 类型   |
| ------ |
| number |

---

### `onBlur`

文本输入失去焦点时调用的回调。

:::note
如果你尝试从 `nativeEvent` 中访问 `text` 值，请注意最终得到的值可能是 `undefined`，这可能会导致非预期错误。如果你想获取 TextInput 的最后一个值，可以使用 [`onEndEditing`](textinput#onendediting) 事件，它会在编辑完成时触发。
:::

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onChange`

文本输入的文本发生变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {eventCount, target, text}}`) => void |

---

### `onChangeText`

文本输入的文本发生变化时调用的回调。更改后的文本会作为单个字符串参数传递给回调处理函数。

| 类型     |
| -------- |
| function |

---

### `onContentSizeChange`

文本输入内容大小发生变化时调用的回调。

仅用于多行文本输入。

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

文本输入获得焦点时调用的回调。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onKeyPress`

按下按键时调用的回调。对于相应按键，该回调接收的对象中 `keyValue` 为 `'Enter'` 或 `'Backspace'`；否则为所输入的字符，包括空格对应的 `' '`。该事件会先于 `onChange` 回调触发。注意：在 Android 上仅处理软键盘输入，不处理硬件键盘输入。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {key: keyValue} }`) => void |

---

### `onLayout`

在挂载时以及布局变化时调用。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onScroll`

内容滚动时调用。也可能包含来自 `ScrollEvent` 的其他属性，但在 Android 上由于性能原因不提供 `contentSize`。

| 类型                                                |
| --------------------------------------------------- |
| (`{nativeEvent: {contentOffset: {x, y} }}`) => void |

---

### `onSelectionChange`

文本输入选择内容发生变化时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {selection: {start, end} }}`) => void |

---

### `onSubmitEditing`

按下文本输入的提交按钮时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {text, eventCount, target}}`) => void |

请注意，在 iOS 上使用 `keyboardType="phone-pad"` 时不会调用此方法。

---

### `placeholder`

文本输入内容输入前将显示的字符串。

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

如果为 `true`，文本将不可编辑。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `returnKeyLabel` <div className="label android">Android</div>

将回车键设置为该标签。请用它替代 `returnKeyType`。

| 类型   |
| ------ |
| string |

---

### `returnKeyType`

决定回车键的外观。在 Android 上你也可以使用 `returnKeyLabel`。

_跨平台_

以下值可跨平台使用：

- `done`
- `go`
- `next`
- `search`
- `send`

_仅 Android_

以下值仅可在 Android 上使用：

- `none`
- `previous`

_仅 iOS_

以下值仅可在 iOS 上使用：

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

如果为 `true`，允许 TextInput 将触摸事件传递给父组件。这使得像 SwipeableListView 这样的组件在 iOS 上也能像 Android 默认那样从 TextInput 处滑动。如果为 `false`，TextInput 总是请求处理输入（除非被禁用）。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `rows` <div className="label android">Android</div>

设置 `TextInput` 的行数。将其与 `multiline` 设为 `true` 一起使用，以便填充这些行。

| 类型   |
| ------ |
| number |

---

### `scrollEnabled` <div className="label ios">iOS</div>

如果为 `false`，文本视图的滚动将被禁用。默认值为 `true`。仅在 `multiline={true}` 时有效。

| 类型 |
| ---- |
| bool |

---

### `secureTextEntry`

如果为 `true`，文本输入会将输入的文本隐藏起来，以便密码等敏感文本保持安全。默认值为 `false`。不适用于 `multiline={true}`。

| 类型 |
| ---- |
| bool |

---

### `selection`

文本输入选区的起始和结束位置。将起始和结束设置为相同值可定位光标。

| 类型                                  |
| ------------------------------------- |
| object: `{start: number,end: number}` |

---

### `selectionColor`

文本输入的高亮色、选区把手颜色和光标颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectionHandleColor` <div className="label android">Android</div>

设置选区把手的颜色。与 `selectionColor` 不同，它允许独立自定义选区把手颜色，而不受选区颜色影响。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectTextOnFocus`

如果为 `true`，获得焦点时会自动选中全部文本。

| 类型 |
| ---- |
| bool |

---

### `showSoftInputOnFocus`

当为 `false` 时，输入框获得焦点时将阻止软键盘显示。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `smartInsertDelete` <div className="label ios">iOS</div>

如果为 `false`，iOS 系统在粘贴操作后不会额外插入空格，也不会在剪切或删除操作后删除一个或两个空格。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `spellCheck` <div className="label ios">iOS</div>

如果为 `false`，将禁用拼写检查样式（即红色下划线）。默认值继承自 `autoCorrect`。

| 类型 |
| ---- |
| bool |

---

### `submitBehavior`

当按下回车键时，

对于单行输入：

- `'newline'` 的默认值为 `'blurAndSubmit'`
- `undefined` 的默认值为 `'blurAndSubmit'`

对于多行输入：

- `'newline'` 会添加一个换行
- `undefined` 的默认值为 `'newline'`

对于单行和多行输入都适用：

- `'submit'` 只会发送提交事件，不会使输入框失焦
- `'blurAndSubmit`' 会同时使输入框失焦并发送提交事件

| 类型                                       |
| ------------------------------------------ |
| enum('submit', 'blurAndSubmit', 'newline') |

---

### `textAlign`

将输入文本对齐到输入框的左侧、居中或右侧。

`textAlign` 的可选值为：

- `left`
- `center`
- `right`

| 类型                            |
| ------------------------------- |
| enum('left', 'center', 'right') |

---

### `textContentType` <div className="label ios">iOS</div>

向键盘和系统提供用户输入内容的预期语义含义信息。

:::note
[`autoComplete`](#autocomplete) 提供相同功能，并且可用于所有平台。你可以使用 [`Platform.select`](/docs/next/platform#select) 来针对不同平台采用不同的行为。

避免同时使用 `textContentType` 和 `autoComplete`。出于向后兼容性考虑，当两者都设置时，`textContentType` 优先。
:::

你可以将 `textContentType` 设置为 `username` 或 `password`，以启用从设备钥匙串自动填充登录信息。

`newPassword` 可用于表示用户可能希望保存到钥匙串中的新密码输入，`oneTimeCode` 可用于表示字段可通过短信到达的验证码自动填充。

要禁用自动填充，请将 `textContentType` 设置为 `none`。

`textContentType` 的可选值为：

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

在 iOS 上使用 `textContentType` 作为 `newPassword` 时，我们可以让系统知道密码的最低要求，以便它生成一个满足这些要求的密码。要创建有效的 `PasswordRules` 字符串，请参阅 [Apple 文档](https://developer.apple.com/password-rules/)。

:::tip
如果密码生成对话框未出现，请确保：

- 已启用 AutoFill：**设置** → **密码与账户** → 将 **AutoFill Passwords** 切换为“开启”；
- 使用了 iCloud 钥匙串：**设置** → **Apple ID** → **iCloud** → **钥匙串** → 将 **iCloud Keychain** 切换为“开启”。
  :::

| 类型   |
| ------ |
| string |

---

### `style`

请注意，并非所有 Text 样式都受支持，未受支持项的不完整列表包括：

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

在 Android API Level 23+ 上设置文本换行策略，可选值为 `simple`、`highQuality`、`balanced`。默认值为 `highQuality`。

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

要显示在文本输入中的值。`TextInput` 是一个受控组件，这意味着如果提供了该属性，原生值将被强制与此 value prop 保持一致。对大多数场景来说这很有效，但在某些情况下可能会导致闪烁——一个常见原因是通过保持 value 不变来阻止编辑。除了设置相同的值之外，你可以设置 `editable={false}`，或者设置/更新 `maxLength`，以在不闪烁的情况下阻止不需要的编辑。

| 类型   |
| ------ |
| string |

## 方法

### `.focus()`

```tsx
focus();
```

使原生输入请求焦点。

### `.blur()`

```tsx
blur();
```

使原生输入失去焦点。

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

如果输入当前已聚焦则返回 `true`；否则返回 `false`。

# 已知问题

- [react-native#19096](https://github.com/facebook/react-native/issues/19096)：不支持 Android 的 `onKeyPreIme`。
- [react-native#19366](https://github.com/facebook/react-native/issues/19366)：通过返回按钮关闭 Android 键盘后调用 `.focus()` 不会再次弹出键盘。
- [react-native#26799](https://github.com/facebook/react-native/issues/26799)：当 `keyboardType="email-address"` 或 `keyboardType="phone-pad"` 时，不支持 Android 的 `secureTextEntry`。