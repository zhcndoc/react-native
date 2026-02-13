---
id: debugging-native-code
title: 调试原生代码
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="banner-native-code-required">
  <h3>仅包含原生代码的项目</h3>
  <p>以下内容仅适用于暴露了原生代码的项目。如果你使用的是托管的 Expo 工作流，请参阅关于 <a href="https://docs.expo.dev/workflow/prebuild/" target="_blank">预构建（prebuild）</a> 的指南来使用此 API。</p>
</div>

## 访问日志

在应用运行时，您可以通过在终端使用以下命令来查看 iOS 或 Android 应用的原生日志：

```shell
# 用于 Android：
npx react-native log-android
# 或者，用于 iOS：
npx react-native log-ios
```

您也可以通过 iOS 模拟器上的 Debug > Open System Log… 来访问，或者在 Android 设备或模拟器上运行应用时，在终端运行 `adb logcat "*:S" ReactNative:V ReactNativeJS:V`。

<details>
<summary>**💡 自定义原生日志**</summary>

如果您正在编写原生模块，并想为模块添加自定义日志以便调试，可以使用以下方法：

#### Android（Java/Kotlin）

在您的原生模块中，使用 `Log` 类添加可在 Logcat 中查看的日志：

```java
import android.util.Log;

private void log(String message) {
    Log.d("YourModuleName", message);
}
```

要在 Logcat 中查看这些日志，使用以下命令，将 `YourModuleName` 替换为您的自定义标签：

```shell
adb logcat "*:S" ReactNative:V ReactNativeJS:V YourModuleName:D
```

#### iOS（Objective-C/Swift）

在您的原生模块中，使用 `NSLog` 添加自定义日志：

```objective-c
NSLog(@"YourModuleName: %@", message);
```

或者在 Swift 中：

```swift
print("YourModuleName: \(message)")
```

这些日志将在 Xcode 控制台中显示，前提是您正在运行该应用。

</details>

## 在原生 IDE 中调试

当处理原生代码时，例如编写原生模块，您可以通过 Android Studio 或 Xcode 启动应用，利用其原生调试功能（设置断点等），就像构建常规原生应用一样。

另一种方式是使用 React Native CLI 运行应用，并将原生 IDE（Android Studio 或 Xcode）的原生调试器附加到该进程。

### Android Studio

在 Android Studio 中，您可以通过点击菜单栏的“Run”选项，选择“Attach to Process...”，然后选择正在运行的 React Native 应用来实现。

### Xcode

在 Xcode 中，点击顶部菜单栏的“Debug”，选择“Attach to process”选项，然后在“Likely Targets”列表中选择您的应用程序。