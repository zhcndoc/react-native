---
id: troubleshooting
title: 故障排除
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

以下是设置 React Native 时可能遇到的一些常见问题。如果你遇到未在此处列出的问题，可以尝试[在 GitHub 上搜索该问题](https://github.com/facebook/react-native/issues/)。

### 端口已被占用

[Metro bundler][metro] 运行在 8081 端口。如果另一个进程已经使用了该端口，你可以终止该进程，或者更改 bundler 使用的端口。

#### 终止使用 8081 端口的进程

运行以下命令找到监听 8081 端口的进程 ID：

```shell
sudo lsof -i :8081
```

然后运行以下命令终止该进程：

```shell
kill -9 <PID>
```

在 Windows 上，你可以使用[资源监视器](https://stackoverflow.com/questions/48198/how-can-you-find-out-which-process-is-listening-on-a-port-on-windows) 查找使用 8081 端口的进程，并使用任务管理器停止它。

#### 使用非 8081 端口

你可以通过 `port` 参数配置 bundler 使用除 8081 以外的端口，从项目根目录运行：

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

你还需要更新应用以从新端口加载 JavaScript 包。如果是在 Xcode 中运行的设备上，可以通过修改 `ios/__App_Name__.xcodeproj/project.pbxproj` 文件中所有的 `8081` 端口为你选择的新端口来实现。

### NPM 锁定错误

如果在使用 React Native CLI 时遇到 `npm WARN locking Error: EACCES` 错误，尝试运行以下命令：

```shell
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### 缺少 React 相关库

如果你是手动将 React Native 添加至项目中，确保已包含所有相关依赖，比如 `RCTText.xcodeproj`、`RCTImage.xcodeproj` 等。接着，这些依赖构建出的二进制文件必须链接到你的应用二进制文件中。使用 Xcode 项目设置中的 `Linked Frameworks and Binaries` 部分。详细步骤请参见：[链接库](linking-libraries-ios.md#content)。

如果你使用 CocoaPods，确认已在 `Podfile` 中添加了 React 及其子模块。例如，如果你使用了 `<Text />`、`<Image />` 和 `fetch()` API，需要在 `Podfile` 中加入：

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText',
  'RCTImage',
  'RCTNetwork',
  'RCTWebSocket',
]
```

然后确保运行了 `pod install`，并且 `Pods/` 目录已创建且安装了 React。CocoaPods 会提示你今后使用生成的 `.xcworkspace` 文件以便使用这些安装的依赖。

#### 作为 CocoaPod 使用时 React Native 无法编译

有一个 CocoaPods 插件叫做 [cocoapods-fix-react-native](https://github.com/orta/cocoapods-fix-react-native)，它可以处理由于使用依赖管理器时源码可能需要的后期修正。

#### 参数列表过长：递归头文件扩展失败

在项目的构建设置中，`User Search Header Paths` 和 `Header Search Paths` 是两个指定 Xcode 应该在哪些位置查找代码中 `#import` 的头文件配置。对于 Pods，CocoaPods 使用了一组默认的特定文件夹数组。确认该配置没有被覆盖，且没有配置的文件夹过大。如果某个文件夹过大，Xcode 会试图递归搜索整个目录，最终抛出上述错误。

要恢复 CocoaPods 默认的 `User Search Header Paths` 和 `Header Search Paths` 设置，在 Build Settings 面板中选中该条目并按删除。此操作会去除自定义覆盖，恢复到 CocoaPods 默认。

### 无可用传输方式

React Native 实现了 WebSockets 的 polyfill。这些[polyfill](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js) 是作为 react-native 模块的一部分在你通过 `import React from 'react'` 导入时初始化的。如果你加载了另一个需要 WebSocket 支持的模块，比如 [Firebase](https://github.com/facebook/react-native/issues/3645)，确保在加载它之前已经加载了 react-native：

```
import React from 'react';
import Firebase from 'firebase';
```

## Shell Command Unresponsive 异常

如果遇到类似下面的 ShellCommandUnresponsiveException 异常：

```
Execution failed for task ':app:installDebug'.
  com.android.builder.testing.api.DeviceException: com.android.ddmlib.ShellCommandUnresponsiveException
```

可以通过在终端运行以下命令重启 ADB 服务器：

```
adb kill-server
adb start-server
```

## 无法启动 react-native 包管理器（在 Linux 上）

### 情况一：报错 "code":"ENOSPC","errno":"ENOSPC"

这是因为 [inotify](https://github.com/guard/listen/blob/master/README.md#increasing-the-amount-of-inotify-watchers)（Linux 上 watchman 使用）可监控的目录数量限制导致的。解决该问题，在终端窗口运行：

```shell
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### 错误：spawnSync ./gradlew EACCES

如果在 macOS 上执行 `npm run android` 或 `yarn android` 报上述错误，尝试运行命令 `sudo chmod +x android/gradlew` 将 `gradlew` 文件设置为可执行。

[metro]: https://metrobundler.dev/