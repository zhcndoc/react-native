---
id: imagebackground
title: ImageBackground
---

熟悉网页开发的开发者常常会请求类似 `background-image` 的功能。为满足此需求，你可以使用 `<ImageBackground>` 组件，它拥有和 `<Image>` 相同的属性，并且可以在其上叠加任意你想添加的子元素。

在某些情况下，你可能不想使用 `<ImageBackground>` ，因为其实现较为基础。你可以参考 `<ImageBackground>` 的[源码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Image/ImageBackground.js) 以获得更多了解，必要时可以创建你自己的自定义组件。

请注意，你必须指定一定的宽度和高度样式属性。

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
        <Text style={styles.text}>Inside</Text>
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

## 属性

### [Image 属性](image.md#props)

继承自 [Image 属性](image.md#props)。

---

### `imageStyle`

| 类型                               |
| ---------------------------------- |
| [图片样式](image-style-props.md)  |

---

### `imageRef`

一个 ref 设置器，在内部 `Image` 组件挂载时会被赋值为该元素节点的引用。

---

### `style`

| 类型                             |
| -------------------------------- |
| [视图样式](view-style-props.md)  |