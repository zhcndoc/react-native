---
id: getting-started-without-a-framework
title: 不使用框架开始使用
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import PlatformSupport from '@site/src/theme/PlatformSupport';

import RemoveGlobalCLI from './\_remove-global-cli.md';

<PlatformSupport platforms={['android', 'ios', 'macOS', 'tv', 'watchOS', 'web', 'windows', 'visionOS']} />

如果您的约束条件无法通过 [框架](/architecture/glossary#react-native-framework) 很好地满足，或者您更喜欢编写自己的框架，您可以不使用框架来创建 React Native 应用。

为此，您首先需要 [设置您的环境](set-up-your-environment)。设置完成后，继续以下步骤来创建应用并开始开发。

### 步骤 1：创建新应用

<RemoveGlobalCLI />

您可以使用 [React Native Community CLI](https://github.com/react-native-community/cli) 来生成一个新项目。让我们创建一个名为 "AwesomeProject" 的新 React Native 项目：

```shell
npx @react-native-community/cli@latest init AwesomeProject
```

如果您是将 React Native 集成到现有应用中，或者已在项目中安装了 [Expo](https://docs.expo.dev/bare/installing-expo-modules/)，或者要为现有的 React Native 项目添加 Android 支持（参见 [与现有应用集成](integration-with-existing-apps.md)），则不需要执行此操作。您也可以使用第三方 CLI 来设置 React Native 应用，例如 [Ignite CLI](https://github.com/infinitered/ignite)。

:::info

如果您在使用 iOS 时遇到问题，请尝试通过运行以下命令重新安装依赖：

1. `cd ios` 导航到 `ios` 文件夹。
2. `bundle install` 安装 [Bundler](https://bundler.io/)
3. `bundle exec pod install` 安装由 CocoaPods 管理的 iOS 依赖。

:::

#### [可选] 使用特定版本或模板

如果您想使用特定的 React Native 版本启动新项目，可以使用 `--version` 参数：

```shell
npx @react-native-community/cli@X.XX.X init AwesomeProject --version X.XX.X
```

您也可以使用 `--template` 参数通过自定义 React Native 模板启动项目，更多信息请阅读 [这里](https://github.com/react-native-community/cli/blob/main/docs/init.md#initializing-project-with-custom-template)。

### 步骤 2：启动 Metro

[**Metro**](https://metrobundler.dev/) 是 React Native 的 JavaScript 构建工具。要从项目文件夹启动 Metro 开发服务器，请运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm start
```

</TabItem>
<TabItem value="yarn">

```shell
yarn start
```

</TabItem>
</Tabs>

:::note
如果您熟悉 Web 开发，Metro 类似于 Vite 和 webpack 等打包工具，但它是专为 React Native 端到端设计的。例如，Metro 使用 [Babel](https://babel.dev/) 将 JSX 等语法转换为可执行的 JavaScript。
:::

### 步骤 3：启动您的应用

让 Metro Bundler 在其自己的终端中运行。在您的 React Native 项目文件夹内打开一个新终端。运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

如果一切设置正确，您应该很快能在 Android 模拟器中看到新应用运行。

这是运行应用的一种方法——您也可以直接在 Android Studio 中运行它。

> 如果无法正常工作，请参阅 [故障排除](troubleshooting.md) 页面。

### 步骤 4：修改您的应用

现在您已经成功运行了应用，让我们来修改它。

- 在您选择的文本编辑器中打开 `App.tsx` 并编辑一些行。
- 按两次 <kbd>R</kbd> 键或从开发菜单中选择 `Reload`（<kbd>Ctrl</kbd> + <kbd>M</kbd>）以查看您的更改！

### 就是这样！

恭喜！您已经成功运行并修改了第一个裸机 React Native 应用。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

### 接下来做什么？

- 如果您想将此新 React Native 代码添加到现有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果您好奇想了解更多关于 React Native 的信息，请查看 [React Native 简介](getting-started)。
