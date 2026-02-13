---
title: React Native 的多平台愿景
authors: [abernathyca, Eli White, lunaleaps, yungsters]
tags: [announcement]
---

React Native 在提升移动开发水平方面取得了巨大成功，无论是在 Facebook 还是在整个行业内。随着我们以新的方式与计算机互动，以及新设备的不断发明，我们希望 React Native 能够服务于每一个人。尽管 React Native 最初是为构建移动应用而创建，我们相信专注于多平台并针对每个平台的优势和限制构建会产生共生效应。当我们将这项技术扩展到桌面和虚拟现实领域时，已经看到了巨大的好处，我们很高兴与大家分享这对 React Native 未来意味着什么。

<!--truncate-->

## 尊重平台特性

我们的第一个指导原则是[匹配人们对每个平台的预期](https://reactnative.dev/blog/2020/07/17/react-native-principles#native-experience)。Android 用户期望使用 TalkBack 的无障碍功能。导航应像其他 Android 应用一样工作。按钮应该看起来和触感像 Android 上的按钮，而不是像 iOS 按钮。虽然我们希望提供一致的跨平台开发者体验，但我们拒绝牺牲用户的期望。

我们相信 React Native 使开发者能够满足用户的期望，同时获得更好的开发者体验的优势。在本节中，我们分享以下内容：

1. 通过拥抱平台限制，我们实际上改善了其他平台的体验。
2. 我们可以从机构知识中学习，构建更高级别的跨平台抽象。
3. 每个平台上的其他参与者激励我们打造更好的开发者和用户体验。

### 拥抱平台限制

<!-- alex ignore easy -->

特定设备硬件或用户预期会施加独特的限制和要求。例如，Android 和 VR 头显上的内存通常比 iOS、macOS 和 Windows 更受限。再比如，用户期望移动应用几乎瞬间启动，但桌面应用启动时间长一些时他们不那么沮丧。**我们发现，通过 React Native 处理这些问题，可以更轻松地借鉴一个平台的经验教训和代码，应用到其他平台。**

<figure>
  <img src="/blog/assets/many-platform-vision-facebook-dating.png" alt="Facebook Dating 在移动端的截图" />
  <figcaption>
    React Native 和 Relay 支持了超过 1000 个 Facebook 在 Android 和 iOS 上的界面。
  </figcaption>
</figure>

例如，React Native 依赖一种名为“视图扁平化”的优化，这对减少 Android 上的内存使用至关重要。我们从未为 iOS 构建过这项优化，因为 iOS 没有同样的内存限制。在过去几年里，当我们构建新的跨平台渲染器时，我们不得不重新实现“视图扁平化”，但这次使用 C++ 编写，而不是特定平台的 Java。在 iOS 上尝试同样的优化仅仅是切换一个开关的问题。在 Facebook 生产应用中，我们观察到这提高了 iOS 上的性能！我们很可能从不会为 iOS 开发这项技术，但我们在 Android 上的投入反过来惠及了 iOS。

### 学习机构知识

React Native 最初创建的一个原因是减少工程孤岛。同一产品上的 Android 和 iOS 工程师往往彼此隔离。Android 工程师审查 Android 代码，参加 Android 聚会和会议；iOS 工程师审查 iOS 代码，参加 iOS 聚会和会议。不同平台的工程师带来独特的领域和机构知识，帮助构建出色的产品体验。

跨平台框架如 React Native 最好的成果之一是，它们将拥有截然不同领域专长的工程师汇聚一堂。**我们相信通过瞄准更多平台，可以加速平台专家间机构知识的相互交流。**

举例来说，React Native 中的无障碍抽象受到了 Android、iOS 和网页如何以不同方式处理无障碍的影响。这使我们能够构建一个通用接口，改善了两大移动平台上无障碍提示的处理方式。

另一个例子是，我们对网页上用户速度感知的研究促成了 Suspense 等并发特性的出现。过去一年，这些特性已在新的 [Facebook.com](https://facebook.com/) 网站上经过验证。借助新的渲染器，这些特性正逐渐进入 React Native，并影响我们设计事件调度和优先级的方式。React 团队对提升网页体验的投入也惠及了原生平台的 React Native。

### 竞争推动创新

除了领域专长工程师、聚会和会议外，每个平台也拥有其他独特角色，他们在解决类似问题。在网页领域，React（直接驱动着 React Native）经常从其他开源网页框架如 [Vue](https://vuejs.org/)、[Preact](https://preactjs.com/) 和 [Svelte](https://svelte.dev/) 获得灵感。在移动端，React Native 受到其他开源移动框架的启发，我们还在向 Facebook 内部构建的其他移动框架学习。

**我们相信，长期来看竞争会带来更好的成果。**通过研究每个平台上其他优秀者的优点，我们可以学习到可能适用于其他平台的经验。例如，为简化复杂网站而进行的竞赛推动了 React 的发展，也让 React Native 在为移动应用提供声明式框架时抢得先机。网页对更快迭代周期和构建时间的需求也促使了 Fast Refresh 的开发，这对 React Native 带来了显著好处。同样，Facebook 内部移动框架中的性能优化，尤其是在数据获取和并行化方面，推动我们改进了 React Native，也影响了我们构建新的 [Facebook.com](https://facebook.com/) 网站时的 React。

<figure>
  <img src="/blog/assets/many-platform-vision-facebook-website.png" alt="Facebook.com 网站截图" />
  <figcaption>
    React 和 Relay 支持了 <a href="https://facebook.com/">Facebook.com</a> 网站。
  </figcaption>
</figure>

## 拓展新平台

React 和 React Native 正处于一个转折点。React 已经[开始迈向 React 18 版本的发布](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html)，而[新的 React Native 渲染器现已全面支持 Facebook 移动应用](https://twitter.com/reactnative/status/1415099806507167745)。今年我们的团队大幅扩张，以支持 Facebook 内部日益增长的采用率。其他平台的开发团队也注意到了这种采用趋势，并看到他们同样有机会受益于 React Native。

**过去一年，我们与微软和 Messenger 团队合作，在 Windows 和 macOS 上打造真正的原生视频通话体验。** 由于我们对移动应用启动时间的严格把控，我们最初用 React Native 实现的桌面视频通话性能完全碾压了之前用 Electron 实现的版本。在构建这项体验的最初几周，我们录制了多路视频通话窗口尺寸调整的视频画面，对流畅的帧率赞叹不已。

为桌面构建应用让我们感到非常兴奋。我们带着开放的心态，将移动端经验应用到桌面端。我们拓宽了视野，支持多子窗口、菜单栏、系统托盘等功能。随着我们继续合作开发新的桌面 Messenger 功能，预计会发现机会去影响我们在网页和移动端的构建方式。如果你想保持最新动态，我们的桌面合作项目正[在 GitHub 上进行](https://github.com/microsoft/react-native-windows)。

<figure>
  <img src="/blog/assets/many-platform-vision-messenger-desktop.png" alt="macOS 上 Messenger 应用截图" />
  <figcaption>
    React Native 支持 Windows 和 macOS 上的 Messenger 视频通话。
  </figcaption>
</figure>

**我们也正在与 [Facebook Reality Labs](https://tech.fb.com/ar-vr/) 更紧密合作，以了解 React 如何独特地助力 Oculus 上的虚拟现实体验。** 使用 React Native 构建 VR 体验将尤为有趣，因为内存限制更紧张，用户对交互延迟也更敏感。

和我们为移动端处理 React Native 的方式类似，我们会先在 Facebook 级别做技术验证，再对外公开。许多方面仍在变化，我们还有许多问题尚未解答。我们希望确保技术适用于生产环境且可靠后，才与社区分享。

尽管大多数 VR 开发仍在内部进行，我们希望尽快分享更多内容。我们也预计，针对 VR 用例减少内存使用的项目，将在开源中展现出来。比如，这些项目可能也会降低移动和桌面体验中 React Native 的内存消耗。

<figure>
  <img src="/blog/assets/many-platform-vision-oculus-home.png" alt="虚拟现实中的 Oculus Home 截图" />
  <figcaption>
    React 和 Relay 支持 Oculus Home 及许多其他虚拟现实体验。
  </figcaption>
</figure>

回顾业界对 React 的采用历程，社区对 React 支持更多平台一直充满渴望。甚至在我们向社区宣布 React Native 之前，Netflix 就已经在开发 Gibbon，这是一款用于构建电视体验的自定义 React 渲染器。而在 Facebook 开始构建桌面版 Messenger 之前，[微软已经将 React 用于 Office 和 Windows 10 上的原生桌面体验构建](https://www.youtube.com/watch?v=IUMWFExtDSg&t=382s)。

## 总结

总而言之，我们的愿景是将 React Native 的影响力扩展到移动端之外，我们已通过与 Facebook 的桌面和 VR 团队合作迈出了这一步。我们知道，通过拥抱每个平台的限制，学习机构知识，并从其他参与者那里汲取灵感，会惠及生态系统中的每个平台。最重要的是，在此过程中，我们保持忠于[我们的指导原则](https://reactnative.dev/blog/2020/07/17/react-native-principles)。

我们对未来充满期待，期待继续探索多平台为 React Native 解锁的可能。欢迎关注我们（[@reactnative](https://twitter.com/reactnative)）获取更多更新，并分享你的想法！