---
id: fabric-renderer
title: Fabric
---

Fabric 是 React Native 的全新渲染系统，是对传统渲染系统的概念性进化。其核心原则是将更多的渲染逻辑统一到 C++ 中，提升与[宿主平台](architecture-glossary.md#host-platform)的互操作性，并为 React Native 解锁新的功能。该项目始于 2018 年，在 2021 年，Facebook 应用中的 React Native 已经采用了这一新渲染器。

本文档提供了[新渲染器](architecture-glossary.md#fabric-render)及其概念的概述。文中避免了具体平台细节，也未包含任何代码片段或指示。本文档涵盖了关键概念、动机、优势以及不同场景下渲染管线的概述。

## 新渲染器的动机与优势

渲染架构的设计旨在实现传统架构无法达到的更优用户体验。例如：

- 通过增强[宿主视图](architecture-glossary.md#host-view-tree-and-host-view)与 React 视图之间的互操作性，渲染器能够同步测量并渲染 React 界面。在传统架构中，React Native 的布局是异步的，这导致将 React Native 渲染视图嵌入到_宿主视图_时出现布局“跳动”问题。
- 支持多优先级与同步事件，渲染器能够优先处理特定用户交互，确保及时响应。
- 集成了 React Suspense（[链接](https://reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)），使 React 应用中的数据获取设计更直观。
- 在 React Native 上启用 React 的[并发特性](https://github.com/reactwg/react-18/discussions/4)。
- 实现 React Native 的服务端渲染变得更容易。

新架构在代码质量、性能和可扩展性方面也带来了诸多好处：

- **类型安全：** 通过代码生成确保 JS 和[宿主平台](architecture-glossary.md#host-platform)之间的类型安全。代码生成使用 JavaScript 组件声明作为真实依据，生成用于存储属性的 C++ 结构体。JavaScript 和宿主组件属性不匹配时会导致构建错误。
- **共享的 C++ 核心：** 渲染器以 C++ 实现，核心代码跨平台共享，提升一致性，简化 React Native 在新平台的适配。
- **更佳的宿主平台互操作性：** 同步且线程安全的布局计算提升了将宿主组件嵌入 React Native 时的用户体验，同时方便集成依赖同步 API 的宿主平台框架。
- **性能提升：** 新的跨平台渲染系统实现，令所有平台均获性能提升，这些改进可能源自某一平台的限制。例如，视图扁平化最初是 Android 的性能解决方案，现在默认在 Android 与 iOS 上均可用。
- **一致性：** 新渲染系统跨平台，使得不同平台间更易保持一致。
- **启动更快：** 宿主组件默认懒加载初始化。
- **减少 JS 与宿主平台之间的数据序列化：** React 过去需通过序列化 JSON 传递 JavaScript 与_宿主平台_间数据。新渲染器通过使用[JavaScript 接口（JSI）](architecture-glossary.md#javascript-interfaces-jsi)直接访问 JavaScript 值，优化了数据传输。