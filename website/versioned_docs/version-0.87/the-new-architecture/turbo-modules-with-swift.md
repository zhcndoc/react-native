# iOS - 在 Native Modules 中使用 Swift

Swift 是在 iOS 上开发原生应用的官方默认语言。

在本指南中，你将探索如何使用 Swift 编写 Native Modules。

:::note
React Native 的核心主要使用 C++ 编写，尽管 Apple 开发了 [互操作层](https://www.swift.org/documentation/cxx-interop/)，但 Swift 和 C++ 之间的互操作性并不理想。

因此，由于两种语言之间存在不兼容性，你将在本指南中编写的模块不会是纯 Swift 实现。你需要编写一些 Objective-C++ 胶水代码，但本指南的目标是尽量减少所需的 Objective-C++ 代码量。如果你正在将现有的 Native Modules 从旧架构迁移到新架构，这种方式应该可以让你复用大部分代码。
:::

本指南从 [Native Module](/docs/next/turbo-native-modules-introduction) 指南的 iOS 实现开始。
在深入学习本指南之前，请确保你熟悉该指南，也可以先尝试实现指南中的示例。

## Adapter 模式

我们的目标是使用 Swift 模块实现所有业务逻辑，并在 Objective-C++ 中创建一个能够连接应用与 Swift 实现的薄胶水层。

你可以利用 [Adapter](https://en.wikipedia.org/wiki/Adapter_pattern) 设计模式，将 Swift Module 与 Objective-C++ 层连接起来。

React Native 会创建 Objective-C++ 对象，该对象持有对 Swift 模块的引用并处理其生命周期。Objective-C++ 对象会将所有方法调用转发给 Swift。

### 创建 Swift Module

第一步是将实现从 Objective-C++ 层迁移到 Swift 层。

为此，请按照以下步骤操作：

1. 在 Xcode 项目中创建一个新的空文件，并将其命名为 `NativeLocalStorage.swift`
2. 在 Swift 模块中添加如下实现：

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

请注意，必须将所有需要从 Objective-C 调用的方法声明为 `public`，并添加 `@objc` 注解。
还要记得让你的类继承自 `NSObject`，否则将无法从 Objective-C 使用它。

### 更新 `RCTNativeLocalStorage` 文件

接下来，你需要更新 `RCTNativeLocalStorage` 的实现，以便创建 Swift 模块并调用其方法。

1. 打开 `RCTNativeLocalStorage.mm` 文件
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

代码实际上并没有发生太大变化。你不再直接创建对 `NSUserDefaults` 的引用，而是使用 Swift 实现创建一个新的 `NativeLocalStorage`，并且每当调用 Native Module 函数时，都会将调用转发给以 Swift 实现的 `NativeLocalStorage`。

请记得导入 `"SampleApp-Swift.h"` 头文件。这是由 Xcode 自动生成的头文件，其中包含 Swift 文件的公共 API，并采用 Objective-C 可以使用的格式。头文件中的 `SampleApp` 部分实际上是你的应用名称，因此，如果你创建应用时使用的名称**不是** `SampleApp`，就必须修改它。

还要注意，`RCT_EXPORT_MODULE` 宏不再是必需的，因为 Native Modules 会使用 `package.json` 进行注册，具体说明见[此处](/docs/next/turbo-native-modules-introduction?platforms=ios#register-the-native-module-in-your-app)。

这种方式会导致接口中存在少量代码重复，但它可以让你以很少的额外工作复用代码库中可能已经存在的 Swift 代码。

### 实现 Bridging Header

:::note
如果你是一个库作者，正在开发一个将作为独立库分发的 Native Module，则不需要执行此步骤。
:::

将 Swift 代码与 Objective-C++ 对应部分连接起来的最后一个必要步骤是创建 bridging header。

bridging header 是一个头文件，你可以在其中导入所有需要对 Swift 代码可见的 Objective-C 头文件。

你的代码库中可能已经存在 bridging header，但如果还没有，可以按照以下步骤创建一个：

1. 在 Xcode 中创建一个新文件，并将其命名为 `"SampleApp-Bridging-Header.h"`
2. 按如下方式更新 `"SampleApp-Bridging-Header.h"` 的内容：

```diff title="SampleApp-Bridging-Header.h"
//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//

+ #import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
```

3. 在项目中关联 Bridging header：
   1. 在项目导航器中选择你的应用名称（左侧的 `SampleApp`）
   2. 点击 `Build Settings`
   3. 搜索 `"Bridging Header"`
   4. 添加 "Bridging Header" 的相对路径，在此示例中为 `SampleApp-Bridging-Header.h`

![Bridging Header](/docs/assets/BridgingHeader.png)

## 构建并运行你的应用

现在，你可以按照 [Native Module 指南](/docs/turbo-native-modules-introduction#build-and-run-your-code-on-a-simulator) 的最后一步操作，此时应该可以看到你的应用使用 Swift 编写的 Native Module 运行。
