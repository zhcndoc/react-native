---
id: handling-touches
title: 处理触摸
---

用户主要通过触摸与移动应用交互。他们可以组合使用多种手势，例如点击按钮、滚动列表或在地图上缩放。React Native 提供了用于处理各种常见手势的组件，以及一个全面的 [手势响应系统](gesture-responder-system.md)，以支持更高级的手势识别。不过，你最可能会感兴趣的组件是基础的 Button。

## 显示基础按钮

[Button](button.md) 提供了一个基础按钮组件，在所有平台上都能很好地渲染。显示按钮的最小示例如下：

```tsx
<Button
  onPress={() => {
    console.log('You tapped the button!');
  }}
  title="按我"
/>
```

这将在 iOS 上渲染一个蓝色标签，在 Android 上渲染一个带浅色文字的蓝色圆角矩形。按下按钮会调用 `"onPress"` 函数，在这个例子中会显示一个警报弹窗。如果你愿意，也可以指定一个 `"color"` 属性来更改按钮的颜色。

![](/docs/assets/Button.png)

你可以使用下面的示例继续尝试 `Button` 组件。你可以通过点击右下角的切换开关来选择应用预览的平台，然后点击 "Tap to Play" 来预览应用。

```SnackPlayer name=Button%20Basics
import {Alert, Button, StyleSheet, View} from 'react-native';

const ButtonBasics = () => {
  const onPress = () => {
    Alert.alert('You tapped the button!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="按我" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="按我" color="#841584" />
      </View>
      <View style={styles.alternativeLayoutButtonContainer}>
        <Button onPress={onPress} title="看起来很棒！" />
        <Button onPress={onPress} title="好！" color="#841584" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ButtonBasics;
```

## 可触摸组件

如果基础按钮不适合你的应用，你可以使用 React Native 提供的任意 "Touchable" 组件来自己构建按钮。这些组件提供了捕获点击手势的能力，并且在识别到手势时可以显示反馈。不过，这些组件不提供任何默认样式，所以你需要花一点功夫让它们在应用中看起来更美观。

你使用哪种 "Touchable" 组件，取决于你想提供什么样的反馈：

- 一般来说，你可以在任何会在网页上使用按钮或链接的地方使用 [**TouchableHighlight**](touchablehighlight.md)。当用户按下按钮时，视图的背景会变暗。

- 你可以考虑在 Android 上使用 [**TouchableNativeFeedback**](touchablenativefeedback.md) 来显示响应用户触摸的水波纹效果。

- [**TouchableOpacity**](touchableopacity.md) 可以通过降低按钮的不透明度来提供反馈，从而在用户按下时让背景透出来。

- 如果你需要处理点击手势，但又不想显示任何反馈，可以使用 [**TouchableWithoutFeedback**](touchablewithoutfeedback.md)。

在某些情况下，你可能希望检测用户按住视图一段时间的操作。这些长按可以通过向任意 "Touchable" 组件的 `onLongPress` props 传入一个函数来处理。

让我们看看这些在实际中的效果：

```SnackPlayer name=Touchables
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const Touchables = () => {
  const onPressButton = () => {
    Alert.alert('You tapped the button!');
  };

  const onLongPressButton = () => {
    Alert.alert('You long-pressed the button!');
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={onPressButton} underlayColor="white">
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableHighlight</Text>
        </View>
      </TouchableHighlight>
      <TouchableOpacity onPress={onPressButton}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableOpacity</Text>
        </View>
      </TouchableOpacity>
      <TouchableNativeFeedback
        onPress={onPressButton}
        background={
          Platform.OS === 'android'
            ? TouchableNativeFeedback.SelectableBackground()
            : undefined
        }>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            TouchableNativeFeedback{' '}
            {Platform.OS !== 'android' ? '(仅限 Android)' : ''}
          </Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableWithoutFeedback onPress={onPressButton}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableHighlight
        onPress={onPressButton}
        onLongPress={onLongPressButton}
        underlayColor="white">
        <View style={styles.button}>
          <Text style={styles.buttonText}>支持长按的 Touchable</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});

export default Touchables;
```

## 滚动与滑动

触摸屏设备上常见的手势包括滑动和拖动。这些手势可让用户滚动浏览项目列表，或在内容页面之间滑动。对于这些场景，请查看 [ScrollView](scrollview.md) 核心组件。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162)：触摸区域不会超出父视图边界，而且在 Android 上不支持负外边距。
