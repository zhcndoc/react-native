## 安装依赖

您将需要 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然您可以使用自己喜欢的任何编辑器来开发应用，但您仍需要安装 Android Studio，以便配置构建 React Native Android 应用所需的工具链。

<h3>Node</h3>

请按照 [Linux 发行版的安装说明](https://nodejs.org/en/download/package-manager/) 安装 Node 22.11.0 或更高版本。

<h3>Java Development Kit</h3>

React Native 目前推荐使用 Java SE Development Kit（JDK）17 版本。使用更高版本的 JDK 可能会遇到问题。您可以从 [AdoptOpenJDK](https://adoptopenjdk.net/) 或系统的软件包管理器下载并安装 [OpenJDK](https://openjdk.java.net)。

<h3>Android 开发环境</h3>

如果您对 Android 开发还不熟悉，配置开发环境可能会比较繁琐。如果您已经熟悉 Android 开发，那么可能只需要配置少数几项。无论哪种情况，请务必仔细按照接下来的几个步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保勾选以下所有项旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后，点击“Next”以安装所有这些组件。

:::note
如果复选框呈灰色，您稍后仍有机会安装这些组件。
:::

安装完成并显示欢迎界面后，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认会安装最新的 Android SDK。不过，构建带有原生代码的 React Native 应用特别需要 `Android 15 (VanillaIceCream)` SDK。您可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK。

为此，请打开 Android Studio，点击“Configure”按钮并选择“SDK Manager”。

:::tip
您也可以在 Android Studio 的“Settings”对话框中找到 SDK Manager，路径为 **Languages & Frameworks** → **Android SDK**。
:::

在 SDK Manager 中选择“SDK Platforms”选项卡，然后勾选右下角的“Show Package Details”。找到并展开 `Android 15 (VanillaIceCream)` 条目，然后确保勾选以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择“SDK Tools”选项卡，并同样勾选“Show Package Details”。找到并展开“Android SDK Build-Tools”条目，然后确保已选择 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击“Apply”以下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要配置一些环境变量，才能构建带有原生代码的应用。

将以下内容添加到您的 `$HOME/.bash_profile` 或 `$HOME/.bashrc`（如果您使用的是 `zsh`，则添加到 `~/.zprofile` 或 `~/.zshrc`）配置文件中：

```shell
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

:::note
`.bash_profile` 是 `bash` 专用的。如果您使用的是其他 shell，则需要编辑对应的 shell 专用配置文件。
:::

对于 `bash`，输入 `source $HOME/.bash_profile`；对于 `zsh`，输入 `source $HOME/.zprofile`，以将配置加载到当前 shell 中。通过运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否已设置，并通过运行 `echo $PATH` 验证相应目录是否已添加到您的 path 中。

:::note
请务必使用正确的 Android SDK 路径。您可以在 Android Studio 的“Settings”对话框中，**Languages & Frameworks** → **Android SDK** 下找到 SDK 的实际位置。
:::

<h3>Watchman</h3>

请按照 [Watchman 安装指南](https://facebook.github.io/watchman/docs/install#buildinstall) 从源代码编译并安装 Watchman。

:::info
[Watchman](https://facebook.github.io/watchman/docs/install) 是 Facebook 提供的用于监视文件系统变化的工具。强烈建议您安装它，以获得更好的性能，并在某些边缘情况下提高兼容性（翻译：您也许可以不安装它，但实际效果因人而异；现在安装它，可能会让您以后少些麻烦）。
:::

<h2>准备 Android 设备</h2>

您需要一台 Android 设备来运行 React Native Android 应用。这可以是一台实体 Android 设备；更常见的是，您也可以使用 Android Virtual Device，它允许您在电脑上模拟一台 Android 设备。

无论采用哪种方式，您都需要先将设备准备好，以便运行用于开发的 Android 应用。

<h3>使用实体设备</h3>

如果您有一台实体 Android 设备，您可以通过 USB 数据线将其连接到电脑，并按照[这里](running-on-device.md)的说明进行操作，用它替代 AVD 进行开发。

<h3>使用虚拟设备</h3>

如果您使用 Android Studio 打开 `./AwesomeProject/android`，可以通过在 Android Studio 中打开“AVD Manager”查看可用 Android Virtual Devices（AVD）列表。寻找一个看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果您最近才安装 Android Studio，很可能还需要[创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“Create Virtual Device...”，然后从列表中选择任意一款 Phone 并点击“Next”，接着选择 **VanillaIceCream** API Level 35 镜像。

:::tip
我们建议在您的系统上配置[VM 加速](https://developer.android.com/studio/run/emulator-acceleration.html#vm-linux)以提升性能。完成这些说明后，请返回 AVD Manager。
:::

点击“Next”，然后点击“Finish”以创建您的 AVD。此时，您应该可以点击 AVD 旁边的绿色三角按钮来启动它。

<h3>就是这样！</h3>

恭喜！您已成功设置开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果您想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)。
- 如果您想进一步了解 React Native，请查看[React Native 简介](getting-started)。
