---
id: turbo-native-modules-ios
title: 'Turbo 原生模块：iOS'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 iOS 平台代码，以确保 `localStorage` 在应用程序关闭后依然存在。

## 准备你的 Xcode 项目

我们需要使用 Xcode 准备你的 iOS 项目。完成这 **6 个步骤** 后，你将拥有实现了生成的 `NativeLocalStorageSpec` 接口的 `RCTNativeLocalStorage`。

1. 打开 CocoaPods 生成的 Xcode Workspace：

```bash
cd ios
open TurboModuleExample.xcworkspace
```

<img className="half-size" alt="打开 Xcode Workspace" src="/docs/assets/turbo-native-modules/xcode/1.webp" />

2. 右键点击 app 并选择 <code>New Group</code>，将新组命名为 `NativeLocalStorage`。

<img className="half-size" alt="右键点击 app 并选择 New Group" src="/docs/assets/turbo-native-modules/xcode/2.webp" />

3. 在 `NativeLocalStorage` 组中，创建 <code>New</code>→<code>File from Template</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板创建新文件" src="/docs/assets/turbo-native-modules/xcode/3.webp" />

4. 使用 <code>Cocoa Touch Class</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板" src="/docs/assets/turbo-native-modules/xcode/4.webp"  />

5. 将 Cocoa Touch Class 命名为 <code>RCTNativeLocalStorage</code>，语言选择 <code>Objective-C</code>。

<img className="half-size" alt="创建 Objective-C RCTNativeLocalStorage 类" src="/docs/assets/turbo-native-modules/xcode/5.webp" />

6. 重命名 <code>RCTNativeLocalStorage.m</code> → <code>RCTNativeLocalStorage.mm</code>，使其成为 Objective-C++ 文件。

<img className="half-size" alt="转换为 Objective-C++ 文件" src="/docs/assets/turbo-native-modules/xcode/6.webp" />

## 使用 NSUserDefaults 实现 localStorage

首先更新 `RCTNativeLocalStorage.h`：

```objc title="NativeLocalStorage/RCTNativeLocalStorage.h"
//  RCTNativeLocalStorage.h
//  TurboModuleExample

#import <Foundation/Foundation.h>
// highlight-add-next-line
#import <NativeLocalStorageSpec/NativeLocalStorageSpec.h>

NS_ASSUME_NONNULL_BEGIN

// highlight-remove-next-line
@interface RCTNativeLocalStorage : NSObject
// highlight-add-next-line
@interface RCTNativeLocalStorage : NSObject <NativeLocalStorageSpec>

@end
```

然后更新我们的实现以使用 `NSUserDefaults` 和自定义的 [suite name](https://developer.apple.com/documentation/foundation/nsuserdefaults/1409957-initwithsuitename)。

```objc title="NativeLocalStorage/RCTNativeLocalStorage.mm"
//  RCTNativeLocalStorage.m
//  TurboModuleExample

#import "RCTNativeLocalStorage.h"

static NSString *const RCTNativeLocalStorageKey = @"local-storage";

@interface RCTNativeLocalStorage()
@property (strong, nonatomic) NSUserDefaults *localStorage;
@end

@implementation RCTNativeLocalStorage

RCT_EXPORT_MODULE(NativeLocalStorage)

- (id) init {
  if (self = [super init]) {
    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:RCTNativeLocalStorageKey];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLocalStorageSpecJSI>(params);
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [self.localStorage stringForKey:key];
}

- (void)setItem:(NSString *)value
          key:(NSString *)key {
  [self.localStorage setObject:value forKey:key];
}

- (void)removeItem:(NSString *)key {
  [self.localStorage removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [self.localStorage dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

@end
```

需要注意的重要事项：

- `RCT_EXPORT_MODULE` 使用我们将在 JavaScript 环境中访问它的标识符 `NativeLocalStorage` 来导出和注册模块。详见 [文档](./legacy/native-modules-ios#module-name)。
- 你可以使用 Xcode 跳转到 Codegen `@protocol NativeLocalStorageSpec`。你也可以使用 Xcode 为你生成存根（stubs）。

## 在模拟器上构建并运行你的代码

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">
```bash
npm run ios
```
</TabItem>
<TabItem value="yarn">
```bash
yarn run ios
```
</TabItem>
</Tabs>

<video width="30%" height="30%" playsinline="true" autoplay="true" muted="true" loop="true">
    <source src="/docs/assets/turbo-native-modules/turbo-native-modules-ios.webm" type="video/webm" />
    <source src="/docs/assets/turbo-native-modules/turbo-native-modules-ios.mp4" type="video/mp4" />
</video>
