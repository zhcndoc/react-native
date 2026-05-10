---
id: linking
title: 关联
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Linking` 为你提供了一个通用接口，用于与应用的传入和传出链接交互。

每个链接（URL）都有一个 URL Scheme，一些网站以前缀 `https://` 或 `http://` 开头，其中 `http` 就是 URL Scheme。我们简称它为 scheme。

除了 `https`，你可能还熟悉 `mailto` scheme。当你打开一个使用 mailto scheme 的链接时，操作系统会打开已安装的邮件应用。同样地，也有用于拨打电话和发送短信的 scheme。下面可以阅读更多关于[内置 URL](#built-in-url-schemes) scheme 的内容。

和使用 mailto scheme 类似，也可以通过自定义 url scheme 链接到其他应用。例如，当你收到来自 Slack 的 **Magic Link** 邮件时，**Launch Slack** 按钮是一个锚点标签，其 href 类似于：`slack://secret/magic-login/other-secret`。和 Slack 一样，你可以告诉操作系统你希望处理一个自定义 scheme。当 Slack 应用打开时，它会接收用于打开它的 URL。这通常被称为深度链接。阅读更多关于如何将[深度链接](#get-the-deep-link)引入你的应用。

自定义 URL scheme 并不是在移动设备上打开应用的唯一方式。例如，如果你想通过邮件给某人发送一个链接，让其在移动端打开，那么使用自定义 URL scheme 并不理想，因为用户可能会在桌面端打开邮件，而此时链接无法工作。相反，你应该使用标准的 `https` 链接，例如 `https://www.myapp.io/records/1234546`。在移动端，这些链接可以被配置为打开你的应用。在 Android 上，这个功能称为 **Deep Links**，而在 iOS 上，它被称为 **Universal Links**。

### 内置 URL Schemes

如前言所述，每个平台都存在一些用于核心功能的 URL scheme。下面的列表并不完整，但涵盖了最常用的 scheme。

| Scheme           | 描述                                   | iOS | Android |
| ---------------- | -------------------------------------- | --- | ------- |
| `mailto`         | 打开邮件应用，例如：mailto: hello@world.dev | ✅  | ✅      |
| `tel`            | 打开电话应用，例如：tel:+123456789         | ✅  | ✅      |
| `sms`            | 打开短信应用，例如：sms:+123456789         | ✅  | ✅      |
| `https` / `http` | 打开网页浏览器应用，例如：https://expo.dev | ✅  | ✅      |

### 启用深度链接

<div className="banner-native-code-required">
  <h3>仅限包含原生代码的项目</h3>
  <p>以下部分仅适用于暴露了原生代码的项目。如果你正在使用托管的 Expo 工作流，请参阅 Expo 文档中关于 <a href="https://docs.expo.dev/guides/linking/">Linking</a> 的指南，以获取合适的替代方案。</p>
</div>

如果你想在应用中启用深度链接，请阅读下面的指南：

<Tabs groupId="syntax" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

:::info
有关如何在 Android 上添加对深度链接支持的说明，请参阅 [Enabling Deep Links for App Content - Add Intent Filters for Your Deep Links](https://developer.android.com/training/app-indexing/deep-linking.html#adding-filters)。
:::

如果你希望在现有的 MainActivity 实例中接收 intent，可以在 `AndroidManifest.xml` 中将 MainActivity 的 `launchMode` 设置为 `singleTask`。更多信息请参阅 [`<activity>`](https://developer.android.com/guide/topics/manifest/activity-element.html) 文档。

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
```

</TabItem>
<TabItem value="ios">

:::note
在 iOS 上，你需要按照[这里](linking-libraries-ios#step-3)第 3 步所述，将 `LinkingIOS` 文件夹添加到你的 header search paths 中。如果你还希望在应用运行期间监听传入的应用链接，则需要在你的 `*AppDelegate.m` 中添加以下代码行：

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

如果你的应用正在使用 [Universal Links](https://developer.apple.com/ios/universal-links/)，你还需要添加以下代码：

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

如果你的应用正在使用 [Universal Links](https://developer.apple.com/ios/universal-links/)，你还需要添加以下代码：

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

:::

</TabItem>
</Tabs>

### 处理深度链接

有两种方式来处理打开你应用的 URL。

#### 1. 如果应用已经打开，应用会被切到前台，并触发 Linking 的 'url' 事件

你可以使用 `Linking.addEventListener('url', callback)` 来处理这些事件——它会用链接的 URL 调用 `callback({url})`

#### 2. 如果应用尚未打开，它会被启动，并将 url 作为 initialURL 传入

你可以使用 `Linking.getInitialURL()` 来处理这些事件——如果存在 URL，它会返回一个解析为该 URL 的 Promise。

---

## 示例

### 打开链接和深度链接（Universal Links）

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    // 检查该链接是否支持自定义 URL scheme 链接。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 使用某个应用打开链接，如果 URL scheme 是 "http"，则应当由某个浏览器
      // 在移动设备中打开该网页链接
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开这个 URL：${url}`);
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
    // 检查该链接是否支持自定义 URL scheme 链接。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 使用某个应用打开链接，如果 URL scheme 是 "http"，则应当由某个浏览器
      // 在移动设备中打开该网页链接
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开这个 URL：${url}`);
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

### 获取深度链接

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
      // 获取用于打开应用的深度链接
      const initialUrl = await Linking.getInitialURL();

      // setTimeout 只是为了测试
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
          ? '正在处理来自深度链接的初始 url'
          : `深度链接是：${initialUrl || '无'}`}
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
      // 获取用于打开应用的深度链接
      const initialUrl = await Linking.getInitialURL();

      // setTimeout 只是为了测试
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
          ? '正在处理来自深度链接的初始 url'
          : `深度链接是：${initialUrl || '无'}`}
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
        电量使用概览
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
        电量使用概览
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

通过监听 `url` 事件类型并提供处理函数，为 Linking 变更添加一个处理函数。

---

### `canOpenURL()`

```tsx
static canOpenURL(url: string): Promise<boolean>;
```

判断已安装的应用是否可以处理给定的 URL。

该方法返回一个 `Promise` 对象。当确定给定的 URL 是否可被处理后，promise 会被解析，其第一个参数表示是否可以打开。

如果在 Android 上无法检查该 URL 是否可以打开，或者在目标为 Android 11（SDK 30）时你没有在 `AndroidManifest.xml` 中指定相关的 intent 查询，`Promise` 将会被拒绝。同样地，在 iOS 上，如果你没有在 `Info.plist` 中的 `LSApplicationQueriesSchemes` 键里添加特定的 scheme，promise 也会被拒绝（见下文）。

**参数：**

| 名称                                                     | 类型   | 描述         |
| -------------------------------------------------------- | ------ | ------------ |
| url <div className="label basic required">必填</div> | string | 要打开的 URL。 |

:::note
对于 Web URL，必须相应地设置协议（`"http://"`, `"https://"`）！
:::

:::warning
此方法在 iOS 9+ 上有一些限制。根据 [Apple 官方文档](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl)：

- 如果你的应用链接到了较早版本的 iOS，但运行在 iOS 9.0 或更高版本上，你最多可以调用此方法 50 次。达到该限制后，后续调用将始终解析为 `false`。如果用户重新安装或升级应用，iOS 会重置该限制。
- 从 iOS 9 开始，你的应用还需要在 `Info.plist` 中提供 `LSApplicationQueriesSchemes` 键，否则 `canOpenURL()` 将始终解析为 `false`。
  :::

:::info
当目标平台为 Android 11（SDK 30）时，你必须在 `AndroidManifest.xml` 中为你想要处理的 schemes 指定 intents。常见 intents 列表可在[这里](https://developer.android.com/guide/components/intents-common)找到。

例如，要处理 `https` schemes，需要将以下内容添加到你的 manifest 中：

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

如果应用启动是由 app link 触发的，它会返回该链接的 url，否则返回 `null`。

:::info
要在 Android 上支持深度链接，请参阅 https://developer.android.com/training/app-indexing/deep-linking.html#handling-intents。
:::

:::tip
当 Remote JS Debugging 处于活动状态时，`getInitialURL` 可能返回 `null`。请禁用调试器以确保它能够被传递。
:::

---

### `openSettings()`

```tsx
static openSettings(): Promise<void>;
```

打开设置应用，并显示该应用的自定义设置（如果有）。

---

### `openURL()`

```tsx
static openURL(url: string): Promise<any>;
```

尝试使用已安装的应用打开给定的 `url`。

你可以使用其他 URL，例如位置（如 Android 上的 `"geo:37.484847,-122.148386"` 或 iOS 上的 `"https://maps.apple.com/?ll=37.484847,-122.148386"`）、联系人，或任何其他可由已安装应用打开的 URL。

该方法返回一个 `Promise` 对象。如果用户确认打开对话框，或者 url 自动打开，promise 会被解析。如果用户取消打开对话框，或者没有已注册的应用可用于该 url，promise 会被拒绝。

**参数：**

| 名称                                                     | 类型   | 描述         |
| -------------------------------------------------------- | ------ | ------------ |
| url <div className="label basic required">必填</div> | string | 要打开的 URL。 |

:::note
如果系统不知道如何打开指定的 URL，此方法将失败。如果你传入的是非 http(s) URL，最好先检查 `canOpenURL()`。对于 Web URL，必须相应地设置协议（`"http://"`, `"https://"`）！
:::

:::warning
此方法在模拟器中的行为可能不同，例如在 iOS 模拟器中无法处理 `"tel:"` 链接，因为无法访问拨号器应用。
:::

---

### `sendIntent()` <div className="label android">Android</div>

```tsx
static sendIntent(
  action: string,
  extras?: Array<{key: string; value: string | number | boolean}>,
): Promise<void>;
```

使用 extras 启动一个 Android intent。

**参数：**

| 名称                                                        | 类型                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| action <div className="label basic required">必填</div> | string                                                     |
| extras                                                      | `Array<{key: string, value: string ｜ number ｜ boolean}>` |