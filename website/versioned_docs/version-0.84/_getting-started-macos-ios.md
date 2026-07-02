import ThemedImage from '@theme/ThemedImage';

## Installing dependencies

你需要 Node、Watchman、React Native 命令行工具、Xcode 和 CocoaPods。

虽然你可以使用任何你喜欢的编辑器来开发应用，但你需要安装 Xcode 来设置构建 iOS React Native 应用所需的工具。

### Node & Watchman

我们推荐使用 [Homebrew](https://brew.sh/) 来安装 Node 和 Watchman。安装完 Homebrew 后，在终端运行以下命令：

```shell
brew install node
brew install watchman
```

如果你的系统里已经安装了 Node，请确保版本为 20.19.4 或更新。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 开发的一个文件系统变更监视工具。强烈建议安装它以获得更好的性能。

### Xcode

请使用 **最新版本** 的 Xcode。

安装 Xcode 最简单的方式是通过 [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)。安装 Xcode 会同时安装 iOS 模拟器及构建 iOS 应用所需的所有工具。

#### 命令行工具

你还需要安装 Xcode 命令行工具。打开 Xcode，选择 Xcode 菜单中的 **Settings...（或 Preferences...）**。进入 Locations（位置）面板，在 Command Line Tools（命令行工具）下拉菜单中选择最新版本进行安装。

<ThemedImage
alt="Xcode Command Line Tools configuration"
sources={{
    light: '/docs/assets/GettingStartedXcodeCommandLineTools.png',
    dark: '/docs/assets/GettingStartedXcodeCommandLineToolsDark.png',
  }}
/>

#### 在 Xcode 中安装 iOS 模拟器

要安装模拟器，打开 **Xcode > Settings...（或 Preferences...）**，选择 **Platforms（或 Components）** 标签。选择你想使用的对应 iOS 版本的模拟器。

如果你使用的是 Xcode 14.0 或更高版本安装模拟器，打开 **Xcode > Settings > Platforms** 标签，点击 "+" 图标并选择 **iOS…** 选项。

#### CocoaPods

[CocoaPods](https://cocoapods.org/) 是 iOS 上常用的依赖管理工具。CocoaPods 是一个 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)。你可以使用 macOS 最新版本自带的 Ruby 来安装 CocoaPods。

更多信息，请访问 [CocoaPods 入门指南](https://guides.cocoapods.org/using/getting-started.html)。

### [可选] 配置你的环境

从 React Native 0.69 版本开始，可以使用模板中提供的 `.xcode.env` 文件配置 Xcode 环境。

`.xcode.env` 文件包含一个环境变量，用于将 `node` 可执行文件的路径导出到 `NODE_BINARY` 变量中。  
这是 **推荐的做法**，用来将构建环境与系统默认的 `node` 版本解耦。如果你的路径不同或你使用了自己的 `node` 版本管理工具，请自行定制该变量。

此外，你还可以添加其他环境变量，并在构建脚本中引用 `.xcode.env` 文件。如果你需要在脚本中运行特定环境下的命令，这是 **推荐做法**：可以让构建阶段与具体环境解耦。

:::info  
如果你已经使用 [NVM](https://nvm.sh/)（一个帮助安装和切换 Node.js 版本的命令行工具）和 [zsh](https://ohmyz.sh/)，建议你将初始化 NVM 的代码从 `~/.zshrc` 移动到 `~/.zshenv` 文件，帮助 Xcode 找到你的 Node 可执行文件：

```zsh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 这会加载 nvm
```

你还应确保 Xcode 项目中所有"shell 脚本构建阶段”都使用 `/bin/zsh` 作为 shell。  
:::

<h3>就这些！</h3>

恭喜你！你已成功搭建好开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来？</h2>

- 如果你想把这段新的 React Native 代码集成到已有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果你想了解更多关于 React Native 的内容，请查看 [React Native 简介](getting-started)。