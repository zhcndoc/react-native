---
id: improvingux
title: 提升用户体验
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 配置文本输入框

在触屏手机上输入文本是一个挑战——屏幕小，软件键盘。但根据你需要输入的数据类型，通过正确配置文本输入框可以让输入更简便：

- 自动聚焦第一个输入框
- 使用占位符文本示例展示预期数据格式
- 启用或禁用首字母大写和自动纠错
- 选择键盘类型（例如电子邮件、数字键盘）
- 确保回车键聚焦下一个输入框或提交表单

查看 [`TextInput` 文档](textinput.md) 了解更多配置选项。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=TextInput%20form%20example&ext=js
import React, {useState, useRef} from 'react';
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
          此演示展示了如何通过现有的 TextInput 定制，使表单更加易用。尝试完成表单，你会发现不同的输入框有专门的优化，回车键的功能会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="全名"
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
import React, {useState, useRef} from 'react';
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
          此演示展示了如何通过现有的 TextInput 定制，使表单更加易用。尝试完成表单，你会发现不同的输入框有专门的优化，回车键的功能会从聚焦下一个输入框变为提交表单。
        </Text>
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="全名"
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

## 在键盘显示时管理布局

软件键盘占据了屏幕差不多一半的空间。如果有交互元素可能被键盘遮挡，请确保它们仍然可访问，可使用 [`KeyboardAvoidingView` 组件](keyboardavoidingview.md) 来实现。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=KeyboardAvoidingView%20example&ext=js
import React, {useState, useRef} from 'react';
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
          此演示展示如何避免软件键盘遮挡重要的 UI 元素。聚焦下面的电子邮件输入框后，你会注意到“注册”按钮和文本的位置做了调整，确保它们不会被键盘遮住。
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
          <Text style={styles.legal}>这里有一些重要的法律说明</Text>
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
import React, {useState, useRef} from 'react';
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
          此演示展示如何避免软件键盘遮挡重要的 UI 元素。聚焦下面的电子邮件输入框后，你会注意到“注册”按钮和文本的位置做了调整，确保它们不会被键盘遮住。
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
          <Text style={styles.legal}>这里有一些重要的法律说明</Text>
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

## 增大可点击区域

在手机上点击按钮时不易精准操作。请确保所有交互元素的尺寸至少为 44x44。实现方法之一是给元素留出足够空间，使用 `padding`、`minWidth` 和 `minHeight` 样式属性都很有用。或者，可以使用 [`hitSlop` 属性](touchablewithoutfeedback.md#hitslop) 来扩大点击区域，同时不改变布局。下面是一个示例：

```SnackPlayer name=HitSlop%20example
import React from 'react';
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
          该演示展示了如何使用 hitSlop 在不改变布局和大小的情况下，使交互元素更易于点击。试着连续快速点击每个按钮，感受哪个按钮更易被点击命中。
        </Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity>
          <Text style={styles.label}>无 hitSlop</Text>
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

## 使用 Android 水波纹效果

Android API 21+ 使用 Material Design 风格的水波纹效果，给用户在点按屏幕交互区域时的反馈。React Native 通过 [`TouchableNativeFeedback` 组件](touchablenativefeedback.md) 暴露此效果。使用此组件代替透明度或高亮效果，通常会让你的应用在该平台更贴切。不过请注意，该组件不支持 iOS 或 Android API 小于 21 的版本，因此你需要在 iOS 使用其他 Touchable 组件作为替代。你也可以使用像 [react-native-platform-touchable](https://github.com/react-community/react-native-platform-touchable) 这样的库，来帮你处理跨平台差异。

```SnackPlayer name=Android%20Ripple%20example&supportedPlatforms=android
import React from 'react';
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
        <Text style={styles.text}>这是一个带边界的水波纹效果</Text>
      </View>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={noop}
      background={TouchableNativeFeedback.Ripple('#06bcee', true)}
      hitSlop={defaultHitSlop}>
      <View style={styles.button}>
        <Text style={styles.text}>
          这是无边界的水波纹效果，更适合图标，例如标签栏
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
      <Text style={styles.text}>这是透明度效果</Text>
    </TouchableOpacity>
    <TouchableHighlight
      style={styles.button}
      onPress={noop}
      hitSlop={defaultHitSlop}
      underlayColor="#06bcee">
      <Text style={styles.text}>这是高亮效果</Text>
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

除非你使用 `Dimensions` API 并处理了屏幕旋转，否则多种屏幕方向默认应该能正常工作。如果你不希望支持多种屏幕方向，可以将屏幕方向锁定为竖屏或横屏。

在 iOS 上，打开 Xcode 的"General"标签页，在"Deployment Info"部分启用你想支持的设备方向（确保修改前在设备选项中选中了 iPhone）。在 Android 上，打开 AndroidManifest.xml 文件，在 `<activity>` 元素内添加 `android:screenOrientation="portrait"` 锁定为竖屏，或 `android:screenOrientation="landscape"` 锁定为横屏。

# 了解更多

[Material Design](https://material.io/) 和 [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) 是学习移动平台设计的绝佳资源。