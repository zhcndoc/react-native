---
id: security
title: 安全
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

构建应用时，人们经常会忽略安全性。确实，不可能构建出完全无法攻破的软件——我们还没有发明出一把完全无法撬开的锁（毕竟，银行金库仍然会被闯入）。然而，成为恶意攻击受害者或因安全漏洞而暴露的概率，与您愿意投入保护应用免受此类风险影响的努力成反比。尽管普通挂锁可以被撬开，但它仍然比柜门挂钩难以突破得多！

<img src="/docs/assets/d_security_chart.svg" width={283} alt=" " style={{float: 'right'}} />

在本指南中，您将了解存储敏感信息、身份验证、网络安全方面的最佳实践，以及有助于保护应用的工具。这不是一份发布前检查清单，而是一份选项目录，其中的每一项都将进一步保护您的应用和用户。

## 存储敏感信息

永远不要在应用代码中存储敏感的 API 密钥。代码中包含的任何内容，都可能被检查应用程序包的任何人以纯文本形式访问。像 [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) 和 [react-native-config](https://github.com/luggit/react-native-config/) 这样的工具非常适合添加 API 端点等环境特定变量，但不要将它们与服务器端环境变量混淆，后者通常可能包含机密信息和 API 密钥。

如果您必须在应用中使用 API 密钥或机密信息来访问某些资源，那么最安全的处理方式是在应用与资源之间构建一个编排层。这可以是一个无服务器函数（例如使用 AWS Lambda 或 Google Cloud Functions），用于转发带有所需 API 密钥或机密信息的请求。服务器端代码中的机密信息无法像应用代码中的机密信息那样被 API 使用者访问。

**对于持久化用户数据，请根据其敏感程度选择正确的存储类型。** 随着应用的使用，您经常会发现需要在设备上保存数据，无论是为了支持应用离线使用、减少网络请求，还是在会话之间保存用户的访问令牌，这样用户每次使用应用时就不必重新进行身份验证。

:::info
**持久化数据与非持久化数据**——持久化数据会写入设备磁盘，这使得应用可以在多次启动之间读取这些数据，而无需再次发起网络请求来获取数据或要求用户重新输入。但这也可能使这些数据更容易被攻击者访问。非持久化数据永远不会写入磁盘——因此没有可供访问的数据！
:::

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) 是一个由社区维护的 React Native 模块，提供异步、未加密的键值存储。Async Storage 不会在应用之间共享：每个应用都有自己的沙盒环境，无法访问其他应用的数据。

| **在以下情况下使用 async storage** | **不要将 async storage 用于** |
| ---------------------------------- | ----------------------------- |
| 在多次运行应用之间持久化非敏感数据 | 存储令牌                      |
| 持久化 Redux 状态                  | 机密信息                      |
| 持久化 GraphQL 状态                |                               |
| 存储全局应用范围的变量             |                               |

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::note
Async Storage 相当于 Web 中的 Local Storage
:::

</TabItem>
</Tabs>

### 安全存储

React Native 没有内置任何存储敏感数据的方式。不过，Android 和 iOS 平台都有现成的解决方案。

#### iOS - Keychain Services

[Keychain Services](https://developer.apple.com/documentation/security/keychain_services) 允许您为用户安全地存储少量敏感信息。这是存储证书、令牌、密码以及其他不应存放在 Async Storage 中的敏感信息的理想位置。

#### Android - Secure Shared Preferences

[Shared Preferences](https://developer.android.com/reference/android/content/SharedPreferences) 是 Android 中用于持久化键值数据存储的对应方案。**Shared Preferences 中的数据默认不会加密**，但 [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) 为 Android 封装了 Shared Preferences 类，并自动加密键和值。

#### Android - Keystore

[Android Keystore](https://developer.android.com/training/articles/keystore) 系统允许您将加密密钥存储在容器中，从而增加从设备中提取密钥的难度。

要使用 iOS Keychain services 或 Android Secure Shared Preferences，您可以自行编写桥接，也可以使用封装它们并提供统一 API 的库，但风险需自行承担。以下是一些可以考虑的库：

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

:::warning[注意]
**请注意不要无意中存储或暴露敏感信息。** 例如，可能会意外地将敏感表单数据保存到 redux 状态中，并将整个状态树持久化到 Async Storage。或者将用户令牌和个人信息发送到 Sentry 或 Crashlytics 等应用监控服务。
:::

## 身份验证与深层链接

<img src="/docs/assets/d_security_deep-linking.svg" width={225} alt=" " style={{float: 'right', margin: '0 0 1em 1em'}} />

移动应用存在一种 Web 中不存在的独特漏洞：**深层链接**。深层链接是一种从外部来源直接向原生应用发送数据的方式。深层链接的形式类似于 `app://`，其中 `app` 是您的应用方案，`//` 后面的任何内容都可以在内部用于处理请求。

例如，如果您正在构建一个电子商务应用，可以使用 `app://products/1` 深层链接到应用，并打开 id 为 1 的产品详情页。您可以将这类链接看作 Web 上的 URL，但有一个关键区别：

深层链接并不安全，您绝不应该在其中发送任何敏感信息。

深层链接不安全的原因在于，没有集中式的方法来注册 URL 方案。作为应用开发者，您可以通过在 iOS 中[配置 Xcode](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app)，或在 Android 中[添加 intent](https://developer.android.com/training/app-links/deep-linking)，来使用几乎任意的 URL 方案。

没有任何机制可以阻止恶意应用劫持您的深层链接：它也可以注册相同的方案，从而获取链接中包含的数据。发送类似 `app://products/1` 的内容没有危害，但发送令牌则会带来安全问题。

当操作系统在打开链接时有两个或更多应用可供选择，Android 会向用户显示一个[消歧对话框](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog)，要求用户选择用于打开链接的应用。然而在 iOS 上，操作系统会替用户做出选择，因此用户对此毫不知情。Apple 在后续的 iOS 版本（iOS 11）中采取了措施来解决这个问题，实行了先到先得原则，但这种漏洞仍可能通过不同方式被利用，您可以[在此处](https://thehackernews.com/2019/07/ios-custom-url-scheme.html)了解更多信息。使用[通用链接](https://developer.apple.com/ios/universal-links/)可以在 iOS 中安全地链接到应用内的内容。

### OAuth2 与重定向

OAuth2 身份验证协议如今非常流行，被誉为最完整、最安全的协议。OpenID Connect 协议也是基于此构建的。在 OAuth2 中，系统会要求用户通过第三方进行身份验证。成功完成后，该第三方会将用户重定向回请求应用，并附带一个验证码，该验证码可以交换为 JWT——即 [JSON Web Token](https://jwt.io/introduction/)。JWT 是一种用于在 Web 上的各方之间安全传输信息的开放标准。

在 Web 上，这个重定向步骤是安全的，因为 Web 上的 URL 保证是唯一的。但应用并非如此，因为正如前面所述，没有集中式的方法来注册 URL 方案！为了解决这一安全问题，必须通过 PKCE 的形式添加额外检查。

[PKCE](https://oauth.net/2/pkce/) 的读音为“Pixy”，代表 Proof of Key Code Exchange，是 OAuth 2 规范的扩展。它通过增加一层安全机制来验证身份验证请求和令牌交换请求是否来自同一个客户端。PKCE 使用 [SHA 256](https://www.movable-type.co.uk/scripts/sha256.html) 加密哈希算法。SHA 256 会为任意大小的文本或文件创建唯一的“签名”，但它具有以下特点：

- 无论输入文件如何，长度始终相同
- 对于相同的输入，始终保证生成相同的结果
- 单向（也就是说，无法通过逆向工程将其还原为原始输入）

现在您有两个值：

- **code_verifier** - 由客户端生成的大型随机字符串
- **code_challenge** - code_verifier 的 SHA 256 值

在初始的 `/authorize` 请求期间，客户端还会发送它保存在内存中的 `code_verifier` 所对应的 `code_challenge`。authorize 请求正确返回后，客户端还会发送用于生成 `code_challenge` 的 `code_verifier`。随后，IDP 会计算 `code_challenge`，检查它是否与第一次 `/authorize` 请求中设置的值匹配，只有在值匹配时才发送访问令牌。

这保证了只有触发初始授权流程的应用才能成功将验证码交换为 JWT。因此，即使恶意应用获取了验证码，该验证码单独使用也毫无用处。要查看实际效果，请参阅[此示例](https://aaronparecki.com/oauth-2-simplified/#mobile-apps)。

对于原生 OAuth，可以考虑使用 [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)。React-native-app-auth 是一个用于与 OAuth2 提供商通信的 SDK。它封装了原生的 [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) 和 [AppAuth-Android](https://github.com/openid/AppAuth-Android) 库，并支持 PKCE。

:::note
`react-native-app-auth` 只有在您的 Identity Provider 支持 PKCE 时才能支持 PKCE。
:::

![OAuth2 with PKCE](/docs/assets/diagram_pkce.svg)

## 网络安全

您的 API 应始终使用 [SSL 加密](https://www.ssl.com/faqs/faq-what-is-ssl/)。SSL 加密可以防止请求的数据在离开服务器后、到达客户端之前以纯文本形式被读取。您可以通过端点以 `https://` 而不是 `http://` 开头来判断其是否安全。

### SSL 固定

使用 https 端点仍可能使您的数据面临被拦截的风险。在 https 中，只有当服务器能够提供由预安装在客户端上的受信任证书颁发机构签名的有效证书时，客户端才会信任该服务器。攻击者可能通过在用户设备上安装恶意根 CA 证书来利用这一点，这样客户端就会信任攻击者签名的所有证书。因此，仅依赖证书仍可能使您容易受到[中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)。

**SSL 固定**是一种可在客户端使用以避免此类攻击的技术。它的工作方式是在开发期间将受信任证书列表嵌入（或固定）到客户端中，因此只有使用受信任证书之一签名的请求才会被接受，而自签名证书则不会被接受。

:::warning[注意]
使用 SSL 固定时，您应注意证书过期问题。证书每 1-2 年过期一次，过期后，需要同时在应用和服务器上进行更新。服务器上的证书一旦更新，任何嵌入旧证书的应用都将停止工作。
:::

## 总结

没有一种万无一失的安全处理方式，但通过有意识的努力和严谨的执行，可以显著降低应用发生安全漏洞的可能性。应根据应用中存储数据的敏感程度、用户数量以及黑客获得用户账户访问权限后可能造成的损害，投入相应程度的安全措施。还请记住：从一开始就从未请求过的信息，要难以访问得多。
