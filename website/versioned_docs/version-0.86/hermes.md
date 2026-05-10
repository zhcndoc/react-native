---
id: hermes
title: 使用 Hermes
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<a href="https://hermesengine.dev">
  <img width={300} height={300} className="hermes-logo" src="/docs/assets/HermesLogo.svg" style={{height: "auto"}}/>
</a>

[Hermes](https://hermesengine.dev) 是一个为 React Native 优化的开源 JavaScript 引擎。对于许多应用来说，与 JavaScriptCore 相比，使用 Hermes 会带来更快的启动时间、更低的内存占用以及更小的应用体积。
React Native 默认使用 Hermes，无需额外配置即可启用。

## 捆绑的 Hermes

React Native 附带了一个 **捆绑版本** 的 Hermes。
每当我们发布 React Native 的新版本时，都会为你构建一个 Hermes 版本。这将确保你使用的 Hermes 版本与所使用的 React Native 版本完全兼容。

这一变化对 React Native 用户完全透明。你仍然可以使用本页中描述的命令来禁用 Hermes。
你可以[在此页面阅读有关技术实现的更多内容](/architecture/bundled-hermes)。

## 确认 Hermes 正在使用中

如果你最近从头创建了一个新应用，你应该在欢迎视图中查看 Hermes 是否已启用：

<figure>
<img src="/docs/assets/HermesApp.png" height="600" alt="在新项目中哪里可以找到 JS 引擎状态？" />
</figure>

JavaScript 中会提供一个 `HermesInternal` 全局变量，可用于验证 Hermes 是否正在使用：

```jsx
const isHermes = () => !!global.HermesInternal;
```

:::caution
如果你使用的是非标准方式加载 JS bundle，那么 `HermesInternal` 变量可能可用，但你并未使用高度优化的预编译字节码。
请确认你使用的是 `.hbc` 文件，并且还要按如下所述在前后进行基准测试。
:::

为了看到 Hermes 的优势，请尝试为你的应用创建一个发布构建/部署进行对比。例如，从项目根目录：

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

这会在构建期间将 JavaScript 编译为 Hermes 字节码，从而提升应用在设备上的启动速度。

## 切换回 JavaScriptCore

React Native 也支持使用 JavaScriptCore 作为 [JavaScript 引擎](javascript-environment)。请按照[社区仓库中的说明](https://github.com/react-native-community/javascriptcore)来停用 Hermes。
