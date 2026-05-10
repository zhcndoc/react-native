## 安装依赖

你将需要 Node、Watchman、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用任何你喜欢的编辑器来开发应用，但你仍需要安装 Android Studio，以便设置构建 React Native Android 应用所需的工具链。

<h3>Node &amp; Watchman</h3>

我们建议使用 [Homebrew](https://brew.sh/) 来安装 Node 和 Watchman。安装好 Homebrew 后，请在终端中运行以下命令：

```shell
brew install node
brew install watchman
```

如果你的系统中已经安装了 Node，请确保其版本为 Node 22.11.0 或更高。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 提供的一个用于监视文件系统变更的工具。强烈建议你安装它，以获得更好的性能。

<h3>Java 开发工具包</h3>

我们建议使用 [Homebrew](https://brew.sh/) 安装名为 Azul **Zulu** 的 OpenJDK 发行版。安装好 Homebrew 后，请在终端中运行以下命令：

```shell
brew install --cask zulu@17

# 获取 cask 的安装路径，以便找到 JDK 安装程序
brew info --cask zulu@17

# ==> zulu@17: <version number>
# https://www.azul.com/downloads/
# 已安装
# /opt/homebrew/Caskroom/zulu@17/<version number> (185.8MB) (注意：在非 Apple Silicon Mac 上，该路径为 /usr/local/Caskroom)
# 已使用 formulae.brew.sh API 于 2024-06-06 10:00:00 安装

# 进入该文件夹
open /opt/homebrew/Caskroom/zulu@17/<version number> # or /usr/local/Caskroom/zulu@17/<version number>
```

打开 Finder 后，双击 `Double-Click to Install Azul Zulu JDK 17.pkg` 安装包以安装 JDK。

JDK 安装完成后，请在 `~/.zshrc`（或 `~/.bash_profile`）中添加或更新你的 `JAVA_HOME` 环境变量。

如果你使用了上述步骤，JDK 很可能位于 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`：

```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Zulu OpenJDK 发行版同时提供适用于 **Intel 和 M1 Mac** 的 JDK。与使用基于 Intel 的 JDK 相比，这将确保你在 M1 Mac 上的构建速度更快。

如果你的系统中已经安装了 JDK，我们建议使用 JDK 17。使用更高版本的 JDK 可能会遇到问题。

<h3>Android 开发环境</h3>

如果你是 Android 开发新手，搭建开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，则可能只需要配置少数几项内容。无论哪种情况，请务必仔细按照接下来的几个步骤进行。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保勾选以下所有项目旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后点击 “Next” 安装所有这些组件。

:::note
如果复选框呈灰色，你仍然可以在后续步骤中安装这些组件。
:::

设置完成并显示欢迎界面后，请继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。然而，构建带有原生代码的 React Native 应用，特别需要 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装额外的 Android SDK。

要执行此操作，请打开 Android Studio，点击 “More Actions” 按钮并选择 “SDK Manager”。

![Android Studio Welcome](/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

:::tip
你也可以在 Android Studio 的 “Settings” 对话框中找到 SDK Manager，路径为 **Languages & Frameworks** → **Android SDK**。
:::

在 SDK Manager 中选择 “SDK Platforms” 选项卡，然后勾选右下角的 “Show Package Details”。找到并展开 `Android 15 (VanillaIceCream)` 项，然后确保勾选以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image` 或（对于 Apple M1 Silicon）`Google APIs ARM 64 v8a System Image`

接下来，选择 “SDK Tools” 选项卡，并同样勾选 “Show Package Details”。找到并展开 “Android SDK Build-Tools” 项，然后确保选中了 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击 “Apply” 下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，以便构建带有原生代码的应用。

将以下行添加到你的 `~/.zprofile` 或 `~/.zshrc`（如果你使用的是 `bash`，则添加到 `~/.bash_profile` 或 `~/.bashrc`）配置文件中：

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

运行 `source ~/.zprofile`（或在 `bash` 中运行 `source ~/.bash_profile`）将配置加载到当前 shell 中。通过运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否已设置，并通过运行 `echo $PATH` 验证相应目录是否已添加到你的路径中。

:::note
请务必使用正确的 Android SDK 路径。你可以在 Android Studio 的 “Settings” 对话框中找到 SDK 的实际位置，路径为 **Languages & Frameworks** → **Android SDK**。
:::

<h2>准备 Android 设备</h2>

你需要一台 Android 设备来运行你的 React Native Android 应用。它可以是真实的 Android 设备，或者更常见地，你可以使用 Android 虚拟设备（AVD），它允许你在电脑上模拟一台 Android 设备。

无论哪种方式，你都需要先准备好设备，以便运行用于开发的 Android 应用。

<h3>使用实体设备</h3>

如果你有一台实体 Android 设备，你可以通过 USB 数据线将其连接到电脑，并按照[这里](running-on-device.md)的说明进行操作，用它来替代 AVD 进行开发。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，可以通过在 Android Studio 中打开 “AVD Manager” 查看可用 Android 虚拟设备（AVD）列表。寻找一个看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果你最近才安装 Android Studio，可能需要[创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择 “Create Virtual Device...”，然后从列表中选择任意一款手机并点击 “Next”，接着选择 **VanillaIceCream** API Level 35 镜像。

点击 “Next”，然后点击 “Finish” 创建你的 AVD。此时，你应该可以点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你已成功设置好开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)。
- 如果你想进一步了解 React Native，请查看[React Native 简介](getting-started)。
