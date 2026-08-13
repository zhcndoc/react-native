---
id: using-a-scrollview
title: 使用 ScrollView
---

[ScrollView](scrollview.md) 是一种通用滚动容器，可以包含多个组件和视图。可滚动项目可以是异构的，你可以同时进行垂直和水平滚动（通过设置 `horizontal` 属性）。

此示例创建了一个垂直 `ScrollView`，其中混合了图片和文本。

```SnackPlayer name=Using%20ScrollView
import {Image, ScrollView, Text} from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{fontSize: 96}}>Scroll me plz</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>If you like</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>Scrolling down</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>What's the best</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>Framework around?</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 80}}>React Native</Text>
  </ScrollView>
);

export default App;
```

ScrollView 可以通过使用 `pagingEnabled` props 配置为使用滑动手势在视图之间进行分页。在 Android 上，也可以使用 [ViewPager](https://github.com/react-native-community/react-native-viewpager) 组件实现视图之间的水平滑动。

在 iOS 上，带有单个项目的 ScrollView 可用于允许用户缩放内容。设置 `maximumZoomScale` 和 `minimumZoomScale` props 后，用户便可以使用捏合和展开手势进行放大和缩小。

ScrollView 最适合展示少量且大小有限的内容。`ScrollView` 的所有元素和视图都会被渲染，即使它们当前没有显示在屏幕上。如果你有一个很长的项目列表，无法完全显示在屏幕上，则应改用 `FlatList`。接下来让我们[了解列表视图](using-a-listview.md)。
