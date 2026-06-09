---
id: using-a-scrollview
title: 使用 ScrollView
---

[ScrollView](scrollview.md) 是一个通用的滚动容器，可以包含多个组件和视图。可滚动的条目可以是异构的，并且你可以通过设置 `horizontal` 属性来实现垂直和水平滚动。

这个示例创建了一个同时混合图片和文本的垂直 `ScrollView`。

```SnackPlayer name=Using%20ScrollView
import {Image, ScrollView, Text} from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{fontSize: 96}}>请向下滚动我</Text>
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
    <Text style={{fontSize: 96}}>继续向下滚动</Text>
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

可以使用 `pagingEnabled` 属性来配置 ScrollView，使其通过滑动手势在各个视图之间分页浏览。在 Android 上，也可以使用 [ViewPager](https://github.com/react-native-community/react-native-viewpager) 组件来实现水平滑动切换视图。

在 iOS 上，带有单个条目的 ScrollView 可用于让用户缩放内容。设置 `maximumZoomScale` 和 `minimumZoomScale` 属性后，用户就可以通过捏合和展开手势来放大和缩小。

ScrollView 最适合展示数量较少、尺寸有限的内容。`ScrollView` 的所有元素和视图都会被渲染，即使它们当前没有显示在屏幕上。如果你有一个无法在屏幕上完全显示的长列表，应该改用 `FlatList`。接下来让我们[了解列表视图](using-a-listview.md)。
