---
title: 深入探讨 React Native 性能
author: Pieter De Baets
authorTitle: Facebook 软件工程师
authorURL: 'https://github.com/javache'
authorImageURL: 'https://avatars1.githubusercontent.com/u/5676?v=3&s=460'
authorTwitter: javache
tags: [engineering]
---

React Native 允许你使用 JavaScript 结合 React 和 Relay 的声明式编程模型构建 Android 和 iOS 应用。这带来了代码更简洁、更易理解；无需编译周期即可快速迭代；以及跨多个平台轻松共享代码。你可以更快发布，专注于真正重要的细节，让你的应用看起来和使用起来都非常出色。优化性能是其中的重要环节。这里讲述了我们如何让 React Native 应用启动速度提升一倍的故事。

## 为什么要加快速度？

应用运行更快，内容加载更快，意味着用户有更多时间与应用互动，流畅的动画让应用使用体验更加愉悦。在新兴市场，比如绝大多数用户使用的是[2011年款手机](https://code.facebook.com/posts/952628711437136/classes-performance-and-network-segmentation-on-android/)并连结于[2G网络](https://newsroom.fb.com/news/2015/10/news-feed-fyi-building-for-all-connectivity/)，性能优化往往决定了应用是能用还是几乎无法使用。

自从 React Native 在[iOS](https://reactjs.org/blog/2015/03/26/introducing-react-native.html) 和[Android](https://code.facebook.com/posts/1189117404435352/react-native-for-android-how-we-built-the-first-cross-platform-react-native-app/) 平台发布以来，我们一直在提升列表视图滚动性能、内存效率、界面响应速度和应用启动时间。启动时间决定了应用的第一印象，并且考验框架的各个部分，因此是最有价值且最具挑战性的问题。

<footer>
  <a
    href="https://code.facebook.com/posts/895897210527114/dive-into-react-native-performance/"
    className="btn">阅读全文</a>
</footer>

> 以上为节选内容。请在[Facebook Code](https://code.facebook.com/posts/895897210527114/dive-into-react-native-performance/)阅读完整文章。