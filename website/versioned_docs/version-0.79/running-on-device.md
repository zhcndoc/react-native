---
id: running-on-device
title: 在真机上运行
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在将应用发布给用户之前，在实际设备上测试您的应用总是一个好主意。本文档将指导您完成在设备上运行 React Native 应用并将其准备好投入生产所需的步骤。

:::info
如果您使用 `create-expo-app` 设置了项目，可以通过扫描运行 `npm start` 时显示的 QR 码在 Expo Go 中的设备上运行您的应用。有关更多信息，请参阅 Expo 指南 [在设备上运行您的项目](https://docs.expo.dev/get-started/expo-go/)。
:::

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

## 在 Android 设备上运行您的应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只能安装和运行从 Google Play 下载的应用。在开发过程中，您需要在设备上启用 USB 调试才能安装您的应用。

要在设备上启用 USB 调试，您首先需要启用“开发者选项”菜单，方法是进入 **设置** → **关于手机** → **软件信息**，然后连续七次点击底部的 `Build number` 行。然后您可以返回 **设置** → **开发者选项** 启用"USB 调试”。

### 2. 通过 USB 连接您的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请通过 USB 将您的设备连接到开发机器。

现在通过运行 `adb devices` 检查您的设备是否正确连接到 ADB（Android Debug Bridge）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右列看到 `device` 意味着设备已连接。您一次必须**只连接一个设备**。

:::note
如果您在列表中看到 `unauthorized`，您将需要运行 `adb reverse tcp:8081 tcp:8081` 并在设备上按允许 USB 调试。
:::

### 3. 运行您的应用

从项目的根目录；在命令提示符中输入以下内容以在设备上安装并启动您的应用：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

> 如果您收到 "bridge configuration isn't available" 错误，请参阅 [使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。

> 提示：您还可以使用 `React Native CLI` 生成并运行 `release` 构建（例如，从项目根目录：`yarn android --mode release`）。

<h2>连接到开发服务器</h2>

您还可以通过连接到开发机器上运行的开发服务器在设备上快速迭代。有几种方法可以实现这一点，具体取决于您是否可以使用 USB 电缆或 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果您的设备运行的是 Android 5.0 (Lollipop) 或更高版本，已启用 USB 调试，并且通过 USB 连接到开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，运行以下 adb 命令：

```shell
$ adb devices
```

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

您也可以通过 Wi-Fi 连接到开发服务器。您首先需要使用 USB 电缆在设备上安装应用，但完成后可以按照以下说明进行无线调试。在继续之前，您需要开发机器当前的 IP 地址。

您可以在 **系统设置（或系统偏好设置）** → **网络** 中找到 IP 地址。

1. 确保您的笔记本电脑和手机在 **同一个** Wi-Fi 网络上。
2. 在设备上打开您的 React Native 应用。
3. 您会看到一个 [带有错误的红色屏幕](debugging.md#logbox)。这是正常的。以下步骤将修复它。
4. 打开应用内 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机和端口**。
6. 输入您的机器 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **开发菜单** 并选择 **重新加载 JS**。

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

## 为生产环境构建您的应用

您已经使用 React Native 构建了一个很棒的应用，现在迫不及待地想将其发布到 Play Store。过程与任何其他原生 Android 应用相同，但有一些额外的注意事项。遵循 [生成签名 APK](signed-apk-android.md) 指南以了解更多。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只能安装和运行从 Google Play 下载的应用。在开发过程中，您需要在设备上启用 USB 调试才能安装您的应用。

要在设备上启用 USB 调试，您首先需要启用“开发者选项”菜单，方法是进入 **设置** → **关于手机** → **软件信息**，然后连续七次点击底部的 `Build number` 行。然后您可以返回 **设置** → **开发者选项** 启用"USB 调试”。

### 2. 通过 USB 连接您的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请通过 USB 将您的设备连接到开发机器。

现在通过运行 `adb devices` 检查您的设备是否正确连接到 ADB（Android Debug Bridge）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右列看到 `device` 意味着设备已连接。您一次必须**只连接一个设备**。

### 3. 运行您的应用

从项目的根目录，在命令提示符中运行以下命令以在设备上安装并启动您的应用：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

> 提示：您还可以使用 `React Native CLI` 生成并运行 `release` 构建（例如，从项目根目录：`yarn android --mode release`）。

<h2>连接到开发服务器</h2>

您还可以通过连接到开发机器上运行的开发服务器在设备上快速迭代。有几种方法可以实现这一点，具体取决于您是否可以使用 USB 电缆或 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果您的设备运行的是 Android 5.0 (Lollipop) 或更高版本，已启用 USB 调试，并且通过 USB 连接到开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，运行以下 adb 命令：

```shell
$ adb devices
```

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

您也可以通过 Wi-Fi 连接到开发服务器。您首先需要使用 USB 电缆在设备上安装应用，但完成后可以按照以下说明进行无线调试。在继续之前，您需要开发机器当前的 IP 地址。

打开命令提示符并输入 `ipconfig` 以查找机器的 IP 地址（[更多信息](https://windows.microsoft.com/en-us/windows/using-command-line-tools-networking-information)）。

1. 确保您的笔记本电脑和手机在 **同一个** Wi-Fi 网络上。
2. 在设备上打开您的 React Native 应用。
3. 您会看到一个 [带有错误的红色屏幕](debugging.md#logbox)。这是正常的。以下步骤将修复它。
4. 打开应用内 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机和端口**。
6. 输入您的机器 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **开发菜单** 并选择 **重新加载 JS**。

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

## 为生产环境构建您的应用

您已经使用 React Native 构建了一个很棒的应用，现在迫不及待地想将其发布到 Play Store。过程与任何其他原生 Android 应用相同，但有一些额外的注意事项。遵循 [生成签名 APK](signed-apk-android.md) 指南以了解更多。

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只能安装和运行从 Google Play 下载的应用。在开发过程中，您需要在设备上启用 USB 调试才能安装您的应用。

要在设备上启用 USB 调试，您首先需要启用“开发者选项”菜单，方法是进入 **设置** → **关于手机** → **软件信息**，然后连续七次点击底部的 `Build number` 行。然后您可以返回 **设置** → **开发者选项** 启用"USB 调试”。

### 2. 通过 USB 连接您的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请通过 USB 将您的设备连接到开发机器。

接下来，使用 `lsusb` 检查制造商代码（在 mac 上，您必须首先 [安装 lsusb](https://github.com/jlhonora/lsusb)）。`lsusb` 应该输出如下内容：

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 003: ID 22b8:2e76 Motorola PCS
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

这些行代表当前连接到您机器的 USB 设备。

您需要代表您手机的那一行。如果您不确定，尝试拔掉手机并再次运行命令：

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

您会看到拔掉手机后，具有手机型号（本例中为 "Motorola PCS"）的行从列表中消失了。这就是我们关心的行。

`Bus 001 Device 003: ID 22b8:2e76 Motorola PCS`

从上面的行中，您想要获取设备 ID 的前四位数字：

`22b8:2e76`

在本例中，它是 `22b8`。那是 Motorola 的标识符。

您需要将其输入到您的 udev 规则中才能启动并运行：

```shell
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
```

确保您将 `22b8` 替换为上述命令中获得的标识符。

现在通过运行 `adb devices` 检查您的设备是否正确连接到 ADB（Android Debug Bridge）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右列看到 `device` 意味着设备已连接。您一次必须**只连接一个设备**。

### 3. 运行您的应用

从项目的根目录，在命令提示符中输入以下内容以在设备上安装并启动您的应用：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

> 如果您收到 "bridge configuration isn't available" 错误，请参阅 [使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。

> 提示：您还可以使用 `React Native CLI` 生成并运行 `release` 构建（例如，从项目根目录：`yarn android --mode release`）。

<h2>连接到开发服务器</h2>

您还可以通过连接到开发机器上运行的开发服务器在设备上快速迭代。有几种方法可以实现这一点，具体取决于您是否可以使用 USB 电缆或 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果您的设备运行的是 Android 5.0 (Lollipop) 或更高版本，已启用 USB 调试，并且通过 USB 连接到开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，运行以下 adb 命令：

```shell
$ adb devices
```

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

您也可以通过 Wi-Fi 连接到开发服务器。您首先需要使用 USB 电缆在设备上安装应用，但完成后可以按照以下说明进行无线调试。在继续之前，您需要开发机器当前的 IP 地址。

打开终端并输入 `/sbin/ifconfig` 以查找机器的 IP 地址。

1. 确保您的笔记本电脑和手机在 **同一个** Wi-Fi 网络上。
2. 在设备上打开您的 React Native 应用。
3. 您会看到一个 [带有错误的红色屏幕](debugging.md#logbox)。这是正常的。以下步骤将修复它。
4. 打开应用内 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机和端口**。
6. 输入您的机器 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **开发菜单** 并选择 **重新加载 JS**。

您现在可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当您的 JavaScript 代码发生更改时，您的应用都会重新加载。

</TabItem>
</Tabs>

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个很棒的应用，现在你迫不及待地想要将它发布到 Play Store。该流程与任何其他原生 Android 应用相同，但有一些额外的注意事项需要考虑。请遵循 [生成签名的 APK](signed-apk-android.md) 指南以了解更多。

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ios">

## 在 iOS 设备上运行你的应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, iOS'

### 1. 通过 USB 连接你的设备

使用 USB 转 Lightning 或 USB-C 线缆将你的 iOS 设备连接到 Mac。导航到项目中的 `ios` 文件夹，然后使用 Xcode 打开其中的 `.xcodeproj` 文件，或者如果你使用的是 CocoaPods 则打开 `.xcworkspace`。

如果是第一次在 iOS 设备上运行应用，你可能需要注册你的设备以进行开发。从 Xcode 菜单栏打开 **产品** 菜单，然后前往 **目标**。在列表中查找并选择你的设备。Xcode 随后将注册你的设备以进行开发。

### 2. 配置代码签名

如果你还没有 [Apple Developer 账户](https://developer.apple.com/)，请注册一个。

在 Xcode 项目导航器中选择你的项目，然后选择你的主目标（它应该与你的项目名称相同）。查找“通用”标签。前往“签名”并确保你的 Apple Developer 账户或团队在团队下拉菜单中被选中。对测试目标也执行相同的操作（它以 Tests 结尾，位于你的主目标下方）。

**重复** 此步骤以处理项目中的 **Tests** 目标。

![](/docs/assets/RunningOnDeviceCodeSigning.png)

### 3. 构建并运行你的应用

如果一切设置正确，你的设备将列为 Xcode 工具栏中的构建目标，并且它也会出现在设备面板中 (<kbd>Shift ⇧</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>2</kbd>)。你现在可以按下 **构建并运行** 按钮 (<kbd>Cmd ⌘</kbd> + <kbd>R</kbd>) 或从 **产品** 菜单中选择 **运行**。你的应用将很快在你的设备上启动。

![](/docs/assets/RunningOnDeviceReady.png)

> 如果遇到任何问题，请查看 Apple 的 [在设备上启动你的应用](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4) 文档。

<h2>连接到开发服务器</h2>

你也可以在设备上使用开发服务器快速迭代。你只需要与你的电脑处于同一个 Wi-Fi 网络。摇动你的设备以打开 [开发菜单](debugging.md#opening-the-dev-menu)，然后启用快速刷新。每当你的 JavaScript 代码发生更改时，你的应用将重新加载。

![](/docs/assets/debugging-dev-menu-076.jpg)

### 故障排除

> 如果遇到任何问题，请确保你的 Mac 和设备处于同一个网络上并且可以互相访问。许多带有强制门户的开放无线网络被配置为防止设备访问网络上的其他设备。在这种情况下，你可以使用设备的个人热点功能。你还可以通过 USB 将你的互联网 (Wi-Fi/以太网) 连接从 Mac 共享到你的设备，并通过此隧道连接到 bundler 以获得非常高的传输速度。

当尝试连接到开发服务器时，你可能会得到一个 [带有错误的红屏](debugging.md#logbox)，显示：

> 连接到 `http://localhost:8081/debugger-proxy?role=client` 超时。你是否运行了 node 代理？如果你在设备上运行，请检查 `RCTWebSocketExecutor.m` 中的 IP 地址是否正确。

要解决此问题，请检查以下几点。

#### 1. Wi-Fi 网络。

确保你的笔记本电脑和手机处于 **同一个** Wi-Fi 网络上。

#### 2. IP 地址

确保构建脚本正确检测到了你机器的 IP 地址（例如 `10.0.1.123`）。

![](/docs/assets/XcodeBuildIP.png)

打开 **报告导航器** 标签，选择最后的 **构建** 并搜索 `IP=` 后跟一个 IP 地址。嵌入到应用中的 IP 地址应该与你机器的 IP 地址匹配。

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个很棒的应用，现在你迫不及待地想要将它发布到 App Store。该流程与任何其他原生 iOS 应用相同，但有一些额外的注意事项需要考虑。请遵循 [发布到 Apple App Store](publishing-to-app-store.md) 指南以了解更多。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, iOS'

> 需要 Mac 才能为 iOS 设备构建你的应用。或者，你可以参考我们的 [环境设置指南](environment-setup) 以了解如何使用 Expo CLI 构建你的应用，这将允许你使用 Expo 客户端应用运行你的应用。

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, iOS'

> 需要 Mac 才能为 iOS 设备构建你的应用。或者，你可以参考我们的 [环境设置指南](environment-setup) 以了解如何使用 Expo CLI 构建你的应用，这将允许你使用 Expo 客户端应用运行你的应用。

</TabItem>
</Tabs>

</TabItem>
</Tabs>
