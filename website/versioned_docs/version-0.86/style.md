---
id: style
title: 样式
---

在 React Native 中，你使用 JavaScript 来为应用添加样式。所有核心组件都接受一个名为 `style` 的 prop。样式名称和 [值](colors.md) 通常与网页上的 CSS 工作方式相同，只是名称使用驼峰式写法，例如 `backgroundColor` 而不是 `background-color`。

`style` prop 可以是一个普通的 JavaScript 对象。我们通常在示例代码中就是这样使用的。你也可以传递一个样式数组——数组中最后一个样式具有优先级，因此你可以用它来继承样式。

随着组件变得越来越复杂，通常使用 `StyleSheet.create` 在一个地方定义多个样式会更清晰。下面是一个示例：

```SnackPlayer name=Style
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const LotsOfStyles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.red}>仅红色</Text>
      <Text style={styles.bigBlue}>仅大号蓝色</Text>
      <Text style={[styles.bigBlue, styles.red]}>先大号蓝色，再红色</Text>
      <Text style={[styles.red, styles.bigBlue]}>先红色，再大号蓝色</Text>
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

一种常见的模式是让你的组件接受一个 `style` prop，然后再将其用于为子组件设置样式。你可以利用这一点，让样式像在 CSS 中那样“层叠”。

还有很多其他方式可以自定义文本样式。查看 [Text 组件参考](text.md) 以获取完整列表。

现在你可以让你的文本变得更美观了。成为样式专家的下一步是 [学习如何控制组件大小](height-and-width.md)。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162)：在某些情况下，React Native 的表现与网页上的 CSS 工作方式并不一致，例如触摸区域不会超出父视图边界，并且在 Android 上不支持负外边距。
