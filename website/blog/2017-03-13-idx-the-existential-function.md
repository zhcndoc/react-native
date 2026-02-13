---
title: 'idx：存在性函数'
author: Timothy Yung
authorTitle: Facebook 工程经理
authorURL: 'https://github.com/yungsters'
authorImageURL: 'https://pbs.twimg.com/profile_images/1592444107/image.jpg'
authorTwitter: yungsters
tags: [engineering]
---

在 Facebook，我们经常需要访问通过 GraphQL 获取的数据结构中深层嵌套的值。在访问这些深层嵌套值的过程中，一个或多个中间字段通常是可空的。这些中间字段可能为 null 的原因有很多，比如隐私检查失败，或者仅仅因为 null 是表示非致命错误的最灵活方式。

不幸的是，当前访问这些深层嵌套值非常繁琐且冗长。

```jsx
props.user &&
  props.user.friends &&
  props.user.friends[0] &&
  props.user.friends[0].friends;
```

有一个[ECMAScript 提案引入存在性运算符](https://github.com/claudepache/es-optional-chaining)，它将使这件事变得更加方便。但在该提案最终确定之前，我们需要一个解决方案来提升生活质量，保持现有语言语义，并鼓励使用 Flow 进行类型安全。

我们想出了一个叫做 `idx` 的存在性_函数_。

```jsx
idx(props, _ => _.user.friends[0].friends);
```

这段代码中的调用行为类似于上面代码段中的布尔表达式，但重复显著减少。`idx` 函数恰好接收两个参数：

- 任何值，通常是一个对象或数组，你希望从中访问嵌套值。
- 一个函数，接收第一个参数并访问其上的嵌套值。

理论上，`idx` 函数会利用 try-catch 捕获访问 null 或 undefined 属性时产生的错误。如果捕获到此类错误，它将返回 null 或 undefined。（你可以查看它的实现方式：[idx.js](https://github.com/facebookincubator/idx/blob/master/packages/idx/src/idx.js)）

实际上，每次访问嵌套属性都用 try-catch 非常慢，并且区分特定类型的 TypeError 也很脆弱。为了解决这些不足，我们创建了一个 Babel 插件，将上述 `idx` 调用转换成以下表达式：

```jsx
props.user == null
  ? props.user
  : props.user.friends == null
    ? props.user.friends
    : props.user.friends[0] == null
      ? props.user.friends[0]
      : props.user.friends[0].friends;
```

最后，我们为 `idx` 添加了自定义的 Flow 类型声明，允许在第二个参数中的遍历进行正确的类型检查，同时支持对可空属性的嵌套访问。

该函数、Babel 插件和 Flow 类型声明现在都[托管在 GitHub 上](https://github.com/facebookincubator/idx)，使用时安装 **idx** 和 **babel-plugin-idx** npm 包，并在 `.babelrc` 文件中的插件列表中添加 “idx” 即可。