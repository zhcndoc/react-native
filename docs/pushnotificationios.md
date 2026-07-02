---
id: pushnotificationios
title: '🗑️ PushNotificationIOS'
---

:::warning[已弃用]
请改用 [社区包](https://reactnative.directory/?search=notification) 之一。
:::

<div className="banner-native-code-required">
  <h3>仅适用于包含原生代码的项目</h3>
  <p>以下部分仅适用于暴露了原生代码的项目。如果你使用的是托管的 Expo 工作流，请参阅 Expo 文档中的 <a href="https://docs.expo.dev/versions/latest/sdk/notifications/">通知</a> 指南，以获取合适的替代方案。</p>
</div>

处理应用的通知，包括调度和权限。

---

## 开始

要启用推送通知，先在 [Apple 配置你的通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server) 以及你的服务端系统中进行设置。

然后，在你的项目中 [启用远程通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038)。这将自动启用所需的设置。

### 启用 `register` 事件支持

在你的 `AppDelegate.m` 中添加：

```objectivec
#import <React/RCTPushNotificationManager.h>
```

然后按如下方式实现，以处理远程通知注册事件：

```objectivec
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 // 这将触发 PushNotificationIOS 上的 'register' 事件
 [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 // 这将触发 PushNotificationIOS 上的 'registrationError' 事件
 [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
```

### 处理通知

你需要在 `AppDelegate` 中实现 `UNUserNotificationCenterDelegate`：

```objectivec
#import <UserNotifications/UserNotifications.h>

@interface YourAppDelegate () <UNUserNotificationCenterDelegate>
@end
```

在应用启动时设置 delegate：

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ...
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
}
```

#### 前台通知

实现 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 来处理应用处于前台时到达的通知。使用 completionHandler 来决定通知是否会展示给用户，并相应地通知 `RCTPushNotificationManager`：

```objectivec
// 当通知投递到前台应用时调用。
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // 这将触发 PushNotificationIOS 上的 'notification' 和 'localNotification' 事件
  [RCTPushNotificationManager didReceiveNotification:notification];
  // 决定是否以及如何向用户显示该通知
  completionHandler(UNNotificationPresentationOptionNone);
}
```

#### 后台通知

实现 `userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:` 来处理用户点击通知的情况，通常用于用户点击打开应用的后台通知。不过，如果你已在 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 中将前台通知设置为显示，那么当用户点击前台通知时也会调用此方法。在这种情况下，你应只在这些回调中的一个里通知 `RCTPushNotificationManager`。

如果被点击的通知导致应用启动，则调用 `setInitialNotification:`。如果该通知之前未在 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 中处理过，也请同时调用 `didReceiveNotification:`：

```objectivec
- (void)  userNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void (^)(void))completionHandler
{
  // 如果通知是通过点击启动应用的，则此条件成立
  if ([response.actionIdentifier isEqualToString:UNNotificationDefaultActionIdentifier]) {
    // 允许在 JS 端通过 getInitialNotification() 获取该通知
    [RCTPushNotificationManager setInitialNotification:response.notification];
  }
  // 这将触发 PushNotificationIOS 上的 'notification' 和 'localNotification' 事件
  [RCTPushNotificationManager didReceiveNotification:response.notification];
  completionHandler();
}
```

---

# 参考

## 方法

### `presentLocalNotification()`

```tsx
static presentLocalNotification(details: PresentLocalNotificationDetails);
```

安排一个本地通知立即显示。

**参数：**

| 名称    | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| details | object | 是   | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle` : 显示为通知提示标题的文本。
- `alertBody` : 显示在通知提示中的消息。
- `userInfo` : 包含附加通知数据的对象（可选）。
- `category` : 此通知的类别，交互式通知需要该项（可选）。例如，带有 Reply 或 Like 等附加操作的通知。
- `applicationIconBadgeNumber` : 显示在应用图标角标上的数字。此属性的默认值为 0，表示不显示角标（可选）。
- `isSilent` : 如果为 true，通知将不带声音显示（可选）。
- `soundName` : 通知触发时播放的声音（可选）。
- `alertAction` : 已弃用。用于 iOS 旧版 `UILocalNotification`。

---

### `scheduleLocalNotification()`

```tsx
static scheduleLocalNotification(details: ScheduleLocalNotificationDetails);
```

安排一个本地通知在未来显示。

**参数：**

| 名称    | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| details | object | 是   | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle` : 显示为通知提示标题的文本。
- `alertBody` : 显示在通知提示中的消息。
- `fireDate` : 通知将被触发的时间。使用 `fireDate` 或 `fireIntervalSeconds` 之一来安排通知，其中 `fireDate` 优先。
- `fireIntervalSeconds` : 从现在起多少秒后显示通知。
- `userInfo` : 包含附加通知数据的对象（可选）。
- `category` : 此通知的类别，交互式通知需要该项（可选）。例如，带有 Reply 或 Like 等附加操作的通知。
- `applicationIconBadgeNumber` : 显示在应用图标角标上的数字。此属性的默认值为 0，表示不显示角标（可选）。
- `isSilent` : 如果为 true，通知将不带声音显示（可选）。
- `soundName` : 通知触发时播放的声音（可选）。
- `alertAction` : 已弃用。用于 iOS 旧版 `UILocalNotification`。
- `repeatInterval` : 已弃用。请改用 `fireDate` 或 `fireIntervalSeconds`。

---

### `cancelAllLocalNotifications()`

```tsx
static cancelAllLocalNotifications();
```

取消所有已安排的本地通知。

---

### `removeAllDeliveredNotifications()`

```tsx
static removeAllDeliveredNotifications();
```

从通知中心移除所有已送达的通知。

---

### `getDeliveredNotifications()`

```tsx
static getDeliveredNotifications(callback: (notifications: Object[]) => void);
```

提供当前显示在通知中心中的应用通知列表。

**参数：**

| 名称     | 类型     | 必填 | 描述                         |
| -------- | -------- | ---- | ---------------------------- |
| callback | function | 是   | 接收已送达通知数组的函数。   |

已送达的通知是一个包含以下内容的对象：

- `identifier` : 此通知的标识符。
- `title` : 此通知的标题。
- `body` : 此通知的内容。
- `category` : 此通知的类别（可选）。
- `userInfo` : 包含附加通知数据的对象（可选）。
- `thread-id` : 此通知的线程标识符，如果有的话。

---

### `removeDeliveredNotifications()`

```tsx
static removeDeliveredNotifications(identifiers: string[]);
```

从通知中心移除指定的通知。

**参数：**

| 名称        | 类型  | 必填 | 描述                 |
| ----------- | ----- | ---- | -------------------- |
| identifiers | array | 是   | 通知标识符数组。     |

---

### `setApplicationIconBadgeNumber()`

```tsx
static setApplicationIconBadgeNumber(num: number);
```

设置主屏幕上应用图标的角标数字。

**参数：**

| 名称   | 类型   | 必填 | 描述                     |
| ------ | ------ | ---- | ------------------------ |
| number | number | 是   | 应用图标的角标数字。     |

---

### `getApplicationIconBadgeNumber()`

```tsx
static getApplicationIconBadgeNumber(callback: (num: number) => void);
```

获取主屏幕上应用图标当前的角标数字。

**参数：**

| 名称     | 类型     | 必填 | 描述                         |
| -------- | -------- | ---- | ---------------------------- |
| callback | function | 是   | 处理当前角标数字的函数。     |

---

### `cancelLocalNotifications()`

```tsx
static cancelLocalNotifications(userInfo: Object);
```

取消所有与所提供 `userInfo` 中字段匹配的已安排本地通知。

**参数：**

| 名称     | 类型   | 必填 | 描述 |
| -------- | ------ | ---- | ---- |
| userInfo | object | 否   |      |

---

### `getScheduledLocalNotifications()`

```tsx
static getScheduledLocalNotifications(
  callback: (notifications: ScheduleLocalNotificationDetails[]) => void,
);
```

获取当前已安排的本地通知列表。

**参数：**

| 名称     | 类型     | 必填 | 描述                                                                     |
| -------- | -------- | ---- | ------------------------------------------------------------------------ |
| callback | function | 是   | 处理描述本地通知对象数组的函数。                                         |

---

### `addEventListener()`

```tsx
static addEventListener(
  type: PushNotificationEventName,
  handler:
    | ((notification: PushNotification) => void)
    | ((deviceToken: string) => void)
    | ((error: {message: string; code: number; details: any}) => void),
);
```

为通知事件添加监听器，包括本地通知、远程通知和通知注册结果。

**参数：**

| 名称    | 类型     | 必填 | 描述                         |
| ------- | -------- | ---- | ---------------------------- |
| type    | string   | 是   | 要监听的事件类型。见下文。   |
| handler | function | 是   | 监听器。                     |

有效的事件类型包括：

- `notification` : 在收到远程通知时触发。处理函数将以 `PushNotificationIOS` 实例作为参数调用。这将处理在前台到达的通知，或从后台点击打开应用的通知。
- `localNotification` : 在收到本地通知时触发。处理函数将以 `PushNotificationIOS` 实例作为参数调用。这将处理在前台到达的通知，或从后台点击打开应用的通知。
- `register`: 用户成功注册远程通知时触发。处理函数将以表示 `deviceToken` 的十六进制字符串作为参数调用。
- `registrationError`: 用户注册远程通知失败时触发。通常由于 APNS 问题或设备是模拟器。处理函数将以 `{message: string, code: number, details: any}` 作为参数调用。

---

### `removeEventListener()`

```tsx
static removeEventListener(
  type: PushNotificationEventName,
);
```

移除事件监听器。请在 `componentWillUnmount` 中执行此操作以防止内存泄漏。

**参数：**

| 名称 | 类型   | 必填 | 描述                               |
| ---- | ------ | ---- | ---------------------------------- |
| type | string | 是   | 事件类型。选项见 `addEventListener()`。 |

---

### `requestPermissions()`

```tsx
static requestPermissions(permissions?: PushNotificationPermissions[]);
```

向 iOS 请求通知权限，并向用户显示对话框。默认情况下，这会请求所有通知权限，但你也可以选择指定要请求的权限。支持以下权限：

- `alert`
- `badge`
- `sound`

如果向该方法提供了一个映射，则只会请求值为 truthy 的权限。

此方法返回一个 promise；当用户接受或拒绝请求，或权限之前已被拒绝时，该 promise 会完成。promise 会解析为请求完成后的权限状态。

**参数：**

| 名称        | 类型  | 必填 | 描述                 |
| ----------- | ----- | ---- | -------------------- |
| permissions | array | 否   | alert、badge 或 sound |

---

### `abandonPermissions()`

```tsx
static abandonPermissions();
```

取消通过 Apple Push Notification service 接收的所有远程通知注册。

你只应在极少数情况下调用此方法，例如应用的新版本移除了对所有类型远程通知的支持时。用户可以通过设置应用临时阻止应用接收远程通知。通过此方法取消注册的应用始终可以重新注册。

---

### `checkPermissions()`

```tsx
static checkPermissions(
  callback: (permissions: PushNotificationPermissions) => void,
);
```

检查当前启用的是哪些推送权限。

**参数：**

| 名称     | 类型     | 必填 | 描述     |
| -------- | -------- | ---- | -------- |
| callback | function | 是   | 见下文。 |

`callback` 将使用一个 `permissions` 对象调用：

- `alert: boolean`
- `badge: boolean`
- `sound: boolean`

---

### `getInitialNotification()`

```tsx
static getInitialNotification(): Promise<PushNotification | null>;
```

此方法返回一个 promise。如果应用是由推送通知启动的，那么该 promise 会解析为被点击的通知的 `PushNotificationIOS` 类型对象。否则，它会解析为 `null`。

---

### `getAuthorizationStatus()`

```tsx
static getAuthorizationStatus(): Promise<number>;
```

此方法返回一个 promise，解析为当前通知授权状态。可参考 [UNAuthorizationStatus](https://developer.apple.com/documentation/usernotifications/unauthorizationstatus?language=objc) 获取可能的值。

---

### `finish()`

```tsx
finish(result: string);
```

此方法适用于通过 [`application:didReceiveRemoteNotification:fetchCompletionHandler:`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc) 接收的远程通知。不过，这已被 `UNUserNotificationCenterDelegate` 取代，如果同时实现了 `application:didReceiveRemoteNotification:fetchCompletionHandler:` 和来自 `UNUserNotificationCenterDelegate` 的较新处理程序，则此方法将不再被调用。

如果由于某种原因你仍然依赖 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，你需要在 iOS 端设置事件处理：

```objectivec
- (void)           application:(UIApplication *)application
  didReceiveRemoteNotification:(NSDictionary *)userInfo
        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
}
```

在你完成 JS 侧的通知处理后，调用 `finish()` 来执行原生完成处理器。调用此块时，请传入最能描述你操作结果的 fetch result 值。有关可能值的列表，请参见 `PushNotificationIOS.FetchResult`。

如果你正在使用 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，你 _必须_ 调用此处理器，并且应尽快调用。有关更多详情，请参见[官方文档](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc)。

---

### `getMessage()`

```tsx
getMessage(): string | Object;
```

`getAlert` 的别名，用于获取通知的主要消息字符串。

---

### `getSound()`

```tsx
getSound(): string;
```

从 `aps` 对象中获取声音字符串。本地通知时将为 `null`。

---

### `getCategory()`

```tsx
getCategory(): string;
```

从 `aps` 对象中获取类别字符串。

---

### `getAlert()`

```tsx
getAlert(): string | Object;
```

从 `aps` 对象中获取通知的主要消息。另请参见别名：`getMessage()`。

---

### `getContentAvailable()`

```tsx
getContentAvailable(): number;
```

从 `aps` 对象中获取 content-available 数值。

---

### `getBadgeCount()`

```tsx
getBadgeCount(): number;
```

从 `aps` 对象中获取角标数量。

---

### `getData()`

```tsx
getData(): Object;
```

获取通知上的数据对象。

---

### `getThreadID()`

```tsx
getThreadID();
```

获取通知上的线程 ID。
