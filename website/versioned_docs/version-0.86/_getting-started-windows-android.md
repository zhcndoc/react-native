<h2>安装依赖</h2>

您将需要 Node、React Native 命令行界面、JDK 和 Android Studio。

虽然您可以使用自己喜欢的任何编辑器来开发应用，但您仍需要安装 Android Studio，以便设置构建 React Native Android 应用所需的工具链。

<h3 id="jdk">Node、JDK</h3>

我们建议通过 [Chocolatey](https://chocolatey.org/install) 安装 Node，这是 Windows 上一个很受欢迎的软件包管理器。

建议使用 Node 的 LTS 版本。如果您希望能够在不同版本之间切换，您可以考虑通过 [nvm-windows](https://github.com/coreybutler/nvm-windows) 安装 Node，它是 Windows 的 Node 版本管理器。

React Native 还需要 [Java SE Development Kit (JDK)](https://openjdk.java.net/projects/jdk/17/)，同样可以使用 Chocolatey 安装。

打开管理员命令提示符（右键单击命令提示符并选择“以管理员身份运行”），然后运行以下命令：

```powershell
choco install -y nodejs-lts microsoft-openjdk17
```

如果您的系统上已经安装了 Node，请确保它是 Node 22.11.0 或更新版本。如果您的系统上已经有 JDK，我们建议使用 JDK17。使用更高版本的 JDK 可能会遇到问题。

:::note
您可以在 [Node 的下载页面](https://nodejs.org/en/download/) 找到其他安装选项。
:::

:::info
如果您使用的是最新版本的 Java Development Kit，则需要更改项目的 Gradle 版本，以便它能够识别该 JDK。您可以通过转到 `{project root folder}\android\gradle\wrapper\gradle-wrapper.properties` 并修改 `distributionUrl` 的值来升级 Gradle 版本。您可以在 [这里查看 Gradle 的最新发布版本](https://gradle.org/releases/)。
:::

<h3>Android 开发环境</h3>

如果您是 Android 开发新手，配置开发环境可能会有些繁琐。如果您已经熟悉 Android 开发，则可能还需要配置一些内容。无论哪种情况，请务必仔细按照接下来的几个步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保勾选以下所有项目旁边的复选框：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`
- 如果您尚未使用 Hyper-V：`Performance (Intel ® HAXM)`（[AMD 或 Hyper-V 请看这里](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html)）

然后点击“下一步”以安装所有这些组件。

:::note
如果复选框是灰色的，您之后仍有机会安装这些组件。
:::

设置完成并显示欢迎界面后，请继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

默认情况下，Android Studio 会安装最新的 Android SDK。不过，使用原生代码构建 React Native 应用时，特别需要 `Android 15 (VanillaIceCream)` SDK。您可以通过 Android Studio 中的 SDK Manager 安装其他 Android SDK。

为此，请打开 Android Studio，点击“More Actions”按钮并选择“SDK Manager”。

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

:::tip
您也可以在 Android Studio 的“设置”对话框中找到 SDK Manager，路径为 **Languages & Frameworks** → **Android SDK**。
:::

在 SDK Manager 中选择“SDK Platforms”选项卡，然后勾选右下角的“Show Package Details”。找到并展开 `Android 15 (VanillaIceCream)` 项，然后确保勾选以下内容：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接下来，选择“SDK Tools”选项卡，并同样勾选“Show Package Details”。找到并展开 `Android SDK Build-Tools` 项，然后确保选中 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后，点击“Apply”下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，才能构建包含原生代码的应用。

1. 打开 **Windows 控制面板**。
2. 点击 **用户帐户**，然后再次点击 **用户帐户**
3. 点击 **更改我的环境变量**
4. 点击 **新建...**，创建一个新的 `ANDROID_HOME` 用户变量，指向您的 Android SDK 路径：

![ANDROID_HOME 环境变量](/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

默认情况下，SDK 安装在以下位置：

```powershell
%LOCALAPPDATA%\Android\Sdk
```

您可以在 Android Studio 的“设置”对话框中找到 SDK 的实际位置，路径为 **Languages & Frameworks** → **Android SDK**。

打开一个新的命令提示符窗口，以确保在继续下一步之前已加载新的环境变量。

1. 打开 powershell
2. 将 **Get-ChildItem -Path Env:\\** 复制并粘贴到 powershell 中
3. 验证 `ANDROID_HOME` 已被添加

<h4>4. 将 platform-tools 添加到 Path</h4>

1. 打开 **Windows 控制面板**。
2. 点击 **用户帐户**，然后再次点击 **用户帐户**
3. 点击 **更改我的环境变量**
4. 选择 **Path** 变量。
5. 点击 **编辑。**
6. 点击 **新建**，并将 platform-tools 的路径添加到列表中。

该文件夹的默认位置是：

```powershell
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

<h2>准备 Android 设备</h2>

您将需要一台 Android 设备来运行 React Native Android 应用。这台设备既可以是真机 Android 设备，也可以更常见地使用 Android 虚拟设备，它允许您在电脑上模拟 Android 设备。

无论哪种方式，您都需要先准备好设备，以便运行用于开发的 Android 应用。

<h3>使用真机设备</h3>

如果您有一台真机 Android 设备，可以通过 USB 数据线将其连接到电脑，并按照[这里](running-on-device.md)的说明进行操作，用它代替 AVD 进行开发。

<h3>使用虚拟设备</h3>

如果您使用 Android Studio 打开 `./AwesomeProject/android`，可以在 Android Studio 中打开“AVD Manager”查看可用 Android 虚拟设备（AVD）列表。寻找一个看起来像这样的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果您最近才安装 Android Studio，您很可能需要[创建一个新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“Create Virtual Device...”，然后从列表中选择任意一款手机并点击“Next”，接着选择 **VanillaIceCream** API Level 35 镜像。

:::note
如果您没有安装 HAXM，请点击“Install HAXM”或按照[这些说明](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows)进行设置，然后返回 AVD Manager。
:::

点击“Next”，然后点击“Finish”创建您的 AVD。此时，您应该可以点击 AVD 旁边的绿色三角形按钮来启动它。

<h3>就是这样！</h3>

恭喜！您已成功设置开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果您想将这段新的 React Native 代码添加到现有应用中，请查看[集成指南](integration-with-existing-apps.md)。
- 如果您想进一步了解 React Native，请查看[React Native 入门](getting-started)。
