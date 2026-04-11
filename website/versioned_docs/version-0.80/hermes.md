---
id: hermes
title: 使用 Hermes
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<a href="https://hermesengine.dev">
  <img width={300} height={300} className="hermes-logo" src="/docs/assets/HermesLogo.svg" style={{height: "auto"}}/>
</a>

[Hermes](https://hermesengine.dev) 是一个专为 React Native 优化的开源 JavaScript 引擎。对于许多应用来说，与 JavaScriptCore 相比，使用 Hermes 将带来更快的启动时间、更低的内存占用和更小的应用体积。
Hermes 是 React Native 的默认配置，无需额外配置即可启用。

## 捆绑的 Hermes

React Native 自带 **捆绑版本** 的 Hermes。
每当我们要发布新版本的 React Native 时，我们都会为您构建一个版本的 Hermes。这将确保您使用的 Hermes 版本与您使用的 React Native 版本完全兼容。

此更改对 React Native 用户完全是透明的。您仍然可以使用本页描述的命令禁用 Hermes。
您可以 [在此页面上阅读有关技术实现的更多信息](/architecture/bundled-hermes)。

## 确认 Hermes 正在使用中

如果您最近从头创建了一个新应用，您应该在欢迎视图中看到 Hermes 是否已启用：

<figure>
<img src="/docs/assets/HermesApp.png" height="600" alt="在哪里可以找到新项目中的 JS 引擎状态？" />
</figure>

JavaScript 中将提供一个 `HermesInternal` 全局变量，可用于验证 Hermes 是否正在使用：

```jsx
const isHermes = () => !!global.HermesInternal;
```

:::caution
如果您使用非标准方式加载 JS bundle，`HermesInternal` 变量可能可用，但您并未使用高度优化的预编译字节码。
确认您正在使用 `.hbc` 文件，并按照下文详述的方式进行前后基准测试。
:::

要查看 Hermes 的优势，请尝试制作应用的发布构建/部署来进行比较。例如；从项目的根目录：

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

这将在构建期间将 JavaScript 编译为 Hermes 字节码，从而提高应用在设备上的启动速度。

## 切换回 JavaScriptCore

React Native 也支持使用 JavaScriptCore 作为 [JavaScript 引擎](javascript-environment)。请按照以下说明选择退出 Hermes。

### Android

编辑您的 `android/gradle.properties` 文件并将 `hermesEnabled` 改回 false：

```diff
# 使用此属性启用或禁用 Hermes JS 引擎。
# 如果设置为 false，您将使用 JSC。
hermesEnabled=false
```

### iOS

编辑您的 `ios/Podfile` 文件并进行如下所示的更改：

```diff
   use_react_native!(
     :path => config[:reactNativePath],
+    :hermes_enabled => false,
     # 应用程序根目录的绝对路径。
     :app_path => "#{Pod::Config.instance.installation_root}/.."
   )
```
