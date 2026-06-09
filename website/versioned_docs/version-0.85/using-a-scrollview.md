---
id: using-a-scrollview
title: 使用 ScrollView
---

[ScrollView](scrollview.md) 是一个通用的滚动容器，可以包含多个组件和视图。可滚动的项目可以是异构的，您可以垂直和水平滚动（通过设置 `horizontal` 属性）。

此示例创建了一个垂直的 `ScrollView`，其中混合了图像和文本。

```SnackPlayer name=Using%20ScrollView
import {Image, ScrollView, Text} from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{fontSize: 96}}>向上滚动我吧</Text>
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
    <Text style={{fontSize: 96}}>最好的是什么</Text>
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

可以通过使用 `pagingEnabled` 属性配置 ScrollView，以允许使用滑动手势分页浏览视图。在 Android 上，也可以使用 [ViewPager](https://github.com/react-native-community/react-native-viewpager) 组件来实现视图之间的水平滑动。

在 iOS 上，带有单个项目的 ScrollView 可用于允许用户缩放内容。设置 `maximumZoomScale` 和 `minimumZoomScale` 属性，您的用户将能够使用捏合和展开手势进行放大和缩小。

ScrollView 最适合呈现数量有限且大小有限的内容。`ScrollView` 的所有元素和视图都会被渲染，即使它们当前未显示在屏幕上。如果您有一个无法容纳在屏幕上的长列表项，则应该改用 `FlatList`。所以接下来让我们 [了解列表视图](using-a-listview.md)。
