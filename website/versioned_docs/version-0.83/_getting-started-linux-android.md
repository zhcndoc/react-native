## 安装依赖

你需要安装 Node、React Native 命令行工具、JDK 和 Android Studio。

虽然你可以使用任意编辑器来开发你的应用，但你需要安装 Android Studio 来搭建构建 React Native 安卓应用所需的工具链。

<h3>Node</h3>

按照 [你的 Linux 发行版的安装说明](https://nodejs.org/en/download/package-manager/) 安装 Node 20.19.4 或更高版本。

<h3>Java 开发工具包</h3>

React Native 当前推荐使用 Java SE 开发工具包（JDK）版本 17。使用更高版本的 JDK 可能会遇到问题。你可以从 [AdoptOpenJDK](https://adoptopenjdk.net/) 或通过你的系统包管理器下载并安装 [OpenJDK](https://openjdk.java.net)。

<h3>安卓开发环境</h3>

如果你是安卓开发新手，搭建开发环境可能会比较繁琐。如果你已经熟悉安卓开发，可能只需配置好一些内容。无论哪种情况，请务必仔细按照接下来的步骤操作。

<h4 id="android-studio">1. 安装 Android Studio</h4>

[下载并安装 Android Studio](https://developer.android.com/studio)。在安装向导中，确保勾选以下所有组件：

- `Android SDK`
- `Android SDK Platform`
- `Android Virtual Device`

然后点击“下一步”安装所有组件。

:::note
如果这些复选框是灰色不可选，后续安装时你仍有机会安装这些组件。
:::

安装完成并显示欢迎界面后，继续下一步。

<h4 id="android-sdk">2. 安装 Android SDK</h4>

Android Studio 默认安装最新 Android SDK。但是，构建带原生代码的 React Native 应用需要特定版本的 `Android 15 (VanillaIceCream)` SDK。你可以通过 Android Studio 中的 SDK 管理器安装额外的 Android SDK。

操作方法：打开 Android Studio，点击"Configure"按钮，选择"SDK Manager"。

:::tip
SDK 管理器也可以在 Android Studio“设置”对话框中找到，路径是 **Languages & Frameworks** → **Android SDK**。
:::

在 SDK 管理器中选择"SDK Platforms"标签，然后在右下角勾选"Show Package Details"。找到并展开 `Android 15 (VanillaIceCream)` 条目，确保选中以下项目：

- `Android SDK Platform 35`
- `Intel x86 Atom_64 System Image` 或 `Google APIs Intel x86 Atom System Image`

接着选择"SDK Tools"标签，同样勾选"Show Package Details"。找到并展开"Android SDK Build-Tools"，确保选择了 `36.0.0` 和 `Android SDK Command-line Tools (latest)`。

最后点击"Apply"下载并安装安卓 SDK 及相关构建工具。

<h4>3. 配置 ANDROID_HOME 环境变量</h4>

React Native 工具需要设置一些环境变量以构建带原生代码的应用。

在你的 `$HOME/.bash_profile` 或 `$HOME/.bashrc`（如果使用 `zsh` 则是 `~/.zprofile` 或 `~/.zshrc`）配置文件中添加以下内容：

```shell
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

:::note
`.bash_profile` 是针对 `bash` 的。如果你使用的是其他 shell，需要编辑相应的 shell 配置文件。
:::

输入 `source $HOME/.bash_profile`（bash），或 `source $HOME/.zprofile` 加载配置到当前 shell。运行 `echo $ANDROID_HOME` 验证 ANDROID_HOME 是否设置成功，运行 `echo $PATH` 确认相关目录已加入路径。

:::note
请确保使用了正确的 Android SDK 路径。你可以在 Android Studio“设置”对话框中查看实际路径，路径是 **Languages & Frameworks** → **Android SDK**。
:::

<h3>Watchman</h3>

按照 [Watchman 安装指南](https://facebook.github.io/watchman/docs/install#buildinstall) 从源码编译安装 Watchman。

:::info
[Watchman](https://facebook.github.io/watchman/docs/install) 是 Facebook 开发的文件系统变化监听工具。强烈建议安装它，以提升性能并增强在某些边缘情况下的兼容性（换句话说，你可能可以不用安装，但体验会有所不同；现在安装可避免未来遇到麻烦）。
:::

<h2>准备安卓设备</h2>

你需要一个安卓设备来运行 React Native 安卓应用。可以是实体设备，也可以更常见地使用安卓虚拟设备（AVD）在电脑上模拟。

无论哪种方式，都需要准备设备以便开发环境运行安卓应用。

<h3>使用实体设备</h3>

如果你拥有实体安卓设备，可以通过 USB 连接电脑，在 [这里](running-on-device.md) 按照说明进行设置，替代 AVD 进行开发。

<h3>使用虚拟设备</h3>

如果你使用 Android Studio 打开 `./AwesomeProject/android`，可以通过 Android Studio 中的"AVD Manager"查看已有的安卓虚拟设备列表。找到下图所示的图标：

<img src="/docs/assets/GettingStartedAndroidStudioAVD.svg" alt="Android Studio AVD Manager" width="100"/>

如果刚安装完 Android Studio，可能需要 [创建新的 AVD](https://developer.android.com/studio/run/managing-avds.html)。点击"Create Virtual Device..."，选择任一手机型号，点击"Next"，选择 **VanillaIceCream** API 级别 35 的镜像。

:::tip
推荐配置 [虚拟机加速](https://developer.android.com/studio/run/emulator-acceleration.html#vm-linux) 以提升性能。完成配置后，返回 AVD 管理器继续操作。
:::

点击"Next"然后"Finish"完成 AVD 创建。此时你应该能点击 AVD 旁的绿色三角按钮启动虚拟设备。

<h3>完成了！</h3>

恭喜你！开发环境搭建成功。

<center><img src="/docs/assets/GettingStartedCongratulations.png" width="150"></img></center>

<h2>接下来？</h2>

- 如果你想将此新 React Native 代码添加到已有应用中，可查看 [集成指南](integration-with-existing-apps.md)。
- 如果你想深入了解 React Native，可查看 [React Native 入门介绍](getting-started)。