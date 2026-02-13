---
title: 为 iOS 15 和 Android 12 准备您的应用
authors: [SamuelSusla]
tags: [engineering]
---

大家好！

随着新的移动操作系统版本将在今年晚些时候发布，我们建议提前准备您的 React Native 应用，以避免发布后出现回归问题。

<!--truncate-->

## iOS 15

iOS 15 的发布日期尚未宣布，但根据以往 iOS 发布的惯例，预计将在9月16日左右。同时如果需要对应用进行修改以适配 iOS 15，请预留 App Store 审核时间。

### 需要注意的事项

#### QuickType 输入建议栏

禁用 _QuickType_ 输入建议栏（即键盘上方带有三个推荐词的栏）的方法在 _[TextInput](/docs/textinput)_ 中发生了变化。如果您的界面需要隐藏该栏，之前通过设置 [autoCorrect](/docs/textinput#autocorrect) 为 `false` 来禁用 _QuickType_ 的做法，在 iOS 15 中已经不再有效。现在要隐藏 QuickType 输入建议栏，您还需要将 [spellCheck](/docs/textinput#spellcheck-ios) 设置为 `false`。这会禁用拼写检查功能，即红色下划线。开启拼写检查时无法仅禁用 QuickType 输入建议栏。

<figure>
  <img src="/blog/assets/ios-15-quicktype-bar.png" alt="QuickType 输入建议栏截图" />
  <figcaption>
    带有三个建议词的 QuickType 输入建议栏
  </figcaption>
</figure>

要在 iOS 15 里禁用 QuickType 输入建议栏，请将 [spellCheck](/docs/textinput#spellcheck-ios) 和 [autoCorrect](/docs/textinput#autocorrect) 属性同时设置为 `false`。

```jsx
<TextInput
  placeholder="something"
  autoCorrect={false}
  spellCheck={false}
/>
```

#### 透明导航栏

iOS 15 改变了导航栏的默认行为。不同于 iOS 14，当内容滚动到最顶部时，导航栏会变得透明。请注意这一点，因为可能会导致内容阅读困难。关于如何解决该问题的建议，请参阅[这条帖子](https://developer.apple.com/forums/thread/682420)。

![iOS 14 与 iOS 15 导航栏截图](/blog/assets/ios-15-navigation-bar.jpg)

### 如何安装 iOS 15

#### 设备

如果您有备用设备，可以加入[测试计划](https://beta.apple.com/sp/betaprogram/)并安装 iOS 15。目前测试版已较为稳定，但请注意**升级到 iOS 15 是不可逆的**。

#### 模拟器

如果想在模拟器上测试 iOS 15，需要下载 Xcode 13，下载地址见 [这里](https://developer.apple.com/xcode/)。

## Android 12

Android 12 将于今年秋季发布，带来一些可能影响应用体验的变化。按照惯例，Google Play 要求在次年 11 月前升级应用的目标 SDK 版本。（参见以往版本的要求：[这里](https://developer.android.com/distribute/best-practices/develop/target-sdk)）

### 需要注意的事项

#### 过滚动效果

Android 12 引入了新的[过滚动效果](https://developer.android.com/about/versions/12/overscroll)，影响所有滚动容器。由于 React Native 的滚动视图基于原生视图，建议检查您的滚动容器是否正确应用了该效果。您可以通过将 [`overScrollMode`](/docs/scrollview#overscrollmode-android) 属性设置为 `never` 来选择关闭它。

#### 权限更新

Android 12 允许用户仅为位置访问提供大致位置信息（Approximate Location）权限，即使您请求的是 **`ACCESS_FINE_LOCATION`** 权限。详情请见[这里](https://developer.android.com/about/versions/12/approximate-location)。

Google 提供了关于 Android 12 上所有应用行为变更的[详细说明](https://developer.android.com/about/versions/12/behavior-changes-all)。

### 如何安装 Android 12

#### 设备

如果您有备用 Android 设备，请参考[这篇指南](https://developer.android.com/about/versions/12/get)查看是否可以安装 Android 12 Beta。

#### 模拟器

如果没有设备可用，您可以按照[这篇指南](https://developer.android.com/about/versions/12/get#on_emulator)设置模拟器。