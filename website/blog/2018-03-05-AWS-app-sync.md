---
title: 在 React Native 中使用 AWS
author: Richard Threlkeld
authorTitle: AWS Mobile 高级技术产品经理
authorURL: 'https://twitter.com/undef_obj'
authorImageURL: 'https://pbs.twimg.com/profile_images/811239086581227520/APX1eZwF_400x400.jpg'
authorTwitter: undef_obj
tags: [engineering]
---

AWS 在技术行业中以提供云服务著称。这些服务包括计算、存储和数据库技术，以及全托管的无服务器产品。AWS Mobile 团队一直与客户和 JavaScript 生态系统的成员紧密合作，致力于使云连接的移动和 Web 应用更安全、可扩展，并且更易于开发和部署。我们一开始提供了一个[完整的入门套件](https://github.com/awslabs/aws-mobile-react-native-starter)，随后又推出了一些新的发展。

本文介绍了 React 和 React Native 开发者可能感兴趣的一些内容：

- [**AWS Amplify**](https://github.com/aws/aws-amplify)：一个为使用云服务的 JavaScript 应用设计的声明式库
- [**AWS AppSync**](https://aws.amazon.com/appsync/)：一个具备离线和实时功能的全托管 GraphQL 服务

## AWS Amplify

使用 Create React Native App 和 Expo 等工具，启动 React Native 应用非常简单。然而，将其连接到云端时，尝试将具体用例映射到基础设施服务可能会较为复杂。例如，您的 React Native 应用可能需要上传照片。这些照片是否需要按用户保护？那很可能意味着您需要某种注册或登录流程。您是想使用自己的用户目录，还是使用社交媒体提供商？可能您的应用还需要在用户登录后调用带有自定义业务逻辑的 API。

为帮助 JavaScript 开发者解决这些问题，我们发布了名为 AWS Amplify 的库。其设计被划分为“类别”，而非 AWS 特定实现。例如，如果您希望用户注册、登录然后上传私有照片，只需将 `Auth` 和 `Storage` 类别引入到应用中：

```js
import { Auth } from 'aws-amplify';

Auth.signIn(username, password)
    .then(user => console.log(user))
    .catch(err => console.log(err));

Auth.confirmSignIn(user, code)
    .then(data => console.log(data))
    .catch(err => console.log(err));
```

上面的代码展示了 Amplify 在一些常见任务上的帮助，比如使用多因素认证 (MFA) 码（通过电子邮件或短信）。目前支持的类别包括：

- **Auth**：提供凭证自动化。开箱即用实现使用 AWS 凭证进行签名，并通过 [Amazon Cognito](https://aws.amazon.com/cognito/) 的 OIDC JWT 令牌。支持诸如 MFA 之类的常用功能。
- **Analytics**：只需一行代码，即可在 [Amazon Pinpoint](https://aws.amazon.com/pinpoint/) 跟踪已认证或未认证的用户。可根据需求扩展自定义指标或属性。
- **API**：以安全方式提供与 RESTful API 的交互，利用 [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)。该模块非常适合使用 [Amazon API Gateway](https://aws.amazon.com/api-gateway/) 的无服务器基础设施。
- **Storage**：简化命令上传、下载和列出 [Amazon S3](https://aws.amazon.com/s3/) 中的内容。还可根据用户将数据分组为公共或私有内容。
- **Caching**：跨 Web 应用和 React Native 的 LRU 缓存接口，使用特定实现的持久化。
- **i18n 和 Logging**：提供国际化和本地化功能，以及调试和日志功能。

Amplify 的一个优点是，它在设计中为您的特定编程环境编码了“最佳实践”。例如，我们与客户及 React Native 开发者合作时发现，开发阶段为快速实现功能所选的捷径往往会最终进入生产环境。这可能会影响扩展性或安全性，并迫使进行基础设施重构和代码重写。

帮助开发者避免此类问题的一个例子是 [基于 AWS Lambda 的无服务器参考架构](https://www.allthingsdistributed.com/2016/06/aws-lambda-serverless-reference-architectures.html)。它展示了结合使用 Amazon API Gateway 和 AWS Lambda 构建后端的最佳实践模式。该模式被编码进 Amplify 的 `API` 类别中。您可以使用这一模式与多个 REST 端点交互，并将请求头传递给 Lambda 函数以实现自定义业务逻辑。我们还发布了一个 [AWS Mobile CLI](https://docs.aws.amazon.com/aws-mobile/latest/developerguide/react-native-getting-started.html)，方便快速为新的或现有的 React Native 项目引入这些功能。入门只需通过 **npm** 安装并按照配置提示进行：

```bash
npm install --global awsmobile-cli
awsmobile configure
```

另一个与移动生态系统相关的最佳实践示例是密码安全。默认的 `Auth` 类别实现利用 Amazon Cognito 用户池进行用户注册和登录。该服务采用[安全远程密码协议](https://srp.stanford.edu) 来保护用户身份验证过程。如果您有兴趣阅读该[协议的数学原理](https://srp.stanford.edu/ndss.html#SECTION00032200000000000000)，您会发现计算密码验证器时必须使用一个大素数来生成一个群。在 React Native 环境中，[JIT 被禁用](/docs/javascript-environment)，这使得进行类似安全操作所需的大整数计算性能较低。为此，我们发布了适用于 Android 和 iOS 的本地桥接，您可在项目中链接：

```bash
npm install --save aws-amplify-react-native
react-native link amazon-cognito-identity-js
```

此外，我们很高兴看到 Expo 团队已在其[最新 SDK](https://blog.expo.io/expo-sdk-v25-0-0-is-now-available-714d10a8c3f7)中包含了这点，您可以无需弹出（eject）即可使用 Amplify。

最后，针对 React Native（及 React）开发，Amplify 提供了 [高阶组件 (HOCs)](https://reactjs.org/docs/higher-order-components.html)，方便包裹功能，例如对应用进行注册和登录：

```js
import Amplify, { withAuthenticator } from 'aws-amplify-react-native';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

class App extends React.Component {
...
}

export default withAuthenticator(App);
```

底层组件也提供为 `<Authenticator />`，允许您完全自定义 UI。它还提供了用于管理用户状态（如是否已登录或等待 MFA 确认）以及状态变化时可触发回调的属性。

同样，您还会找到通用的 React 组件，可用于各种用例。您可以根据需求自定义，例如展示来自 `Storage` 模块中 Amazon S3 的所有私有图片：

```jsx
<S3Album
  level="private"
  path={path}
  filter={(item) => /jpg/i.test(item.path)} />
```

如前所示，您可通过属性控制组件的许多功能，包括公共或私有存储选项。甚至提供了用户与某些 UI 组件交互时自动收集分析数据的能力：

```jsx
return <S3Album track/>
```

AWS Amplify 推崇约定优于配置的开发风格，支持全局初始化或按类别级别初始化。最快速的入门方式是使用一个 [aws-exports 文件](https://aws.amazon.com/blogs/mobile/enhanced-javascript-development-with-aws-mobile-hub/)。不过开发者也可以独立地使用该库与已有资源协作。

想深入了解其设计理念及完整演示，请参阅 [AWS re:Invent 的相关视频](https://www.youtube.com/watch?v=vAjf3lyjf8c)。

## AWS AppSync

在 AWS Amplify 发布不久后，我们还推出了 [AWS AppSync](https://aws.amazon.com/appsync/)。这是一项具备离线和实时能力的全托管 GraphQL 服务。虽然 GraphQL 可用于多种客户端语言（包括原生 Android 和 iOS），但它在 React Native 开发者中非常受欢迎，因为数据模型非常符合单向数据流和组件层次结构。

AWS AppSync 使您能够连接到自己 AWS 账户中的资源，意味着数据归您所有且您能完全控制。这通过使用数据源实现，服务支持 [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)、[Amazon Elasticsearch](https://aws.amazon.com/elasticsearch-service/) 和 [AWS Lambda](https://aws.amazon.com/lambda/)。这使得您可以在单一 GraphQL API 模式下结合使用多种功能（如 NoSQL 和全文搜索）。AppSync 还[支持从模式自动配置资源](https://docs.aws.amazon.com/appsync/latest/devguide/provision-from-schema.html)，如果您不熟悉 AWS 服务，只需编写 GraphQL SDL，点击按钮即可自动完成构建。

AWS AppSync 的实时功能通过[使用熟知的事件驱动模式的 GraphQL 订阅](https://graphql.org/blog/subscriptions-in-graphql-and-relay/)实现。由于 AWS AppSync 的订阅[受 GraphQL 模式中的指令控制](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html)，且模式可以使用任意数据源，这意味着您可以基于 Amazon DynamoDB 和 Amazon Elasticsearch 服务的数据库操作，或基于 AWS Lambda 的其他基础设施触发通知。

类似于 AWS Amplify，您可以在 AWS AppSync 的 GraphQL API 上使用[企业级安全功能](https://docs.aws.amazon.com/appsync/latest/devguide/security.html)。该服务允许通过 API 密钥快速启动，但生产环境下可以转而使用 AWS 身份和访问管理 (IAM) 或来自 Amazon Cognito 用户池的 OIDC 令牌。您可以通过类型策略在解析器层级控制访问，甚至可以在运行时进行逻辑检查，实现[细粒度访问控制](https://docs.aws.amazon.com/appsync/latest/devguide/security.html#fine-grained-access-control)（例如检测用户是否为特定数据库资源的所有者）。此外，还支持基于组成员资格来执行解析器或访问单个数据库记录的权限控制。

为了帮助 React Native 开发者更好地了解这些技术，AWS AppSync 控制台首页内置了一个[GraphQL 示例模式](https://docs.aws.amazon.com/appsync/latest/devguide/quickstart.html)。该示例会自动部署 GraphQL 模式，配置数据库表，并连接查询、变更和订阅。另有一个基于此内置模式的功能齐全的[AWS AppSync React Native 示例](https://github.com/aws-samples/aws-mobile-appsync-events-starter-react-native)（以及[React 示例](https://github.com/aws-samples/aws-mobile-appsync-events-starter-react)），可助您在数分钟内启动客户端和云端组件。

使用 `AWSAppSyncClient` 启动十分简单，它集成于 [Apollo Client](https://github.com/apollographql/apollo-client)。`AWSAppSyncClient` 负责 GraphQL API 的安全性和签名、离线功能，以及订阅的握手和协商过程：

```js
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";

const client = new AWSAppSyncClient({
  url: awsconfig.graphqlEndpoint,
  region: awsconfig.region,
  auth: {type: AUTH_TYPE.API_KEY, apiKey: awsconfig.apiKey}
});
```

AppSync 控制台提供可下载的配置文件，包含您的 GraphQL 端点、AWS 区域和 API 密钥。您接着可以将客户端与[React Apollo](https://github.com/apollographql/react-apollo)一同使用：

```jsx
const WithProvider = () => (
  <ApolloProvider client={client}>
      <Rehydrated>
          <App />
      </Rehydrated>
  </ApolloProvider>
);
```

此时，您可以使用标准 GraphQL 查询：

```graphql
query ListEvents {
    listEvents{
      items{
        __typename
        id
        name
        where
        when
        description
        comments{
          __typename
          items{
            __typename
            eventId
            commentId
            content
            createdAt
          }
          nextToken
        }
      }
    }
}
```

上例展示了 AppSync 提供的示例应用模式中的查询。它不仅展示了与 DynamoDB 的交互，还包含了数据分页（包括加密令牌）以及 `Events` 和 `Comments` 之间的类型关系。由于应用已配置 `AWSAppSyncClient`，数据会自动离线持久化，并在设备重新连接时同步。

您可以观看[此视频，深入了解其客户端技术及 React Native 演示](https://www.youtube.com/watch?v=FtkVlIal_m0)。

<iframe
  width="560"
  height="315"
  src="https://www.youtube-nocookie.com/embed/FtkVlIal_m0?rel=0"
  frameborder="0"
  allow="autoplay; encrypted-media"
  allowfullscreen></iframe>

## 反馈

这些库背后的团队期待听到您对它们的使用体验反馈。他们也希望了解还能做些什么，以便让使用云服务的 React 和 React Native 开发更简单。请通过 GitHub 联系 AWS Mobile 团队，相关项目为 [AWS Amplify](https://github.com/aws/aws-amplify) 和 [AWS AppSync](https://github.com/aws-samples/aws-mobile-appsync-events-starter-react-native)。