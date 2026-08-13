---
id: getting-started-without-a-framework
title: 不使用框架开始
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import PlatformSupport from '@site/src/theme/PlatformSupport';

import RemoveGlobalCLI from './\_remove-global-cli.md';

<PlatformSupport platforms={['android', 'ios', 'macOS', 'tv', 'watchOS', 'web', 'windows', 'visionOS']} />

如果你遇到 [Framework](/architecture/glossary#react-native-framework) 无法很好满足的限制，或者更愿意编写自己的 Framework，那么你可以在不使用 Framework 的情况下创建 React Native 应用。

为此，你首先需要[设置开发环境](set-up-your-environment)。完成设置后，继续执行以下步骤来创建应用并开始开发。

### 第 1 步：创建新应用

<RemoveGlobalCLI />

你可以使用 [React Native Community CLI](https://github.com/react-native-community/cli) 来生成新项目。让我们创建一个名为 “AwesomeProject” 的新 React Native 项目：

```shell
npx @react-native-community/cli@latest init AwesomeProject
```

如果你要将 React Native 集成到现有应用中，或者已在项目中安装了 [Expo](https://docs.expo.dev/bare/installing-expo-modules/)，又或者要将 Android 支持添加到现有 React Native 项目中（请参阅[与现有应用集成](integration-with-existing-apps.md)），则不需要执行此操作。你也可以使用第三方 CLI 来设置 React Native 应用，例如 [Ignite CLI](https://github.com/infinitered/ignite)。

:::info

如果你在使用 iOS 时遇到问题，请尝试运行以下命令重新安装依赖：

1. 运行 `cd ios`，导航到 `ios` 文件夹
2. 运行 `bundle install`，安装 [Bundler](https://bundler.io/)
3. 运行 `bundle exec pod install`，安装由 CocoaPods 管理的 iOS 依赖

:::

#### [可选] 使用特定版本或模板

如果你想使用特定的 React Native 版本开始新项目，可以使用 `--version` 参数：

```shell
npx @react-native-community/cli@X.XX.X init AwesomeProject --version X.XX.X
```

你还可以使用 `--template` 参数，通过自定义 React Native 模板启动项目，详情请参阅[此处](https://github.com/react-native-community/cli/blob/main/docs/init.md#initializing-project-with-custom-template)。

### 第 2 步：启动 Metro

[**Metro**](https://metrobundler.dev/) 是 React Native 的 JavaScript 构建工具。要启动 Metro 开发服务器，请在项目文件夹中运行以下命令：

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
如果你熟悉 Web 开发，Metro 类似于 Vite 和 webpack 等打包工具，但它是专为 React Native 端到端设计的。例如，Metro 使用 [Babel](https://babel.dev/) 将 JSX 等语法转换为可执行的 JavaScript。
:::

### 第 3 步：启动应用

让 Metro Bundler 在单独的终端中运行。在 React Native 项目文件夹中打开一个新终端。运行以下命令：

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

如果一切设置正确，你应该很快就能看到新应用在 Android 模拟器中运行。

这只是运行应用的一种方式——你也可以直接在 Android Studio 中运行它。

:::tip
如果无法正常运行，请参阅[故障排除](troubleshooting.md)页面。
:::

### 第 4 步：修改应用

现在你已经成功运行了应用，让我们来修改它。

- 在你选择的文本编辑器中打开 `App.tsx`，并编辑几行代码
- 按两次 <kbd>R</kbd> 键，或者从开发菜单中选择 `Reload`（<kbd>Ctrl</kbd> + <kbd>M</kbd>），即可查看更改！

### 就是这样！

恭喜！你已经成功运行并修改了第一个 barebone React Native 应用。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

### 接下来做什么？

- 如果你想将这些新的 React Native 代码添加到现有应用中，请参阅[集成指南](integration-with-existing-apps.md)
- 如果你想进一步了解 React Native，请参阅[React Native 简介](getting-started)
