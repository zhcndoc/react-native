---
id: handling-touches
title: 处理触摸
---

用户主要通过触摸与移动应用进行交互。他们可以组合使用各种手势，例如点击按钮、滚动列表或缩放地图。React Native 提供了用于处理各种常见手势的组件，以及全面的[手势响应者系统](gesture-responder-system.md)，以支持更高级的手势识别，但你最有可能感兴趣的组件是基本的 Button。

## 显示基本按钮

[Button](button.md) 提供了一个在所有平台上都能良好呈现的基本按钮组件。显示按钮的最简示例如下：

```tsx
<Button
  onPress={() => {
    console.log('You tapped the button!');
  }}
  title="Press Me"
/>
```

在 iOS 上，这将呈现一个蓝色标签；在 Android 上，则会呈现一个带有浅色文字的蓝色圆角矩形。按下按钮将调用“onPress”函数，在本例中，该函数会显示一个警告弹窗。如果你愿意，可以指定“color”属性来更改按钮的颜色。

![](/docs/assets/Button.png)

请尝试使用下面的示例来操作 `Button` 组件。你可以点击右下角的切换按钮来选择应用预览的平台，然后点击“Tap to Play”来预览应用。

```SnackPlayer name=Button%20Basics
import {Alert, Button, StyleSheet, View} from 'react-native';

const ButtonBasics = () => {
  const onPress = () => {
    Alert.alert('You tapped the button!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Press Me" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Press Me" color="#841584" />
      </View>
      <View style={styles.alternativeLayoutButtonContainer}>
        <Button onPress={onPress} title="This looks great!" />
        <Button onPress={onPress} title="OK!" color="#841584" />
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

## Touchables

如果基本按钮不适合你的应用，你可以使用 React Native 提供的任意“Touchable”组件来构建自己的按钮。这些组件可以捕获点击手势，并在识别到手势时显示反馈。不过，这些组件不提供任何默认样式，因此你需要做一些工作，才能让它们在应用中看起来更美观。

你使用哪种“Touchable”组件取决于你想提供哪种反馈：

- 通常，在 Web 上使用按钮或链接的任何地方，都可以使用 [**TouchableHighlight**](touchablehighlight.md)。当用户按下按钮时，视图的背景会变暗。

- 你可以考虑在 Android 上使用 [**TouchableNativeFeedback**](touchablenativefeedback.md)，以显示响应用户触摸的墨水表面反应波纹。

- [**TouchableOpacity**](touchableopacity.md) 可以通过降低按钮的不透明度来提供反馈，让用户按下按钮时可以透过按钮看到背景。

- 如果你需要处理点击手势，但不希望显示任何反馈，请使用 [**TouchableWithoutFeedback**](touchablewithoutfeedback.md)。

在某些情况下，你可能希望检测用户是否按住视图达到指定时长。可以将函数传递给任意“Touchable”组件的 `onLongPress` 属性来处理这些长按操作。

让我们看看这些组件的实际效果：

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
            {Platform.OS !== 'android' ? '(Android only)' : ''}
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
          <Text style={styles.buttonText}>Touchable with Long Press</Text>
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

## 滚动和滑动

触摸屏设备上常用的手势包括滑动和平移。这些手势允许用户滚动浏览项目列表，或滑动浏览内容页面。对于这些操作，请查看[核心组件 ScrollView](scrollview.md)。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162)：触摸区域永远不会扩展到父视图边界之外，并且在 Android 上不支持负边距。
