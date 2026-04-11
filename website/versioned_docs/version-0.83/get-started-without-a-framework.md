---
id: getting-started-without-a-framework
title: 无需框架快速开始
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import PlatformSupport from '@site/src/theme/PlatformSupport';

import RemoveGlobalCLI from './\_remove-global-cli.md';

<PlatformSupport platforms={['android', 'ios', 'macOS', 'tv', 'watchOS', 'web', 'windows', 'visionOS']} />

如果你有一些 [框架](/architecture/glossary#react-native-framework) 无法良好支持的限制，或者你更喜欢自己编写框架，也可以不用框架直接创建 React Native 应用。

要实现这一点，你首先需要 [设置你的开发环境](set-up-your-environment)。准备好环境后，继续按照下面的步骤创建应用并开始开发。

### 第一步：创建新应用

<RemoveGlobalCLI />

你可以使用 [React Native Community CLI](https://github.com/react-native-community/cli) 来生成一个新项目。现在创建一个叫做"AwesomeProject"的 React Native 项目：

```shell
npx @react-native-community/cli@latest init AwesomeProject
```

如果你是将 React Native 集成到已有应用中，或者已经在项目中安装了 [Expo](https://docs.expo.dev/bare/installing-expo-modules/)，或者你是在为已有 React Native 项目添加 Android 支持（请参阅 [与现有应用集成](integration-with-existing-apps.md)），这一步不是必须的。你也可以使用第三方 CLI 来搭建 React Native 应用，比如 [Ignite CLI](https://github.com/infinitered/ignite)。

:::info

如果你在 iOS 上遇到问题，尝试重新安装依赖，步骤如下：

1. 进入 `ios` 文件夹，运行 `cd ios`
2. 安装 [Bundler](https://bundler.io/)，运行 `bundle install`
3. 安装 CocoaPods 管理的 iOS 依赖，运行 `bundle exec pod install`

:::

#### [可选] 使用特定版本或模板

如果你想用特定版本的 React Native 创建新项目，可以使用 `--version` 参数：

```shell
npx @react-native-community/cli@X.XX.X init AwesomeProject --version X.XX.X
```

你也可以使用自定义的 React Native 模板，使用 `--template` 参数，详细信息请参阅 [这里](https://github.com/react-native-community/cli/blob/main/docs/init.md#initializing-project-with-custom-template)。

### 第二步：启动 Metro

[**Metro**](https://metrobundler.dev/) 是 React Native 的 JavaScript 构建工具。要启动 Metro 开发服务器，在项目目录中运行：

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
如果你熟悉网页开发，Metro 类似于 Vite 和 webpack 这样的打包工具，但它是为 React Native 端到端设计的。例如，Metro 使用 [Babel](https://babel.dev/) 将 JSX 等语法转换成可执行的 JavaScript。
:::

### 第三步：启动你的应用

让 Metro Bundler 在它自己的终端中运行。打开一个新的终端，进入你的 React Native 项目文件夹。运行以下命令：

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

如果一切设置正确，你应该很快能在 Android 模拟器中看到运行中的新应用。

这是运行应用的一种方式 —— 你也可以直接从 Android Studio 内运行。

:::tip
如果你无法成功运行，请参阅 [故障排除](troubleshooting.md) 页面。
:::

### 第四步：修改你的应用

成功运行应用后，来修改它吧。

- 用你喜欢的文本编辑器打开 `App.tsx`，修改几行代码。
- 连续按两次 <kbd>R</kbd> 键，或者从开发者菜单（<kbd>Ctrl</kbd> + <kbd>M</kbd>）中选择 `Reload`，即可看到你的改动！

### 就这样！

恭喜你！你已成功运行并修改了你的第一个基础 React Native 应用。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

### 接下来呢？

- 如果你想把这个新建的 React Native 代码加入已有应用中，查看 [集成指南](integration-with-existing-apps.md)。
- 如果你想深入了解 React Native，看看 [React Native 入门](getting-started)。