---
id: debugging-native-code
title: 调试原生代码
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="banner-native-code-required">
  <h3>仅适用于包含原生代码的项目</h3>
  <p>以下部分仅适用于已公开原生代码的项目。如果你使用的是托管式 Expo 工作流，请参阅 <a href="https://docs.expo.dev/workflow/prebuild/" target="_blank">prebuild</a> 指南以使用此 API。</p>
</div>

## 访问日志

应用运行时，你可以在终端中使用以下命令查看 iOS 或 Android 应用的原生日志：

```shell
# For Android:
npx react-native log-android
# Or, for iOS:
npx react-native log-ios
```

你也可以在 iOS Simulator 中通过“调试 > 打开系统日志…”访问这些日志，或者在设备或模拟器上运行 Android 应用时，在终端中运行 `adb logcat "*:S" ReactNative:V ReactNativeJS:V`。

<details>
<summary>**💡 自定义原生日志**</summary>

如果你正在编写 Native Module，并希望为模块添加用于调试的自定义日志，可以使用以下方法：

#### Android（Java/Kotlin）

在原生模块中，使用 `Log` 类添加日志，这些日志可以在 Logcat 中查看：

```java
import android.util.Log;

private void log(String message) {
    Log.d("YourModuleName", message);
}
```

要在 Logcat 中查看这些日志，请使用此命令，并将 `YourModuleName` 替换为你的自定义标签：

```shell
adb logcat "*:S" ReactNative:V ReactNativeJS:V YourModuleName:D
```

#### iOS（Objective-C/Swift）

在原生模块中，使用 `NSLog` 记录自定义日志：

```objectivec
NSLog(@"YourModuleName: %@", message);
```

或者，在 Swift 中：

```swift
print("YourModuleName: \(message)")
```

运行应用时，这些日志会显示在 Xcode 控制台中。

</details>

## 在原生 IDE 中调试

处理原生代码时，例如编写原生模块时，你可以从 Android Studio 或 Xcode 启动应用，并利用原生调试功能（设置断点等），就像构建标准原生应用时一样。

另一种方式是使用 React Native CLI 运行应用，然后将原生 IDE（Android Studio 或 Xcode）的原生调试器附加到该进程。

### Android Studio

在 Android Studio 中，你可以通过菜单栏中的“运行”选项执行此操作，点击“附加到进程…”，然后选择正在运行的 React Native 应用。

### Xcode

在 Xcode 中，点击顶部菜单栏中的“调试”，选择“附加到进程”选项，然后从“可能的目标”列表中选择应用。
