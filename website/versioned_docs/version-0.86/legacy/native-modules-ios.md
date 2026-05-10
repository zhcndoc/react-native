---
id: native-modules-ios
title: iOS 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎来到 iOS 原生模块。请先阅读 [原生模块简介](native-modules-intro)，了解原生模块是什么。

## 创建一个日历原生模块

在下面的指南中，你将创建一个原生模块 `CalendarModule`，它将允许你从 JavaScript 中访问 Apple 的日历 API。到最后，你将能够从 JavaScript 中调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，从而执行一个创建日历事件的原生方法。

### 设置

首先，在 Xcode 中打开你 React Native 应用里的 iOS 项目。你可以在一个 React Native 应用中在这里找到你的 iOS 项目：

<figure>
  <img src="/docs/assets/native-modules-ios-open-project.png" width="500" alt="Image of opening up an iOS project within a React Native app inside of Xcode." />
  <figcaption>你可以找到 iOS 项目的位置示意图</figcaption>
</figure>

我们建议使用 Xcode 来编写原生代码。Xcode 是为 iOS 开发而构建的，使用它可以帮助你快速解决一些较小的错误，比如代码语法问题。

### 创建自定义原生模块文件

第一步是创建我们的主要自定义原生模块头文件和实现文件。创建一个名为 `RCTCalendarModule.h` 的新文件

<figure>
  <img src="/docs/assets/native-modules-ios-add-class.png" width="500" alt="Image of creating a class called  RCTCalendarModule.h." />
  <figcaption>在与 AppDelegate 相同的文件夹中创建自定义原生模块文件的示意图</figcaption>
</figure>

并添加以下内容：

```objectivec
//  RCTCalendarModule.h
#import <React/RCTBridgeModule.h>
@interface RCTCalendarModule : NSObject <RCTBridgeModule>
@end

```

你可以使用任何适合你正在构建的原生模块的名称。将类命名为 `RCTCalendarModule`，因为你正在创建一个日历原生模块。由于 ObjC 在语言层面不支持像 Java 或 C++ 那样的命名空间，惯例是在类名前加上一个前缀子串。这个前缀可以是你应用名称或基础设施名称的缩写。在这个例子中，RCT 指的是 React。

正如你在下面所看到的，CalendarModule 类实现了 `RCTBridgeModule` 协议。原生模块是一个实现了 `RCTBridgeModule` 协议的 Objective-C 类。

接下来，让我们开始实现这个原生模块。使用 Xcode 中的 cocoa touch class 在同一文件夹中创建对应的实现文件 `RCTCalendarModule.m`，并包含以下内容：

```objectivec
// RCTCalendarModule.m
#import "RCTCalendarModule.h"

@implementation RCTCalendarModule

// 导出名为 RCTCalendarModule 的模块
RCT_EXPORT_MODULE();

@end

```

### 模块名称

目前，你的 `RCTCalendarModule.m` 原生模块只包含一个 `RCT_EXPORT_MODULE` 宏，它会将原生模块类导出并注册到 React Native 中。`RCT_EXPORT_MODULE` 宏还接受一个可选参数，用于指定该模块在你的 JavaScript 代码中可访问的名称。

这个参数不是字符串字面量。下面的示例传入的是 `RCT_EXPORT_MODULE(CalendarModuleFoo)`，而不是 `RCT_EXPORT_MODULE("CalendarModuleFoo")`。

```objectivec
// 导出名为 CalendarModuleFoo 的模块
RCT_EXPORT_MODULE(CalendarModuleFoo);
```

然后可以在 JS 中像这样访问这个原生模块：

```tsx
const {CalendarModuleFoo} = ReactNative.NativeModules;
```

如果你没有指定名称，JavaScript 模块名将与 Objective-C 类名一致，并移除任何 "RCT" 或 "RK" 前缀。

让我们按照下面的示例，不带任何参数地调用 `RCT_EXPORT_MODULE`。这样，该模块将以 `CalendarModule` 这个名称暴露给 React Native，因为这就是去掉 RCT 后的 Objective-C 类名。

```objectivec
// 如果不传入名称，这将把原生模块名称导出为去掉 “RCT” 前缀的 Objective-C 类名
RCT_EXPORT_MODULE();
```

然后可以在 JS 中像这样访问这个原生模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 将原生方法导出给 JavaScript

除非明确说明，否则 React Native 不会将原生模块中的任何方法暴露给 JavaScript。可以使用 `RCT_EXPORT_METHOD` 宏来完成这一点。写在 `RCT_EXPORT_METHOD` 宏中的方法是异步的，因此返回类型始终是 void。为了将 `RCT_EXPORT_METHOD` 方法的结果传递给 JavaScript，你可以使用回调或发出事件（下面会介绍）。现在让我们为 `CalendarModule` 原生模块使用 `RCT_EXPORT_METHOD` 宏来设置一个原生方法。将它命名为 `createCalendarEvent()`，目前让它接收 name 和 location 参数，类型为字符串。参数类型选项很快会讲到。

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
}
```

:::note
请注意，除非你的方法依赖 RCT 参数转换（见下方的参数类型），否则在 TurboModules 中不需要 `RCT_EXPORT_METHOD` 宏。最终，React Native 将移除 `RCT_EXPORT_MACRO,`，因此我们不鼓励使用 `RCTConvert`。相反，你可以在方法体内完成参数转换。
:::

在你构建 `createCalendarEvent()` 方法的功能之前，先在方法中添加一个控制台日志，这样你就可以确认它已经从 React Native 应用中的 JavaScript 被调用了。使用 React 的 `RCTLog` API。让我们在文件顶部导入该头文件，然后添加日志调用。

```objectivec
#import <React/RCTLog.h>
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
```

### 同步方法

你可以使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD` 来创建一个同步的原生方法。

```objectivec
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
return [[UIDevice currentDevice] name];
}
```

该方法的返回类型必须是对象类型（id），并且应当可序列化为 JSON。这意味着该 hook 只能返回 nil 或 JSON 值（例如 NSNumber、NSString、NSArray、NSDictionary）。

目前，我们不建议使用同步方法，因为同步调用方法可能会带来严重的性能损耗，并给你的原生模块引入与线程相关的 bug。此外，请注意，如果你选择使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD`，你的应用将无法再使用 Google Chrome 调试器。这是因为同步方法要求 JS VM 与应用共享内存。对于 Google Chrome 调试器，React Native 会运行在 Google Chrome 中的 JS VM 里，并通过 WebSockets 与移动设备异步通信。

### 测试你已经构建的内容

到目前为止，你已经为 iOS 中的原生模块搭建了基本框架。通过访问原生模块并在 JavaScript 中调用它导出的 method 来进行测试。

在你的应用中找一个你想添加对原生模块的 `createCalendarEvent()` 方法调用的位置。下面是一个组件示例，`NewModuleButton`，你可以将它添加到应用中。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用原生模块。

```tsx
import React from 'react';
import {Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('我们将在这里调用原生模块！');
  };

  return (
    <Button
      title="点击调用你的原生模块！"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

为了从 JavaScript 中访问你的原生模块，你需要先从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后你就可以从 `NativeModules` 中访问 `CalendarModule` 原生模块。

```tsx
const {CalendarModule} = NativeModules;
```

现在你已经可以使用 `CalendarModule` 原生模块了，你可以调用你的原生方法 `createCalendarEvent()`。下面将它添加到 `NewModuleButton` 的 `onPress()` 方法中：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重新构建 React Native 应用，以便你可以获得最新的原生代码（以及你新的原生模块！）。在命令行中，进入 react native 应用所在的位置，运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios
```

</TabItem>
</Tabs>

### 在迭代过程中构建

当你按照这些指南进行并迭代你的原生模块时，你需要重新构建应用的原生部分，才能从 JavaScript 中访问最近的更改。这是因为你编写的代码位于应用的原生部分。虽然 React Native 的 metro 打包器可以监视 JavaScript 的变化，并为你动态重建 JS bundle，但它不会对原生代码这样做。因此，如果你想测试最新的原生更改，就需要使用上面的命令重新构建。

### 回顾✨

现在你应该能够在 JavaScript 中调用你的原生模块上的 `createCalendarEvent()` 方法了。由于你在函数中使用了 `RCTLog`，你可以通过[在你的应用中启用调试模式](https://reactnative.dev/docs/debugging#chrome-developer-tools)并查看 Chrome 中的 JS 控制台或移动应用调试器 Flipper 来确认你的原生方法确实被调用了。每次你调用原生模块方法时，你都应该看到 `RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);` 这条消息。

<figure>
  <img src="/docs/assets/native-modules-ios-logs.png" width="1000" alt="Image of logs." />
  <figcaption>Flipper 中的 iOS 日志示意图</figcaption>
</figure>

到目前为止，你已经创建了一个 iOS 原生模块，并从 React Native 应用中的 JavaScript 调用了它上的一个方法。你可以继续阅读，了解更多内容，比如你的原生模块方法可以接受哪些参数类型，以及如何在原生模块中设置回调和 promise。

## 超越日历原生模块

### 更好的原生模块导出

像上面那样通过从 `NativeModules` 中取出原生模块来导入，会有点笨拙。

为了让你的原生模块使用者不必每次访问原生模块时都这样做，你可以为该模块创建一个 JavaScript 包装器。创建一个名为 NativeCalendarModule.js 的新 JavaScript 文件，内容如下：

```tsx
/**
* 这会将原生 CalendarModule 模块作为一个 JS 模块导出。它包含一个
* 名为 'createCalendarEvent' 的函数，该函数接收以下参数：

* 1. String name: 表示事件名称的字符串
* 2. String location: 表示事件地点的字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也是你添加任何 JavaScript 侧功能的好地方。例如，如果你使用 TypeScript 之类的类型系统，可以在这里为原生模块添加类型注解。虽然 React Native 目前还不支持 Native 到 JS 的类型安全，但有了这些类型注解，所有 JS 代码都会是类型安全的。这些注解也会让你以后切换到类型安全的原生模块更容易。下面是为 Calendar Module 添加类型安全的示例：

```tsx
/**
 * 这会将原生 CalendarModule 模块作为一个 JS 模块导出。它包含一个
 * 名为 'createCalendarEvent' 的函数，该函数接收以下参数：
 *
 * 1. String name: 表示事件名称的字符串
 * 2. String location: 表示事件地点的字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在其他 JavaScript 文件中，你可以像这样访问原生模块并调用它的方法：

```tsx
import NativeCalendarModule from './NativeCalendarModule';
NativeCalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这里假设你导入 `CalendarModule` 的位置与 `NativeCalendarModule.js` 处于同一目录层级。请根据需要更新相对导入路径。
:::

### 参数类型

当在 JavaScript 中调用原生模块方法时，React Native 会将参数从 JS 对象转换为它们对应的 Objective-C/Swift 对象。因此，例如，如果你的 Objective-C 原生模块方法接受一个 NSNumber，那么在 JS 中你需要传入一个 number。React Native 会帮你完成转换。下面列出了原生模块方法支持的参数类型及其对应的 JavaScript 等价类型。

| Objective-C                                   | JavaScript         |
| --------------------------------------------- | ------------------ |
| NSString                                      | string, ?string    |
| BOOL                                          | boolean            |
| double                                        | number             |
| NSNumber                                      | ?number            |
| NSArray                                       | Array, ?Array      |
| NSDictionary                                  | Object, ?Object    |
| RCTResponseSenderBlock                        | Function (success) |
| RCTResponseSenderBlock, RCTResponseErrorBlock | Function (failure) |
| RCTPromiseResolveBlock, RCTPromiseRejectBlock | Promise            |

:::info
以下类型目前受支持，但在 TurboModules 中将不再受支持。请避免使用它们。

- Function (failure) -> RCTResponseErrorBlock
- Number -> NSInteger
- Number -> CGFloat
- Number -> float
  :::

对于 iOS，你也可以使用 `RCTConvert` 类所支持的任意参数类型来编写原生模块方法（有关支持内容的详细信息，请参见 [RCTConvert](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTConvert.h)）。RCTConvert 辅助函数都接受一个 JSON 值作为输入，并将其映射为原生 Objective-C 类型或类。

### 导出常量

原生模块可以通过重写原生方法 `constantsToExport()` 来导出常量。下面重写了 `constantsToExport()`，并返回一个包含默认事件名属性的字典，你可以在 JavaScript 中这样访问它：

```objectivec
- (NSDictionary *)constantsToExport
{
 return @{ @"DEFAULT_EVENT_NAME": @"新事件" };
}
```

然后可以通过在 JS 中调用原生模块的 `getConstants()` 来访问该常量，如下所示：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从 `NativeModule` 对象上访问 `constantsToExport()` 中导出的常量。不过这在 TurboModules 中将不再受支持，因此我们鼓励社区切换到上述方式，以避免后续迁移的需要。

:::note
这些常量只会在初始化时导出，因此如果你在运行时更改 `constantsToExport()` 的值，不会影响 JavaScript 环境。
:::

对于 iOS，如果你重写了 `constantsToExport()`，那么还应该实现 `+ requiresMainQueueSetup`，以便让 React Native 知道你的模块是否需要在主线程上初始化，并且要在任何 JavaScript 代码执行之前完成。否则你会看到一个警告，提示将来你的模块可能会在后台线程上初始化，除非你显式通过 `+ requiresMainQueueSetup:` 选择退出。如果你的模块不需要访问 UIKit，那么你应该将 `+ requiresMainQueueSetup` 返回值设为 NO。

### 回调

原生模块还支持一种独特的参数类型——回调。回调用于在异步方法中将数据从 Objective-C 传递给 JavaScript。它们也可以用于从原生端异步执行 JS。

对于 iOS，回调使用 `RCTResponseSenderBlock` 类型实现。下面在 `createCalendarEventMethod()` 中添加了回调参数 `myCallBack`：

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)

```

然后你可以在原生函数中调用该回调，并以数组形式提供任何你想传递给 JavaScript 的结果。请注意，`RCTResponseSenderBlock` 只接受一个参数——一个要传递给 JavaScript 回调的参数数组。下面你将返回在先前调用中创建的事件 ID。

:::info
需要强调的是，回调不会在原生函数完成后立即被调用——请记住通信是异步的。
:::

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
 NSInteger eventId = ...
 callback(@[@(eventId)]);

 RCTLogInfo(@"正在尝试在 %@ 创建一个事件 %@", title, location);
}

```

然后可以在 JavaScript 中通过以下方式访问此方法：

```tsx
const onSubmit = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    '04-12-2020',
    eventId => {
      console.log(`使用 id ${eventId} 创建了一个新事件`);
    },
  );
};
```

原生模块按设计只应调用其回调一次。不过，它也可以保存该回调并在之后调用它。这种模式通常用于包装需要 delegate 的 iOS API——例如可参见 [`RCTAlertManager`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/CoreModules/RCTAlertManager.mm)。如果回调从未被调用，就会泄漏一些内存。

使用回调进行错误处理有两种方式。第一种是遵循 Node 的约定，将传递给回调数组的第一个参数视为错误对象。

```objectivec
RCT_EXPORT_METHOD(createCalendarEventCallback:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
  NSNumber *eventId = [NSNumber numberWithInt:123];
  callback(@[[NSNull null], eventId]);
}
```

在 JavaScript 中，你可以检查第一个参数，看是否传入了错误：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`发现错误！${error}`);
      }
      console.log(`返回了 event id ${eventId}`);
    },
  );
};
```

另一种选择是使用两个独立的回调：onFailure 和 onSuccess。

```objectivec
RCT_EXPORT_METHOD(createCalendarEventCallback:(NSString *)title
                  location:(NSString *)location
                  errorCallback: (RCTResponseSenderBlock)errorCallback
                  successCallback: (RCTResponseSenderBlock)successCallback)
{
  @try {
    NSNumber *eventId = [NSNumber numberWithInt:123];
    successCallback(@[eventId]);
  }

  @catch ( NSException *e ) {
    errorCallback(@[e]);
  }
}
```

然后在 JavaScript 中，你可以为错误和成功响应分别添加回调：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    error => {
      console.error(`发现错误！${error}`);
    },
    eventId => {
      console.log(`返回了 event id ${eventId}`);
    },
  );
};
```

如果你想传递类似错误的对象到 JavaScript，请使用 [`RCTUtils.h.`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTUtils.h) 中的 `RCTMakeError`。目前这只会向 JavaScript 传递一个 Error 形状的字典，但 React Native 未来的目标是自动生成真正的 JavaScript Error 对象。你也可以提供一个 `RCTResponseErrorBlock` 参数，它用于错误回调并接受一个 `NSError \* object`。请注意，这种参数类型在 TurboModules 中将不再受支持。

### Promise

原生模块也可以返回一个 promise，这可以简化你的 JavaScript，尤其是在使用 ES2016 的 `async/await` 语法时。当原生模块方法的最后一个参数是 `RCTPromiseResolveBlock` 和 `RCTPromiseRejectBlock` 时，其对应的 JS 方法将返回一个 JS Promise 对象。

将上面的代码重构为使用 promise 而不是回调，如下所示：

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                 location:(NSString *)location
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
 NSInteger eventId = createCalendarEvent();
 if (eventId) {
    resolve(@(eventId));
  } else {
    reject(@"event_failure", @"未返回 event id", nil);
  }
}

```

这个方法在 JavaScript 中的对应实现会返回一个 Promise。这意味着你可以在 async 函数中使用 `await` 关键字来调用它并等待其结果：

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'my house',
    );
    console.log(`使用 id ${eventId} 创建了一个新事件`);
  } catch (e) {
    console.error(e);
  }
};
```

### 向 JavaScript 发送事件

原生模块可以在不被直接调用的情况下向 JavaScript 发出事件信号。例如，你可能想向 JavaScript 发出一个提醒：原生 iOS 日历应用中的某个日历事件即将发生。推荐的做法是继承 `RCTEventEmitter`，实现 `supportedEvents` 并调用 self 的 `sendEventWithName`：

更新你的头文件，导入 `RCTEventEmitter` 并让其继承自 `RCTEventEmitter`：

```objectivec
//  CalendarModule.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CalendarModule : RCTEventEmitter <RCTBridgeModule>
@end

```

JavaScript 代码可以通过围绕你的模块创建一个新的 `NativeEventEmitter` 实例来订阅这些事件。

如果在没有监听器时仍然发出事件而浪费资源，你会收到警告。为了避免这种情况，并优化你的模块工作负载（例如取消订阅上游通知或暂停后台任务），你可以在 `RCTEventEmitter` 子类中重写 `startObserving` 和 `stopObserving`。

```objectivec
@implementation CalendarModule
{
  bool hasListeners;
}

// 当添加该模块的第一个监听器时调用。
-(void)startObserving {
    hasListeners = YES;
    // 根据需要设置任何上游监听器或后台任务
}

// 当移除该模块的最后一个监听器时调用，或在 dealloc 时调用。
-(void)stopObserving {
    hasListeners = NO;
    // 移除上游监听器，停止不必要的后台任务
}

- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  if (hasListeners) {// 只有在有人监听时才发送事件
    [self sendEventWithName:@"EventReminder" body:@{@"name": eventName}];
  }
}

```

### 线程

除非原生模块提供了自己的方法队列，否则它不应对被调用时所在线程做任何假设。目前，如果原生模块没有提供方法队列，React Native 会为其创建一个独立的 GCD 队列，并在该队列上调用其方法。请注意，这只是一个实现细节，未来可能会改变。如果你想显式为原生模块提供方法队列，可以在原生模块中重写 `(dispatch_queue_t) methodQueue` 方法。例如，如果它需要使用仅能在主线程调用的 iOS API，则应通过以下方式指定：

```objectivec
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
```

同样地，如果某个操作可能需要很长时间才能完成，原生模块可以指定自己的队列来运行操作。再次说明，目前 React Native 会为你的原生模块提供一个独立的方法队列，但这是一个你不应依赖的实现细节。如果你不提供自己的方法队列，将来你的原生模块中的长时间运行操作可能会阻塞在其他无关原生模块上执行的异步调用。这里的 `RCTAsyncLocalStorage` 模块就是一个例子，它创建了自己的队列，因此 React 队列不会被潜在的慢速磁盘访问所阻塞。

```objectivec
- (dispatch_queue_t)methodQueue
{
 return dispatch_queue_create("com.facebook.React.AsyncLocalStorageQueue", DISPATCH_QUEUE_SERIAL);
}
```

指定的 `methodQueue` 会被你模块中的所有方法共享。如果只有某一个方法执行时间很长（或者由于某种原因需要在与其他方法不同的队列上运行），你可以在该方法内部使用 `dispatch_async`，将该方法的代码放到另一个队列中执行，而不影响其他方法：

```objectivec
RCT_EXPORT_METHOD(doSomethingExpensive:(NSString *)param callback:(RCTResponseSenderBlock)callback)
{
 dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
   // 在后台线程调用耗时代码
   ...
   // 你可以从任意线程/队列调用 callback
   callback(@[...]);
 });
}

```

:::info[共享模块之间的 dispatch 队列]
`methodQueue` 方法会在模块初始化时被调用一次，然后由 React Native 持有，因此你不需要自己保留该队列的引用，除非你希望在模块内部使用它。不过，如果你希望在多个模块之间共享同一个队列，那么你需要确保为每个模块保留并返回同一个队列实例。
:::

### 依赖注入

React Native 会自动创建并初始化任何已注册的原生模块。不过，你也可能希望自己创建并初始化模块实例，例如用于注入依赖。

你可以通过创建一个实现了 `RCTBridgeDelegate` 协议的类，使用该 delegate 作为参数初始化一个 `RCTBridge`，然后用这个已初始化的 bridge 来初始化一个 `RCTRootView`。

```objectivec
id<RCTBridgeDelegate> moduleInitialiser = [[classThatImplementsRCTBridgeDelegate alloc] init];

RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:moduleInitialiser launchOptions:nil];

RCTRootView *rootView = [[RCTRootView alloc]
                        initWithBridge:bridge
                            moduleName:kModuleName
                     initialProperties:nil];
```

### 导出 Swift

Swift 不支持宏，因此在 React Native 中将原生模块及其方法暴露给 JavaScript 需要多做一些设置。不过，整体上工作方式相似。假设你有同样的 `CalendarModule`，但它是一个 Swift 类：

```swift
// CalendarModule.swift

@objc(CalendarModule)
class CalendarModule: NSObject {

 @objc(addEvent:location:date:)
 func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
   // 日期已准备就绪！
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }

}
```

:::note
务必要使用 `@objc` 修饰符，以确保该类和函数能够正确导出到 Objective-C 运行时。
:::

然后创建一个私有实现文件，向 React Native 注册所需信息：

```objectivec
// CalendarModuleBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)

@end
```

对于刚接触 Swift 和 Objective-C 的开发者来说，每当你在 iOS 项目中[混合使用这两种语言](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html)时，你还需要一个额外的桥接文件，称为 bridging header，用来将 Objective-C 文件暴露给 Swift。如果你通过 Xcode 的 `File>New File` 菜单将 Swift 文件添加到应用中，Xcode 会提示你创建这个头文件。你需要在这个头文件中导入 `RCTBridgeModule.h`。

```objectivec
// CalendarModule-Bridging-Header.h
#import <React/RCTBridgeModule.h>
```

你也可以使用 `RCT_EXTERN_REMAP_MODULE` 和 `_RCT_EXTERN_REMAP_METHOD` 来更改你导出的模块或方法在 JavaScript 中的名称。更多信息请参见 [`RCTBridgeModule`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTBridgeModule.h)。

:::note
在制作第三方模块时需要注意：带有 Swift 的静态库仅在 Xcode 9 及更高版本中受支持。为了使在模块中包含的 iOS 静态库中使用 Swift 时 Xcode 项目能够构建，你的主应用项目本身必须包含 Swift 代码和一个 bridging header。如果你的应用项目不包含任何 Swift 代码，可以使用一个空的 .swift 文件和一个空的 bridging header 作为变通方案。
:::

### 保留的方法名

#### invalidate()

iOS 上的原生模块可以通过实现 `invalidate()` 方法来遵循 [RCTInvalidating](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTInvalidating.h) 协议。当原生桥接被失效时（即在开发模式重新加载时），这个方法[可以被调用](https://github.com/facebook/react-native/blob/0.62-stable/ReactCommon/turbomodule/core/platform/ios/RCTTurboModuleManager.mm#L456)。请在必要时使用该机制为你的原生模块执行所需的清理工作。