# iOS - 在你的原生模块中使用 Swift

Swift 是在 iOS 上开发原生应用的官方默认语言。

在本指南中，你将了解如何使用 Swift 编写你的原生模块。

:::note
React Native 的核心主要使用 C++ 编写，而 Swift 和 C++ 之间的互操作性并不理想，尽管 Apple 开发了 [互操作层](https://www.swift.org/documentation/cxx-interop/)。

因此，你将在本指南中编写的模块由于语言之间的不兼容性，并不能是一个纯 Swift 实现。你需要编写一些 Objective-C++ 的胶水代码，但本指南的目标是尽量减少所需的 Objective-C++ 代码量。如果你正在将现有的原生模块从旧架构迁移到新架构，这种方法应当能让你复用大部分代码。
:::

本指南从 [原生模块](/docs/next/turbo-native-modules-introduction) 指南的 iOS 实现开始。
在深入本指南之前，请确保你已经熟悉该指南，并最好先实现其中的示例。

## 适配器模式

目标是使用 Swift 模块实现所有业务逻辑，并在 Objective-C++ 中保留一层薄薄的胶水层，以便将应用与 Swift 实现连接起来。

你可以利用 [适配器](https://en.wikipedia.org/wiki/Adapter_pattern) 设计模式来实现这一点，将 Swift 模块与 Objective-C++ 层连接起来。

Objective-C++ 对象由 React Native 创建，并持有对 Swift 模块的引用，负责管理其生命周期。Objective-C++ 对象会把所有方法调用转发给 Swift。

### 创建 Swift 模块

第一步是将实现从 Objective-C++ 层迁移到 Swift 层。

为此，请按照以下步骤操作：

1. 在 Xcode 项目中新建一个空文件，并命名为 `NativeLocalStorage.swift`
2. 在你的 Swift 模块中添加如下实现：

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

请注意，你需要将所有从 Objective-C 调用的方法都声明为 `public`，并添加 `@objc` 注解。
另外也要记得让你的类继承自 `NSObject`，否则就无法在 Objective-C 中使用它。

### 更新 `RCTNativeLocalStorage` 文件

接下来，你需要更新 `RCTNativeLocalStorage` 的实现，以便能够创建 Swift 模块并调用其方法。

1. 打开 `RCTNativeLocalStorage.mm` 文件
2. 按如下方式更新它：

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

代码其实并没有太大变化。你不再直接创建 `NSUserDefaults` 的引用，而是使用 Swift 实现创建一个新的 `NativeLocalStorage`，并且每当原生模块函数被调用时，调用都会被转发到 Swift 中实现的 `NativeLocalStorage`。

请记得导入 `"SampleApp-Swift.h"` 头文件。这是 Xcode 自动生成的一个头文件，其中包含了 Swift 文件的公开 API，并且是以 Objective-C 可消费的格式提供的。这里的 `SampleApp` 实际上是你的应用名称，所以如果你创建应用时使用的名称**不是** `SampleApp`，你需要改成对应的名称。

另请注意，`RCT_EXPORT_MODULE` 宏现在已经不再需要，因为原生模块是通过 `package.json` 进行注册的，如[这里](/docs/next/turbo-native-modules-introduction?platforms=ios#register-the-native-module-in-your-app)所述。

这种方式会在接口中引入一些代码重复，但它能让你以较小的额外成本复用你代码库中已有的 Swift 代码。

### 实现桥接头文件

:::note
如果你是库作者，正在开发一个将作为独立库分发的原生模块，那么这一步不是必需的。
:::

将 Swift 代码与 Objective-C++ 对应部分连接起来所需的最后一步是桥接头文件。

桥接头文件是一个头文件，你可以在其中导入所有需要对 Swift 代码可见的 Objective-C 头文件。

你的代码库中可能已经有一个桥接头文件，但如果没有，你可以按照以下步骤创建一个新的：

1. 在 Xcode 中创建一个新文件，并命名为 `"SampleApp-Bridging-Header.h"`
2. 按如下方式更新 `"SampleApp-Bridging-Header.h"` 的内容：

```diff title="SampleApp-Bridging-Header.h"
//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//

+ #import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
```

3. 在项目中链接桥接头文件：
   1. 在项目导航器中，选择你的应用名称（左侧的 `SampleApp`）
   2. 点击 `Build Settings`
   3. 搜索 `"Bridging Header"`
   4. 添加桥接头文件的相对路径，在示例中它是 `SampleApp-Bridging-Header.h`

![Bridging Header](/docs/assets/BridgingHeader.png)

## 构建并运行你的应用

现在你可以按照 [原生模块指南](/docs/turbo-native-modules-introduction#build-and-run-your-code-on-a-simulator) 的最后一步操作，你应该会看到你的应用运行起来，并且其中使用的是用 Swift 编写的原生模块。
