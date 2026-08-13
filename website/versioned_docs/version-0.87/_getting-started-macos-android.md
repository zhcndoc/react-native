## 安装依赖

你将需要 Node、Watchman、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用任意喜欢的编辑器来开发应用，但你需要安装 Android Studio，以便设置必要的工具来构建适用于 Android 的 React Native 应用。

<h3>Node 和 Watchman</h3>

我们建议使用 [Homebrew](https://brew.sh/) 安装 Node 和 Watchman。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install node
brew install watchman
```

如果你已经在系统上安装了 Node，请确保其版本为 Node 22.11.0 或更高版本。

[Watchman](https://facebook.github.io/watchman) 是 Facebook 开发的用于监视文件系统变化的工具。强烈建议你安装它，以获得更好的性能。

<h3>Java Development Kit</h3>

我们建议使用 [Homebrew](https://brew.sh/) 安装名为 Azul **Zulu** 的 OpenJDK 发行版。安装 Homebrew 后，在终端中运行以下命令：

```shell
brew install --cask zulu@17

# Get path to where cask was installed to find the JDK installer
brew info --cask zulu@17

# ==> zulu@17: <version number>
# https://www.azul.com/downloads/
# Installed
# /opt/homebrew/Caskroom/zulu@17/<version number> (185.8MB) (note that the path is /usr/local/Caskroom on non-Apple Silicon Macs)
# Installed using the formulae.brew.sh API on 2024-06-06 at 10:00:00

# Navigate to the folder
open /opt/homebrew/Caskroom/zulu@17/<version number> # or /usr/local/Caskroom/zulu@17/<version number>
```

打开 Finder 后，双击 `Double-Click to Install Azul Zulu JDK 17.pkg` 软件包以安装 JDK。

安装 JDK 后，在 `~/.zshrc` 中添加或更新 `JAVA_HOME` 环境变量（或在 `~/.bash_profile` 中进行操作）。

如果你使用了上述步骤，JDK 很可能位于 `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`：

```shell
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Zulu OpenJDK 发行版为 **Intel 和 M1 Mac** 提供 JDK。这将确保在 M1 Mac 上构建时，相比使用基于 Intel 的 JDK，速度更快。

如果你已经在系统上安装了 JDK，我们建议使用 JDK 17。使用更高版本的 JDK 可能会遇到问题。

<h3>Android 开发环境</h3>

如果你不熟悉 Android 开发，设置开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，仍然可能需要配置一些内容。无论哪种情况，请务必仔细按照接下来的几个步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保以下所有项目旁边的复选框都已选中：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后，点击“Next”以安装所有这些组件。

:::note
如果复选框显示为灰色，你之后仍有机会安装这些组件
:::

设置完成并显示 Welcome 屏幕后，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认会安装最新的 Android SDK。然而，使用原生代码构建 React Native 应用需要特定的 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK。

为此，打开 Android Studio，点击“More Actions”按钮，然后选择“SDK Manager”。

![Android Studio Welcome](/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

:::tip
也可以在 Android Studio 的“Settings”对话框中找到 SDK Manager，路径为 **Languages & Frameworks** → **Android SDK**
:::

在 SDK Manager 中选择“SDK Platforms”选项卡，然后勾选右下角的“Show Package Details”旁边的复选框。找到并展开 `Android 15 (VanillaIceCream)` 条目，然后确保选中以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`，或（对于 Apple M1 Silicon）`Google APIs ARM 64 v8a System Image`

接下来，选择“SDK Tools”选项卡，并同样勾选此处“Show Package Details”旁边的复选框。找到并展开“Android SDK Build-Tools”条目，然后确保已选择 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击“Apply”以下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，才能使用原生代码构建应用。

将以下几行添加到 `~/.zprofile` 或 `~/.zshrc` 配置文件中（如果使用 `bash`，则添加到 `~/.bash_profile` 或 `~/.bashrc`）：

```shell
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

运行 `source ~/.zprofile`（对于 `bash`，运行 `source ~/.bash_profile`），将配置加载到当前 shell 中。运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否已设置，并运行 `echo $PATH` 验证相应目录是否已添加到路径中。

:::note
请确保使用正确的 Android SDK 路径。你可以在 Android Studio 的“Settings”对话框中找到 SDK 的实际位置，路径为 **Languages & Frameworks** → **Android SDK**
:::

<h2>准备 Android 设备</h2>

你将需要一台 Android 设备来运行 React Native Android 应用。这可以是一台实体 Android 设备，也可以更常见地使用 Android Virtual Device，它允许你在计算机上模拟 Android 设备。

无论采用哪种方式，你都需要准备好设备，以便在开发过程中运行 Android 应用。

<h3>使用实体设备</h3>

如果你有实体 Android 设备，可以通过 USB 数据线将其连接到计算机，并按照[此处](running-on-device.md)的说明进行操作，从而使用它进行开发，代替 AVD。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，可以在 Android Studio 中打开“AVD Manager”，查看可用的 Android Virtual Devices（AVD）列表。找到类似于以下图标的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果你最近安装了 Android Studio，可能需要[创建新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“Create Virtual Device...”，然后从列表中选择任意 Phone 并点击“Next”，接着选择 **VanillaIceCream** API Level 35 镜像。

点击“Next”，然后点击“Finish”来创建 AVD。此时，你应该可以点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你已成功设置开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)
- 如果你想进一步了解 React Native，请查看[React Native 简介](getting-started)
