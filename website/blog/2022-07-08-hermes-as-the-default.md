---
title: Hermes 作为默认引擎
authors: [micleo]
tags: [公告, 发布]
---

# Hermes 作为默认引擎的博客文章

去年十月，我们[宣布](/blog/2021/10/26/toward-hermes-being-the-default)开始着手**将 Hermes 设为所有 React Native 应用的默认引擎**。

Hermes 为 Meta 内部的 React Native 带来了巨大价值，我们相信开源社区也将从中受益。Hermes 设计用于资源受限的设备，针对启动速度、应用体积和内存消耗进行了优化。Hermes 与其他 JavaScript 引擎的一个关键区别是它能提前将 JavaScript 源代码编译为字节码。预编译的字节码会被打包进二进制文件，避免了解释器在应用启动时执行这一步昂贵操作。

自公告以来，我们投入了大量工作来改进 Hermes。今天，我们很高兴地宣布，**React Native 0.70 将默认使用 Hermes 引擎。** 这意味着从 v0.70 开始的新项目将默认启用 Hermes。随着 7 月的版本发布临近，我们希望与社区密切合作，确保过渡顺利并为所有用户带来价值。本文将介绍此次变更的预期效果、性能基准、主要新功能等。注意，你无需等待 React Native 0.70 就能开始使用 Hermes —— 你可以**按照[这份指南](/docs/hermes#enabling-hermes)在现有 React Native 应用中启用 Hermes**。

另外，尽管在新项目中 Hermes 将是默认选项，其他引擎的支持仍将继续。

<!--truncate-->

## 性能测试

我们衡量了对应用开发者至关重要的三项指标：TTI（可交互时间）、二进制体积和内存消耗。我们使用 React Native 应用 [Mattermost](https://github.com/mattermost/mattermost-mobile) 进行测试。测试涵盖了 Android 和 iOS，设备为 2020 年的高端机型。

- TTI（time to interactive，可交互时间）是从应用启动到用户能够操作它所需的时间。在基准测试中定义为从点击应用图标到第一屏幕呈现的时间。我们同样提供了 Mattermost 启动的屏幕录制视频。
- 二进制体积采用 Android 的 APK 大小和 iOS 的 IPA 大小进行衡量。
- 内存消耗数据是在 Mattermost 应用中运行几分钟采集的，相同操作分别在两个引擎下执行。

## Android 性能测试数据

所有 Android 测试均在三星 Galaxy S20 上完成。

<figure>
  <img src="/blog/assets/hermes-default-android-data.png" alt="Android 性能测试数据" />
</figure>

### TTI 视频

<figure>
  <img src="/blog/assets/hermes-default-android-video.gif" alt="Android TTI 视频" />
</figure>

## iOS 性能测试数据

所有 iOS 测试均在 iPhone 12 Pro 上完成。

<figure>
  <img src="/blog/assets/hermes-default-ios-data.png" alt="iOS 性能测试数据" />
</figure>

### TTI 视频

<figure>
  <img src="/blog/assets/hermes-default-ios-video.gif" alt="iOS TTI 视频" />
</figure>

### 慢速播放 TTI 视频，更加清晰地展示启动时间差异。

<figure>
  <img src="/blog/assets/hermes-default-ios-slow-video.gif" alt="iOS 慢速播放 TTI 视频" />
</figure>

## React Native 与 Hermes 集成

我们解决了一个长期存在的问题 —— 这个问题导致兼容性困难，并且在发布新版本 React Native 时反复出现：React Native 之前依赖通过 CocoaPods 和 npm 分发的 Hermes 预构建二进制文件，可能引发 API 或 [ABI 不兼容](https://github.com/react-native-community/discussions-and-proposals/issues/257)。为了解决此问题，React Native 0.69 起，Hermes 作为每个 React Native 版本的一部分一同构建。这样确保了和 React Native 各版本的完全兼容，也实现了更紧密的集成。这将加快功能迭代和修复速度，使我们更加自信地实施 Hermes 的重大变更。关于这种新集成的详细信息，请见[这里](https://github.com/facebook/react-native-website/pull/3159/files)。

## iOS Intl 支持

我们完成了 iOS 端对 [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) 的实现，Intl 是 ECMAScript 国际化 API，提供丰富的语言相关功能。这是一个长期存在的[缺口](https://github.com/facebook/hermes/issues/23)，阻碍一些开发者使用 Hermes。Android 版本则是与微软合作，于 React Native 0.65 中推出的。随着 React Native 0.70 发布，开发者将在两个平台上均享有本地支持。

通常 `Intl` 的实现需要引入庞大的查找表或数据，如 [Unicode CLDR](https://cldr.unicode.org/index)。但这可能会导致体积增长多达 6MB。为了避免 Hermes 二进制膨胀，我们采用了调用 iOS 自身暴露的 API 实现 `Intl`，利用了 iOS 已自带的地区和国际化数据。

## 未来计划

随着 Hermes 持续发展，我们希望向社区展示近期重点方向：提升开发者体验，确保不会因缺少 JavaScript 语言特性而使任何人回避 Hermes。具体来说，我们正在：

- 让开发者能直接从 Chrome 开发者工具 UI 运行采样分析器。
- 支持 [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)，这是一项社区长期请求的特性，因其无法通过 Polyfill 实现，影响部分开发者使用 Hermes。
- 支持 [`WeakRef`](https://github.com/facebook/hermes/issues/658)，为开发者开放新的内存管理控制权。

## 总结

Hermes 成为默认引擎标志着一段长期旅程的开始。我们正致力于新的功能开发，助力社区在未来多年编写高效应用。我们也鼓励开发者在我们的[GitHub 仓库](https://github.com/facebook/react-native)上反馈任何错误、提出问题、分享建议或想法！我们已创建了一个 `hermes` 标签，方便针对 Hermes 相关内容的讨论。