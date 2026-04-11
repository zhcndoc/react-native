<h2>安装依赖</h2>

你需要 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然你可以使用任何编辑器来开发应用，但你需要安装 Android Studio 以便设置必要的工具来构建你的 React Native Android 应用。

<h3 id="jdk">Node, JDK</h3>

我们建议通过 [Chocolatey](https://chocolatey.org/install) 安装 Node，这是一个流行的 Windows 包管理器。

建议使用 Node 的 LTS 版本。如果你想要在不同版本之间切换，你可能想通过 [nvm-windows](https://github.com/coreybutler/nvm-windows) 安装 Node，这是一个 Windows 的 Node 版本管理器。

React Native 还需要 [Java SE Development Kit (JDK)](https://openjdk.java.net/projects/jdk/17/)，也可以使用 Chocolatey 安装。

打开管理员命令提示符（右键点击命令提示符并选择"Run as Administrator"），然后运行以下命令：

```powershell
choco install -y nodejs-lts microsoft-openjdk17
```

如果你已经在系统上安装了 Node，请确保它是 Node 20.19.4 或更新版本。如果你已经在系统上有了 JDK，我们推荐 JDK17。使用更高版本的 JDK 可能会遇到问题。

:::note
你可以在 [Node 的下载页面](https://nodejs.org/en/download/) 找到额外的安装选项。
:::

:::info
如果你使用的是最新版本的 Java Development Kit，你需要更改项目的 Gradle 版本以便它能识别 JDK。你可以通过进入 `{project root folder}\android\gradle\wrapper\gradle-wrapper.properties` 并更改 `distributionUrl` 值来升级 Gradle 版本。你可以在 [这里查看 Gradle 的最新版本](https://gradle.org/releases/)。
:::

<h3>Android 开发环境</h3>

如果你是 Android 开发新手，设置开发环境可能会有些繁琐。如果你已经熟悉 Android 开发，有几件事你可能需要配置。无论哪种情况，请务必仔细遵循以下步骤。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，确保以下所有项目旁边的复选框都被勾选：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`
- 如果你尚未使用 Hyper-V：`Performance (Intel ® HAXM)` ([参见此处了解 AMD 或 Hyper-V](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))

然后，点击"Next"安装所有这些组件。

:::note
如果复选框是灰色的，你稍后会有机会安装这些组件。
:::

一旦设置完成并显示欢迎屏幕，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。然而，构建带有原生代码的 React Native 应用特别需要 `Android 15 (VanillaIceCream)` SDK。额外的 Android SDK 可以通过 Android Studio 中的 SDK Manager 安装。

为此，打开 Android Studio，点击"More Actions"按钮并选择"SDK Manager"。

![Android Studio 欢迎](/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

:::tip
SDK Manager 也可以在 Android Studio 的"Settings"对话框中找到，位于 **Languages & Frameworks** → **Android SDK** 下。
:::

在 SDK Manager 中选择"SDK Platforms"标签，然后勾选右下角"Show Package Details"旁边的复选框。查找并展开 `Android 15 (VanillaIceCream)` 条目，然后确保以下项目被勾选：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择"SDK Tools"标签，并在此处也勾选"Show Package Details"旁边的复选框。查找并展开 `Android SDK Build-Tools` 条目，然后确保选中了 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击"Apply"下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量才能构建带有原生代码的应用。

1. 打开 **Windows 控制面板。**
2. 点击 **用户账户，** 然后再次点击 **用户账户**
3. 点击 **更改我的环境变量**
4. 点击 **新建...** 创建一个新的 `ANDROID_HOME` 用户变量，指向你的 Android SDK 路径：

![ANDROID_HOME 环境变量](/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

SDK 默认安装在以下位置：

```powershell
%LOCALAPPDATA%\Android\Sdk
```

你可以在 Android Studio 的"Settings"对话框中找到 SDK 的实际位置，位于 **Languages & Frameworks** → **Android SDK** 下。

打开一个新的命令提示符窗口以确保新的环境变量在继续下一步之前被加载。

1. 打开 powershell
2. 复制并粘贴 **Get-ChildItem -Path Env:\\** 到 powershell
3. 验证 `ANDROID_HOME` 已被添加

<h4>4. 将 platform-tools 添加到 Path</h4>

1. 打开 **Windows 控制面板。**
2. 点击 **用户账户，** 然后再次点击 **用户账户**
3. 点击 **更改我的环境变量**
4. 选择 **Path** 变量。
5. 点击 **编辑。**
6. 点击 **新建** 并将 platform-tools 的路径添加到列表中。

此文件夹的默认位置是：

```powershell
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

<h2>准备 Android 设备</h2>

你需要一个 Android 设备来运行你的 React Native Android 应用。这可以是物理 Android 设备，或者更常见的是，你可以使用 Android 虚拟设备，它允许你在电脑上模拟一个 Android 设备。

无论哪种方式，你都需要准备设备以运行用于开发的 Android 应用。

<h3>使用物理设备</h3>

如果你有一个物理 Android 设备，你可以通过 USB 线将其连接到电脑并按照 [此处](running-on-device.md) 的说明使用它进行开发，以代替 AVD。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，你可以通过打开 Android Studio 内的"AVD Manager"查看可用的 Android 虚拟设备 (AVDs) 列表。寻找一个看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果你最近安装了 Android Studio，你可能需要 [创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择"Create Virtual Device..."，然后从列表中选择任意手机并点击"Next"，然后选择 **VanillaIceCream** API Level 35 镜像。

:::note
如果你没有安装 HAXM，点击"Install HAXM"或遵循 [这些说明](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows) 进行设置，然后返回 AVD Manager。
:::

点击"Next"然后点击"Finish"创建你的 AVD。此时你应该能够点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！你成功设置了开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果你想将此新的 React Native 代码添加到现有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果你好奇想了解更多关于 React Native 的信息，请查看 [React Native 介绍](getting-started)。
