---
id: troubleshooting
title: 故障排除
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

这是在设置 React Native 时可能遇到的一些常见问题。如果你遇到此处未列出的问题，请尝试 [在 GitHub 上搜索该问题](https://github.com/facebook/react-native/issues/)。

### 端口已被占用

[Metro 打包器][metro] 运行在端口 8081 上。如果另一个进程已经使用该端口，你可以终止该进程，或更改打包器使用的端口。

#### 终止端口 8081 上的进程

运行以下命令以查找监听端口 8081 的进程 ID：

```shell
sudo lsof -i :8081
```

然后运行以下命令终止进程：

```shell
kill -9 <PID>
```

在 Windows 上，你可以使用 [资源监视器](https://stackoverflow.com/questions/48198/how-can-you-find-out-which-process-is-listening-on-a-port-on-windows) 查找使用端口 8081 的进程，并使用任务管理器停止它。

#### 使用 8081 以外的端口

你可以通过使用 `port` 参数配置打包器使用 8081 以外的端口，从项目根目录运行：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm start -- --port=8088
```

</TabItem>
<TabItem value="yarn">

```shell
yarn start --port 8088
```

</TabItem>
</Tabs>

你还需要更新应用程序以从新端口加载 JavaScript bundle。如果在 Xcode 中在设备上运行，你可以通过在 `ios/__App_Name__.xcodeproj/project.pbxproj` 文件中将 `8081` 的出现更新为你选择的端口来实现。

### NPM 锁定错误

如果在使用 React Native CLI 时遇到诸如 `npm WARN locking Error: EACCES` 之类的错误，尝试运行以下命令：

```shell
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### 缺少 React 库

如果你是手动将 React Native 添加到项目中，请确保包含了所有使用的相关依赖，如 `RCTText.xcodeproj`、`RCTImage.xcodeproj`。接下来，这些依赖构建的二进制文件必须链接到你的应用二进制文件。使用 Xcode 项目设置中的 `Linked Frameworks and Binaries` 部分。更详细的步骤在这里：[链接库](linking-libraries-ios.md#content)。

如果你使用的是 CocoaPods，请验证是否已将 React 连同子规格（subspecs）一起添加到 `Podfile` 中。例如，如果你使用的是 `<Text />`、`<Image />` 和 `fetch()` API，你需要在 `Podfile` 中添加这些：

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText',
  'RCTImage',
  'RCTNetwork',
  'RCTWebSocket',
]
```

接下来，确保你已运行 `pod install`，并且项目中已创建包含 React 安装的 `Pods/` 目录。CocoaPods 将指示你从此以后使用生成的 `.xcworkspace` 文件以便能够使用这些安装的依赖。

#### 当作为 CocoaPod 使用时 React Native 无法编译

有一个名为 [cocoapods-fix-react-native](https://github.com/orta/cocoapods-fix-react-native) 的 CocoaPods 插件，它处理由于使用依赖管理器时的差异而导致的任何潜在的源代码后期修复。

#### 参数列表过长：递归头扩展失败

在项目的构建设置中，`User Search Header Paths` 和 `Header Search Paths` 是两个配置，指定 Xcode 应该在何处查找代码中指定的 `#import` 头文件。对于 Pods，CocoaPods 使用默认的特定文件夹数组来查找。验证此特定配置未被覆盖，并且配置的文件夹都不太大。如果其中一个文件夹是大文件夹，Xcode 将尝试递归搜索整个目录并在某时抛出上述错误。

要将 `User Search Header Paths` 和 `Header Search Paths` 构建设置恢复为 CocoaPods 设置的默认值 - 在构建设置面板中选择条目，然后按删除键。这将移除自定义覆盖并返回到 CocoaPod 默认值。

### 没有可用的传输

React Native 实现了 WebSockets 的 polyfill。这些 [polyfills](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js) 作为 react-native 模块的一部分初始化，该模块通过 `import React from 'react'` 包含在你的应用程序中。如果你加载另一个需要 WebSockets 的模块，例如 [Firebase](https://github.com/facebook/react-native/issues/3645)，请确保在 react-native 之后加载/要求它：

```
import Firebase from 'firebase';
```

## Shell 命令无响应异常

如果你遇到诸如以下的 ShellCommandUnresponsiveException 异常：

```
Execution failed for task ':app:installDebug'.
  com.android.builder.testing.api.DeviceException: com.android.ddmlib.ShellCommandUnresponsiveException
```

通过在终端中运行以下命令重启 ADB 服务器：

```
adb kill-server
adb start-server
```

## 无法启动 react-native 包管理器（在 Linux 上）

### 情况 1：错误 "code":"ENOSPC","errno":"ENOSPC"

问题由 [inotify](https://github.com/guard/listen/blob/master/README.md#increasing-the-amount-of-inotify-watchers) 可以监控的目录数量引起（在 Linux 上由 watchman 使用）。要解决它，请在终端窗口中运行此命令

```shell
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### 错误：spawnSync ./gradlew EACCES

如果你遇到问题，即在 macOS 上执行 `npm run android` 或 `yarn android` 时抛出上述错误，尝试运行 `sudo chmod +x android/gradlew` 命令使 `gradlew` 文件可执行。

[metro]: https://metrobundler.dev/
