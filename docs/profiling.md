---
id: profiling
title: 性能分析
---

性能分析是分析应用程序的性能、资源使用情况和行为，以识别潜在瓶颈或效率低下的过程。充分利用性能分析工具很有必要，以确保你的应用在不同设备和条件下都能流畅运行。

对于 iOS，Instruments 是一个不可或缺的工具；而在 Android 上，你应该学会使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，[**请确保开发模式已关闭！**](performance.md#running-in-development-mode-devtrue)。

## 使用系统跟踪分析 Android UI 性能

Android 支持 1 万多种不同的手机，并且为了兼容软件渲染而进行了通用化：框架架构以及需要跨众多硬件目标进行通用适配，这不幸意味着与 iOS 相比，你能“白拿”的东西更少。不过有时，你确实可以做一些改进——而且很多时候根本不是原生代码的错！

调试这种卡顿的第一步，是回答一个根本问题：每个 16ms 的帧时间里，时间到底花在了哪里。为此，我们将使用 Android Studio 内置的 [System Tracing 分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供相同功能，并具有更好的用户界面。
:::

### 1. 收集跟踪

首先，通过 USB 将你想要调查卡顿现象的设备连接到电脑。在 Android Studio 中打开项目的 `android` 文件夹，在右上角面板中选择你的设备，然后 [以可分析模式运行你的项目](https://developer.android.com/studio/profile#build-and-run)。

当你的应用以可分析模式构建并运行在设备上后，将应用切换到你要分析的导航/动画之前的那个位置，然后在 Android Studio Profiler 面板中启动 ["Capture System Activities" 任务](https://developer.android.com/studio/profile#start-profiling)。

一旦跟踪开始收集，执行你关心的动画或交互。然后按下 “Stop recording”。现在你可以 [直接在 Android Studio 中检查该跟踪](https://developer.android.com/studio/profile/jank-detection)。或者，你也可以在 “Past Recordings” 面板中选中它，点击 “Export recording”，并在类似 [Perfetto](https://perfetto.dev/) 的工具中打开它。

### 2. 读取跟踪

在 Android Studio 或 Perfetto 中打开跟踪后，你应该会看到类似这样的内容：

![Example](/docs/assets/SystraceExample.png)

:::note[提示]
使用 WASD 键进行平移和缩放。
:::

具体界面可能会有所不同，但下面的说明无论你使用哪种工具都适用。

:::info[启用 VSync 高亮显示]
勾选屏幕右上角的这个复选框，以高亮显示 16ms 的帧边界：

![Enable VSync Highlighting](/docs/assets/SystraceHighlightVSync.png)

你应该会看到如上截图所示的斑马条纹。如果没有，请尝试在不同设备上进行分析：据悉三星设备在显示 vsync 时存在问题，而 Nexus 系列通常比较可靠。
:::

### 3. 找到你的进程

滚动直到你看到包名的（部分）名称。在这个例子中，我分析的是 `com.facebook.adsmanager`，它因为内核中愚蠢的线程名长度限制而显示为 `book.adsmanager`。

在左侧，你会看到一组线程，它们对应右侧时间轴中的各行。为了我们的目的，有几个线程需要关注：UI 线程（其名称为你的包名或 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你运行的是 Android 5+，我们还需要关注 Render Thread。

- **UI Thread。** 这是标准 android 的 measure/layout/draw 发生的地方。右侧的线程名将是你的包名（在我的例子中是 book.adsmanager）或 UI Thread。你在这个线程上看到的事件应该类似这样，并且与 `Choreographer`、`traversals` 和 `DispatchUI` 有关：

  ![UI Thread Example](/docs/assets/SystraceUIThreadExample.png)

- **JS Thread。** 这是执行 JavaScript 的地方。线程名将是 `mqt_js` 或 `<...>`，具体取决于你设备上的内核有多“配合”。如果它没有名称，要识别它可以查看诸如 `JSCall`、`Bridge.executeJSCall` 等内容：

  ![JS Thread Example](/docs/assets/SystraceJSThreadExample.png)

- **Native Modules Thread。** 这是执行原生模块调用（例如 `UIManager`）的地方。线程名将是 `mqt_native_modules` 或 `<...>`。如果是后者，可以通过诸如 `NativeCall`、`callJavaModuleMethod` 和 `onBatchComplete` 等内容来识别它：

  ![Native Modules Thread Example](/docs/assets/SystraceNativeModulesThreadExample.png)

- **补充：Render Thread。** 如果你使用的是 Android L（5.0）及以上版本，你的应用中还会有一个渲染线程。这个线程会生成用于绘制 UI 的实际 OpenGL 命令。线程名将是 `RenderThread` 或 `<...>`。如果是后者，可以通过诸如 `DrawFrame` 和 `queueBuffer` 等内容来识别它：

  ![Render Thread Example](/docs/assets/SystraceRenderThreadExample.png)

## 找出元凶

一个流畅的动画看起来大致如下：

![Smooth Animation](/docs/assets/SystraceWellBehaved.png)

每种颜色的变化都代表一帧——记住，要显示一帧，我们所有的 UI 工作都需要在这 16ms 时间段结束前完成。注意，没有任何线程工作接近帧边界。像这样渲染的应用是在以 60 FPS 运行。

不过，如果你注意到卡顿，你可能会看到类似这样的情况：

![Choppy Animation from JS](/docs/assets/SystraceBadJS.png)

注意 JS 线程几乎一直在执行，而且跨越了帧边界！这个应用并不是在以 60 FPS 运行。在这种情况下，**问题出在 JS 中**。

你也可能会看到类似这样的情况：

![Choppy Animation from UI](/docs/assets/SystraceBadUI.png)

在这种情况下，UI 线程和渲染线程是那些跨越帧边界执行工作的线程。我们试图在每一帧渲染的 UI 需要完成太多工作。在这种情况下，**问题出在正在渲染的原生视图上**。

到这里，你已经获得了一些非常有用的信息，可以帮助你决定下一步怎么做。

## 解决 JavaScript 问题

如果你定位到的是 JS 问题，请在你执行的具体 JS 代码中寻找线索。在上面的场景中，我们看到 `RCTEventEmitter` 每帧被调用多次。下面是上方跟踪中 JS 线程的放大图：

![Too much JS](/docs/assets/SystraceBadJS2.png)

这看起来不对。为什么它会被这么频繁地调用？它们实际上是不同的事件吗？这些问题的答案大概率取决于你的产品代码。很多时候，你会想研究一下 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果你定位到的是原生 UI 问题，通常有两种情况：

1. 你试图在每一帧绘制的 UI 涉及 GPU 上过多的工作，或者
2. 你在动画/交互期间构建了新的 UI（例如在滚动过程中加载新内容）。

### GPU 工作过多

在第一种情况下，你会看到一段跟踪，其中 UI 线程和/或 Render Thread 看起来像这样：

![Overloaded GPU](/docs/assets/SystraceBadUI.png)

注意 `DrawFrame` 中花费了很长时间，并且跨越了帧边界。这段时间用于等待 GPU 清空上一帧的命令缓冲区。

为缓解这个问题，你应该：

- 考虑对正在被动画/变换的复杂静态内容使用 `renderToHardwareTextureAndroid`（例如 `Navigator` 的滑动/透明度动画）
- 确保你**没有**使用 `needsOffscreenAlphaCompositing`，它默认是禁用的，因为在大多数情况下它会显著增加 GPU 的每帧负载。

### 在 UI 线程上创建新视图

在第二种情况下，你会看到更像这样的内容：

![Creating Views](/docs/assets/SystraceBadCreateUI.png)

注意，首先 JS 线程思考了一会儿，然后你会看到 native modules 线程上完成了一些工作，接着 UI 线程上出现了一个代价很高的 traversal。

除非你能够将创建新 UI 的时机推迟到交互之后，或者你能够简化正在创建的 UI，否则没有快速的缓解办法。react native 团队正在为此开发一个基础设施层面的解决方案，它将允许在主线程之外创建和配置新 UI，从而使交互能够继续流畅进行。

### 查找原生 CPU 热点

如果问题看起来出在原生侧，你可以使用 [CPU 热点分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods) 来获取更多关于正在发生什么的细节。打开 Android Studio Profiler 面板并选择 “Find CPU Hotspots (Java/Kotlin Method Recording)”。

:::info[选择 Java/Kotlin 录制]

确保你选择的是 “Find CPU Hotspots **(Java/Kotlin Recording)**”，而不是 “Find CPU Hotspots (Callstack Sample)”。它们图标相似，但执行的操作不同。
:::

执行交互并按下 “Stop recording”。录制会占用较多资源，因此请保持交互时间较短。然后你可以在 Android Studio 中检查生成的跟踪，或者将其导出并在类似 [Firefox Profiler](https://profiler.firefox.com/) 的在线工具中打开。

与 System Trace 不同，CPU 热点分析速度较慢，因此不会给出准确的测量结果。不过，它应该能让你了解调用了哪些原生方法，以及每一帧中时间大致是如何分配的。
