import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 原生模块生命周期

在 React Native 中，原生模块是单例。原生模块基础设施在第一次被访问时才懒加载创建一个原生模块，并且只要应用需要它，就会一直保留它。这是一种性能优化，可以避免在应用启动时急切创建原生模块的开销，并确保更快的启动时间。

在纯 React Native 应用中，原生模块只会创建一次，并且永远不会被销毁。然而，在更复杂的应用中，可能会有需要销毁并重新创建原生模块的场景。比如，设想一个 brownfield 应用，它将一些原生视图与一些 React Native 界面混合在一起，如 [与现有应用集成指南](/docs/integration-with-existing-apps) 中所示。在这种情况下，当用户离开某个 React Native 界面时，销毁一个 React Native 实例，并在用户返回该界面时重新创建它，可能是合理的。

当这种情况发生时，无状态的原生模块不会引起任何问题。然而，对于有状态的原生模块，可能有必要正确地使原生模块失效，以确保状态被重置，并且资源被释放。

在本指南中，你将了解如何正确初始化和使一个原生模块失效。本指南假设你已经熟悉如何编写原生模块，并且能够熟练编写原生代码。如果你还不熟悉原生模块，请先阅读 [原生模块指南](/docs/next/turbo-native-modules-introduction)。

## Android

在 Android 中，所有原生模块都已经实现了一个 [TurboModule](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/interfaces/TurboModule.kt) 接口，该接口定义了两个方法：`initialize()` 和 `invalidate()`。

`initialize()` 方法会在原生模块被创建时由原生模块基础设施调用。这是放置所有需要访问 ReactApplicationContext 的初始化代码的最佳位置。例如，以下是 core 中实现了 `initialize()` 方法的一些原生模块：[BlobModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/blob/BlobModule.java#L155-L157)、[NetworkingModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L193-L197)。

`invalidate()` 方法会在原生模块被销毁时由原生模块基础设施调用。这是放置所有清理代码的最佳位置，用于重置原生模块状态并释放不再需要的资源，例如内存和文件。以下是 core 中实现了 `invalidate()` 方法的一些原生模块：[DeviceInfoModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/deviceinfo/DeviceInfoModule.kt#L72-L76)、[NetworkModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L200-L212)

## iOS

在 iOS 上，原生模块符合 [`RCTTurboModule`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactCommon/react/nativemodule/core/platform/ios/ReactCommon/RCTTurboModule.h#L196-L200) 协议。然而，该协议并不暴露 Android 的 `TurboModule` 类所暴露的 `initialize` 和 `invalidate` 方法。

取而代之的是，在 iOS 上有两个额外的协议：[`RCTInitializing`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInitializing.h) 和 [`RCTInvalidating`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInvalidating.h)。这些协议分别用于定义 `initialize` 和 `invalidate` 方法。

如果你的模块需要运行一些初始化代码，那么你可以符合 `RCTInitializing` 协议并实现 `initialize` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下行：

```diff title="NativeModule.h"
+ #import <React/RCTInitializing.h>

//...

- @interface NativeModule : NSObject <NativeModuleSpec>
+ @interface NativeModule : NSObject <NativeModuleSpec, RCTInitializing>
//...
@end
```

2. 在 `NativeModule.mm` 文件中实现 `initialize` 方法：

```diff title="NativeModule.mm"
// ...

@implementation NativeModule

+- (void)initialize {
+ // 在这里添加初始化代码
+}

@end
```

以下是 core 中实现了 `initialize` 方法的一些原生模块：[RCTBlobManager](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/Libraries/Blob/RCTBlobManager.mm#L58-L68)、[RCTTiming](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTTiming.mm#L121-L124)。

如果你的模块需要运行一些清理代码，那么你可以符合 `RCTInvalidating` 协议并实现 `invalidate` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下行：

```diff title="NativeModule.h"
+ #import <React/RCTInvalidating.h>

//...

- @interface NativeModule : NSObject <NativeModuleSpec>
+ @interface NativeModule : NSObject <NativeModuleSpec, RCTInvalidating>

//...

@end
```

2. 在 `NativeModule.mm` 文件中实现 `invalidate` 方法：

```diff title="NativeModule.mm"

// ...

@implementation NativeModule

+- (void)invalidate {
+ // 在这里添加清理代码
+}

@end
```

以下是 core 中实现了 `invalidate` 方法的一些原生模块：[RCTAppearance](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTAppearance.mm#L151-L155)、[RCTDeviceInfo](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTDeviceInfo.mm#L127-L133)。
