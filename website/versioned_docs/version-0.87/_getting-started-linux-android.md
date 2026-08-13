## 安装依赖

你需要安装 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用自己选择的任何编辑器来开发应用，但你需要安装 Android Studio，以便设置构建 Android 版 React Native 应用所需的工具。

<h3>Node</h3>

按照[适用于你的 Linux 发行版的安装说明](https://nodejs.org/en/download/package-manager/)安装 Node 22.11.0 或更高版本。

<h3>Java Development Kit</h3>

React Native 目前推荐使用 Java SE Development Kit（JDK）17 版。使用更高版本的 JDK 可能会遇到问题。你可以从 [AdoptOpenJDK](https://adoptopenjdk.net/) 或系统软件包管理器下载并安装 [OpenJDK](https://openjdk.java.net)。

<h3>Android 开发环境</h3>

如果你不熟悉 Android 开发，设置开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，可能仍需要配置一些内容。无论是哪种情况，请务必仔细遵循接下来的步骤。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保勾选以下所有项目旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后点击“下一步”安装所有这些组件。

:::note
如果复选框显示为灰色，你之后仍有机会安装这些组件
:::

设置完成并显示欢迎界面后，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认会安装最新的 Android SDK。但是，使用原生代码构建 React Native 应用需要特别使用 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK。

为此，请打开 Android Studio，点击“配置”按钮，然后选择“SDK Manager”。

:::tip
也可以在 Android Studio 的“设置”对话框中找到 SDK Manager，路径为**语言和框架** → **Android SDK**
:::

在 SDK Manager 中选择“SDK Platforms”选项卡，然后勾选右下角的“Show Package Details”旁边的复选框。找到并展开 `Android 15 (VanillaIceCream)` 条目，然后确保勾选以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择“SDK Tools”选项卡，并同样勾选此处“Show Package Details”旁边的复选框。找到并展开“Android SDK Build-Tools”条目，然后确保选中 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击“应用”下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，才能使用原生代码构建应用。

将以下几行添加到 `$HOME/.bash_profile` 或 `$HOME/.bashrc`（如果使用 `zsh`，则添加到 `~/.zprofile` 或 `~/.zshrc`）配置文件中：

```shell
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

:::note
`.bash_profile` 专用于 `bash`。如果你使用其他 shell，则需要编辑相应的 shell 专用配置文件
:::

对于 `bash`，输入 `source $HOME/.bash_profile`；对于 `zsh`，输入 `source $HOME/.zprofile`，以便将配置加载到当前 shell 中。运行 `echo $ANDROID_HOME`，验证是否已设置 ANDROID_HOME；运行 `echo $PATH`，验证相应目录是否已添加到路径中。

:::note
请确保使用正确的 Android SDK 路径。你可以在 Android Studio 的“设置”对话框中找到 SDK 的实际位置，路径为**语言和框架** → **Android SDK**
:::

<h3>Watchman</h3>

按照 [Watchman 安装指南](https://facebook.github.io/watchman/docs/install#buildinstall)从源代码编译并安装 Watchman。

:::info
[Watchman](https://facebook.github.io/watchman/docs/install) 是 Facebook 开发的用于监视文件系统变化的工具。强烈建议安装它，以获得更好的性能，并提高某些边缘情况下的兼容性（翻译：你也许可以不安装它，但实际效果可能因情况而异；现在安装它可能会让你以后少一些麻烦）
:::

<h2>准备 Android 设备</h2>

你需要一台 Android 设备来运行 React Native Android 应用。这可以是一台实体 Android 设备，也可以更常见地使用 Android Virtual Device，让你能够在计算机上模拟 Android 设备。

无论哪种方式，你都需要准备好设备，以便在开发过程中运行 Android 应用。

<h3>使用实体设备</h3>

如果你有实体 Android 设备，可以通过 USB 数据线将其连接到计算机，并按照[此处](running-on-device.md)的说明操作，以使用它进行开发，而不必使用 AVD。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，可以在 Android Studio 中打开“AVD Manager”，查看可用的 Android Virtual Device（AVD）列表。找到如下图所示的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果你最近安装了 Android Studio，可能需要[创建新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“Create Virtual Device...”，然后从列表中选择任意 Phone 并点击“下一步”，接着选择 **VanillaIceCream** API Level 35 镜像。

:::tip
我们建议在系统上配置 [VM 加速](https://developer.android.com/studio/run/emulator-acceleration.html#vm-linux)以提高性能。按照这些说明完成操作后，返回 AVD Manager
:::

点击“下一步”，然后点击“完成”创建 AVD。此时，你应该可以点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你已成功设置开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来呢？</h2>

- 如果你想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)
- 如果你想进一步了解 React Native，请查看 [React Native 简介](getting-started)
