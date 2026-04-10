## 安装依赖

你将需要 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用任何编辑器来开发应用，但你需要安装 Android Studio 以便设置必要的工具来构建你的 React Native Android 应用。

<h3>Node</h3>

遵循 [你的 Linux 发行版的安装说明](https://nodejs.org/en/download/package-manager/) 来安装 Node 22.11.0 或更新版本。

<h3>Java Development Kit</h3>

React Native 目前推荐使用 Java SE Development Kit (JDK) 版本 17。使用更高版本的 JDK 可能会遇到问题。你可以从 [AdoptOpenJDK](https://adoptopenjdk.net/) 或你的系统包管理器下载并安装 [OpenJDK](https://openjdk.java.net)。

<h3>Android 开发环境</h3>

如果你是 Android 开发新手，设置开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，可能只需要配置几件事。无论哪种情况，请务必仔细遵循以下步骤。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，确保以下所有项目旁边的复选框都被勾选：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后，点击 "Next" 安装所有这些组件。

:::note
如果复选框是灰色的，你稍后会有机会安装这些组件。
:::

一旦设置完成并显示欢迎屏幕，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。然而，构建带有原生代码的 React Native 应用特别需要 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装额外的 Android SDK。

为此，打开 Android Studio，点击 "Configure" 按钮并选择 "SDK Manager"。

:::tip
SDK Manager 也可以在 Android Studio 的 "Settings" 对话框中找到，位于 **Languages & Frameworks** → **Android SDK** 下。
:::

在 SDK Manager 中选择 "SDK Platforms" 选项卡，然后勾选右下角 "Show Package Details" 旁边的复选框。查找并展开 `Android 15 (VanillaIceCream)` 条目，然后确保勾选了以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择 "SDK Tools" 选项卡，并在此处也勾选 "Show Package Details" 旁边的复选框。查找并展开 "Android SDK Build-Tools" 条目，然后确保选择了 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击 "Apply" 下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量才能构建带有原生代码的应用。

将以下行添加到你的 `$HOME/.bash_profile` 或 `$HOME/.bashrc` 配置文件（如果你使用 `zsh`，则是 `~/.zprofile` 或 `~/.zshrc`）：

```shell
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

:::note
`.bash_profile` 是 `bash` 特有的。如果你使用另一个 shell，你需要编辑相应的特定于 shell 的配置文件。
:::

对于 `bash` 输入 `source $HOME/.bash_profile` 或 `source $HOME/.zprofile` 将配置加载到当前 shell 中。通过运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否已设置，并通过运行 `echo $PATH` 验证适当的目录是否已添加到你的路径中。

:::note
请确保你使用正确的 Android SDK 路径。你可以在 Android Studio 的 "Settings" 对话框中找到 SDK 的实际位置，位于 **Languages & Frameworks** → **Android SDK** 下。
:::

<h3>Watchman</h3>

遵循 [Watchman 安装指南](https://facebook.github.io/watchman/docs/install#buildinstall) 从源码编译并安装 Watchman。

:::info
[Watchman](https://facebook.github.io/watchman/docs/install) 是 Facebook 提供的一个用于监视文件系统变化的工具。强烈建议你安装它以获得更好的性能并在某些边缘情况下增加兼容性（翻译：你可能可以不安装这个就能应付过去，但具体情况因人而异；现在安装这个可能会让你以后省去麻烦）。
:::

<h2>准备 Android 设备</h2>

你将需要一个 Android 设备来运行你的 React Native Android 应用。这可以是物理 Android 设备，或者更常见的是，你可以使用 Android 虚拟设备，它允许你在计算机上模拟 Android 设备。

无论哪种方式，你都需要准备设备以运行用于开发的 Android 应用。

<h3>使用物理设备</h3>

如果你拥有物理 Android 设备，你可以使用它来代替 AVD 进行开发，只需使用 USB 电缆将其连接到计算机并按照 [此处](running-on-device.md) 的说明操作。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，你可以通过打开 Android Studio 内的 "AVD Manager" 查看可用的 Android 虚拟设备 (AVD) 列表。查找看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果你最近安装了 Android Studio，可能需要 [创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择 "Create Virtual Device..."，然后从列表中选择任意 Phone 并点击 "Next"，然后选择 **VanillaIceCream** API Level 35 镜像。

:::tip
我们建议在系统上配置 [VM 加速](https://developer.android.com/studio/run/emulator-acceleration.html#vm-linux) 以提高性能。一旦你遵循了这些说明，返回 AVD Manager。
:::

点击 "Next" 然后点击 "Finish" 创建你的 AVD。此时你应该能够点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你成功设置了开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将此新的 React Native 代码添加到现有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果你好奇想了解更多关于 React Native 的信息，请查看 [React Native 介绍](getting-started)。
