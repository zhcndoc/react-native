---
id: handling-touches
title: 处理触摸
---

用户主要通过触摸与移动应用进行交互。他们可以使用各种手势组合，例如点击按钮、滚动列表或缩放地图。React Native 提供了组件来处理各种常见手势，以及一个全面的 [手势响应系统](gesture-responder-system.md) 以允许更高级的手势识别，但你最可能感兴趣的组件是基本的 Button。

## 显示基本按钮

[Button](button.md) 提供了一个在所有平台上都能良好渲染的基本按钮组件。显示按钮的最小示例如下：

```tsx
<Button
  onPress={() => {
    console.log('You tapped the button!');
  }}
  title="Press Me"
/>
```

这将在 iOS 上渲染一个蓝色标签，在 Android 上渲染一个带有浅色文本的蓝色圆角矩形。按下按钮将调用 "onPress" 函数，在本例中它显示一个警报弹窗。如果你愿意，你可以指定一个 "color" 属性来改变按钮的颜色。

![](/docs/assets/Button.png)

请使用下面的示例随意尝试 `Button` 组件。你可以通过点击右下角的切换按钮来选择你的应用预览的平台，然后点击 "点击播放" 来预览应用。

```SnackPlayer name=Button%20Basics
import React from 'react';
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

## 可触摸组件

如果基本按钮不适合你的应用，你可以使用 React Native 提供的任何 "Touchable" 组件来构建自己的按钮。这些组件提供了捕获点击手势的能力，并且可以在识别出手势时显示反馈。但是，这些组件不提供任何默认样式，因此你需要做一些工作才能让它们在应用中看起来不错。

你使用哪个 "Touchable" 组件将取决于你想要提供什么样的反馈：

- 通常，你可以在任何网页上使用按钮或链接的地方使用 [**TouchableHighlight**](touchablehighlight.md)。当用户按下按钮时，视图的背景会变暗。

- 你可以考虑在 Android 上使用 [**TouchableNativeFeedback**](touchablenativefeedback.md) 来显示响应用户触摸的墨水表面反应涟漪。

- [**TouchableOpacity**](touchableopacity.md) 可用于通过降低按钮的不透明度来提供反馈，允许用户在按下时看到背景。

- 如果你需要处理点击手势但不想显示任何反馈，请使用 [**TouchableWithoutFeedback**](touchablewithoutfeedback.md)。

在某些情况下，你可能想要检测用户何时按下并保持视图一段时间。这些长按可以通过将函数传递给任何 "Touchable" 组件的 `onLongPress` 属性来处理。

让我们看看所有这些的实际效果：

```SnackPlayer name=Touchables
import React from 'react';
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

在带有触摸屏的设备上常用的手势包括滑动和平移。这些允许用户滚动项目列表或滑动内容页面。对于这些，请查看 [ScrollView](scrollview.md) 核心组件。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162): 触摸区域从不扩展到父视图边界之外，并且在 Android 上不支持负边距。
