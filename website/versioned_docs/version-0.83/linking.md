---
id: linking
title: 链接
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`Linking` 提供了一个通用接口，用于处理应用程序的传入和传出链接。

每个链接（URL）都有一个 URL 方案（URL Scheme），有些网站以 `https://` 或 `http://` 开头，其中的 `http` 就是 URL 方案。我们简称为方案（scheme）。

除了 `https`，你可能也熟悉 `mailto` 方案。当你打开一个 mailto 方案的链接时，操作系统会打开已安装的邮件应用程序。同样，通话和短信也有对应的方案。更多关于[内置 URL 方案](#built-in-url-schemes) 的内容请见下文。

像使用 mailto 方案一样，你也可以通过自定义 URL 方案链接到其他应用。例如，当你收到 Slack 的 **Magic Link** 邮件时，**Launch Slack** 按钮是一个带 href 的锚点标签，形式类似：`slack://secret/magic-login/other-secret`。通过 Slack，系统知道你想处理一个自定义方案。当 Slack 应用打开时，会接收到打开它的 URL。这通常称为深度链接。查看更多关于如何[获取应用的深度链接](#get-the-deep-link)。

自定义 URL 方案并不是在移动端打开应用的唯一方式。例如，如果你想给某人发送一个链接并期望在移动设备打开，使用自定义 URL 方案并不理想，因为用户可能在桌面打开邮件，此时链接无法使用。相反，你应该使用标准的 `https` 链接，如 `https://www.myapp.io/records/1234546`。这些链接在移动端可以配置为打开你的应用。Android 上，这个功能称为 **深度链接（Deep Links）**，而在 iOS 上称为 **通用链接（Universal Links）**。

### 内置 URL 方案

如前言所述，每个平台都内置了一些核心功能的 URL 方案。以下是一个非详尽列表，但涵盖了最常用的方案。

| 方案               | 描述                                      | iOS | Android |
| ------------------ | ----------------------------------------- | --- | ------- |
| `mailto`           | 打开邮件应用，例如：mailto: hello@world.dev | ✅  | ✅      |
| `tel`              | 打开电话应用，例如：tel:+123456789         | ✅  | ✅      |
| `sms`              | 打开短信应用，例如：sms:+123456789         | ✅  | ✅      |
| `https` / `http`   | 打开网页浏览器，例如：https://expo.dev     | ✅  | ✅      |

### 启用深度链接

<div className="banner-native-code-required">
  <h3>仅限含原生代码的项目</h3>
  <p>以下部分仅适用于暴露原生代码的项目。如果你使用的是 Expo 托管工作流，请参见 Expo 文档中关于 <a href="https://docs.expo.dev/guides/linking/">链接</a> 的指南，获取适用的替代方案。</p>
</div>

如果你想在应用中启用深度链接，请阅读下面的指南：

<Tabs groupId="syntax" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

:::info
关于如何在 Android 上添加深度链接支持，请参考 [启用应用内容的深度链接 - 为深度链接添加意图过滤器](https://developer.android.com/training/app-indexing/deep-linking.html#adding-filters)。
:::

如果你希望在已存在的 MainActivity 实例中接收 intent，可以在 `AndroidManifest.xml` 中将 MainActivity 的 `launchMode` 设置为 `singleTask`。详细信息请参阅 [`<activity>`](https://developer.android.com/guide/topics/manifest/activity-element.html) 文档。

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
```

</TabItem>
<TabItem value="ios">

:::note
在 iOS 上，你需要将 `LinkingIOS` 文件夹添加到头文件搜索路径中，具体步骤请见 [这里第3步](linking-libraries-ios#step-3)。如果你还想在应用执行过程中监听传入的应用链接，需要在你的 `*AppDelegate.m` 中添加以下代码：

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

如果你的应用使用了[通用链接](https://developer.apple.com/ios/universal-links/)，还需添加以下代码：

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

如果你的应用使用了[通用链接](https://developer.apple.com/ios/universal-links/)，还需添加以下代码：

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

有两种方式处理打开你的应用的 URL。

#### 1. 如果应用已打开，应用被切换到前台，并触发 Linking 的 'url' 事件

你可以用 `Linking.addEventListener('url', callback)` 来处理这个事件 —— 它会传入 `callback({url})`，其中的 `url` 即链接的 URL。

#### 2. 如果应用尚未打开，应用被启动并传入初始 URL

你可以用 `Linking.getInitialURL()` 来处理 —— 它返回一个 Promise，解析后为 URL（如果有的话）。

---

## 示例

### 打开链接和深度链接（通用链接）

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Linking%20Example&supportedPlatforms=ios,android&ext=js
import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    // 检查链接是否支持自定义 URL 方案。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 尝试用相关应用打开链接。如果 URL 方案是 "http"，则会用移动设备上的浏览器打开网页链接。
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开该 URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>打开支持的 URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>打开不支持的 URL</OpenURLButton>
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
    // 检查链接是否支持自定义 URL 方案。
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 尝试用相关应用打开链接。如果 URL 方案是 "http"，则会用移动设备上的浏览器打开网页链接。
      await Linking.openURL(url);
    } else {
      Alert.alert(`不知道如何打开该 URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const App = () => {
  return (
    <View style={styles.container}>
      <OpenURLButton url={supportedURL}>打开支持的 URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>打开不支持的 URL</OpenURLButton>
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
    // 如果应用有自定义设置，则打开该设置界面
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
    // 如果应用有自定义设置，则打开该设置界面
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
  const [url, setUrl] = React.useState(null);
  const [processing, setProcessing] = React.useState(true);

  React.useEffect(() => {
    const getUrlAsync = async () => {
      // 获取用于打开应用的深度链接
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
          ? '正在处理来自深度链接的初始 URL'
          : `深度链接为: ${initialUrl || '无'}`}
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
          ? '正在处理来自深度链接的初始 URL'
          : `深度链接为: ${initialUrl || '无'}`}
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

### 发送 Intent（仅限 Android）

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
        电量使用摘要
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
        电量使用摘要
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

通过监听 `url` 事件类型并提供对应处理函数，为 Linking 变化添加处理器。

---

### `canOpenURL()`

```tsx
static canOpenURL(url: string): Promise<boolean>;
```

确定设备上是否有应用可处理给定的 URL。

该方法返回一个 `Promise` 对象。当确定是否可以处理给定的 URL 时，Promise 被解析，传入第一个参数代表是否可打开。

如果无法检查 URL 是否可打开，或者在 Android 11（SDK 30）及以上版本未在 `AndroidManifest.xml` 中指定相关意图查询，Android 上的 Promise 会被拒绝。类似地，如果你未在 iOS 的 `Info.plist` 文件中添加 `LSApplicationQueriesSchemes` 键，iOS 上的 Promise 也会被拒绝。详见下文。

**参数:**

| 名称                                                     | 类型   | 说明             |
| -------------------------------------------------------- | ------ | ---------------- |
| url <div className="label basic required">必填</div>      | string | 要打开的 URL  |

:::note
对于网页 URL，协议（`"http://"`、`"https://"`）必须正确设置！
:::

:::warning
此方法在 iOS 9+ 有限制。根据 [苹果官方文档](https://developer.apple.com/documentation/uikit/uiapplication/1622952-canopenurl):

- 如果你的应用针对早期 iOS 版本构建，但运行在 iOS 9.0 或更高版本，最多可调用此方法 50 次。达到限制后，后续调用始终返回 `false`。当用户重新安装或升级应用时，iOS 会重置计数。
- 从 iOS 9 起，应用需要在 `Info.plist` 中提供 `LSApplicationQueriesSchemes` 键，否则 `canOpenURL()` 总是返回 `false`。
  :::

:::info
针对 Android 11（SDK 30）及以上，必须在 `AndroidManifest.xml` 中指定你想处理的方案对应的意图查询。你可以在[这里](https://developer.android.com/guide/components/intents-common)找到常见意图列表。

例如，若要处理 `https` 方案，需在清单文件中添加如下内容：

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

如果应用启动是由应用链接触发，则返回链接 URL；否则返回 `null`。

:::info
关于在 Android 上支持深度链接，请参见 https://developer.android.com/training/app-indexing/deep-linking.html#handling-intents。
:::

:::tip
当启用远程 JS 调试时，`getInitialURL` 可能返回 `null`。禁用调试以确保参数传递。
:::

---

### `openSettings()`

```tsx
static openSettings(): Promise<void>;
```

打开系统的设置应用，并显示当前应用的自定义设置（如果有）。

---

### `openURL()`

```tsx
static openURL(url: string): Promise<any>;
```

尝试用已安装的应用打开给定的 `url`。

你可以传入其他 URL，比如定位（例如安卓上的 `"geo:37.484847,-122.148386"` 或 iOS 上的 `"https://maps.apple.com/?ll=37.484847,-122.148386"`）、联系人或任何能被已安装应用打开的 URL。

该方法返回 Promise。若用户确认打开或 URL 自动打开，Promise 解析；若用户取消或系统中无对应应用，Promise 拒绝。

**参数:**

| 名称                                                     | 类型   | 说明             |
| -------------------------------------------------------- | ------ | ---------------- |
| url <div className="label basic required">必填</div>      | string | 要打开的 URL  |

:::note
如果系统不知道如何打开指定 URL，此方法会失败。使用非 http(s) URL 时，最好先检测 `canOpenURL()`。对于网页 URL，协议（`"http://"`, `"https://"`) 必须正确设置！
:::

:::warning
该方法在模拟器上表现可能不同，例如 iOS 模拟器无法处理 `"tel:"` 链接，因为无法访问拨号应用。
:::

---

### `sendIntent()` <div className="label android">Android</div>

```tsx
static sendIntent(
  action: string,
  extras?: Array<{key: string; value: string | number | boolean}>,
): Promise<void>;
```

启动 Android Intent，并附带额外参数。

**参数:**

| 名称                                                        | 类型                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| action <div className="label basic required">必填</div>       | string                                                     |
| extras                                                      | `Array<{key: string, value: string ｜ number ｜ boolean}>` |