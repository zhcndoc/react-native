---
id: handling-touches
title: 处理触摸事件
---

用户主要通过触摸与移动应用交互。他们可以使用各种手势组合，比如点击按钮、滚动列表或在地图上缩放。React Native 提供了各种组件来处理常见的手势，以及一个全面的 [手势响应系统](gesture-responder-system.md)，用于实现更高级的手势识别，但你最有可能感兴趣的组件是基础的 Button。

## 显示基础按钮

[Button](button.md) 提供了一个基础按钮组件，能够在所有平台上都很好地渲染。显示一个按钮的最简示例如下：

```tsx
<Button
  onPress={() => {
    console.log('你点了这个按钮！');
  }}
  title="Press Me"
/>
```

这将在 iOS 上渲染蓝色标签，在 Android 上渲染蓝色圆角矩形且文字较浅。点击按钮时将调用 "onPress" 函数，这里是显示一个警告弹窗。如果你愿意，可以指定 "color" 属性来改变按钮的颜色。

![](/docs/assets/Button.png)

你可以使用下面的示例尽情玩转 `Button` 组件。通过点击右下角的切换按钮选择预览的运行平台，然后点击"Tap to Play"预览应用。

```SnackPlayer name=Button%20Basics
import {Alert, Button, StyleSheet, View} from 'react-native';

const ButtonBasics = () => {
  const onPress = () => {
    Alert.alert('你点了这个按钮！');
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

## 可触摸组件（Touchables）

如果基础按钮不适合你的应用，你可以使用 React Native 提供的任意"Touchable"组件自己构建按钮。这些组件能捕获点击手势，并在识别手势时显示反馈。然而，它们没有默认样式，因此你需要对样式进行一些调整才能让它们在你的应用中看起来美观。

你使用哪个"Touchable"组件取决于你想提供什么样的反馈：

- 通常，你可以在任何用作按钮或链接的位置使用 [**TouchableHighlight**](touchablehighlight.md)。当用户按下按钮时，该视图的背景将变暗。

- 在 Android 上，你可以考虑使用 [**TouchableNativeFeedback**](touchablenativefeedback.md) 来显示响应用户触摸的墨水涟漪效果。

- [**TouchableOpacity**](touchableopacity.md) 可以通过降低按钮的不透明度来提供反馈，让用户按下时能看见背景透出。

- 如果你需要处理点击手势但不想显示任何反馈，使用 [**TouchableWithoutFeedback**](touchablewithoutfeedback.md)。

有时，你可能想检测用户按住视图一定时间的操作。这些长按事件可通过给任一"Touchable"组件的 `onLongPress` 属性传入函数来处理。

下面让我们来看这些组件的实际演示：

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
    Alert.alert('你点了这个按钮！');
  };

  const onLongPressButton = () => {
    Alert.alert('你长按了这个按钮！');
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
          <Text style={styles.buttonText}>带长按的 Touchable</Text>
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

设备上常用的手势包括滑动和拖动。这些手势允许用户滚动浏览列表项，或滑动切换内容页。有关这些功能，请查看 [ScrollView](scrollview.md) 核心组件。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162)：触摸区域不会超出父视图边界，且 Android 不支持负边距。