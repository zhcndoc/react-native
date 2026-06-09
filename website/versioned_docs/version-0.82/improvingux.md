---
id: improvingux
title: 改善用户体验
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 配置文本输入

在触屏手机上输入文本是一个挑战——屏幕小、软件键盘占空间。但根据你需要的数据类型，只要正确配置文本输入，就能让它更容易使用：

- 自动聚焦第一个字段
- 使用占位文本作为预期数据格式示例
- 启用或禁用自动首字母大写和自动更正
- 选择键盘类型（例如电子邮件、数字）
- 确保回车按钮可聚焦下一个字段或提交表单

更多配置选项请查看 [`TextInput` 文档](textinput.md)。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=TextInput%20form%20example&ext=js
import {useState, useRef} from 'react';
import {
  Alert,
  Text,
  StatusBar,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

const App = () => {
  const emailInput = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = () => {
    Alert.alert(
      `欢迎，${name}！确认邮件已发送至 ${email}`,
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.description}>
          这个演示展示了如何使用可用的 TextInput 自定义来让表单更易用。试着填写表单，并注意不同字段具有特定优化，以及回车键会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Full Name"
        autoFocus={true}
        autoCapitalize="words"
        autoCorrect={true}
        keyboardType="default"
        returnKeyType="next"
        onSubmitEditing={() => emailInput.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        ref={emailInput}
        placeholder="email@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="send"
        onSubmitEditing={submit}
        blurOnSubmit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    padding: 20,
    backgroundColor: '#282c34',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=TextInput%20form%20example&ext=tsx
import {useState, useRef} from 'react';
import {
  Alert,
  Text,
  StatusBar,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

const App = () => {
  const emailInput = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = () => {
    Alert.alert(
      `欢迎，${name}！确认邮件已发送至 ${email}`,
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.description}>
          这个演示展示了如何使用可用的 TextInput 自定义来让表单更易用。试着填写表单，并注意不同字段具有特定优化，以及回车键会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Full Name"
        autoFocus={true}
        autoCapitalize="words"
        autoCorrect={true}
        keyboardType="default"
        returnKeyType="next"
        onSubmitEditing={() => emailInput.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        ref={emailInput}
        placeholder="email@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="send"
        onSubmitEditing={submit}
        blurOnSubmit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    padding: 20,
    backgroundColor: '#282c34',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
});

export default App;
```

</TabItem>
</Tabs>

## 当键盘可见时管理布局

软件键盘几乎会占据屏幕的一半。如果你有可能被键盘遮挡的交互元素，请使用 [`KeyboardAvoidingView` 组件](keyboardavoidingview.md) 确保它们仍然可访问。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=KeyboardAvoidingView%20example&ext=js
import {useState, useRef} from 'react';
import {
  Alert,
  Text,
  Button,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  View,
  StyleSheet,
} from 'react-native';

const App = () => {
  const emailInput = useRef(null);
  const [email, setEmail] = useState('');

  const submit = () => {
    emailInput.current.blur();
    Alert.alert(`确认邮件已发送至 ${email}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.description}>
          这个演示展示了如何避免软件键盘遮挡重要的 UI 元素。聚焦下面的电子邮件输入框，你会注意到“注册”按钮和文本的位置已调整，以确保它们不会被键盘遮住。
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.form}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
          ref={emailInput}
          placeholder="email@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={submit}
          blurOnSubmit={true}
        />
        <View>
          <Button title="注册" onPress={submit} />
          <Text style={styles.legal}>这里是一些重要的法律声明细则</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    padding: 20,
    backgroundColor: '#282c34',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    margin: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=KeyboardAvoidingView%20example&ext=tsx
import {useState, useRef} from 'react';
import {
  Alert,
  Text,
  Button,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  View,
  StyleSheet,
} from 'react-native';

const App = () => {
  const emailInput = useRef<TextInput>(null);
  const [email, setEmail] = useState('');

  const submit = () => {
    emailInput.current?.blur();
    Alert.alert(`确认邮件已发送至 ${email}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.description}>
          这个演示展示了如何避免软件键盘遮挡重要的 UI 元素。聚焦下面的电子邮件输入框，你会注意到“注册”按钮和文本的位置已调整，以确保它们不会被键盘遮住。
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.form}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
          ref={emailInput}
          placeholder="email@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={submit}
          blurOnSubmit={true}
        />
        <View>
          <Button title="注册" onPress={submit} />
          <Text style={styles.legal}>这里是一些重要的法律声明细则</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    padding: 20,
    backgroundColor: '#282c34',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
  },
  legal: {
    margin: 10,
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default App;
```

</TabItem>
</Tabs>

## 让可点击区域更大

在手机上按按钮时很难做到非常精确。请确保所有可交互元素的尺寸至少为 44x44。实现这一点的一种方法是为元素留出足够空间，`padding`、`minWidth` 和 `minHeight` 这类样式值会很有帮助。或者，你也可以使用 [`hitSlop` prop](touchablewithoutfeedback.md#hitslop) 在不影响布局的情况下增大可交互区域。下面是一个演示：

```SnackPlayer name=HitSlop%20example
import {
  Text,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.description}>
          这个演示展示了使用 hitSlop 如何让可交互元素更容易点击，而不会改变它们的布局和大小。试着快速多次按下每个按钮，看看哪个更容易点中。
        </Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity>
          <Text style={styles.label}>不使用 hitSlop</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.preview}>
          <TouchableOpacity
            hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
            <Text style={styles.label}>使用 hitSlop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    padding: 20,
    backgroundColor: '#282c34',
  },
  description: {
    fontSize: 14,
    color: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: '#336699',
    textAlign: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  separator: {
    height: 50,
  },
  preview: {
    padding: 20,
    backgroundColor: '#f6f6f6',
  },
});

export default App;
```

## 使用 Android Ripple

Android API 21+ 使用 material design ripple 在用户触摸屏幕上的可交互区域时提供反馈。React Native 通过 [`TouchableNativeFeedback` 组件](touchablenativefeedback.md) 暴露了这一能力。使用这种触摸效果而不是透明度变化或高亮，通常会让你的应用在该平台上显得更贴合原生体验。不过，使用时需要注意，因为它在 iOS 或 Android API < 21 上都不起作用，所以你需要在 iOS 上回退到使用其他 Touchable 组件之一。你可以使用像 [react-native-platform-touchable](https://github.com/react-community/react-native-platform-touchable) 这样的库来帮你处理平台差异。

```SnackPlayer name=Android%20Ripple%20example&supportedPlatforms=android
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Text,
  View,
  StyleSheet,
} from 'react-native';

const SUPPORTS_NATIVE_FEEDBACK =
  Platform.OS === 'android' && Platform.Version >= 21;

const noop = () => {};
const defaultHitSlop = {top: 15, bottom: 15, right: 15, left: 15};

const ButtonsWithNativeFeedback = () => (
  <View style={styles.buttonContainer}>
    <TouchableNativeFeedback
      onPress={noop}
      background={TouchableNativeFeedback.Ripple('#06bcee', false)}
      hitSlop={defaultHitSlop}>
      <View style={styles.button}>
        <Text style={styles.text}>这是一个尊重边框的 ripple 效果</Text>
      </View>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={noop}
      background={TouchableNativeFeedback.Ripple('#06bcee', true)}
      hitSlop={defaultHitSlop}>
      <View style={styles.button}>
        <Text style={styles.text}>
          这是不带边框的 ripple，这种效果更适合图标，例如在
          标签栏中使用
        </Text>
      </View>
    </TouchableNativeFeedback>
  </View>
);

const Buttons = () => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.button}
      onPress={noop}
      hitSlop={defaultHitSlop}>
      <Text style={styles.text}>这是 opacity</Text>
    </TouchableOpacity>
    <TouchableHighlight
      style={styles.button}
      onPress={noop}
      hitSlop={defaultHitSlop}
      underlayColor="#06bcee">
      <Text style={styles.text}>这是 highlight</Text>
    </TouchableHighlight>
  </View>
);

const App = () => (
  <View style={styles.container}>
    {SUPPORTS_NATIVE_FEEDBACK ? <ButtonsWithNativeFeedback /> : <Buttons />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    margin: 24,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    padding: 25,
    borderRadius: 5,
    backgroundColor: '#000',
    marginBottom: 30,
  },
});

export default App;
```

## 屏幕方向锁定

默认情况下，多种屏幕方向应该都能正常工作，除非你使用了 `Dimensions` API 但没有处理方向变化。如果你不想支持多种屏幕方向，可以将屏幕方向锁定为竖屏或横屏之一。

在 iOS 上，在 Xcode 的 General 选项卡和 Deployment Info 部分启用你想支持的设备方向（进行更改时请确保在 Devices 菜单中选择了 iPhone）。对于 Android，打开 AndroidManifest.xml 文件，并在 activity 元素中添加 `'android:screenOrientation="portrait"'` 以锁定为竖屏，或者添加 `'android:screenOrientation="landscape"'` 以锁定为横屏。

# 了解更多

[Material Design](https://material.io/) 和 [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) 是了解更多移动平台设计的极佳资源。
