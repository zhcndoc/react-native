---
id: imagebackground
title: ImageBackground
---

熟悉 Web 开发的开发者经常要求的一个功能是 `background-image`。要处理这种用例，您可以使用 `<ImageBackground>` 组件，它具有与 `<Image>` 相同的属性，并且可以向其中添加任何您想要叠加在其上方的子元素。

在某些情况下，您可能不想使用 `<ImageBackground>`，因为其实现比较基础。请参阅 `<ImageBackground>` 的 [源代码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Image/ImageBackground.js) 以了解更多细节，并在需要时创建您自己的自定义组件。

请注意，您必须指定一些宽度和高度样式属性。

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

继承 [Image 属性](image.md#props)。

---

### `imageStyle`

| 类型                                |
| ----------------------------------- |
| [Image 样式](image-style-props.md) |

---

### `imageRef`

允许设置对内部 `Image` 组件的引用

| 类型                                                          |
| ------------------------------------------------------------- |
| [引用](https://react.dev/learn/manipulating-the-dom-with-refs) |

---

### `style`

| 类型                              |
| --------------------------------- |
| [View 样式](view-style-props.md) |
