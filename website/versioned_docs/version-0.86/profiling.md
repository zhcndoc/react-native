---
id: profiling
title: 性能分析
---

性能分析是分析应用程序的性能、资源使用情况和行为，以识别潜在瓶颈或低效之处的过程。值得使用性能分析工具来确保你的应用在不同设备和条件下都能流畅运行。

对于 iOS，Instruments 是一个不可或缺的工具；而在 Android 上，你应该学会使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，先 [**确保开发模式已关闭！**](performance.md#running-in-development-mode-devtrue)。

## 使用系统跟踪分析 Android UI 性能

Android 支持 1 万多种不同的手机，并且为了兼容软件渲染而进行了泛化：框架架构以及需要跨众多硬件目标进行泛化，这不幸意味着与 iOS 相比，你能“免费”获得的优化更少。但有时，确实有些地方你可以改进——而且很多时候根本不是原生代码的错！

调试这种卡顿的第一步，是回答一个根本问题：在每个 16ms 的帧时间里，你的时间都花在了哪里。为此，我们将使用 Android Studio 中内置的 [系统跟踪分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供相同的功能，并具有更好的用户界面。
:::

### 1. 收集跟踪

首先，通过 USB 将你想要调查卡顿问题的设备连接到电脑。在 Android Studio 中打开项目的 `android` 文件夹，在右上角面板中选择你的设备，然后 [以可分析配置运行你的项目](https://developer.android.com/studio/profile#build-and-run)。

当你的应用以可分析配置构建并运行在设备上后，将应用切换到你想要分析的导航/动画开始之前的状态，然后在 Android Studio Profiler 面板中启动 ["Capture System Activities" 任务](https://developer.android.com/studio/profile#start-profiling)。

一旦跟踪开始采集，就执行你关心的动画或交互。然后点击“停止录制”。现在你可以直接在 [Android Studio 中检查这份跟踪](https://developer.android.com/studio/profile/jank-detection)。或者，你也可以在“Past Recordings”面板中选中它，点击“Export recording”，并在类似 [Perfetto](https://perfetto.dev/) 的工具中打开它。

### 2. 阅读跟踪

在 Android Studio 或 Perfetto 中打开跟踪后，你应该会看到类似这样的内容：

![示例](/docs/assets/SystraceExample.png)

:::note[提示]
使用 WASD 键进行平移和缩放。
:::

具体的界面可能会不同，但下面的说明无论你使用哪种工具都适用。

:::info[启用 VSync 高亮]
勾选屏幕右上角的这个复选框，以高亮显示 16ms 的帧边界：

![启用 VSync 高亮](/docs/assets/SystraceHighlightVSync.png)

你应该能看到如上截图所示的斑马条纹。如果看不到，请尝试在不同设备上进行性能分析：据说三星设备在显示 vsync 时存在问题，而 Nexus 系列通常比较可靠。
:::

### 3. 找到你的进程

向下滚动，直到你看到你的包名（的一部分）。在这个例子中，我正在分析 `com.facebook.adsmanager`，由于内核中愚蠢的线程名长度限制，它显示为 `book.adsmanager`。

在左侧，你会看到一组线程，它们对应右侧时间线中的各行。对我们的目的而言，有几个线程需要关注：UI 线程（名称为你的包名或 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你运行在 Android 5+，我们还需要关注 Render Thread。

- **UI 线程。** 标准的 android measure/layout/draw 都发生在这里。右侧的线程名称将是你的包名（在我的例子中是 book.adsmanager）或者 UI Thread。你在这个线程上看到的事件应该类似这样，并且与 `Choreographer`、`traversals` 和 `DispatchUI` 有关：

  ![UI 线程示例](/docs/assets/SystraceUIThreadExample.png)

- **JS 线程。** JavaScript 在这里执行。线程名称要么是 `mqt_js`，要么是 `<...>`，这取决于你设备上的内核配合程度。如果它没有名字，要识别它可以看诸如 `JSCall`、`Bridge.executeJSCall` 等内容：

  ![JS 线程示例](/docs/assets/SystraceJSThreadExample.png)

- **原生模块线程。** 原生模块调用（例如 `UIManager`）在这里执行。线程名称要么是 `mqt_native_modules`，要么是 `<...>`。如果是后者，要识别它可以看诸如 `NativeCall`、`callJavaModuleMethod` 和 `onBatchComplete` 等内容：

  ![原生模块线程示例](/docs/assets/SystraceNativeModulesThreadExample.png)

- **额外：Render Thread。** 如果你使用的是 Android L（5.0）及以上版本，你的应用中还会有一个渲染线程。这个线程生成用于绘制 UI 的实际 OpenGL 命令。线程名称要么是 `RenderThread`，要么是 `<...>`。如果是后者，要识别它可以看诸如 `DrawFrame` 和 `queueBuffer` 等内容：

  ![Render Thread 示例](/docs/assets/SystraceRenderThreadExample.png)

## 识别问题根源

一个流畅的动画看起来应该像这样：

![流畅动画](/docs/assets/SystraceWellBehaved.png)

每一种颜色的变化都是一帧——记住，为了显示一帧，我们所有的 UI 工作都需要在这 16ms 周期结束前完成。注意，没有任何线程在接近帧边界处工作。这样渲染的应用是在以 60 FPS 运行。

然而，如果你注意到卡顿，你可能会看到类似这样的情况：

![来自 JS 的卡顿动画](/docs/assets/SystraceBadJS.png)

注意 JS 线程几乎一直在执行，并且跨越了帧边界！这个应用并没有以 60 FPS 渲染。在这种情况下，**问题出在 JS 上**。

你也可能会看到类似这样的情况：

![来自 UI 的卡顿动画](/docs/assets/SystraceBadUI.png)

在这种情况下，UI 线程和渲染线程是那些跨越帧边界工作的线程。我们试图在每一帧渲染的 UI 需要完成太多工作。在这种情况下，**问题出在正在渲染的原生视图上**。

到这里，你已经获得了非常有帮助的信息，可以指导你的下一步操作。

## 解决 JavaScript 问题

如果你确认是 JS 问题，请在你正在执行的具体 JS 代码中寻找线索。在上面的场景中，我们看到 `RCTEventEmitter` 每一帧被调用多次。下面是上面跟踪中 JS 线程的放大图：

![过多的 JS](/docs/assets/SystraceBadJS2.png)

这看起来不太对。为什么它会如此频繁地被调用？这些调用实际上是不同的事件吗？这些问题的答案可能取决于你的产品代码。很多时候，你还需要查看 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果你确认是原生 UI 问题，通常有两种情况：

1. 你试图在每一帧绘制的 UI 涉及 GPU 上过多的工作，或者
2. 你正在动画/交互过程中构建新的 UI（例如在滚动过程中加载新内容）。

### GPU 工作过多

在第一种情况下，你会看到一份跟踪，其中 UI 线程和/或 Render Thread 看起来像这样：

![GPU 过载](/docs/assets/SystraceBadUI.png)

注意 `DrawFrame` 中花费的很长时间跨越了帧边界。这段时间是在等待 GPU 清空上一帧的命令缓冲区。

为减轻这种情况，你应该：

- 调查是否可以对正在被动画/变换的复杂静态内容使用 `renderToHardwareTextureAndroid`（例如 `Navigator` 的滑动/透明度动画）
- 确保你**没有**使用 `needsOffscreenAlphaCompositing`，因为它默认是禁用的，并且在大多数情况下会显著增加每帧在 GPU 上的负载。

### 在 UI 线程上创建新视图

在第二种情况下，你会看到更像这样的内容：

![创建视图](/docs/assets/SystraceBadCreateUI.png)

注意，首先是 JS 线程思考了一会儿，然后你会看到原生模块线程上完成了一些工作，接着 UI 线程上出现了代价高昂的遍历。

除非你能够将新 UI 的创建推迟到交互之后，或者能够简化你正在创建的 UI，否则没有快速的缓解办法。react native 团队正在为此开发一个基础设施级别的解决方案，它将允许在主线程之外创建和配置新 UI，从而让交互能够流畅继续。

### 查找原生 CPU 热点

如果问题看起来出在原生侧，你可以使用 [CPU 热点分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods) 来获取关于正在发生什么的更多细节。打开 Android Studio Profiler 面板，并选择“Find CPU Hotspots (Java/Kotlin Method Recording)”。

:::info[选择 Java/Kotlin 录制]

确保你选择的是“Find CPU Hotspots **(Java/Kotlin Recording)**”，而不是“Find CPU Hotspots (Callstack Sample)”。它们的图标相似，但执行的事情不同。
:::

执行这些交互并点击“停止录制”。录制会占用较多资源，所以请保持交互尽量简短。然后你可以在 Android Studio 中检查生成的跟踪，或者将其导出并在类似 [Firefox Profiler](https://profiler.firefox.com/) 的在线工具中打开。

与系统跟踪不同，CPU 热点分析速度较慢，因此无法给出准确的测量结果。不过，它应该能让你了解正在调用哪些原生方法，以及每一帧中时间大致是如何分配的。
