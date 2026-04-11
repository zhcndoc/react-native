---
id: network
title: 网络
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

许多移动应用需要从远程 URL 加载资源。你可能想要向 REST API 发起 POST 请求，或者可能需要从另一台服务器获取一块静态内容。

## 使用 Fetch

React Native 为你的网络需求提供了 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。如果你以前使用过 `XMLHttpRequest` 或其他网络 API，Fetch 看起来很熟悉。你可以参考 MDN 关于 [使用 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 的指南获取更多信息。

### 发起请求

为了从任意 URL 获取内容，你可以将 URL 传递给 fetch：

```tsx
fetch('https://mywebsite.com/mydata.json');
```

Fetch 还接受一个可选的第二个参数，允许你自定义 HTTP 请求。你可能想要指定额外的头部，或发起 POST 请求：

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

查看 [Fetch Request 文档](https://developer.mozilla.org/en-US/docs/Web/API/Request) 获取属性的完整列表。

### 处理响应

上面的示例展示了如何发起请求。在许多情况下，你将对响应做一些处理。

网络操作本质上是异步的。Fetch 方法将返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这使得编写异步方式的代码变得简单：

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

别忘了捕获 `fetch` 可能抛出的任何错误，否则它们将被静默丢弃。

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

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

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
</Tabs>

> 默认情况下，iOS 9.0 或更高版本强制实行应用传输安全 (ATS)。ATS 要求任何 HTTP 连接使用 HTTPS。如果你需要从明文 URL（以 `http` 开头）获取，你将首先需要 [添加 ATS 例外](integration-with-existing-apps.md#test-your-integration)。如果你提前知道需要访问哪些域名，仅为这些域名添加例外更安全；如果域名直到运行时才知道，你可以 [完全禁用 ATS](publishing-to-app-store.md#1-enable-app-transport-security)。但请注意，从 2017 年 1 月起，[Apple 的 App Store 审核将需要合理的理由来禁用 ATS](https://forums.developer.apple.com/thread/48979)。参见 [Apple 的文档](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) 获取更多信息。

> 在 Android 上，截至 API Level 28，明文流量默认也被阻止。此行为可以通过在应用清单文件中设置 [`android:usesCleartextTraffic`](https://developer.android.com/guide/topics/manifest/application-element#usesCleartextTraffic) 来覆盖。

## 使用其他网络库

[XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 内置于 React Native 中。这意味着你可以使用依赖它的第三方库，例如 [frisbee](https://github.com/niftylettuce/frisbee) 或 [axios](https://github.com/axios/axios)，或者如果你愿意，可以直接使用 XMLHttpRequest API。

```tsx
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

> XMLHttpRequest 的安全模型与 Web 不同，因为在原生应用中没有 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 的概念。

## WebSocket 支持

React Native 也支持 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)，这是一种通过单个 TCP 连接提供全双通信信道的协议。

```tsx
const ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // 连接打开
  ws.send('something'); // 发送消息
};

ws.onmessage = e => {
  // 收到消息
  console.log(e.data);
};

ws.onerror = e => {
  // 发生错误
  console.log(e.message);
};

ws.onclose = e => {
  // 连接关闭
  console.log(e.code, e.reason);
};
```

## `fetch` 和基于 cookie 的身份验证的已知问题

以下选项目前不适用于 `fetch`

- `redirect:manual`
- `credentials:omit`

* 在 Android 上具有相同名称的头部将导致只存在最后一个。临时解决方案可以在这里找到：https://github.com/facebook/react-native/issues/18837#issuecomment-398779994。
* 基于 cookie 的身份验证目前不稳定。你可以查看这里提出的一些问题：https://github.com/facebook/react-native/issues/23185
* 至少在 iOS 上，当通过 `302` 重定向时，如果存在 `Set-Cookie` 头部，cookie 未正确设置。由于重定向无法手动处理，如果重定向是会话过期的结果，这可能会导致发生无限请求的情况。

## 在 iOS 上配置 NSURLSession

对于某些应用，可能需要为底层 `NSURLSession` 提供自定义 `NSURLSessionConfiguration`，该 `NSURLSession` 用于在 iOS 上运行的 React Native 应用中的网络请求。例如，可能需要为来自应用的所有网络请求设置自定义用户代理字符串，或为 `NSURLSession` 提供临时的 `NSURLSessionConfiguration`。函数 `RCTSetCustomNSURLSessionConfigurationProvider` 允许此类自定义。记得将以下导入添加到调用 `RCTSetCustomNSURLSessionConfigurationProvider` 的文件中：

```objectivec
#import <React/RCTHTTPRequestHandler.h>
```

`RCTSetCustomNSURLSessionConfigurationProvider` 应该在应用生命周期早期调用，以便在 React 需要时立即可用，例如：

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
