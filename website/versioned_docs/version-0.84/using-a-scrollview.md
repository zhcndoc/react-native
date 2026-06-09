---
id: using-a-scrollview
title: 使用 ScrollView
---

[ScrollView](scrollview.md) 是一个通用的滚动容器，可以包含多个组件和视图。可滚动的项目可以是异构的，你可以设置 `horizontal` 属性实现垂直或水平滚动。

这个示例创建了一个垂直的 `ScrollView`，将图片和文本混合在一起。

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

ScrollView 可以通过 `pagingEnabled` 属性配置为允许通过滑动手势分页浏览视图。在 Android 上，可以使用 [ViewPager](https://github.com/react-native-community/react-native-viewpager) 组件实现视图间的水平滑动。

在 iOS 上，带有单个子项的 ScrollView 可以用来允许用户缩放内容。设置 `maximumZoomScale` 和 `minimumZoomScale` 属性后，用户即可通过捏合和扩展手势进行放大和缩小。

ScrollView 最适合展示数量较少且尺寸有限的内容。`ScrollView` 中的所有元素和视图都会被渲染，即使它们当前未显示在屏幕上。如果你有一个无法全部显示在屏幕上的长列表，应该使用 `FlatList`。所以接下来我们来 [了解列表视图](using-a-listview.md) 吧。