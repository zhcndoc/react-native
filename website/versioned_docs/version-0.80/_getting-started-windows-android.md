<h2>安装依赖项</h2>

您将需要 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然您可以使用任何编辑器来开发应用，但您需要安装 Android Studio 以便设置必要的工具来构建您的 React Native Android 应用。

<h3 id="jdk">Node, JDK</h3>

我们建议通过 [Chocolatey](https://chocolatey.org/install) 安装 Node，这是 Windows 流行的包管理器。

建议使用 Node 的 LTS 版本。如果您想在不同版本之间切换，可能希望通过 [nvm-windows](https://github.com/coreybutler/nvm-windows) 安装 Node，这是 Windows 的 Node 版本管理器。

React Native 还需要 [Java SE Development Kit (JDK)](https://openjdk.java.net/projects/jdk/17/)，也可以使用 Chocolatey 安装。

打开管理员命令提示符（右键点击命令提示符并选择“以管理员身份运行”），然后运行以下命令：

```powershell
choco install -y nodejs-lts microsoft-openjdk17
```

如果您已经在系统上安装了 Node，请确保它是 Node 18 或更新版本。如果您已经在系统上有了 JDK，我们推荐 JDK17。使用更高版本的 JDK 可能会遇到问题。

> 您可以在 [Node 的下载页面](https://nodejs.org/en/download/) 找到其他安装选项。

> 如果您使用的是最新版本的 Java Development Kit，则需要更改项目的 Gradle 版本以便它能识别 JDK。您可以通过进入 `{project root folder}\android\gradle\wrapper\gradle-wrapper.properties` 并更改 `distributionUrl` 值来升级 Gradle 版本。您可以在此处查看 [Gradle 的最新版本](https://gradle.org/releases/)。

<h3>Android 开发环境</h3>

如果您是 Android 开发新手，设置开发环境可能会有些繁琐。如果您已经熟悉 Android 开发，可能有一些事情需要配置。无论哪种情况，请务必仔细遵循以下步骤。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio/index.html)。在 Android Studio 安装向导中，确保选中以下所有项目旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`
- 如果您尚未使用 Hyper-V：`Performance (Intel ® HAXM)` ([有关 AMD 或 Hyper-V 的信息请参阅此处](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))

然后，点击"Next"安装所有这些组件。

> 如果复选框呈灰色，您稍后将有机会安装这些组件。

设置完成后，当您看到欢迎屏幕时，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。然而，构建带有原生代码的 React Native 应用特别需要 `Android 15 (VanillaIceCream)` SDK。可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK。

为此，打开 Android Studio，点击"More Actions"按钮并选择"SDK Manager"。

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

> SDK Manager 也可以在 Android Studio 的"Settings"对话框中找到，位于 **Languages & Frameworks** → **Android SDK** 下。

在 SDK Manager 中选择"SDK Platforms"选项卡，然后勾选右下角"Show Package Details"旁边的复选框。查找并展开 `Android 15 (VanillaIceCream)` 条目，然后确保选中以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择"SDK Tools"选项卡，并在此处勾选"Show Package Details"旁边的复选框。查找并展开 `Android SDK Build-Tools` 条目，然后确保选中 `35.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击"Apply"下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量才能构建带有原生代码的应用。

1. 打开 **Windows 控制面板。**
2. 点击 **用户账户，** 然后再次点击 **用户账户**
3. 点击 **更改我的环境变量**
4. 点击 **新建...** 创建一个新的 `ANDROID_HOME` 用户变量，指向您的 Android SDK 路径：

![ANDROID_HOME 环境变量](/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

SDK 默认安装在以下位置：

```powershell
%LOCALAPPDATA%\Android\Sdk
```

您可以在 Android Studio 的"Settings"对话框中找到 SDK 的实际位置，位于 **Languages & Frameworks** → **Android SDK** 下。

打开一个新的命令提示符窗口以确保在继续下一步之前加载了新的环境变量。

1. 打开 powershell
2. 复制并粘贴 **Get-ChildItem -Path Env:\\** 到 powershell 中
3. 验证 `ANDROID_HOME` 已添加

<h4>4. 将 platform-tools 添加到 Path</h4>

1. 打开 **Windows 控制面板。**
2. 点击 **用户账户，** 然后再次点击 **用户账户**
3. 点击 **更改我的环境变量**
4. 选择 **Path** 变量。
5. 点击 **编辑。**
6. 点击 **新建** 并将 platform-tools 的路径添加到列表中。

此文件夹的默认位置为：

```powershell
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

<h2>准备 Android 设备</h2>

您将需要一个 Android 设备来运行您的 React Native Android 应用。这可以是物理 Android 设备，或者更常见的是，您可以使用 Android 虚拟设备，它允许您在计算机上模拟 Android 设备。

无论哪种方式，您都需要准备设备以运行用于开发的 Android 应用。

<h3>使用物理设备</h3>

如果您拥有物理 Android 设备，可以通过 USB 电缆将其连接到计算机并按照 [此处](running-on-device.md) 的说明使用它进行开发，以代替 AVD。

<h3>使用虚拟设备</h3>

如果您使用 Android Studio 打开 `./AwesomeProject/android`，可以通过打开 Android Studio 内的"AVD Manager"查看可用的 Android 虚拟设备 (AVD) 列表。查找看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果您最近安装了 Android Studio，可能需要 [创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择"Create Virtual Device..."，然后从列表中选择任意 Phone 并点击"Next"，然后选择 **VanillaIceCream** API Level 35 镜像。

> 如果您没有安装 HAXM，请点击"Install HAXM"或遵循 [这些说明](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows) 进行设置，然后返回 AVD Manager。

点击"Next"然后点击"Finish"创建您的 AVD。此时您应该能够点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！您成功设置了开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果您想将此新的 React Native 代码添加到现有应用程序，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果您好奇想了解更多关于 React Native 的信息，请查看 [React Native 简介](getting-started)。
