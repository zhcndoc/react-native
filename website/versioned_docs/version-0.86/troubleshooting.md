---
id: troubleshooting
title: 故障排除
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

以下是你在设置 React Native 时可能遇到的一些常见问题。如果你遇到这里未列出的问题，请尝试在 [GitHub 上搜索该问题](https://github.com/facebook/react-native/issues/)。

### 端口已被占用

[Metro bundler][metro] 运行在 8081 端口上。如果另一个进程已经在使用该端口，你可以终止该进程，或者更改 bundler 使用的端口。

#### 终止占用 8081 端口的进程

运行以下命令以查找正在监听 8081 端口的进程 id：

```shell
sudo lsof -i :8081
```

然后运行以下命令终止该进程：

```shell
kill -9 <PID>
```

在 Windows 上，你可以使用 [资源监视器](https://stackoverflow.com/questions/48198/how-can-you-find-out-which-process-is-listening-on-a-port-on-windows) 查找占用 8081 端口的进程，并使用任务管理器停止它。

#### 使用除 8081 之外的端口

你可以通过使用 `port` 参数来配置 bundler 使用除 8081 之外的端口，从项目根目录运行：

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

你还需要更新你的应用，以便从新端口加载 JavaScript bundle。如果是在 Xcode 中在设备上运行，可以通过在 `ios/__App_Name__.xcodeproj/project.pbxproj` 文件中将所有 `8081` 替换为你选择的端口来完成。

### NPM 锁定错误

如果你在使用 React Native CLI 时遇到类似 `npm WARN locking Error: EACCES` 的错误，请尝试运行以下命令：

```shell
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### React 缺少库

如果你是手动将 React Native 添加到项目中的，请确保你已经包含了所有正在使用的相关依赖项，例如 `RCTText.xcodeproj`、`RCTImage.xcodeproj`。接下来，这些依赖项构建出的二进制文件必须链接到你的应用二进制文件中。请在 Xcode 项目设置中的 `Linked Frameworks and Binaries` 部分进行设置。更详细的步骤请见：[链接库](linking-libraries-ios.md#content)。

如果你使用的是 CocoaPods，请确认你已经在 `Podfile` 中添加了 React 以及各个 subspec。例如，如果你使用了 `<Text />`、`<Image />` 和 `fetch()` API，你需要在 `Podfile` 中添加如下内容：

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText',
  'RCTImage',
  'RCTNetwork',
  'RCTWebSocket',
]
```

接下来，确保你已经运行了 `pod install`，并且项目中已经创建了一个安装了 React 的 `Pods/` 目录。CocoaPods 会提示你之后使用生成的 `.xcworkspace` 文件，以便能够使用这些已安装的依赖项。

#### 作为 CocoaPod 使用时，React Native 无法编译

有一个名为 [cocoapods-fix-react-native](https://github.com/orta/cocoapods-fix-react-native) 的 CocoaPods 插件，可以处理使用依赖管理器时因差异而可能需要对源代码进行的后续修复。

#### 参数列表过长：递归头文件展开失败

在项目的构建设置中，`User Search Header Paths` 和 `Header Search Paths` 是两个用于指定 Xcode 应该在哪里查找代码中 `#import` 头文件的配置项。对于 Pods，CocoaPods 使用一个默认数组来指定要查找的特定文件夹。请确认这个特定配置没有被覆盖，并且所配置的文件夹都不至于过大。如果其中某个文件夹很大，Xcode 会尝试递归搜索整个目录，并在某个时刻抛出上述错误。

要将 `User Search Header Paths` 和 `Header Search Paths` 构建设置恢复为 CocoaPods 设置的默认值，请在 Build Settings 面板中选中对应条目，然后按 delete。这样会移除自定义覆盖并恢复为 CocoaPods 默认值。

### 无可用传输

React Native 为 WebSockets 实现了一个 polyfill。这些 [polyfill](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js) 会作为你通过 `import React from 'react'` 引入到应用中的 react-native 模块的一部分进行初始化。如果你加载了另一个需要 WebSockets 的模块，例如 [Firebase](https://github.com/facebook/react-native/issues/3645)，请确保在 react-native 之后再加载/require 它：

```
import React from 'react';
import Firebase from 'firebase';
```

## Shell 命令无响应异常

如果你遇到如下所示的 ShellCommandUnresponsiveException 异常：

```
Execution failed for task ':app:installDebug'.
  com.android.builder.testing.api.DeviceException: com.android.ddmlib.ShellCommandUnresponsiveException
```

请在终端中运行以下命令以重启 ADB server：

```
adb kill-server
adb start-server
```

## 无法启动 react-native 包管理器（在 Linux 上）

### 情况 1：错误 "code":"ENOSPC","errno":"ENOSPC"

这是由 inotify（Linux 上 watchman 使用的）可监视的目录数量引起的问题。[inotify](https://github.com/guard/listen/blob/master/README.md#increasing-the-amount-of-inotify-watchers) 。要解决此问题，请在终端窗口中运行以下命令

```shell
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### 错误：spawnSync ./gradlew EACCES

如果你在 macOS 上运行 `npm run android` 或 `yarn android` 时遇到上述错误，请尝试运行 `sudo chmod +x android/gradlew` 命令，将 `gradlew` 文件设为可执行。

[metro]: https://metrobundler.dev/
