---
id: xplat-implementation
title: 跨平台实现
---

import FabricWarning from './\_fabric-warning.mdx';

<FabricWarning />

#### React Native 渲染器利用核心渲染实现以实现跨平台共享

在 React Native 之前的渲染系统中，**[React Shadow Tree（React 阴影树）](architecture-glossary.md#react-shadow-tree-and-react-shadow-node)**、布局逻辑以及 **[视图扁平化](view-flattening.md)** 算法都是针对每个平台单独实现的。当前的渲染器设计成一个跨平台解决方案，共享核心的 C++ 实现。

React Native 团队计划将动画系统集成到渲染系统中，同时扩展 React Native 渲染系统到新的平台，如 Windows，以及游戏主机、电视等操作系统。

利用 C++ 作为核心渲染系统带来了诸多优势。单一实现减少了开发和维护成本。它提升了创建 React 阴影树和布局计算的性能，因为在 Android 上集成 [Yoga](architecture-glossary.md#yoga-tree-and-yoga-node) 与渲染器的开销被最小化（即不再需要为 Yoga 使用 [JNI](architecture-glossary.md#java-native-interface-jni)）。最后，每个 React 阴影节点的内存占用在 C++ 中比在 Kotlin 或 Swift 分配时要小。

团队还利用了 C++ 的不可变特性，确保不会出现并发访问共享但未加保护资源的问题。

需要注意的是，Android 渲染器的用例仍然必须承担 [JNI](architecture-glossary.md#java-native-interface-jni) 的开销，主要集中在两个方面：

- 复杂视图（例如 `Text`、`TextInput` 等）的布局计算需要通过 JNI 传递属性。
- 挂载阶段需要通过 JNI 发送变更操作。

团队正在探索用新的机制替代 `ReadableMap`，通过 `ByteBuffer` 来序列化数据，以减少 JNI 开销。我们的目标是减少 35% 到 50% 的 JNI 开销。

渲染器提供了两方面的 C++ API：

- **(i)** 用于与 React 通信
- **(ii)** 用于与宿主平台通信

对于 **(i)**，React 与渲染器通信以**渲染** React 树，并“监听”**事件**（例如 `onLayout`、`onKeyPress`、触摸事件等）。

对于 **(ii)**，React Native 渲染器与宿主平台通信，以在屏幕上挂载宿主视图（创建、插入、更新或删除宿主视图），并监听由用户在宿主平台上产生的**事件**。

![跨平台实现示意图](/docs/assets/Architecture/xplat-implementation/xplat-implementation-diagram.png)