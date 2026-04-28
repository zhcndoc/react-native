---
id: network
title: 网络连接
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

许多移动应用需要从远程 URL 加载资源。你可能想要向 REST API 发送 POST 请求，或者需要从另一台服务器获取一段静态内容。

## 使用 Fetch

React Native 提供了 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 以满足你的网络请求需求。如果你之前使用过 `XMLHttpRequest` 或其他网络 API，Fetch 会显得很熟悉。你可以参考 MDN 的指南 [使用 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 获取更多信息。

### 发起请求

要从任意 URL 获取内容，你可以将该 URL 传递给 fetch：

```tsx
fetch('https://mywebsite.com/mydata.json');
```

Fetch 还接受一个可选的第二个参数，允许你自定义 HTTP 请求。你可能想指定额外的请求头，或者发起 POST 请求：

```tsx
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

查看 [Fetch Request 文档](https://developer.mozilla.org/en-US/docs/Web/API/Request) 获取完整的属性列表。

### 处理响应

上面的示例展示了如何发起请求。在许多情况下，你会想对响应做一些处理。

网络请求本质上是异步操作。Fetch 方法会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这使得编写异步代码变得轻松：

```tsx
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

```tsx
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

别忘了捕获 `fetch` 可能抛出的错误，否则它们将被静默丢弃。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Fetch%20Example&ext=js
import React, {useEffect, useState} from 'react';
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
import React, {useEffect, useState} from 'react';
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
默认情况下，iOS 9.0 及以上版本强制执行应用传输安全性（App Transport Security，ATS）。ATS 要求所有 HTTP 连接必须使用 HTTPS。如果你需要从明文 URL（以 `http` 开头）获取数据，首先需要 [添加 ATS 异常](integration-with-existing-apps.md#test-your-integration)。如果你事先知道需要访问的域名，最好只为这些域名添加异常，这样更安全；如果直到运行时才知道域名，可以 [完全禁用 ATS](publishing-to-app-store.md#1-enable-app-transport-security)。不过请注意，从 2017 年 1 月起，[苹果应用商店审核将要求合理理由才能禁用 ATS](https://forums.developer.apple.com/thread/48979)。更多信息请参见 [苹果官方文档](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33)。
:::

:::tip
在 Android 中，从 API 级别 28 开始，默认也会阻止明文流量。你可以在应用的 manifest 文件中设置 [`android:usesCleartextTraffic`](https://developer.android.com/guide/topics/manifest/application-element#usesCleartextTraffic) 来覆盖该行为。
:::

## 使用其他网络库

React Native 内置了 [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)。这意味着你可以使用依赖它的第三方库，如 [frisbee](https://github.com/niftylettuce/frisbee) 或 [axios](https://github.com/axios/axios)，或者如果你愿意，也可以直接使用 XMLHttpRequest API。

```tsx
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

:::warning[Caution]
XMLHttpRequest 的安全模型与 Web 不同，因为原生应用中没有 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 的概念。
:::

## WebSocket 支持

React Native 也支持 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)，这是一种通过单个 TCP 连接提供全双工通信通道的协议。

```tsx
const ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // 连接已打开
  ws.send('something'); // 发送消息
};

ws.onmessage = e => {
  // 收到消息
  console.log(e.data);
};

ws.onerror = e => {
  // 出现错误
  console.log(e.message);
};

ws.onclose = e => {
  // 连接关闭
  console.log(e.code, e.reason);
};
```

## 关于 `fetch` 和基于 Cookie 的身份认证的已知问题

以下选项目前在 `fetch` 中不可用：

- `redirect:manual`
- `credentials:omit`

* 在 Android 上，拥有相同名称的请求头将只保留最新的一个。一个临时解决方案见这里：https://github.com/facebook/react-native/issues/18837#issuecomment-398779994。
* 基于 Cookie 的身份认证目前不稳定。相关问题可以查看这里：https://github.com/facebook/react-native/issues/23185。
* 至少在 iOS 上，当经过 `302` 重定向时，如果响应包含 `Set-Cookie` 头，则该 Cookie 无法正确设置。由于重定向无法手动处理，这可能导致如果重定向是因会话过期而导致的，产生无限请求的情况。

## 在 iOS 上配置 NSURLSession

对于某些应用，可能需要为 React Native 应用在 iOS 上底层使用的网络请求的 `NSURLSession` 提供自定义的 `NSURLSessionConfiguration`。例如，可能需要为所有来自应用的网络请求设置自定义用户代理字符串，或者为 `NSURLSession` 提供一个临时的 `NSURLSessionConfiguration`。函数 `RCTSetCustomNSURLSessionConfigurationProvider` 允许进行此类自定义。请记得在调用 `RCTSetCustomNSURLSessionConfigurationProvider` 的文件中添加如下导入：

```objectivec
#import <React/RCTHTTPRequestHandler.h>
```

应在应用生命周期的早期调用 `RCTSetCustomNSURLSessionConfigurationProvider`，以确保 React 需要时它已经可用，例如：

```objectivec
-(void)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // 设置 RCTSetCustomNSURLSessionConfigurationProvider
  RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
     NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
     // 配置 session
     return configuration;
  });

  // 设置 React
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
}
```