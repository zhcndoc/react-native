---
id: native-modules-ios
title: iOS 原生模块
---

import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎来到 iOS 原生模块。请先阅读 [原生模块介绍](native-modules-intro)，了解什么是原生模块。

## 创建一个日历原生模块

在下面的指南中，你将创建一个原生模块 `CalendarModule`，该模块允许你从 JavaScript 访问苹果的日历 API。最终你可以在 JavaScript 中调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，这会触发一个在原生端创建日历事件的方法。

### 设置

首先，使用 Xcode 打开 React Native 应用中的 iOS 项目。你可以在 React Native 应用中找到 iOS 项目：

<figure>
  <img src="/docs/assets/native-modules-ios-open-project.png" width="500" alt="在 Xcode 中打开 React Native 应用内 iOS 项目的截图。" />
  <figcaption>iOS 项目所在位置示意图</figcaption>
</figure>

我们推荐使用 Xcode 来编写原生代码。Xcode 专为 iOS 开发设计，可以帮助你快速解决诸如代码语法错误等小问题。

### 创建自定义原生模块文件

第一步是创建主要的自定义原生模块的头文件和实现文件。新建一个名为 `RCTCalendarModule.h` 的文件：

<figure>
  <img src="/docs/assets/native-modules-ios-add-class.png" width="500" alt="新建类 RCTCalendarModule.h 的截图。" />
  <figcaption>将自定义原生模块文件创建在与 AppDelegate 相同的文件夹内</figcaption>
</figure>

并添加如下内容：

```objectivec
//  RCTCalendarModule.h
#import <React/RCTBridgeModule.h>
@interface RCTCalendarModule : NSObject <RCTBridgeModule>
@end
```

你可以使用任何适合你构建的原生模块的类名。这里之所以命名为 `RCTCalendarModule`，是因为你正在创建一个日历功能的原生模块。由于 Objective-C 不像 Java 或 C++ 那样支持语言级的命名空间，通常约定在类名前添加一个子字符串作为前缀。这个前缀可以是应用名称的缩写或者基础设施名，比如这里的 RCT 代表 React。

正如下面所示，CalendarModule 类实现了 `RCTBridgeModule` 协议。原生模块就是实现 `RCTBridgeModule` 协议的 Objective-C 类。

接下来，开始实现原生模块。在 Xcode 中使用 Cocoa Touch Class 创建对应的实现文件 `RCTCalendarModule.m`，与头文件同目录，并添加以下代码：

```objectivec
// RCTCalendarModule.m
#import "RCTCalendarModule.h"

@implementation RCTCalendarModule

// 导出名为 RCTCalendarModule 的模块
RCT_EXPORT_MODULE();

@end
```

### 模块名称

目前你的 `RCTCalendarModule.m` 原生模块只有一个 `RCT_EXPORT_MODULE` 宏，它负责将模块导出并注册到 React Native。该宏还可以接受一个可选参数，指定模块在 JavaScript 端的访问名称。

该参数不是字符串字面量。例如：

```objectivec
// 导出名为 CalendarModuleFoo 的模块
RCT_EXPORT_MODULE(CalendarModuleFoo);
```

然后你可以在 JS 侧这样访问：

```tsx
const {CalendarModuleFoo} = ReactNative.NativeModules;
```

如果你不指定名称，JavaScript 模块名将匹配 Objective-C 类名，去掉任何 `RCT` 或 `RK` 前缀。

下面示例中调用 `RCT_EXPORT_MODULE` 而不带参数，这时模块将以 `CalendarModule` 暴露给 React Native，因为这是去掉 RCT 前缀后的 Objective-C 类名。

```objectivec
// 不传参，模块名为类名去除 RCT 前缀
RCT_EXPORT_MODULE();
```

此时 JS 中访问模块方式为：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 向 JavaScript 导出原生方法

React Native 不会自动将原生模块内的方法暴露给 JavaScript，除非显式声明。可以使用 `RCT_EXPORT_METHOD` 宏实现这个功能。用 `RCT_EXPORT_METHOD` 宏声明的方法都是异步的，其返回类型始终为 void。若需从 `RCT_EXPORT_METHOD` 返回结果给 JS，需使用回调或事件（随后介绍）。我们来为 `CalendarModule` 设置一个名为 `createCalendarEvent()` 的原生方法，它接收两个字符串类型的参数 name 和 location。参数类型选项稍后介绍。

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
}
```

:::note
请注意，在使用 TurboModules 时，除非方法依赖于 RCT 参数转换（详情见下面参数类型部分），否则不必使用 `RCT_EXPORT_METHOD` 宏。未来 React Native 会移除该宏，因此我们建议避免使用 `RCTConvert`，而改为在方法体内自行完成参数转换。
:::

在实现 `createCalendarEvent()` 方法前，先加入一条日志输出，以确保该方法能从 JavaScript 被调用。使用 React 提供的 `RCTLog` API。先在文件顶部导入对应头文件，然后添加日志调用：

```objectivec
#import <React/RCTLog.h>
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
```

### 同步方法

你可以使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD` 宏创建同步原生方法：

```objectivec
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  return [[UIDevice currentDevice] name];
}
```

该方法必须返回对象类型（id），且必须可以序列化为 JSON。也就是说，只能返回 nil 或 JSON 支持的类型（如 NSNumber、NSString、NSArray、NSDictionary）。

目前我们不推荐使用同步方法，因为同步调用会带来严重性能开销，并可能引入线程相关的错误。此外，如果使用 `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD`，你将无法使用 Google Chrome 调试器。原因是同步方法要求 JS VM 与应用共享内存，而 Chrome 调试器中的 React Native 运行在 Chrome 的 JS VM 中，其与移动设备间的通信是异步的，通过 WebSocket 实现。

### 测试已实现功能

不用实现完整功能，仅设置好基础架构即可，现在测试一下。在你的应用中选择一个合适的位置调用原生模块并调用导出的方法。

下面是一个例子组件 `NewModuleButton`，你可以放入你的应用。你可以在它的 `onPress()` 函数中调用原生模块：

```tsx
import {Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('我们将在这里调用原生模块！');
  };

  return (
    <Button
      title="点击以调用你的原生模块！"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

要访问原生模块，需先导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

随后可从 `NativeModules` 中访问 `CalendarModule`：

```tsx
const {CalendarModule} = NativeModules;
```

现在已有 `CalendarModule`，就可以调用其中的 `createCalendarEvent()` 方法了，示例如下，添加到 `NewModuleButton` 的 `onPress()`：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重建 React Native 应用，以使用最新的原生代码（包括新增模块）。在命令行中，进入 React Native 应用目录，执行以下命令：

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

### 迭代开发时的构建

当你跟随教程反复修改原生模块时，每次修改均需对应用进行原生重建，才能让最新改动在 JS 端可用。其原因在于你编写的代码属于原生层面。React Native 的 Metro bundler 可以监听 JS 文件改动并自动更新 JS 包，但不会对原生代码如此处理。如需测试最新原生模块功能，必须使用上文的命令重建应用。

### 总结✨

至此，你可以在 JavaScript 中调用 `createCalendarEvent()` 方法了。并且由于函数内已包含 `RCTLog`，你可通过 [开启应用调试模式](https://reactnative.dev/docs/debugging#chrome-developer-tools)，在 Chrome JS 控制台或 Flipper 移动端调试器中查看调用日志，确定该方法已被调用。

<figure>
  <img src="/docs/assets/native-modules-ios-logs.png" width="1000" alt="日志截图" />
  <figcaption>Flipper 中的 iOS 日志示例</figcaption>
</figure>

现在你已经成功创建了一个 iOS 原生模块，可以在 React Native 应用中从 JavaScript 调用其方法。你可以继续阅读，了解原生模块方法的参数类型、如何设置回调与 Promise 等内容。

## 超越日历原生模块

### 更优的原生模块导出方式

每次想用原生模块都从 `NativeModules` 中取出模块的写法比较繁琐。

为简化调用体验，你可以为原生模块创建一个 JavaScript 封装模块。新建一个 JavaScript 文件，命名为 `NativeCalendarModule.js`，添加如下内容：

```tsx
/**
* 该文件将原生的 CalendarModule 模块映射为 JS 模块。它提供了方法 createCalendarEvent，参数如下：

* 1. String name: 活动名称字符串
* 2. String location: 活动地点字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

该 JS 文件也是添加 JS 端功能的好地方。例如，如果你使用 TypeScript，可以在此为原生模块添加类型注解。虽然 React Native 还未支持从原生到 JS 的类型安全，但这样你的 JS 代码会是类型安全的。以后切换到类型安全的原生模块也更方便。以下是为 Calendar Module 添加类型约束的示例：

```tsx
/**
 * 该文件映射原生 CalendarModule 模块为 JS 模块。其函数 createCalendarEvent 参数如下：
 *
 * 1. String name: 活动名称字符串
 * 2. String location: 活动地点字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在其他 JavaScript 文件中，就可以这样使用该原生模块及其方法：

```tsx
import NativeCalendarModule from './NativeCalendarModule';
NativeCalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这里假设你导入 `CalendarModule` 的文件与 `NativeCalendarModule.js` 在同一目录下。请按实际情况调整相对导入路径。
:::

### 参数类型

调用原生模块方法时，React Native 会自动将 JavaScript 参数转换成 Objective-C / Swift 相应的对象。

例如，如果 Objective-C 方法接受 NSNumber，JS 端调用时应传递 number，React Native 会完成转换。下表列出支持的参数类型及其 JS 对应类型。

| Objective-C                                   | JavaScript         |
| --------------------------------------------- | ------------------ |
| NSString                                      | string, ?string    |
| BOOL                                          | boolean            |
| double                                        | number             |
| NSNumber                                      | ?number            |
| NSArray                                       | Array, ?Array      |
| NSDictionary                                  | Object, ?Object    |
| RCTResponseSenderBlock                        | Function（成功回调）|
| RCTResponseSenderBlock, RCTResponseErrorBlock | Function（失败回调）|
| RCTPromiseResolveBlock, RCTPromiseRejectBlock | Promise            |

:::info
以下类型当前支持，但将在 TurboModules 中不再支持，请避免使用：

- Function（失败回调）-> RCTResponseErrorBlock
- Number -> NSInteger
- Number -> CGFloat
- Number -> float
:::

对于 iOS 端，原生模块方法的参数还可以使用 `RCTConvert` 类支持的任意类型（详见 [RCTConvert](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTConvert.h) 了解支持范围）。RCTConvert 辅助函数接受 JSON 作为输入，将其映射为本地 Objective-C 类型或类。

### 导出常量

原生模块可通过重写 `constantsToExport()` 方法导出常量。下面重写了 `constantsToExport()`，返回一个包含默认事件名称的字典，可在 JS 端这样访问：

```objectivec
- (NSDictionary *)constantsToExport
{
 return @{ @"DEFAULT_EVENT_NAME": @"New Event" };
}
```

JS 调用示例：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

技术上讲，可以直接从 `NativeModule` 对象访问 `constantsToExport()` 导出的常量。但此做法在 TurboModules 中将不被支持，我们建议社区改用上述方法，以避免后续升级带来麻烦。

:::note
常量仅在模块初始化时导出，运行时修改 `constantsToExport()` 的返回值不会影响 JS 端。
:::

若你在 iOS 端实现了 `constantsToExport()`，应当同时实现 `+ requiresMainQueueSetup` 方法，告知 React Native 是否需在主线程（JS 代码运行前）初始化模块。否则会出现警告：将来模块可能在线程池线程初始化，除非显式返回值表明不需要主线程。若模块不涉及 UIKit，则应返回 NO。

### 回调

原生模块支持特殊的回调参数类型，用于异步向 JavaScript 传递数据，也可用于原生端异步执行 JS。

iOS 端使用 `RCTResponseSenderBlock` 类型存放回调。下面为 `createCalendarEventMethod()` 添加了回调参数 `myCallback`：

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)
```

然后你可以在原生方法体内调用回调，将想传递给 JS 的结果数组作为参数传入。注意，`RCTResponseSenderBlock` 只接受一个参数——即传递给 JS 回调的参数数组。如下示例中返回提前创建事件的 ID。

:::info
重要提示：回调不会在原生函数执行结束后立刻调用，通信是异步的。
:::

```objectivec
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
 NSInteger eventId = ...
 callback(@[@(eventId)]);

 RCTLogInfo(@"Pretending to create an event %@ at %@", title, location);
}
```

对应 JS 调用示例：

```tsx
const onSubmit = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    '04-12-2020',
    eventId => {
      console.log(`创建了一个新事件，id 为 ${eventId}`);
    },
  );
};
```

原生模块应当只调用回调一次，但可以把回调保留起来稍后调用。该模式常用于封装带有委托的 iOS API，可参考 [`RCTAlertManager`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/CoreModules/RCTAlertManager.mm)。若不调用回调，可能会造成内存泄漏。

回调错误处理有两种方案。第一种遵循 Node 风格约定，传入回调数组的第一个参数作为错误对象：

```objectivec
RCT_EXPORT_METHOD(createCalendarEventCallback:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
  NSNumber *eventId = [NSNumber numberWithInt:123];
  callback(@[[NSNull null], eventId]);
}
```

在 JS 中检查第一个参数是否为错误：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`发现错误！${error}`);
      }
      console.log(`返回的事件 id ${eventId}`);
    },
  );
};
```

另一种方案是使用两个回调参数：onFailure 和 onSuccess。

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

JS 代码使用示例：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEventCallback(
    'testName',
    'testLocation',
    error => {
      console.error(`发现错误！${error}`);
    },
    eventId => {
      console.log(`返回的事件 id ${eventId}`);
    },
  );
};
```

想传递错误对象到 JS，建议使用 [`RCTUtils.h`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTUtils.h) 中的 `RCTMakeError`。目前它仅传递一个形如 Error 的字典，未来计划自动生成 JS 原生 Error 对象。你也可以使用 `RCTResponseErrorBlock` 类型参数，它用于错误回调，接收 `NSError *` 对象。但该参数类型在 TurboModules 中将不被支持。

### Promise

原生模块还支持返回 Promise，这极大简化 JS 编写，特别是配合 ES2016 的 `async/await`。当原生模块方法最后有两个参数，`RCTPromiseResolveBlock` 和 `RCTPromiseRejectBlock`，对应 JS 方法会返回 Promise。

将上述回调方式改成 Promise 写法示例：

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

对应 JS 方法返回 Promise，因此可以用 `await` 等待结果：

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'my house',
    );
    console.log(`创建了一个新事件，id 为 ${eventId}`);
  } catch (e) {
    console.error(e);
  }
};
```

### 向 JavaScript 发送事件

原生模块能主动向 JS 发送事件，无需 JS 触发调用。例如，你可能想通知 JS 原生 iOS 日历即将发生某事件提醒。推荐方式是继承 `RCTEventEmitter`，实现 `supportedEvents`，并调用自身的 `sendEventWithName` 方法发送事件。

更新头文件，导入 `RCTEventEmitter` 并继承：

```objectivec
//  CalendarModule.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CalendarModule : RCTEventEmitter <RCTBridgeModule>
@end
```

JS 侧通过创建 `NativeEventEmitter` 实例来订阅事件。

为避免在无监听者时发送事件耗费资源，并优化模块负载（如取消订阅上游通知或暂停后台任务），可在 `RCTEventEmitter` 子类中重写 `startObserving` 和 `stopObserving`：

```objectivec
@implementation CalendarModule
{
  bool hasListeners;
}

// 当模块第一个监听者添加时调用。
-(void)startObserving {
    hasListeners = YES;
    // 这里可以设置上游监听或启动后台任务
}

// 当模块最后一个监听者移除或模块销毁时调用。
-(void)stopObserving {
    hasListeners = NO;
    // 取消上游监听，停止后台任务
}

- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  if (hasListeners) {// 只有有人监听时发送事件
    [self sendEventWithName:@"EventReminder" body:@{@"name": eventName}];
  }
}
```

### 线程

除非原生模块明确提供自己的调度队列（method queue），否则不应对调用线程作任何假设。目前，如果模块未提供自己的队列，React Native 会为其创建专用 GCD 队列并在其上调用方法。但这一实现细节未来可能改变。

若需明确指定队列，重写模块中的 `(dispatch_queue_t)methodQueue` 方法。例如，某些只允许在主线程调用的 iOS API，应指定主队列：

```objectivec
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
```

同理，若某操作可能耗时较长，模块可指定自己的队列运行，避免阻塞默认队列。当前，React Native 会为模块提供独立队列，但这不是保证。若不自行定义，后续更新可能导致长耗时任务阻塞其它模块的异步调用。

如 `RCTAsyncLocalStorage` 模块创建单独队列，防止磁盘访问等待阻塞 React 队列：

```objectivec
- (dispatch_queue_t)methodQueue
{
 return dispatch_queue_create("com.facebook.React.AsyncLocalStorageQueue", DISPATCH_QUEUE_SERIAL);
}
```

该 `methodQueue` 对所有模块方法共享。如果某一方法需单独队列，可在方法内使用 `dispatch_async` 调度至其他队列，不影响其他方法：

```objectivec
RCT_EXPORT_METHOD(doSomethingExpensive:(NSString *)param callback:(RCTResponseSenderBlock)callback)
{
 dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
   // 在后台线程执行耗时代码
   ...
   // 回调可在任意线程调用
   callback(@[...]);
 });
}
```

:::info[Sharing dispatch queues between modules]
The `methodQueue` method will be called once when the module is initialized, and then retained by React Native, so there is no need to keep a reference to the queue yourself, unless you wish to make use of it within your module. However, if you wish to share the same queue between multiple modules then you will need to ensure that you retain and return the same queue instance for each of them.
:::

### 依赖注入

React Native 会自动创建和初始化注册的原生模块。但你可能希望自行创建并初始化模块实例，进行例如依赖注入等操作。

这可以通过创建一个实现了 `RCTBridgeDelegate` 协议的类，利用该委托初始化 `RCTBridge` 并用该桥初始化 `RCTRootView` 来实现：

```objectivec
id<RCTBridgeDelegate> moduleInitialiser = [[classThatImplementsRCTBridgeDelegate alloc] init];

RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:moduleInitialiser launchOptions:nil];

RCTRootView *rootView = [[RCTRootView alloc]
                        initWithBridge:bridge
                            moduleName:kModuleName
                     initialProperties:nil];
```

### 导出 Swift

Swift 不支持宏，因此在 React Native 中导出 Swift 原生模块和方法需要更多配置，但原理类似。假设你有一个 Swift 类 `CalendarModule`：

```swift
// CalendarModule.swift

@objc(CalendarModule)
class CalendarModule: NSObject {

 @objc(addEvent:location:date:)
 func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
   // date 参数已可使用
 }

 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }

}
```

:::note
必须加上 `@objc` 标记，确保类和方法被正确导出到 Objective-C 运行时。
:::

然后创建一个私有实现文件，向 React Native 注册模块信息：

```objectivec
// CalendarModuleBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)

@end
```

对于刚接触 Swift 和 Objective-C 混合的开发者，项目中混合使用两者时，还需要建立一个桥接头文件，暴露 Objective-C 头文件给 Swift 调用。Xcode 在你通过 `File > New File` 添加 Swift 文件时会提醒你创建此文件。桥接头中导入 `RCTBridgeModule.h` 即可。

```objectivec
// CalendarModule-Bridging-Header.h
#import <React/RCTBridgeModule.h>
```

你也可以使用 `RCT_EXTERN_REMAP_MODULE` 和 `_RCT_EXTERN_REMAP_METHOD` 来改变导出模块或方法在 JS 侧的名称。详见 [`RCTBridgeModule`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTBridgeModule.h)。

:::note
第三方模块发布重要提示：Swift 静态库仅在 Xcode 9 及更高版本支持。如你在模块中包含的 iOS 静态库用 Swift，主应用项目也必须包含 Swift 代码和桥接头文件。若无 Swift 代码，可新建一个空的 .swift 文件和空桥接头作为权宜之计。
:::

### 保留方法名

#### invalidate()

在 iOS 上，原生模块可实现 [RCTInvalidating](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTInvalidating.h) 协议，通过实现 `invalidate()` 方法处理模块无效化时的清理。该方法会在原生桥无效（例如开发模式重新加载）时调用。请根据需要使用此机制完成模块清理工作。