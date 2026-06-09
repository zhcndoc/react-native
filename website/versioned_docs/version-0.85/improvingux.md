---
id: improvingux
title: 提升用户体验
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 配置文本输入

在触摸手机上输入文本是一项挑战——屏幕小，还有软件键盘。但根据你需要的数据类型，可以通过正确配置文本输入来让它更容易一些：

- 自动聚焦第一个字段
- 使用占位文本作为所需数据格式的示例
- 启用或禁用自动大写和自动更正
- 选择键盘类型（例如：电子邮件、数字）
- 确保回车按钮会聚焦下一个字段或提交表单

查看 [`TextInput` 文档](textinput.md) 了解更多配置选项。

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
          这个演示展示了如何利用可用的 `TextInput` 自定义配置让表单更易于使用。尝试填写表单，并注意不同字段具有特定优化，以及回车键会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="姓名全称"
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
          这个演示展示了如何利用可用的 `TextInput` 自定义配置让表单更易于使用。尝试填写表单，并注意不同字段具有特定优化，以及回车键会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="姓名全称"
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

## 键盘可见时管理布局

软件键盘会占据屏幕将近一半的空间。如果你有可能被键盘遮住的交互元素，请务必使用 [`KeyboardAvoidingView` 组件](keyboardavoidingview.md) 确保它们仍然可访问。

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
          这个演示展示了如何避免重要的界面元素被软件键盘遮挡。聚焦下面的电子邮件输入框，并注意“注册”按钮和文本的位置已调整，以确保它们不会被键盘隐藏。
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
          <Text style={styles.legal}>这里有一些重要的法律细则</Text>
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
          这个演示展示了如何避免重要的界面元素被软件键盘遮挡。聚焦下面的电子邮件输入框，并注意“注册”按钮和文本的位置已调整，以确保它们不会被键盘隐藏。
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
          <Text style={styles.legal}>这里有一些重要的法律细则</Text>
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

## 使可点击区域更大

在手机上按按钮时，很难做到非常精确。请确保所有交互元素的尺寸至少为 44x44。实现这一点的一种方法是为元素留出足够空间，`padding`、`minWidth` 和 `minHeight` 这些样式值会很有用。或者，你也可以使用 [`hitSlop` 属性](touchablewithoutfeedback.md#hitslop) 在不影响布局的情况下增大可交互区域。下面是一个示例：

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
          这个示例展示了使用 hitSlop 如何在不改变布局和尺寸的情况下，让交互元素更容易点击。试着快速多次按下每个按钮，看看哪个更容易命中。
        </Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity>
          <Text style={styles.label}>Without hitSlop</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.preview}>
          <TouchableOpacity
            hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
            <Text style={styles.label}>With hitSlop</Text>
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

Android API 21+ 使用 Material Design 的 ripple（涟漪）效果，在用户触摸屏幕上的可交互区域时提供反馈。React Native 通过 [`TouchableNativeFeedback` 组件](touchablenativefeedback.md) 暴露了这一能力。使用这种触摸效果替代透明度变化或高亮，通常会让你的应用更符合平台风格。不过，使用它时需要小心，因为它在 iOS 上以及 Android API < 21 的设备上都无法工作，因此你需要在 iOS 上回退使用其他 Touchable 组件之一。你可以使用像 [react-native-platform-touchable](https://github.com/react-community/react-native-platform-touchable) 这样的库来帮你处理平台差异。

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
        <Text style={styles.text}>This is a ripple respecting borders</Text>
      </View>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={noop}
      background={TouchableNativeFeedback.Ripple('#06bcee', true)}
      hitSlop={defaultHitSlop}>
      <View style={styles.button}>
        <Text style={styles.text}>
          This is ripple without borders, this is more useful for icons, eg: in
          tab bar
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
      <Text style={styles.text}>This is opacity</Text>
    </TouchableOpacity>
    <TouchableHighlight
      style={styles.button}
      onPress={noop}
      hitSlop={defaultHitSlop}
      underlayColor="#06bcee">
      <Text style={styles.text}>This is highlight</Text>
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

## 锁定屏幕方向

默认情况下，多种屏幕方向都应该可以正常工作，除非你使用了 `Dimensions` API 且没有处理方向变化。如果你不想支持多种屏幕方向，可以将屏幕方向锁定为竖屏或横屏。

在 iOS 上，在 Xcode 的 General 选项卡和 Deployment Info 部分启用你想支持的设备方向（进行更改时请确保在 Devices 菜单中选择了 iPhone）。对于 Android，打开 AndroidManifest.xml 文件，并在 activity 元素中添加 `'android:screenOrientation="portrait"'` 来锁定为竖屏，或添加 `'android:screenOrientation="landscape"'` 来锁定为横屏。

# 了解更多

[Material Design](https://material.io/) 和 [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) 是学习如何为移动平台设计的极佳资源。
