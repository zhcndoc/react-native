---
title: 'React Native 0.85 - 新动画后端，新 Jest 预设包'
authors:
  [
    alanleedev,
    CalixTang,
    zoontek,
    gabrieldonadel,
    bartlomiejbloniarz,
    coado,
    zeyap,
    SamuelSusla,
  ]
tags: [公告，发布]
date: 2026-04-07
---

# React Native 0.85 - 新动画后端，新 Jest 预设包

今天我们很高兴发布 React Native 0.85！

此版本包括新动画后端，将 Jest 预设移至专用包，并包含许多其他改进和修复。

### 亮点

- [新动画后端](/blog/2026/04/07/react-native-0.85#new-animation-backend)
- [React Native DevTools 改进](/blog/2026/04/07/react-native-0.85#react-native-devtools-improvements)
- [Metro TLS 支持](/blog/2026/04/07/react-native-0.85#metro-tls-support)

### 破坏性变更

- [Jest 预设移至新包](/blog/2026/04/07/react-native-0.85#jest-preset-moved-to-new-package)
- [停止支持已生命周期结束 (EOL) 的 Node.js 版本](/blog/2026/04/07/react-native-0.85#dropped-support-for-eol-nodejs-versions)
- [`StyleSheet.absoluteFillObject` 被移除](/blog/2026/04/07/react-native-0.85#stylesheetabsolutefillobject-removed)
- [其他破坏性变更](/blog/2026/04/07/react-native-0.85#other-breaking-changes)

<!--truncate-->

## 亮点

### 新动画后端

React Native 0.85 引入了新的共享动画后端，这是与 [Software Mansion](https://swmansion.com/) 合作构建的。

这是一个新的内部引擎，用于支持 Animated 和 Reanimated 底层如何应用动画。通过将主要动画更新逻辑移至 React Native 核心，Reanimated 能够实现以前不可能的性能改进，并确保更新协调过程经过适当测试，并在未来的 RN 更新中保持稳定。

在 Animated 中，你现在可以使用原生驱动 (native driver) 动画化布局属性（[此处曾声明的限制](/docs/animations#caveats) 不再适用）。

|                                              iOS                                              |                                                Android                                                |
| :-------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
| <img src="/blog/assets/0.85-animation-backend-ios.gif" alt="iOS 上的动画后端演示" /> | <img src="/blog/assets/0.85-animation-backend-android.gif" alt="Android 上的动画后端演示" /> |

你可以在 [`react-native/packages/rn-tester/js/examples/AnimationBackend/`](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimationBackend) 下找到更多示例。

要启用，你可以 [如此页面所述](/docs/releases/release-levels) 启用 React Native 的实验性通道。

:::info

此实验性功能将从 React Native **0.85.1** 开始可用，该版本将在不久的将来发布。

:::

#### 如何动画化布局属性

使用新的动画后端，你将能够在 Animated 中使用原生驱动 (native driver) 动画化 Flexbox 和位置属性。

```jsx
import {
  Animated,
  Button,
  View,
  useAnimatedValue,
} from 'react-native';

function MyComponent() {
  const width = useAnimatedValue(100);

  const toggle = () => {
    Animated.timing(width, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={{width, height: 100, backgroundColor: 'blue'}}
      />
      <Button title="Expand" onPress={toggle} />
    </View>
  );
}
```

### React Native DevTools 改进

React Native DevTools 在此版本中获得了以下几项改进：

- **多个 CDP 连接**：React Native 现在支持多个同时进行的 Chrome DevTools Protocol 连接，使 React Native DevTools、VS Code 和 AI 代理等客户端能够同时连接。这解锁了更丰富、可组合的工具工作流，而不会意外结束会话。
- **macOS 上的原生标签页**：我们更新了桌面应用以编译为 macOS 26，并为高级用户启用了系统级标签页处理。当打开多个 DevTools 窗口时，可通过 **窗口 > 合并所有窗口** 访问。

<img src="/blog/assets/0.85-devtools-macos-tabs.png" alt="macOS 上的 DevTools 原生标签页" />

- **请求负载预览**：在因回归问题被禁用后，网络面板中的请求体预览现已在 Android 上恢复。

### Metro TLS 支持

Metro 开发服务器现在可以接受 TLS 配置对象，在开发期间启用 HTTPS（以及用于快速刷新的 WSS）——这对于测试强制安全连接的 API 很有用。

在 `metro.config.js` 中配置它：

```js title="metro.config.js"
const fs = require('fs');

config.server.tls = {
  ca: fs.readFileSync('path/to/ca'),
  cert: fs.readFileSync('path/to/cert'),
  key: fs.readFileSync('path/to/key'),
};
```

<!-- alex ignore simple -->

对于本地开发，[mkcert](https://github.com/FiloSottile/mkcert) 是一种生成本地信任证书而不出现浏览器警告的简单方法。

## 破坏性变更

### Jest 预设移至新包

React Native 的 Jest 预设已从 `react-native` 提取到新的 `@react-native/jest-preset`，减小了核心包的大小，并为项目的测试设置提供了更大的灵活性。

通过一行更改更新你的 `jest.config.js`：

```diff title="jest.config.js"
- preset: 'react-native',
+ preset: '@react-native/jest-preset',
```

### 停止支持已生命周期结束 (EOL) 的 Node.js 版本

React Native 0.85 停止支持生命周期结束 (EOL) 的 Node.js 版本和 v20.19.4 之前的版本。请在升级前确保你运行的是受支持的 Node.js 版本。

- **Node.js v20** (>=20.19.4) — 受支持 (活跃 LTS)
- **Node.js v21** — 不支持 (EOL)
- **Node.js v22** — 受支持 (活跃 LTS)
- **Node.js v23** — 不支持 (EOL)
- **Node.js v24+** — 受支持

### `StyleSheet.absoluteFillObject` 被移除

已弃用的 `StyleSheet.absoluteFillObject` API 已被移除。请改用 `StyleSheet.absoluteFill` 或定义你自己的绝对定位样式。

```diff
- const styles = StyleSheet.absoluteFillObject;
+ const styles = StyleSheet.absoluteFill;
```

### 其他破坏性变更

#### 常规

- `Pressable` 不再卸载隐藏 `Activity` 中的事件监听器。
- 移除了 `ShadowNode::Shared`, `ShadowNode::Weak`, `ShadowNode::Unshared`, `ShadowNode::ListOfWeak`, `ShadowNode::ListOfShared`, `SharedImageManager` 和 `ContextContainer::Shared` 的已弃用 C++ 类型别名 —— 那些未被使用，消费库应直接使用类型。

#### Android

- 我们将 `receiveTouches` 重新添加回 `RCTEventEmitter`，默认为 no-op。这是一个修复，旨在减少尚未迁移离开此方法的库的破坏性变更。
- `ReactTextUpdate` 现在是内部的，不应直接公开访问。
- 多个类因旧架构清理而被弃用或移除：
  - `ReactZIndexedViewGroup` 现已弃用。
  - `UIManagerHelper` 现已弃用。
  - `CatalystInstanceImpl` 已被移除（它之前已弃用）。
  - `NativeViewHierarchyManager` 已被完全存根化。

#### iOS

- `RCTHostRuntimeDelegate` 现已弃用并合并到 `RCTHostDelegate` 中。
- 修复了使用 `React.XCFramework` 时的重复符号错误（通过 `fmt`  bump 到 12.1.0）。

## 其他变更

- **Metro** 升级到 `^0.84.0`。
- **React** 更新为使用 Hermes `250829098.0.10`。
- **Yoga**：`YogaNode` 在 Android 上迁移到 Kotlin。
- **无障碍**：弃用 `AccessibilityInfo.setAccessibilityFocus`，改用 `AccessibilityInfo.sendAccessibilityEvent`。
- **TypeScript**：多个实用程序类型转换（`$Values`, `mixed`, `$ReadOnly`, `$ReadOnlyArray`）。
- **Android 构建**：允许通过 `reactNativeDevServerIp` Gradle 属性指定开发服务器 IP。
- **iOS 构建**：在 `React.XCFramework` 中添加了对 clang 虚拟文件系统的支持。

## 致谢

React Native 0.85 包含来自 58 位贡献者的超过 604 次提交。感谢所有的辛勤工作！

<!--alex ignore special white-->

我们要特别感谢在此版本中做出重大贡献的那些社区成员。

- [Zeya Peng](https://github.com/zeyap), [Bartłomiej Błoniarz](https://github.com/bartlomiejbloniarz), 和 [Dawid Małecki](https://github.com/coado) 负责动画后端
- [Vitali Zaidman](https://github.com/vzaidman) 负责 Metro TLS
- [Moti Zilberman](https://github.com/motiz88) 负责多个 CDP 连接
- [Phil Pluckthun](https://github.com/kitten) 和 [Alex Hunt](https://github.com/huntie) 负责 Jest 预设迁移

此外，我们还要感谢为此发布文档撰写功能的其他作者：

<!-- TODO: Add blog post co-authors -->

## 升级到 0.85

:::info

0.85 现在是 React Native 的最新稳定版本，0.82.x 移至不支持。更多信息请参阅 [React Native 的支持政策](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md)。

:::

#### 升级

请使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 查看现有项目 React Native 版本之间的代码更改，此外还有 [升级文档](/docs/upgrading)。

#### 创建新项目

```sh
npx @react-native-community/cli@latest init MyProject --version latest
```

#### Expo

如果你使用 Expo，下一个 SDK，SDK 56，将包含 React Native 0.85。
