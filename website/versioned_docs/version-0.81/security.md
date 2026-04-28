---
id: security
title: 安全
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在构建应用时，安全性常常被忽视。确实，不可能构建出完全无法攻破的软件——毕竟，我们至今还没有发明出完全无法撬开的锁（银行金库终究还是会被撬开）。然而，遭受恶意攻击或暴露安全漏洞的概率，与您愿意投入多少精力来保护应用免受此类情况影响成反比。虽然普通挂锁可以被撬开，但要越过它仍然比掀开橱柜挂钩困难得多！

<img src="/docs/assets/d_security_chart.svg" width={283} alt=" " style={{float: 'right'}} />

在本指南中，您将了解存储敏感信息、身份验证、网络安全以及帮助您保护应用的工具方面的最佳实践。这不是一份起飞前检查清单——它是一个选项目录，其中每一项都将进一步帮助保护您的应用和用户。

## 存储敏感信息

切勿在应用代码中存储敏感的 API 密钥。代码中包含的任何内容，都可能被查看应用 bundle 的任何人以明文形式访问。像 [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) 和 [react-native-config](https://github.com/luggit/react-native-config/) 这样的工具非常适合添加诸如 API 端点之类的环境相关变量，但不要将它们与服务器端环境变量混淆，因为后者通常可能包含密钥和 API 密钥。

如果您必须拥有一个 API 密钥或某个密钥才能从应用访问某些资源，那么最安全的处理方式是，在应用和资源之间构建一层编排层。这可以是一个无服务器函数（例如使用 AWS Lambda 或 Google Cloud Functions），它可以携带所需的 API 密钥或密钥转发请求。服务器端代码中的密钥无法像应用代码中的密钥那样被 API 消费者访问。

**对于持久化的用户数据，请根据其敏感程度选择合适的存储类型。** 随着应用的使用，您通常会发现需要将数据保存在设备上，无论是为了支持应用离线使用、减少网络请求，还是为了在会话之间保存用户的访问令牌，这样他们就不必在每次使用应用时都重新进行身份验证。

:::info
**持久化 vs 非持久化** —— 持久化数据会写入设备磁盘，这使得应用可以在多次启动之间读取这些数据，而无需再次发起网络请求来获取它，或要求用户重新输入。但这也会使这些数据更容易被攻击者访问。非持久化数据绝不会写入磁盘——因此没有数据可供访问！
:::

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) 是一个由社区维护的 React Native 模块，提供异步、未加密的键值存储。Async Storage 不会在应用之间共享：每个应用都有自己的沙盒环境，无法访问其他应用的数据。

| **适合** 在以下情况下使用 async storage... | **不要** 将 async storage 用于... |
| --------------------------------------------- | ---------------------------------- |
| 在应用运行之间持久化非敏感数据               | 令牌存储                           |
| 持久化 Redux 状态                          | 密钥                             |
| 持久化 GraphQL 状态                       |                                    |
| 存储全局应用级变量                         |                                    |

#### 开发者注释

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::note
Async Storage 相当于 Web 端的 Local Storage
:::

</TabItem>
</Tabs>

### 安全存储

React Native 并未自带任何存储敏感数据的方式。不过，Android 和 iOS 平台已有现成的解决方案。

#### iOS - Keychain Services

[Keychain Services](https://developer.apple.com/documentation/security/keychain_services) 允许您安全地为用户存储少量敏感信息。这是存储证书、令牌、密码以及任何不适合放在 Async Storage 中的其他敏感信息的理想位置。

#### Android - Secure Shared Preferences

[Shared Preferences](https://developer.android.com/reference/android/content/SharedPreferences) 是 Android 中用于持久化键值数据存储的对应方案。**Shared Preferences 中的数据默认不会加密**，但 [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) 会对 Android 的 Shared Preferences 类进行包装，并自动加密键和值。

#### Android - Keystore

[Android Keystore](https://developer.android.com/training/articles/keystore) 系统可让您将加密密钥存储在容器中，从而更难从设备中提取。

要使用 iOS Keychain Services 或 Android Secure Shared Preferences，您可以自己编写桥接，或者使用一个为您封装这些功能并提供统一 API 的库，风险自负。可考虑的库包括：

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

:::warning[Caution]
**请注意不要无意中存储或暴露敏感信息。** 例如，可能会在不经意间发生：将敏感表单数据保存到 redux 状态，并将整个状态树持久化到 Async Storage；或者将用户令牌和个人信息发送到诸如 Sentry 或 Crashlytics 之类的应用监控服务。
:::

## 身份验证和深度链接

<img src="/docs/assets/d_security_deep-linking.svg" width={225} alt=" " style={{float: 'right', margin: '0 0 1em 1em'}} />

移动应用有一个 Web 中不存在的独特漏洞：**深度链接**。深度链接是一种从外部来源直接向原生应用发送数据的方式。深度链接看起来像 `app://`，其中 `app` 是您的应用 scheme，而 `//` 后面的任何内容都可在内部用于处理请求。

例如，如果您正在构建一个电商应用，您可以使用 `app://products/1` 将深度链接指向您的应用，并打开 id 为 1 的商品详情页。您可以把这类链接想象成 Web 上的 URL，但有一个关键区别：

深度链接并不安全，您绝不应在其中发送任何敏感信息。

深度链接不安全的原因在于，没有集中式的方法来注册 URL scheme。作为应用开发者，您几乎可以使用任何您选择的 url scheme，只需在 iOS 的 [Xcode 中进行配置](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app)，或在 Android 上 [添加一个 intent](https://developer.android.com/training/app-links/deep-linking)。

没有任何东西能阻止恶意应用通过注册相同的 scheme 来劫持您的深度链接，并获取链接中包含的数据。发送类似 `app://products/1` 的内容并无害处，但发送令牌则会带来安全风险。

当操作系统在打开链接时有两个或更多应用可供选择，Android 会向用户显示一个[消歧对话框](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog)，让他们选择用哪个应用打开链接。然而在 iOS 上，操作系统会替您做出选择，因此用户会毫不知情。苹果在后续 iOS 版本（iOS 11）中已采取措施解决这一问题，实施了先到先得原则，不过这一漏洞仍可能以不同方式被利用，您可以在[这里](https://thehackernews.com/2019/07/ios-custom-url-scheme.html)阅读更多相关内容。使用 [universal links](https://developer.apple.com/ios/universal-links/) 可以让您在 iOS 中安全地链接到应用内内容。

### OAuth2 和重定向

OAuth2 身份验证协议如今极受欢迎，自称是目前最完整、最安全的协议。OpenID Connect 协议也是基于它构建的。在 OAuth2 中，系统会要求用户通过第三方进行身份验证。验证成功后，该第三方会重定向回请求的应用，并携带一个验证代码，该代码可兑换为 JWT —— [JSON Web Token](https://jwt.io/introduction/)。JWT 是一种开放标准，用于在 Web 上各方之间安全地传输信息。

在 Web 上，这一步重定向是安全的，因为 Web 上的 URL 保证是唯一的。而在应用中并非如此，因为如前所述，没有集中式的方法来注册 URL scheme！为了解决这一安全问题，必须通过 PKCE 增加额外检查。

[PKCE](https://oauth.net/2/pkce/)，读作 “Pixy”，代表 Proof of Key Code Exchange，是 OAuth 2 规范的一个扩展。它通过增加额外一层安全保护，来验证身份验证请求和令牌交换请求来自同一个客户端。PKCE 使用 [SHA 256](https://www.movable-type.co.uk/scripts/sha256.html) 密码哈希算法。SHA 256 会为任意大小的文本或文件生成一个唯一的“签名”，但它具有以下特性：

- 无论输入文件如何，输出长度始终相同
- 保证对相同输入总是产生相同结果
- 单向（也就是说，无法逆向工程还原出原始输入）

现在您有了两个值：

- **code_verifier** - 由客户端生成的一大段随机字符串
- **code_challenge** - code_verifier 的 SHA 256 值

在最初的 `/authorize` 请求期间，客户端还会发送其保存在内存中的 `code_verifier` 对应的 `code_challenge`。在授权请求正确返回后，客户端还会发送用于生成 `code_challenge` 的 `code_verifier`。然后，IDP 会计算该 `code_challenge`，检查它是否与最初 `/authorize` 请求中设置的值匹配，只有当这些值匹配时才会发送访问令牌。

这保证了只有触发最初授权流程的应用，才能成功将验证代码兑换为 JWT。因此，即使恶意应用获取了验证代码，它本身也毫无用处。要了解其实际效果，请查看[这个示例](https://aaronparecki.com/oauth-2-simplified/#mobile-apps)。

原生 OAuth 可考虑使用的一个库是 [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)。React-native-app-auth 是一个用于与 OAuth2 提供方通信的 SDK。它封装了原生的 [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) 和 [AppAuth-Android](https://github.com/openid/AppAuth-Android) 库，并支持 PKCE。

:::note
只有在您的身份提供方支持 PKCE 的情况下，`react-native-app-auth` 才能支持 PKCE。
:::

![OAuth2 with PKCE](/docs/assets/diagram_pkce.svg)

## 网络安全

你的 API 应始终使用 [SSL 加密](https://www.ssl.com/faqs/faq-what-is-ssl/)。SSL 加密可防止所请求的数据在离开服务器到到达客户端之前以明文形式被读取。你可以通过端点以 `https://` 而不是 `http://` 开头来判断它是否安全。

### SSL 固定

使用 https 端点仍然可能使你的数据面临被拦截的风险。使用 https 时，只有当客户端能够提供由已预装在客户端上的受信任证书颁发机构签名的有效证书时，才会信任服务器。攻击者可以通过向用户设备安装恶意的根 CA 证书来利用这一点，这样客户端就会信任所有由攻击者签名的证书。因此，仅依赖证书仍然可能使你面临 [中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 的风险。

**SSL 固定** 是一种可在客户端用于避免此类攻击的技术。它通过在开发过程中将受信任证书列表嵌入（或固定）到客户端中来工作，这样只有使用受信任证书之一签名的请求才会被接受，而任何自签名证书都不会被接受。

:::warning[注意]
使用 SSL 固定时，你应当注意证书过期。证书每 1-2 年就会过期，当证书过期时，应用和服务器上的证书都需要更新。一旦服务器上的证书更新，所有嵌入了旧证书的应用都将停止工作。
:::

## 总结

没有一种万无一失的方法来处理安全问题，但只要有意识地努力并保持谨慎，就可以显著降低应用发生安全漏洞的可能性。应根据应用中存储数据的敏感程度、用户数量以及黑客获取账户访问权限后可能造成的损害，按比例投入安全建设。并且请记住：从一开始就没有请求过的信息，会显著更难被访问。
