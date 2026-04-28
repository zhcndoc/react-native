---
id: security
title: 安全
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在构建应用时，安全性常常被忽视。确实，不可能构建出完全无法渗透的软件——毕竟我们还没有发明出完全无法撬开的锁（银行金库毕竟还是会被闯入）。然而，遭受恶意攻击或暴露安全漏洞的概率，与您愿意投入多少精力来保护应用免受此类事件影响成反比。虽然普通挂锁可以被撬开，但要绕过它仍然比打开橱柜门钩要困难得多！

<img src="/docs/assets/d_security_chart.svg" width={283} alt=" " style={{float: 'right'}} />

在本指南中，您将了解有关存储敏感信息、身份验证、网络安全以及帮助您保护应用的工具的最佳实践。这不是一份起飞前检查清单——而是一个选项目录，每一种选项都将进一步帮助保护您的应用和用户。

## 存储敏感信息

绝不要在应用代码中存储敏感 API 密钥。代码中包含的任何内容，都可能被查看应用 bundle 的任何人以明文形式访问。像 [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) 和 [react-native-config](https://github.com/luggit/react-native-config/) 这样的工具非常适合添加诸如 API 端点之类的环境变量，但不要将它们与服务器端环境变量混淆，因为后者通常可能包含密钥和 API 密钥。

如果您必须拥有一个 API 密钥或某个秘密来从应用中访问某些资源，那么最安全的处理方式是在您的应用与该资源之间构建一层编排层。这可以是一个无服务器函数（例如使用 AWS Lambda 或 Google Cloud Functions），它可以携带所需的 API 密钥或秘密转发请求。服务器端代码中的密钥无法像应用代码中的密钥那样被 API 消费者访问。

**对于持久化的用户数据，请根据其敏感性选择合适的存储类型。** 随着应用的使用，您经常会发现需要将数据保存在设备上，无论是为了支持离线使用、减少网络请求，还是为了在会话之间保存用户的访问令牌，以便他们每次使用应用时都不必重新认证。

:::info
**持久化 vs 非持久化** — 持久化数据会写入设备磁盘，这样应用就可以在应用启动之间读取这些数据，而无需再次发起网络请求来获取它，或要求用户重新输入。不过，这也会使这些数据更容易被攻击者访问。非持久化数据不会写入磁盘——因此没有数据可供访问！
:::

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) 是一个由社区维护的 React Native 模块，提供异步、未加密的键值存储。Async Storage 不会在应用之间共享：每个应用都有自己的沙盒环境，并且无法访问其他应用的数据。

| **应该** 在以下情况下使用 async storage... | **不应该** 将 async storage 用于... |
| --------------------------------------------- | ---------------------------------- |
| 在应用运行之间持久化非敏感数据                 | 令牌存储                         |
| 持久化 Redux 状态                             | 密钥                            |
| 持久化 GraphQL 状态                           |                                    |
| 存储全局应用级变量                             |                                    |

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::note
Async Storage 相当于 web 中的 Local Storage
:::

</TabItem>
</Tabs>

### 安全存储

React Native 并未自带任何用于存储敏感数据的方式。不过，Android 和 iOS 平台已有现成的解决方案。

#### iOS - Keychain Services

[Keychain Services](https://developer.apple.com/documentation/security/keychain_services) 允许您为用户安全地存储小块敏感信息。这是存储证书、令牌、密码以及任何其他不适合放在 Async Storage 中的敏感信息的理想位置。

#### Android - 安全共享偏好设置

[Shared Preferences](https://developer.android.com/reference/android/content/SharedPreferences) 是 Android 中持久化键值数据存储的对应方案。**Shared Preferences 中的数据默认未加密**，但 [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) 封装了 Android 的 Shared Preferences 类，并自动加密键和值。

#### Android - Keystore

[Android Keystore](https://developer.android.com/training/articles/keystore) 系统允许您将加密密钥存储在容器中，从而更难从设备中提取。

为了使用 iOS Keychain services 或 Android 安全共享偏好设置，您可以自己编写桥接，或者使用一个为您封装它们并提供统一 API 的库，但需自行承担风险。可考虑的库包括：

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

:::warning[Caution]
**注意不要无意中存储或暴露敏感信息。** 这种情况可能会意外发生，例如将敏感表单数据保存到 redux 状态中，并将整个状态树持久化到 Async Storage。或者将用户令牌和个人信息发送到诸如 Sentry 或 Crashlytics 之类的应用监控服务。
:::

## 身份验证和深度链接

<img src="/docs/assets/d_security_deep-linking.svg" width={225} alt=" " style={{float: 'right', margin: '0 0 1em 1em'}} />

移动应用有一个在 web 中不存在的独特漏洞：**深度链接**。深度链接是一种从外部来源直接向原生应用发送数据的方式。深度链接看起来像 `app://`，其中 `app` 是您的应用 scheme，后面 `//` 之后的任何内容都可在内部用于处理请求。

例如，如果您正在构建一个电商应用，您可以使用 `app://products/1` 作为深度链接打开应用，并打开 id 为 1 的商品详情页。您可以把这类链接看作 web 上的 URL，但有一个关键区别：

深度链接并不安全，您绝不要在其中发送任何敏感信息。

深度链接不安全的原因是，没有集中式的方法来注册 URL scheme。作为应用开发者，您几乎可以使用任何您选择的 url scheme，只需在 iOS 中通过 [在 Xcode 中配置它](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app)，或在 Android 中通过 [添加 intent](https://developer.android.com/training/app-links/deep-linking)。

没有任何机制能阻止恶意应用通过注册相同的 scheme 来劫持您的深度链接，然后获取链接中包含的数据。发送类似 `app://products/1` 的内容并无害，但发送令牌则是一个安全隐患。

当操作系统在打开链接时有两个或更多应用可供选择时，Android 会向用户显示一个[消歧对话框](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog)，并让他们选择用哪个应用打开链接。然而在 iOS 上，操作系统会替您做出选择，因此用户会毫无察觉。Apple 在后续 iOS 版本（iOS 11）中已着手解决此问题，当时他们引入了先到先得的原则，不过这种漏洞仍可能以不同方式被利用，您可以在[这里](https://thehackernews.com/2019/07/ios-custom-url-scheme.html)了解更多。使用 [universal links](https://developer.apple.com/ios/universal-links/) 将允许在 iOS 中安全地链接到您应用内的内容。

### OAuth2 和重定向

OAuth2 身份验证协议如今极其流行，被誉为最完整、最安全的协议。OpenID Connect 协议也是基于它构建的。在 OAuth2 中，用户会被要求通过第三方进行身份验证。成功完成后，该第三方会将用户重定向回请求的应用，并携带一个验证代码，该代码可以交换为 JWT —— [JSON Web Token](https://jwt.io/introduction/)。JWT 是一种用于在 web 上安全传输各方之间信息的开放标准。

在 web 上，这一步重定向是安全的，因为 web 上的 URL 保证是唯一的。对于应用来说并非如此，因为如前所述，没有集中式的方法来注册 URL scheme！为了解决这一安全问题，必须以 PKCE 的形式添加额外检查。

[PKCE](https://oauth.net/2/pkce/)，发音为 “Pixy”，全称为 Proof of Key Code Exchange，是 OAuth 2 规范的扩展。它涉及增加一层额外的安全性，以验证身份验证请求和令牌交换请求来自同一个客户端。PKCE 使用 [SHA 256](https://www.movable-type.co.uk/scripts/sha256.html) 密码学哈希算法。SHA 256 会为任意大小的文本或文件创建唯一的“签名”，但它具有以下特性：

- 无论输入文件如何，长度始终相同
- 保证对相同输入始终产生相同结果
- 单向（也就是说，您无法逆向工程它来还原原始输入）

现在您有两个值：

- **code_verifier** - 由客户端生成的大型随机字符串
- **code_challenge** - code_verifier 的 SHA 256 值

在初始的 `/authorize` 请求期间，客户端还会发送其保存在内存中的 `code_verifier` 所对应的 `code_challenge`。在 authorize 请求正确返回后，客户端还会发送用于生成 `code_challenge` 的 `code_verifier`。然后 IDP 将计算 `code_challenge`，检查它是否与第一次 `/authorize` 请求时设置的值匹配，只有在这些值匹配时才会发送访问令牌。

这保证了只有触发初始授权流程的应用，才能成功地将验证代码交换为 JWT。因此，即使恶意应用获取了验证代码，它单独也毫无用处。要查看其实际效果，请查看[这个示例](https://aaronparecki.com/oauth-2-simplified/#mobile-apps)。

原生 OAuth 可考虑使用的库是 [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)。React-native-app-auth 是一个用于与 OAuth2 提供商通信的 SDK。它封装了原生的 [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) 和 [AppAuth-Android](https://github.com/openid/AppAuth-Android) 库，并且可以支持 PKCE。

:::note
`react-native-app-auth` 只有在您的 Identity Provider 支持 PKCE 时才能支持 PKCE。
:::

![OAuth2 with PKCE](/docs/assets/diagram_pkce.svg)

## 网络安全

你的 API 应始终使用 [SSL 加密](https://www.ssl.com/faqs/faq-what-is-ssl/)。SSL 加密可防止请求的数据在离开服务器后到到达客户端之前以明文形式被读取。你会知道该端点是安全的，因为它以 `https://` 开头，而不是 `http://`。

### SSL 证书绑定

使用 https 端点仍然可能使你的数据面临被拦截的风险。使用 https 时，只有当客户端能够提供由预先安装在客户端上的受信任证书颁发机构签名的有效证书时，客户端才会信任服务器。攻击者可以通过向用户设备安装恶意的根 CA 证书来利用这一点，这样客户端就会信任所有由攻击者签名的证书。因此，仅依赖证书仍可能使你面临 [中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 的风险。

**SSL 证书绑定** 是一种可在客户端侧使用的技术，用于避免这种攻击。它通过在开发期间将一组受信任证书嵌入（或绑定）到客户端中来工作，从而只有使用受信任证书之一签名的请求才会被接受，而任何自签名证书都不会被接受。

:::warning[注意]
使用 SSL 证书绑定时，你应注意证书过期问题。证书每 1-2 年会过期一次，一旦过期，就需要在应用中以及服务器上进行更新。一旦服务器上的证书更新，任何嵌入旧证书的应用都将停止工作。
:::

## 总结

没有一种万无一失的方法来处理安全问题，但只要有意识地努力并保持谨慎，就可以显著降低应用程序发生安全漏洞的可能性。应根据存储在应用程序中的数据敏感度、用户数量，以及黑客获取其账户访问权限后可能造成的损害，按比例投入安全措施。并且请记住：从一开始就没有被请求的信息，访问起来要困难得多。
