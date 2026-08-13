<h2>安装依赖项</h2>

您将需要 Node、React Native 命令行界面、JDK 和 Android Studio

虽然您可以使用自己选择的任何编辑器来开发应用，但您需要安装 Android Studio，以便设置构建 Android 版 React Native 应用所需的工具

<h3 id="jdk">Node、JDK</h3>

我们建议通过 [Chocolatey](https://chocolatey.org/install) 安装 Node，Chocolatey 是一个适用于 Windows 的热门软件包管理器

建议使用 Node 的 LTS 版本。如果您希望能够在不同版本之间切换，可以通过 [nvm-windows](https://github.com/coreybutler/nvm-windows) 安装 Node，nvm-windows 是一个适用于 Windows 的 Node 版本管理器

React Native 还需要 [Java SE Development Kit（JDK）](https://openjdk.java.net/projects/jdk/17/)，同样可以使用 Chocolatey 进行安装

打开管理员命令提示符（右键单击命令提示符并选择“以管理员身份运行”），然后运行以下命令：

```powershell
choco install -y nodejs-lts microsoft-openjdk17
```

如果您已经在系统上安装了 Node，请确保其版本为 Node 22.11.0 或更高版本。如果您已经在系统上安装了 JDK，我们建议使用 JDK17。使用更高版本的 JDK 可能会遇到问题

:::note
您可以在 [Node 的下载页面](https://nodejs.org/en/download/)上找到其他安装选项
:::

:::info
如果您使用的是最新版本的 Java Development Kit，则需要更改项目的 Gradle 版本，以便其能够识别 JDK。您可以前往 `{project root folder}\android\gradle\wrapper\gradle-wrapper.properties`，更改 `distributionUrl` 值以升级 Gradle 版本。您可以在[这里查看 Gradle 的最新版本](https://gradle.org/releases/)
:::

<h3>Android 开发环境</h3>

如果您不熟悉 Android 开发，设置开发环境可能会有些繁琐。如果您已经熟悉 Android 开发，仍有一些内容可能需要配置。无论哪种情况，请务必仔细遵循接下来的步骤

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保选中以下所有项目旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`
- 如果您尚未使用 Hyper-V：`Performance (Intel ® HAXM)`（[AMD 或 Hyper-V 请参阅此处](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html)）

然后，点击“Next”安装所有这些组件

:::note
如果复选框显示为灰色，您之后仍有机会安装这些组件
:::

设置完成并显示 Welcome 屏幕后，继续下一步

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认会安装最新的 Android SDK。不过，使用原生代码构建 React Native 应用时，需要特别使用 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK

为此，请打开 Android Studio，点击“More Actions”按钮，然后选择“SDK Manager”

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

:::tip
也可以在 Android Studio 的“Settings”对话框中找到 SDK Manager，路径为 **Languages & Frameworks** → **Android SDK**
:::

在 SDK Manager 中选择“SDK Platforms”选项卡，然后选中右下角的“Show Package Details”旁边的复选框。找到并展开 `Android 15 (VanillaIceCream)` 条目，然后确保选中以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择“SDK Tools”选项卡，并同样选中“Show Package Details”旁边的复选框。找到并展开 `Android SDK Build-Tools` 条目，然后确保选中 `36.0.0` 和 `Android SDK Command-line Tools (latest)`

最后，点击“Apply”下载并安装 Android SDK 及相关构建工具

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，才能使用原生代码构建应用

1. 打开 **Windows 控制面板**
2. 点击 **User Accounts**，然后再次点击 **User Accounts**
3. 点击 **Change my environment variables**
4. 点击 **New...**，创建一个新的 `ANDROID_HOME` 用户变量，使其指向 Android SDK 的路径：

![ANDROID_HOME 环境变量](/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

SDK 默认安装在以下位置：

```powershell
%LOCALAPPDATA%\Android\Sdk
```

您可以在 Android Studio 的“Settings”对话框中找到 SDK 的实际位置，路径为 **Languages & Frameworks** → **Android SDK**

打开一个新的命令提示符窗口，以确保在继续下一步之前加载新的环境变量

1. 打开 powershell
2. 将 **Get-ChildItem -Path Env:\\** 复制并粘贴到 powershell 中
3. 验证是否已添加 `ANDROID_HOME`

<h4>4. 将 platform-tools 添加到 Path</h4>

1. 打开 **Windows 控制面板**
2. 点击 **User Accounts**，然后再次点击 **User Accounts**
3. 点击 **Change my environment variables**
4. 选择 **Path** 变量
5. 点击 **Edit**
6. 点击 **New**，并将 platform-tools 的路径添加到列表中

此文件夹的默认位置为：

```powershell
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

<h2>准备 Android 设备</h2>

您需要一台 Android 设备来运行 React Native Android 应用。这可以是一台实体 Android 设备，或者更常见的是，您可以使用 Android Virtual Device，它允许您在计算机上模拟 Android 设备

无论哪种方式，您都需要准备好设备，以便在开发过程中运行 Android 应用

<h3>使用实体设备</h3>

如果您有实体 Android 设备，可以通过 USB 数据线将其连接到计算机，并按照[此处](running-on-device.md)的说明操作，从而使用它进行开发，代替 AVD

<h3>使用虚拟设备</h3>

如果您使用 Android Studio 打开 `./AwesomeProject/android`，可以在 Android Studio 中打开“AVD Manager”，查看可用的 Android Virtual Device（AVD）列表。找到类似下面的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果您最近安装了 Android Studio，可能需要[创建新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“Create Virtual Device...”，然后从列表中选择任意 Phone 并点击“Next”，接着选择 **VanillaIceCream** API Level 35 镜像

:::note
如果您尚未安装 HAXM，请点击“Install HAXM”，或按照[这些说明](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows)进行设置，然后返回 AVD Manager
:::

点击“Next”，然后点击“Finish”创建 AVD。此时，您应该可以点击 AVD 旁边的绿色三角形按钮来启动它

<h3>就是这样！</h3>

恭喜！您已成功设置开发环境

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果您想将新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)
- 如果您想进一步了解 React Native，请查看 [React Native 简介](getting-started)
