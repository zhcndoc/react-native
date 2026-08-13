---
id: imagebackground
title: ImageBackground
---

熟悉 Web 的开发者经常会请求支持 `background-image`。要处理此用例，可以使用 `<ImageBackground>` 组件，它具有与 `<Image>` 相同的 props，并且你可以向其中添加任意子元素，以便将其叠加在图片上方。

在某些情况下，你可能不希望使用 `<ImageBackground>`，因为其实现比较基础。请参阅 `<ImageBackground>` 的[源代码](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Image/ImageBackground.js)以深入了解，并在需要时创建自己的自定义组件。

请注意，你必须指定宽度和高度样式属性。

## 示例

```SnackPlayer name=ImageBackground
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

| 类型                               |
| ---------------------------------- |
| [Image 样式](image-style-props.md) |

---

### `imageRef`

在挂载时，将被赋值为内部 `Image` 组件的[元素节点](element-nodes)的 ref 设置器。

---

### `style`

| 类型                             |
| -------------------------------- |
| [View 样式](view-style-props.md) |
