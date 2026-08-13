---
id: linking
title: 链接
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Linking` 为你提供了一个通用接口，用于处理传入和传出的应用链接

每个 Link（URL）都有一个 URL Scheme，一些网站的前缀是 `https://` 或 `http://`，其中的 `http` 就是 URL Scheme。为了简便起见，我们称之为 scheme

除了 `https`，你可能也熟悉 `mailto` scheme。当你打开一个使用 mailto scheme 的链接时，操作系统会打开已安装的邮件应用。同样，还有用于拨打电话和发送 SMS 的 scheme。请在下方阅读更多关于[内置 URL scheme](#built-in-url-schemes) 的内容

与使用 mailto scheme 类似，你可以使用自定义 url scheme 链接到其他应用。例如，当你收到来自 Slack 的 **Magic Link** 电子邮件时，**Launch Slack** 按钮是一个锚点标签，其 href 看起来类似于：`slack://secret/magic-login/other-secret`。与 Slack 一样，你可以告知操作系统你希望处理某个自定义 scheme。当 Slack 应用打开时，它会接收到用于打开它的 URL。这通常称为深度链接。请阅读更多关于如何将[深度链接](#get-the-deep-link)获取到应用中的内容

自定义 URL scheme 并不是在移动设备上打开应用的唯一方式。例如，如果你想通过电子邮件发送一个链接，让某人在移动设备上打开，那么使用自定义 URL scheme 并不理想，因为用户可能会在桌面设备上打开电子邮件，此时链接将无法正常工作。相反，你应该使用标准的 `https` 链接，例如 `https://www.myapp.io/records/1234546`。在移动设备上，可以将这些链接配置为打开你的应用。在 Android 上，此功能称为 **Deep Links**，而在 iOS 上则称为 **Universal Links**

### 内置 URL Scheme

如介绍中所述，每个平台上都存在一些用于核心功能的 URL scheme。以下并非完整列表，但涵盖了最常用的 scheme

| Scheme           | 描述                                        | iOS | Android |
| ---------------- | ------------------------------------------- | --- | ------- |
| `mailto`         | 打开邮件应用，例如：mailto: hello@world.dev | ✅  | ✅      |
| `tel`            | 打开电话应用，例如：tel:+123456789          | ✅  | ✅      |
| `sms`            | 打开 SMS 应用，例如：sms:+123456789         | ✅  | ✅      |
| `https` / `http` | 打开 Web 浏览器应用，例如：https://expo.dev | ✅  | ✅      |

### 启用深度链接

<div className="banner-native-code-required">
  <h3>仅包含 Native Code 的项目</h3>
  <p>以下部分仅适用于已公开 Native Code 的项目。如果你使用的是托管式 Expo 工作流，请参阅 Expo 文档中关于<a href="https://docs.expo.dev/guides/linking/">Linking</a>的指南，以了解适用的替代方案</p>
</div>

如果你想在应用中启用深度链接，请阅读以下指南：

<Tabs groupId="syntax" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

:::info
有关如何在 Android 上添加深度链接支持的说明，请参阅[为应用内容启用深度链接——为深度链接添加 Intent Filters](https://developer.android.com/training/app-indexing/deep-linking.html#adding-filters)
:::

如果你希望在 MainActivity 的现有实例中接收 intent，可以在 `AndroidManifest.xml` 中将 MainActivity 的 `launchMode` 设置为 `singleTask`。有关更多信息，请参阅 [`<activity>`](https://developer.android.com/guide/topics/manifest/activity-element.html) 文档

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
```

</TabItem>
<TabItem value="ios">

:::note
在 iOS 上，你需要按照[此处](linking-libraries-ios#step-3)步骤 3 中的说明，将 `LinkingIOS` 文件夹添加到 header 搜索路径中。如果你还希望在应用运行期间监听传入的应用链接，则需要将以下代码行添加到你的 `*AppDelegate.m` 中：

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

```objc title="AppDelegate.mm"
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

如果你的应用使用了 [Universal Links](https://developer.apple.com/ios/universal-links/)，还需要添加以下代码：

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
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}
```

如果你的应用使用了 [Universal Links](https://developer.apple.com/ios/universal-links/)，还需要添加以下代码：

```swift title="AppDelegate.swift"
func application(
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

:::

</TabItem>
</Tabs>

### 处理深度链接

处理打开应用的 URL 有两种方式

#### 1. 如果应用已经打开，应用会进入前台，并触发 Linking 的 `url` 事件

你可以使用 `Linking.addEventListener('url', callback)` 处理这些事件——它会使用关联的 URL 调用 `callback({url})`

#### 2. 如果应用尚未打开，应用会被打开，并将 url 作为 initialURL 传入

你可以使用 `Linking.getInitialURL()` 处理这些事件——它会返回一个 Promise；如果存在 URL，该 Promise 会解析为这个 URL

---

## 示例

### 打开链接和深度链接（Universal Links）

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton>
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
import {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

type OpenURLButtonProps = {
  url: string;
  children: string;
};

const OpenURLButton = ({url, children}: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton>
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
import {useCallback} from 'react';
import {Button, Linking, StyleSheet, View} from 'react-native';

const OpenSettingsButton = ({children}) => {
  const handlePress = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenSettingsButton>Open Settings</OpenSettingsButton>
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
import {useCallback} from 'react';
import {Button, Linking, StyleSheet, View} from 'react-native';

type OpenSettingsButtonProps = {
  children: string;
};

const OpenSettingsButton = ({children}: OpenSettingsButtonProps) => {
  const handlePress = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenSettingsButton>Open Settings</OpenSettingsButton>
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

### 获取深度链接

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import {useState, useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
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
          ? 'Processing the initial url from a deep link'
          : `The deep link is: ${initialUrl || 'None'}`}
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
import {useState, useEffect} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
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
          ? 'Processing the initial url from a deep link'
          : `The deep link is: ${initialUrl || 'None'}`}
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

### 发送 Intent（Android）

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=android&ext=js
import {useCallback} from 'react';
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
        Power Usage Summary
      </SendIntentButton>
      <SendIntentButton
        action="android.settings.APP_NOTIFICATION_SETTINGS"
        extras={[
          {
            key: 'android.provider.extra.APP_PACKAGE',
            value: 'com.facebook.katana',
          },
        ]}>
        App Notification Settings
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
import {useCallback} from 'react';
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
        Power Usage Summary
      </SendIntentButton>
      <SendIntentButton
        action="android.settings.APP_NOTIFICATION_SETTINGS"
        extras={[
          {
            key: 'android.provider.extra.APP_PACKAGE',
            value: 'com.facebook.katana',
          },
        ]}>
        App Notification Settings
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

通过监听 `url` 事件类型并提供处理程序，为 Linking 的变化添加处理程序

---

### `canOpenURL()`

```tsx
static canOpenURL(url: string): Promise<boolean>;
```

确定已安装的应用是否可以处理给定的 URL

该方法返回一个 `Promise` 对象。当确定给定 URL 是否可以被处理后，promise 会完成，并且第一个参数表示该 URL 是否可以打开

如果无法检查 URL 是否可以打开，或者在目标 Android 11（SDK 30）时未在 `AndroidManifest.xml` 中指定相关的 intent 查询，`Promise` 将在 Android 上拒绝。类似地，在 iOS 上，如果你未在 `Info.plist` 中的 `LSApplicationQueriesSchemes` 键中添加特定 scheme，promise 也会拒绝（见下文）

**参数：**

| 名称                                                 | 类型   | 描述         |
| ---------------------------------------------------- | ------ | ------------ |
| url <div className="label basic required">必需</div> | string | 要打开的 URL |

:::note
对于 Web URL，必须正确设置协议（`"http://"`、`"https://"`）！
:::

:::warning
此方法在 iOS 9 及更高版本上存在限制。根据 [Apple 官方文档](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl)：

- 如果你的应用针对早期版本的 iOS 构建，但运行在 iOS 9.0 或更高版本上，则最多可以调用此方法 50 次。达到此限制后，后续调用始终会解析为 `false`。如果用户重新安装或升级应用，iOS 会重置该限制
- 从 iOS 9 开始，你的应用还需要在 `Info.plist` 中提供 `LSApplicationQueriesSchemes` 键，否则 `canOpenURL()` 始终会解析为 `false`
  :::

:::info
当目标为 Android 11（SDK 30）时，你必须在 `AndroidManifest.xml` 中指定要处理的 scheme 对应的 intents。可以在[这里](https://developer.android.com/guide/components/intents-common)找到常见 intent 的列表

例如，要处理 `https` scheme，需要将以下内容添加到 manifest 中：

```
<manifest ...>
  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW" />
      <data android:scheme="https"/>
    </intent>
  </queries>
</manifest>
```

:::

---

### `getInitialURL()`

```tsx
static getInitialURL(): Promise<string | null>;
```

如果应用启动是由应用链接触发的，它会提供链接 URL，否则会提供 `null`

:::info
要在 Android 上支持深度链接，请参阅 https://developer.android.com/training/app-indexing/deep-linking.html#handling-intents
:::

:::tip
启用 Remote JS Debugging 时，`getInitialURL` 可能会返回 `null`。请禁用调试器，以确保它能够被传递
:::

---

### `openSettings()`

```tsx
static openSettings(): Promise<void>;
```

打开 Settings 应用，并显示应用的自定义设置（如果有）

---

### `openURL()`

```tsx
static openURL(url: string): Promise<any>;
```

尝试使用任意已安装的应用打开给定的 `url`

你可以使用其他 URL，例如位置（在 Android 上使用 `"geo:37.484847,-122.148386"`，或在 iOS 上使用 `"https://maps.apple.com/?ll=37.484847,-122.148386"`）、联系人，或任何可以通过已安装应用打开的其他 URL

该方法返回一个 `Promise` 对象。如果用户确认打开对话框，或者 URL 自动打开，则 promise 会完成。如果用户取消打开对话框，或者没有为该 URL 注册应用，则 promise 会拒绝

**参数：**

| 名称                                                 | 类型   | 描述         |
| ---------------------------------------------------- | ------ | ------------ |
| url <div className="label basic required">必需</div> | string | 要打开的 URL |

:::note
如果系统不知道如何打开指定的 URL，此方法将失败。如果你传入的是非 http(s) URL，最好先检查 `canOpenURL()`。对于 Web URL，必须正确设置协议（`"http://"`、`"https://"`）！
:::

:::warning
此方法在模拟器中的行为可能有所不同，例如 `"tel:"` 链接无法在 iOS 模拟器中处理，因为模拟器无法访问拨号应用
:::

---

### `sendIntent()` <div className="label android">Android</div>

```tsx
static sendIntent(
  action: string,
  extras?: Array<{key: string; value: string | number | boolean}>,
): Promise<void>;
```

使用 extras 启动 Android intent

**参数：**

| 名称                                                    | 类型                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------- |
| action <div className="label basic required">必需</div> | string                                                     |
| extras                                                  | `Array<{key: string, value: string ｜ number ｜ boolean}>` |
