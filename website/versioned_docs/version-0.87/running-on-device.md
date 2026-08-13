---
id: running-on-device
title: 在设备上运行
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在发布应用供用户使用之前，始终建议先在实际设备上测试应用。本文将指导你完成在设备上运行 React Native 应用以及准备生产环境所需的步骤。

:::tip
如果你使用 `create-expo-app` 设置了项目，则可以在运行 `npm start` 时扫描显示的二维码，在 Expo Go 中的设备上运行应用。有关更多信息，请参阅 Expo 关于[在设备上运行项目](https://docs.expo.dev/get-started/expo-go/)的指南。
:::

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

## 在 Android 设备上运行应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装应用。

要在设备上启用 USB 调试，首先需要进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，以启用“开发者选项”菜单。接着返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接设备

现在，让我们设置一台 Android 设备来运行 React Native 项目。请使用 USB 将设备连接到开发计算机。

然后运行 `adb devices`，检查设备是否正确连接到 ADB，即 Android Debug Bridge。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```

如果右列显示 `device`，则表示设备已连接。你必须确保**同时只有一台设备连接**。

:::note
如果列表中显示 `unauthorized`，则需要运行 `adb reverse tcp:8081 tcp:8081`，并在设备上点击允许 USB 调试。
:::

### 3. 运行应用

在项目根目录下，在命令提示符中输入以下命令，以便在设备上安装并启动应用：

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

:::note
如果收到“bridge configuration isn't available”错误，请参阅[使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 生成并运行 `release` 构建版本（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接到开发计算机上运行的开发服务器，在设备上快速迭代开发。根据你是否可以使用 USB 数据线或 Wi-Fi 网络，有多种实现方式。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且已通过 USB 连接到开发计算机，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。首先需要使用 USB 数据线在设备上安装应用，但完成此操作后，你可以按照以下说明进行无线调试。继续操作前，你需要知道开发计算机当前的 IP 地址。

你可以在 **系统设置（或系统偏好设置）** → **网络** 中找到 IP 地址。

1. 确保笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在设备上打开 React Native 应用。
3. 你将看到一个带有错误的[红屏](debugging.md#logbox)。这是正常现象。接下来的步骤会解决该问题。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 前往 **Dev Settings** → **Debug server host & port for device**。
6. 输入计算机的 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu**，选择 **Reload JS**。

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

## 为生产环境构建应用

你已经使用 React Native 构建了一个出色的应用，现在迫不及待地想将它发布到 Play Store。该过程与其他原生 Android 应用相同，但还需要考虑一些额外事项。请参阅[生成签名 APK](signed-apk-android.md)指南了解更多信息。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装应用。

要在设备上启用 USB 调试，首先需要进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，以启用“开发者选项”菜单。接着返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接设备

现在，让我们设置一台 Android 设备来运行 React Native 项目。请使用 USB 将设备连接到开发计算机。

然后运行 `adb devices`，检查设备是否正确连接到 ADB，即 Android Debug Bridge。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```

如果右列显示 `device`，则表示设备已连接。你必须确保**同时只有一台设备连接**。

### 3. 运行应用

在项目根目录下，在命令提示符中运行以下命令，以便在设备上安装并启动应用：

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

:::tip
你也可以使用 `React Native CLI` 生成并运行 `release` 构建版本（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接到开发计算机上运行的开发服务器，在设备上快速迭代开发。根据你是否可以使用 USB 数据线或 Wi-Fi 网络，有多种实现方式。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且已通过 USB 连接到开发计算机，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。首先需要使用 USB 数据线在设备上安装应用，但完成此操作后，你可以按照以下说明进行无线调试。继续操作前，你需要知道开发计算机当前的 IP 地址。

打开命令提示符并输入 `ipconfig`，查找计算机的 IP 地址（[更多信息](https://windows.microsoft.com/en-us/windows/using-command-line-tools-networking-information)）。

1. 确保笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在设备上打开 React Native 应用。
3. 你将看到一个带有错误的[红屏](debugging.md#logbox)。这是正常现象。接下来的步骤会解决该问题。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 前往 **Dev Settings** → **Debug server host & port for device**。
6. 输入计算机的 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu**，选择 **Reload JS**。

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

## 为生产环境构建应用

你已经使用 React Native 构建了一个出色的应用，现在迫不及待地想将它发布到 Play Store。该过程与其他原生 Android 应用相同，但还需要考虑一些额外事项。请参阅[生成签名 APK](signed-apk-android.md)指南了解更多信息。

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装应用。

要在设备上启用 USB 调试，首先需要进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，以启用“开发者选项”菜单。接着返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接设备

现在，让我们设置一台 Android 设备来运行 React Native 项目。请使用 USB 将设备连接到开发计算机。

接下来，使用 `lsusb` 检查制造商代码（在 macOS 上，你必须先[安装 lsusb](https://github.com/jlhonora/lsusb)）。`lsusb` 应输出类似以下内容：

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

这些行表示当前连接到计算机的 USB 设备。

你需要找到代表手机的那一行。如果不确定，可以拔出手机并再次运行该命令：

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

你会看到，移除手机后，包含手机型号（此处为“Motorola PCS”）的行从列表中消失了。这就是我们需要关注的行。

`Bus 001 Device 003: ID 22b8:2e76 Motorola PCS`

从上面的行中，获取设备 ID 的前四位：

`22b8:2e76`

在本例中，它是 `22b8`。这是 Motorola 的标识符。

你需要将其输入 udev 规则，才能完成设置并开始运行：

```shell
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
```

请确保将 `22b8` 替换为你在上述命令中获得的标识符。

然后运行 `adb devices`，检查设备是否正确连接到 ADB，即 Android Debug Bridge。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```

如果右列显示 `device`，则表示设备已连接。你必须确保**同时只有一台设备连接**。

### 3. 运行应用

在项目根目录下，在命令提示符中输入以下命令，以便在设备上安装并启动应用：

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

:::note
如果收到“bridge configuration isn't available”错误，请参阅[使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 生成并运行 `release` 构建版本（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接到开发计算机上运行的开发服务器，在设备上快速迭代开发。根据你是否可以使用 USB 数据线或 Wi-Fi 网络，有多种实现方式。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且已通过 USB 连接到开发计算机，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。首先需要使用 USB 数据线在设备上安装应用，但完成此操作后，你可以按照以下说明进行无线调试。继续操作前，你需要知道开发计算机当前的 IP 地址。

打开终端并输入 `/sbin/ifconfig`，查找计算机的 IP 地址。

1. 确保笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在设备上打开 React Native 应用。
3. 你将看到一个带有错误的[红屏](debugging.md#logbox)。这是正常现象。接下来的步骤会解决该问题。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 前往 **Dev Settings** → **Debug server host & port for device**。
6. 输入计算机的 IP 地址和本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu**，选择 **Reload JS**。

现在，你可以从 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

## 为生产环境构建应用

你已经使用 React Native 构建了一个出色的应用，现在迫不及待地想将它发布到 Play Store。该过程与其他原生 Android 应用相同，但还需要考虑一些额外事项。请参阅[生成签名 APK](signed-apk-android.md)指南了解更多信息。

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ios">

## 在 iOS 设备上运行应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, iOS'

### 1. 通过 USB 连接设备

使用 USB 转 Lightning 或 USB-C 数据线将 iOS 设备连接到 Mac。在项目中进入 `ios` 文件夹，然后使用 Xcode 打开其中的 `.xcodeproj` 文件；如果使用 CocoaPods，则打开 `.xcworkspace` 文件。

如果这是你第一次在 iOS 设备上运行应用，可能需要注册设备以进行开发。在 Xcode 菜单栏中打开 **Product** 菜单，然后前往 **Destination**。在列表中找到并选择你的设备。随后，Xcode 会注册你的设备以进行开发。

### 2. 配置代码签名

如果你还没有 [Apple Developer 帐户](https://developer.apple.com/)，请注册一个。

在 Xcode Project Navigator 中选择项目，然后选择主 target（它应与项目同名）。找到“General”选项卡。前往“Signing”，确保在 Team 下拉菜单中选择了你的 Apple Developer 帐户或团队。对 tests target 执行相同操作（它以 Tests 结尾，位于主 target 下方）。

在项目的 **Tests** target 中**重复**此步骤。

![](/docs/assets/RunningOnDeviceCodeSigning.png)

### 3. 构建并运行应用

如果所有设置均正确，你的设备会在 Xcode 工具栏中列为构建目标，同时也会显示在 Devices 窗格中（<kbd>Shift ⇧</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>2</kbd>）。现在，你可以按下**构建并运行**按钮（<kbd>Cmd ⌘</kbd> + <kbd>R</kbd>），或从 **Product** 菜单中选择 **Run**。稍后应用将会在设备上启动。

![](/docs/assets/RunningOnDeviceReady.png)

:::note
如果遇到任何问题，请查看 Apple 的[在设备上启动应用](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4)文档。
:::

<h2>连接开发服务器</h2>

你还可以使用开发服务器在设备上快速迭代开发。你只需让设备和计算机连接到同一个 Wi-Fi 网络。摇动设备以打开 [Dev Menu](debugging.md#opening-the-dev-menu)，然后启用 Fast Refresh。每当 JavaScript 代码发生更改时，应用都会重新加载。

![](/docs/assets/debugging-dev-menu-083.jpg)

### 故障排除

:::tip
如果遇到任何问题，请确保 Mac 和设备处于同一网络，并且可以相互访问。许多带有强制门户的开放无线网络会阻止设备访问网络中的其他设备。在这种情况下，你可以使用设备的个人热点功能。你也可以通过 USB 将 Mac 的互联网（Wi-Fi/以太网）连接共享给设备，并通过此隧道连接 bundler，以获得非常高的传输速度。
:::

尝试连接开发服务器时，你可能会看到带有以下错误信息的[红屏](debugging.md#logbox)：

:::note
连接到 `http://localhost:8081/debugger-proxy?role=client` 超时。你是否正在运行 node proxy？如果你是在设备上运行，请检查 `RCTWebSocketExecutor.m` 中的 IP 地址是否正确。
:::

要解决此问题，请检查以下几点。

#### 1. Wi-Fi 网络。

确保笔记本电脑和手机连接到**同一个** Wi-Fi 网络。

#### 2. IP 地址

确保构建脚本正确检测到了计算机的 IP 地址（例如 `10.0.1.123`）。

![](/docs/assets/XcodeBuildIP.png)

打开 **Report navigator** 选项卡，选择最后一个 **Build**，然后搜索 `IP=` 后面的 IP 地址。嵌入应用中的 IP 地址应与你计算机的 IP 地址匹配。

## 为生产环境构建应用

你已经使用 React Native 构建了一个出色的应用，现在迫不及待地想将它发布到 App Store。该过程与其他原生 iOS 应用相同，但还需要考虑一些额外事项。请参阅[发布到 Apple App Store](publishing-to-app-store.md)指南了解更多信息。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, iOS'

:::info
要为 iOS 设备构建应用，需要使用 Mac。或者，你可以参阅我们的[环境设置指南](environment-setup)，了解如何使用 Expo CLI 构建应用，这样便可以使用 Expo 客户端应用运行应用。
:::

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, iOS'

:::info
要为 iOS 设备构建应用，需要使用 Mac。或者，你可以参阅我们的[环境设置指南](environment-setup)，了解如何使用 Expo CLI 构建应用，这样便可以使用 Expo 客户端应用运行应用。
:::

</TabItem>
</Tabs>

</TabItem>
</Tabs>
