---
id: debugging-native-code
title: 调试原生代码
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<div className="banner-native-code-required">
  <h3>仅适用于包含原生代码的项目</h3>
  <p>以下部分仅适用于已暴露原生代码的项目。如果你使用的是托管的 Expo 工作流，请参阅 <a href="https://docs.expo.dev/workflow/prebuild/" target="_blank">prebuild</a> 指南，以使用此 API。</p>
</div>

## 访问日志

当应用正在运行时，你可以在终端中使用以下命令来显示 iOS 或 Android 应用的原生日志：

```shell
# 对于 Android：
npx react-native log-android
# 或者，对于 iOS：
npx react-native log-ios
```

你也可以通过 iOS 模拟器中的 Debug > Open System Log… 访问这些日志，或者在 Android 应用运行于设备或模拟器时，在终端中执行 `adb logcat "*:S" ReactNative:V ReactNativeJS:V`。

<details>
<summary>**💡 自定义原生日志**</summary>

如果你正在编写一个 Native Module，并希望为该模块添加自定义日志以便调试，你可以使用以下方法：

#### Android (Java/Kotlin)

在你的原生模块中，使用 `Log` 类添加可在 Logcat 中查看的日志：

```java
import android.util.Log;

private void log(String message) {
    Log.d("YourModuleName", message);
}
```

要在 Logcat 中查看这些日志，请使用以下命令，并将 `YourModuleName` 替换为你的自定义标签：

```shell
adb logcat "*:S" ReactNative:V ReactNativeJS:V YourModuleName:D
```

#### iOS (Objective-C/Swift)

在你的原生模块中，使用 `NSLog` 添加自定义日志：

```objective-c
NSLog(@"YourModuleName: %@", message);
```

或者，在 Swift 中：

```swift
print("YourModuleName: \(message)")
```

运行应用时，这些日志将出现在 Xcode 控制台中。

</details>

## 在原生 IDE 中调试

在使用原生代码时，例如编写原生模块时，你可以从 Android Studio 或 Xcode 启动应用，并像构建标准原生应用一样利用原生调试功能（设置断点等）。

另一种方式是使用 React Native CLI 运行你的应用，然后将原生 IDE（Android Studio 或 Xcode）的原生调试器附加到该进程。

### Android Studio

在 Android Studio 中，你可以通过进入菜单栏中的 "Run" 选项，点击 "Attach to Process..."，然后选择正在运行的 React Native 应用来实现。

### Xcode

在 Xcode 中，点击顶部菜单栏中的 "Debug"，选择 "Attach to process" 选项，然后在 "Likely Targets" 列表中选择该应用。
