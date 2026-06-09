---
id: style
title: 样式
---

使用 React Native 时，你使用 JavaScript 来设置应用程序的样式。所有核心组件都接受一个名为 `style` 的 prop。样式名称和 [值](colors.md) 通常与 Web 上的 CSS 工作方式匹配，除了名称使用驼峰式写法，例如 `backgroundColor` 而不是 `background-color`。

`style` prop 可以是一个普通的 JavaScript 对象。这就是我们通常在示例代码中使用的。你也可以传递一个样式数组——数组中的最后一个样式具有优先级，因此你可以使用它来继承样式。

随着组件复杂性的增加，使用 `StyleSheet.create` 在一个地方定义多个样式通常更清晰。这是一个示例：

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

一种常见的模式是让你的组件接受一个 `style` prop，进而用于设置子组件的样式。你可以使用它来使样式像 CSS 那样“级联”。

还有很多方法可以自定义文本样式。查看 [Text 组件参考](text.md) 获取完整列表。

现在你可以让你的文本变得漂亮了。成为样式专家的下一步是 [学习如何控制组件大小](height-and-width.md)。

## 已知问题

- [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162): 在某些情况下，React Native 与 Web 上的 CSS 工作方式不匹配，例如触摸区域永远不会超出父视图边界，并且在 Android 上不支持负 margin。
