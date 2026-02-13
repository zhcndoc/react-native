---
title: React Native 应用的从右到左布局支持
author: 王梦珏 (Mandy)
authorTitle: Facebook 软件工程实习生
authorURL: 'https://github.com/MengjueW'
authorImageURL: 'https://avatars0.githubusercontent.com/u/13987140?v=3&s=128'
tags: [engineering]
---

发布应用到应用商店后，国际化是进一步扩大受众范围的下一步。全球有 20 多个国家和众多用户使用从右到左（RTL）语言。因此，支持 RTL 对他们来说非常必要。

我们很高兴地宣布，React Native 已经改进，支持 RTL 布局。该功能现已在 [react-native](https://github.com/facebook/react-native) 主分支可用，并将在下一个发行候选版本中提供：[ `v0.33.0-rc`](https://github.com/facebook/react-native/releases)。

这涉及修改 [css-layout](https://github.com/facebook/css-layout) —— RN 使用的核心布局引擎，以及 RN 核心实现和特定的 OSS JS 组件以支持 RTL。

为了在生产环境中测试 RTL 支持，最新版的 **Facebook Ads Manager** 应用（首个 100% 跨平台 RN 应用）现已支持阿拉伯语和希伯来语的 RTL 布局，分别适用于 [iOS](https://itunes.apple.com/app/id964397083) 和 [Android](https://play.google.com/store/apps/details?id=com.facebook.adsmanager)。下面是这些 RTL 语言下的界面展示：

<>
<img src="/blog/assets/rtl-ama-ios-arabic.png" width={280} style={{ margin: 10 }} />
<img src="/blog/assets/rtl-ama-android-hebrew.png" width={280} style={{ margin: 10 }} />
</>

## RN 支持 RTL 的改动概述

[css-layout](https://github.com/facebook/css-layout) 已经有了 `start` 和 `end` 的布局概念。在从左到右（LTR）布局中，`start` 表示左边，`end` 表示右边。但在 RTL 中，`start` 表示右边，`end` 表示左边。这意味着我们可以依赖 `start` 和 `end` 的计算来确定正确的布局，这包括 `position`、`padding` 和 `margin`。

此外，[css-layout](https://github.com/facebook/css-layout) 已经让每个组件的方向继承自其父组件。这意味着，只需将根组件的方向设置为 RTL，整个应用就会翻转。

下面的图表描述了高层次的改动：

![](/blog/assets/rtl-rn-core-updates.png)

改动包括：

- [css-layout 对绝对定位的 RTL 支持](https://github.com/facebook/css-layout/commit/46c842c71a1232c3c78c4215275d104a389a9a0f)
- 在 RN 核心实现中将 `left` 和 `right` 映射为 `start` 和 `end`，用于 shadow nodes
- 并暴露了一个[桥接的工具模块](https://github.com/facebook/react-native/blob/f0fb228ec76ed49e6ed6d786d888e8113b8959a2/Libraries/Utilities/I18nManager.js)来帮助控制 RTL 布局

有了这个更新，当你允许你的应用使用 RTL 布局时：

- 每个组件的布局会水平翻转
- 如果你使用支持 RTL 的 OSS 组件，部分手势和动画会自动适配 RTL 布局
- 你只需做最小的额外工作，就能使应用完全支持 RTL

## 让应用支持 RTL

1. 要支持 RTL，首先应将 RTL 语言包加入你的应用。
   - 参考 [iOS](https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/LocalizingYourApp/LocalizingYourApp.html#//apple_ref/doc/uid/10000171i-CH5-SW1) 和 [Android](https://developer.android.com/training/basics/supporting-devices/languages.html) 的通用指南。

2. 通过在原生代码开头调用 `allowRTL()` 函数，允许你的应用使用 RTL 布局。这个工具仅会启用 RTL 布局，当你的应用已准备好。示例如下：

   iOS：

   ```objc
   // 在 AppDelegate.m 中
     [[RCTI18nUtil sharedInstance] allowRTL:YES];
   ```

   Android：

   ```java
   // 在 MainActivity.java 中
     I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
     sharedI18nUtilInstance.allowRTL(context, true);
   ```

3. 对于 Android，你还需在 `AndroidManifest.xml` 文件的 [`<application>`](https://developer.android.com/guide/topics/manifest/application-element.html) 元素中添加 `android:supportsRtl="true"`。

现在，重新编译应用并将设备语言切换为 RTL 语言（如阿拉伯语或希伯来语），应用布局应自动变成 RTL。

## 编写支持 RTL 的组件

一般而言，大部分组件已经支持 RTL，例如：

- 从左到右布局

<img src="/blog/assets/rtl-demo-listitem-ltr.png" width="300" />

- 从右到左布局

<img src="/blog/assets/rtl-demo-listitem-rtl.png" width="300" />

不过，有些情况需要留意，你可能需要用到 [`I18nManager`](https://github.com/facebook/react-native/blob/f0fb228ec76ed49e6ed6d786d888e8113b8959a2/Libraries/Utilities/I18nManager.js)。 [`I18nManager`](https://github.com/facebook/react-native/blob/f0fb228ec76ed49e6ed6d786d888e8113b8959a2/Libraries/Utilities/I18nManager.js) 中有一个常量 `isRTL`，可以判断当前应用布局是否为 RTL，据此你可以做相应调整。

#### 带有方向意义的图标

如果你的组件含有图标或图片，它们在 LTR 和 RTL 布局中显示方式相同，因为 RN 不会翻转你的图片源文件。因此，你应该根据布局方向手动翻转它们。

- 从左到右布局

<img src="/blog/assets/rtl-demo-icon-ltr.png" width="300" />

- 从右到左布局

<img src="/blog/assets/rtl-demo-icon-rtl.png" width="300" />

以下是两种根据方向翻转图标的方法：

- 给图片组件添加 `transform` 样式：

  ```jsx
  <Image
    source={...}
    style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
  />
  ```

- 或者，根据方向切换图片资源：

  ```jsx
  let imageSource = require('./back.png');
  if (I18nManager.isRTL) {
    imageSource = require('./forward.png');
  }
  return <Image source={imageSource} />;
  ```

#### 手势和动画

在 Android 和 iOS 开发中，当切换到 RTL 布局时，手势和动画会与 LTR 布局相反。当前在 RN 中，手势和动画不在核心代码层支持，而是在组件层。好消息是，部分组件今天已支持 RTL，如 [`SwipeableRow`](https://github.com/facebook/react-native/blob/38a6eec0db85a5204e85a9a92b4dee2db9641671/Libraries/Experimental/SwipeableRow/SwipeableRow.js) 和 [`NavigationExperimental`](https://github.com/facebook/react-native/tree/master/Libraries/NavigationExperimental)。但其他带有手势的组件还需手动支持 RTL。

下面的示例说明了手势 RTL 支持，以 [`SwipeableRow`](https://github.com/facebook/react-native/blob/38a6eec0db85a5204e85a9a92b4dee2db9641671/Libraries/Experimental/SwipeableRow/SwipeableRow.js) 为例：

<p align="center">
  <img src="/blog/assets/rtl-demo-swipe-ltr.png" width={280} style={{margin: 10}} />
  <img src="/blog/assets/rtl-demo-swipe-rtl.png" width={280} style={{margin: 10}} />
</p>

##### 手势示例

```js
// SwipeableRow.js
_isSwipingExcessivelyRightFromClosedPosition(gestureState: Object): boolean {
  // ...
  const gestureStateDx = IS_RTL ? -gestureState.dx : gestureState.dx;
  return (
    this._isSwipingRightFromClosed(gestureState) &&
    gestureStateDx > RIGHT_SWIPE_THRESHOLD
  );
},
```

##### 动画示例

```js
// SwipeableRow.js
_animateBounceBack(duration: number): void {
  // ...
  const swipeBounceBackDistance = IS_RTL ?
    -RIGHT_SWIPE_BOUNCE_BACK_DISTANCE :
    RIGHT_SWIPE_BOUNCE_BACK_DISTANCE;
  this._animateTo(
    -swipeBounceBackDistance,
    duration,
    this._animateToClosedPositionDuringBounce,
  );
},
```

## 维护支持 RTL 的应用

即使在初始支持 RTL 的版本上线后，你可能还需对新功能进行迭代。为提高开发效率，[`I18nManager`](https://github.com/facebook/react-native/blob/f0fb228ec76ed49e6ed6d786d888e8113b8959a2/Libraries/Utilities/I18nManager.js) 提供了 `forceRTL()` 方法，可快速测试 RTL，无需修改设备语言。你可以在应用里提供一个简单开关。以下是 RNTester 中 RTL 示例的例子：

<p align="center">
  <img src="/blog/assets/rtl-demo-forcertl.png" width="300" />
</p>

```js
<RNTesterBlock title={'快速测试 RTL 布局'}>
  <View style={styles.flexDirectionRow}>
    <Text style={styles.switchRowTextView}>forceRTL</Text>
    <View style={styles.switchRowSwitchView}>
      <Switch
        onValueChange={this._onDirectionChange}
        style={styles.rightAlignStyle}
        value={this.state.isRTL}
      />
    </View>
  </View>
</RNTesterBlock>;

_onDirectionChange = () => {
  I18nManager.forceRTL(!this.state.isRTL);
  this.setState({isRTL: !this.state.isRTL});
  Alert.alert(
    '重新加载页面',
    '请重新加载此页面以更改界面方向！' +
      '本应用内所有示例都会受到影响，' +
      '可以查看它们在 RTL 布局下的表现。',
  );
};
```

开发新功能时，你可以轻松切换这个按钮并重启应用来查看 RTL 布局。好处是，无需更改语言设置来测试，但部分文本对齐不会随之变化（参见下一节说明）。因此，发布前始终推荐在 RTL 语言环境下完整测试应用。

## 限制与未来计划

RTL 支持应该涵盖大部分应用用户体验，但目前仍有一些限制：

- Android 与 iOS 中文本对齐行为不同
  - iOS 中，默认文本对齐依赖于所用语言包，始终保持在同一侧。Android 中，默认文本对齐依赖文本内容语言，即英文左对齐，阿拉伯文右对齐。
  - 理论上，应该统一平台间的行为，但不同用户可能对不同行为有偏好。未来或需更多用户体验调研以确定最佳实践。

* 没有“真实”的左/右

  如前所述，我们将 JS 端的 `left`/`right` 样式映射为 `start`/`end`，代码中写的 `left` 在 RTL 时显示为屏幕右侧，`right` 则显示为屏幕左侧。这方便产品代码改动最小，但目前没办法指定“真实的左边”或“真实的右边”。未来可能需要允许组件无视语言设置，自行控制方向。

* 让手势与动画的 RTL 支持更易用

  目前，让手势和动画支持 RTL 仍需一定编码工作。未来有望找到更简便的方式帮助开发者支持 RTL 的手势和动画。

## 尝试一下吧！

查看 `RNTester` 中的 [`RTLExample`](https://github.com/facebook/react-native/blob/master/packages/rn-tester/js/examples/RTL/RTLExample.js)，深入理解 RTL 支持，并告诉我们你的使用体验！

最后，感谢阅读！希望 React Native 的 RTL 支持能助你让应用走向国际，更好地成长！