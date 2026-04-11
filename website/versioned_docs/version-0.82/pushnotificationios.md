---
id: pushnotificationios
title: '🗑️ PushNotificationIOS'
---

:::warning 已弃用
请改用 [社区包](https://reactnative.directory/?search=notification) 之一。
:::

<div className="banner-native-code-required">
  <h3>仅适用于包含原生代码的项目</h3>
  <p>以下部分仅适用于暴露了原生代码的项目。如果您使用的是托管的 Expo 工作流，请参阅 Expo 文档中关于 <a href="https://docs.expo.dev/versions/latest/sdk/notifications/">通知</a> 的指南以获取合适的替代方案。</p>
</div>

处理应用的通知，包括调度和权限。

---

## 入门

要启用推送通知，请 [与 Apple 配置您的通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server) 以及您的服务器端系统。

然后，在您的项目中 [启用远程通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/pushing_background_updates_to_your_app#2980038)。这将自动启用所需的设置。

### 启用对 `register` 事件的支持

在您的 `AppDelegate.m` 中，添加：

```objectivec
#import <React/RCTPushNotificationManager.h>
```

然后实现以下内容以处理远程通知注册事件：

```objectivec
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 // 这将在 PushNotificationIOS 上触发 'register' 事件
 [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 // 这将在 PushNotificationIOS 上触发 'registrationError' 事件
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

实现 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 以处理应用在前台时到达的通知。使用 completionHandler 确定是否将通知显示给用户，并相应地通知 `RCTPushNotificationManager`：

```objectivec
// 当通知送达前台应用时调用。
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // 这将在 PushNotificationIOS 上触发 'notification' 和 'localNotification' 事件
  [RCTPushNotificationManager didReceiveNotification:notification];
  // 决定是否以及如何向用户显示通知
  completionHandler(UNNotificationPresentationOptionNone);
}
```

#### 后台通知

实现 `userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:` 以处理通知被点击的情况，通常称为后台通知，用户点击以打开应用。但是，如果您已在 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 中设置显示前台通知，则当前台通知被点击时也会调用此方法。在这种情况下，您应该只在这些回调之一中通知 `RCTPushNotificationManager`。

如果点击的通知导致应用启动，请调用 `setInitialNotification:`。如果通知之前未被 `userNotificationCenter:willPresentNotification:withCompletionHandler:` 处理，也请调用 `didReceiveNotification:`：

```objectivec
- (void)  userNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void (^)(void))completionHandler
{
  // 如果点击通知以启动应用，则此条件成立
  if ([response.actionIdentifier isEqualToString:UNNotificationDefaultActionIdentifier]) {
    // 允许在 JS 端使用 getInitialNotification() 检索通知
    [RCTPushNotificationManager setInitialNotification:response.notification];
  }
  // 这将在 PushNotificationIOS 上触发 'notification' 和 'localNotification' 事件
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

调度一个本地通知以便立即显示。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ------- | ------ | -------- | ----------- |
| details | object | 是 | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle`：显示为通知提醒标题的文本。
- `alertBody`：显示在通知提醒中的消息。
- `userInfo`：包含附加通知数据的对象（可选）。
- `category`：此通知的类别，操作性通知所需（可选）。例如具有回复或点赞等附加操作的通知。
- `applicationIconBadgeNumber` 显示为应用图标徽章的数字。此属性的默认值为 0，表示不显示徽章（可选）。
- `isSilent`：如果为 true，通知将无声显示（可选）。
- `soundName`：触发通知时播放的声音（可选）。
- `alertAction`：已弃用。这是用于 iOS 遗留的 UILocalNotification。

---

### `scheduleLocalNotification()`

```tsx
static scheduleLocalNotification(details: ScheduleLocalNotificationDetails);
```

调度一个本地通知以便将来显示。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ------- | ------ | -------- | ----------- |
| details | object | 是 | 见下文。 |

`details` 是一个包含以下内容的对象：

- `alertTitle`：显示为通知提醒标题的文本。
- `alertBody`：显示在通知提醒中的消息。
- `fireDate`：通知将被触发的时间。使用 `fireDate` 或 `fireIntervalSeconds` 调度通知，`fireDate` 优先。
- `fireIntervalSeconds`：从现在起到显示通知的秒数。
- `userInfo`：包含附加通知数据的对象（可选）。
- `category`：此通知的类别，操作性通知所需（可选）。例如具有回复或点赞等附加操作的通知。
- `applicationIconBadgeNumber` 显示为应用图标徽章的数字。此属性的默认值为 0，表示不显示徽章（可选）。
- `isSilent`：如果为 true，通知将无声显示（可选）。
- `soundName`：触发通知时播放的声音（可选）。
- `alertAction`：已弃用。这是用于 iOS 遗留的 UILocalNotification。
- `repeatInterval`：已弃用。请改用 `fireDate` 或 `fireIntervalSeconds`。

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

| 名称 | 类型 | 是否必填 | 描述 |
| -------- | -------- | -------- | ------------------------------------------------------------ |
| callback | function | 是 | 接收已送达通知数组的函数。 |

已送达的通知是一个包含以下内容的对象：

- `identifier`：此通知的标识符。
- `title`：此通知的标题。
- `body`：此通知的内容。
- `category`：此通知的类别（可选）。
- `userInfo`：包含附加通知数据的对象（可选）。
- `thread-id`：此通知的线程标识符（如果有）。

---

### `removeDeliveredNotifications()`

```tsx
static removeDeliveredNotifications(identifiers: string[]);
```

从通知中心移除指定的通知。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ----------- | ----- | -------- | ---------------------------------- |
| identifiers | array | 是 | 通知标识符数组。 |

---

### `setApplicationIconBadgeNumber()`

```tsx
static setApplicationIconBadgeNumber(num: number);
```

设置主屏幕上应用图标的徽章数字。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ------ | ------ | -------- | ------------------------------ |
| number | number | 是 | 应用图标的徽章数字。 |

---

### `getApplicationIconBadgeNumber()`

```tsx
static getApplicationIconBadgeNumber(callback: (num: number) => void);
```

获取主屏幕上应用图标的当前徽章数字。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| -------- | -------- | -------- | -------------------------------------------------- |
| callback | function | 是 | 处理当前徽章数字的函数。 |

---

### `cancelLocalNotifications()`

```tsx
static cancelLocalNotifications(userInfo: Object);
```

取消任何与提供的 `userInfo` 中字段匹配的已调度本地通知。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| -------- | ------ | -------- | ----------- |
| userInfo | object | 否 | |

---

### `getScheduledLocalNotifications()`

```tsx
static getScheduledLocalNotifications(
  callback: (notifications: ScheduleLocalNotificationDetails[]) => void,
);
```

获取当前已调度的本地通知列表。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| -------- | -------- | -------- | ---------------------------------------------------------------------------- |
| callback | function | 是 | 处理描述本地通知的对象数组的函数。 |

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

附加一个监听器到通知事件，包括本地通知、远程通知和通知注册结果。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ------- | -------- | -------- | ----------------------------------- |
| type | string | 是 | 要监听的事件类型。见下文。 |
| handler | function | 是 | 监听器。 |

有效的事件类型包括：

- `notification`：当收到远程通知时触发。处理程序将使用 `PushNotificationIOS` 实例调用。这将处理在前台到达的通知或被点击以从后台打开应用的通知。
- `localNotification`：当收到本地通知时触发。处理程序将使用 `PushNotificationIOS` 实例调用。这将处理在前台到达的通知或被点击以从后台打开应用的通知。
- `register`：当用户成功注册远程通知时触发。处理程序将使用代表 deviceToken 的十六进制字符串调用。
- `registrationError`：当用户注册远程通知失败时触发。通常由于 APNS 问题或设备是模拟器而发生。处理程序将使用 `{message: string, code: number, details: any}` 调用。

---

### `removeEventListener()`

```tsx
static removeEventListener(
  type: PushNotificationEventName,
);
```

移除事件监听器。在 `componentWillUnmount` 中执行此操作以防止内存泄漏。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ---- | ------ | -------- | ------------------------------------------------- |
| type | string | 是 | 事件类型。参见 `addEventListener()` 获取选项。 |

---

### `requestPermissions()`

```tsx
static requestPermissions(permissions?: PushNotificationPermissions[]);
```

向 iOS 请求通知权限，会弹出一个对话框提示用户。默认情况下，这将请求所有通知权限，但您可以选择指定要请求哪些权限。支持以下权限：

- `alert`
- `badge`
- `sound`

如果向该方法提供了一个映射，则只请求具有真值的权限。

此方法返回一个 promise，当用户接受或拒绝请求时，或者如果权限之前已被拒绝，该 promise 将 resolve。Promise 解析为请求完成后的权限状态。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| ----------- | ----- | -------- | ---------------------- |
| permissions | array | 否 | alert, badge, 或 sound |

---

### `abandonPermissions()`

```tsx
static abandonPermissions();
```

注销通过 Apple 推送通知服务接收的所有远程通知。

您应该仅在罕见情况下调用此方法，例如当新版本的应用移除对所有类型远程通知的支持时。用户可以通过设置应用暂时防止应用接收远程通知。通过此方法注销的应用可以随时重新注册。

---

### `checkPermissions()`

```tsx
static checkPermissions(
  callback: (permissions: PushNotificationPermissions) => void,
);
```

检查当前启用了哪些推送权限。

**参数：**

| 名称 | 类型 | 是否必填 | 描述 |
| -------- | -------- | -------- | ----------- |
| callback | function | 是 | 见下文。 |

`callback` 将被调用并传入一个 `permissions` 对象：

- `alert: boolean`
- `badge: boolean`
- `sound: boolean`

---

### `getInitialNotification()`

```tsx
static getInitialNotification(): Promise<PushNotification | null>;
```

此方法返回一个 promise。如果应用是通过推送通知启动的，此 promise 解析为被点击通知的 `PushNotificationIOS` 类型对象。否则，它解析为 `null`。

---

### `getAuthorizationStatus()`

```tsx
static getAuthorizationStatus(): Promise<number>;
```

此方法返回一个 promise，解析为当前的通知授权状态。参见 [UNAuthorizationStatus](https://developer.apple.com/documentation/usernotifications/unauthorizationstatus?language=objc) 获取可能的值。

---

### `finish()`

```tsx
finish(result: string);
```

此方法适用于通过 [`application:didReceiveRemoteNotification:fetchCompletionHandler:`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc) 接收的远程通知。但是，这已被 `UNUserNotificationCenterDelegate` 取代，如果同时实现了 `application:didReceiveRemoteNotification:fetchCompletionHandler:` 和来自 `UNUserNotificationCenterDelegate` 的较新处理程序，则将不再调用此方法。

如果出于某种原因您仍然依赖 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，您需要在 iOS 端设置事件处理：

```objectivec
- (void)           application:(UIApplication *)application
  didReceiveRemoteNotification:(NSDictionary *)userInfo
        fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:handler];
}
```

在 JS 端处理完通知后，调用 `finish()` 以执行原生完成处理程序。调用此块时，传入最能描述操作结果的获取结果值。有关可能的值列表，参见 `PushNotificationIOS.FetchResult`。

如果您使用的是 `application:didReceiveRemoteNotification:fetchCompletionHandler:`，您 _必须_ 调用此处理程序，并且应尽快调用。有关更多详细信息，请参阅 [官方文档](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc)。

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

从 `aps` 对象获取声音字符串。对于本地通知，这将为 `null`。

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

从 `aps` 对象获取通知的主要消息。另见别名：`getMessage()`。

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

从 `aps` 对象获取徽章计数数字。

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
