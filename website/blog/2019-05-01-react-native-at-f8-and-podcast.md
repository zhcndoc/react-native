---
title: React Native 在 F8 大会和开源播客中的表现
authors: [cpojer]
tags: [公告]
---

本周，[Eli White](https://twitter.com/Eli_White) 在 [F8 2019](https://developers.facebook.com/videos/2019/mobile-innovation-with-react-native-componentkit-and-litho/) 大会上做了一个关于 React Native 在 Facebook 安卓和 iOS 应用中的应用的演讲。我们很高兴分享过去两年的工作成果以及我们接下来的计划。

请在[Facebook 开发者网站](https://developers.facebook.com/videos/2019/mobile-innovation-with-react-native-componentkit-and-litho/)观看视频：

<a href="https://developers.facebook.com/videos/2019/mobile-innovation-with-react-native-componentkit-and-litho/">
  <img
    src="/blog/assets/eli-at-f8.png"
    alt="F8 演讲关于 React Native"
  />
</a>

#### 演讲亮点：

- 我们在 2017 和 2018 年主要专注于 React Native 最大的产品——Facebook 的 Marketplace。我们与 Marketplace 团队合作，提升质量并增加产品的吸引力。至此，Marketplace 已成为 Facebook 应用中安卓和 iOS 平台上质量最高的产品之一。
- Marketplace 的性能也是一大挑战，特别是在中端安卓设备上。过去一年我们将启动时间缩短了超过 50%，未来还会有更多改进！最大的性能提升正在被内置到 React Native 中，并将在今年晚些时候带给社区。
- 我们有信心使用 React Native 构建出 Facebook 需要的高质量且高性能的应用。这份信心让我们敢于做更大胆的尝试，比如[重新设计 React Native 核心](https://www.youtube.com/watch?v=UcqRXTriUVI&app=desktop)。
- 微软支持并使用 React Native for Windows，让用户能够利用他们的技术专长和代码库渲染到微软的通用 Windows 平台。请关注下周的 Microsoft Build，届时可[听他们分享更多](https://mybuild.techcommunity.microsoft.com/sessions/77321)。

### React Radio 播客谈开源

Eli 的演讲以介绍我们近期的开源工作收尾。我们在三月时进行了[进展更新](/blog/2019/03/01/react-native-open-source-update)，最近，[Nader Dabit](https://twitter.com/dabit3) 和 [Gant Laborde](https://twitter.com/GantLaborde) 邀请 Christoph 参加他们的播客 [React Native Radio](https://devchat.tv/react-native-radio/react-native-open-source-the-react-native-community-feat-christoph-nakazawa/)，聊了聊 React Native 在开源方面的情况。

#### 播客亮点：

- 我们谈到了 Facebook 的 React Native 团队如何看待开源，以及我们如何建设一个可持续且能应对 React Native 这样[庞大项目规模](https://octoverse.github.com/projects#repositories)的社区。
- 作为 [Lean Core](https://github.com/facebook/react-native/issues/23313) 计划的一部分，我们正按计划移除多个模块。许多模块如 WebView 和 React Native CLI 自被拆分以来已收到超过 100 个 Pull Request。
- 接下来，我们将重点改版 React Native 网站和文档，敬请期待！

你很快就能在喜欢的播客应用中找到本期节目，或者你也可以直接在这里收听录音：

<audio controls style={{display: 'block', margin: '0 auto'}} src="https://media.devchat.tv/reactnativeradio/React_Native_Radio_Episode_121.mp3"> {' '} 该浏览器不支持音频播放。{' '} </audio>