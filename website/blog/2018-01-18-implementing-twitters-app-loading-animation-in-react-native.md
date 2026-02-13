---
title: '在 React Native 中实现 Twitter 的应用加载动画'
authors: [Eli White]
tags: [engineering]
---

Twitter 的 iOS 应用有一个我非常喜欢的加载动画。

<img src="/blog/assets/loading-screen-01.gif" style={{float: 'left', paddingRight: 80, paddingBottom: 20}} />

当应用准备好时，Twitter 标志会令人愉快地放大，展现出应用界面。

我想弄明白如何用 React Native 重新创建这个加载动画。

<hr style={{clear: 'both', marginBottom: 40, width: 80}} />

为了理解_如何_去构建它，我首先必须理解加载动画的不同部分。最简单的查看细微差别的方法是将动画放慢。

<img src="/blog/assets/loading-screen-02.gif" style={{marginTop: 20, float: 'left', paddingRight: 80, paddingBottom: 20}} />

这里有几个主要部分我们需要弄清楚如何构建。

1. 对小鸟进行缩放。
1. 随着小鸟变大，露出下面的应用。
1. 在结束时稍微缩小应用。

我花了相当长时间才弄明白如何制作这个动画。

我一开始有一个_错误_的假设，以为蓝色背景和 Twitter 小鸟是在应用的_上层_，当小鸟放大时它变得透明，露出下面的应用。这个方法行不通，因为 Twitter 小鸟变透明会显示蓝色层，而不是下面的应用！

幸运的是，亲爱的读者，你不用经历我那样的挫折。你得到的是这个跳过废话的精彩教程！

<hr style={{clear: 'both', marginBottom: 40, width: 80}} />

## 正确的方法

在进入代码之前，了解如何拆解这个效果非常重要。为了帮助可视化这个效果，我在 [CodePen](https://codepen.io/TheSavior/pen/NXNoJM) 中重新创建了它（嵌入于几段文字中），这样你可以交互式地查看不同的图层。

<img src="/blog/assets/loading-screen-03.png" style={{float: 'left', paddingRight: 80, paddingBottom: 20}} />

这个效果主要有三个图层。第一层是蓝色背景层。虽然看起来它出现在应用上方，但实际上它是在后面。

然后是一个纯白色层。最后，最前面是我们的应用。

<hr style={{clear: 'both', marginBottom: 40, width: 80}} />
<img src="/blog/assets/loading-screen-04.png" style={{float: 'left', paddingRight: 80, paddingBottom: 20}} />

这个动画的关键是使用 Twitter 标志作为`蒙版`，并对应用层和白色层进行蒙版处理。我不会深入讲解蒙版的细节，网上有[大量](https://www.html5rocks.com/en/tutorials/masking/adobe/) [资料](https://designshack.net/articles/graphics/a-complete-beginners-guide-to-masking-in-photoshop/) [参考](https://www.sketchapp.com/docs/shapes/masking/)。

在这里蒙版的基础概念是，蒙版中不透明的像素显示它所蒙版的内容，而透明的像素则隐藏它所蒙版的内容。

我们用 Twitter 标志作为蒙版，同时蒙版两个层；纯白色层和应用层。

为了显示应用，我们将蒙版放大，直到它比整个屏幕还大。

在蒙版放大的同时，我们将应用层的透明度淡入，显示应用并隐藏后面的纯白层。为了完成效果，我们让应用层开始时缩放略大于 1，然后动画结束时缩放到 1。之后隐藏非应用层，因为它们将不再被看到。

俗话说一图胜千言。一个交互式可视化值多少字？点击“下一步”按钮，逐步查看动画。显示不同图层可以让你拥有侧视角度。网格帮助可视化透明图层。

<iframe
  height="750"
  scrolling="no"
  title="加载屏幕动画步骤"
  src="//codepen.io/TheSavior/embed/NXNoJM/?height=265&theme-id=0&default-tab=result&embed-version=2"
  frameborder="no"
  allowFullScreen={true}
  className="codepen">
  参见 {' '}
  <a href="https://codepen.io/TheSavior/pen/NXNoJM/">
    加载屏幕动画步骤
  </a>
  {' '}作者 Eli White (
  <a href="https://codepen.io/TheSavior">@TheSavior</a>) 于 {' '}
  <a href="https://codepen.io">CodePen</a>.
</iframe>

## 现在，讲讲 React Native 实现

好啦。现在我们知道想做什么以及动画如何工作，可以进入代码了——这才是你真正关心的。

这个谜题的核心是 [MaskedViewIOS](https://reactnative.dev/docs/0.63/maskedviewios)，这是 React Native 的核心组件。

```jsx
import {MaskedViewIOS} from 'react-native';

<MaskedViewIOS maskElement={<Text>Basic Mask</Text>}>
  <View style={{backgroundColor: 'blue'}} />
</MaskedViewIOS>;
```

`MaskedViewIOS` 接收 props `maskElement` 和 `children`。children 会被 `maskElement` 蒙版。注意，蒙版不一定非得是图片，可以是任意视图。上面示例的效果是在“Basic Mask”的文字区域显示蓝色视图，其他地方透明。我们刚刚用蓝色文字制造了复杂的效果。

我们想做的是先渲染蓝色层，然后在其上用 Twitter 标志蒙版渲染应用和白色层。

```jsx
{
  fullScreenBlueLayer;
}
<MaskedViewIOS
  style={{flex: 1}}
  maskElement={
    <View style={styles.centeredFullScreen}>
      <Image source={twitterLogo} />
    </View>
  }>
  {fullScreenWhiteLayer}
  <View style={{flex: 1}}>
    <MyApp />
  </View>
</MaskedViewIOS>;
```

这会得到我们下面看到的图层。

<img src="/blog/assets/loading-screen-04.png" style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />

## 现在进入动画部分

我们已有制作动画所需的所有部分，接下来要动起来。为了让动画体验顺畅，我们将使用 React Native 的 [Animated](/docs/animated) API。

Animated 允许我们在 JavaScript 中声明式地定义动画。默认情况下，动画在 JavaScript 中运行，每帧告诉原生层要做哪些变化。即使 JavaScript 尝试每帧更新动画，通常也追不上，可能出现掉帧（卡顿）。这可不是我们想要的！

Animated 有特殊机制避免卡顿。它有个叫 `useNativeDriver` 的 flag，会在动画开始时将动画定义从 JavaScript 发送到原生，让原生端自己处理动画更新，无须每帧都回传 JavaScript。`useNativeDriver` 的限制是只能更新特定属性，主要是 `transform` 和 `opacity`。目前还不能用它来更新背景颜色等属性——未来会增加更多，当然你也能为这个项目提交 PR，造福社区😀。

既然想让动画顺滑，我们就在这些限制内工作。想了解`useNativeDriver`内部工作原理，可以看我们的[宣布博客](/blog/2017/02/14/using-native-driver-for-animated)。

## 拆解动画步骤

我们的动画包含 4 个部分：

1. 放大小鸟，露出应用和纯白层。
1. 让应用淡入。
1. 缩小应用。
1. 动画结束后隐藏白层和蓝层。

用 Animated，有两种主流定义动画的方式。第一种是用 `Animated.timing`，指定动画时长和缓动曲线让移动更自然。另一种是用基于物理的 API，如 `Animated.spring`，指定阻力和张力参数，让动画由物理模拟驱动。

这里有多段紧密相关的动画同时运行，比如我们希望应用在蒙版中途放大时开始淡入。因为它们紧密相关，我们将用单个 `Animated.Value` 结合 `Animated.timing`。

`Animated.Value` 是 Animated 对原生值的包装器，表示动画的当前状态。通常一个完整动画只用一个。大多数 Animated 组件会把它存在 state 里。

我把动画视作不同时刻发生的步骤，让 `Animated.Value` 从 0 开始，表示 0％ 完成度，最终到 100，表示 100％ 完成度。

初始组件 state 如下：

```jsx
state = {
  loadingProgress: new Animated.Value(0),
};
```

当动画准备好开始时，调用 Animated 去动画到 100。

```jsx
Animated.timing(this.state.loadingProgress, {
  toValue: 100,
  duration: 1000,
  useNativeDriver: true, // 这一点很重要！
}).start();
```

我接下来大致估算动画不同阶段应该是多少数值，以下是动画不同片段的取值预期随时间进度的表格。

![](/blog/assets/loading-screen-05.png)

Twitter 小鸟蒙版初始 scale 是 1，会先缩小一点，然后猛涨到超大，动画快结束时大约是 70。70 是个经验值，要确保它完全覆盖屏幕，60 不够😀。这里有趣的是，数字越大，看上去变大的速度越快，因为时间总量不变。这部分调试花了不少时间确保与标志搭配效果好。不同标志和设备，最终 scale 需调整以覆盖全屏。

应用保持不透明一段时间，至少在 Twitter 标志缩小时。官方动画上，我想在小鸟放大到一半时开始显示应用，到动画 30% 处完全显示。

应用初始化 scale 是 1.1，动画结束缩放回 1。

## 现在，代码实践。

我们在上面做的就是根据动画进度百分比映射到各个部分的数值。用 Animated 的 `.interpolate` 方法实现。创建三个样式对象，每个对应动画不同部分，用 `this.state.loadingProgress` 作插值。

```jsx
const loadingProgress = this.state.loadingProgress;

const opacityClearToVisible = {
  opacity: loadingProgress.interpolate({
    inputRange: [0, 15, 30],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
    // clamp 意味着当输入为 30-100 时，输出保持为 1
  }),
};

const imageScale = {
  transform: [
    {
      scale: loadingProgress.interpolate({
        inputRange: [0, 10, 100],
        outputRange: [1, 0.8, 70],
      }),
    },
  ],
};

const appScale = {
  transform: [
    {
      scale: loadingProgress.interpolate({
        inputRange: [0, 100],
        outputRange: [1.1, 1],
      }),
    },
  ],
};
```

现在有了这几个样式对象，我们可以在渲染时使用它们。注意，只有 `Animated.View`、`Animated.Text` 和 `Animated.Image` 组件支持带有 `Animated.Value` 的样式。

```jsx
const fullScreenBlueLayer = (
  <View style={styles.fullScreenBlueLayer} />
);
const fullScreenWhiteLayer = (
  <View style={styles.fullScreenWhiteLayer} />
);

return (
  <View style={styles.fullScreen}>
    {fullScreenBlueLayer}
    <MaskedViewIOS
      style={{flex: 1}}
      maskElement={
        <View style={styles.centeredFullScreen}>
          <Animated.Image
            style={[styles.maskImageStyle, imageScale]}
            source={twitterLogo}
          />
        </View>
      }>
      {fullScreenWhiteLayer}
      <Animated.View
        style={[opacityClearToVisible, appScale, {flex: 1}]}>
        {this.props.children}
      </Animated.View>
    </MaskedViewIOS>
  </View>
);
```

<img src="/blog/assets/loading-screen-06.gif" style={{float: 'left', paddingRight: 80, paddingBottom: 20}} />

耶！动画部分已经符合预期。现在只需清理我们的蓝色和白色层，因为它们动画结束后都不再显示。

为了知道何时清理它们，我们需要知道动画是否完成。幸运的是，调用 `Animated.timing` 的 `.start` 方法时，可以传入动画结束时执行的回调。

```jsx
Animated.timing(this.state.loadingProgress, {
  toValue: 100,
  duration: 1000,
  useNativeDriver: true,
}).start(() => {
  this.setState({
    animationDone: true,
  });
});
```

有了 `state` 中的 `animationDone` 字段，知道动画是否结束后，我们可以根据它动态渲染蓝色和白色层。

```jsx
const fullScreenBlueLayer = this.state.animationDone ? null : (
  <View style={[styles.fullScreenBlueLayer]} />
);
const fullScreenWhiteLayer = this.state.animationDone ? null : (
  <View style={[styles.fullScreenWhiteLayer]} />
);
```

就这样！动画现在可以正常工作，完成后自动清理不需要的图层。我们复刻了 Twitter 应用的加载动画！

## 等等，我的动画不工作！

别担心，亲爱的读者。我也讨厌那种只给你代码片段，却不提供完整源码的教程。

这个组件已经发布到 npm，且托管在 GitHub 上，地址是 [react-native-mask-loader](https://github.com/TheSavior/react-native-mask-loader)。想在手机上试试，可以在 [Expo 上打开](https://expo.io/@eliwhite/react-native-mask-loader-example)：

<img src="/blog/assets/loading-screen-07.png" style={{marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />

## 延伸阅读 / 额外练习

1. [这本 gitbook](https://browniefed.com/react-native-animation-book/) 是学 Animated 后非常棒的资源。
1. Twitter 官方动画在末尾会加快蒙版的展开速度。试试修改 loader，用不同的缓动函数（或者 spring！）来更贴近官方效果。
1. 蒙版最终 scale 目前是硬编码的，可能无法在平板等大屏设备上完整展示应用。根据屏幕尺寸和图片大小计算最终 scale 会是个超赞的 PR 贡献。
