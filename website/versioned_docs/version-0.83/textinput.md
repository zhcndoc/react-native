---
id: textinput
title: 文本输入框 (TextInput)
---

一个用于通过键盘向应用输入文本的基础组件。Props 提供了多个功能的配置选项，例如自动更正、自动大写、占位符文本以及不同的键盘类型，如数字键盘。

最基本的使用方式是放置一个 `TextInput`，并订阅 `onChangeText` 事件以读取用户输入。也可以订阅其他事件，例如 `onSubmitEditing` 和 `onFocus`。一个最小的示例：

```SnackPlayer name=TextInput%20Example
import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('无用的文本');
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
          placeholder="无用的占位符"
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

原生元素暴露了两个方法 `.focus()` 和 `.blur()`，可以编程式地聚焦或失焦 `TextInput`。

请注意，某些属性仅在 `multiline={true/false}` 时可用。另外，只应用于元素单侧的边框样式（例如 `borderBottomColor`，`borderLeftWidth`等）在 `multiline=true` 时不会生效。若需达到相同效果，可以将 `TextInput` 包裹在一个 `View` 中：

```SnackPlayer name=Multiline%20TextInput%20Example
import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const MultilineTextInputExample = () => {
  const [value, onChangeText] = React.useState('无用的多行占位符');

  // 如果你在文本框中输入某种颜色名称，
  // 背景色将变为该颜色。
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

`TextInput` 默认在其视图底部有一条边框。这条边框的内边距由系统提供的背景图像设定，无法修改。避免此问题的解决方案有：不显式设置高度（系统会自动调整边框显示位置），或者通过将 `underlineColorAndroid` 设置为透明来隐藏该边框。

注意，在 Android 上，在输入框中执行文字选择操作时，应用的活动 `windowSoftInputMode` 参数可能会变为 `adjustResize`。这可能导致键盘激活时使用绝对定位（position: 'absolute'）的组件出现问题。避免此问题的方法有，在 `AndroidManifest.xml` 中显式指定 `windowSoftInputMode`（ https://developer.android.com/guide/topics/manifest/activity-element.html ），或通过本地代码编程式控制此参数。

---

# 参考

## Props

### [View Props](view.md#props)

继承自 [View Props](view.md#props)。

---

### `allowFontScaling`

指定字体是否应根据文本大小的无障碍设置进行缩放。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoCapitalize`

告诉 `TextInput` 自动将某些字符大写。部分键盘类型（如 `name-phone-pad`）不支持该属性。

- `characters`：所有字符。
- `words`：每个单词的第一个字母。
- `sentences`：每句话的第一个字母（默认）。
- `none`：不自动大写任何内容。

| 类型                                             |
| ------------------------------------------------ |
| enum('none', 'sentences', 'words', 'characters') |

---

### `autoComplete`

为系统指定自动完成提示，以便提供自动填充。Android 上系统会使用启发式检测内容类型尝试提供自动填充。若要禁用自动完成，将 `autoComplete` 设置为 `off`。

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

以下值只在 iOS 上有效：

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

以下值只在 Android 上有效：

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

如果为 `false`，禁用自动更正。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `autoFocus`

如果为 `true`，使输入框自动聚焦。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### 🗑️ `blurOnSubmit`

:::warning[已弃用]
请注意，`submitBehavior` 现在取代了 `blurOnSubmit`，并且会覆盖 `blurOnSubmit` 定义的任何行为。参见 [submitBehavior](textinput#submitbehavior)。
:::

如果为 `true`，文本框在提交时将失焦。单行文本框的默认值为 `true`，多行文本框默认值为 `false`。注意，对于多行文本，当 `blurOnSubmit` 设置为 `true` 时，按回车键会使文本框失焦并触发 `onSubmitEditing` 事件，而不会插入换行符。

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

清除按钮何时显示在文本框右侧。仅支持单行 `TextInput`。默认值为 `never`。

| 类型                                                       |
| ---------------------------------------------------------- |
| enum('never', 'while-editing', 'unless-editing', 'always') |

---

### `clearTextOnFocus` <div className="label ios">iOS</div>

如果为 `true`，在开始编辑时自动清除文本框中的文本。

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

确定哪些数据类型在文本输入中转换为可点击的 URL。仅在 `multiline={true}` 且 `editable={false}` 有效。默认不检测任何数据类型。

可提供单个类型或多个类型组成的数组。

`dataDetectorTypes` 的可能值包括：

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

提供一个初始值，用户输入后会被覆盖。适用于不想监听事件或更新受控状态的场景。

| 类型   |
| ------ |
| string |

---

### `disableKeyboardShortcuts` <div className="label ios">iOS</div>

如果为 `true`，禁用键盘快捷键（撤销/重做及复制按钮）。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `false` |

---

### `cursorColor` <div className="label android">Android</div>

指定光标颜色。与 `selectionColor` 不同，光标颜色独立设置，不影响选中文本框的颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `disableFullscreenUI` <div className="label android">Android</div>

当为 `false`，若文本输入周围显示空间有限（如手机横屏），系统可能启用全屏输入模式。设为 `true` 则禁用该功能，用户始终直接在文本输入框中编辑。默认值为 `false`。

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

如果为 `true`，无文本时键盘禁用回车键，有文本时自动启用。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `enterKeyHint`

决定回车键上显示的文本。优先级高于 `returnKeyType`。

以下值跨平台适用：

- `done`
- `next`
- `search`
- `send`
- `go`

_仅 Android_

- `previous`

_仅 iOS_

- `enter`

| 类型                                                              |
| ----------------------------------------------------------------- |
| enum('enter', 'done', 'next', 'previous', 'search', 'send', 'go') |

---

### `importantForAutofill` <div className="label android">Android</div>

告诉系统在 Android API 26+ 上是否将视图中的字段包含在自动填充结构中。可选值为 `auto`、`no`、`noExcludeDescendants`、`yes` 和 `yesExcludeDescendants`。默认值为 `auto`。

- `auto`：让系统使用启发式判断视图是否重要。
- `no`：视图不重要。
- `noExcludeDescendants`：视图及其子视图都不重要。
- `yes`：视图重要。
- `yesExcludeDescendants`：视图重要，但其子视图不重要。

| 类型                                                                       |
| -------------------------------------------------------------------------- |
| enum('auto', 'no', 'noExcludeDescendants', 'yes', 'yesExcludeDescendants') |

---

### `inlineImageLeft` <div className="label android">Android</div>

如果定义，指定的图片资源将渲染在左侧。图片资源需放置在 `/android/app/src/main/res/drawable` 下，并按如下方式引用：

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

内联图片与文本输入框之间的间距。

| 类型   |
| ------ |
| number |

---

### `inputAccessoryViewID` <div className="label ios">iOS</div>

一个可选标识符，用于将自定义的 [InputAccessoryView](inputaccessoryview.md) 关联至此文本输入框。该视图在键盘上方显示，当前文本框获焦时生效。

| 类型   |
| ------ |
| string |

---

### `inputAccessoryViewButtonLabel` <div className="label ios">iOS</div>

可以覆盖默认的 [InputAccessoryView](inputaccessoryview.md) 按钮标签的可选文本。

默认标签未本地化。如需本地化，请使用此属性。

| 类型   |
| ------ |
| string |

---

### `inputMode`

类似 HTML 的 `inputmode` 属性，决定弹出的键盘类型，如 `numeric`，优先级高于 `keyboardType`。

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

决定键盘颜色。

| 类型                             |
| -------------------------------- |
| enum('default', 'light', 'dark') |

---

### `keyboardType`

决定弹出的键盘类型，如 `numeric`。

所有键盘类型截图详见 [这里](https://davidl.fr/blog/keyboard-react-native-ios-android#all-react-native-keyboard-type-examples-i-os-on-the-left-android-on-the-right)。

以下值跨平台适用：

- `default`
- `number-pad`
- `decimal-pad`
- `numeric`
- `email-address`
- `phone-pad`
- `url`

_iOS 独有_

- `ascii-capable`
- `numbers-and-punctuation`
- `name-phone-pad`
- `twitter`
- `web-search`

_Android 独有_

- `visible-password`

| 类型                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enum('default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search', 'visible-password') |

---

### `lineBreakStrategyIOS` <div className="label ios">iOS</div>

在 iOS 14+ 设置换行策略。可用值：`none`、`standard`、`hangul-word` 和 `push-out`。

| 类型                                                        | 默认值    |
| ----------------------------------------------------------- | -------- |
| enum(`'none'`, `'standard'`, `'hangul-word'`, `'push-out'`) | `'none'` |

---

### `lineBreakModeIOS` <div className="label ios">iOS</div>

在 iOS 上设置换行模式。可用值：`wordWrapping`、`char`、`clip`、`head`、`middle` 和 `tail`。

| 类型                                                                       | 默认值           |
| -------------------------------------------------------------------------- | ---------------- |
| enum(`'wordWrapping'`, `'char'`, `'clip'`, `'head'`, `'middle'`, `'tail'`) | `'wordWrapping'` |

---

### `maxFontSizeMultiplier`

指定启用 `allowFontScaling` 时字体最大缩放倍数。可能的值：

- `null/undefined`（默认）：继承父节点或全局默认（0）
- `0`：无限制，忽略父节点/全局默认
- `>= 1`：设置此节点的最大字体缩放倍数

| 类型   |
| ------ |
| number |

---

### `maxLength`

限制可输入字符的最大数量。用此属性可以避免使用 JS 逻辑来限制，防止闪烁。

| 类型   |
| ------ |
| number |

---

### `multiline`

如果为 `true`，支持多行输入。默认值为 `false`。

:::note
请注意，iOS 上文本对齐顶部，Android 上居中。为实现两端行为一致，请配合 `textAlignVertical` 设置为 `top`。
:::

| 类型 |
| ---- |
| bool |

---

### `numberOfLines`

:::note
iOS 上的 `numberOfLines` 仅在 [新架构](/architecture/landing-page) 中可用。
:::

为 `TextInput` 设置最大行数。需要与 `multiline={true}` 一起使用才有效。

| 类型   |
| ------ |
| number |

---

### `onBlur`

文本输入框失焦时调用的回调。

:::note
尝试通过 `nativeEvent` 访问 `text` 值时，可能为 `undefined`，导致错误。若需获取编辑完成后的文本值，可使用 [`onEndEditing`](textinput#onendediting)，该事件在编辑完成时触发。
:::

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onChange`

文本输入内容改变时调用的回调。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {eventCount, target, text}}`) => void |

---

### `onChangeText`

文本输入内容改变时的回调。新文本作为字符串参数传递。

| 类型     |
| -------- |
| function |

---

### `onContentSizeChange`

文本输入内容尺寸更改时调用，仅多行文本框有效。

| 类型                                                       |
| ---------------------------------------------------------- |
| (`{nativeEvent: {contentSize: {width, height} }}`) => void |

---

### `onEndEditing`

文本输入完成时调用的回调。

| 类型     |
| -------- |
| function |

---

### `onPressIn`

触摸按下时调用的回调。

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

文本输入框聚焦时调用的回调。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [TargetEvent](targetevent)}) => void` |

---

### `onKeyPress`

按键按下时调用。回调参数包含 `key` 值：`'Enter'`、`'Backspace'` 或具体字符（包括空格 `' '`）。在 `onChange` 之前触发。注意：Android 仅处理软键盘输入，硬件键盘不处理。

| 类型                                        |
| ------------------------------------------- |
| (`{nativeEvent: {key: keyValue} }`) => void |

---

### `onLayout`

组件挂载及布局变化时触发。

| 类型                                                     |
| -------------------------------------------------------- |
| `md ({nativeEvent: [LayoutEvent](layoutevent)}) => void` |

---

### `onScroll`

内容滚动时触发，可能包含其他 `ScrollEvent` 属性，但 Android 为性能考虑不提供 `contentSize`。

| 类型                                                |
| --------------------------------------------------- |
| (`{nativeEvent: {contentOffset: {x, y} }}`) => void |

---

### `onSelectionChange`

文本选择变化时调用。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {selection: {start, end} }}`) => void |

---

### `onSubmitEditing`

提交按钮按下时调用。

| 类型                                                  |
| ----------------------------------------------------- |
| (`{nativeEvent: {text, eventCount, target}}`) => void |

注意，iOS 上当 `keyboardType="phone-pad"` 时该方法不会被调用。

---

### `placeholder`

文本输入框未输入内容前显示的字符串。

| 类型   |
| ------ |
| string |

---

### `placeholderTextColor`

占位符文本的颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `readOnly`

如果为 `true`，文本不可编辑。默认值为 `false`。

| 类型 |
| ---- |
| bool |

---

### `returnKeyLabel` <div className="label android">Android</div>

为回车键设置标签，替代 `returnKeyType`。

| 类型   |
| ------ |
| string |

---

### `returnKeyType`

决定回车键的样式。Android 上可使用 `returnKeyLabel` 替代。

_跨平台可用_

- `done`
- `go`
- `next`
- `search`
- `send`

_仅 Android_

- `none`
- `previous`

_仅 iOS_

- `default`
- `emergency-call`
- `google`
- `join`
- `route`
- `yahoo`

| 类型                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------- |
| enum('done', 'go', 'next', 'search', 'send', 'none', 'previous', 'default', 'emergency-call', 'google', 'join', 'route', 'yahoo') |

---

### `rejectResponderTermination` <div className="label ios">iOS</div>

如果为 `true`，允许 `TextInput` 将触摸事件传递给父组件，使得如 SwipeableListView 这种可滑动组件在 iOS 上也能从 `TextInput` 上滑动（Android 默认即如此）。`false` 时，除非禁用，否则 `TextInput` 会请求处理输入。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `rows` <div className="label android">Android</div>

为 `TextInput` 设置行数。需要配合 `multiline={true}` 使用。

| 类型   |
| ------ |
| number |

---

### `scrollEnabled` <div className="label ios">iOS</div>

如果为 `false`，禁用文本视图滚动。默认值为 `true`。仅在多行文本时有效。

| 类型 |
| ---- |
| bool |

---

### `secureTextEntry`

如果为 `true`，文本输入会遮蔽内容，确保密码等敏感信息安全。默认值为 `false`。不支持多行文本。

| 类型 |
| ---- |
| bool |

---

### `selection`

文本输入的选择起止位置。设置相同的起止位置表示光标位置。

| 类型                                  |
| ------------------------------------- |
| object: `{start: number,end: number}` |

---

### `selectionColor`

文本输入的高亮颜色、选择柄和光标颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectionHandleColor` <div className="label android">Android</div>

设置选择柄颜色。允许单独自定义选择柄颜色，与 `selectionColor` 独立。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `selectTextOnFocus`

如果为 `true`，聚焦时自动选中所有文本。

| 类型 |
| ---- |
| bool |

---

### `showSoftInputOnFocus`

如果为 `false`，聚焦时不弹出软键盘。默认值为 `true`。

| 类型 |
| ---- |
| bool |

---

### `smartInsertDelete` <div className="label ios">iOS</div>

如果为 `false`，iOS 系统不会在粘贴后自动插入额外空格，也不会在剪切或删除时删除空格。

| 类型 | 默认值 |
| ---- | ------- |
| bool | `true`  |

---

### `spellCheck` <div className="label ios">iOS</div>

如果为 `false`，禁用拼写检查（红色下划线）。默认继承自 `autoCorrect`。

| 类型 |
| ---- |
| bool |

---

### `submitBehavior`

当回车键按下时的行为：

单行输入框：

- `'newline'` 默认视为 `'blurAndSubmit'`
- `undefined` 默认视为 `'blurAndSubmit'`

多行输入框：

- `'newline'` 插入换行符
- `undefined` 默认视为 `'newline'`

单行和多行输入均适用：

- `'submit'` 只触发提交事件，不失焦
- `'blurAndSubmit'` 失焦并触发提交事件

| 类型                                       |
| ------------------------------------------ |
| enum('submit', 'blurAndSubmit', 'newline') |

---

### `textAlign`

设置输入文本在输入框内的对齐方式，可选：

- `left`
- `center`
- `right`

| 类型                            |
| ------------------------------- |
| enum('left', 'center', 'right') |

---

### `textContentType` <div className="label ios">iOS</div>

向键盘和系统告知用户输入内容的语义类型。

:::note
[`autoComplete`](#autocomplete) 提供类似功能，适用于所有平台。可结合 [`Platform.select`](/docs/next/platform#select) 处理不同平台。

避免同时使用 `textContentType` 和 `autoComplete`，兼容性考虑下，两者同时设置时优先使用 `textContentType`。
:::

设置 `textContentType` 为 `username` 或 `password` 可启用设备钥匙串自动填充登录信息。

`newPassword` 表示新密码输入，需要保存至钥匙串；`oneTimeCode` 表示字段可通过短信验证码自动填充。

设置 `textContentType` 为 `none` 可禁用自动填充。

`textContentType` 的可能值：

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

当 `textContentType` 设为 `newPassword` 时，可告诉系统密码的最低要求，以便生成满足要求的密码。有效字符串可参考 [Apple 文档](https://developer.apple.com/password-rules/)。

:::tip
若未弹出密码生成对话框，请确保：

- 自动填充启用：设置 → 密码与账户 → 启用「自动填充密码」
- 使用 iCloud 钥匙串：设置 → Apple ID → iCloud → 钥匙串 → 启用「iCloud 钥匙串」
:::

| 类型   |
| ------ |
| string |

---

### `style`

请注意，并非所有文本样式均支持，以下样式不支持：

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

在 Android API 23+ 上设置文本断行策略。可能值：`simple`、`highQuality`、`balanced`。默认值为 `highQuality`。

| 类型                                      |
| ----------------------------------------- |
| enum('simple', 'highQuality', 'balanced') |

---

### `underlineColorAndroid` <div className="label android">Android</div>

设置 `TextInput` 下划线颜色。

| 类型               |
| ------------------ |
| [color](colors.md) |

---

### `value`

文本输入框显示的值。`TextInput` 是受控组件，若提供该属性，原生值会强制匹配。大多数情况下该方法良好，但某些场景可能导致闪烁（如持续设置相同的值阻止编辑）。除了设置相同的值，还应设置 `editable={false}`，或调整/设置 `maxLength`，避免出现不希望的闪烁。

| 类型   |
| ------ |
| string |

## Methods

### `.focus()`

```tsx
focus();
```

Give the native input focus.

### `.blur()`

```tsx
blur();
```

Remove focus from the native input.

### `clear()`

```tsx
clear();
```

Clears all text from the `TextInput`.

---

### `isFocused()`

```tsx
isFocused(): boolean;
```

Returns `true` if the input currently has focus, `false` otherwise.

# Known Issues

- [react-native#19096](https://github.com/facebook/react-native/issues/19096): Android `onKeyPreIme` is not supported.
- [react-native#19366](https://github.com/facebook/react-native/issues/19366): Calling `.focus()` after dismissing the Android keyboard with the back button does not reopen the keyboard.
- [react-native#26799](https://github.com/facebook/react-native/issues/26799): Android does not support `secureTextEntry` when `keyboardType="email-address"` or `keyboardType="phone-pad"`.
