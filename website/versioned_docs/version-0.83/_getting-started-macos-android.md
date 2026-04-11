## 安装依赖

您需要 Node、Watchman、React Native 命令行接口、JDK 以及 Android Studio。

虽然您可以使用任意您喜欢的编辑器来开发您的应用，但您需要安装 Android Studio 以设置构建 React Native 安卓应用所需的工具。

<h3>Node &amp; Watchman</h3>

我们推荐使用 [Homebrew](https://brew.sh/) 来安装 Node 和 Watchman。安装完 Homebrew 后，在终端运行以下命令：

```shell
brew install node
brew install watchman
```

如果您已经在系统上安装了 Node，确保版本是 20.19.4 或更高。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 开发的一个用于监控文件系统变化的工具。强烈建议安装它以获得更好的性能。

<h3>Java 开发工具包</h3>

我们推荐使用 [Homebrew](https://brew.sh/) 安装名为 Azul **Zulu** 的 OpenJDK 发行版。安装完 Homebrew 后，在终端运行以下命令：

```shell
brew install --cask zulu@17

# 获取 cask 安装路径以找到 JDK 安装包
brew info --cask zulu@17

# ==> zulu@17: <版本号>
# https://www.azul.com/downloads/
# 已安装
# /opt/homebrew/Caskroom/zulu@17/<版本号> (185.8MB)（非 Apple Silicon Mac 路径为 /usr/local/Caskroom）
# 使用 formulae.brew.sh API 于 2024-06-06 10:00:00 安装

# 进入该文件夹
open /opt/homebrew/Caskroom/zulu@17/<版本号> # 或 /usr/local/Caskroom/zulu@17/<版本号>
```

打开 Finder 后，双击 `Double-Click to Install Azul Zulu JDK 17.pkg` 安装 JDK。

安装完成后，在 `~/.zshrc`（或 `~/.bash_profile`）中添加或更新 `JAVA_HOME` 环境变量。

如果使用上述步骤，JDK 通常位于 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`：

```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Zulu OpenJDK 发行版为 **Intel 和 M1 Mac** 都提供 JDK。这将保证在 M1 Mac 上构建速度比使用基于 Intel 的 JDK 更快。

如果您已经安装了 JDK，推荐使用 JDK 17。使用更高版本的 JDK 可能会遇到问题。

<h3>Android 开发环境</h3>

如果您是 Android 开发新手，设置开发环境可能略显繁琐。如果您已经熟悉 Android 开发，可能只需进行一些配置。无论哪种情况，都请务必仔细按照接下来的步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在安装向导中，确保以下所有选项处于勾选状态：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后点击"Next"安装所有组件。

:::note
如果复选框为灰色，您可以稍后安装这些组件。
:::

安装完成后，出现欢迎界面，继续进行下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。然而，使用原生代码构建 React Native 应用，需要特定的 `Android 15 (VanillaIceCream)` SDK。您可以通过 Android Studio 的 SDK 管理器安装额外的 Android SDK。

操作步骤：打开 Android Studio，点击"More Actions"按钮，选择"SDK Manager"。

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

:::tip
SDK 管理器也可以在 Android Studio“设置”对话框中找到，路径为 **Languages & Frameworks** → **Android SDK**。
:::

在 SDK 管理器中选择"SDK Platforms"标签页，右下角勾选"Show Package Details"。找到并展开 `Android 15 (VanillaIceCream)`，确保勾选以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`，如果是 Apple M1 Silicon，选择 `Google APIs ARM 64 v8a System Image`

接着，选择"SDK Tools"标签页，同样勾选"Show Package Details"。展开"Android SDK Build-Tools"，确保选中 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击"Apply"下载并安装 Android SDK 和相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量以便构建原生代码应用。

在 `~/.zprofile` 或 `~/.zshrc`（bash 用户则是 `~/.bash_profile` 或 `~/.bashrc`）配置文件中添加以下内容：

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

运行 `source ~/.zprofile`（bash 用户运行 `source ~/.bash_profile`）使配置生效。通过运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否设置正确，通过运行 `echo $PATH` 验证相应目录是否加入路径。

:::note
请确保使用正确的 Android SDK 路径。可以在 Android Studio“设置”对话框中查看，路径为 **Languages & Frameworks** → **Android SDK**。
:::

<h2>准备安卓设备</h2>

您需要一台安卓设备来运行 React Native 安卓应用。可以是真实的安卓设备，也常用安卓虚拟设备（AVD）在电脑上模拟安卓设备。

无论哪种，都需要对设备进行配置以支持开发运行安卓应用。

<h3>使用实体设备</h3>

如果您有实体安卓设备，可以通过 USB 数据线连接到电脑，按 [这里](running-on-device.md) 的指导进行设置，代替虚拟设备使用。

<h3>使用虚拟设备</h3>

如果用 Android Studio 打开 `./AwesomeProject/android`，可以通过 Android Studio 内部的"AVD Manager"查看可用的安卓虚拟设备。找一个如下图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果刚安装的 Android Studio，您可能需要 [新建 AVD](https://developer.android.com/studio/run/managing-avds.html)。点击"Create Virtual Device..."，选择任意手机型号，点击"Next"，然后选择 **VanillaIceCream** API 级别 35 的系统镜像。

点击"Next"然后"Finish"完成 AVD 创建。此时您可以点击绿色三角按钮启动虚拟设备。

<h3>完成！</h3>

恭喜！您已成功搭建开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果想将新的 React Native 代码集成到已有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果想深入了解 React Native，请查看 [React Native 介绍](getting-started)。