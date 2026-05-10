---
id: running-on-device
title: 在设备上运行
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在将应用发布给用户之前，最好先在真实设备上测试一下。本文件将引导你完成在设备上运行 React Native 应用以及使其准备好用于生产环境所需的步骤。

:::tip
如果你使用 `create-expo-app` 来搭建项目，你可以通过扫描运行 `npm start` 时显示的二维码，在 Expo Go 中把应用运行在设备上。更多信息请参阅 Expo 指南中关于[在你的设备上运行项目](https://docs.expo.dev/get-started/expo-go/)的内容。
:::

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

## 在 Android 设备上运行你的应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装你的应用。

要在设备上启用 USB 调试，首先需要通过依次进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，来启用“开发者选项”菜单。之后你可以返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接你的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请将设备通过 USB 连接到你的开发机器。

接下来通过运行 `adb devices`，检查你的设备是否已正确连接到 ADB（Android 调试桥）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右侧列中看到 `device` 表示设备已连接。你一次只能连接**一台设备**。

:::note
如果你在列表中看到 `unauthorized`，你需要运行 `adb reverse tcp:8081 tcp:8081`，并在设备上点击允许 USB 调试。
:::

### 3. 运行你的应用

在项目根目录下，在命令提示符中输入以下内容，以便在设备上安装并启动你的应用：

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
如果你遇到“bridge configuration isn't available”错误，请参阅[使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 来生成并运行一个 `release` 构建（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接到开发服务器</h2>

你也可以通过连接到运行在开发机器上的开发服务器，在设备上快速迭代。根据你是否有 USB 数据线或 Wi‑Fi 网络，有几种方式可以实现这一点。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且通过 USB 连接到你的开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。你首先需要使用 USB 数据线在设备上安装应用，但完成之后就可以按照这些说明进行无线调试。在继续之前，你需要知道开发机器当前的 IP 地址。

你可以在 **系统设置（或系统偏好设置）** → **网络** 中找到 IP 地址。

1. 确保你的笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在你的设备上打开 React Native 应用。
3. 你会看到一个[带有错误的红屏](debugging.md#logbox)。这没关系。接下来的步骤会修复它。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 进入 **Dev Settings** → **Debug server host & port for device**。
6. 输入你的机器的 IP 地址以及本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu** 并选择 **Reload JS**。

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个很棒的应用，现在你一定很想把它发布到 Play Store。这个过程与其他原生 Android 应用相同，但还需要考虑一些额外事项。请按照[生成签名 APK](signed-apk-android.md)指南了解更多信息。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装你的应用。

要在设备上启用 USB 调试，首先需要通过依次进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，来启用“开发者选项”菜单。之后你可以返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接你的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请将设备通过 USB 连接到你的开发机器。

接下来通过运行 `adb devices`，检查你的设备是否已正确连接到 ADB（Android 调试桥）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右侧列中看到 `device` 表示设备已连接。你一次只能连接**一台设备**。

### 3. 运行你的应用

在项目根目录下，在命令提示符中运行以下内容，以便在设备上安装并启动你的应用：

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
你也可以使用 `React Native CLI` 来生成并运行一个 `release` 构建（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接到开发服务器</h2>

你也可以通过连接到运行在开发机器上的开发服务器，在设备上快速迭代。根据你是否有 USB 数据线或 Wi-Fi 网络，有几种方式可以实现这一点。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且通过 USB 连接到你的开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。你首先需要使用 USB 数据线在设备上安装应用，但完成之后就可以按照这些说明进行无线调试。在继续之前，你需要知道开发机器当前的 IP 地址。

在命令提示符中打开并输入 `ipconfig` 以查找你的机器 IP 地址（[更多信息](https://windows.microsoft.com/en-us/windows/using-command-line-tools-networking-information)）。

1. 确保你的笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在你的设备上打开 React Native 应用。
3. 你会看到一个[带有错误的红屏](debugging.md#logbox)。这没关系。接下来的步骤会修复它。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 进入 **Dev Settings** → **Debug server host & port for device**。
6. 输入你的机器的 IP 地址以及本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu** 并选择 **Reload JS**。

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个很棒的应用，现在你一定很想把它发布到 Play Store。这个过程与其他原生 Android 应用相同，但还需要考虑一些额外事项。请按照[生成签名 APK](signed-apk-android.md)指南了解更多信息。

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, Android'

### 1. 启用 USB 调试

默认情况下，大多数 Android 设备只能安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发期间安装你的应用。

要在设备上启用 USB 调试，首先需要通过依次进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `Build number` 行七次，来启用“开发者选项”菜单。之后你可以返回 **设置** → **开发者选项**，启用“USB 调试”。

### 2. 通过 USB 连接你的设备

现在让我们设置一个 Android 设备来运行我们的 React Native 项目。请将设备通过 USB 连接到你的开发机器。

接下来，使用 `lsusb` 检查厂商代码（在 mac 上，你必须先[安装 lsusb](https://github.com/jlhonora/lsusb)）。`lsusb` 应该会输出类似如下内容：

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

这些行表示当前连接到你机器上的 USB 设备。

你要找的是代表你手机的那一行。如果不确定，可以尝试拔掉手机后再运行一次命令：

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

你会发现，在移除手机后，包含手机型号的那一行（这里是 “Motorola PCS”）从列表中消失了。这就是我们需要关注的那一行。

`Bus 001 Device 003: ID 22b8:2e76 Motorola PCS`

从上面的这一行中，你要取设备 ID 的前四位数字：

`22b8:2e76`

在这个例子里，就是 `22b8`。这就是 Motorola 的标识符。

你需要把它输入到 udev 规则中，才能开始使用：

```shell
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
```

请务必将 `22b8` 替换为你在上面命令中得到的标识符。

接下来通过运行 `adb devices`，检查你的设备是否已正确连接到 ADB（Android 调试桥）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # Google 模拟器
14ed2fcc device         # 物理设备
```

在右侧列中看到 `device` 表示设备已连接。你一次只能连接**一台设备**。

### 3. 运行你的应用

在项目根目录下，在命令提示符中输入以下内容，以便在设备上安装并启动你的应用：

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
如果你遇到“bridge configuration isn't available”错误，请参阅[使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 来生成并运行一个 `release` 构建（例如，在项目根目录下运行：`yarn android --mode release`）。
:::

<h2>连接到开发服务器</h2>

你也可以通过连接到运行在开发机器上的开发服务器，在设备上快速迭代。根据你是否有 USB 数据线或 Wi‑Fi 网络，有几种方式可以实现这一点。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行的是 Android 5.0（Lollipop）或更高版本，已启用 USB 调试，并且通过 USB 连接到你的开发机器，则可以使用此方法。

在命令提示符中运行以下命令：

```shell
$ adb -s <device name> reverse tcp:8081 tcp:8081
```

要查找设备名称，请运行以下 adb 命令：

```shell
$ adb devices
```

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接到开发服务器。你首先需要使用 USB 数据线在设备上安装应用，但完成之后就可以按照这些说明进行无线调试。在继续之前，你需要知道开发机器当前的 IP 地址。

打开终端并输入 `/sbin/ifconfig` 来查找你的机器 IP 地址。

1. 确保你的笔记本电脑和手机连接到**同一个** Wi-Fi 网络。
2. 在你的设备上打开 React Native 应用。
3. 你会看到一个[带有错误的红屏](debugging.md#logbox)。这没关系。接下来的步骤会修复它。
4. 打开应用内的 [Dev Menu](debugging.md#opening-the-dev-menu)。
5. 进入 **Dev Settings** → **Debug server host & port for device**。
6. 输入你的机器的 IP 地址以及本地开发服务器的端口（例如 `10.0.1.1:8081`）。
7. 返回 **Dev Menu** 并选择 **Reload JS**。

现在你可以在 [Dev Menu](debugging.md#opening-the-dev-menu) 中启用 Fast Refresh。只要你的 JavaScript 代码发生变化，你的应用就会重新加载。

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个出色的应用，现在正迫不及待地想将其发布到 Play Store。这个过程与任何其他原生 Android 应用相同，只是需要考虑一些额外事项。请参阅[生成签名 APK](signed-apk-android.md)指南以了解更多信息。

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ios">

## 在 iOS 设备上运行你的应用

#### 开发系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, iOS'

### 1. 通过 USB 插入你的设备

使用 USB 转 Lightning 或 USB-C 数据线将你的 iOS 设备连接到 Mac。进入项目中的 `ios` 文件夹，然后使用 Xcode 打开其中的 `.xcodeproj` 文件；如果你使用的是 CocoaPods，则打开 `.xcworkspace` 文件。

如果这是你第一次在 iOS 设备上运行应用，你可能需要为开发注册你的设备。打开 Xcode 菜单栏中的 **Product** 菜单，然后进入 **Destination**。在列表中查找并选择你的设备。随后 Xcode 会将你的设备注册为开发设备。

### 2. 配置代码签名

如果你还没有 Apple Developer 账户，请注册一个 [Apple Developer account](https://developer.apple.com/)。

在 Xcode Project Navigator 中选择你的项目，然后选择你的主 target（它应与项目同名）。找到 "General" 选项卡。进入 "Signing"，并确保在 Team 下拉菜单中选择了你的 Apple Developer 账户或团队。对测试 target 也执行相同操作（它以 Tests 结尾，位于主 target 下方）。

**重复**此步骤，对项目中的 **Tests** target 进行同样配置。

![](/docs/assets/RunningOnDeviceCodeSigning.png)

### 3. 构建并运行你的应用

如果一切设置正确，你的设备会在 Xcode 工具栏中列为构建目标，同时它也会出现在 Devices 面板中（<kbd>Shift ⇧</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>2</kbd>）。现在你可以按下 **Build and run** 按钮（<kbd>Cmd ⌘</kbd> + <kbd>R</kbd>），或者从 **Product** 菜单中选择 **Run**。你的应用很快就会在设备上启动。

![](/docs/assets/RunningOnDeviceReady.png)

:::note
如果你遇到任何问题，请查看 Apple 的[在设备上启动你的应用](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4)文档。
:::

<h2>连接到开发服务器</h2>

你也可以使用开发服务器在设备上快速迭代。你只需要与你的电脑处于同一个 Wi-Fi 网络中。摇动你的设备以打开 [Dev Menu](debugging.md#opening-the-dev-menu)，然后启用 Fast Refresh。每当你的 JavaScript 代码发生变化时，你的应用都会重新加载。

![](/docs/assets/debugging-dev-menu-083.jpg)

### 故障排查

:::tip
如果你遇到任何问题，请确保你的 Mac 和设备在同一个网络中，并且彼此可以访问。许多带有强制门户的开放无线网络都被配置为阻止设备访问网络中的其他设备。在这种情况下，你可以使用设备的个人热点功能。你也可以通过 USB 将 Mac 的互联网（Wi-Fi/Ethernet）连接共享给设备，并通过该通道连接到 bundler，以获得非常高的传输速度。
:::

在尝试连接开发服务器时，你可能会看到一个[带有错误的红屏](debugging.md#logbox)，提示：

:::note
连接到 `http://localhost:8081/debugger-proxy?role=client` 超时。你正在运行 node proxy 吗？如果你是在设备上运行，请检查 `RCTWebSocketExecutor.m` 中是否有正确的 IP 地址。
:::

要解决此问题，请检查以下几点。

#### 1. Wi-Fi 网络。

确保你的笔记本电脑和手机连接到**同一个** Wi-Fi 网络。

#### 2. IP 地址

确保构建脚本正确检测到了你机器的 IP 地址（例如 `10.0.1.123`）。

![](/docs/assets/XcodeBuildIP.png)

打开 **Report navigator** 选项卡，选择最后一次 **Build**，然后搜索 `IP=` 后跟一个 IP 地址。嵌入到应用中的 IP 地址应与你机器的 IP 地址一致。

## 为生产环境构建你的应用

你已经使用 React Native 构建了一个出色的应用，现在正迫不及待地想将其发布到 App Store。这个过程与任何其他原生 iOS 应用相同，只是需要考虑一些额外事项。请参阅[发布到 Apple App Store](publishing-to-app-store.md)指南以了解更多信息。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, iOS'

:::info
构建 iOS 设备上的应用需要一台 Mac。或者，你也可以参考我们的[环境设置指南](environment-setup)来了解如何使用 Expo CLI 构建应用，这将允许你使用 Expo 客户端应用运行你的应用。
:::

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, iOS'

:::info
构建 iOS 设备上的应用需要一台 Mac。或者，你也可以参考我们的[环境设置指南](environment-setup)来了解如何使用 Expo CLI 构建应用，这将允许你使用 Expo 客户端应用运行你的应用。
:::

</TabItem>
</Tabs>

</TabItem>
</Tabs>
