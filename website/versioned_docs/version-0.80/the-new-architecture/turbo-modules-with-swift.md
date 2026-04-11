# iOS - 在你的原生模块中使用 Swift

Swift 是开发 iOS 原生应用的官方默认语言。

在本指南中，你将探索如何使用 Swift 编写原生模块。

:::note
React Native 的核心主要是用 C++ 编写的，尽管 Apple 开发了 [互操作层](https://www.swift.org/documentation/cxx-interop/)，但 Swift 和 C++ 之间的互操作性并不理想。

因此，本指南中你要编写的模块不会是纯 Swift 实现，因为语言之间存在不兼容性。你需要编写一些 Objective-C++ 胶水代码，但本指南的目标是最小化所需的 Objective-C++ 代码量。如果你正在将现有的原生模块从旧架构迁移到新架构，这种方法应该允许你复用大部分代码。
:::

本指南从 [原生模块](/docs/next/turbo-native-modules-introduction) 指南的 iOS 实现开始。
在深入本指南之前，请确保熟悉该指南，可能的话实现指南中的示例。

## 适配器模式

目标是使用 Swift 模块实现所有业务逻辑，并在 Objective-C++ 中拥有一个薄的胶水层，能够将应用与 Swift 实现连接起来。

你可以利用 [适配器](https://en.wikipedia.org/wiki/Adapter_pattern) 设计模式，将 Swift 模块与 Objective-C++ 层连接起来。

Objective-C++ 对象由 React Native 创建，它保持对 Swift 模块的引用并处理其生命周期。Objective-C++ 对象将所有方法调用转发给 Swift。

### 创建 Swift 模块

第一步是将实现从 Objective-C++ 层移动到 Swift 层。

要实现这一点，请遵循以下步骤：

1. 在 Xcode 项目中创建一个新的空文件，并将其命名为 `NativeLocalStorage.swift`
2. 如下所示在你的 Swift 模块中添加实现：

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

注意，你必须将所有需要从 Objective-C 调用的方法声明为 `public` 并带有 `@objc` 注解。
还要记住让你的类继承自 `NSObject`，否则将无法从 Objective-C 使用它。

### 更新 `RCTNativeLocalStorage` 文件

然后，你需要更新 `RCTNativeLocalStorage` 的实现，以便能够创建 Swift 模块并调用其方法。

1. 打开 `RCTNativeLocalStorage.mm` 文件
2. 如下所示更新它：

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

代码并没有真正改变。你不是直接创建对 `NSUserDefaults` 的引用，而是使用 Swift 实现创建一个新的 `NativeLocalStorage`，每当调用原生模块函数时，调用会被转发到 Swift 中实现的 `NativeLocalStorage`。

记得导入 `"SampleApp-Swift.h"` 头文件。这是 Xcode 自动生成的头文件，其中包含 Swift 文件的公共 API，格式可供 Objective-C 使用。头文件中的 `SampleApp` 部分实际上是你的应用名称，所以如果你创建的应用名称 **不同于** `SampleApp`，你需要更改它。

还要注意，不再需要 `RCT_EXPORT_MODULE` 宏，因为原生模块是使用 `package.json` 注册的，如 [此处](/docs/next/turbo-native-modules-introduction?platforms=ios#register-the-native-module-in-your-app) 所述。

这种方法在接口中引入了一些代码重复，但它允许你复用代码库中可能已经拥有的 Swift 代码，只需很少的额外工作。

### 实现桥接头文件

:::note
如果你是库作者，开发将作为独立库分发的原生模块，则不需要此步骤。
:::

将 Swift 代码与 Objective-C++ 对应部分连接起来的最后必要步骤是桥接头文件。

桥接头文件是一个头文件，你可以在其中导入所有需要对你的 Swift 代码可见的 Objective-C 头文件。

你的代码库中可能已经有了桥接头文件，但如果没有，你可以按照以下步骤创建一个新的：

1. 在 Xcode 中，创建一个新文件并将其命名为 `"SampleApp-Bridging-Header.h"`
2. 如下更新 `"SampleApp-Bridging-Header.h"` 的内容：

```diff title="SampleApp-Bridging-Header.h"
//
//  使用此文件导入你希望暴露给 Swift 的目标公共头文件。
//

+ #import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
```

3. 在你的项目中链接桥接头文件：
   1. 在项目导航器中，选择你的应用名称（左侧的 `SampleApp`）
   2. 点击 `Build Settings`
   3. 筛选 `"Bridging Header"`
   4. 添加 "Bridging Header" 的相对路径，示例中为 `SampleApp-Bridging-Header.h`

![桥接头文件](/docs/assets/BridgingHeader.png)

## 构建并运行你的应用

现在你可以遵循 [原生模块指南](/docs/turbo-native-modules-introduction#build-and-run-your-code-on-a-simulator) 的最后一步，你应该能看到你的应用运行着使用 Swift 编写的原生模块。
