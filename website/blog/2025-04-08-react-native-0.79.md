---
title: 'React Native 0.79 - 更快的工具链和更多功能'
authors: [alanjhughes, shubham, fabriziocucci, cortinico]
tags: [engineering]
date: 2025-04-08
---

# React Native 0.79 - 更快的启动速度，更快的工具链和更多优化

今天我们很高兴发布 React Native 0.79！

该版本在多个方面带来了性能提升，并修复了若干问题。首先，得益于延迟哈希，Metro 启动速度更快，并且对 package exports 提供了稳定支持。Android 启动时间也将因为 JS Bundle 压缩方式的改变等诸多优化而得到提升。

### 亮点

- [Metro 新特性](/blog/2025/04/08/react-native-0.79#metro-faster-startup-and-package-exports-support)
- [JSC 迁移至社区包](/blog/2025/04/08/react-native-0.79#jsc-moving-to-community-package)
- [iOS：Swift 兼容的原生模块注册](/blog/2025/04/08/react-native-0.79#ios-swift-compatible-native-modules-registration)
- [Android：更快的应用启动](/blog/2025/04/08/react-native-0.79#android-faster-app-startup)
- [移除远程 JS 调试](/blog/2025/04/08/react-native-0.79#removal-of-remote-js-debugging)

<!--truncate-->

## 亮点详解

### Metro：更快的启动和 package exports 支持

本次发布包含了 [Metro 0.82](https://github.com/facebook/metro/releases/tag/v0.82.0) 版本。该版本引入了延迟哈希技术，提升了首次执行 `yarn start` 的速度，通常提高3倍以上（大型项目和 monorepos 中提升更明显），为日常开发体验与 CI 构建带来加速。

![metro 启动速度对比](../static/blog/assets/0.79-metro-startup-comparison.gif)

另外，在 Metro 0.82 中，我们将 `package.json` 中 `"exports"` 和 `"imports"` 字段解析提升为稳定功能。`"exports"` 功能于 [React Native 0.72](/blog/2023/06/21/package-exports-support) 引入，`"imports"` 支持为社区贡献，这两个字段将在 React Native 0.79 所有项目中默认启用。

这提升了与现代 npm 依赖的兼容性，并开辟了符合标准的项目组织方案。

:::warning 破坏性变更

虽然我们在社区中已经对 `package.json` 的 `"exports"` 功能进行了较长时间的测试，但该切换可能对部分包和项目配置造成破坏性变更。

我们特别注意到用户反馈中，一些流行包（如 Firebase 和 AWS Amplify）存在兼容问题，正在努力与相关方修复。

如遇问题：

- 请升级至 Metro [0.81.5 热修复版本](https://github.com/facebook/metro/releases/tag/v0.81.5)，或通过设置 [`resolver.unstable_enablePackageExports = false`](https://metrobundler.dev/docs/configuration/#unstable_enablepackageexports-experimental) 来禁用该功能。
- 更多受影响的包及后续更新，请参考 [expo/expo#36551](https://github.com/expo/expo/discussions/36551)。

:::

### JSC 迁移至社区包

作为减少 React Native API 面积的工作之一，我们正将 JavaScriptCore (JSC) 引擎迁移至社区维护的包：`@react-native-community/javascriptcore`

此更改不会影响使用 Hermes 的用户。

从 React Native 0.79 开始，您可通过遵循 [社区包的安装说明](https://github.com/react-native-community/javascriptcore#installation)，使用社区支持的 JSC 版本。React Native 核心提供的 JSC 版本将在 0.79 中继续可用，但 [不久后将移除](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0836-lean-core-jsc.md)。

将 JSC 迁移至社区包使我们能更频繁地更新 JSC 版本，为您提供最新功能。社区维护的 JSC 版本将独立于 React Native 版本更新。

### iOS：Swift 兼容的原生模块注册

本次发布重构了将原生模块注册入 React Native runtime 的方式。新方法与组件注册的方式一致，具体可参见[官方文档](/docs/next/the-new-architecture/using-codegen#configuring-codegen)。

从本版本起，可以通过修改 `package.json` 文件注册模块。我们在 `ios` 配置中引入了新的 `modulesProvider` 字段：

```diff
"codegenConfig": {
     "ios": {
+       "modulesProvider": {
+         "模块的 JS 名称": "用于纯 C++ Turbo Module 的 ObjC 模块提供者，或符合 RCTTurboModule 的类"
+     }
    }
}
```

Codegen 会从您的 `package.json` 自动生成相关代码。

如果您使用纯 C++ 原生模块，建议按以下方式配置：

<details>
<summary>为纯 C++ 原生模块配置应用</summary>

对于纯 C++ 原生模块，您需要添加一个 ObjectiveC++ 类，将 C++ 模块与应用其它部分连接：

```objc title="CppNativeModuleProvider.h"
#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface <YourNativeModule>Provider : NSObject <RCTModuleProvider>

@end
```

```objc title="CppNativeModuleProvider.mm"
NS_ASSUME_NONNULL_END

#import "<YourNativeModule>Provider.h"
#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/TurboModule.h>
#import "<YourNativeModule>.h"

@implementation NativeSampleModuleProvider

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSampleModule>(params.jsInvoker);
}
```

</details>

通过该方法，我们统一了应用开发者与库维护者的原生模块注册方式。库也可在 `package.json` 中声明相同字段，Codegen 负责其余流程。

此方案解决了 0.77 版本中纯 C++ 原生模块无法在 Swift 实现的 `AppDelegate` 中注册的限制。正如所示，该改动无需修改 `AppDelegate`，且生成代码可同时兼容 Swift 与 Objective-C 实现的 `AppDelegate`。

### Android：更快的应用启动

我们还带来了显著提升 Android 启动速度的改动。

从本版本起，将不再压缩 APK 内的 JavaScript Bundle。之前，Android 系统需先解压 JS Bundle 才能启动，导致启动变慢。

本次发布默认以未压缩形式打包 JavaScript Bundle，令 Android 应用启动更快。

[Margelo 团队](https://margelo.com) 在 Discord 应用上测试该特性，时间响应 (TTI) 缩短了 400ms，相当于 12% 的速度提升（在三星 A14 机型测试，且仅改动一行配置）。

但同时，未压缩 Bundle 会导致应用在设备上的存储空间占用增加。如有空间方面顾虑，可在 `app/build.gradle` 中的 `enableBundleCompression` 属性切换此行为：

```kotlin title="app/build.gradle"
react {
  // ...
  // 如果希望压缩 JS Bundle（启动较慢，空间占用较小）
  enableBundleCompression = true
  // 如果不希望压缩 JS Bundle（启动较快，但占用空间较大）
  enableBundleCompression = false

  // 默认值为 `false`
}
```

请注意，本次发布 APK 初始大小会增加，但网络下载时 APK 本身仍会被压缩，用户不会因此多消耗下载流量。

## 破坏性变更

### 移除远程 JS 调试

为了提升调试体验，我们移除了基于 Chrome 的远程 JS 调试功能。此遗留调试方式已在 React Native 0.73 中[被弃用并转为运行时显式启用](/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#remote-javascript-debugging)。请使用更现代且可靠的 [React Native DevTools](/docs/react-native-devtools) 进行调试。

这也意味着 React Native 不再兼容社区项目 [react-native-debugger](https://github.com/jhen0409/react-native-debugger)。想使用第三方调试扩展（如 Redux DevTools）的开发者，建议采用 [Expo DevTools 插件](https://github.com/expo/dev-plugins) 或集成这些工具的独立版本。

详情请参阅 [此专项讨论帖子](https://github.com/react-native-community/discussions-and-proposals/discussions/872)。

### 内部模块更新为 `export` 语法

为使 JavaScript 代码现代化，我们更新了 `react-native` 内部若干实现模块，统一使用 `export` 语法代替 `module.exports`。

共更新约 **46 个 API**，详情见 [变更日志](https://github.com/facebook/react-native/blob/main/CHANGELOG.md#v0790)。

此更改对现有导入有细微影响：

<details>
<summary>案例 1：默认导出</summary>

```diff
  // 变更前 - require 语法
- const ImageBackground = require('react-native/Libraries/Image/ImageBackground');
+ const ImageBackground = require('react-native/Libraries/Image/ImageBackground').default;

// 不变 - import 语法
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';

// 推荐 - 从根路径导入
import {ImageBackground} from 'react-native';

```

</details>

<details>

<summary>案例 2：二级导出</summary>

此类情况较少，使用根路径 `'react-native'` 导入时无变化。

```diff
  // 不变 - require 语法
  const BlobRegistry = require('react-native/Libraries/Blob/BlobRegistry');

  // 不变 - require 解构语法
  const {register, unregister} = require('react-native/Libraries/Blob/BlobRegistry');

  // 变更 - import 单对象语法
- import BlobRegistry from 'react-native/Libraries/Blob/BlobRegistry';
+ import * as BlobRegistry from 'react-native/Libraries/Blob/BlobRegistry';


  // 不变 - import 解构语法
  import {register, unregister} from 'react-native/Libraries/Blob/BlobRegistry';

  // 推荐 - 从根路径导入
  import {BlobRegistry} from 'react-native';
```

</details>

我们预期该变更影响极小，特别是对于使用 TypeScript 及 `import` 语法的项目。请检查有无类型错误及时调整代码。

:::tip

**强烈推荐使用根路径 `react-native` 进行导入**

作为通用建议，推荐从根路径 `'react-native'` 导入，以减少未来可能出现的破坏性变更。在下一版本中，我们将废弃深度导入，旨在更明确 React Native 的公共 JS API 边界（详见[RFC 说明](https://github.com/react-native-community/discussions-and-proposals/pull/894)）。

:::

### 其他破坏性变更

以下为疑似对产品代码有轻微影响的其他破坏性变更，值得注意：

- **无单位的长度值（unitless）在 box-shadow 和 filter 中无效**：
  - 为增强 React Native 与 CSS/Web 标准的兼容性，现不再支持 box-shadow 和 filter 中无单位的长度值。例如，`box-shadow: 1 1 black` 不再生效，应指定单位如 `1px 1px black`。
- **从 normalize-color 中移除错误的 hwb() 语法支持**：
  - 为了符合 CSS/Web 规范，限制了对非法 hwb() 语法的支持。历史上 React Native 支持逗号分隔形式（如 `hwb(0, 0%, 100%)`），现已废弃，应改为空格分隔（`hwb(0 0% 100%)`）。详情见 [此提交](https://github.com/facebook/react-native/commit/676359efd9e478d69ad430cff213acc87b273580)。
- **Libraries/Core/ExceptionsManager 导出更新**：
  - 作为底层 JS API 现代化改进，`[ExceptionsManager](https://github.com/facebook/react-native/blob/0.79-stable/packages/react-native/Libraries/Core/ExceptionsManager.js)` 现在默认导出一个 `ExceptionsManager` 对象，并以二级导出形式提供 `SyntheticError`。

## 致谢

React Native 0.79 汇集了来自 100 名贡献者的 944 次提交。感谢大家的辛勤付出！

特别感谢本次版本中作出重要贡献的社区成员：

- [Marc Rousavy](https://github.com/mrousavy) 致力于开发与文档撰写“Android：更快的应用启动”功能
- [Kudo Chien](https://github.com/Kudo) 和 [Oskar Kwaśniewski](https://github.com/okwasniewski) 参与 `@react-native-community/javascriptcore` 包开发，撰写“JSC 迁移至社区包”章节
- [James Lawson](https://github.com/facebook/metro/pull/1302) 为 Metro 新增导入子路径解析支持 [详情](https://github.com/facebook/metro/pull/1302)

同时感谢其他作者对本发布文档的支持：

- [Rob Hogan](https://github.com/robhogan) 撰写“Metro 新特性”章节
- [Alex Hunt](https://github.com/huntie) 撰写“移除远程 JS 调试”及“内部模块更新为 export 语法”章节
- [Riccardo Cipolleschi](https://github.com/cipolleschi) 贡献 iOS 原生模块注册部分内容

## 升级至 0.79

请使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 查看不同版本间的代码变更，以及参考升级文档。

创建新项目请执行：

```sh
npx @react-native-community/cli@latest init MyProject --version latest
```

若使用 Expo，React Native 0.79 将作为默认版本包含于即将发布的 Expo SDK 53。

:::info

0.79 现为 React Native 最新稳定版，0.76.x 版本转入不再支持。详情见 [React Native 支持政策](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md)。我们计划在近期发布 0.76 最终终止支持更新。

:::