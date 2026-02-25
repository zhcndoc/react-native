---
id: profiling
title: 性能分析
---

性能分析是分析应用性能、资源使用和行为的过程，以识别潜在的瓶颈或低效。利用性能分析工具非常值得，可以确保您的应用在不同设备和条件下平稳运行。

对于 iOS，Instruments 是一款非常宝贵的工具，而在 Android 上，您应该学习使用 [Android Studio Profiler](profiling.md#profiling-android-ui-performance-with-system-tracing)。

但首先，[**确保开发模式已关闭！**](performance.md#running-in-development-mode-devtrue)

## 使用系统跟踪分析 Android UI 性能

Android 支持超过 1 万种不同的手机，并且为了支持软件渲染而进行了通用化：框架架构以及需要适配众多硬件目标，遗憾的是这意味着相较于 iOS 你不能免费获得那么多性能优势。但有时，你仍然可以做一些优化——而且多数情况下卡顿根本不是原生代码的错！

调试卡顿的第一步是回答一个根本问题：每个 16ms 帧的时间究竟花在哪里。为此，我们将使用 [Android Studio 内置的系统跟踪分析器](https://developer.android.com/studio/profile)。

:::note
独立的 `systrace` 工具已从 Android platform-tools 中移除。请改用 Android Studio Profiler，它提供了相同功能且拥有更好的用户界面。
:::

### 1. 收集跟踪数据

首先，通过 USB 将出现卡顿现象的设备连接到计算机。在 Android Studio 中打开项目的 `android` 文件夹，右上角选择你的设备，并[以可分析（profileable）模式运行项目](https://developer.android.com/studio/profile#build-and-run)。

当你的应用以可分析形式构建并运行在设备上时，将应用操作到想要分析的导航/动画前的位置，在 Android Studio Profiler 面板中启动 ["捕获系统活动" 任务](https://developer.android.com/studio/profile#start-profiling)。

开始收集跟踪数据后，执行你关心的动画或交互。然后按“停止录制”。你现在可以[直接在 Android Studio 中查看跟踪](https://developer.android.com/studio/profile/jank-detection)。或者，也可以在“过去录制”面板中选择该文件，点击“导出录制”，并在诸如 [Perfetto](https://perfetto.dev/) 之类的工具中打开。

### 2. 读取跟踪数据

在 Android Studio 或 Perfetto 中打开跟踪后，应该能看到类似如下界面：

![示例](/docs/assets/SystraceExample.png)

:::note 提示
使用 WASD 键进行平移和缩放。
:::

具体界面可能有所不同，但以下说明对使用任何工具都适用。

:::info 启用 VSync 高亮
勾选屏幕右上角的复选框以高亮显示 16ms 帧边界：

![启用 VSync 高亮](/docs/assets/SystraceHighlightVSync.png)

你应该能看到如截图中所示的斑马条纹。如果没有，尝试换台设备采样：三星设备在显示 vsync 上已知存在问题，而 Nexus 系列一般比较可靠。
:::

### 3. 找到你的进程

滚动查看，直到看到你的包名（部分）为止。本例中我分析的是 `com.facebook.adsmanager`，由于内核线程名限制显示为 `book.adsmanager`。

左侧显示一组线程，右侧对应时间线排布。我们关注几个线程：UI 线程（显示包名或 UI Thread）、`mqt_js` 和 `mqt_native_modules`。如果你用的是 Android 5 及以上版本，还要关注 Render 线程。

- **UI 线程。** 标准的 Android 测量/布局/绘制都在这里执行。右侧线程名是你的包名（例中为 book.adsmanager）或“UI Thread”。该线程上的事件一般与 `Choreographer`、`traversals` 和 `DispatchUI` 相关：

  ![UI 线程示例](/docs/assets/SystraceUIThreadExample.png)

- **JS 线程。** JavaScript 代码执行所在的线程，名称通常为 `mqt_js` 或 `<...>`（取决内核合作程度）。无名称时，可以通过 `JSCall`、`Bridge.executeJSCall` 等识别：

  ![JS 线程示例](/docs/assets/SystraceJSThreadExample.png)

- **原生模块线程。** 这里执行原生模块调用（例如 `UIManager`）。线程名一般为 `mqt_native_modules` 或 `<...>`，后者可通过 `NativeCall`、`callJavaModuleMethod`、`onBatchComplete` 等识别：

  ![原生模块线程示例](/docs/assets/SystraceNativeModulesThreadExample.png)

- **额外：渲染线程。** Android 5.0（L）及以上还有渲染线程，负责生成实际用于绘制 UI 的 OpenGL 命令。名称为 `RenderThread` 或 `<...>`，后者可通过 `DrawFrame`、`queueBuffer` 等识别：

  ![渲染线程示例](/docs/assets/SystraceRenderThreadExample.png)

## 识别罪魁祸首

流畅动画应类似如下：

![流畅动画](/docs/assets/SystraceWellBehaved.png)

每种不同颜色代表一个帧——记住，为显示一帧，所有 UI 工作必须在 16ms 时限内完成。你会发现没有线程在帧边界附近工作。此时应用以 60 FPS 渲染。

如果观察到卡顿，可能会看到如下图：

![JS 导致卡顿动画](/docs/assets/SystraceBadJS.png)

注意 JS 线程几乎一直在执行，且跨越了帧边界！说明该应用未达到 60 FPS。问题 **在于 JS**。

你也可能看到类似这样：

![UI 导致卡顿动画](/docs/assets/SystraceBadUI.png)

此时 UI 线程和渲染线程的工作跨越了帧边界。意味着每帧渲染的 UI 需要过多工作。问题 **出在渲染的原生视图**。

此时，你已掌握了有用信息来指导后续步骤。

## 解决 JavaScript 问题

如果确认 JS 出了问题，查看具体执行的 JS 代码线索。上面示例中，`RCTEventEmitter` 在每帧多次调用。下面是该 JS 线程跟踪放大图：

![JS 代码过多](/docs/assets/SystraceBadJS2.png)

这很不正常。为何调用这么频繁？都是不同事件吗？这些问题的答案依赖你的产品代码。很多时候，你需要查看 [shouldComponentUpdate](https://react.dev/reference/react/Component#shouldcomponentupdate)。

## 解决原生 UI 问题

如果问题在原生 UI，一般有两种情况：

1. 每帧渲染的 UI 需要Gpu过多工作，或者
2. 在动画/交互过程中创建了新 UI（例如滚动时加载新内容）。

### Gpu 工作过量

第一种情况下，你会看到 UI 线程和/或渲染线程如下：

![Gpu 负载过重](/docs/assets/SystraceBadUI.png)

注意长时间的 `DrawFrame` 跨帧边界，这表示等待 GPU 清空上一帧的命令缓冲区。

应对措施：

- 对于复杂且静态但被动画/变换的内容（例如 `Navigator` 的滑动/透明度动画），考虑使用 `renderToHardwareTextureAndroid`。
- 确保你 **没有** 使用 `needsOffscreenAlphaCompositing`（默认关闭），因为它在大多数情况下极大增加了每帧 GPU 负载。

### UI 线程创建新视图

第二种情况下，可能类似下面这样：

![创建视图](/docs/assets/SystraceBadCreateUI.png)

注意先是 JS 线程短暂思考，然后原生模块线程工作，最后 UI 线程执行昂贵的遍历。

暂时没什么快速方法帮你缓解，除非你能推迟新 UI 的创建到交互结束后，或者简化你创建的 UI。React Native 团队正在开发一套基础设施级的解决方案，允许在主线程之外创建和配置新 UI，从而保持交互流畅。

### 查找原生 CPU 热点

如果问题疑似出在原生端，可使用[CPU 热点分析器](https://developer.android.com/studio/profile/record-java-kotlin-methods)获得更详细信息。打开 Android Studio Profiler 面板，选择“查找 CPU 热点（Java/Kotlin 方法记录）”。

:::info 选择 Java/Kotlin 记录

请确保选择“查找 CPU 热点 **（Java/Kotlin 记录）**”而非“查找 CPU 热点（调用栈采样）”。它们图标相似，但实现不同。
:::

执行交互后点击“停止录制”。录制过程资源消耗较大，交互尽量保持简短。录制结束后，你可以直接在 Android Studio 检查结果，或导出并用在线工具如 [Firefox Profiler](https://profiler.firefox.com/) 查看。

与系统跟踪不同，CPU 热点分析较慢，不会提供精确测量，但可以让你了解原生方法调用、各帧时间比例分布等情况。