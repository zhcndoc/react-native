---
id: native-modules-ios
title: iOS 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎使用 iOS Native Modules。请先阅读 [Native Modules Intro](native-modules-intro)，了解 native modules 的相关介绍。

## 创建 Calendar Native Module

在以下指南中，你将创建一个 native module：`CalendarModule`，它可以让你从 JavaScript 访问 Apple 的日历 API。完成后，你将能够从 JavaScript 调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，调用一个创建日历事件的 native 方法。

### 设置

首先，在 Xcode 中打开 React Native 应用中的 iOS 项目。在 React Native 应用中，你可以在这里找到 iOS 项目：

<figure>
  <img src="/docs/assets/native-modules-ios-open-project.png" width="500" alt="在 Xcode 中打开 React Native 应用内 iOS 项目的图片" />
  <figcaption>可以找到 iOS 项目的位置</figcaption>
</figure>

我们建议使用 Xcode 编写 native 代码。Xcode 专为 iOS 开发而构建，使用它可以帮助你快速解决代码语法等小问题。

### 创建自定义 Native Module 文件

第一步是创建主要的自定义 native module 头文件和实现文件。创建一个名为 `RCTCalendarModule.h` 的新文件

<figure>
  <img src="/docs/assets/native-modules-ios-add-class.png" width="500" alt="创建名为 RCTCalendarModule.h 的类的图片" />
  <figcaption>在与 AppDelegate 相同的文件夹中创建自定义 native module 文件</figcaption>
</figure>

并添加以下内容：

```objectivec
//  RCTCalendarModule.h
#import <React/RCTBridgeModule.h>
@interface RCTCalendarModule : NSObject <RCTBridgeModule>
@end

```

你可以使用任何适合正在构建的 native module 的名称。由于你正在创建日历 native module，因此将类命名为 `RCTCalendarModule`。由于 ObjC 没有像 Java 或 C++ 那样的语言级命名空间支持，通常会在类名之前添加一个子字符串。它可以是应用名称或基础设施名称的缩写。在这个示例中，RCT 指的是 React。

如你在下面看到的，CalendarModule 类实现了 `RCTBridgeModule` 协议。native module 是一个实现了 `RCTBridgeModule` 协议的 Objective-C 类。

接下来，让我们开始实现 native module。使用 Xcode 中的 cocoa touch class 在同一文件夹中创建对应的实现文件 `RCTCalendarModule.m`，并包含以下内容：

```objectivec
// RCTCalendarModule.m
#import "RCTCalendarModule.h"

@implementation RCTCalendarModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

@end

```

### Module Name

目前，你的 `RCTCalendarModule.m` native module 只包含一个 `RCT_EXPORT_MODULE` 宏，它会向 React Native 导出并注册 native module 类。`RCT_EXPORT_MODULE` 宏还接受一个可选参数，用于指定该 module 在 JavaScript 代码中可访问的名称。

此参数不是字符串字面量。在下面的示例中，传入的是 `RCT_EXPORT_MODULE(CalendarModuleFoo)`，而不是 `RCT_EXPORT_MODULE("CalendarModuleFoo")`。

```objectivec
// To export a module named CalendarModuleFoo
RCT_EXPORT_MODULE(CalendarModuleFoo);
```

然后可以像这样在 JS 中访问 native module：

```tsx
const {CalendarModuleFoo} = ReactNative.NativeModules;
```

如果你不指定名称，JavaScript module 名称将与 Objective-C 类名一致，但会移除任何 `"RCT"` 或 `"RK"` 前缀。

让我们遵循下面的示例，在不传入任何参数的情况下调用 `RCT_EXPORT_MODULE`。这样，module 将使用 `CalendarModule` 这个名称向 React Native 暴露，因为这是移除了 RCT 后的 Objective-C 类名。

```objectivec
// Without passing in a name this will export the native module name as the Objective-C class name with “RCT” removed
RCT_EXPORT_MODULE();
```

然后可以像这样在 JS 中访问 native module：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 向 JavaScript 导出 Native Method

除非明确告知 React Native，否则 React Native 不会向 JavaScript 暴露 native module 中的任何方法。可以使用 `RCT_EXPORT_METHOD` 宏完成此操作。写在 `RCT_EXPORT_METHOD` 宏中的方法是异步的，因此返回类型始终为 void。要将 `RCT_EXPORT_METHOD` 方法的结果传递给 JavaScript，可以使用回调或发送事件（将在下面介绍）。现在，让我们使用 `RCT_EXPORT_METHOD` 宏为 `CalendarModule` native module 设置一个 native 方法。将其命名为 `createCalendarEvent()`，暂时让它接收 name 和 location 两个字符串参数。参数类型选项稍后会介绍。

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
}
```

:::note
请注意，除非你的方法依赖 RCT 参数转换（见下方的参数类型），否则在 TurboModules 中不需要使用 `RCT_EXPORT_METHOD` 宏。最终，React Native 将移除 `RCT_EXPORT_MACRO,`，因此我们不建议使用 `RCTConvert`。相反，你可以在方法体中进行参数转换。
:::

在实现 `createCalendarEvent()` 方法的功能之前，先在方法中添加一条控制台日志，以便确认它已从 React Native 应用中的 JavaScript 被调用。使用 React 提供的 `RCTLog` API。让我们在文件顶部导入该头文件，然后添加日志调用。

```objectivec
#import <React/RCTLog.h>
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
```

### 同步方法

你可以使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD` 创建同步 native 方法。

```objectivec
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
return [[UIDevice currentDevice] name];
}
```

此方法的返回类型必须是对象类型（id），并且应可序列化为 JSON。这意味着该 hook 只能返回 nil 或 JSON 值（例如 NSNumber、NSString、NSArray、NSDictionary）。

目前，我们不建议使用同步方法，因为同步调用方法可能会带来严重的性能损失，并在 native module 中引入与线程相关的 bug。另外请注意，如果选择使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD`，应用将无法再使用 Google Chrome 调试器。这是因为同步方法要求 JS VM 与应用共享内存。对于 Google Chrome 调试器，React Native 在 Google Chrome 的 JS VM 中运行，并通过 WebSockets 与移动设备异步通信。

### 测试已构建的内容

现在，你已经为 iOS 中的 native module 设置了基本框架。通过访问 native module 并在 JavaScript 中调用其导出的方法来进行测试。

在应用中找到你想要添加 native module 的 `createCalendarEvent()` 方法调用的位置。下面是一个组件示例，你可以将其添加到应用中。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用 native module。

```tsx
import {Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('We will invoke the native module here!');
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

要从 JavaScript 访问 native module，首先需要从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后，你可以从 `NativeModules` 中访问 `CalendarModule` native module。

```tsx
const {CalendarModule} = NativeModules;
```

现在你已经可以使用 CalendarModule native module 了，可以调用 native 方法 `createCalendarEvent()`。下面将它添加到 `NewModuleButton` 的 `onPress()` 方法中：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重新构建 React Native 应用，以便使用最新的 native 代码（包括新创建的 native module）。在 React Native 应用所在的命令行中，运行以下命令：

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

### 迭代构建

在学习这些指南并迭代开发 native module 的过程中，你需要对应用进行 native 重建，才能从 JavaScript 访问最新的更改。这是因为你编写的代码位于应用的 native 部分。React Native 的 metro bundler 可以监视 JavaScript 的更改并为你实时重新构建 JS bundle，但它不会对 native 代码执行此操作。因此，如果你想测试最新的 native 更改，就需要使用上面的命令重新构建。

### 回顾✨

现在，你应该可以在 JavaScript 中调用 native module 上的 `createCalendarEvent()` 方法了。由于你在函数中使用了 `RCTLog`，因此可以通过[在应用中启用调试模式](https://reactnative.dev/docs/debugging#chrome-developer-tools)，并查看 Chrome 中的 JS 控制台或移动应用调试器 Flipper，来确认 native 方法是否被调用。每次调用 native module 方法时，你都应该能看到 `RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);` 消息。

<figure>
  <img src="/docs/assets/native-modules-ios-logs.png" width="1000" alt="日志图片" />
  <figcaption>Flipper 中的 iOS 日志图片</figcaption>
</figure>

现在，你已经创建了一个 iOS native module，并在 React Native 应用中从 JavaScript 调用了它的方法。你可以继续阅读，详细了解 native module 方法接收的参数类型，以及如何在 native module 中设置回调和 promise。

## 超越 Calendar Native Module

### 更好的 Native Module 导出方式

像上面那样从 `NativeModules` 中取出 native module 并导入，稍微有些繁琐。

为了避免 native module 的使用者每次想访问 native module 时都需要这样做，你可以为 module 创建一个 JavaScript 封装器。创建一个名为 NativeCalendarModule.js 的新 JavaScript 文件，并添加以下内容：

```tsx
/**
* This exposes the native CalendarModule module as a JS module. This has a
* function 'createCalendarEvent' which takes the following parameters:

* 1. String name: A string representing the name of the event
* 2. String location: A string representing the location of the event
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也是添加 JavaScript 端功能的好位置。例如，如果你使用 TypeScript 这样的类型系统，可以在这里为 native module 添加类型注解。虽然 React Native 目前还不支持 Native 到 JS 的类型安全，但借助这些类型注解，你的所有 JS 代码都将具备类型安全。这些注解还会让你日后切换到类型安全的 native module 变得更加容易。下面是为 Calendar Module 添加类型安全的示例：

```tsx
/**
 * This exposes the native CalendarModule module as a JS module. This has a
 * function 'createCalendarEvent' which takes the following parameters:
 *
 * 1. String name: A string representing the name of the event
 * 2. String location: A string representing the location of the event
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在其他 JavaScript 文件中，你可以像这样访问 native module 并调用其方法：

```tsx
import NativeCalendarModule from './NativeCalendarModule';
NativeCalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这假设你导入 `CalendarModule` 的位置与 `NativeCalendarModule.js` 位于同一层级。请根据需要更新相对导入路径。
:::

### 参数类型

当在 JavaScript 中调用 native module 方法时，React Native 会将参数从 JS 对象转换为对应的 Objective-C/Swift 对象。例如，如果你的 Objective-C Native Module 方法接收 NSNumber，那么在 JS 中需要使用 number 调用该方法。React Native 会为你处理转换。下面列出了 native module 方法支持的参数类型，以及它们对应的 JavaScript 类型。

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

对于 iOS，你还可以使用 `RCTConvert` 类支持的任何参数类型来编写 native module 方法（有关支持内容的详细信息，请参阅 [RCTConvert](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTConvert.h)）。RCTConvert 辅助函数都接受 JSON 值作为输入，并将其映射到 native Objective-C 类型或类。

### 导出常量

native module 可以通过重写 native 方法 `constantsToExport()` 来导出常量。下面重写了 `constantsToExport()`，并返回一个包含默认事件名称属性的 Dictionary，你可以像这样在 JavaScript 中访问它：

```objectivec
- (NSDictionary *)constantsToExport
{
 return @{ @"DEFAULT_EVENT_NAME": @"New Event" };
}
```

然后，可以在 JS 中通过调用 native module 上的 `getConstants()` 来访问该常量：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从 `NativeModule` 对象访问 `constantsToExport()` 中导出的常量。TurboModules 将不再支持这种方式，因此我们建议社区切换到上面介绍的方法，以避免日后不必要的迁移。

:::note
常量只会在初始化时导出，因此如果你在运行时更改 `constantsToExport()` 的值，不会影响 JavaScript 环境。
:::

对于 iOS，如果你重写了 `constantsToExport()`，还应该实现 `+ requiresMainQueueSetup`，以便让 React Native 知道你的 module 是否需要在主线程上初始化，并且是在任何 JavaScript 代码执行之前初始化。否则你会看到一条警告，提示将来你的 module 可能会在后台线程上初始化，除非你使用 `+ requiresMainQueueSetup:` 明确选择退出。如果你的 module 不需要访问 UIKit，则应让 `+ requiresMainQueueSetup` 返回 NO。

### 回调

native module 还支持一种独特的参数类型——回调。回调用于在异步方法中将数据从 Objective-C 传递给 JavaScript。它们也可以用于从 native 端异步执行 JS。

对于 iOS，回调使用 `RCTResponseSenderBlock` 类型实现。下面将回调参数 `myCallBack` 添加到 `createCalendarEventMethod()` 中：

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)

```

然后，你可以在 native 函数中调用回调，并通过数组提供要传递给 JavaScript 的任意结果。请注意，`RCTResponseSenderBlock` 只接受一个参数——要传递给 JavaScript 回调的参数数组。下面将传回之前调用中创建的事件 ID。

:::info
需要特别强调的是，回调不会在 native 函数完成后立即调用——请记住，通信是异步的。
:::

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
 NSInteger eventId = ...
 callback(@[@(eventId)]);

 RCTLogInfo(@"Pretending to create an event %@ at %@", title, location);
}

```

然后可以使用以下方式在 JavaScript 中访问此方法：

```tsx
const onSubmit = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    '04-12-2020',
    eventId => {
      console.log(`Created a new event with id ${eventId}`);
    },
  );
};
```

native module 应该只调用其回调一次。不过，它可以存储回调并稍后调用。这种模式通常用于封装需要 delegates 的 iOS API——有关示例，请参阅 [`RCTAlertManager`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/CoreModules/RCTAlertManager.mm)。如果回调从未被调用，就会发生内存泄漏。

使用回调处理错误有两种方式。第一种是遵循 Node 的约定，将传递给回调数组的第一个参数视为错误对象。

```objectivec
RCT_EXPORT_METHOD(createCalendarEventCallback:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
  NSNumber *eventId = [NSNumber numberWithInt:123];
  callback(@[[NSNull null], eventId]);
}
```

然后，在 JavaScript 中，你可以检查第一个参数，以确定是否传递了错误：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`Error found! ${error}`);
      }
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

另一种方式是使用两个独立的回调：onFailure 和 onSuccess。

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

然后，在 JavaScript 中，你可以为错误响应和成功响应分别添加回调：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    error => {
      console.error(`Error found! ${error}`);
    },
    eventId => {
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

如果你想将类似错误的对象传递给 JavaScript，请使用 [`RCTUtils.h.`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTUtils.h) 中的 `RCTMakeError`。目前，这只会向 JavaScript 传递一个类似 Error 的字典，但 React Native 计划在未来自动生成真正的 JavaScript Error 对象。你还可以提供一个 `RCTResponseErrorBlock` 参数，该参数用于错误回调并接受一个 `NSError \* object`。请注意，TurboModules 将不支持此参数类型。

### Promises

native module 也可以完成一个 promise，这可以简化你的 JavaScript，尤其是在使用 ES2016 的 `async/await` 语法时。当 native module 方法的最后两个参数是 `RCTPromiseResolveBlock` 和 `RCTPromiseRejectBlock` 时，其对应的 JS 方法将返回一个 JS Promise 对象。

将上面的代码重构为使用 promise 而不是回调后，如下所示：

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
    reject(@"event_failure", @"no event id returned", nil);
  }
}

```

此方法对应的 JavaScript 方法会返回一个 Promise。这意味着你可以在 async 函数中使用 `await` 关键字调用它并等待其结果：

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'my house',
    );
    console.log(`Created a new event with id ${eventId}`);
  } catch (e) {
    console.error(e);
  }
};
```

### 向 JavaScript 发送事件

native module 可以在未被直接调用的情况下向 JavaScript 发送事件。例如，你可能希望向 JavaScript 发送提醒，告知原生 iOS 日历应用中的日历事件即将发生。推荐的做法是继承 `RCTEventEmitter`，实现 `supportedEvents`，并调用 `self sendEventWithName`：

更新头文件类，导入 `RCTEventEmitter` 并继承 `RCTEventEmitter`：

```objectivec
//  CalendarModule.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CalendarModule : RCTEventEmitter <RCTBridgeModule>
@end

```

JavaScript 代码可以通过围绕 module 创建新的 `NativeEventEmitter` 实例来订阅这些事件。

如果在没有监听器的情况下发送事件而不必要地消耗资源，你会收到警告。为了避免这种情况，并优化 module 的工作负载（例如取消订阅上游通知或暂停后台任务），你可以在 `RCTEventEmitter` 子类中重写 `startObserving` 和 `stopObserving`。

```objectivec
@implementation CalendarModule
{
  bool hasListeners;
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  if (hasListeners) {// Only send events if anyone is listening
    [self sendEventWithName:@"EventReminder" body:@{@"name": eventName}];
  }
}

```

### 线程处理

除非 native module 提供自己的 method queue，否则不应假设它会在哪个线程上被调用。目前，如果 native module 不提供 method queue，React Native 会为其创建一个单独的 GCD queue，并在其中调用其方法。请注意，这是一个实现细节，未来可能会发生变化。如果你想明确地为 native module 提供 method queue，可以在 native module 中重写 `(dispatch_queue_t) methodQueue` 方法。例如，如果它需要使用只能在主线程上运行的 iOS API，则应通过以下方式指定：

```objectivec
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
```

同样，如果某个操作可能需要很长时间才能完成，native module 可以指定自己的 queue 来运行操作。目前，React Native 也会为你的 native module 提供一个单独的 method queue，但这是一个不应依赖的实现细节。如果你不提供自己的 method queue，将来 native module 中的长时间运行操作可能会阻塞其他不相关 native module 执行的异步调用。例如，此处的 `RCTAsyncLocalStorage` module 创建了自己的 queue，因此 React queue 不会因等待可能较慢的磁盘访问而被阻塞。

```objectivec
- (dispatch_queue_t)methodQueue
{
 return dispatch_queue_create("com.facebook.React.AsyncLocalStorageQueue", DISPATCH_QUEUE_SERIAL);
}
```

指定的 `methodQueue` 将由 module 中的所有方法共享。如果只有一个方法运行时间较长（或者由于某种原因需要在与其他方法不同的 queue 上运行），则可以在该方法中使用 `dispatch_async`，在另一个 queue 上执行该方法的代码，而不会影响其他方法：

```objectivec
RCT_EXPORT_METHOD(doSomethingExpensive:(NSString *)param callback:(RCTResponseSenderBlock)callback)
{
 dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
   // Call long-running code on background thread
   ...
   // You can invoke callback from any thread/queue
   callback(@[...]);
 });
}

```

:::info[在 modules 之间共享 dispatch queues]
`methodQueue` 方法会在 module 初始化时调用一次，然后由 React Native 保留，因此无需自行保留 queue 的引用，除非你希望在 module 中使用它。但是，如果你希望在多个 module 之间共享同一个 queue，则需要确保为每个 module 保留并返回同一个 queue 实例。
:::

### 依赖注入

React Native 会自动创建并初始化所有已注册的 native module。不过，你可能希望创建并初始化自己的 module 实例，例如注入依赖。

你可以创建一个实现 `RCTBridgeDelegate` Protocol 的类，将 delegate 作为参数初始化 `RCTBridge`，然后使用已初始化的 bridge 初始化 `RCTRootView`。

```objectivec
id<RCTBridgeDelegate> moduleInitialiser = [[classThatImplementsRCTBridgeDelegate alloc] init];

RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:moduleInitialiser launchOptions:nil];

RCTRootView *rootView = [[RCTRootView alloc]
                        initWithBridge:bridge
                            moduleName:kModuleName
                     initialProperties:nil];
```

### 导出 Swift

Swift 不支持宏，因此要在 React Native 中向 JavaScript 暴露 native module 及其方法，需要进行一些额外设置。不过，其工作方式基本相同。假设你有同样的 `CalendarModule`，但它是一个 Swift 类：

```swift
// CalendarModule.swift

@objc(CalendarModule)
class CalendarModule: NSObject {

 @objc(addEvent:location:date:)
 func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
   // Date is ready to use!
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }

}
```

:::note
务必使用 `@objc` 修饰符，以确保类和函数正确导出到 Objective-C runtime。
:::

然后创建一个私有实现文件，用于向 React Native 注册所需的信息：

```objectivec
// CalendarModuleBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)

@end
```

对于刚接触 Swift 和 Objective-C 的开发者，每当你在 iOS 项目中[混合使用这两种语言](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html)时，还需要一个额外的 bridging 文件，也称为 bridging header，用于将 Objective-C 文件暴露给 Swift。如果你通过 Xcode 的 `File>New File` 菜单选项将 Swift 文件添加到应用中，Xcode 会提供创建此 header 文件的选项。你需要在该 header 文件中导入 `RCTBridgeModule.h`。

```objectivec
// CalendarModule-Bridging-Header.h
#import <React/RCTBridgeModule.h>
```

你还可以使用 `RCT_EXTERN_REMAP_MODULE` 和 `_RCT_EXTERN_REMAP_METHOD` 来更改正在导出的 module 或方法的 JavaScript 名称。更多信息请参阅 [`RCTBridgeModule`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTBridgeModule.h)。

:::note
创建第三方 module 时请注意：带有 Swift 的 Static libraries 仅在 Xcode 9 及更高版本中受支持。为了让使用 Swift 的 iOS static library（包含在 module 中）能够构建 Xcode 项目，你的主应用项目本身必须包含 Swift 代码和 bridging header。如果你的应用项目不包含任何 Swift 代码，一种解决方法是添加一个空的 .swift 文件和一个空的 bridging header。
:::

### 保留的方法名称

#### invalidate()

native module 可以通过实现 `invalidate()` 方法，在 iOS 上遵循 [RCTInvalidating](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTInvalidating.h) 协议。当 native bridge 失效时（例如：在开发模式下重新加载），[可以调用此方法](https://github.com/facebook/react-native/blob/0.62-stable/ReactCommon/turbomodule/core/platform/ios/RCTTurboModuleManager.mm#L456)。请根据需要使用此机制，为 native module 执行必要的清理工作。
