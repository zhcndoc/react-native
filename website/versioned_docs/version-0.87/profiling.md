---
id: profiling
title: 性能分析
---

性能分析是分析应用性能、资源使用情况和行为，以识别潜在瓶颈或低效问题的过程。值得使用性能分析工具，以确保你的应用在不同设备和条件下都能流畅运行。

对于 iOS，Instruments 是非常宝贵的工具；而在 Android 上，你应该学会使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，[**确保开发模式处于关闭状态！**](performance.md#running-in-development-mode-devtrue)。

## 使用系统跟踪分析 Android UI 性能

Android 支持 1 万多种不同的手机，并且进行了通用化处理以支持软件渲染：框架架构以及需要适配众多硬件目标这一事实，意味着相比 iOS，你无法免费获得那么多性能。但有时，确实有一些可以改进的地方——而且很多时候，这完全不是原生代码的问题！

调试卡顿的第一步，是回答一个基本问题：在每个 16 毫秒的帧中，你的时间究竟花在哪里。为此，我们将使用 [Android Studio 内置的系统跟踪性能分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供相同的功能，并拥有更好的用户界面。
:::

### 1. 收集跟踪记录

首先，通过 USB 将出现你想要调查的卡顿现象的设备连接到电脑。在 Android Studio 中打开项目的 `android` 文件夹，在右上角窗格中选择你的设备，然后[将项目作为可分析版本运行](https://developer.android.com/studio/profile#build-and-run)。

当你的应用以可分析版本构建并在设备上运行时，将应用置于你想要分析的导航或动画即将开始之前，然后在 Android Studio Profiler 窗格中启动[“Capture System Activities”任务](https://developer.android.com/studio/profile#start-profiling)。

跟踪记录开始收集后，执行你关注的动画或交互。然后按下“停止录制”。现在，你可以[直接在 Android Studio 中检查跟踪记录](https://developer.android.com/studio/profile/jank-detection)。或者，你可以在“过去的录制记录”窗格中选择它，按下“导出录制记录”，并在 [Perfetto](https://perfetto.dev/) 等工具中打开它。

### 2. 阅读跟踪记录

在 Android Studio 或 Perfetto 中打开跟踪记录后，你应该会看到类似这样的内容：

![示例](/docs/assets/SystraceExample.png)

:::note[提示]
使用 WASD 键进行平移和缩放。
:::

具体 UI 可能会有所不同，但无论你使用哪种工具，下面的说明都适用。

:::info[启用 VSync 高亮]
选中屏幕右上角的此复选框，以高亮显示 16 毫秒帧的边界：

![启用 VSync 高亮](/docs/assets/SystraceHighlightVSync.png)

你应该会看到如上方截图所示的斑马条纹。如果没有，请尝试在其他设备上进行性能分析：已知 Samsung 在显示 vsync 时存在问题，而 Nexus 系列通常相当可靠。
:::

### 3. 查找你的进程

滚动直到看到你的包名的一部分。在本例中，我分析的是 `com.facebook.adsmanager`，但由于内核中线程名称的长度限制，它显示为 `book.adsmanager`。

在左侧，你会看到一组线程，它们对应于右侧时间线中的各行。这里有几个线程与我们的目的相关：UI 线程（其名称是你的包名或 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你运行的是 Android 5 及更高版本，Render Thread 也与我们相关。

- **UI 线程。** 标准的 android measure/layout/draw 就发生在这里。右侧的线程名称将是你的包名（在我的案例中是 book.adsmanager）或 UI Thread。你在此线程上看到的事件应该类似于下面这样，并且会涉及 `Choreographer`、`traversals` 和 `DispatchUI`：

  ![UI 线程示例](/docs/assets/SystraceUIThreadExample.png)

- **JS 线程。** JavaScript 在这里执行。线程名称将是 `mqt_js` 或 `<...>`，具体取决于设备内核的配合程度。如果它没有名称，请查找 `JSCall`、`Bridge.executeJSCall` 等内容来识别它：

  ![JS 线程示例](/docs/assets/SystraceJSThreadExample.png)

- **原生模块线程。** 原生模块调用（例如 `UIManager`）在这里执行。线程名称将是 `mqt_native_modules` 或 `<...>`。在后一种情况下，请查找 `NativeCall`、`callJavaModuleMethod` 和 `onBatchComplete` 等内容来识别它：

  ![原生模块线程示例](/docs/assets/SystraceNativeModulesThreadExample.png)

- **额外内容：Render Thread。** 如果你使用的是 Android L（5.0）及更高版本，应用中还会有一个渲染线程。该线程会生成用于绘制 UI 的实际 OpenGL 命令。线程名称将是 `RenderThread` 或 `<...>`。在后一种情况下，请查找 `DrawFrame` 和 `queueBuffer` 等内容来识别它：

  ![Render Thread 示例](/docs/assets/SystraceRenderThreadExample.png)

## 识别问题根源

流畅的动画应该类似于下面这样：

![流畅动画](/docs/assets/SystraceWellBehaved.png)

每次颜色变化都是一个帧——请记住，为了显示一个帧，我们所有的 UI 工作都需要在这 16 毫秒周期结束前完成。注意，没有线程在接近帧边界时仍在工作。像这样渲染的应用，其渲染帧率为 60 FPS。

但是，如果你注意到了卡顿，可能会看到类似这样的内容：

![来自 JS 的卡顿动画](/docs/assets/SystraceBadJS.png)

注意，JS 线程几乎一直在执行，并且跨越了帧边界！此应用的渲染帧率不是 60 FPS。在这种情况下，**问题出在 JS 中**。

你也可能会看到类似这样的内容：

![来自 UI 的卡顿动画](/docs/assets/SystraceBadUI.png)

在这种情况下，UI 线程和渲染线程的工作跨越了帧边界。我们试图在每个帧中渲染的 UI 需要完成太多工作。在这种情况下，**问题出在正在渲染的原生视图上**。

此时，你已经获得了一些非常有帮助的信息，可以据此决定下一步行动。

## 解决 JavaScript 问题

如果你确定是 JS 问题，请在你正在执行的具体 JS 中寻找线索。在上面的场景中，我们看到每个帧都会多次调用 `RCTEventEmitter`。下面是上方跟踪记录中 JS 线程的放大图：

![过多的 JS](/docs/assets/SystraceBadJS2.png)

这似乎不太对。为什么它会被如此频繁地调用？它们实际上是不同的事件吗？这些问题的答案可能取决于你的产品代码。很多时候，你会希望查看 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果你确定是原生 UI 问题，通常有两种情况：

1. 你尝试在每个帧中绘制的 UI 涉及 GPU 上过多的工作，或
2. 你在动画或交互过程中构建了新的 UI（例如，在滚动期间加载新内容）。

### GPU 工作过多

在第一种情况下，你会看到 UI 线程和／或 Render Thread 看起来像这样：

![GPU 过载](/docs/assets/SystraceBadUI.png)

注意，`DrawFrame` 中花费了很长时间，并且跨越了帧边界。这段时间用于等待 GPU 从上一帧中清空其命令缓冲区。

要缓解此问题，你应该：

- 对于正在进行动画或变换的复杂静态内容（例如 `Navigator` 的滑动／透明度动画），考虑使用 `renderToHardwareTextureAndroid`
- 确保你**没有**使用 `needsOffscreenAlphaCompositing`。该选项默认处于禁用状态，因为在大多数情况下，它会大幅增加 GPU 的每帧负载。

### 在 UI 线程上创建新视图

在第二种情况下，你看到的内容会更接近这样：

![创建视图](/docs/assets/SystraceBadCreateUI.png)

注意，首先 JS 线程会思考一会儿，然后你会看到原生模块线程执行了一些工作，接着 UI 线程执行了代价高昂的遍历。

除非你能够将新 UI 的创建推迟到交互之后，或者能够简化你正在创建的 UI，否则没有快速的缓解方法。react native 团队正在为此开发基础设施层面的解决方案，使新 UI 能够在主线程之外创建和配置，从而让交互继续保持流畅。

### 查找原生 CPU 热点

如果问题似乎出在原生端，你可以使用 [CPU 热点性能分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods)来详细了解发生了什么。打开 Android Studio Profiler 面板，然后选择“查找 CPU 热点（Java／Kotlin 方法录制）”。

:::info[选择 Java／Kotlin 录制]

确保选择“查找 CPU 热点 **（Java／Kotlin 录制）**”，而不是“查找 CPU 热点（调用栈采样）”。它们的图标相似，但执行的操作不同。
:::

执行交互并按下“停止录制”。录制过程会大量消耗资源，因此请保持交互时间较短。然后，你可以在 Android Studio 中检查生成的跟踪记录，或者将其导出并在 [Firefox Profiler](https://profiler.firefox.com/) 等在线工具中打开。

与系统跟踪不同，CPU 热点性能分析速度较慢，因此无法提供准确的测量结果。不过，它应该能让你了解调用了哪些原生方法，以及每个帧中时间按比例花费在了哪里。
