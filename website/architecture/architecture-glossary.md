---
id: architecture-glossary
title: 术语表
slug: /glossary
---

## Dev Menu

应用内的开发者菜单（仅在开发版本中可用），提供访问各种开发和调试操作的入口。[在文档中了解更多关于 Dev Menu 的内容](/docs/debugging)。

## Fabric Renderer

React Native 执行与 Web React 相同的 React 框架代码。但 React Native 渲染的是通用平台视图（宿主视图），而不是 DOM 节点（可视为 Web 的宿主视图）。Fabric Renderer 实现了向宿主视图渲染的能力。Fabric 让 React 能够与各个平台通信并管理其宿主视图实例。Fabric Renderer 存在于 JavaScript 中，目标是由 C++ 代码提供的接口。[在这篇博客文章中了解更多关于 React 渲染器的内容。](https://overreacted.io/react-as-a-ui-runtime/#renderers)

## Host platform

嵌入 React Native 的平台（例如 Android、iOS、macOS、Windows）。

## Host View Tree (及 Host View)

宿主平台（如 Android、iOS）中的视图树的表示。在 Android 中，宿主视图是 `android.view.ViewGroup`、`android.widget.TextView` 等的实例，这些是宿主视图树的构建块。每个宿主视图的大小和位置基于 Yoga 计算的 `LayoutMetrics`，每个宿主视图的样式和内容则依据来自 React Shadow Tree 的信息。

## JavaScript Interfaces (JSI)

一种轻量级的 API，用于在 C++ 应用中嵌入 JavaScript 引擎。Fabric 使用它在 Fabric 的 C++ 核心和 React 之间进行通信。

## Java Native Interface (JNI)

一个用于编写 Java 本地方法的[API](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/)，用于 Fabric 的 C++ 核心与 Android（用 Java 编写）之间的通信。

## React Component

一个 JavaScript 函数或类，说明如何创建一个 React 元素。[在这篇博客文章中深入了解 React 组件和元素。](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

## React Composite Components

实现了 `render` 方法且其渲染结果归约为其他 React 复合组件（Composite Components）或 React 宿主组件（Host Components）的 React 组件。

## React Host Components 或 Host Components

React 组件，其视图实现由宿主视图提供（例如 `<View>, <Text>`）。在 Web 中，ReactDOM 的宿主组件类似 `<p>` 和 `<div>` 这样的组件。

## React Element Tree (及 React Element)

_React 元素树_ 是 React 在 JavaScript 中创建的，由 React 元素组成。_React 元素_ 是一个描述屏幕上应显示内容的普通 JavaScript 对象，包含 props、样式和子节点。React 元素仅存在于 JavaScript 中，可以表示 React 复合组件或 React 宿主组件的实例。[在这篇博客文章中了解更多关于 React 组件和元素。](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

## React Native Framework

React Native 允许开发者使用 [React 编程范式](https://react.dev/learn/thinking-in-react) 来发布原生目标平台的应用。React Native 团队专注于创建满足开发原生应用中最通用场景的**核心 API**和**功能**。

发布原生应用到生产环境通常需要一套工具和库，这些通常不作为 React Native 的默认组成部分，但对发布应用至关重要。例如：支持将应用发布到专用商店的工具，或路由和导航机制支持。

当这些工具和库集合起来，形成一个基于 React Native 之上的连贯框架时，我们称之为**React Native 框架**。

一个开源的 React Native 框架示例是 [Expo](https://expo.dev/)。

## React Shadow Tree (及 React Shadow Node)

_React Shadow Tree_ 由 Fabric Renderer 创建，由 React Shadow Nodes 组成。React Shadow Node 是一个表示待挂载 React 宿主组件的对象，包含来自 JavaScript 的 props，以及布局信息（x、y、宽度、高度）。在 Fabric 中，React Shadow Node 对象存在于 C++ 中。Fabric 之前，这些对象存在于移动运行时堆中（如 Android JVM）。

## Yoga Tree (及 Yoga Node)

_Yoga 树_ 被 [Yoga](https://www.yogalayout.dev/) 用于计算 React Shadow Tree 的布局信息。通常，每个 React Shadow Node 会创建一个 _Yoga 节点_，因为 React Native 使用 Yoga 来计算布局，但这不是强制的。Fabric 也可以创建不使用 Yoga 的 React Shadow Nodes；每个 React Shadow Node 的实现决定如何计算布局。