import ThemedImage from '@theme/ThemedImage';

## 安装依赖

你需要安装 Node、Watchman、React Native 命令行界面、Xcode 和 CocoaPods。

虽然你可以使用自己选择的任何编辑器来开发应用，但你需要安装 Xcode，以便设置构建适用于 iOS 的 React Native 应用所需的工具。

### Node 和 Watchman

我们建议使用 [Homebrew](https://brew.sh/) 安装 Node 和 Watchman。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install node
brew install watchman
```

如果你已经在系统中安装了 Node，请确保其版本为 Node 22.11.0 或更高版本。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 开发的用于监视文件系统变化的工具。强烈建议安装它，以获得更好的性能。

### Xcode

请使用 **最新版本的 Xcode**。

安装 Xcode 最简单的方法是通过 [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)。安装 Xcode 还会同时安装 iOS Simulator，以及构建 iOS 应用所需的全部工具。

#### 命令行工具

你还需要安装 Xcode Command Line Tools。打开 Xcode，然后从 Xcode 菜单中选择 **Settings...（或 Preferences...）**。进入 Locations 面板，在 Command Line Tools 下拉菜单中选择最新版本，以安装这些工具。

<ThemedImage
alt="Xcode Command Line Tools 配置"
sources={{
    light: '/docs/assets/GettingStartedXcodeCommandLineTools.png',
    dark: '/docs/assets/GettingStartedXcodeCommandLineToolsDark.png',
  }}
/>

#### 在 Xcode 中安装 iOS Simulator

要安装模拟器，请打开 **Xcode > Settings...（或 Preferences...）**，然后选择 **Platforms（或 Components）** 标签页。选择与你想使用的 iOS 版本相对应的模拟器。

如果你使用 Xcode 14.0 或更高版本安装模拟器，请打开 **Xcode > Settings > Platforms** 标签页，然后点击“+”图标并选择 **iOS…** 选项。

#### CocoaPods

[CocoaPods](https://cocoapods.org/) 是 iOS 可用的依赖管理系统之一。CocoaPods 是一个 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)。你可以使用最新版本 macOS 自带的 Ruby 安装 CocoaPods。

有关更多信息，请参阅 [CocoaPods Getting Started 指南](https://guides.cocoapods.org/using/getting-started.html)。

### [可选] 配置环境

从 React Native 0.69 版本开始，可以使用模板提供的 `.xcode.env` 文件配置 Xcode 环境。

`.xcode.env` 文件包含一个环境变量，用于将 `node` 可执行文件的路径导出到 `NODE_BINARY` 变量中。
这是将构建基础设施与系统版本的 `node` 解耦的**建议方法**。如果该变量与默认值不同，你应使用自己的路径或自己的 `node` 版本管理器对其进行自定义。

除此之外，你还可以添加其他环境变量，并在构建脚本阶段加载 `.xcode.env` 文件。如果你需要运行要求特定环境的脚本，这是**建议的方法**：它可以将构建阶段与特定环境解耦。

:::info
如果你已经在使用 [NVM](https://nvm.sh/)（帮助你安装和切换 Node.js 版本的命令）和 [zsh](https://ohmyz.sh/)，你可能需要将初始化 NVM 的代码从 `~/.zshrc` 移动到 `~/.zshenv` 文件中，以帮助 Xcode 找到 Node 可执行文件：

```zsh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

你可能还需要确保 Xcode 项目中的所有“shell script build phase”都使用 `/bin/zsh` 作为其 shell。
:::

<h3>就是这样！</h3>

恭喜！你已成功设置开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来呢？</h2>

- 如果你想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)
- 如果你想进一步了解 React Native，请查看 [React Native 简介](getting-started)
