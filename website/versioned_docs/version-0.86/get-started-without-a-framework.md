---
id: getting-started-without-a-framework
title: 无需框架开始使用
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import PlatformSupport from '@site/src/theme/PlatformSupport';

import RemoveGlobalCLI from './\_remove-global-cli.md';

<PlatformSupport platforms={['android', 'ios', 'macOS', 'tv', 'watchOS', 'web', 'windows', 'visionOS']} />

如果你有一些 [框架](/architecture/glossary#react-native-framework) 无法很好满足的约束，或者你更愿意自己编写框架，你可以不使用框架来创建一个 React Native 应用。

为此，你首先需要[设置你的开发环境](set-up-your-environment)。环境设置完成后，继续按照下面的步骤创建应用并开始开发。

### 第 1 步：创建新应用

<RemoveGlobalCLI />

你可以使用 [React Native Community CLI](https://github.com/react-native-community/cli) 来生成一个新项目。让我们创建一个名为 "AwesomeProject" 的新 React Native 项目：

```shell
npx @react-native-community/cli@latest init AwesomeProject
```

如果你正在将 React Native 集成到现有应用中，或者你已经在项目中安装了 [Expo](https://docs.expo.dev/bare/installing-expo-modules/)，或者你正在为现有的 React Native 项目添加 Android 支持（参见 [与现有应用集成](integration-with-existing-apps.md)），则这一步不是必须的。你也可以使用第三方 CLI 来设置你的 React Native 应用，例如 [Ignite CLI](https://github.com/infinitered/ignite)。

:::info

如果你在 iOS 方面遇到问题，尝试通过运行以下命令重新安装依赖项：

1. `cd ios` 进入 `ios` 文件夹。
2. `bundle install` 安装 [Bundler](https://bundler.io/)
3. `bundle exec pod install` 安装由 CocoaPods 管理的 iOS 依赖项。

:::

#### [可选] 使用特定版本或模板

如果你想使用特定的 React Native 版本来启动一个新项目，可以使用 `--version` 参数：

```shell
npx @react-native-community/cli@X.XX.X init AwesomeProject --version X.XX.X
```

你也可以使用 `--template` 参数，使用自定义的 React Native 模板来启动项目，更多内容请阅读[这里](https://github.com/react-native-community/cli/blob/main/docs/init.md#initializing-project-with-custom-template)。

### 第 2 步：启动 Metro

[**Metro**](https://metrobundler.dev/) 是 React Native 的 JavaScript 构建工具。要启动 Metro 开发服务器，请在你的项目文件夹中运行以下命令：

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
如果你熟悉 Web 开发，Metro 类似于 Vite 和 webpack 这样的打包工具，但它是专门为 React Native 端到端设计的。例如，Metro 使用 [Babel](https://babel.dev/) 将 JSX 等语法转换为可执行的 JavaScript。
:::

### 第 3 步：启动你的应用

让 Metro Bundler 在它自己的终端中运行。在你的 React Native 项目文件夹中打开一个新的终端。运行以下命令：

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

如果一切设置正确，你很快就会在 Android 模拟器中看到你的新应用运行起来。

这是运行应用的一种方式——你也可以直接在 Android Studio 中运行它。

:::tip
如果你无法让它正常工作，请查看 [故障排除](troubleshooting.md) 页面。
:::

### 第 4 步：修改你的应用

现在你已经成功运行了应用，让我们来修改它。

- 在你喜欢的文本编辑器中打开 `App.tsx`，并编辑一些代码行。
- 连按两次 <kbd>R</kbd> 键，或从开发者菜单（<kbd>Ctrl</kbd> + <kbd>M</kbd>）中选择 `Reload`，即可查看你的更改！

### 就是这样！

恭喜！你已经成功运行并修改了你的第一个基础 React Native 应用。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

### 接下来做什么？

- 如果你想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)。
- 如果你想进一步了解 React Native，请查看 [React Native 简介](getting-started)。
