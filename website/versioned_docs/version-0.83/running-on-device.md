---
id: running-on-device
title: 设备上运行
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在发布应用给用户之前，在真实设备上测试你的应用总是一个好主意。本文档将指导你完成在设备上运行 React Native 应用并准备生产环境的必要步骤。

:::tip
如果你使用 `create-expo-app` 创建了项目，可以通过扫描运行 `npm start` 时显示的二维码，在 Expo Go 中在设备上运行你的应用。详细信息请参阅 Expo 指南：[在设备上运行你的项目](https://docs.expo.dev/get-started/expo-go/)。
:::

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

## 在 Android 设备上运行你的应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只允许安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发过程中安装你的应用。

启用 USB 调试之前，需先启用“开发者选项”菜单：进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `版本号` 七次。之后返回 **设置** → **开发者选项**，开启"USB 调试”。

### 2. 使用 USB 连接设备

现在来设置 Android 设备以运行我们的 React Native 项目。将设备通过 USB 连接到开发机器。

然后运行 `adb devices` 检查设备是否正确连接到 ADB（Android 调试桥）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # 谷歌模拟器
14ed2fcc device         # 物理设备
```

右侧显示 `device` 表示设备已连接。**一次只能连接一个设备**。

:::note
如果设备列表显示 `unauthorized`，你需要运行 `adb reverse tcp:8081 tcp:8081`，并在设备上允许 USB 调试。
:::

### 3. 运行你的应用

在项目根目录，在命令行输入以下命令以安装并启动应用：

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
如果出现"bridge configuration isn't available"错误，请参考 [使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 生成并运行 `release` 版本（例如，在项目根目录输入：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接开发服务器来快速迭代设备上的应用。这有多种方式，取决于你是否使用 USB 线或使用 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行 Android 5.0（Lollipop）或以上版本，已开启 USB 调试，并通过 USB 连接到开发机器，你可以使用此方法。

在命令行运行：

```shell
$ adb -s <设备名称> reverse tcp:8081 tcp:8081
```

使用以下命令查询设备名称：

```shell
$ adb devices
```

现在你可以在 [开发菜单](debugging.md#opening-the-dev-menu) 中启用快速刷新。每当 JavaScript 代码变更时，应用会自动重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接开发服务器。先使用 USB 线安装应用，完成后即可无线调试。需要先获得开发机器当前 IP 地址。

你可在 **系统设置（或系统偏好设置）** → **网络** 中查看 IP 地址。

1. 确保笔记本和手机处于**同一 Wi-Fi 网络**。
2. 在设备上打开 React Native 应用。
3. 你会看到一个带错误信息的 [红屏](debugging.md#logbox)，这是正常的，后续步骤会解决。
4. 打开应用内的 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机与端口**。
6. 输入你的开发机器 IP 与本地服务器端口（如 `10.0.1.1:8081`）。
7. 返回 **开发菜单**，选择 **重新加载 JS**。

现在你可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当 JavaScript 代码更新时，应用会自动重新加载。

## 为生产构建你的应用

你已用 React Native 构建了一个优秀的应用，迫不及待想发布到 Play 商店。其流程与其他本地 Android 应用相同，但有一些额外注意事项。请参阅 [生成签名 APK](signed-apk-android.md) 指南了解详情。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只允许安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发过程中安装你的应用。

启用 USB 调试之前，需先启用“开发者选项”菜单：进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `版本号` 七次。之后返回 **设置** → **开发者选项**，开启"USB 调试”。

### 2. 使用 USB 连接设备

现在来设置 Android 设备以运行我们的 React Native 项目。将设备通过 USB 连接到开发机器。

然后运行 `adb devices` 检查设备是否正确连接到 ADB（Android 调试桥）。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # 谷歌模拟器
14ed2fcc device         # 物理设备
```

右侧显示 `device` 表示设备已连接。**一次只能连接一个设备**。

### 3. 运行你的应用

在项目根目录，在命令行输入以下命令以安装并启动应用：

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
你也可以使用 `React Native CLI` 生成并运行 `release` 版本（例如，在项目根目录输入：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接开发服务器来快速迭代设备上的应用。这有多种方式，取决于你是否使用 USB 线或使用 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行 Android 5.0（Lollipop）或以上版本，已开启 USB 调试，并通过 USB 连接到开发机器，你可以使用此方法。

在命令行运行：

```shell
$ adb -s <设备名称> reverse tcp:8081 tcp:8081
```

使用以下命令查询设备名称：

```shell
$ adb devices
```

现在你可以在 [开发菜单](debugging.md#opening-the-dev-menu) 中启用快速刷新。每当 JavaScript 代码变更时，应用会自动重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接开发服务器。先使用 USB 线安装应用，完成后即可无线调试。需要先获得开发机器当前 IP 地址。

打开命令提示符并输入 `ipconfig` 获取机器 IP 地址（[更多信息](https://windows.microsoft.com/en-us/windows/using-command-line-tools-networking-information)）。

1. 确保笔记本和手机处于**同一 Wi-Fi 网络**。
2. 在设备上打开 React Native 应用。
3. 你会看到一个带错误信息的 [红屏](debugging.md#logbox)，这是正常的，后续步骤会解决。
4. 打开应用内的 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机与端口**。
6. 输入你的开发机器 IP 与本地服务器端口（如 `10.0.1.1:8081`）。
7. 返回 **开发菜单**，选择 **重新加载 JS**。

现在你可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当 JavaScript 代码更新时，应用会自动重新加载。

## 为生产构建你的应用

你已用 React Native 构建了一个优秀的应用，迫不及待想发布到 Play 商店。其流程与其他本地 Android 应用相同，但有一些额外注意事项。请参阅 [生成签名 APK](signed-apk-android.md) 指南了解详情。

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, Android'

### 1. 启用 USB 调试

大多数 Android 设备默认只允许安装和运行从 Google Play 下载的应用。你需要在设备上启用 USB 调试，才能在开发过程中安装你的应用。

启用 USB 调试之前，需先启用“开发者选项”菜单：进入 **设置** → **关于手机** → **软件信息**，然后连续点击底部的 `版本号` 七次。之后返回 **设置** → **开发者选项**，开启"USB 调试”。

### 2. 使用 USB 连接设备

现在来设置 Android 设备以运行我们的 React Native 项目。将设备通过 USB 连接到开发机器。

接下来，使用 `lsusb` 检查厂商代码（Mac 需先 [安装 lsusb](https://github.com/jlhonora/lsusb)）。`lsusb` 返回类似：

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

这些是当前连接设备的 USB 信息。

找到代表你的手机的那一行。若不确定，拔掉手机后重试：

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

可见带手机型号（此例中为"Motorola PCS"）那一行已消失，即为关注对象。

`Bus 001 Device 003: ID 22b8:2e76 Motorola PCS`

从上述信息取设备 ID 的前四位：`22b8:2e76`，即取 `22b8`，代表 Motorola。

将其写入 udev 规则以使用设备：

```shell
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
```

注意替换 `22b8` 为你设备对应的 ID。

然后运行 `adb devices` 检查设备是否正确连接到 ADB。

```shell
$ adb devices
List of devices attached
emulator-5554 offline   # 谷歌模拟器
14ed2fcc device         # 物理设备
```

右侧显示 `device` 表示设备已连接。**一次只能连接一个设备**。

### 3. 运行你的应用

在项目根目录，输入以下命令以安装并启动应用：

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
如果出现"bridge configuration isn't available"错误，请参考 [使用 adb reverse](running-on-device.md#method-1-using-adb-reverse-recommended)。
:::

:::tip
你也可以使用 `React Native CLI` 生成并运行 `release` 版本（例如，在项目根目录输入：`yarn android --mode release`）。
:::

<h2>连接开发服务器</h2>

你还可以通过连接开发服务器来快速迭代设备上的应用。这有多种方式，取决于你是否使用 USB 线或使用 Wi-Fi 网络。

### 方法 1：使用 adb reverse（推荐）

如果你的设备运行 Android 5.0（Lollipop）或以上版本，已开启 USB 调试，并通过 USB 连接到开发机器，你可以使用此方法。

在命令行运行：

```shell
$ adb -s <设备名称> reverse tcp:8081 tcp:8081
```

使用以下命令查询设备名称：

```shell
$ adb devices
```

现在你可以在 [开发菜单](debugging.md#opening-the-dev-menu) 中启用快速刷新。每当 JavaScript 代码变更时，应用会自动重新加载。

### 方法 2：通过 Wi-Fi 连接

你也可以通过 Wi-Fi 连接开发服务器。先使用 USB 线安装应用，完成后即可无线调试。需要先获得开发机器当前 IP 地址。

打开终端，输入 `/sbin/ifconfig` 查找本机 IP。

1. 确保笔记本和手机处于**同一 Wi-Fi 网络**。
2. 在设备上打开 React Native 应用。
3. 你会看到一个带错误信息的 [红屏](debugging.md#logbox)，这是正常的，后续步骤会解决。
4. 打开应用内的 [开发菜单](debugging.md#opening-the-dev-menu)。
5. 进入 **开发设置** → **设备的调试服务器主机与端口**。
6. 输入你的开发机器 IP 与本地服务器端口（如 `10.0.1.1:8081`）。
7. 返回 **开发菜单**，选择 **重新加载 JS**。

现在你可以从 [开发菜单](debugging.md#opening-the-dev-menu) 启用快速刷新。每当 JavaScript 代码更新时，应用会自动重新加载。

## 为生产构建你的应用

你已用 React Native 构建了一个优秀的应用，迫不及待想发布到 Play 商店。其流程与其他本地 Android 应用相同，但有一些额外注意事项。请参阅 [生成签名 APK](signed-apk-android.md) 指南了解详情。

</TabItem>
</Tabs>

</TabItem>
<TabItem value="ios">

## 在 iOS 设备上运行你的应用

#### 开发操作系统

<Tabs groupId="os" queryString defaultValue={constants.defaultOs} values={constants.oses} className="pill-tabs">
<TabItem value="macos">

[//]: # 'macOS, iOS'

### 1. 使用 USB 连接设备

使用 USB 转 Lightning 或 USB-C 线将 iOS 设备连接到 Mac。进入项目中的 `ios` 文件夹，用 Xcode 打开 `.xcodeproj` 文件，或者如果使用 CocoaPods，打开 `.xcworkspace`。

如果是第一次在该 iOS 设备运行应用，可能需要注册设备。点击 Xcode 菜单栏的 **Product**，然后选择 **Destination**，在列表中找到并选择你的设备，Xcode 会注册设备用于开发。

### 2. 配置代码签名

如果尚未注册，[注册 Apple 开发者账户](https://developer.apple.com/)。

在 Xcode 项目导航中选择你的项目，再选择主 Target（与项目名称相同）。进入 "General" 标签页，找到 "Signing" 部分，确保在 Team 下拉列表中选择了你的 Apple 开发者账号或团队。测试 Target 也同样设置（名字以 Tests 结尾，位于主 Target 下方）。

**重复**上述步骤，针对项目中的**测试 Targets**。

![](/docs/assets/RunningOnDeviceCodeSigning.png)

### 3. 构建并运行应用

若设置正确，Xcode 工具栏会显示你的设备作为构建目标，设备也会显示在设备面板中（快捷键 <kbd>Shift ⇧</kbd> + <kbd>Cmd ⌘</kbd> + <kbd>2</kbd>）。点击 **构建并运行** 按钮（快捷键 <kbd>Cmd ⌘</kbd> + <kbd>R</kbd>）或从 **Product** 菜单选择 **Run**，应用很快会在设备上启动。

![](/docs/assets/RunningOnDeviceReady.png)

:::note
如有问题，请参阅苹果官方文档 [在设备上启动你的应用](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4)。
:::

<h2>连接开发服务器</h2>

你也可以在设备上通过连接开发服务器快速迭代。只需保证设备和电脑处于同一 Wi-Fi 网络。摇晃设备打开 [开发菜单](debugging.md#opening-the-dev-menu)，然后启用快速刷新。每当 JavaScript 变更时，应用会自动重新加载。

![](/docs/assets/debugging-dev-menu-083.jpg)

### 故障排除

:::tip
如遇问题，请确认 Mac 和设备处于同一网络且互通。许多公共无线网络带有认证门户，会阻止设备相互访问。此时你可以开启手机的个人热点功能。也可以通过 USB 从 Mac 共享网络连接给设备，从而通过该通道连接到打包工具，传输速度极快。
:::

如果连接开发服务器时出现 [红屏错误](debugging.md#logbox) 如：

:::note
连接 `http://localhost:8081/debugger-proxy?role=client` 超时。请确认你是否运行了节点代理？如果是在设备上运行，请检查 `RCTWebSocketExecutor.m` 中 IP 地址是否正确。
:::

请检查以下项：

#### 1. Wi-Fi 网络

确保你的笔记本和手机处于**同一 Wi-Fi 网络**。

#### 2. IP 地址

确认构建脚本正确检测到你的机器 IP（如 `10.0.1.123`）。

![](/docs/assets/XcodeBuildIP.png)

打开 **报告导航器**，选择最后一次 **构建**，搜索 `IP=` 后跟的 IP 地址。内嵌在应用中的 IP 地址应与机器 IP 一致。

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## 为生产构建你的应用

你已用 React Native 构建了一个优秀的应用，迫不及待想发布到 App Store。其流程与其他本地 iOS 应用相同，但有一些额外注意事项。请参阅 [发布到 Apple App Store](publishing-to-app-store.md) 指南了解详情。

</TabItem>
<TabItem value="windows">

[//]: # 'Windows, iOS'

:::info
构建 iOS 应用需要使用 Mac。或者，你可以参考我们的 [环境搭建指南](environment-setup)，了解如何使用 Expo CLI 构建应用，这样可以使用 Expo 客户端运行应用。
:::

</TabItem>
<TabItem value="linux">

[//]: # 'Linux, iOS'

:::info
构建 iOS 应用需要使用 Mac。或者，你可以参考我们的 [环境搭建指南](environment-setup)，了解如何使用 Expo CLI 构建应用，这样可以使用 Expo 客户端运行应用。
:::

</TabItem>
</Tabs>

</TabItem>
</Tabs>