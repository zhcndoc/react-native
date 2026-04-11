---
id: native-modules-ios
title: iOS 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎使用 iOS 原生模块。请先阅读 [原生模块简介](native-modules-intro) 以了解什么是原生模块。

## 创建日历原生模块

在以下指南中，你将创建一个原生模块 `CalendarModule`，它将允许你从 JavaScript 访问 Apple 的日历 API。最后你将能够从 JavaScript 调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`， invoking a native method that creates a calendar event.（调用一个创建日历事件的原生方法。）

### 设置

要开始，请在 Xcode 中打开 React Native 应用内的 iOS 项目。你可以在 React Native 应用中的此处找到你的 iOS 项目：

<figure>
  <img src="/docs/assets/native-modules-ios-open-project.png" width="500" alt="在 Xcode 中打开 React Native 应用内 iOS 项目的图片。" />
  <figcaption>你可以找到 iOS 项目的位置图片</figcaption>
</figure>

我们建议使用 Xcode 编写你的原生代码。Xcode 是为 iOS 开发构建的，使用它将帮助你快速解决较小的错误，如代码语法。

### 创建自定义原生模块文件

第一步是创建我们的主要自定义原生模块头文件和实现文件。创建一个名为 `RCTCalendarModule.h` 的新文件

<figure>
  <img src="/docs/assets/native-modules-ios-add-class.png" width="500" alt="创建名为 RCTCalendarModule.h 的类的图片。" />
  <figcaption>在与 AppDelegate 相同的文件夹中创建自定义原生模块文件的图片</figcaption>
</figure>

并将以下内容添加到其中：

```objectivec
//  RCTCalendarModule.h
#import <React/RCTBridgeModule.h>
@interface RCTCalendarModule : NSObject <RCTBridgeModule>
@end

```

你可以使用任何适合你所构建原生模块的名称。将类命名为 `RCTCalendarModule`，因为你正在创建一个日历原生模块。由于 ObjC 不像 Java 或 C++ 那样具有语言级别的命名空间支持，惯例是在类名前加上一个子字符串。这可以是你的应用程序名称或你的基础设施名称的缩写。在此示例中，RCT 指的是 React。

如下所示，CalendarModule 类实现了 `RCTBridgeModule` 协议。原生模块是实现 `RCTBridgeModule` 协议的 Objective-C 类。

接下来，让我们开始实现原生模块。在 xcode 中使用 cocoa touch 类创建相应的实现文件 `RCTCalendarModule.m`，放在同一文件夹中并包含以下内容：

```objectivec
// RCTCalendarModule.m
#import "RCTCalendarModule.h"

@implementation RCTCalendarModule

// 导出一个名为 RCTCalendarModule 的模块
RCT_EXPORT_MODULE();

@end

```

### 模块名称

目前，你的 `RCTCalendarModule.m` 原生模块仅包含一个 `RCT_EXPORT_MODULE` 宏，它导出并将原生模块类与 React Native 注册。`RCT_EXPORT_MODULE` 宏还接受一个可选参数，指定该模块在 JavaScript 代码中可访问的名称。

此参数不是字符串字面量。在下面的示例中，传递的是 `RCT_EXPORT_MODULE(CalendarModuleFoo)`，而不是 `RCT_EXPORT_MODULE("CalendarModuleFoo")`。

```objectivec
// 导出一个名为 CalendarModuleFoo 的模块
RCT_EXPORT_MODULE(CalendarModuleFoo);
```

然后可以在 JS 中这样访问原生模块：

```tsx
const {CalendarModuleFoo} = ReactNative.NativeModules;
```

如果你不指定名称，JavaScript 模块名称将与 Objective-C 类名称匹配，并移除任何 "RCT" 或 "RK" 前缀。

让我们遵循下面的示例，调用不带任何参数的 `RCT_EXPORT_MODULE`。因此，该模块将使用名称 `CalendarModule` 暴露给 React Native，因为那是 Objective-C 类名称，移除了 RCT。

```objectivec
// 不传入名称这将导出原生模块名称为去掉"RCT"的 Objective-C 类名称
RCT_EXPORT_MODULE();
```

然后可以在 JS 中这样访问原生模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 向 JavaScript 导出原生方法

除非明确告知，否则 React Native 不会将原生模块中的任何方法暴露给 JavaScript。这可以使用 `RCT_EXPORT_METHOD` 宏来完成。写在 `RCT_EXPORT_METHOD` 宏中的方法是异步的，因此返回类型始终为 void。为了将结果从 `RCT_EXPORT_METHOD` 方法传递给 JavaScript，你可以使用回调或触发事件（下文将涵盖）。让我们继续使用 `RCT_EXPORT_METHOD` 宏为我们的 `CalendarModule` 原生模块设置一个原生方法。将其称为 `createCalendarEvent()`，目前让它接收 name 和 location 参数作为字符串。参数类型选项将在稍后涵盖。

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
}
```

:::note
请注意，除非你的方法依赖于 RCT 参数转换（见下面的参数类型），否则使用 TurboModules 时将不需要 `RCT_EXPORT_METHOD` 宏。最终，React Native 将移除 `RCT_EXPORT_MACRO`，所以我们不建议人们使用 `RCTConvert`。相反，你可以在方法体内进行参数转换。
:::

在你构建 `createCalendarEvent()` 方法的功能之前，在方法中添加一个控制台日志，以便你可以确认它已从 React Native 应用程序中的 JavaScript 调用。使用 React 的 `RCTLog` API。让我们在文件顶部导入该头文件，然后添加日志调用。

```objectivec
#import <React/RCTLog.h>
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
```

### 同步方法

你可以使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD` 创建同步原生方法。

```objectivec
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
return [[UIDevice currentDevice] name];
}
```

此方法的返回类型必须是对象类型 (id) 并且应该可序列化为 JSON。这意味着钩子只能返回 nil 或 JSON 值（例如 NSNumber, NSString, NSArray, NSDictionary）。

目前，我们不建议使用同步方法，因为同步调用方法可能会产生严重的性能惩罚并引入与线程相关的错误到你的原生模块。此外，请注意，如果你选择使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD`，你的应用将不再能使用 Google Chrome 调试器。这是因为同步方法要求 JS 虚拟机与应用共享内存。对于 Google Chrome 调试器，React Native 运行在 Google Chrome 中的 JS 虚拟机内，并通过 WebSockets 与移动设备异步通信。

### 测试你构建的内容

此时，你已经在 iOS 中为原生模块设置了基本框架。通过在 JavaScript 中访问原生模块并调用其导出的方法来测试一下。

在你的应用程序中找到一个地方，你想要添加对原生模块 `createCalendarEvent()` 方法的调用。下面是一个组件 `NewModuleButton` 的示例，你可以将其添加到你的应用中。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用原生模块。

```tsx
import React from 'react';
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

为了从 JavaScript 访问你的原生模块，你需要首先从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后你可以从 `NativeModules` 访问 `CalendarModule` 原生模块。

```tsx
const {CalendarModule} = NativeModules;
```

现在你已经有了 CalendarModule 原生模块，你可以调用你的原生方法 `createCalendarEvent()`。下面它被添加到 `NewModuleButton` 中的 `onPress()` 方法：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重新构建 React Native 应用，以便你可以使用最新的原生代码（包含你的新原生模块！）。在命令行中，在 react native 应用程序所在的位置，运行以下命令：

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

当你通过这些指南并迭代你的原生模块时，你将需要对本机应用程序进行本机重新构建，以便从 JavaScript 访问你的最新更改。这是因为你编写的代码位于应用程序的本机部分。虽然 React Native 的 metro 打包器可以监视 JavaScript 中的更改并为你即时重建 JS  bundle，但它不会为本机代码这样做。因此，如果你想测试最新的本机更改，你需要使用上述命令重新构建。

### 回顾✨

你现在应该能够在 JavaScript 中调用原生模块上的 `createCalendarEvent()` 方法了。由于你在函数中使用了 `RCTLog`，你可以通过[在应用中启用调试模式](https://reactnative.dev/docs/debugging#chrome-developer-tools) 并查看 Chrome 中的 JS 控制台或移动应用调试器 Flipper 来确认你的原生方法正在被调用。你应该每次调用原生模块方法时看到你的 `RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);` 消息。

<figure>
  <img src="/docs/assets/native-modules-ios-logs.png" width="1000" alt="日志图片。" />
  <figcaption>Flipper 中 iOS 日志的图片</figcaption>
</figure>

此时，你已经创建了一个 iOS 原生模块，并在 React Native 应用程序中的 JavaScript 上调用了它的一个方法。你可以继续阅读以了解更多内容，例如你的原生模块方法接受什么参数类型，以及如何在原生模块中设置回调和 promise。

## 超越日历原生模块

### 更好的原生模块导出

像上面那样从 `NativeModules` 中提取原生模块进行导入有点笨拙。

为了让你的原生模块的使用者不需要每次访问模块时都这样做，你可以为模块创建一个 JavaScript 包装器。创建一个名为 NativeCalendarModule.js 的新 JavaScript 文件，内容如下：

```tsx
/**
* 这将原生 CalendarModule 模块暴露为 JS 模块。它有一个
* 函数 'createCalendarEvent'，接受以下参数：

* 1. String name：表示事件名称的字符串
* 2. String location：表示事件位置的字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也是你添加任何 JavaScript 端功能的好地方。例如，如果你使用像 TypeScript 这样的类型系统，你可以在此处为你的原生模块添加类型注解。虽然 React Native 尚未支持原生到 JS 的类型安全，但有了这些类型注解，你所有的 JS 代码都将具有类型安全。这些注解还将使你更容易在以后切换到类型安全的原生模块。下面是为日历模块添加类型安全的示例：

```tsx
/**
 * 这将原生 CalendarModule 模块暴露为 JS 模块。它有一个
 * 函数 'createCalendarEvent'，接受以下参数：
 *
 * 1. String name：表示事件名称的字符串
 * 2. String location：表示事件位置的字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在你的其他 JavaScript 文件中，你可以访问原生模块并调用其方法，如下所示：

```tsx
import NativeCalendarModule from './NativeCalendarModule';
NativeCalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这假设你导入 `CalendarModule` 的位置与 `NativeCalendarModule.js` 处于相同的层级结构中。请根据需要更新相对导入。
:::

### 参数类型

当在 JavaScript 中调用原生模块方法时，React Native 会将参数从 JS 对象转换为其 Objective-C/Swift 对象对应物。例如，如果你的 Objective-C 原生模块方法接受一个 NSNumber，那么在 JS 中你需要用一个数字调用该方法。React Native 将为你处理转换。下面是原生模块方法支持的参数类型列表及其映射的 JavaScript 等效类型。

| Objective-C                                   | JavaScript         |
| --------------------------------------------- | ------------------ |
| NSString                                      | string, ?string    |
| BOOL                                          | boolean            |
| double                                        | number             |
| NSNumber                                      | ?number            |
| NSArray                                       | Array, ?Array      |
| NSDictionary                                  | Object, ?Object    |
| RCTResponseSenderBlock                        | 函数（成功） |
| RCTResponseSenderBlock, RCTResponseErrorBlock | 函数（失败） |
| RCTPromiseResolveBlock, RCTPromiseRejectBlock | Promise            |

:::info
以下类型目前支持但在 TurboModules 中将不再支持。请避免使用它们。

- 函数（失败） -> RCTResponseErrorBlock
- Number -> NSInteger
- Number -> CGFloat
- Number -> float
  :::

对于 iOS，你还可以使用 `RCTConvert` 类支持的任何参数类型编写原生模块方法（有关支持的内容详情，请参阅 [RCTConvert](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTConvert.h)）。RCTConvert 辅助函数都接受一个 JSON 值作为输入，并将其映射到原生 Objective-C 类型或类。

### 导出常量

原生模块可以通过重写原生方法 `constantsToExport()` 来导出常量。下面重写了 `constantsToExport()`，并返回一个包含默认事件名称属性的 Dictionary，你可以在 JavaScript 中这样访问：

```objectivec
- (NSDictionary *)constantsToExport
{
 return @{ @"DEFAULT_EVENT_NAME": @"New Event" };
}
```

然后可以通过在 JS 中调用原生模块上的 `getConstants()` 来访问常量，如下所示：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从 `NativeModule` 对象访问 `constantsToExport()` 中导出的常量。这在 TurboModules 中将不再支持，因此我们鼓励社区切换到上述方法，以避免以后必要的迁移。

:::note
常量仅在初始化时导出，因此如果你在运行时更改 `constantsToExport()` 的值，不会影响 JavaScript 环境。
:::

对于 iOS，如果你重写了 `constantsToExport()`，那么你还应该实现 `+ requiresMainQueueSetup` 以让 React Native 知道你的模块是否需要在任何 JavaScript 代码执行之前在主线程上初始化。否则，你将看到一条警告，表明将来你的模块可能会在后台线程上初始化，除非你使用 `+ requiresMainQueueSetup:` 显式选择退出。如果你的模块不需要访问 UIKit，那么你应该用 NO 响应 `+ requiresMainQueueSetup`。

### 回调

原生模块还支持一种独特的参数类型——回调。回调用于将数据从 Objective-C 传递给 JavaScript 以用于异步方法。它们还可用于从原生端异步执行 JS。

对于 iOS，回调是使用 `RCTResponseSenderBlock` 类型实现的。下面将回调参数 `myCallBack` 添加到 `createCalendarEventMethod()`：

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)

```

然后你可以在原生函数中调用回调，将你想要传递给 JavaScript 的任何结果放在数组中提供。请注意，`RCTResponseSenderBlock` 只接受一个参数——一个传递给 JavaScript 回调的参数数组。下面你将传回在早期调用中创建的事件的 ID。

:::info
重要的是要强调，回调不是在原生函数完成后立即调用的——请记住通信是异步的。
:::

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
 NSInteger eventId = ...
 callback(@[@(eventId)]);

 RCTLogInfo(@"Pretending to create an event %@ at %@", title, location);
}

```

然后可以使用以下内容在 JavaScript 中访问此方法：

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

原生模块应该只调用其回调一次。但是，它可以存储回调并在以后调用它。此模式通常用于包装需要委托的 iOS API——请参阅 [`RCTAlertManager`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/CoreModules/RCTAlertManager.mm) 示例。如果从未调用回调，则会泄漏一些内存。

使用回调进行错误处理有两种方法。第一种是遵循 Node 的约定，将传递给回调数组的第一个参数视为错误对象。

```objectivec
RCT_EXPORT_METHOD(createCalendarEventCallback:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
  NSNumber *eventId = [NSNumber numberWithInt:123];
  callback(@[[NSNull null], eventId]);
}
```

在 JavaScript 中，你可以检查第一个参数以查看是否传递了错误：

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

另一个选项是使用两个单独的回调：onFailure 和 onSuccess。

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

然后在 JavaScript 中你可以为错误和成功响应添加单独的回调：

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

如果你想将类似错误的对象传递给 JavaScript，请使用 [`RCTUtils.h.`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTUtils.h) 中的 `RCTMakeError`。目前这只会将一个错误形状的字典传递给 JavaScript，但 React Native 旨在将来自动生成真正的 JavaScript Error 对象。你还可以提供一个 `RCTResponseErrorBlock` 参数，该参数用于错误回调并接受一个 `NSError \* object`。请注意，此参数类型在 TurboModules 中将不受支持。

### Promise

原生模块也可以履行一个 promise，这可以简化你的 JavaScript，特别是使用 ES2016 的 `async/await` 语法时。当原生模块方法的最后一个参数是 `RCTPromiseResolveBlock` 和 `RCTPromiseRejectBlock` 时，其对应的 JS 方法将返回一个 JS Promise 对象。

将上述代码重构为使用 promise 而不是回调如下所示：

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

此方法的 JavaScript 对应部分返回一个 Promise。这意味着你可以在异步函数中使用 `await` 关键字来调用它并等待其结果：

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

原生模块可以在不被直接调用的情况下向 JavaScript 发送事件信号。例如，你可能想要向 JavaScript 发送信号，提醒原生 iOS 日历应用中的日历事件即将发生。执行此操作的首选方法是子类化 `RCTEventEmitter`，实现 `supportedEvents` 并调用 self `sendEventWithName`：

更新你的头类以导入 `RCTEventEmitter` 并子类化 `RCTEventEmitter`：

```objectivec
//  CalendarModule.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CalendarModule : RCTEventEmitter <RCTBridgeModule>
@end

```

JavaScript 代码可以通过围绕你的模块创建一个新的 `NativeEventEmitter` 实例来订阅这些事件。

如果在没有监听器时发出事件，你将收到警告，表明不必要地消耗了资源。为了避免这种情况，并优化模块的工作负载（例如，通过取消订阅上游通知或暂停后台任务），你可以在 `RCTEventEmitter` 子类中重写 `startObserving` 和 `stopObserving`。

```objectivec
@implementation CalendarModule
{
  bool hasListeners;
}

// 当此模块的第一个监听器被添加时将调用。
-(void)startObserving {
    hasListeners = YES;
    // 根据需要设置任何上游监听器或后台任务
}

// 当此模块的最后一个监听器被移除时，或在 dealloc 时将调用。
-(void)stopObserving {
    hasListeners = NO;
    // 移除上游监听器，停止不必要的后台任务
}

- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  if (hasListeners) {// 仅在有监听时发送事件
    [self sendEventWithName:@"EventReminder" body:@{@"name": eventName}];
  }
}

```

### 线程

除非原生模块提供自己的方法队列，否则它不应该对其被调用的线程做任何假设。目前，如果原生模块不提供方法队列，React Native 将为其创建一个单独的 GCD 队列并在其中调用其方法。请注意，这是一个实现细节，可能会发生变化。如果你想显式地为原生模块提供方法队列，请重写原生模块中的 `(dispatch_queue_t) methodQueue` 方法。例如，如果它需要使用仅限主线程的 iOS API，它应该通过以下方式指定：

```objectivec
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
```

类似地，如果一个操作可能需要很长时间才能完成，原生模块可以指定自己的队列来运行操作。同样，目前 React Native 将为你的原生模块提供一个单独的方法队列，但这是你不应该依赖的实现细节。如果你不提供自己的方法队列，将来，你的原生模块的长期运行操作可能会最终阻塞在其他无关原生模块上执行的异步调用。例如，这里的 `RCTAsyncLocalStorage` 模块创建了自己的队列，这样 React 队列就不会被等待可能缓慢的磁盘访问阻塞。

```objectivec
- (dispatch_queue_t)methodQueue
{
 return dispatch_queue_create("com.facebook.React.AsyncLocalStorageQueue", DISPATCH_QUEUE_SERIAL);
}
```

指定的 `methodQueue` 将由模块中的所有方法共享。如果你只有一个方法是长期运行的（或者由于某种原因需要在与其他方法不同的队列上运行），你可以在方法内部使用 `dispatch_async` 在另一个队列上执行该特定方法的代码，而不影响其他方法：

```objectivec
RCT_EXPORT_METHOD(doSomethingExpensive:(NSString *)param callback:(RCTResponseSenderBlock)callback)
{
 dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
   // 在后台线程调用长期运行的代码
   ...
   // 你可以从任何线程/队列调用回调
   callback(@[...]);
 });
}

```

:::info 在模块之间共享 dispatch 队列
`methodQueue` 方法将在模块初始化时调用一次，然后由 React Native 保留，因此无需自己保留对队列的引用，除非你希望在模块内使用它。但是，如果你希望在多个模块之间共享同一个队列，那么你需要确保为每个模块保留并返回相同的队列实例。
:::

### 依赖注入

React Native 将自动创建和初始化任何注册的原生模块。但是，你可能希望创建和初始化自己的模块实例，例如，注入依赖项。

你可以通过创建一个实现 `RCTBridgeDelegate` 协议的类，使用委托作为参数初始化 `RCTBridge`，并使用初始化的桥接初始化 `RCTRootView` 来实现这一点。

```objectivec
id<RCTBridgeDelegate> moduleInitialiser = [[classThatImplementsRCTBridgeDelegate alloc] init];

RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:moduleInitialiser launchOptions:nil];

RCTRootView *rootView = [[RCTRootView alloc]
                        initWithBridge:bridge
                            moduleName:kModuleName
                     initialProperties:nil];
```

### 导出 Swift

Swift 不支持宏，因此在 React Native 中将原生模块及其方法暴露给 JavaScript 需要更多的设置。但是，它的工作方式相对相同。假设你有相同的 `CalendarModule` 但是作为 Swift 类：

```swift
// CalendarModule.swift

@objc(CalendarModule)
class CalendarModule: NSObject {

 @objc(addEvent:location:date:)
 func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
   // Date 已准备好使用！
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }

}
```

:::note
重要的是使用 `@objc` 修饰符以确保类和函数正确导出到 Objective-C 运行时。
:::

然后创建一个私有实现文件，将所需信息注册到 React Native：

```objectivec
// CalendarModuleBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)

@end
```

对于那些刚接触 Swift 和 Objective-C 的人来说，每当你在 iOS 项目中 [混合使用这两种语言](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html) 时，你还需要一个额外的桥接文件，称为桥接头文件，以将 Objective-C 文件暴露给 Swift。如果你通过 Xcode `File>New File` 菜单选项将 Swift 文件添加到应用中，Xcode 将为你提供创建此头文件的选项。你需要在此头文件中导入 `RCTBridgeModule.h`。

```objectivec
// CalendarModule-Bridging-Header.h
#import <React/RCTBridgeModule.h>
```

你也可以使用 `RCT_EXTERN_REMAP_MODULE` 和 `_RCT_EXTERN_REMAP_METHOD` 来更改你导出的模块或方法的 JavaScript 名称。有关更多信息，请参阅 [`RCTBridgeModule`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTBridgeModule.h)。

:::note
制作第三方模块时的重要事项：带有 Swift 的静态库仅在 Xcode 9 及更高版本中支持。为了在使用模块中包含的 iOS 静态库中的 Swift 时构建 Xcode 项目，你的主应用项目必须包含 Swift 代码和桥接头文件。如果你的应用项目不包含任何 Swift 代码，解决方法可以是单个空的 .swift 文件和空的桥接头文件。
:::

### 保留方法名

#### invalidate()

原生模块可以通过在 iOS 上实现 `invalidate()` 方法来符合 [RCTInvalidating](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTInvalidating.h) 协议。当原生桥接失效时（即：开发模式重载），此方法 [可以被调用](https://github.com/facebook/react-native/blob/0.62-stable/ReactCommon/turbomodule/core/platform/ios/RCTTurboModuleManager.mm#L456)。请根据需要此机制为你的原生模块执行所需的清理工作。