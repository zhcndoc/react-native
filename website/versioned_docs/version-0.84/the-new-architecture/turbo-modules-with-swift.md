# iOS - 在本地模块中使用 Swift

Swift 是 iOS 上开发原生应用的官方默认语言。

在本指南中，您将探索如何使用 Swift 编写本地模块。

:::note
React Native 的核心主要是用 C++ 编写的，尽管 Apple 开发了 [互操作层](https://www.swift.org/documentation/cxx-interop/)，但 Swift 与 C++ 之间的互操作性仍不理想。

因此，您将在本指南中编写的模块不会是纯 Swift 实现，由于语言之间的不兼容，您需要编写一些 Objective-C++ 粘合代码，但本指南的目标是尽可能减少所需的 Objective-C++ 代码量。如果您正在将现有本地模块从旧架构迁移到新架构，这种方法应该能让您重用大部分代码。
:::

本指南基于 [本地模块](/docs/next/turbo-native-modules-introduction) 指南中的 iOS 实现部分。
在深入本指南之前，请确保熟悉该指南，并最好先实现该指南中的示例。

## 适配器模式

目标是使用 Swift 模块实现所有业务逻辑，并通过一个轻量的 Objective-C++ 粘合层连接应用程序与 Swift 实现。

您可以利用设计模式中的 [适配器模式](https://en.wikipedia.org/wiki/Adapter_pattern) 将 Swift 模块与 Objective-C++ 层连接起来。

React Native 创建 Objective-C++ 对象，并保持对 Swift 模块的引用，管理其生命周期。Objective-C++ 对象将所有方法调用转发给 Swift。

### 创建 Swift 模块

第一步是将实现从 Objective-C++ 层迁移到 Swift 层。

操作步骤如下：

1. 在 Xcode 项目中新建一个空文件，命名为 `NativeLocalStorage.swift`。
2. 在您的 Swift 模块中添加如下实现：

```swift title="NativeLocalStorage.swift"
import Foundation

@objcMembers public class NativeLocalStorage: NSObject {
  let userDefaults = UserDefaults(suiteName: "local-storage");

  public func getItem(for key: String) -> String? {
    return userDefaults?.string(forKey: key)
  }

  public func setItem(for key: String, value: String) {
    userDefaults?.set(value, forKey: key)
  }

  public func removeItem(for key: String) {
    userDefaults?.removeObject(forKey: key)
  }

  public func clear() {
    userDefaults?.dictionaryRepresentation().keys.forEach { removeItem(for: $0) }
  }
}
```

请注意，您必须将需从 Objective-C 调用的方法声明为 `public` 并添加 `@objc` 注解。
还需确保类继承自 `NSObject`，否则无法从 Objective-C 使用该类。

### 更新 `RCTNativeLocalStorage` 文件

接着，您需要更新 `RCTNativeLocalStorage` 的实现，以便创建 Swift 模块并调用其方法。

1. 打开 `RCTNativeLocalStorage.mm` 文件。
2. 按如下方式更新：

```diff title="RCTNativeLocalStorage.mm"
//  RCTNativeLocalStorage.m
//  TurboModuleExample

#import "RCTNativeLocalStorage.h"
+#import "SampleApp-Swift.h"

- static NSString *const RCTNativeLocalStorageKey = @"local-storage";

-@interface RCTNativeLocalStorage()
-@property (strong, nonatomic) NSUserDefaults *localStorage;
-@end

-@implementation RCTNativeLocalStorage
+@implementation RCTNativeLocalStorage {
+    NativeLocalStorage *storage;
+}

-RCT_EXPORT_MODULE(NativeLocalStorage)

 - (id) init {
   if (self = [super init]) {
-    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:RCTNativeLocalStorageKey];
+    storage = [NativeLocalStorage new];
   }
   return self;
 }

 - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
   return std::make_shared<facebook::react::NativeLocalStorageSpecJSI>(params);
 }

 - (NSString * _Nullable)getItem:(NSString *)key {
-   return [self.localStorage stringForKey:key];
+   return [storage getItemFor:key];
 }

 - (void)setItem:(NSString *)value key:(NSString *)key {
-   [self.localStorage setObject:value forKey:key];
+   [storage setItemFor:key value:value];
 }

 - (void)removeItem:(NSString *)key {
-   [self.localStorage removeObjectForKey:key];
+   [storage removeItemFor:key];
 }

 - (void)clear {
-   NSDictionary *keys = [self.localStorage dictionaryRepresentation];
-   for (NSString *key in keys) {
-     [self removeItem:key];
-   }
+  [storage clear];
 }

++ (NSString *)moduleName
+{
+  return @"NativeLocalStorage";
+}

@end
```

代码本质没有改变。您不再直接创建 `NSUserDefaults` 引用，而是创建使用 Swift 实现的 `NativeLocalStorage`，每当调用原生模块函数时，调用会被转发给 Swift 中实现的 `NativeLocalStorage`。

记得导入 `"SampleApp-Swift.h"` 头文件。该文件由 Xcode 自动生成，包含您的 Swift 文件的公共 API，以 Objective-C 可调用的形式暴露。`SampleApp` 是您的应用名称，如果您的应用名称与 `SampleApp` 不同，请相应更改。

另外，`RCT_EXPORT_MODULE` 宏不再需要，因为原生模块的注册是通过 `package.json` 完成的，详见 [这里](/docs/next/turbo-native-modules-introduction?platforms=ios#register-the-native-module-in-your-app)。

这种方法在接口上会引入一些代码重复，但允许您用很少额外的工作复用已有的 Swift 代码。

### 实现 Bridging Header（桥接头文件）

:::note
如果您是库开发者，开发的本地模块将作为单独库分发，则不需要此步骤。
:::

连接 Swift 代码和 Objective-C++ 所需的最后一步是桥接头文件。

桥接头文件用于将需要暴露给 Swift 代码的 Objective-C 头文件导入。

您可能已经有了桥接头文件，如果没有，可以按照如下步骤创建：

1. 在 Xcode 中新建一个文件，命名为 `"SampleApp-Bridging-Header.h"`.
2. 将 `"SampleApp-Bridging-Header.h"` 内容改为：

```diff title="SampleApp-Bridging-Header.h"
//
//  使用此文件导入你希望暴露给 Swift 的目标公共头文件。
//

+ #import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
```

3. 在项目中关联桥接头文件：
   1. 在项目导航中，选择您的应用名称（左侧的 `SampleApp`）
   2. 点击 `Build Settings`
   3. 筛选 `"Bridging Header"`
   4. 添加桥接头文件的相对路径，示例中为 `SampleApp-Bridging-Header.h`

![桥接头文件](/docs/assets/BridgingHeader.png)

## 构建并运行您的应用

现在，您可以按照 [本地模块](/docs/turbo-native-modules-introduction#build-and-run-your-code-on-a-simulator) 指南中的最后一步操作，您应该可以看到用 Swift 编写的本地模块成功运行的应用。