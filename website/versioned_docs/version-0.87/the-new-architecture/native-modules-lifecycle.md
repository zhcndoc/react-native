import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# Native Modules 生命周期

在 React Native 中，Native Modules 是单例。Native Module 基础设施会在 Native Module 第一次被访问时延迟创建它，并在应用需要时一直保留它。这是一项性能优化，可以避免在应用启动时急切创建 Native Modules 的开销，并确保更快的启动时间。

在纯 React Native 应用中，Native Modules 只会创建一次，且永远不会被销毁。但是，在更复杂的应用中，可能存在销毁并重新创建 Native Modules 的使用场景。例如，一个混合了一些原生视图和一些 React Native surface 的 brownfield 应用，如[与现有应用集成指南](/docs/integration-with-existing-apps)中所示。在这种情况下，当用户离开 React Native surface 时销毁 React Native 实例，并在用户返回该 surface 时重新创建它，可能是合理的。

发生这种情况时，无状态的 Native Modules 不会导致任何问题。但是，对于有状态的 Native Modules，可能有必要正确地使 Native Module 失效，以确保状态被重置并释放资源。

在本指南中，你将了解如何正确地初始化和使 Native Module 失效。本指南假设你熟悉如何编写 Native Modules，并且能够熟练编写原生代码。如果你不熟悉 Native Modules，请先阅读[Native Modules 指南](/docs/next/turbo-native-modules-introduction)。

## Android

在 Android 上，所有 Native Modules 都已实现 [TurboModule](https://github.com/react/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/interfaces/TurboModule.kt) 接口，该接口定义了 `initialize()` 和 `invalidate()` 两个方法。

Native Module 基础设施会在创建 Native Module 时调用 `initialize()` 方法。这是放置所有需要访问 ReactApplicationContext 的初始化代码的最佳位置，例如。以下是核心代码中实现了 `initialize()` 方法的一些 Native Modules：[BlobModule](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/blob/BlobModule.java#L155-L157)、[NetworkingModule](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L193-L197)。

The `invalidate()` method is called by the Native Module infrastructure when the Native Module is destroyed. This is the best place to put all the cleanup code, resetting the Native Module state and release resources that are no longer needed, such as memory and files. These are some Native Modules from core that implements the `invalidate()` method: [DeviceInfoModule](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/deviceinfo/DeviceInfoModule.kt#L72-L76), [NetworkModule](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L200-L212)

## iOS

在 iOS 上，Native Modules 遵循 [`RCTTurboModule`](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactCommon/react/nativemodule/core/platform/ios/ReactCommon/RCTTurboModule.h#L196-L200) 协议。但是，此协议没有公开 Android `TurboModule` 类所提供的 `initialize` 和 `invalidate` 方法。

相反，在 iOS 上还有两个额外协议：[`RCTInitializing`](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInitializing.h) 和 [`RCTInvalidating`](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInvalidating.h)。这两个协议分别用于定义 `initialize` 和 `invalidate` 方法。

如果你的模块需要运行一些初始化代码，那么你可以遵循 `RCTInitializing` 协议并实现 `initialize` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下代码行：

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
+ // add the initialization code here
+}

@end
```

以下是核心代码中实现了 `initialize` 方法的一些 Native Modules：[RCTBlobManager](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/Libraries/Blob/RCTBlobManager.mm#L58-L68)、[RCTTiming](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTTiming.mm#L121-L124)。

如果你的模块需要运行一些清理代码，那么你可以遵循 `RCTInvalidating` 协议并实现 `invalidate` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下代码行：

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
+ // add the cleanup code here
+}

@end
```

以下是核心代码中实现了 `invalidate` 方法的一些 Native Modules：[RCTAppearance](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTAppearance.mm#L151-L155)、[RCTDeviceInfo](https://github.com/react/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTDeviceInfo.kt#L72-L76)。
