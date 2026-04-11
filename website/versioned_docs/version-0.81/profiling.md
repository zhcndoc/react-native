---
id: profiling
title: 性能分析
---

性能分析（Profiling）是分析应用程序的性能、资源使用和行为以识别潜在瓶颈或低效之处的问题。值得利用性能分析工具来确保你的应用在不同设备和条件下都能流畅运行。

对于 iOS，Instruments 是一个宝贵的工具，而在 Android 上，你应该学习使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，[**确保开发模式（Development Mode）已关闭！**](performance.md#running-in-development-mode-devtrue)。

## 使用系统追踪分析 Android UI 性能

Android 支持 10k+ 种不同的手机，并且泛化以支持软件渲染：框架架构和需要在许多硬件目标上进行泛化的需求，不幸意味着相对于 iOS，你获得的免费优化更少。但有时，有些事情是可以改进的——而且很多时候根本不是原生代码的错！

调试这种卡顿的第一步是回答一个基本问题：在每个 16ms 帧期间，你的时间花在哪里了。为此，我们将使用 [Android Studio 中内置的系统追踪性能分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供了相同的功能且用户界面更好。
:::

### 1. 收集追踪记录

首先，通过 USB 将表现出你想要调查的卡顿现象的设备连接到你的计算机。在 Android Studio 中打开项目的 `android` 文件夹，在右上角窗格中选择你的设备，并 [以可分析模式运行你的项目](https://developer.android.com/studio/profile#build-and-run)。

当你的应用构建为可分析模式并在设备上运行时，将应用引导至你想要分析的导航/动画之前的状态，然后在 Android Studio Profiler 窗格中启动 ["捕获系统活动" 任务](https://developer.android.com/studio/profile#start-profiling)。

一旦追踪开始收集，执行你关心的动画或交互。然后按下 "停止记录"。你现在可以 [直接在 Android Studio 中检查追踪记录](https://developer.android.com/studio/profile/jank-detection)。或者，你可以在 "Past Recordings" 窗格中选择它，按下 "导出记录"，然后在 [Perfetto](https://perfetto.dev/) 等工具中打开它。

### 2. 阅读追踪记录

在 Android Studio 或 Perfetto 中打开追踪记录后，你应该看到类似这样的内容：

![示例](/docs/assets/SystraceExample.png)

:::note 提示
使用 WASD 键进行平移和缩放。
:::

具体的 UI 可能有所不同，但下面的说明适用于你使用的任何工具。

:::info 启用 VSync 高亮
选中屏幕右上角的此复选框以高亮显示 16ms 帧边界：

![启用 VSync 高亮](/docs/assets/SystraceHighlightVSync.png)

你应该看到如上图所示的斑马纹。如果没有，尝试在不同的设备上进行分析：众所周知三星设备在显示 vsync 方面存在问题，而 Nexus 系列通常非常可靠。
:::

### 3. 查找你的进程

滚动直到看到你的包名（的一部分）。在这种情况下，我正在分析 `com.facebook.adsmanager`，由于内核中愚蠢的线程名称限制，它显示为 `book.adsmanager`。

在左侧，你将看到一组对应于右侧时间轴行的线程。出于我们的目的，有几个线程是我们关心的：UI 线程（具有你的包名或名称 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你在 Android 5+ 上运行，我们还关心渲染线程。

- **UI 线程。** 这是标准 android measure/layout/draw 发生的地方。右侧的线程名称将是你的包名（在我的情况下是 book.adsmanager）或 UI Thread。你在此线程上看到的事件应该看起来像这样，并与 `Choreographer`、`traversals` 和 `DispatchUI` 有关：

  ![UI 线程示例](/docs/assets/SystraceUIThreadExample.png)

- **JS 线程。** 这是执行 JavaScript 的地方。线程名称将是 `mqt_js` 或 `<...>`，具体取决于你设备上的内核配合程度。如果它没有名称，请查找诸如 `JSCall`、`Bridge.executeJSCall` 等内容来识别它：

  ![JS 线程示例](/docs/assets/SystraceJSThreadExample.png)

- **原生模块线程。** 这是执行原生模块调用（例如 `UIManager`）的地方。线程名称将是 `mqt_native_modules` 或 `<...>`。在后一种情况下识别它，请查找诸如 `NativeCall`、`callJavaModuleMethod` 和 `onBatchComplete` 等内容：

  ![原生模块线程示例](/docs/assets/SystraceNativeModulesThreadExample.png)

- ** bonus: 渲染线程。** 如果你使用的是 Android L (5.0) 及更高版本，你的应用中还将有一个渲染线程。此线程生成用于绘制 UI 的实际 OpenGL 命令。线程名称将是 `RenderThread` 或 `<...>`。在后一种情况下识别它，请查找诸如 `DrawFrame` 和 `queueBuffer` 等内容：

  ![渲染线程示例](/docs/assets/SystraceRenderThreadExample.png)

## 识别罪魁祸首

流畅的动画应该看起来像下面这样：

![流畅动画](/docs/assets/SystraceWellBehaved.png)

每种颜色的变化都是一帧——请记住，为了显示一帧，我们所有的 UI 工作都需要在该 16ms 周期结束前完成。注意没有线程工作在接近帧边界的地方。像这样渲染的应用程序是以 60 FPS 渲染的。

但是，如果你注意到卡顿，你可能会看到类似这样的内容：

![JS 导致的卡顿动画](/docs/assets/SystraceBadJS.png)

注意 JS 线程几乎一直在执行，并且跨过了帧边界！此应用的渲染速度不是 60 FPS。在这种情况下，**问题在于 JS**。

你可能还会看到类似这样的内容：

![UI 导致的卡顿动画](/docs/assets/SystraceBadUI.png)

在这种情况下，UI 和渲染线程是工作跨过帧边界的线程。我们试图在每一帧上渲染的 UI 需要完成太多的工作。在这种情况下，**问题在于正在渲染的原生视图**。

此时，你将拥有一些非常有用的信息来指导你的下一步。

## 解决 JavaScript 问题

如果你识别出的是 JS 问题，请在你执行的具体 JS 中寻找线索。在上述场景中，我们看到 `RCTEventEmitter` 每帧被调用多次。这是上面追踪记录中 JS 线程的放大图：

![过多 JS](/docs/assets/SystraceBadJS2.png)

这似乎不对。为什么它被调用得如此频繁？它们实际上是不同的事件吗？这些问题的答案可能取决于你的产品代码。很多时候，你想要查看 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果你识别出的是原生 UI 问题，通常有两种情况：

1. 你试图每帧绘制的 UI 涉及过多的 GPU 工作，或
2. 你在动画/交互期间构建新的 UI（例如在滚动期间加载新内容）。

### 过多的 GPU 工作

在第一种情况下，你将看到 UI 线程和/或渲染线程看起来像这样：

![GPU 过载](/docs/assets/SystraceBadUI.png)

注意 `DrawFrame` 中花费了大量时间并跨过了帧边界。这是等待 GPU 排空上一帧命令缓冲区的时间。

为了缓解这种情况，你应该：

- 调查对于正在动画/变换的复杂静态内容（例如 `Navigator` 滑动/透明度动画）使用 `renderToHardwareTextureAndroid`
- 确保你**没有**使用 `needsOffscreenAlphaCompositing`，默认情况下它是禁用的，因为它在大多数情况下会大大增加每帧的 GPU 负载。

### 在 UI 线程上创建新视图

在第二种情况下，你会看到更像这样的内容：

![创建视图](/docs/assets/SystraceBadCreateUI.png)

注意首先 JS 线程思考了一会儿，然后你看到原生模块线程上做了一些工作， followed by 在 UI 线程上进行昂贵的遍历。

除非你能够将创建新 UI 推迟到交互之后，或者能够简化你正在创建的 UI，否则没有快速的方法来缓解这种情况。React Native 团队正在为此开发一个基础设施级别的解决方案，该解决方案将允许在主线程之外创建和配置新 UI，从而使交互能够流畅继续。

### 查找原生 CPU 热点

如果问题似乎出在原生方面，你可以使用 [CPU 热点性能分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods) 来获取有关发生情况的更多详细信息。打开 Android Studio Profiler 面板并选择 "查找 CPU 热点 (Java/Kotlin 方法记录)"。

:::info 选择 Java/Kotlin 记录

确保你选择 "查找 CPU 热点 **(Java/Kotlin 记录)**" 而不是 "查找 CPU 热点 (调用栈采样)"。它们有相似的图标但做不同的事情。
:::

执行交互并按下 "停止记录"。记录是资源密集型的，因此保持交互简短。然后你可以在 Android Studio 中检查结果追踪记录，或者导出它并在在线工具（如 [Firefox Profiler](https://profiler.firefox.com/)）中打开它。

与系统追踪不同，CPU 热点性能分析很慢，因此它不会给你准确的测量值。但是，它应该让你了解调用了哪些原生方法，以及在每帧期间时间按比例花在哪里。
