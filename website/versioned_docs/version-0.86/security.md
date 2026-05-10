---
id: security
title: 安全
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在构建应用时，安全性常常被忽视。诚然，不可能构建出完全无法攻破的软件——毕竟，我们还没有发明出完全无法撬开的锁（银行金库终究还是会被攻破）。然而，遭受恶意攻击或暴露安全漏洞的可能性，与您愿意投入多少精力来保护应用免受此类事件影响，呈反比。虽然普通挂锁也可能被撬开，但要越过它仍然比打开柜门挂钩困难得多！

<img src="/docs/assets/d_security_chart.svg" width={283} alt=" " style={{float: 'right'}} />

在本指南中，您将了解有关存储敏感信息、身份验证、网络安全以及帮助您保护应用的工具的最佳实践。这不是一份起飞前检查清单——它是一份选项目录，其中每一项都将有助于进一步保护您的应用和用户。

## 存储敏感信息

切勿在应用代码中存储敏感 API 密钥。代码中包含的任何内容，都可能被查看应用 bundle 的任何人以明文形式访问。像 [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) 和 [react-native-config](https://github.com/luggit/react-native-config/) 这样的工具，非常适合添加与环境相关的变量，例如 API 端点，但不要将它们与服务端环境变量混淆，后者通常可能包含密钥和 API 密钥。

如果您必须拥有一个 API 密钥或秘密信息才能从应用中访问某些资源，那么最安全的处理方式是在您的应用和该资源之间构建一层编排层。这可以是一个无服务器函数（例如使用 AWS Lambda 或 Google Cloud Functions），它可以使用所需的 API 密钥或秘密信息转发请求。服务端代码中的秘密信息，无法像应用代码中的秘密信息那样被 API 使用者访问。

**对于持久化的用户数据，请根据其敏感程度选择合适的存储类型。** 随着应用的使用，您通常会发现需要将数据保存到设备上，无论是为了支持应用离线使用，减少网络请求，还是在会话之间保存用户的访问令牌，这样他们就不必在每次使用应用时都重新进行身份验证。

:::info
**持久化 vs 非持久化** —— 持久化数据会被写入设备磁盘，这使得应用可以在多次启动之间读取这些数据，而无需再次发起网络请求来获取它，或要求用户重新输入。但这也会使这些数据更容易被攻击者访问。非持久化数据从不写入磁盘——因此就没有可供访问的数据！
:::

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) 是一个由社区维护的 React Native 模块，提供异步、未加密的键值存储。Async Storage 不会在应用之间共享：每个应用都有自己的沙箱环境，无法访问其他应用的数据。

| **当...时使用 async storage** | **不要将 async storage 用于...** |
| --------------------------------------------- | ---------------------------------- |
| 持久化跨应用运行的非敏感数据 | 令牌存储                      |
| 持久化 Redux 状态                        | 密钥                            |
| 持久化 GraphQL 状态                      |                                    |
| 存储全局应用级变量             |                                    |

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::note
Async Storage 相当于 Web 端的 Local Storage
:::

</TabItem>
</Tabs>

### 安全存储

React Native 不附带任何用于存储敏感数据的方式。不过，Android 和 iOS 平台已有现成的解决方案。

#### iOS - Keychain Services

[Keychain Services](https://developer.apple.com/documentation/security/keychain_services) 允许您为用户安全地存储少量敏感信息。这是存储证书、令牌、密码以及其他不适合放入 Async Storage 的敏感信息的理想位置。

#### Android - 安全共享偏好设置

[Shared Preferences](https://developer.android.com/reference/android/content/SharedPreferences) 是 Android 中用于持久化键值数据存储的对应方案。**Shared Preferences 中的数据默认不会加密**，但 [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) 对 Android 的 Shared Preferences 类进行了封装，并会自动加密键和值。

#### Android - Keystore

[Android Keystore](https://developer.android.com/training/articles/keystore) 系统允许您将加密密钥存储在容器中，从而更难从设备中提取。

为了使用 iOS Keychain services 或 Android 安全共享偏好设置，您可以自行编写桥接，或者在自担风险的情况下使用一个为您封装它们并提供统一 API 的库。可考虑的库包括：

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

:::warning Caution
**请注意不要无意中存储或暴露敏感信息。** 例如，这可能会意外发生，比如将敏感表单数据保存到 redux 状态中，并将整个状态树持久化到 Async Storage；或者将用户令牌和个人信息发送到 Sentry 或 Crashlytics 之类的应用监控服务。
:::

## 身份验证与深度链接

<img src="/docs/assets/d_security_deep-linking.svg" width={225} alt=" " style={{float: 'right', margin: '0 0 1em 1em'}} />

移动应用有一个在 Web 中不存在的独特漏洞：**深度链接**。深度链接是一种从外部来源直接向原生应用发送数据的方式。深度链接看起来像 `app://`，其中 `app` 是您的应用 scheme，而 `//` 后面的任何内容都可在内部用于处理请求。

例如，如果您正在构建一个电商应用，您可以使用 `app://products/1` 通过深度链接打开您的应用，并打开 id 为 1 的商品详情页。您可以把这类链接理解为类似 Web 上的 URL，但有一个关键区别：

深度链接并不安全，您绝不能在其中发送任何敏感信息。

深度链接之所以不安全，是因为没有集中式的 URL scheme 注册机制。作为应用开发者，您几乎可以使用任何您选择的 url scheme，只需在 iOS 的 [Xcode 中进行配置](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app)，或在 Android 上 [添加一个 intent](https://developer.android.com/training/app-links/deep-linking)。

没有任何机制可以阻止恶意应用通过注册相同的 scheme 来劫持您的深度链接，然后获取链接中包含的数据。发送类似 `app://products/1` 的内容并无害处，但发送令牌则是一个安全隐患。

当操作系统在打开链接时有两个或更多应用可供选择，Android 会向用户显示一个 [歧义选择对话框](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog)，并让他们选择用于打开链接的应用。然而在 iOS 上，操作系统会替您做出选择，因此用户对此毫无察觉。Apple 在后续 iOS 版本（iOS 11）中采取了一些措施来解决这个问题，实行了先到先得的原则，不过这一漏洞仍可能以不同方式被利用，您可以在[这里](https://thehackernews.com/2019/07/ios-custom-url-scheme.html)了解更多。使用 [通用链接](https://developer.apple.com/ios/universal-links/) 将允许在 iOS 中安全地链接到应用内内容。

### OAuth2 与重定向

OAuth2 身份验证协议如今极其流行，被誉为目前最完整、最安全的协议。OpenID Connect 协议也是基于它构建的。在 OAuth2 中，用户会被要求通过第三方进行身份验证。成功完成后，第三方会重定向回请求应用，并附带一个可交换为 JWT 的验证码——即 [JSON Web Token](https://jwt.io/introduction/)。JWT 是一种用于在 Web 上安全传输各方之间信息的开放标准。

在 Web 上，这个重定向步骤是安全的，因为 Web 上的 URL 保证是唯一的。这在应用中并不成立，因为如前所述，没有集中式的 URL scheme 注册机制！为了应对这一安全问题，必须以 PKCE 的形式添加额外检查。

[PKCE](https://oauth.net/2/pkce/)，发音为 “Pixy”，全称为 Proof of Key Code Exchange，是 OAuth 2 规范的一个扩展。它通过增加额外一层安全机制，验证身份验证请求和令牌交换请求是否来自同一客户端。PKCE 使用 [SHA 256](https://www.movable-type.co.uk/scripts/sha256.html) 密码哈希算法。SHA 256 会为任意大小的文本或文件创建一个唯一的“签名”，但它具有以下特性：

- 无论输入文件如何，长度始终相同
- 保证对相同输入始终产生相同结果
- 单向（也就是说，您无法通过逆向工程还原出原始输入）

现在您有两个值：

- **code_verifier** - 由客户端生成的大随机字符串
- **code_challenge** - code_verifier 的 SHA 256 值

在初始的 `/authorize` 请求期间，客户端还会发送其保存在内存中的 `code_verifier` 对应的 `code_challenge`。在授权请求正确返回后，客户端还会发送用于生成 `code_challenge` 的 `code_verifier`。然后，IDP 将计算 `code_challenge`，检查它是否与最初 `/authorize` 请求中设置的值匹配，只有当这些值匹配时才会发送访问令牌。

这就确保了只有触发初始授权流程的应用，才能成功地将验证码交换为 JWT。因此，即使恶意应用获取了验证码，它本身也毫无用处。要查看实际效果，请查看[此示例](https://aaronparecki.com/oauth-2-simplified/#mobile-apps)。

原生 OAuth 可考虑使用的一个库是 [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)。React-native-app-auth 是一个用于与 OAuth2 提供方通信的 SDK。它封装了原生的 [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) 和 [AppAuth-Android](https://github.com/openid/AppAuth-Android) 库，并可以支持 PKCE。

:::note
只有在您的身份提供方支持 PKCE 的情况下，`react-native-app-auth` 才能支持 PKCE。
:::

![OAuth2 with PKCE](/docs/assets/diagram_pkce.svg)

## 网络安全

你的 API 应始终使用 [SSL 加密](https://www.ssl.com/faqs/faq-what-is-ssl/)。SSL 加密可防止请求的数据在离开服务器和到达客户端之间以明文形式被读取。你会知道该端点是安全的，因为它以 `https://` 开头，而不是 `http://`。

### SSL Pinning

使用 https 端点仍可能使你的数据容易遭到拦截。使用 https 时，只有当客户端能够提供一个由受信任的证书颁发机构签名、且已预装在客户端上的有效证书时，客户端才会信任服务器。攻击者可以通过在用户设备上安装恶意的根 CA 证书来利用这一点，这样客户端就会信任所有由攻击者签名的证书。因此，仅依赖证书本身仍可能使你面临 [中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) 的风险。

**SSL pinning** 是一种可在客户端侧使用的技术，用于避免这种攻击。它的工作方式是在开发期间将一组受信任的证书嵌入（或固定）到客户端中，这样只有使用受信任证书之一签名的请求才会被接受，而任何自签名证书都不会被接受。

:::warning 注意
在使用 SSL pinning 时，你应注意证书过期问题。证书每 1-2 年会过期一次，一旦过期，就需要在应用和服务器上同时更新。只要服务器上的证书已更新，任何嵌入了旧证书的应用都将停止工作。
:::

## 总结

没有一种万无一失的方法来处理安全问题，但只要有意识地努力并保持谨慎，就可以显著降低应用程序发生安全漏洞的可能性。应根据应用中存储数据的敏感程度、用户数量，以及黑客获取其账户访问权限后可能造成的损害，按比例投入安全防护。并且请记住：从一开始就不要请求那些本不需要的信息，会显著更难被获取。
