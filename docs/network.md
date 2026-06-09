---
id: network
title: 网络
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

许多移动应用需要从远程 URL 加载资源。你可能希望向 REST API 发起 POST 请求，或者需要从另一台服务器获取一段静态内容。

## 使用 Fetch

React Native 为你的网络需求提供了 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。如果你之前使用过 `XMLHttpRequest` 或其他网络 API，Fetch 会让你感到很熟悉。你可以参考 MDN 的 [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 指南以获取更多信息。

### 发起请求

要从任意 URL 获取内容，你可以将 URL 传递给 fetch：

```ts
fetch('https://mywebsite.com/mydata.json');
```

Fetch 还接受一个可选的第二个参数，用于自定义 HTTP 请求。你可以指定额外的请求头，或者发起一个 POST 请求：

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

完整的属性列表请查看 [Fetch Request docs](https://developer.mozilla.org/en-US/docs/Web/API/Request)。

### 处理响应

上面的示例展示了如何发起请求。在许多情况下，你还会希望对响应做一些处理。

网络本质上是一个异步操作。Fetch 方法会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这使得编写异步代码变得很直接：

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

不要忘记捕获 `fetch` 可能抛出的任何错误，否则它们会被静默丢弃。

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
默认情况下，iOS 9.0 或更高版本会强制启用 App Transport Security（ATS）。ATS 要求任何 HTTP 连接都必须使用 HTTPS。如果你需要从明文 URL（以 `http` 开头的 URL）获取内容，首先需要[添加一个 ATS 例外](integration-with-existing-apps.md#test-your-integration)。如果你提前知道需要访问哪些域名，最安全的做法是仅为这些域名添加例外；如果直到运行时才知道这些域名，你可以[完全禁用 ATS](publishing-to-app-store.md#1-enable-app-transport-security)。但请注意，从 2017 年 1 月起，[苹果 App Store 审核将要求对禁用 ATS 提供合理说明](https://forums.developer.apple.com/thread/48979)。更多信息请参阅 [Apple 的文档](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33)。
:::

:::tip
在 Android 上，从 API Level 28 开始，明文流量默认也会被阻止。可以通过在应用清单文件中设置 [`android:usesCleartextTraffic`](https://developer.android.com/guide/topics/manifest/application-element#usesCleartextTraffic) 来覆盖此行为。
:::

## 使用其他网络库

[XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 已内置于 React Native 中。这意味着你可以使用依赖它的第三方库，例如 [frisbee](https://github.com/niftylettuce/frisbee) 或 [axios](https://github.com/axios/axios)，或者如果你更喜欢，也可以直接使用 XMLHttpRequest API。

```ts
const request = new XMLHttpRequest();
request.onreadystatechange = e => {
  if (request.readyState !== 4) {
    return;
  }

  if (request.status === 200) {
    console.log('成功', request.responseText);
  } else {
    console.warn('错误');
  }
};

request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

:::warning 注意
XMLHttpRequest 的安全模型与 Web 上不同，因为原生应用中没有 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 这个概念。
:::

## WebSocket 支持

React Native 也支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)，这是一种通过单个 TCP 连接提供全双工通信通道的协议。

```ts
const ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // 连接已打开
  ws.send('something'); // 发送消息
};

ws.onmessage = e => {
  // 收到了一条消息
  console.log(e.data);
};

ws.onerror = e => {
  // 发生了错误
  console.log(e.message);
};

ws.onclose = e => {
  // 连接已关闭
  console.log(e.code, e.reason);
};
```

## `fetch` 和基于 cookie 的身份验证的已知问题

以下选项目前在 `fetch` 中无法正常工作

- `redirect:manual`
- `credentials:omit`

* 在 Android 上，具有相同名称的请求头最终只会保留最新的那个。临时解决方案可见于此处：https://github.com/facebook/react-native/issues/18837#issuecomment-398779994。
* 基于 cookie 的身份验证目前不稳定。你可以在此查看一些相关问题：https://github.com/facebook/react-native/issues/23185
* 至少在 iOS 上，通过 `302` 重定向时，如果存在 `Set-Cookie` 请求头，cookie 将无法正确设置。由于无法手动处理重定向，如果重定向是由于会话过期导致的，这可能会引发无限请求的情况。

## 在 iOS 上配置 NSURLSession

对于某些应用，可能需要为在 iOS 上运行的 React Native 应用中的网络请求所使用的底层 `NSURLSession` 提供自定义的 `NSURLSessionConfiguration`。例如，可能需要为来自应用的所有网络请求设置自定义的 user agent 字符串，或者向 `NSURLSession` 提供一个临时的 `NSURLSessionConfiguration`。函数 `RCTSetCustomNSURLSessionConfigurationProvider` 允许进行此类自定义。记得在调用 `RCTSetCustomNSURLSessionConfigurationProvider` 的文件中添加以下导入：

```objectivec
#import <React/RCTHTTPRequestHandler.h>
```

`RCTSetCustomNSURLSessionConfigurationProvider` 应尽早在应用生命周期中调用，以便在 React 需要时能够立即可用，例如：

```objectivec
-(void)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // 设置 RCTSetCustomNSURLSessionConfigurationProvider
  RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
     NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
     // 配置会话
     return configuration;
  });

  // 设置 React
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
}
```
