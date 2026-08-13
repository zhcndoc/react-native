---
id: troubleshooting
title: 故障排除
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

以下是设置 React Native 时可能遇到的一些常见问题。如果遇到此处未列出的问题，请尝试[在 GitHub 中搜索该问题](https://github.com/facebook/react-native/issues/)。

### 端口已被占用

[Metro bundler][metro] 在端口 8081 上运行。如果已有其他进程正在使用该端口，你可以终止该进程，或更改 bundler 使用的端口。

#### 终止占用端口 8081 的进程

运行以下命令，查找正在监听端口 8081 的进程 ID：

```shell
sudo lsof -i :8081
```

然后运行以下命令终止该进程：

```shell
kill -9 <PID>
```

在 Windows 上，你可以使用[资源监视器](https://stackoverflow.com/questions/48198/how-can-you-find-out-which-process-is-listening-on-a-port-on-windows)查找占用端口 8081 的进程，并使用任务管理器将其停止。

#### 使用 8081 以外的端口

你可以使用 `port` 参数，将 bundler 配置为使用 8081 以外的端口。在项目根目录运行：

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

你还需要更新应用，使其从新端口加载 JavaScript bundle。如果通过 Xcode 在设备上运行，可以在 `ios/__App_Name__.xcodeproj/project.pbxproj` 文件中，将所有出现的 `8081` 更新为你选择的端口。

### NPM 锁定错误

如果在使用 React Native CLI 时遇到类似 `npm WARN locking Error: EACCES` 的错误，请尝试运行以下命令：

```shell
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### React 缺少库

如果你手动将 React Native 添加到项目中，请确保已包含所使用的所有相关依赖项，例如 `RCTText.xcodeproj`、`RCTImage.xcodeproj`。接下来，必须将这些依赖项构建的二进制文件链接到应用二进制文件。使用 Xcode 项目设置中的 `Linked Frameworks and Binaries` 部分。更详细的步骤请参见此处：[链接库](linking-libraries-ios.md#content)。

如果你使用 CocoaPods，请确认已在 `Podfile` 中添加 React 及其 subspecs。例如，如果你使用 `<Text />`、`<Image />` 和 `fetch()` API，则需要将以下内容添加到 `Podfile` 中：

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText',
  'RCTImage',
  'RCTNetwork',
  'RCTWebSocket',
]
```

接下来，确保已运行 `pod install`，并且项目中已创建 `Pods/` 目录，其中安装了 React。CocoaPods 会指示你之后使用生成的 `.xcworkspace` 文件，以便使用这些已安装的依赖项。

#### React Native 作为 CocoaPod 使用时无法编译

有一个名为 [cocoapods-fix-react-native](https://github.com/orta/cocoapods-fix-react-native) 的 CocoaPods 插件，可以处理由于使用依赖管理器时存在差异而可能需要对源代码进行的后续修复。

#### 参数列表过长：递归标头扩展失败

在项目的构建设置中，`User Search Header Paths` 和 `Header Search Paths` 是两个用于指定 Xcode 应在何处查找代码中指定的 `#import` 标头文件的配置。对于 Pods，CocoaPods 使用一个由特定文件夹组成的默认数组来指定查找位置。请确认此配置未被覆盖，并且配置的文件夹都没有过大。如果其中一个文件夹很大，Xcode 将尝试递归搜索整个目录，并在某个时候抛出上述错误。

要将 `User Search Header Paths` 和 `Header Search Paths` 构建设置恢复为 CocoaPods 设置的默认值，请在 Build Settings 面板中选择该条目，然后按 Delete。这将移除自定义覆盖，并恢复为 CocoaPod 默认值。

### 没有可用的传输方式

React Native 为 WebSockets 实现了 polyfill。这些 [polyfill](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js) 会作为你通过 `import React from 'react'` 在应用中引入的 react-native 模块的一部分进行初始化。如果你加载的另一个模块需要 WebSockets，例如 [Firebase](https://github.com/facebook/react-native/issues/3645)，请确保在 react-native 之后加载或 require 它：

```
import Firebase from 'firebase';
```

## Shell Command Unresponsive Exception

如果遇到类似以下情况的 ShellCommandUnresponsiveException 异常：

```
Execution failed for task ':app:installDebug'.
  com.android.builder.testing.api.DeviceException: com.android.ddmlib.ShellCommandUnresponsiveException
```

在终端中运行以下命令重启 ADB 服务器：

```
adb kill-server
adb start-server
```

## 无法启动 react-native package manager（在 Linux 上）

### 情况 1：错误 `"code":"ENOSPC","errno":"ENOSPC"`

该问题是由 [inotify](https://github.com/guard/listen/blob/master/README.md#increasing-the-amount-of-inotify-watchers)（Linux 上由 watchman 使用）可以监控的目录数量导致的。要解决此问题，请在终端窗口中运行以下命令

```shell
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### 错误：spawnSync ./gradlew EACCES

如果在 macOS 上运行 `npm run android` 或 `yarn android` 时遇到上述问题，请尝试运行 `sudo chmod +x android/gradlew` 命令，将 `gradlew` 文件设置为可执行文件。

[metro]: https://metrobundler.dev/
