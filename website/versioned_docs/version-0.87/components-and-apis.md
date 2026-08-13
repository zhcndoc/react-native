---
id: components-and-apis
title: 核心组件和 API
---

React Native 提供了许多内置的[核心组件](intro-react-native-components)，可以直接在应用中使用。你可以在左侧边栏中找到它们全部（如果你使用的是窄屏设备，也可以在上方菜单中找到）。如果你不确定从哪里开始，可以查看以下类别：

- [基础组件](components-and-apis#basic-components)
- [用户界面](components-and-apis#user-interface)
- [列表视图](components-and-apis#list-views)
- [Android 专用](components-and-apis#android-components-and-apis)
- [iOS 专用](components-and-apis#ios-components-and-apis)
- [其他](components-and-apis#others)

你不局限于 React Native 捆绑的组件和 API。React Native 拥有一个由数千名开发者组成的社区。如果你正在寻找能够实现特定功能的库，请参阅[这个关于查找库的指南](libraries#finding-libraries)。

## 基础组件

大多数应用最终都会使用以下一个或多个基础组件。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./view">
      <h3>View</h3>
      <p>用于构建用户界面的最基础组件。</p>
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
      <p>通过键盘在应用中输入文本的组件。</p>
    </a>
  </div>
  <div className="component">
    <a href="./pressable">
      <h3>Pressable</h3>
      <p>一种包装组件，可以检测其任意子组件上按压交互的各个阶段。</p>
    </a>
  </div>
  <div className="component">
    <a href="./scrollview">
      <h3>ScrollView</h3>
      <p>提供一个可以容纳多个组件和视图的滚动容器。</p>
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

这些常见的用户界面控件可以在任何平台上渲染。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./button">
      <h3>Button</h3>
      <p>用于处理触摸操作的基础按钮组件，可以在任何平台上良好地渲染。</p>
    </a>
  </div>
  <div className="component">
    <a href="./switch">
      <h3>Switch</h3>
      <p>渲染布尔值输入。</p>
    </a>
  </div>
</div>

## 列表视图

与更通用的 [`ScrollView`](./scrollview) 不同，以下列表视图组件只会渲染当前显示在屏幕上的元素。因此，它们非常适合用于显示较长的数据列表。

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
      <p>类似于 <code>FlatList</code>，但用于分区列表。</p>
    </a>
  </div>
</div>

## Android 组件和 API

以下许多组件都为常用的 Android 类提供了包装器。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./backhandler">
      <h3>BackHandler</h3>
      <p>检测硬件按钮按压，以实现返回导航。</p>
    </a>
  </div>
  <div className="component">
    <a href="./drawerlayoutandroid">
      <h3>DrawerLayoutAndroid</h3>
      <p>在 Android 上渲染 <code>DrawerLayout</code>。</p>
    </a>
  </div>
  <div className="component">
    <a href="./permissionsandroid">
      <h3>PermissionsAndroid</h3>
      <p>提供对 Android M 中引入的权限模型的访问。</p>
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

以下许多组件都为常用的 UIKit 类提供了包装器。

<div className="component-grid component-grid-border">
  <div className="component">
    <a href="./actionsheetios">
      <h3>ActionSheetIOS</h3>
      <p>用于显示 iOS 操作菜单或共享菜单的 API。</p>
    </a>
  </div>
</div>

## 其他

这些组件可能对某些应用有用。有关组件和 API 的完整列表，请查看左侧边栏（如果你使用的是窄屏设备，也可以查看上方菜单）。

<div className="component-grid">
  <div className="component">
    <a href="./activityindicator">
      <h3>ActivityIndicator</h3>
      <p>显示圆形加载指示器。</p>
    </a>
  </div>
  <div className="component">
    <a href="./alert">
      <h3>Alert</h3>
      <p>使用指定的标题和消息启动警告对话框。</p>
    </a>
  </div>
  <div className="component">
    <a href="./animated">
      <h3>Animated</h3>
      <p>用于创建流畅、强大且易于构建和维护的动画的库。</p>
    </a>
  </div>
  <div className="component">
    <a href="./dimensions">
      <h3>Dimensions</h3>
      <p>提供用于获取设备尺寸的接口。</p>
    </a>
  </div>
  <div className="component">
    <a href="./keyboardavoidingview">
      <h3>KeyboardAvoidingView</h3>
      <p>提供一个可以自动避开虚拟键盘的视图。</p>
    </a>
  </div>
  <div className="component">
    <a href="./linking">
      <h3>Linking</h3>
      <p>提供与传入和传出应用链接交互的通用接口。</p>
    </a>
  </div>
  <div className="component">
    <a href="./modal">
      <h3>Modal</h3>
      <p>提供一种在外层视图上方呈现内容的简单方式。</p>
    </a>
  </div>
  <div className="component">
    <a href="./pixelratio">
      <h3>PixelRatio</h3>
      <p>提供对设备像素密度的访问。</p>
    </a>
  </div>
  <div className="component">
    <a href="./refreshcontrol">
      <h3>RefreshControl</h3>
      <p>此组件用于 <code>ScrollView</code> 内，以添加下拉刷新功能。</p>
    </a>
  </div>
  <div className="component">
    <a href="./statusbar">
      <h3>StatusBar</h3>
      <p>用于控制应用状态栏的组件。</p>
    </a>
  </div>
</div>
