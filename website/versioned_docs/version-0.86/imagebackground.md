---
id: imagebackground
title: ImageBackground
---

对于熟悉 Web 的开发者来说，一个常见的需求是 `background-image`。要处理这种用例，你可以使用 `<ImageBackground>` 组件，它具有与 `<Image>` 相同的 props，并且可以在其上层添加任何你想要叠加的子元素。

在某些情况下，你可能不想使用 `<ImageBackground>`，因为它的实现比较基础。请参考 `<ImageBackground>` 的 [源码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Image/ImageBackground.js) 以获得更多信息，并在需要时创建你自己的自定义组件。

请注意，你必须指定一些 width 和 height 样式属性。

## 示例

```SnackPlayer name=ImageBackground
import React from 'react';
import {ImageBackground, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>内部</Text>
      </ImageBackground>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default App;
```

---

# 参考

## Props

### [Image Props](image.md#props)

继承自 [Image Props](image.md#props)。

---

### `imageStyle`

| 类型                                |
| ----------------------------------- |
| [Image Style](image-style-props.md) |

---

### `imageRef`

一个 ref 设置器，在挂载时会被赋予内部 `Image` 组件的 [element node](element-nodes)。

---

### `style`

| 类型                              |
| --------------------------------- |
| [View Style](view-style-props.md) |
