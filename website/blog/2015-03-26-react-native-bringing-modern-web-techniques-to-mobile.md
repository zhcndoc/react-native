---
title: 'React Native：将现代网页技术引入移动端'
author: Tom Occhino
authorTitle: Facebook 工程经理
authorURL: 'https://github.com/tomocchino'
authorImageURL: 'https://avatars0.githubusercontent.com/u/13947?v=3&s=460'
authorTwitter: tomocchino
hero: '/blog/assets/dark-hero.png'
tags: [announcement]
---

我们在两年前向世界介绍了[React](https://code.facebook.com/projects/176988925806765/react/)，此后它在 Facebook 内外都取得了令人瞩目的增长。如今，虽然没人被强制使用它，但 Facebook 上的新网页项目通常会以某种形式使用 React，并且它正在业界被广泛采用。工程师们每天选择使用 React，是因为它让他们能更多地专注于产品，而不是花费大量时间与框架“斗争”。不过，直到我们使用 React 开发了一段时间之后，才真正理解它为何如此强大。

React 强制我们将应用拆分为离散的组件，每个组件表示一个单独的视图。这些组件让我们更容易迭代产品，因为修改某一部分时无需在脑中保持整个系统的全貌。但更重要的是，React 用声明式的方式包装了 DOM 的变异式、命令式 API，这提升了抽象层次，简化了编程模型。我们的发现是，使用 React 开发时，代码更加可预测。这种可预测性让我们能更有信心快速迭代，也让应用变得更加可靠。此外，使用 React 构建应用不仅更易于扩展，我们还发现团队规模的扩展也更为便捷。

结合网页的快速迭代周期，我们用 React 构建了一些很棒的产品，包括 Facebook.com 的许多组件。此外，我们基于 React 构建了强大的 JavaScript 框架，比如 [Relay](https://reactjs.org/blog/2015/02/20/introducing-relay-and-graphql.html)，它能够大幅简化大规模数据获取。当然，网页只是故事的一部分。Facebook 还有广泛使用的 Android 和 iOS 应用，它们基于彼此独立且封闭的技术栈构建。在多个平台之上进行应用开发，使我们的工程组织分裂开来，但这只是移动原生应用开发难点之一。

<footer>
  <a
    href="https://code.facebook.com/posts/1014532261909640/react-native-bringing-modern-web-techniques-to-mobile/"
    className="btn">阅读全文</a>
</footer>

> 以上为节选。请在[Facebook Code](https://code.facebook.com/posts/1014532261909640/react-native-bringing-modern-web-techniques-to-mobile/)阅读完整文章。