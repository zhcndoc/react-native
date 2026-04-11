## 安装依赖

你将需要 Node、Watchman、React Native 命令行界面、Xcode 和 CocoaPods。

虽然你可以使用任何编辑器来开发你的应用，但你需要安装 Xcode 以便设置必要的工具来构建你的 React Native iOS 应用。

### Node & Watchman

我们推荐使用 [Homebrew](https://brew.sh/) 安装 Node 和 Watchman。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install node
brew install watchman
```

如果你已经在系统上安装了 Node，请确保它是 Node 20.19.4 或更新版本。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 提供的一个用于监视文件系统变化的工具。强烈建议你安装它以获得更好的性能。

### Xcode

请使用 **最新版本** 的 Xcode。

安装 Xcode 最简单的方法是通过 [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)。安装 Xcode 也会安装 iOS 模拟器和构建 iOS 应用所需的所有必要工具。

#### 命令行工具

你还需要安装 Xcode 命令行工具。打开 Xcode，然后从 Xcode 菜单中选择 **设置...（或偏好设置...）**。转到位置面板，通过在命令行工具下拉菜单中选择最新版本来安装工具。

![Xcode 命令行工具](/docs/assets/GettingStartedXcodeCommandLineTools.png)

#### 在 Xcode 中安装 iOS 模拟器

要安装模拟器，打开 **Xcode > 设置...（或偏好设置...）** 并选择 **平台（或组件）** 选项卡。选择与你希望使用的 iOS 版本相对应的模拟器。

如果你使用 Xcode 14.0 或更高版本安装模拟器，打开 **Xcode > 设置 > 平台** 选项卡，然后点击 "+" 图标并选择 **iOS…** 选项。

#### CocoaPods

[CocoaPods](https://cocoapods.org/) 是 iOS 可用的依赖管理系统之一。CocoaPods 是一个 Ruby [gem](https://en.wikipedia.org/wiki/RubyGems)。你可以使用最新版 macOS 附带的 Ruby 版本来安装 CocoaPods。

更多信息，请访问 [CocoaPods 入门指南](https://guides.cocoapods.org/using/getting-started.html)。

### [可选] 配置你的环境

从 React Native 0.69 版本开始，可以使用模板提供的 `.xcode.env` 文件来配置 Xcode 环境。

`.xcode.env` 文件包含一个环境变量，用于在 `NODE_BINARY` 变量中导出 `node` 可执行文件的路径。
这是将构建基础设施与系统版本的 `node` 解耦的 **建议方法**。如果与默认值不同，你应该使用自己的路径或自己的 `node` 版本管理器来自定义此变量。

除此之外，还可以添加任何其他环境变量，并在构建脚本阶段中加载 `.xcode.env` 文件。如果你需要运行需要特定环境的脚本，这是 **建议方法**：它允许将构建阶段与特定环境解耦。

:::info
如果你已经在使用 [NVM](https://nvm.sh/)（一个帮助你安装和切换 Node.js 版本的命令）和 [zsh](https://ohmyz.sh/)，你可能想要将初始化 NVM 的代码从 `~/.zshrc` 移动到 `~/.zshenv` 文件中，以帮助 Xcode 找到你的 Node 可执行文件：

```zsh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 这会加载 nvm
```

你可能还希望确保 Xcode 项目的所有 "shell 脚本构建阶段" 都使用 `/bin/zsh` 作为其 shell。
:::

<h3>就是这样！</h3>

恭喜！你成功设置了开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将此新的 React Native 代码添加到现有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果你好奇想了解更多关于 React Native 的信息，请查看 [React Native 介绍](getting-started)。
