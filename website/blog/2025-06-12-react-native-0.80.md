---
title: 'React Native 0.80 - React 19.1，JS API 变更，冻结旧架构及更多内容'
authors: [hezi, fabriziocucci, gabrieldonadel, chrfalch]
tags: [engineering]
date: 2025-06-12T16:01
---

# React Native 0.80 - React 19.1，JS API 变更，冻结旧架构及更多内容

今天我们很高兴发布 React Native 0.80 版本！

本次发布将 React Native 内置的 React 版本升级到最新的稳定版本：19.1.0。

我们还对 JS API 进行了系列稳定性改进：深度导入（deep imports）现在会触发警告，并且新增了一个可选的严格 TypeScript API，提供更准确且更安全的类型定义。

此外，React Native 的旧架构（Legacy Architecture）现已正式冻结，你将开始看到针对那些将在旧架构被完全废弃后失效的 API 的警告。

### 亮点

- [JavaScript 深度导入弃用](/blog/2025/06/12/react-native-0.80#javascript-deep-imports-deprecation)
- [旧架构冻结与警告](/blog/2025/06/12/react-native-0.80#legacy-architecture-freezing--warnings)
- [React 19.1.0](/blog/2025/06/12/react-native-0.80#react-1910)
- [实验性功能 - React Native iOS 依赖现在已预构建](/blog/2025/06/12/react-native-0.80#experimental---react-native-ios-dependencies-are-now-prebuilt)

<!--truncate-->

## 亮点

### JavaScript 深度导入弃用

本次发布中，我们着手改进和稳定 React Native 的公共 JavaScript API。第一步是更好地限定应用和框架可以导入的 API。为此，我们正式弃用 React Native 的深度导入（[参见 RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894)），并通过 ESLint 和 JS 控制台引入相关警告。

这些警告仅针对来自你项目源码中的导入，并且可以选择[关闭](/docs/strict-typescript-api)。不过请注意，我们计划在未来版本中移除 React Native 的深度导入，建议改用根路径导入。

```js
// 之前 - 从子路径导入
import {Alert} from 'react-native/Libraries/Alert/Alert';

// 现在 - 直接从 `react-native` 导入
import {Alert} from 'react-native';
```

部分 API 并未在根路径导出，且没有深度导入将无法使用。这是故意为之，以减少 React Native API 的整体暴露面。我们设立了开放的[反馈讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/893)收集用户问题，并将在接下来的两个 React Native 版本中与社区一起确定哪些 API 会继续导出。欢迎大家反馈！

你可以在专门的文章中了解更多变更内容：[迈向稳定的 JavaScript API](/blog/2025/06/12/moving-towards-a-stable-javascript-api)。

#### 可选启用的严格 TypeScript API

伴随着公共 API 导出的重新定义，0.80 版本新增了一套 `react-native` 包的 TypeScript 类型，称为严格 TypeScript API。

启用严格 TypeScript API 是我们未来稳定 JavaScript API 的预览版本。这些新类型具有以下特点：

1. **直接从源码生成** — 提升覆盖率和准确性，期待更强的兼容性保证。
2. **仅限于 React Native 索引文件** — 更明确地限定公共 API，确保内部文件改动不会破坏 API。

我们同时发布了现有类型，你可以根据需要选择迁移。而对于使用标准 React Native API 的应用，大多数情况下无需改动即可通过校验。我们强烈建议早期采用者和新建应用通过 `tsconfig.json` 文件启用该功能。

在社区准备好后，严格 TypeScript API 将与深度导入移除同步，成为默认 API。

更多详情请见专文：[迈向稳定的 JavaScript API](/blog/2025/06/12/moving-towards-a-stable-javascript-api)。

### 旧架构冻结与警告

React Native 的新架构自 [0.76 版本起默认启用](/blog/2024/10/23/the-new-architecture-is-here)，我们也看到来自项目和工具的[成功案例](https://blog.kraken.com/product/engineering/how-kraken-fixed-performance-issues-via-incremental-adoption-of-the-react-native-new-architecture)。

[我们最近宣布](https://github.com/reactwg/react-native-new-architecture/discussions/290)，旧架构现已被视为冻结状态。我们将不再在旧架构上开发新的修复或功能，也不会在发布时对其进行测试。

为方便迁移，仍允许用户在遇到 bug 或回归时选择不使用新架构。

然而，同时维护两个架构带来了巨大的挑战，影响运行时性能、应用体积以及代码维护。

因此，我们最终将不得不在未来某个时间点废弃旧架构。

0.80 中增加了一系列在 React Native 开发者工具中弹出的警告，用以提示你当前使用的 API 在新架构下将无法使用。

建议不要忽视这些警告，考虑迁移你的应用和库到新架构以迎接未来。

![旧架构警告](../static/blog/assets/0.80-legacy-arch-warnings.png)

你可以在我们最近于 App.js 会议上分享的演讲“旧架构之后：新架构的未来”中了解更多内容：[观看视频](https://www.youtube.com/live/K2JTTKpptGs?si=tRkT535f0GzguVGt&t=9011)。

### React 19.1.0

本次 React Native 发布随附最新稳定版 React：19.1.0。

你可以在[发行说明](https://github.com/facebook/react/releases/tag/v19.1.0)中阅读 React 19.1.0 引入的新功能和 bug 修复详情。

:::warning

React 19.1.0 一个重要新特性是 owner stacks（所有者栈）的实现和改进。这是一个仅开发环境使用的功能，帮助你识别具体哪个组件导致了错误。

我们知晓当在 React Native 中使用默认启用的 `@babel/plugin-transform-function-name` Babel 插件时，owner stacks 尚未表现正常。我们计划在未来的 React Native 版本中发布修复。

:::

### 实验性功能 - React Native iOS 依赖现在已预构建

如果你构建 React Native iOS 应用，可能注意到首次原生构建需要花费较长时间：几分钟甚至更久，尤其在旧设备上。这是因为需要编译完整的 React Native iOS 代码及其所有依赖。

过去数周，我们尝试预构建部分 React Native iOS 核心模块，类似于 Android 的做法，以减少首次运行 React Native 应用时的构建时间。

React Native 0.80 是首个支持 React Native iOS 依赖部分预构建的版本，能帮助缩短构建时间。

在发布流程中，我们生成了一个名为 `ReactNativeDependencies.xcframework` 的 XCFramework，其为 React Native 依赖的第三方库的预构建版本。

根据我们在 M4 设备上的基准测试，启用该预构建后，iOS 构建速度大约提升了 12%。

我们还观察到不少用户反馈的构建问题源于 React Native 第三方依赖（如 [#39568](https://github.com/facebook/react-native/issues/39568)），
预构建第三方依赖有助于解决这类构建问题。

请注意，这次预构建并非覆盖整个 React Native，而仅针对 Meta 并不直接控制的库，如 Folly 和 GLog。

未来版本中，我们也计划预构建剩余的 React Native 核心。

#### 如何使用

该功能仍属实验阶段，默认未启用。

想要使用，可以通过添加环境变量 `RCT_USE_RN_DEP` 来安装 pod：

```bash
RCT_USE_RN_DEP=1 bundle exec pod install
```

或者，为了让项目中所有开发者都使用该功能，可以修改 Podfile 如下：

```diff
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

+ENV['RCT_USE_RN_DEP'] = '1'

target 'HelloWorld' do
  config = use_native_modules!
```

如果预构建功能导致任何问题，请务必在 [这个讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/912)反馈。我们承诺会关注问题，确保该功能对应用使用透明。

## 其他变更

### Android - 借助 IPO 缩小 APK 大小

本次发布中，我们对所有使用 React Native 构建的 Android 应用进行了显著的体积优化。自 0.80 起，我们为 React Native 和 Hermes 构建启用了[跨过程优化（Interprocedural Optimization，IPO）](https://en.wikipedia.org/wiki/Interprocedural_optimization)。

这带来了约 1MB 的体积缩减。

![Android APK 大小对比](../static/blog/assets/0.80-android-apk-size.png)

升级到 0.80 后，你就能享受这次大小优化，无需对项目做额外更改。

### 新建应用界面重新设计

如果你不用 Expo，而使用 Community CLI 和模板，本版本将新建应用界面迁移到了一个独立包 [@react-native/new-app-screen](https://www.npmjs.com/package/@react-native/new-app-screen)，并进行了全新设计。

这减少了通过社区模板创建新应用时的初始代码样板，也提高了大屏幕下的显示体验。

![新建应用界面重新设计](../static/blog/assets/0.80-new-community-template-landing.jpg)

### 关于 JSC 社区支持的通知

React Native 0.80 是最后一个官方支持 JSC 的版本。未来 JSC 支持将通过社区维护的包 `@react-native-community/javascriptcore` 提供。

如果你错过了相关公告，可以在这里了解详情：[/blog/2025/04/08/react-native-0.79#jsc-moving-to-community-package](/blog/2025/04/08/react-native-0.79#jsc-moving-to-community-package)

## 破坏性变更

### 在主包中新增 `"exports"` 字段

作为 JS 稳定 API 改动的一部分，我们在 `react-native` 的 `package.json` 中增加了 [`"exports"` 字段](https://nodejs.org/api/packages.html#package-entry-points)。

在 0.80 版本中，该映射仍默认暴露 **所有 JavaScript 子路径**，因此不会造成较大的破坏性变更。但这可能会微妙地影响模块解析方式：

- 在 Metro 打包器中，[平台特定扩展名](https://metrobundler.dev/docs/package-exports#replacing-platform-specific-extensions)不会自动对 `"exports"` 匹配进行扩展。我们提供了一些 shim 模块来兼容 ([#50426](https://github.com/facebook/react-native/pull/50426))。
- 在 Jest 中，深度导入的模拟能力可能受影响，可能需要更新测试。

### 其他破坏性变更

以下为我们怀疑可能对你的产品代码产生轻微影响的其他变更，值得留意：

### JS

- 我们将 `eslint-plugin-react-hooks` 从 v4.6.0 升级到 v5.2.0（完整[更新日志](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md)）。`react-hooks` 相关的 ESLint 规则可能新增错误提示，你需要修复或抑制这些警告。

### Android

- 本版本升级了 React Native 内置的 Kotlin 版本至 2.1.20。Kotlin 2.1 引入了一些语言预览新特性，你可以开始在你的模块/组件中使用。详细见 [官方发布说明](https://kotlinlang.org/docs/whatsnew21.html)。
- 删除了 `StandardCharsets` 类，该类自 0.73 已弃用。请改用 `java.nio.charset.StandardCharsets` 类。
- 多个类已被标记为内部类，不属于公共 API，禁止访问。我们已通知相关库或提交过补丁：
  - `com.facebook.react.fabric.StateWrapperImpl`
  - `com.facebook.react.modules.core.ChoreographerCompat`
  - `com.facebook.react.modules.common.ModuleDataCleaner`
- 我们将多个类由 Java 迁移为 Kotlin。若你使用了这些类，部分参数的可空性与类型可能改变，需要调整代码：
  - `com.facebook.react.devsupport` 包内所有类
  - `com.facebook.react.bridge.ColorPropConverter`
  - `com.facebook.react.views.textinput.ReactEditText`
  - `com.facebook.react.views.textinput.ReactTextInputManager`

### iOS

- 删除了 RCTUtils.h 中的 `RCTFloorPixelValue` 字段 —— 该方法未被 React Native 使用，故已移除。

更多细小的破坏性变更请参考 [0.80 版本 CHANGELOG](https://github.com/facebook/react-native/blob/main/CHANGELOG.md#v0800)。

## 致谢

React Native 0.80 包含了 127 位贡献者的共计超过 1167 次提交。感谢大家的辛勤付出！

特别感谢在本次发布中贡献显著工作的社区成员：

- [Christian Falch](https://github.com/chrfalch) 负责 React Native 依赖 iOS 预构建的工作
- [Iwo Plaza](https://x.com/iwoplaza)、[Jakub Piasecki](https://x.com/breskin67)、[Dawid Małecki](https://github.com/coado) 负责严格 TypeScript API 的开发

此外，我们还感谢以下作者为发布文档撰写贡献：

- [Riccardo Cipolleschi](https://github.com/cipolleschi) 负责 iOS 预构建部分
- [Alex Hunt](https://x.com/huntie) 负责深度导入弃用、严格 TypeScript API、以及新建应用界面重新设计部分
- [Nicola Corti](https://x.com/cortinico) 负责旧架构冻结与警告部分

## 升级到 0.80

请使用 [React Native 升级助手](https://react-native-community.github.io/upgrade-helper/) 查看项目中 React Native 版本更新的代码变更，同时参考官方升级文档。

创建新项目：

如果你使用 Expo，React Native 0.80 将在 Expo SDK 预览版中支持。关于如何在 Expo 中使用 React Native 0.80 的指南请见 [专门博客](https://expo.dev/changelog/react-native-80)。

:::info

0.80 现为 React Native 的最新稳定版本，0.77.x 版本已不再受支持。更多信息请参阅 React Native 支持策略。我们计划近期发布 0.77 的最终终止支持更新。

:::
