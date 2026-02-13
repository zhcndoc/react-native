---
title: '每月发布节奏：发布 12 月和 1 月的候选版本'
author: Eric Vicenti
authorTitle: Facebook 工程师
authorURL: 'https://twitter.com/EricVicenti'
authorImageURL: 'https://secure.gravatar.com/avatar/077ad5372b65567fe952a99f3b627048?s=128'
authorTwitter: EricVicenti
tags: [announcement]
---

在 React Native 推出不久后，我们开始每两周发布一次，以帮助社区采用新功能，同时保持版本的生产环境稳定。在 Facebook，我们必须每两周稳定代码库，以发布生产环境的 iOS 应用，因此我们决定以相同的节奏发布开源版本。现在，Facebook 的许多应用特别是在 Android 平台上每周都会发布一次。因为我们每周都从 master 分支发版，所以需要保持它的高度稳定。所以双周发布频率对于内部贡献者来说也不再有益。

我们经常听到社区反馈说发布速度难以跟上。像 [Expo](https://expo.io/) 这样的工具不得不跳过每隔一版，以应对快速的版本变化。因此很明显，双周发布并没有很好地服务社区。

### 现在改为每月发布

我们很高兴宣布新的每月发布节奏，以及 2016 年 12 月发布的版本 `v0.40`，该版本已经稳定了整整一个月，现在可以采用了。（只需要确保[在 iOS 上更新你原生模块的头文件](https://github.com/facebook/react-native/releases/tag/v0.40.0)）。

虽然发布时间可能会有几天的浮动以避免周末或处理不可预见的问题，但你现在可以期待每个月的第一个工作日可用发布版本，并在月底正式发布。

### 使用当月版本获得最佳支持

1 月的候选版本已准备好试用，你可以[在这里查看有哪些新内容](https://github.com/facebook/react-native/releases/tag/v0.41.0-rc.0)。

为了了解即将到来的变更并给 React Native 贡献者提供更好的反馈，尽可能总是使用当月的候选版本。到每个月月底正式版本发布时，包含的变更已经在 Facebook 生产环境应用中运行超过两周。

你可以用新的 [react-native-git-upgrade](/blog/2016/12/05/easier-upgrades) 命令轻松升级你的应用：

```
npm install -g react-native-git-upgrade
react-native-git-upgrade 0.41.0-rc.0
```

我们希望这种更简单的方法能让社区更轻松地跟踪 React Native 的变化，并尽快采用新版本！

（感谢 [Martin Konicek](https://github.com/mkonicek) 提出这个计划，感谢 [Mike Grabowski](https://github.com/grabbou) 促成其实现）