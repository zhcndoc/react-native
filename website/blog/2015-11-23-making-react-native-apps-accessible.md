---
title: 让 React Native 应用支持无障碍功能
author: Georgiy Kassabli
authorTitle: Facebook 软件工程师
authorURL: 'https://www.facebook.com/georgiy.kassabli'
authorImageURL: 'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/c0.0.160.160/p160x160/1978838_795592927136196_1205041943_n.jpg?_nc_log=1&oh=d7a500fdece1250955a4d27b0a80fee2&oe=59E8165A'
hero: '/blog/assets/blue-hero.png'
tags: [engineering]
---

随着 React 在网页端和 React Native 在移动端的推出，我们为开发者提供了一个全新的前端框架以构建产品。构建一个强健产品的关键之一是确保任何人都能使用它，包括视力障碍或其他残疾人士。React 和 React Native 的无障碍 API 使您能够让任何基于 React 的体验为可能使用辅助技术的人所用，比如盲人和视障者使用的屏幕阅读器。

在本文中，我们将重点介绍 React Native 应用。我们设计的 React 无障碍 API 与 Android 和 iOS 的 API 看起来和感觉上都相似。如果你之前为 Android、iOS 或网页开发过无障碍应用，你应该会对 React AX API 的框架和命名感到熟悉。例如，你可以让一个 UI 元素 _accessible_（因此它能被辅助技术访问），并使用 _accessibilityLabel_ 来为该元素提供一个字符串描述：

```
<View accessible={true} accessibilityLabel=”这是一个简单视图”>
```

让我们通过看看 Facebook 自家的一个基于 React 的产品 —— **广告管理器应用** 来演示 React AX API 更加复杂的应用场景。

<footer>
  <a
    href="https://code.facebook.com/posts/435862739941212/making-react-native-apps-accessible/"
    className="btn">阅读更多</a>
</footer>

> 这是节选内容。阅读全文请访问 [Facebook Code](https://code.facebook.com/posts/435862739941212/making-react-native-apps-accessible/)。