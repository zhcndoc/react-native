---
id: security
title: 安全
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

在构建应用时，安全性往往被忽视。确实，不可能构建完全固若金汤的软件——我们尚未发明出完全无法攻破的锁（毕竟，银行金库仍然会被偷袭）。然而，遭受恶意攻击或因安全漏洞暴露的概率，与您为保护应用而付出的努力成反比。虽然普通的挂锁易被撬开，但它仍然比柜钩难以突破！

<img src="/docs/assets/d_security_chart.svg" width={283} alt=" " style={{float: 'right'}} />

在本指南中，您将学习存储敏感信息、身份认证、网络安全以及帮助您保护应用的工具的最佳实践。这不是一个预检清单——而是一个选项目录，每个选项都将进一步保护您的应用和用户。

## 存储敏感信息

切勿将敏感的 API 密钥存储在应用代码中。任何包含在代码中的东西，任何查看应用包的人都可以以明文访问。像 [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) 和 [react-native-config](https://github.com/luggit/react-native-config/) 这样的工具非常适合添加特定环境的变量（如 API 端点），但它们不应与服务器端环境变量混淆，后者通常包含秘密和 API 密钥。

如果必须在应用中使用某个 API 密钥或密秘来访问资源，最安全的做法是构建一个在应用和资源之间的编排层。这个层可以是无服务器函数（例如使用 AWS Lambda 或 Google Cloud Functions），它可以携带所需的 API 密钥或密秘转发请求。服务器端代码中的秘密无法被 API 使用者像应用代码中的秘密那样访问。

**对于持久化的用户数据，应根据敏感性选择合适的存储类型。** 随着应用的使用，您经常会发现需要在设备上保存数据，可能是为了支持离线使用、减少网络请求，或在会话间保存用户的访问令牌，以免用户每次使用应用时都需重新认证。

:::info
**持久化与非持久化** — 持久化数据写入设备磁盘，这使得应用在启动后能读取该数据，无需再次发送网络请求或要求用户重新输入。但这也可能使数据更容易被攻击者访问。非持久化数据从不写入磁盘，因此不存在可访问的数据！
:::

### Async Storage

[Async Storage](https://github.com/react-native-async-storage/async-storage) 是 React Native 的社区维护模块，提供异步、不加密的键值存储。Async Storage 不会在应用之间共享：每个应用有自己的沙盒环境，无法访问其他应用的数据。

| **建议使用 Async Storage 的情况**             | **不建议用于 Async Storage 的情况** |
| -------------------------------------------- | ---------------------------------- |
| 跨应用运行存储非敏感数据                      | 令牌存储                         |
| 持久化 Redux 状态                             | 秘密信息                         |
| 持久化 GraphQL 状态                           |                                    |
| 存储全局应用范围变量                          |                                    |

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["web"])}>

<TabItem value="web">

:::note
Async Storage 是 React Native 中 Local Storage 的对应方案
:::

</TabItem>
</Tabs>

### 安全存储

React Native 本身不带有存储敏感数据的功能。不过，Android 和 iOS 平台上已有现成解决方案。

#### iOS - 钥匙串服务 (Keychain Services)

[钥匙串服务](https://developer.apple.com/documentation/security/keychain_services) 允许您为用户安全地存储小块敏感信息。这里是存储证书、令牌、密码及任何不适合放在 Async Storage 中的敏感信息的理想场所。

#### Android - 安全共享偏好设置 (Secure Shared Preferences)

[共享偏好设置](https://developer.android.com/reference/android/content/SharedPreferences) 是 Android 平台上持久化键值数据存储的对应方案。**共享偏好设置中的数据默认不加密**，而 [加密共享偏好设置](https://developer.android.com/topic/security/data) 封装了 Android 的 Shared Preferences 类，自动对键和值进行加密。

#### Android - 密钥库 (Keystore)

[Android 密钥库](https://developer.android.com/training/articles/keystore) 系统允许您将加密密钥存储在一个容器中，以使其更难从设备中提取。

要使用 iOS 钥匙串服务或 Android 安全共享偏好设置，您可以自行编写桥接代码，或者使用封装它们并提供统一 API 的库，风险自负。可考虑的库有：

- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [react-native-keychain](https://github.com/oblador/react-native-keychain)

:::warning[Caution]
**请注意不要无意中存储或暴露敏感信息。** 例如，这可能会意外发生，比如将敏感表单数据保存到 redux 状态中，并将整个状态树持久化到 Async Storage。或者将用户令牌和个人信息发送到 Sentry 或 Crashlytics 之类的应用监控服务。
:::

## 身份认证与深度链接

<img src="/docs/assets/d_security_deep-linking.svg" width={225} alt=" " style={{float: 'right', margin: '0 0 1em 1em'}} />

移动应用存在一种网页上不存在的独特安全隐患：**深度链接**。深度链接是指从外部来源直接发送数据给原生应用的方式。深度链接形式如 `app://`，其中 `app` 是您的应用方案，`//` 之后的内容可用来内部处理请求。

举例来说，如果您正在开发一个电商应用，使用 `app://products/1` 可深度链接到应用并打开 ID 为 1 的产品详情页。您可以把它类比为网页上的 URL，但有一个关键区别：

深度链接不安全，切勿在其中传递任何敏感信息。

深度链接不安全的原因是：没有集中式注册 URL 方案的方法。作为应用开发者，您几乎可以通过在 iOS 的 [Xcode 中配置](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app) 或在 Android 中 [添加 intent](https://developer.android.com/training/app-links/deep-linking) 使用任何 URL 方案。

这意味着恶意应用可以通过注册相同的方案来劫持您的深度链接，进而访问链接中包含的数据。像 `app://products/1` 这样的链接不会有害，但发送令牌则存在安全隐患。

当操作系统面临两个或更多应用可供选择来打开链接时，Android 会显示 [选择对话框](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog) 让用户选择打开链接的应用。iOS 则由操作系统决定，用户则无法感知。Apple 在 iOS 11 及以后版本中引入了“先注册先获得”的原则缓解此问题，但该漏洞仍可能被利用，详情可参见 [此处](https://thehackernews.com/2019/07/ios-custom-url-scheme.html)。使用 [通用链接（Universal Links）](https://developer.apple.com/ios/universal-links/) 可在 iOS 中安全地链接至应用内容。

### OAuth2 和重定向

OAuth2 认证协议现今非常流行，被誉为最全面且安全的协议。OpenID Connect 协议也是基于它。在 OAuth2 中，用户通过第三方进行认证。认证成功后，该第三方重定向回请求的应用，并附带一个可交换 JWT 的验证代码 —— 即 [JSON Web Token](https://jwt.io/introduction/)。JWT 是一种在互联网各方间安全传输信息的开放标准。

在网页端，这一重定向步骤是安全的，因为网页端的 URL 是唯一的。但应用中情况则非如此，正如前面提到的，没有集中式注册 URL 方案的方法！为解决这一安全问题，需要加入额外的检查机制，称为 PKCE。

[PKCE](https://oauth.net/2/pkce/)（发音「Pixy」）代表 Proof of Key Code Exchange，是 OAuth2 规范的扩展。它引入了额外的安全层，验证认证及令牌交换请求是否来自同一客户端。PKCE 使用了 [SHA 256](https://www.movable-type.co.uk/scripts/sha256.html) 加密哈希算法。SHA 256 为任意大小的文本或文件创建独特“签名”，且：

- 不论输入文件大小，结果长度始终相同
- 同一输入总产生相同结果
- 单向算法（无法逆向推出原始输入）

于是您获得两个值：

- **code_verifier** - 客户端生成的随机长字符串
- **code_challenge** - code_verifier 的 SHA 256 结果

在初始 `/authorize` 请求中，客户端一并发送了对应 `code_verifier` 的 `code_challenge`。认证成功后，客户端会发送用来生成 `code_challenge` 的 `code_verifier`。身份提供者会计算 `code_challenge`，核对是否与最初请求时的一致，且仅当匹配时才返回访问令牌。

这保证了只有触发最初认证流程的应用才能成功用验证代码换取 JWT。即便恶意应用截获了验证代码，单凭此代码也无用武之地。想看实例可参见 [此例子](https://aaronparecki.com/oauth-2-simplified/#mobile-apps)。

一个适合本地 OAuth 的库是 [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)。react-native-app-auth 是一个与 OAuth2 供应商交流的 SDK，封装了原生的 [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) 和 [AppAuth-Android](https://github.com/openid/AppAuth-Android) 库，支持 PKCE。

:::note
只有当您的身份提供者支持时，`react-native-app-auth` 才能支持 PKCE。
:::

![OAuth2 with PKCE](/docs/assets/diagram_pkce.svg)

## 网络安全

您的 API 应始终使用 [SSL 加密](https://www.ssl.com/faqs/faq-what-is-ssl/)。SSL 加密防止请求数据在从服务器发出至客户端接收前被明文读取。您可以通过端点以 `https://`（而非 `http://`）开头来判断其是否安全。

### SSL 固定（SSL Pinning）

使用 https 端点仍可能使数据易遭截取。在 https 中，客户端只有在服务器提供由预装在客户端的受信任证书颁发机构签名的有效证书时才会信任服务器。攻击者可能通过在用户设备安装恶意根 CA 证书，使客户端信任攻击者签署的所有证书。这意味着仅凭证书仍可能遭受[中间人攻击](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)。

**SSL 固定** 是客户端采用的一种避免此攻击的技术。它通过在开发阶段将一组受信任的证书嵌入（固定）到客户端，只接受带有受信任证书签名的请求，拒绝自签证书。

:::warning[Caution]
使用 SSL 固定时，您应当注意证书过期问题。证书每 1-2 年会过期一次，而一旦过期，就需要在应用和服务器上同时更新。只要服务器上的证书更新了，任何内嵌旧证书的应用都会停止工作。
:::

## 总结

没有万无一失的安全方案，但通过有意识的努力和严谨态度，可以大幅降低应用遭受安全攻击的可能性。安全投入应与应用中存储数据的敏感性、用户数量及黑客取得账户访问权限可能造成的损害成比例。请记住：根本不请求的数据，最难被访问。