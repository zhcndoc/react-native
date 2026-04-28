---
id: pushnotificationios
title: '🗑️ PushNotificationIOS'
---

:::warning[已废弃]
请改用 [社区包](https://reactnative.directory/?search=notification) 中的一个。
:::

<div className="banner-native-code-required">
  <h3>仅适用于包含原生代码的项目</h3>
  <p>以下内容仅适用于暴露原生代码的项目。如果您使用的是托管的 Expo 工作流，请参阅 Expo 文档中关于 <a href="https://docs.expo.dev/versions/latest/sdk/notifications/">通知</a> 的指南，了解相应的替代方案。</p>
</div>

处理您应用的通知，包括调度和权限管理。

---

## 入门

启用推送通知，请先 [在 Apple 上配置您的通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server) 和服务器端系统。

然后，在您的项目中 [启用远程通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038)。这将自动启用所需设置。

### 启用对 `register` 事件的支持

在您的 `AppDelegate.m` 文件中，添加：

```objectivec
#import <React/RCTPushNotificationManager.h>
```

然后实现以下方法，以处理远程通知注册事件：

```objectivec
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 // 这将触发 PushNotificationIOS 的 'register' 事件
 [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 // 这将触发 PushNotificationIOS 的 'registrationError' 事件
 [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
```

### 处理通知

您需要在 `AppDelegate` 中实现 `UNUserNotificationCenterDelegate`：

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

实现 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 以处理应用处于前台时收到的通知。使用 completionHandler 决定是否显示通知给用户，并相应通知 `RCTPushNotificationManager`：

```objectivec
// 当前台应用接收到通知时调用。
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // 这将触发 PushNotificationIOS 的 'notification' 和 'localNotification' 事件
  [RCTPushNotificationManager didReceiveNotification:notification];
  // 决定是否以及如何向用户展示通知
  completionHandler(UNNotificationPresentationOptionNone);
}
```

#### 后台通知

实现 `userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:` 来处理通知被点击时的情况，通常用于用户点击打开应用的后台通知。但是，如果您在 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 中设置了前台通知显示，则该方法在前台通知被点击时也会被调用。在这种情况下，您应确保只在这两个回调中的一个中通知 `RCTPushNotificationManager`。

如果被点击的通知导致应用启动，应调用 `setInitialNotification:`。如果通知之前未被 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 处理，则也应调用 `didReceiveNotification:`：

```objectivec
- (void)  userNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void (^)(void))completionHandler
{
  // 如果通知是通过点击启动应用时触发此条件
  if ([response.actionIdentifier isEqualToString:UNNotificationDefaultActionIdentifier]) {
    // 允许通过 JS 层的 getInitialNotification() 获取此通知
    [RCTPushNotificationManager setInitialNotification:response.notification];
  }
  // 这将触发 PushNotificationIOS 的 'notification' 和 'localNotification' 事件
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

调度一个立即显示的本地通知。

**参数：**

| 名称    | 类型   | 必填 | 描述       |
| ------- | ------ | ---- | ---------- |
| details | 对象   | 是   | 见下文说明 |

`details` 是一个对象，包含：

- `alertTitle` ：通知提示框中显示的标题文本。
- `alertBody` ：通知提示框中显示的消息内容。
- `userInfo` ：包含额外通知数据的对象（可选）。
- `category` ：该通知的类别，针对可触发操作的通知必需（可选）。例如，带有“回复”或“点赞”等额外操作的通知。
- `applicationIconBadgeNumber` ：应用图标上显示的徽章数字。该属性默认值为 0，表示不显示徽章（可选）。
- `isSilent` ：如果为 true，通知显示时无声音（可选）。
- `soundName` ：通知触发时播放的声音（可选）。
- `alertAction` ：已废弃。过去用于 iOS 的 UILocalNotification。

---

### `scheduleLocalNotification()`

```tsx
static scheduleLocalNotification(details: ScheduleLocalNotificationDetails);
```

调度一个未来显示的本地通知。

**参数：**

| 名称    | 类型   | 必填 | 描述       |
| ------- | ------ | ---- | ---------- |
| details | 对象   | 是   | 见下文说明 |

`details` 是一个对象，包含：

- `alertTitle` ：通知提示框中显示的标题文本。
- `alertBody` ：通知提示框中显示的消息内容。
- `fireDate` ：通知触发的时间。调度通知时可以使用 `fireDate` 或 `fireIntervalSeconds`，以 `fireDate` 优先。
- `fireIntervalSeconds` ：从当前时间起经过多少秒触发通知。
- `userInfo` ：包含额外通知数据的对象（可选）。
- `category` ：该通知的类别，针对可触发操作的通知必需（可选）。如带有“回复”或“点赞”等额外操作的通知。
- `applicationIconBadgeNumber` ：应用图标上显示的徽章数字。该属性默认值为 0，表示不显示徽章（可选）。
- `isSilent` ：如果为 true，通知显示时无声音（可选）。
- `soundName` ：通知触发时播放的声音（可选）。
- `alertAction` ：已废弃。过去用于 iOS 的 UILocalNotification。
- `repeatInterval` ：已废弃。请改用 `fireDate` 或 `fireIntervalSeconds`。

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

移除通知中心的所有已送达通知。

---

### `getDeliveredNotifications()`

```tsx
static getDeliveredNotifications(callback: (notifications: Object[]) => void);
```

获取当前在通知中心显示的应用通知列表。

**参数：**

| 名称     | 类型     | 必填 | 描述                  |
| -------- | -------- | ---- | --------------------- |
| callback | 函数     | 是   | 接收一个已送达通知数组的函数 |

已送达通知对象包含：

- `identifier` ：该通知的标识符。
- `title` ：该通知的标题。
- `body` ：该通知的正文内容。
- `category` ：该通知的类别（可选）。
- `userInfo` ：包含额外通知数据的对象（可选）。
- `thread-id` ：如果有，该通知的线程标识符。

---

### `removeDeliveredNotifications()`

```tsx
static removeDeliveredNotifications(identifiers: string[]);
```

从通知中心移除指定的通知。

**参数：**

| 名称        | 类型   | 必填 | 描述             |
| ----------- | ------ | ---- | ---------------- |
| identifiers | 数组   | 是   | 通知标识符数组。 |

---

### `setApplicationIconBadgeNumber()`

```tsx
static setApplicationIconBadgeNumber(num: number);
```

设置应用图标在主屏上的徽章数字。

**参数：**

| 名称   | 类型   | 必填 | 描述              |
| ------ | ------ | ---- | ----------------- |
| number | 数字   | 是   | 应用图标的徽章数字 |

---

### `getApplicationIconBadgeNumber()`

```tsx
static getApplicationIconBadgeNumber(callback: (num: number) => void);
```

获取当前应用图标在主屏上的徽章数字。

**参数：**

| 名称     | 类型     | 必填 | 描述                    |
| -------- | -------- | ---- | ----------------------- |
| callback | 函数     | 是   | 处理当前徽章数字的函数。 |

---

### `cancelLocalNotifications()`

```tsx
static cancelLocalNotifications(userInfo: Object);
```

取消任何符合提供的 `userInfo` 字段的已调度本地通知。

**参数：**

| 名称     | 类型   | 必填 | 描述       |
| -------- | ------ | ---- | ---------- |
| userInfo | 对象   | 否   |            |

---

### `getScheduledLocalNotifications()`

```tsx
static getScheduledLocalNotifications(
  callback: (notifications: ScheduleLocalNotificationDetails[]) => void,
);
```

获取当前所有已调度的本地通知列表。

**参数：**

| 名称     | 类型     | 必填 | 描述                                   |
| -------- | -------- | ---- | ------------------------------------ |
| callback | 函数     | 是   | 处理本地通知对象数组的函数。        |

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

添加监听器，监听本地通知、远程通知以及通知注册结果等事件。

**参数：**

| 名称    | 类型     | 必填 | 描述                |
| ------- | -------- | ---- | ------------------- |
| type    | 字符串   | 是   | 监听的事件类型。见下。 |
| handler | 函数     | 是   | 事件处理函数。       |

有效的事件类型包括：

- `notification` ：当收到远程通知时触发。处理函数会收到一个 `PushNotificationIOS` 实例。该事件处理前台收到的通知，也处理背景通知被点击打开应用的情况。
- `localNotification` ：当收到本地通知时触发。处理函数会收到一个 `PushNotificationIOS` 实例。该事件处理前台收到的通知，也处理背景通知被点击打开应用的情况。
- `register` ：当用户成功注册远程通知时触发。处理函数接收表示设备令牌的十六进制字符串。
- `registrationError` ：当注册远程通知失败时触发。通常由于 APNS 问题或设备为模拟器时出现。处理函数接收一个包含 `{message: string, code: number, details: any}` 的错误对象。

---

### `removeEventListener()`

```tsx
static removeEventListener(
  type: PushNotificationEventName,
);
```

移除事件监听器。建议在 `componentWillUnmount` 中调用，以防止内存泄漏。

**参数：**

| 名称 | 类型   | 必填 | 描述                  |
| ---- | ------ | ---- | --------------------- |
| type | 字符串 | 是   | 事件类型。见 `addEventListener()`。 |

---

### `requestPermissions()`

```tsx
static requestPermissions(permissions?: PushNotificationPermissions[]);
```

请求 iOS 的通知权限，会弹出提示框让用户允许或拒绝。默认请求所有通知权限，但也可以选择请求特定权限。支持的权限包括：

- `alert`
- `badge`
- `sound`

如果传入参数，则只请求对应为真值的权限。

该方法返回一个 Promise，当用户接受或拒绝请求，或权限之前已被拒绝时解析。Promise 解析为请求完成后的权限状态。

**参数：**

| 名称        | 类型  | 必填 | 描述             |
| ----------- | ----- | ---- | ---------------- |
| permissions | 数组  | 否   | alert、badge 或 sound |

---

### `abandonPermissions()`

```tsx
static abandonPermissions();
```

注销所有 Apple 推送通知服务的远程通知。

一般只应在极少数情况下调用，例如新版本应用取消所有远程通知支持时。用户可以通过系统设置临时阻止应用接收远程通知。通过此方法注销的应用仍可随时重新注册。

---

### `checkPermissions()`

```tsx
static checkPermissions(
  callback: (permissions: PushNotificationPermissions) => void,
);
```

检查当前推送权限的开启状态。

**参数：**

| 名称     | 类型     | 必填 | 描述      |
| -------- | -------- | ---- | --------- |
| callback | 函数     | 是   | 详见下文。 |

`callback` 会接收一个权限对象：

- `alert: boolean`
- `badge: boolean`
- `sound: boolean`

---

### `getInitialNotification()`

```tsx
static getInitialNotification(): Promise<PushNotification | null>;
```

此方法返回一个 Promise。如果应用是被推送通知启动的，则该 Promise 解析为表示被点击通知的 `PushNotificationIOS` 对象，否则解析为 `null`。

---

### `getAuthorizationStatus()`

```tsx
static getAuthorizationStatus(): Promise<number>;
```

此方法返回一个 Promise，解析为当前通知授权状态。具体值参见 [UNAuthorizationStatus](https://developer.apple.com/documentation/usernotifications/unauthorizationstatus?language=objc)。

---

### `finish()`

```tsx
finish(result: string);
```

此方法适用于通过 [`application:didReceiveRemoteNotification:fetchCompletionHandler:`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc) 接收到的远程通知。但该方法已被 `UNUserNotificationCenterDelegate` 新的处理方式取代，如果同时实现了两者，旧方法将不再调用。

如果您仍然依赖 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，您需要在 iOS 端设置事件处理：

```objectivec
- (void)           application:(UIApplication *)application
  didReceiveRemoteNotification:(NSDictionary *)userInfo
        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
}
```

完成 JS 侧通知处理后，调用 `finish()` 来执行原生完成处理程序。调用时传入一个描述操作结果的 fetch 结果值，具体值见 `PushNotificationIOS.FetchResult`。

如果使用 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，您 _必须_ 及时调用该 handler。详情见 [官方文档](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc)。

---

### `getMessage()`

```tsx
getMessage(): string | Object;
```

`getAlert` 方法的别名，用于获取通知的主要消息字符串。

---

### `getSound()`

```tsx
getSound(): string;
```

从 `aps` 对象中获取声音字符串。本地通知返回 `null`。

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

从 `aps` 对象中获取通知主要消息。也见别名：`getMessage()`。

---

### `getContentAvailable()`

```tsx
getContentAvailable(): number;
```

从 `aps` 对象中获取 `content-available` 数值。

---

### `getBadgeCount()`

```tsx
getBadgeCount(): number;
```

从 `aps` 对象中获取徽章计数数字。

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