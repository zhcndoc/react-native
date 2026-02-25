---
id: components-and-apis
title: 核心组件和 API
---

React Native 提供了许多内置的[核心组件](intro-react-native-components)，可供您在应用中直接使用。您可以在左侧边栏（如果屏幕较窄，则在上方菜单）中找到它们全部内容。如果您不确定从哪里开始，请浏览以下分类：

- [基础组件](components-and-apis#basic-components)
- [用户界面](components-and-apis#user-interface)
- [列表视图](components-and-apis#list-views)
- [Android 专用](components-and-apis#android-components-and-apis)
- [iOS 专用](components-and-apis#ios-components-and-apis)
- [其他](components-and-apis#others)

您并不局限于 React Native 自带的组件和 API。React Native 拥有一个由数千名开发者组成的社区。如果您在寻找某个特定功能的库，请参考[关于寻找库的指南](libraries#finding-libraries)。

## 基础组件

大多数应用最终都会使用以下一个或多个基本组件。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./view">
      <h3>View</h3>
      <p>构建用户界面最基础的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./text">
      <h3>Text</h3>
      <p>用于显示文本的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./image">
      <h3>Image</h3>
      <p>用于显示图像的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./textinput">
      <h3>TextInput</h3>
      <p>用于通过键盘输入文本的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./pressable">
      <h3>Pressable</h3>
      <p>一个包装组件，可以检测其子组件的各种按压交互状态。</p>
    </a>
  </div>
  <div className="component">
    <a href="./scrollview">
      <h3>ScrollView</h3>
      <p>提供一个可滚动的容器，可以承载多个组件和视图。</p>
    </a>
  </div>
  <div className="component">
    <a href="./stylesheet">
      <h3>StyleSheet</h3>
      <p>提供类似于 CSS 样式表的抽象层。</p>
    </a>
  </div>
</div>

## 用户界面

这些常见的用户界面控件可在任何平台上渲染。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./button">
      <h3>Button</h3>
      <p>一个基础按钮组件，用于处理触摸操作，且能在任何平台上良好渲染。</p>
    </a>
  </div>
  <div className="component">
    <a href="./switch">
      <h3>Switch</h3>
      <p>渲染布尔输入控件。</p>
    </a>
  </div>
</div>

## 列表视图

与更通用的 [`ScrollView`](./scrollview) 不同，以下列表视图组件只会渲染当前屏幕中显示的元素。因此，它们是显示长列表数据时的高性能选择。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./flatlist">
      <h3>FlatList</h3>
      <p>用于渲染高性能可滚动列表的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./sectionlist">
      <h3>SectionList</h3>
      <p>与 <code>FlatList</code> 类似，但用于分区列表。</p>
    </a>
  </div>
</div>

## Android 组件和 API

以下许多组件提供了对常用 Android 类的封装。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./backhandler">
      <h3>BackHandler</h3>
      <p>检测硬件按钮的返回导航操作。</p>
    </a>
  </div>
  <div className="component">
    <a href="./drawerlayoutandroid">
      <h3>DrawerLayoutAndroid</h3>
      <p>在 Android 上渲染 <code>DrawerLayout</code> 组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./permissionsandroid">
      <h3>PermissionsAndroid</h3>
      <p>提供访问 Android M 引入的权限模型的接口。</p>
    </a>
  </div>
  <div className="component">
    <a href="./toastandroid">
      <h3>ToastAndroid</h3>
      <p>创建 Android Toast 提示。</p>
    </a>
  </div>
</div>

## iOS 组件和 API

以下许多组件提供了对常用 UIKit 类的封装。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./actionsheetios">
      <h3>ActionSheetIOS</h3>
      <p>用于显示 iOS 操作表或分享表的 API。</p>
    </a>
  </div>
</div>

## 其他

这些组件可能对于某些应用很有用。要查看完整的组件和 API 列表，请查看左侧边栏（或上方菜单，如果您使用的是窄屏幕）。

<div className="component-grid">
  <div className="component">
    <a href="./activityindicator">
      <h3>ActivityIndicator</h3>
      <p>显示一个圆形加载指示器。</p>
    </a>
  </div>
  <div className="component">
    <a href="./alert">
      <h3>Alert</h3>
      <p>弹出具有指定标题和消息的警告对话框。</p>
    </a>
  </div>
  <div className="component">
    <a href="./animated">
      <h3>Animated</h3>
      <p>一个用于创建流畅且强大动画的库，易于构建和维护。</p>
    </a>
  </div>
  <div className="component">
    <a href="./dimensions">
      <h3>Dimensions</h3>
      <p>提供获取设备尺寸的接口。</p>
    </a>
  </div>
  <div className="component">
    <a href="./keyboardavoidingview">
      <h3>KeyboardAvoidingView</h3>
      <p>提供一个视图，可自动避开虚拟键盘。</p>
    </a>
  </div>
  <div className="component">
    <a href="./linking">
      <h3>Linking</h3>
      <p>提供一个通用接口，用于处理应用内外的链接交互。</p>
    </a>
  </div>
  <div className="component">
    <a href="./modal">
      <h3>Modal</h3>
      <p>提供一种简单方式，在包裹视图上方展示内容。</p>
    </a>
  </div>
  <div className="component">
    <a href="./pixelratio">
      <h3>PixelRatio</h3>
      <p>访问设备像素密度。</p>
    </a>
  </div>
  <div className="component">
    <a href="./refreshcontrol">
      <h3>RefreshControl</h3>
      <p>此组件用于 <code>ScrollView</code> 内，添加下拉刷新功能。</p>
    </a>
  </div>
  <div className="component">
    <a href="./statusbar">
      <h3>StatusBar</h3>
      <p>用于控制应用状态栏的组件。</p>
    </a>
  </div>
</div>