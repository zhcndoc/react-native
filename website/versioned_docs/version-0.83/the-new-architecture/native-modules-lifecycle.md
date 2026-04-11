import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 原生模块生命周期

在 React Native 中，原生模块是单例的。原生模块基础设施会在首次访问时懒加载创建原生模块，并在应用需要时保留它。这是一种性能优化，避免了在应用启动时就急切地创建原生模块，从而保证启动速度更快。

在纯 React Native 应用中，原生模块只创建一次，并且永远不会被销毁。然而，在更复杂的应用中，可能存在销毁并重新创建原生模块的用例。举例来说，设想一个混合型应用，将一些原生视图和 React Native 界面混合使用，如 [整合现有应用指南](/docs/integration-with-existing-apps) 中所述。在这种情况下，当用户离开 React Native 界面时销毁 React Native 实例，用户返回该界面时重新创建它是合理的。

当发生这种情况时，无状态的原生模块不会引起问题。然而，对于有状态的原生模块，正确地使原生模块失效以确保重置状态和释放资源可能是必要的。

本指南将介绍如何正确初始化和失效一个原生模块。假设你已经熟悉如何编写原生模块，并且能够编写原生代码。如果你还不熟悉原生模块，请先阅读 [原生模块指南](/docs/next/turbo-native-modules-introduction)。

## Android

在 Android 上，所有原生模块都实现了 [TurboModule](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/interfaces/TurboModule.kt) 接口，该接口定义了两个方法：`initialize()` 和 `invalidate()`。

`initialize()` 方法由原生模块基础设施在创建原生模块时调用。这是放置需要访问 ReactApplicationContext 的初始化代码的最佳位置。例如，核心中的一些实现了 `initialize()` 方法的原生模块有：[BlobModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/blob/BlobModule.java#L155-L157)、[NetworkingModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L193-L197)。

`invalidate()` 方法由原生模块基础设施在销毁原生模块时调用。这是放置清理代码的最佳位置，用来重置原生模块状态和释放不再需要的资源，如内存和文件。核心中实现了 `invalidate()` 方法的一些原生模块有：[DeviceInfoModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/deviceinfo/DeviceInfoModule.kt#L72-L76)、[NetworkModule](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/network/NetworkingModule.java#L200-L212)。

## iOS

在 iOS 上，原生模块遵循 [`RCTTurboModule`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/ReactCommon/react/nativemodule/core/platform/ios/ReactCommon/RCTTurboModule.h#L196-L200) 协议。然而，该协议并不暴露 Android 的 `TurboModule` 类所提供的 `initialize` 和 `invalidate` 方法。

相反，在 iOS 上，有两个附加协议：[`RCTInitializing`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInitializing.h) 和 [`RCTInvalidating`](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/Base/RCTInvalidating.h)。这两个协议分别用于定义 `initialize` 和 `invalidate` 方法。

如果你的模块需要执行初始化代码，可以遵循 `RCTInitializing` 协议并实现 `initialize` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下内容：

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

核心中的一些实现了 `initialize` 方法的原生模块有：[RCTBlobManager](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/Libraries/Blob/RCTBlobManager.mm#L58-L68)、[RCTTiming](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTTiming.mm#L121-L124)。

如果你的模块需要执行清理代码，则可以遵循 `RCTInvalidating` 协议并实现 `invalidate` 方法。为此，你需要：

1. 修改 `NativeModule.h` 文件，添加以下内容：

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

核心中实现了 `invalidate` 方法的一些原生模块有：[RCTAppearance](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTAppearance.mm#L151-L155)、[RCTDeviceInfo](https://github.com/facebook/react-native/blob/0617accecdcb11159ba15c34885f294bc206aa89/packages/react-native/React/CoreModules/RCTDeviceInfo.mm#L127-L133)。