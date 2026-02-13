---
title: 'React Native 月刊 #1'
author: Tomislav Tenodi
authorTitle: Shoutem 产品经理
authorURL: 'https://github.com/tenodi'
authorImageURL: 'https://pbs.twimg.com/profile_images/877237660225609729/bKFDwfAq.jpg'
authorTwitter: TomislavTenodi
tags: [engineering]
---

在 [Shoutem](https://shoutem.github.io/) ，我们很幸运能够从 React Native 诞生之初就开始使用它。我们决定从第一天起就成为这个了不起社区的一部分。不久后，我们意识到几乎不可能跟上社区日益增长和改进的速度。正因如此，我们决定组织一个月度会议，让所有主要的 React Native 贡献者简短地介绍他们的工作和计划。

## 月度会议

我们在 2017 年 6 月 14 日举办了第一次月度会议。React Native 月刊的使命简单明了：**提升 React Native 社区**。团队的工作展示促进了线下团队之间的协作。

## 团队

在第一次会议上，共有 8 个团队参加了会议：

- [Airbnb](https://github.com/airbnb)
- [Callstack](https://github.com/callstack-io)
- [Expo](https://github.com/expo)
- [Facebook](https://github.com/facebook)
- [GeekyAnts](https://github.com/GeekyAnts)
- [Microsoft](https://github.com/microsoft)
- [Shoutem](https://github.com/shoutem)
- [Wix](https://github.com/wix)

我们希望未来有更多核心贡献者参加接下来的会议！

## 会议纪要

鉴于团队的计划可能对更广泛的受众感兴趣，我们会在这里，即 React Native 博客上分享它们。以下是内容：

### Airbnb

- 计划向 `View` 组件和 `AccessibilityInfo` 原生模块添加一些 A11y（无障碍）API。
- 将调查在 Android 原生模块中添加 API，以便指定它们运行的线程。
- 正在研究潜在的初始化性能改进。
- 正在研究一些更复杂的打包策略，以配合“拆包”（unbundle）使用。

### Callstack

- 正在尝试通过使用 [Detox](https://github.com/wix/detox) 进行端到端测试来改进发布流程，相关拉取请求即将提交。
- 一直在开发的 Blob 功能的拉取请求已合并，后续的拉取请求也在进行中。
- 在内部项目中推广使用 [Haul](https://github.com/callstack-io/haul) ，以观察其相较于 [Metro Bundler](https://github.com/facebook/metro-bundler) 的性能表现。正在与 webpack 团队合作提升多线程性能。
- 内部已实现更完善的开源项目管理基础设施，未来几周将发布更多相关内容。
- React Native 欧洲会议正在筹备中，目前暂无特别内容，但大家均被邀请参加！
- 暂时从 [react-navigation](https://github.com/react-community/react-navigation) 退后，探索其他替代方案（尤其是原生导航）。

### Expo

- 正在实现可以在 [Snack](https://snack.expo.io/) 中安装 npm 模块的功能，这对库作者在文档中添加示例非常有用。
- 与 [Krzysztof](https://github.com/kmagiera) 及 [Software Mansion](https://github.com/software-mansion) 的其他成员合作，推进 Android 上 JSC 的更新和手势处理库开发。
- [Adam Miskiewicz](https://github.com/skevy) 正在逐渐将精力转向 [react-navigation](https://github.com/react-community/react-navigation)。
- [Create React Native App](https://github.com/react-community/create-react-native-app) 已纳入文档中的 [入门指南](/docs/getting-started) 。Expo 希望鼓励库作者明确说明他们的库是否支持 CRNA，并说明如何配置。

### Facebook

- React Native 的打包工具现已变更为独立仓库的 [Metro Bundler](https://github.com/facebook/metro)。伦敦的 Metro Bundler 团队非常期待响应社区需求，提升模块化以支持 React Native 以外的更多用例，并加快对问题和 PR 的响应速度。
- 接下来几个月，React Native 团队将致力于优化基础组件的 API。期待在布局细节、无障碍以及 Flow 类型方面的改进。
- 今年团队还计划通过重构改善核心模块化，以全面支持第三方平台如 Windows 和 macOS。

### GeekyAnts

- 团队正在开发一款 UI/UX 设计应用（代号：Builder），能够直接操作 `.js` 文件。目前仅支持 React Native。这类似于 Adobe XD 和 Sketch。
- 团队正在努力实现：你可以在编辑器中加载已有的 React Native 应用，进行视觉化修改（设计师操作），然后将更改直接保存到 JS 文件中。
- 致力于缩小设计师与开发者之间的差距，让他们共用同一个代码仓库。
- 此外，[NativeBase](https://github.com/GeekyAnts/NativeBase) 最近已获得了 5,000 个 GitHub 星标。

### Microsoft

- [CodePush](https://github.com/Microsoft/code-push) 现已整合进 [Mobile Center](https://mobile.azure.com/)，这是实现分发、分析和其他服务更紧密集成体验的第一步。相关公告见 [这里](https://microsoft.github.io/code-push/articles/CodePushOnMobileCenter.html)。
- [VS Code](https://github.com/Microsoft/vscode) 存在调试相关的一个 Bug，目前团队正在修复，并会发布新版本。
- 正在调研使用 [Detox](https://github.com/wix/detox) 进行集成测试，研究 JSC 上下文以获取变量和崩溃报告。

### Shoutem

- 正在利用 React Native 社区的工具简化 Shoutem 应用的开发。你将可以使用所有 React Native 命令来运行在 [Shoutem](https://shoutem.github.io/) 上创建的应用。
- 正在调研 React Native 的性能分析工具，期间遇到不少问题，将会记录下这些经验分享给社区。
- Shoutem 正在努力简化 React Native 与现有原生应用的集成，计划公开分享公司内部开发的方案，以便获得社区反馈。

### Wix

- 内部推广使用 [Detox](https://github.com/wix/detox) ，目标是实现 Wix 应用的“零手动测试”流程。目前 Detox 已被几十位开发者在生产环境广泛使用，并在快速成熟。
- 正在为 [Metro Bundler](https://github.com/facebook/metro) 添加支持，允许在构建过程中覆盖任意文件扩展名。除了“ios”和“android”，将支持诸如“e2e”或“detox”等自定义扩展，计划用于端到端模拟测试。目前已有一个叫 [react-native-repackager](https://github.com/wix/react-native-repackager) 的库，正在推进相关拉取请求。
- 研究性能测试的自动化，开发了一个新仓库 [DetoxInstruments](https://github.com/wix/DetoxInstruments)，欢迎查看，开源开发中。
- 与 KPN 的贡献者合作，优化 Detox 在 Android 上的表现，并支持真实设备。
- 构思“Detox 作为平台”的模式，支持搭建其他需要自动化模拟器或设备的工具。例如 React Native 的 [Storybook](https://github.com/storybooks/react-native-storybook) 或 Ram 提出的集成测试方案。

## 下一次会议

会议每四周举行一次。下一次会议定于 2017 年 7 月 12 日召开。鉴于我们刚刚开始举办此会议，希望了解这些纪要对 React Native 社区有哪些帮助。如果你有针对未来会议内容的建议，或者对会议产出如何改进有想法，欢迎随时在[Twitter](https://twitter.com/TomislavTenodi)上联系我。