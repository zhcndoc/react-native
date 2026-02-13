---
id: threading-model
title: 线程模型
---

import FabricWarning from './\_fabric-warning.mdx';

<FabricWarning />

#### React Native 渲染器将[渲染管线](render-pipeline)的工作分散到多个线程中。

在这里，我们定义线程模型，并通过一些示例说明渲染管线的线程使用情况。

React Native 渲染器设计为线程安全。从高层次来看，线程安全通过在框架内部使用不可变数据结构来保证（由 C++ 的“const correctnes”特性强制执行）。这意味着 React 中的每次更新都会在渲染器中创建或克隆新的对象，而不是更新已有的数据结构。这使得框架能够向 React 暴露线程安全且同步的 API。

渲染器使用两种不同的线程：

- **UI 线程**（常称为主线程）：唯一能操作宿主视图的线程。
- **JavaScript 线程**：执行 React 的渲染阶段以及布局。

让我们回顾每个阶段支持的执行场景：

<figure>
  <img src="/docs/assets/Architecture/threading-model/symbols.png" alt="线程模型符号" />
</figure>

## 渲染场景

### 在 JS 线程中渲染

这是最常见的场景，大部分渲染管线在 JavaScript 线程上执行。

<figure>
	<img src="/docs/assets/Architecture/threading-model/case-1.jpg" alt="线程模型使用场景一" />
</figure>

---

### 在 UI 线程中渲染

当 UI 线程上有一个高优先级事件时，渲染器能够在 UI 线程上同步执行整个渲染管线。

<figure>
	<img src="/docs/assets/Architecture/threading-model/case-2.jpg" alt="线程模型使用场景二" />
</figure>

---

### 默认或连续事件中断

该场景展示了 UI 线程上的低优先级事件中断渲染阶段的情况。React 和 React Native 渲染器能够中断渲染阶段，并将其状态与在 UI 线程上执行的低优先级事件合并。在这种情况下，渲染过程继续在 JS 线程上执行。

<figure>
	<img src="/docs/assets/Architecture/threading-model/case-3.jpg" alt="线程模型使用场景三" />
</figure>

---

### 离散事件中断

渲染阶段是可中断的。该场景展示了 UI 线程上高优先级事件中断渲染阶段的情况。React 和渲染器能够中断渲染阶段，并将其状态与已经在 UI 线程执行的高优先级事件合并。渲染阶段在 UI 线程上同步执行。

<figure>
	<img src="/docs/assets/Architecture/threading-model/case-4.jpg" alt="线程模型使用场景四" />
</figure>

---

### C++ 状态更新

更新起源于 UI 线程且跳过渲染阶段。更多详情请参见[React Native 渲染器状态更新](render-pipeline#react-native-renderer-state-updates)。

<figure>
	<img src="/docs/assets/Architecture/threading-model/case-6.jpg" alt="线程模型使用场景六" />
</figure>