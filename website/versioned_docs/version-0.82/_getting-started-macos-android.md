## 安装依赖

你需要 Node、Watchman、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用任何编辑器来开发应用，但你需要安装 Android Studio 以便设置必要的工具来构建你的 React Native Android 应用。

<h3>Node 和 Watchman</h3>

我们建议使用 [Homebrew](https://brew.sh/) 安装 Node 和 Watchman。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install node
brew install watchman
```

如果你已经在系统上安装了 Node，请确保它是 Node 20.19.4 或更新版本。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 提供的一个用于监视文件系统变化的工具。强烈建议安装它以获得更好的性能。

<h3>Java Development Kit</h3>

我们建议使用 [Homebrew](https://brew.sh/) 安装名为 Azul **Zulu** 的 OpenJDK 发行版。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install --cask zulu@17

# 获取 cask 安装位置以找到 JDK 安装程序
brew info --cask zulu@17

# ==> zulu@17: <版本号>
# https://www.azul.com/downloads/
# 已安装
# /opt/homebrew/Caskroom/zulu@17/<版本号> (185.8MB)（注意，在非 Apple Silicon Mac 上路径为 /usr/local/Caskroom）
# 使用 formulae.brew.sh API 安装于 2024-06-06 10:00:00

# 导航到该文件夹
open /opt/homebrew/Caskroom/zulu@17/<版本号> # 或 /usr/local/Caskroom/zulu@17/<版本号>
```

打开 Finder 后，双击 `Double-Click to Install Azul Zulu JDK 17.pkg` 包以安装 JDK。

JDK 安装后，在 `~/.zshrc`（或 `~/.bash_profile`）中添加或更新你的 `JAVA_HOME` 环境变量。

如果你使用了上述步骤，JDK 可能位于 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`：

```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Zulu OpenJDK 发行版为 **Intel 和 M1 Mac** 都提供了 JDK。这将确保你的构建在 M1 Mac 上比使用基于 Intel 的 JDK 更快。

如果你已经在系统上安装了 JDK，我们推荐 JDK 17。使用更高版本的 JDK 可能会遇到问题。

<h3>Android 开发环境</h3>

如果你是 Android 开发新手，设置开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，可能有一些东西需要配置。无论哪种情况，请务必仔细遵循以下步骤。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，确保以下所有项目旁边的复选框都被勾选：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后，点击"Next"安装所有这些组件。

:::note
如果复选框是灰色的，你稍后还有机会安装这些组件。
:::

设置完成后，当你看到欢迎屏幕时，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。但是，构建带有原生代码的 React Native 应用特别需要 `Android 15 (VanillaIceCream)` SDK。额外的 Android SDK 可以通过 Android Studio 中的 SDK Manager 安装。

为此，打开 Android Studio，点击"More Actions"按钮并选择"SDK Manager"。

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

:::tip
SDK Manager 也可以在 Android Studio 的"Settings"对话框中找到，位于 **Languages & Frameworks** → **Android SDK** 下。
:::

在 SDK Manager 中选择"SDK Platforms"标签页，然后勾选右下角"Show Package Details"旁边的复选框。查找并展开 `Android 15 (VanillaIceCream)` 条目，然后确保勾选了以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image` 或（对于 Apple M1 Silicon）`Google APIs ARM 64 v8a System Image`

接下来，选择"SDK Tools"标签页，并同样勾选这里的"Show Package Details"旁边的复选框。查找并展开"Android SDK Build-Tools"条目，然后确保选择了 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击"Apply"下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量才能构建带有原生代码的应用。

将以下行添加到你的 `~/.zprofile` 或 `~/.zshrc`（如果你使用 `bash`，则是 `~/.bash_profile` 或 `~/.bashrc`）配置文件中：

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

运行 `source ~/.zprofile`（对于 `bash` 则是 `source ~/.bash_profile`）将配置加载到当前 shell 中。通过运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否已设置，并通过运行 `echo $PATH` 验证适当的目录是否已添加到你的路径中。

:::note
请确保你使用了正确的 Android SDK 路径。你可以在 Android Studio 的"Settings"对话框中找到 SDK 的实际位置，位于 **Languages & Frameworks** → **Android SDK** 下。
:::

<h2>准备 Android 设备</h2>

你需要一个 Android 设备来运行你的 React Native Android 应用。这可以是物理 Android 设备，或者更常见的是，你可以使用 Android 虚拟设备（AVD），它允许你在电脑上模拟一个 Android 设备。

无论哪种方式，你都需要准备设备以运行用于开发的 Android 应用。

<h3>使用物理设备</h3>

如果你有物理 Android 设备，你可以使用它代替 AVD 进行开发，只需使用 USB 电缆将其连接到电脑，并按照 [此处](running-on-device.md) 的说明操作。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，可以通过打开 Android Studio 内的"AVD Manager"查看可用的 Android 虚拟设备（AVD）列表。查找看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果你最近安装了 Android Studio，可能需要 [创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择"Create Virtual Device..."，然后从列表中选择任意手机并点击"Next"，接着选择 **VanillaIceCream** API Level 35 镜像。

点击"Next"然后点击"Finish"创建你的 AVD。此时你应该能够点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你成功设置了开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将此新的 React Native 代码添加到现有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果你好奇想了解更多关于 React Native 的信息，请查看 [React Native 介绍](getting-started)。
