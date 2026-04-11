import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 原生模块生命周期

在 React Native 中，原生模块是单例的。原生模块基础设施会在首次访问时懒加载创建原生模块，并在应用需要时一直保留它。这是一种性能优化，允许我们避免在应用启动时急切创建原生模块的开销，并确保更快的启动时间。

在纯粹的 React Native 应用中，原生模块只创建一次且永远不会被销毁。然而，在更复杂的应用中，可能存在原生模块被销毁并重新创建的用例。例如，想象一个混合了一些原生视图和一些 React Native 表面的棕地应用，如 [集成到现有应用指南](/docs/integration-with-existing-apps) 中所示。在这种情况下，当用户导航离开 React Native 表面时销毁 React Native 实例，当用户导航回该表面时重新创建它，可能是有意义的。

当这种情况发生时，无状态的原生模块不会引起任何问题。然而，对于有状态的原生模块，可能需要正确地失效原生模块，以确保状态被重置且资源被释放。

在本指南中，你将探索如何正确初始化和失效原生模块。本指南假设你熟悉如何编写原生模块，并且能够熟练编写原生代码。如果你不熟悉原生模块，请先阅读 [原生模块指南](/docs/next/turbo-native-modules-introduction)。

## Android

对于 Android，所有原生模块已经实现了一个 [TurboModule](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/interfaces/TurboModule.kt) 接口，该接口定义了两个方法：`initialize()` 和 `invalidate()`。

`initialize()` 方法由原生模块基础设施在创建原生模块时调用。这是放置所有需要访问 ReactApplicationContext 的初始化代码的最佳位置，例如。以下是一些实现了 `initialize()` 方法的核心原生模块：[BlobModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/blob/BlobModule.java#L155-L157)、[NetworkingModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L193-L197)。

`invalidate()` 方法由原生模块基础设施在销毁原生模块时调用。这是放置所有清理代码、重置原生模块状态以及释放不再需要的资源（如内存和文件）的最佳位置。以下是一些实现了 `invalidate()` 方法的核心原生模块：[DeviceInfoModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/deviceinfo/DeviceInfoModule.kt#L72-L76)、[NetworkModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L200-L212)

## iOS

在 iOS 上，原生模块遵循 [`RCTTurboModule`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactCommon/react/nativemodule/core/platform/ios/ReactCommon/RCTTurboModule.h#L196-L200) 协议。然而，此协议并未暴露 Android 的 `TurboModule` 类所暴露的 `initialize` 和 `invalidate` 方法。

相反，在 iOS 上，有两个额外的协议：[`RCTInitializing`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInitializing.h) 和 [`RCTInvalidating`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInvalidating.h)。这些协议分别用于定义 `initialize` 和 `invalidate` 方法。

如果你的模块需要运行一些初始化代码，那么你可以遵循 `RCTInitializing` 协议并实现 `initialize` 方法。为此，你必须：

1. 通过添加以下行来修改 `NativeModule.h` 文件：

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
+ // 在此处添加初始化代码
+}

@end
```

以下是一些实现了 `initialize` 方法的核心原生模块：[RCTBlobManager](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/Libraries/Blob/RCTBlobManager.mm#L58-L68)、[RCTTiming](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTTiming.mm#L121-L124)。

如果你的模块需要运行一些清理代码，那么你可以遵循 `RCTInvalidating` 协议并实现 `invalidate` 方法。为此，你必须：

1. 通过添加以下行来修改 `NativeModule.h` 文件：

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
+ // 在此处添加清理代码
+}

@end
```

以下是一些实现了 `invalidate` 方法的核心原生模块：[RCTAppearance](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTAppearance.mm#L151-L155)、[RCTDeviceInfo](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTDeviceInfo.mm#L127-L133)。
