---
id: turbo-native-modules-ios
title: 'Turbo Native 模块：iOS'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 iOS 平台代码，确保 `localStorage` 在应用关闭后依然能够保留。

## 准备你的 Xcode 项目

我们需要使用 Xcode 准备你的 iOS 项目。完成下面**6 个步骤**后，你将拥有实现了生成的 `NativeLocalStorageSpec` 接口的 `RCTNativeLocalStorage`。

1. 打开 CocoaPods 生成的 Xcode 工作区：

```bash
cd ios
open TurboModuleExample.xcworkspace
```

<img className="half-size" alt="打开 Xcode 工作区" src="/docs/assets/turbo-native-modules/xcode/1.webp" />

2. 右键点击 app，选择 <code>New Group</code>，将新建的组命名为 `NativeLocalStorage`。

<img className="half-size" alt="右键点击 app 并选择 New Group" src="/docs/assets/turbo-native-modules/xcode/2.webp" />

3. 在 `NativeLocalStorage` 组内，创建 <code>New</code>→<code>File from Template</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板创建新文件" src="/docs/assets/turbo-native-modules/xcode/3.webp" />

4. 选择 <code>Cocoa Touch Class</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板" src="/docs/assets/turbo-native-modules/xcode/4.webp"  />

5. 将 Cocoa Touch 类命名为 <code>RCTNativeLocalStorage</code>，语言选择 <code>Objective-C</code>。

<img className="half-size" alt="创建 Objective-C RCTNativeLocalStorage 类" src="/docs/assets/turbo-native-modules/xcode/5.webp" />

6. 将 <code>RCTNativeLocalStorage.m</code> 重命名为 <code>RCTNativeLocalStorage.mm</code>，使其成为 Objective-C++ 文件。

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

然后更新实现，使用带有自定义 [suite 名称](https://developer.apple.com/documentation/foundation/nsuserdefaults/1409957-initwithsuitename) 的 `NSUserDefaults`。

```objc title="NativeLocalStorage/RCTNativeLocalStorage.mm"
//  RCTNativeLocalStorage.m
//  TurboModuleExample

#import "RCTNativeLocalStorage.h"

static NSString *const RCTNativeLocalStorageKey = @"local-storage";

@interface RCTNativeLocalStorage()
@property (strong, nonatomic) NSUserDefaults *localStorage;
@end

@implementation RCTNativeLocalStorage

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

+ (NSString *)moduleName
{
  return @"NativeLocalStorage";
}

@end
```

重要事项：

- 你可以使用 Xcode 跳转到 Codegen 中的 `@protocol NativeLocalStorageSpec`。也可以利用 Xcode 为你生成存根代码。

## 在你的应用中注册 Native 模块

最后一步，是更新 `package.json`，告诉 React Native JS 端的 Native 模块规范与 native 代码中具体实现这些规范的桥接。

修改 `package.json` 内容如下：

```json title="package.json"
     "start": "react-native start",
     "test": "jest"
   },
   "codegenConfig": {
     "name": "NativeLocalStorageSpec",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.nativelocalstorage"
     },
     // highlight-add-start
     "ios": {
        "modulesProvider": {
          "NativeLocalStorage": "RCTNativeLocalStorage"
        }
     }
     // highlight-add-end
   },

   "dependencies": {
```

此时需要重新安装 pods，以确保 codegen 重新运行生成新文件：

```bash
# 从 ios 文件夹中执行
bundle exec pod install
open TurboModuleExample.xcworkspace
```

现在从 Xcode 构建你的应用应该能成功。

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