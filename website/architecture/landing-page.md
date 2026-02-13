---
id: landing-page
title: 关于新架构
---

自 2018 年以来，React Native 团队一直在重新设计 React Native 的核心内部结构，以便开发者能够创造出更高质量的体验。截至 2024 年，这个版本的 React Native 已被验证可大规模使用，并且由 Meta 在生产应用中运行。

“_新架构_”一词既指新的框架架构，也指将其引入开源的相关工作。

自 [React Native 0.68](/blog/2022/03/30/version-068#opting-in-to-the-new-architecture) 版本起，新架构已经可以作为实验性功能进行选择性启用，且在随后的每个版本中持续得到了改进。团队现在正致力于将其作为 React Native 开源生态系统的默认体验。

## 为什么需要新架构？

经过多年使用 React Native 构建应用，团队发现了一些限制，这些限制阻碍开发者打造某些高水准的体验。这些限制是框架现有设计的根本性问题，因此新架构的开发是对 React Native 未来的一次投资。

新架构解锁了在旧架构中无法实现的功能和改进。

### 同步布局与副作用

构建自适应 UI 体验通常需要测量视图的大小和位置并调整布局。

目前，你会使用 [`onLayout`](/docs/view#onlayout) 事件来获取视图的布局信息并做出调整。然而，`onLayout` 回调内的状态更新可能会在上一次渲染后才生效。这意味着用户可能会看到初始布局渲染与响应布局测量之间的中间状态或视觉跳跃。

使用新架构，我们可以通过同步获取布局信息和合理调度更新，避免此类问题，确保用户看不到任何中间状态。

<details>
<summary>示例：渲染提示工具</summary>

通过测量和将提示工具放置在视图之上，我们可以展示同步渲染的优势。提示工具需要知道其目标视图的位置才能确定渲染位置。

在当前架构中，我们使用 `onLayout` 获取视图的测量值，然后根据视图的位置更新提示工具的位置。

```jsx
function ViewWithTooltip() {
  // ...

  // 获取布局信息并传递给 Tooltip 以定位自身
  const onLayout = React.useCallback(event => {
    targetRef.current?.measureInWindow((x, y, width, height) => {
      // 这个状态更新不保证在同一提交中完成
      // 导致 Tooltip 在重新定位时出现视觉“跳动”
      setTargetRect({x, y, width, height});
    });
  }, []);

  return (
    <>
      <View ref={targetRef} onLayout={onLayout}>
        <Text>Some content that renders a tooltip above</Text>
      </View>
      <Tooltip targetRect={targetRect} />
    </>
  );
}
```

使用新架构，我们可以使用 [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect) 在单次提交中同步测量并应用布局更新，避免视觉“跳动”。

```jsx
function ViewWithTooltip() {
  // ...

  useLayoutEffect(() => {
    // 在单个提交中完成测量和 `targetRect` 状态更新
    // 让 Tooltip 无需中间渲染即可定位自己
    targetRef.current?.measureInWindow((x, y, width, height) => {
      setTargetRect({x, y, width, height});
    });
  }, [setTargetRect]);

  return (
    <>
      <View ref={targetRef}>
        <Text>Some content that renders a tooltip above</Text>
      </View>
      <Tooltip targetRect={targetRect} />
    </>
  );
}
```

<div className="TwoColumns TwoFigures">
 <figure>
  <img src="/img/new-architecture/async-on-layout.gif" alt="一个视图在视口四角和中心移动，提示工具延迟于视图移动后渲染于其上方或下方。" />
  <figcaption>异步测量和渲染 Tooltip。 [查看代码](https://gist.github.com/lunaleaps/eabd653d9864082ac1d3772dac217ab9)。</figcaption>
</figure>
<figure>
  <img src="/img/new-architecture/sync-use-layout-effect.gif" alt="一个视图在视口四角和中心移动，提示工具与视图同步移动。" />
  <figcaption>同步测量和渲染 Tooltip。 [查看代码](https://gist.github.com/lunaleaps/148756563999c83220887757f2e549a3)。</figcaption>
</figure>
</div>

</details>

### 支持并发渲染器及新特性

新架构支持 [React 18](https://react.dev/blog/2022/03/29/react-v18) 及更高版本发布的并发渲染及特性。你现在可以在 React Native 代码中使用类似数据获取的 Suspense、Transitions 以及其他新的 React API，在 web 和原生 React 开发之间进一步统一代码库和概念。

并发渲染器还带来了开箱即用的改进，比如自动批处理，从而减少 React 中的重复渲染。

<details>
<summary>示例：自动批处理</summary>

使用新架构，你将获得 React 18 渲染器提供的自动批处理。

示例中，一个滑块用于指定渲染多少个瓦片。将滑块从 0 拖动至 1000 会触发一连串的状态更新和重渲染。

通过比较[相同代码](https://gist.github.com/lunaleaps/79bb6f263404b12ba57db78e5f6f28b2)在两种渲染器下的表现，你可以直观感受到新渲染器提供了更流畅的 UI，减少了中间 UI 更新。来自本地事件处理器（如这个本地滑块组件）的状态更新现已被批处理。

<div className="TwoColumns TwoFigures">
 <figure>
  <img src="/img/new-architecture/legacy-renderer.gif" alt="演示应用根据滑块输入渲染多个视图。滑块值从 0 调整到 1000，UI 慢慢追赶至渲染 1000 个视图。" />
  <figcaption>使用旧渲染器渲染频繁状态更新。</figcaption>
</figure>
<figure>
  <img src="/img/new-architecture/react18-renderer.gif" alt="演示应用根据滑块输入渲染多个视图。滑块值从 0 调整到 1000，UI 比前一个例子更快渲染至 1000 个视图，且中间状态更少。" />
  <figcaption>使用 React 18 渲染器渲染频繁状态更新。</figcaption>
</figure>
</div>
</details>

新的并发特性如 [Transitions](https://react.dev/reference/react/useTransition) 赋予你表达 UI 更新优先级的能力。将更新标记为低优先级意味着 React 可以“中断”该更新以处理优先级更高的更新，确保关键时刻的响应体验。

<details>
<summary>示例：使用 `startTransition`</summary>

我们可以在上个示例基础上展示，如何通过 transitions 中断正在进行的渲染以处理更近的状态更新。

我们用 `startTransition` 包裹瓦片数量的状态更新，表明渲染瓦片可以被中断。`startTransition` 同时提供一个 `isPending` 标志，告诉我们更新是否完成。

```jsx
function TileSlider({value, onValueChange}) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <View>
        <Text>
          Render {value} Tiles
        </Text>
        <ActivityIndicator animating={isPending} />
      </View>
      <Slider
        value={1}
        minimumValue={1}
        maximumValue={1000}
        step={1}
        onValueChange={newValue => {
          startTransition(() => {
            onValueChange(newValue);
          });
        }}
      />
    </>
  );
}

function ManyTiles() {
  const [value, setValue] = useState(1);
  const tiles = generateTileViews(value);
  return (
      <TileSlider onValueChange={setValue} value={value} />
      <View>
        {tiles}
      </View>
  )
}
```

你会发现，在频繁更新时，React 会渲染更少的中间状态，因为它在状态变得过时时就会放弃该渲染。相比之下，没有使用 transitions 时会渲染更多中间状态。两个示例都使用自动批处理，但 transitions 为开发者带来了更强的批处理能力。

<div className="TwoColumns TwoFigures">
<figure>
  <img src="/img/new-architecture/with-transitions.gif" alt="演示应用根据滑块输入批量渲染多个视图（瓦片）。滑块快速从 0 调整到 1000，渲染批次数较少。" />
  <figcaption>用 transitions 中断过时状态的渲染。[查看代码](https://gist.github.com/lunaleaps/eac391bf3fe4c85953cefeb74031bab0/revisions)。</figcaption>
</figure>
<figure>
  <img src="/img/new-architecture/without-transitions.gif" alt="演示应用根据滑块输入批量渲染多个视图（瓦片）。滑块快速从 0 调整到 1000，渲染批次数较多。" />
  <figcaption>未将渲染标记为 transition 的效果。[查看代码](https://gist.github.com/lunaleaps/eac391bf3fe4c85953cefeb74031bab0/revisions)。</figcaption>
</figure>
</div>
</details>

### 快速的 JavaScript/原生交互

新架构移除了 JavaScript 和原生代码间的[异步桥接](https://reactnative.dev/blog/2018/06/14/state-of-react-native-2018#architecture)，用 JavaScript 接口（JSI）替代。JSI 是一个接口，允许 JavaScript 持有 C++ 对象引用，反之亦然。有了内存引用，你可以直接调用方法，免去序列化开销。

JSI 使得流行的 React Native 摄像头库 [VisionCamera](https://github.com/mrousavy/react-native-vision-camera) 能够实时处理帧数据。典型的帧缓冲区大约 30 MB，这取决于帧率，每秒大约 2GB 数据。相比桥接的序列化成本，JSI 轻松应对如此大量的数据接口。JSI 还能暴露其他复杂的基于实例的类型，如数据库、图像、音频样本等。

新架构中 JSI 的采用，将这类序列化工作从所有原生与 JavaScript 交互中移除，包括初始化和重新渲染原生核心组件如 `View` 和 `Text`。你可以阅读我们关于新架构中渲染性能的[调查](https://github.com/reactwg/react-native-new-architecture/discussions/123)以及所做改进的基准测试。

## 启用新架构后我可以期待什么？

虽然新架构带来了上述功能和改进，但启用新架构后，你的应用或库在性能或用户体验上可能不会立即看到提升。

例如，你的代码可能需要重构以利用新功能，如同步布局副作用或并发特性。尽管 JSI 会减少 JavaScript 与原生内存之间的开销，但数据序列化可能并非你应用性能的瓶颈。

启用新架构即是选择走向 React Native 的未来。

团队正积极研究和开发新架构解锁的新能力。例如，围绕与 Web 的对齐也是 Meta 的一个主动探索方向，将会发布到 React Native 开源生态系统。

- [事件循环模型更新](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0744-well-defined-event-loop.md)
- [节点及布局 API](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0607-dom-traversal-and-layout-apis.md)
- [样式及布局符合性](https://github.com/facebook/yoga/releases/tag/v2.0.0)

你可以关注并参与我们专门的[讨论与提案](https://github.com/react-native-community/discussions-and-proposals/discussions/651)仓库。

## 我今天应该使用新架构吗？

从 0.76 版本起，新架构已在所有 React Native 项目中默认启用。

如果你发现有任何问题，请使用[此模板](https://github.com/facebook/react-native/issues/new?assignees=&labels=Needs%3A+Triage+%3Amag%3A%2CType%3A+New+Architecture&projects=&template=new_architecture_bug_report.yml)提交 issue。

如果出于任何原因你无法使用新架构，仍然可以选择关闭它：

### 安卓

1. 打开 `android/gradle.properties` 文件
2. 将 `newArchEnabled` 标志从 `true` 改为 `false`

```diff title="gradle.properties"
# 使用此属性启用新架构支持。
# 这将允许你在应用中使用 TurboModules 和 Fabric 渲染器。
# 如果要编写自定义 TurboModules/Fabric 组件或使用提供它们的库，
# 应开启该标志。
-newArchEnabled=true
+newArchEnabled=false
```

### iOS

1. 打开 `ios/Podfile` 文件
2. 在 Podfile 的主作用域下添加 `ENV['RCT_NEW_ARCH_ENABLED'] = '0'`（[参考模板 Podfile](https://github.com/react-native-community/template/blob/0.76-stable/template/ios/Podfile)）

```diff
+ ENV['RCT_NEW_ARCH_ENABLED'] = '0'
# 使用 node 解析 react_native_pods.rb 以便提升
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
```

3. 使用以下命令安装 CocoaPods 依赖：

```shell
bundle exec pod install
```
