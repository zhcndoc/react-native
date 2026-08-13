---
id: pushnotificationios
title: '🗑️ PushNotificationIOS'
---

:::warning[已弃用]
请改用[社区软件包](https://reactnative.directory/?search=notification)。
:::

<div className="banner-native-code-required">
  <h3>仅限原生代码项目</h3>
  <p>以下部分仅适用于公开原生代码的项目。如果你使用的是托管式 Expo 工作流，请参阅 Expo 文档中的<a href="https://docs.expo.dev/versions/latest/sdk/notifications/">通知</a>指南，以了解适用的替代方案。</p>
</div>

处理应用的通知，包括调度和权限。

---

## 入门

要启用推送通知，请[向 Apple 配置通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server)，并配置你的服务器端系统。

然后，在项目中[启用远程通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038)。这将自动启用所需的设置。

### 启用对 `register` 事件的支持

在你的 `AppDelegate.m` 中添加：

```objectivec
#import <React/RCTPushNotificationManager.h>
```

然后实现以下内容，以处理远程通知注册事件：

```objectivec
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 // This will trigger 'register' events on PushNotificationIOS
 [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 // This will trigger 'registrationError' events on PushNotificationIOS
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

在应用启动时设置代理：

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

实现 `userNotificationCenter:willPresentNotification:withCompletionHandler:`，以处理应用处于前台时收到的通知。使用 completionHandler 确定是否向用户显示通知，并相应地通知 `RCTPushNotificationManager`：

```objectivec
// Called when a notification is delivered to a foreground app.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // This will trigger 'notification' and 'localNotification' events on PushNotificationIOS
  [RCTPushNotificationManager didReceiveNotification:notification];
  // Decide if and how the notification will be shown to the user
  completionHandler(UNNotificationPresentationOptionNone);
}
```

#### 后台通知

实现 `userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:`，以处理用户点按通知的情况。通常，对于用户点按并打开应用的后台通知，会调用此方法。不过，如果你已在 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 中设置显示前台通知，那么当用户点按前台通知时，也会调用此方法。在这种情况下，你应该只在其中一个回调中通知 `RCTPushNotificationManager`。

如果点按通知导致应用启动，请调用 `setInitialNotification:`。如果该通知之前未由 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 处理，请同时调用 `didReceiveNotification:`：

```objectivec
- (void)  userNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void (^)(void))completionHandler
{
  // This condition passes if the notification was tapped to launch the app
  if ([response.actionIdentifier isEqualToString:UNNotificationDefaultActionIdentifier]) {
    // Allow the notification to be retrieved on the JS side using getInitialNotification()
    [RCTPushNotificationManager setInitialNotification:response.notification];
  }
  // This will trigger 'notification' and 'localNotification' events on PushNotificationIOS
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

安排一个立即显示的本地通知。

**参数：**

| 名称    | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| details | object | 是   | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle`：作为通知提醒标题显示的文本
- `alertBody`：通知提醒中显示的消息
- `userInfo`：包含其他通知数据的对象（可选）
- `category`：此通知的类别，可操作通知必需（可选）。例如，包含“回复”或“点赞”等其他操作的通知
- `applicationIconBadgeNumber`：应用图标标记上显示的数字。此属性的默认值为 0，表示不显示标记（可选）
- `isSilent`：如果为 true，通知将以静音方式显示（可选）
- `soundName`：触发通知时播放的声音（可选）
- `alertAction`：已弃用。此属性用于 iOS 的旧版 UILocalNotification

---

### `scheduleLocalNotification()`

```tsx
static scheduleLocalNotification(details: ScheduleLocalNotificationDetails);
```

安排一个在未来显示的本地通知。

**参数：**

| 名称    | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| details | object | 是   | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle`：作为通知提醒标题显示的文本
- `alertBody`：通知提醒中显示的消息
- `fireDate`：通知触发的时间。使用 `fireDate` 或 `fireIntervalSeconds` 调度通知，其中 `fireDate` 优先
- `fireIntervalSeconds`：从当前时间起经过多少秒后显示通知
- `userInfo`：包含其他通知数据的对象（可选）
- `category`：此通知的类别，可操作通知必需（可选）。例如，包含“回复”或“点赞”等其他操作的通知
- `applicationIconBadgeNumber`：应用图标标记上显示的数字。此属性的默认值为 0，表示不显示标记（可选）
- `isSilent`：如果为 true，通知将以静音方式显示（可选）
- `soundName`：触发通知时播放的声音（可选）
- `alertAction`：已弃用。此属性用于 iOS 的旧版 UILocalNotification
- `repeatInterval`：已弃用。请改用 `fireDate` 或 `fireIntervalSeconds`

---

### `cancelAllLocalNotifications()`

```tsx
static cancelAllLocalNotifications();
```

取消所有已调度的本地通知。

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

| 名称     | 类型     | 必填 | 描述                       |
| -------- | -------- | ---- | -------------------------- |
| callback | function | 是   | 接收已送达通知数组的函数。 |

已送达的通知是一个包含以下内容的对象：

- `identifier`：此通知的标识符
- `title`：此通知的标题
- `body`：此通知的正文
- `category`：此通知的类别（可选）
- `userInfo`：包含其他通知数据的对象（可选）
- `thread-id`：此通知的线程标识符（如果有）

---

### `removeDeliveredNotifications()`

```tsx
static removeDeliveredNotifications(identifiers: string[]);
```

从通知中心移除指定的通知。

**参数：**

| 名称        | 类型  | 必填 | 描述             |
| ----------- | ----- | ---- | ---------------- |
| identifiers | array | 是   | 通知标识符数组。 |

---

### `setApplicationIconBadgeNumber()`

```tsx
static setApplicationIconBadgeNumber(num: number);
```

设置主屏幕上应用图标的标记数字。

**参数：**

| 名称   | 类型   | 必填 | 描述                 |
| ------ | ------ | ---- | -------------------- |
| number | number | 是   | 应用图标的标记数字。 |

---

### `getApplicationIconBadgeNumber()`

```tsx
static getApplicationIconBadgeNumber(callback: (num: number) => void);
```

获取主屏幕上应用图标的当前标记数字。

**参数：**

| 名称     | 类型     | 必填 | 描述                     |
| -------- | -------- | ---- | ------------------------ |
| callback | function | 是   | 处理当前标记数字的函数。 |

---

### `cancelLocalNotifications()`

```tsx
static cancelLocalNotifications(userInfo: Object);
```

取消与所提供 `userInfo` 中字段匹配的所有已调度本地通知。

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

获取当前已调度的本地通知列表。

**参数：**

| 名称     | 类型     | 必填 | 描述                               |
| -------- | -------- | ---- | ---------------------------------- |
| callback | function | 是   | 处理描述本地通知的对象数组的函数。 |

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

为通知事件附加监听器，包括本地通知、远程通知和通知注册结果。

**参数：**

| 名称    | 类型     | 必填 | 描述                       |
| ------- | -------- | ---- | -------------------------- |
| type    | string   | 是   | 要监听的事件类型。见下文。 |
| handler | function | 是   | 监听器。                   |

有效的事件类型包括：

- `notification`：收到远程通知时触发。处理程序将接收一个 `PushNotificationIOS` 实例。此事件将处理应用处于前台时收到的通知，或用户在后台点按以打开应用的通知
- `localNotification`：收到本地通知时触发。处理程序将接收一个 `PushNotificationIOS` 实例。此事件将处理应用处于前台时收到的通知，或用户在后台点按以打开应用的通知
- `register`：用户成功注册远程通知时触发。处理程序将接收一个表示 deviceToken 的十六进制字符串
- `registrationError`：用户注册远程通知失败时触发。通常是由于 APNS 问题或设备为模拟器导致。处理程序将接收 `{message: string, code: number, details: any}`

---

### `removeEventListener()`

```tsx
static removeEventListener(
  type: PushNotificationEventName,
);
```

移除事件监听器。请在 `componentWillUnmount` 中执行此操作，以防止内存泄漏。

**参数：**

| 名称 | 类型   | 必填 | 描述                                        |
| ---- | ------ | ---- | ------------------------------------------- |
| type | string | 是   | 事件类型。选项请参阅 `addEventListener()`。 |

---

### `requestPermissions()`

```tsx
static requestPermissions(permissions?: PushNotificationPermissions[]);
```

向 iOS 请求通知权限，并通过对话框提示用户。默认情况下，这将请求所有通知权限，但你也可以选择要请求的权限。支持以下权限：

- `alert`
- `badge`
- `sound`

如果向该方法提供了映射，则只会请求值为 truthy 的权限。

此方法返回一个 promise，在用户接受或拒绝请求，或权限之前已被拒绝时 resolve。请求完成后，promise resolve 为权限状态。

**参数：**

| 名称        | 类型  | 必填 | 描述                  |
| ----------- | ----- | ---- | --------------------- |
| permissions | array | 否   | alert、badge 或 sound |

---

### `abandonPermissions()`

```tsx
static abandonPermissions();
```

取消注册通过 Apple Push Notification service 接收的所有远程通知。

仅应在少数情况下调用此方法，例如应用的新版本移除了对所有类型远程通知的支持。用户可以通过“设置”应用暂时阻止应用接收远程通知。通过此方法取消注册的应用始终可以重新注册。

---

### `checkPermissions()`

```tsx
static checkPermissions(
  callback: (permissions: PushNotificationPermissions) => void,
);
```

检查当前启用的推送权限。

**参数：**

| 名称     | 类型     | 必填 | 描述     |
| -------- | -------- | ---- | -------- |
| callback | function | 是   | 见下文。 |

`callback` 将接收一个 `permissions` 对象：

- `alert: boolean`
- `badge: boolean`
- `sound: boolean`

---

### `getInitialNotification()`

```tsx
static getInitialNotification(): Promise<PushNotification | null>;
```

此方法返回一个 promise。如果应用由推送通知启动，该 promise 将 resolve 为被点按通知的 `PushNotificationIOS` 类型对象。否则，将 resolve 为 `null`。

---

### `getAuthorizationStatus()`

```tsx
static getAuthorizationStatus(): Promise<number>;
```

此方法返回一个 promise，该 promise resolve 为当前通知授权状态。可能的值请参阅 [UNAuthorizationStatus](https://developer.apple.com/documentation/usernotifications/unauthorizationstatus?language=objc)。

---

### `finish()`

```tsx
finish(result: string);
```

此方法适用于通过 [`application:didReceiveRemoteNotification:fetchCompletionHandler:`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc) 接收的远程通知。不过，该方法已被 `UNUserNotificationCenterDelegate` 取代；如果同时实现了 `application:didReceiveRemoteNotification:fetchCompletionHandler:` 和 `UNUserNotificationCenterDelegate` 中较新的处理程序，则不会再调用此方法。

如果由于某种原因你仍依赖 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，则需要在 iOS 端设置事件处理：

```objectivec
- (void)           application:(UIApplication *)application
  didReceiveRemoteNotification:(NSDictionary *)userInfo
        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
}
```

在 JS 端完成通知处理后，调用 `finish()` 来执行原生 completion handler。调用此代码块时，传入最能描述操作结果的 fetch result 值。可能的值列表请参阅 `PushNotificationIOS.FetchResult`。

如果你使用 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，则必须调用此 handler，并且应尽快调用。更多详情请参阅[官方文档](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc)。

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

从 `aps` 对象获取声音字符串。本地通知的值为 `null`。

---

### `getCategory()`

```tsx
getCategory(): string;
```

从 `aps` 对象获取类别字符串。

---

### `getAlert()`

```tsx
getAlert(): string | Object;
```

从 `aps` 对象获取通知的主要消息。另请参阅别名：`getMessage()`。

---

### `getContentAvailable()`

```tsx
getContentAvailable(): number;
```

从 `aps` 对象获取 content-available 数字。

---

### `getBadgeCount()`

```tsx
getBadgeCount(): number;
```

从 `aps` 对象获取标记计数数字。

---

### `getData()`

```tsx
getData(): Object;
```

获取通知中的数据对象。

---

### `getThreadID()`

```tsx
getThreadID();
```

获取通知中的线程 ID。
