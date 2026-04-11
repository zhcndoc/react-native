---
id: profiling
title: 性能分析
---

性能分析是分析应用程序的性能、资源使用和行为以识别潜在瓶颈或低效之处的过程。值得利用性能分析工具来确保你的应用程序在不同设备和条件下都能流畅运行。

对于 iOS，Instruments 是一个宝贵的工具，而在 Android 上，你应该学习使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，[**确保关闭开发模式！**](performance.md#running-in-development-mode-devtrue)。

## 使用系统追踪分析 Android UI 性能

Android 支持 10000+ 种不同的手机，并且泛化以支持软件渲染：框架架构和需要在许多硬件目标上进行泛化的需求，不幸意味着相对于 iOS，你获得的免费优化更少。但有时，有些事情是可以改进的——而且很多时候根本不是原生代码的错！

调试这种卡顿的第一步是回答一个基本问题：在每个 16ms 帧期间，你的时间花在哪里了。为此，我们将使用 [Android Studio 中内置的系统追踪性能分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供了相同的功能且具有更好的用户界面。
:::

### 1. 收集追踪

首先，通过 USB 将表现出你想要调查的卡顿现象的设备连接到你的计算机。在 Android Studio 中打开项目的 `android` 文件夹，在右上角窗格中选择你的设备，并 [作为可分析项目运行你的项目](https://developer.android.com/studio/profile#build-and-run)。

当你的应用程序构建为可分析模式并在设备上运行时，将应用程序引导到你想要分析的自然导航/动画之前的状态，并在 Android Studio Profiler 窗格中启动 ["捕获系统活动" 任务](https://developer.android.com/studio/profile#start-profiling)。

一旦追踪开始收集，执行你关心的动画或交互。然后按下 "Stop recording"。你现在可以 [直接在 Android Studio 中检查追踪](https://developer.android.com/studio/profile/jank-detection)。或者，你可以在 "Past Recordings" 窗格中选择它，按下 "Export recording"，然后在像 [Perfetto](https://perfetto.dev/) 这样的工具中打开它。

### 2. 读取追踪

在 Android Studio 或 Perfetto 中打开追踪后，你应该看到类似这样的内容：

![Example](/docs/assets/SystraceExample.png)

:::note 提示
使用 WASD 键进行平移和缩放。
:::

确切的用户界面可能有所不同，但下面的说明无论你使用什么工具都适用。

:::info 启用 VSync 高亮
选中屏幕右上角的此复选框以高亮显示 16ms 帧边界：

![Enable VSync Highlighting](/docs/assets/SystraceHighlightVSync.png)

你应该看到如上图所示的斑马纹。如果没有，尝试在不同的设备上进行分析：众所周知，Samsung 在显示 vsync 方面存在问题，而 Nexus 系列通常非常可靠。
:::

### 3. 查找你的进程

滚动直到看到包名（的一部分）。在这种情况下，我正在分析 `com.facebook.adsmanager`，由于内核中愚蠢的线程名称限制，它显示为 `book.adsmanager`。

在左侧，你将看到一组对应于右侧时间轴行的线程。出于我们的目的，有几个线程是我们关心的：UI 线程（具有你的包名或名称 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你在 Android 5+ 上运行，我们还关心 Render Thread。

- **UI Thread.** 这是标准 android measure/layout/draw 发生的地方。右侧的线程名称将是你的包名（在我的例子中是 book.adsmanager）或 UI Thread。你在此线程上看到的事件应该看起来像这样，并与 `Choreographer`、`traversals` 和 `DispatchUI` 有关：

  ![UI Thread Example](/docs/assets/SystraceUIThreadExample.png)

- **JS Thread.** 这是执行 JavaScript 的地方。线程名称将是 `mqt_js` 或 `<...>`，具体取决于设备上的内核配合程度。如果它没有名称，请查找诸如 `JSCall`、`Bridge.executeJSCall` 等内容来识别它：

  ![JS Thread Example](/docs/assets/SystraceJSThreadExample.png)

- **Native Modules Thread.** 这是执行原生模块调用（例如 `UIManager`）的地方。线程名称将是 `mqt_native_modules` 或 `<...>`。在后一种情况下识别它，请查找诸如 `NativeCall`、`callJavaModuleMethod` 和 `onBatchComplete` 等内容：

  ![Native Modules Thread Example](/docs/assets/SystraceNativeModulesThreadExample.png)

- **Bonus: Render Thread.** 如果你使用 Android L (5.0) 及更高版本，你的应用程序中还将有一个渲染线程。此线程生成用于绘制 UI 的实际 OpenGL 命令。线程名称将是 `RenderThread` 或 `<...>`。在后一种情况下识别它，请查找诸如 `DrawFrame` 和 `queueBuffer` 等内容：

  ![Render Thread Example](/docs/assets/SystraceRenderThreadExample.png)

## 识别罪魁祸首

流畅的动画应该看起来像下面这样：

![Smooth Animation](/docs/assets/SystraceWellBehaved.png)

每种颜色的变化都是一帧——请记住，为了显示一帧，我们所有的 UI 工作都需要在该 16ms 周期结束前完成。注意没有线程工作在接近帧边界的地方。像这样渲染的应用程序正在以 60 FPS 渲染。

但是，如果你注意到卡顿，你可能会看到类似这样的内容：

![Choppy Animation from JS](/docs/assets/SystraceBadJS.png)

注意 JS 线程几乎一直在执行，并且跨过了帧边界！此应用程序没有以 60 FPS 渲染。在这种情况下，**问题在于 JS**。

你也可能会看到类似这样的内容：

![Choppy Animation from UI](/docs/assets/SystraceBadUI.png)

在这种情况下，UI 和渲染线程是工作跨过帧边界的线程。我们试图在每一帧上渲染的 UI 需要完成太多的工作。在这种情况下，**问题在于正在渲染的原生视图**。

此时，你将拥有一些非常有用的信息来告知你的下一步。

## 解决 JavaScript 问题

如果你识别出 JS 问题，请在你执行的具体 JS 中寻找线索。在上述场景中，我们看到 `RCTEventEmitter` 每帧被调用多次。这是上面追踪中 JS 线程的放大图：

![Too much JS](/docs/assets/SystraceBadJS2.png)

这似乎不对。为什么它被调用得如此频繁？它们实际上是不同的事件吗？这些问题的答案可能取决于你的产品代码。很多时候，你会想要查看 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果你识别出原生 UI 问题，通常有两种情况：

1. 你试图每帧绘制的 UI 涉及太多的 GPU 工作，或
2. 你在动画/交互期间构建新的 UI（例如在滚动期间加载新内容）。

### 太多的 GPU 工作

在第一种情况下，你将看到 UI 线程和/或渲染线程看起来像这样的追踪：

![Overloaded GPU](/docs/assets/SystraceBadUI.png)

注意在 `DrawFrame` 中花费了大量时间并跨过了帧边界。这是等待 GPU 排空上一帧命令缓冲区的时间。

为了缓解这种情况，你应该：

- 调查对正在动画/变换的复杂静态内容使用 `renderToHardwareTextureAndroid`（例如 `Navigator` 滑动/alpha 动画）
- 确保你**没有**使用 `needsOffscreenAlphaCompositing`，默认情况下它是禁用的，因为它在大多数情况下会大大增加每帧的 GPU 负载。

### 在 UI 线程上创建新视图

在第二种情况下，你会看到更像这样的内容：

![Creating Views](/docs/assets/SystraceBadCreateUI.png)

注意首先 JS 线程思考了一会儿，然后你看到原生模块线程上做了一些工作，随后是在 UI 线程上进行昂贵的遍历。

除非你能够将创建新 UI 推迟到交互之后，或者能够简化你正在创建的 UI，否则没有快速的方法来缓解这种情况。react native 团队正在为此努力一个基础设施级别的解决方案，这将允许在主线程之外创建和配置新 UI，使交互能够继续流畅进行。

### 查找原生 CPU 热点

如果问题似乎出现在原生方面，你可以使用 [CPU 热点性能分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods) 来获取有关发生情况的更多详细信息。打开 Android Studio Profiler 面板并选择 "Find CPU Hotspots (Java/Kotlin Method Recording)"。

:::info 选择 Java/Kotlin 录制

确保你选择 "Find CPU Hotspots **(Java/Kotlin Recording)**" 而不是 "Find CPU Hotspots (Callstack Sample)"。它们有相似的图标但做不同的事情。
:::

执行交互并按下 "Stop recording"。录制是资源密集型的，所以保持交互简短。然后你可以在 Android Studio 中检查结果追踪，或者导出它并在在线工具如 [Firefox Profiler](https://profiler.firefox.com/) 中打开它。

与系统追踪不同，CPU 热点性能分析很慢，所以它不会给你准确的测量值。但是，它应该让你了解调用了哪些原生方法，以及在每一帧期间时间按比例花在哪里。
