---
id: network
title: 网络
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

许多移动应用需要从远程 URL 加载资源。你可能希望向 REST API 发起 POST 请求，或者可能需要从另一台服务器获取一段静态内容。

## 使用 Fetch

React Native 为你的网络需求提供了 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。如果你之前使用过 `XMLHttpRequest` 或其他网络 API，那么 Fetch 应该会让你感到熟悉。你可以参考 MDN 的 [使用 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 指南了解更多信息。

### 发起请求

为了从任意 URL 获取内容，你可以将 URL 传递给 fetch：

```ts
fetch('https://mywebsite.com/mydata.json');
```

Fetch 还接受一个可选的第二个参数，用于自定义 HTTP 请求。你可能希望指定额外的请求头，或发起 POST 请求：

```ts
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  }),
});
```

请查看 [Fetch Request 文档](https://developer.mozilla.org/en-US/docs/Web/API/Request)，了解完整的属性列表。

### 处理响应

上面的示例展示了如何发起请求。在许多情况下，你会希望对响应执行某些操作。

网络操作本质上是异步的。Fetch 方法会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，让你可以轻松编写以异步方式运行的代码：

```ts
const getMoviesFromApi = () => {
  return fetch('https://reactnative.dev/movies.json')
    .then(response => response.json())
    .then(json => {
      return json.movies;
    })
    .catch(error => {
      console.error(error);
    });
};
```

你也可以在 React Native 应用中使用 `async` / `await` 语法：

```ts
const getMoviesFromApiAsync = async () => {
  try {
    const response = await fetch(
      'https://reactnative.dev/movies.json',
    );
    const json = await response.json();
    return json.movies;
  } catch (error) {
    console.error(error);
  }
};
```

不要忘记捕获 `fetch` 可能抛出的任何错误，否则这些错误将被静默丢弃。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Fetch%20Example&ext=js
import {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <Text>
              {item.title}, {item.releaseYear}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Fetch%20Example&ext=tsx
import {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

type Movie = {
  id: string;
  title: string;
  releaseYear: string;
};

type MoviesResponse = {
  title: string;
  description: string;
  movies: Movie[];
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = (await response.json()) as MoviesResponse;
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <Text>
              {item.title}, {item.releaseYear}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;
```

</TabItem>
</Tabs>

:::info
默认情况下，iOS 9.0 或更高版本会强制执行 App Transport Security（ATS）。ATS 要求任何 HTTP 连接都使用 HTTPS。如果你需要从明文 URL（以 `http` 开头的 URL）获取内容，则首先需要[添加 ATS 例外](integration-with-existing-apps.md#test-your-integration)。如果你提前知道需要访问哪些域名，那么仅为这些域名添加例外会更加安全；如果直到运行时才能确定域名，则可以[完全禁用 ATS](publishing-to-app-store.md#1-enable-app-transport-security)。不过请注意，从 2017 年 1 月起，[Apple 的 App Store 审核将要求提供禁用 ATS 的合理说明](https://forums.developer.apple.com/thread/48979)。有关更多信息，请参阅 [Apple 的文档](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33)。
:::

:::tip
在 Android 上，自 API Level 28 起，默认也会阻止明文流量。可以通过在应用清单文件中设置 [`android:usesCleartextTraffic`](https://developer.android.com/guide/topics/manifest/application-element#usesCleartextTraffic) 来覆盖此行为。
:::

## 使用其他网络库

[XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 内置于 React Native 中。这意味着你可以使用依赖它的第三方库，例如 [frisbee](https://github.com/niftylettuce/frisbee) 或 [axios](https://github.com/axios/axios)，也可以根据偏好直接使用 XMLHttpRequest API。

```ts
const request = new XMLHttpRequest();
request.onreadystatechange = e => {
  if (request.readyState !== 4) {
    return;
  }

  if (request.status === 200) {
    console.log('success', request.responseText);
  } else {
    console.warn('error');
  }
};

request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

:::warning[Caution]
XMLHttpRequest 的安全模型与 Web 上的不同，因为原生应用中没有 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 这一概念。
:::

## WebSocket 支持

React Native 还支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)，这是一种通过单个 TCP 连接提供全双工通信通道的协议。

```ts
const ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // connection opened
  ws.send('something'); // send a message
};

ws.onmessage = e => {
  // a message was received
  console.log(e.data);
};

ws.onerror = e => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = e => {
  // connection closed
  console.log(e.code, e.reason);
};
```

## `fetch` 和基于 Cookie 的身份验证的已知问题

以下选项目前无法与 `fetch` 一起使用

- `redirect:manual`
- `credentials:omit`

* 在 Android 上使用同名请求头会导致最终只保留最新的请求头。可以在这里找到临时解决方案：https://github.com/facebook/react-native/issues/18837#issuecomment-398779994。
* 基于 Cookie 的身份验证目前不稳定。你可以在这里查看一些已提出的问题：https://github.com/facebook/react-native/issues/23185
* 至少在 iOS 上，当通过 `302` 重定向且存在 `Set-Cookie` 请求头时，Cookie 不会被正确设置。由于无法手动处理重定向，如果重定向是由会话过期导致的，这可能会造成无限请求。

## 在 iOS 上配置 NSURLSession

对于某些应用来说，为在 iOS 上运行的 React Native 应用中的网络请求所使用的底层 `NSURLSession` 提供自定义的 `NSURLSessionConfiguration` 可能是合适的。例如，可能需要为来自应用的所有网络请求设置自定义 user agent 字符串，或者向 `NSURLSession` 提供一个临时的 `NSURLSessionConfiguration`。函数 `RCTSetCustomNSURLSessionConfigurationProvider` 支持此类自定义。请记得将以下导入语句添加到调用 `RCTSetCustomNSURLSessionConfigurationProvider` 的文件中：

```objectivec
#import <React/RCTHTTPRequestHandler.h>
```

应在应用生命周期的早期调用 `RCTSetCustomNSURLSessionConfigurationProvider`，以便 React 需要时能够立即使用，例如：

```objectivec
-(void)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // set RCTSetCustomNSURLSessionConfigurationProvider
  RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
     NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
     // configure the session
     return configuration;
  });

  // set up React
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
}
```
