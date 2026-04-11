---
id: linking
title: 链接
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Linking` 为你提供了一个通用接口，用于处理传入和传出的应用链接。

每个链接 (URL) 都有一个 URL 方案，有些网站以 `https://` 或 `http://` 为前缀，这里的 `http` 就是 URL 方案。我们简称为 scheme。

除了 `https`，你可能还熟悉 `mailto` 方案。当你打开一个带有 mailto 方案的链接时，你的操作系统将打开已安装的邮件应用程序。同样，也有用于拨打电话和发送短信的方案。请在下方阅读更多关于 [内置 URL](#built-in-url-schemes) 方案的信息。

就像使用 mailto 方案一样，也可以使用自定义 URL 方案链接到其他应用程序。例如，当你收到来自 Slack 的 **Magic Link** 电子邮件时，**启动 Slack** 按钮是一个锚标签，其 href 看起来像这样：`slack://secret/magic-login/other-secret`。与 Slack 一样，你可以告诉操作系统你想要处理一个自定义方案。当 Slack 应用打开时，它会收到用于打开它的 URL。这通常被称为深链接。阅读更多关于如何 [获取深链接](#get-the-deep-link) 到你的应用的信息。

自定义 URL 方案不是在移动设备上打开应用程序的唯一方式。例如，如果你想通过电子邮件发送一个在移动设备上打开的链接，使用自定义 URL 方案并不理想，因为用户可能在桌面上打开电子邮件，那里链接将无法工作。相反，你应该使用标准的 `https` 链接，例如 `https://www.myapp.io/records/1234546`。在移动设备上，这些链接可以配置为打开你的应用。在 Android 上，此功能称为 **深链接**，而在 iOS 上，它被称为 **通用链接**。

### 内置 URL 方案

如引言中所述，每个平台上都存在一些用于核心功能的 URL 方案。以下是一个非详尽列表，但涵盖了最常用的方案。

| 方案           | 描述                                | iOS | Android |
| ---------------- | ------------------------------------------ | --- | ------- |
| `mailto`         | 打开邮件应用，例如：mailto: hello@world.dev | ✅  | ✅      |
| `tel`            | 打开电话应用，例如：tel:+123456789         | ✅  | ✅      |
| `sms`            | 打开短信应用，例如：sms:+123456789           | ✅  | ✅      |
| `https` / `http` | 打开 Web 浏览器应用，例如：https://expo.dev | ✅  | ✅      |

### 启用深链接

<div className="banner-native-code-required">
  <h3>仅包含原生代码的项目</h3>
  <p>以下部分仅适用于暴露了原生代码的项目。如果你使用的是托管的 Expo 工作流，请参阅 Expo 文档中关于 <a href="https://docs.expo.dev/guides/linking/">链接</a> 的指南以获取适当的替代方案。</p>
</div>

如果你想在应用中启用深链接，请阅读以下指南：

<Tabs groupId="syntax" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

> 有关如何在 Android 上添加深链接支持的说明，请参阅 [为应用内容启用深链接 - 为你的深链接添加 Intent 过滤器](https://developer.android.com/training/app-indexing/deep-linking.html#adding-filters)。

如果你希望在现有的 MainActivity 实例中接收 intent，你可以在 `AndroidManifest.xml` 中将 MainActivity 的 `launchMode` 设置为 `singleTask`。有关更多信息，请参阅 [`<activity>`](https://developer.android.com/guide/topics/manifest/activity-element.html) 文档。

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
```

</TabItem>
<TabItem value="ios">

> **注意：** 在 iOS 上，你需要按照第 3 步 [此处](linking-libraries-ios#step-3) 所述，将 `LinkingIOS` 文件夹添加到你的头文件搜索路径中。如果你还希望在应用执行期间监听传入的应用链接，你需要将以下行添加到你的 `*AppDelegate.m` 中：

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

```objc title="AppDelegate.mm"
// iOS 9.x 或更高版本
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

如果你的应用正在使用 [通用链接](https://developer.apple.com/ios/universal-links/)，你还需要添加以下代码：

```objc title="AppDelegate.mm"
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
```

</TabItem>
<TabItem value="swift">

```swift title="AppDelegate.swift"
override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}
```

如果你的应用正在使用 [通用链接](https://developer.apple.com/ios/universal-links/)，你还需要添加以下代码：

```swift title="AppDelegate.swift"
override func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

### 处理深链接

有两种方法可以处理打开你应用的 URL。

#### 1. 如果应用已经打开，应用会被置于前台并触发一个 Linking 'url' 事件

你可以使用 `Linking.addEventListener('url', callback)` 来处理这些事件 - 它会使用链接的 URL 调用 `callback({url})`

#### 2. 如果应用尚未打开，它会被打开并且 URL 会作为 initialURL 传入

你可以使用 `Linking.getInitialURL()` 来处理这些事件 - 它返回一个 Promise，如果有的话，该 Promise 会解析为 URL。

---

## 示例

### 打开链接和深链接（通用链接）

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    // 检查具有自定义 URL 方案的链接是否受支持。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 打开链接，如果 URL 方案是 "http"，网页链接应由
      // 移动设备上的某个浏览器打开
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开此 URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>打开受支持的 URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>打开不受支持的 URL</OpenURLButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=tsx
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

type OpenURLButtonProps = {
  url: string;
  children: string;
};

const OpenURLButton = ({url, children}: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    // 检查具有自定义 URL 方案的链接是否受支持。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 打开链接，如果 URL 方案是 "http"，网页链接应由
      // 移动设备上的某个浏览器打开
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开此 URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>打开受支持的 URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>打开不受支持的 URL</OpenURLButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
</Tabs>

### 打开自定义设置

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import React, {useCallback} from 'react';
import {Button, Linking, StyleSheet, View} from 'react-native';

const OpenSettingsButton = ({children}) => {
  const handlePress = useCallback(async () => {
    // 如果应用有自定义设置，则打开它
    await Linking.openSettings();
  }, []);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenSettingsButton>打开设置</OpenSettingsButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=tsx
import React, {useCallback} from 'react';
import {Button, Linking, StyleSheet, View} from 'react-native';

type OpenSettingsButtonProps = {
  children: string;
};

const OpenSettingsButton = ({children}: OpenSettingsButtonProps) => {
  const handlePress = useCallback(async () => {
    // 如果应用有自定义设置，则打开它
    await Linking.openSettings();
  }, []);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenSettingsButton>打开设置</OpenSettingsButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
</Tabs>

### 获取深链接

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import React, {useState, useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // 获取用于打开应用的深链接
      const initialUrl = await Linking.getInitialURL();

      // setTimeout 仅用于测试目的
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  }, []);

  return {url, processing};
};

const App = () => {
  const {url: initialUrl, processing} = useInitialURL();

  return (
    <View style={styles.container}>
      <Text>
        {processing
          ? '正在处理来自深链接的初始 url'
          : `深链接是：${initialUrl || '无'}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=tsx
import React, {useState, useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // 获取用于打开应用的深链接
      const initialUrl = await Linking.getInitialURL();

      // setTimeout 仅用于测试目的
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  }, []);

  return {url, processing};
};

const App = () => {
  const {url: initialUrl, processing} = useInitialURL();

  return (
    <View style={styles.container}>
      <Text>
        {processing
          ? '正在处理来自深链接的初始 url'
          : `深链接是：${initialUrl || '无'}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
</Tabs>

### 发送 Intents (Android)

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=android&ext=js
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const SendIntentButton = ({action, extras, children}) => {
  const handlePress = useCallback(async () => {
    try {
      await Linking.sendIntent(action, extras);
    } catch (e) {
      Alert.alert(e.message);
    }
  }, [action, extras]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <SendIntentButton action="android.intent.action.POWER_USAGE_SUMMARY">
        电源使用摘要
      </SendIntentButton>
      <SendIntentButton
        action="android.settings.APP_NOTIFICATION_SETTINGS"
        extras={[
          {
            key: 'android.provider.extra.APP_PACKAGE',
            value: 'com.facebook.katana',
          },
        ]}>
        应用通知设置
      </SendIntentButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Linking%20Example&ext=tsx
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

type SendIntentButtonProps = {
  action: string;
  children: string;
  extras?: Array<{
    key: string;
    value: string | number | boolean;
  }>;
};

const SendIntentButton = ({
  action,
  extras,
  children,
}: SendIntentButtonProps) => {
  const handlePress = useCallback(async () => {
    try {
      await Linking.sendIntent(action, extras);
    } catch (e: any) {
      Alert.alert(e.message);
    }
  }, [action, extras]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <SendIntentButton action="android.intent.action.POWER_USAGE_SUMMARY">
        电源使用摘要
      </SendIntentButton>
      <SendIntentButton
        action="android.settings.APP_NOTIFICATION_SETTINGS"
        extras={[
          {
            key: 'android.provider.extra.APP_PACKAGE',
            value: 'com.facebook.katana',
          },
        ]}>
        应用通知设置
      </SendIntentButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

</TabItem>
</Tabs>

# 参考

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  type: 'url',
  handler: (event: {url: string}) => void,
): EmitterSubscription;
```

通过监听 `url` 事件类型并提供处理程序，来添加一个处理 Linking 变化的处理器。

---

### `canOpenURL()`

```tsx
static canOpenURL(url: string): Promise<boolean>;
```

确定已安装的应用是否可以处理给定的 URL。

该方法返回一个 `Promise` 对象。当确定给定的 URL 是否可以被处理时，promise 会被 resolve，第一个参数表示是否可以打开。

在 Android 上，如果无法检查 URL 是否可以打开，或者当目标为 Android 11 (SDK 30) 但未在 `AndroidManifest.xml` 中指定相关的 intent queries 时，`Promise` 将 reject。类似地，在 iOS 上，如果你没有在 `Info.plist` 内的 `LSApplicationQueriesSchemes` 键中添加特定的 scheme，promise 将 reject（见下文）。

**参数：**

| 名称                                                     | 类型   | 描述      |
| -------------------------------------------------------- | ------ | ---------------- |
| url <div className="label basic required">必需</div> | string | 要打开的 URL。 |

> 对于 Web URL，必须相应地设置协议（`"http://"`, `"https://"`）！

> 此方法在 iOS 9+ 上有限制。来自 [官方 Apple 文档](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl)：
>
> - 如果你的应用链接的是较早版本的 iOS 但在 iOS 9.0 或更高版本上运行，你最多可以调用此方法 50 次。达到该限制后，后续调用始终 resolve 为 `false`。如果用户重新安装或升级应用，iOS 会重置限制。
>
> 自 iOS 9 起，你的应用还需要在 `Info.plist` 内提供 `LSApplicationQueriesSchemes` 键，否则 `canOpenURL()` 将始终 resolve 为 `false`。

> 当目标为 Android 11 (SDK 30) 时，你必须在 `AndroidManifest.xml` 中指定想要处理的 scheme 的 intents。常见 intents 列表可以在 [这里](https://developer.android.com/guide/components/intents-common) 找到。
>
> 例如，要处理 `https` schemes，需要将以下内容添加到你的 manifest 中：
>
> ```
> <manifest ...>
>     <queries>
>         <intent>
>             <action android:name="android.intent.action.VIEW" />
>             <data android:scheme="https"/>
>         </intent>
>     </queries>
> </manifest>
> ```

---

### `getInitialURL()`

```tsx
static getInitialURL(): Promise<string | null>;
```

如果应用启动是由应用链接触发的，它将提供链接 url，否则将提供 `null`。

> 要在 Android 上支持深链接，请参考 https://developer.android.com/training/app-indexing/deep-linking.html#handling-intents

> 当远程 JS 调试处于活动状态时，getInitialURL 可能返回 `null`。禁用调试器以确保它能被传递。

---

### `openSettings()`

```tsx
static openSettings(): Promise<void>;
```

打开设置应用并显示应用的自定义设置（如果有的话）。

---

### `openURL()`

```tsx
static openURL(url: string): Promise<any>;
```

尝试使用任何已安装的应用打开给定的 `url`。

你可以使用其他 URL，例如位置（例如 Android 上的 "geo:37.484847,-122.148386" 或 iOS 上的 "https://maps.apple.com/?ll=37.484847,-122.148386"）、联系人，或任何可以通过已安装应用打开的其他 URL。

该方法返回一个 `Promise` 对象。如果用户确认打开对话框或 url 自动打开，promise 将被 resolve。如果用户取消打开对话框或没有为该 url 注册的应用，promise 将被 reject。

**参数：**

| 名称                                                     | 类型   | 描述      |
| -------------------------------------------------------- | ------ | ---------------- |
| url <div className="label basic required">必需</div> | string | 要打开的 URL。 |

> 如果系统不知道如何打开指定的 URL，此方法将失败。如果你传递的是非 http(s) URL，最好先检查 `canOpenURL()`。

> 对于 Web URL，必须相应地设置协议（`"http://"`, `"https://"`）！

> 此方法在模拟器中的行为可能不同，例如 `"tel:"` 链接无法在 iOS 模拟器中处理，因为无法访问拨号器应用。

---

### `sendIntent()` <div className="label android">Android</div>

```tsx
static sendIntent(
  action: string,
  extras?: Array<{key: string; value: string | number | boolean}>,
): Promise<void>;
```

启动一个带有 extras 的 Android intent。

**参数：**

| 名称                                                        | 类型                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| action <div className="label basic required">必需</div> | string                                                     |
| extras                                                      | `Array<{key: string, value: string ｜ number ｜ boolean}>` |
