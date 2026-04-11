<h2>安装依赖项</h2>

您将需要 Node、React Native 命令行接口、JDK 和 Android Studio。

虽然您可以使用任何自己喜欢的编辑器来开发应用，但为了搭建构建 React Native Android 应用所需的工具，您需要安装 Android Studio。

<h3 id="jdk">Node、JDK</h3>

我们推荐通过 Windows 上流行的包管理器 [Chocolatey](https://chocolatey.org/install) 来安装 Node。

推荐使用 Node 的 LTS 版本。如果您想在不同版本间切换，可以通过 [nvm-windows](https://github.com/coreybutler/nvm-windows) —— Windows 版本的 Node 版本管理器 来安装 Node。

React Native 还需要 [Java SE 开发工具包 (JDK)](https://openjdk.java.net/projects/jdk/17/)，也可以用 Chocolatey 来安装。

打开一个管理员命令提示符（右键点击命令提示符，选择“以管理员身份运行”），然后运行以下命令：

```powershell
choco install -y nodejs-lts microsoft-openjdk17
```

如果您系统中已安装 Node，请确保是 20.19.4 版本或更高版本。如果系统已有 JDK，推荐使用 JDK17。使用更高版本的 JDK 可能会遇到问题。

:::note
您可以在 [Node 的下载页面](https://nodejs.org/en/download/) 找到更多安装选项。
:::

:::info
如果您使用的是最新版本的 Java 开发工具包，您需要修改项目的 Gradle 版本以便其识别该 JDK。操作方法是在 `{project root folder}\android\gradle\wrapper\gradle-wrapper.properties` 文件中更改 `distributionUrl` 的值以升级 Gradle 版本。您可以在[此处查看 Gradle 最新版本](https://gradle.org/releases/)。
:::

<h3>Android 开发环境</h3>

如果您是 Android 开发新手，搭建开发环境可能稍显繁琐。如果您已经熟悉 Android 开发，则可能只需配置一些内容。无论哪种情况，请务必认真按照接下来的步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在 Android Studio 安装向导中，请确保勾选以下所有项目：

- `Android SDK`
- `Android SDK Platform`
- `Android 虚拟设备（Android Virtual Device）`
- 如果您尚未使用 Hyper-V：`性能 (Intel ® HAXM)`（[AMD 或 Hyper-V 请见这里](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html)）

然后点击“下一步”安装所有这些组件。

:::note
如果复选框呈灰色，您可以稍后安装这些组件。
:::

安装完成并进入欢迎界面后，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新的 Android SDK。但构建含有原生代码的 React Native 应用需要特定的 `Android 15 (VanillaIceCream)` SDK。您可以通过 Android Studio 的 SDK 管理器安装额外的 Android SDK。

具体操作是，打开 Android Studio，点击“更多操作”按钮，选择"SDK 管理器”。

![Android Studio 欢迎界面](/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

:::tip
SDK 管理器也可在 Android Studio 的“设置”对话框中找到，路径为 **语言与框架** → **Android SDK**。
:::

在 SDK 管理器中选择"SDK 平台”标签页，然后勾选右下角的“显示包详情”。找到并展开 `Android 15 (VanillaIceCream)` 项，确保以下项目被选中：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 系统映像` 或 `Google APIs Intel x86 Atom 系统映像`

接着，选择"SDK 工具”标签页，也勾选“显示包详情”。找到并展开 `Android SDK Build-Tools` 项，确保选中 `36.0.0` 和 `Android SDK 命令行工具 (最新)`。

最后点击“应用”来下载并安装 Android SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量，才能构建含原生代码的应用。

1. 打开 **Windows 控制面板**。
2. 点击 **用户账户**，然后再次点击 **用户账户**。
3. 点击 **更改我的环境变量**。
4. 点击 **新建...**，创建一个新的用户变量 `ANDROID_HOME`，指向您的 Android SDK 路径：

![ANDROID_HOME 环境变量示例](/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

SDK 默认安装路径为：

```powershell
%LOCALAPPDATA%\Android\Sdk
```

您也可以在 Android Studio 的“设置”对话框中找到 SDK 的实际路径，路径为 **语言与框架** → **Android SDK**。

打开一个新的命令提示符窗口，确保新环境变量已加载，然后继续下一步。

1. 打开 powershell
2. 复制并粘贴命令 **Get-ChildItem -Path Env:\\** 到 powershell
3. 确认 `ANDROID_HOME` 已添加

<h4>4. 将 platform-tools 添加到 Path</h4>

1. 打开 **Windows 控制面板**。
2. 点击 **用户账户**，然后再次点击 **用户账户**。
3. 点击 **更改我的环境变量**。
4. 选择 **Path** 变量。
5. 点击 **编辑**。
6. 点击 **新建**，将 platform-tools 的路径添加到列表中。

该文件夹的默认路径为：

```powershell
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

<h2>准备 Android 设备</h2>

您需要一个 Android 设备来运行 React Native Android 应用。这既可以是真实的 Android 设备，也可以是更常用的 Android 虚拟设备（AVD），后者允许您在电脑上模拟 Android 设备。

无论哪种方式，您都需要准备设备以开发运行 Android 应用。

<h3>使用真实设备</h3>

如果您有真实的 Android 设备，可以通过 USB 线连接电脑，将其用于开发，作为 AVD 的替代方案，详细操作请参见[这里](running-on-device.md)。

<h3>使用虚拟设备</h3>

如果您用 Android Studio 打开 `./AwesomeProject/android`，可以在 Android Studio 内打开"AVD 管理器”查看可用的 Android 虚拟设备列表。寻找类似下面的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD 管理器" width="100"/>

如果刚安装 Android Studio，您很可能需要[新建一个 AVD](https://developer.android.com/studio/run/managing-avds.html)。选择“创建虚拟设备..."，然后从列表中挑选任意一款手机，点击“下一步”，然后选择 **VanillaIceCream** API Level 35 镜像。

:::note
如果您未安装 HAXM，点击“安装 HAXM"或按[这些指令](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows)执行安装，然后回到 AVD 管理器。
:::

点击“下一步”，然后点击“完成”来创建您的 AVD。此时，您可以点击虚拟设备旁的绿色三角按钮启动它。

<h3>就这些！</h3>

恭喜！您已成功搭建开发环境。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来做什么？</h2>

- 如果您想将这段新的 React Native 代码添加到已有应用中，请查看 [集成指南](integration-with-existing-apps.md)。
- 如果您想进一步了解 React Native，请参阅 [React Native 入门](getting-started)。