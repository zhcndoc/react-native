---
id: style
title: 样式
---

在 React Native 中，你使用 JavaScript 来为应用程序设置样式。所有核心组件都接受一个名为 `style` 的属性。样式名称和 [取值](colors.md) 通常与网页上的 CSS 用法相匹配，不过名称采用驼峰命名法，例如 `backgroundColor` 而不是 `background-color`。

`style` 属性可以是普通的 JavaScript 对象。这也是我们通常在示例代码中使用的。你也可以传入一个样式数组——数组中最后一个样式优先级最高，所以你可以用它来实现样式继承。

当组件变得越来越复杂时，通常使用 `StyleSheet.create` 在一个地方定义多个样式会更清晰。下面是一个示例：

```SnackPlayer name=Style
import {StyleSheet, Text, View} from 'react-native';

const LotsOfStyles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.red}>只是红色</Text>
      <Text style={styles.bigBlue}>只是大号蓝色</Text>
      <Text style={[styles.bigBlue, styles.red]}>大号蓝色，然后红色</Text>
      <Text style={[styles.red, styles.bigBlue]}>红色，然后大号蓝色</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});

export default LotsOfStyles;
```

一种常见的做法是让你的组件接受一个 `style` 属性，进而用它来为子组件设置样式。你可以利用这种方式让样式实现类似 CSS 的“层叠”效果。

还有许多自定义文本样式的方式。请查看 [Text 组件参考](text.md) 以获取完整列表。

现在你可以让文本更美观了。成为样式专家的下一步是 [学习如何控制组件尺寸](height-and-width.md)。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162)：在某些情况下，React Native 的行为与网页上的 CSS 不一致，例如触摸区域不会超出父视图范围，且在 Android 上不支持负边距。