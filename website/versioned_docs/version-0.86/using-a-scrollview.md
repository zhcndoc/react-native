---
id: using-a-scrollview
title: 使用 ScrollView
---

[ScrollView](scrollview.md) 是一个通用的滚动容器，可以包含多个组件和视图。可滚动的项可以是异构的，并且你可以同时进行垂直和水平滚动（通过设置 `horizontal` 属性）。

这个示例创建了一个垂直的 `ScrollView`，其中混合了图片和文本。

```SnackPlayer name=Using%20ScrollView
import React from 'react';
import {Image, ScrollView, Text} from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{fontSize: 96}}>滚动我吧，拜托</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>如果你喜欢</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>向下滚动</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>什么是最好的</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>周围的框架？</Text>
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

可以通过使用 `pagingEnabled` 属性来配置 ScrollView，使其支持通过滑动手势在视图之间分页切换。在 Android 上，还可以使用 [ViewPager](https://github.com/react-native-community/react-native-viewpager) 组件实现视图之间的水平滑动。

在 iOS 上，带有单个项目的 ScrollView 可用于允许用户缩放内容。设置 `maximumZoomScale` 和 `minimumZoomScale` 属性后，用户就可以使用捏合和展开手势进行放大和缩小。

ScrollView 最适合展示少量且尺寸有限的内容。`ScrollView` 的所有元素和视图都会被渲染，即使它们当前没有显示在屏幕上。如果你有一个无法在屏幕上完整显示的长列表，应改用 `FlatList`。所以下一步让我们来[了解列表视图](using-a-listview.md)。
