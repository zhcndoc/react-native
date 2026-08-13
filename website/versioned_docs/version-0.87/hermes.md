---
id: hermes
title: 使用 Hermes
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<a href="https://hermesengine.dev">
  <img width={300} height={300} className="hermes-logo" src="/docs/assets/HermesLogo.svg" style={{height: "auto"}}/>
</a>

[Hermes](https://hermesengine.dev) 是一个针对 React Native 优化的开源 JavaScript 引擎。对于许多应用来说，与 JavaScriptCore 相比，使用 Hermes 将带来更快的启动时间、更低的内存使用量以及更小的应用体积
React Native 默认使用 Hermes，无需额外配置即可启用它

## 内置 Hermes

React Native 自带 **内置版本** 的 Hermes
每当我们发布新版本的 React Native 时，都会为你构建一个 Hermes 版本。这将确保你使用的 Hermes 版本与所使用的 React Native 版本完全兼容

对于 React Native 用户而言，此更改完全透明。你仍然可以使用本页面中所述的命令禁用 Hermes
你可以[在此页面中详细了解技术实现](/architecture/bundled-hermes)

## 确认正在使用 Hermes

如果你最近从头开始创建了一个新应用，应在欢迎视图中查看 Hermes 是否已启用：

<figure>
<img src="/docs/assets/HermesApp.png" height="600" alt="在新项目中哪里可以找到 JS 引擎状态？" />
</figure>

JavaScript 中将提供一个 `HermesInternal` 全局变量，可用于验证是否正在使用 Hermes：

```jsx
const isHermes = () => !!global.HermesInternal;
```

:::caution
如果你使用非标准方式加载 JS bundle，则可能会出现 `HermesInternal` 变量可用，但你并未使用高度优化的预编译字节码的情况
请确认你使用的是 `.hbc` 文件，并按照下面的详细说明对前后结果进行基准测试
:::

要查看 Hermes 的优势，请尝试对你的应用进行发布版本构建/部署以进行比较。例如；在项目根目录下：

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

这将在构建时将 JavaScript 编译为 Hermes 字节码，从而提高应用在设备上的启动速度

## 切换回 JavaScriptCore

React Native 还支持使用 JavaScriptCore 作为 [JavaScript 引擎](javascript-environment)。请按照[社区仓库](https://github.com/react-native-community/javascriptcore)中的说明退出使用 Hermes
