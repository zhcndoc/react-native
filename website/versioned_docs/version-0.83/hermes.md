---
id: hermes
title: 使用 Hermes
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<a href="https://hermesengine.dev">
  <img width={300} height={300} className="hermes-logo" src="/docs/assets/HermesLogo.svg" style={{height: "auto"}}/>
</a>

[Hermes](https://hermesengine.dev) 是一个为 React Native 优化的开源 JavaScript 引擎。对于许多应用来说，使用 Hermes 会带来更快的启动时间，更低的内存使用，以及相比 JavaScriptCore 更小的应用体积。  
React Native 默认使用 Hermes，无需额外配置即可启用。

## 内置 Hermes

React Native 自带一个 **内置版本** 的 Hermes。  
每当我们发布新的 React Native 版本时，都会为您构建一个 Hermes 版本。这样可以确保您使用的 Hermes 版本与您使用的 React Native 版本完全兼容。

这一变更对 React Native 用户完全透明。您仍然可以使用本文介绍的命令来禁用 Hermes。  
您可以在此页面查看更多关于技术实现的内容[/architecture/bundled-hermes](/architecture/bundled-hermes)。

## 确认 Hermes 是否正在使用

如果您最近从头创建了一个新应用，可以在欢迎界面查看 Hermes 是否启用：

<figure>
<img src="/docs/assets/HermesApp.png" height="600" alt="在新项目中哪里查看 JS 引擎状态？" />
</figure>

JavaScript 中会有一个名为 `HermesInternal` 的全局变量，可用来验证是否正在使用 Hermes：

```jsx
const isHermes = () => !!global.HermesInternal;
```

:::caution
如果您使用了非标准方式加载 JS bundle，可能会出现 `HermesInternal` 变量存在，但实际上未使用高度优化的预编译字节码的情况。  
请确认您正在使用 `.hbc` 文件，并参考下面的说明对比前后的性能差异。
:::

要体验 Hermes 的优势，请尝试为您的应用制作发布版构建/部署，并进行比较。例如，在项目根目录下运行：

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

[//]: # 'Android'

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android -- --mode="release"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android --mode release
```

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ios">

[//]: # 'iOS'

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios -- --mode="Release"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios --mode Release
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

这会在构建时将 JavaScript 编译为 Hermes 字节码，提升设备上的应用启动速度。

## 切换回 JavaScriptCore

React Native 也支持使用 JavaScriptCore 作为[javaScript 引擎](javascript-environment)。  
请按照[社区仓库](https://github.com/react-native-community/javascriptcore)中的说明操作，来选择不使用 Hermes。